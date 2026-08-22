'use client';

import React from 'react';
import { Home, Star, User } from 'lucide-react';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';

interface AppDockProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  betSlipCount?: number;
  onOpenProfile: () => void;
  onOpenLedger?: () => void;
  onOpenSuitesMenu?: () => void;
}

export const MobileAppDock: React.FC<AppDockProps> = ({
  activeTab,
  onSelectTab,
  onOpenProfile,
}) => {
  const handleTabClick = (tab: string, action?: () => void) => {
    phoneHardware.triggerHaptic('SELECTION');
    stadiumAudio.playTabClickSound();
    if (action) {
      action();
    } else {
      onSelectTab(tab);
    }
  };

  return (
    <div className="fixed bottom-3 left-4 right-4 z-50 lg:hidden">
      <nav className="glass-panel-premium rounded-3xl border-2 border-stadiumGreen/40 px-3 py-2 shadow-2xl backdrop-blur-2xl bg-black/95 glow-emerald">
        <div className="flex items-center justify-around">
          
          {/* Matches Tab */}
          <button
            onClick={() => handleTabClick('MATCHES')}
            className={`flex items-center space-x-1.5 py-2 px-4 rounded-2xl transition-all duration-300 ${
              activeTab === 'MATCHES'
                ? 'bg-stadiumGreen text-black font-black shadow-lg shadow-stadiumGreen/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-xs font-mono font-black">Matches</span>
          </button>

          {/* Following Hub Tab (Single Unified Following & Pinned Matches) */}
          <button
            onClick={() => handleTabClick('FOLLOWING')}
            className={`flex items-center space-x-1.5 py-2 px-4 rounded-2xl transition-all duration-300 ${
              activeTab === 'FOLLOWING'
                ? 'bg-gold text-black font-black shadow-lg shadow-gold/30'
                : 'bg-gold/15 text-gold border border-gold/40 font-black text-xs hover:text-white'
            }`}
          >
            <Star className="w-4 h-4 text-gold fill-current" />
            <span className="text-xs font-mono font-black">Following ⭐</span>
          </button>

          {/* Profile */}
          <button
            onClick={() => handleTabClick('PROFILE', onOpenProfile)}
            className="flex items-center space-x-1.5 py-2 px-4 rounded-2xl text-gray-300 hover:text-gold transition-all"
          >
            <User className="w-4 h-4" />
            <span className="text-xs font-mono font-bold">Profile</span>
          </button>

        </div>
      </nav>
    </div>
  );
};
