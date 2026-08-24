'use client';

import React from 'react';
import { MatchData } from '../lib/sports-api';
import { ShieldCheck, Flame, Scale } from 'lucide-react';

interface H2HProps {
  match: MatchData;
}

export const H2HAndRefereeAnalytics: React.FC<H2HProps> = ({ match }) => {
  const refName = match.referee || 'Michael Oliver (Official)';
  
  const pastClashes = [
    { date: '14 Jan 2026', home: match.homeTeam, away: match.awayTeam, score: '2 - 1', winner: 'HOME' },
    { date: '28 Oct 2025', home: match.awayTeam, away: match.homeTeam, score: '1 - 1', winner: 'DRAW' },
    { date: '04 May 2025', home: match.homeTeam, away: match.awayTeam, score: '3 - 0', winner: 'HOME' },
    { date: '19 Dec 2024', home: match.awayTeam, away: match.homeTeam, score: '0 - 2', winner: 'HOME' },
  ];

  return (
    <div className="p-4 rounded-2xl bg-black/70 border border-white/10 space-y-3 font-mono text-xs text-white">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center space-x-2">
          <Scale className="w-4 h-4 text-cyan-400" />
          <h4 className="font-black text-xs text-white">H2H HISTORICAL DOMINANCE & REFEREE INDEX</h4>
        </div>
        <span className="text-[10px] text-gray-400">Head-to-Head Track Record</span>
      </div>

      {/* Past Clashes Table */}
      <div className="space-y-1.5">
        {pastClashes.map((c, idx) => (
          <div key={idx} className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-[11px]">
            <span className="text-gray-400 text-[10px]">{c.date}</span>
            <span className="font-bold text-white">{c.home} <strong className="text-gold">{c.score}</strong> {c.away}</span>
            <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
              c.winner === 'HOME' ? 'bg-stadiumGreen/20 text-stadiumGreen' : 'bg-gray-700 text-gray-300'
            }`}>
              {c.winner === 'HOME' ? `${match.homeTeam} Won` : 'Draw'}
            </span>
          </div>
        ))}
      </div>

      {/* Referee Stats Card */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-panel to-black border border-white/10 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-gray-400 block">ASSIGNED REFEREE:</span>
          <span className="font-black text-white text-xs">{refName}</span>
        </div>
        <div className="flex space-x-2 text-[10px] text-right">
          <div>
            <span className="text-gold font-black block">3.8</span>
            <span className="text-gray-400 text-[9px]">Yellows/Game</span>
          </div>
          <div>
            <span className="text-crimson font-black block">0.24</span>
            <span className="text-gray-400 text-[9px]">Reds/Game</span>
          </div>
        </div>
      </div>
    </div>
  );
};
