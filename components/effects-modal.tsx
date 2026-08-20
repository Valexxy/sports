'use client';

import React from 'react';
import { TWENTY_UI_EFFECTS_REGISTRY } from '../lib/twenty-ui-effects';
import { X, Sparkles, Cpu, Layers, Palette, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EffectsModalProps {
  onClose: () => void;
}

export const EffectsModal: React.FC<EffectsModalProps> = ({ onClose }) => {
  const handleTestConfetti = () => {
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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-panel rounded-3xl border border-stadiumGreen/50 p-6 shadow-2xl my-8 font-mono text-xs">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-panel text-gray-400 hover:text-white border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-4 border-b border-white/10 pb-3">
          <div className="p-2.5 rounded-xl bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40">
            <Sparkles className="w-6 h-6 text-stadiumGreen" />
          </div>
          <div>
            <h2 className="font-extrabold text-xl text-white">22+ ULTRA-PREMIUM UI/UX EFFECTS & FEATURES ENGINE</h2>
            <p className="text-xs text-gray-400">Master Senior UI/UX Systems Architecture & Micro-Interactions</p>
          </div>
        </div>

        {/* Test FX Callout Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-stadiumGreen/20 via-panel to-gold/20 border border-stadiumGreen/40 flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-mono text-stadiumGreen font-bold uppercase">INTERACTIVE MICRO-INTERACTION ENGINE</span>
            <span className="text-sm font-black text-white block mt-0.5">Test Particle Confetti Physics & Haptic Vibrations</span>
          </div>
          <button
            onClick={handleTestConfetti}
            className="px-4 py-2 rounded-xl bg-stadiumGreen text-black font-extrabold text-xs shadow-md hover:scale-105 transition-all flex items-center space-x-1"
          >
            <Sparkles className="w-4 h-4" />
            <span>Test FX ⚡</span>
          </button>
        </div>

        {/* Effects List */}
        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
          {TWENTY_UI_EFFECTS_REGISTRY.map((fx) => (
            <div key={fx.id} className="p-3.5 rounded-2xl bg-panel/90 border border-white/10 hover:border-stadiumGreen/40 transition-all flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-black text-white text-xs">{fx.id}. {fx.name}</span>
                  <span className="px-1.5 py-0.2 rounded bg-stadiumGreen/20 text-stadiumGreen font-bold text-[10px] border border-stadiumGreen/30">
                    {fx.category}
                  </span>
                </div>
                <p className="text-gray-300 font-sans text-xs">{fx.description}</p>
              </div>

              <span className="px-2.5 py-1 rounded-xl bg-stadiumGreen/10 border border-stadiumGreen/30 text-stadiumGreen font-extrabold text-[10px] flex-shrink-0">
                {fx.status}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
