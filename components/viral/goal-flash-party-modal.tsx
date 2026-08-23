'use client';
import React, { useEffect, useState } from 'react';
import { X, Sparkles, Volume2 } from 'lucide-react';
import { stadiumAudio } from '../../lib/sound-synthesizer';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import confetti from 'canvas-confetti';

export const GoalFlashPartyModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [colorIndex, setColorIndex] = useState(0);
  const colors = ['bg-stadiumGreen', 'bg-crimson', 'bg-gold', 'bg-cyan-500', 'bg-purple-600'];

  useEffect(() => {
    stadiumAudio.playGoalCelebration();
    phoneHardware.triggerHaptic('SUCCESS');
    confetti({ particleCount: 100, spread: 100 });
    const interval = setInterval(() => {
      setColorIndex(i => (i + 1) % colors.length);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`fixed inset-0 z-[130] flex flex-col items-center justify-center p-6 text-black font-mono text-center transition-colors duration-200 ${colors[colorIndex]}`}>
      <button onClick={onClose} className="absolute top-6 right-6 p-3 rounded-full bg-black text-white font-black text-sm">✕ Close</button>
      <div className="space-y-4">
        <span className="text-7xl block animate-bounce">⚽🎉</span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-wider text-black">GOOOAAALLL!</h1>
        <p className="text-sm font-bold bg-black text-white px-4 py-2 rounded-full inline-block">Stadium Rave & Haptic Light Stick Active!</p>
      </div>
    </div>
  );
};
