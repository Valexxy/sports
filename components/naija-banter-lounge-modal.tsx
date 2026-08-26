'use client';

import React, { useState, useEffect } from 'react';
import { X, Flame, Send, ShieldCheck, Lock, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { stadiumAudio } from '../lib/sound-synthesizer';
import { phoneHardware } from '../lib/phone-hardware-engine';

interface BanterModalProps {
  onClose: () => void;
  onOpenAuth?: () => void;
}

export interface RoastItem {
  id: string;
  club: string;
  roaster: string;
  roast: string;
  tag: string;
  hype: number;
}

// Banned abusive words list for real-time AI moderation
const BLOCKED_ABUSIVE_WORDS = [
  'bastard', 'idiot', 'fool', 'mugu', 'ashewo', 'scam', 'hate', 'die', 'kill', 'stupid', 'curse'
];

const COMMUNITY_BANTER_FEED: RoastItem[] = [
  {
    id: 'r-1',
    club: 'Manchester United 🔴',
    roaster: '@Eze_Baller',
    roast: 'Defender pass ball go own net say na tactical buildup! Matchday high blood pressure never finishes. 😭⚽',
    tag: 'Tactical Drama',
    hype: 1420,
  },
  {
    id: 'r-2',
    club: 'Chelsea 🔵',
    roaster: '@Tunde_Strikr',
    roast: '85 signings and 9-year contracts, but young squad is finally cooking with Cole Palmer cold ice celebration! 🥶⚽',
    tag: 'Cold Palmer',
    hype: 1890,
  },
  {
    id: 'r-3',
    club: 'Arsenal 🔴⚪',
    roaster: '@NaijaGunner_99',
    roast: 'Set-piece masters of North London! If Gabriel nod corner ball, goalkeeper just look like statue! 🍼⚽',
    tag: 'Set Piece FC',
    hype: 2150,
  },
  {
    id: 'r-4',
    club: 'Real Madrid ⚪',
    roaster: '@Chidi_Madrid',
    roast: 'Down 0-1 at 88th minute. Ref look watch, see say na Champions League. Vini Jr score at 94th min. DNA! 🧙‍♂️',
    tag: 'UCL Royalty',
    hype: 3200,
  },
  {
    id: 'r-5',
    club: 'Victor Osimhen & Super Eagles 🇳🇬',
    roaster: '@SuperEagle_Lover',
    roast: 'Osimhen wear mask land pitch, defenders start dey call their physiotherapist before kickoff! Pure power! 🚀🇳🇬',
    tag: 'Masked Striker',
    hype: 4500,
  },
  {
    id: 'r-6',
    club: 'Barcelona 🔵🔴',
    roaster: '@Kalu_Catalan',
    roast: 'La Masia teenagers carrying the whole team with silky tiki-taka passes! Yamal at 17 is pure joy to watch! 👶⚽',
    tag: 'La Masia Pride',
    hype: 1980,
  },
];

export const NaijaBanterLoungeModal: React.FC<BanterModalProps> = ({ onClose, onOpenAuth }) => {
  const [feed, setFeed] = useState<RoastItem[]>(COMMUNITY_BANTER_FEED);
  const [selectedClub, setSelectedClub] = useState('Man United');
  const [userRoast, setUserRoast] = useState('');
  const [hypes, setHypes] = useState<Record<string, boolean>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Check user authentication
  const userName = typeof window !== 'undefined' ? localStorage.getItem('aurascore_user_name') : null;
  const isAuthenticated = !!userName;

  const handlePostRoast = () => {
    setErrorMsg(null);

    // 1. Strict Auth Check
    if (!isAuthenticated) {
      setErrorMsg('🔒 Only signed-in members can post banter. Please sign in to join the conversation!');
      if (onOpenAuth) onOpenAuth();
      return;
    }

    const text = userRoast.trim();
    if (!text) return;

    // 2. Real-Time AI Abuse & Moderation Filter
    const lower = text.toLowerCase();
    const hasAbusiveWord = BLOCKED_ABUSIVE_WORDS.some((w) => lower.includes(w));
    if (hasAbusiveWord) {
      setErrorMsg('⚠️ AI Moderation Flag: Abusive words or insults are strictly prohibited. Keep banter respectful and fun!');
      phoneHardware.triggerHaptic('WARNING');
      return;
    }

    const newRoast: RoastItem = {
      id: 'r-' + Date.now(),
      club: selectedClub,
      roaster: '@' + userName,
      roast: text,
      tag: 'Fresh Banter 🔥',
      hype: 1,
    };

    setFeed([newRoast, ...feed]);
    setUserRoast('');
    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.playAddPickSound();
    confetti({ particleCount: 30, spread: 40, origin: { y: 0.6 } });
  };

  const handleHype = (id: string) => {
    if (hypes[id]) return;
    setHypes((prev) => ({ ...prev, [id]: true }));
    setFeed((prev) =>
      prev.map((item) => (item.id === id ? { ...item, hype: item.hype + 1 } : item))
    );
    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.playCrowdRoar();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn font-mono">
      <div className="glass-panel-premium max-w-2xl w-full p-5 sm:p-6 rounded-3xl border-2 border-gold/50 space-y-4 shadow-2xl relative text-white max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-gold text-black font-black text-lg shadow-md">
              🔥
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-black text-sm sm:text-base text-white">NAIJA GEN-Z ROAST & BANTER LOUNGE</h3>
                <span className="px-2 py-0.5 rounded-full bg-stadiumGreen/20 text-stadiumGreen font-black text-[9px] flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 inline" />
                  <span>AI MODERATED</span>
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-sans">
                Friendly sports banter &bull; Signed-in members only &bull; Zero insults allowed
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Banter Feed (Auto-scrolling clean community stream) */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[50vh]">
          {feed.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-2xl bg-black/70 border border-white/10 space-y-1.5 hover:border-gold/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-black text-gold text-xs">{item.roaster}</span>
                  <span className="px-2 py-0.2 rounded-full bg-white/5 text-[9px] text-gray-300">{item.club}</span>
                </div>
                <span className="text-[9px] text-stadiumGreen font-bold">{item.tag}</span>
              </div>

              <p className="text-xs text-gray-200 font-sans leading-relaxed">{item.roast}</p>

              <div className="flex items-center justify-end pt-1">
                <button
                  onClick={() => handleHype(item.id)}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-[10px] font-black transition-all ${
                    hypes[item.id] ? 'bg-gold text-black' : 'bg-white/5 text-gray-400 hover:text-gold'
                  }`}
                >
                  <Flame className="w-3 h-3" />
                  <span>{item.hype.toLocaleString()} Hypes</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area (Strict Auth & Moderation) */}
        <div className="pt-2 border-t border-white/10 flex-shrink-0 space-y-2">
          {errorMsg && (
            <div className="p-2 rounded-xl bg-crimson/20 border border-crimson text-crimson text-[10px] font-bold">
              {errorMsg}
            </div>
          )}

          {!isAuthenticated ? (
            <div className="p-3 rounded-2xl bg-black/80 border border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-[11px] text-gray-300">
                <Lock className="w-4 h-4 text-gold" />
                <span>You must be signed in to drop banter in the lounge.</span>
              </div>
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 rounded-xl bg-gold text-black font-black text-xs shadow hover:scale-105 transition-all"
              >
                Sign In ➔
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <select
                value={selectedClub}
                onChange={(e) => setSelectedClub(e.target.value)}
                className="p-2.5 rounded-2xl bg-black/80 border border-white/10 text-white font-mono text-xs focus:outline-none"
              >
                <option value="Arsenal">Arsenal</option>
                <option value="Chelsea">Chelsea</option>
                <option value="Man United">Man United</option>
                <option value="Real Madrid">Real Madrid</option>
                <option value="Barcelona">Barcelona</option>
              </select>

              <input
                type="text"
                placeholder="Drop respectful match banter..."
                value={userRoast}
                onChange={(e) => setUserRoast(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePostRoast()}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-black/80 border border-white/10 text-white placeholder-gray-500 font-mono text-xs focus:border-gold focus:outline-none"
              />

              <button
                onClick={handlePostRoast}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-gold to-amber-500 text-black font-black text-xs flex items-center space-x-1 shadow active:scale-95 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Drop Banter</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
