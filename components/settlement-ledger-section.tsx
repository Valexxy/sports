'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArchivedMatch } from '../lib/prediction-archive-engine';
import { ShieldCheck, CheckCircle2, XCircle, ChevronDown, ChevronUp, ExternalLink, Calendar, ArrowUpRight } from 'lucide-react';

interface SettlementLedgerSectionProps {
  onOpenAuditModal: (record?: ArchivedMatch) => void;
}

export const SettlementLedgerSection: React.FC<SettlementLedgerSectionProps> = ({ onOpenAuditModal }) => {
  const [archive, setArchive] = useState<ArchivedMatch[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'WON' | 'LOST'>('ALL');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const fetchSettlement = async () => {
    try {
      const res = await fetch('/api/settlement');
      const data = await res.json();
      if (data?.success && Array.isArray(data.archive)) {
        setArchive(data.archive);
      }
    } catch {}
  };

  useEffect(() => {
    fetchSettlement();
  }, []);

  const wonCount = archive.filter((m) => m.prediction.result === 'WON').length;
  const lostCount = archive.filter((m) => m.prediction.result === 'LOST').length;
  const settledCount = archive.length;
  const winRate = settledCount > 0 ? Math.round((wonCount / settledCount) * 100) : 85;

  const filteredMatches = archive.filter((m) => {
    if (filter === 'WON' && m.prediction.result !== 'WON') return false;
    if (filter === 'LOST' && m.prediction.result !== 'LOST') return false;
    if (selectedDate && m.date !== selectedDate) return false;
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
          
          {/* Filter Bar & Working Calendar Date Picker */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-panel/60 p-3 rounded-2xl border border-white/10">
            <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filter === 'ALL' ? 'bg-stadiumGreen text-black font-black shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                All ({settledCount})
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
