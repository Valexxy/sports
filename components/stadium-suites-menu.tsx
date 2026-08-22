'use client';

import React from 'react';
import { 
  X, 
  Sparkles, 
  Trophy, 
  ShieldCheck, 
  Cake, 
  Zap, 
  Globe, 
  Newspaper, 
  Share2, 
  ChevronRight,
  Flame
} from 'lucide-react';

interface StadiumSuitesMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBirthdays: () => void;
  onOpenLeaderboard: () => void;
  onOpenLedger: () => void;
  onOpenStandings: () => void;
  onOpenClubs: () => void;
  onOpenNews: () => void;
  onOpenBanter?: () => void;
  onOpenGrassroots?: () => void;
}

export const StadiumSuitesMenu: React.FC<StadiumSuitesMenuProps> = ({
  isOpen,
  onClose,
  onOpenBirthdays,
  onOpenLeaderboard,
  onOpenLedger,
  onOpenStandings,
  onOpenClubs,
  onOpenNews,
  onOpenBanter,
  onOpenGrassroots,
}) => {
  if (!isOpen) return null;

  const handleAction = (action?: () => void) => {
    if (action) action();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-5 animate-fadeIn font-mono text-xs">
      <div className="relative w-full max-w-2xl glass-panel-premium rounded-3xl border-2 border-stadiumGreen/40 p-5 sm:p-7 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-2xl bg-stadiumGreen text-black font-black">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-sm sm:text-base text-white tracking-wider">
                STADIUM HUB & NAIJA GEN-Z SUITES ⚡🇳🇬
              </h2>
              <span className="text-[10px] text-gray-400 font-sans">
                Curated Nigerian fan suites, live match audits and banter
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-panel text-gray-400 hover:text-white border border-white/10 hover:border-stadiumGreen transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CATEGORY 1: MATCH INTELLIGENCE & AUDITS */}
        <div className="space-y-2.5">
          <span className="text-[10px] font-black text-stadiumGreen uppercase tracking-wider block">
            1. MATCH INTELLIGENCE & OFFICIAL AUDITS 🏟️
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            
            <button
              onClick={() => handleAction(onOpenLedger)}
              className="p-3 rounded-2xl bg-panel hover:bg-white/5 border border-white/10 hover:border-stadiumGreen/50 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">📜</span>
                <div>
                  <span className="font-black text-white text-xs block group-hover:text-stadiumGreen">
                    Settlement Ledger & Calendar
                  </span>
                  <span className="text-[9px] text-gray-400 font-sans">100% Audited score sheets</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-stadiumGreen group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => handleAction(onOpenStandings)}
              className="p-3 rounded-2xl bg-panel hover:bg-white/5 border border-white/10 hover:border-gold/50 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">📊</span>
                <div>
                  <span className="font-black text-white text-xs block group-hover:text-gold">
                    Official League Standings
                  </span>
                  <span className="text-[9px] text-gray-400 font-sans">PL, La Liga, Serie A, NPFL</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gold group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => handleAction(onOpenClubs)}
              className="p-3 rounded-2xl bg-panel hover:bg-white/5 border border-white/10 hover:border-stadiumGreen/50 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">🌐</span>
                <div>
                  <span className="font-black text-white text-xs block group-hover:text-stadiumGreen">
                    Global Club Explorer
                  </span>
                  <span className="text-[9px] text-gray-400 font-sans">12+ Leagues & venues</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-stadiumGreen group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => handleAction(onOpenNews)}
              className="p-3 rounded-2xl bg-panel hover:bg-white/5 border border-white/10 hover:border-gold/50 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">📰</span>
                <div>
                  <span className="font-black text-white text-xs block group-hover:text-gold">
                    Football News Wire
                  </span>
                  <span className="text-[9px] text-gray-400 font-sans">Sky Sports & BBC live feeds</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gold group-hover:translate-x-1 transition-all" />
            </button>

          </div>
        </div>

        {/* CATEGORY 2: NAIJA VIRAL SOCIAL & FAN SUITES */}
        <div className="space-y-2.5">
          <span className="text-[10px] font-black text-gold uppercase tracking-wider block">
            2. NAIJA VIRAL SOCIAL & FAN SUITES ⚡
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">

            <button
              onClick={() => handleAction(onOpenBanter)}
              className="p-3 rounded-2xl bg-crimson/10 hover:bg-crimson/20 border border-crimson/40 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">🎙️</span>
                <div>
                  <span className="font-black text-white text-xs block group-hover:text-crimson">
                    Naija Roast & Banter Lounge 🔥
                  </span>
                  <span className="text-[9px] text-crimson font-sans font-bold">Hilarious Nigerian club burns</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-crimson group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => handleAction(onOpenGrassroots)}
              className="p-3 rounded-2xl bg-stadiumGreen/10 hover:bg-stadiumGreen/20 border border-stadiumGreen/40 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">🇳🇬</span>
                <div>
                  <span className="font-black text-white text-xs block group-hover:text-stadiumGreen">
                    Grassroots Scouting & NPFL
                  </span>
                  <span className="text-[9px] text-stadiumGreen font-sans font-bold">Discover Nigerian wonderkids</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stadiumGreen group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => handleAction(onOpenBirthdays)}
              className="p-3 rounded-2xl bg-panel hover:bg-white/5 border border-white/10 hover:border-pink-500/50 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">🎂</span>
                <div>
                  <span className="font-black text-white text-xs block group-hover:text-pink-400">
                    Star Birthdays & Viral Cards
                  </span>
                  <span className="text-[9px] text-gray-400 font-sans">Player photos & custom wishes</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-pink-400 group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => handleAction(onOpenLeaderboard)}
              className="p-3 rounded-2xl bg-panel hover:bg-white/5 border border-white/10 hover:border-gold/50 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">👑</span>
                <div>
                  <span className="font-black text-white text-xs block group-hover:text-gold">
                    Tipster Leaderboard
                  </span>
                  <span className="text-[9px] text-gray-400 font-sans">Top ranks & win streaks</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gold group-hover:translate-x-1 transition-all" />
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};
