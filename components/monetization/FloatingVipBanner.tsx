'use client';

import React, { useState } from 'react';
import { Flame, Sparkles, Lock, ArrowRight, X, ShieldCheck } from 'lucide-react';
import { VipContentLockerModal } from './VipContentLockerModal';
import { phoneHardware } from '../../lib/phone-hardware-engine';

export const FloatingVipBanner: React.FC = () => {
  const [showLocker, setShowLocker] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleOpenLocker = () => {
    phoneHardware.triggerHaptic('SELECTION');
    setShowLocker(true);
  };

  return (
    <>
      {/* Sticky Bottom High-Converting Monetization Banner */}
      <div className="fixed bottom-3 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-slideUp font-mono">
        <div className="p-3.5 rounded-2xl bg-black/95 border-2 border-gold shadow-2xl shadow-gold/20 backdrop-blur-xl flex items-center justify-between gap-3 text-white">
          
          <div className="flex items-center space-x-3 cursor-pointer flex-1 min-w-0" onClick={handleOpenLocker}>
            <div className="w-10 h-10 rounded-xl bg-gold/20 border border-gold/40 flex items-center justify-center flex-shrink-0 text-xl">
              🔥
            </div>
            <div className="space-y-0.5 min-w-0 flex-1">
              <div className="flex items-center space-x-1.5">
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-crimson text-white font-black animate-pulse">
                  HOT 98%
                </span>
                <span className="text-[10px] font-black text-gold truncate">
                  58.40 ACCA BANKER
                </span>
              </div>
              <p className="text-[10px] text-gray-300 truncate">
                Locked Referee-Audited Slip • Stake &amp; 22Bet
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={handleOpenLocker}
              className="px-3 py-2 rounded-xl bg-gold hover:bg-amber-400 text-black font-black text-[11px] flex items-center space-x-1 shadow-md active:scale-95 transition-all"
            >
              <Lock className="w-3 h-3 fill-black" />
              <span>Unlock</span>
            </button>

            <button
              onClick={() => setDismissed(true)}
              className="p-1.5 rounded-lg bg-white/10 text-gray-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* VIP Content Locker Modal */}
      {showLocker && (
        <VipContentLockerModal
          onClose={() => setShowLocker(false)}
        />
      )}
    </>
  );
};
