'use client';

import React from 'react';
import { MatchData } from '../lib/sports-api';
import { Award, Star } from 'lucide-react';

interface RatingsProps {
  match: MatchData;
}

export const LivePlayerRatingsMatrix: React.FC<RatingsProps> = ({ match }) => {
  
  const homeStarters = match.lineups?.homeStartingXI?.length ? match.lineups.homeStartingXI : [`${match.homeTeam} Captain`, 'Forward', 'Midfielder', 'Goalkeeper'];
  const awayStarters = match.lineups?.awayStartingXI?.length ? match.lineups.awayStartingXI : [`${match.awayTeam} Star`, 'Forward', 'Midfielder', 'Goalkeeper'];

  const homeRatings = homeStarters.slice(0, 4).map((name, i) => ({
    name,
    pos: i === 0 ? 'FW' : i === 1 ? 'MF' : i === 2 ? 'DF' : 'GK',
    rating: parseFloat((7.2 + ((match.homeScore * 0.5 + i * 0.3) % 2.5)).toFixed(1)),
    motm: i === 0 && match.homeScore >= match.awayScore,
  }));

  const awayRatings = awayStarters.slice(0, 4).map((name, i) => ({
    name,
    pos: i === 0 ? 'FW' : i === 1 ? 'MF' : i === 2 ? 'DF' : 'GK',
    rating: parseFloat((6.8 + ((match.awayScore * 0.5 + i * 0.3) % 2.5)).toFixed(1)),
    motm: i === 0 && match.awayScore > match.homeScore,
  }));


  

  return (
    <div className="p-4 rounded-2xl bg-black/70 border border-white/10 space-y-3 font-mono text-xs text-white">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center space-x-2">
          <Award className="w-4 h-4 text-gold" />
          <h4 className="font-black text-xs text-white">LIVE ALGORITHMIC PLAYER RATINGS (1.0 - 10.0)</h4>
        </div>
        <span className="text-[10px] text-stadiumGreen font-bold">Mivaj Pro Analytics</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Home Players */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
          <span className="font-black text-stadiumGreen text-[11px] block">{match.homeTeam} Squad</span>
          {homeRatings.map((p, i) => (
            <div key={i} className="flex items-center justify-between text-[11px]">
              <span className="text-gray-300 truncate">
                <strong className="text-gray-500 mr-1">{p.pos}</strong> {p.name}
              </span>
              <span className={`px-2 py-0.5 rounded-lg font-black text-[10px] flex items-center space-x-1 ${
                p.rating >= 8.0 ? 'bg-stadiumGreen text-black' : 'bg-white/10 text-white'
              }`}>
                {p.motm && <Star className="w-2.5 h-2.5 fill-black mr-0.5" />}
                <span>{p.rating.toFixed(1)}</span>
              </span>
            </div>
          ))}
        </div>

        {/* Away Players */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
          <span className="font-black text-cyan-400 text-[11px] block">{match.awayTeam} Squad</span>
          {awayRatings.map((p, i) => (
            <div key={i} className="flex items-center justify-between text-[11px]">
              <span className="text-gray-300 truncate">
                <strong className="text-gray-500 mr-1">{p.pos}</strong> {p.name}
              </span>
              <span className={`px-2 py-0.5 rounded-lg font-black text-[10px] ${
                p.rating >= 8.0 ? 'bg-stadiumGreen text-black' : 'bg-white/10 text-white'
              }`}>
                {p.rating.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
