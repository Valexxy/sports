'use client';

import React, { useState, useEffect } from 'react';
import { 
  Download, Bell, Share, PlusSquare, X, Check, 
  Sparkles, Smartphone, ShieldCheck, Laptop, Monitor, 
  Apple, Chrome, Bookmark, ExternalLink 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { PushClientEngine } from '../../lib/push-client-engine';

export type DeviceType = 'ANDROID' | 'IOS' | 'DESKTOP';

export const PwaInstallPromptModal: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [deviceType, setDeviceType] = useState<DeviceType>('ANDROID');
  const [isMac, setIsMac] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pushSubscribed, setPushSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [bookmarkCopied, setBookmarkCopied] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if running in Standalone app mode
    const standaloneMode = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true ||
      localStorage.getItem('mivaj_app_installed') === 'true' ||
      localStorage.getItem('aurascore_installed') === 'true';
    setIsStandalone(standaloneMode);
    setIsInstalled(standaloneMode);

    // Smart Multi-Device Recognition Engine
    const userAgent = (window.navigator.userAgent || '').toLowerCase();
    const isAppleMobile = /iphone|ipad|ipod/i.test(userAgent);
    const isAndroidDevice = /android/i.test(userAgent);
    const isAppleMac = /macintosh|mac os x/i.test(userAgent) && !isAppleMobile;

    setIsMac(isAppleMac);

    if (isAppleMobile) {
      setDeviceType('IOS');
    } else if (isAndroidDevice) {
      setDeviceType('ANDROID');
    } else {
      setDeviceType('DESKTOP');
    }

    // Capture Chrome/Android/Edge/Desktop beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      (window as any).__pwaInstallPrompt = e;

      // Auto-show prompt after 4 seconds on first visit if not installed
      const dismissed = localStorage.getItem('mivaj_pwa_dismissed');
      if (!dismissed && !standaloneMode) {
        setTimeout(() => setShowModal(true), 3500);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          if (sub) setPushSubscribed(true);
        });
      }).catch((err) => console.log('SW registration error:', err));
    }

    const handleGlobalInstalled = () => {
      setIsStandalone(true);
      setIsInstalled(true);
      setShowModal(false);
    };

    const handleOpenModal = () => {
      setShowModal(true);
    };

    window.addEventListener('mivaj_app_installed', handleGlobalInstalled);
    window.addEventListener('appinstalled', handleGlobalInstalled);
    window.addEventListener('open_pwa_install_modal', handleOpenModal);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('mivaj_app_installed', handleGlobalInstalled);
      window.removeEventListener('appinstalled', handleGlobalInstalled);
      window.removeEventListener('open_pwa_install_modal', handleOpenModal);
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
        localStorage.setItem('mivaj_app_installed', 'true');
        localStorage.setItem('aurascore_installed', 'true');
        localStorage.setItem('mivaj_pwa_dismissed', 'true');
        window.dispatchEvent(new CustomEvent('mivaj_app_installed'));
      }
      setDeferredPrompt(null);
    } else if (deviceType === 'DESKTOP') {
      // Direct instructions for laptop / desktop users when prompt is not cached
      alert('To install Mivaj on your laptop:\n\n1. Look at the right side of your browser address bar (URL bar).\n2. Click the "Install Mivaj Sports" (⊕) icon.\n3. Or press Ctrl+D (Cmd+D on Mac) to bookmark for instant 1-click access!');
    }
  };

  const handleBookmarkClick = () => {
    phoneHardware.triggerHaptic('SELECTION');
    setBookmarkCopied(true);
    setTimeout(() => setBookmarkCopied(false), 3000);
    alert(`💡 Press ${isMac ? 'Command (⌘) + D' : 'Ctrl + D'} right now to add Mivaj Sports to your browser bar!`);
  };

  const handleEnablePushNotifications = async () => {
    phoneHardware.triggerHaptic('SELECTION');
    setLoading(true);

    try {
      const result = await PushClientEngine.subscribe();
      if (result.ok) {
        setPushSubscribed(true);
        phoneHardware.triggerHaptic('SUCCESS');
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
        alert('🔔 Instant Match & Goal Alerts Activated!');
      } else {
        alert(result.error || 'Please allow notification permission in your browser settings.');
      }
    } catch (err: any) {
      console.warn('Push subscription error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('mivaj_pwa_dismissed', 'true');
    setShowModal(false);
  };

  if (isStandalone || isInstalled) return null;

  return (
    <>
      {/* Floating Mini Install Pill */}
      {!showModal && !isStandalone && !isInstalled && (
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-20 right-4 z-40 px-3.5 py-2 rounded-2xl bg-[#0a1224]/95 border border-stadiumGreen/60 text-stadiumGreen font-mono font-black text-xs shadow-2xl flex items-center space-x-2 backdrop-blur-md hover:scale-105 transition-all animate-bounce"
        >
          {deviceType === 'IOS' ? (
            <Smartphone className="w-4 h-4 text-gray-300" />
          ) : deviceType === 'DESKTOP' ? (
            <Laptop className="w-4 h-4 text-cyan-400" />
          ) : (
            <Smartphone className="w-4 h-4 text-emerald-400" />
          )}
          <span>{deviceType === 'DESKTOP' ? 'Install Desktop App' : 'Install App'}</span>
        </button>
      )}

      {/* Full Modal Onboarding Prompt with Smart Multi-Device Intelligence */}
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

            {/* Header with Device-Specific Branding */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-stadiumGreen to-emerald-400 text-black flex items-center justify-center font-black text-2xl shadow-lg shadow-stadiumGreen/20 flex-shrink-0">
                {deviceType === 'IOS' ? '🍏' : deviceType === 'DESKTOP' ? '💻' : '🤖'}
              </div>
              <div className="min-w-0">
                <h3 className="font-black text-sm sm:text-base text-white truncate">
                  {deviceType === 'IOS' ? 'MIVAJ FOR APPLE IOS' : deviceType === 'DESKTOP' ? 'MIVAJ DESKTOP APP' : 'MIVAJ FOR ANDROID'}
                </h3>
                <span className="text-[10px] text-stadiumGreen font-bold flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>
                    {deviceType === 'IOS' 
                      ? 'IPHONE & IPAD EDITION' 
                      : deviceType === 'DESKTOP' 
                      ? 'LAPTOP & DESKTOP WORKSTATION' 
                      : 'NATIVE ANDROID EDITION'}
                  </span>
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              {deviceType === 'DESKTOP'
                ? 'Run Mivaj Sports as a dedicated standalone desktop app on your PC or Mac with zero browser clutter, dual-monitor live radar, and instant kickoff alerts!'
                : 'Install Mivaj Sports on your device for instant lock-screen score updates, persistent audio radio, and 15-minute kickoff alerts!'}
            </p>

            {/* DEVICE SPECIFIC INSTALL INSTRUCTIONS */}

            {/* 1. APPLE IOS (iPhone & iPad) */}
            {deviceType === 'IOS' && (
              <div className="p-3.5 rounded-2xl bg-black/70 border border-gold/40 space-y-2.5 text-xs text-gray-200">
                <span className="text-[11px] font-black text-gold flex items-center space-x-1">
                  <Share className="w-3.5 h-3.5 text-gold" />
                  <span>HOW TO INSTALL ON IPHONE &amp; IPAD:</span>
                </span>
                
                <div className="space-y-2 text-[11px]">
                  <div className="flex items-start space-x-2">
                    <span className="w-4 h-4 rounded-full bg-gold text-black font-black text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <span>Tap the Safari <strong>Share icon [↑]</strong> at the bottom of your iPhone screen.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="w-4 h-4 rounded-full bg-gold text-black font-black text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <span>Scroll down and tap <strong>"Add to Home Screen"</strong> with the <PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-stadiumGreen" /> icon.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="w-4 h-4 rounded-full bg-gold text-black font-black text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <span>Launch Mivaj Sports from your Home Screen for full live scores and audio radio!</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. ANDROID (Smartphones & Tablets) */}
            {deviceType === 'ANDROID' && (
              <div className="space-y-3">
                <button
                  onClick={handleInstallClick}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-stadiumGreen to-emerald-400 hover:from-emerald-400 hover:to-stadiumGreen text-black font-black text-xs shadow-lg shadow-stadiumGreen/25 flex items-center justify-center space-x-2 transition-all active:scale-95 font-mono"
                >
                  <Download className="w-4 h-4" />
                  <span>1-CLICK INSTALL TO ANDROID HOME SCREEN</span>
                </button>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] text-gray-300 flex items-center space-x-2">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Works seamlessly across Samsung, Xiaomi, Tecno, Infinix &amp; all Android devices.</span>
                </div>
              </div>
            )}

            {/* 3. LAPTOP / DESKTOP (Windows, Mac, Linux, Chromebook) */}
            {deviceType === 'DESKTOP' && (
              <div className="space-y-3">
                <button
                  onClick={handleInstallClick}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-stadiumGreen to-emerald-400 hover:from-emerald-400 hover:to-stadiumGreen text-black font-black text-xs shadow-lg shadow-stadiumGreen/25 flex items-center justify-center space-x-2 transition-all active:scale-95 font-mono"
                >
                  <Laptop className="w-4 h-4" />
                  <span>1-CLICK INSTALL DESKTOP WEB APP</span>
                </button>

                <div className="p-3 rounded-2xl bg-black/60 border border-white/10 space-y-1.5 text-xs text-gray-300">
                  <div className="flex items-center space-x-1.5 text-cyan-400 font-bold text-[11px]">
                    <Monitor className="w-3.5 h-3.5" />
                    <span>ON A LAPTOP / WORKSTATION?</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-gray-300 font-sans">
                    Look at the right side of your browser URL address bar and click the <strong>Install icon (⊕)</strong> to run Mivaj in full desktop window mode.
                  </p>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={handleBookmarkClick}
                      className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold flex items-center justify-center space-x-1.5 transition-all"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-gold" />
                      <span>{bookmarkCopied ? 'Shortcut Tip Shown! ✓' : `Bookmark Mivaj (${isMac ? 'Cmd + D' : 'Ctrl + D'})`}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Universal Notification Subscription Button */}
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
