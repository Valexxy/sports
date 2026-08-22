'use client';

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useTranslation } from '../lib/translation-engine';

interface GoogleDateNavigatorProps {
  onSelectDate: (dateStr: string, label: string, isToday: boolean) => void;
}

export const GoogleDateNavigator: React.FC<GoogleDateNavigatorProps> = ({ onSelectDate }) => {
  const { t } = useTranslation();
  const [selectedKey, setSelectedKey] = useState<string>('TODAY');

  const days = useMemo(() => {
    const now = new Date();
    const fmt = (d: Date) =>
      d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    const toIso = (d: Date) => d.toISOString().split('T')[0];

    const make = (offset: number) => {
      const d = new Date(now);
      d.setDate(now.getDate() + offset);
      return d;
    };

    const dMinus2 = make(-2);
    const dMinus1 = make(-1);
    const dToday = now;
    const dPlus1 = make(1);
    const dPlus2 = make(2);

    return [
      { key: 'DAY_MINUS2', label: fmt(dMinus2), subLabel: 'Earlier', dateStr: toIso(dMinus2), isToday: false },
      { key: 'YESTERDAY', label: 'Yesterday', subLabel: fmt(dMinus1), dateStr: toIso(dMinus1), isToday: false },
      { key: 'TODAY', label: '⚡ Today', subLabel: fmt(dToday), dateStr: toIso(dToday), isToday: true },
      { key: 'TOMORROW', label: 'Tomorrow', subLabel: fmt(dPlus1), dateStr: toIso(dPlus1), isToday: false },
      { key: 'DAY_PLUS2', label: fmt(dPlus2), subLabel: 'Ahead', dateStr: toIso(dPlus2), isToday: false },
    ];
  }, []);

  const handleSelect = (key: string, dateStr: string, label: string, isToday: boolean) => {
    setSelectedKey(key);
    onSelectDate(dateStr, label, isToday);
  };

  return (
    <div className="bg-panel/90 border border-white/10 p-2.5 rounded-2xl flex items-center justify-between font-mono text-xs shadow-lg">
      <button
        onClick={() => {
          const p = days.find((d) => d.key === 'YESTERDAY');
          if (p) handleSelect(p.key, p.dateStr, p.label, p.isToday);
        }}
        className="p-1.5 rounded-xl bg-black/50 hover:bg-stadiumGreen/20 text-gray-400 hover:text-stadiumGreen border border-white/5 transition-all flex-shrink-0"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="flex items-center space-x-1.5 overflow-x-auto px-2 scrollbar-none flex-1">
        {days.map((item) => (
          <button
            key={item.key}
            onClick={() => handleSelect(item.key, item.dateStr, item.label, item.isToday)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all text-center flex flex-col items-center whitespace-nowrap flex-shrink-0 ${
              selectedKey === item.key
                ? item.isToday
                  ? 'bg-stadiumGreen text-black shadow-lg shadow-stadiumGreen/20 font-black'
                  : 'bg-gold text-black shadow-lg shadow-gold/20 font-black'
                : 'bg-black/40 text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            <span>{item.label === '⚡ Today' ? `⚡ ${t('Today')}` : t(item.label)}</span>
            <span className="text-[9px] opacity-80 font-normal mt-0.5">{t(item.subLabel)}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center space-x-1 flex-shrink-0">
        <button
          onClick={() => {
            const n = new Date();
            const v = prompt('Select Date (YYYY-MM-DD):', n.toISOString().split('T')[0]);
            if (v && v.match(/^\d{4}-\d{2}-\d{2}$/)) {
              onSelectDate(v, v, v === n.toISOString().split('T')[0]);
            }
          }}
          className="p-1.5 rounded-xl bg-black/50 hover:bg-gold/20 text-gold border border-white/5 transition-all"
          title="Pick custom date"
        >
          <Calendar className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            const n = days.find((d) => d.key === 'TOMORROW');
            if (n) handleSelect(n.key, n.dateStr, n.label, n.isToday);
          }}
          className="p-1.5 rounded-xl bg-black/50 hover:bg-stadiumGreen/20 text-gray-400 hover:text-stadiumGreen border border-white/5 transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
