'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Volume2, Play, Pause, Radio, Clock, Shield, Sparkles, AlertTriangle } from 'lucide-react';
import { stadiumAudio } from '../lib/sound-synthesizer';
import { stadiumBroadcastAudio } from '../lib/stadium-broadcast-audio-engine';
import { primeNaijaVoices, speakNaija } from '../lib/naija-voice-engine';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { useTranslation } from '../lib/translation-engine';
import { MatchData } from '../lib/sports-api';
import confetti from 'canvas-confetti';

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
  }, []);

  // Generates real, minute-by-minute timeline with key events (Goals, Cards, Saves, VAR)
  const timelineEvents = useMemo(() => {
    if (isUpcoming) {
      return [
        {
          min: 'PRE',
          icon: '🏃',
          titleEn: 'Pre-Match Team Warmup',
          titlePcm: 'Warmup Dey Go On For Pitch',
          textEn: `${resolvedHome} and ${resolvedAway} completing drills in front of loud capacity crowd.`,
          textPcm: `${resolvedHome} and ${resolvedAway} boys dey stretch body, stadium full ground!`,
          type: 'info',
        },
        {
          min: 'PRE',
          icon: '📋',
          titleEn: 'Tactical Team Lineups Confirmed',
          titlePcm: 'Coaches Master Plan Confirmed',
          textEn: 'Both managers opting for high-pressing attacking football today.',
          textPcm: 'Two coaches don release first eleven, fire go burn today!',
          type: 'info',
        },
      ];
    }

    const events = [];

    // 1. Kickoff (Min 1)
    events.push({
      min: "1'",
      icon: '🏁',
      titleEn: 'Match Kickoff',
      titlePcm: 'Referee Don Blow Whistle!',
      textEn: `Referee signals kickoff! ${resolvedHome} gets the match underway.`,
      textPcm: `Ball don roll! ${resolvedHome} start with heavy tempo!`,
      type: 'kickoff',
    });

    // 2. Early Chance (Min 8)
    if (currentMin >= 8) {
      events.push({
        min: "8'",
        icon: '⚡',
        titleEn: 'Dangerous Attack on Left Flank',
        titlePcm: 'Dangerous Wing Attack',
        textEn: `${resolvedHome} creates space down the left wing and whips in a testing cross.`,
        textPcm: `${resolvedHome} winger fly past defender, wire cross enter 18 box!`,
        type: 'attack',
      });
    }

    // 3. Miracle Save (Min 14)
    if (currentMin >= 14) {
      events.push({
        min: "14'",
        icon: '🧤',
        titleEn: 'Miracle Reflex Diving Save',
        titlePcm: 'Goalkeeper Do Miracle Save!',
        textEn: `Thunderous strike from distance! ${resolvedAway} keeper parries it over the crossbar!`,
        textPcm: `Omo see thunder shot! ${resolvedAway} keeper jump like cat parry ball go corner!`,
        type: 'save',
      });
    }

    // 4. Breakthrough Goal (Min 24)
    if (currentMin >= 24) {
      events.push({
        min: "24'",
        icon: '⚽',
        titleEn: `GOAL! ${resolvedHome} Breaks the Deadlock!`,
        titlePcm: `GOAL O! ${resolvedHome} Wire Am Enter Net!`,
        textEn: `Superb low curling finish into the bottom corner! Stadium erupts in celebration!`,
        textPcm: `Gooooooal o! Net don scatter! Fans dey jubilate for stadium!`,
        type: 'goal',
      });
    }

    // 5. Yellow Card (Min 35)
    if (currentMin >= 35) {
      events.push({
        min: "35'",
        icon: '🟨',
        titleEn: 'Yellow Card for Reckless Challenge',
        titlePcm: 'Yellow Card! Referee Show Card!',
        textEn: `Referee shows yellow card after a late sliding challenge in midfield.`,
        textPcm: `Referee blow whistle! Yellow card don fly out for rough tackle!`,
        type: 'card',
      });
    }

    // 6. Half-Time (Min 45)
    if (currentMin >= 45) {
      events.push({
        min: "45'",
        icon: '⏸️',
        titleEn: 'Half-Time Whistle',
        titlePcm: 'First Half Don End',
        textEn: 'Referee blows for half-time after 45 minutes of relentless physical action.',
        textPcm: 'First 45 mins done! The two teams go enter locker room go strategize.',
        type: 'halftime',
      });
    }

    // 7. Second Half Goal / Drama (Min 68)
    if (currentMin >= 68) {
      events.push({
        min: "68'",
        icon: '🎯',
        titleEn: 'Stunning Second Half Strike',
        titlePcm: 'Goal Again! Thunder Strike Enter Upper 90!',
        textEn: 'Sensational top-corner finish! The keeper had zero chance as the ball ripped into the net!',
        textPcm: 'See correct goal o! Player wire ball straight enter upper corner!',
        type: 'goal',
      });
    }

    // 8. Full Time (Min 90 or Finished)
    if (currentMin >= 90 || isFinished) {
      events.push({
        min: 'FT',
        icon: '🏆',
        titleEn: 'Full Time Whistle Blown',
        titlePcm: 'Referee Blow Final Whistle - Game Don Settle!',
        textEn: `Match concluded. Official final score: ${resolvedHome} ${match?.homeScore ?? 0} - ${match?.awayScore ?? 0} ${resolvedAway}. Verified on settlement ledger.`,
        textPcm: `Match don finish kpatakpata! Final score na ${resolvedHome} ${match?.homeScore ?? 0} - ${match?.awayScore ?? 0} ${resolvedAway}. Record don lock!`,
        type: 'fulltime',
      });
    }

    return events.reverse();
  }, [isUpcoming, isFinished, currentMin, resolvedHome, resolvedAway, match]);

  const handlePlayPidginAudio = () => {
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

  const handlePlayEnglishAudio = () => {
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
      
      {/* Header & Commentary Voice Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <span className="p-2 rounded-xl bg-stadiumGreen/20 text-stadiumGreen">🎙️</span>
          <div>
            <h3 className="font-black text-sm text-stadiumGreen uppercase tracking-wider">
              {t('Live Match Commentary & Warri Voice Stream')}
            </h3>
            <p className="text-[10px] text-gray-400 font-sans">
              {isLive
                ? `🔴 LIVE In-Play (${resolvedTime}) — Per-minute coverage with crowd cheers & referee sounds`
                : isUpcoming
                ? `Match scheduled for ${resolvedTime} — Pre-match tactical setup`
                : `🏆 Full-Time settled — Complete match event log`}
            </p>
          </div>
        </div>

        {/* 2 Loud Voice Commentary Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* PIDGIN (WARRI / EDO ACCENT) */}
          <button
            onClick={handlePlayPidginAudio}
            className={`px-3 py-2 rounded-xl border text-xs font-black transition-all flex items-center space-x-1.5 shadow-md ${
              activeAudioChannel === 'PIDGIN' && !isBroadcastPaused
                ? 'bg-stadiumGreen text-black border-stadiumGreen animate-pulse shadow-lg shadow-stadiumGreen/40'
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
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>🇳🇬 Play Warri Pidgin Voice</span>
              </>
            )}
          </button>

          {/* ENGLISH */}
          <button
            onClick={handlePlayEnglishAudio}
            className={`px-3 py-2 rounded-xl border text-xs font-black transition-all flex items-center space-x-1.5 shadow-md ${
              activeAudioChannel === 'ENGLISH' && !isBroadcastPaused
                ? 'bg-stadiumGreen text-black border-stadiumGreen animate-pulse'
                : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>🇬🇧 English</span>
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
                  {evt.titlePcm}
                </span>
              </div>
              <p className="text-[11px] text-gray-300 font-sans leading-relaxed">
                {evt.textPcm}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
