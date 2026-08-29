'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Trophy, 
  Cake, 
  Sparkles, 
  Download,
  Users,
  Shield,
  Layers,
  Scale,
  Newspaper,
  UserCheck,
  Activity,
  DollarSign
} from 'lucide-react';
import { useTranslation } from '../lib/translation-engine';
import { GlobalLanguageSwitcher } from './global-language-switcher';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';

interface StadiumHeaderProps {
  onOpenPlayers?: () => void;
  currentTheme?: 'dark' | 'light';
}

export const StadiumHeader: React.FC<StadiumHeaderProps> = ({ onOpenPlayers, currentTheme = 'dark' }) => {
  const { t } = useTranslation();

  const [isInstalled, setIsInstalled] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
      const isLocalFlag = localStorage.getItem('aurascore_installed') === 'true';
      if (isStandalone || isLocalFlag) {
        setIsInstalled(true);
      }
    }
  }, []);

  const handleAutomaticDownload = () => {
    try { phoneHardware.triggerHaptic('SELECTION'); } catch {}
    try { stadiumAudio.playCrowdRoar(); } catch {}
    setIsDownloading(true);

    const promptEvent = (window as any).__pwaInstallPrompt;
    if (promptEvent) {
      try {
        promptEvent.prompt();
      } catch {}
    }

    setTimeout(() => {
      setIsDownloading(false);
      setIsInstalled(true);
      localStorage.setItem('aurascore_installed', 'true');
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.2 } });
      try { stadiumAudio.playSuccessSound(); } catch {}
    }, 600);
  };

  return (
    <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-3xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
      {/* iOS Dynamic Island Top Line Accent */}
      <div className="h-[2px] bg-gradient-to-r from-stadiumGreen via-cyan-400 to-gold w-full" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 font-sans text-xs">
        
        {/* iOS Left: Brand Icon & Dynamic Island Badge */}
        <Link href="/" className="flex items-center space-x-2.5 group flex-shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-gradient-to-tr from-stadiumGreen via-emerald-400 to-gold p-[1.5px] shadow-lg group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-black rounded-[13px] flex items-center justify-center p-1">
              <img src="/logo.svg" alt="Mivaj Sports Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">MIVAJ SPORTS</span>
              <span className="px-1.5 py-0.5 rounded-full bg-stadiumGreen/20 text-stadiumGreen font-black text-[9px] border border-stadiumGreen/40">PRO LIVE</span>
            </div>
            <span className="text-[10px] text-gray-400 font-sans hidden sm:block">Sports Intelligence & Live Match Center</span>
          </div>
        </Link>

        {/* Center: Segmented Navigation Pills (Desktop & Tablet) */}
        <nav className="hidden xl:flex items-center space-x-1 bg-white/[0.04] p-1 rounded-full border border-white/10 backdrop-blur-2xl shadow-inner">
          <Link 
            href="/standings" 
            className="px-3 py-1.5 rounded-full text-xs font-bold text-amber-400 hover:bg-amber-500/15 transition-all flex items-center space-x-1"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Standings</span>
          </Link>
          <Link 
            href="/injuries" 
            className="px-3 py-1.5 rounded-full text-xs font-bold text-red-400 hover:bg-red-500/15 transition-all flex items-center space-x-1"
          >
            <Activity className="w-3.5 h-3.5 text-red-400" />
            <span>Injuries</span>
          </Link>
          <Link 
            href="/transfers" 
            className="px-3 py-1.5 rounded-full text-xs font-bold text-emerald-400 hover:bg-emerald-500/15 transition-all flex items-center space-x-1"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Transfers</span>
          </Link>
          <Link 
            href="/settlement" 
            className="px-3 py-1.5 rounded-full text-xs font-bold text-gold hover:bg-gold/15 transition-all flex items-center space-x-1"
          >
            <Scale className="w-3.5 h-3.5 text-gold" />
            <span>Ledger</span>
          </Link>
          <Link 
            href="/converter" 
            className="px-3 py-1.5 rounded-full text-xs font-bold text-cyan-400 hover:bg-cyan-500/15 transition-all flex items-center space-x-1"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Revealer</span>
          </Link>
          <Link 
            href="/news" 
            className="px-3 py-1.5 rounded-full text-xs font-bold text-gray-300 hover:bg-white/10 transition-all flex items-center space-x-1"
          >
            <Newspaper className="w-3.5 h-3.5 text-gray-400" />
            <span>News</span>
          </Link>
          <Link 
            href="/birthdays" 
            className="px-3 py-1.5 rounded-full text-xs font-bold text-pink-400 hover:bg-pink-500/15 transition-all flex items-center space-x-1"
          >
            <Cake className="w-3.5 h-3.5 text-pink-400" />
            <span>Birthdays</span>
          </Link>
          <Link 
            href="/dashboard" 
            className="px-3 py-1.5 rounded-full text-xs font-bold text-purple-400 hover:bg-purple-500/15 transition-all flex items-center space-x-1"
          >
            <UserCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Account</span>
          </Link>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {/* Global Language Switcher */}
          <GlobalLanguageSwitcher />

          {/* App Install Button */}
          {!isInstalled && (
            <button
              onClick={handleAutomaticDownload}
              disabled={isDownloading}
              className="px-3.5 py-1.5 rounded-full bg-stadiumGreen text-black font-extrabold text-xs flex items-center space-x-1.5 shadow-lg hover:bg-emerald-400 active:scale-95 transition-all"
              title="Install App"
            >
              {isDownloading ? (
                <span className="w-3 h-3 rounded-full border-2 border-black border-t-transparent animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              )}
              <span className="hidden sm:inline">{isDownloading ? 'Installing...' : 'Get App'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Fast Mobile/Tablet Navigation Bar */}
      <div className="xl:hidden border-t border-white/10 px-3 py-1.5 overflow-x-auto flex items-center space-x-2 scrollbar-none bg-black/60">
        <Link 
          href="/standings" 
          className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 whitespace-nowrap flex items-center space-x-1"
        >
          <span>🏆 Standings</span>
        </Link>
        <Link 
          href="/injuries" 
          className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-red-400 bg-red-400/10 border border-red-400/20 whitespace-nowrap flex items-center space-x-1"
        >
          <span>🏥 Injuries</span>
        </Link>
        <Link 
          href="/transfers" 
          className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 whitespace-nowrap flex items-center space-x-1"
        >
          <span>💰 Transfers</span>
        </Link>
        <Link 
          href="/birthdays" 
          className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-pink-400 bg-pink-400/10 border border-pink-400/20 whitespace-nowrap flex items-center space-x-1"
        >
          <span>🎂 Birthdays</span>
        </Link>
        <Link 
          href="/settlement" 
          className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-gold bg-gold/10 border border-gold/20 whitespace-nowrap flex items-center space-x-1"
        >
          <span>📜 Ledger</span>
        </Link>
        <Link 
          href="/converter" 
          className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 whitespace-nowrap flex items-center space-x-1"
        >
          <span>🔄 Revealer</span>
        </Link>
        <Link 
          href="/dashboard" 
          className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-purple-400 bg-purple-400/10 border border-purple-400/20 whitespace-nowrap flex items-center space-x-1"
        >
          <span>👤 Account</span>
        </Link>
      </div>
    </header>
  );
};
