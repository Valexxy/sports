'use client';

import React, { useState, useEffect } from 'react';
import {
  User, X, ShieldCheck, Zap, Star, Trophy, Sparkles, Ticket, Sun, Moon,
  LogOut, Check, Lock, Mail, Phone, Flame, Award, Bell, Settings,
  Gift, Share2, Copy, ExternalLink, QrCode, ArrowRight, Chrome
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { stadiumAudio } from '../lib/sound-synthesizer';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { ReferralEngine, UserReferralStats } from '../lib/referral-engine';

interface AuthDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  followedMatchIds?: string[];
  followedLeagues?: string[];
  currentTheme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export interface UserSession {
  isLoggedIn: boolean;
  username: string;
  avatar: string;
  club: string;
  email: string;
  phone: string;
  auraBalance: number;
  vipTier: 'DIAMOND PRODIGY 👑' | 'GOLD INFLUENCER ⚡' | 'STADIUM MEMBER';
  memberSince: string;
  winRate: number;
  totalPicks: number;
}

const AVATARS = ['⚡', '👑', '🦁', '🦅', '🐐', '🔥', '💎', '🚀'];
const CLUBS = [
  { name: 'Arsenal', flag: '🔴⚪' },
  { name: 'Chelsea', flag: '🔵🦁' },
  { name: 'Man United', flag: '🔴👹' },
  { name: 'Real Madrid', flag: '⚪👑' },
  { name: 'Barcelona', flag: '🔵🔴' },
  { name: 'Super Eagles', flag: '🇳🇬🦅' },
];

export const AuthDashboardModal: React.FC<AuthDashboardModalProps> = ({
  isOpen,
  onClose,
  followedMatchIds = [],
  followedLeagues = [],
  currentTheme = 'dark',
  onToggleTheme,
}) => {
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('REGISTER');
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'REFERRALS' | 'AURA_VAULT' | 'PERFORMANCE' | 'SETTINGS'>('OVERVIEW');

  // Input states
  const [selectedAvatar, setSelectedAvatar] = useState('⚡');
  const [selectedClub, setSelectedClub] = useState('Arsenal');
  const [inputUsername, setInputUsername] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputPhone, setInputPhone] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [copiedRef, setCopiedRef] = useState(false);

  // Session state with localStorage persistence
  const [session, setSession] = useState<UserSession>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mivaj_user_session');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return {
      isLoggedIn: false,
      username: '',
      avatar: '⚡',
      club: 'Arsenal',
      email: '',
      phone: '',
      auraBalance: 0,
      vipTier: 'STADIUM MEMBER',
      memberSince: 'Aug 2026',
      winRate: 94.8,
      totalPicks: 24,
    };
  });

  const [refStats, setRefStats] = useState<UserReferralStats | null>(null);

  useEffect(() => {
    if (session.username) {
      setRefStats(ReferralEngine.getStats(session.username));
    }
  }, [session.username]);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const uname = inputUsername.trim() || `Striker_${Math.floor(100 + Math.random() * 900)}`;
    const uemail = inputEmail.trim() || `${uname.toLowerCase()}@mivaj.com`;

    const newSession: UserSession = {
      isLoggedIn: true,
      username: uname,
      avatar: selectedAvatar,
      club: selectedClub,
      email: uemail,
      phone: inputPhone,
      auraBalance: 500, // Instant Welcome Bounty
      vipTier: 'GOLD INFLUENCER ⚡',
      memberSince: 'Aug 2026',
      winRate: 94.8,
      totalPicks: 24,
    };

    setSession(newSession);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mivaj_user_session', JSON.stringify(newSession));
      localStorage.setItem('mivaj_onboarding_completed', 'true');
    }

    phoneHardware.triggerHaptic('GOAL');
    stadiumAudio.playGoalCelebration();
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const uname = inputUsername.trim() || 'CyberStriker_99';
    const uemail = inputEmail.trim() || 'striker@mivaj.com';

    const newSession: UserSession = {
      isLoggedIn: true,
      username: uname,
      avatar: selectedAvatar,
      club: selectedClub,
      email: uemail,
      phone: inputPhone || '+234 807 201 5725',
      auraBalance: 1450,
      vipTier: 'DIAMOND PRODIGY 👑',
      memberSince: 'Aug 2026',
      winRate: 94.8,
      totalPicks: 42,
    };

    setSession(newSession);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mivaj_user_session', JSON.stringify(newSession));
    }

    phoneHardware.triggerHaptic('AFRO_BEAT');
    stadiumAudio.playAfrobeatVictory();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  const handleSocial1Tap = (provider: string) => {
    const uname = `${provider}_Punter`;
    const newSession: UserSession = {
      isLoggedIn: true,
      username: uname,
      avatar: '🚀',
      club: 'Arsenal',
      email: `${uname.toLowerCase()}@gmail.com`,
      phone: '',
      auraBalance: 500,
      vipTier: 'GOLD INFLUENCER ⚡',
      memberSince: 'Aug 2026',
      winRate: 94.8,
      totalPicks: 18,
    };
    setSession(newSession);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mivaj_user_session', JSON.stringify(newSession));
    }
    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.playSuccessSound();
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });
  };

  const handleLogout = () => {
    const reset: UserSession = {
      isLoggedIn: false,
      username: '',
      avatar: '⚡',
      club: 'Arsenal',
      email: '',
      phone: '',
      auraBalance: 0,
      vipTier: 'STADIUM MEMBER',
      memberSince: 'Aug 2026',
      winRate: 0,
      totalPicks: 0,
    };
    setSession(reset);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mivaj_user_session');
    }
    phoneHardware.triggerHaptic('WARNING');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-2xl animate-fadeIn font-mono text-xs text-white">
      <div className="glass-panel-premium max-w-2xl w-full rounded-3xl border-2 border-stadiumGreen/60 p-4 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto glow-emerald">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-gradient-to-tr from-stadiumGreen via-gold to-cyan-400 text-black font-black text-base shadow-lg">
              ⚡
            </span>
            <div>
              <h2 className="font-black text-sm sm:text-base text-white">
                {session.isLoggedIn ? 'MIVAJ USER COMMAND COCKPIT' : 'MIVAJ GLOBAL GEN-Z AUTHENTICATION'}
              </h2>
              <p className="text-[10px] text-gray-400 font-sans">
                {session.isLoggedIn ? 'Manage your Aura economy, referrals, and Banker ROI' : '1-Tap Sign In & Instant +500 Free Aura Welcome Bounty'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-panel hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* LOGGED IN USER VIEW */}
        {session.isLoggedIn ? (
          <div className="space-y-4 animate-fadeIn">
            {/* Identity Card */}
            <div className="p-4 rounded-2xl bg-black/70 border border-stadiumGreen/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-stadiumGreen text-black flex items-center justify-center text-2xl font-black shadow-md">
                  {session.avatar}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-black text-sm text-white">@{session.username}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-gold text-black font-black text-[9px]">
                      {session.vipTier}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-sans">
                    Loyalty Club: <strong className="text-stadiumGreen">{session.club}</strong> &bull; Member Since: {session.memberSince}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-white/5 p-2.5 rounded-xl border border-white/10">
                <div>
                  <span className="text-[8px] text-gray-400 block font-bold">AURA BALANCE</span>
                  <span className="text-base font-black text-gold font-mono">{session.auraBalance} AURA</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-crimson/20 hover:bg-crimson text-crimson hover:text-white transition-all"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Navigation Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2">
              {[
                { key: 'OVERVIEW', label: '🏠 Overview' },
                { key: 'REFERRALS', label: '👥 Referral Studio' },
                { key: 'AURA_VAULT', label: '💎 Aura Vault' },
                { key: 'PERFORMANCE', label: '📈 Win ROI' },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                    activeTab === t.key
                      ? 'bg-stadiumGreen text-black shadow-md'
                      : 'bg-panel text-gray-400 hover:text-white border border-white/10'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {activeTab === 'OVERVIEW' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                  <span className="text-[9px] text-gray-400 block font-bold">WIN ACCURACY</span>
                  <span className="text-xl font-black text-stadiumGreen font-mono">{session.winRate}%</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/60 border border-gold/40 space-y-1">
                  <span className="text-[9px] text-gray-400 block font-bold">ACTIVE REFERRALS</span>
                  <span className="text-xl font-black text-gold font-mono">{refStats?.totalSignups || 0} Punters</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/60 border border-cyan-400/40 space-y-1">
                  <span className="text-[9px] text-gray-400 block font-bold">COMMISSION EARNED</span>
                  <span className="text-xl font-black text-cyan-400 font-mono">₦{refStats?.totalNairaEarned.toLocaleString() || '0'}</span>
                </div>
              </div>
            )}

            {activeTab === 'REFERRALS' && (
              <div className="p-4 rounded-2xl bg-black/60 border border-stadiumGreen/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-white text-xs">YOUR TRACKABLE REFERRAL LINK</span>
                  <span className="text-[10px] text-gold font-bold">Earn ₦500 + 750 Aura / Friend</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`https://mivaj.com?ref=${session.username}`}
                    className="flex-1 p-2 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`https://mivaj.com?ref=${session.username}`);
                      setCopiedRef(true);
                      phoneHardware.triggerHaptic('SUCCESS');
                      setTimeout(() => setCopiedRef(false), 2000);
                    }}
                    className="px-4 py-2 rounded-xl bg-stadiumGreen text-black font-black text-xs"
                  >
                    {copiedRef ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'AURA_VAULT' && (
              <div className="p-4 rounded-2xl bg-black/60 border border-gold/40 space-y-2">
                <span className="font-black text-gold text-xs block">DAILY STREAK & AURA VAULT</span>
                <p className="text-[11px] text-gray-300 font-sans">
                  Keep your daily check-in streak alive to maintain your 1.5x commission multiplier!
                </p>
              </div>
            )}

            {activeTab === 'PERFORMANCE' && (
              <div className="p-4 rounded-2xl bg-black/60 border border-cyan-400/40 space-y-2">
                <span className="font-black text-cyan-400 text-xs block">VERIFIED STATISTICAL YIELD</span>
                <p className="text-[11px] text-gray-300 font-sans">
                  Your followed slips are audited 24/7 against official referee match score sheets.
                </p>
              </div>
            )}

          </div>
        ) : (
          /* LOGGED OUT: INTERNATIONAL GEN-Z AUTHENTICATION FORM */
          <div className="space-y-4 animate-fadeIn">
            
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
              <button
                onClick={() => setAuthMode('REGISTER')}
                className={`py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center space-x-1.5 ${
                  authMode === 'REGISTER'
                    ? 'bg-stadiumGreen text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>⚡ Create Pass (+500 Aura)</span>
              </button>
              <button
                onClick={() => setAuthMode('LOGIN')}
                className={`py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center space-x-1.5 ${
                  authMode === 'LOGIN'
                    ? 'bg-stadiumGreen text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>🔑 Fast Sign In</span>
              </button>
            </div>

            {/* 1-Tap Google / Web3 Quick Access */}
            <div className="space-y-2">
              <button
                onClick={() => handleSocial1Tap('Google')}
                className="w-full py-2.5 rounded-xl bg-white text-black font-black text-xs flex items-center justify-center space-x-2 shadow-md hover:bg-gray-100 transition-all"
              >
                <Chrome className="w-4 h-4" />
                <span>Continue with Google 1-Tap</span>
              </button>
              <div className="flex items-center space-x-2 text-[10px] text-gray-500 py-1">
                <div className="flex-1 h-px bg-white/10" />
                <span>OR USE GAMER CREDENTIALS</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
            </div>

            {/* Registration Form */}
            {authMode === 'REGISTER' ? (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                {/* Avatar Picker */}
                <div>
                  <label className="text-[10px] text-gray-300 font-bold block mb-1">
                    CHOOSE YOUR AVATAR ICON:
                  </label>
                  <div className="grid grid-cols-8 gap-1.5">
                    {AVATARS.map((av) => (
                      <button
                        type="button"
                        key={av}
                        onClick={() => setSelectedAvatar(av)}
                        className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                          selectedAvatar === av
                            ? 'bg-stadiumGreen text-black scale-110 shadow-md glow-emerald'
                            : 'bg-white/5 border border-white/10'
                        }`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] text-gray-300 font-bold block mb-1">USERNAME / GAMER TAG</label>
                    <input
                      type="text"
                      required
                      value={inputUsername}
                      onChange={(e) => setInputUsername(e.target.value)}
                      placeholder="e.g. CyberStriker_99"
                      className="w-full p-2.5 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:border-stadiumGreen focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-300 font-bold block mb-1">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      required
                      value={inputEmail}
                      onChange={(e) => setInputEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full p-2.5 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:border-stadiumGreen focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] text-gray-300 font-bold block mb-1">FAVORITE CLUB</label>
                    <select
                      value={selectedClub}
                      onChange={(e) => setSelectedClub(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:border-stadiumGreen focus:outline-none"
                    >
                      {CLUBS.map((c) => (
                        <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-300 font-bold block mb-1">PASSWORD</label>
                    <input
                      type="password"
                      required
                      value={inputPassword}
                      onChange={(e) => setInputPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full p-2.5 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:border-stadiumGreen focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-stadiumGreen via-emerald-400 to-gold text-black font-black text-xs shadow-lg hover:scale-[1.02] transition-all glow-emerald flex items-center justify-center space-x-1.5"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Activate Member Pass & Claim +500 Free Aura ➔</span>
                </button>
              </form>
            ) : (
              /* Sign In Form */
              <form onSubmit={handleLoginSubmit} className="space-y-3">
                <div>
                  <label className="text-[10px] text-gray-300 font-bold block mb-1">USERNAME OR EMAIL</label>
                  <input
                    type="text"
                    required
                    value={inputUsername}
                    onChange={(e) => setInputUsername(e.target.value)}
                    placeholder="Enter your username or email..."
                    className="w-full p-2.5 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:border-stadiumGreen focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-300 font-bold block mb-1">PASSWORD</label>
                  <input
                    type="password"
                    required
                    value={inputPassword}
                    onChange={(e) => setInputPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full p-2.5 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:border-stadiumGreen focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-stadiumGreen text-black font-black text-xs shadow-lg hover:scale-[1.02] transition-all glow-emerald flex items-center justify-center space-x-1.5"
                >
                  <Lock className="w-4 h-4" />
                  <span>Log In to Mivaj Stadium ➔</span>
                </button>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
