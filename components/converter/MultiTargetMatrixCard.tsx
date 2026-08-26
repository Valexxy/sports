'use client';

import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Zap, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { stadiumAudio } from '../../lib/sound-synthesizer';
import { TargetMatrixItem } from '../../app/api/converter/translate/route';

interface MultiTargetMatrixCardProps {
  targets: TargetMatrixItem[];
  originalCode: string;
}

export const MultiTargetMatrixCard: React.FC<MultiTargetMatrixCardProps> = ({ targets, originalCode }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleLaunchAndCopy = (target: TargetMatrixItem) => {
    // 1. Copy Code
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(target.targetCode);
    }
    setCopiedId(target.bookmakerId);

    // 2. Feedback
    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.playBookmarkSound();
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });

    // 3. Drop Tracking Cookie & Open in New Tab
    setTimeout(() => {
      window.open(target.affiliateUrl, '_blank');
    }, 150);

    setTimeout(() => setCopiedId(null), 3500);
  };

  return (
    <div className="space-y-4 font-mono text-xs animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-stadiumGreen/20 text-stadiumGreen">
            <Zap className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white">
              UNIVERSAL MULTI-TARGET CONVERSION MATRIX
            </h3>
            <span className="text-[10px] text-gray-400 font-sans">
              Generated 5 verified booking codes from original input [{originalCode}]
            </span>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-stadiumGreen/20 text-stadiumGreen font-black text-[11px] border border-stadiumGreen/40 w-fit">
          ● 5/5 Bookmakers Synced
        </span>
      </div>

      {/* Grid of 5 Top Bookmakers Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {targets.map((t) => {
          const isCopied = copiedId === t.bookmakerId;
          const isTopOdds = t.totalOdds === Math.max(...targets.map(x => x.totalOdds));

          return (
            <div
              key={t.bookmakerId}
              className={`p-4 rounded-3xl border-2 flex flex-col justify-between space-y-3 transition-all hover:scale-[1.02] shadow-xl ${
                isTopOdds
                  ? 'bg-gradient-to-b from-[#1475e1]/20 to-[#0a0d14] border-[#1475e1] glow-emerald'
                  : 'bg-[#0d111a] border-white/10 hover:border-stadiumGreen/50'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl p-1.5 rounded-xl bg-black/60 border border-white/10">{t.logoEmoji}</span>
                  <div>
                    <span className="font-black text-white text-xs block">{t.shortName}</span>
                    <span className="text-[9px] text-gray-400 font-sans">{t.promoBadge.split('•')[0]}</span>
                  </div>
                </div>

                {isTopOdds && (
                  <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold text-[9px] font-black border border-gold/40 animate-pulse">
                    🔥 BEST ODDS
                  </span>
                )}
              </div>

              {/* Code & Multiplier Pill */}
              <div className="p-3 rounded-2xl bg-black/70 border border-white/10 space-y-1">
                <span className="text-[9px] text-gray-400 block font-mono">TARGET BOOKING CODE</span>
                <span className="text-base sm:text-lg font-black text-stadiumGreen tracking-wider block">
                  {t.targetCode}
                </span>

                <div className="pt-1 flex items-center justify-between text-[11px] border-t border-white/5">
                  <span className="text-gray-400">Total Odds:</span>
                  <span className="font-black text-gold font-mono">{t.totalOdds}x</span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-gray-400 font-sans">
                  <span>₦1,000 Payout:</span>
                  <span className="font-black text-emerald-400 font-mono">₦{t.simulatedPayout1k.toLocaleString()}</span>
                </div>
              </div>

              {/* Dual Action 1-Tap Launch Button */}
              <button
                onClick={() => handleLaunchAndCopy(t)}
                className="w-full py-3 px-2 rounded-2xl bg-gradient-to-r from-stadiumGreen to-emerald-400 hover:from-stadiumGreen/90 hover:to-emerald-300 text-black font-black text-xs flex items-center justify-center space-x-1.5 shadow-lg active:scale-95 transition-all"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3] text-black" />
                    <span className="truncate">Copied &amp; Launching...</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-black" />
                    <span className="truncate">Copy &amp; Open {t.shortName}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
