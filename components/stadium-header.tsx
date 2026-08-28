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
  Scale
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
  onOpenProfile: () => void;
  onOpenTeams?: () => void;
  onOpenBirthdays: () => void;
  onOpenLeaderboard: () => void;
  onOpenSuitesMenu?: () => void;
}

export const StadiumHeader: React.FC<StadiumHeaderProps> = ({
  onOpenBirthdays,
  onOpenPlayers,
}) => {
  const { t } = useTranslation();

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
  <title>AuraScore Stadium</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="theme-color" content="#000000">
  <link rel="manifest" href="${window.location.origin}/manifest.json">
  <meta http-equiv="refresh" content="0; url=${window.location.origin}/">
</head>
<body style="background:#000000;color:#30D158;display:flex;align-items:center;justify-content:center;height:100vh;font-family:-apple-system,sans-serif;text-align:center;">
  <div>
    <h2>⚡ Launching AuraScore iOS Super-App...</h2>
  </div>
  <script>window.location.href = "${window.location.origin}/";</script>
</body>
</html>`;

      const blob = new Blob([appLauncherContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'AuraScore-SuperApp.html';
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
    <header className="sticky top-0 z-40 bg-[#09090B]/90 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 py-2.5 flex items-center justify-between gap-3 font-sans text-xs">
        
        {/* iOS Left: Brand Icon & Title */}
        <Link href="/" className="flex items-center space-x-2.5 group flex-shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] bg-gradient-to-tr from-stadiumGreen via-emerald-400 to-gold p-[1.5px] shadow-md group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-black rounded-[9px] flex items-center justify-center p-1">
              <img src="/logo.svg" alt="AuraScore Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">AURASCORE</span>
              <span className="px-1.5 py-0.5 rounded-full bg-stadiumGreen/20 text-stadiumGreen font-black text-[9px] border border-stadiumGreen/40">PRO</span>
            </div>
            <span className="text-[10px] text-gray-400 font-sans hidden sm:block">AI Sports Predictions & Live Center</span>
          </div>
        </Link>

        {/* iOS Center: Segmented Navigation Pills */}
        <nav className="hidden md:flex items-center space-x-1 bg-white/[0.04] p-1 rounded-full border border-white/[0.06] backdrop-blur-md">
          <Link 
            href="/converter" 
            className="px-3 py-1.5 rounded-full text-xs font-semibold text-stadiumGreen hover:bg-stadiumGreen/15 transition-all flex items-center space-x-1"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Converter</span>
          </Link>
          <Link 
            href="/clubs" 
            className="px-3 py-1.5 rounded-full text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-all flex items-center space-x-1"
          >
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>Clubs</span>
          </Link>
          <Link 
            href="/players" 
            className="px-3 py-1.5 rounded-full text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-all flex items-center space-x-1"
          >
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>Players</span>
          </Link>
          <Link 
            href="/birthdays" 
            className="px-3 py-1.5 rounded-full text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-all flex items-center space-x-1"
          >
            <Cake className="w-3.5 h-3.5 text-pink-400" />
            <span>Birthdays</span>
          </Link>
          <Link 
            href="/settlement" 
            className="px-3 py-1.5 rounded-full text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-all flex items-center space-x-1"
          >
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>Ledger</span>
          </Link>
        </nav>

        {/* iOS Right Controls */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <GlobalLanguageSwitcher />

          {/* Quick Birthday Icon Button on Mobile */}
          <button
            onClick={onOpenBirthdays}
            className="md:hidden p-2 rounded-xl bg-pink-500/15 border border-pink-500/30 text-pink-400 text-xs active:scale-95 transition-transform"
            title="Star Birthdays"
          >
            <Cake className="w-4 h-4" />
          </button>

          {/* iOS App Install Button */}
          {!isInstalled && (
            <button
              onClick={handleAutomaticDownload}
              disabled={isDownloading}
              className="px-3 py-1.5 rounded-full bg-stadiumGreen text-black font-extrabold text-xs flex items-center space-x-1.5 shadow-md hover:brightness-110 active:scale-95 transition-all"
              title="Install iOS App"
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
    </header>
  );
};
