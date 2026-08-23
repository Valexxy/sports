'use client';
import React from 'react';
import Link from 'next/link';
import { ErrorBoundary } from '../../components/error-boundary';
import { Crown, ArrowLeft, Trophy, Flame, CheckCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LeaderboardPage() {
  const tipsters = [
    { rank: 1, name: '@OracleMaster', winStreak: 12, winRate: '96.2%', roi: '+42.5%', badge: 'WEEKLY CROWN 👑', xp: '18.4k XP' },
    { rank: 2, name: '@LaLigaSniper', winStreak: 9, winRate: '92.4%', roi: '+31.8%', badge: 'PRO TIPSTER ⚡', xp: '14.2k XP' },
    { rank: 3, name: '@NPFLFanatic', winStreak: 8, winRate: '89.0%', roi: '+26.4%', badge: 'ANALYST ⚡', xp: '11.8k XP' },
  ];

  const triggerCelebration = () => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 },
    });
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-void text-white font-mono p-4 sm:p-8 space-y-6 max-w-7xl mx-auto selection:bg-stadiumGreen selection:text-black">
        
        {/* Navigation Top Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link href="/" className="inline-flex items-center space-x-2 text-stadiumGreen hover:underline font-bold text-xs">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Stadium Dashboard</span>
          </Link>

          <span className="px-3 py-1 rounded-full bg-gold/20 text-gold border border-gold/40 text-xs font-bold glow-gold">
            👑 PRO TIPSTER LEADERBOARD
          </span>
        </div>

        {/* Hero Banner */}
        <div className="glass-panel-premium rounded-3xl p-6 border border-gold/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black text-white">
              Global Tipster <span className="text-gold">Hall of Fame</span>
            </h1>
            <p className="text-xs text-gray-300 font-sans max-w-xl">
              Audited 100% verified prediction records. Clone tickets from top tipsters with proven winning ROI.
            </p>
          </div>

          <button
            onClick={triggerCelebration}
            className="px-5 py-3 rounded-2xl bg-gold text-black font-black text-xs shadow-lg hover:scale-105 transition-all flex items-center space-x-1.5 flex-shrink-0"
          >
            <Crown className="w-4 h-4" />
            <span>Crown Winners 🎉</span>
          </button>
        </div>

        {/* Leaderboard Table */}
        <div className="space-y-3">
          {tipsters.map((t) => (
            <div key={t.rank} className="p-4 rounded-2xl glass-panel border border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm ${
                  t.rank === 1 ? 'bg-gold text-black' : 'bg-panel text-gray-300 border border-white/10'
                }`}>
                  #{t.rank}
                </span>

                <div>
                  <span className="font-extrabold text-white text-sm block">{t.name}</span>
                  <span className="text-[10px] text-stadiumGreen font-bold">{t.badge} • {t.xp}</span>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-xs">
                <div className="text-center hidden sm:block">
                  <span className="text-gray-400 block text-[10px]">WIN STREAK</span>
                  <span className="font-black text-gold flex items-center justify-center space-x-1">
                    <Flame className="w-3.5 h-3.5 text-crimson fill-current" />
                    <span>{t.winStreak} WINS</span>
                  </span>
                </div>

                <div className="text-center">
                  <span className="text-gray-400 block text-[10px]">WIN RATE</span>
                  <span className="font-black text-stadiumGreen">{t.winRate}</span>
                </div>

                <div className="text-center">
                  <span className="text-gray-400 block text-[10px]">UNIT ROI</span>
                  <span className="font-black text-gold">{t.roi}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </ErrorBoundary>
  );
}
