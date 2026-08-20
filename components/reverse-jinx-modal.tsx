'use client';

import React, { useState } from 'react';
import { X, ShieldAlert, Sparkles, Flame, Plus, CheckCircle2, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { stadiumAudio } from '../lib/sound-synthesizer';

interface ReverseJinxProps {
  onClose: () => void;
}

export const ReverseJinxModal: React.FC<ReverseJinxProps> = ({ onClose }) => {
  const [selectedTeam, setSelectedTeam] = useState('Arsenal');
  const [jinxTarget, setJinxTarget] = useState<'FAVORITE_TEAM' | 'RIVAL_TEAM'>('FAVORITE_TEAM');
  const [insuranceStake, setInsuranceStake] = useState(10);
  const [jinxActivated, setJinxActivated] = useState(false);

  const handleCastJinx = () => {
    setJinxActivated(true);
    stadiumAudio.playCrowdRoar();
    if (typeof window !== 'undefined') {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#a855f7', '#ec4899', '#f59e0b', '#10b981'],
      });
      if ('vibrate' in navigator) navigator.vibrate([120, 80, 120]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn font-mono text-xs">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-cyberPurple/50 p-6 shadow-2xl space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-panel text-gray-400 hover:text-white border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 border-b border-white/10 pb-3">
          <div className="p-3 rounded-2xl bg-cyberPurple/20 text-cyberPurple border border-cyberPurple/40">
            <ShieldAlert className="w-6 h-6 text-crimson" />
          </div>
          <div>
            <h2 className="font-black text-base text-white flex items-center space-x-2">
              <span>THE REVERSE JINX ENGINE 🔮</span>
              <span className="px-2 py-0.5 rounded bg-crimson/20 text-crimson text-[9px] font-bold">
                EMOTIONAL HEDGE
              </span>
            </h2>
            <p className="text-xs text-gray-400 font-sans">
              The Win-Win Soccer God Strategy: Never leave the matchday unhappy.
            </p>
          </div>
        </div>

        {/* Purpose Explanation Box */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyberPurple/20 via-black to-crimson/20 border border-cyberPurple/30 space-y-1.5 leading-relaxed font-sans text-gray-200">
          <span className="font-mono text-gold font-extrabold text-[11px] block">⚡ HOW THE REVERSE JINX WORKS:</span>
          <p className="text-xs">
            Bet against your own beloved club (or hex a rival). If your team <strong>WINS</strong> the match, you celebrate glory and bragging rights. If your team <strong>LOSES</strong>, the reverse jinx activates and you collect cold hard cash!
          </p>
        </div>

        {/* Interactive Jinx Creator */}
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] text-gray-400 font-bold block">1. SELECT TEAM TO JINX / PROTECT:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Arsenal', 'Chelsea', 'Man United', 'Real Madrid'].map((t) => (
                <button
                  key={t}
                  onClick={() => { setSelectedTeam(t); setJinxActivated(false); }}
                  className={`p-2 rounded-xl font-bold text-xs transition-all ${
                    selectedTeam === t
                      ? 'bg-cyberPurple text-white font-black shadow-md border border-cyberPurple'
                      : 'bg-panel text-gray-400 hover:text-white border border-white/10'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-gray-400 font-bold block">2. EMOTIONAL INSURANCE STAKE:</label>
            <div className="flex items-center space-x-2">
              {[5, 10, 25, 50].map((stake) => (
                <button
                  key={stake}
                  onClick={() => setInsuranceStake(stake)}
                  className={`flex-1 py-2 rounded-xl font-mono font-bold text-xs transition-all ${
                    insuranceStake === stake
                      ? 'bg-gold text-black font-black'
                      : 'bg-black/50 text-gray-400 border border-white/10 hover:text-white'
                  }`}
                >
                  ${stake}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cast Jinx Button or Activated Banner */}
        {jinxActivated ? (
          <div className="p-4 rounded-2xl bg-stadiumGreen/20 border border-stadiumGreen text-center space-y-1 animate-fadeIn">
            <div className="flex items-center justify-center space-x-1.5 text-stadiumGreen font-black text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>REVERSE JINX ACTIVE ON {selectedTeam.toUpperCase()}! 🔮</span>
            </div>
            <p className="text-gray-300 text-xs font-sans">
              Emotional hedge locked: If {selectedTeam} drops points, payout is <strong>${(insuranceStake * 3.8).toFixed(2)}</strong>!
            </p>
          </div>
        ) : (
          <button
            onClick={handleCastJinx}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyberPurple via-crimson to-gold text-white font-black text-xs shadow-xl hover:scale-105 transition-all flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Cast Reverse Jinx on {selectedTeam} 🔮</span>
          </button>
        )}

      </div>
    </div>
  );
};
