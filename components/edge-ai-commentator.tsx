'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, Play, Pause, Radio } from 'lucide-react';
import { stadiumAudio } from '../lib/sound-synthesizer';
import { stadiumBroadcastAudio } from '../lib/stadium-broadcast-audio-engine';
import { primeNaijaVoices } from '../lib/naija-voice-engine';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { useTranslation } from '../lib/translation-engine';
import { MatchData } from '../lib/sports-api';

interface LiveCommentaryProps {
  match?: MatchData;
  homeTeam?: string;
  awayTeam?: string;
  status?: 'LIVE' | 'SCHEDULED' | 'FINISHED';
  matchTime?: string;
}

export const EdgeAiCommentator: React.FC<LiveCommentaryProps> = ({
  match,
  homeTeam = '',
  awayTeam = '',
  status = 'SCHEDULED',
  matchTime = '19:00',
}) => {
  const { t } = useTranslation();
  const resolvedHome = match?.homeTeam || homeTeam;
  const resolvedAway = match?.awayTeam || awayTeam;
  const resolvedStatus = match?.status || status;
  const resolvedTime = match?.matchTime || matchTime;

  const isUpcoming = resolvedStatus === 'SCHEDULED';
  const isLive = resolvedStatus === 'LIVE';
  const isFinished = resolvedStatus === 'FINISHED';

  const [activeAudioChannel, setActiveAudioChannel] = useState<'NONE' | 'ENGLISH' | 'PIDGIN'>('NONE');
  const [selectedLocalLang, setSelectedLocalLang] = useState<string>('pidgin');
  const [isBroadcastPaused, setIsBroadcastPaused] = useState<boolean>(false);
  const [broadcastClock, setBroadcastClock] = useState<string>(resolvedTime || '19:00');

  useEffect(() => {
    primeNaijaVoices();
  }, []);

  const handleToggleEnglish = () => {
    phoneHardware.triggerHaptic('SUCCESS');
    try { stadiumAudio.enableOnUserClick(); } catch (e) {}

    if (activeAudioChannel !== 'ENGLISH') {
      setActiveAudioChannel('ENGLISH');
      setIsBroadcastPaused(false);
      stadiumBroadcastAudio.startEnglishBroadcast(
        resolvedHome,
        resolvedAway,
        isUpcoming ? 0 : 64,
        (timeStr) => setBroadcastClock(timeStr)
      );
    } else if (!isBroadcastPaused) {
      setIsBroadcastPaused(true);
      stadiumBroadcastAudio.pauseBroadcast();
    } else {
      setIsBroadcastPaused(false);
      stadiumBroadcastAudio.resumeBroadcast(resolvedHome, resolvedAway);
    }
  };

  const handleTogglePidgin = () => {
    phoneHardware.triggerHaptic('SUCCESS');
    try { stadiumAudio.enableOnUserClick(); } catch (e) {}

    if (activeAudioChannel !== 'PIDGIN') {
      setActiveAudioChannel('PIDGIN');
      setIsBroadcastPaused(false);
      stadiumBroadcastAudio.startPidginBroadcast(
        resolvedHome,
        resolvedAway,
        isUpcoming ? 0 : 64,
        (timeStr) => setBroadcastClock(timeStr),
        selectedLocalLang
      );
    } else if (!isBroadcastPaused) {
      setIsBroadcastPaused(true);
      stadiumBroadcastAudio.pauseBroadcast();
    } else {
      setIsBroadcastPaused(false);
      stadiumBroadcastAudio.resumeBroadcast(resolvedHome, resolvedAway);
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-3xl glass-panel-premium border-2 border-stadiumGreen/40 space-y-4 font-mono text-xs text-white shadow-2xl">
      
      {/* HEADER & DUAL COMMENTARY SWITCHER (EXACTLY 2 BUTTONS ONLY) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <span className="p-2 rounded-xl bg-stadiumGreen/20 text-stadiumGreen">🎙️</span>
          <div>
            <h3 className="font-black text-sm text-stadiumGreen uppercase tracking-wider">
              {isUpcoming ? t('Pre-Match Tactical Buildup & Voice Stream') : t('Live Match Commentary & Voice Stream')}
            </h3>
            <p className="text-[10px] text-gray-400 font-sans">
              {isUpcoming
                ? t('Match scheduled for') + ' ' + resolvedTime + ' — ' + t('Pre-match simulation active')
                : t('Opta Live Match Feed & Synchronized Dual-Audio Broadcast')}
            </p>
          </div>
        </div>

        {/* EXACTLY 2 COMMENTARY CHANNELS ONLY */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* BUTTON 1: ENGLISH BROADCAST */}
          <button
            onClick={handleToggleEnglish}
            className={`px-3 py-2 rounded-xl border text-xs font-black transition-all flex items-center space-x-1.5 shadow-md ${
              activeAudioChannel === 'ENGLISH' && !isBroadcastPaused
                ? 'bg-stadiumGreen text-black border-stadiumGreen animate-pulse'
                : activeAudioChannel === 'ENGLISH' && isBroadcastPaused
                ? 'bg-gold text-black border-gold'
                : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
            }`}
          >
            {activeAudioChannel === 'ENGLISH' && !isBroadcastPaused ? (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span>⏸️ Pause English ({broadcastClock})</span>
              </>
            ) : activeAudioChannel === 'ENGLISH' && isBroadcastPaused ? (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>▶️ Resume English ({broadcastClock})</span>
              </>
            ) : (
              <>
                <Radio className="w-3.5 h-3.5 text-gold" />
                <span>🇬🇧 English Commentary</span>
              </>
            )}
          </button>

          {/* BUTTON 2: PIDGIN / TRANSLATED DIALECT DROPDOWN */}
          <div className="flex items-center space-x-1 bg-black/60 p-1 rounded-xl border border-white/10">
            <select
              value={selectedLocalLang}
              onChange={(e) => setSelectedLocalLang(e.target.value)}
              className="bg-transparent text-[11px] font-black text-stadiumGreen outline-none cursor-pointer px-1"
            >
              <option value="pidgin" className="bg-black text-white">🇳🇬 Pidgin</option>
              <option value="yoruba" className="bg-black text-white">🇳🇬 Yorùbá</option>
              <option value="igbo" className="bg-black text-white">🇳🇬 Igbo</option>
              <option value="hausa" className="bg-black text-white">🇳🇬 Hausa</option>
            </select>

            <button
              onClick={handleTogglePidgin}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition-all flex items-center space-x-1 shadow ${
                activeAudioChannel === 'PIDGIN' && !isBroadcastPaused
                  ? 'bg-stadiumGreen text-black animate-pulse'
                  : activeAudioChannel === 'PIDGIN' && isBroadcastPaused
                  ? 'bg-gold text-black'
                  : 'bg-stadiumGreen/20 text-stadiumGreen hover:bg-stadiumGreen/30'
              }`}
            >
              {activeAudioChannel === 'PIDGIN' && !isBroadcastPaused ? (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>⏸️ ({broadcastClock})</span>
                </>
              ) : activeAudioChannel === 'PIDGIN' && isBroadcastPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>▶️ ({broadcastClock})</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-stadiumGreen" />
                  <span>▶️ Play</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* EVENT FEED & TIMELINE */}
      {isUpcoming ? (
        <div className="p-4 rounded-2xl bg-black/60 border border-gold/30 text-center space-y-2">
          <span className="px-2.5 py-0.5 rounded-full bg-gold/20 text-gold text-[10px] font-bold">
            ⏳ PRE-MATCH STATUS (Kickoff: {resolvedTime})
          </span>
          <p className="text-xs text-gray-300 font-sans">
            Match has not kicked off yet. Real-time pitch events and referee whistles will stream live as the whistle blows.
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {[
            { min: "88'", title: 'Dangerous Attack', text: `${resolvedHome} pushing forward into penalty box with high momentum!` },
            { min: "74'", title: 'Thunderous Shot Saved', text: 'Goalkeeper makes reflex diving save! Corner kick awarded.' },
            { min: "64'", title: '⚽ GOAL SCORING MOMENT', text: `Breakthrough goal! ${resolvedHome} fans erupting in celebration!` },
            { min: "45+2'", title: 'Half Time Tactical Reset', text: 'Teams head into tunnel after high-intensity 45 minutes.' },
          ].map((evt, i) => (
            <div key={i} className="p-3 rounded-2xl bg-black/50 border border-white/10 flex items-start space-x-3">
              <span className="px-2 py-0.5 rounded-full bg-stadiumGreen/20 text-stadiumGreen font-black text-[10px] flex-shrink-0">
                {evt.min}
              </span>
              <div className="space-y-0.5 min-w-0">
                <span className="font-black text-xs text-white block truncate">{evt.title}</span>
                <p className="text-[11px] text-gray-300 font-sans">{evt.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
