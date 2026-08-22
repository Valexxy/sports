'use client';

import React from 'react';
import { useOfflineStatus } from '../lib/offline-manager';
import { WifiOff, Zap, Bell, Sparkles } from 'lucide-react';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';

export const OfflineBanner: React.FC = () => {
  const isOffline = useOfflineStatus();

  if (!isOffline) return null;

  const handleTestOfflineHaptic = () => {
    phoneHardware.triggerHaptic('OFFLINE_ALERT');
    stadiumAudio.playCrowdRoar();
  };

  return (
    <div className="bg-gradient-to-r from-gold via-amber-400 to-gold text-black font-mono text-xs py-2 px-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-black/20">
      <div className="flex items-center space-x-2 font-black">
        <WifiOff className="w-4 h-4 animate-bounce" />
        <span>📶 OFFLINE STADIUM ENGINE ACTIVE — Zero Data Mode Running (Predictions Cached Locally)</span>
      </div>
      <button
        onClick={handleTestOfflineHaptic}
        className="px-3 py-1 rounded-xl bg-black text-gold hover:bg-neutral-900 text-[10px] font-black flex items-center space-x-1.5 transition-all shadow active:scale-95"
      >
        <Sparkles className="w-3 h-3 text-gold" />
        <span>Inbuilt Hardware Alert Active 📳</span>
      </button>
    </div>
  );
};

