'use client';

import React from 'react';
import { X, Trophy, Flame, Crown, Zap, ShieldCheck, Users, ArrowUpRight } from 'lucide-react';

interface WhaleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WhaleUser {
  rank: number;
  handle: string;
  badge: string;
  tag: string;
  auraScore: number;
  winRate: string;
  streak: string;
}

const WHALES_REGISTRY: WhaleUser[] = [
  {
    rank: 1,
    handle: '@Chief_Obi_Lekki',
    badge: '👑 WHALE OF IKEJA',
    tag: 'General Tier',
    auraScore: 148500,
    winRate: '94.2%',
    streak: '18X 🔥',
  },
  {
    rank: 2,
    handle: '@Tunde_Stallion',
    badge: '⚡ LEKKI HIGH-ROLLER',
    tag: 'Aura Lord',
    auraScore: 92400,
    winRate: '89.6%',
    streak: '14X 🔥',
  },
  {
    rank: 3,
    handle: '@Chidi_Prophet_99',
    badge: '🔥 MAINLAND PROPHET',
    tag: 'Aura Lord',
    auraScore: 74200,
    winRate: '87.1%',
    streak: '11X 🔥',
  },
  {
    rank: 4,
    handle: '@Kalu_Godfather',
    badge: '🛡️ ABUJA HIGH-ROLLER',
    tag: 'Ball Knower',
    auraScore: 51800,
    winRate: '84.5%',
    streak: '9X 🔥',
  },
  {
    rank: 5,
    handle: '@Eze_Baller_VIP',
    badge: '🌟 PORT HARCOURT DON',
    tag: 'Ball Knower',
    auraScore: 38600,
    winRate: '82.0%',
    streak: '8X 🔥',
  },
];

export const WhaleLeaderboardModal: React.FC<WhaleModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn font-mono text-white">
      <div className="glass-panel-premium max-w-2xl w-full p-5 sm:p-6 rounded-3xl border-2 border-gold/60 space-y-4 shadow-2xl relative max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 border-b border-white/10 pb-3 flex-shrink-0">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-gold to-amber-500 text-black font-black text-xl shadow-lg">
            👑
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-black text-sm sm:text-base text-white">THE AURA WHALE LEADERBOARD</h3>
              <span className="px-2 py-0.5 rounded-full bg-gold text-black font-black text-[9px]">
                TOP BALLERS
              </span>
            </div>
            <p className="text-[10px] text-gray-300 font-sans mt-0.5">
              Real-time high-density status ranking of top prediction earners across Nigeria & global leagues.
            </p>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[50vh]">
          {WHALES_REGISTRY.map((w) => (
            <div
              key={w.rank}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                w.rank === 1
                  ? 'bg-gradient-to-r from-gold/25 via-black to-amber-950/40 border-gold shadow-lg glow-emerald'
                  : w.rank === 2
                  ? 'bg-slate-900/60 border-slate-300/40'
                  : w.rank === 3
                  ? 'bg-amber-950/30 border-amber-600/40'
                  : 'bg-black/60 border-white/10'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={`w-6 h-6 rounded-full font-black text-xs flex items-center justify-center ${
                  w.rank === 1 ? 'bg-gold text-black' : w.rank === 2 ? 'bg-slate-300 text-black' : w.rank === 3 ? 'bg-amber-600 text-white' : 'bg-white/10 text-gray-400'
                }`}>
                  {w.rank}
                </span>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-xs text-white">{w.handle}</span>
                    <span className="px-2 py-0.2 rounded bg-gold/20 text-gold text-[8px] font-black">{w.badge}</span>
                  </div>
                  <span className="text-[9px] text-gray-400 font-sans block mt-0.5">
                    {w.tag} &bull; {w.winRate} Win Rate &bull; {w.streak} Streak
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-black text-sm text-gold font-mono">{w.auraScore.toLocaleString()}</span>
                <span className="text-[8px] text-gray-400 block font-bold">AURA SCORE</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Call to Action */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-300 flex-shrink-0">
          <span>Predict matches in swipe deck & duels to climb the Whale rankings.</span>
          <span className="text-gold font-bold">Updated Live ⚡</span>
        </div>

      </div>
    </div>
  );
};
