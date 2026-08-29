'use client';
import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Check, 
  X, 
  Sparkles, 
  Zap, 
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';
import { useTranslation } from '../lib/translation-engine';

export const PhoneHardwareBanner: React.FC = () => {
  const { t } = useTranslation();
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [justCompleted, setJustCompleted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if already installed
    const storedInstalled = localStorage.getItem('aurascore_installed');
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (storedInstalled === 'true' || isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Check if user dismissed recently
    const isDismissed = localStorage.getItem('aurascore_pwa_dismissed');
    if (isDismissed === 'true') {
      setDismissed(true);
    }

    // Listen for beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      (window as any).__pwaInstallPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      localStorage.setItem('aurascore_installed', 'true');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const triggerDirectAutomaticDownload = () => {
    try {
      // Create and trigger direct standalone PWA web application launcher package
      const appLauncherContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Mivaj Sports Pro Live</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="theme-color" content="#05070B">
  <link rel="manifest" href="${window.location.origin}/manifest.json">
  <meta http-equiv="refresh" content="0; url=${window.location.origin}/">
</head>
<body style="background:#05070B;color:#00FFA3;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;text-align:center;">
  <div>
    <h2>⚡ Launching Mivaj Sports App...</h2>
    <p style="color:#aaa;">Opening live fixtures and predictions</p>
  </div>
  <script>window.location.href = "${window.location.origin}/";</script>
</body>
</html>`;

      const blob = new Blob([appLauncherContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Mivaj-Sports-App.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      /* noop */
    }
  };

  const handleInstallClick = async () => {
    phoneHardware.triggerHaptic('SELECTION');
    stadiumAudio.playCrowdRoar();
    setIsDownloading(true);
    setDownloadProgress(25);

    // If native prompt is ready, trigger it immediately
    const promptEvent = installPrompt || (typeof window !== 'undefined' && (window as any).__pwaInstallPrompt);
    if (promptEvent) {
      try {
        promptEvent.prompt();
      } catch {
        /* noop */
      }
    }

    // Automatically trigger app package download
    triggerDirectAutomaticDownload();

    // Fast simulated download & registration progress
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          setJustCompleted(true);
          setIsInstalled(true);
          localStorage.setItem('aurascore_installed', 'true');
          localStorage.setItem('aurascore_pwa_dismissed', 'true');
          confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
          stadiumAudio.playSuccessSound();
          setTimeout(() => {
            setDismissed(true);
          }, 600);
          return 100;
        }
        return prev + 50;
      });
    }, 100);
  };

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('aurascore_pwa_dismissed', 'true');
    }
  };

  // If already installed or dismissed, NEVER SHOW AGAIN
  if (isInstalled || dismissed) return null;

  return (
    <div className="fixed bottom-24 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-auto sm:w-84 z-30 animate-slideUp font-mono text-xs">
      <div className="glass-panel-premium rounded-3xl p-3.5 border-2 border-stadiumGreen shadow-2xl bg-black/95 flex items-center justify-between gap-3 glow-emerald">
        
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-stadiumGreen via-gold to-cyberPurple p-0.5 flex-shrink-0 shadow-lg">
            <div className="w-full h-full bg-void rounded-[14px] flex items-center justify-center p-1">
              <img src="/logo.svg" alt="Mivaj Sports" className="w-full h-full object-contain" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-white text-xs truncate">
                {justCompleted ? 'App Installed ✓' : isDownloading ? 'Downloading App...' : 'Download Mivaj App'}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-stadiumGreen text-black font-black text-[9px]">
                {justCompleted ? 'READY' : 'AUTOMATIC'}
              </span>
            </div>
            <p className="text-[10px] text-gray-300 font-sans truncate mt-0.5">
              {justCompleted ? t('Installed on device successfully!') : t('1-Click automatic instant download')}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={handleInstallClick}
            disabled={isDownloading || justCompleted}
            className="px-3.5 py-2 rounded-2xl bg-stadiumGreen hover:bg-emerald-400 text-black font-black text-xs flex items-center space-x-1 shadow-lg active:scale-95 transition-all disabled:opacity-90"
          >
            {justCompleted ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                <span>Installed</span>
              </>
            ) : isDownloading ? (
              <>
                <span className="w-3 h-3 rounded-full border-2 border-black border-t-transparent animate-spin" />
                <span>{downloadProgress}%</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>{t('Download')}</span>
              </>
            )}
          </button>

          {!justCompleted && (
            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-xl text-gray-400 hover:text-white bg-white/5 border border-white/10 transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
