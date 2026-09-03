'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Zap, Pause, Play, Smartphone } from 'lucide-react';
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
      const topPick = m.prediction?.topPick;
      const tier = topPick?.confidenceTier || 'HIGH VALUE';
      const isUltra = tier.includes('ULTRA-BANKER') || tier === 'ULTRA-BANKER';
      const selection = topPick?.selection || `${m.homeTeam} or Draw (1X)`;
      const odds = topPick?.odds || 1.25;
      const prob = topPick?.probability || 80;

      updates.push({
        id: `t-banker-${m.id}`,
        type: 'BANKER',
        badge: isUltra ? '👑 ULTRA-BANKER' : '⚡ PRIME PICK',
        badgeColor: isUltra ? 'bg-gold text-black' : 'bg-stadiumGreen text-black',
        text: `${selection} @ ${odds} (${prob}% Model Confidence)`,
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
  const triggerUpdates = React.useMemo(() => generateDynamicTriggerUpdates(matches), [matches]);
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate the list enough times to create a seamless loop.
  const loopCount = triggerUpdates.length * 2;
  const animDuration = `${Math.max(24, triggerUpdates.length * 3.5)}s`;

  return (
    <div
      className="bg-black/95 border-b border-stadiumGreen/40 h-8 sm:h-9 flex items-center overflow-hidden relative z-30 shadow-md glow-emerald contain-paint select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="w-full flex items-center h-full">
        {/* Fixed header label */}
        <div className="flex items-center space-x-1.5 pl-2 sm:pl-4 pr-2 sm:pr-3 flex-shrink-0 z-10 bg-black/95 h-full">
          <div className="w-2 h-2 rounded-full bg-crimson animate-ping flex-shrink-0"></div>
          <Zap className="w-3.5 h-3.5 text-stadiumGreen flex-shrink-0" />
          <span className="hidden sm:inline font-extrabold text-stadiumGreen uppercase tracking-wider text-[11px] whitespace-nowrap">LIVE WIRE</span>
        </div>

        {/* Continuous marquee viewport */}
        <div className="flex-1 min-w-0 overflow-hidden relative h-full flex items-center">
          <div
            className={`flex items-center whitespace-nowrap will-change-transform ${isPaused ? '' : 'animate-ticker-marquee'}`}
            style={isPaused ? undefined : { animationDuration: animDuration }}
          >
            {Array.from({ length: loopCount }).map((_, i) => {
              const item = triggerUpdates[i % triggerUpdates.length];
              return (
                <button
                  key={`${item.id}-${i}`}
                  onClick={() => onSelectUpdate && onSelectUpdate(item)}
                  className="flex items-center gap-2 mx-3 sm:mx-4 text-left hover:opacity-80 transition-opacity shrink-0"
                  title={`${item.matchTitle}: ${item.text}`}
                >
                  <span className={`px-1.5 py-0.5 rounded font-black text-[9px] sm:text-[10px] uppercase ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  <span className="font-extrabold text-white text-[10px] sm:text-xs">{item.matchTitle}:</span>
                  <span className="text-gray-200 text-[10px] sm:text-xs">{item.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* App Download Link & Pause / play control */}
        <div className="flex items-center space-x-1.5 pl-2 pr-2 sm:pl-3 sm:pr-4 flex-shrink-0 z-10 bg-black/95 h-full">
          <Link
            href="/download"
            className="px-2 py-0.5 rounded-lg bg-stadiumGreen/20 hover:bg-stadiumGreen/30 text-stadiumGreen border border-stadiumGreen/40 font-mono font-black text-[9px] sm:text-[11px] flex items-center space-x-1 transition-all shadow-sm active:scale-95"
            title="Download Native Android APK & Install iOS App"
          >
            <Smartphone className="w-3 h-3" />
            <span>GET APP</span>
          </Link>
          <button
            onClick={() => setIsPaused((p) => !p)}
            className="p-1 text-stadiumGreen hover:text-white transition-colors"
            title={isPaused ? 'Resume ticker' : 'Pause ticker'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};