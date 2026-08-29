'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Flame, Zap, Gift, Send, Copy, Check, ExternalLink,
  MessageSquare, Heart, Share2, ArrowLeft, Users, Settings,
  Shield, Sparkles, TrendingUp, Trophy, Compass, ChevronRight, X,
  Bookmark, Bell, Star, Ticket, CheckCircle2, XCircle, Clock, Edit3,
  UserCheck, Award, Lock, Smartphone, Globe, Sliders, Download, Eye, Save
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { stadiumAudio } from '../../lib/sound-synthesizer';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { cn } from '../../lib/utils';
import { PersistentStorage, PlacedTicket } from '../../lib/persistent-storage-engine';
import { UserProfileEngine, UserProfileData, UserReferralRecord, UserSettings } from '../../lib/user-profile-engine';
import { calculateLevelFromXp, LEVEL_MILESTONES, XP_REWARDS } from '../../lib/xp-engine';
import { ClubSupporterPassCard, POPULAR_CLUBS } from '../../components/club-supporter-pass-card';
import { ClubSelectorModal } from '../../components/club-selector-modal';

const AVAILABLE_AVATARS = ['⚡', '👑', '🦁', '🦅', '🐐', '🔥', '💎', '🚀', '⚽', '🎯', '🥊', '🏎️'];
const AVAILABLE_SPORTS = ['SOCCER', 'BASKETBALL', 'TENNIS', 'COMBAT', 'AMERICAN_FOOTBALL', 'CRICKET'];
const AVAILABLE_TIMEZONES = [
  'Africa/Lagos (WAT, UTC+1)',
  'Africa/Johannesburg (SAST, UTC+2)',
  'Africa/Nairobi (EAT, UTC+3)',
  'Africa/Accra (GMT, UTC+0)',
  'Europe/London (GMT/BST)',
  'America/New_York (EST, UTC-5)',
];

