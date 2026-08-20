'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface GoogleDateNavigatorProps {
  onSelectDate: (filterType: 'ALL' | 'PLAYED' | 'UPCOMING' | 'LIVE', label: string) => void;
}

export const GoogleDateNavigator: React.FC<GoogleDateNavigatorProps> = ({ onSelectDate }) => {
  const [selectedDay, setSelectedDay] = useState<'YESTERDAY' | 'TODAY' | 'TOMORROW' | 'WEEKEND'>('TODAY');

  const days = [
    { key: 'YESTERDAY', label: 'Yesterday', date: 'Aug 19', filter: 'PLAYED' as const },
    { key: 'TODAY', label: 'Today (Live)', date: 'Aug 20', filter: 'ALL' as const },
    { key: 'TOMORROW', label: 'Tomorrow', date: 'Aug 21', filter: 'UPCOMING' as const },
    { key: 'WEEKEND', label: 'Saturday', date: 'Aug 22', filter: 'UPCOMING' as const },
  ] as const;

  const handleSelect = (key: 'YESTERDAY' | 'TODAY' | 'TOMORROW' | 'WEEKEND', filter: 'ALL' | 'PLAYED' | 'UPCOMING' | 'LIVE', label: string) => {
    setSelectedDay(key);
    onSelectDate(filter, label);
  };

  return (
    <div className="bg-panel/90 border border-white/10 p-2.5 rounded-2xl flex items-center justify-between font-mono text-xs shadow-lg">
      
      {/* Previous Arrow */}
      <button
        onClick={() => handleSelect('YESTERDAY', 'PLAYED', 'Yesterday')}
        className="p-1.5 rounded-xl bg-black/50 hover:bg-stadiumGreen/20 text-gray-400 hover:text-stadiumGreen border border-white/5 transition-all"
        title="Yesterday (Settled Matches)"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Date Selector Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto px-2">
        {days.map((item) => (
          <button
            key={item.key}
            onClick={() => handleSelect(item.key, item.filter, item.label)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all text-center flex flex-col items-center whitespace-nowrap ${
              selectedDay === item.key
                ? 'bg-stadiumGreen text-black shadow-md shadow-stadiumGreen/20 font-black'
                : 'bg-black/40 text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            <span>{item.label}</span>
            <span className="text-[9px] opacity-80 font-normal">{item.date}</span>
          </button>
        ))}
      </div>

      {/* Calendar Date Picker Button & Next Arrow */}
      <div className="flex items-center space-x-1">
        <button
          onClick={() => {
            const chosen = prompt('Enter fixture date (e.g. 2026-08-25):', '2026-08-25');
            if (chosen) onSelectDate('ALL', chosen);
          }}
          className="p-1.5 rounded-xl bg-black/50 hover:bg-gold/20 text-gold border border-white/5 transition-all flex items-center space-x-1"
          title="Open Calendar Date Picker"
        >
          <Calendar className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleSelect('TOMORROW', 'UPCOMING', 'Tomorrow')}
          className="p-1.5 rounded-xl bg-black/50 hover:bg-stadiumGreen/20 text-gray-400 hover:text-stadiumGreen border border-white/5 transition-all"
          title="Tomorrow (Upcoming Fixtures)"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
