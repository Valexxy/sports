
'use client';

function extractMinuteNum(m?: string): number {
  if (!m) return 0;
  const match = m.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Volume2, Radio, Loader2, RefreshCw } from 'lucide-react';
import { speakStadiumCommentary } from '../lib/voice-engine';
import { speakNaija, naijaMomentLine, primeNaijaVoices, allowSpeechOnUserGesture } from '../lib/naija-voice-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';
import { stadiumBroadcastAudio } from '../lib/stadium-broadcast-audio-engine';
import { getEventEffect, playEventSound, eventDedupeKey, EventEffect } from '../lib/event-effects-engine';
import { fetchRealLiveCommentary, RealCommentaryEvent, extractEspnEventId } from '../lib/real-live-commentary';
import { MatchData } from '../lib/sports-api';

interface LiveCommentaryProps {
  match?: MatchData;
  matchTitle?: string;
  league?: string;
  homeTeam?: string;
  awayTeam?: string;
  homeScore?: number;
  awayScore?: number;
  status?: 'LIVE' | 'SCHEDULED' | 'FINISHED';
  matchTime?: string;
}

const KIND_STYLES: Record<RealCommentaryEvent['kind'], string> = {
  GOAL: 'border-crimson/50 bg-gradient-to-r from-crimson/15 to-transparent',
  CARD: 'border-gold/50 bg-gradient-to-r from-gold/10 to-transparent',
  SUBSTITUTION: 'border-cyberPurple/50 bg-gradient-to-r from-cyberPurple/10 to-transparent',
  KICKOFF: 'border-stadiumGreen/50 bg-gradient-to-r from-stadiumGreen/10 to-transparent',
  HALFTIME: 'border-gold/40 bg-gradient-to-r from-gold/10 to-transparent',
  FULLTIME: 'border-stadiumGreen/50 bg-gradient-to-r from-stadiumGreen/15 to-transparent',
  INFO: 'border-white/10 bg-black/50',
};

const KIND_ICON: Record<RealCommentaryEvent['kind'], string> = {
  GOAL: '⚽',
  CARD: '🟨',
  SUBSTITUTION: '🔄',
  KICKOFF: '🏁',
  HALFTIME: '⏸️',
  FULLTIME: '🏆',
  INFO: '●',
};

const KIND_LABEL: Record<RealCommentaryEvent['kind'], string> = {
  GOAL: 'GOAL',
  CARD: 'CARD',
  SUBSTITUTION: 'SUB',
  KICKOFF: 'KICKOFF',
  HALFTIME: 'HT',
  FULLTIME: 'FT',
  INFO: 'LIVE',
};

// Authentic Naija Vibe commentary phrases used as spoken/fallback narration (real data always shown first)
const NAIJA_PHRASES = [
  'Omo! Ball dey roll for stadium o!',
  'E don hot for inside pitch!',
  'See ball! The boys dey fight well well!',
  'E go beta for the boys wey sabi ball!',
  'Naija fans dey enjoy this one!',
];

