'use client';

import React, { useState } from 'react';
import { X, Trophy, CheckCircle2, Zap, Crown, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { stadiumAudio } from '../lib/sound-synthesizer';

interface ProfileModalProps {
  onClose: () => void;
}

export const UserProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
  const [currentTier, setCurrentTier] = useState<'FREE' | 'PRO' | 'VIP'>('PRO');
  const [digitalHandle, setDigitalHandle] = useState('CyberStriker_99');
  const [digitalAvatar, setDigitalAvatar] = useState('⚡');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleUpgrade = (tier: 'PRO' | 'VIP') => {
    setCurrentTier(tier);
    stadiumAudio.playCrowdRoar();
    if (typeof window !== 'undefined') {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  const handleSaveHandle = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn overflow-y-auto font-mono text-xs">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl border border-stadiumGreen/50 p-6 shadow-2xl my-8 space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-panel text-gray-400 hover:text-white border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Profile Header Card */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3.5">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-stadiumGreen via-cyberPurple to-gold p-0.5 shadow-xl flex items-center justify-center">
                <div className="w-full h-full bg-void rounded-[14px] flex items-center justify-center text-2xl">
                  {digitalAvatar}
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-stadiumGreen text-black font-black text-[9px] rounded border border-black">
                {currentTier}
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-extrabold text-base sm:text-lg text-white">@{digitalHandle}</h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-gold/20 text-gold border border-gold/40 font-bold flex items-center space-x-1">
                  <Trophy className="w-3 h-3 text-gold" />
                  <span>3,850 XP</span>
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-sans mt-0.5">
                Anonymous Gamer Tag • Verified Settlement Rate: <strong className="text-stadiumGreen">92.4%</strong>
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-xl bg-stadiumGreen/20 text-stadiumGreen font-black text-[10px] border border-stadiumGreen/30">
            DIGITAL ALIAS ACTIVE ✓
          </span>
        </div>

        {/* Digital Avatar & Gamer Tag Customizer (Strictly No Real Names Allowed) */}
        <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-2.5">
          <span className="text-[10px] text-gold font-bold uppercase tracking-wider block">
            🎮 DIGITAL IDENTITY CUSTOMIZER (NO REAL NAMES ALLOWED)
          </span>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Avatar Selector */}
            <div className="flex items-center space-x-1.5">
              <span className="text-gray-400 text-[10px]">Avatar:</span>
              {['⚡', '👑', '🔥', '💎', '🦁', '🤖', '👾'].map((av) => (
                <button
                  key={av}
                  onClick={() => setDigitalAvatar(av)}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-all ${
                    digitalAvatar === av ? 'bg-stadiumGreen text-black scale-110' : 'bg-panel hover:bg-white/10'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>

            {/* Gamer Tag Input */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <input
                type="text"
                value={digitalHandle}
                onChange={(e) => setDigitalHandle(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                placeholder="DigitalGamerTag"
                className="px-2.5 py-1.5 rounded-xl bg-black border border-white/10 text-stadiumGreen font-mono text-xs focus:outline-none focus:border-stadiumGreen flex-1 sm:w-36"
              />
              <button
                onClick={handleSaveHandle}
                className="px-3 py-1.5 rounded-xl bg-stadiumGreen text-black font-black text-xs hover:bg-emerald-400 transition-all"
              >
                {savedSuccess ? 'Saved ✓' : 'Save'}
              </button>
            </div>
          </div>
        </div>

        {/* Membership Tiers */}
        <h3 className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">SELECT MEMBERSHIP LEVEL</h3>

        <div className="space-y-3">
          {/* FREE TIER */}
          <div className={`p-4 rounded-2xl border transition-all ${
            currentTier === 'FREE' ? 'bg-stadiumGreen/10 border-stadiumGreen' : 'bg-panel border-white/10'
          }`}>
            <div className="flex justify-between items-center">
              <div>
                <span className="font-extrabold text-sm text-white flex items-center space-x-1.5">
                  <span>FREE FAN TIER</span>
                  <span className="text-xs text-gray-400">($0/mo)</span>
                </span>
                <p className="text-xs text-gray-400 font-sans mt-0.5">Live Scores, Match Schedules & Basic Picks.</p>
              </div>
              {currentTier === 'FREE' ? (
                <span className="text-xs text-stadiumGreen font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ACTIVE</span>
                </span>
              ) : (
                <button
                  onClick={() => setCurrentTier('FREE')}
                  className="px-3 py-1.5 rounded-lg bg-panel hover:bg-white/10 text-xs text-gray-300 border border-white/10"
                >
                  Downgrade
                </button>
              )}
            </div>
          </div>

          {/* PRO TIER */}
          <div className={`p-4 rounded-2xl border transition-all ${
            currentTier === 'PRO' ? 'bg-stadiumGreen/15 border-stadiumGreen shadow-lg shadow-stadiumGreen/10' : 'bg-panel border-white/10'
          }`}>
            <div className="flex justify-between items-center">
              <div>
                <span className="font-extrabold text-sm text-stadiumGreen flex items-center space-x-1.5">
                  <Zap className="w-4 h-4 text-stadiumGreen" />
                  <span>PRO FAN TIER</span>
                  <span className="text-xs text-stadiumGreen font-bold">$14.99/mo</span>
                </span>
                <p className="text-xs text-gray-300 font-sans mt-0.5">Goal Power Distributions, Live In-Play Radar & Best Odds Comparison.</p>
              </div>
              {currentTier === 'PRO' ? (
                <span className="text-xs text-stadiumGreen font-bold flex items-center space-x-1 bg-stadiumGreen/20 px-2.5 py-1 rounded-lg border border-stadiumGreen/40">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ACTIVE</span>
                </span>
              ) : (
                <button
                  onClick={() => handleUpgrade('PRO')}
                  className="px-3.5 py-1.5 rounded-lg bg-stadiumGreen text-black font-extrabold text-xs shadow-md hover:scale-105 transition-all"
                >
                  Upgrade $14.99
                </button>
              )}
            </div>
          </div>

          {/* VIP MASTER TIER */}
          <div className={`p-4 rounded-2xl border transition-all ${
            currentTier === 'VIP' ? 'bg-gold/15 border-gold shadow-lg shadow-gold/10' : 'bg-panel border-gold/30'
          }`}>
            <div className="flex justify-between items-center">
              <div>
                <span className="font-extrabold text-sm text-gold flex items-center space-x-1.5">
                  <Crown className="w-4 h-4 text-gold" />
                  <span>VIP MASTER TIER</span>
                  <span className="text-xs text-gold font-bold">$29.99/mo</span>
                </span>
                <p className="text-xs text-gray-300 font-sans mt-0.5">Ultra-Banker Tickets, Smart Stake Optimizer & 1-Click Bet Slip Builder.</p>
              </div>
              {currentTier === 'VIP' ? (
                <span className="text-xs text-gold font-bold flex items-center space-x-1 bg-gold/20 px-2.5 py-1 rounded-lg border border-gold/40">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ACTIVE VIP</span>
                </span>
              ) : (
                <button
                  onClick={() => handleUpgrade('VIP')}
                  className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-gold to-amber-400 text-black font-black text-xs shadow-md hover:scale-105 transition-all"
                >
                  Unlock VIP $29.99
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
