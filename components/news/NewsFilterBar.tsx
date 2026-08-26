'use client';

import React from 'react';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { stadiumAudio } from '../../lib/sound-synthesizer';

interface NewsFilterBarProps {
  categories: { id: string; label: string; count: number }[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

export const NewsFilterBar: React.FC<NewsFilterBarProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-2 font-mono text-xs">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => {
              phoneHardware.triggerHaptic('SELECTION');
              stadiumAudio.playTabClickSound();
              onSelectCategory(cat.id);
            }}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-black transition-all duration-300 flex items-center space-x-1.5 ${
              isActive
                ? 'bg-emerald-500 text-black font-bold shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                : 'bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08] border border-white/5'
            }`}
          >
            <span>{cat.label}</span>
            {cat.count > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-gray-400'}`}>
                ({cat.count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
