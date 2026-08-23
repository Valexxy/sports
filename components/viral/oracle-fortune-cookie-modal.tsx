'use client';
import React, { useState } from 'react';
import { X, Sparkles, Cookie } from 'lucide-react';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import confetti from 'canvas-confetti';

export const OracleFortuneCookieModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [prophecy, setProphecy] = useState<string | null>(null);

  const fortunes = [
    'A defender wearing number 4 go collect yellow card in first 20 mins, and late substitute go score winning goal in 88th minute!',
    'The home goalkeeper go make 6 crazy saves today, and referee go add 5 minutes extra time!',
    'First half go end 0-0, but second half go explode with 3 correct goals!',
  ];

  const handleCrack = () => {
    phoneHardware.triggerHaptic('SUCCESS');
    const random = fortunes[Math.floor(Math.random() * fortunes.length)];
    setProphecy(random);
    confetti({ particleCount: 30, spread: 60 });
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn font-mono text-xs text-white text-center">
      <div className="relative w-full max-w-md glass-panel-premium rounded-3xl border-2 border-gold/70 p-6 space-y-4 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20"><X className="w-4 h-4" /></button>
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="w-5 h-5 text-gold animate-spin" />
          <h3 className="font-black text-sm text-gold uppercase">African Stadium Fortune Cookie</h3>
        </div>
        <span className="text-4xl block py-2">🥠</span>
        {prophecy ? (
          <div className="p-4 rounded-2xl bg-gold/20 border border-gold text-gold font-bold text-xs italic">
            "{prophecy}"
          </div>
        ) : (
          <p className="text-xs text-gray-300">Crack open the mystical cookie for a hyper-specific match prediction!</p>
        )}
        <button onClick={handleCrack} className="w-full py-3 rounded-2xl bg-gold text-black font-black shadow hover:bg-amber-400">
          Crack Open Fortune Cookie 🥠
        </button>
      </div>
    </div>
  );
};
