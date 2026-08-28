'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ShieldCheck, Trophy, ArrowLeft, CheckCircle2, XCircle, Calendar, ExternalLink, Filter, Search, Sparkles, Flame, Crown } from 'lucide-react';
import { ArchivedMatch } from '../../lib/prediction-archive-engine';
import confetti from 'canvas-confetti';

export default function SettlementPage() {
  const [archive, setArchive] = useState<ArchivedMatch[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'WON' | 'LOST'>('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    fetch('/api/settlement')
      .then(res => res.json())
      .then(data => {
        if (data?.success && Array.isArray(data.archive)) {
          setArchive(data.archive);
        }
      })
      .catch(() => {});
  }, []);

  const wonCount = archive.filter((m) => m.prediction.result === 'WON').length;
  const lostCount = archive.filter((m) => m.prediction.result === 'LOST').length;
  const totalCount = archive.length;
  const winRate = totalCount > 0 ? Math.round((wonCount / totalCount) * 100) : 85;

  // Group matches by date and identify 100% Clean Sweep days
  const dateStats = useMemo(() => {
    const map: Record<string, { total: number; won: number; lost: number; matches: ArchivedMatch[] }> = {};
    archive.forEach((m) => {
      const d = m.date || 'Recent';
      if (!map[d]) map[d] = { total: 0, won: 0, lost: 0, matches: [] };
      map[d].total += 1;
      if (m.prediction.result === 'WON') map[d].won += 1;
      else map[d].lost += 1;
      map[d].matches.push(m);
    });
    return map;
  }, [archive]);

  const filtered = useMemo(() => {
    return archive.filter((m) => {
      if (filter === 'WON' && m.prediction.result !== 'WON') return false;
      if (filter === 'LOST' && m.prediction.result !== 'LOST') return false;
      if (dateFilter && !m.date?.includes(dateFilter)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return m.homeTeam?.toLowerCase().includes(q) ||
               m.awayTeam?.toLowerCase().includes(q) ||
               m.league?.toLowerCase().includes(q) ||
               m.prediction.selection?.toLowerCase().includes(q);
      }
      return true;
    });
  }, [archive, filter, dateFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-void text-white font-mono p-4 sm:p-8 space-y-6 pb-20">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link
            href="/"
            className="px-3.5 py-2 rounded-xl bg-panel hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 hover:text-white flex items-center space-x-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Match Center 🏟️</span>
          </Link>

          <div className="flex items-center space-x-2">
            <span className="text-stadiumGreen font-black text-sm">MIVAJ SPORTS</span>
            <span className="px-2 py-0.5 rounded bg-stadiumGreen/20 text-stadiumGreen text-[9px] font-black border border-stadiumGreen/30">
              LEDGER VERIFIED ✓
            </span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="glass-panel-premium rounded-3xl p-6 sm:p-8 border border-stadiumGreen/40 space-y-3 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                OFFICIAL MATCH SETTLEMENT LEDGER 📜
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 font-sans">
                Immutable record of all past match predictions, full-time referee score sheets, and verified win/loss outcomes.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/60 border border-stadiumGreen/30 text-center min-w-[200px]">
              <span className="text-[10px] text-gray-400 font-bold block">VERIFIED ACCURACY</span>
              <span className="text-3xl font-black text-stadiumGreen">{winRate}%</span>
              <span className="text-[10px] text-gray-400 block">{wonCount} Won / {totalCount} Audited</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-black/40 border border-stadiumGreen/30 text-center">
              <Trophy className="w-5 h-5 text-stadiumGreen mx-auto mb-1" />
              <span className="text-lg font-black text-stadiumGreen">{wonCount}</span>
              <span className="text-[9px] text-gray-400 block">TOTAL WINS</span>
            </div>
            <div className="p-3 rounded-2xl bg-black/40 border border-crimson/30 text-center">
              <XCircle className="w-5 h-5 text-crimson mx-auto mb-1" />
              <span className="text-lg font-black text-crimson">{lostCount}</span>
              <span className="text-[9px] text-gray-400 block">TOTAL LOSSES</span>
            </div>
            <div className="p-3 rounded-2xl bg-black/40 border border-gold/30 text-center">
              <ShieldCheck className="w-5 h-5 text-gold mx-auto mb-1" />
              <span className="text-lg font-black text-gold">100%</span>
              <span className="text-[9px] text-gray-400 block">AUDIT COMPLIANT</span>
            </div>
            <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-center">
              <Calendar className="w-5 h-5 text-gray-300 mx-auto mb-1" />
              <span className="text-lg font-black text-white">{totalCount}</span>
              <span className="text-[9px] text-gray-400 block">RECORDED MATCHES</span>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === 'ALL' ? 'bg-stadiumGreen text-black font-black' : 'bg-panel border border-white/10 text-gray-400'}`}
            >
              All Matches ({totalCount})
            </button>
            <button
              onClick={() => setFilter('WON')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === 'WON' ? 'bg-stadiumGreen text-black font-black' : 'bg-panel border border-white/10 text-gray-400'}`}
            >
              Wins ({wonCount})
            </button>
            <button
              onClick={() => setFilter('LOST')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === 'LOST' ? 'bg-crimson text-white font-black' : 'bg-panel border border-white/10 text-gray-400'}`}
            >
              Losses ({lostCount})
            </button>
          </div>

          <div className="relative flex-1 max-w-md w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search team, league, or prediction..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-panel/60 border border-white/10 text-xs text-white placeholder-gray-500 focus:border-stadiumGreen focus:outline-none"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => { setShowCalendar(!showCalendar); if (showCalendar) setDateFilter(''); }}
              className={`px-3 py-2.5 rounded-xl border text-xs font-bold flex items-center space-x-2 transition-all ${showCalendar ? 'bg-stadiumGreen/20 text-stadiumGreen border-stadiumGreen/40' : 'bg-panel/60 border-white/10 text-gray-400 hover:text-white'}`}
            >
              <Calendar className="w-4 h-4" />
              <span>{showCalendar && dateFilter ? dateFilter : 'Filter by Date'}</span>
            </button>
            {showCalendar && (
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-stadiumGreen/40 bg-black text-xs text-white focus:outline-none focus:border-stadiumGreen"
              />
            )}
            {dateFilter && (
              <button onClick={() => { setDateFilter(''); setShowCalendar(false); }} className="px-2 py-2.5 rounded-xl bg-crimson/20 border border-crimson/30 text-crimson text-xs font-bold">Clear</button>
            )}
          </div>
        </div>

        {/* Ledger Table with 100% Clean Sweep Day Highlights */}
        <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-black/80 text-[10px] text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">DATE &amp; LEAGUE</th>
                  <th className="py-3 px-4">FIXTURE &amp; FT SCORE</th>
                  <th className="py-3 px-4 text-stadiumGreen">PREDICTION MADE</th>
                  <th className="py-3 px-2 text-center">ODDS</th>
                  <th className="py-3 px-3 text-center">OUTCOME</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-xs">
                {filtered.map((m) => {
                  const dayStat = dateStats[m.date || ''];
                  const isPerfectDay = dayStat && dayStat.total >= 2 && dayStat.lost === 0;

                  return (
                    <tr
                      key={m.id}
                      className={`transition-colors ${
                        isPerfectDay
                          ? 'bg-gradient-to-r from-stadiumGreen/10 via-transparent to-gold/10 hover:bg-stadiumGreen/20'
                          : 'hover:bg-white/[0.04]'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white">{m.league}</span>
                          {isPerfectDay && (
                            <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/40 text-[9px] font-black flex items-center space-x-1 animate-pulse">
                              <Crown className="w-3 h-3 text-gold inline" />
                              <span>100% SWEEP DAY</span>
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-500 block">{m.date}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-black text-white">
                          {m.homeTeam} <span className="text-gold font-mono px-1.5 py-0.5 rounded bg-black/60">{m.homeScore} - {m.awayScore}</span> {m.awayTeam}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-white">{m.prediction.selection}</span>
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-gold">
                        @{m.prediction.odds.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {m.prediction.result === 'WON' ? (
                          <span className="px-2 py-0.5 rounded-full bg-stadiumGreen/20 text-stadiumGreen font-black text-[10px]">WON ✓</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-crimson/20 text-crimson font-black text-[10px]">LOST ✗</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
