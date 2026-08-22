'use client';

import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Smartphone, 
  Share, 
  PlusSquare, 
  Check, 
  X, 
  ExternalLink, 
  Zap, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';

export const PhoneHardwareBanner: React.FC = () => {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
      return;
    }

    // Check if user dismissed banner recently
    const isDismissed = localStorage.getItem('aurascore_pwa_dismissed');
    if (isDismissed === 'true') {
      setDismissed(true);
    }

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIpadOrIphone = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIpadOrIphone);

    // Detect in-app browsers (WhatsApp, Instagram, Telegram, Twitter, FB)
    const inApp = /fban|fbav|instagram|twitter|whatsapp|telegram|line|snapchat/.test(ua);
    setIsInAppBrowser(inApp);

    // Listen for Android/Chrome beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    phoneHardware.triggerHaptic('SELECTION');
    stadiumAudio.playCrowdRoar();

    if (installPrompt) {
      // Native Android/Chrome prompt
      installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        setInstallPrompt(null);
      }
    } else {
      // Show visual instruction guide (iOS or unsupported browsers)
      setShowModal(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('aurascore_pwa_dismissed', 'true');
    }
  };

  if (isInstalled || dismissed) return null;

  return (
    <>
      {/* Sleek Floating Install Notification Banner */}
      <div className="fixed top-14 left-3 right-3 sm:top-16 sm:left-auto sm:right-6 sm:w-96 z-40 animate-slideDown font-mono text-xs">
        <div className="glass-panel-premium rounded-2xl p-3 border-2 border-stadiumGreen/60 shadow-2xl bg-black/95 flex items-center justify-between gap-2.5 glow-emerald">
          
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-stadiumGreen via-gold to-cyberPurple p-0.5 flex-shrink-0 shadow-lg">
              <div className="w-full h-full bg-void rounded-[10px] flex items-center justify-center p-0.5">
                <img src="/logo.svg" alt="AuraScore" className="w-full h-full object-contain" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-white text-xs truncate">Install AuraScore</span>
                <span className="px-1.5 py-0.2 rounded bg-stadiumGreen text-black font-black text-[9px]">1-TAP</span>
              </div>
              <p className="text-[10px] text-gray-300 font-sans truncate">
                Sub-second live scores & push notifications
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 rounded-xl bg-stadiumGreen hover:bg-emerald-400 text-black font-black text-xs flex items-center space-x-1 shadow-lg active:scale-95 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
            <button
              onClick={handleDismiss}
              className="p-1 rounded-lg text-gray-400 hover:text-white transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Visual Step-by-Step Install Guide Modal (For iOS, Safari, or WhatsApp/Telegram Browsers) */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn font-mono text-xs">
          <div className="relative w-full max-w-md glass-panel-premium rounded-3xl border-2 border-stadiumGreen p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-stadiumGreen text-black font-black">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-white text-sm">INSTALL APP ON YOUR DEVICE</h3>
                  <span className="text-[10px] text-stadiumGreen font-black">NO APP STORE REQUIRED • 100% FREE</span>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-full bg-panel text-gray-400 hover:text-white border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isInAppBrowser ? (
              <div className="space-y-3 p-3 rounded-2xl bg-gold/10 border border-gold/40 text-gold text-xs">
                <p className="font-bold">⚠️ You are inside an in-app browser (WhatsApp / Telegram / Instagram).</p>
                <p className="text-gray-300 font-sans text-[11px]">
                  1. Tap the <strong>three dots (⋮ or ⋯)</strong> or Share button at the top/bottom corner.
                </p>
                <p className="text-gray-300 font-sans text-[11px]">
                  2. Select <strong>&quot;Open in Chrome&quot;</strong> or <strong>&quot;Open in Safari&quot;</strong>.
                </p>
                <p className="text-gray-300 font-sans text-[11px]">
                  3. Then tap <strong>Install App</strong> for 1-tap home screen access!
                </p>
              </div>
            ) : isIOS ? (
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-panel border border-white/10 space-y-2">
                  <div className="flex items-start space-x-2.5">
                    <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 font-black">1</div>
                    <p className="text-gray-200 font-sans text-xs pt-0.5">
                      Tap the <strong>Share</strong> icon (<Share className="w-3.5 h-3.5 inline text-blue-400" />) at the bottom of Safari.
                    </p>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <div className="p-1.5 rounded-lg bg-stadiumGreen/20 text-stadiumGreen font-black">2</div>
                    <p className="text-gray-200 font-sans text-xs pt-0.5">
                      Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong> (<PlusSquare className="w-3.5 h-3.5 inline text-stadiumGreen" />).
                    </p>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <div className="p-1.5 rounded-lg bg-gold/20 text-gold font-black">3</div>
                    <p className="text-gray-200 font-sans text-xs pt-0.5">
                      Tap <strong>&quot;Add&quot;</strong> in the top right. AuraScore is now your native app!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-panel border border-white/10 space-y-2">
                  <p className="text-gray-300 font-sans text-xs">
                    1. Tap the browser menu (<span className="font-bold text-white">⋮</span>) at the top right of Chrome.
                  </p>
                  <p className="text-gray-300 font-sans text-xs">
                    2. Select <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.
                  </p>
                  <p className="text-gray-300 font-sans text-xs">
                    3. Tap <strong>Install</strong> to launch instantly anytime!
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2.5 rounded-2xl bg-stadiumGreen text-black font-black text-xs hover:bg-emerald-400 transition-all shadow-lg glow-emerald"
            >
              Got it! 🚀
            </button>

          </div>
        </div>
      )}
    </>
  );
};
