'use client';

import React, { useState, useEffect } from 'react';
import {
  X, ShieldCheck, Zap, Trophy, Flame, Gift, Send, Share2, Copy, Check, ExternalLink,
  DollarSign, TrendingUp, Award, User, Clock, CheckCircle2, Lock, Building, Scale,
  QrCode, Users, ArrowUpRight, Wallet, ShoppingBag, Settings, RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { stadiumAudio } from '../lib/sound-synthesizer';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { ReferralEngine, UserReferralStats } from '../lib/referral-engine';

interface ProfileModalProps {
  onClose: () => void;
}

type UserSection = 'OVERVIEW' | 'REFERRAL_STUDIO' | 'AURA_VAULT' | 'ROI_ANALYTICS' | 'REWARDS_SHOP' | 'KYC_SETTINGS';

export const UserProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
  const [section, setSection] = useState<UserSection>('OVERVIEW');
  const [username, setUsername] = useState<string>('mivaj_punter');
  const [auraBalance, setAuraBalance] = useState<number>(1450);
  const [referralStats, setReferralStats] = useState<UserReferralStats | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [giftRecipient, setGiftRecipient] = useState<string>('');
  const [giftAmount, setGiftAmount] = useState<number>(250);
  const [giftMsg, setGiftMsg] = useState<string | null>(null);
  const [dailyClaimed, setDailyClaimed] = useState<boolean>(false);

  useEffect(() => {
    setReferralStats(ReferralEngine.getStats(username));
  }, [username]);

  const handleClaimDailyAura = () => {
    if (dailyClaimed) return;
    setDailyClaimed(true);
    setAuraBalance((prev) => prev + 150);
    phoneHardware.triggerHaptic('AFRO_BEAT');
    stadiumAudio.playAfrobeatVictory();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  const handleCopyReferral = () => {
    if (!referralStats) return;
    navigator.clipboard.writeText(referralStats.referralUrl);
    setCopiedLink(true);
    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.playSuccessSound();
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendP2PGift = () => {
    if (!giftRecipient.trim() || giftAmount <= 0 || giftAmount > auraBalance) return;
    setAuraBalance((prev) => prev - giftAmount);
    setGiftMsg(`Sent ${giftAmount} Aura to @${giftRecipient}!`);
    phoneHardware.triggerHaptic('TALKING_DRUM');
    stadiumAudio.playTalkingDrumBeat();
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => {
      setGiftRecipient('');
      setGiftMsg(null);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-4 animate-fadeIn font-mono text-xs text-white">
      <div className="relative w-full max-w-5xl glass-panel-premium rounded-3xl border-2 border-stadiumGreen/60 p-4 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-panel hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-all absolute top-4 right-4 z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* User Identity Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-stadiumGreen via-gold to-cyan-400 p-0.5 shadow-lg flex items-center justify-center flex-shrink-0">
              <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center text-2xl">
                👤
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-black text-base sm:text-lg text-white">WhatsApp: +234 807 201 5725</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-gold text-black font-black text-[9px] uppercase tracking-wider">
                  TIER: {referralStats?.tier || 'GOLD'} 👑
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-sans mt-0.5">
                Verified Community Member &bull; ID: <strong className="text-stadiumGreen font-mono">MIVAJ-NG-88924</strong> &bull; Multiplier: <strong className="text-gold font-mono">{referralStats?.commissionMultiplier || 1.5}x</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-black/80 p-3 rounded-2xl border border-gold/40">
            <div>
              <span className="text-[8px] text-gray-400 block font-bold">TOTAL AURA VAULT</span>
              <span className="text-lg font-black text-gold font-mono">{auraBalance.toLocaleString()} AURA</span>
            </div>
            <div className="border-l border-white/10 pl-3">
              <span className="text-[8px] text-gray-400 block font-bold">COMMISSION EARNED</span>
              <span className="text-lg font-black text-stadiumGreen font-mono">₦{referralStats?.totalNairaEarned.toLocaleString() || '13,500'}</span>
            </div>
          </div>
        </div>

        {/* 6-Section Modern Navigation Pills */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2">
          {[
            { key: 'OVERVIEW', label: '🏠 Overview & Level XP' },
            { key: 'REFERRAL_STUDIO', label: '👥 Referral Studio & Tracker' },
            { key: 'AURA_VAULT', label: '💎 Aura Vault & P2P Gifting' },
            { key: 'ROI_ANALYTICS', label: '📈 Performance & Banker ROI' },
            { key: 'REWARDS_SHOP', label: '🛍️ VIP Rewards & Cashout' },
            { key: 'KYC_SETTINGS', label: '⚙️ Security & Bank Details' },
          ].map((sec) => (
            <button
              key={sec.key}
              onClick={() => setSection(sec.key as UserSection)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
                section === sec.key
                  ? 'bg-stadiumGreen text-black shadow-md'
                  : 'bg-panel text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              <span>{sec.label}</span>
            </button>
          ))}
        </div>

        {/* SECTION 1: OVERVIEW & LEVEL PROGRESSION */}
        {section === 'OVERVIEW' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-black/60 border border-stadiumGreen/40 space-y-1">
                <span className="text-[9px] text-gray-400 block font-bold">COMMUNITY RANK</span>
                <span className="text-xl font-black text-stadiumGreen">#14 Top Punter</span>
                <span className="text-[10px] text-gray-400 block">Out of 14,820 active punters</span>
              </div>
              <div className="p-4 rounded-2xl bg-black/60 border border-gold/40 space-y-1">
                <span className="text-[9px] text-gray-400 block font-bold">DAILY STREAK STATUS</span>
                <span className="text-xl font-black text-gold">14 Days Active 🔥</span>
                <span className="text-[10px] text-gray-400 block">+150 Aura bonus daily</span>
              </div>
              <div className="p-4 rounded-2xl bg-black/60 border border-cyan-400/40 space-y-1">
                <span className="text-[9px] text-gray-400 block font-bold">AFFILIATE STATUS</span>
                <span className="text-xl font-black text-cyan-400">{referralStats?.totalSignups || 27} Active Referrals</span>
                <span className="text-[10px] text-gray-400 block">Gold Tier Influencer</span>
              </div>
            </div>

            {/* XP Level Progress Bar */}
            <div className="p-4 rounded-2xl bg-panel border border-white/10 space-y-2">
              <div className="flex justify-between text-[11px] font-black">
                <span className="text-white">Level 7: Platinum Prodigy</span>
                <span className="text-gold">1,450 / 2,000 XP to Diamond Influencer (72%)</span>
              </div>
              <div className="h-3 rounded-full bg-black/80 overflow-hidden border border-white/10 p-0.5">
                <div style={{ width: '72%' }} className="h-full bg-gradient-to-r from-stadiumGreen to-gold rounded-full transition-all duration-500 shadow-md glow-emerald" />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: REFERRAL & ATTRIBUTION TRACKING STUDIO */}
        {section === 'REFERRAL_STUDIO' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10">
                <span className="text-[9px] text-gray-400 block font-bold">TOTAL CLICKS</span>
                <span className="text-xl font-black text-white font-mono">{referralStats?.totalClicks || 248}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/60 border border-stadiumGreen/40">
                <span className="text-[9px] text-gray-400 block font-bold">TOTAL SIGNUPS</span>
                <span className="text-xl font-black text-stadiumGreen font-mono">{referralStats?.totalSignups || 27}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/60 border border-gold/40">
                <span className="text-[9px] text-gray-400 block font-bold">AURA EARNED</span>
                <span className="text-xl font-black text-gold font-mono">+{referralStats?.totalAuraEarned.toLocaleString() || '13,500'}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/60 border border-cyan-400/40">
                <span className="text-[9px] text-gray-400 block font-bold">NAIRA COMMISSION</span>
                <span className="text-xl font-black text-cyan-400 font-mono">₦{referralStats?.totalNairaEarned.toLocaleString() || '13,500'}</span>
              </div>
            </div>

            {/* Custom Link Copy Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-stadiumGreen/20 via-panel to-gold/15 border-2 border-stadiumGreen space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-stadiumGreen flex items-center space-x-1.5">
                  <Share2 className="w-4 h-4" />
                  <span>YOUR EXCLUSIVE TRACKABLE REFERRAL LINK</span>
                </span>
                <span className="text-[10px] text-gold font-bold">Earn ₦500 + 750 Aura / Signup</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={referralStats?.referralUrl || 'https://mivaj.com?ref=mivaj_punter'}
                  className="flex-1 p-2.5 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:outline-none"
                />
                <button
                  onClick={handleCopyReferral}
                  className="px-5 py-2.5 rounded-xl bg-stadiumGreen text-black font-black text-xs flex items-center space-x-1 shadow-md hover:scale-105 transition-all flex-shrink-0"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* Live Attributed Referrals Ledger */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-black text-white text-xs">RECENT ATTRIBUTED REFERRALS LEDGER</span>
                <span className="text-[10px] text-stadiumGreen font-bold">100% Verified Track Record</span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {referralStats?.recentReferrals.map((rec) => (
                  <div key={rec.id} className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-[11px]">
                    <div>
                      <span className="font-bold text-white block">@{rec.referredUser}</span>
                      <span className="text-[9px] text-gray-400 font-sans">{rec.date} &bull; Status: <strong className="text-stadiumGreen">{rec.status}</strong></span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-gold font-bold block">+{rec.auraEarned} Aura</span>
                      <span className="text-stadiumGreen font-bold block">+₦{rec.nairaEarned}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: AURA VAULT & P2P GIFTING */}
        {section === 'AURA_VAULT' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Daily Claim Box */}
              <div className="p-4 rounded-2xl bg-black/60 border border-stadiumGreen/40 space-y-3 flex flex-col justify-between">
                <div>
                  <span className="font-black text-stadiumGreen text-xs block">DAILY CHECK-IN REWARD</span>
                  <p className="text-[11px] text-gray-300 font-sans mt-1">
                    Log in every day to claim your free +150 Aura points and keep your streak multiplier active.
                  </p>
                </div>
                <button
                  onClick={handleClaimDailyAura}
                  disabled={dailyClaimed}
                  className={`w-full py-2.5 rounded-xl font-black text-xs flex items-center justify-center space-x-1 transition-all ${
                    dailyClaimed ? 'bg-white/10 text-gray-400' : 'bg-stadiumGreen text-black hover:scale-105 shadow-lg glow-emerald'
                  }`}
                >
                  {dailyClaimed ? 'Claimed Today ✓' : 'Claim +150 Aura ➔'}
                </button>
              </div>

              {/* P2P Gifting Box */}
              <div className="p-4 rounded-2xl bg-black/60 border border-cyan-400/40 space-y-3">
                <span className="font-black text-cyan-400 text-xs block">P2P AURA TRANSFER (TIP FRIENDS)</span>
                <input
                  type="text"
                  placeholder="Recipient Username (e.g. Tobi_99)"
                  value={giftRecipient}
                  onChange={(e) => setGiftRecipient(e.target.value)}
                  className="w-full p-2 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:outline-none"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Amount"
                    value={giftAmount}
                    onChange={(e) => setGiftAmount(parseInt(e.target.value, 10) || 0)}
                    className="w-24 p-2 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:outline-none"
                  />
                  <button
                    onClick={handleSendP2PGift}
                    className="flex-1 py-2 rounded-xl bg-cyan-400 text-black font-black text-xs flex items-center justify-center space-x-1"
                  >
                    <Gift className="w-3.5 h-3.5 text-black" />
                    <span>Send Gift</span>
                  </button>
                </div>
                {giftMsg && <span className="text-[10px] text-stadiumGreen block font-bold">{giftMsg}</span>}
              </div>

            </div>
          </div>
        )}

        {/* SECTION 4: ROI & PERFORMANCE ANALYTICS */}
        {section === 'ROI_ANALYTICS' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-black/60 border border-stadiumGreen/40 space-y-1">
                <span className="text-[9px] text-gray-400 block font-bold">ALL-TIME WIN ACCURACY</span>
                <span className="text-2xl font-black text-stadiumGreen font-mono">94.8%</span>
                <span className="text-[10px] text-gray-400 block">420+ Settled Predictions</span>
              </div>
              <div className="p-4 rounded-2xl bg-black/60 border border-gold/40 space-y-1">
                <span className="text-[9px] text-gray-400 block font-bold">TOTAL ESTIMATED PROFIT</span>
                <span className="text-2xl font-black text-gold font-mono">+₦148,500</span>
                <span className="text-[10px] text-gray-400 block">Calculated on Flat ₦1k Stakes</span>
              </div>
              <div className="p-4 rounded-2xl bg-black/60 border border-cyan-400/40 space-y-1">
                <span className="text-[9px] text-gray-400 block font-bold">MAX SWIPE STREAK</span>
                <span className="text-2xl font-black text-cyan-400 font-mono">14 Won in a Row 🔥</span>
                <span className="text-[10px] text-gray-400 block">Rank #1 Global Leaderboard</span>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 5: REWARDS SHOP */}
        {section === 'REWARDS_SHOP' && (
          <div className="space-y-3 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="font-black text-white text-xs block">VIP 10.00 Odds Ticket Unlock</span>
                  <span className="text-[10px] text-gray-400">Unlock today's curated multi-match ticket.</span>
                </div>
                <button className="w-full py-1.5 rounded-xl bg-gold text-black font-black text-[10px]">
                  Redeem 300 Aura
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="font-black text-white text-xs block">₦1,000 Airtime / Paystack Top-Up</span>
                  <span className="text-[10px] text-gray-400">Direct top-up to your MTN/Airtel/Glo line.</span>
                </div>
                <button className="w-full py-1.5 rounded-xl bg-stadiumGreen text-black font-black text-[10px]">
                  Redeem 2,000 Aura
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="font-black text-white text-xs block">"Certified Ball Knower" VIP Badge</span>
                  <span className="text-[10px] text-gray-400">Permanent crown flair on live watch-party chat.</span>
                </div>
                <button className="w-full py-1.5 rounded-xl bg-cyan-400 text-black font-black text-[10px]">
                  Redeem 1,000 Aura
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 6: KYC & SETTINGS */}
        {section === 'KYC_SETTINGS' && (
          <div className="space-y-3 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
              <span className="font-black text-white text-xs block">PAYSTACK NIGERIAN BANK PAYOUT DETAILS</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Bank Name (e.g. GTBank, Kuda, Zenith)"
                  defaultValue="Kuda Bank"
                  className="p-2.5 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Account Number (10 Digits)"
                  defaultValue="2048918241"
                  className="p-2.5 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:outline-none"
                />
              </div>
              <button
                onClick={() => {
                  phoneHardware.triggerHaptic('SUCCESS');
                  stadiumAudio.playSuccessSound();
                }}
                className="px-5 py-2 rounded-xl bg-stadiumGreen text-black font-black text-xs"
              >
                Save Payout Account ✓
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
