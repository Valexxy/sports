'use client';

import React, { useState } from 'react';
import { TrendingUp, Award, Sparkles, Check, DollarSign } from 'lucide-react';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';
import confetti from 'canvas-confetti';

interface Wonderkid {
  name: string;
  club: string;
  country: string;
  auraPrice: number;
  changePercent: string;
  backedCount: number;
  rating: number;
}

const WONDERKIDS: Wonderkid[] = [
  { name: 'Lamine Yamal', club: 'Barcelona', country: '🇪🇸', auraPrice: 1250, changePercent: '+24.5%', backedCount: 8420, rating: 98 },
  { name: 'Kobbie Mainoo', club: 'Man United', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', auraPrice: 920, changePercent: '+18.2%', backedCount: 5210, rating: 94 },
  { name: 'Victor Osimhen', club: 'Galatasaray / Napoli', country: '🇳🇬', auraPrice: 1480, changePercent: '+31.0%', backedCount: 14200, rating: 99 },
  { name: 'Ethan Nwaneri', club: 'Arsenal', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿🇳🇬', auraPrice: 650, changePercent: '+45.0%', backedCount: 3890, rating: 91 },
  { name: 'Daniel Daga', club: 'Enyimba / Flying Eagles', country: '🇳🇬', auraPrice: 420, changePercent: '+60.0%', backedCount: 2940, rating: 89 },
];

export const WonderkidStockMarket: React.FC = () => {
  const [backed, setBacked] = useState<Record<string, boolean>>({});

  const handleBackPlayer = (name: string) => {
    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.playSuccessSound();
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
    setBacked((prev) => ({ ...prev, [name]: true }));
  };

  return (
    <section className="glass-panel-premium rounded-3xl border-2 border-gold/50 p-4 sm:p-6 space-y-4 font-mono text-xs text-white shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-gold via-amber-400 to-yellow-500 text-black font-black text-xl shadow-lg">
            📈
          </div>
          <div>
            <h2 className="font-black text-sm sm:text-base text-white">
              PLAYER AURA & WONDERKID STOCK EXCHANGE 💎
            </h2>
            <p className="text-[10px] text-gray-300 font-sans mt-0.5">
              Back emerging wonderkids early with Aura Points & unlock the permanent "Early Scout 🌟" badge.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {WONDERKIDS.map((player) => (
          <div
            key={player.name}
            className="p-3.5 rounded-2xl bg-black/60 border border-white/10 hover:border-gold/50 transition-all space-y-2 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-white">{player.name} {player.country}</span>
                <span className="px-2 py-0.5 rounded bg-stadiumGreen/20 text-stadiumGreen text-[9px] font-black">
                  {player.changePercent}
                </span>
              </div>
              <span className="text-[10px] text-gray-400 font-sans block">{player.club}</span>
              
              <div className="flex justify-between items-center text-[10px] pt-2 border-t border-white/5 text-gray-300">
                <span>Stock Price: <strong className="text-gold font-mono">{player.auraPrice} Aura</strong></span>
                <span>Backed: <strong className="text-cyan-400">{player.backedCount.toLocaleString()}</strong></span>
              </div>
            </div>

            <button
              onClick={() => handleBackPlayer(player.name)}
              className={`w-full py-2 rounded-xl font-black text-xs flex items-center justify-center space-x-1 transition-all ${
                backed[player.name]
                  ? 'bg-stadiumGreen text-black'
                  : 'bg-gradient-to-r from-gold to-amber-400 text-black hover:scale-105'
              }`}
            >
              {backed[player.name] ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Backed (Early Scout 🌟)</span>
                </>
              ) : (
                <>
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Back Wonderkid ➔</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
