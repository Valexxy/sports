'use client';

import React, { useState, useEffect } from 'react';
import { X, Trophy, Flame, Shield, Zap, Sparkles, Gift, Check, Clock, Users, ArrowRight } from 'lucide-react';
import { auraVault, HARVEST_REWARDS, MemberProfile } from '../lib/aura-vault-engine';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';
import confetti from 'canvas-confetti';

interface HarvestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyAuraHarvestModal: React.FC<HarvestModalProps> = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState<MemberProfile>(auraVault.getProfile());
  const [claimStatus, setClaimStatus] = useState<{ message: string; type: 'SUCCESS' | 'ERROR' } | null>(null);
  const [flashTimeRemaining, setFlashTimeRemaining] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setProfile(auraVault.getProfile());
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (auraVault.isFlashAuraActive() && profile.flashAuraActiveUntil) {
        const remaining = Math.max(0, Math.floor((profile.flashAuraActiveUntil - Date.now()) / 1000));
        setFlashTimeRemaining(remaining);
      } else {
        setFlashTimeRemaining(0);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [profile.flashAuraActiveUntil]);

  if (!isOpen) return null;

  const handleClaim = () => {
    const res = auraVault.claimDailyHarvest();
    if (res.success) {
      phoneHardware.triggerHaptic('SUCCESS');
      stadiumAudio.playCoinCashout();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      setClaimStatus({
        message: '🎉 Claimed +' + res.reward.aura + ' AURA! (' + res.reward.title + ')',
        type: 'SUCCESS',
      });
      setProfile(auraVault.getProfile());
    } else {
      phoneHardware.triggerHaptic('WARNING');
      setClaimStatus({ message: res.error || 'Claim unavailable', type: 'ERROR' });
    }
  };

  const handleTriggerFlashDrop = () => {
    const expiry = auraVault.triggerFlashAuraDrop();
    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.playCrowdRoar();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
    setProfile(auraVault.getProfile());
    setClaimStatus({
      message: '⚡ FLASH AURA 2X ACTIVE! All prediction multipliers & harvest rewards doubled for 15 mins!',
      type: 'SUCCESS',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn font-mono text-white">
      <div className="glass-panel-premium max-w-xl w-full p-5 sm:p-6 rounded-3xl border-2 border-gold/60 space-y-4 shadow-2xl relative max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Banner */}
        <div className="flex items-center space-x-3 border-b border-white/10 pb-3 flex-shrink-0">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-gold via-amber-400 to-crimson text-black font-black text-xl shadow-lg">
            🌾
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-black text-sm sm:text-base text-white">DAILY AURA HARVEST & REWARDS</h3>
              <span className="px-2 py-0.5 rounded-full bg-gold text-black font-black text-[9px]">
                RETENTION LADDER
              </span>
            </div>
            <p className="text-[10px] text-gray-300 font-sans mt-0.5">
              Check in daily to build your 7-day streak & unlock <strong>The Golden Sunday Jackpot (1,500 AURA)</strong>.
            </p>
          </div>
        </div>

        {/* Status Message Alert */}
        {claimStatus && (
          <div className={`p-3 rounded-2xl text-xs font-bold flex items-center space-x-2 ${
            claimStatus.type === 'SUCCESS' ? 'bg-stadiumGreen/20 border border-stadiumGreen text-stadiumGreen' : 'bg-crimson/20 border border-crimson text-crimson'
          }`}>
            <Sparkles className="w-4 h-4 flex-shrink-0" />
            <span>{claimStatus.message}</span>
          </div>
        )}

        {/* Flash Aura Drop Loot Box Alert */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-black to-gold/20 border border-gold/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 flex-shrink-0">
          <div>
            <div className="flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-gold animate-bounce" />
              <span className="font-black text-xs text-gold">
                {flashTimeRemaining > 0 ? '⚡ FLASH AURA 2X ACTIVE (' + Math.floor(flashTimeRemaining / 60) + 'm ' + (flashTimeRemaining % 60) + 's)' : '🎁 FLASH AURA LOOT DROP'}
              </span>
            </div>
            <p className="text-[10px] text-gray-300 font-sans mt-0.5">
              {flashTimeRemaining > 0 ? 'All vault payouts and predictions earn 2X Aura points!' : 'Unannounced 15-minute 2X multiplier window.'}
            </p>
          </div>

          {flashTimeRemaining === 0 && (
            <button
              onClick={handleTriggerFlashDrop}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-gold to-amber-500 text-black font-black text-[10px] shadow active:scale-95 transition-all flex items-center space-x-1 self-start sm:self-auto"
            >
              <span>Trigger 2X Drop</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* 7-Day Retention Ladder Cards */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[35vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => {
              const info = HARVEST_REWARDS[day];
              const isCurrent = profile.currentHarvestDay === day;
              const isPassed = profile.currentHarvestDay > day;

              return (
                <div
                  key={day}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                    day === 7
                      ? 'sm:col-span-2 bg-gradient-to-r from-gold/20 via-amber-950/40 to-black border-gold shadow-lg glow-emerald'
                      : isCurrent
                      ? 'bg-stadiumGreen/15 border-stadiumGreen shadow-md'
                      : isPassed
                      ? 'bg-black/40 border-white/5 opacity-60'
                      : 'bg-black/60 border-white/10'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-black text-xs text-white">DAY {day}</span>
                      {isCurrent && <span className="px-1.5 py-0.2 rounded bg-stadiumGreen text-black text-[8px] font-black">TODAY</span>}
                      {isPassed && <span className="text-[10px] text-stadiumGreen">✓</span>}
                    </div>
                    <p className="text-[10px] text-gray-300 font-sans">{info.title}</p>
                    {info.bonus && <span className="text-[9px] text-gold font-bold block">{info.bonus}</span>}
                  </div>

                  <div className="text-right">
                    <span className="font-black text-sm text-gold font-mono">+{info.aura} AURA</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vault Summary & Claim Button */}
        <div className="pt-2 border-t border-white/10 space-y-3 flex-shrink-0">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Streak Shields:</span>
              <span className="px-2 py-0.5 rounded-lg bg-cyan-950 border border-cyan-400 text-cyan-300 font-black text-[10px] flex items-center space-x-1">
                <Shield className="w-3 h-3 inline" />
                <span>{profile.streakShields} ACTIVE</span>
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Vault Balance:</span>
              <span className="text-gold font-black font-mono">{profile.auraBalance.toLocaleString()} AURA</span>
            </div>
          </div>

          <button
            onClick={handleClaim}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-stadiumGreen via-emerald-400 to-gold text-black font-black text-xs flex items-center justify-center space-x-2 shadow-lg glow-emerald active:scale-95 transition-all"
          >
            <Gift className="w-4 h-4" />
            <span>Harvest Day {profile.currentHarvestDay} Aura ➔</span>
          </button>
        </div>

      </div>
    </div>
  );
};
