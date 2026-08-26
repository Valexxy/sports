'use client';

import React from 'react';
import { AlertTriangle, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { stadiumAudio } from '../../lib/sound-synthesizer';

interface FallbackBannerProps {
  reason?: string;
  alternative?: {
    bookmaker: string;
    promoText: string;
    affiliateUrl: string;
  };
}

export const FallbackBanner: React.FC<FallbackBannerProps> = ({ reason, alternative }) => {
  if (!alternative) return null;

  const handleAlternativeClick = () => {
    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.playBookmarkSound();
    window.open(alternative.affiliateUrl, '_blank');
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-xs font-mono space-y-3 shadow-xl glow-emerald animate-fadeIn">
      <div className="flex items-start space-x-3">
        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="font-black text-amber-300 text-sm flex items-center space-x-2">
            <span>PARTIAL CONVERSION DETECTED</span>
          </h4>
          <p className="text-gray-300 font-sans leading-relaxed text-[11px]">
            {reason || 'Some markets are unavailable on your selected bookmaker. We recommend using Stake or 22Bet for full coverage.'}
          </p>
        </div>
      </div>

      <div className="pt-2 border-t border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] text-amber-200 font-black">
            ⚡ Recommended: {alternative.bookmaker} ({alternative.promoText})
          </span>
        </div>

        <button
          onClick={handleAlternativeClick}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-gold hover:from-amber-400 hover:to-gold/90 text-black font-black text-xs flex items-center justify-center space-x-2 shadow-lg hover:scale-105 transition-all"
        >
          <span>Open on {alternative.bookmaker}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
