'use client';

import React from 'react';
import { Home, Trophy, Gift, MessageSquare, User, Sparkles } from 'lucide-react';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';

interface AppDockProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenProfile: () => void;
  onOpenLeaderboard?: () => void;
  onOpenHarvest?: () => void;
  onOpenAdminChat?: () => void;
}

export const MobileAppDock: React.FC<AppDockProps> = ({
  activeTab,
  onSelectTab,
  onOpenProfile,
  onOpenLeaderboard,
  onOpenHarvest,
  onOpenAdminChat,
}) => {
  const handleTabClick = (tab: string, action?: () => void) => {
    phoneHardware.triggerHaptic('SELECTION');
    stadiumAudio.playAddPickSound();
    if (action) {
      action();
    } else {
      onSelectTab(tab);
    }
  };

  return (
    <div className="fixed bottom-2 left-2 right-2 z-50 lg:hidden">
      <nav className="glass-panel-premium rounded-2xl border border-stadiumGreen/40 px-2 py-1.5 shadow-2xl backdrop-blur-2xl bg-black/95 glow-emerald">
        <div className="flex items-center justify-between gap-1">
          
          {/* Matches Tab */}
          <button
            onClick={() => handleTabClick('MATCHES')}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
              activeTab === 'MATCHES'
                ? 'bg-stadiumGreen text-black font-black shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4 flex-shrink-0" />
            <span className="text-[9px] font-mono font-bold mt-0.5">Matches</span>
          </button>

          {/* Leaderboard Tab */}
          <button
            onClick={() => handleTabClick('LEADERBOARD', onOpenLeaderboard)}
            className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-gray-400 hover:text-gold transition-all"
          >
            <Trophy className="w-4 h-4 text-gold flex-shrink-0" />
            <span className="text-[9px] font-mono font-bold mt-0.5">Tipsters</span>
          </button>

          {/* Daily Harvest Tab */}
          <button
            onClick={() => handleTabClick('HARVEST', onOpenHarvest)}
            className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-gray-400 hover:text-gold transition-all"
          >
            <Gift className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="text-[9px] font-mono font-bold mt-0.5">Harvest</span>
          </button>

          {/* Global Sports News Tab */}
          <button
            onClick={() => handleTabClick('NEWS', () => {
              const el = document.getElementById('news-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            })}
            className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-gray-400 hover:text-stadiumGreen transition-all"
          >
            <MessageSquare className="w-4 h-4 text-stadiumGreen flex-shrink-0" />
            <span className="text-[9px] font-mono font-bold mt-0.5">News Wire</span>
          </button>

          {/* Profile Tab */}
          <button
            onClick={() => handleTabClick('PROFILE', onOpenProfile)}
            className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-gray-300 hover:text-gold transition-all"
          >
            <User className="w-4 h-4 flex-shrink-0" />
            <span className="text-[9px] font-mono font-bold mt-0.5">Profile</span>
          </button>

        </div>
      </nav>
    </div>
  );
};
