'use client';
import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import confetti from 'canvas-confetti';

export const CutOneInsuranceModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = () => {
    phoneHardware.triggerHaptic('SUCCESS');
    setAnalyzed(true);
    confetti({ particleCount: 30, spread: 60 });
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn font-mono text-xs text-white">
      <div className="relative w-full max-w-md glass-panel-premium rounded-3xl border-2 border-crimson/70 p-6 space-y-4 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20"><X className="w-4 h-4" /></button>
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-crimson animate-pulse" />
          <h3 className="font-black text-sm text-crimson uppercase">"Cut-1" Slip Insurance Radar</h3>
        </div>
        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
          <span className="text-[10px] text-gray-400">Pasted 6-Game Ticket Simulation:</span>
          <div className="p-3 rounded-xl bg-crimson/20 border border-crimson/50 space-y-1">
            <span className="text-[10px] text-crimson font-black uppercase">⚠️ High Hazard Danger Leg Detected:</span>
            <div className="text-sm font-black text-white">Lazio vs Roma &bull; Selection: Lazio Win (@2.30)</div>
            <p className="text-[10px] text-gray-300">Derby tension is 92%. Monte Carlo shows 54% draw probability.</p>
          </div>
          <div className="p-3 rounded-xl bg-stadiumGreen/20 border border-stadiumGreen/50 space-y-1">
            <span className="text-[10px] text-stadiumGreen font-black uppercase">🛡️ Recommended Slip Insurance Hedge:</span>
            <div className="text-sm font-black text-white">Change to: Lazio or Draw (1X) (@1.34)</div>
            <p className="text-[10px] text-gray-300">Boosts ticket survival probability from 38% to 89%!</p>
          </div>
        </div>
        <button onClick={handleAnalyze} className="w-full py-3 rounded-2xl bg-stadiumGreen text-black font-black flex items-center justify-center space-x-2 shadow-lg hover:bg-emerald-400">
          <Zap className="w-4 h-4 fill-current" />
          <span>Apply Cut-1 Safety Hedge</span>
        </button>
      </div>
    </div>
  );
};