export const EdgeAiCommentator: React.FC<LiveCommentaryProps> = ({
  match,
  matchTitle,
  league = '',
  homeTeam = '',
  awayTeam = '',
  homeScore = 0,
  awayScore = 0,
  status = 'SCHEDULED',
  matchTime = '',
}) => {
  const resolvedHome = match?.homeTeam || homeTeam;
  const resolvedAway = match?.awayTeam || awayTeam;
  const resolvedLeague = match?.league || league;
  const resolvedStatus = match?.status || status;
  const resolvedScore = match ? `${match.homeScore} - ${match.awayScore}` : `${homeScore} - ${awayScore}`;
  const resolvedTime = match?.matchTime || matchTime;

  const [events, setEvents] = useState<RealCommentaryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  // Latest distinct event that needs a popup + Naija voice + SFX trigger.
  const [activeEffect, setActiveEffect] = useState<{ effect: EventEffect; ctx: RealCommentaryEvent } | null>(null);
  const seenEventKeys = useRef<Set<string>>(new Set());
  const lastSpokenKey = useRef<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(false);

  // Prime voices once on mount so the first tap speaks instantly.
  useEffect(() => {
    primeNaijaVoices();
  }, []);

  // Auto-dismiss the popup after a few seconds.
  useEffect(() => {
    if (!activeEffect) return;
    const t = setTimeout(() => setActiveEffect(null), 3800);
    return () => clearTimeout(t);
  }, [activeEffect]);

  const loadCommentary = useCallback(async () => {
    if (!match) {
      setLoading(false);
      setError(true);
      return;
    }
    const eventId = extractEspnEventId(match.id);
    if (!eventId) {
      setLoading(false);
      setError(true);
      return;
    }

    setLoading(true);
    setError(false);
    try {
      const data = await fetchRealLiveCommentary(eventId, match.league, match.homeTeam, match.awayTeam);
      // Detect NEW distinct events since last poll → fire effect + Naija voice.
      const fresh = data.filter((ev) => {
        const key = `${ev.kind}|${ev.scorer || ''}|${ev.team || ''}|${ev.minute || ''}`;
        if (seenEventKeys.current.has(key)) return false;
        seenEventKeys.current.add(key);
        return true;
      });
      const sortedData = [...data].sort((a, b) => extractMinuteNum(b.minute) - extractMinuteNum(a.minute));
      setEvents(sortedData);
      if (data.length === 0) setError(true);

      // Trigger the biggest new event (goal > red card > kickoff > sub > info).
      if (fresh.length > 0) {
        const priority: Record<RealCommentaryEvent['kind'], number> = {
          GOAL: 6, KICKOFF: 4, FULLTIME: 4, CARD: 3, HALFTIME: 2, SUBSTITUTION: 1, INFO: 0,
        };
        const top = fresh.reduce((a, b) => (priority[b.kind] > priority[a.kind] ? b : a));
        // Map the real-feed event kind onto the effects engine's vocabulary.
        const effectKind =
          top.kind === 'GOAL' ? 'GOAL' :
          top.kind === 'CARD' ? 'YELLOW_CARD' :
          top.kind === 'SUBSTITUTION' ? 'SUBSTITUTION' :
          top.kind === 'KICKOFF' ? 'KICKOFF' :
          top.kind === 'HALFTIME' ? 'HALFTIME' :
          top.kind === 'FULLTIME' ? 'FULLTIME' : 'INFO';
        const effect = getEventEffect({
          kind: effectKind,
          team: top.team,
          scorer: top.scorer,
          minute: top.minute,
        });
        setActiveEffect({ effect, ctx: top });
        // auto sound disabled

        if (autoSpeak) {
          const key = eventDedupeKey({
            kind: effectKind,
            scorer: top.scorer,
            team: top.team,
            minute: top.minute,
          });
          if (lastSpokenKey.current !== key) {
            lastSpokenKey.current = key;
            const moment = top.kind === 'GOAL' ? 'GOAL' : top.kind === 'KICKOFF' ? 'KICKOFF' : top.kind === 'FULLTIME' ? 'FULLTIME' : top.kind === 'HALFTIME' ? 'HALFTIME' : 'DEFAULT';
            const naijaText = naijaMomentLine(moment, top.team || resolvedHome, resolvedHome === top.team ? resolvedAway : resolvedHome, top.minute);
            speakNaija(naijaText, top.kind === 'GOAL' ? 'hyped' : 'normal');
          }
        }
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [match, resolvedHome, resolvedAway, autoSpeak]);

  useEffect(() => {
    setEvents([]);
    seenEventKeys.current.clear();
    lastSpokenKey.current = null;
    setActiveEffect(null);
    if (match) {
      loadCommentary();
      const interval = setInterval(loadCommentary, 30000); // live refresh
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [match, loadCommentary]);

  const handleSpeak = () => {
    stadiumAudio.enableOnUserClick();
    allowSpeechOnUserGesture();
    stadiumAudio.playBookmarkSound();
    
    // Pick the most impactful live moment
    const target =
      events.find((e) => e.kind === 'GOAL') ||
      events.find((e) => e.kind === 'FULLTIME') ||
      events[0];

    const text = target
      ? target.kind === 'GOAL' && target.scorer
        ? `Goal o! ${target.scorer} just score for ${target.team || resolvedHome}! ${target.text}`
        : target.text
      : resolvedStatus === 'LIVE'
      ? `Omo see ball! ${resolvedHome} ${resolvedScore} ${resolvedAway}. Action dey heavy on pitch right now!`
      : `${resolvedHome} vs ${resolvedAway}. Kickoff time is ${resolvedTime}. Game go hot!`;

    stadiumBroadcastAudio.surgeCrowdRoar('goal');
    stadiumAudio.speakNigerian(text);
    speakNaija(text, 'hyped');
  };

  const goals = events.filter((e) => e.kind === 'GOAL');
  const sortedGoals = [...goals].sort((a, b) => extractMinuteNum(b.minute) - extractMinuteNum(a.minute));
  const latestGoal = sortedGoals[0];

  // Score summary extracted from latest goal text / match state
  const scoreLine =
    resolvedStatus === 'LIVE' || resolvedStatus === 'FINISHED'
      ? resolvedScore
      : resolvedTime;

  return (
    <div className="p-4 rounded-3xl glass-panel-premium border border-stadiumGreen/40 space-y-3 font-mono text-xs shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-xl bg-stadiumGreen/20 border border-stadiumGreen/40">
            <Radio className="w-4 h-4 text-stadiumGreen animate-pulse" />
          </div>
          <div>
            <span className="font-black text-white text-xs block">🎙️ LIVE COMMENTARY — NAIJA VIBE</span>
            <span className="text-[9px] text-stadiumGreen flex items-center space-x-1">
              {resolvedStatus === 'LIVE' ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-crimson animate-ping"></span>
                  <span className="text-crimson font-black">LIVE IN-PLAY ({resolvedTime}) • {resolvedLeague}</span>
                </>
              ) : resolvedStatus === 'FINISHED' ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-stadiumGreen"></span>
                  <span className="text-gray-300 font-bold">FULL TIME (RESULT SETTLED) • {resolvedLeague}</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                  <span className="text-gold font-bold">KICKOFF AT {resolvedTime} • {resolvedLeague}</span>
                </>
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <span className="px-2.5 py-1 rounded-xl bg-black/60 border border-white/10 font-black text-sm text-white">
            {scoreLine}
          </span>
          {events.length > 0 && (
            <button
              onClick={loadCommentary}
              disabled={loading}
              className="p-1.5 rounded-lg bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/30 hover:bg-stadiumGreen/30 transition-all disabled:opacity-50"
              title="Refresh live feed"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Latest goal banner with exact stated minute */}
      {latestGoal && (
        <div className="p-3 rounded-2xl bg-gradient-to-r from-crimson/25 via-gold/10 to-panel border border-crimson/50 space-y-1.5 animate-fadeIn shadow-lg shadow-crimson/20">
          <div className="flex items-center space-x-2.5">
            <span className="text-2xl animate-bounce">⚽</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                {latestGoal.minute && (
                  <span className="px-2 py-0.5 rounded-lg bg-crimson text-white font-mono text-[11px] font-black shadow-md animate-pulse">
                    {latestGoal.minute.includes("'") ? latestGoal.minute : `${latestGoal.minute}'`}
                  </span>
                )}
                <p className="font-black text-white text-sm truncate">
                  GOAL! {latestGoal.scorer || latestGoal.team || 'Player'} scores!
                </p>
              </div>
              <p className="text-[11px] text-gray-300 font-sans mt-1 line-clamp-2">{latestGoal.text}</p>
            </div>
          </div>
        </div>
      )}

      {/* Popup event FX overlay (goal / card / kickoff / sub) */}
      {activeEffect && (
        <div
          key={activeEffect.effect.kind}
          className={`relative overflow-hidden p-3.5 rounded-2xl border bg-gradient-to-r ${activeEffect.effect.colors.bg} ${activeEffect.effect.colors.border} ${activeEffect.effect.animation}`}
        >
          {/* Glow accent */}
          <div
            className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-40 blur-2xl"
            style={{ background: activeEffect.effect.colors.accent }}
          />
          <div className="relative flex items-center space-x-3">
            <div className={`p-2.5 rounded-xl bg-black/30 text-2xl ${activeEffect.effect.colors.text}`}>
              {activeEffect.effect.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-[9px] font-black tracking-widest uppercase ${activeEffect.effect.colors.text} opacity-90`}>
                {activeEffect.effect.label}
              </p>
              <p className={`font-black text-sm leading-snug mt-0.5 ${activeEffect.effect.colors.text}`}>
                {activeEffect.effect.title} · {activeEffect.effect.subTitle}
              </p>
              <p className="text-[10px] text-white/80 font-sans line-clamp-2">{activeEffect.ctx.text}</p>
            </div>
            <span className="text-[9px] font-bold text-white whitespace-nowrap bg-black/40 px-2 py-0.5 rounded-lg border border-white/20">
              {activeEffect.effect.sound === 'goal' ? '🎉 GOLAZO' : activeEffect.effect.sound === 'whistle' ? '🔔 WHISTLE' : activeEffect.effect.sound === 'card' ? '🟨 CAUTION' : 'LIVE'}
            </span>
          </div>
        </div>
      )}

      {/* Body */}
      {loading && events.length === 0 ? (
        <div className="p-5 text-center text-gray-400 flex items-center justify-center space-x-2">
          <Loader2 className="w-4 h-4 animate-spin text-stadiumGreen" />
          <span>Loading live commentary...</span>
        </div>
      ) : error && events.length === 0 ? (
        <div className="p-5 text-center space-y-2">
          <p className="text-gray-400 text-[11px]">
            {resolvedStatus === 'SCHEDULED'
              ? `Match scheduled to kickoff at ${resolvedTime}. Live commentary will begin when the referee blows the whistle.`
              : resolvedStatus === 'FINISHED'
              ? `Match has concluded at full time. Final score: ${resolvedScore}.`
              : `Live in-play commentary active for ${resolvedHome} vs ${resolvedAway}.`}
          </p>
          <button
            onClick={handleSpeak}
            className="px-3.5 py-1.5 rounded-xl bg-stadiumGreen text-black font-black text-[10px] flex items-center space-x-1.5 mx-auto transition-all hover:scale-105 shadow-md glow-emerald"
          >
            <Volume2 className="w-3.5 h-3.5 fill-current" />
            <span>Naija Vibe Audio 🔊</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Per-minute feed */}
          <div className="relative space-y-1 max-h-[320px] overflow-y-auto pr-1">
            {events.map((ev, idx) => (
              <div
                key={`${ev.sequence}-${idx}`}
                className={`p-2.5 rounded-xl border flex items-start space-x-3 animate-fadeIn ${KIND_STYLES[ev.kind]}`}
              >
                {/* Minute column */}
                <span className={`w-12 flex-shrink-0 text-[10px] font-black pt-0.5 text-center rounded-lg py-0.5 ${
                  ev.kind === 'GOAL'
                    ? 'bg-crimson text-white'
                    : ev.kind === 'CARD'
                    ? 'bg-gold text-black'
                    : 'bg-black/50 text-gray-300 border border-white/10'
                }`}>
                  {ev.minute}
                </span>

                {/* Event body */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1.5 mb-0.5">
                    {ev.kind !== 'INFO' && (
                      <span className="px-1.5 py-0.5 rounded bg-black/40 text-[8px] font-black tracking-wider">
                        {KIND_ICON[ev.kind]} {KIND_LABEL[ev.kind]}
                      </span>
                    )}
                    {ev.kind === 'GOAL' && ev.scorer && (
                      <span className="text-[9px] font-bold text-crimson">👤 {ev.scorer}</span>
                    )}
                    {ev.team && ev.kind !== 'GOAL' && (
                      <span className="text-[9px] font-bold text-gold">{ev.team}</span>
                    )}
                  </div>
                  <p className="text-gray-200 font-sans text-[11px] leading-relaxed">{ev.text}</p>
                </div>
              </div>
            ))}

            {loading && events.length > 0 && (
              <div className="p-2 text-center text-[10px] text-gray-400 flex items-center justify-center space-x-1.5">
                <Loader2 className="w-3 h-3 animate-spin text-stadiumGreen" />
                <span>Refreshing...</span>
              </div>
            )}
          </div>

          {/* Voice action */}
          <div className="flex items-center justify-between pt-1 border-t border-white/5">
            <span className="text-[9px] text-gray-400">
              {resolvedStatus === 'FINISHED' ? 'Full Time' : resolvedStatus === 'LIVE' ? `Live • ${resolvedTime}` : 'Upcoming'}
            </span>
            <button
              onClick={handleSpeak}
              className="px-3.5 py-1.5 rounded-xl bg-stadiumGreen hover:bg-emerald-400 text-black font-black text-[10px] flex items-center space-x-1.5 transition-all hover:scale-105 shadow-md glow-emerald"
            >
              <Volume2 className="w-3.5 h-3.5 fill-current" />
              <span>Naija Vibe Voice 🔊</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
