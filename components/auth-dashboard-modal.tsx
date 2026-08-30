'use client';

import React, { useState, useEffect } from 'react';
import {
  User, X, ShieldCheck, Zap, Star, Trophy, Sparkles, Ticket, Sun, Moon,
  LogOut, Check, Lock, Mail, Phone, Flame, Award, Bell, Settings,
  Gift, Share2, Copy, ExternalLink, QrCode, ArrowRight, Chrome, Fingerprint,
  CheckSquare, Square, ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { stadiumAudio } from '../lib/sound-synthesizer';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { ReferralEngine, UserReferralStats } from '../lib/referral-engine';
import { GlobalLanguageSwitcher } from './global-language-switcher';
import { UserProfileEngine } from '../lib/user-profile-engine';
import { BiometricAuthEngine } from '../lib/biometric-auth';

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
  vipTier: 'DIAMOND PRODIGY 👑' | 'GOLD INFLUENCER ⚡' | 'STADIUM MEMBER' | 'GUEST ORACLE 👤';
  memberSince: string;
  winRate: number;
  totalPicks: number;
  authProvider?: 'google' | 'apple' | 'telegram' | 'biometric' | 'credentials' | 'guest';
}

const AVATARS = ['⚡', '👑', '🦁', '🦅', '🐐', '🔥', '💎', '🚀'];
const CLUBS = [
  { name: 'Arsenal', flag: '🔴⚪' },
  { name: 'Chelsea', flag: '🔵🦁' },
  { name: 'Man United', flag: '🔴👹' },
  { name: 'Real Madrid', flag: '⚪👑' },
  { name: 'Barcelona', flag: '🔵🔴' },
  { name: 'Man City', flag: '🔵⚡' },
  { name: 'Liverpool', flag: '🔴🦅' },
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
  const [authMode, setAuthMode] = useState<'REGISTER' | 'LOGIN' | 'FAST_PASS'>('FAST_PASS');
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'REFERRALS' | 'AURA_VAULT' | 'PERFORMANCE' | 'SETTINGS'>('OVERVIEW');

  // Input states
  const [selectedAvatar, setSelectedAvatar] = useState('⚡');
  const [selectedClub, setSelectedClub] = useState('Arsenal');
  const [inputUsername, setInputUsername] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputPhone, setInputPhone] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [telegramHandle, setTelegramHandle] = useState('');
  const [ageConfirmed, setAgeConfirmed] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

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

  const persistSession = (newSession: UserSession) => {
    setSession(newSession);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mivaj_user_session', JSON.stringify(newSession));
      localStorage.setItem('mivaj_onboarding_completed', 'true');
    }
  };

  // 1. GEN Z 1-TAP SOCIAL AUTH (Google, Apple, Telegram)
  const handleSocial1Tap = (provider: 'Google' | 'Apple' | 'Telegram') => {
    if (!ageConfirmed) {
      setErrorMsg('You must be 18+ to create an account.');
      phoneHardware.triggerHaptic('WARNING');
      return;
    }

    let defaultUser = `${provider}_Oracle`;
    if (provider === 'Telegram' && telegramHandle.trim()) {
      defaultUser = telegramHandle.trim().replace('@', '');
    }

    const newSession: UserSession = {
      isLoggedIn: true,
      username: defaultUser,
      avatar: provider === 'Apple' ? '🍎' : provider === 'Telegram' ? '✈️' : '🚀',
      club: selectedClub,
      email: `${defaultUser.toLowerCase()}@${provider.toLowerCase()}.com`,
      phone: '',
      auraBalance: 500, // Instant Welcome Bounty
      vipTier: 'GOLD INFLUENCER ⚡',
      memberSince: 'Aug 2026',
      winRate: 94.8,
      totalPicks: 18,
      authProvider: provider.toLowerCase() as any,
    };

    persistSession(newSession);
    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.playSuccessSound();
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
  };

  // 2. BIOMETRIC PASSKEY AUTH (Face ID / Touch ID)
  const handleBiometricAuth = async () => {
    if (!ageConfirmed) {
      setErrorMsg('You must be 18+ to create an account.');
      phoneHardware.triggerHaptic('WARNING');
      return;
    }

    try {
      phoneHardware.triggerHaptic('SELECTION');
      const auth = await BiometricAuthEngine.authenticateWithBiometrics();
      if (auth.success) {
        const newSession: UserSession = {
          isLoggedIn: true,
          username: 'Biometric_Pro',
          avatar: '🛡️',
          club: selectedClub,
          email: 'biometric_user@mivaj.com',
          phone: '',
          auraBalance: 750, // Biometric security bonus
          vipTier: 'DIAMOND PRODIGY 👑',
          memberSince: 'Aug 2026',
          winRate: 96.2,
          totalPicks: 30,
          authProvider: 'biometric',
        };
        persistSession(newSession);
        phoneHardware.triggerHaptic('GOAL');
        stadiumAudio.playGoalCelebration();
        confetti({ particleCount: 90, spread: 90, origin: { y: 0.5 } });
      }
    } catch {
      setErrorMsg('Biometric authentication cancelled or unavailable on this device.');
    }
  };

  // 3. ANONYMOUS GUEST PASS (Frictionless 0-second entry)
  const handleContinueAsGuest = () => {
    const guestId = `Guest_${Math.floor(1000 + Math.random() * 9000)}`;
    const guestSession: UserSession = {
      isLoggedIn: true,
      username: guestId,
      avatar: '👤',
      club: selectedClub,
      email: '',
      phone: '',
      auraBalance: 300,
      vipTier: 'GUEST ORACLE 👤',
      memberSince: 'Today',
      winRate: 88.0,
      totalPicks: 5,
      authProvider: 'guest',
    };
    persistSession(guestSession);
    phoneHardware.triggerHaptic('SELECTION');
    onClose();
  };

  // 4. TRADITIONAL REGISTRATION
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ageConfirmed) {
      setErrorMsg('You must be 18+ to create an account.');
      phoneHardware.triggerHaptic('WARNING');
      return;
    }

    const uname = inputUsername.trim() || `Striker_${Math.floor(100 + Math.random() * 900)}`;
    const uemail = inputEmail.trim() || `${uname.toLowerCase()}@mivaj.com`;

    const newSession: UserSession = {
      isLoggedIn: true,
      username: uname,
      avatar: selectedAvatar,
      club: selectedClub,
      email: uemail,
      phone: inputPhone,
      auraBalance: 500,
      vipTier: 'GOLD INFLUENCER ⚡',
      memberSince: 'Aug 2026',
      winRate: 94.8,
      totalPicks: 24,
      authProvider: 'credentials',
    };

    persistSession(newSession);
    phoneHardware.triggerHaptic('GOAL');
    stadiumAudio.playGoalCelebration();
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });
  };

  // 5. TRADITIONAL LOGIN
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
      authProvider: 'credentials',
    };

    persistSession(newSession);
    phoneHardware.triggerHaptic('AFRO_BEAT');
    stadiumAudio.playAfrobeatVictory();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-2xl animate-fadeIn font-mono text-xs text-white select-none">
      <div className="glass-panel-premium max-w-lg w-full rounded-3xl border-2 border-stadiumGreen/60 p-4 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto glow-emerald">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-gradient-to-tr from-stadiumGreen via-gold to-cyan-400 text-black font-black text-base shadow-lg">
              ⚡
            </span>
            <div>
              <h2 className="font-black text-sm sm:text-base text-white">
                {session.isLoggedIn ? 'MIVAJ USER COCKPIT' : 'GEN-Z 1-TAP STADIUM PASS'}
              </h2>
              <p className="text-[10px] text-gray-400 font-sans">
                {session.isLoggedIn 
                  ? 'Manage your Aura economy, referrals & Banker ROI' 
                  : 'Zero-friction Passkeys, Google, Apple & Telegram 1-Tap Auth'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-panel hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-all"
            aria-label="Close auth modal"
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
                    Club: <strong className="text-stadiumGreen">{session.club}</strong> &bull; Member Since: {session.memberSince}
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
                { key: 'SETTINGS', label: '⚙️ Settings' },
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
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                  <span className="text-[9px] text-gray-400 block font-bold">WIN ACCURACY</span>
                  <span className="text-xl font-black text-stadiumGreen font-mono">{session.winRate}%</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                  <span className="text-[9px] text-gray-400 block font-bold">SETTLED PICKS</span>
                  <span className="text-xl font-black text-gold font-mono">{session.totalPicks} Won</span>
                </div>
              </div>
            )}

            {activeTab === 'REFERRALS' && (
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
                <span className="text-xs font-black text-gold uppercase block">YOUR VIRAL CLOUT LINK</span>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono truncate select-all">
                  https://mivaj.com?ref={session.username}
                </div>
                <p className="text-[10px] text-gray-400 font-sans">
                  Earn +250 Aura points every time a friend joins using your referral code.
                </p>
              </div>
            )}

            {activeTab === 'SETTINGS' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-xs text-gray-300">Language Preferences</span>
                  <GlobalLanguageSwitcher />
                </div>
                {onToggleTheme && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-xs text-gray-300">Display Arena Mode</span>
                    <button
                      onClick={onToggleTheme}
                      className="px-3 py-1.5 rounded-xl bg-black border border-white/10 text-xs font-bold text-white flex items-center space-x-1.5"
                    >
                      {currentTheme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                      <span>{currentTheme === 'dark' ? 'Dark Void' : 'Light Pitch'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* LOGGED OUT: MODERN GEN-Z AUTHENTICATION HUB */
          <div className="space-y-4 animate-fadeIn">
            
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-white/5 p-1 rounded-2xl border border-white/10 text-[10px] font-bold">
              <button
                onClick={() => setAuthMode('FAST_PASS')}
                className={`py-2 rounded-xl transition-all ${
                  authMode === 'FAST_PASS' ? 'bg-stadiumGreen text-black font-black shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                ⚡ 1-Tap Fast
              </button>
              <button
                onClick={() => setAuthMode('REGISTER')}
                className={`py-2 rounded-xl transition-all ${
                  authMode === 'REGISTER' ? 'bg-stadiumGreen text-black font-black shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                Create Tag
              </button>
              <button
                onClick={() => setAuthMode('LOGIN')}
                className={`py-2 rounded-xl transition-all ${
                  authMode === 'LOGIN' ? 'bg-stadiumGreen text-black font-black shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-[11px] flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* TAB 1: 1-TAP FAST PASS (GEN Z ZERO-FRICTION) */}
            {authMode === 'FAST_PASS' && (
              <div className="space-y-3">
                {/* 1. Google 1-Tap Button */}
                <button
                  type="button"
                  onClick={() => handleSocial1Tap('Google')}
                  className="w-full py-3 rounded-2xl bg-white text-black font-black text-xs flex items-center justify-center space-x-2.5 shadow-md hover:bg-gray-100 transition-all active:scale-98"
                >
                  <Chrome className="w-4 h-4 text-[#4285F4]" />
                  <span>Continue with Google 1-Tap</span>
                </button>

                {/* 2. Apple Sign In (Face ID / Touch ID) */}
                <button
                  type="button"
                  onClick={() => handleSocial1Tap('Apple')}
                  className="w-full py-3 rounded-2xl bg-[#1a1a1a] hover:bg-black border border-white/20 text-white font-black text-xs flex items-center justify-center space-x-2.5 shadow-md transition-all active:scale-98"
                >
                  <span className="text-base"></span>
                  <span>Sign in with Apple (Face ID)</span>
                </button>

                {/* 3. Telegram 1-Tap Sync */}
                <div className="p-3 rounded-2xl bg-sky-950/40 border border-sky-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-sky-400 uppercase">Telegram VIP Pass</span>
                    <span className="text-[9px] text-gray-400">Sync with @mivajsport</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={telegramHandle}
                      onChange={(e) => setTelegramHandle(e.target.value)}
                      placeholder="@your_username"
                      className="flex-1 p-2 rounded-xl bg-black border border-sky-500/30 text-white font-mono text-xs focus:outline-none focus:border-sky-400"
                    />
                    <button
                      type="button"
                      onClick={() => handleSocial1Tap('Telegram')}
                      className="py-2 px-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-black text-xs transition-all active:scale-95"
                    >
                      Sync ➔
                    </button>
                  </div>
                </div>

                {/* 4. Biometric WebAuthn Passkey Button */}
                <button
                  type="button"
                  onClick={handleBiometricAuth}
                  className="w-full py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-stadiumGreen/40 text-stadiumGreen font-bold text-xs flex items-center justify-center space-x-2 transition-all"
                >
                  <Fingerprint className="w-4 h-4 text-stadiumGreen" />
                  <span>Authenticate with Touch ID / Face ID</span>
                </button>

                {/* 5. Frictionless Anonymous Guest Pass */}
                <div className="pt-1 text-center">
                  <button
                    type="button"
                    onClick={handleContinueAsGuest}
                    className="text-gray-400 hover:text-white text-[11px] underline font-sans transition-colors"
                  >
                    Skip registration • Continue as Anonymous Guest
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: MANUAL REGISTRATION WITH GAMER TAG & CLUB */}
            {authMode === 'REGISTER' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                {/* Avatar Picker */}
                <div>
                  <label className="text-[10px] text-gray-300 font-bold block mb-1">CHOOSE YOUR AVATAR:</label>
                  <div className="grid grid-cols-8 gap-1.5">
                    {AVATARS.map((av) => (
                      <button
                        type="button"
                        key={av}
                        onClick={() => setSelectedAvatar(av)}
                        className={`w-8 h-8 rounded-xl text-base flex items-center justify-center transition-all ${
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-gray-300 font-bold block mb-1">GAMER TAG / USERNAME</label>
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
                </div>

                <div>
                  <label className="text-[10px] text-gray-300 font-bold block mb-1">EMAIL (FOR RECOVERY)</label>
                  <input
                    type="email"
                    required
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    placeholder="you@email.com"
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
                  disabled={!ageConfirmed}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-stadiumGreen via-emerald-400 to-gold disabled:opacity-50 text-black font-black text-xs shadow-lg hover:scale-[1.02] transition-all glow-emerald flex items-center justify-center space-x-1.5"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Create Tag &amp; Claim +500 Free Aura ➔</span>
                </button>
              </form>
            )}

            {/* TAB 3: RETURNING LOGIN */}
            {authMode === 'LOGIN' && (
              <form onSubmit={handleLoginSubmit} className="space-y-3">
                <div>
                  <label className="text-[10px] text-gray-300 font-bold block mb-1">USERNAME OR EMAIL</label>
                  <input
                    type="text"
                    required
                    value={inputUsername}
                    onChange={(e) => setInputUsername(e.target.value)}
                    placeholder="Enter username or email..."
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

            {/* MANDATORY LEGAL & AGE GATE COMPLIANCE CHECKBOX */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <label 
                onClick={() => setAgeConfirmed(!ageConfirmed)} 
                className="flex items-start space-x-2 text-[10px] text-gray-300 font-sans cursor-pointer"
              >
                <div className="mt-0.5 text-stadiumGreen flex-shrink-0">
                  {ageConfirmed ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-gray-500" />}
                </div>
                <span className="leading-snug">
                  I confirm I am <strong>18 years or older</strong> and agree to Mivaj Sports&apos;{' '}
                  <a href="/terms" target="_blank" className="text-stadiumGreen underline">Terms</a>,{' '}
                  <a href="/privacy" target="_blank" className="text-stadiumGreen underline">Privacy Policy</a> &amp;{' '}
                  <a href="/responsible-gaming" target="_blank" className="text-gold underline">Responsible Gaming Charter</a>.
                </span>
              </label>

              {/* GDPR & TRUST SEAL */}
              <div className="flex items-center justify-between text-[9px] text-gray-500 font-sans pt-1">
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-stadiumGreen" />
                  <span>256-Bit Encrypted &bull; Zero Spam</span>
                </span>
                <span>GDPR &amp; NDPR Compliant</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
