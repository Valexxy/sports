'use client';

import React, { useState } from 'react';
import { X, Crown, Trophy, Flame, UserCheck, ShieldCheck, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LeaderboardModalProps {
  onClose: () => void;
}

export const TipsterLeaderboardModal: React.FC<LeaderboardModalProps> = ({ onClose }) => {
  const [followedTipsters, setFollowedTipsters] = useState<string[]>(['t1']);

  const tipsters = [
    { id: 't1', rank: 1, handle: '@OracleMaster', winRate: '96.5%', winStreak: '14 Wins 🔥', points: 4850, badge: 'WEEKLY CHAMPION 👑', isCrown: true },
    { id: 't2', rank: 2, handle: '@FootballProphet', winRate: '94.2%', winStreak: '9 Wins 🔥', points: 4120, badge: 'MASTER ORACLE 🌟', isCrown: false },
    { id: 't3', rank: 3, handle: '@NBATactician', winRate: '92.0%', winStreak: '7 Wins 🔥', points: 3890, badge: 'BASKETBALL KING 🏀', isCrown: false },
    { id: 't4', rank: 4, handle: '@TennisSniper', winRate: '90.5%', winStreak: '5 Wins', points: 3450, badge: 'GRAND SLAM PRO 🎾', isCrown: false },
  ];

  const handleFollowToggle = (id: string, handle: string) => {
    if (followedTipsters.includes(id)) {
      setFollowedTipsters((prev) => prev.filter((i) => i !== id));
    } else {
      setFollowedTipsters((prev) => [...prev, id]);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([60]);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl border border-stadiumGreen/50 p-6 shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-panel text-gray-400 hover:text-white border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-4 border-b border-white/10 pb-3">
          <div className="p-2.5 rounded-xl bg-gold/20 text-gold border border-gold/40">
            <Crown className="w-6 h-6 animate-bounce text-gold" />
          </div>
          <div>
            <h2 className="font-extrabold text-xl text-white">TOP TIPSTERS & WEEKLY CHAMPIONS 👑</h2>
            <p className="text-xs text-gray-400 font-mono">Public Leaderboards & Verified Prediction Streaks (No Private DMs)</p>
          </div>
        </div>

        {/* Weekly Champion Spotlight Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-gold/25 via-panel to-stadiumGreen/20 border border-gold/50 mb-5 flex justify-between items-center shadow-xl">
          <div>
            <span className="text-[10px] font-mono text-gold font-bold uppercase tracking-wider block">👑 CROWNED WEEKLY CHAMPION</span>
            <h3 className="text-lg font-black text-white mt-0.5">@OracleMaster (96.5% Win Rate)</h3>
            <p className="text-xs text-stadiumGreen font-mono font-bold mt-0.5">14 Match Winning Streak 🔥 | 4,850 XP Points</p>
          </div>

          <button
            onClick={() => handleFollowToggle('t1', '@OracleMaster')}
            className={`px-3.5 py-2 rounded-xl font-extrabold text-xs shadow-md transition-all ${
              followedTipsters.includes('t1') ? 'bg-stadiumGreen text-black' : 'bg-gold text-black'
            }`}
          >
            {followedTipsters.includes('t1') ? 'Following ✓' : 'Follow Picks +'}
          </button>
        </div>

        {/* Tipster Leaderboard Table */}
        <h3 className="text-xs font-mono text-gray-300 font-bold uppercase mb-3">WEEKLY LEADERBOARD STANDINGS</h3>

        <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
          {tipsters.map((t) => (
            <div key={t.id} className="p-3.5 rounded-2xl bg-panel border border-white/10 flex justify-between items-center font-mono text-xs">
              <div className="flex items-center space-x-3">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-black ${
                  t.rank === 1 ? 'bg-gold text-black' : t.rank === 2 ? 'bg-gray-300 text-black' : 'bg-amber-700 text-white'
                }`}>
                  #{t.rank}
                </span>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-white">{t.handle}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-stadiumGreen/20 text-stadiumGreen font-bold border border-stadiumGreen/30">
                      {t.badge}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Win Rate: <strong className="text-stadiumGreen">{t.winRate}</strong> | Streak: <strong className="text-gold">{t.winStreak}</strong></span>
                </div>
              </div>

              <button
                onClick={() => handleFollowToggle(t.id, t.handle)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                  followedTipsters.includes(t.id) ? 'bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40' : 'bg-panel hover:bg-white/10 text-gray-300 border border-white/10'
                }`}
              >
                {followedTipsters.includes(t.id) ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
