'use client';
import React, { useState } from 'react';
import { Flame, Share, Camera } from 'lucide-react';

export const PlasmaStreakAvatar = ({ userProfile }: { userProfile?: any }) => {
  const [showFlex, setShowFlex] = useState(false);

  return (
    <div className="relative group">
      {/* Plasma Fire Animation */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyberPurple via-neonCyan to-stadiumGreen rounded-full opacity-70 group-hover:opacity-100 blur-sm animate-plasma-fire"></div>
      
      {/* Avatar Container */}
      <div className="relative w-14 h-14 bg-black rounded-full border-2 border-black flex items-center justify-center overflow-hidden cursor-pointer" onClick={() => setShowFlex(true)}>
        <span className="text-white font-black text-xl">
          {userProfile?.username?.charAt(0)?.toUpperCase() || 'W'}
        </span>
      </div>
      
      {/* Win Streak Badge */}
      <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-orange-500 to-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-black shadow-lg flex items-center gap-1">
        <Flame className="w-3 h-3" />
        <span>12 WINS</span>
      </div>

      {/* 1-Tap Flex Modal */}
      {showFlex && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4" onClick={() => setShowFlex(false)}>
          <div className="w-full max-w-sm bg-[#05070E] border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="absolute inset-0 bg-gradient-to-br from-cyberPurple/20 to-stadiumGreen/20 blur-3xl opacity-50"></div>
            
            <div className="relative z-10 text-center space-y-6">
              <div className="w-24 h-24 mx-auto relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-cyberPurple via-neonCyan to-stadiumGreen rounded-full opacity-100 blur-md animate-plasma-fire"></div>
                <div className="relative w-full h-full bg-black rounded-full flex items-center justify-center text-4xl font-black text-white">
                  {userProfile?.username?.charAt(0)?.toUpperCase() || 'W'}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-wider">Aura Level 99</h3>
                <p className="text-stadiumGreen font-mono mt-1">12-Game Winning Streak</p>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-left">
                <p className="text-xs text-gray-400 mb-1 uppercase font-bold">Latest Snipe</p>
                <p className="text-lg text-white font-black">ARSENAL vs CHELSEA</p>
                <p className="text-gold font-mono text-sm mt-1">Over 2.5 Goals @ 1.85 ✅</p>
              </div>

              <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyberPurple to-neonCyan text-white font-black text-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(191,90,242,0.4)]">
                <Camera className="w-5 h-5" /> GENERATE TIKTOK FLEX
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
