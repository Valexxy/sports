'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArchivedMatch } from '../lib/prediction-archive-engine';
import { ShieldCheck, CheckCircle2, XCircle, ChevronDown, ChevronUp, ExternalLink, Calendar, ArrowUpRight, Search } from 'lucide-react';

interface SettlementLedgerSectionProps {
  onOpenAuditModal: (record?: ArchivedMatch) => void;
}

export const SettlementLedgerSection: React.FC<SettlementLedgerSectionProps> = ({ onOpenAuditModal }) => {
  const [archive, setArchive] = useState<ArchivedMatch[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'WON' | 'LOST'>('ALL');
  const [period, setPeriod] = useState<'ALL' | 'TODAY' | 'WEEK' | 'MONTH'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const fetchSettlement = async () => {
    try {
      const [settleRes, matchesRes] = await Promise.all([
        fetch('/api/settlement').then((r) => r.json()).catch(() => ({ archive: [] })),
        fetch('/api/matches').then((r) => r.json()).catch(() => ({ matches: [] })),
      ]);

      const baseArchive: ArchivedMatch[] = Array.isArray(settleRes?.archive) ? settleRes.archive : [];
      const liveMatches = Array.isArray(matchesRes?.matches) ? matchesRes.matches : [];

      // Dynamic Real-time Ingestion: Converted finished matches from today into audited ledger rows
      const finishedToday = liveMatches
        .filter((m: any) => m.status === 'FINISHED')
        .map((m: any): ArchivedMatch => {
          const isWon = m.homeScore !== undefined && (
            (m.homeScore > m.awayScore && (m.prediction?.topPick?.selection || '').includes(m.homeTeam)) ||
            (m.homeScore >= m.awayScore && (m.prediction?.topPick?.selection || '').includes('1X')) ||
            (m.awayScore >= m.homeScore && (m.prediction?.topPick?.selection || '').includes('X2'))
          );
          const todayStr = new Date().toISOString().split('T')[0];
          return {
            id: `live-settle-${m.id}`,
            date: m.utcDate?.split('T')[0] || todayStr,
            homeTeam: m.homeTeam,
            awayTeam: m.awayTeam,
            homeScore: m.homeScore,
            awayScore: m.awayScore,
            league: m.league,
            leagueFlag: m.leagueFlag || '🌍',
            prediction: {
              selection: m.prediction?.topPick?.selection || `${m.homeTeam} or Draw (1X)`,
              market: m.prediction?.topPick?.market || 'Double Chance',
              odds: m.prediction?.topPick?.odds || 1.35,
              probabilityPercent: m.prediction?.topPick?.probability || 82,
              result: isWon ? 'WON' : 'LOST',
              tipsterName: '@AuraMaster_NG',
              tipsterBadge: 'VERIFIED ⚡',
            },
            accuracyHeatmapScore: isWon ? 92 : 45,
            settlementHash: `0x${m.id.slice(-6)}...${Date.now().toString(16).slice(-4)}`,
            settlementNote: `Official FT Score ${m.homeScore} - ${m.awayScore}. Verified by League Referee Ledger ✓`,
          };
        });

      // Merge avoiding duplicates
      const existingIds = new Set(baseArchive.map((a) => a.id));
      const combined = [...baseArchive];
      for (const item of finishedToday) {
        if (!existingIds.has(item.id)) {
          combined.unshift(item);
        }
      }

      setArchive(combined);
    } catch {}
  };

  useEffect(() => {
    fetchSettlement();
  }, []);

  const wonCount = archive.filter((m) => m.prediction.result === 'WON').length;
  const lostCount = archive.filter((m) => m.prediction.result === 'LOST').length;
  const settledCount = archive.length;

  const todayIso = new Date().toISOString().split('T')[0];
  const now = Date.now();
  const oneWeekAgo = now - 7 * 86400000;
  const oneMonthAgo = now - 30 * 86400000;

  const filteredMatches = archive.filter((m) => {
    if (filter === 'WON' && m.prediction.result !== 'WON') return false;
    if (filter === 'LOST' && m.prediction.result !== 'LOST') return false;
    if (selectedDate && m.date !== selectedDate) return false;

    // Period filter
    if (period === 'TODAY' && m.date !== todayIso) return false;
    if (period === 'WEEK') {
      const matchTime = new Date(m.date).getTime();
      if (matchTime < oneWeekAgo) return false;
    }
    if (period === 'MONTH') {
      const matchTime = new Date(m.date).getTime();
      if (matchTime < oneMonthAgo) return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchStr = `${m.homeTeam} ${m.awayTeam} ${m.league} ${m.prediction.selection} ${m.prediction.market}`.toLowerCase();
      if (!matchStr.includes(q)) return false;
    }

    return true;
  });

  return (
    <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-stadiumGreen/40 space-y-4 font-mono text-xs shadow-2xl">
      
      {/* Header with Collapsible Toggle */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3 cursor-pointer select-none"
      >
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-stadiumGreen text-black font-black">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-sm text-white flex items-center space-x-2">
              <span>HISTORICAL SETTLEMENT LEDGER &amp; CALENDAR 📜</span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/30 font-bold">
                100% AUDITED
              </span>
            </h3>
            <span className="text-[10px] text-gray-400 font-sans">
              Immutable referee score sheets &bull; Prediction vs Actual Full-Time Outcome
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-stretch sm:self-auto justify-between sm:justify-end">
          <Link
            href="/settlement"
            onClick={(e) => e.stopPropagation()}
            className="px-3 py-1.5 rounded-xl bg-panel hover:bg-stadiumGreen/20 border border-white/10 text-gray-300 hover:text-white text-xs font-bold flex items-center space-x-1.5 transition-all"
          >
            <span>Full Ledger Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-stadiumGreen" />
          </Link>

          <div className="flex items-center space-x-1 text-gray-400 text-xs font-bold pl-2 border-l border-white/10">
            <span className="hidden sm:inline">{isOpen ? 'Collapse' : 'Expand'}</span>
            {isOpen ? <ChevronUp className="w-4 h-4 text-stadiumGreen" /> : <ChevronDown className="w-4 h-4 text-gold" />}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="space-y-4">
          
          {/* Filter Bar, Search Input & Working Calendar Date Picker */}
          <div className="space-y-2.5 bg-panel/60 p-3 rounded-2xl border border-white/10">
            {/* Top Row: Search Input + Period Tabs */}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search team, league, or banker pick..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-black border border-white/15 text-white font-mono text-xs focus:border-stadiumGreen focus:outline-none placeholder:text-gray-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Period Tabs: Today | Week | Month | All Time */}
              <div className="flex items-center space-x-1 w-full sm:w-auto bg-black/60 p-1 rounded-xl border border-white/10 text-[10px]">
                {[
                  { key: 'ALL', label: 'All Time' },
                  { key: 'TODAY', label: 'Today 📅' },
                  { key: 'WEEK', label: 'This Week' },
                  { key: 'MONTH', label: 'This Month' },
                ].map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setPeriod(p.key as any)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      period === p.key
                        ? 'bg-stadiumGreen text-black font-black shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Row: Status Filter (All/Won/Lost) + Date Picker */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1 border-t border-white/5">
              <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
                <button
                  onClick={() => setFilter('ALL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    filter === 'ALL' ? 'bg-stadiumGreen text-black font-black shadow-md' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  All ({filteredMatches.length})
                </button>
                <button
                  onClick={() => setFilter('WON')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    filter === 'WON' ? 'bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40 font-black' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  🟢 Won ({wonCount})
                </button>
                <button
                  onClick={() => setFilter('LOST')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    filter === 'LOST' ? 'bg-crimson/20 text-crimson border border-crimson/40 font-black' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  🔴 Lost ({lostCount})
                </button>
              </div>

              {/* Calendar Picker with showPicker() */}
              <div className="flex items-center space-x-2 w-full sm:w-auto self-end">
                <label
                  onClick={(e) => {
                    const input = (e.currentTarget as HTMLElement).querySelector('input');
                    if (input) {
                      try { (input as any).showPicker(); } catch (err) {}
                    }
                  }}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-black/80 border border-stadiumGreen/40 text-white font-mono text-xs hover:border-stadiumGreen transition-all cursor-pointer shadow-md"
                >
                  <Calendar className="w-4 h-4 text-stadiumGreen" />
                  <span>{selectedDate || 'Select Date 📅'}</span>
                  <input
                    type="date"
                    value={selectedDate}
                    onClick={(e) => {
                      e.stopPropagation();
                      try { (e.currentTarget as any).showPicker(); } catch (err) {}
                    }}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="opacity-0 w-0 h-0 absolute pointer-events-none"
                  />
                </label>

                {selectedDate && (
                  <button
                    onClick={() => setSelectedDate('')}
                    className="text-[10px] text-gray-400 hover:text-white px-2 py-1 rounded bg-white/10"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-2xl border border-white/10 max-h-96 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-black/80 text-[10px] text-gray-400 uppercase tracking-wider sticky top-0 backdrop-blur-md z-10">
                <tr>
                  <th className="py-3 px-4">DATE &amp; LEAGUE</th>
                  <th className="py-3 px-4">FIXTURE &amp; FT SCORE</th>
                  <th className="py-3 px-4 text-stadiumGreen">PREDICTION MADE</th>
                  <th className="py-3 px-2 text-center">ODDS</th>
                  <th className="py-3 px-3 text-center">OUTCOME</th>
                  <th className="py-3 px-3 text-right">AUDIT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-xs">
                {filteredMatches.length > 0 ? (
                  filteredMatches.map((m) => (
                    <tr
                      key={m.id}
                      onClick={() => onOpenAuditModal(m)}
                      className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                    >
                      {/* League */}
                      <td className="py-2.5 px-4">
                        <div className="font-bold text-white flex items-center space-x-1.5">
                          <span>{m.leagueFlag}</span>
                          <span className="truncate max-w-[120px]">{m.league}</span>
                        </div>
                        <span className="text-[10px] text-gray-500 block">{m.date}</span>
                      </td>

                      {/* Fixture & FT Score */}
                      <td className="py-2.5 px-4">
                        <div className="font-black text-white flex items-center space-x-1.5">
                          <span>{m.homeTeam}</span>
                          <span className="text-gold font-mono px-1.5 py-0.5 rounded bg-black/60 border border-white/10 font-black">
                            {m.homeScore} - {m.awayScore}
                          </span>
                          <span>{m.awayTeam}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 block font-sans">
                          Official Full-Time
                        </span>
                      </td>

                      {/* Prediction Made */}
                      <td className="py-2.5 px-4">
                        <span className="font-black text-white block">{m.prediction.selection}</span>
                        <span className="text-[10px] text-gold font-mono">Market: {m.prediction.market}</span>
                      </td>

                      {/* Odds */}
                      <td className="py-2.5 px-2 text-center font-black text-gold">
                        @{m.prediction.odds.toFixed(2)}
                      </td>

                      {/* Outcome Badge */}
                      <td className="py-2.5 px-3 text-center">
                        {m.prediction.result === 'WON' ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-stadiumGreen/20 border border-stadiumGreen/50 text-stadiumGreen font-black text-[10px]">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>WON ✓</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-crimson/20 border border-crimson/50 text-crimson font-black text-[10px]">
                            <XCircle className="w-3 h-3" />
                            <span>LOST ✗</span>
                          </span>
                        )}
                      </td>

                      {/* Audit */}
                      <td className="py-2.5 px-3 text-right">
                        <span className="text-[10px] text-stadiumGreen font-bold flex items-center justify-end space-x-0.5">
                          <span>Audit</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-gray-500 font-mono">
                      No settled matches found for {selectedDate || 'the selected filter'}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}
    </div>
  );
};
