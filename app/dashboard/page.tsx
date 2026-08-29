'use client';

import React, { useState, useEffect } from 'react';
import {
  Flame, Zap, Gift, Send, Copy, Check, ExternalLink,
  MessageSquare, Heart, Share2, ArrowLeft, Users, Settings,
  Shield, Sparkles, TrendingUp, Trophy, Compass, ChevronRight, X,
  Bookmark, Bell, Star, Ticket, CheckCircle2, XCircle, Clock, Edit3, UserCheck, Award
} from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { stadiumAudio } from '../../lib/sound-synthesizer';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { cn } from '../../lib/utils';
import { PersistentStorage, PlacedTicket } from '../../lib/persistent-storage-engine';
import { UserProfileEngine, UserProfileData, UserReferralRecord } from '../../lib/user-profile-engine';
import { calculateLevelFromXp, LEVEL_MILESTONES, XP_REWARDS } from '../../lib/xp-engine';

const AVAILABLE_AVATARS = ['⚡', '👑', '🦁', '🦅', '🐐', '🔥', '💎', '🚀', '⚽', '🎯'];
const AVAILABLE_CLUBS = ['Arsenal', 'Chelsea', 'Man United', 'Real Madrid', 'Barcelona', 'Liverpool', 'Man City', 'Super Eagles'];

