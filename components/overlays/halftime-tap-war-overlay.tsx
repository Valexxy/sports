'use client';

import React, { useState, useEffect } from 'react';
import { X, Flame, Zap, Trophy } from 'lucide-react';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { stadiumAudio } from '../../lib/sound-synthesizer';

interface HalftimeTapWarProps {
  isOpen: boolean;
  onClose: () => void;
  homeTeam: string;
  awayTeam: string;
}

export const HalftimeTapWarOverlay: React.FC<HalftimeTapWarProps> = ({
  isOpen,
  onClose,
  homeTeam,
  awayTeam,
}) => {
  const [homeTaps, setHomeTaps] = useState<number>(420);
  const [awayTaps, setAwayTaps] = useState<number>(380);
  const [timeLeft, setTimeLeft] = useState<number>(900); // 15 mins

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
      if (Math.random() > 0.4) {
        setHomeTaps((h) => h + Math.floor(Math.random() * 3));
        setAwayTaps((a) => a + Math.floor(Math.random() * 3));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const totalTaps = homeTaps + awayTaps;
  const homePct = Math.round((homeTaps / totalTaps) * 100);
  const awayPct = 100 - homePct;

  const handleTap = (side: 'HOME' | 'AWAY') => {
    phoneHardware.triggerHaptic('SELECTION');
    stadiumAudio.playAddPickSound();
    if (side === 'HOME') setHomeTaps((h) => h + 1);
    else setAwayTaps((a) => a + 1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn font-mono text-white">
      <div className="glass-panel-premium max-w-lg w-full p-6 rounded-3xl border-2 border-crimson shadow-2xl space-y-4 relative text-center">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/10"><X className="w-4 h-4" /></button>
        
        <div className="flex items-center justify-center space-x-2">
          <Flame className="w-5 h-5 text-crimson animate-bounce" />
          <h3 className="text-base font-black text-white">HALFTIME 15-MIN REAL-TIME TAP-WAR</h3>
        </div>

        <div className="text-xs text-gray-400">
          Time Remaining: <span className="text-gold font-bold">{Math.floor(timeLeft / 60)}m {timeLeft % 60}s</span>
        </div>

        {/* Tug-of-War Tug Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-black">
            <span className="text-stadiumGreen">{homeTeam} ({homePct}%)</span>
            <span className="text-cyan-400">{awayTeam} ({awayPct}%)</span>
          </div>
          <div className="w-full h-4 rounded-full bg-white/10 overflow-hidden flex">
            <div style={{ width: homePct + '%' }} className="bg-stadiumGreen transition-all duration-200" />
            <div style={{ width: awayPct + '%' }} className="bg-cyan-400 transition-all duration-200" />
          </div>
        </div>

        {/* Tap Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => handleTap('HOME')}
            className="py-6 rounded-2xl bg-stadiumGreen/20 hover:bg-stadiumGreen/30 border-2 border-stadiumGreen text-stadiumGreen font-black text-sm shadow active:scale-95 transition-all flex flex-col items-center justify-center space-y-1"
          >
            <span className="text-2xl">🔥</span>
            <span>TAP FOR {homeTeam}</span>
            <span className="text-[10px] text-gray-300 font-mono">{homeTaps.toLocaleString()} Taps</span>
          </button>

          <button
            onClick={() => handleTap('AWAY')}
            className="py-6 rounded-2xl bg-cyan-400/20 hover:bg-cyan-400/30 border-2 border-cyan-400 text-cyan-300 font-black text-sm shadow active:scale-95 transition-all flex flex-col items-center justify-center space-y-1"
          >
            <span className="text-2xl">⚡</span>
            <span>TAP FOR {awayTeam}</span>
            <span className="text-[10px] text-gray-300 font-mono">{awayTaps.toLocaleString()} Taps</span>
          </button>
        </div>

      </div>
    </div>
  );
};
