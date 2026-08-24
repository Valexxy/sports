'use client';

import React from 'react';
import { MatchData } from '../lib/sports-api';
import { TrendingUp, Activity, Zap } from 'lucide-react';

interface WinProbProps {
  match: MatchData;
}

export const MatchWinProbabilityChart: React.FC<WinProbProps> = ({ match }) => {
  const homeProb = Math.round((match.prediction?.homeWinProb || 0.48) * 100);
  const drawProb = Math.round((match.prediction?.drawProb || 0.22) * 100);
  const awayProb = Math.round((match.prediction?.awayWinProb || 0.30) * 100);

  // Generate 6 chronological timeline points from 0' to 90'
  const timelinePoints = [
    { min: "0'", home: 45, away: 30 },
    { min: "20'", home: 52, away: 26 },
    { min: "45'", home: 48, away: 29 },
    { min: "60'", home: 65, away: 18 },
    { min: "75'", home: homeProb, away: awayProb },
    { min: "90'", home: homeProb, away: awayProb },
  ];

  return (
    <div className="p-4 rounded-2xl bg-black/70 border border-white/10 space-y-3 font-mono text-xs text-white">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-stadiumGreen" />
          <h4 className="font-black text-xs text-white">LIVE IN-PLAY WIN PROBABILITY (0' - 90')</h4>
        </div>
        <span className="text-[10px] text-gray-400 font-sans">Updated Per In-Play Event</span>
      </div>

      {/* Probability Distribution Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] font-black">
          <span className="text-stadiumGreen">{match.homeTeam} {homeProb}%</span>
          <span className="text-gray-400">Draw {drawProb}%</span>
          <span className="text-cyan-400">{match.awayTeam} {awayProb}%</span>
        </div>
        <div className="h-3 rounded-full bg-white/10 flex overflow-hidden border border-white/10">
          <div style={{ width: `${homeProb}%` }} className="bg-stadiumGreen h-full transition-all duration-500" />
          <div style={{ width: `${drawProb}%` }} className="bg-gray-500 h-full transition-all duration-500" />
          <div style={{ width: `${awayProb}%` }} className="bg-cyan-400 h-full transition-all duration-500" />
        </div>
      </div>

      {/* 0' to 90' Momentum Wave */}
      <div className="pt-2">
        <span className="text-[10px] text-gray-400 block mb-1 font-bold">MOMENTUM TIMELINE WAVE:</span>
        <div className="grid grid-cols-6 gap-1 text-center">
          {timelinePoints.map((pt, i) => (
            <div key={i} className="p-2 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-[9px] text-gray-400 block">{pt.min}</span>
              <span className="text-[10px] font-black text-stadiumGreen block">{pt.home}%</span>
              <span className="text-[9px] text-cyan-400 block">{pt.away}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
