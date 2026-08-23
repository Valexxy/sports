'use client';
import React, { useState } from 'react';
import { X, ShieldCheck, DollarSign, Calculator, AlertTriangle } from 'lucide-react';

interface BankrollModalProps {
  onClose: () => void;
}

export const BankrollCalculatorModal: React.FC<BankrollModalProps> = ({ onClose }) => {
  const [bankroll, setBankroll] = useState<number>(1000);
  const [odds, setOdds] = useState<number>(1.85);
  const [estimatedWinProb, setEstimatedWinProb] = useState<number>(65);

  const b = odds - 1;
  const p = estimatedWinProb / 100;
  const q = 1 - p;
  
  const rawKelly = b > 0 ? (b * p - q) / b : 0;
  const fullKellyPercent = Math.max(0, Math.round(rawKelly * 100 * 10) / 10);
  const quarterKellyPercent = Math.max(0, Math.round(rawKelly * 0.25 * 100 * 10) / 10);
  
  const RecommendedStakeAmount = Math.round((bankroll * (quarterKellyPercent / 100)));

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-stadiumGreen/50 p-6 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-panel text-gray-400 hover:text-white border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-2.5 mb-5 border-b border-white/10 pb-3">
          <div className="p-2.5 rounded-xl bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg text-white">SMART STAKE SAFETY OPTIMIZER</h2>
            <p className="text-xs text-gray-400 font-mono">Smart Money Management for Football Fans</p>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4">
          
          <div>
            <label className="text-xs font-mono text-gray-300 block mb-1 font-semibold">Total Capital / Bankroll ($ or ₦)</label>
            <input
              type="number"
              value={bankroll}
              onChange={(e) => setBankroll(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white font-mono text-sm focus:border-stadiumGreen focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono text-gray-300 block mb-1 font-semibold">Bookmaker Odds</label>
              <input
                type="number"
                step="0.01"
                value={odds}
                onChange={(e) => setOdds(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white font-mono text-sm focus:border-stadiumGreen focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-gray-300 block mb-1 font-semibold">Calculated Win Prob (%)</label>
              <input
                type="number"
                value={estimatedWinProb}
                onChange={(e) => setEstimatedWinProb(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white font-mono text-sm focus:border-stadiumGreen focus:outline-none"
              />
            </div>
          </div>

        </div>

        {/* Calculation Result Panel */}
        <div className="mt-6 p-4 rounded-2xl bg-stadiumGreen/10 border border-stadiumGreen/40 text-center">
          <span className="text-xs font-mono text-stadiumGreen font-bold uppercase tracking-wider block">RECOMMENDED SAFE STAKE</span>
          <div className="text-3xl font-black text-white font-mono my-1">${RecommendedStakeAmount} <span className="text-sm font-normal text-stadiumGreen">({quarterKellyPercent}% of Bankroll)</span></div>
          <p className="text-[11px] text-gray-300 font-sans mt-1">
            Calculated edge: <strong className="text-stadiumGreen">{((p * odds - 1) * 100).toFixed(1)}% Best Edge</strong>. Protects capital against unexpected surprises.
          </p>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-panel border border-white/5 flex items-center space-x-2 text-xs text-gray-400">
          <AlertTriangle className="w-4 h-4 text-gold flex-shrink-0" />
          <span>Smart risk rule: Never risk &gt;5% of total bankroll on any single match.</span>
        </div>

      </div>
    </div>
  );
};
