'use client';
import React, { useState } from 'react';
import { MatchData } from '../lib/sports-api';
import { ExternalLink, Check, Zap } from 'lucide-react';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { NIGERIAN_BOOKMAKERS_REGISTRY, universalBookmakerBridge } from '../lib/universal-bookmaker-registry';
import confetti from 'canvas-confetti';

interface BookmakerSlipExporterProps {
  match: MatchData;
}

const BOOKMAKER_FOMO_PERKS: Record<string, { fomo: string; perk: string; multiplier: string }> = {
  'stake': { fomo: '⚡ 200% VIP Bonus (Code: bPn8D0iA)', perk: 'Instant Crypto & Naira Payouts', multiplier: '1.30x' },
  '22bet': { fomo: '💎 100% Welcome Bonus up to ₦130,000 (ID: 972744)', perk: 'Friday Reload Boost', multiplier: '1.25x' },
  'sportybet': { fomo: '⚡ Instant 1-Second Cashout', perk: '1,000% Acca Multiplier', multiplier: '1.25x' },
  'bet9ja': { fomo: '🔥 100% Welcome Bonus up to ₦100,000', perk: '170% Win Boost', multiplier: '1.22x' },
  '1xbet': { fomo: '🌐 300% First Deposit Bonus', perk: 'Guaranteed Highest Match Odds', multiplier: '1.28x' },
};

export const BookmakerSlipExporter: React.FC<BookmakerSlipExporterProps> = ({ match }) => {
  const [copiedBookie, setCopiedBookie] = useState<string | null>(null);
  const p = match.prediction || { expectedHomeGoals: 1.85, expectedAwayGoals: 1.15, homeWinProb: 0.52, drawProb: 0.26, awayWinProb: 0.22, topPick: { selection: '1X', odds: 1.25, probability: 78 } };

  const handleExport = (bookmakerId: string) => {
    phoneHardware.triggerHaptic('SUCCESS');
    confetti({ particleCount: 30, spread: 60 });
    universalBookmakerBridge.loadBookmakerSlip(bookmakerId, match.homeTeam, match.awayTeam, p.topPick.selection, p.topPick.odds, match.league);
    setCopiedBookie(bookmakerId);
    setTimeout(() => setCopiedBookie(null), 3000);
  };

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-black/80 border-2 border-stadiumGreen/40 space-y-4 font-mono text-xs shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <span className="p-2 rounded-xl bg-stadiumGreen/20 text-stadiumGreen">⚡</span>
          <div>
            <span className="font-black text-white text-sm block">Universal 1-Click Bookmaker Slip &amp; VIP Multipliers</span>
            <span className="text-[10px] text-gray-400 font-sans">Auto-Generates Booking Codes with Real-Time Odds Multipliers</span>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40 text-[10px] font-black w-fit">
          🇳🇬 Verified Affiliate Bookmakers
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2.5">
        {NIGERIAN_BOOKMAKERS_REGISTRY.map((b) => {
          const perkData = BOOKMAKER_FOMO_PERKS[b.id] || { fomo: '⚡ Instant Payout', perk: 'Special Match Boost', multiplier: '1.22x' };
          const isCopied = copiedBookie === b.id;
          return (
            <button
              key={b.id}
              onClick={() => handleExport(b.id)}
              className={'p-3 rounded-2xl border transition-all text-left flex flex-col justify-between space-y-2 group hover:scale-[1.02] shadow-md ' + b.badgeClass}
              title={'Load slip & booking code on ' + b.name}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 min-w-0">
                  <span className="text-base">{b.logoEmoji}</span>
                  <span className="font-black text-white text-xs truncate">{b.name}</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-gold/20 text-gold font-mono font-black text-[9px]">
                  {perkData.multiplier}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-gray-200 block truncate">{perkData.fomo}</span>
                <span className="text-[9px] text-gray-400 block font-sans truncate">{perkData.perk}</span>
              </div>
              <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] font-black">
                {isCopied ? (
                  <span className="text-stadiumGreen flex items-center space-x-1">
                    <Check className="w-3 h-3 text-stadiumGreen" />
                    <span>Booking Code Copied!</span>
                  </span>
                ) : (
                  <span className="text-stadiumGreen group-hover:underline flex items-center space-x-1">
                    <span>1-Tap Auto-Load</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
