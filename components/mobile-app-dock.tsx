'use client';

import React from 'react';
import { Home, Zap, ShoppingBag, ShieldCheck, User, Radio, Flame, Sparkles } from 'lucide-react';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';

interface AppDockProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  betSlipCount: number;
  onOpenProfile: () => void;
  onOpenLedger: () => void;
  onOpenSuitesMenu?: () => void;
}

export const MobileAppDock: React.FC<AppDockProps> = ({
  activeTab,
  onSelectTab,
  betSlipCount,
  onOpenProfile,
  onOpenLedger,
  onOpenSuitesMenu,
}) => {
  const handleTabClick = (tab: string, action?: () => void) => {
    phoneHardware.triggerHaptic('SELECTION');
    stadiumAudio.playCrowdRoar();
    if (action) {
      action();
    } else {
      onSelectTab(tab);
    }
  };

  return (
    <div className="fixed bottom-3 left-3 right-3 z-50 lg:hidden">
      <nav className="glass-panel-premium rounded-3xl border-2 border-stadiumGreen/40 px-2 py-2 shadow-2xl backdrop-blur-2xl bg-black/90 glow-emerald">
        <div className="flex items-center justify-around">
          
          {/* Matches Tab */}
          <button
            onClick={() => handleTabClick('MATCHES')}
            className={`relative flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all duration-300 ${
              activeTab === 'MATCHES'
                ? 'bg-stadiumGreen text-black font-black shadow-lg shadow-stadiumGreen/30 scale-105'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-[10px] font-mono font-bold mt-0.5">Matches</span>
          </button>

          {/* Ultra Bankers / Settlement Tab */}
          <button
            onClick={() => handleTabClick('LEDGER', onOpenLedger)}
            className="relative flex flex-col items-center py-1.5 px-3 rounded-2xl text-gold hover:text-white transition-all group"
          >
            <div className="relative">
              <Zap className="w-4 h-4 text-gold group-hover:scale-110 transition-all animate-pulse" />
              <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-gold animate-ping"></span>
            </div>
            <span className="text-[10px] font-mono font-bold mt-0.5">Bankers</span>
          </button>

          {/* Floating Center Slip Button */}
          <button
            onClick={() => handleTabClick('SLIP')}
            className="relative -top-3 flex flex-col items-center p-2.5 rounded-2xl bg-gradient-to-tr from-stadiumGreen via-emerald-400 to-gold text-black font-black shadow-2xl shadow-stadiumGreen/40 border-2 border-black active:scale-95 transition-all"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {betSlipCount > 0 && (
                <span className="absolute -top-2 -right-2.5 bg-black text-stadiumGreen font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-stadiumGreen animate-bounce">
                  {betSlipCount}
                </span>
              )}
            </div>
            <span className="text-[9px] font-mono font-black mt-0.5 tracking-tighter">SLIP</span>
          </button>

          {/* Suites & Tools Menu */}
          <button
            onClick={() => handleTabClick('SUITES', onOpenSuitesMenu)}
            className="relative flex flex-col items-center py-1.5 px-3 rounded-2xl text-stadiumGreen hover:text-white transition-all"
          >
            <Sparkles className="w-4 h-4 text-gold animate-pulse" />
            <span className="text-[10px] font-mono font-bold mt-0.5">Suites</span>
          </button>

          {/* User Profile */}
          <button
            onClick={() => handleTabClick('PROFILE', onOpenProfile)}
            className="relative flex flex-col items-center py-1.5 px-3 rounded-2xl text-gray-300 hover:text-gold transition-all"
          >
            <User className="w-4 h-4" />
            <span className="text-[10px] font-mono font-bold mt-0.5">Profile</span>
          </button>

        </div>
      </nav>
    </div>
  );
};
