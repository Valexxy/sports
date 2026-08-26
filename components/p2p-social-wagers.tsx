'use client';

import React, { useState, useMemo } from 'react';
import { MatchData } from '../lib/sports-api';
import { Swords, Trophy, Search, ShieldCheck, Check, Clock, Zap, Flame, UserCheck, Play, ArrowRight } from 'lucide-react';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';
import confetti from 'canvas-confetti';

interface P2PWagersProps {
  matches: MatchData[];
}

interface OpenChallenge {
  id: string;
  creator: string;
  matchTitle: string;
  league: string;
  creatorPick: string;
  stake: number;
  timeRemaining: string;
  status: 'OPEN' | 'ACCEPTED' | 'SETTLED';
  winner?: string;
}

const INITIAL_OPEN_CHALLENGES: OpenChallenge[] = [
  {
    id: 'ch-1',
    creator: '@Tunde_Arsenal',
    matchTitle: 'Arsenal vs Chelsea',
    league: 'Premier League',
    creatorPick: 'Arsenal Win 🏠',
    stake: 500,
    timeRemaining: '18 mins left',
    status: 'OPEN',
  },
  {
    id: 'ch-2',
    creator: '@Chidi_Madrid',
    matchTitle: 'Real Madrid vs Barcelona',
    league: 'La Liga',
    creatorPick: 'Real Madrid Win 🏠',
    stake: 1000,
    timeRemaining: '34 mins left',
    status: 'OPEN',
  },
  {
    id: 'ch-3',
    creator: '@Kalu_Enugu',
    matchTitle: 'Enyimba FC vs Rangers Int',
    league: 'NPFL Nigeria',
    creatorPick: 'Draw 🤝',
    stake: 250,
    timeRemaining: '52 mins left',
    status: 'OPEN',
  },
];

