'use client';

import React, { useState, useEffect } from 'react';
import { MatchData } from '../lib/sports-api';
import { Flame, Skull, Smile, Rocket, Zap, Users, TrendingUp } from 'lucide-react';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';

interface AuraMeterProps {
  match?: MatchData;
}

export const LiveAuraMomentumMeter: React.FC<AuraMeterProps> = ({ match }) => {
  const homeTeam = match?.homeTeam || 'Arsenal';
  const awayTeam = match?.awayTeam || 'Chelsea';

  const [homeAura, setHomeAura] = useState<number>(55);
  const [totalSpamTaps, setTotalSpamTaps] = useState<number>(1420);
  const [surgeActive, setSurgeActive] = useState<boolean>(false);
  const [floatingEmojis, setFloatingEmojis] = useState<Array<{ id: number; emoji: string; left: number }>>([]);

  const handleReact = (type: 'FIRE' | 'SKULL' | 'CLOWN' | 'ROCKET', side: 'HOME' | 'AWAY') => {
    phoneHardware.triggerHaptic('SELECTION');
    stadiumAudio.playAddPickSound();

    setTotalSpamTaps((prev) => prev + 1);

    // Physics momentum shift
    setHomeAura((prev) => {
      const delta = side === 'HOME' ? (type === 'FIRE' || type === 'ROCKET' ? 2 : 1) : -(type === 'FIRE' || type === 'ROCKET' ? 2 : 1);
      return Math.max(10, Math.min(90, prev + delta));
    });

    // Floating reaction animation
    const emoji = type === 'FIRE' ? '🔥' : type === 'SKULL' ? '💀' : type === 'CLOWN' ? '🤡' : '🚀';
    const newFloating = { id: Date.now() + Math.random(), emoji, left: Math.random() * 80 + 10 };
    setFloatingEmojis((prev) => [...prev.slice(-10), newFloating]);

    // Check surge threshold
    if (totalSpamTaps % 15 === 0) {
      setSurgeActive(true);
      stadiumAudio.playCrowdRoar();
      setTimeout(() => setSurgeActive(false), 2500);
    }
  };

  const awayAura = 100 - homeAura;

  return (
    <section className="p-4 sm:p-5 rounded-3xl bg-black/80 border-2 border-white/15 space-y-3.5 font-mono text-xs text-white relative overflow-hidden shadow-2xl">
      
      {/* Floating Emojis Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingEmojis.map((item) => (
          <span
            key={item.id}
            style={{ left: `${item.left}%` }}
            className="absolute bottom-4 text-2xl animate-floatUp opacity-80"
          >
            {item.emoji}
          </span>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-crimson animate-ping" />
          <h3 className="font-black text-xs sm:text-sm text-white flex items-center space-x-1.5">
            <span>LIVE MOMENTUM AURA METER ⚡</span>
            {surgeActive && (
              <span className="px-2 py-0.5 rounded-full bg-gold text-black font-black text-[9px] animate-bounce">
                AURA SURGE! 🔥
              </span>
            )}
          </h3>
        </div>
        <span className="text-[10px] text-gray-400 font-bold flex items-center space-x-1">
          <Users className="w-3 h-3 text-stadiumGreen" />
          <span>{totalSpamTaps.toLocaleString()} Live Taps</span>
        </span>
      </div>

      {/* Dynamic Tug-of-War Momentum Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-black">
          <span className="text-stadiumGreen truncate max-w-[140px]">{homeTeam} ({homeAura}%)</span>
          <span className="text-cyan-400 truncate max-w-[140px] text-right">{awayTeam} ({awayAura}%)</span>
        </div>

        <div className="h-4 rounded-full bg-white/10 p-0.5 flex overflow-hidden border border-white/20">
          <div
            style={{ width: `${homeAura}%` }}
            className="h-full bg-gradient-to-r from-stadiumGreen to-emerald-400 rounded-l-full transition-all duration-300 shadow-md shadow-stadiumGreen/50"
          />
          <div
            style={{ width: `${awayAura}%` }}
            className="h-full bg-gradient-to-l from-cyan-400 to-blue-500 rounded-r-full transition-all duration-300 shadow-md shadow-cyan-400/50"
          />
        </div>
      </div>

      {/* Spam Reaction Tap Triggers */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        {/* Home Reactions */}
        <div className="p-2.5 rounded-2xl bg-stadiumGreen/10 border border-stadiumGreen/30 flex items-center justify-between">
          <span className="text-[10px] font-black text-stadiumGreen truncate max-w-[70px]">{homeTeam}</span>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => handleReact('FIRE', 'HOME')}
              className="p-1.5 rounded-xl bg-stadiumGreen text-black hover:scale-110 active:scale-95 transition-all text-xs font-black shadow"
              title="Pure Aura"
            >
              🔥
            </button>
            <button
              onClick={() => handleReact('ROCKET', 'HOME')}
              className="p-1.5 rounded-xl bg-emerald-500 text-black hover:scale-110 active:scale-95 transition-all text-xs font-black shadow"
              title="Screamer"
            >
              🚀
            </button>
          </div>
        </div>

        {/* Away Reactions */}
        <div className="p-2.5 rounded-2xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-between">
          <span className="text-[10px] font-black text-cyan-400 truncate max-w-[70px]">{awayTeam}</span>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => handleReact('FIRE', 'AWAY')}
              className="p-1.5 rounded-xl bg-cyan-400 text-black hover:scale-110 active:scale-95 transition-all text-xs font-black shadow"
              title="Pure Aura"
            >
              🔥
            </button>
            <button
              onClick={() => handleReact('SKULL', 'AWAY')}
              className="p-1.5 rounded-xl bg-crimson text-white hover:scale-110 active:scale-95 transition-all text-xs font-black shadow"
              title="Zero Aura"
            >
              💀
            </button>
          </div>
        </div>
      </div>

    </section>
  );
};
