'use client';
import React, { useState } from 'react';
import { X, ShieldCheck, Share2, Sparkles } from 'lucide-react';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { speakNaija } from '../../lib/naija-voice-engine';
import confetti from 'canvas-confetti';

export const AntiJinxShieldModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activated, setActivated] = useState(false);

  const handleActivate = () => {
    phoneHardware.triggerHaptic('SUCCESS');
    setActivated(true);
    confetti({ particleCount: 30, spread: 50 });
    speakNaija('Every monitoring spirit fighting your club today, back to sender! Jinx cancelled clean!', 'hyped');
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn font-mono text-xs text-white">
      <div className="relative w-full max-w-md glass-panel-premium rounded-3xl border-2 border-stadiumGreen/70 p-6 space-y-4 shadow-2xl text-center">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20"><X className="w-4 h-4" /></button>
        <div className="flex items-center justify-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-stadiumGreen animate-pulse" />
          <h3 className="font-black text-sm text-stadiumGreen uppercase">Anti-Jinx Match Shield</h3>
        </div>
        <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-3">
          <span className="text-3xl block">🛡️⚡</span>
          <h4 className="font-black text-sm text-white">Official AuraScore Jinx Insurance</h4>
          <p className="text-xs text-gray-300 font-sans">Protects your team from sudden 90th-minute heartbreaks and rival witchcraft!</p>
          {activated && (
            <div className="p-2 rounded-xl bg-stadiumGreen/20 text-stadiumGreen font-black text-xs">
              ✓ Jinx Shield Active (100% Guaranteed)
            </div>
          )}
        </div>
        <button onClick={handleActivate} className="w-full py-3 rounded-2xl bg-stadiumGreen text-black font-black flex items-center justify-center space-x-2 shadow-lg hover:bg-emerald-400">
          <Sparkles className="w-4 h-4" />
          <span>{activated ? 'Shield Active ✓' : '🛡️ Cast Anti-Jinx Blessing'}</span>
        </button>
      </div>
    </div>
  );
};
