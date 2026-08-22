'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Trophy, 
  Cake, 
  Sparkles, 
  Share2,
  Download,
  Check
} from 'lucide-react';
import { useTranslation } from '../lib/translation-engine';
import { GlobalLanguageSwitcher } from './global-language-switcher';
import confetti from 'canvas-confetti';

interface StadiumHeaderProps {
  onOpenReceipt: () => void;
  onOpenLedger: () => void;
  onOpenBankroll?: () => void;
  onOpenProfile: () => void;
  onOpenTeams?: () => void;
  onOpenBirthdays: () => void;
  onOpenLeaderboard: () => void;
  onOpenSuitesMenu?: () => void;
}

export const StadiumHeader: React.FC<StadiumHeaderProps> = ({
  onOpenReceipt,
  onOpenProfile,
  onOpenBirthdays,
  onOpenLeaderboard,
  onOpenSuitesMenu,
}) => {
  const { t } = useTranslation();
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('aurascore_installed');
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
      if (stored === 'true' || isStandalone) {
        setIsInstalled(true);
      }
    }
  }, []);

  const handleInstallClick = () => {
    const promptEvent = (window as any).__pwaInstallPrompt;
    if (promptEvent) {
      promptEvent.prompt();
      promptEvent.userChoice.then((choice: any) => {
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
          localStorage.setItem('aurascore_installed', 'true');
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.3 } });
        }
      });
    } else {
      alert('📲 Tap your browser menu (⋮ or Share icon ⬆️) and select "Add to Home Screen" to install!');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-void/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-3 font-mono text-xs">
        
        {/* Brand Logo & Tagline */}
        <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group flex-shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-stadiumGreen via-cyberPurple to-gold p-0.5 shadow-lg group-hover:scale-105 transition-all glow-emerald flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-void rounded-[14px] flex items-center justify-center p-1">
              <img src="/logo.svg" alt="AuraScore Cyber Football Logo" className="w-full h-full object-contain group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-xs sm:text-sm text-white tracking-wider">AURASCORE</span>
              <span className="px-1.5 py-0.2 rounded bg-stadiumGreen text-black font-black text-[9px]">2.0</span>
            </div>
            <span className="text-[10px] text-gray-400 font-sans hidden md:block">World-First Live Prediction & Stadium Atmosphere</span>
          </div>
        </Link>

        {/* Desktop Navigation Menu */}
        <nav className="hidden lg:flex items-center space-x-1 bg-black/60 p-1.5 rounded-2xl border border-white/10">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-xl bg-stadiumGreen text-black font-black text-xs transition-all shadow-md"
          >
            {t('Live Matches ⚡')}
          </Link>

          <button
            onClick={onOpenSuitesMenu}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-stadiumGreen/20 to-gold/20 hover:from-stadiumGreen/30 hover:to-gold/30 text-white font-bold transition-all flex items-center space-x-1.5 border border-stadiumGreen/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
            <span>{t('Stadium Hub ⚡')}</span>
          </button>

          <button
            onClick={onOpenLeaderboard}
            className="px-3 py-1.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 font-bold transition-all flex items-center space-x-1"
          >
            <Trophy className="w-3 h-3 text-gold" />
            <span>{t('Leaderboard')}</span>
          </button>

          <button
            onClick={onOpenBirthdays}
            className="px-3 py-1.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 font-bold transition-all flex items-center space-x-1"
          >
            <Cake className="w-3 h-3 text-pink-400" />
            <span>{t('Birthdays')}</span>
          </button>
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
          
          {/* Mobile Stadium Hub Button */}
          {onOpenSuitesMenu && (
            <button
              onClick={onOpenSuitesMenu}
              className="lg:hidden px-2.5 py-1.5 rounded-2xl bg-stadiumGreen/20 border border-stadiumGreen/50 text-stadiumGreen font-black text-xs flex items-center space-x-1 shadow-md active:scale-95"
              title="Open Stadium Hub"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>{t('Hub')} ⚡</span>
            </button>
          )}

          {/* Dedicated Install App Pill (Shows if not installed yet) */}
          {!isInstalled && (
            <button
              onClick={handleInstallClick}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl bg-gradient-to-r from-stadiumGreen to-emerald-400 text-black font-black text-xs flex items-center space-x-1 shadow-lg glow-emerald hover:scale-105 active:scale-95 transition-all"
              title="Install App on your phone"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Install App</span>
            </button>
          )}

          {/* Digital Avatar & Handle */}
          <button
            onClick={onOpenProfile}
            className="p-1 sm:px-2.5 sm:py-1.5 rounded-2xl bg-panel border border-white/10 hover:border-gold/40 text-gold flex items-center space-x-1 sm:space-x-1.5 transition-all hover:scale-105 active:scale-95"
            title="Admin Dashboard and Profile"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-tr from-gold to-stadiumGreen flex items-center justify-center text-black font-black text-[10px]">
              ⚡
            </div>
            <span className="hidden md:inline font-bold text-xs text-white">CyberStriker_99</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-gold/20 text-gold font-bold">3.8k</span>
          </button>

          {/* Language Switcher AT THE VERY TOP */}
          <div className="flex-shrink-0">
            <GlobalLanguageSwitcher />
          </div>

        </div>

      </div>
    </header>
  );
};