export default function EnterpriseUserDashboardPage() {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'EDIT_PROFILE' | 'SETTINGS' | 'TICKETS' | 'REFERRALS' | 'SECURITY'>('OVERVIEW');
  const [profile, setProfile] = useState<UserProfileData>(() => UserProfileEngine.getProfile());
  const [dailyClaimed, setDailyClaimed] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showClubModal, setShowClubModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Edit Personal Information Form State
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    nickname: '',
    email: '',
    phone: '',
    whatsappNumber: '',
    telegramHandle: '',
    bio: '',
    country: '',
    city: '',
    birthDate: '',
    avatar: '⚡',
    avatarCustomUrl: '',
    club: 'Arsenal',
    secondaryClub: 'Super Eagles',
  });

  // Settings State
  const [settingsData, setSettingsData] = useState<UserSettings>(profile.settings);

  // Persistent User Data State
  const [placedTickets, setPlacedTickets] = useState<PlacedTicket[]>([]);
  const [followedMatches, setFollowedMatches] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  // Load and auto-settle tickets on mount
  useEffect(() => {
    const current = UserProfileEngine.getProfile();
    setProfile(current);
    setFormData({
      username: current.username,
      fullName: current.fullName || '',
      nickname: current.nickname || '',
      email: current.email || '',
      phone: current.phone || '',
      whatsappNumber: current.whatsappNumber || '',
      telegramHandle: current.telegramHandle || '',
      bio: current.bio || '',
      country: current.country || 'Nigeria',
      city: current.city || 'Lagos',
      birthDate: current.birthDate || '1998-01-01',
      avatar: current.avatar || '⚡',
      avatarCustomUrl: current.avatarCustomUrl || '',
      club: current.club || 'Arsenal',
      secondaryClub: current.secondaryClub || 'Super Eagles',
    });
    setSettingsData(current.settings);

    // Check daily aura claim persistence
    const todayStr = new Date().toISOString().split('T')[0];
    if (typeof window !== 'undefined' && localStorage.getItem('mivaj_daily_claimed_date') === todayStr) {
      setDailyClaimed(true);
    }

    setPlacedTickets(PersistentStorage.getPlacedTickets());
    setFollowedMatches(PersistentStorage.getFollowedMatches());
    setBookmarks(PersistentStorage.getBookmarks());

    // SYSTEM-WIDE TICKET SETTLEMENT PASS
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
          setProfile(UserProfileEngine.getProfile());
        }
      }
    });

    const handleProfileSync = (e: any) => {
      if (e?.detail) setProfile(e.detail);
      else setProfile(UserProfileEngine.getProfile());
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

    try { phoneHardware.triggerHaptic('SUCCESS'); } catch {}
    try { stadiumAudio.playGoalSiren(); } catch {}
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });

    UserProfileEngine.addAura(250);
    UserProfileEngine.addXp(XP_REWARDS.DAILY_VISIT, 'Daily check-in aura drop');
    setProfile(UserProfileEngine.getProfile());
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    try { phoneHardware.triggerHaptic('SUCCESS'); } catch {}
    try { stadiumAudio.playTabClickSound(); } catch {}
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });

    const updated = UserProfileEngine.updateProfile({
      username: formData.username.trim() || profile.username,
      fullName: formData.fullName.trim() || profile.fullName,
      nickname: formData.nickname.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      whatsappNumber: formData.whatsappNumber.trim(),
      telegramHandle: formData.telegramHandle.trim(),
      bio: formData.bio.trim(),
      country: formData.country.trim(),
      city: formData.city.trim(),
      birthDate: formData.birthDate,
      avatar: formData.avatar,
      avatarCustomUrl: formData.avatarCustomUrl.trim(),
      club: formData.club,
      secondaryClub: formData.secondaryClub,
    });

    setProfile(updated);
    setSaveStatus('✅ Personal profile saved successfully! All systems updated.');
    setTimeout(() => setSaveStatus(null), 4000);
  };

  const handleSaveSettings = (partial: Partial<UserSettings>) => {
    try { phoneHardware.triggerHaptic('SELECTION'); } catch {}
    const updated = UserProfileEngine.updateSettings(partial);
    setSettingsData(updated);
    setProfile(UserProfileEngine.getProfile());
    setSaveStatus('⚙️ Preferences updated and persisted.');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleExportUserData = () => {
    try { phoneHardware.triggerHaptic('SUCCESS'); } catch {}
    const dump = {
      profile,
      placedTickets,
      followedMatches,
      bookmarks,
      exportedAt: new Date().toISOString(),
      platform: 'Mivaj Sports Military-Grade PAM v2.0',
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dump, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', 'mivaj_user_backup_' + profile.username + '_' + Date.now() + '.json');
    dlAnchor.click();
  };

  const handleCopyReferral = () => {
    const link = 'https://mivaj.com?ref=' + encodeURIComponent(profile.username);
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    try { phoneHardware.triggerHaptic('SUCCESS'); } catch {}
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <main className="min-h-screen bg-void text-white font-mono p-3 sm:p-8 space-y-6 pb-24">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Navbar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link
            href="/"
            className="px-3.5 py-2 rounded-xl bg-panel hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 hover:text-white flex items-center space-x-2 transition-all shadow-md active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Match Center 🏟️</span>
          </Link>

          <div className="flex items-center space-x-2">
            <span className="text-stadiumGreen font-black text-sm">MIVAJ SPORTS</span>
            <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[10px] font-black border border-purple-500/30">
              ACCOUNT &amp; SETTINGS COMMAND 🛡️
            </span>
          </div>
        </div>

        {/* Global Supporter Pass Card (Viral Club Loyalty Engine) */}
        <ClubSupporterPassCard onOpenClubSelector={() => setShowClubModal(true)} />

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-none bg-panel/80 p-1.5 rounded-2xl border border-white/10">
          {[
            { id: 'OVERVIEW', label: '📊 Overview', icon: Users },
            { id: 'EDIT_PROFILE', label: '✏️ Edit Profile', icon: Edit3 },
            { id: 'SETTINGS', label: '⚙️ Settings & System', icon: Settings },
            { id: 'TICKETS', label: `🎟️ Placed Tickets (${placedTickets.length})`, icon: Ticket },
            { id: 'REFERRALS', label: `👥 Referrals (${profile.referrals.length})`, icon: Gift },
            { id: 'SECURITY', label: '🔒 Security & Export', icon: Shield },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                try { phoneHardware.triggerHaptic('SELECTION'); } catch {}
                setActiveTab(tab.id as any);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                activeTab === tab.id
                  ? 'bg-stadiumGreen text-black font-black shadow-md shadow-stadiumGreen/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Save Status Toast */}
        {saveStatus && (
          <div className="p-3 rounded-2xl bg-stadiumGreen/20 border border-stadiumGreen text-stadiumGreen text-xs font-black animate-fadeIn flex items-center justify-between shadow-lg">
            <span>{saveStatus}</span>
            <button onClick={() => setSaveStatus(null)} className="text-gray-400 hover:text-white">✕</button>
          </div>
        )}

        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Aura Wallet */}
              <div className="p-4 rounded-3xl bg-panel border border-gold/30 space-y-2 relative overflow-hidden shadow-xl">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">AURA WALLET</span>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <Zap className="w-5 h-5 text-gold fill-gold animate-pulse" />
                    <span className="text-2xl font-black text-white">{profile.auraBalance.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={handleClaimDailyAura}
                    disabled={dailyClaimed}
                    className={`px-3 py-1 rounded-xl text-[10px] font-black transition-all ${
                      dailyClaimed ? 'bg-white/10 text-gray-400' : 'bg-gold text-black hover:bg-amber-300 shadow-md'
                    }`}
                  >
                    {dailyClaimed ? 'Claimed ✓' : '+250 Daily 🎁'}
                  </button>
                </div>
                <span className="text-[10px] text-gold/80 block font-sans">Used for unlocks &amp; prediction tools</span>
              </div>

              {/* Supporter Aura Streak */}
              <div className="p-4 rounded-3xl bg-panel border border-stadiumGreen/30 space-y-2 relative overflow-hidden shadow-xl">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">MATCHDAY STREAK</span>
                <div className="flex items-center space-x-1.5">
                  <span className="text-2xl font-black text-stadiumGreen">🔥 {profile.streakDays || 12} Days</span>
                </div>
                <span className="text-[10px] text-gray-400 block font-sans">Active fan check-in multiplier (2.5x Aura Boost)</span>
              </div>

              {/* XP & Level */}
              <div className="p-4 rounded-3xl bg-panel border border-cyan-500/30 space-y-2 relative overflow-hidden shadow-xl">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">TACTICIAN LEVEL</span>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-cyan-400">LVL {profile.level.level}</span>
                  <span className="text-[10px] text-cyan-300 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30">
                    {profile.level.title}
                  </span>
                </div>
                {/* XP Progress Bar */}
                <div className="space-y-1">
                  <div className="h-1.5 bg-black/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-stadiumGreen rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.round((profile.xp / (profile.level.nextLevelXp || 2000)) * 100))}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-gray-400 font-mono">
                    <span>{profile.xp} XP</span>
                    <span>{profile.level.nextLevelXp} XP Next</span>
                  </div>
                </div>
              </div>

              {/* VIP Tier */}
              <div className="p-4 rounded-3xl bg-panel border border-purple-500/30 space-y-2 relative overflow-hidden shadow-xl">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">COMMUNITY VIP STATUS</span>
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-purple-400" />
                  <span className="text-xs font-black text-purple-300 truncate">{profile.vipTier}</span>
                </div>
                <span className="text-[10px] text-gray-400 block font-sans">Member Since {profile.memberSince}</span>
              </div>
            </div>

            {/* Profile Bio Dossier Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-panel border border-white/10 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-16 h-16 rounded-2xl bg-black border-2 border-stadiumGreen p-1 flex items-center justify-center text-3xl shadow-lg relative">
                    {profile.avatarCustomUrl ? (
                      <img src={profile.avatarCustomUrl} alt={profile.username} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <span>{profile.avatar}</span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-white">{profile.fullName || profile.username}</h2>
                    <span className="text-xs text-stadiumGreen font-bold block">@{profile.username} &bull; {profile.city}, {profile.country}</span>
                    <span className="text-[10px] text-gray-400 font-sans block">{profile.email} &bull; {profile.phone}</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('EDIT_PROFILE')}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white flex items-center space-x-1.5 transition-all self-start sm:self-auto"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Personal Info</span>
                </button>
              </div>

              {profile.bio && (
                <p className="text-xs text-gray-300 font-sans italic bg-black/40 p-3 rounded-2xl border border-white/5">
                  "{profile.bio}"
                </p>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                <div className="p-3 rounded-xl bg-black/50 border border-white/5">
                  <span className="text-[9px] text-gray-400 block">PRIMARY CLUB</span>
                  <span className="font-bold text-white text-xs">{profile.club}</span>
                </div>
                <div className="p-3 rounded-xl bg-black/50 border border-white/5">
                  <span className="text-[9px] text-gray-400 block">TELEGRAM HANDLE</span>
                  <span className="font-bold text-white text-xs truncate">{profile.telegramHandle || 'Not Linked'}</span>
                </div>
                <div className="p-3 rounded-xl bg-black/50 border border-white/5">
                  <span className="text-[9px] text-gray-400 block">ODDS FORMAT</span>
                  <span className="font-bold text-gold text-xs">{profile.settings.oddsFormat}</span>
                </div>
                <div className="p-3 rounded-xl bg-black/50 border border-white/5">
                  <span className="text-[9px] text-gray-400 block">TIMEZONE</span>
                  <span className="font-bold text-white text-xs truncate">{profile.settings.timezone.split(' ')[0]}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: EDIT PROFILE (EVERY FIELD EDITABLE) ================= */}
        {activeTab === 'EDIT_PROFILE' && (
          <form onSubmit={handleSaveProfile} className="space-y-5 animate-fadeIn">
            <div className="p-5 sm:p-7 rounded-3xl bg-panel border border-white/15 space-y-5 shadow-2xl">
              <div className="border-b border-white/10 pb-3">
                <h2 className="text-base sm:text-lg font-black text-white flex items-center space-x-2">
                  <span>EDIT PERSONAL INFORMATION</span>
                  <span className="text-[10px] text-stadiumGreen font-normal bg-stadiumGreen/10 px-2 py-0.5 rounded border border-stadiumGreen/30">
                    100% Editable &amp; Synchronized
                  </span>
                </h2>
                <p className="text-xs text-gray-400 font-sans">
                  Update your identity, contacts, supporting club, and biography across all Mivaj systems.
                </p>
              </div>

              {/* Avatar Selector */}
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 font-bold uppercase block">CHOOSE AVATAR BADGE</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_AVATARS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setFormData({ ...formData, avatar: av })}
                      className={`w-11 h-11 rounded-2xl text-xl flex items-center justify-center transition-all border ${
                        formData.avatar === av
                          ? 'bg-stadiumGreen border-stadiumGreen scale-110 shadow-lg'
                          : 'bg-black/60 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
                <div className="pt-1">
                  <label className="text-[10px] text-gray-400 font-sans">Or paste custom profile photo URL:</label>
                  <input
                    type="url"
                    value={formData.avatarCustomUrl}
                    onChange={(e) => setFormData({ ...formData, avatarCustomUrl: e.target.value })}
                    placeholder="https://example.com/my-photo.jpg"
                    className="w-full mt-1 p-2.5 rounded-xl bg-black border border-white/10 text-xs text-white placeholder-gray-500 focus:border-stadiumGreen focus:outline-none"
                  />
                </div>
              </div>

              {/* Primary Identity Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">FULL NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Victor Chukwuemeka"
                    className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs text-white focus:border-stadiumGreen focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">DISPLAY USERNAME</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="e.g. CyberStriker_99"
                    className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs text-white focus:border-stadiumGreen focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@mivaj.com"
                    className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs text-white focus:border-stadiumGreen focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">PHONE NUMBER</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+234 800 000 0000"
                    className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs text-white focus:border-stadiumGreen focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">WHATSAPP NUMBER</label>
                  <input
                    type="tel"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    placeholder="+234 800 000 0000"
                    className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs text-white focus:border-stadiumGreen focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">TELEGRAM HANDLE</label>
                  <input
                    type="text"
                    value={formData.telegramHandle}
                    onChange={(e) => setFormData({ ...formData, telegramHandle: e.target.value })}
                    placeholder="@username"
                    className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs text-white focus:border-stadiumGreen focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">COUNTRY</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="Nigeria"
                    className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs text-white focus:border-stadiumGreen focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">CITY / REGION</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Port Harcourt / Lagos"
                    className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs text-white focus:border-stadiumGreen focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">SUPPORTING CLUB</label>
                  <select
                    value={formData.club}
                    onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs text-white focus:border-stadiumGreen focus:outline-none"
                  >
                    {Object.keys(POPULAR_CLUBS).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">DATE OF BIRTH</label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs text-white focus:border-stadiumGreen focus:outline-none"
                  />
                </div>
              </div>

              {/* Bio & Motto */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase">FAN BIO &amp; MOTTO</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell the community about your betting style, favorite club, or football passion..."
                  className="w-full p-3 rounded-xl bg-black border border-white/10 text-xs text-white focus:border-stadiumGreen focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-stadiumGreen text-black font-black text-xs hover:bg-emerald-400 transition-all shadow-lg glow-emerald flex items-center space-x-2 active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Personal Information</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ================= TAB 3: SETTINGS & SYSTEM ================= */}
        {activeTab === 'SETTINGS' && (
          <div className="p-5 sm:p-7 rounded-3xl bg-panel border border-white/15 space-y-6 shadow-2xl animate-fadeIn">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-base sm:text-lg font-black text-white flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-stadiumGreen" />
                <span>EXPERIENCE &amp; SYSTEM SETTINGS</span>
              </h2>
              <p className="text-xs text-gray-400 font-sans">
                Customize your odds calculations, notification alerts, matchday vibrations, and sound effects.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Odds Format */}
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                <label className="text-[10px] text-gold font-bold uppercase block">ODDS DISPLAY FORMAT</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['DECIMAL', 'FRACTIONAL', 'AMERICAN'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => handleSaveSettings({ oddsFormat: fmt })}
                      className={`p-2 rounded-xl text-xs font-black transition-all border ${
                        settingsData.oddsFormat === fmt
                          ? 'bg-gold text-black border-gold shadow-md'
                          : 'bg-black text-gray-400 border-white/10 hover:text-white'
                      }`}
                    >
                      {fmt === 'DECIMAL' ? '1.50' : fmt === 'FRACTIONAL' ? '1/2' : '-200'}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-gray-400 font-sans block">Currently applied across all Banker pick cards</span>
              </div>

              {/* Haptic Intensity */}
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                <label className="text-[10px] text-cyan-400 font-bold uppercase block">MATCHDAY HAPTIC VIBRATION</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['HIGH', 'MEDIUM', 'OFF'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => handleSaveSettings({ hapticIntensity: lvl })}
                      className={`p-2 rounded-xl text-xs font-black transition-all border ${
                        settingsData.hapticIntensity === lvl
                          ? 'bg-cyan-500 text-black border-cyan-400 shadow-md'
                          : 'bg-black text-gray-400 border-white/10 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-gray-400 font-sans block">Physical vibration on live goals &amp; ticket cashouts</span>
              </div>
            </div>

            {/* Notification Toggles */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">NOTIFICATION ALERTS</span>
              
              <div className="space-y-2">
                <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-white block">Telegram Banker Direct Alerts</span>
                    <span className="text-[10px] text-gray-400 font-sans">Receive verified high-probability banker slips straight to @mivajsport</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settingsData.notifyTelegramBankers}
                    onChange={(e) => handleSaveSettings({ notifyTelegramBankers: e.target.checked })}
                    className="w-4 h-4 accent-stadiumGreen rounded"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-white block">Sound Effects &amp; Goal Chimes</span>
                    <span className="text-[10px] text-gray-400 font-sans">Play crowd roars and referee whistles when matches settle</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settingsData.soundEffects}
                    onChange={(e) => handleSaveSettings({ soundEffects: e.target.checked })}
                    className="w-4 h-4 accent-stadiumGreen rounded"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-white block">Nightly Audit &amp; Reconciliation Alert</span>
                    <span className="text-[10px] text-gray-400 font-sans">Daily evening summary of all won tickets recorded in the official referee ledger</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settingsData.notifyNightlyAudit}
                    onChange={(e) => handleSaveSettings({ notifyNightlyAudit: e.target.checked })}
                    className="w-4 h-4 accent-stadiumGreen rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: MY TICKETS ================= */}
        {activeTab === 'TICKETS' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-3xl bg-panel border border-white/15 flex items-center justify-between">
              <div>
                <h2 className="font-black text-sm text-white">MY PLACED TICKETS &amp; SLIPS</h2>
                <span className="text-[10px] text-gray-400 font-sans">Automatic referee settlement &bull; Payout verification</span>
              </div>
              <span className="text-xs font-mono font-bold text-stadiumGreen">{placedTickets.length} Placed</span>
            </div>

            {placedTickets.length === 0 ? (
              <div className="p-8 rounded-3xl bg-black/40 border border-white/10 text-center space-y-2">
                <Ticket className="w-8 h-8 text-gray-500 mx-auto" />
                <span className="text-xs text-gray-400 block font-sans">No tickets placed yet. Add bankers from the match center to track your slips here!</span>
                <Link href="/" className="inline-block px-4 py-2 rounded-xl bg-stadiumGreen text-black font-black text-xs">
                  Explore Today's Bankers ➔
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5">
                {placedTickets.map((t) => (
                  <div key={t.id} className="p-4 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block">{t.fixture}</span>
                      <span className="text-[10px] text-gray-400 font-sans">{t.league} &bull; Pick: <b>{t.selection}</b> @ {t.odds}</span>
                    </div>
                    <div className="text-right">
                      <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] border ${
                        t.status === 'WON'
                          ? 'bg-stadiumGreen text-black border-stadiumGreen'
                          : t.status === 'LOST'
                          ? 'bg-red-500/20 text-red-400 border-red-500/40'
                          : 'bg-gold/20 text-gold border-gold/30 animate-pulse'
                      }`}>
                        {t.status === 'WON' ? 'WON ✅' : t.status === 'LOST' ? 'LOST ❌' : 'PENDING ⏳'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 5: REFERRALS ================= */}
        {activeTab === 'REFERRALS' && (
          <div className="p-5 sm:p-7 rounded-3xl bg-panel border border-white/15 space-y-5 shadow-2xl animate-fadeIn">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-base sm:text-lg font-black text-white flex items-center space-x-2">
                <Gift className="w-5 h-5 text-gold" />
                <span>REFERRAL NETWORK &amp; AURA DROPS</span>
              </h2>
              <p className="text-xs text-gray-400 font-sans">
                Earn 1,000 Aura Points + Supporter Streak Level Boost for every friend who joins Mivaj Sports via your link.
              </p>
            </div>

            {/* Share Box */}
            <div className="p-4 rounded-2xl bg-black/60 border border-gold/40 space-y-2">
              <span className="text-[10px] text-gold font-bold uppercase block">YOUR UNIQUE REFERRAL LINK</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`https://mivaj.com?ref=${profile.username}`}
                  className="flex-1 p-2.5 rounded-xl bg-black border border-white/10 text-xs text-gray-300 font-mono focus:outline-none"
                />
                <button
                  onClick={handleCopyReferral}
                  className="px-4 py-2.5 rounded-xl bg-gold text-black font-black text-xs hover:bg-amber-300 transition-all flex items-center space-x-1"
                >
                  {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Referrals List */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                REFERRED FRIENDS ({profile.referrals.length})
              </span>
              {profile.referrals.length === 0 ? (
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-center text-xs text-gray-500 font-sans">
                  No friends joined yet. Share your link above on WhatsApp or Telegram to earn +500 Aura instantly!
                </div>
              ) : (
                <div className="space-y-2">
                  {profile.referrals.map((r) => (
                    <div key={r.id} className="p-3 rounded-xl bg-black/50 border border-white/5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white">{r.username}</span>
                        <span className="text-[10px] text-gray-400 block font-sans">Joined {r.joinedAt}</span>
                      </div>
                      <span className="text-stadiumGreen font-bold font-mono">+{r.auraCredited} Aura</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 6: SECURITY & EXPORT ================= */}
        {activeTab === 'SECURITY' && (
          <div className="p-5 sm:p-7 rounded-3xl bg-panel border border-white/15 space-y-5 shadow-2xl animate-fadeIn">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-base sm:text-lg font-black text-white flex items-center space-x-2">
                <Shield className="w-5 h-5 text-stadiumGreen" />
                <span>SECURITY, GDPR &amp; DATA EXPORT</span>
              </h2>
              <p className="text-xs text-gray-400 font-sans">
                Military-grade personal data protection, complete portability, and session controls.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-xs text-white block">Download Complete Personal Data (GDPR Portability)</span>
                  <span className="text-[10px] text-gray-400 font-sans">Export all profile info, ticket history, referrals, and settings as a clean JSON file</span>
                </div>
                <button
                  onClick={handleExportUserData}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white flex items-center space-x-1.5 transition-all self-start sm:self-auto"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Backup (.JSON)</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-white block">Two-Factor Authentication (2FA)</span>
                  <span className="text-[10px] text-gray-400 font-sans">Enforce verification codes for high-value wallet actions</span>
                </div>
                <button
                  onClick={() => handleSaveSettings({ twoFactorEnabled: !settingsData.twoFactorEnabled })}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                    settingsData.twoFactorEnabled
                      ? 'bg-stadiumGreen text-black border-stadiumGreen'
                      : 'bg-white/10 text-gray-400 border-white/10'
                  }`}
                >
                  {settingsData.twoFactorEnabled ? 'Enabled 🔒' : 'Disabled'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Club Selector Modal */}
      <ClubSelectorModal
        isOpen={showClubModal}
        onClose={() => setShowClubModal(false)}
        currentClub={profile.club}
      />
    </main>
  );
}
