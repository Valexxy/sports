'use client';

import React from 'react';
import { 
  X, 
  Sparkles, 
  Trophy, 
  ShieldCheck, 
  Cake, 
  Zap, 
  Activity, 
  Smartphone, 
  Globe, 
  Newspaper, 
  TrendingUp, 
  Share2, 
  ShieldAlert, 
  Radio, 
  MapPin, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

interface StadiumSuitesMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBirthdays: () => void;
  onOpenLeaderboard: () => void;
  onOpenLedger: () => void;
  onOpenBankroll: () => void;
  onOpenReverseJinx: () => void;
  onOpenFlexSlip: () => void;
  onOpenTelemetry: () => void;
  onOpenHardware: () => void;
  onOpenStandings: () => void;
  onOpenClubs: () => void;
  onOpenNews: () => void;
  onOpenRotatingPool: () => void;
  onOpenVisitor: () => void;
}

export const StadiumSuitesMenu: React.FC<StadiumSuitesMenuProps> = ({
  isOpen,
  onClose,
  onOpenBirthdays,
  onOpenLeaderboard,
  onOpenLedger,
  onOpenBankroll,
  onOpenReverseJinx,
  onOpenFlexSlip,
  onOpenTelemetry,
  onOpenHardware,
  onOpenStandings,
  onOpenClubs,
  onOpenNews,
  onOpenRotatingPool,
  onOpenVisitor,
}) => {
  if (!isOpen) return null;

  const handleAction = (action: () => void) => {
    action();
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
                STADIUM SUITES & TOOLS MENU
              </h2>
              <span className="text-[10px] text-gray-400 font-sans">
                Organized hubs & auxiliary features (Zero prediction clutter)
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
            1. MATCH INTELLIGENCE & AUDITS 🏟️
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
                  <span className="text-[9px] text-gray-400 font-sans">PL, La Liga, Serie A, Bund.</span>
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
                  <span className="text-[9px] text-gray-400 font-sans">12+ Leagues, stadium capacities</span>
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

        {/* CATEGORY 2: VIRAL SOCIAL & FAN SUITES */}
        <div className="space-y-2.5">
          <span className="text-[10px] font-black text-gold uppercase tracking-wider block">
            2. VIRAL SOCIAL & FAN SUITES ⚡
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            
            <button
              onClick={() => handleAction(onOpenBirthdays)}
              className="p-3 rounded-2xl bg-panel hover:bg-white/5 border border-white/10 hover:border-pink-400/50 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">🎂</span>
                <div>
                  <span className="font-black text-white text-xs block group-hover:text-pink-400">
                    Star Birthdays & Records
                  </span>
                  <span className="text-[9px] text-gray-400 font-sans">Player photos & voting XP</span>
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

            <button
              onClick={() => handleAction(onOpenReverseJinx)}
              className="p-3 rounded-2xl bg-panel hover:bg-white/5 border border-white/10 hover:border-purple-400/50 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">🔮</span>
                <div>
                  <span className="font-black text-white text-xs block group-hover:text-purple-400">
                    Reverse Jinx (Emotional Hedge)
                  </span>
                  <span className="text-[9px] text-gray-400 font-sans">Win-win hedged bet generator</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => handleAction(onOpenFlexSlip)}
              className="p-3 rounded-2xl bg-panel hover:bg-white/5 border border-white/10 hover:border-stadiumGreen/50 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">📲</span>
                <div>
                  <span className="font-black text-white text-xs block group-hover:text-stadiumGreen">
                    Social Clout Flex Slip
                  </span>
                  <span className="text-[9px] text-gray-400 font-sans">Share slips on WhatsApp & TikTok</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-stadiumGreen group-hover:translate-x-1 transition-all" />
            </button>

          </div>
        </div>

        {/* CATEGORY 3: ADVANCED HARDWARE & OPTIMIZATION ENGINES */}
        <div className="space-y-2.5">
          <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider block">
            3. HARDWARE & ADVANCED ENGINES 📱
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            
            <button
              onClick={() => handleAction(onOpenBankroll)}
              className="p-3 rounded-2xl bg-panel hover:bg-white/5 border border-white/10 hover:border-stadiumGreen/50 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">💰</span>
                <div>
                  <span className="font-black text-white text-xs block group-hover:text-stadiumGreen">
                    Kelly Bankroll Optimizer
                  </span>
                  <span className="text-[9px] text-gray-400 font-sans">Smart staking math</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-stadiumGreen group-hover:translate-x-1 transition-all" />
            </button>

            <Link
              href="/arbitrage"
              onClick={onClose}
              className="p-3 rounded-2xl bg-panel hover:bg-white/5 border border-white/10 hover:border-gold/50 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">📈</span>
                <div>
                  <span className="font-black text-white text-xs block group-hover:text-gold">
                    Arbitrage Price Disparity
                  </span>
                  <span className="text-[9px] text-gray-400 font-sans">Multi-bookmaker radar</span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-gold group-hover:translate-x-1 transition-all" />
            </Link>

            <button
              onClick={() => handleAction(onOpenTelemetry)}
              className="p-3 rounded-2xl bg-panel hover:bg-white/5 border border-white/10 hover:border-cyan-400/50 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">📶</span>
                <div>
                  <span className="font-black text-white text-xs block group-hover:text-cyan-400">
                    Live Telemetry & Sensors
                  </span>
                  <span className="text-[9px] text-gray-400 font-sans">FPS, 4G/5G, Latency</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => handleAction(onOpenHardware)}
              className="p-3 rounded-2xl bg-panel hover:bg-white/5 border border-white/10 hover:border-stadiumGreen/50 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">📳</span>
                <div>
                  <span className="font-black text-white text-xs block group-hover:text-stadiumGreen">
                    Phone Hardware & Push
                  </span>
                  <span className="text-[9px] text-gray-400 font-sans">Lock-screen alerts, PWA</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-stadiumGreen group-hover:translate-x-1 transition-all" />
            </button>

          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 text-center">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-stadiumGreen text-black font-black text-xs hover:bg-emerald-400 transition-all shadow-lg glow-emerald"
          >
            Return to Live Match Predictions ⚽
          </button>
        </div>

      </div>
    </div>
  );
};
