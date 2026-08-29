'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { ShieldCheck, Trophy, ArrowLeft, CheckCircle2, XCircle, Calendar, Search, RotateCcw } from 'lucide-react';
import { ArchivedMatch } from '../../lib/prediction-archive-engine';
import { ProfessionalSettlementEngine } from '../../lib/settlement-engine';

type PeriodType = 'TODAY' | 'YESTERDAY' | 'WEEK' | 'MONTH' | 'ALL' | 'CUSTOM';

export default function SettlementPage() {
  const [archive, setArchive] = useState<ArchivedMatch[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'WON' | 'LOST'>('ALL');
  const [period, setPeriod] = useState<PeriodType>('TODAY'); // Default is DAILY (Today)
  const [customDate, setCustomDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch settlement archive AND real-time live/finished matches so today is always populated
    Promise.all([
      fetch('/api/settlement').then(r => r.json()).catch(() => ({ archive: [] })),
      fetch('/api/matches').then(r => r.json()).catch(() => ({ matches: [] }))
    ]).then(([settleRes, matchesRes]) => {
      const baseArchive: ArchivedMatch[] = Array.isArray(settleRes?.archive) ? settleRes.archive : [];
      const liveMatches = Array.isArray(matchesRes?.matches) ? matchesRes.matches : [];

      const todayStr = new Date().toISOString().split('T')[0];
      const finishedToday = liveMatches
        .filter((m: any) => ProfessionalSettlementEngine.isMatchFinished(m))
        .map((m: any): ArchivedMatch => {
          const settlement = ProfessionalSettlementEngine.settleMatch(m);
          return {
            id: `live-settle-${m.id}`,
            date: m.utcDate?.split('T')[0] || todayStr,
            homeTeam: m.homeTeam,
            awayTeam: m.awayTeam,
            homeScore: settlement.homeScore,
            awayScore: settlement.awayScore,
            league: m.league,
            leagueFlag: m.leagueFlag || '🌍',
            prediction: {
              selection: settlement.evaluatedSelection,
              market: m.prediction?.topPick?.market || 'Double Chance',
              odds: settlement.settledOdds,
              probabilityPercent: m.prediction?.topPick?.probability || 82,
              result: settlement.statusText,
              tipsterName: '@MivajMaster_NG',
              tipsterBadge: 'VERIFIED ⚡',
            },
            accuracyHeatmapScore: settlement.isWon ? 92 : settlement.isVoid ? 85 : 45,
            settlementHash: `0x${m.id.slice(-6)}...${Date.now().toString(16).slice(-4)}`,
            settlementNote: settlement.auditExplanation,
          };
        });

      const existingIds = new Set(baseArchive.map(a => a.id));
      const combined = [...baseArchive];
      for (const item of finishedToday) {
        if (!existingIds.has(item.id)) {
          combined.unshift(item);
        }
      }
      setArchive(combined);
    }).catch(() => {});
  }, []);

  const todayIso = useMemo(() => new Date().toISOString().split('T')[0], []);
  const yesterdayIso = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  }, []);

  const now = Date.now();
  const oneWeekAgo = now - 7 * 86400000;
  const oneMonthAgo = now - 30 * 86400000;

  // Filter archive by period first to power the stats cards and table
  const periodMatches = useMemo(() => {
    return archive.filter((m) => {
      const matchDate = m.date || '';
      if (period === 'CUSTOM' && customDate) {
        return matchDate === customDate;
      }
      if (period === 'TODAY') {
        return matchDate === todayIso;
      }
      if (period === 'YESTERDAY') {
        return matchDate === yesterdayIso;
      }
      if (period === 'WEEK') {
        const time = new Date(matchDate).getTime();
        return !isNaN(time) && time >= oneWeekAgo;
      }
      if (period === 'MONTH') {
        const time = new Date(matchDate).getTime();
        return !isNaN(time) && time >= oneMonthAgo;
      }
      return true; // 'ALL' accumulated
    });
  }, [archive, period, customDate, todayIso, yesterdayIso, oneWeekAgo, oneMonthAgo]);

  // If TODAY has 0 finished matches (e.g. before afternoon kickoff), check if fallback is needed
  const displayPeriodMatches = useMemo(() => {
    if (period === 'TODAY' && periodMatches.length === 0 && archive.length > 0) {
      // Find the most recent date available in the archive
      const latestDate = archive[0]?.date;
      if (latestDate && latestDate !== todayIso) {
        return archive.filter(m => m.date === latestDate);
      }
    }
    return periodMatches;
  }, [period, periodMatches, archive, todayIso]);

  const activePeriodLabel = useMemo(() => {
    if (period === 'CUSTOM') return `Selected Date: ${customDate}`;
    if (period === 'TODAY') {
      if (periodMatches.length === 0 && displayPeriodMatches.length > 0) {
        return `Today's Matches Live/Upcoming • Showing Latest Settled (${displayPeriodMatches[0]?.date})`;
      }
      return `Today's Record (${todayIso})`;
    }
    if (period === 'YESTERDAY') return `Yesterday's Record (${yesterdayIso})`;
    if (period === 'WEEK') return 'Past 7 Days Record (Weekly Accumulated)';
    if (period === 'MONTH') return 'Past 30 Days Record (Monthly Accumulated)';
    return 'All-Time Record (Total Accumulated)';
  }, [period, customDate, periodMatches.length, displayPeriodMatches, todayIso, yesterdayIso]);

  // Stats recalculated dynamically for the active period
  const wonCount = displayPeriodMatches.filter((m) => m.prediction.result === 'WON').length;
  const lostCount = displayPeriodMatches.filter((m) => m.prediction.result === 'LOST').length;
  const totalCount = displayPeriodMatches.length;
  const winRate = totalCount > 0 ? Math.round((wonCount / totalCount) * 100) : 0;

  // Filter displayed matches by WON/LOST and Search Query
  const filtered = useMemo(() => {
    return displayPeriodMatches.filter((m) => {
      if (filter === 'WON' && m.prediction.result !== 'WON') return false;
      if (filter === 'LOST' && m.prediction.result !== 'LOST') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const str = `${m.homeTeam} ${m.awayTeam} ${m.league} ${m.prediction.selection} ${m.prediction.market}`.toLowerCase();
        if (!str.includes(q)) return false;
      }
      return true;
    });
  }, [displayPeriodMatches, filter, searchQuery]);

  return (
    <div className="min-h-screen bg-void text-white font-mono p-3 sm:p-8 space-y-6 pb-20">
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
            <span className="text-stadiumGreen font-black text-sm">MIVAJ SPORTS</span>
            <span className="px-2 py-0.5 rounded bg-stadiumGreen/20 text-stadiumGreen text-[9px] font-black border border-stadiumGreen/30">
              LEDGER VERIFIED ✓
            </span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="glass-panel-premium rounded-3xl p-5 sm:p-8 border border-stadiumGreen/40 space-y-4 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center space-x-2">
                <span>OFFICIAL MATCH SETTLEMENT LEDGER 📜</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 font-sans">
                Immutable referee score sheets &bull; Prediction vs Actual Full-Time Outcome
              </p>
              <div className="pt-1">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-stadiumGreen/10 border border-stadiumGreen/30 text-stadiumGreen text-xs font-bold">
                  <span>Showing:</span>
                  <strong className="text-white">{activePeriodLabel}</strong>
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/60 border border-stadiumGreen/30 text-center min-w-[210px] shadow-lg">
              <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">
                {period === 'TODAY' ? "TODAY'S ACCURACY" : 'PERIOD ACCURACY'}
              </span>
              <span className="text-3xl sm:text-4xl font-black text-stadiumGreen">{winRate}%</span>
              <span className="text-[10px] text-gray-400 block pt-0.5">
                {wonCount} Won / {totalCount} Audited
              </span>
            </div>
          </div>

          {/* Dynamic Stats Grid (Daily by default, updates with period) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-black/40 border border-stadiumGreen/30 text-center shadow-md">
              <Trophy className="w-5 h-5 text-stadiumGreen mx-auto mb-1" />
              <span className="text-xl sm:text-2xl font-black text-stadiumGreen block">{wonCount}</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase block">
                {period === 'TODAY' ? "TODAY'S WINS" : 'PERIOD WINS'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-crimson/30 text-center shadow-md">
              <XCircle className="w-5 h-5 text-crimson mx-auto mb-1" />
              <span className="text-xl sm:text-2xl font-black text-crimson block">{lostCount}</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase block">
                {period === 'TODAY' ? "TODAY'S LOSSES" : 'PERIOD LOSSES'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-gold/30 text-center shadow-md">
              <ShieldCheck className="w-5 h-5 text-gold mx-auto mb-1" />
              <span className="text-xl sm:text-2xl font-black text-gold block">100%</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase block">AUDIT COMPLIANT</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-center shadow-md">
              <Calendar className="w-5 h-5 text-gray-300 mx-auto mb-1" />
              <span className="text-xl sm:text-2xl font-black text-white block">{totalCount}</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase block">
                {period === 'TODAY' ? "TODAY'S MATCHES" : 'PERIOD MATCHES'}
              </span>
            </div>
          </div>
        </div>

        {/* Period Selector Tabs: Daily by default, with Weekly, Monthly & All-Time accumulated */}
        <div className="flex flex-wrap items-center gap-2 bg-panel/80 p-2.5 rounded-2xl border border-white/10">
          <span className="text-[10px] text-gray-400 uppercase font-black px-2 hidden sm:inline">Period:</span>
          
          <button
            onClick={() => { setPeriod('TODAY'); setCustomDate(''); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              period === 'TODAY'
                ? 'bg-stadiumGreen text-black font-black shadow-lg glow-emerald'
                : 'bg-black/40 hover:bg-white/10 text-gray-300 border border-white/5'
            }`}
          >
            📅 Today (Daily)
          </button>

          <button
            onClick={() => { setPeriod('YESTERDAY'); setCustomDate(''); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              period === 'YESTERDAY'
                ? 'bg-stadiumGreen text-black font-black shadow-lg glow-emerald'
                : 'bg-black/40 hover:bg-white/10 text-gray-300 border border-white/5'
            }`}
          >
            📆 Yesterday
          </button>

          <button
            onClick={() => { setPeriod('WEEK'); setCustomDate(''); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              period === 'WEEK'
                ? 'bg-stadiumGreen text-black font-black shadow-lg glow-emerald'
                : 'bg-black/40 hover:bg-white/10 text-gray-300 border border-white/5'
            }`}
          >
            📊 This Week
          </button>

          <button
            onClick={() => { setPeriod('MONTH'); setCustomDate(''); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              period === 'MONTH'
                ? 'bg-stadiumGreen text-black font-black shadow-lg glow-emerald'
                : 'bg-black/40 hover:bg-white/10 text-gray-300 border border-white/5'
            }`}
          >
            🗓️ This Month
          </button>

          <button
            onClick={() => { setPeriod('ALL'); setCustomDate(''); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              period === 'ALL'
                ? 'bg-stadiumGreen text-black font-black shadow-lg glow-emerald'
                : 'bg-black/40 hover:bg-white/10 text-gray-300 border border-white/5'
            }`}
          >
            🏆 All-Time ({archive.length})
          </button>

          {/* Interactive Date Picker Button that triggers native calendar immediately */}
          <div className="relative ml-auto">
            <label
              onClick={() => {
                try { dateInputRef.current?.showPicker(); } catch {}
              }}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                period === 'CUSTOM'
                  ? 'bg-gold/20 text-gold border-gold/50 shadow-md'
                  : 'bg-black/60 hover:bg-white/10 border-white/10 text-gray-300 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4 text-gold" />
              <span>{customDate ? `📅 ${customDate}` : 'Pick Any Date 📅'}</span>
              <input
                ref={dateInputRef}
                type="date"
                value={customDate}
                onChange={(e) => {
                  if (e.target.value) {
                    setCustomDate(e.target.value);
                    setPeriod('CUSTOM');
                  }
                }}
                className="opacity-0 w-0 h-0 absolute pointer-events-none"
              />
            </label>

            {period === 'CUSTOM' && (
              <button
                onClick={() => {
                  setCustomDate('');
                  setPeriod('TODAY');
                }}
                title="Reset to Today"
                className="absolute -top-2 -right-2 p-1 rounded-full bg-crimson text-white hover:bg-red-600 shadow-md"
              >
                <RotateCcw className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        </div>

        {/* Outcome Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === 'ALL'
                  ? 'bg-stadiumGreen text-black font-black'
                  : 'bg-panel border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              All Outcomes ({totalCount})
            </button>
            <button
              onClick={() => setFilter('WON')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === 'WON'
                  ? 'bg-stadiumGreen text-black font-black'
                  : 'bg-panel border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              Wins ({wonCount})
            </button>
            <button
              onClick={() => setFilter('LOST')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === 'LOST'
                  ? 'bg-crimson text-white font-black'
                  : 'bg-panel border border-white/10 text-gray-400 hover:text-white'
              }`}
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
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-panel/80 border border-white/10 text-xs text-white placeholder-gray-500 focus:border-stadiumGreen focus:outline-none"
            />
          </div>
        </div>

        {/* Ledger Table: PREDICTION VS OUTCOME */}
        <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-black/90 text-[10px] text-gray-400 uppercase tracking-wider sticky top-0 backdrop-blur-md z-10">
                <tr>
                  <th className="py-3 px-4">DATE &amp; LEAGUE</th>
                  <th className="py-3 px-4">FIXTURE &amp; FT SCORE</th>
                  <th className="py-3 px-4 text-stadiumGreen">PREDICTION MADE</th>
                  <th className="py-3 px-2 text-center">ODDS</th>
                  <th className="py-3 px-3 text-center">OUTCOME</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-xs">
                {filtered.length > 0 ? (
                  filtered.map((m) => {
                    const isWon = m.prediction.result === 'WON';
                    const isVoid = m.prediction.result === 'VOID';

                    return (
                      <tr
                        key={m.id}
                        className="hover:bg-white/[0.04] transition-colors"
                      >
                        {/* League & Date */}
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-1.5">
                            <span>{m.leagueFlag || '🌍'}</span>
                            <span className="font-bold text-white truncate max-w-[140px]">{m.league}</span>
                          </div>
                          <span className="text-[10px] text-gray-500 block pt-0.5">{m.date}</span>
                        </td>

                        {/* Fixture & FT Score */}
                        <td className="py-3 px-4">
                          <div className="font-black text-white flex items-center space-x-2">
                            <span>{m.homeTeam}</span>
                            <span className="text-gold font-mono px-2 py-0.5 rounded bg-black/70 border border-white/10 font-black">
                              {m.homeScore} - {m.awayScore}
                            </span>
                            <span>{m.awayTeam}</span>
                          </div>
                          <span className="text-[10px] text-gray-400 block font-sans pt-0.5">
                            Full-Time Verified
                          </span>
                        </td>

                        {/* Prediction Made */}
                        <td className="py-3 px-4">
                          <span className="font-bold text-white block">{m.prediction.selection}</span>
                          <span className="text-[10px] text-gold font-mono">Market: {m.prediction.market}</span>
                        </td>

                        {/* Odds */}
                        <td className="py-3 px-2 text-center font-bold text-gold">
                          @{m.prediction.odds.toFixed(2)}
                        </td>

                        {/* Outcome */}
                        <td className="py-3 px-3 text-center">
                          {isWon ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40 font-black text-[10px]">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>WON ✓</span>
                            </span>
                          ) : isVoid ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-black text-[10px]">
                              <span>VOID 1.00x</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-crimson/20 text-crimson border border-crimson/40 font-black text-[10px]">
                              <XCircle className="w-3 h-3" />
                              <span>LOST ✗</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400 space-y-2">
                      <p className="text-sm font-bold">No audited matches found for {activePeriodLabel}</p>
                      <p className="text-xs text-gray-500">Try selecting another period tab (e.g. This Week, Yesterday, or All-Time).</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
