'use client';

import React, { useState } from 'react';
import { RosterPlayer } from '../../services/ingestion/espnAdapter';

interface PlayerTooltipProps {
  player: RosterPlayer;
  children: React.ReactNode;
}

export const PlayerTooltip: React.FC<PlayerTooltipProps> = ({ player, children }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered(!isHovered)}
    >
      {children}

      {isHovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-56 p-3 rounded-2xl bg-black/95 border border-stadiumGreen/60 shadow-2xl backdrop-blur-xl animate-fadeIn font-mono text-xs text-white glow-emerald">
          <div className="flex items-center space-x-2.5 border-b border-white/10 pb-2">
            <div className="w-9 h-9 rounded-xl bg-panel border border-stadiumGreen/40 flex items-center justify-center text-lg flex-shrink-0">
              {player.photo}
            </div>
            <div className="overflow-hidden">
              <div className="font-black text-xs text-white truncate">{player.name}</div>
              <div className="text-[10px] text-stadiumGreen font-bold flex items-center space-x-1">
                <span>#{player.jersey}</span>
                <span>&bull;</span>
                <span>{player.position}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 py-2 border-b border-white/10 text-[10px]">
            <div>
              <span className="text-gray-400 block font-sans">Goals</span>
              <span className="font-black text-gold font-mono">{player.goals}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-sans">Assists</span>
              <span className="font-black text-cyan-300 font-mono">{player.assists}</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-[9px]">
            <span className="text-gray-400">5-Match Form:</span>
            <div className="flex space-x-0.5">
              {player.form.map((f, i) => (
                <span
                  key={i}
                  className={`w-3.5 h-3.5 rounded text-[8px] font-black flex items-center justify-center ${
                    f === 'W' ? 'bg-stadiumGreen text-black' : f === 'D' ? 'bg-gray-600 text-white' : 'bg-crimson text-white'
                  }`}
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
