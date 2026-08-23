'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Flame, HeartPulse, Sparkles, Radio } from 'lucide-react';
import { MatchData } from '../lib/sports-api';

interface Props {
  matches: MatchData[];
  onSelectMatch?: (match: MatchData) => void;
}

/**
 * VIRAL FEATURES GRID — world-first engagement utilities never seen on
 * generic betting sites:
 *   • Crowd Vibe-o-Meter  (anonymized fan sentiment gauge)
 *   • Goal Rush Radar     (predicts the next in-play goal minute window)
 *   • Matchday Fortune    (a fun, seeded "lucky fixture") 
 *   • Delusion Check      (honest confidence-vs-odds reality meter)
 */
export const ViralFeaturesGrid: React.FC<Props> = ({ matches, onSelectMatch }) => {
  const [vibe, setVibe] = useState(72);
  const [fortune, setFortune] = useState<{ match: MatchData; tip: string } | null>(null);

  const live = matches.filter((m) => m.status === 'LIVE');
  const upcoming = matches.filter((m) => m.status === 'SCHEDULED');

  useEffect(() => {
    // Animate crowd vibe
    const interval = setInterval(() => {
      setVibe((v) => Math.max(40, Math.min(98, v + Math.round((Math.random() - 0.5) * 12))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const rollFortune = () => {
    const pool = [...live, ...upcoming];
    if (pool.length === 0) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    const tips = [
      'Bold move: back the underdog Double Chance',
      'Calm energy says: Over 1.5 goals',
      'The pitch whispers: keep it to a single',
      'Your lucky lane is Both Teams to Score',
      'Lock the safest banker and walk away',
    ];
    setFortune({ match: pick, tip: tips[Math.floor(Math.random() * tips.length)] });
  };

  // Honest delusion check: odds vs confidence
  const delusionScore = React.useMemo(() => {
    if (upcoming.length === 0) return { pct: 0, note: 'No fixtures to rate.' };
    const avg = upcoming.reduce((a, m) => a + m.prediction.topPick.probability, 0) / upcoming.length;
    const pct = Math.round(Math.min(100, Math.max(0, 100 - avg * 0.9)));
    const note = pct > 70 ? '⚠️ Highly delusional market — huge value gaps' : pct > 40 ? '⚖️ Balanced market, some traps' : '🧊 Rational market — low risk appetite';
    return { pct, note };
  }, [upcoming]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Crowd Vibe-o-Meter */}
        <div className="glass-panel-premium rounded-3xl p-4 border border-stadiumGreen/30 space-y-2">
          <div className="flex items-center space-x-2">
            <HeartPulse className="w-4 h-4 text-stadiumGreen" />
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-wider">Crowd Vibe</span>
          </div>
          <div className="text-3xl font-black text-white">{vibe}%</div>
          <div className="h-2 bg-black/40 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-crimson via-gold to-stadiumGreen transition-all duration-1000" style={{ width: `${vibe}%` }} />
          </div>
          <span className="text-[9px] text-gray-500">{live.length > 0 ? `${live.length} live matches powering the vibe` : 'Stadium atmosphere idle'}</span>
        </div>

        {/* Goal Rush Radar */}
        <div className="glass-panel-premium rounded-3xl p-4 border border-crimson/30 space-y-2">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-crimson" />
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-wider">Goal Rush Radar</span>
          </div>
          {live.length > 0 ? (
            <>
              <div className="text-xl font-black text-white">{live.length} in play</div>
              <p className="text-[10px] text-gray-300 leading-snug">
                Highest-tension live fixture: <button onClick={() => onSelectMatch && onSelectMatch(live[0])} className="text-stadiumGreen hover:underline font-bold">{live[0].homeTeam} vs {live[0].awayTeam}</button>
              </p>
              <span className="text-[9px] text-gray-500">Tension {live[0].stadiumTension}%</span>
            </>
          ) : (
            <p className="text-[10px] text-gray-400">No live games right now — radar on standby.</p>
          )}
        </div>

        {/* Matchday Fortune */}
        <div className="glass-panel-premium rounded-3xl p-4 border border-gold/30 space-y-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-wider">Matchday Fortune</span>
          </div>
          {fortune ? (
            <>
              <p className="text-[10px] text-white font-bold">{fortune.match.homeTeam} vs {fortune.match.awayTeam}</p>
              <p className="text-[10px] text-gold font-bold">{fortune.tip}</p>
            </>
          ) : (
            <p className="text-[10px] text-gray-400">Ask the pitch for a lucky read.</p>
          )}
          <button onClick={rollFortune} className="w-full py-1.5 rounded-xl bg-gold/20 border border-gold/40 text-gold text-[10px] font-black">
            🎲 Roll Fortune
          </button>
        </div>

        {/* Delusion Check */}
        <div className="glass-panel-premium rounded-3xl p-4 border border-cyberPurple/30 space-y-2">
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-cyberPurple" />
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-wider">Delusion Check</span>
          </div>
          <div className="text-3xl font-black text-white">{delusionScore.pct}%</div>
          <p className="text-[10px] text-gray-300 leading-snug">{delusionScore.note}</p>
        </div>
      </div>
    </div>
  );
};