'use client';

import React from 'react';
import { Zap, Layers, ScrollText, Newspaper, User } from 'lucide-react';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';

interface AppDockProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenProfile?: () => void;
}

export const MobileAppDock: React.FC<AppDockProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const handleNavigation = (path: string, tabName: string) => {
    try { phoneHardware.triggerHaptic('SELECTION'); } catch {}
    try { stadiumAudio.playAddPickSound(); } catch {}
    if (typeof window !== 'undefined') {
      if (window.location.pathname === path) {
        onSelectTab(tabName);
      } else {
        window.location.href = path;
      }
    }
  };

  return (
    <div className="fixed bottom-3 left-3 right-3 z-50 lg:hidden pointer-events-auto">
      <nav className="relative rounded-[26px] bg-[#141416]/90 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.75)] px-2 py-1.5 glow-emerald/20">
        {/* Subtle iOS Glass Highlight */}
        <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        <div className="flex items-center justify-around gap-1">
          {/* 1. Fixtures Tab */}
          <button
            onClick={() => handleNavigation('/', 'MATCHES')}
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

          {/* 2. Converter Tab */}
          <button
            onClick={() => handleNavigation('/converter', 'CONVERTER')}
            className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl text-gray-400 hover:text-cyan-400 transition-all duration-200 active:scale-95"
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] font-sans font-medium tracking-tight mt-0.5 text-gray-300">Revealer</span>
          </button>

          {/* 3. Settlement Ledger Tab */}
          <button
            onClick={() => handleNavigation('/settlement', 'LEDGER')}
            className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl text-gray-400 hover:text-gold transition-all duration-200 active:scale-95"
          >
            <ScrollText className="w-4 h-4 text-gold" />
            <span className="text-[10px] font-sans font-medium tracking-tight mt-0.5 text-gray-300">Ledger</span>
          </button>

          {/* 4. Enterprise News Tab */}
          <button
            onClick={() => handleNavigation('/news', 'NEWS')}
            className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl text-gray-400 hover:text-emerald-400 transition-all duration-200 active:scale-95"
          >
            <Newspaper className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-sans font-medium tracking-tight mt-0.5 text-gray-300">News</span>
          </button>

          {/* 5. Account Dashboard Tab */}
          <button
            onClick={() => handleNavigation('/dashboard', 'ACCOUNT')}
            className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl text-gray-400 hover:text-purple-400 transition-all duration-200 active:scale-95"
          >
            <User className="w-4 h-4 text-purple-400" />
            <span className="text-[10px] font-sans font-medium tracking-tight mt-0.5 text-gray-300">Account</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
