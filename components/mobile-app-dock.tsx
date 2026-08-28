'use client';

import React from 'react';
import { Home, Trophy, Gift, Newspaper, User, Sparkles, Zap, Layers } from 'lucide-react';
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
    <div className="fixed bottom-3 left-3 right-3 z-50 lg:hidden pointer-events-auto">
      <nav className="relative rounded-[26px] bg-[#141416]/85 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.7)] px-2 py-1.5 glow-emerald/20">
        {/* Subtle iOS Glass Highlight */}
        <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        <div className="flex items-center justify-around gap-1">
          {/* Matches Tab */}
          <button
            onClick={() => handleTabClick('MATCHES')}
            className={`relative flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-200 active:scale-95 ${
              activeTab === 'MATCHES'
                ? 'bg-stadiumGreen text-black font-extrabold shadow-lg shadow-stadiumGreen/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Zap className={`w-4 h-4 ${activeTab === 'MATCHES' ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
            <span className="text-[10px] font-sans font-bold tracking-tight mt-0.5">Fixtures</span>
            {activeTab === 'MATCHES' && (
              <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            )}
          </button>

          {/* Converter Tab */}
          <button
            onClick={() => {
              phoneHardware.triggerHaptic('SELECTION');
              window.location.href = '/converter';
            }}
            className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl text-gray-400 hover:text-stadiumGreen transition-all duration-200 active:scale-95"
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] font-sans font-medium tracking-tight mt-0.5 text-gray-300">Converter</span>
          </button>

          {/* Tipsters / Leaderboard Tab */}
          <button
            onClick={() => handleTabClick('LEADERBOARD', onOpenLeaderboard)}
            className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl text-gray-400 hover:text-gold transition-all duration-200 active:scale-95"
          >
            <Trophy className="w-4 h-4 text-gold" />
            <span className="text-[10px] font-sans font-medium tracking-tight mt-0.5 text-gray-300">Tipsters</span>
          </button>

          {/* Daily Harvest Tab */}
          <button
            onClick={() => handleTabClick('HARVEST', onOpenHarvest)}
            className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl text-gray-400 hover:text-amber-400 transition-all duration-200 active:scale-95"
          >
            <Gift className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-sans font-medium tracking-tight mt-0.5 text-gray-300">Rewards</span>
          </button>

          {/* News Wire Tab */}
          <button
            onClick={() => handleTabClick('NEWS', () => {
              const el = document.getElementById('news-section');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.location.href = '/#news-section';
              }
            })}
            className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl text-gray-400 hover:text-stadiumGreen transition-all duration-200 active:scale-95"
          >
            <Newspaper className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-sans font-medium tracking-tight mt-0.5 text-gray-300">News</span>
          </button>

          {/* Profile Tab */}
          <button
            onClick={() => handleTabClick('PROFILE', onOpenProfile)}
            className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl text-gray-400 hover:text-white transition-all duration-200 active:scale-95"
          >
            <User className="w-4 h-4 text-purple-400" />
            <span className="text-[10px] font-sans font-medium tracking-tight mt-0.5 text-gray-300">Account</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
