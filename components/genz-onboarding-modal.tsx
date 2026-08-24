'use client';

import React, { useState, useEffect } from 'react';
import {
  X, Sparkles, Zap, Trophy, Flame, Check, ArrowRight, ShieldCheck,
  Heart, Gift, Share2, Crown, Users, CheckCircle2, ChevronRight, Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { stadiumAudio } from '../lib/sound-synthesizer';
import { phoneHardware } from '../lib/phone-hardware-engine';

interface OnboardingModalProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

const CLUBS = [
  { name: 'Arsenal', flag: '🔴⚪' },
  { name: 'Chelsea', flag: '🔵🦁' },
  { name: 'Man United', flag: '🔴👹' },
  { name: 'Real Madrid', flag: '⚪👑' },
  { name: 'Barcelona', flag: '🔵🔴' },
  { name: 'Super Eagles', flag: '🇳🇬🦅' },
];

const AVATARS = ['⚡', '👑', '🦁', '🦅', '🐐', '🔥', '💎', '🚀'];

export const GenZOnboardingModal: React.FC<OnboardingModalProps> = ({ forceOpen = false, onClose }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1); // 1: Identity, 2: Interactive Trial Swipe, 3: Welcome Bounty
  const [selectedAvatar, setSelectedAvatar] = useState<string>('⚡');
  const [username, setUsername] = useState<string>('');
  const [selectedClub, setSelectedClub] = useState<string>('Arsenal');
  const [trialSwiped, setTrialSwiped] = useState<boolean>(false);

    useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      return;
    }
    const completed = localStorage.getItem('mivaj_onboarding_completed');
    if (!completed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        stadiumAudio.playTalkingDrumBeat();
        phoneHardware.triggerHaptic('AFRO_BEAT');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [forceOpen]);

  const handleFinishStep1 = () => {
    if (!username.trim()) {
      setUsername(`Striker_${Math.floor(100 + Math.random() * 900)}`);
    }
    setStep(2); // Go to interactive tutorial
    phoneHardware.triggerHaptic('SELECTION');
    stadiumAudio.playAddPickSound();
  };

  const handleTrialSwipe = (pick: 'YES' | 'NO') => {
    setTrialSwiped(true);
    phoneHardware.triggerHaptic('TALKING_DRUM');
    stadiumAudio.playTalkingDrumBeat();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });

    setTimeout(() => {
      setStep(3); // Go to bounty claim
    }, 800);
  };

  const handleClaimWelcomeBounty = async () => {
    const finalUname = username.trim() || `Striker_${Math.floor(100 + Math.random() * 900)}`;

    try {
      // Create session in backend and set httpOnly cookie
      await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: finalUname,
          avatar: selectedAvatar,
          club: selectedClub,
        }),
      });
    } catch {}

    localStorage.setItem('mivaj_onboarding_completed', 'true');
    localStorage.setItem('mivaj_user_avatar', selectedAvatar);
    localStorage.setItem('mivaj_user_club', selectedClub);
    localStorage.setItem('mivaj_user_name', finalUname);

    phoneHardware.triggerHaptic('GOAL');
    stadiumAudio.playGoalCelebration();
    confetti({ particleCount: 100, spread: 90, origin: { y: 0.5 } });

    setTimeout(() => {
      setIsOpen(false);
      if (onClose) onClose();
      // Reload or refresh session
      window.location.reload();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 animate-fadeIn font-mono text-xs text-white">
      <div className="relative w-full max-w-lg glass-panel-premium rounded-3xl border-2 border-stadiumGreen/70 p-5 sm:p-7 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto glow-emerald">
        
        {/* Header with Progress Steps */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-stadiumGreen text-black font-black text-sm">
              🚀
            </span>
            <div>
              <h2 className="font-black text-sm text-white">MIVAJ FAST-TRACK ONBOARDING</h2>
              <span className="text-[10px] text-stadiumGreen font-bold">
                {step === 1 ? 'Step 1 of 3: Identity Setup' : step === 2 ? 'Step 2 of 3: 5-Sec Interactive Trial' : 'Step 3 of 3: Claim Bounty (+500 Aura)'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-full bg-panel hover:bg-white/10 text-gray-400 hover:text-white border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 1: IDENTITY & LOYALTY CLUB */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <label className="text-[10px] text-gray-300 font-bold block mb-1.5">
                1. SELECT YOUR PUNTER AVATAR:
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    onClick={() => {
                      setSelectedAvatar(av);
                      phoneHardware.triggerHaptic('SELECTION');
                    }}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                      selectedAvatar === av
                        ? 'bg-stadiumGreen text-black scale-110 shadow-lg glow-emerald'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] text-gray-300 font-bold block mb-1.5">
                2. ENTER YOUR GAMER HANDLE:
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. CyberStriker_99"
                className="w-full p-2.5 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:border-stadiumGreen focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-300 font-bold block mb-1.5">
                3. SELECT YOUR CLUB:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CLUBS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setSelectedClub(c.name);
                      phoneHardware.triggerHaptic('SELECTION');
                    }}
                    className={`p-2 rounded-xl text-left transition-all flex items-center space-x-1.5 ${
                      selectedClub === c.name
                        ? 'bg-stadiumGreen text-black font-black shadow-md'
                        : 'bg-white/5 border border-white/10 text-gray-300 hover:text-white'
                    }`}
                  >
                    <span className="text-base">{c.flag}</span>
                    <span className="text-[10px] truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleFinishStep1}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-stadiumGreen via-emerald-400 to-gold text-black font-black text-xs flex items-center justify-center space-x-1.5 shadow-lg hover:scale-105 transition-all glow-emerald"
            >
              <span>Next: Try 1-Second Swipe Challenge ➔</span>
            </button>
          </div>
        )}

        {/* STEP 2: INTERACTIVE TRIAL SWIPE CARD (LEARN-BY-DOING AS PER SLEEPER BENCHMARK) */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn py-2">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-400/20 to-panel border border-cyan-400/40 text-center space-y-0.5">
              <span className="font-black text-cyan-400 text-xs block">🎮 INTERACTIVE TRIAL CHALLENGE</span>
              <p className="text-[10px] text-gray-300">
                Make your first call to test the Tinder-style live prediction engine!
              </p>
            </div>

            {/* Micro Card */}
            <div className="p-4 rounded-2xl bg-black/80 border-2 border-stadiumGreen space-y-3 shadow-xl">
              <div className="flex items-center justify-between text-[10px] text-gray-400">
                <span>PREMIER LEAGUE DERBY</span>
                <span className="text-stadiumGreen font-bold">84% Community Picks YES</span>
              </div>

              <div className="text-center py-2 space-y-1">
                <span className="text-2xl block">⚽⚡</span>
                <h3 className="font-black text-sm text-white">
                  "Will Saka get a shot on target in this match?"
                </h3>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => handleTrialSwipe('NO')}
                  className="py-2.5 rounded-xl bg-crimson/20 border border-crimson text-crimson font-black text-xs hover:bg-crimson hover:text-white transition-all flex items-center justify-center space-x-1"
                >
                  <span>🔴 CAP / NO</span>
                </button>
                <button
                  onClick={() => handleTrialSwipe('YES')}
                  className="py-2.5 rounded-xl bg-stadiumGreen text-black font-black text-xs hover:scale-105 transition-all shadow-md glow-emerald flex items-center justify-center space-x-1"
                >
                  <span>🟢 LOCK / YES</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: CLAIM WELCOME BOUNTY */}
        {step === 3 && (
          <div className="py-6 text-center space-y-4 animate-fadeIn">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-gold via-stadiumGreen to-cyan-400 p-1 mx-auto shadow-2xl animate-bounce flex items-center justify-center">
              <div className="w-full h-full bg-black rounded-[22px] flex items-center justify-center text-4xl">
                🎁
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="font-black text-lg text-white">BOUNTY UNLOCKED!</h3>
              <p className="text-xs text-gold font-mono font-bold">+500 FREE AURA POINTS CREDITED</p>
              <p className="text-[11px] text-gray-300 font-sans max-w-xs mx-auto">
                Welcome, <strong className="text-white">{selectedAvatar} {username || 'Striker'}</strong>! Your member pass is active.
              </p>
            </div>

            <button
              onClick={handleClaimWelcomeBounty}
              className="w-full py-3.5 rounded-2xl bg-stadiumGreen text-black font-black text-sm shadow-xl hover:scale-105 transition-all glow-emerald flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>Claim +500 Aura & Enter Live Stadium ➔</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
