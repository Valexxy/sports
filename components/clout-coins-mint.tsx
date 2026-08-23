'use client';
import React, { useState } from 'react';
import { Coins, Flame, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CloutCoinsMint: React.FC = () => {
  const [balance, setBalance] = useState(1000);
  const [mintedToday, setMintedToday] = useState(false);
  const [streakDays, setStreakDays] = useState(7);

  const handleMintDailyBankroll = () => {
    if (mintedToday) return;

    setBalance((prev) => prev + 1000);
    setMintedToday(true);
    setStreakDays((prev) => prev + 1);

    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 },
    });

    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }
  };

  return (
    <div className="p-4 rounded-3xl glass-panel-premium border border-gold/40 space-y-3 font-mono text-xs shadow-xl">
      
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-gold/20 text-gold border border-gold/40">
            <Coins className="w-4 h-4 text-gold" />
          </div>
          <span className="font-extrabold text-white text-xs">DAILY CLOUT COINS MINT 🪙</span>
        </div>

        <span className="px-2 py-0.5 rounded bg-gold/20 text-gold font-bold text-[9px] border border-gold/30">
          STREAK: {streakDays} DAYS 🔥
        </span>
      </div>

      <div className="flex items-center justify-between p-3 rounded-2xl bg-black/60 border border-white/5">
        <div>
          <span className="text-gray-400 block text-[10px]">CURRENT CLOUT COINS BALANCE:</span>
          <span className="text-2xl font-black text-gold">{balance.toLocaleString()} $CLAWS</span>
        </div>

        <button
          onClick={handleMintDailyBankroll}
          disabled={mintedToday}
          className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs shadow-md transition-all flex items-center space-x-1.5 ${
            mintedToday
              ? 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed'
              : 'bg-gold text-black hover:scale-105 glow-gold'
          }`}
        >
          {mintedToday ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-stadiumGreen" />
              <span>Minted Today ✅</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Mint 1,000 Coins 🪙</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
