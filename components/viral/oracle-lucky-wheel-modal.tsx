'use client';
import React, { useState } from 'react';
import { X, Sparkles, Trophy, RotateCw } from 'lucide-react';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import confetti from 'canvas-confetti';

export const OracleLuckyWheelModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [spinning, setSpinning] = useState(false);
  const [reward, setReward] = useState<string | null>(null);

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    phoneHardware.triggerHaptic('SELECTION');
    setTimeout(() => {
      setSpinning(false);
      setReward('👑 VIP 3-Odds Ultra Banker Slip Unlocked!');
      confetti({ particleCount: 50, spread: 70 });
      phoneHardware.triggerHaptic('SUCCESS');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn font-mono text-xs text-white">
      <div className="relative w-full max-w-md glass-panel-premium rounded-3xl border-2 border-gold/70 p-6 space-y-4 shadow-2xl text-center">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20"><X className="w-4 h-4" /></button>
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="w-5 h-5 text-gold animate-spin" />
          <h3 className="font-black text-sm text-gold uppercase">Daily Oracle Banker Wheel</h3>
        </div>
        <div className="py-6 flex justify-center">
          <div className={`w-36 h-36 rounded-full border-4 border-gold bg-gradient-to-tr from-stadiumGreen via-panel to-gold flex items-center justify-center text-4xl shadow-2xl ${spinning ? 'animate-spin' : ''}`}>
            🎰
          </div>
        </div>
        {reward && (
          <div className="p-3 rounded-xl bg-stadiumGreen/20 border border-stadiumGreen text-stadiumGreen font-black">
            {reward}
          </div>
        )}
        <button onClick={handleSpin} disabled={spinning} className="w-full py-3 rounded-2xl bg-gold text-black font-black flex items-center justify-center space-x-2 shadow-lg hover:bg-amber-400 disabled:opacity-50">
          <RotateCw className={`w-4 h-4 ${spinning ? 'animate-spin' : ''}`} />
          <span>{spinning ? 'Spinning...' : '🎰 Spin Free Daily Wheel'}</span>
        </button>
      </div>
    </div>
  );
};
