'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Trophy, 
  Sun, 
  Moon, 
  Cake, 
  Sparkles, 
  Share2,
  Download,
  CheckCircle2
} from 'lucide-react';
import { useTranslation } from '../lib/translation-engine';
import { GlobalLanguageSwitcher } from './global-language-switcher';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';

interface StadiumHeaderProps {
  onOpenPlayers?: () => void;
  currentTheme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onOpenReceipt: () => void;
  onOpenLedger: () => void;
  onOpenLedger?: () => void;
  onOpenProfile: () => void;
  onOpenTeams?: () => void;
  onOpenBirthdays: () => void;
  onOpenLeaderboard: () => void;
  onOpenSuitesMenu?: () => void;
}

export const StadiumHeader: React.FC<StadiumHeaderProps> = ({
  currentTheme = 'dark',
  onToggleTheme,
  onOpenPlayers,
  onOpenReceipt,
  onOpenProfile,
  onOpenBirthdays,
  onOpenLeaderboard,
  onOpenSuitesMenu,
}) => {
  const { t } = useTranslation();

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      })
      .catch(() => setCurrentUser(null))
      .finally(() => setAuthChecked(true));
  }, []);

  const [isInstalled, setIsInstalled] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('aurascore_installed');
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
      if (stored === 'true' || isStandalone) {
        setIsInstalled(true);
      }
    }
  }, []);

  const handleAutomaticDownload = () => {
    phoneHardware.triggerHaptic('SELECTION');
    stadiumAudio.playCrowdRoar();
    setIsDownloading(true);

    const promptEvent = (window as any).__pwaInstallPrompt;
    if (promptEvent) {
      try {
        promptEvent.prompt();
      } catch {
        /* noop */
      }
    }

    try {
      const appLauncherContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>AuraScore Stadium 2.0</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="theme-color" content="#05070B">
  <link rel="manifest" href="${window.location.origin}/manifest.json">
  <meta http-equiv="refresh" content="0; url=${window.location.origin}/">
</head>
<body style="background:#05070B;color:#00FFA3;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;text-align:center;">
  <div>
    <h2>⚡ Launching AuraScore Stadium App...</h2>
  </div>
  <script>window.location.href = "${window.location.origin}/";</script>
</body>
</html>`;

      const blob = new Blob([appLauncherContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'AuraScore-Stadium-App.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      /* noop */
    }

    setTimeout(() => {
      setIsDownloading(false);
      setIsInstalled(true);
      localStorage.setItem('aurascore_installed', 'true');
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.2 } });
      stadiumAudio.playSuccessSound();
    }, 600);
  };

  return (
    <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
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
            <span className="text-[10px] text-gray-400 font-sans hidden md:block">Official Live Match Center & Stadium Atmosphere</span>
          </div>
        </Link>

        {/* Central Language Switcher & Navigation */}
        <div className="flex items-center space-x-2">
          <GlobalLanguageSwitcher />
          <button
            onClick={onOpenBirthdays}
            className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/40 text-pink-400 font-black text-xs shadow-md transition-all active:scale-95"
            title="Star Birthdays Today & This Week"
          >
            <span>🎂</span>
            <span className="hidden sm:inline">Birthdays</span>
          </button>
        </div>

        {/* Desktop Navigation Menu */}
        <nav className="hidden lg:flex items-center space-x-2 bg-black/60 px-3 py-1.5 rounded-2xl border border-white/10">
          <Link href="/players" className="px-3 py-1.5 rounded-xl text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-all">
            ★ Players
          </Link>
          <Link href="/birthdays" className="px-3 py-1.5 rounded-xl text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-all">
            🎂 Birthdays
          </Link>
          <Link href="/converter" className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all">
            ⚡ Converter
          </Link>







        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
          


          {/* Automatic Download Button (Shows if not downloaded yet) */}
          {!isInstalled && (
            <button
              onClick={handleAutomaticDownload}
              disabled={isDownloading}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl bg-gradient-to-r from-stadiumGreen to-emerald-400 text-black font-black text-xs flex items-center space-x-1 shadow-lg glow-emerald hover:scale-105 active:scale-95 transition-all"
              title="Download AuraScore App"
            >
              {isDownloading ? (
                <span className="w-3.5 h-3.5 rounded-full border-2 border-black border-t-transparent animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">{isDownloading ? t('Downloading...') : t('Download App')}</span>
            </button>
          )}

          {/* Players Radar Button */}
          {onOpenPlayers && (
            <button
              onClick={onOpenPlayers}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl bg-gold/15 hover:bg-gold/25 border border-gold/40 text-gold font-black text-xs flex items-center space-x-1.5 shadow-md active:scale-95 transition-all"
              title="Star Player Radar & Lock Screen Alerts"
            >
              <span>⭐</span>
              <span className="hidden md:inline">{t('Players')}</span>
            </button>
          )}



          




        </div>

      </div>
    </header>
  );
};
