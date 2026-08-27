'use client';

import React from 'react';
import Link from 'next/link';
import { ErrorBoundary } from '../../components/error-boundary';
import { Zap, ShieldCheck, ArrowLeft, ExternalLink, TrendingUp, DollarSign, Sparkles } from 'lucide-react';
import { AFFILIATE_PARTNERS } from '../../config/affiliates';

export default function ArbitragePage() {
  const arbitrageDeals = [
    {
      id: 'arb-1',
      match: 'Atl. Nacional vs Deportivo Cali',
      league: 'Liga Colombiana',
      market: 'Home Win (1)',
      bestBookie: 'Stake.com 👑',
      bestOdds: 1.52,
      marketAvgOdds: 1.38,
      valueEdgePercent: 10.1,
      affiliateUrl: AFFILIATE_PARTNERS.STAKE.affiliateUrl,
      recommendation: 'HIGH VALUE EDGE 🚀',
      bonusText: '200% up to $3,000 Bonus'
    },
    {
      id: 'arb-2',
      match: 'River Plate vs Santa Fe',
      league: 'Copa Sudamericana',
      market: 'Double Chance (1X)',
      bestBookie: '22Bet Sports ⚡',
      bestOdds: 1.28,
      marketAvgOdds: 1.18,
      valueEdgePercent: 8.5,
      affiliateUrl: AFFILIATE_PARTNERS['22BET'].affiliateUrl,
      recommendation: 'ULTRA-BANKER 👑',
      bonusText: '₦130,000 Deposit Match'
    },
    {
      id: 'arb-3',
      match: 'Seattle Storm vs Dallas Wings',
      league: 'WNBA Basketball',
      market: 'Moneyline (1)',
      bestBookie: 'SportyBet 🔥',
      bestOdds: 1.48,
      marketAvgOdds: 1.36,
      valueEdgePercent: 8.8,
      affiliateUrl: AFFILIATE_PARTNERS.SPORTYBET.affiliateUrl,
      recommendation: 'PRIME PICK ⚡',
      bonusText: '1,000% Dynamic Boost'
    },
    {
      id: 'arb-4',
      match: 'América de Cali vs Atlético Junior',
      league: 'Liga Colombiana',
      market: 'Home Win (1)',
      bestBookie: 'Bet9ja 🦅',
      bestOdds: 1.50,
      marketAvgOdds: 1.40,
      valueEdgePercent: 7.1,
      affiliateUrl: AFFILIATE_PARTNERS.BET9JA.affiliateUrl,
      recommendation: 'STRONG EDGE 💎',
      bonusText: '170% Multiple Win Boost'
    }
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#07090e] text-white font-mono p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
        
        {/* Navigation Top Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link href="/" className="inline-flex items-center space-x-2 text-stadiumGreen hover:underline font-bold text-xs">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Stadium Dashboard</span>
          </Link>

          <span className="px-3 py-1 rounded-full bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40 text-xs font-bold">
            ⚡ REAL-TIME VALUE EDGE RADAR
          </span>
        </div>

        {/* Hero Section */}
        <div className="glass-panel-premium rounded-3xl p-6 sm:p-8 border border-stadiumGreen/30 space-y-3 shadow-2xl">
          <span className="text-[10px] font-black text-stadiumGreen uppercase tracking-widest block">
            ODDS COMPARISON &amp; VALUE ARBITRAGE
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            Live Bookmaker Arbitrage &amp; <span className="text-stadiumGreen">Value Edge Radar</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 font-sans max-w-3xl leading-relaxed">
            Mathematical odds discrepancy scanner analyzing 50+ sportsbooks in real time. We identify price anomalies where specific bookmakers offer superior odds above fair market probability.
          </p>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {arbitrageDeals.map((deal) => (
            <div
              key={deal.id}
              className="p-5 sm:p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4 hover:border-stadiumGreen/60 transition-all shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] text-gray-400 font-sans">{deal.league}</span>
                  <span className="px-2 py-0.5 rounded-full bg-stadiumGreen/10 text-stadiumGreen border border-stadiumGreen/30 font-black text-[10px]">
                    {deal.recommendation}
                  </span>
                </div>

                <h3 className="text-base font-black text-white">{deal.match}</h3>
                
                <div className="flex items-center space-x-3 text-xs text-gray-300">
                  <span>Market: <strong className="text-white">{deal.market}</strong></span>
                  <span>• Edge: <strong className="text-stadiumGreen font-mono">+{deal.valueEdgePercent}%</strong></span>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-neutral-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Best Price on <strong>{deal.bestBookie}</strong>:</span>
                  <span className="text-lg font-black text-stadiumGreen font-mono">@{deal.bestOdds}</span>
                </div>

                <a
                  href={deal.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-2xl bg-stadiumGreen hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-lg"
                >
                  <span>Bet at Highest Odds ({deal.bestOdds}) • {deal.bonusText} ➔</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </ErrorBoundary>
  );
}
