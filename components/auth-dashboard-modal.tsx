'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  X, 
  ShieldCheck, 
  Zap, 
  Star, 
  Trophy, 
  Sparkles, 
  Ticket, 
  Sun, 
  Moon, 
  LogOut, 
  Check, 
  Lock, 
  Mail, 
  Phone,
  Flame,
  Award,
  Bell,
  Settings
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { stadiumAudio } from '../lib/sound-synthesizer';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { useTranslation } from '../lib/translation-engine';

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
  email: string;
  phone: string;
  vipTier: 'VIP MASTER 👑' | 'PRO TIPSTER ⚡' | 'STADIUM MEMBER';
  memberSince: string;
  winRate: number;
  totalPicks: number;
  bankroll: number;
}

export const AuthDashboardModal: React.FC<AuthDashboardModalProps> = ({
  isOpen,
  onClose,
  followedMatchIds = [],
  followedLeagues = [],
  currentTheme = 'dark',
  onToggleTheme,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'FOLLOWED' | 'SLIPS' | 'SETTINGS'>('DASHBOARD');
  
  // Auth state
  const [session, setSession] = useState<UserSession>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('aurascore_user_session');
      if (stored) {
        try { return JSON.parse(stored); } catch {}
      }
    }
    return {
      isLoggedIn: true,
      username: 'CyberStriker_99',
      email: 'striker99@aurascore.ai',
      phone: '+234 803 888 2400',
      vipTier: 'VIP MASTER 👑',
      memberSince: 'Aug 2026',
      winRate: 88.4,
      totalPicks: 142,
      bankroll: 3850,
    };
  });

  // Login form state
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [inputUsername, setInputUsername] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputPhone, setInputPhone] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [authSuccess, setAuthSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aurascore_user_session', JSON.stringify(session));
    }
  }, [session]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    phoneHardware.triggerHaptic('SELECTION');
    stadiumAudio.playWonTicketSound();
    
    const newSession: UserSession = {
      isLoggedIn: true,
      username: inputUsername || 'CyberStriker_99',
      email: inputEmail || 'fan@aurascore.ai',
      phone: inputPhone || '+234 800 000 0000',
      vipTier: 'VIP MASTER 👑',
      memberSince: 'Aug 2026',
      winRate: 88.4,
      totalPicks: 142,
      bankroll: 5000,
    };

    setSession(newSession);
    setAuthSuccess(true);
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
    setTimeout(() => {
      setAuthSuccess(false);
    }, 2000);
  };

  const handleLogout = () => {
    phoneHardware.triggerHaptic('SELECTION');
    setSession({
      isLoggedIn: false,
      username: 'Guest Fan',
      email: '',
      phone: '',
      vipTier: 'STADIUM MEMBER',
      memberSince: 'Today',
      winRate: 0,
      totalPicks: 0,
      bankroll: 0,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-5 animate-fadeIn font-mono text-xs">
      <div className="relative w-full max-w-3xl glass-panel-premium rounded-3xl border-2 border-stadiumGreen/60 p-4 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-2xl bg-panel text-gray-400 hover:text-white border border-white/10 hover:border-stadiumGreen transition-all z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-stadiumGreen via-gold to-cyberPurple p-0.5 shadow-lg flex items-center justify-center flex-shrink-0">
            <div className="w-full h-full bg-void rounded-[14px] flex items-center justify-center text-xl">
              ⚡
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-black text-base sm:text-lg text-white">
                {session.isLoggedIn ? `@${session.username}` : 'USER AUTHENTICATION & DASHBOARD'}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-stadiumGreen text-black font-black text-[9px]">
                {session.vipTier}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-sans mt-0.5">
              Personal AI predictions hub, followed clubs, banker slips, and system settings
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        {session.isLoggedIn && (
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-white/10">
            {[
              { key: 'DASHBOARD', label: 'Dashboard 📊', icon: User },
              { key: 'FOLLOWED', label: `Followed (${followedLeagues.length + followedMatchIds.length}) ⭐`, icon: Star },
              { key: 'SETTINGS', label: 'Preferences ⚙️', icon: Settings },
            ].map((tItem) => (
              <button
                key={tItem.key}
                onClick={() => {
                  setActiveTab(tItem.key as any);
                  phoneHardware.triggerHaptic('SELECTION');
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all flex items-center space-x-1.5 flex-shrink-0 ${
                  activeTab === tItem.key
                    ? 'bg-stadiumGreen text-black shadow-lg shadow-stadiumGreen/20 ring-1 ring-stadiumGreen'
                    : 'bg-black/50 text-gray-400 hover:text-white border border-white/10'
                }`}
              >
                <span>{tItem.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {session.isLoggedIn && activeTab === 'DASHBOARD' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Top Stat Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                <span className="text-[9px] text-gray-400 uppercase font-bold">Win Rate %</span>
                <span className="text-xl font-black text-stadiumGreen block">{session.winRate}%</span>
                <span className="text-[9px] text-stadiumGreen font-bold">🔥 OPTA VERIFIED</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                <span className="text-[9px] text-gray-400 uppercase font-bold">Total Picks</span>
                <span className="text-xl font-black text-gold block">{session.totalPicks}</span>
                <span className="text-[9px] text-gray-400">Lifetime bets</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                <span className="text-[9px] text-gray-400 uppercase font-bold">Bankroll Aura</span>
                <span className="text-xl font-black text-white block">₦{session.bankroll.toLocaleString()}</span>
                <span className="text-[9px] text-stadiumGreen font-bold">+₦1,420 ROI</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                <span className="text-[9px] text-gray-400 uppercase font-bold">Status Tier</span>
                <span className="text-sm font-black text-cyberPurple block mt-1">MASTER VIP 👑</span>
                <span className="text-[9px] text-gray-400">Since {session.memberSince}</span>
              </div>
            </div>

            {/* Quick Actions Row */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-stadiumGreen/15 via-black/80 to-gold/15 border border-stadiumGreen/30 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-black text-white block">⚡ Daily Banker Accumulator Ready</span>
                <span className="text-[10px] text-gray-300 font-sans">3 High-Confidence Matches (84%+ Probability) Locked</span>
              </div>
              <button
                onClick={() => {
                  phoneHardware.triggerHaptic('SELECTION');
                  stadiumAudio.playAddPickSound();
                  confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
                }}
                className="px-3.5 py-2 rounded-xl bg-stadiumGreen text-black font-black text-xs hover:bg-emerald-400 transition-all flex items-center space-x-1 shadow-md"
              >
                <span>Load Banker ➔</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: FOLLOWED CLUBS & LEAGUES */}
        {session.isLoggedIn && activeTab === 'FOLLOWED' && (
          <div className="space-y-3 animate-fadeIn">
            <h3 className="text-xs font-black text-white">⭐ YOUR FOLLOWED LEAGUES ({followedLeagues.length})</h3>
            {followedLeagues.length === 0 ? (
              <div className="p-8 text-center text-gray-400 rounded-2xl bg-black/50 border border-white/10">
                You haven&apos;t followed any leagues yet. Tap the ⭐ star icon in the League Browser to follow!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {followedLeagues.map((lId) => (
                  <div key={lId} className="p-3 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between">
                    <span className="font-black text-white capitalize">{lId.replace('-', ' ')}</span>
                    <span className="px-2 py-0.5 rounded-full bg-gold text-black font-black text-[9px]">FOLLOWING ✓</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SETTINGS & THEME MODE */}
        {session.isLoggedIn && activeTab === 'SETTINGS' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
              <h3 className="text-xs font-black text-white border-b border-white/10 pb-2">SYSTEM PREFERENCES & THEME</h3>
              
              {/* Dark / Light Mode Toggle */}
              <div className="flex items-center justify-between py-1">
                <div>
                  <span className="font-bold text-white block">Theme Mode ({currentTheme.toUpperCase()})</span>
                  <span className="text-[10px] text-gray-400">Switch between Cyber Obsidian & Daylight Arena</span>
                </div>
                {onToggleTheme && (
                  <button
                    onClick={onToggleTheme}
                    className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-xs flex items-center space-x-2 transition-all"
                  >
                    {currentTheme === 'dark' ? <Moon className="w-4 h-4 text-gold" /> : <Sun className="w-4 h-4 text-amber-500" />}
                    <span>{currentTheme === 'dark' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}</span>
                  </button>
                )}
              </div>

              {/* Nigerian Audio Commentary */}
              <div className="flex items-center justify-between py-1 border-t border-white/10 pt-2">
                <div>
                  <span className="font-bold text-white block">Pidgin Audio Commentary 🇳🇬</span>
                  <span className="text-[10px] text-gray-400">Real-time synthesized Nigerian stadium reactions</span>
                </div>
                <button
                  onClick={() => {
                    stadiumAudio.playGoalCelebration();
                    phoneHardware.triggerHaptic('SELECTION');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40 font-black text-[10px]"
                >
                  Test Audio 🔊
                </button>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full py-3 rounded-2xl bg-crimson/20 hover:bg-crimson/30 border border-crimson/50 text-crimson font-black text-xs transition-all flex items-center justify-center space-x-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out of Session</span>
            </button>
          </div>
        )}

        {/* LOG IN / SIGN UP FORM (When logged out) */}
        {!session.isLoggedIn && (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5 animate-fadeIn">
            <div className="p-3.5 rounded-2xl bg-stadiumGreen/10 border border-stadiumGreen/30 text-stadiumGreen text-[11px] font-bold">
              ⚽ Log in to save your bet slips, follow 35+ leagues & clubs, and access VIP Banker Predictions!
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Username / Handle</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={inputUsername}
                    onChange={(e) => setInputUsername(e.target.value)}
                    placeholder="e.g. CyberStriker_99"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/70 border border-white/10 text-xs text-white placeholder-gray-500 focus:border-stadiumGreen focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/70 border border-white/10 text-xs text-white placeholder-gray-500 focus:border-stadiumGreen focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Nigerian Phone Number (Optional)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={inputPhone}
                    onChange={(e) => setInputPhone(e.target.value)}
                    placeholder="+234 803 000 0000"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/70 border border-white/10 text-xs text-white placeholder-gray-500 focus:border-stadiumGreen focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={inputPassword}
                    onChange={(e) => setInputPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/70 border border-white/10 text-xs text-white placeholder-gray-500 focus:border-stadiumGreen focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-stadiumGreen text-black font-black text-xs hover:bg-emerald-400 transition-all shadow-lg glow-emerald"
            >
              Log In to AuraScore Stadium 🚀
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
