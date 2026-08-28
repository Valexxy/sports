'use client';

import React, { useState, useEffect } from 'react';
import {
  Flame, Zap, Gift, Send, Copy, Check, ExternalLink,
  MessageSquare, Heart, Share2, ArrowLeft, Users, Settings,
  Shield, Sparkles, TrendingUp, Trophy, Compass, ChevronRight, X,
  Bookmark, Bell, Star, Ticket, CheckCircle2, XCircle, Clock
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { stadiumAudio } from '../../lib/sound-synthesizer';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { cn } from '../../lib/utils';
import { PersistentStorage, PlacedTicket } from '../../lib/persistent-storage-engine';

export default function MultiDeviceResponsiveDashboard() {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TICKETS' | 'FOLLOWED' | 'REFERRALS'>('OVERVIEW');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [dailyClaimed, setDailyClaimed] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Persistent User Data State
  const [placedTickets, setPlacedTickets] = useState<PlacedTicket[]>([]);
  const [followedMatches, setFollowedMatches] = useState<string[]>([]);
  const [followedClubs, setFollowedClubs] = useState<string[]>([]);
  const [followedPlayers, setFollowedPlayers] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [referralData, setReferralData] = useState<{ referralCode: string; count: number; earnedAura: number }>({
    referralCode: 'AURABALLER99',
    count: 3,
    earnedAura: 450,
  });

  useEffect(() => {
    // Load stored user data
    setPlacedTickets(PersistentStorage.getPlacedTickets());
    setFollowedMatches(PersistentStorage.getFollowedMatches());
    setFollowedClubs(PersistentStorage.getFollowedClubs());
    setFollowedPlayers(PersistentStorage.getFollowedPlayers());
    setBookmarks(PersistentStorage.getBookmarks());
    setReferralData(PersistentStorage.getReferralData());

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
      .catch(() => {
        setCurrentUser({
          username: 'CyberStriker_99',
          avatar: '⚡',
          club: 'Arsenal',
          aura_balance: 1450,
          vip_tier: 'PLATINUM PRODIGY 👑',
          role: 'MEMBER',
        });
      });
  }, []);

  const handleClaimDailyAura = () => {
    if (dailyClaimed) return;
    setDailyClaimed(true);
    setCurrentUser((prev: any) => ({
      ...prev,
      aura_balance: (prev?.aura_balance || 1450) + 150,
    }));
    try { phoneHardware.triggerHaptic('AFRO_BEAT'); } catch {}
    try { stadiumAudio.playAfrobeatVictory(); } catch {}
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });
  };

  const referralUrl = `https://mivaj.com?ref=${referralData.referralCode}`;

  const copyReferralLink = () => {
    try {
      navigator.clipboard.writeText(referralUrl);
      setCopiedLink(true);
      try { phoneHardware.triggerHaptic('SUCCESS'); } catch {}
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-void text-white font-mono text-xs overflow-x-hidden selection:bg-stadiumGreen selection:text-black pb-24 lg:pb-8">
      
      {/* 1. TOP ENTERPRISE HEADER */}
      <header className="sticky top-0 z-30 bg-black/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-stadiumGreen via-emerald-400 to-gold p-0.5 flex items-center justify-center shadow-lg">
            <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center text-base">
              ⚡
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-sm sm:text-base text-white tracking-wider">ENTERPRISE USER DASHBOARD</span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-stadiumGreen text-black font-black">ACTIVE</span>
            </div>
            <span className="text-[10px] text-gray-400 font-sans hidden sm:block">Track Placed Bets, Followed Fixtures, Bookmarks, and Referral Rewards</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-panel border border-white/10 text-xs">
            <span className="text-gray-400">STASH:</span>
            <span className="font-bold text-gold">{(currentUser?.aura_balance || 1450).toLocaleString()} AURA</span>
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
        <div className="glass-panel-premium rounded-3xl p-6 border border-stadiumGreen/40 shadow-2xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-stadiumGreen via-emerald-400 to-purple-500 p-0.5 shadow-xl">
                  <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center text-3xl">
                    {currentUser?.avatar || '⚡'}
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded bg-stadiumGreen text-black font-black text-[9px]">
                  LVL 7
                </span>
              </div>

              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-black text-white">@{currentUser?.username || 'CyberStriker_99'}</h1>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-gold/20 border border-gold text-gold font-bold text-[10px]">
                    {currentUser?.vip_tier || 'PLATINUM PRODIGY 👑'}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    Loyalty: <strong className="text-stadiumGreen">{currentUser?.club || 'Arsenal'}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 min-w-[280px]">
              <div className="p-3 rounded-2xl bg-black/60 border border-stadiumGreen/30 text-center">
                <Ticket className="w-4 h-4 text-stadiumGreen mx-auto mb-1" />
                <span className="text-base font-black text-stadiumGreen">{placedTickets.length}</span>
                <span className="text-[9px] text-gray-400 block uppercase">Bets Placed</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/60 border border-gold/30 text-center">
                <Bell className="w-4 h-4 text-gold mx-auto mb-1" />
                <span className="text-base font-black text-gold">{followedMatches.length}</span>
                <span className="text-[9px] text-gray-400 block uppercase">Followed</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/60 border border-cyan-400/30 text-center">
                <Bookmark className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                <span className="text-base font-black text-cyan-400">{bookmarks.length}</span>
                <span className="text-[9px] text-gray-400 block uppercase">Bookmarks</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/60 border border-purple-400/30 text-center">
                <Users className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                <span className="text-base font-black text-purple-400">{referralData.count}</span>
                <span className="text-[9px] text-gray-400 block uppercase">Referrals</span>
              </div>
            </div>
          </div>

          {/* Daily Aura Claim Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-white/10 gap-3">
            <div className="flex items-center space-x-2 text-xs text-gray-300">
              <Gift className="w-4 h-4 text-gold" />
              <span>AURA WALLET BALANCE: <strong className="text-gold font-mono text-sm">{(currentUser?.aura_balance || 1450).toLocaleString()} AURA</strong></span>
            </div>

            <button
              onClick={handleClaimDailyAura}
              disabled={dailyClaimed}
              className={cn(
                'px-5 py-2.5 rounded-2xl font-black text-xs shadow-lg transition-all flex items-center space-x-2',
                dailyClaimed
                  ? 'bg-white/10 text-gray-400 cursor-not-allowed border border-white/10'
                  : 'bg-gradient-to-r from-gold to-yellow-400 text-black hover:scale-105'
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
            { key: 'REFERRALS', label: '👥 Referral Rewards', count: referralData.count },
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

        {/* TAB CONTENTS */}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'OVERVIEW' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 8 Cols: Recent Tickets & Followed Highlights */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Placed Tickets Card */}
              <div className="p-6 rounded-3xl bg-panel/80 border border-white/10 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-black text-white flex items-center space-x-2">
                    <Ticket className="w-4 h-4 text-stadiumGreen" />
                    <span>RECENTLY PLACED BETS ("I BET THIS")</span>
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
                    {placedTickets.slice(0, 4).map((ticket) => (
                      <div key={ticket.id} className="p-3.5 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <span className="text-[10px] text-gray-400 block font-bold truncate">{ticket.league}</span>
                          <span className="text-xs font-black text-white block truncate">{ticket.homeTeam} vs {ticket.awayTeam}</span>
                          <span className="text-[11px] text-stadiumGreen font-bold block">Pick: {ticket.selection} @ {ticket.odds}</span>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className={cn(
                            'px-2.5 py-1 rounded-xl text-[10px] font-black uppercase inline-block',
                            ticket.status === 'WON' ? 'bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40' :
                            ticket.status === 'LOST' ? 'bg-crimson/20 text-crimson border border-crimson/40' :
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
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">Followed Clubs</span>
                    {followedClubs.length === 0 ? (
                      <span className="text-xs text-gray-500 block">Arsenal (Default)</span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {followedClubs.map((club) => (
                          <span key={club} className="px-2.5 py-1 rounded-xl bg-stadiumGreen/20 text-stadiumGreen font-black text-xs border border-stadiumGreen/30">
                            🛡️ {club}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">Followed Players</span>
                    {followedPlayers.length === 0 ? (
                      <span className="text-xs text-gray-500 block">Saka, Palmer, Osimhen</span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {followedPlayers.map((player) => (
                          <span key={player} className="px-2.5 py-1 rounded-xl bg-gold/20 text-gold font-black text-xs border border-gold/30">
                            ⭐ {player}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Right 4 Cols: Trackable Referral Widget & Quick Links */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Trackable Referral Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-panel via-black to-stadiumGreen/10 border border-stadiumGreen/40 space-y-4 shadow-xl">
                <div className="space-y-1">
                  <span className="text-xs font-black text-stadiumGreen flex items-center space-x-1.5">
                    <Users className="w-4 h-4" />
                    <span>YOUR TRACKABLE REFERRAL LINK</span>
                  </span>
                  <p className="text-[10px] text-gray-400 font-sans">
                    Share your link with friends to earn +150 Aura bonus for every new punter that joins Mivaj Sports!
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-black border border-white/15 space-y-2">
                  <span className="text-[9px] text-gray-500 font-bold block">PERSONAL REFERRAL LINK:</span>
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
                  <div className="p-3 rounded-2xl bg-black/60 border border-purple-400/30">
                    <span className="text-lg font-black text-purple-400">{referralData.count}</span>
                    <span className="text-[9px] text-gray-400 block">FRIENDS JOINED</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-black/60 border border-gold/30">
                    <span className="text-lg font-black text-gold">+{referralData.earnedAura}</span>
                    <span className="text-[9px] text-gray-400 block">AURA EARNED</span>
                  </div>
                </div>
              </div>

              {/* Quick Navigation Links */}
              <div className="p-5 rounded-3xl bg-panel/80 border border-white/10 space-y-2">
                <span className="text-xs font-black text-white block mb-3">ENTERPRISE QUICK NAV</span>
                
                <Link href="/converter" className="p-3 rounded-2xl bg-black/60 border border-white/10 hover:border-cyan-400 flex items-center justify-between text-xs text-gray-200 hover:text-white transition-all">
                  <span>⚡ SportyBet Booking Code Revealer</span>
                  <span className="text-cyan-400 font-bold">➔</span>
                </Link>

                <Link href="/settlement" className="p-3 rounded-2xl bg-black/60 border border-white/10 hover:border-stadiumGreen flex items-center justify-between text-xs text-gray-200 hover:text-white transition-all">
                  <span>📜 Official Match Settlement Ledger</span>
                  <span className="text-stadiumGreen font-bold">➔</span>
                </Link>

                <Link href="/birthdays" className="p-3 rounded-2xl bg-black/60 border border-white/10 hover:border-gold flex items-center justify-between text-xs text-gray-200 hover:text-white transition-all">
                  <span>🎂 World Sports Star Birthday Hub</span>
                  <span className="text-gold font-bold">➔</span>
                </Link>

                <Link href="/news" className="p-3 rounded-2xl bg-black/60 border border-white/10 hover:border-purple-400 flex items-center justify-between text-xs text-gray-200 hover:text-white transition-all">
                  <span>📰 Football News & Slander Wire</span>
                  <span className="text-purple-400 font-bold">➔</span>
                </Link>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: PLACED TICKETS */}
        {activeTab === 'TICKETS' && (
          <div className="p-6 rounded-3xl bg-panel border border-white/10 space-y-4 shadow-xl">
            <h3 className="text-base font-black text-white flex items-center space-x-2">
              <Ticket className="w-5 h-5 text-stadiumGreen" />
              <span>MY PLACED TICKETS & BETS TRACKER</span>
            </h3>

            {placedTickets.length === 0 ? (
              <div className="p-12 rounded-3xl bg-black/40 border border-dashed border-white/10 text-center space-y-3">
                <Ticket className="w-12 h-12 text-gray-600 mx-auto" />
                <h4 className="text-sm font-black text-white">No Tickets Placed Yet</h4>
                <p className="text-xs text-gray-400 font-sans max-w-md mx-auto">
                  When you browse match predictions in the arena and click "I Bet This 🎯", your tickets are recorded here permanently.
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
                        ticket.status === 'WON' ? 'bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/30' :
                        ticket.status === 'LOST' ? 'bg-crimson/20 text-crimson border border-crimson/30' :
                        'bg-gold/20 text-gold border border-gold/30'
                      )}>
                        {ticket.status === 'WON' ? 'WON ✓' : ticket.status === 'LOST' ? 'LOST ✗' : 'PENDING ⏳'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-white">{ticket.homeTeam} vs {ticket.awayTeam}</h4>
                      <p className="text-xs font-bold text-stadiumGreen">
                        Pick: <span className="text-gold font-mono">{ticket.selection}</span> @ {ticket.odds}
                      </p>
                      <span className="text-[10px] text-gray-400 block font-sans">Market: {ticket.market}</span>
                    </div>

                    <div className="flex items-center justify-between text-[9px] text-gray-500 pt-2 border-t border-white/5 font-mono">
                      <span>ID: {ticket.id.slice(0, 16)}</span>
                      <span>{new Date(ticket.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FOLLOWED FIXTURES */}
        {activeTab === 'FOLLOWED' && (
          <div className="p-6 rounded-3xl bg-panel border border-white/10 space-y-4 shadow-xl">
            <h3 className="text-base font-black text-white flex items-center space-x-2">
              <Bell className="w-5 h-5 text-gold" />
              <span>MY FOLLOWED MATCHES ({followedMatches.length})</span>
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
                      <span className="text-xs font-bold text-white block">Match ID: {id}</span>
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

        {/* TAB 4: REFERRALS */}
        {activeTab === 'REFERRALS' && (
          <div className="p-6 rounded-3xl bg-panel border border-white/10 space-y-6 shadow-xl">
            <div className="space-y-2">
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-400" />
                <span>TRACKABLE REFERRAL SYSTEM & COMMISSIONS</span>
              </h3>
              <p className="text-xs text-gray-400 font-sans">
                Every friend who clicks your link and joins Mivaj Sports credits your Aura Wallet with +150 Aura.
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
                  <span>{copiedLink ? 'Copied! ✓' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-center space-y-1">
                <span className="text-2xl font-black text-purple-400">{referralData.count}</span>
                <span className="text-xs font-bold text-white block">Total Referrals</span>
                <span className="text-[10px] text-gray-400 block font-sans">Tracked via unique URL</span>
              </div>
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-center space-y-1">
                <span className="text-2xl font-black text-gold">+{referralData.earnedAura}</span>
                <span className="text-xs font-bold text-white block">Earned Aura Bonus</span>
                <span className="text-[10px] text-gray-400 block font-sans">Credited automatically</span>
              </div>
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-center space-y-1">
                <span className="text-2xl font-black text-stadiumGreen">100%</span>
                <span className="text-xs font-bold text-white block">Attribution Accuracy</span>
                <span className="text-[10px] text-gray-400 block font-sans">Real-time ledger tracking</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
