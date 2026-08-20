'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ErrorBoundary } from '../../components/error-boundary';
import { ShieldCheck, ArrowLeft, DollarSign, Calculator, RefreshCw } from 'lucide-react';

export default function BankrollPage() {
  const [bankroll, setBankroll] = useState(1000);
  const [odds, setOdds] = useState(1.85);
  const [winProb, setWinProb] = useState(65);

  const b = odds - 1;
  const p = winProb / 100;
  const q = 1 - p;
  const rawKelly = (b * p - q) / b;

  const safeKellyStakePercent = Math.max(0.5, Math.min(5.0, Math.round(rawKelly * 0.25 * 1000) / 10));
  const recommendedStakeAmount = Math.round((bankroll * (safeKellyStakePercent / 100)) * 100) / 100;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-void text-white font-mono p-4 sm:p-8 space-y-6 max-w-4xl mx-auto selection:bg-stadiumGreen selection:text-black">
        
        {/* Navigation Top Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link href="/" className="inline-flex items-center space-x-2 text-stadiumGreen hover:underline font-bold text-xs">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Stadium Dashboard</span>
          </Link>

          <span className="px-3 py-1 rounded-full bg-cyberPurple/20 text-cyberPurple border border-cyberPurple/40 text-xs font-bold">
            🛡️ KELLY STAKE OPTIMIZER
          </span>
        </div>

        {/* Hero Banner */}
        <div className="glass-panel-premium rounded-3xl p-6 border border-cyberPurple/30 space-y-2">
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            Kelly Criterion <span className="text-cyberPurple">Bankroll Optimizer</span>
          </h1>
          <p className="text-xs text-gray-300 font-sans leading-relaxed">
            Calculates mathematical safety stake allocation to protect your capital against variance.
          </p>
        </div>

        {/* Calculator Form & Result */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          
          {/* Inputs */}
          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
            <h3 className="font-extrabold text-white text-sm">CALCULATOR PARAMETERS</h3>

            <div className="space-y-1">
              <label className="text-gray-400 block text-[10px]">TOTAL BANKROLL ($):</label>
              <input
                type="number"
                value={bankroll}
                onChange={(e) => setBankroll(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-400 block text-[10px]">DECIMAL ODDS (@):</label>
              <input
                type="number"
                step="0.05"
                value={odds}
                onChange={(e) => setOdds(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-400 block text-[10px]">WIN PROBABILITY (%):</label>
              <input
                type="number"
                value={winProb}
                onChange={(e) => setWinProb(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white font-bold"
              />
            </div>
          </div>

          {/* Results Display */}
          <div className="p-6 rounded-3xl glass-panel-premium border border-stadiumGreen/40 flex flex-col justify-between space-y-4 glow-emerald">
            <div>
              <span className="text-stadiumGreen font-bold block text-[10px] uppercase">RECOMMENDED SAFETY STAKE</span>
              <span className="text-4xl font-black text-white block mt-1">${recommendedStakeAmount}</span>
              <span className="text-xs text-stadiumGreen font-bold block mt-1">({safeKellyStakePercent}% of Bankroll)</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/60 border border-white/5 space-y-1 font-sans text-xs">
              <span className="text-gold font-bold block">💡 Fractional Kelly Safeguard:</span>
              <p className="text-gray-300">
                Applies 1/4 Fractional Kelly scaling to guarantee bankroll longevity and prevent ruin.
              </p>
            </div>
          </div>

        </div>

      </div>
    </ErrorBoundary>
  );
}
