'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DAILY_MATCHES_ARCHIVE, ArchivedMatch } from '../lib/prediction-archive-engine';
import { ShieldCheck, CheckCircle2, XCircle, ChevronDown, ChevronUp, ExternalLink, Calendar, Filter, ArrowUpRight } from 'lucide-react';

interface SettlementLedgerSectionProps {
  onOpenAuditModal: (record?: ArchivedMatch) => void;
}

export const SettlementLedgerSection: React.FC<SettlementLedgerSectionProps> = ({ onOpenAuditModal }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'WON' | 'LOST'>('ALL');
  const [selectedDate, setSelectedDate] = useState<string>('ALL');

  const wonCount = DAILY_MATCHES_ARCHIVE.filter((m) => m.prediction.result === 'WON').length;
  const lostCount = DAILY_MATCHES_ARCHIVE.filter((m) => m.prediction.result === 'LOST').length;
  const totalCount = DAILY_MATCHES_ARCHIVE.length;
  const winRate = Math.round((wonCount / totalCount) * 100);

  const filteredMatches = DAILY_MATCHES_ARCHIVE.filter((m) => {
    if (filter === 'WON' && m.prediction.result !== 'WON') return false;
    if (filter === 'LOST' && m.prediction.result !== 'LOST') return false;
    if (selectedDate !== 'ALL' && m.date !== selectedDate) return false;
    return true;
  });

  return (
    <div className="glass-panel rounded-3xl p-5 border border-stadiumGreen/40 space-y-4 font-mono text-xs shadow-2xl">
      
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
              <span>HISTORICAL SETTLEMENT LEDGER & CALENDAR 📜</span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/30 font-bold">
                100% AUDITED
              </span>
            </h3>
            <span className="text-[10px] text-gray-400 font-sans">
              Immutable referee score sheets, banker accuracy ({winRate}% Win Rate), and verified payouts.
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-stretch sm:self-auto justify-between sm:justify-end">
          {/* Action Links */}
          <Link
            href="/settlement"
            onClick={(e) => e.stopPropagation()}
            className="px-3 py-1.5 rounded-xl bg-panel hover:bg-stadiumGreen/20 border border-white/10 text-gray-300 hover:text-white text-xs font-bold flex items-center space-x-1.5 transition-all"
          >
            <span>Full Ledger Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-stadiumGreen" />
          </Link>

          {/* Collapsible Chevron */}
          <div className="flex items-center space-x-1 text-gray-400 text-xs font-bold pl-2 border-l border-white/10">
            <span className="hidden sm:inline">{isOpen ? 'Collapse' : 'Expand'}</span>
            {isOpen ? <ChevronUp className="w-4 h-4 text-stadiumGreen" /> : <ChevronDown className="w-4 h-4 text-gold" />}
          </div>
        </div>
      </div>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="space-y-4 animate-fadeIn">
          
          {/* Filter Bar & Calendar Date Selector */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-black/50 p-3 rounded-2xl border border-white/10">
            
            {/* Outcome Filter Tabs */}
            <div className="flex items-center space-x-1.5 overflow-x-auto">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filter === 'ALL' ? 'bg-stadiumGreen text-black font-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                All Settled ({totalCount})
              </button>
              <button
                onClick={() => setFilter('WON')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filter === 'WON' ? 'bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40 font-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                🟢 Won Picks ({wonCount})
              </button>
              <button
                onClick={() => setFilter('LOST')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filter === 'LOST' ? 'bg-crimson/20 text-crimson border border-crimson/40 font-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                🔴 Lost Picks ({lostCount})
              </button>
            </div>

            {/* Interactive Calendar Date Picker & Quick Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center space-x-1.5 bg-panel px-2.5 py-1 rounded-xl border border-white/10 text-gray-300">
                <Calendar className="w-3.5 h-3.5 text-gold" />
                <span className="text-[10px] font-bold">Pick Date:</span>
                <input
                  type="date"
                  value={selectedDate === 'ALL' ? '' : selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value ? e.target.value : 'ALL')}
                  className="bg-black/60 border border-white/10 rounded-lg px-2 py-0.5 text-white text-[11px] font-mono focus:outline-none focus:border-stadiumGreen"
                />
              </div>

              {selectedDate !== 'ALL' && (
                <button
                  onClick={() => setSelectedDate('ALL')}
                  className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 text-[10px] font-bold"
                >
                  Clear Date ✕
                </button>
              )}
            </div>

          </div>

          {/* Settled Fixtures Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-panel/80 text-[10px] text-gray-400 font-bold uppercase">
                  <th className="py-2.5 px-3">Date & League</th>
                  <th className="py-2.5 px-4">Fixture & Full-Time Score</th>
                  <th className="py-2.5 px-4">System Banker Pick</th>
                  <th className="py-2.5 px-2 text-center">Odds</th>
                  <th className="py-2.5 px-3 text-center">Outcome</th>
                  <th className="py-2.5 px-3 text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {filteredMatches.length > 0 ? (
                  filteredMatches.slice(0, 6).map((m) => (
                    <tr 
                      key={m.id} 
                      onClick={() => onOpenAuditModal(m)}
                      className="hover:bg-white/5 transition-all cursor-pointer group"
                      title="Click to view full settlement audit"
                    >
                      {/* Date & League */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="font-bold text-gray-300">{m.leagueFlag} {m.league}</span>
                        <span className="text-[10px] text-gray-500 block">{m.date}</span>
                      </td>

                      {/* Fixture & Score */}
                      <td className="py-2.5 px-4 whitespace-nowrap">
                        <div className="font-black text-white group-hover:text-stadiumGreen transition-all">
                          {m.homeTeam} <span className="text-stadiumGreen font-mono px-1.5 py-0.2 rounded bg-black/80">{m.homeScore} - {m.awayScore}</span> {m.awayTeam}
                        </div>
                        {m.settlementNote && (
                          <span className="text-[10px] text-gray-400 font-sans block">{m.settlementNote}</span>
                        )}
                      </td>

                      {/* Prediction */}
                      <td className="py-2.5 px-4">
                        <span className="font-bold text-white block">{m.prediction.selection}</span>
                        <span className="text-[10px] text-gray-500 block">{m.prediction.market}</span>
                      </td>

                      {/* Odds */}
                      <td className="py-2.5 px-2 text-center font-bold text-gold">
                        {m.prediction.odds}
                      </td>

                      {/* Outcome WON / LOST */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        {m.prediction.result === 'WON' ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-stadiumGreen/20 text-stadiumGreen font-black text-[10px] border border-stadiumGreen/40">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>WON ✓</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-crimson/20 text-crimson font-black text-[10px] border border-crimson/40">
                            <XCircle className="w-3 h-3" />
                            <span>LOST ✗</span>
                          </span>
                        )}
                      </td>

                      {/* Audit Button */}
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <span className="text-[10px] text-stadiumGreen font-bold group-hover:underline flex items-center justify-end space-x-1">
                          <span>Audit</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-gray-400">
                      No settled matches found for the selected date ({selectedDate}). Pick another date or select "All Settled".
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
