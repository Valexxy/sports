'use client';

import React, { useState, useEffect } from 'react';
import { Download, Bell, Share, PlusSquare, X, Check, Sparkles, Smartphone, ShieldCheck, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../../lib/phone-hardware-engine';

export const PwaInstallPromptModal: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pushSubscribed, setPushSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already installed in Standalone mode
    const standaloneMode = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;
    setIsStandalone(standaloneMode);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isAppleDevice);

    // Capture Chrome/Android/Edge beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Auto-show prompt after 4 seconds on first visit if not installed
      const dismissed = localStorage.getItem('mivaj_pwa_dismissed');
      if (!dismissed) {
        setTimeout(() => setShowModal(true), 3500);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        // Check existing push subscription
        reg.pushManager.getSubscription().then((sub) => {
          if (sub) setPushSubscribed(true);
        });
      }).catch((err) => console.log('SW registration error:', err));
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    phoneHardware.triggerHaptic('SUCCESS');
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
        setShowModal(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleEnablePushNotifications = async () => {
    phoneHardware.triggerHaptic('SELECTION');
    setLoading(true);

    try {
      if (!('Notification' in window) || !('serviceWorker' in navigator)) {
        alert('Push notifications are not supported on this browser version.');
        setLoading(false);
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBKr3qBUYIhbQFLXYp5Nksh8U'
        });

        // Sync subscription with backend
        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription: sub })
        }).catch(() => {});

        setPushSubscribed(true);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
        alert('🔔 Instant Match & Goal Alerts Activated!');
      } else {
        alert('Please allow notification permission in your browser settings to receive live goal alerts.');
      }
    } catch (err) {
      console.warn('Push subscription error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('mivaj_pwa_dismissed', 'true');
    setShowModal(false);
  };

  if (!showModal && isStandalone) return null;

  return (
    <>
      {/* Floating Mini Install Pill (If dismissed or minimized) */}
      {!showModal && !isStandalone && (
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-20 right-4 z-40 px-3.5 py-2 rounded-2xl bg-[#0a1224]/95 border border-stadiumGreen/60 text-stadiumGreen font-mono font-black text-xs shadow-2xl flex items-center space-x-2 backdrop-blur-md hover:scale-105 transition-all animate-bounce"
        >
          <Smartphone className="w-4 h-4 text-gold" />
          <span>Install App</span>
        </button>
      )}

      {/* Full Modal Onboarding Prompt */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn font-mono">
          <div className="glass-panel-premium w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border-2 border-stadiumGreen p-5 sm:p-6 space-y-4 shadow-2xl text-white relative">
            
            {/* Close */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-stadiumGreen to-emerald-400 text-black flex items-center justify-center font-black text-2xl shadow-lg shadow-stadiumGreen/20">
                ⚡
              </div>
              <div>
                <h3 className="font-black text-base text-white">MIVAJ SPORTS LIVE</h3>
                <span className="text-[10px] text-stadiumGreen font-bold flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>UNIVERSAL PROGRESSIVE WEB APP</span>
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Install Mivaj Sports on your device for instant lock-screen score updates, persistent audio radio, and 15-minute kickoff alerts!
            </p>

            {/* iOS Safari Specific Step-by-Step Instructions */}
            {isIOS && !isStandalone ? (
              <div className="p-3.5 rounded-2xl bg-black/70 border border-gold/40 space-y-2.5 text-xs text-gray-200">
                <span className="text-[11px] font-black text-gold flex items-center space-x-1">
                  <Share className="w-3.5 h-3.5 text-gold" />
                  <span>HOW TO INSTALL ON IPHONE & IPAD:</span>
                </span>
                
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-start space-x-2">
                    <span className="w-4 h-4 rounded-full bg-gold text-black font-black text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <span>Tap the Safari <strong>Share icon [↑]</strong> at the bottom of your screen.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="w-4 h-4 rounded-full bg-gold text-black font-black text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <span>Scroll down and tap <strong>"Add to Home Screen"</strong> with the <PlusSquare className="w-3 h-3 inline mx-0.5 text-stadiumGreen" /> icon.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="w-4 h-4 rounded-full bg-gold text-black font-black text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <span>Launch Mivaj Sports from your Home Screen for full push alerts!</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Android / Desktop / Chrome 1-Click Install */
              <div className="space-y-2">
                <button
                  onClick={handleInstallClick}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-stadiumGreen to-emerald-400 hover:from-emerald-400 hover:to-stadiumGreen text-black font-black text-xs shadow-lg shadow-stadiumGreen/25 flex items-center justify-center space-x-2 transition-all active:scale-95 font-mono"
                >
                  <Download className="w-4 h-4" />
                  <span>1-CLICK INSTALL TO HOME SCREEN</span>
                </button>
              </div>
            )}

            {/* Notification Subscription Button */}
            <div className="pt-1">
              <button
                onClick={handleEnablePushNotifications}
                disabled={loading || pushSubscribed}
                className={`w-full py-2.5 rounded-2xl border text-xs font-black flex items-center justify-center space-x-2 transition-all active:scale-95 ${
                  pushSubscribed
                    ? 'bg-stadiumGreen/20 border-stadiumGreen text-stadiumGreen'
                    : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                }`}
              >
                {pushSubscribed ? <Check className="w-4 h-4 text-stadiumGreen" /> : <Bell className="w-4 h-4 text-gold animate-bounce" />}
                <span>{pushSubscribed ? '🔔 Goal & Kickoff Alerts Active ✓' : '🔔 Enable Instant Goal Push Alerts'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[9px] text-gray-500 pt-1 border-t border-white/10">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-stadiumGreen" />
                <span>Zero Battery Drain</span>
              </span>
              <span>Always Free • No App Store Needed</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
