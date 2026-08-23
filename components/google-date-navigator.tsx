'use client';
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Sparkles } from 'lucide-react';
import { useTranslation } from '../lib/translation-engine';

interface GoogleDateNavigatorProps {
  onSelectDate: (dateStr: string, label: string, isToday: boolean) => void;
}

export const GoogleDateNavigator: React.FC<GoogleDateNavigatorProps> = ({ onSelectDate }) => {
  const { t } = useTranslation();
  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => new Date().toISOString().split('T')[0]);

  const { days, weekLabel } = useMemo(() => {
    const today = new Date();
    const todayIso = today.toISOString().split('T')[0];

    // Find Sunday of the current week (Sunday = 0)
    const currentDayOfWeek = today.getDay(); // 0 is Sunday, 6 is Saturday
    const sundayDate = new Date(today);
    sundayDate.setDate(today.getDate() - currentDayOfWeek + weekOffset * 7);

    const weekDays = [];
    const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const FULL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(sundayDate);
      d.setDate(sundayDate.getDate() + i);

      const dIso = d.toISOString().split('T')[0];
      const isToday = dIso === todayIso;
      const dayNum = d.getDate();
      const monthStr = d.toLocaleDateString('en-GB', { month: 'short' });
      const dayShort = DAY_NAMES[i];
      const dayFull = FULL_DAYS[i];

      weekDays.push({
        key: `day-${dIso}`,
        dayShort,
        dayFull,
        dateNum: `${dayNum} ${monthStr}`,
        dateStr: dIso,
        isToday,
        displayLabel: isToday ? '⚡ Today' : `${dayShort} ${dayNum}`,
      });
    }

    const startStr = weekDays[0].dateNum;
    const endStr = weekDays[6].dateNum;
    const weekLabel = weekOffset === 0 ? 'This Week (Sun - Sat)' : `${startStr} - ${endStr}`;

    return { days: weekDays, weekLabel };
  }, [weekOffset]);

  const handleSelectDay = (dateStr: string, label: string, isToday: boolean) => {
    setSelectedDateStr(dateStr);
    onSelectDate(dateStr, label, isToday);
  };

  const handlePrevWeek = () => {
    setWeekOffset((prev) => prev - 1);
  };

  const handleNextWeek = () => {
    setWeekOffset((prev) => prev + 1);
  };

  const handleResetToToday = () => {
    setWeekOffset(0);
    const today = new Date();
    const todayIso = today.toISOString().split('T')[0];
    setSelectedDateStr(todayIso);
    onSelectDate(todayIso, 'Today', true);
  };

  return (
    <div className="bg-panel/95 border border-white/10 p-2.5 sm:p-3 rounded-3xl shadow-2xl font-mono text-xs space-y-2">
      {/* Top Header Bar with Week Label & Quick Navigation */}
      <div className="flex items-center justify-between px-1 border-b border-white/10 pb-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-xl bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[11px] font-black text-white">{t(weekLabel)}</span>
            <span className="text-[9px] text-stadiumGreen font-black block">WEEKLY FIXTURE CALENDAR 🇳🇬</span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          {weekOffset !== 0 && (
            <button
              onClick={handleResetToToday}
              className="px-2 py-1 rounded-xl bg-gold/20 text-gold border border-gold/40 text-[10px] font-black hover:bg-gold hover:text-black transition-all"
            >
              ⚡ {t('Today')}
            </button>
          )}

          {/* Previous Week */}
          <button
            onClick={handlePrevWeek}
            className="p-1.5 rounded-xl bg-black/60 hover:bg-stadiumGreen/20 text-gray-300 hover:text-stadiumGreen border border-white/10 transition-all flex items-center"
            title="Previous Week (Sun - Sat)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Next Week */}
          <button
            onClick={handleNextWeek}
            className="p-1.5 rounded-xl bg-black/60 hover:bg-stadiumGreen/20 text-gray-300 hover:text-stadiumGreen border border-white/10 transition-all flex items-center"
            title="Next Week (Sun - Sat)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 7 Days of the Week: Sunday to Saturday */}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {days.map((item) => {
          const isSelected = selectedDateStr === item.dateStr;

          return (
            <button
              key={item.key}
              onClick={() => handleSelectDay(item.dateStr, item.displayLabel, item.isToday)}
              className={`py-2 px-1 rounded-2xl text-center flex flex-col items-center justify-between transition-all duration-200 ${
                isSelected
                  ? item.isToday
                    ? 'bg-stadiumGreen text-black font-black shadow-lg shadow-stadiumGreen/30 ring-2 ring-stadiumGreen scale-[1.03]'
                    : 'bg-gold text-black font-black shadow-lg shadow-gold/30 ring-2 ring-gold scale-[1.03]'
                  : item.isToday
                  ? 'bg-stadiumGreen/15 text-stadiumGreen border border-stadiumGreen/40 hover:bg-stadiumGreen/25'
                  : 'bg-black/40 text-gray-400 hover:text-white hover:bg-white/5 border border-white/5'
              }`}
            >
              {/* Day Name */}
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider">
                {t(item.dayShort)}
              </span>

              {/* Date Number */}
              <span className={`text-xs sm:text-sm font-black mt-0.5 ${isSelected ? 'text-black' : item.isToday ? 'text-stadiumGreen' : 'text-white'}`}>
                {item.dateNum.split(' ')[0]}
              </span>

              {/* Month or Today Badge */}
              <span className={`text-[8px] sm:text-[9px] uppercase font-bold mt-0.5 ${
                isSelected ? 'text-black/80' : item.isToday ? 'text-stadiumGreen font-black' : 'text-gray-500'
              }`}>
                {item.isToday ? 'TODAY' : item.dateNum.split(' ')[1]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
