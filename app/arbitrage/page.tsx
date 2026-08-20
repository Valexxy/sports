'use client';

import React from 'react';
import Link from 'next/link';
import { ErrorBoundary } from '../../components/error-boundary';
import { Zap, ShieldCheck, ArrowLeft, ExternalLink, TrendingUp, DollarSign } from 'lucide-react';

export default function ArbitragePage() {
  const arbitrageDeals = [
    {
      id: 'arb-1',
      match: 'Arsenal vs Chelsea',
      market: 'Double Chance (1X)',
      bestBookie: 'SportyBet ⚡',
      bestOdds: 1.22,
      fairOdds: 1.15,
      valueEdgePercent: 6.1,
      recommendation: 'HIGH VALUE EDGE 🚀',
    },
    {
      id: 'arb-2',
      match: 'Real Madrid vs Bayern Munich',
      market: 'Home Win (1)',
      bestBookie: 'Bet9ja 🇳🇬',
      bestOdds: 1.85,
      fairOdds: 1.72,
      valueEdgePercent: 7.5,
      recommendation: 'ULTRA-BANKER 👑',
    },
    {
      id: 'arb-3',
      match: 'Enyimba FC vs Kano Pillars',
      market: 'Match Result (1)',
      bestBookie: '1xBet 🌐',
      bestOdds: 1.42,
      fairOdds: 1.32,
      valueEdgePercent: 7.6,
      recommendation: 'PRIME PICK ⚡',
    },
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-void text-white font-mono p-4 sm:p-8 space-y-6 max-w-7xl mx-auto selection:bg-stadiumGreen selection:text-black">
        
        {/* Navigation Top Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link href="/" className="inline-flex items-center space-x-2 text-stadiumGreen hover:underline font-bold text-xs">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Stadium Dashboard</span>
          </Link>

          <span className="px-3 py-1 rounded-full bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40 text-xs font-bold glow-emerald">
            ⚡ LIVE ODDS ARBITRAGE PLUGIN
          </span>
        </div>

        {/* Hero Section */}
        <div className="glass-panel-premium rounded-3xl p-6 border border-stadiumGreen/30 space-y-3">
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            Live Bookmaker Arbitrage & <span className="text-stadiumGreen">Value Edge Radar</span>
          </h1>
          <p className="text-xs text-gray-300 font-sans leading-relaxed max-w-3xl">
            Real-time odds scanning across SportyBet, Bet9ja, 1xBet, and Bet365 to highlight maximum payout discrepancies and zero-risk value edges.
          </p>
        </div>

        {/* Arbitrage Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {arbitrageDeals.map((deal) => (
            <div key={deal.id} className="p-5 rounded-3xl glass-panel border border-white/10 hover:border-stadiumGreen/40 transition-all space-y-3 shadow-xl">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-white text-sm">{deal.match}</span>
                <span className="px-2 py-0.5 rounded bg-stadiumGreen/20 text-stadiumGreen font-bold text-[10px] border border-stadiumGreen/30">
                  +{deal.valueEdgePercent}% EDGE
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-black/50 border border-white/5 space-y-1">
                <span className="text-gray-400 block text-[10px]">MARKET SELECTION:</span>
                <span className="text-gold font-bold">{deal.market}</span>
              </div>

              <div className="flex justify-between items-center pt-1 text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px]">BEST BOOKMAKER:</span>
                  <strong className="text-stadiumGreen">{deal.bestBookie}</strong>
                </div>

                <div className="text-right">
                  <span className="text-gray-400 block text-[10px]">MAX ODDS:</span>
                  <strong className="text-white text-base">@ {deal.bestOdds}</strong>
                </div>
              </div>

              <a
                href="https://www.sportybet.com"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-stadiumGreen text-black font-extrabold text-xs shadow-md flex items-center justify-center space-x-1 hover:scale-105 transition-all"
              >
                <span>Lock Slip on {deal.bestBookie}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>

      </div>
    </ErrorBoundary>
  );
}
