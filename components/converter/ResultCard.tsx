'use client';

import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Sparkles, Trophy, Zap, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { stadiumAudio } from '../../lib/sound-synthesizer';
import { ConversionResponse } from '../../app/api/converter/translate/route';
import { AFFILIATE_REGISTRY } from '../../utils/affiliates';

interface ResultCardProps {
  result: ConversionResponse;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const targetPartner = AFFILIATE_REGISTRY[result.targetBookmaker] || AFFILIATE_REGISTRY['STAKE'];

  const handleCopyAndOpen = () => {
    // 1. Copy code to clipboard
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(result.targetCode);
    }
    setCopied(true);

    // 2. Tactile Audio + Haptics + Confetti
    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.playBookmarkSound();
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });

    // 3. Simultaneously open affiliate tracking URL to drop cookie
    setTimeout(() => {
      window.open(result.affiliateUrl, '_blank');
    }, 150);

    setTimeout(() => setCopied(false), 4000);
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-[#0d111a] border-2 border-stadiumGreen/60 font-mono shadow-2xl space-y-5 glow-emerald animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-stadiumGreen/20 text-stadiumGreen">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-black text-white block">
              CONVERSION COMPLETED • {result.sourceBookmaker} &rarr; {result.targetBookmaker}
            </span>
            <span className="text-[11px] text-gray-400 font-sans">
              Matched {result.matchedLegsCount} of {result.totalLegsCount} selections • Total Odds: {result.totalOdds}x
            </span>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-stadiumGreen/20 text-stadiumGreen font-black text-xs border border-stadiumGreen/40 w-fit">
          {targetPartner.promoText}
        </span>
      </div>

      {/* Target Code Highlight Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-gray-400 block mb-0.5">TARGET BOOKING CODE ({targetPartner.name})</span>
          <span className="text-2xl sm:text-3xl font-black text-stadiumGreen tracking-wider">
            {result.targetCode}
          </span>
        </div>

        {/* Dual Action Copy & Open Button */}
        <button
          onClick={handleCopyAndOpen}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-stadiumGreen to-emerald-400 hover:from-stadiumGreen/90 hover:to-emerald-300 text-black font-black text-sm flex items-center justify-center space-x-2 shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-black" />
              <span>Copied &amp; Launching {targetPartner.shortName}...</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-black" />
              <span>[ Copy Code &amp; Open {targetPartner.shortName} ]</span>
            </>
          )}
        </button>
      </div>

      {/* Leg-by-leg Matched Selections */}
      <div className="space-y-2">
        <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">
          Matched Selections ({result.legs.length} Legs)
        </h4>
        <div className="space-y-2">
          {result.legs.map((leg) => (
            <div
              key={leg.id}
              className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                leg.isAvailableOnTarget
                  ? 'bg-panel border-white/10 text-gray-200'
                  : 'bg-red-500/10 border-red-500/30 text-red-300'
              }`}
            >
              <div className="space-y-0.5">
                <div className="font-bold text-white">
                  {leg.homeTeam} vs {leg.awayTeam}
                </div>
                <div className="text-[10px] text-gray-400 font-sans">
                  {leg.league} &bull; {leg.kickoffTime} &bull; Market: {leg.targetMarket}
                </div>
              </div>

              <div className="text-right">
                <span className="px-2 py-0.5 rounded bg-stadiumGreen/20 text-stadiumGreen font-black text-[11px]">
                  {leg.odds.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
