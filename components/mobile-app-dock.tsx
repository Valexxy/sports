'use client';

import React from 'react';
import { Home, Zap, ShoppingBag, MessageSquare, User } from 'lucide-react';

interface AppDockProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  betSlipCount: number;
  onOpenProfile: () => void;
  onOpenLedger: () => void;
}

export const MobileAppDock: React.FC<AppDockProps> = ({
  activeTab,
  onSelectTab,
  betSlipCount,
  onOpenProfile,
  onOpenLedger,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden glass-panel border-t border-white/10 px-3 py-2">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* Matches Tab */}
        <button
          onClick={() => onSelectTab('MATCHES')}
          className={`flex flex-col items-center space-y-1 transition-all ${
            activeTab === 'MATCHES' ? 'text-stadiumGreen font-bold scale-105' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-mono">Matches</span>
        </button>

        {/* Ultra Bankers */}
        <button
          onClick={onOpenLedger}
          className="flex flex-col items-center space-y-1 text-gold hover:text-white transition-all"
        >
          <Zap className="w-5 h-5" />
          <span className="text-[10px] font-mono">Bankers</span>
        </button>

        {/* Bet Slip */}
        <button
          onClick={() => onSelectTab('SLIP')}
          className="relative flex flex-col items-center space-y-1 text-stadiumGreen hover:text-white transition-all"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {betSlipCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-stadiumGreen text-black font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-black">
                {betSlipCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono">My Slip</span>
        </button>

        {/* Global Fan Chat */}
        <button
          onClick={() => onSelectTab('CHAT')}
          className="flex flex-col items-center space-y-1 text-cyberPurple hover:text-white transition-all"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] font-mono">Fan Chat</span>
        </button>

        {/* Profile */}
        <button
          onClick={onOpenProfile}
          className="flex flex-col items-center space-y-1 text-gray-300 hover:text-gold transition-all"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-mono">Profile</span>
        </button>

      </div>
    </div>
  );
};
