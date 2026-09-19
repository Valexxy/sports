'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Zap, Pause, Play, Smartphone } from 'lucide-react';
import { MatchData } from '../lib/sports-api';

export interface TriggerUpdate {
  id: string;
  type: 'GOAL' | 'BANKER' | 'PRESSURE' | 'TRANSFER' | 'MARKET';
  badge: string;
  badgeColor: string;
  text: string;
  matchTitle: string;
  timeAgo: string;
}

export function generateDynamicTriggerUpdates(matches: MatchData[]): TriggerUpdate[] {
  const updates: TriggerUpdate[] = [];

  // Inject Financial / Crypto Data for Young Hustlers (Billion Dollar Feel)
  updates.push({
    id: 'crypto-btc', type: 'MARKET', badge: '💎 BTC/USD', badgeColor: 'bg-orange-500 text-white',
    text: '$98,240.50 (+2.4%) 🚀', matchTitle: 'Global Markets', timeAgo: 'Live'
  });
  updates.push({
    id: 'crypto-eth', type: 'MARKET', badge: '💎 ETH/USD', badgeColor: 'bg-blue-500 text-white',
    text: '$3,420.00 (+1.1%)', matchTitle: 'Global Markets', timeAgo: 'Live'
  });
  updates.push({
    id: 'forex-ngn', type: 'MARKET', badge: '💱 USD/NGN', badgeColor: 'bg-emerald-600 text-white',
    text: '₦1,745.00 (Black Market Average)', matchTitle: 'FX Board', timeAgo: 'Live'
  });
  updates.push({
    id: 'crypto-ton', type: 'MARKET', badge: '💎 TON', badgeColor: 'bg-cyan-500 text-white',
    text: '$6.85 (+5.2%) 🚀', matchTitle: 'Telegram Ecosystem', timeAgo: 'Live'
  });

  if (!matches || matches.length === 0) {
    updates.push({
      id: 't-default', type: 'BANKER', badge: '🔥 AI BANKER', badgeColor: 'bg-gold text-black',
      text: 'Live match aggregator syncing real-time fixtures across 12 competitions.',
      matchTitle: 'Mivaj Omni-Brain', timeAgo: 'Live',
    });
    return updates;
  }

  matches.slice(0, 15).forEach((m) => {
    if (m.status === 'LIVE') {
      updates.push({
        id: `t-live-${m.id}`, type: 'GOAL', badge: '🔴 LIVE FLASH', badgeColor: 'bg-crimson text-white animate-pulse',
        text: `${m.matchTime}: ${m.homeTeam} ${m.homeScore} - ${m.awayScore} ${m.awayTeam} (Stadium Tension: ${m.stadiumTension}%)`,
        matchTitle: 'BREAKING', timeAgo: 'Live',
      });
    } else if (m.status === 'FINISHED') {
      updates.push({
        id: `t-ft-${m.id}`, type: 'GOAL', badge: '✅ SETTLED', badgeColor: 'bg-stadiumGreen text-black font-black',
        text: `${m.homeTeam} ${m.homeScore} - ${m.awayScore} ${m.awayTeam}. Verified on referee ledger.`,
        matchTitle: 'FULL TIME', timeAgo: 'Settled',
      });
    } else {
      const topPick = m.prediction?.topPick;
      const isUltra = (topPick?.confidenceTier || '').includes('ULTRA-BANKER');
      const selection = topPick?.selection || `${m.homeTeam} or Draw (1X)`;
      const odds = topPick?.odds || 1.25;
      const prob = topPick?.probability || 80;

      updates.push({
        id: `t-banker-${m.id}`, type: 'BANKER', 
        badge: isUltra ? '🔥 99% BANKER' : '🤖 AI PICK', 
        badgeColor: isUltra ? 'bg-gold text-black' : 'bg-stadiumGreen text-black',
        text: `${selection} @ ${odds} (${prob}% Model Confidence)`,
        matchTitle: `${m.homeTeam} vs ${m.awayTeam}`, timeAgo: m.matchTime || 'Upcoming',
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
  const triggerUpdates = React.useMemo(() => generateDynamicTriggerUpdates(matches), [matches]);
  const [isPaused, setIsPaused] = useState(false);

  const loopCount = triggerUpdates.length * 2;
  const animDuration = `${Math.max(24, triggerUpdates.length * 3.5)}s`;

  return (
    <div
      className="bg-black/95 border-b border-emerald-500/20 h-8 sm:h-9 flex items-center overflow-hidden relative z-30 shadow-md contain-paint select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="w-full flex items-center h-full">
        <div className="flex items-center space-x-1.5 pl-2 sm:pl-4 pr-2 sm:pr-3 flex-shrink-0 z-10 bg-black/95 h-full border-r border-white/10">
          <div className="w-2 h-2 rounded-full bg-crimson animate-ping flex-shrink-0"></div>
          <Zap className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span className="hidden sm:inline font-black text-emerald-400 uppercase tracking-wider text-[11px] whitespace-nowrap">GLOBAL FEED</span>
        </div>

        <div className="flex-1 min-w-0 overflow-hidden relative h-full flex items-center bg-[#05070B]">
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
                  className="flex items-center gap-2 mx-3 sm:mx-4 text-left hover:opacity-80 transition-opacity shrink-0 border-r border-white/5 pr-4"
                  title={`${item.matchTitle}: ${item.text}`}
                >
                  <span className={`px-1.5 py-0.5 rounded font-black text-[9px] sm:text-[10px] uppercase ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  <span className="font-extrabold text-white text-[10px] sm:text-xs">{item.matchTitle}:</span>
                  <span className="text-emerald-300 font-mono text-[10px] sm:text-xs font-bold">{item.text}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
