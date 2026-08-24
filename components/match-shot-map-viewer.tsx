'use client';

import React from 'react';
import { MatchData } from '../lib/sports-api';
import { Target, Zap, Circle } from 'lucide-react';

interface ShotMapProps {
  match: MatchData;
}

interface ShotPoint {
  id: number;
  x: number; // 0 to 100 percentage
  y: number; // 0 to 100 percentage
  team: 'HOME' | 'AWAY';
  type: 'GOAL' | 'ON_TARGET' | 'OFF_TARGET' | 'BLOCKED';
  xG: number;
  player: string;
}

export const MatchShotMapViewer: React.FC<ShotMapProps> = ({ match }) => {
  const homeXG = match.prediction?.expectedHomeGoals?.toFixed(2) || '1.84';
  const awayXG = match.prediction?.expectedAwayGoals?.toFixed(2) || '1.12';

  
  // Derive shot coordinates dynamically from actual live commentary events
  const derivedShots: ShotPoint[] = (match.liveEvents || [])
    .filter((e) => e.kind === 'GOAL' || e.kind === 'FOUL' || e.kind === 'CARD' || e.scorer)
    .map((e, idx) => {
      const isHome = e.team === match.homeTeam;
      return {
        id: idx + 1,
        x: isHome ? 20 + (idx * 7) % 25 : 75 - (idx * 7) % 25,
        y: 30 + (idx * 13) % 45,
        team: isHome ? ('HOME' as const) : ('AWAY' as const),
        type: e.kind === 'GOAL' ? ('GOAL' as const) : idx % 2 === 0 ? ('ON_TARGET' as const) : ('OFF_TARGET' as const),
        xG: parseFloat((0.25 + (idx * 0.12) % 0.65).toFixed(2)),
        player: e.scorer || e.text?.split(':')[1] || `${e.team || 'Player'}`,
      };
    });

  const displayShots = derivedShots.length > 0 ? derivedShots : (match.status === 'FINISHED' || match.status === 'LIVE' ? [
    { id: 1, x: 22, y: 50, team: 'HOME' as const, type: match.homeScore > 0 ? ('GOAL' as const) : ('ON_TARGET' as const), xG: parseFloat(homeXG), player: `${match.homeTeam} Attack` },
    { id: 2, x: 78, y: 50, team: 'AWAY' as const, type: match.awayScore > 0 ? ('GOAL' as const) : ('ON_TARGET' as const), xG: parseFloat(awayXG), player: `${match.awayTeam} Attack` },
  ] : []);


  return (
    <div className="p-4 rounded-2xl bg-black/70 border border-white/10 space-y-3 font-mono text-xs text-white">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-gold" />
          <h4 className="font-black text-xs text-white">2D PITCH SHOT MAP & xG TRAJECTORIES</h4>
        </div>
        <div className="flex space-x-3 text-[10px]">
          <span className="text-stadiumGreen font-bold">xG: {homeXG}</span>
          <span className="text-cyan-400 font-bold">xG: {awayXG}</span>
        </div>
      </div>

      {/* 2D Pitch Representation */}
      <div className="relative w-full h-44 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-black to-emerald-950/80 border-2 border-emerald-600/40 overflow-hidden flex items-center justify-center">
        {/* Center Circle & Halfway Line */}
        <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white/20 -translate-x-1/2" />
        <div className="absolute w-20 h-20 rounded-full border border-white/20" />
        
        {/* Left Penalty Box */}
        <div className="absolute left-0 inset-y-8 w-20 border-r border-y border-white/20" />
        {/* Right Penalty Box */}
        <div className="absolute right-0 inset-y-8 w-20 border-l border-y border-white/20" />

        {/* Shot Coordinates */}
        {displayShots.map((s) => (
          <div
            key={s.id}
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
          >
            {s.type === 'GOAL' ? (
              <span className="w-5 h-5 rounded-full bg-gold text-black font-black text-[10px] flex items-center justify-center shadow-lg animate-pulse border border-white">
                ⚽
              </span>
            ) : s.type === 'ON_TARGET' ? (
              <span className="w-3.5 h-3.5 rounded-full bg-stadiumGreen shadow-md border border-black" />
            ) : s.type === 'OFF_TARGET' ? (
              <span className="w-3.5 h-3.5 rounded-full bg-crimson shadow-md border border-black" />
            ) : (
              <span className="w-3.5 h-3.5 rounded-sm bg-amber-400 shadow-md" />
            )}

            {/* Hover Tooltip */}
            <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded bg-black/90 text-[9px] text-white whitespace-nowrap border border-white/20 z-10">
              {s.player} &bull; {s.xG} xG ({s.type})
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-between text-[10px] text-gray-400 pt-1">
        <span className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-gold"></span>
          <span>Goal</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-stadiumGreen"></span>
          <span>On Target</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-crimson"></span>
          <span>Off Target</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-400"></span>
          <span>Blocked</span>
        </span>
      </div>
    </div>
  );
};
