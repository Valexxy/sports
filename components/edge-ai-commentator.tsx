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
  if (!timeStr) return 45;
  const m = timeStr.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 45;
}

// Generate realistic, unbroken per-minute commentary for EVERY single minute 1..N
function buildMinuteEvent(
  min: number,
  home: string,
  away: string,
  homeScore: number,
  awayScore: number
): { min: string; icon: string; title: string; text: string; type: string } {
  // Key highlights at specific minutes
  if (min === 1) {
    return { min: "1'", icon: '🏁', title: 'Referee Don Blow Whistle!', text: `Match don start! ${home} and ${away} enter pitch with heavy fire!`, type: 'kickoff' };
  }
  if (min === 14) {
    return { min: "14'", icon: '🧤', title: 'Miracle Diving Save!', text: `Omo see thunder shot! ${away} keeper jump like cat parry ball go corner!`, type: 'save' };
  }
  if (min === 24) {
    return { min: "24'", icon: '⚽', title: `GOAL O! ${home} Wire Am Enter Net!`, text: `Gooooooal o! Low drive strike enter corner! Score na ${home} 1 - 0 ${away}!`, type: 'goal' };
  }
  if (min === 35) {
    return { min: "35'", icon: '🟨', title: 'Yellow Card for Bad Tackle!', text: `Referee blow whistle! Yellow card fly out for rough sliding challenge!`, type: 'card' };
  }
  if (min === 45) {
    return { min: "45'", icon: '⏸️', title: 'First Half Don End', text: `Referee blow half-time! Players enter tunnel go drink pure water. Score: ${home} 1 - 0 ${away}.`, type: 'halftime' };
  }
  if (min === 68) {
    return { min: "68'", icon: '⚽', title: `GOAL AGAIN! ${away} Equalize!`, text: `What a finish! Thunder curling shot hit post enter net! Score na ${home} 1 - 1 ${away}!`, type: 'goal' };
  }
  if (min === 78) {
    return { min: "78'", icon: '🟨', title: 'Yellow Card for Professional Foul', text: `Tactical pull on jersey to stop counter attack, referee flash yellow card without hesitation!`, type: 'card' };
  }
  if (min === 86) {
    return { min: "86'", icon: '🧤', title: 'Fingertip Goal-Line Save!', text: `Point-blank header saved on the goal line! Incredible reflexes!`, type: 'save' };
  }
  if (min === 90) {
    return { min: '90+3\'', icon: '🏆', title: 'Referee Blow Final Whistle!', text: `Match don settle kpatakpata! Official final score: ${home} ${homeScore} - ${awayScore} ${away}. Record locked.`, type: 'fulltime' };
  }

  // Dynamic procedural narrative for all other individual minutes
  const seed = (min * 7 + 13) % 10;
  const narratives = [
    { icon: '⚽', title: `${home} Building Up From Back`, text: `Smooth passing exchange in deep defense as ${home} draws out the opposition press.`, type: 'play' },
    { icon: '⚡', title: 'High Press & Fast Turnover', text: `Intense physical pressing forces a loose ball in the central third. ${away} wins possession.`, type: 'play' },
    { icon: '🎯', title: 'Curling Cross Into Penalty Box', text: `Dangerous high cross whipped towards far post, defender leaps high to head clear.`, type: 'play' },
    { icon: '🛡️', title: 'Solid Warri Tackle in Midfield', text: `Clean sliding challenge wins the ball cleanly, sparking immediate forward transition.`, type: 'play' },
    { icon: '🔥', title: 'Long Range Effort Fired', text: `Ambitious strike from outside 25 yards sails just over the crossbar into the stands.`, type: 'play' },
    { icon: '👟', title: 'Through-Ball Sliced in Behind', text: `Eye-of-the-needle pass nearly finds striker on the run, keeper quickly sweeps it up.`, type: 'play' },
    { icon: '🚩', title: 'Offside Flag Raised on Right Wing', text: `Assistant referee raises flag as attacker mistimes run behind the defensive backline.`, type: 'play' },
    { icon: '📐', title: 'Corner Kick Won and Delivered', text: `Corner swung into the penalty spot, crowded box sees physical aerial contest.`, type: 'play' },
    { icon: '⏱️', title: 'Tactical Possession Control', text: `Methodical ball retention across the pitch, patiently probing for passing lanes.`, type: 'play' },
    { icon: '🚀', title: 'Fast Break on Left Flank', text: `Rapid switch of play isolates the winger 1-on-1 against full-back!`, type: 'play' },
  ];

  const item = narratives[seed];
  return {
    min: `${min}'`,
    icon: item.icon,
    title: item.title,
    text: item.text,
    type: item.type,
  };
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
  const homeScore = match?.homeScore ?? 0;
  const awayScore = match?.awayScore ?? 0;

  const isLive = resolvedStatus === 'LIVE';
  const isUpcoming = resolvedStatus === 'SCHEDULED';
  const isFinished = resolvedStatus === 'FINISHED';

  const currentMin = useMemo(() => {
    if (isFinished) return 90;
    if (isUpcoming) return 0;
    return Math.max(1, Math.min(90, parseMinute(resolvedTime)));
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

  // GENERATE EVERY SINGLE MINUTE FROM 1 TO CURRENT MINUTE (NO MINUTES SKIPPED!)
  const timelineEvents = useMemo(() => {
    if (isUpcoming) {
      return [
        { min: 'PRE', icon: '🏃', title: 'Pre-Match Team Warmup', text: `${resolvedHome} and ${resolvedAway} boys dey stretch body, stadium full ground!`, type: 'info' },
        { min: 'PRE', icon: '📋', title: 'Tactical Team Lineups Confirmed', text: 'Two coaches don release first eleven, fire go burn today!', type: 'info' },
      ];
    }

    const events = [];
    for (let m = 1; m <= currentMin; m++) {
      events.push(buildMinuteEvent(m, resolvedHome, resolvedAway, homeScore, awayScore));
    }

    // Latest minute appears at top
    return events.reverse();
  }, [isUpcoming, currentMin, resolvedHome, resolvedAway, homeScore, awayScore]);

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
                ? `🔴 LIVE In-Play (${resolvedTime}) — Unbroken per-minute commentary (1' to ${currentMin}') with live voice stream`
                : isUpcoming
                ? `Match scheduled for ${resolvedTime} — Pre-match buildup active`
                : `🏆 Full-Time settled — Complete 1' to 90' match archive`}
            </p>
          </div>
        </div>

        {/* 2 Loud Voice Commentary Buttons */}
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

      {/* UNBROKEN PER-MINUTE TIMELINE (1, 2, 3, 4, 5... TO CURRENT MINUTE) */}
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {timelineEvents.map((evt, idx) => (
          <div
            key={idx}
            className={`p-2.5 sm:p-3 rounded-2xl border transition-all flex items-start space-x-3 ${
              evt.type === 'goal'
                ? 'bg-gradient-to-r from-stadiumGreen/20 to-gold/10 border-stadiumGreen/60 shadow-md ring-1 ring-stadiumGreen/40'
                : evt.type === 'card'
                ? 'bg-amber-500/10 border-amber-500/40'
                : evt.type === 'save'
                ? 'bg-cyan-500/10 border-cyan-500/30'
                : 'bg-black/50 border-white/5 hover:border-white/20'
            }`}
          >
            <span className={`px-2 py-1 rounded-xl text-[10px] font-mono font-black flex-shrink-0 ${
              evt.type === 'goal'
                ? 'bg-stadiumGreen text-black font-black'
                : evt.type === 'card'
                ? 'bg-amber-500 text-black'
                : evt.type === 'save'
                ? 'bg-cyan-400 text-black'
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
