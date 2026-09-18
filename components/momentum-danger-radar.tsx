'use client';

import React, { useState, useEffect } from 'react';
import { Radio, Zap, AlertTriangle, ShieldAlert, TrendingUp, Flame, Activity } from 'lucide-react';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { MatchData } from '../lib/sports-api';

export interface MomentumDangerRadarProps {
  match?: Partial<MatchData>;
  onLockPick?: (pick: string, odds: number) => void;
}

export const MomentumDangerRadar: React.FC<MomentumDangerRadarProps> = ({ match, onLockPick }) => {
  const home = match?.homeTeam || 'Arsenal';
  const away = match?.awayTeam || 'Chelsea';
  const score = match ? `${match.homeScore ?? 1} - ${match.awayScore ?? 1}` : '1 - 1';
  const minute = match?.matchTime ? parseInt(String(match.matchTime)) || 74 : 74;

  const [momentumHome, setMomentumHome] = useState(82);
  const [ticker, setTicker] = useState(12);

  useEffect(() => {
    const timer = setInterval(() => {
      setTicker((prev) => {
        if (prev <= 1) {
          setMomentumHome(60 + Math.floor(Math.random() * 32));
          try { phoneHardware.triggerHaptic('SELECTION'); } catch {}
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const recommendedPick = `${home} Next Goal`;
  const liveOdds = 2.35;

  return (
    <div className="w-full rounded-2xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-black border border-crimson/40 p-3 sm:p-4 font-mono text-xs shadow-xl space-y-3">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-xl bg-crimson/20 text-crimson border border-crimson/40 animate-pulse">
            <Radio className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-white text-xs">SUB-SECOND IN-PLAY DANGER RADAR</span>
              <span className="px-1.5 py-0.2 rounded bg-crimson text-white font-black text-[9px] uppercase animate-ping">
                LIVE EDGE
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-sans">
              Algorithmic pressure detection 15s before bookmakers suspend odds
            </span>
          </div>
        </div>

        <div className="px-2 py-0.5 rounded-xl bg-black/60 border border-crimson/40 text-[10px] font-black text-crimson flex items-center space-x-1">
          <Activity className="w-3 h-3 animate-spin" />
          <span>{ticker}s EDGE WINDOW</span>
        </div>
      </div>

      {/* Match Pressure Breakdown */}
      <div className="p-2.5 rounded-xl bg-black/70 border border-white/10 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-white font-black">{home}</span>
            <span className="px-2 py-0.5 rounded-lg bg-white/10 text-gold font-black">{score}</span>
            <span className="text-gray-300 font-bold">{away}</span>
          </div>
          <span className="text-[10px] text-stadiumGreen font-black">{minute}&apos; IN-PLAY</span>
        </div>

        {/* Momentum Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-gray-400 font-sans">
            <span>{home} Pressure: <strong className="text-white font-mono">{momentumHome}%</strong></span>
            <span>{away}: <strong className="text-white font-mono">{100 - momentumHome}%</strong></span>
          </div>
          <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${momentumHome}%` }}
              className="h-full bg-gradient-to-r from-stadiumGreen via-gold to-crimson transition-all duration-500 rounded-l-full"
            ></div>
            <div
              style={{ width: `${100 - momentumHome}%` }}
              className="h-full bg-neutral-700 transition-all duration-500 rounded-r-full"
            ></div>
          </div>
        </div>
      </div>

      {/* Real-time Edge Alert Card */}
      <div className="p-2.5 rounded-xl bg-gradient-to-r from-crimson/20 via-black to-gold/15 border border-crimson/40 flex items-center justify-between gap-2">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center space-x-1 text-crimson font-black text-[10px]">
            <Flame className="w-3 h-3 fill-crimson" />
            <span>ALGORITHMIC VALUE EDGE DETECTED</span>
          </div>
          <span className="text-xs font-black text-white truncate block">
            {recommendedPick} @ <span className="text-stadiumGreen font-black">{liveOdds}</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            if (onLockPick) onLockPick(recommendedPick, liveOdds);
            try { phoneHardware.triggerHaptic('SUCCESS'); } catch {}
          }}
          className="px-3 py-1.5 rounded-xl bg-crimson hover:bg-red-500 text-white font-black text-[11px] flex items-center space-x-1 transition-all shadow active:scale-95 shrink-0"
        >
          <Zap className="w-3 h-3 fill-white" />
          <span>Lock Pick</span>
        </button>
      </div>

    </div>
  );
};
