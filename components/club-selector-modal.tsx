'use client';

import React, { useState } from 'react';
import { X, Check, Shield, Flame, Users, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { POPULAR_CLUBS, ClubIdentity } from './club-supporter-pass-card';
import { UserProfileEngine } from '../lib/user-profile-engine';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';

interface ClubSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentClub: string;
}

export const ClubSelectorModal: React.FC<ClubSelectorModalProps> = ({
  isOpen,
  onClose,
  currentClub,
}) => {
  const [selectedClub, setSelectedClub] = useState(currentClub || 'Arsenal');

  if (!isOpen) return null;

  const handleSelectClub = (clubName: string) => {
    try { phoneHardware.triggerHaptic('SUCCESS'); } catch {}
    try { stadiumAudio.playCrowdRoar(); } catch {}
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });

    setSelectedClub(clubName);
    UserProfileEngine.updateProfile({
      club: clubName,
      supporterRank: `${clubName} Official Supporter 🛡️`,
    });

    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="max-w-2xl w-full rounded-3xl bg-panel border border-white/20 p-5 sm:p-7 shadow-2xl space-y-4 font-mono text-white max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🛡️</span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">CHOOSE YOUR CLUB &amp; CLAIM PASS</h2>
              <span className="text-[10px] text-gray-400 font-sans block">Select your team to unlock official Supporter Pass &amp; Fan Rivalry Leaderboard</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Club Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {Object.entries(POPULAR_CLUBS).map(([key, club]) => {
            const isSelected = selectedClub === key;
            return (
              <div
                key={key}
                onClick={() => handleSelectClub(key)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-gradient-to-br from-stadiumGreen/20 via-panel to-gold/10 border-stadiumGreen shadow-lg ring-1 ring-stadiumGreen/40 scale-[1.02]'
                    : 'bg-black/60 border-white/10 hover:border-white/25 hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-3xl">{club.badge}</span>
                    <div>
                      <h3 className="font-black text-sm text-white">{club.name}</h3>
                      <span className="text-[10px] text-gray-400 font-sans block">{club.stadium.split(',')[0]}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-stadiumGreen text-black flex items-center justify-center font-bold">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <p className="text-[10px] text-gray-300 font-sans italic border-t border-white/5 pt-2">
                  "{club.slogan}"
                </p>

                <div className="flex items-center justify-between text-[9px] text-gray-400 pt-1">
                  <span className="text-cyan-400 font-bold flex items-center space-x-1">
                    <Users className="w-3 h-3 inline" />
                    <span>{(club.registeredFans).toLocaleString()} Supporters</span>
                  </span>
                  <span className="text-gold font-bold">1-Tap Claim</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 text-center text-[10px] text-gray-400 font-sans">
          Selecting a club customizes your matchday alerts, supporter streak, and live fan rivalry standings.
        </div>
      </div>
    </div>
  );
};
