'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Volume2, Play, Pause, Radio, Clock, Shield, Sparkles } from 'lucide-react';
import { stadiumAudio } from '../lib/sound-synthesizer';
import { stadiumBroadcastAudio } from '../lib/stadium-broadcast-audio-engine';
import { primeNaijaVoices, stopNaijaAudio } from '../lib/naija-voice-engine';
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

function parseMinute(timeStr?: string): number {
  if (!timeStr) return 28;
  const m = timeStr.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 28;
}

export const EdgeAiCommentator: React.FC<LiveCommentaryProps> = ({
  match,
  homeTeam = '',
  awayTeam = '',
  status = 'SCHEDULED',
  matchTime = '19:00',
}) => {
  const { t } = useTranslation();
  const resolvedHome = match?.homeTeam || homeTeam || 'Home';
  const resolvedAway = match?.awayTeam || awayTeam || 'Away';
  const resolvedStatus = match?.status || status;
  const resolvedTime = match?.matchTime || matchTime;

  const isLive = resolvedStatus === 'LIVE';
  const isUpcoming = resolvedStatus === 'SCHEDULED';
  const isFinished = resolvedStatus === 'FINISHED';

  const currentMin = useMemo(() => {
    if (isFinished) return 90;
    if (isUpcoming) return 0;
    return Math.max(1, parseMinute(resolvedTime));
  }, [isFinished, isUpcoming, resolvedTime]);

  const [activeAudioChannel, setActiveAudioChannel] = useState<'NONE' | 'ENGLISH' | 'PIDGIN'>('NONE');
  const [isBroadcastPaused, setIsBroadcastPaused] = useState<boolean>(false);
  const [broadcastClock, setBroadcastClock] = useState<string>(resolvedTime || "28'");

  useEffect(() => {
    primeNaijaVoices();
    return () => {
      stopNaijaAudio();
      stadiumBroadcastAudio.stopBroadcast();
    };
  }, []);

  // Detailed per-minute progressive timeline with key notes
  const timelineEvents = useMemo(() => {
    if (isUpcoming) {
      return [
        { min: 'PRE', icon: '🏃', title: 'Pre-Match Team Warmup', text: `${resolvedHome} and ${resolvedAway} boys dey stretch body, stadium full ground!`, type: 'info' },
        { min: 'PRE', icon: '📋', title: 'Tactical Team Lineups Confirmed', text: 'Two coaches don release first eleven, fire go burn today!', type: 'info' },
      ];
    }

    const events = [];
    events.push({ min: "1'", icon: '🏁', title: 'Referee Don Blow Whistle!', text: `Ball don roll! ${resolvedHome} start with heavy tempo!`, type: 'kickoff' });

    if (currentMin >= 8) {
      events.push({ min: "8'", icon: '⚡', title: 'Dangerous Attack', text: `${resolvedHome} winger fly past defender, wire cross enter 18 box!`, type: 'attack' });
    }
    if (currentMin >= 14) {
      events.push({ min: "14'", icon: '🧤', title: 'Goalkeeper Miracle Save!', text: `Omo see thunder shot! ${resolvedAway} keeper jump like cat parry ball go corner!`, type: 'save' });
    }
    if (currentMin >= 24) {
      events.push({ min: "24'", icon: '⚽', title: `GOAL O! ${resolvedHome} Wire Am Enter Net!`, text: `Gooooooal o! Net don scatter! Fans dey jubilate for stadium!`, type: 'goal' });
    }
    if (currentMin >= 35) {
      events.push({ min: "35'", icon: '🟨', title: 'Yellow Card! Referee Show Card!', text: `Referee blow whistle! Yellow card don fly out for rough tackle!`, type: 'card' });
    }
    if (currentMin >= 45) {
      events.push({ min: "45'", icon: '⏸️', title: 'First Half Don End', text: 'First 45 mins done! The two teams go enter locker room go drink water.', type: 'halftime' });
    }
    if (currentMin >= 68) {
      events.push({ min: "68'", icon: '🎯', title: 'Goal Again! Thunder Strike Enter Upper 90!', text: 'See correct goal o! Player wire ball straight enter upper corner!', type: 'goal' });
    }
    if (currentMin >= 90 || isFinished) {
      events.push({ min: 'FT', icon: '🏆', title: 'Referee Blow Final Whistle!', text: `Match don finish kpatakpata! Final score na ${resolvedHome} ${match?.homeScore ?? 0} - ${match?.awayScore ?? 0} ${resolvedAway}. Record don lock!`, type: 'fulltime' });
    }

    return events.reverse();
  }, [isUpcoming, isFinished, currentMin, resolvedHome, resolvedAway, match]);

  const handleTogglePidgin = () => {
    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.enableOnUserClick();

    if (activeAudioChannel !== 'PIDGIN') {
      setActiveAudioChannel('PIDGIN');
      setIsBroadcastPaused(false);
      stadiumBroadcastAudio.startPidginBroadcast(
        resolvedHome,
        resolvedAway,
        currentMin,
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

  const handleToggleEnglish = () => {
    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.enableOnUserClick();

    if (activeAudioChannel !== 'ENGLISH') {
      setActiveAudioChannel('ENGLISH');
      setIsBroadcastPaused(false);
      stadiumBroadcastAudio.startEnglishBroadcast(
        resolvedHome,
        resolvedAway,
        currentMin,
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

  return (
    <div className="p-4 sm:p-5 rounded-3xl glass-panel-premium border-2 border-stadiumGreen/40 space-y-4 font-mono text-xs text-white shadow-2xl">
      
      {/* Header & Commentary Dual Audio Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <span className="p-2 rounded-xl bg-stadiumGreen/20 text-stadiumGreen">🎙️</span>
          <div>
            <h3 className="font-black text-sm text-stadiumGreen uppercase tracking-wider">
              {t('Live Match Commentary & Voice Stream')}
            </h3>
            <p className="text-[10px] text-gray-400 font-sans">
              {isLive
                ? `🔴 LIVE In-Play (${resolvedTime}) — Authentic Warri/Edo live voice stream with crowd cheers`
                : isUpcoming
                ? `Match scheduled for ${resolvedTime} — Pre-match buildup active`
                : `🏆 Full-Time settled — Complete match log`}
            </p>
          </div>
        </div>

        {/* 2 Loud Voice Commentary Buttons (Both with Full Play/Pause States) */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* BUTTON 1: WARRI / EDO NIGERIAN PIDGIN */}
          <button
            onClick={handleTogglePidgin}
            className={`px-3 py-2 rounded-xl border text-xs font-black transition-all flex items-center space-x-1.5 shadow-md ${
              activeAudioChannel === 'PIDGIN' && !isBroadcastPaused
                ? 'bg-stadiumGreen text-black border-stadiumGreen animate-pulse shadow-lg shadow-stadiumGreen/40 scale-105'
                : activeAudioChannel === 'PIDGIN' && isBroadcastPaused
                ? 'bg-gold text-black border-gold'
                : 'bg-stadiumGreen/20 border-stadiumGreen/40 text-stadiumGreen hover:bg-stadiumGreen hover:text-black'
            }`}
          >
            {activeAudioChannel === 'PIDGIN' && !isBroadcastPaused ? (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span>⏸️ Pause Warri Pidgin ({broadcastClock})</span>
              </>
            ) : activeAudioChannel === 'PIDGIN' && isBroadcastPaused ? (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>▶️ Resume Warri Pidgin ({broadcastClock})</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>🇳🇬 Play Warri Pidgin Voice</span>
              </>
            )}
          </button>

          {/* BUTTON 2: ENGLISH COMMENTARY */}
          <button
            onClick={handleToggleEnglish}
            className={`px-3 py-2 rounded-xl border text-xs font-black transition-all flex items-center space-x-1.5 shadow-md ${
              activeAudioChannel === 'ENGLISH' && !isBroadcastPaused
                ? 'bg-stadiumGreen text-black border-stadiumGreen animate-pulse shadow-lg shadow-stadiumGreen/40 scale-105'
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
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>🇬🇧 Play English Voice</span>
              </>
            )}
          </button>

        </div>
      </div>

      {/* Per-Minute Progressive Timeline */}
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {timelineEvents.map((evt, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-2xl border transition-all flex items-start space-x-3 ${
              evt.type === 'goal'
                ? 'bg-gradient-to-r from-stadiumGreen/20 to-gold/10 border-stadiumGreen/60 shadow-md'
                : evt.type === 'card'
                ? 'bg-amber-500/10 border-amber-500/40'
                : 'bg-black/50 border-white/5 hover:border-white/20'
            }`}
          >
            <span className={`px-2 py-1 rounded-xl text-[10px] font-mono font-black flex-shrink-0 ${
              evt.type === 'goal'
                ? 'bg-stadiumGreen text-black font-black'
                : evt.type === 'card'
                ? 'bg-amber-500 text-black'
                : 'bg-white/10 text-gray-300'
            }`}>
              {evt.min}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5 mb-0.5">
                <span className="text-sm">{evt.icon}</span>
                <span className="font-black text-white text-xs block truncate">
                  {evt.title}
                </span>
              </div>
              <p className="text-[11px] text-gray-300 font-sans leading-relaxed">
                {evt.text}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
