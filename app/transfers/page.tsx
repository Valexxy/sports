'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, DollarSign, Search, Flame, TrendingUp, RefreshCw, CheckCircle, ShieldCheck, ChevronRight } from 'lucide-react';
import { TransferDeal } from '../api/v1/transfers/route';
import { GlobalLanguageSwitcher } from '../../components/global-language-switcher';

export default function TransfersPage() {
  const [deals, setDeals] = useState<TransferDeal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'CONFIRMED' | 'LOAN' | 'RUMOR'>('ALL');

  const fetchTransfers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/transfers');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setDeals(json.data);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  const filtered = deals.filter(deal => {
    if (typeFilter !== 'ALL' && deal.dealType !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const str = `${deal.playerName} ${deal.fromClub} ${deal.toClub} ${deal.league}`.toLowerCase();
      if (!str.includes(q)) return false;
    }
    return true;
  });

  const confirmedCount = deals.filter(d => d.dealType === 'CONFIRMED').length;
  const rumorCount = deals.filter(d => d.dealType === 'RUMOR').length;

  return (
    <main className="min-h-screen bg-void text-white font-mono p-3 sm:p-8 space-y-6 pb-24">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link
            href="/"
            className="px-3.5 py-2 rounded-xl bg-panel hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 hover:text-white flex items-center space-x-2 transition-all shadow-md active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Match Center 🏟️</span>
          </Link>

          <div className="flex items-center space-x-2">
            <GlobalLanguageSwitcher />
            <span className="text-stadiumGreen font-black text-sm hidden sm:inline">MIVAJ SPORTS</span>
            <span className="px-2.5 py-0.5 rounded bg-gold/20 text-gold text-[10px] font-black border border-gold/30">
              TRANSFER RADAR 💰
            </span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="glass-panel-premium rounded-3xl p-5 sm:p-8 border border-gold/40 space-y-3 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center space-x-2">
                <span>TRANSFER RADAR &amp; MARKET VALUE WIRE</span>
                <span>💰</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 font-sans">
                Confirmed blockbuster moves, valuations, fee breakdowns &amp; tactical squad impact on upcoming banker odds
              </p>
            </div>

            <button
              onClick={fetchTransfers}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-gold text-black font-black text-xs flex items-center space-x-1.5 shadow-lg active:scale-95 transition-all self-start md:self-auto hover:bg-amber-300"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Deals</span>
            </button>
          </div>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-panel border border-stadiumGreen/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase block">CONFIRMED BLOCKBUSTERS</span>
              <span className="text-2xl font-black text-stadiumGreen">{confirmedCount} Deals</span>
            </div>
            <span className="text-2xl">✍️</span>
          </div>

          <div className="p-4 rounded-2xl bg-panel border border-gold/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase block">HOT RUMORS &amp; NEGOTIATIONS</span>
              <span className="text-2xl font-black text-gold">{rumorCount} Tracking</span>
            </div>
            <span className="text-2xl">🔥</span>
          </div>

          <div className="p-4 rounded-2xl bg-panel border border-cyan-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase block">TOTAL CAPITAL MONITORED</span>
              <span className="text-2xl font-black text-cyan-300">€780M+</span>
            </div>
            <span className="text-2xl">🌍</span>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-panel p-3.5 rounded-2xl border border-white/10 text-xs">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search player, buying or selling club..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black border border-white/10 text-xs text-white placeholder-gray-500 focus:border-gold focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-1.5 bg-black/60 p-1 rounded-xl border border-white/10">
            {(['ALL', 'CONFIRMED', 'LOAN', 'RUMOR'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                  typeFilter === type ? 'bg-gold text-black shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Deals Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {loading ? (
            <div className="col-span-2 py-12 text-center text-gray-400 text-xs font-sans">
              Loading confirmed transfer deals live...
            </div>
          ) : filtered.length === 0 ? (
            <div className="col-span-2 py-8 text-center text-gray-400 text-xs font-sans">
              No transfer deals found matching your search.
            </div>
          ) : (
            filtered.map((deal) => (
              <div
                key={deal.id}
                className="p-4 rounded-3xl bg-panel/90 border border-white/10 space-y-3 shadow-xl hover:border-gold/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2.5">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-black text-sm text-white">{deal.playerName}</span>
                        <span className="text-[10px] text-gray-400 font-sans">({deal.age} yrs &bull; {deal.position})</span>
                      </div>
                      <span className="text-[11px] text-gray-400 block pt-0.5">{deal.league}</span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase ${
                      deal.dealType === 'CONFIRMED' ? 'bg-stadiumGreen/20 text-stadiumGreen border-stadiumGreen/40' :
                      deal.dealType === 'LOAN' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' :
                      'bg-gold/20 text-gold border-gold/40'
                    }`}>
                      {deal.dealType === 'CONFIRMED' ? 'DONE DEAL ✓' : deal.dealType}
                    </span>
                  </div>

                  {/* Transfer Route: From Club -> To Club */}
                  <div className="mt-3 flex items-center justify-between p-3 rounded-2xl bg-black/60 border border-white/5 text-xs">
                    <div className="min-w-0">
                      <span className="text-[9px] text-gray-400 block uppercase">SELLING CLUB</span>
                      <span className="font-bold text-gray-300 truncate block">{deal.fromClub}</span>
                    </div>

                    <div className="px-3 flex items-center text-gold">
                      <ArrowRight className="w-4 h-4 animate-pulse" />
                    </div>

                    <div className="min-w-0 text-right">
                      <span className="text-[9px] text-gray-400 block uppercase">NEW DESTINATION</span>
                      <span className="font-bold text-stadiumGreen truncate block">{deal.toClub}</span>
                    </div>
                  </div>

                  {/* Financials: Transfer Fee & Market Value */}
                  <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-[9px] text-gray-400 block uppercase">TRANSFER FEE</span>
                      <span className="font-black text-white text-xs">{deal.fee}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-[9px] text-gray-400 block uppercase">MARKET VALUATION</span>
                      <span className="font-black text-gold text-xs">{deal.marketValue}</span>
                    </div>
                  </div>
                </div>

                {/* Tactical Impact Alert */}
                <div className="p-2.5 rounded-xl bg-stadiumGreen/10 border border-stadiumGreen/30 text-[10px] text-gray-300 font-sans leading-snug">
                  <span className="font-bold font-mono uppercase block text-[9px] text-stadiumGreen">⚡ Tactical &amp; Banker Impact:</span>
                  {deal.impactAnalysis}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
