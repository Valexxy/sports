'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Activity, Search, AlertTriangle, ShieldAlert, HeartPulse, RefreshCw, Filter, CheckCircle2, ChevronRight } from 'lucide-react';
import { InjuryReport } from '../api/v1/injuries/route';
import { GlobalLanguageSwitcher } from '../../components/global-language-switcher';

export default function InjuriesPage() {
  const [injuries, setInjuries] = useState<InjuryReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'RULED_OUT' | 'DOUBTFUL' | 'SUSPENDED'>('ALL');
  const [teamFilter, setTeamFilter] = useState<string>('ALL');

  const fetchInjuries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/injuries');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setInjuries(json.data);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchInjuries();
  }, []);

  const teams = Array.from(new Set(injuries.map(i => i.team))).sort();

  const filtered = injuries.filter((i) => {
    if (statusFilter !== 'ALL' && i.status !== statusFilter) return false;
    if (teamFilter !== 'ALL' && i.team !== teamFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const str = `${i.playerName} ${i.team} ${i.injuryType} ${i.news}`.toLowerCase();
      if (!str.includes(q)) return false;
    }
    return true;
  });

  const ruledOutCount = injuries.filter(i => i.status === 'RULED_OUT').length;
  const doubtfulCount = injuries.filter(i => i.status === 'DOUBTFUL').length;
  const suspendedCount = injuries.filter(i => i.status === 'SUSPENDED').length;

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
            <span className="px-2.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-black border border-red-500/30">
              HOSPITAL &amp; INJURY WIRE 🏥
            </span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="glass-panel-premium rounded-3xl p-5 sm:p-8 border border-red-500/40 space-y-3 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center space-x-2">
                <span>HOSPITAL WARD &amp; INJURY WIRE</span>
                <span>🏥</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 font-sans">
                Real-time official sidelined players, injury severities, expected returns &amp; Poisson betting impact
              </p>
            </div>

            <button
              onClick={fetchInjuries}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-red-500 text-white font-black text-xs flex items-center space-x-1.5 shadow-lg active:scale-95 transition-all self-start md:self-auto hover:bg-red-600"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Medical Wire</span>
            </button>
          </div>
        </div>

        {/* Summary Metric Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-panel border border-red-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase block">RULED OUT (100% Sidelined)</span>
              <span className="text-2xl font-black text-red-400">{ruledOutCount} Players</span>
            </div>
            <span className="text-2xl">🚫</span>
          </div>

          <div className="p-4 rounded-2xl bg-panel border border-amber-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase block">DOUBTFUL (25-75% Chance)</span>
              <span className="text-2xl font-black text-amber-400">{doubtfulCount} Players</span>
            </div>
            <span className="text-2xl">⚠️</span>
          </div>

          <div className="p-4 rounded-2xl bg-panel border border-orange-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase block">SUSPENDED (Red/Card Ban)</span>
              <span className="text-2xl font-black text-orange-400">{suspendedCount} Players</span>
            </div>
            <span className="text-2xl">🟥</span>
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
              placeholder="Search player, club, or injury (e.g. Saliba, Hamstring)..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black border border-white/10 text-xs text-white placeholder-gray-500 focus:border-red-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="p-2 rounded-xl bg-black border border-white/10 text-xs text-white font-mono focus:outline-none"
            >
              <option value="ALL">All Clubs ({teams.length})</option>
              {teams.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="p-2 rounded-xl bg-black border border-white/10 text-xs text-white font-mono focus:outline-none"
            >
              <option value="ALL">All Severities</option>
              <option value="RULED_OUT">Ruled Out 🔴</option>
              <option value="DOUBTFUL">Doubtful 🟡</option>
              <option value="SUSPENDED">Suspended 🟠</option>
            </select>
          </div>
        </div>

        {/* Injury Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {loading ? (
            <div className="col-span-2 py-12 text-center text-gray-400 text-xs font-sans">
              Loading official medical reports live from Premier League wire...
            </div>
          ) : filtered.length === 0 ? (
            <div className="col-span-2 py-8 text-center text-gray-400 text-xs font-sans">
              No injured players found matching your filters.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-3xl bg-panel/90 border border-white/10 space-y-2.5 shadow-xl hover:border-red-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-black text-sm text-white">{item.playerName}</span>
                        <span className="text-[10px] text-gray-400 font-sans">({item.position})</span>
                      </div>
                      <span className="text-xs text-stadiumGreen font-bold block pt-0.5">{item.team}</span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase flex-shrink-0 ${
                      item.status === 'RULED_OUT' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                      item.status === 'DOUBTFUL' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                      'bg-orange-500/20 text-orange-400 border-orange-500/40'
                    }`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="mt-2 p-2.5 rounded-2xl bg-black/60 border border-white/5 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-gray-300 flex items-center space-x-1">
                        <HeartPulse className="w-3.5 h-3.5 text-red-400 inline" />
                        <span>{item.injuryType}</span>
                      </span>
                      <span className={`font-mono font-bold ${
                        item.chanceOfPlaying === 0 ? 'text-red-400' :
                        item.chanceOfPlaying < 75 ? 'text-amber-400' : 'text-stadiumGreen'
                      }`}>
                        {item.chanceOfPlaying}% Play Chance
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-sans pt-0.5">
                      {item.news}
                    </p>
                  </div>
                </div>

                {item.bettingImpactAlert && (
                  <div className="p-2.5 rounded-xl bg-gold/10 border border-gold/30 text-[10px] text-gold font-sans leading-snug">
                    <span className="font-bold font-mono uppercase block text-[9px] text-gold/80">⚡ Betting Intelligence Impact:</span>
                    {item.bettingImpactAlert}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
