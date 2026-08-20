'use client';

import React, { useState, useEffect } from 'react';
import { Zap, ChevronUp } from 'lucide-react';
import { MatchData } from '../lib/sports-api';

export interface TriggerUpdate {
  id: string;
  type: 'GOAL' | 'BANKER' | 'PRESSURE' | 'TRANSFER';
  badge: string;
  badgeColor: string;
  text: string;
  matchTitle: string;
  timeAgo: string;
}

export function generateDynamicTriggerUpdates(matches: MatchData[]): TriggerUpdate[] {
  if (!matches || matches.length === 0) {
    return [
      {
        id: 't-default',
        type: 'BANKER',
        badge: '👑 ULTRA-BANKER',
        badgeColor: 'bg-gold text-black',
        text: 'Live match aggregator syncing real-time fixtures across 12 competitions.',
        matchTitle: 'Stadium Live Wire',
        timeAgo: 'Live',
      },
    ];
  }

  const updates: TriggerUpdate[] = [];

  matches.slice(0, 15).forEach((m) => {
    if (m.status === 'LIVE') {
      updates.push({
        id: `t-live-${m.id}`,
        type: 'GOAL',
        badge: '🔴 LIVE MATCH',
        badgeColor: 'bg-crimson text-white',
        text: `${m.matchTime}: ${m.homeTeam} ${m.homeScore} - ${m.awayScore} ${m.awayTeam} (Stadium Tension: ${m.stadiumTension}%)`,
        matchTitle: `${m.homeTeam} vs ${m.awayTeam}`,
        timeAgo: 'Live',
      });
    } else if (m.status === 'FINISHED') {
      updates.push({
        id: `t-ft-${m.id}`,
        type: 'GOAL',
        badge: '🟢 FINAL OUTCOME',
        badgeColor: 'bg-stadiumGreen text-black font-black',
        text: `Full Time Result: ${m.homeTeam} ${m.homeScore} - ${m.awayScore} ${m.awayTeam}. Verified on referee ledger.`,
        matchTitle: `${m.homeTeam} vs ${m.awayTeam}`,
        timeAgo: 'Settled',
      });
    } else {
      updates.push({
        id: `t-banker-${m.id}`,
        type: 'BANKER',
        badge: m.prediction.topPick.confidenceTier === 'ULTRA-BANKER' ? '👑 ULTRA-BANKER' : '⚡ PRIME PICK',
        badgeColor: m.prediction.topPick.confidenceTier === 'ULTRA-BANKER' ? 'bg-gold text-black' : 'bg-stadiumGreen text-black',
        text: `${m.prediction.topPick.selection} @ ${m.prediction.topPick.odds} (${m.prediction.topPick.probability}% Model Confidence)`,
        matchTitle: `${m.homeTeam} vs ${m.awayTeam}`,
        timeAgo: m.matchTime || 'Upcoming',
      });
    }
  });

  return updates;
}

interface TickerProps {
  matches?: MatchData[];
  onSelectUpdate?: (update: TriggerUpdate) => void;
}

export const BroadcastTicker: React.FC<TickerProps> = ({ matches = [], onSelectUpdate }) => {
  const triggerUpdates = generateDynamicTriggerUpdates(matches);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (triggerUpdates.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % triggerUpdates.length);
    }, 3200);

    return () => clearInterval(interval);
  }, [triggerUpdates.length, isPaused]);

  const activeItem = triggerUpdates[currentIndex] || triggerUpdates[0];

  return (
    <div
      className="bg-black/95 border-b border-stadiumGreen/40 py-2 px-2 sm:px-4 text-xs font-mono overflow-hidden relative z-30 shadow-md glow-emerald"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-0">

        {/* Fixed Header Label — icon only on mobile */}
        <div className="flex items-center space-x-1.5 pr-2 sm:pr-3 border-r border-white/10 flex-shrink-0">
          <div className="w-2 h-2 rounded-full bg-crimson animate-ping flex-shrink-0"></div>
          <Zap className="w-3.5 h-3.5 text-stadiumGreen flex-shrink-0" />
          <span className="hidden sm:inline font-extrabold text-stadiumGreen uppercase tracking-wider text-[11px]">LIVE WIRE</span>
        </div>

        {/* Vertical Upward Scrolling Content */}
        <div className="flex-1 min-w-0 overflow-hidden mx-1 sm:mx-3 h-6 relative cursor-pointer">
          {triggerUpdates.map((item, idx) => {
            const isCurrent = idx === currentIndex;
            const isPrev = idx === (currentIndex - 1 + triggerUpdates.length) % triggerUpdates.length;
            return (
              <div
                key={item.id}
                onClick={() => onSelectUpdate && onSelectUpdate(item)}
                className={`absolute inset-0 flex items-center gap-1.5 transition-all duration-700 ease-in-out ${
                  isCurrent ? 'translate-y-0 opacity-100' : isPrev ? '-translate-y-full opacity-0' : 'translate-y-full opacity-0'
                }`}
              >
                <span className={`flex-shrink-0 px-1.5 py-0.5 rounded font-black text-[9px] sm:text-[10px] uppercase ${item.badgeColor}`}>
                  {item.badge}
                </span>
                <span className="font-extrabold text-white text-[10px] sm:text-xs flex-shrink-0 hidden xs:inline">{item.matchTitle}:</span>
                <span className="text-gray-300 text-[10px] sm:text-xs truncate min-w-0">{item.text}</span>
              </div>
            );
          })}
        </div>

        {/* Counter — desktop only */}
        <div className="hidden sm:flex items-center space-x-1.5 text-gray-400 text-[10px] pl-3 border-l border-white/10 flex-shrink-0 font-bold">
          <ChevronUp className="w-3.5 h-3.5 text-stadiumGreen animate-bounce" />
          <span>{currentIndex + 1}/{triggerUpdates.length}</span>
        </div>

      </div>
    </div>
  );
};
