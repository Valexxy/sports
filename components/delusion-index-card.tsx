'use client';

import React from 'react';
import { Flame, Brain, AlertTriangle } from 'lucide-react';

interface DelusionIndexProps {
  homeTeam: string;
  awayTeam: string;
  mathWinProbPercent: number; // e.g. 74%
  communityHypePercent: number; // e.g. 96%
  league?: string;
  status?: string;
}

export const DelusionIndexCard: React.FC<DelusionIndexProps> = ({
  homeTeam,
  awayTeam,
  mathWinProbPercent,
  communityHypePercent,
  league = 'Premier League',
  status = 'LIVE',
}) => {
  const delusionGap = Math.abs(communityHypePercent - mathWinProbPercent);
  const isHighDelusion = delusionGap >= 15;

  return (
    <div className="p-4 rounded-3xl glass-panel-premium border border-stadiumGreen/40 space-y-3 font-mono text-xs shadow-xl">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyberPurple/20 text-cyberPurple border border-cyberPurple/40">
            <Brain className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-white text-xs">THE DELUSION INDEX 🧠</span>
        </div>

        {isHighDelusion ? (
          <span className="px-2 py-0.5 rounded-full bg-crimson text-white font-black text-[9px] flex items-center space-x-1 animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            <span>HIGH DELUSION GAP ({delusionGap}%)</span>
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full bg-stadiumGreen/20 text-stadiumGreen font-bold text-[9px] border border-stadiumGreen/30">
            BALANCED SENTIMENT
          </span>
        )}
      </div>

      <p className="text-[11px] text-gray-300 font-sans">
        Comparing Poisson Dixon-Coles mathematical win probability against fan community hype for <strong className="text-white">{homeTeam} vs {awayTeam}</strong> ({league}).
      </p>

      {/* Bar Comparison */}
      <div className="space-y-2 pt-1">
        
        {/* Math Win Prob */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px]">
            <span className="text-stadiumGreen font-bold flex items-center space-x-1">
              <Brain className="w-3 h-3" />
              <span>COLD HARD ALGORITHM MATH:</span>
            </span>
            <span className="text-white font-black">{mathWinProbPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
            <div className="h-full bg-stadiumGreen transition-all duration-500" style={{ width: `${Math.min(100, Math.max(5, mathWinProbPercent))}%` }}></div>
          </div>
        </div>

        {/* Community Hype */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px]">
            <span className="text-gold font-bold flex items-center space-x-1">
              <Flame className="w-3 h-3 text-crimson" />
              <span>COMMUNITY FAN EMOTIONAL HYPE:</span>
            </span>
            <span className="text-gold font-black">{communityHypePercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
            <div className="h-full bg-gold transition-all duration-500" style={{ width: `${Math.min(100, Math.max(5, communityHypePercent))}%` }}></div>
          </div>
        </div>

      </div>

    </div>
  );
};
