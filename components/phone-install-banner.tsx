'use client';

import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Smartphone, 
  Share, 
  PlusSquare, 
  Check, 
  X, 
  Zap, 
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

    // Detect OS
    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));
    setIsInAppBrowser(/fban|fbav|instagram|twitter|whatsapp|telegram|line|snapchat/.test(ua));

    // Listen for beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      (window as any).__pwaInstallPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Listen for appinstalled event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      localStorage.setItem('aurascore_installed', 'true');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    phoneHardware.triggerHaptic('SELECTION');
    stadiumAudio.playCrowdRoar();

    const promptEvent = installPrompt || (typeof window !== 'undefined' && (window as any).__pwaInstallPrompt);

    if (promptEvent) {
      promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        localStorage.setItem('aurascore_installed', 'true');
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });
        setInstallPrompt(null);
      }
    } else {
      setShowModal(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('aurascore_pwa_dismissed', 'true');
    }
  };

  // If already installed, NEVER SHOW AGAIN
  if (isInstalled || dismissed) return null;

  return (
    <>
      {/* Floating Bottom Toast — Positioned safely above bottom navigation, zero overlap with header */}
      <div className="fixed bottom-20 left-3 right-3 sm:bottom-6 sm:left-auto sm:right-6 sm:w-96 z-40 animate-slideUp font-mono text-xs">
        <div className="glass-panel-premium rounded-3xl p-3.5 border-2 border-stadiumGreen shadow-2xl bg-black/95 flex items-center justify-between gap-3 glow-emerald">
          
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-stadiumGreen via-gold to-cyberPurple p-0.5 flex-shrink-0 shadow-lg">
              <div className="w-full h-full bg-void rounded-[14px] flex items-center justify-center p-1">
                <img src="/logo.svg" alt="AuraScore" className="w-full h-full object-contain" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-white text-xs truncate">Install AuraScore</span>
                <span className="px-1.5 py-0.2 rounded bg-stadiumGreen text-black font-black text-[9px]">1-TAP</span>
              </div>
              <p className="text-[10px] text-gray-300 font-sans truncate mt-0.5">
                Sub-second live scores & push alerts
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-2 rounded-2xl bg-stadiumGreen hover:bg-emerald-400 text-black font-black text-xs flex items-center space-x-1 shadow-lg active:scale-95 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-xl text-gray-400 hover:text-white bg-white/5 border border-white/10 transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Visual Step-by-Step Install Guide Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn font-mono text-xs">
          <div className="relative w-full max-w-md glass-panel-premium rounded-3xl border-2 border-stadiumGreen p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-2xl bg-stadiumGreen text-black font-black">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-white text-sm">INSTALL NATIVE APP 📱</h3>
                  <span className="text-[10px] text-stadiumGreen font-black">100% FREE • NO APP STORE NEEDED</span>
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
              <div className="space-y-2.5 p-3.5 rounded-2xl bg-gold/15 border border-gold/40 text-gold text-xs">
                <p className="font-bold">⚠️ In-App Browser Detected (WhatsApp / Telegram / Instagram)</p>
                <p className="text-gray-200 font-sans text-xs">
                  1. Tap the <strong>three dots (⋮ or ⋯)</strong> or Share icon in your top/bottom corner.
                </p>
                <p className="text-gray-200 font-sans text-xs">
                  2. Select <strong>&quot;Open in Chrome&quot;</strong> or <strong>&quot;Open in Safari&quot;</strong>.
                </p>
                <p className="text-gray-200 font-sans text-xs">
                  3. Tap <strong>Install App</strong> for direct 1-tap home screen access!
                </p>
              </div>
            ) : isIOS ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-panel border border-white/10 space-y-2.5">
                  <div className="flex items-start space-x-2.5">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 font-black flex items-center justify-center flex-shrink-0 text-xs">1</div>
                    <p className="text-gray-200 font-sans text-xs pt-0.5">
                      Tap the <strong>Share</strong> button (<Share className="w-3.5 h-3.5 inline text-blue-400 mx-0.5" />) at the bottom of Safari.
                    </p>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <div className="w-6 h-6 rounded-lg bg-stadiumGreen/20 text-stadiumGreen font-black flex items-center justify-center flex-shrink-0 text-xs">2</div>
                    <p className="text-gray-200 font-sans text-xs pt-0.5">
                      Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong> (<PlusSquare className="w-3.5 h-3.5 inline text-stadiumGreen mx-0.5" />).
                    </p>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <div className="w-6 h-6 rounded-lg bg-gold/20 text-gold font-black flex items-center justify-center flex-shrink-0 text-xs">3</div>
                    <p className="text-gray-200 font-sans text-xs pt-0.5">
                      Tap <strong>&quot;Add&quot;</strong> in the top right. AuraScore is now your native app icon!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-panel border border-white/10 space-y-2.5">
                  <p className="text-gray-200 font-sans text-xs">
                    1. Tap the browser menu (<span className="font-bold text-white">⋮</span>) at the top right of Chrome.
                  </p>
                  <p className="text-gray-200 font-sans text-xs">
                    2. Tap <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.
                  </p>
                  <p className="text-gray-200 font-sans text-xs">
                    3. Tap <strong>Install</strong> to launch instantly anytime!
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setShowModal(false);
                localStorage.setItem('aurascore_installed', 'true');
                setIsInstalled(true);
              }}
              className="w-full py-3 rounded-2xl bg-stadiumGreen text-black font-black text-xs hover:bg-emerald-400 transition-all shadow-lg glow-emerald"
            >
              Got it! Done 🚀
            </button>

          </div>
        </div>
      )}
    </>
  );
};
