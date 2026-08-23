'use client';
import React, { useState } from 'react';
import { X, Activity, Check, ArrowRight } from 'lucide-react';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import confetti from 'canvas-confetti';

export const BetSlipSurgeryModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [fixed, setFixed] = useState(false);

  return (
    <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn font-mono text-xs text-white">
      <div className="relative w-full max-w-md glass-panel-premium rounded-3xl border-2 border-stadiumGreen/70 p-6 space-y-4 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20"><X className="w-4 h-4" /></button>
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-stadiumGreen animate-pulse" />
          <h3 className="font-black text-sm text-stadiumGreen uppercase">Bet-Slip Surgery & Odds Lab</h3>
        </div>
        <div className="space-y-2">
          <div className="p-3 rounded-xl bg-crimson/20 border border-crimson/40">
            <span className="text-[10px] text-crimson font-black block">❌ REMOVED TOXIC TRAP LEG:</span>
            <div className="text-xs font-bold text-white">Man City vs Everton &bull; Odds: @1.12 (Risk: 42%)</div>
          </div>
          <div className="p-3 rounded-xl bg-stadiumGreen/20 border border-stadiumGreen/40">
            <span className="text-[10px] text-stadiumGreen font-black block">✅ REPLACED WITH HIGH-VALUE BANKER:</span>
            <div className="text-xs font-bold text-white">Bayern vs Leipzig &bull; Over 1.5 Goals (@1.28)</div>
          </div>
        </div>
        <button onClick={() => { phoneHardware.triggerHaptic('SUCCESS'); setFixed(true); confetti({ particleCount: 25, spread: 50 }); }} className="w-full py-3 rounded-2xl bg-stadiumGreen text-black font-black flex items-center justify-center space-x-2">
          <Check className="w-4 h-4" />
          <span>{fixed ? 'Slip Surgery Complete ✓' : 'Perform 1-Tap Slip Surgery'}</span>
        </button>
      </div>
    </div>
  );
};