export const P2PSocialWagers: React.FC<P2PWagersProps> = ({ matches = [] }) => {
  const [userAuraBalance, setUserAuraBalance] = useState<number>(1450);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [pickedSide, setPickedSide] = useState<'HOME' | 'AWAY' | 'DRAW'>('HOME');
  const [auraStake, setAuraStake] = useState<number>(500);
  const [activeChallenges, setActiveChallenges] = useState<OpenChallenge[]>(INITIAL_OPEN_CHALLENGES);
  const [activeTab, setActiveTab] = useState<'LOBBY' | 'CREATE'>('LOBBY');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Filter strictly UPCOMING & LIVE matches only
  const upcomingMatches = useMemo(() => {
    const list = matches.filter((m) => m.status !== 'FINISHED' && m.status !== 'FT');
    if (list.length === 0) {
      return [
        { id: 'fx-1', homeTeam: 'Chelsea', awayTeam: 'Arsenal', league: 'Premier League', matchTime: 'Tomorrow 20:00 UTC', status: 'SCHEDULED' },
        { id: 'fx-2', homeTeam: 'Real Madrid', awayTeam: 'Barcelona', league: 'La Liga', matchTime: 'Saturday 21:00 UTC', status: 'SCHEDULED' },
        { id: 'fx-3', homeTeam: 'Man City', awayTeam: 'Liverpool', league: 'Premier League', matchTime: 'Sunday 16:30 UTC', status: 'SCHEDULED' },
        { id: 'fx-4', homeTeam: 'Enyimba FC', awayTeam: 'Rangers Int', league: 'NPFL Nigeria', matchTime: 'Sunday 16:00 UTC', status: 'SCHEDULED' },
      ];
    }
    return list.map((m, idx) => ({
      id: m.id || 'm-' + idx,
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      league: m.league || 'Top League',
      matchTime: m.matchTime || 'Upcoming 19:45 UTC',
      status: m.status || 'SCHEDULED',
    }));
  }, [matches]);

  const filteredMatches = useMemo(() => {
    if (!searchQuery.trim()) return upcomingMatches;
    const q = searchQuery.toLowerCase().trim();
    return upcomingMatches.filter(
      (m) => m.homeTeam.toLowerCase().includes(q) || m.awayTeam.toLowerCase().includes(q) || m.league.toLowerCase().includes(q)
    );
  }, [upcomingMatches, searchQuery]);

  const activeMatch = selectedMatch || filteredMatches[0] || upcomingMatches[0];

  // 1. Create New Duel in Escrow
  const handleLockInDuel = () => {
    if (userAuraBalance < auraStake) {
      setStatusMessage('⚠️ Insufficient Aura points balance! Predict matches in swipe deck to earn more.');
      phoneHardware.triggerHaptic('WARNING');
      return;
    }

    const userName = typeof window !== 'undefined' ? (localStorage.getItem('aurascore_user_name') || 'You') : 'You';
    const pickText = pickedSide === 'HOME' ? activeMatch.homeTeam + ' Win 🏠' : pickedSide === 'AWAY' ? activeMatch.awayTeam + ' Win ✈️' : 'Draw 🤝';

    setUserAuraBalance((prev) => prev - auraStake);

    const newCh: OpenChallenge = {
      id: 'ch-' + Date.now(),
      creator: '@' + userName,
      matchTitle: activeMatch.homeTeam + ' vs ' + activeMatch.awayTeam,
      league: activeMatch.league,
      creatorPick: pickText,
      stake: auraStake,
      timeRemaining: 'Just posted',
      status: 'OPEN',
    };

    setActiveChallenges([newCh, ...activeChallenges]);
    setActiveTab('LOBBY');
    setStatusMessage('🔒 ' + auraStake + ' AURA locked in Smart Virtual Escrow! Your challenge is live in the arena.');
    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.playAddPickSound();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  // 2. Accept Existing Duel & Simulate Result
  const handleAcceptDuel = (ch: OpenChallenge) => {
    if (userAuraBalance < ch.stake) {
      setStatusMessage('⚠️ Insufficient Aura points to accept this ' + ch.stake + ' AURA duel!');
      phoneHardware.triggerHaptic('WARNING');
      return;
    }

    setUserAuraBalance((prev) => prev - ch.stake);
    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.playCrowdRoar();

    // Set to accepted
    setActiveChallenges((prev) =>
      prev.map((c) => (c.id === ch.id ? { ...c, status: 'ACCEPTED' as const } : c))
    );

    setStatusMessage('⚔️ DUEL ACCEPTED! ' + (ch.stake * 2) + ' Total AURA locked in Escrow. Match in progress...');

    // Simulate match completion & payout after 3.5 seconds
    setTimeout(() => {
      const userWon = Math.random() > 0.45;
      const totalPot = ch.stake * 2;

      setActiveChallenges((prev) =>
        prev.map((c) =>
          c.id === ch.id ? { ...c, status: 'SETTLED' as const, winner: userWon ? '@You' : ch.creator } : c
        )
      );

      if (userWon) {
        setUserAuraBalance((prev) => prev + totalPot);
        setStatusMessage('🏆 VICTORY! You defeated ' + ch.creator + ' and won +' + totalPot + ' AURA!');
        stadiumAudio.playCoinCashout();
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });
      } else {
        setStatusMessage('💀 Match Settled: ' + ch.creator + ' won the duel. Better luck next fixture!');
      }
    }, 3500);
  };

  return (
    <section className="glass-panel-premium rounded-3xl border-2 border-cyan-400/50 p-4 sm:p-6 space-y-4 font-mono text-xs text-white shadow-2xl glow-emerald">
      
      {/* Top Header: Arena Title & User Balance */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 text-black font-black text-xl shadow-lg">
            ⚔️
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-black text-sm sm:text-base text-white">
                ENTERPRISE 1v1 P2P AURA DUEL ARENA
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-cyan-400 text-black font-black text-[9px]">
                LIVE ESCROW GAME
              </span>
            </div>
            <p className="text-[10px] text-gray-300 font-sans mt-0.5">
              Lock virtual Aura points in smart escrow, challenge other tipsters, and win double returns on settlement.
            </p>
          </div>
        </div>

        {/* Aura Vault Balance */}
        <div className="flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-black/80 border border-gold/40 text-gold font-black text-xs self-start sm:self-auto shadow-md">
          <Trophy className="w-4 h-4 text-gold" />
          <span>{userAuraBalance.toLocaleString()} AURA VAULT</span>
        </div>
      </div>

      {/* Status Alert Banner */}
      {statusMessage && (
        <div className="p-3 rounded-2xl bg-cyan-950/80 border border-cyan-400 text-cyan-300 text-xs font-bold animate-fadeIn flex items-center space-x-2">
          <Zap className="w-4 h-4 text-gold flex-shrink-0 animate-bounce" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Arena Navigation Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-black/60 border border-white/10">
        <button
          onClick={() => setActiveTab('LOBBY')}
          className={`py-2 rounded-xl text-xs font-black flex items-center justify-center space-x-2 transition-all ${
            activeTab === 'LOBBY' ? 'bg-cyan-400 text-black shadow-md' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Swords className="w-3.5 h-3.5" />
          <span>Open Duels Lobby ({activeChallenges.filter(c => c.status === 'OPEN').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('CREATE')}
          className={`py-2 rounded-xl text-xs font-black flex items-center justify-center space-x-2 transition-all ${
            activeTab === 'CREATE' ? 'bg-cyan-400 text-black shadow-md' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>+ Create New Duel</span>
        </button>
      </div>

      {/* 1. OPEN DUELS LOBBY TAB */}
      {activeTab === 'LOBBY' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {activeChallenges.map((ch) => (
              <div
                key={ch.id}
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  ch.status === 'SETTLED'
                    ? 'bg-black/50 border-white/10 opacity-75'
                    : ch.status === 'ACCEPTED'
                    ? 'bg-amber-950/40 border-amber-400/60 animate-pulse'
                    : 'bg-black/80 border-cyan-400/40 hover:border-cyan-400 shadow-lg'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-cyan-400 font-bold">{ch.league}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                    ch.status === 'OPEN'
                      ? 'bg-stadiumGreen/20 text-stadiumGreen'
                      : ch.status === 'ACCEPTED'
                      ? 'bg-amber-400 text-black'
                      : 'bg-white/10 text-gray-400'
                  }`}>
                    {ch.status === 'OPEN' ? 'OPEN FOR DUEL' : ch.status === 'ACCEPTED' ? 'IN-PLAY ⚽' : 'SETTLED ✓'}
                  </span>
                </div>

                <div>
                  <h4 className="font-black text-xs text-white">{ch.matchTitle}</h4>
                  <p className="text-[10px] text-gray-400 font-sans mt-0.5">
                    Creator: <strong className="text-gold">{ch.creator}</strong> ({ch.creatorPick})
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-2 text-xs">
                  <div>
                    <span className="text-[8px] text-gray-500 block">ESCROW POT</span>
                    <span className="font-black text-gold font-mono">🏆 {ch.stake * 2} AURA</span>
                  </div>

                  {ch.status === 'OPEN' ? (
                    <button
                      onClick={() => handleAcceptDuel(ch)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-black text-[10px] hover:scale-105 active:scale-95 transition-all shadow-md"
                    >
                      Accept Duel ⚔️
                    </button>
                  ) : ch.status === 'ACCEPTED' ? (
                    <span className="text-[10px] text-amber-300 font-bold animate-pulse">Resolving match...</span>
                  ) : (
                    <span className="text-[10px] text-stadiumGreen font-black">Winner: {ch.winner}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. CREATE DUEL TAB */}
      {activeTab === 'CREATE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Search Fixtures */}
          <div className="lg:col-span-6 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search club (e.g. Chelsea, Real Madrid, Arsenal)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-black/80 border border-white/15 text-white placeholder-gray-500 font-mono text-xs focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {filteredMatches.map((m) => {
                const isSelected = activeMatch?.id === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      setSelectedMatch(m);
                      phoneHardware.triggerHaptic('SELECTION');
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-400 shadow-lg glow-emerald'
                        : 'bg-black/60 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <span className="text-[9px] text-cyan-400 font-bold block">{m.league}</span>
                      <h4 className="font-black text-xs text-white">{m.homeTeam} vs {m.awayTeam}</h4>
                      <span className="text-[9px] text-gray-400 flex items-center space-x-1 mt-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{m.matchTime}</span>
                      </span>
                    </div>

                    <button
                      className={`px-3 py-1.5 rounded-xl font-black text-[10px] transition-all ${
                        isSelected ? 'bg-cyan-400 text-black' : 'bg-white/10 text-gray-300'
                      }`}
                    >
                      {isSelected ? 'SELECTED ✓' : 'SELECT'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Duel Configuration & Lock */}
          <div className="lg:col-span-6 space-y-3 p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                <span className="text-xs font-black text-white">YOUR PREDICTION</span>
                <span className="text-[10px] text-gold font-bold">{activeMatch?.homeTeam} vs {activeMatch?.awayTeam}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <button
                  onClick={() => setPickedSide('HOME')}
                  className={`py-2.5 rounded-xl text-xs font-black transition-all ${
                    pickedSide === 'HOME' ? 'bg-stadiumGreen text-black shadow' : 'bg-white/5 text-gray-400 border border-white/10'
                  }`}
                >
                  1 (Home Win)
                </button>
                <button
                  onClick={() => setPickedSide('DRAW')}
                  className={`py-2.5 rounded-xl text-xs font-black transition-all ${
                    pickedSide === 'DRAW' ? 'bg-amber-400 text-black shadow' : 'bg-white/5 text-gray-400 border border-white/10'
                  }`}
                >
                  X (Draw)
                </button>
                <button
                  onClick={() => setPickedSide('AWAY')}
                  className={`py-2.5 rounded-xl text-xs font-black transition-all ${
                    pickedSide === 'AWAY' ? 'bg-cyan-400 text-black shadow' : 'bg-white/5 text-gray-400 border border-white/10'
                  }`}
                >
                  2 (Away Win)
                </button>
              </div>

              <label className="text-[10px] text-gray-400 block mb-1 font-bold">AURA STAKE (LOCKED IN ESCROW)</label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[100, 250, 500, 1000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setAuraStake(amt)}
                    className={`py-2 rounded-xl text-xs font-black transition-all ${
                      auraStake === amt ? 'bg-gold text-black shadow' : 'bg-white/5 text-gray-300 border border-white/10'
                    }`}
                  >
                    {amt} pts
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleLockInDuel}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-black font-black text-xs flex items-center justify-center space-x-2 shadow-lg glow-emerald active:scale-95 transition-all"
            >
              <Swords className="w-4 h-4" />
              <span>Lock {auraStake} Aura & Publish Challenge to Lobby ➔</span>
            </button>
          </div>
        </div>
      )}

    </section>
  );
};
