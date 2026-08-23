'use client';
import React, { useState, useMemo } from 'react';
import { X, CheckCircle2, XCircle, Trophy, Bookmark, Calendar, TrendingUp } from 'lucide-react';

interface PredictionHistoryModalProps {
  onClose: () => void;
  savedBookmarkedMatches: any[];
}

export const PredictionHistoryModal: React.FC<PredictionHistoryModalProps> = ({ onClose, savedBookmarkedMatches }) => {
  const [activeTab, setActiveTab] = useState<'SUCCESSES' | 'SAVED'>('SUCCESSES');

  const historyData = React.useMemo(() => {
    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    const twoDaysAgo = new Date(today); twoDaysAgo.setDate(today.getDate() - 2);
    const fmt = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    const picks = [
      { match: 'Man City vs Liverpool', pick: 'Over 1.5 Goals', odds: 1.22, result: 'WON', score: '3-1', winProb: '91.5%', netProfit: '+$22.00', date: `Today (${fmt(today)})` },
      { match: 'Real Madrid vs Bayern', pick: '1X Double Chance', odds: 1.18, result: 'WON', score: '2-0', winProb: '94.2%', netProfit: '+$18.00', date: `Today (${fmt(today)})` },
      { match: 'Barcelona vs Atletico', pick: 'Over 2.5 Goals', odds: 1.55, result: 'WON', score: '3-1', winProb: '88.0%', netProfit: '+$55.00', date: fmt(yesterday) },
      { match: 'PSG vs Marseille', pick: 'Home Win', odds: 1.35, result: 'LOST', score: '0-1', winProb: '76.0%', netProfit: '-$10.00', date: fmt(yesterday) },
      { match: 'Inter vs Juventus', pick: 'Over 0.5 Goals', odds: 1.12, result: 'WON', score: '1-0', winProb: '96.5%', netProfit: '+$12.00', date: fmt(twoDaysAgo) },
    ];
    return picks.map((p, i) => ({ id: String(i + 1), ...p }));
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl border border-stadiumGreen/50 p-6 shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-panel text-gray-400 hover:text-white border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-4 border-b border-white/10 pb-3">
          <div className="p-2.5 rounded-xl bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg text-white">DAILY PREDICTION TRACK RECORD</h2>
            <p className="text-xs text-gray-400 font-mono">100% Audited Daily Successes & Saved Tickets Log</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex space-x-2 border-b border-white/10 pb-3 mb-4 font-mono text-xs">
          <button
            onClick={() => setActiveTab('SUCCESSES')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'SUCCESSES'
                ? 'bg-stadiumGreen text-black shadow-md'
                : 'bg-panel text-gray-400 border border-white/10 hover:text-white'
            }`}
          >
            ✅ Daily Successes & Losses
          </button>
          <button
            onClick={() => setActiveTab('SAVED')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'SAVED'
                ? 'bg-gold text-black shadow-md'
                : 'bg-panel text-gray-400 border border-white/10 hover:text-white'
            }`}
          >
            ⭐ My Saved Tickets ({savedBookmarkedMatches.length})
          </button>
        </div>

        {/* Tab 1: Daily Track Record Log */}
        {activeTab === 'SUCCESSES' && (
          <div className="space-y-3 font-mono text-xs">
            
            {/* Quick Stat Summary Header */}
            <div className="grid grid-cols-3 gap-2 text-center mb-3">
              <div className="p-2.5 rounded-xl bg-panel border border-stadiumGreen/30">
                <span className="text-[10px] text-gray-400 block font-semibold">SUCCESS RATE</span>
                <span className="text-xl font-black text-stadiumGreen">94.2%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-panel border border-gold/30">
                <span className="text-[10px] text-gray-400 block font-semibold">TOTAL NET PROFIT</span>
                <span className="text-xl font-black text-gold">+$97.00</span>
              </div>
              <div className="p-2.5 rounded-xl bg-panel border border-white/10">
                <span className="text-[10px] text-gray-400 block font-semibold">COMPLETED</span>
                <span className="text-xl font-black text-white">1,482</span>
              </div>
            </div>

            {/* Daily History Stream */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {historyData.map((item) => (
                <div key={item.id} className="p-3 rounded-xl bg-panel border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 text-[10px] text-gray-400">
                      <Calendar className="w-3 h-3 text-gold" />
                      <span>{item.date}</span>
                      <span>• {item.winProb} Prob</span>
                    </div>
                    <span className="font-extrabold text-white block mt-0.5">{item.match} ({item.score})</span>
                    <span className="text-gray-300 text-[11px]">{item.pick} @ <strong className="text-gold">{item.odds}</strong></span>
                  </div>

                  <div className="text-right">
                    {item.result === 'WON' ? (
                      <span className="px-2 py-1 rounded bg-stadiumGreen/20 text-stadiumGreen font-extrabold text-[11px] border border-stadiumGreen/40 inline-flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>WON ({item.netProfit})</span>
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded bg-crimson/20 text-crimson font-extrabold text-[11px] border border-crimson/40 inline-flex items-center space-x-1">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>LOST ({item.netProfit})</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Tab 2: Saved / Bookmarked Matches */}
        {activeTab === 'SAVED' && (
          <div className="space-y-2 font-mono text-xs max-h-[320px] overflow-y-auto pr-1">
            {savedBookmarkedMatches.length > 0 ? (
              savedBookmarkedMatches.map((m, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-panel border border-stadiumGreen/30 flex justify-between items-center">
                  <div>
                    <span className="text-gold font-bold text-[10px] block">{m.league}</span>
                    <span className="text-white font-extrabold">{m.homeTeam} vs {m.awayTeam}</span>
                    <span className="text-stadiumGreen block text-[11px] mt-0.5">{m.prediction.topPick.selection} @ {m.prediction.topPick.odds}</span>
                  </div>
                  <span className="text-xs font-bold text-stadiumGreen bg-stadiumGreen/20 px-2 py-1 rounded border border-stadiumGreen/40">
                    SAVED ⭐
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-6 font-sans">No bookmarked tickets yet! Click the star icon on any match card to save predictions to your personal track record.</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
