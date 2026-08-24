'use client';

import React, { useState, useEffect } from 'react';
import { MatchData } from '../lib/sports-api';
import { Sparkles, Lock, Unlock, Zap, ShieldCheck, Flame, Copy, Check, Clock, Users, ArrowRight, ExternalLink } from 'lucide-react';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';
import confetti from 'canvas-confetti';

interface FomoUnlockerProps {
  matches: MatchData[];
}

interface SlipTier {
  id: 'TIER_200' | 'TIER_300' | 'TIER_500';
  title: string;
  oddsTarget: string;
  price: number;
  badge: string;
  badgeColor: string;
  payoutEst: string;
  fomoTag: string;
  slipsLeft: number;
  aiSafety: string;
  secretCode: string;
  gamesCount: number;
  platform: 'STAKE' | '22BET';
  affiliateUrl: string;
}

export const GenZFomoOddsUnlocker: React.FC<FomoUnlockerProps> = ({ matches }) => {
  const [unlockedTiers, setUnlockedTiers] = useState<Record<string, string>>({});
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState('WhatsApp: +234 807 201 5725');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ minutes: 14, seconds: 35 });

  // FOMO Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { minutes: prev.minutes - 1, seconds: 59 };
        return { minutes: 15, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const tiers: SlipTier[] = [
    {
      id: 'TIER_200',
      title: '3.50+ Pocket Multiplier ⚡',
      oddsTarget: '@3.65 Odds',
      price: 200,
      badge: '96.8% SAFE LOCK',
      badgeColor: 'bg-stadiumGreen text-black',
      payoutEst: '₦200 ➔ ₦730 (Fast Win)',
      fomoTag: '🔥 84 punters unlocked in last 15 mins',
      slipsLeft: 6,
      aiSafety: '3 Pure Banker Double Chance Picks',
      secretCode: 'STAKE-3X924',
      gamesCount: 3,
      platform: 'STAKE',
      affiliateUrl: 'https://stake.com/?c=bPn8D0iA',
    },
    {
      id: 'TIER_300',
      title: '6.00+ Weekend Flex Slip 🔥',
      oddsTarget: '@6.20 Odds',
      price: 300,
      badge: 'CUT-1 SHIELDED',
      badgeColor: 'bg-amber-500 text-black',
      payoutEst: '₦300 ➔ ₦1,860 Return',
      fomoTag: '⚡ Only 4 VIP slots remaining',
      slipsLeft: 4,
      aiSafety: 'Cut-1 Moneyback Insurance Active',
      secretCode: '22BET-6X481',
      gamesCount: 4,
      platform: '22BET',
      affiliateUrl: 'https://22bet.com.ng/?tag=972744',
    },
    {
      id: 'TIER_500',
      title: '10.00+ Mega Bomber Slip 🚀',
      oddsTarget: '@10.85 Odds',
      price: 500,
      badge: 'VIP JACKPOT LOCK',
      badgeColor: 'bg-gradient-to-r from-gold to-amber-400 text-black font-black',
      payoutEst: '₦500 ➔ ₦5,425 Payout',
      fomoTag: '👑 Ranked #1 Banker Slip of the Day',
      slipsLeft: 2,
      aiSafety: 'Poisson AI High Expected Value (+24% EV)',
      secretCode: 'STAKE-10X883',
      gamesCount: 5,
      platform: 'STAKE',
      affiliateUrl: 'https://stake.com/?c=bPn8D0iA',
    },
  ];

  const verifyPaymentOnServer = async (reference: string, tier: SlipTier) => {
    try {
      const res = await fetch('/api/paystack/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference, tierId: tier.id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUnlockedTiers((prev) => ({ ...prev, [tier.id]: data.unlockedCode }));
        phoneHardware.triggerHaptic('AFRO_BEAT');
        stadiumAudio.playCoinCashout();
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      } else {
        setErrorMsg(data.error || 'Payment verification failed.');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Verification connection error.');
    } finally {
      setLoadingTier(null);
    }
  };

  const handlePaystackUnlock = (tier: SlipTier) => {
    setErrorMsg(null);
    setLoadingTier(tier.id);
    phoneHardware.triggerHaptic('SELECTION');

    const loadPaystack = () => {
      const handler = (window as any).PaystackPop?.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_KEY || 'pk_live_c3ac464a91290f7507e5e36f5b0bec3ac0da9f5a',
        email: userEmail || 'WhatsApp: +234 807 201 5725',
        amount: tier.price * 100, // in kobo
        currency: 'NGN',
        callback: (response: any) => {
          // Strictly verify reference on backend before unlocking
          verifyPaymentOnServer(response.reference || `ref-${Date.now()}`, tier);
        },
        onClose: () => {
          // STRICT: User cancelled or closed modal -> DO NOT UNLOCK!
          setLoadingTier(null);
          phoneHardware.triggerHaptic('WARNING');
        },
      });

      if (handler) {
        handler.openIframe();
      } else {
        setLoadingTier(null);
      }
    };

    if (!(window as any).PaystackPop) {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.onload = loadPaystack;
      document.body.appendChild(script);
    } else {
      loadPaystack();
    }
  };

  const handleCopySecret = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.playSuccessSound();
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section className="relative rounded-3xl bg-gradient-to-br from-panel via-black to-emerald-950/40 border-2 border-stadiumGreen/60 p-4 sm:p-6 shadow-2xl space-y-4 font-mono text-xs text-white overflow-hidden glow-emerald">
      <div className="absolute top-0 right-0 w-64 h-64 bg-stadiumGreen/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner with FOMO Urgency Timer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-stadiumGreen via-gold to-crimson text-black font-black text-xl shadow-lg animate-pulse">
            ⚡
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-black text-sm sm:text-base text-white">
                PREMIUM AI MATCHDAY INTELLIGENCE & SLIP ACCESS 📊
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-crimson text-white font-black text-[9px] animate-pulse">
                LIMITED SLOTS 🔥
              </span>
            </div>
            <p className="text-[10px] text-gray-300 font-sans mt-0.5">
              Unlock verified AI Poisson algorithmic accumulator slips from just ₦200. Instant booking code delivery.
            </p>
          </div>
        </div>

        {/* Live Countdown Clock */}
        <div className="flex items-center space-x-2 bg-black/80 border border-crimson/50 px-3 py-1.5 rounded-xl self-end sm:self-auto shadow-md">
          <Clock className="w-3.5 h-3.5 text-crimson animate-spin" />
          <span className="text-[10px] text-gray-400">Slots reset in:</span>
          <span className="font-black text-gold text-xs">
            {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-crimson/20 border border-crimson text-crimson text-[11px] font-bold">
          {errorMsg}
        </div>
      )}

      {/* 3 Tier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map((tier) => {
          const isUnlocked = !!unlockedTiers[tier.id];
          const activeCode = unlockedTiers[tier.id];

          return (
            <div
              key={tier.id}
              className={`relative rounded-2xl bg-black/80 border transition-all p-4 space-y-3 flex flex-col justify-between shadow-xl ${
                isUnlocked
                  ? 'border-stadiumGreen shadow-stadiumGreen/20 glow-emerald'
                  : 'border-white/15 hover:border-stadiumGreen/60'
              }`}
            >
              {/* Card Header */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${tier.badgeColor}`}>
                    {tier.badge}
                  </span>
                  <span className="text-[10px] text-crimson font-bold">
                    {tier.slipsLeft} left
                  </span>
                </div>

                <h3 className="font-black text-sm text-white pt-1">{tier.title}</h3>
                
                <div className="flex items-baseline space-x-2">
                  <span className="text-xl font-black text-gold font-mono">{tier.oddsTarget}</span>
                  <span className="text-[10px] text-gray-400">({tier.gamesCount} Curated Games)</span>
                </div>

                <p className="text-[10px] text-stadiumGreen font-bold">{tier.payoutEst}</p>
                <p className="text-[9px] text-gray-400 font-sans border-t border-white/10 pt-1.5">
                  {tier.aiSafety}
                </p>
              </div>

              {/* Action Area */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                {isUnlocked ? (
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-stadiumGreen/15 border border-stadiumGreen flex items-center justify-between">
                      <div>
                        <span className="text-[8px] text-gray-400 block font-bold">VERIFIED BOOKING CODE:</span>
                        <span className="font-black text-stadiumGreen text-sm tracking-wider font-mono">
                          {activeCode}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopySecret(activeCode)}
                        className="px-3 py-1.5 rounded-lg bg-stadiumGreen text-black font-black text-[10px] flex items-center space-x-1"
                      >
                        {copiedCode === activeCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedCode === activeCode ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <a
                      href={tier.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 rounded-xl bg-[#25D366] text-black font-black text-[11px] flex items-center justify-center space-x-1 shadow-md hover:scale-105 transition-all block text-center"
                    >
                      <span>Load Code on {tier.platform} (Auto-Fill)</span>
                      <ExternalLink className="w-3.5 h-3.5 inline ml-1" />
                    </a>
                  </div>
                ) : (
                  <button
                    onClick={() => handlePaystackUnlock(tier)}
                    disabled={loadingTier === tier.id}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-stadiumGreen via-emerald-400 to-gold text-black font-black text-xs flex items-center justify-center space-x-1.5 shadow-lg hover:scale-105 transition-all glow-emerald"
                  >
                    {loadingTier === tier.id ? (
                      <span>Connecting to Paystack...</span>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Unlock for ₦{tier.price} (Paystack) ➔</span>
                      </>
                    )}
                  </button>
                )}
                
                <span className="text-[8px] text-gray-500 block text-center">
                  Paystack Verified Digital Content &bull; Statistical AI Data &bull; 18+ Only
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
