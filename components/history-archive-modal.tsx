'use client';

import React, { useState, useEffect } from 'react';
import { ArchivedMatch } from '../lib/prediction-archive-engine';
import { detectUserLocationTimezone } from '../lib/timezone-engine';
import { X, Calendar, Trophy, CheckCircle, XCircle, Sparkles, MapPin, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HistoryModalProps {
  onClose: () => void;
}

export const HistoryArchiveModal: React.FC<HistoryModalProps> = ({ onClose }) => {
  const [archive, setArchive] = useState<ArchivedMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'WON' | 'LOST'>('ALL');
  const [activeDateRange, setActiveDateRange] = useState<'TODAY' | 'LAST_7_DAYS' | 'LAST_30_DAYS'>('TODAY');

  const userLocation = detectUserLocationTimezone();

  // Load the live-computed settlement archive from the API (real scores only).
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/settlement', { cache: 'no-store' });
        const data = await res.json();
        if (active && data?.success && Array.isArray(data.archive)) {
          setArchive(data.archive);
        }
      } catch {
        /* network error — empty archive */
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const filteredArchive = archive.filter((m) => {
    if (selectedFilter === 'WON') return m.prediction.result === 'WON';
    if (selectedFilter === 'LOST') return m.prediction.result === 'LOST';
    return true;
  });

  const wonCount = archive.filter((m) => m.prediction.result === 'WON').length;
  const totalFinished = archive.filter((m) => m.prediction.result !== 'PENDING').length;
  const winRate = totalFinished > 0 ? Math.round((wonCount / totalFinished) * 100) : 0;

  const triggerVictoryCelebration = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
    });
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-panel rounded-3xl border border-stadiumGreen/50 p-6 shadow-2xl my-8 font-mono text-xs">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-panel text-gray-400 hover:text-white border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-4 border-b border-white/10 pb-3">
          <div className="p-2.5 rounded-xl bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40">
            <Calendar className="w-6 h-6 text-stadiumGreen" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-extrabold text-xl text-white">HISTORICAL PREDICTIONS & ACCURACY HEATMAP 📜</h2>
              <span className="px-2 py-0.5 rounded bg-stadiumGreen/20 text-stadiumGreen font-bold text-[10px] border border-stadiumGreen/30 flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>{userLocation.city} ({userLocation.formattedOffset})</span>
              </span>
            </div>
            <p className="text-xs text-gray-400">Audited Won vs Lost Picks with Tipster Victory Celebrations</p>
          </div>
        </div>

        {/* Audited Win Rate Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-stadiumGreen/20 via-panel to-gold/20 border border-stadiumGreen/40 flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-mono text-stadiumGreen font-bold uppercase tracking-wider block">VERIFIED TRACK RECORD ACCURACY</span>
            <span className="text-2xl font-black text-white mt-0.5">{winRate}% SUCCESS RATE ({wonCount} WON / {totalFinished} FINISHED)</span>
            <span className="text-xs text-gray-300 block mt-0.5 font-sans">Kickoff times aligned to your local {userLocation.city} clock ({userLocation.flag}).</span>
          </div>

          <button
            onClick={triggerVictoryCelebration}
            className="px-4 py-2.5 rounded-xl bg-stadiumGreen text-black font-extrabold text-xs shadow-md hover:scale-105 transition-all flex items-center space-x-1"
          >
            <Sparkles className="w-4 h-4" />
            <span>Celebrate Wins 🎉</span>
          </button>
        </div>

        {/* Date Range & Result Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4 border-b border-white/10 pb-3">
          
          {/* Date Range Switcher */}
          <div className="flex space-x-1 font-mono text-xs">
            {(['TODAY', 'LAST_7_DAYS', 'LAST_30_DAYS'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setActiveDateRange(range)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeDateRange === range ? 'bg-stadiumGreen text-black' : 'bg-panel text-gray-400 border border-white/10'
                }`}
              >
                {range === 'TODAY' ? 'Today' : range === 'LAST_7_DAYS' ? 'Last 7 Days' : 'Last 30 Days'}
              </button>
            ))}
          </div>

          {/* Won / Lost Filter Pills */}
          <div className="flex space-x-1 font-mono text-xs">
            {(['ALL', 'WON', 'LOST'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  selectedFilter === f ? 'bg-gold text-black' : 'bg-panel text-gray-400 border border-white/10'
                }`}
              >
                {f === 'WON' ? '🟢 WON PICKS' : f === 'LOST' ? '🔴 LOST PICKS' : 'ALL ARCHIVE'}
              </button>
            ))}
          </div>

        </div>

        {/* Archived Match Cards Feed */}
        <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
          {loading ? (
            <div className="py-8 text-center text-gray-400 flex items-center justify-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-stadiumGreen" />
              <span>Syncing live settlement ledger...</span>
            </div>
          ) : filteredArchive.length === 0 ? (
            <div className="py-8 text-center text-gray-400">
              No settled predictions yet. The cron auto-settles every finished match from real scores.
            </div>
          ) : null}

          {!loading && filteredArchive.map((m) => (
            <div
              key={m.id}
              className={`p-4 rounded-2xl bg-panel border transition-all space-y-2 ${
                m.prediction.result === 'WON'
                  ? 'border-stadiumGreen/40 shadow-lg shadow-stadiumGreen/10 bg-stadiumGreen/5'
                  : m.prediction.result === 'LOST'
                  ? 'border-crimson/40 bg-crimson/5'
                  : 'border-white/10'
              }`}
            >
              {/* Card Top Info */}
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <div className="flex items-center space-x-2">
                  <span>{m.leagueFlag}</span>
                  <span className="text-gray-300 font-bold">{m.league}</span>
                  <span className="text-[10px] text-gray-500">• {m.date} ({m.kickoffTime} {userLocation.flag})</span>
                </div>

                {m.prediction.result === 'WON' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-stadiumGreen text-black font-black text-[10px] flex items-center space-x-1 glow-emerald">
                    <CheckCircle className="w-3 h-3" />
                    <span>🎉 100% CORRECT PICK</span>
                  </span>
                )}

                {m.prediction.result === 'LOST' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-crimson text-white font-bold text-[10px] flex items-center space-x-1">
                    <XCircle className="w-3 h-3" />
                    <span>FAILED PICK</span>
                  </span>
                )}
              </div>

              {/* Scoreline & Teams */}
              <div className="flex justify-between items-center py-1">
                <div className="font-extrabold text-white text-sm">
                  {m.homeTeam} <span className="text-stadiumGreen">{m.homeScore}</span> - <span className="text-stadiumGreen">{m.awayScore}</span> {m.awayTeam}
                </div>

                {/* Prediction Heatmap Accuracy Bar */}
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] text-gray-400">ACCURACY HEATMAP:</span>
                  <div className="w-16 h-2 rounded-full bg-gray-800 overflow-hidden">
                    <div
                      className={`h-full ${m.accuracyHeatmapScore >= 80 ? 'bg-stadiumGreen' : 'bg-gold'}`}
                      style={{ width: `${m.accuracyHeatmapScore}%` }}
                    ></div>
                  </div>
                  <span className="font-bold text-stadiumGreen">{m.accuracyHeatmapScore}%</span>
                </div>
              </div>

              {/* Prediction Pick & Tipster Celebration */}
              <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 flex justify-between items-center">
                <div>
                  <span className="text-gray-400 text-[10px] block">PREDICTED PICK:</span>
                  <strong className="text-white font-bold">{m.prediction.selection} @ {m.prediction.odds}</strong>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-stadiumGreen font-bold block">{m.prediction.tipsterName}</span>
                  <span className="text-[9px] text-gold font-bold px-1.5 py-0.2 rounded bg-gold/20 border border-gold/30">
                    {m.prediction.tipsterBadge}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
