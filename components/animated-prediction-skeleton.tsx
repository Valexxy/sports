'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Radio, Zap, Shield, TrendingUp } from 'lucide-react';

const LOADING_STATUS_MESSAGES = [
  'Simulating 100,000 Poisson Goal Distribution Curves...',
  'Scanning Sharp Bookmaker Odds & Market Vig...',
  'Analyzing Starting XI Lineups & Tactical Matchups...',
  'Locking Banker Probabilities & Kelly Stake Sizing...',
  'Finalizing High-Yield Master Accumulator...',
];

export const AnimatedPredictionSkeleton: React.FC = () => {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % LOADING_STATUS_MESSAGES.length);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full space-y-4 font-mono text-white animate-fadeIn">
      
      {/* 1. Futuristic Live Intelligence Scanner Bar */}
      <div className="glass-panel-premium rounded-3xl p-5 border border-stadiumGreen/40 space-y-3 relative overflow-hidden shadow-2xl">
        {/* Animated Sweep Beam */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-stadiumGreen/15 to-transparent animate-shimmer" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-2xl bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40 animate-pulse">
              <Radio className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-black text-stadiumGreen uppercase tracking-widest block">
                MIVAJ PREDICTOR ENGINE
              </span>
              <span className="text-xs font-bold text-white flex items-center space-x-1.5 transition-all duration-300">
                <Sparkles className="w-3.5 h-3.5 text-gold inline animate-spin" />
                <span>{LOADING_STATUS_MESSAGES[statusIndex]}</span>
              </span>
            </div>
          </div>

          <div className="px-3 py-1 rounded-xl bg-black/60 border border-white/10 text-[10px] font-black text-gold">
            99.8% READY
          </div>
        </div>

        {/* Progress Bar Pulse */}
        <div className="w-full h-1.5 bg-black/80 rounded-full overflow-hidden relative">
          <div className="h-full bg-gradient-to-r from-stadiumGreen via-gold to-stadiumGreen w-3/4 rounded-full animate-pulse" />
        </div>
      </div>

      {/* 2. Three Beautiful Glass Shimmer Match Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((cardIdx) => (
          <div
            key={cardIdx}
            className="glass-panel-premium rounded-[24px] p-5 space-y-4 border border-white/10 relative overflow-hidden"
          >
            {/* Shimmer Sweep Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent animate-shimmer" />

            {/* Header: League & Status Shimmer */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-white/10 animate-pulse" />
                <div className="w-24 h-3 rounded bg-white/10 animate-pulse" />
              </div>
              <div className="w-16 h-4 rounded-full bg-stadiumGreen/20 animate-pulse" />
            </div>

            {/* Teams Row Shimmer */}
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center space-x-2 flex-1">
                <div className="w-10 h-10 rounded-2xl bg-black/60 border border-white/10 animate-pulse" />
                <div className="space-y-1">
                  <div className="w-20 h-3.5 rounded bg-white/15 animate-pulse" />
                  <div className="w-10 h-2.5 rounded bg-white/5 animate-pulse" />
                </div>
              </div>

              <div className="w-14 h-7 rounded-2xl bg-black/70 border border-white/10 animate-pulse" />

              <div className="flex items-center justify-end space-x-2 flex-1">
                <div className="space-y-1 text-right">
                  <div className="w-20 h-3.5 rounded bg-white/15 animate-pulse ml-auto" />
                  <div className="w-10 h-2.5 rounded bg-white/5 animate-pulse ml-auto" />
                </div>
                <div className="w-10 h-10 rounded-2xl bg-black/60 border border-white/10 animate-pulse" />
              </div>
            </div>

            {/* Probability Gauge Shimmer */}
            <div className="h-1.5 w-full bg-black/80 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-stadiumGreen/40 via-gray-600/40 to-gold/40 w-full animate-pulse" />
            </div>

            {/* Banker Pick Banner Shimmer */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-stadiumGreen/15 via-panel to-gold/10 border border-stadiumGreen/30 flex items-center justify-between">
              <div className="space-y-1">
                <div className="w-28 h-2.5 rounded bg-stadiumGreen/30 animate-pulse" />
                <div className="w-36 h-3.5 rounded bg-white/20 animate-pulse" />
              </div>
              <div className="w-20 h-8 rounded-xl bg-stadiumGreen/30 animate-pulse" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
