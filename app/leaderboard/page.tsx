'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ErrorBoundary } from '../../components/error-boundary';
import { GlobalCityCloutLeaderboard } from '../../components/leaderboard/GlobalCityCloutLeaderboard';
import { ArrowLeft, Globe, Flame, Trophy, Sparkles, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LeaderboardPage() {
  const triggerCelebration = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.4 },
      colors: ['#00e676', '#ffd700', '#00f0ff'],
    });
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-void text-white font-mono p-3 sm:p-6 space-y-5 max-w-5xl mx-auto selection:bg-stadiumGreen selection:text-black">
        
        {/* Navigation Top Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <Link href="/" className="inline-flex items-center space-x-2 text-stadiumGreen hover:underline font-bold text-xs">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Stadium Console</span>
          </Link>

          <span className="px-3 py-1 rounded-full bg-stadiumGreen/15 text-stadiumGreen border border-stadiumGreen/30 text-[11px] font-black glow-emerald">
            🌍 GLOBAL CITY FAN CLOUT
          </span>
        </div>

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-stadiumGreen/20 via-black/80 to-gold/15 rounded-3xl p-5 sm:p-7 border border-stadiumGreen/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-black/60 border border-white/10 text-[10px] text-gold font-bold">
              <Sparkles className="w-3 h-3 text-gold" />
              <span>Worldwide Territory Fan Energy</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-white">
              Global Street &amp; City <span className="text-stadiumGreen">Clout Arena</span>
            </h1>
            <p className="text-xs text-gray-300 font-sans max-w-xl leading-relaxed">
              Real-time matchday fan energy from Anambra (Awka, Onitsha, Nnewi) to London, Nairobi, São Paulo &amp; Madrid. Send 1-tap cheers and defend your territory!
            </p>
          </div>

          <button
            onClick={triggerCelebration}
            className="px-4 py-2.5 rounded-2xl bg-stadiumGreen hover:bg-emerald-400 text-black font-black text-xs shadow-lg transition-all flex items-center space-x-1.5 flex-shrink-0 active:scale-95"
          >
            <Flame className="w-4 h-4" />
            <span>Cheer The World 🎉</span>
          </button>
        </div>

        {/* Global City Clout Leaderboard Component */}
        <GlobalCityCloutLeaderboard />

      </div>
    </ErrorBoundary>
  );
}
