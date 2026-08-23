'use client';
import React, { useState } from 'react';
import { X, Volume2, Play, Pause, Flame } from 'lucide-react';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { speakNaija } from '../../lib/naija-voice-engine';

export const ManagerMeltdownModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const rant = `Una dey mad?! Which kind yeye defending be this? Striker miss open net three times! If board sack me tomorrow, I go carry all of una follow body!`;

  const handlePlay = () => {
    phoneHardware.triggerHaptic('SUCCESS');
    setIsPlaying(true);
    speakNaija(rant, 'hyped');
    setTimeout(() => setIsPlaying(false), 7000);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn font-mono text-xs text-white">
      <div className="relative w-full max-w-md glass-panel-premium rounded-3xl border-2 border-crimson/70 p-6 space-y-4 shadow-2xl text-center">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20"><X className="w-4 h-4" /></button>
        <div className="flex items-center justify-center space-x-2">
          <Flame className="w-5 h-5 text-crimson animate-pulse" />
          <h3 className="font-black text-sm text-crimson uppercase">Locker Room Meltdown Audio</h3>
        </div>
        <p className="text-xs text-gray-300 italic font-sans">"{rant}"</p>
        <button onClick={handlePlay} className="w-full py-3 rounded-2xl bg-crimson text-white font-black flex items-center justify-center space-x-2">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{isPlaying ? 'Screaming in Locker Room...' : '▶️ Play Manager Dressing Room Meltdown'}</span>
        </button>
      </div>
    </div>
  );
};
