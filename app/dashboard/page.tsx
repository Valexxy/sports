import { biometricAuthEngine } from '../../lib/biometric-auth';
'use client';

import React, { useState, useEffect } from 'react';
import {
  Flame, Zap, Gift, Send, Copy, Check, ExternalLink,
  MessageSquare, Heart, Share2, ArrowLeft, Users, Settings,
  Shield, Sparkles, TrendingUp, Trophy, Compass, ChevronRight, X
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { stadiumAudio } from '../../lib/sound-synthesizer';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { cn } from '../../lib/utils';

interface BanterPost {
  id: string;
  author: string;
  avatar: string;
  badge: string;
  club: string;
  timeAgo: string;
  text: string;
  memeCaption?: string;
  mediaTag: string;
  likes: number;
  commentsCount: number;
}

export default function MultiDeviceResponsiveDashboard() {
  const [mobileTab, setMobileTab] = useState<'SWIPE' | 'BANTER' | 'VAULT' | 'REFERRAL'>('SWIPE');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [dailyClaimed, setDailyClaimed] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);

  // Banter state
  const [banterPosts, setBanterPosts] = useState<BanterPost[]>([
    {
      id: 'p-1',
      author: 'Arsenal_Oracle',
      avatar: '🦅',
      badge: 'Certified Baller ⚡',
      club: 'Arsenal',
      timeAgo: '2m ago',
      text: 'Saka x Odegaard linkup in training today was illegal! Poisson engine gave 84% xG trajectory for weekend derby. Lock it in! 🔒🔥',
      memeCaption: 'DEFENDERS VS BUKAYO SAKA THIS SEASON 💀',
      mediaTag: 'DERBY HIGHLIGHT',
      likes: 142,
      commentsCount: 28,
    },
    {
      id: 'p-2',
      author: 'Chelsea_Kingpin',
      avatar: '🦁',
      badge: 'Early Scout 🌟',
      club: 'Chelsea',
      timeAgo: '14m ago',
      text: 'Whoever said Palmer wouldn\'t score last night owes me 500 Aura! Dixon-Coles stats don\'t lie. Pay up lads! 💸😎',
      memeCaption: 'COLD PALMER ICY PENALTY CELEBRATION 🧊',
      mediaTag: 'POISSON MASTER',
      likes: 98,
      commentsCount: 19,
    },
  ]);

  const [newBanterText, setNewBanterText] = useState('');
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  
  // Offline Background Sync Listener
  useEffect(() => {
    const handleOnline = () => {
      const queue = JSON.parse(localStorage.getItem('aurascore_offline_queue') || '[]');
      if (queue.length > 0) {
        console.log('🔄 Flushing offline queue:', queue.length, 'actions');
        queue.forEach(async (action: any) => {
          try {
            await fetch(action.endpoint, {
              method: action.method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(action.payload),
            });
          } catch {}
        });
        localStorage.removeItem('aurascore_offline_queue');
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser({
            username: 'CyberStriker_99',
            avatar: '⚡',
            club: 'Arsenal',
            aura_balance: 1450,
            vip_tier: 'PLATINUM PRODIGY 👑',
            role: 'MEMBER',
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleClaimDailyAura = () => {
    if (dailyClaimed) return;
    setDailyClaimed(true);
    setCurrentUser((prev: any) => ({
      ...prev,
      aura_balance: (prev?.aura_balance || 1450) + 150,
    }));
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
    phoneHardware.triggerHaptic('AFRO_BEAT');
    stadiumAudio.playAfrobeatVictory();
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });
  };

  const swipeCards = [
    { match: 'Arsenal vs Chelsea', market: 'Double Chance', pick: '1X (Home or Draw)', odds: 1.32, conf: '94% Poisson', xG: '2.40 - 0.85' },
    { match: 'Real Madrid vs Barcelona', market: 'Total Goals', pick: 'Over 1.5 Goals', odds: 1.25, conf: '88% xG Model', xG: '3.10 - 2.20' },
    { match: 'Roma vs Fiorentina', market: '1X2 Match Winner', pick: 'Roma Win (1)', odds: 1.85, conf: '79% Dominance', xG: '1.95 - 0.90' },
  ];

  const handleSwipeCard = (dir: 'left' | 'right') => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(dir === 'right' ? [40, 30, 40] : [25]);
    }
    phoneHardware.triggerHaptic(dir === 'right' ? 'GOAL' : 'TALKING_DRUM');
    if (dir === 'right') {
      stadiumAudio.playWonTicketSound();
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    } else {
      stadiumAudio.playAddPickSound();
    }
    setCardIndex((prev) => (prev + 1) % swipeCards.length);
  };

  const handlePostBanter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBanterText.trim()) return;
    const newPost: BanterPost = {
      id: `post-${Date.now()}`,
      author: currentUser?.username || 'CyberStriker_99',
      avatar: currentUser?.avatar || '⚡',
      badge: 'Certified Baller ⚡',
      club: currentUser?.club || 'Arsenal',
      timeAgo: 'Just now',
      text: newBanterText.trim(),
      mediaTag: 'FAN SLANDER',
      likes: 1,
      commentsCount: 0,
    };
    setBanterPosts([newPost, ...banterPosts]);
    setNewBanterText('');
    phoneHardware.triggerHaptic('GOAL');
    stadiumAudio.playGoalCelebration();
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-mono text-xs overflow-x-hidden selection:bg-[#00e676] selection:text-black pb-20 lg:pb-6">
      
      {/* 1. COMPACT TOP HEADER */}
      <header className="sticky top-0 z-30 bg-neutral-950/90 backdrop-blur-xl border-b border-white/10 px-3 sm:px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00e676] via-[#a855f7] to-[#00f0ff] p-0.5 flex items-center justify-center shadow-lg">
            <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center text-sm">
              ⚡
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-xs sm:text-sm text-white tracking-wider">AURASCORE</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#00e676] text-black font-black">PRO</span>
            </div>
            <span className="text-[9px] text-gray-400 font-sans hidden sm:block">AI Sports Intelligence & Social Arena</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-black/60 border border-white/10 text-[10px]">
            <span className="text-gray-400">STASH:</span>
            <span className="font-bold text-[#ffd700]">{(currentUser?.aura_balance || 1450).toLocaleString()} AURA</span>
          </div>

          <Link
            href="/"
            className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-white/15 hover:border-[#00e676] text-[#00e676] font-bold text-[10px] flex items-center space-x-1 transition-all"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Live Arena</span>
          </Link>
        </div>
      </header>

      {/* 2. ADAPTIVE RESPONSIVE CONTAINER (1-COL MOBILE, 2-COL TABLET, 3-COL DESKTOP) */}
      <div className="max-w-[1700px] mx-auto p-3 sm:p-4 lg:p-6">
        
        {/* DESKTOP & TABLET 3-COLUMN / 2-COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          
          {/* ========================================================================= */}
          {/* COLUMN 1: LEFT SIDEBAR (PROFILE, BADGES, AURA STASH) - (lg:col-span-3)    */}
          {/* ========================================================================= */}
          <div className={cn(
            'space-y-4 lg:col-span-3',
            mobileTab !== 'VAULT' && 'hidden lg:block'
          )}>
            {/* Aura Profile Card */}
            <div className="p-4 rounded-3xl bg-neutral-900/80 backdrop-blur-xl border border-white/10 space-y-3.5 shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00e676] via-emerald-400 to-[#a855f7] p-0.5 shadow-lg">
                    <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center text-2xl">
                      {currentUser?.avatar || '⚡'}
                    </div>
                  </div>
                  <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-[#00e676] text-black font-black text-[8px]">
                    LVL 7
                  </span>
                </div>

                <div className="space-y-0.5">
                  <h2 className="text-sm font-black text-white">@{currentUser?.username || 'CyberStriker_99'}</h2>
                  <span className="px-2 py-0.5 rounded bg-[#ffd700]/20 border border-[#ffd700] text-[#ffd700] font-bold text-[8px] block w-fit">
                    {currentUser?.vip_tier || 'PLATINUM PRODIGY 👑'}
                  </span>
                  <span className="text-[9px] text-gray-400 block font-sans">
                    Loyalty: <strong className="text-[#00e676]">{currentUser?.club || 'Arsenal'}</strong>
                  </span>
                </div>
              </div>

              {/* Community Badges */}
              <div className="space-y-1 pt-1 border-t border-white/10">
                <span className="text-[9px] text-gray-400 font-bold block uppercase">Earned Badges</span>
                <div className="flex flex-wrap gap-1">
                  <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[#00f0ff] text-[8px]">
                    🌟 Early Scout
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[#00e676] text-[8px]">
                    ⚡ Certified Baller
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[#a855f7] text-[8px]">
                    🔮 Oracle Punter
                  </span>
                </div>
              </div>

              {/* Aura Wallet & Claim Bounty */}
              <div className="p-3 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-gray-400">AURA BALANCE:</span>
                  <span className="font-bold text-[#ffd700] text-sm font-mono">
                    {(currentUser?.aura_balance || 1450).toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={handleClaimDailyAura}
                  disabled={dailyClaimed}
                  className={cn(
                    'w-full py-2 rounded-xl font-bold text-[10px] shadow transition-all flex items-center justify-center space-x-1',
                    dailyClaimed
                      ? 'bg-white/10 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#ffd700] to-yellow-400 text-black hover:scale-105'
                  )}
                >
                  <Gift className="w-3 h-3" />
                  <span>{dailyClaimed ? 'Daily Claimed ✓' : 'Claim +150 Daily Aura'}</span>
                </button>
              </div>
            </div>

            {/* P2P Aura Gifting Vault */}
            <div className="p-4 rounded-3xl bg-neutral-900/80 border border-[#ffd700]/30 space-y-2.5">
              <span className="font-bold text-white text-[11px] block">P2P AURA TRANSFER</span>
              <input type="text" placeholder="Recipient @handle" className="w-full p-2 rounded-xl bg-black border border-white/15 text-white text-[10px] focus:outline-none" />
              <input type="number" placeholder="Amount (e.g. 100)" className="w-full p-2 rounded-xl bg-black border border-white/15 text-white text-[10px] focus:outline-none" />
              <button
                onClick={() => {
                  phoneHardware.triggerHaptic('AFRO_BEAT');
                  stadiumAudio.playWonTicketSound();
                  confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
                }}
                className="w-full py-2 rounded-xl bg-[#ffd700] text-black font-bold text-[10px]"
              >
                Send Gifted Aura ➔
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* COLUMN 2: CENTER ARENA (SWIPE STACK & POISSON ODDS) - (lg:col-span-5)      */}
          {/* ========================================================================= */}
          <div className={cn(
            'space-y-4 lg:col-span-5',
            mobileTab !== 'SWIPE' && 'hidden lg:block'
          )}>
            
            {/* Gesture Swipe Predictor Card */}
            <div className="p-5 rounded-3xl bg-neutral-900/90 backdrop-blur-xl border-2 border-[#00e676]/50 space-y-3.5 shadow-2xl text-center">
              <div className="flex items-center justify-between text-[10px] text-gray-400 border-b border-white/10 pb-2">
                <span className="font-bold text-[#00e676] flex items-center space-x-1">
                  <Flame className="w-3.5 h-3.5 text-[#ff3366] fill-[#ff3366]" />
                  <span>GESTURE PREDICTOR</span>
                </span>
                <span>Card {cardIndex + 1} of {swipeCards.length}</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={cardIndex}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.7}
                  onDragEnd={(e, { offset }) => {
                    if (offset.x < -80) handleSwipeCard('left');
                    else if (offset.x > 80) handleSwipeCard('right');
                  }}
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.88, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="p-5 rounded-2xl bg-black/80 border border-white/20 space-y-2.5 cursor-grab active:cursor-grabbing select-none shadow-xl"
                >
                  <span className="text-2xl block">⚽⚡</span>
                  <h3 className="font-black text-sm sm:text-base text-white">{swipeCards[cardIndex].match}</h3>
                  
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-bold">
                    <span className="text-gray-400 font-sans text-[10px]">{swipeCards[cardIndex].market}</span>
                    <span className="text-[#00e676]">{swipeCards[cardIndex].pick}</span>
                    <span className="text-[#ffd700]">@{swipeCards[cardIndex].odds}</span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
                    <span>Poisson Confidence: <strong className="text-[#00f0ff]">{swipeCards[cardIndex].conf}</strong></span>
                    <span>xG Curve: <strong className="text-white">{swipeCards[cardIndex].xG}</strong></span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Touch Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleSwipeCard('left')}
                  className="py-3 rounded-xl bg-[#ff3366]/20 border border-[#ff3366] text-[#ff3366] font-black text-xs hover:bg-[#ff3366] hover:text-white transition-all active:scale-95"
                >
                  🔴 PASS / SKIP
                </button>
                <button
                  onClick={() => handleSwipeCard('right')}
                  className="py-3 rounded-xl bg-[#00e676] text-black font-black text-xs hover:scale-105 transition-all shadow-md active:scale-95"
                >
                  🟢 LOCK PICK ➔
                </button>
              </div>
            </div>

            {/* Direct Affiliate Loaders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                href="https://stake.com/?c=bPn8D0iA"
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 rounded-2xl bg-gradient-to-r from-[#00e676] to-emerald-400 text-black font-black text-xs flex items-center justify-center space-x-1.5 text-center shadow-lg hover:scale-105 transition-all"
              >
                <span>Load on Stake.com (bPn8D0iA) ➔</span>
                <ExternalLink className="w-3 h-3 inline" />
              </a>

              <a
                href="https://22bet.com.ng/?tag=972744"
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 rounded-2xl bg-gradient-to-r from-[#00f0ff] to-blue-500 text-black font-black text-xs flex items-center justify-center space-x-1.5 text-center shadow-lg hover:scale-105 transition-all"
              >
                <span>Load on 22Bet (972744) ➔</span>
                <ExternalLink className="w-3 h-3 inline" />
              </a>
            </div>

            {/* Referral Attribution Studio */}
            <div className="p-4 rounded-3xl bg-neutral-900/80 border border-white/10 space-y-2">
              <span className="font-bold text-white text-[11px] block">YOUR TRACKABLE REFERRAL LINK</span>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  readOnly
                  value={`https://mivaj.com?ref=${currentUser?.username || 'CyberStriker_99'}`}
                  className="flex-1 p-2 rounded-xl bg-black border border-white/15 text-white text-[10px]"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://mivaj.com?ref=${currentUser?.username || 'CyberStriker_99'}`);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className="px-3 py-2 rounded-xl bg-[#00e676] text-black font-bold text-[10px]"
                >
                  {copiedLink ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* COLUMN 3: RIGHT RAIL (BANTER LOUNGE & MEME CARDS) - (lg:col-span-4)       */}
          {/* ========================================================================= */}
          <div className={cn(
            'space-y-4 lg:col-span-4',
            mobileTab !== 'BANTER' && 'hidden lg:block'
          )}>
            
            {/* Post Banter Box */}
            <form onSubmit={handlePostBanter} className="p-3.5 rounded-3xl bg-neutral-900 border border-white/15 space-y-2">
              <span className="font-bold text-white text-xs block">MATCH BANTER & MEME CARD</span>
              <textarea
                rows={2}
                value={newBanterText}
                onChange={(e) => setNewBanterText(e.target.value)}
                placeholder="Talk your slander..."
                className="w-full p-2.5 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:border-[#00e676] focus:outline-none"
              />
              <div className="flex justify-between items-center text-[9px] text-gray-400">
                <span>🔥 Earn +50 Aura</span>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-[#00e676] text-black font-bold text-[10px] hover:scale-105 transition-all"
                >
                  Post Slander ➔
                </button>
              </div>
            </form>

            {/* Banter Feed */}
            <div className="space-y-3">
              {banterPosts.map((p) => (
                <div key={p.id} className="p-3.5 rounded-2xl bg-neutral-900/90 border border-white/10 space-y-2 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{p.avatar}</span>
                      <div>
                        <span className="font-bold text-white text-xs block">@{p.author}</span>
                        <span className="text-[8px] text-gray-400">{p.club} &bull; {p.timeAgo}</span>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-[#a855f7]/20 text-[#a855f7] font-bold text-[8px]">
                      {p.mediaTag}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-200 font-sans leading-relaxed">{p.text}</p>

                  {p.memeCaption && (
                    <div className="p-2 rounded-xl bg-black/60 border border-[#00e676]/30 text-center">
                      <p className="text-[9px] font-black text-[#ffd700] font-mono">"{p.memeCaption}"</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-white/10 pt-1.5 text-[9px] text-gray-400">
                    <button
                      onClick={() => setLikedPosts((prev) => ({ ...prev, [p.id]: !prev[p.id] }))}
                      className={cn('flex items-center space-x-1 font-bold', likedPosts[p.id] && 'text-[#ff3366]')}
                    >
                      <Heart className={cn('w-3 h-3', likedPosts[p.id] && 'fill-[#ff3366]')} />
                      <span>{likedPosts[p.id] ? p.likes + 1 : p.likes}</span>
                    </button>
                    <span>{p.commentsCount} comments</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

      {/* 3. MOBILE BOTTOM STICKY NAVIGATION DOCK (VISIBLE ON MOBILE ONLY) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-2xl border-t border-white/10 px-3 py-2 flex items-center justify-around text-[10px]">
        {[
          { key: 'SWIPE', label: 'Swipe Deck', icon: Zap },
          { key: 'BANTER', label: 'Banter Lounge', icon: MessageSquare },
          { key: 'VAULT', label: 'Aura Vault', icon: Gift },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setMobileTab(tab.key as any);
                phoneHardware.triggerHaptic('SELECTION');
              }}
              className={cn(
                'flex flex-col items-center space-y-0.5 py-1 px-3 rounded-xl transition-all',
                mobileTab === tab.key
                  ? 'text-[#00e676] font-bold bg-white/5'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}
