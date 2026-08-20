'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { stadiumAudio } from '../lib/sound-synthesizer';
import { 
  Zap, 
  Trophy, 
  ShieldCheck, 
  Cake, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  User, 
  Flame,
  Share2
} from 'lucide-react';

interface StadiumHeaderProps {
  onOpenReceipt: () => void;
  onOpenLedger: () => void;
  onOpenBankroll: () => void;
  onOpenProfile: () => void;
  onOpenTeams?: () => void;
  onOpenBirthdays: () => void;
  onOpenLeaderboard: () => void;
  onOpenSuitesMenu?: () => void;
}

export const StadiumHeader: React.FC<StadiumHeaderProps> = ({
  onOpenReceipt,
  onOpenLedger,
  onOpenBankroll,
  onOpenProfile,
  onOpenBirthdays,
  onOpenLeaderboard,
  onOpenSuitesMenu,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [soundPlaying, setSoundPlaying] = useState(false);

  const toggleSound = () => {
    if (isMuted) {
      setIsMuted(false);
      stadiumAudio.isMuted = false;
      stadiumAudio.playCrowdRoar();
      setSoundPlaying(true);
      setTimeout(() => setSoundPlaying(false), 800);
    } else {
      setIsMuted(true);
      stadiumAudio.isMuted = true;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-void/90 backdrop-blur-xl border-b border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-3 font-mono text-xs">
        
        {/* Brand Logo & Tagline */}
        <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-stadiumGreen via-cyberPurple to-gold p-0.5 shadow-lg group-hover:scale-105 transition-all glow-emerald flex items-center justify-center">
            <div className="w-full h-full bg-void rounded-[14px] flex items-center justify-center">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-stadiumGreen animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-xs sm:text-sm text-white tracking-wider">AURASCORE</span>
              <span className="px-1.5 py-0.2 rounded bg-stadiumGreen text-black font-black text-[9px]">2.0</span>
            </div>
            <span className="text-[10px] text-gray-400 font-sans hidden sm:block">World-First Live Prediction & Stadium Atmosphere</span>
          </div>
        </Link>

        {/* Clean, Organized Navigation Menu Bar */}
        <nav className="hidden lg:flex items-center space-x-1 bg-black/60 p-1.5 rounded-2xl border border-white/10">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-xl bg-stadiumGreen text-black font-black text-xs transition-all shadow-md"
          >
            Live Matches ⚡
          </Link>

          <button
            onClick={onOpenSuitesMenu}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-stadiumGreen/20 to-gold/20 hover:from-stadiumGreen/30 hover:to-gold/30 text-white font-bold transition-all flex items-center space-x-1.5 border border-stadiumGreen/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
            <span>Suites & Tools ▾</span>
          </button>

          <Link
            href="/arbitrage"
            className="px-3 py-1.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 font-bold transition-all flex items-center space-x-1"
          >
            <span>Arbitrage</span>
            <Zap className="w-3 h-3 text-gold" />
          </Link>

          <button
            onClick={onOpenLeaderboard}
            className="px-3 py-1.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 font-bold transition-all flex items-center space-x-1"
          >
            <Trophy className="w-3 h-3 text-gold" />
            <span>Leaderboard</span>
          </button>

          <button
            onClick={onOpenBankroll}
            className="px-3 py-1.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 font-bold transition-all flex items-center space-x-1"
          >
            <ShieldCheck className="w-3 h-3 text-stadiumGreen" />
            <span>Bankroll</span>
          </button>

          <button
            onClick={onOpenBirthdays}
            className="px-3 py-1.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 font-bold transition-all flex items-center space-x-1"
          >
            <Cake className="w-3 h-3 text-pink-400" />
            <span>Birthdays</span>
          </button>
        </nav>

        {/* Right Action Icons: Suites Menu, Avatar, Viral Flex, Sound Button */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          
          {/* Mobile Suites Menu Button */}
          {onOpenSuitesMenu && (
            <button
              onClick={onOpenSuitesMenu}
              className="lg:hidden px-2.5 py-1.5 rounded-2xl bg-gradient-to-r from-stadiumGreen/30 to-gold/20 border border-stadiumGreen/40 text-stadiumGreen font-black text-xs flex items-center space-x-1 shadow-md active:scale-95"
              title="Open Stadium Suites Menu"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>Menu</span>
            </button>
          )}

          {/* Digital Avatar & Handle */}
          <button
            onClick={onOpenProfile}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-panel border border-white/10 hover:border-gold/40 text-gold flex items-center space-x-1.5 sm:space-x-2 transition-all hover:scale-105 active:scale-95"
            title="Digital Member Avatar & XP"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-gold to-stadiumGreen flex items-center justify-center text-black font-black text-xs">
              ⚡
            </div>
            <span className="hidden md:inline font-bold text-xs text-white">CyberStriker_99</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-gold/20 text-gold font-bold">3.8k</span>
          </button>

          {/* Viral Flex Card Generator Button */}
          <button
            onClick={onOpenReceipt}
            className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl bg-stadiumGreen hover:bg-emerald-400 text-black font-black text-xs flex items-center space-x-1.5 shadow-lg glow-emerald transition-all hover:scale-105 active:scale-95"
            title="Generate Social Flex Slip"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Flex Slip</span>
          </button>

          {/* Interactive Stadium Crowd Audio Synthesizer */}
          <button
            onClick={toggleSound}
            className={`p-2 sm:p-2.5 rounded-2xl border transition-all hover:scale-110 active:scale-95 ${
              isMuted
                ? 'bg-panel border-white/10 text-gray-500 hover:text-white'
                : soundPlaying
                ? 'bg-stadiumGreen text-black border-stadiumGreen scale-110'
                : 'bg-stadiumGreen/20 text-stadiumGreen border-stadiumGreen/40 glow-emerald'
            }`}
            title={isMuted ? 'Turn Stadium Crowd Sound ON 🔊' : 'Playing Live Crowd Audio (Click to Mute)'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Volume2 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${soundPlaying ? 'animate-bounce' : ''}`} />}
          </button>

        </div>

      </div>
    </header>
  );
};
