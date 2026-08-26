'use client';

import React from 'react';
import { Send, ExternalLink } from 'lucide-react';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { stadiumAudio } from '../../lib/sound-synthesizer';

export const PublicSocialLinksCard: React.FC = () => {
  const handleClick = () => {
    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.playBookmarkSound();
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-[#0a0d14] border-2 border-stadiumGreen/40 font-mono text-xs space-y-4 shadow-2xl glow-emerald">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <span className="p-2 rounded-xl bg-stadiumGreen/20 text-stadiumGreen animate-pulse">✨</span>
          <div>
            <h3 className="font-black text-sm text-white tracking-wider uppercase">
              JOIN OUR OFFICIAL TELEGRAM COMMUNITY HUB
            </h3>
            <span className="text-[10px] text-gray-400 font-sans">
              Get instant daily morning banker predictions &amp; breaking live match updates
            </span>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-stadiumGreen/20 text-stadiumGreen font-black text-[10px] border border-stadiumGreen/40 w-fit">
          ● 24/7 FREE ACCESS
        </span>
      </div>

      {/* 100% Native Unblockable HTML <a> Link for Telegram */}
      <a
        href="https://t.me/mivaj_sports"
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0088cc]/20 via-[#0088cc]/30 to-[#0088cc]/20 hover:from-[#0088cc]/40 hover:to-[#0088cc]/40 border-2 border-[#0088cc]/60 flex items-center justify-between transition-all group hover:scale-[1.01] active:scale-95 shadow-xl text-left no-underline block"
      >
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-[#0088cc] text-white shadow-lg shadow-[#0088cc]/50 group-hover:rotate-12 transition-transform flex-shrink-0">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <span className="font-black text-white text-sm sm:text-base block flex items-center gap-1.5">
              <span>Official Telegram Channel</span>
              <span className="text-xs">✈️</span>
            </span>
            <span className="text-[11px] text-gray-300 font-sans block">
              @mivaj_sports &bull; Daily Bankers, Value Bets &amp; Live Recaps
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-[#0088cc] text-white px-4 py-2.5 rounded-xl font-black text-xs shadow-md">
          <span>Open Telegram</span>
          <ExternalLink className="w-4 h-4" />
        </div>
      </a>
    </div>
  );
};
