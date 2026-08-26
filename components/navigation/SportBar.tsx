'use client';

import React from 'react';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { stadiumAudio } from '../../lib/sound-synthesizer';

export type SportFilterType = 'ALL' | 'SOCCER' | 'BASKETBALL' | 'COMBAT' | 'TENNIS' | 'AMERICAN_FOOTBALL';

interface SportBarProps {
  activeSport: SportFilterType;
  counts: Record<SportFilterType, number>;
  onSelectSport: (sport: SportFilterType) => void;
}

export const SportBar: React.FC<SportBarProps> = ({
  activeSport,
  counts,
  onSelectSport,
}) => {
  const sports: { id: SportFilterType; label: string; icon: string }[] = [
    { id: 'ALL', label: 'All Sports', icon: '🌍' },
    { id: 'SOCCER', label: 'Football', icon: '⚽' },
    { id: 'BASKETBALL', label: 'Basketball', icon: '🏀' },
    { id: 'COMBAT', label: 'UFC / MMA', icon: '🥊' },
    { id: 'TENNIS', label: 'Tennis', icon: '🎾' },
    { id: 'AMERICAN_FOOTBALL', label: 'NFL', icon: '🏈' },
  ];

  return (
    <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-2 font-mono text-xs select-none">
      {sports.map((s) => {
        const isActive = activeSport === s.id;
        const count = counts[s.id] ?? 0;

        return (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              onSelectSport(s.id);
              try { phoneHardware.triggerHaptic('SELECTION'); } catch {}
              try { stadiumAudio.playTabClickSound(); } catch {}
            }}
            className={`px-4 py-2.5 rounded-2xl whitespace-nowrap font-black transition-all duration-200 flex items-center space-x-2 cursor-pointer shadow-md active:scale-95 ${
              isActive
                ? 'bg-stadiumGreen text-black font-extrabold shadow-[0_0_20px_rgba(16,185,129,0.5)] ring-2 ring-stadiumGreen scale-105'
                : 'bg-[#0f1420] text-gray-300 hover:text-white hover:bg-white/10 border border-white/10'
            }`}
          >
            <span className="text-sm">{s.icon}</span>
            <span>{s.label}</span>
            {count > 0 && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  isActive ? 'bg-black/25 text-black' : 'bg-white/10 text-stadiumGreen'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
