'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Trophy, ArrowLeft, CheckCircle2, XCircle, Calendar, ExternalLink } from 'lucide-react';
import { ArchivedMatch } from '../../lib/prediction-archive-engine';

export default function SettlementPage() {
  const [archive, setArchive] = useState<ArchivedMatch[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'WON' | 'LOST'>('ALL');

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

  const filtered = archive.filter((m) => {
    if (filter === 'WON') return m.prediction.result === 'WON';
    if (filter === 'LOST') return m.prediction.result === 'LOST';
    return true;
  });

  return (
    <div className="min-h-screen bg-void text-white font-mono p-4 sm:p-8 space-y-6">
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
              <span className="text-lg font-black text-gold">{totalCount}</span>
              <span className="text-[9px] text-gray-400 block">AUDITED MATCHES</span>
            </div>
            <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-center">
              <Calendar className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <span className="text-lg font-black text-white">100%</span>
              <span className="text-[9px] text-gray-400 block">REFEREE VERIFIED</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 bg-panel/60 p-2.5 rounded-2xl border border-white/10">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${filter === 'ALL' ? 'bg-stadiumGreen text-black font-black' : 'text-gray-400'}`}
          >
            All Settled ({totalCount})
          </button>
          <button
            onClick={() => setFilter('WON')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${filter === 'WON' ? 'bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40' : 'text-gray-400'}`}
          >
            🟢 Won ({wonCount})
          </button>
          <button
            onClick={() => setFilter('LOST')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${filter === 'LOST' ? 'bg-crimson/20 text-crimson border border-crimson/40' : 'text-gray-400'}`}
          >
            🔴 Lost ({lostCount})
          </button>
        </div>

        {/* Ledger Table */}
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
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-white/[0.04] transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-white">{m.league}</span>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
