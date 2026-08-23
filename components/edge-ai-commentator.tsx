'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Volume2, Play, Pause, Radio, Clock, Shield, Sparkles } from 'lucide-react';
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

function parseMinute(timeStr?: string): number {
  if (!timeStr) return 15;
  const m = timeStr.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 15;
}

export const EdgeAiCommentator: React.FC<LiveCommentaryProps> = ({
  match,
  homeTeam = '',
  awayTeam = '',
  status = 'SCHEDULED',
  matchTime = '19:00',
}) => {
  const { t, currentLanguage } = useTranslation();
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
  const [selectedLocalLang, setSelectedLocalLang] = useState<string>('pidgin');
  const [isBroadcastPaused, setIsBroadcastPaused] = useState<boolean>(false);
  const [broadcastClock, setBroadcastClock] = useState<string>(resolvedTime || "15'");

  useEffect(() => {
    primeNaijaVoices();
  }, []);

  // Generate realistic, progressive timeline events strictly up to current match minute
  const timelineEvents = useMemo(() => {
    if (isUpcoming) {
      return [
        {
          min: 'PRE',
          titleEn: 'Tactical Team Lineup Walkout',
          titlePcm: 'Players Dey Enter Pitch Now',
          textEn: `${resolvedHome} and ${resolvedAway} finishing warmup in front of packed stadium.`,
          textPcm: `${resolvedHome} and ${resolvedAway} boys don finish warmup, stadium dey bubble!`,
        },
        {
          min: 'PRE',
          titleEn: 'Head-to-Head Tactical Setup',
          titlePcm: 'Tactics & Master Plan',
          textEn: 'Both managers opting for high-pressing attacking football today.',
          textPcm: 'Two coaches set ground well, nobody wan gree for this match!',
        },
      ];
    }

    const events = [];

    // 1. Kickoff (always at min 1)
    events.push({
      min: "1'",
      titleEn: '🏁 Match Kickoff',
      titlePcm: '🏁 Referee Don Blow Whistle!',
      textEn: `Referee signals the start! ${resolvedHome} kicks off with instant high tempo.`,
      textPcm: `Ball don roll! ${resolvedHome} start with fire for body!`,
    });

    // 2. Early buildup (if past 5')
    if (currentMin >= 5) {
      events.push({
        min: `${Math.min(currentMin, 5)}'`,
        titleEn: '⚡ Early Midfield Battle',
        titlePcm: '⚡ Midfield Don Hot',
        textEn: `Intense physical pressing in the central third. ${resolvedHome} controlling possession.`,
        textPcm: `The tackle heavy for center! ${resolvedHome} dey hold ball well well.`,
      });
    }

    // 3. Chance creation (if past 12')
    if (currentMin >= 12) {
      events.push({
        min: `${Math.min(currentMin, 12)}'`,
        titleEn: '🎯 Dangerous Attack & Shot Saved',
        titlePcm: '🎯 Keeper Do Miracle Save!',
        textEn: `Thunderous shot from outside the box! Goalkeeper makes a reflex diving save.`,
        textPcm: `Omo see shot! Keeper jump like cat parry the ball to corner!`,
      });
    }

    // 4. Half time / Mid game (if past 45')
    if (currentMin >= 45) {
      events.push({
        min: "45'",
        titleEn: '⏸️ Half-Time Tactical Assessment',
        titlePcm: '⏸️ First Half Don End',
        textEn: 'Whistle blows for half-time after high-intensity 45 minutes of end-to-end action.',
        textPcm: 'First 45 mins done! The two teams go enter tunnel go drink water.',
      });
    }

    // 5. Second half pressure (if past 60')
    if (currentMin >= 60) {
      events.push({
        min: `${Math.min(currentMin, 64)}'`,
        titleEn: '⚽ Breakthrough Moment',
        titlePcm: '⚽ GOALLL! Stadium Scatter!',
        textEn: `Crucial breakthrough as attackers break the offside trap to score!`,
        textPcm: `Gooooal o! Ball touch net, fans don dey jubilate for stadium!`,
      });
    }

    // 6. Final minutes (if past 85' or finished)
    if (currentMin >= 85 || isFinished) {
      events.push({
        min: isFinished ? 'FT' : "88'",
        titleEn: isFinished ? '🏆 Full Time Whistle' : '🔥 Late Match Drama',
        titlePcm: isFinished ? '🏆 Referee Blow Final Whistle' : '🔥 Last Minute Fight',
        textEn: isFinished
          ? `Full time whistle blown. Match settled: ${resolvedHome} ${match?.homeScore ?? 0} - ${match?.awayScore ?? 0} ${resolvedAway}.`
          : `All-out attack in final minutes as teams push for decisive winner.`,
        textPcm: isFinished
          ? `Match don end kpatakpata! Final score na ${resolvedHome} ${match?.homeScore ?? 0} - ${match?.awayScore ?? 0} ${resolvedAway}.`
          : `Fire dey for pitch! Everybody dey attack make dem score winner!`,
      });
    }

    return events.reverse();
  }, [isUpcoming, isFinished, currentMin, resolvedHome, resolvedAway, match]);

  const handleToggleEnglish = () => {
    if (!isLive) return;
    phoneHardware.triggerHaptic('SUCCESS');
    try { stadiumAudio.enableOnUserClick(); } catch (e) {}

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

  const handleTogglePidgin = () => {
    if (!isLive) return;
    phoneHardware.triggerHaptic('SUCCESS');
    try { stadiumAudio.enableOnUserClick(); } catch (e) {}

    if (activeAudioChannel !== 'PIDGIN') {
      setActiveAudioChannel('PIDGIN');
      setIsBroadcastPaused(false);
      stadiumBroadcastAudio.startPidginBroadcast(
        resolvedHome,
        resolvedAway,
        currentMin,
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
      
      {/* HEADER & DUAL COMMENTARY SWITCHER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <span className="p-2 rounded-xl bg-stadiumGreen/20 text-stadiumGreen">🎙️</span>
          <div>
            <h3 className="font-black text-sm text-stadiumGreen uppercase tracking-wider">
              {isUpcoming ? t('Pre-Match Tactical Buildup & Voice Stream') : t('Live Match Commentary & Voice Stream')}
            </h3>
            <p className="text-[10px] text-gray-400 font-sans">
              {isUpcoming
                ? `Match scheduled for ${resolvedTime} — Pre-match live feed active`
                : isLive
                ? `🔴 LIVE In-Play (${resolvedTime}) — Real-time progress commentary`
                : `🏆 Full-time concluded — Complete match events archive`}
            </p>
          </div>
        </div>

        {/* AUDIO CONTROLS (ONLY ACTIVE DURING LIVE MATCHES) */}
        {isLive ? (
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
        ) : (
          <div className="px-3 py-1.5 rounded-xl bg-panel border border-white/10 text-gray-400 text-[10px] font-mono">
            {isUpcoming ? '⏳ Radio audio goes live at kickoff' : '🏆 Full-time match ended'}
          </div>
        )}
      </div>

      {/* PROGRESSIVE LIVE EVENT FEED TIMELINE (ALWAYS VISIBLE FOR ALL MATCHES) */}
      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {timelineEvents.map((evt, i) => (
          <div key={i} className="p-3 rounded-2xl bg-black/50 border border-white/10 flex items-start space-x-3 hover:border-stadiumGreen/30 transition-all">
            <span className="px-2 py-0.5 rounded-full bg-stadiumGreen/20 text-stadiumGreen font-black text-[10px] flex-shrink-0">
              {evt.min}
            </span>
            <div className="space-y-1 min-w-0 flex-1">
              <span className="font-black text-xs text-white block">
                {currentLanguage === 'pidgin' ? evt.titlePcm : evt.titleEn}
              </span>
              <p className="text-[11px] text-gray-300 font-sans leading-relaxed">
                {currentLanguage === 'pidgin' ? evt.textPcm : evt.textEn}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
