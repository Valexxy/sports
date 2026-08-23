'use client';
import React from 'react';
import { MatchData } from '../lib/sports-api';
import { Sparkles, Trophy, Plus, Check, ArrowRight } from 'lucide-react';
import { useTranslation } from '../lib/translation-engine';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';

interface DailyBankerAccumulatorCardProps {
  matches: MatchData[];
  onAddMultiPick?: (picks: Array<{ match: MatchData; selection: string; odds: number }>) => void;
  onOpenMatch?: (match: MatchData) => void;
}

export const DailyBankerAccumulatorCard: React.FC<DailyBankerAccumulatorCardProps> = ({
  matches,
  onAddMultiPick,
  onOpenMatch,
}) => {
  const { t } = useTranslation();

  // Find top 3 highest probability banker matches
  const topBankers = matches
    .filter((m) => (m.prediction?.topPick?.probability || 0) >= 70)
    .slice(0, 3);

  if (topBankers.length < 2) return null;

  const totalOdds = topBankers.reduce((acc, m) => acc * (m.prediction?.topPick?.odds || 1.15), 1);
  const avgProb = Math.round(
    topBankers.reduce((acc, m) => acc + (m.prediction?.topPick?.probability || 75), 0) / topBankers.length
  );

  const handleAddAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.playAddPickSound();
    if (onAddMultiPick) {
      const picks = topBankers.map((m) => ({
        match: m,
        selection: m.prediction.topPick.selection,
        odds: m.prediction.topPick.odds,
      }));
      onAddMultiPick(picks);
    }
  };

  return (
    <div className="relative rounded-3xl bg-gradient-to-r from-stadiumGreen/20 via-panel to-gold/15 border-2 border-stadiumGreen/60 p-4 sm:p-5 shadow-2xl space-y-3 font-mono text-xs overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-stadiumGreen/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-xl bg-stadiumGreen text-black font-black">
            <Trophy className="w-4 h-4" />
          </span>
          <div>
            <h3 className="font-black text-sm text-white flex items-center space-x-1.5">
              <span>{t('Daily 3-Game Safe Accumulator')}</span>
              <Sparkles className="w-3.5 h-3.5 text-gold animate-spin" />
            </h3>
            <p className="text-[10px] text-gray-300 font-sans">
              {t('Handpicked High-Confidence Banker Combinations')}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-gray-400 block font-bold">TOTAL ODDS</span>
          <span className="text-base sm:text-lg font-black text-gold font-mono">
            @{totalOdds.toFixed(2)}
          </span>
        </div>
      </div>

      {/* 3 Matches Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {topBankers.map((m, idx) => (
          <div
            key={m.id}
            onClick={() => onOpenMatch && onOpenMatch(m)}
            className="p-2.5 rounded-2xl bg-black/60 border border-white/10 hover:border-stadiumGreen/50 transition-all cursor-pointer space-y-1"
          >
            <div className="flex items-center justify-between text-[9px] text-gray-400">
              <span className="text-gold font-bold">Game {idx + 1}</span>
              <span>{m.league}</span>
            </div>
            <div className="text-[11px] font-black text-white truncate">
              {m.homeTeam} vs {m.awayTeam}
            </div>
            <div className="flex items-center justify-between text-[10px] pt-0.5">
              <span className="text-stadiumGreen font-bold truncate">{m.prediction.topPick.selection}</span>
              <span className="text-gold font-mono font-black">@{m.prediction.topPick.odds.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/10">
        <span className="text-[10px] text-stadiumGreen font-black">
          ✓ {avgProb}% {t('Combined Win Probability')}
        </span>

        <button
          onClick={handleAddAll}
          className="px-5 py-2.5 rounded-2xl bg-stadiumGreen text-black font-black text-xs flex items-center space-x-2 shadow-lg hover:bg-emerald-400 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{t('Add 3 Bankers to Slip')} (@{totalOdds.toFixed(2)})</span>
        </button>
      </div>
    </div>
  );
};
