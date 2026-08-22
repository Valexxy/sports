import React from 'react';
import Link from 'next/link';
import { buildDynamicArchive, getLedgerStats } from '../../lib/prediction-archive-engine';
import { ShieldCheck, Trophy, ArrowLeft, CheckCircle2, XCircle, Calendar, Hash } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Official Match Settlement Ledger | AuraScore Stadium 2.0',
  description: '100% verified historical match settlement ledger with transparent referee scores, banker outcomes, won/lost audits, and ROI tracking.',
  keywords: ['Match settlements', 'verified football predictions', 'live score audit', 'referee ledger', 'sports accuracy'],
  openGraph: {
    title: 'Official Match Settlement Ledger | AuraScore Stadium 2.0',
    description: '100% transparent referee settlement ledger and audited prediction accuracy.',
    type: 'website',
  },
};

export default async function SettlementPage() {
  const [archive, stats] = await Promise.all([buildDynamicArchive(), getLedgerStats()]);
  const settled = archive.filter((m) => m.prediction.result !== 'PENDING');
  const wonCount = stats.won;
  const totalCount = stats.total;
  const winRate = stats.winRate;

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
            <span className="text-stadiumGreen font-black text-sm">AURASCORE STADIUM 2.0</span>
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
                Immutable record of all past match predictions, full-time referee score sheets, and verified win/loss outcomes — auto-settled from real final scores.
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
              <span className="text-lg font-black text-crimson">{stats.lost}</span>
              <span className="text-[9px] text-gray-400 block">TOTAL LOSSES</span>
            </div>
            <div className="p-3 rounded-2xl bg-black/40 border border-gold/30 text-center">
              <ShieldCheck className="w-5 h-5 text-gold mx-auto mb-1" />
              <span className="text-lg font-black text-gold">{settled.length}</span>
              <span className="text-[9px] text-gray-400 block">SETTLED FIXTURES</span>
            </div>
            <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-center">
              <Calendar className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <span className="text-lg font-black text-white">{totalCount}</span>
              <span className="text-[9px] text-gray-400 block">TOTAL FIXTURES</span>
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="p-4 bg-black/60 border-b border-white/10 flex items-center justify-between text-xs font-bold">
            <span className="text-white flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-stadiumGreen" />
              <span>ALL AUDITED FIXTURES</span>
            </span>
            <span className="text-gray-400 text-[11px]">{settled.length} Settled Games</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="border-b border-white/10 bg-panel/60 text-[10px] text-gray-400 uppercase">
                  <th className="py-3 px-4">Date & League</th>
                  <th className="py-3 px-4">Fixture & Official Score</th>
                  <th className="py-3 px-4">System Banker Pick</th>
                  <th className="py-3 px-3 text-center">Odds</th>
                  <th className="py-3 px-4 text-center">Outcome</th>
                  <th className="py-3 px-4 text-right">Settlement Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {archive.length > 0 ? (
                  archive.map((m) => (
                    <tr key={m.id} className="hover:bg-white/5 transition-all">
                      {/* Date & League */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <span>{m.leagueFlag}</span>
                          <span className="font-bold text-gray-300">{m.league}</span>
                        </div>
                        <span className="text-[10px] text-gray-500 block mt-0.5">{m.date}</span>
                      </td>

                      {/* Fixture & Score */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-extrabold text-white">
                          {m.homeTeam} <span className="text-stadiumGreen font-black px-1 py-0.2 rounded bg-black/70">{m.homeScore}</span> - <span className="text-stadiumGreen font-black px-1 py-0.2 rounded bg-black/70">{m.awayScore}</span> {m.awayTeam}
                        </div>
                        {m.settlementNote && (
                          <span className="text-[10px] text-gray-400 font-sans block mt-0.5">{m.settlementNote}</span>
                        )}
                      </td>

                      {/* Prediction */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-white block">{m.prediction.selection}</span>
                        <span className="text-[10px] text-gray-400 block">{m.prediction.market} • {m.prediction.tipsterName}</span>
                      </td>

                      {/* Odds */}
                      <td className="py-3 px-3 text-center font-bold text-gold">
                        {m.prediction.odds}
                      </td>

                      {/* Outcome WON / LOST / PENDING */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {m.prediction.result === 'WON' ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-stadiumGreen/20 text-stadiumGreen font-black text-[11px] border border-stadiumGreen/40">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>WON ✓</span>
                          </span>
                        ) : m.prediction.result === 'LOST' ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-crimson/20 text-crimson font-black text-[11px] border border-crimson/40">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>LOST ✗</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-gold/20 text-gold font-black text-[11px] border border-gold/40">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>PENDING</span>
                          </span>
                        )}
                      </td>

                      {/* Hash */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <span className="text-[10px] font-mono text-gray-500 bg-black/40 px-2 py-1 rounded border border-white/5 flex items-center justify-end space-x-1">
                          <Hash className="w-3 h-3 text-stadiumGreen" />
                          <span>{m.settlementHash || 'Awaiting FT...'}</span>
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      No fixtures loaded yet — the cron syncs the live ledger automatically.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-gray-500 font-sans py-4">
          AuraScore Stadium 2.0 • Live-Verified Match Settlements from Real Scores • 18+ Responsible Gaming
        </div>

      </div>
    </div>
  );
}
