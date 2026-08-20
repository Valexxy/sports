'use client';

import React from 'react';
import { useOfflineStatus } from '../lib/offline-manager';
import { WifiOff, Zap } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const isOffline = useOfflineStatus();

  if (!isOffline) return null;

  return (
    <div className="bg-gold text-black font-mono text-xs py-1.5 px-4 text-center font-extrabold flex items-center justify-center space-x-2 shadow-lg animate-pulse">
      <WifiOff className="w-4 h-4" />
      <span>⚡ OFFLINE MODE ACTIVE — All Match Slips & Predictions Saved Locally to Device!</span>
    </div>
  );
};
