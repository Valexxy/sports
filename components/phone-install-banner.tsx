'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Smartphone, 
  Download, 
  Check, 
  Sparkles, 
  Zap, 
  Eye, 
  EyeOff, 
  Vibrate, 
  Volume2,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';

export const PhoneHardwareBanner: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('Notification' in window && Notification.permission === 'granted') {
        setNotificationsEnabled(true);
      }

      // Check if installed as standalone PWA
      if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
        setIsInstalled(true);
      }

      // Capture beforeinstallprompt event
      const handler = (e: Event) => {
        e.preventDefault();
        setInstallPrompt(e);
      };
      window.addEventListener('beforeinstallprompt', handler);

      return () => window.removeEventListener('beforeinstallprompt', handler);
    }
  }, []);

  const handleEnableNotifications = async () => {
    const granted = await phoneHardware.requestNotificationPermission();
    if (granted) {
      setNotificationsEnabled(true);
      phoneHardware.triggerHaptic('GOAL_SCORED');
      stadiumAudio.playCrowdRoar();
    }
  };

  const handleToggleWakeLock = async () => {
    if (wakeLockActive) {
      phoneHardware.releaseStadiumWakeLock();
      setWakeLockActive(false);
    } else {
      const active = await phoneHardware.enableStadiumWakeLock();
      if (active) {
        setWakeLockActive(true);
        phoneHardware.triggerHaptic('BANKER_LOCKED');
      }
    }
  };

  const handleTestHaptic = () => {
    phoneHardware.triggerHaptic('GOAL_SCORED');
    stadiumAudio.playCrowdRoar();
    phoneHardware.sendNativeNotification(
      '⚽ GOAL! Stadium Haptic Test',
      'Phone vibration motor & background alert executed successfully!'
    );
  };

  const handleInstallApp = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setInstallPrompt(null);
      }
    } else {
      alert('📲 To install on iOS/Safari: Tap Share ➔ "Add to Home Screen". On Chrome/Android: Tap 3 dots ➔ "Install app".');
    }
  };

  if (dismissed) return null;

  return (
    <div className="glass-panel-premium rounded-3xl p-4 sm:p-5 border border-stadiumGreen/40 shadow-2xl font-mono text-xs space-y-3 animate-fadeIn">
      
      {/* Header with Collapsible Toggle */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer select-none border-b border-white/10 pb-2.5"
      >
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-stadiumGreen text-black font-black">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-black text-white text-xs sm:text-sm flex items-center space-x-2">
              <span>PHONE HARDWARE & BACKGROUND ENGINE 📱</span>
              <span className="px-2 py-0.5 rounded bg-stadiumGreen/20 text-stadiumGreen text-[9px] font-black border border-stadiumGreen/30">
                ACTIVE
              </span>
            </h4>
            <span className="text-[10px] text-gray-400 font-sans hidden sm:block">
              Wakes your phone with native lock-screen push alerts & haptic goal vibrations when the phone is asleep.
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-gray-400 text-xs font-bold">
            <span className="hidden sm:inline">{isOpen ? 'Collapse' : 'Expand'}</span>
            {isOpen ? <ChevronUp className="w-4 h-4 text-stadiumGreen" /> : <ChevronDown className="w-4 h-4 text-gold" />}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setDismissed(true);
            }}
            className="p-1 text-gray-400 hover:text-white rounded-full bg-panel border border-white/10"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Hardware Feature Quick Toggles (Collapsible) */}
      {isOpen && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 animate-fadeIn">
          
          {/* 1. Background Push Notifications */}
          <button
            onClick={handleEnableNotifications}
            className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-1.5 ${
              notificationsEnabled
                ? 'bg-stadiumGreen/15 border-stadiumGreen text-white'
                : 'bg-panel/80 hover:bg-white/5 border-white/10 text-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <Bell className={`w-4 h-4 ${notificationsEnabled ? 'text-stadiumGreen fill-current' : 'text-gold'}`} />
              <span className={`text-[9px] font-black px-1.5 py-0.2 rounded ${
                notificationsEnabled ? 'bg-stadiumGreen text-black' : 'bg-white/10 text-gray-400'
              }`}>
                {notificationsEnabled ? 'ENABLED ✓' : 'ENABLE'}
              </span>
            </div>
            <div>
              <span className="font-black text-[11px] block">Lock-Screen Push</span>
              <span className="text-[9px] text-gray-400 font-sans">Alerts when phone asleep</span>
            </div>
          </button>

          {/* 2. Hardware Haptic Vibrations */}
          <button
            onClick={handleTestHaptic}
            className="p-3 rounded-2xl bg-panel/80 hover:bg-white/5 border border-white/10 text-left transition-all flex flex-col justify-between space-y-1.5 text-gray-300"
          >
            <div className="flex items-center justify-between">
              <Vibrate className="w-4 h-4 text-cyberPurple" />
              <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-cyberPurple/20 text-cyberPurple">
                TEST 📳
              </span>
            </div>
            <div>
              <span className="font-black text-[11px] block text-white">Stadium Haptics</span>
              <span className="text-[9px] text-gray-400 font-sans">Goal celebration motor</span>
            </div>
          </button>

          {/* 3. Screen Wake Lock (Keep Awake) */}
          <button
            onClick={handleToggleWakeLock}
            className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-1.5 ${
              wakeLockActive
                ? 'bg-gold/15 border-gold text-white'
                : 'bg-panel/80 hover:bg-white/5 border-white/10 text-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              {wakeLockActive ? <Eye className="w-4 h-4 text-gold" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
              <span className={`text-[9px] font-black px-1.5 py-0.2 rounded ${
                wakeLockActive ? 'bg-gold text-black' : 'bg-white/10 text-gray-400'
              }`}>
                {wakeLockActive ? 'AWAKE ☀️' : 'OFF'}
              </span>
            </div>
            <div>
              <span className="font-black text-[11px] block">Stadium WakeLock</span>
              <span className="text-[9px] text-gray-400 font-sans">Keeps screen alive in-play</span>
            </div>
          </button>

          {/* 4. Native PWA Install to Home Screen */}
          <button
            onClick={handleInstallApp}
            className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-1.5 ${
              isInstalled
                ? 'bg-stadiumGreen/20 border-stadiumGreen/50 text-white'
                : 'bg-stadiumGreen/20 hover:bg-stadiumGreen/30 border-stadiumGreen/40 text-stadiumGreen'
            }`}
          >
            <div className="flex items-center justify-between">
              <Download className="w-4 h-4 text-stadiumGreen" />
              <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-stadiumGreen text-black">
                {isInstalled ? 'INSTALLED ✓' : 'INSTALL 📲'}
              </span>
            </div>
            <div>
              <span className="font-black text-[11px] block text-white">Standalone App</span>
              <span className="text-[9px] text-gray-400 font-sans">1-tap homescreen launch</span>
            </div>
          </button>

        </div>
      )}

    </div>
  );
};