export default function MultiDeviceResponsiveDashboard() {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TICKETS' | 'FOLLOWED' | 'REFERRALS'>('OVERVIEW');
  const [userProfile, setUserProfile] = useState<UserProfileData>(() => UserProfileEngine.getProfile());
  const [dailyClaimed, setDailyClaimed] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Edit Profile Modal
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editAvatar, setEditAvatar] = useState('⚡');
  const [editClub, setEditClub] = useState('Arsenal');

  // Persistent User Data State
  const [placedTickets, setPlacedTickets] = useState<PlacedTicket[]>([]);
  const [followedMatches, setFollowedMatches] = useState<string[]>([]);
  const [followedClubs, setFollowedClubs] = useState<string[]>([]);
  const [followedPlayers, setFollowedPlayers] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  // Load and auto-settle tickets on mount
  useEffect(() => {
    const profile = UserProfileEngine.getProfile();
    setUserProfile(profile);
    setEditUsername(profile.username);
    setEditAvatar(profile.avatar);
    setEditClub(profile.club);

    // Check daily aura claim persistence
    const todayStr = new Date().toISOString().split('T')[0];
    if (typeof window !== 'undefined' && localStorage.getItem('mivaj_daily_claimed_date') === todayStr) {
      setDailyClaimed(true);
    }

    setPlacedTickets(PersistentStorage.getPlacedTickets());
    setFollowedMatches(PersistentStorage.getFollowedMatches());
    setFollowedClubs(PersistentStorage.getFollowedClubs());
    setFollowedPlayers(PersistentStorage.getFollowedPlayers());
    setBookmarks(PersistentStorage.getBookmarks());

    // SYSTEM-WIDE TICKET SETTLEMENT PASS
    // Fetches live/finished matches and settlement archive, settling any concluded tickets
    Promise.all([
      fetch('/api/matches').then((r) => r.json()).catch(() => ({ matches: [] })),
      fetch('/api/settlement').then((r) => r.json()).catch(() => ({ archive: [] })),
    ]).then(([matchesRes, settleRes]) => {
      const liveMatches = matchesRes?.matches || [];
      const archived = settleRes?.archive || [];
      const { settledCount, newlyWon } = PersistentStorage.settleAllTickets([...liveMatches, ...archived]);
      if (settledCount > 0) {
        setPlacedTickets(PersistentStorage.getPlacedTickets());
        if (newlyWon > 0) {
          UserProfileEngine.addAura(newlyWon * 250);
          UserProfileEngine.addXp(newlyWon * XP_REWARDS.WON_BET, 'Tickets won');
          setUserProfile(UserProfileEngine.getProfile());
        }
      }
    });

    const handleProfileSync = (e: any) => {
      if (e?.detail) setUserProfile(e.detail);
      else setUserProfile(UserProfileEngine.getProfile());
    };
    window.addEventListener('mivaj_profile_updated', handleProfileSync);

    return () => {
      window.removeEventListener('mivaj_profile_updated', handleProfileSync);
    };
  }, []);

  const handleClaimDailyAura = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (dailyClaimed || (typeof window !== 'undefined' && localStorage.getItem('mivaj_daily_claimed_date') === todayStr)) {
      setDailyClaimed(true);
      return;
    }
    setDailyClaimed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mivaj_daily_claimed_date', todayStr);
    }
    UserProfileEngine.addAura(150);
    UserProfileEngine.addXp(XP_REWARDS.DAILY_CHECKIN, 'Daily Aura claim');
    setUserProfile(UserProfileEngine.getProfile());

    try { phoneHardware.triggerHaptic('AFRO_BEAT'); } catch {}
    try { stadiumAudio.playAfrobeatVictory(); } catch {}
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = editUsername.trim().replace(/^@/, '') || 'CyberStriker_99';
    const updated = UserProfileEngine.updateProfile({
      username: cleanName,
      avatar: editAvatar,
      club: editClub,
    });
    setUserProfile(updated);
    setIsEditingProfile(false);
    try { phoneHardware.triggerHaptic('SUCCESS'); } catch {}
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.3 } });
  };

  const cleanUsername = userProfile.username.replace(/^@/, '');
  const referralUrl = `https://mivaj.com?ref=${cleanUsername}`;

  const copyReferralLink = () => {
    try {
      navigator.clipboard.writeText(referralUrl);
      setCopiedLink(true);
      UserProfileEngine.addXp(XP_REWARDS.SHARE_SLIP, 'Shared referral link');
      setUserProfile(UserProfileEngine.getProfile());
      try { phoneHardware.triggerHaptic('SUCCESS'); } catch {}
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {}
  };

  const levelInfo = userProfile.level || calculateLevelFromXp(userProfile.xp);
  const referralsList = userProfile.referrals || [];
  const wonTickets = placedTickets.filter((t) => t.status === 'WON').length;
  const lostTickets = placedTickets.filter((t) => t.status === 'LOST').length;
  const pendingTickets = placedTickets.filter((t) => t.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-void text-white font-mono text-xs overflow-x-hidden selection:bg-stadiumGreen selection:text-black pb-24 lg:pb-8">
      
      {/* 1. TOP ENTERPRISE HEADER */}
      <header className="sticky top-0 z-30 bg-black/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-stadiumGreen via-emerald-400 to-gold p-0.5 flex items-center justify-center shadow-lg">
            <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center text-base">
              {userProfile.avatar}
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-sm sm:text-base text-white tracking-wider">MIVAJ USER PROFILE</span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-stadiumGreen text-black font-black">
                LVL {levelInfo.level} {levelInfo.badge}
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-sans hidden sm:block">
              Centralized Profile Command • Bets, Rewards, and XP
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-panel border border-white/10 text-xs">
            <span className="text-gray-400">STASH:</span>
            <span className="font-bold text-gold">{userProfile.auraBalance.toLocaleString()} AURA</span>
          </div>

          <Link
            href="/"
            className="px-3.5 py-2 rounded-xl bg-stadiumGreen/15 border border-stadiumGreen/40 hover:bg-stadiumGreen hover:text-black text-stadiumGreen font-bold text-xs flex items-center space-x-1.5 transition-all shadow"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Match Arena 🏟️</span>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* USER PROFILE & STATS BANNER */}
        <div className="glass-panel-premium rounded-3xl p-6 border border-stadiumGreen/40 shadow-2xl space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Identity & Edit Button */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-stadiumGreen via-emerald-400 to-purple-500 p-0.5 shadow-xl">
                  <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center text-3xl">
                    {userProfile.avatar}
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded bg-stadiumGreen text-black font-black text-[9px]">
                  LVL {levelInfo.level}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white">@{cleanUsername}</h1>
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-stadiumGreen/20 hover:text-stadiumGreen text-gray-400 transition-all border border-white/10"
                    title="Edit username, avatar, and loyalty club"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-gold/20 border border-gold text-gold font-bold text-[10px]">
                    {levelInfo.title} {levelInfo.badge}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    Loyalty Club: <strong className="text-stadiumGreen">{userProfile.club}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Clickable Quick Action Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 min-w-[280px]">
              <button
                onClick={() => setActiveTab('TICKETS')}
                className="p-3 rounded-2xl bg-black/60 border border-stadiumGreen/30 text-center hover:border-stadiumGreen transition-all active:scale-95"
              >
                <Ticket className="w-4 h-4 text-stadiumGreen mx-auto mb-1" />
                <span className="text-base font-black text-stadiumGreen">{placedTickets.length}</span>
                <span className="text-[9px] text-gray-400 block uppercase">Bets Placed</span>
              </button>

              <button
                onClick={() => setActiveTab('FOLLOWED')}
                className="p-3 rounded-2xl bg-black/60 border border-gold/30 text-center hover:border-gold transition-all active:scale-95"
              >
                <Bell className="w-4 h-4 text-gold mx-auto mb-1" />
                <span className="text-base font-black text-gold">{followedMatches.length}</span>
                <span className="text-[9px] text-gray-400 block uppercase">Followed</span>
              </button>

              <div className="p-3 rounded-2xl bg-black/60 border border-cyan-400/30 text-center">
                <Bookmark className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                <span className="text-base font-black text-cyan-400">{bookmarks.length}</span>
                <span className="text-[9px] text-gray-400 block uppercase">Bookmarks</span>
              </div>

              <button
                onClick={() => setActiveTab('REFERRALS')}
                className="p-3 rounded-2xl bg-black/60 border border-purple-400/30 text-center hover:border-purple-400 transition-all active:scale-95"
              >
                <Users className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                <span className="text-base font-black text-purple-400">{referralsList.length}</span>
                <span className="text-[9px] text-gray-400 block uppercase">Referrals</span>
              </button>
            </div>
          </div>

          {/* XP Progression Bar */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-black/50 border border-white/10">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-stadiumGreen font-black flex items-center space-x-1">
                <Zap className="w-3 h-3 text-gold fill-gold" />
                <span>LEVEL {levelInfo.level} PROGRESS ({levelInfo.title})</span>
              </span>
              <span className="text-gray-400 font-mono">
                {levelInfo.currentXp} / {levelInfo.nextLevelXp} XP ({levelInfo.progressPercent}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                style={{ width: `${levelInfo.progressPercent}%` }}
                className="h-full bg-gradient-to-r from-stadiumGreen via-emerald-400 to-gold rounded-full transition-all duration-500"
              />
            </div>
          </div>

          {/* Daily Aura Claim Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-2 border-t border-white/10 gap-3">
            <div className="flex items-center space-x-2 text-xs text-gray-300">
              <Gift className="w-4 h-4 text-gold" />
              <span>AURA WALLET BALANCE: <strong className="text-gold font-mono text-sm">{userProfile.auraBalance.toLocaleString()} AURA</strong></span>
            </div>

            <button
              onClick={handleClaimDailyAura}
              disabled={dailyClaimed}
              className={cn(
                'px-5 py-2.5 rounded-2xl font-black text-xs shadow-lg transition-all flex items-center space-x-2',
                dailyClaimed
                  ? 'bg-white/10 text-gray-400 cursor-not-allowed border border-white/10'
                  : 'bg-gradient-to-r from-gold to-yellow-400 text-black hover:scale-105 active:scale-95'
              )}
            >
              <Gift className="w-4 h-4" />
              <span>{dailyClaimed ? 'Daily Aura Bonus Claimed ✓' : 'Claim +150 Daily Aura Bonus 🎁'}</span>
            </button>
          </div>
        </div>

        {/* DASHBOARD NAVIGATION TABS */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
          {[
            { key: 'OVERVIEW', label: '📊 Overview', count: null },
            { key: 'TICKETS', label: '🎟️ My Placed Bets', count: placedTickets.length },
            { key: 'FOLLOWED', label: '🔔 Followed Fixtures', count: followedMatches.length },
            { key: 'REFERRALS', label: '👥 Referral Rewards', count: referralsList.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={cn(
                'px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center space-x-2 whitespace-nowrap shadow-sm',
                activeTab === tab.key
                  ? 'bg-stadiumGreen text-black shadow-stadiumGreen/30'
                  : 'bg-panel text-gray-400 hover:text-white border border-white/10'
              )}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={cn(
                  'px-2 py-0.5 rounded-full text-[9px] font-mono',
                  activeTab === tab.key ? 'bg-black/30 text-white' : 'bg-white/10 text-gray-300'
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'OVERVIEW' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div className="lg:col-span-8 space-y-6">
              
              {/* Placed Tickets Card */}
              <div className="p-6 rounded-3xl bg-panel/80 border border-white/10 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-black text-white flex items-center space-x-2">
                    <Ticket className="w-4 h-4 text-stadiumGreen" />
                    <span>RECENTLY PLACED BETS ({wonTickets} WON • {lostTickets} LOST • {pendingTickets} PENDING)</span>
                  </h3>
                  <button onClick={() => setActiveTab('TICKETS')} className="text-xs text-stadiumGreen font-bold hover:underline">
                    View All ({placedTickets.length}) ➔
                  </button>
                </div>

                {placedTickets.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-black/40 border border-dashed border-white/10 text-center space-y-2">
                    <Ticket className="w-8 h-8 text-gray-600 mx-auto" />
                    <p className="text-xs text-gray-400 font-sans">You haven't placed any bets yet.</p>
                    <p className="text-[10px] text-gray-500">Go to Match Arena and tap "I Bet This 🎯" on any match card to save your picks!</p>
                    <Link href="/" className="inline-block px-4 py-2 rounded-xl bg-stadiumGreen text-black font-black text-xs mt-2">
                      Explore Live Matches ➔
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {placedTickets.slice(0, 5).map((ticket) => (
                      <div key={ticket.id} className="p-3.5 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <span className="text-[10px] text-gray-400 block font-bold truncate">{ticket.league}</span>
                          <span className="text-xs font-black text-white block truncate">{ticket.homeTeam} vs {ticket.awayTeam}</span>
                          <span className="text-[11px] text-stadiumGreen font-bold block">Pick: {ticket.selection} @ {ticket.odds}</span>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className={cn(
                            'px-2.5 py-1 rounded-xl text-[10px] font-black uppercase inline-block',
                            ticket.status === 'WON' ? 'bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40 font-black' :
                            ticket.status === 'LOST' ? 'bg-crimson/20 text-crimson border border-crimson/40 font-black' :
                            'bg-gold/20 text-gold border border-gold/40'
                          )}>
                            {ticket.status === 'WON' ? 'WON ✓' : ticket.status === 'LOST' ? 'LOST ✗' : 'PENDING ⏳'}
                          </span>
                          <span className="text-[9px] text-gray-500 block mt-1 font-mono">{new Date(ticket.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Followed Clubs & Players */}
              <div className="p-6 rounded-3xl bg-panel/80 border border-white/10 space-y-4 shadow-xl">
                <h3 className="text-sm font-black text-white flex items-center space-x-2">
                  <Star className="w-4 h-4 text-gold" />
                  <span>MY FOLLOWED TEAMS & STARS</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">Loyalty Club</span>
                    <span className="px-2.5 py-1 rounded-xl bg-stadiumGreen/20 text-stadiumGreen font-black text-xs border border-stadiumGreen/30 inline-block">
                      🛡️ {userProfile.club}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">Followed Fixtures</span>
                    <span className="text-xs text-white font-bold block">
                      {followedMatches.length > 0 ? `${followedMatches.length} Live Alerts Active 🔔` : 'No fixtures followed yet'}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right 4 Cols: Trackable Referral Widget */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="p-6 rounded-3xl bg-gradient-to-br from-panel via-black to-stadiumGreen/10 border border-stadiumGreen/40 space-y-4 shadow-xl">
                <div className="space-y-1">
                  <span className="text-xs font-black text-stadiumGreen flex items-center space-x-1.5">
                    <Users className="w-4 h-4" />
                    <span>YOUR USERNAME-BASED REFERRAL LINK</span>
                  </span>
                  <p className="text-[10px] text-gray-400 font-sans">
                    Every punter who joins using your handle credits your Aura Wallet with +150 Aura and +150 XP!
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-black border border-white/15 space-y-2">
                  <span className="text-[9px] text-gray-500 font-bold block">UNIQUE REFERRAL URL:</span>
                  <input
                    type="text"
                    readOnly
                    value={referralUrl}
                    className="w-full p-2 rounded-xl bg-panel border border-white/10 text-white font-mono text-[10px]"
                  />
                  <button
                    onClick={copyReferralLink}
                    className="w-full py-2.5 rounded-xl bg-stadiumGreen text-black font-black text-xs hover:bg-emerald-400 transition-all flex items-center justify-center space-x-1.5 shadow"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedLink ? 'Link Copied to Clipboard! ✓' : 'Copy Referral Link'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center pt-1">
                  <button
                    onClick={() => setActiveTab('REFERRALS')}
                    className="p-3 rounded-2xl bg-black/60 border border-purple-400/30 hover:border-purple-400 transition-all"
                  >
                    <span className="text-lg font-black text-purple-400">{referralsList.length}</span>
                    <span className="text-[9px] text-gray-400 block">REFERRED PUNTERS ➔</span>
                  </button>
                  <div className="p-3 rounded-2xl bg-black/60 border border-gold/30">
                    <span className="text-lg font-black text-gold">+{referralsList.length * 150}</span>
                    <span className="text-[9px] text-gray-400 block">AURA EARNED</span>
                  </div>
                </div>
              </div>

              {/* Fast Navigation */}
              <div className="p-5 rounded-3xl bg-panel/80 border border-white/10 space-y-2">
                <span className="text-xs font-black text-white block mb-3">FAST NAVIGATION</span>
                
                <Link href="/settlement" className="p-3 rounded-2xl bg-black/60 border border-white/10 hover:border-stadiumGreen flex items-center justify-between text-xs text-gray-200 hover:text-white transition-all">
                  <span>📜 Official Match Settlement Ledger</span>
                  <span className="text-stadiumGreen font-bold">➔</span>
                </Link>

                <Link href="/birthdays" className="p-3 rounded-2xl bg-black/60 border border-white/10 hover:border-gold flex items-center justify-between text-xs text-gray-200 hover:text-white transition-all">
                  <span>🎂 World Sports Star Birthday Hub</span>
                  <span className="text-gold font-bold">➔</span>
                </Link>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: PLACED TICKETS (SYSTEM-WIDE SETTLEMENT) */}
        {activeTab === 'TICKETS' && (
          <div className="p-6 rounded-3xl bg-panel border border-white/10 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center space-x-2">
                  <Ticket className="w-5 h-5 text-stadiumGreen" />
                  <span>PLACED TICKETS & AUTO-SETTLEMENT LEDGER</span>
                </h3>
                <span className="text-[10px] text-gray-400 font-sans">
                  Automated settlement evaluates official full-time score sheets against your selections.
                </span>
              </div>
              <div className="flex items-center space-x-2 text-[10px] font-mono font-bold">
                <span className="px-2 py-1 rounded-lg bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/30">
                  {wonTickets} WON
                </span>
                <span className="px-2 py-1 rounded-lg bg-crimson/20 text-crimson border border-crimson/30">
                  {lostTickets} LOST
                </span>
                <span className="px-2 py-1 rounded-lg bg-gold/20 text-gold border border-gold/30">
                  {pendingTickets} PENDING
                </span>
              </div>
            </div>

            {placedTickets.length === 0 ? (
              <div className="p-12 rounded-3xl bg-black/40 border border-dashed border-white/10 text-center space-y-3">
                <Ticket className="w-12 h-12 text-gray-600 mx-auto" />
                <h4 className="text-sm font-black text-white">No Tickets Placed Yet</h4>
                <p className="text-xs text-gray-400 font-sans max-w-md mx-auto">
                  When you browse match predictions in the arena and tap "I Bet This 🎯", your tickets are recorded here and automatically settled when the match finishes!
                </p>
                <Link href="/" className="inline-block px-5 py-2.5 rounded-2xl bg-stadiumGreen text-black font-black text-xs mt-2">
                  Browse Today's Fixtures ➔
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {placedTickets.map((ticket) => (
                  <div key={ticket.id} className="p-4 rounded-2xl bg-black/70 border border-white/10 space-y-3 hover:border-stadiumGreen/60 transition-all shadow-md">
                    <div className="flex items-center justify-between text-[10px] text-gray-400 border-b border-white/10 pb-2">
                      <span className="font-bold text-white">{ticket.league}</span>
                      <span className={cn(
                        'px-2 py-0.5 rounded-lg text-[9px] font-black uppercase',
                        ticket.status === 'WON' ? 'bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/30 font-black' :
                        ticket.status === 'LOST' ? 'bg-crimson/20 text-crimson border border-crimson/30 font-black' :
                        'bg-gold/20 text-gold border border-gold/30'
                      )}>
                        {ticket.status === 'WON' ? 'WON ✓' : ticket.status === 'LOST' ? 'LOST ✗' : 'PENDING ⏳'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-white">{ticket.homeTeam} vs {ticket.awayTeam}</h4>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stadiumGreen font-bold">{ticket.market}: {ticket.selection}</span>
                        <span className="text-gold font-mono font-black">@{ticket.odds}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] text-gray-400">
                      <span>Placed: {new Date(ticket.timestamp).toLocaleDateString()}</span>
                      <span className="font-mono text-gray-500">ID: {ticket.id.slice(-8)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FOLLOWED */}
        {activeTab === 'FOLLOWED' && (
          <div className="p-6 rounded-3xl bg-panel border border-white/10 space-y-4 shadow-xl">
            <h3 className="text-base font-black text-white flex items-center space-x-2">
              <Bell className="w-5 h-5 text-gold" />
              <span>MY FOLLOWED FIXTURES ({followedMatches.length})</span>
            </h3>

            {followedMatches.length === 0 ? (
              <div className="p-12 rounded-3xl bg-black/40 border border-dashed border-white/10 text-center space-y-3">
                <Bell className="w-12 h-12 text-gray-600 mx-auto" />
                <h4 className="text-sm font-black text-white">No Followed Matches</h4>
                <p className="text-xs text-gray-400 font-sans max-w-md mx-auto">
                  Click the bell icon 🔔 on any match card to receive live goal alerts and track them here.
                </p>
                <Link href="/" className="inline-block px-5 py-2.5 rounded-2xl bg-stadiumGreen text-black font-black text-xs mt-2">
                  Browse Live Matches ➔
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {followedMatches.map((id) => (
                  <div key={id} className="p-4 rounded-2xl bg-black/70 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">Match: {id}</span>
                      <span className="text-[10px] text-stadiumGreen font-bold">Live Goal Alerts Enabled 🔔</span>
                    </div>
                    <Link href="/" className="px-3 py-1.5 rounded-xl bg-stadiumGreen text-black font-black text-xs">
                      View Match ➔
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: REFERRALS (CLICKABLE LIST BASED ON USERNAME) */}
        {activeTab === 'REFERRALS' && (
          <div className="p-6 rounded-3xl bg-panel border border-white/10 space-y-6 shadow-xl">
            <div className="space-y-2">
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-400" />
                <span>YOUR RECRUITED PUNTERS & REFERRAL REWARDS</span>
              </h3>
              <p className="text-xs text-gray-400 font-sans">
                Your personal referral link is based on your username. Share it to recruit punters and earn rewards directly in your Aura wallet.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black border border-stadiumGreen/40 space-y-3">
              <span className="text-xs font-black text-stadiumGreen block">YOUR UNIQUE REFERRAL URL:</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={referralUrl}
                  className="flex-1 p-3 rounded-xl bg-panel border border-white/15 text-white font-mono text-xs"
                />
                <button
                  onClick={copyReferralLink}
                  className="px-5 py-3 rounded-xl bg-stadiumGreen text-black font-black text-xs hover:bg-emerald-400 transition-all flex items-center space-x-1.5"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copiedLink ? 'Copied! ✓' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-center space-y-1">
                <span className="text-2xl font-black text-purple-400">{referralsList.length}</span>
                <span className="text-xs font-bold text-white block">Total Referrals</span>
                <span className="text-[10px] text-gray-400 block font-sans">Tracked via @{cleanUsername}</span>
              </div>
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-center space-y-1">
                <span className="text-2xl font-black text-gold">+{referralsList.length * 150}</span>
                <span className="text-xs font-bold text-white block">Earned Aura Bonus</span>
                <span className="text-[10px] text-gray-400 block font-sans">Credited instantly</span>
              </div>
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-center space-y-1">
                <span className="text-2xl font-black text-stadiumGreen">+{referralsList.length * 150} XP</span>
                <span className="text-xs font-bold text-white block">Progression XP</span>
                <span className="text-[10px] text-gray-400 block font-sans">+150 XP per signup</span>
              </div>
            </div>

            {/* DETAILED REFERRED PUNTERS BREAKDOWN */}
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-black text-white flex items-center space-x-2">
                <Award className="w-4 h-4 text-gold" />
                <span>REFERRAL MEMBERSHIP ROSTER ({referralsList.length})</span>
              </h4>

              {referralsList.length === 0 ? (
                <div className="p-8 rounded-2xl bg-black/40 border border-dashed border-white/10 text-center space-y-3">
                  <Users className="w-10 h-10 text-gray-600 mx-auto" />
                  <p className="text-xs text-white font-bold">No friends have joined via your link yet.</p>
                  <p className="text-[10px] text-gray-400 font-sans max-w-sm mx-auto">
                    Copy your personal link <code className="text-stadiumGreen">{referralUrl}</code> and share it on WhatsApp or Telegram to earn +150 Aura and +150 XP for each punter!
                  </p>
                  <button
                    onClick={copyReferralLink}
                    className="px-4 py-2 rounded-xl bg-stadiumGreen text-black font-black text-xs"
                  >
                    Share Link Now ➔
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {referralsList.map((ref, idx) => (
                    <div key={ref.id || idx} className="p-3.5 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center font-black text-sm">
                          {idx + 1}
                        </div>
                        <div>
                          <span className="font-black text-white text-xs block">{ref.username}</span>
                          <span className="text-[10px] text-gray-400 font-sans">Joined: {ref.joinedAt}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black text-gold block">+{ref.auraCredited} AURA</span>
                        <span className="text-[9px] text-stadiumGreen font-bold uppercase">{ref.status || 'ACTIVE ✓'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0a0d14] border border-stadiumGreen/40 rounded-3xl p-6 space-y-4 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-black text-base text-white flex items-center space-x-2">
                <Edit3 className="w-4 h-4 text-stadiumGreen" />
                <span>EDIT FAN PROFILE</span>
              </h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-[10px] text-gray-400 font-bold block mb-1">USERNAME (USED FOR REFERRALS & CLOUT):</label>
                <div className="flex items-center bg-black border border-white/20 rounded-xl px-3 py-2">
                  <span className="text-stadiumGreen font-bold mr-1">@</span>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none"
                    placeholder="your_handle"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 font-bold block mb-1.5">CHOOSE AVATAR ICON:</label>
                <div className="grid grid-cols-5 gap-2">
                  {AVAILABLE_AVATARS.map((av) => (
                    <button
                      type="button"
                      key={av}
                      onClick={() => setEditAvatar(av)}
                      className={cn(
                        'w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all',
                        editAvatar === av
                          ? 'bg-stadiumGreen text-black scale-110 shadow-md'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      )}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 font-bold block mb-1">LOYALTY CLUB:</label>
                <select
                  value={editClub}
                  onChange={(e) => setEditClub(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:outline-none"
                >
                  {AVAILABLE_CLUBS.map((c) => (
                    <option key={c} value={c} className="bg-black text-white">{c}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-stadiumGreen text-black font-black text-xs hover:bg-emerald-400 transition-all shadow"
                >
                  Save Profile Changes ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
