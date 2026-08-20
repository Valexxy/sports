'use client';

import React, { useState } from 'react';
import { generateDynamicTriggerUpdates, TriggerUpdate } from './broadcast-ticker';
import { MatchData } from '../lib/sports-api';
import { Zap, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

interface TriggerUpdatesSectionProps {
  matches?: MatchData[];
  onSelectUpdate?: (update: TriggerUpdate) => void;
}

export const TriggerUpdatesSection: React.FC<TriggerUpdatesSectionProps> = ({ matches = [], onSelectUpdate }) => {
  const updates = generateDynamicTriggerUpdates(matches).slice(0, 4);
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-panel/60 border border-white/10 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3 font-mono text-xs">
      
      {/* Header with Collapsible Toggle */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-crimson/20 text-crimson border border-crimson/40">
            <Zap className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs sm:text-sm text-white">HIGH-TRIGGER REAL MATCH UPDATES</h3>
            <p className="text-[10px] text-gray-400 font-sans">Live score alerts, settled outcomes, and mathematical banker updates</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="hidden sm:inline text-[10px] text-stadiumGreen font-bold px-2 py-1 rounded bg-stadiumGreen/20 border border-stadiumGreen/40">
            REAL FEED ⚡
          </span>
          <div className="flex items-center space-x-1 text-gray-400 text-xs font-bold">
            <span className="hidden sm:inline">{isOpen ? 'Collapse' : 'Expand'}</span>
            {isOpen ? <ChevronUp className="w-4 h-4 text-stadiumGreen" /> : <ChevronDown className="w-4 h-4 text-gold" />}
          </div>
        </div>
      </div>

      {/* High-Trigger Updates Cards (Collapsible) */}
      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-white/5 animate-fadeIn">
          {updates.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectUpdate && onSelectUpdate(item)}
              className="p-3.5 rounded-2xl bg-panel hover:bg-panel/80 border border-white/10 hover:border-stadiumGreen/40 transition-all cursor-pointer flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded font-black text-[10px] uppercase ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  <span className="text-[10px] text-gray-500">{item.timeAgo}</span>
                </div>

                <h4 className="font-black text-white text-xs group-hover:text-stadiumGreen transition-all">
                  {item.matchTitle}
                </h4>
                <p className="text-gray-300 font-sans text-xs mt-1 leading-snug line-clamp-2">
                  {item.text}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-stadiumGreen font-bold group-hover:underline">
                <span>Inspect Match</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
