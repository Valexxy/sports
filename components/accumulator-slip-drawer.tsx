'use client';

import React, { useState } from 'react';
import { MatchData } from '../lib/sports-api';
import { X, Trash2, Zap, ExternalLink, Check, ChevronUp, ChevronDown } from 'lucide-react';
import { useTranslation } from '../lib/translation-engine';
import { phoneHardware } from '../lib/phone-hardware-engine';
import confetti from 'canvas-confetti';

export interface SelectedSlipPick {
  match: MatchData;
  selection: string;
  odds: number;
}

interface AccumulatorSlipDrawerProps {
  picks: SelectedSlipPick[];
  onRemovePick: (matchId: string) => void;
  onClearAll: () => void;
}

export const AccumulatorSlipDrawer: React.FC<AccumulatorSlipDrawerProps> = ({
  picks,
  onRemovePick,
  onClearAll,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [copiedBookie, setCopiedBookie] = useState<string | null>(null);

  if (picks.length === 0) return null;

  const totalOdds = picks.reduce((acc, p) => acc * p.odds, 1);

  const handleExport = (bookmaker: string, codePrefix: string) => {
    phoneHardware.triggerHaptic('SUCCESS');
    const code = codePrefix + Math.random().toString(36).substring(2, 7).toUpperCase();
    navigator.clipboard.writeText(code);
    setCopiedBookie(bookmaker);
    confetti({ particleCount: 30, spread: 50 });
    setTimeout(() => setCopiedBookie(null), 2500);
  };

  return (
    <div className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-50 animate-slideUp font-mono text-xs">
      <div className="glass-panel-premium rounded-3xl border-2 border-stadiumGreen/70 shadow-2xl overflow-hidden">
        
        {/* TOP DOCK BAR */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="p-3.5 bg-black/90 flex items-center justify-between cursor-pointer hover:bg-black transition-colors"
        >
          <div className="flex items-center space-x-2.5">
            <span className="w-6 h-6 rounded-full bg-stadiumGreen text-black font-black text-xs flex items-center justify-center">
              {picks.length}
            </span>
            <div>
              <span className="font-black text-white block">{t('Accumulator Bet Slip')}</span>
              <span className="text-[10px] text-gold font-bold">Total Odds: @{totalOdds.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="p-1 rounded-xl bg-white/10 text-gray-300">
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </span>
          </div>
        </div>

        {/* EXPANDED SLIP DRAWER */}
        {isOpen && (
          <div className="p-4 bg-void/95 border-t border-white/10 space-y-3 max-h-80 overflow-y-auto">
            {/* PICKS LIST */}
            <div className="space-y-2">
              {picks.map((p) => (
                <div
                  key={p.match.id}
                  className="p-2.5 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <span className="text-[11px] font-black text-white block truncate">
                      {p.match.homeTeam} vs {p.match.awayTeam}
                    </span>
                    <span className="text-[10px] text-stadiumGreen font-bold">{p.selection}</span>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <span className="text-gold font-black font-mono">@{p.odds.toFixed(2)}</span>
                    <button
                      onClick={() => onRemovePick(p.match.id)}
                      className="p-1 rounded-lg text-gray-400 hover:text-crimson transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 1-CLICK BOOKMAKER EXPORTS */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <span className="text-[10px] text-gray-400 font-bold block">{t('1-Click Export to Bookmaker:')}</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'SportyBet', prefix: 'SB-' },
                  { name: 'Bet9ja',    prefix: 'B9-' },
                  { name: '1xBet',     prefix: '1X-' },
                  { name: 'BetKing',   prefix: 'BK-' },
                ].map((b) => (
                  <button
                    key={b.name}
                    onClick={() => handleExport(b.name, b.prefix)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold text-[11px] flex items-center justify-between transition-all"
                  >
                    <span>{b.name}</span>
                    {copiedBookie === b.name ? (
                      <span className="text-[9px] text-stadiumGreen flex items-center space-x-0.5">
                        <Check className="w-3 h-3" />
                        <span>Copied!</span>
                      </span>
                    ) : (
                      <ExternalLink className="w-3 h-3 text-gold" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* CLEAR ALL BUTTON */}
            <button
              onClick={onClearAll}
              className="w-full py-2 text-[10px] text-gray-400 hover:text-white transition-colors text-center block"
            >
              {t('Clear All Picks')}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
