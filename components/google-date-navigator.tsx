'use client';

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface GoogleDateNavigatorProps {
  onSelectDate: (filterType: 'PLAYED' | 'UPCOMING' | 'LIVE' | 'ALL', label: string) => void;
}

export const GoogleDateNavigator: React.FC<GoogleDateNavigatorProps> = ({ onSelectDate }) => {
  const [selectedKey, setSelectedKey] = useState<string>('TODAY');

  const days = useMemo(() => {
    const now = new Date();
    const fmt = (d: Date) =>
      d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    const make = (offset: number) => { const d = new Date(now); d.setDate(now.getDate() + offset); return d; };
    return [
      { key: 'DAY_MINUS2', label: fmt(make(-2)), subLabel: 'Earlier', filter: 'PLAYED' as const },
      { key: 'YESTERDAY', label: 'Yesterday', subLabel: fmt(make(-1)), filter: 'PLAYED' as const },
      { key: 'TODAY', label: '⚡ Today', subLabel: fmt(now), filter: 'ALL' as const, isToday: true },
      { key: 'TOMORROW', label: 'Tomorrow', subLabel: fmt(make(1)), filter: 'UPCOMING' as const },
      { key: 'DAY_PLUS2', label: fmt(make(2)), subLabel: 'Ahead', filter: 'UPCOMING' as const },
    ];
  }, []);

  const handleSelect = (key: string, filter: 'PLAYED' | 'UPCOMING' | 'LIVE' | 'ALL', label: string) => {
    setSelectedKey(key);
    onSelectDate(filter, label);
  };

  return (
    <div className="bg-panel/90 border border-white/10 p-2.5 rounded-2xl flex items-center justify-between font-mono text-xs shadow-lg">
      <button onClick={() => { const p = days.find(d => d.key === 'YESTERDAY'); if (p) handleSelect(p.key, p.filter, p.label); }}
        className="p-1.5 rounded-xl bg-black/50 hover:bg-stadiumGreen/20 text-gray-400 hover:text-stadiumGreen border border-white/5 transition-all flex-shrink-0">
        <ChevronLeft className="w-4 h-4" />
      </button>
      <div className="flex items-center space-x-1.5 overflow-x-auto px-2 scrollbar-hide flex-1">
        {days.map((item) => (
          <button key={item.key} onClick={() => handleSelect(item.key, item.filter, item.label)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all text-center flex flex-col items-center whitespace-nowrap flex-shrink-0 ${
              selectedKey === item.key
                ? (item.isToday ? 'bg-stadiumGreen text-black shadow-md font-black' : 'bg-white/20 text-white font-black border border-white/30')
                : 'bg-black/40 text-gray-400 hover:text-white border border-white/5'
            }`}>
            <span>{item.label}</span>
            <span className="text-[9px] opacity-70 font-normal mt-0.5">{item.subLabel}</span>
          </button>
        ))}
      </div>
      <div className="flex items-center space-x-1 flex-shrink-0">
        <button onClick={() => { const n = new Date(); const v = prompt('Date (YYYY-MM-DD):', n.toISOString().split('T')[0]); if (v) onSelectDate('ALL', v); }}
          className="p-1.5 rounded-xl bg-black/50 hover:bg-gold/20 text-gold border border-white/5 transition-all" title="Pick date">
          <Calendar className="w-4 h-4" />
        </button>
        <button onClick={() => { const n = days.find(d => d.key === 'TOMORROW'); if (n) handleSelect(n.key, n.filter, n.label); }}
          className="p-1.5 rounded-xl bg-black/50 hover:bg-stadiumGreen/20 text-gray-400 hover:text-stadiumGreen border border-white/5 transition-all">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
