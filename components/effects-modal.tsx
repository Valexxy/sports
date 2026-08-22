'use client';

import React from 'react';
import { TWENTY_UI_EFFECTS_REGISTRY } from '../lib/twenty-ui-effects';
import { getEventEffect, playEventSound, MatchEventKind } from '../lib/event-effects-engine';
import { X, Sparkles, Cpu, Layers, Palette, Volume2, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EffectsModalProps {
  onClose: () => void;
}

// Distinct match-event FX worth showcasing (goal / cards / kickoff / sub).
const PREVIEW_EVENTS: Array<{ kind: MatchEventKind; label: string; team: string; scorer: string }> = [
  { kind: 'GOAL', label: '⚽ GOAL', team: 'Manchester City', scorer: 'Erling Haaland' },
  { kind: 'YELLOW_CARD', label: '🟨 YELLOW', team: 'Real Madrid', scorer: 'Vinicius Jr' },
  { kind: 'RED_CARD', label: '🟥 RED CARD', team: 'Arsenal', scorer: 'Declan Rice' },
  { kind: 'KICKOFF', label: '🚦 KICK-OFF', team: 'Barcelona', scorer: '' },
  { kind: 'SUBSTITUTION', label: '🔄 SUB', team: 'Liverpool', scorer: 'Mohamed Salah' },
  { kind: 'HALFTIME', label: '⏸️ HALF-TIME', team: 'Chelsea', scorer: '' },
];

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

  const previewEffect = (kind: MatchEventKind, scorer: string, team: string) => {
    const fx = getEventEffect({ kind, scorer, team, minute: "64'" });
    playEventSound(fx.sound);
    if (fx.confetti) handleTestConfetti();
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(fx.screenShake ? [120, 60, 180] : [40, 40, 80]);
    }
    return fx;
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

        {/* Distinct Match Event FX Previews */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-4 h-4 text-gold" />
            <span className="font-black text-white text-sm">LIVE MATCH EVENT FX — TAP TO PREVIEW</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PREVIEW_EVENTS.map((ev) => {
              const fx = getEventEffect({ kind: ev.kind, scorer: ev.scorer, team: ev.team, minute: "64'" });
              return (
                <button
                  key={ev.kind}
                  onClick={() => previewEffect(ev.kind, ev.scorer, ev.team)}
                  className={`p-3 rounded-2xl border bg-gradient-to-r ${fx.colors.bg} ${fx.colors.border} ${fx.animation} text-left transition-all hover:scale-105 shadow-md`}
                >
                  <span className={`text-lg ${fx.colors.text}`}>{fx.emoji}</span>
                  <span className={`block font-black text-[11px] mt-1 ${fx.colors.text}`}>{ev.label}</span>
                  <span className={`block text-[9px] ${fx.colors.text} opacity-80`}>{fx.subTitle}</span>
                </button>
              );
            })}
          </div>
          <p className="text-[9px] text-gray-400 mt-2">
            Every goal, card, kickoff, sub and whistle triggers its own popup + WebAudio SFX + haptics on mobile. 100% free, zero assets.
          </p>
        </div>

        {/* Effects List */}
        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
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
