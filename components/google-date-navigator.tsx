'use client';

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Sparkles } from 'lucide-react';
import { useTranslation } from '../lib/translation-engine';

interface GoogleDateNavigatorProps {
  onSelectDate: (dateStr: string, label: string, isToday: boolean, isPast: boolean) => void;
}

export const GoogleDateNavigator: React.FC<GoogleDateNavigatorProps> = ({ onSelectDate }) => {
  const { t } = useTranslation();
  const [dayOffset, setDayOffset] = useState<number>(0);
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => new Date().toISOString().split('T')[0]);

  const { days, rangeLabel } = useMemo(() => {
    const today = new Date();
    const todayIso = today.toISOString().split('T')[0];

    const weekDays = [];
    const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const FULL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Generate 7 days around the current offset: 3 past days, Today, 3 future days
    for (let i = -3; i <= 3; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + dayOffset + i);

      const dIso = d.toISOString().split('T')[0];
      const isToday = dIso === todayIso;
      const isPast = d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const dayNum = d.getDate();
      const monthStr = d.toLocaleDateString('en-GB', { month: 'short' });
      const dayShort = DAY_NAMES[d.getDay()];
      const dayFull = FULL_DAYS[d.getDay()];

      weekDays.push({
        key: `day-${dIso}`,
        dayShort,
        dayFull,
        dateNum: `${dayNum} ${monthStr}`,
        dateStr: dIso,
        isToday,
        isPast,
        displayLabel: isToday ? '⚡ Today' : `${dayShort} ${dayNum}`,
      });
    }

    const startStr = weekDays[0].dateNum;
    const endStr = weekDays[6].dateNum;
    const rangeLabel = `${startStr} - ${endStr}`;

    return { days: weekDays, rangeLabel };
  }, [dayOffset]);

  const handleSelectDay = (dateStr: string, label: string, isToday: boolean, isPast: boolean) => {
    setSelectedDateStr(dateStr);
    onSelectDate(dateStr, label, isToday, isPast);
  };

  const handlePrev = () => setDayOffset((prev) => prev - 3);
  const handleNext = () => setDayOffset((prev) => prev + 3);

  const handleResetToToday = () => {
    setDayOffset(0);
    const today = new Date();
    const todayIso = today.toISOString().split('T')[0];
    setSelectedDateStr(todayIso);
    onSelectDate(todayIso, 'Today', true, false);
  };

  return (
    <div className="bg-panel/95 border border-white/10 p-2.5 sm:p-3 rounded-3xl shadow-2xl font-mono text-xs space-y-2">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-1 border-b border-white/10 pb-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-xl bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[11px] font-black text-white">{rangeLabel}</span>
            <span className="text-[9px] text-stadiumGreen font-black block">PAST RESULTS & UPCOMING FIXTURES 🇳🇬</span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          {dayOffset !== 0 && (
            <button
              onClick={handleResetToToday}
              className="px-2 py-1 rounded-xl bg-gold/20 text-gold border border-gold/40 text-[10px] font-black hover:bg-gold hover:text-black transition-all"
            >
              ⚡ {t('Today')}
            </button>
          )}

          <div className="flex items-center space-x-1">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all"
              title="Earlier Days (Past Results)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all"
              title="Later Days (Upcoming Games)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 7-Day Centered Strip */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {days.map((d) => {
          const isSelected = selectedDateStr === d.dateStr;
          return (
            <button
              key={d.key}
              onClick={() => handleSelectDay(d.dateStr, d.displayLabel, d.isToday, d.isPast)}
              className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all text-center group ${
                isSelected
                  ? 'bg-stadiumGreen text-black border-stadiumGreen shadow-lg shadow-stadiumGreen/30 scale-105 font-black z-10'
                  : d.isToday
                  ? 'bg-black/80 text-gold border-gold/50 hover:border-gold'
                  : d.isPast
                  ? 'bg-black/40 text-gray-300 border-white/5 hover:border-white/20'
                  : 'bg-black/50 text-gray-300 border-white/10 hover:border-white/30'
              }`}
            >
              <span className={`text-[9px] uppercase tracking-wider block font-sans font-bold ${
                isSelected ? 'text-black' : d.isToday ? 'text-gold' : 'text-gray-400'
              }`}>
                {d.dayShort}
              </span>
              <span className={`text-xs sm:text-sm font-black font-mono block my-0.5 ${
                isSelected ? 'text-black' : 'text-white'
              }`}>
                {d.dateNum.split(' ')[0]}
              </span>
              <span className={`text-[8px] font-black uppercase ${
                isSelected ? 'text-black/80' : d.isToday ? 'text-stadiumGreen font-black animate-pulse' : d.isPast ? 'text-cyan-400' : 'text-gray-400'
              }`}>
                {d.isToday ? 'TODAY' : d.isPast ? 'PLAYED' : 'FIXTURE'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
