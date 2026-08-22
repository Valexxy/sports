'use client';

import React, { useState } from 'react';
import { Zap, Pause, Play } from 'lucide-react';
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

/**
 * BROADCAST TICKER — continuous horizontal marquee that shows the FULL text of
 * every update without truncation. Clicking any item opens it. Pause/play is
 * available on hover or via the explicit control.
 */
export const BroadcastTicker: React.FC<TickerProps> = ({ matches = [], onSelectUpdate }) => {
  const triggerUpdates = generateDynamicTriggerUpdates(matches);
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate the list enough times to create a seamless loop.
  const loopCount = triggerUpdates.length * 2;

  return (
    <div
      className="bg-black/95 border-b border-stadiumGreen/40 py-2 flex items-center overflow-hidden relative z-30 shadow-md glow-emerald"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="w-full flex items-center">
        {/* Fixed header label */}
        <div className="flex items-center space-x-1.5 pl-2 sm:pl-4 pr-2 sm:pr-3 flex-shrink-0 z-10">
          <div className="w-2 h-2 rounded-full bg-crimson animate-ping flex-shrink-0"></div>
          <Zap className="w-3.5 h-3.5 text-stadiumGreen flex-shrink-0" />
          <span className="hidden sm:inline font-extrabold text-stadiumGreen uppercase tracking-wider text-[11px] whitespace-nowrap">LIVE WIRE</span>
        </div>

        {/* Continuous marquee viewport */}
        <div className="flex-1 min-w-0 overflow-hidden relative">
          <div
            className={`flex items-center whitespace-nowrap will-change-transform ${isPaused ? '' : 'animate-ticker-marquee'}`}
            style={isPaused ? undefined : { animationDuration: `${triggerUpdates.length * 9}s` }}
          >
            {Array.from({ length: loopCount }).map((_, i) => {
              const item = triggerUpdates[i % triggerUpdates.length];
              return (
                <button
                  key={`${item.id}-${i}`}
                  onClick={() => onSelectUpdate && onSelectUpdate(item)}
                  className="flex items-center gap-2 mx-4 text-left hover:opacity-80 transition-opacity shrink-0"
                  title={`${item.matchTitle}: ${item.text}`}
                >
                  <span className={`px-1.5 py-0.5 rounded font-black text-[10px] uppercase ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  <span className="font-extrabold text-white text-[11px] sm:text-xs">{item.matchTitle}:</span>
                  <span className="text-gray-200 text-[11px] sm:text-xs">{item.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pause / play control */}
        <button
          onClick={() => setIsPaused((p) => !p)}
          className="pl-2 pr-2 sm:pl-3 flex-shrink-0 z-10 text-stadiumGreen hover:text-white"
          title={isPaused ? 'Resume ticker' : 'Pause ticker'}
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};