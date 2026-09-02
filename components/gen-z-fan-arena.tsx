'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Flame, Skull, Snowflake, Crown, AlertTriangle, 
  Rocket, Popcorn, ShieldAlert, Zap, Lock, Clock, 
  Send, Share2, ThumbsUp, ThumbsDown, MessageSquare, 
  Mic, Sparkles, User, Check, RefreshCw, Radio
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';

export interface GenZComment {
  id: string;
  sender: string;
  flair: string;
  badge: string;
  vibe: string;
  text: string;
  timestamp: number;
  factsCount: number;
  capCount: number;
  hypesCount: number;
}

interface GenZFanArenaProps {
  targetId: string;
  targetTitle: string;
  type: 'MATCH' | 'NEWS';
  matchStatus?: string; // 'LIVE' | 'IN_PLAY' | '1H' | 'HT' | '2H' | 'FINISHED' | 'SCHEDULED'
  matchMinute?: string;
  homeTeam?: string;
  awayTeam?: string;
  homeScore?: number;
  awayScore?: number;
}

const GEN_Z_VIBES = [
  { id: 'cooking', label: 'COOKING', icon: '🔥', color: 'from-amber-500/20 to-red-500/20 border-amber-500/50 text-amber-400' },
  { id: 'dead', label: 'DEAD / I CRY', icon: '💀', color: 'from-gray-500/20 to-neutral-700/20 border-gray-400/40 text-gray-300' },
  { id: 'cold', label: 'ICE COLD', icon: '🧊', color: 'from-cyan-500/20 to-blue-500/20 border-cyan-400/50 text-cyan-300' },
  { id: 'goat', label: 'GOAT TIER', icon: '👑', color: 'from-yellow-500/20 to-amber-500/20 border-yellow-400/50 text-yellow-300' },
  { id: 'fraud', label: 'FRAUD ALERT', icon: '🤡', color: 'from-rose-500/20 to-pink-500/20 border-rose-500/50 text-rose-300' },
  { id: 'moon', label: 'TO THE MOON', icon: '🚀', color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/50 text-purple-300' },
  { id: 'drama', label: 'PURE DRAMA', icon: '🍿', color: 'from-yellow-600/20 to-orange-600/20 border-orange-400/50 text-orange-300' },
  { id: 'cap', label: 'MASSIVE CAP', icon: '🧢', color: 'from-blue-600/20 to-sky-600/20 border-sky-400/50 text-sky-300' },
  { id: 'baller', label: 'BALL KNOWLEDGE', icon: '⚡', color: 'from-emerald-500/20 to-green-500/20 border-emerald-400/50 text-emerald-300' },
];

const QUICK_TAGS = ['#Cooked', '#Baller', '#VARRobbery', '#IceInHisVeins', '#Masterclass', '#FraudWatch', '#AuraSurge', '#TotalFootball'];

const RANDOM_NICKNAMES = [
  'AuraMaster99', 'ColdPalmerFan', 'TacticsLord', 'SultanOfVAR', 
  'NaijaBaller', 'GbamStriker', 'CornerFlagCooker', 'XGEnthusiast', 
  'PrimeOkocha', 'BanterKing_01', 'MidfieldMaestro'
];

const CLUB_FLAIRS = [
  'Neutral ⚖️', 'Arsenal 🔴', 'Chelsea 🔵', 'Real Madrid ⚪', 
  'Barcelona 🔵🔴', 'Man City 🩵', 'Man United 🔴', 'Liverpool 🔴', 
  'Super Eagles 🦅', 'Galatasaray 🟡🔴', 'Bayern 🔴⚪', 'PSG 🔵🔴'
];

export const GenZFanArena: React.FC<GenZFanArenaProps> = ({
  targetId,
  targetTitle,
  type,
  matchStatus = 'LIVE',
  matchMinute = 'Live',
  homeTeam = 'Home',
  awayTeam = 'Away',
  homeScore = 0,
  awayScore = 0,
}) => {
  // Check if match has ended (The Room Closes when match ends)
  const isMatchFinished = useMemo(() => {
    if (type !== 'MATCH') return false;
    const statusUpper = (matchStatus || '').toUpperCase();
    return (
      statusUpper === 'FINISHED' || 
      statusUpper === 'FT' || 
      statusUpper === 'FINAL' ||
      statusUpper === 'AET' ||
      statusUpper === 'POSTPONED'
    );
  }, [type, matchStatus]);

  const isLiveMatch = useMemo(() => {
    if (type !== 'MATCH') return false;
    const statusUpper = (matchStatus || '').toUpperCase();
    return (
      statusUpper === 'LIVE' || 
      statusUpper === 'IN_PLAY' || 
      statusUpper === '1H' || 
      statusUpper === '2H' || 
      statusUpper === 'HT'
    );
  }, [type, matchStatus]);

  const vibesStorageKey = `mivaj_genz_vibes_${targetId}`;
  const userVibeKey = `mivaj_user_vibe_${targetId}`;

  // Vibe counter stats with permanent local persistence
  const [vibeStats, setVibeStats] = useState<Record<string, number>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`mivaj_genz_vibes_${targetId}`);
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return {
      cooking: 842,
      dead: 194,
      cold: 412,
      goat: 680,
      fraud: 231,
      moon: 310,
      drama: 520,
      cap: 175,
      baller: 790,
    };
  });

  // User input states
  const [userName, setUserName] = useState('');
  const [selectedFlair, setSelectedFlair] = useState(CLUB_FLAIRS[0]);
  const [selectedVibe, setSelectedVibe] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`mivaj_user_vibe_${targetId}`);
        if (saved) return saved;
      } catch {}
    }
    return 'cooking';
  });
  const [commentText, setCommentText] = useState('');
  const [audioEffectActive, setAudioEffectActive] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);

  // Comments list
  const [comments, setComments] = useState<GenZComment[]>([]);
  const [votedFacts, setVotedFacts] = useState<Record<string, boolean>>({});
  const [votedCap, setVotedCap] = useState<Record<string, boolean>>({});

  // Seed / Load comments from storage or initial seed
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`mivaj_genz_comments_${targetId}`);
      if (stored) {
        setComments(JSON.parse(stored));
        return;
      }
    } catch {}

    // Seed realistic viral comments for this room
    const initialSeed: GenZComment[] = [
      {
        id: `c-seed-1`,
        sender: 'AuraStriker_99',
        flair: 'Arsenal 🔴',
        badge: 'VIP 👑',
        vibe: '🔥 COOKING',
        text: type === 'MATCH' 
          ? `High press is suffocating them right now! The midfield transitions are elite. Goal threat is boiling! 🔥 #Cooked`
          : `This is massive. The ripple effect across the entire league is going to be crazy. Proper ball knowledge! ⚡`,
        timestamp: Date.now() - 1000 * 60 * 4,
        factsCount: 48,
        capCount: 3,
        hypesCount: 92,
      },
      {
        id: `c-seed-2`,
        sender: 'ColdTake_Bro',
        flair: 'Chelsea 🔵',
        badge: 'BALL KNOWER 🧠',
        vibe: '🧊 ICE COLD',
        text: type === 'MATCH'
          ? `Their goalkeeper has ice in his veins today. Saved three 1v1 clear cut chances already! 🧊 #Masterclass`
          : `People are sleeping on the actual tactical implications here. Check the underlying xG and progressive metrics! 📊`,
        timestamp: Date.now() - 1000 * 60 * 9,
        factsCount: 35,
        capCount: 7,
        hypesCount: 64,
      },
      {
        id: `c-seed-3`,
        sender: 'VAR_Spectator',
        flair: 'Neutral ⚖️',
        badge: 'VERIFIED 🎙️',
        vibe: '🍿 PURE DRAMA',
        text: type === 'MATCH'
          ? `If this goes to the 85th minute at this tempo, someone is definitely getting cooked on the counter. Pure cinema! 🍿 #Drama`
          : `Transfer market spending records getting shattered every single window. Football economy is not real! 🚀`,
        timestamp: Date.now() - 1000 * 60 * 18,
        factsCount: 72,
        capCount: 2,
        hypesCount: 110,
      }
    ];

    setComments(initialSeed);
  }, [targetId, type]);

  // Remember handle
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('mivaj_fan_nickname');
      if (savedUser) setUserName(savedUser);
      else {
        const rand = RANDOM_NICKNAMES[Math.floor(Math.random() * RANDOM_NICKNAMES.length)];
        setUserName(rand);
      }
    } catch {}
  }, []);

  // Sync vibes from localStorage on targetId change
  useEffect(() => {
    try {
      const savedVibes = localStorage.getItem(`mivaj_genz_vibes_${targetId}`);
      if (savedVibes) {
        setVibeStats(JSON.parse(savedVibes));
      }
      const savedUserVibe = localStorage.getItem(`mivaj_user_vibe_${targetId}`);
      if (savedUserVibe) {
        setSelectedVibe(savedUserVibe);
      }
    } catch {}
  }, [targetId]);

  const handleRandomizeNick = () => {
    phoneHardware.triggerHaptic('SELECTION');
    const rand = RANDOM_NICKNAMES[Math.floor(Math.random() * RANDOM_NICKNAMES.length)];
    setUserName(rand);
    try { localStorage.setItem('mivaj_fan_nickname', rand); } catch {}
  };

  const handleVibeReaction = (vibeId: string) => {
    phoneHardware.triggerHaptic('SUCCESS');
    try { stadiumAudio.playAddPickSound(); } catch {}

    setVibeStats(prev => {
      const prevVibe = selectedVibe;
      const updated = { ...prev };
      // If switching from another vibe, adjust previous vote
      if (prevVibe && prevVibe !== vibeId && updated[prevVibe] && updated[prevVibe] > 0) {
        updated[prevVibe] = updated[prevVibe] - 1;
      }
      // Increment selected vibe
      if (prevVibe !== vibeId) {
        updated[vibeId] = (updated[vibeId] || 0) + 1;
      }
      try {
        localStorage.setItem(`mivaj_genz_vibes_${targetId}`, JSON.stringify(updated));
        localStorage.setItem(`mivaj_user_vibe_${targetId}`, vibeId);
      } catch {}
      return updated;
    });

    setSelectedVibe(vibeId);
  };

  const handlePlayStadiumAudio = () => {
    phoneHardware.triggerHaptic('SELECTION');
    setAudioEffectActive(true);
    try { stadiumAudio.playNaijaGbam(); } catch {}
    setTimeout(() => setAudioEffectActive(false), 1200);
  };

  const handleAddTag = (tag: string) => {
    phoneHardware.triggerHaptic('SELECTION');
    setCommentText(prev => prev ? `${prev} ${tag}` : tag);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (isMatchFinished) return; // Prevent comments if match is closed
    if (!commentText.trim()) return;

    phoneHardware.triggerHaptic('SUCCESS');
    try { stadiumAudio.playAddPickSound(); } catch {}

    const vibeObj = GEN_Z_VIBES.find(v => v.id === selectedVibe) || GEN_Z_VIBES[0];
    const newComment: GenZComment = {
      id: `c-${Date.now()}`,
      sender: userName.trim() || 'AnonymousBaller',
      flair: selectedFlair,
      badge: 'GEN Z COOKER 🔥',
      vibe: `${vibeObj.icon} ${vibeObj.label}`,
      text: commentText.trim(),
      timestamp: Date.now(),
      factsCount: 1,
      capCount: 0,
      hypesCount: 3,
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    setCommentText('');
    setJustSubmitted(true);
    setTimeout(() => setJustSubmitted(false), 3000);

    try {
      localStorage.setItem(`mivaj_genz_comments_${targetId}`, JSON.stringify(updated.slice(0, 30)));
      localStorage.setItem('mivaj_fan_nickname', userName);
    } catch {}

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleVoteFacts = (id: string) => {
    if (votedFacts[id]) return;
    phoneHardware.triggerHaptic('SELECTION');
    setVotedFacts(prev => ({ ...prev, [id]: true }));
    setComments(prev => prev.map(c => c.id === id ? { ...c, factsCount: c.factsCount + 1 } : c));
  };

  const handleVoteCap = (id: string) => {
    if (votedCap[id]) return;
    phoneHardware.triggerHaptic('SELECTION');
    setVotedCap(prev => ({ ...prev, [id]: true }));
    setComments(prev => prev.map(c => c.id === id ? { ...c, capCount: c.capCount + 1 } : c));
  };

  const handleHypeComment = (id: string) => {
    phoneHardware.triggerHaptic('SUCCESS');
    try { stadiumAudio.playAddPickSound(); } catch {}
    setComments(prev => prev.map(c => c.id === id ? { ...c, hypesCount: c.hypesCount + 1 } : c));
    confetti({ particleCount: 25, spread: 45, origin: { y: 0.8 } });
  };

  const handleShareHotTake = (comment: GenZComment) => {
    phoneHardware.triggerHaptic('SUCCESS');
    const shareText = `🔥 Hot take by ${comment.sender} (${comment.flair}):\n"${comment.text}"\n\nJoin the live Gen Z match room on Mivaj Sports: https://mivaj.com/?match=${targetId}`;
    if (navigator.share) {
      navigator.share({ title: `Hot take on ${targetTitle}`, text: shareText, url: 'https://mivaj.com' }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Hot take copied to clipboard! Share on WhatsApp / X.');
    }
  };

  return (
    <div className="w-full rounded-3xl bg-[#090d16] border border-white/10 p-4 sm:p-6 space-y-6 shadow-2xl font-mono relative overflow-hidden">
      
      {/* BACKGROUND AMBIENT GLOW */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-stadiumGreen/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* HEADER: ROOM STATUS & LIVE FOMO */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            {isMatchFinished ? (
              <span className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-black flex items-center space-x-1.5 shadow-sm">
                <Lock className="w-3.5 h-3.5" />
                <span>ARENA CLOSED (FULL-TIME 🏁)</span>
              </span>
            ) : isLiveMatch ? (
              <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black flex items-center space-x-1.5 animate-pulse shadow-lg shadow-red-600/30">
                <Radio className="w-3.5 h-3.5" />
                <span>LIVE ROOM • {matchMinute}</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-stadiumGreen/20 border border-stadiumGreen/40 text-stadiumGreen text-xs font-black flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>VIRAL FAN ZONE 💬</span>
              </span>
            )}

            <span className="text-[11px] text-gray-400 font-sans">
              {type === 'MATCH' ? `${homeTeam} vs ${awayTeam}` : 'Global Football Newsroom'}
            </span>
          </div>

          <h3 className="text-base sm:text-xl font-black text-white tracking-tight">
            {isMatchFinished ? 'Match Ended • Sentiment Ledger Sealed' : 'Gen Z Hot Take Arena & Live Vibe Meter'}
          </h3>
        </div>

        {/* FOMO COUNTER */}
        <div className="flex items-center space-x-3 text-xs">
          {!isMatchFinished ? (
            <div className="px-3 py-1.5 rounded-2xl bg-white/5 border border-white/10 flex items-center space-x-2 text-gold">
              <Flame className="w-4 h-4 fill-gold text-gold animate-bounce" />
              <span className="font-black">2,840+ Fans In Arena</span>
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-2xl bg-white/5 border border-white/10 flex items-center space-x-2 text-gray-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Archived at FT</span>
            </div>
          )}
        </div>
      </div>

      {/* FOMO URGENCY BANNER (If Live Match) */}
      {type === 'MATCH' && isLiveMatch && (
        <div className="relative z-10 p-3 rounded-2xl bg-gradient-to-r from-red-950/40 via-black to-red-950/40 border border-red-500/30 flex items-center justify-between text-xs animate-pulse">
          <div className="flex items-center space-x-2 text-red-400 font-bold">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>⚠️ URGENT: Room closes permanently when referee blows the final whistle!</span>
          </div>
          <span className="text-[10px] text-gray-400 uppercase hidden sm:inline font-mono">
            {homeScore} - {awayScore} In-Play
          </span>
        </div>
      )}

      {/* MATCH CLOSED BANNER (User's Exact Requirement: Closes when match ends) */}
      {isMatchFinished && (
        <div className="relative z-10 p-4 rounded-3xl bg-neutral-950/90 border border-red-500/30 text-center space-y-2 shadow-xl">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black uppercase">
            <Lock className="w-3.5 h-3.5" />
            <span>THE ARENA HAS CLOSED • MATCH CONCLUDED (FT 🏁)</span>
          </div>
          <p className="text-xs text-gray-400 font-sans max-w-xl mx-auto leading-relaxed">
            The referee has blown the official full-time whistle ({homeTeam} {homeScore} - {awayScore} {awayTeam}). All hot takes, votes, and sentiment from this live room have been archived into the referee ledger. No further comments can be posted.
          </p>
        </div>
      )}

      {/* 1. SOUNDBITE & VIBE CHIPS ROW */}
      <div className="relative z-10 space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="font-bold flex items-center space-x-1">
            <span>⚡ WHAT'S THE VIBE?</span>
            <span className="text-[10px] text-gold">(Tap to stamp your reaction)</span>
          </span>
          <span className="text-[10px] font-mono">Live Pulse Ratio</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {GEN_Z_VIBES.map((v) => {
            const isSelected = selectedVibe === v.id;
            const count = vibeStats[v.id] || 0;

            return (
              <button
                key={v.id}
                type="button"
                onClick={() => handleVibeReaction(v.id)}
                className={`px-3 py-2 rounded-2xl text-xs font-black flex items-center space-x-1.5 transition-all whitespace-nowrap active:scale-95 border ${
                  isSelected 
                    ? `bg-gradient-to-r ${v.color} shadow-lg scale-105` 
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
                }`}
              >
                <span>{v.icon}</span>
                <span>{v.label}</span>
                <span className="text-[10px] opacity-75 font-mono">({count.toLocaleString()})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. ADVANCED GEN Z COMMENTING FORM (ONLY OPEN WHILE LIVE OR ON NEWS) */}
      {!isMatchFinished ? (
        <form onSubmit={handleSubmitComment} className="relative z-10 space-y-4 p-4 rounded-3xl bg-neutral-950/80 border border-white/10 shadow-xl">
          
          {/* Top Line: User Nickname + Club Flair + Mic Audio */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            
            {/* Nickname with Randomizer */}
            <div className="flex items-center space-x-2 bg-black/60 border border-white/10 rounded-2xl p-2">
              <User className="w-3.5 h-3.5 text-gold flex-shrink-0" />
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your Fan Tag..."
                className="w-full bg-transparent text-white placeholder-gray-500 text-xs focus:outline-none font-bold"
                maxLength={24}
              />
              <button
                type="button"
                onClick={handleRandomizeNick}
                title="Generate random Gen Z tag"
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex-shrink-0"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>

            {/* Club Flair Select */}
            <div className="bg-black/60 border border-white/10 rounded-2xl p-2 flex items-center space-x-2">
              <span className="text-[10px] text-gray-400 font-bold uppercase flex-shrink-0">Flair:</span>
              <select
                value={selectedFlair}
                onChange={(e) => setSelectedFlair(e.target.value)}
                className="w-full bg-transparent text-white text-xs focus:outline-none font-bold cursor-pointer"
              >
                {CLUB_FLAIRS.map(f => (
                  <option key={f} value={f} className="bg-neutral-900 text-white">{f}</option>
                ))}
              </select>
            </div>

            {/* Voice Note Audio Drop Preview */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handlePlayStadiumAudio}
                className={`w-full py-2 px-3 rounded-2xl text-xs font-black flex items-center justify-center space-x-1.5 transition-all border ${
                  audioEffectActive
                    ? 'bg-gold text-black border-gold shadow-lg shadow-gold/20 scale-95'
                    : 'bg-white/5 hover:bg-white/10 text-gold border-gold/30'
                }`}
              >
                <Mic className="w-3.5 h-3.5 animate-pulse" />
                <span>{audioEffectActive ? 'GBAM! 🔊' : 'Voice Reaction Drop 🎙️'}</span>
              </button>
            </div>

          </div>

          {/* Quick Meme Tag Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-[10px] scrollbar-none">
            <span className="text-gray-500 uppercase font-bold flex-shrink-0">Quick Tags:</span>
            {QUICK_TAGS.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => handleAddTag(tag)}
                className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white border border-white/5 transition-all whitespace-nowrap"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Comment Text Box */}
          <div className="relative">
            <textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={
                type === 'MATCH'
                  ? `Drop your live hot take on ${homeTeam} vs ${awayTeam}... (e.g. He is cooking them on the wing! Fraud alert on the referee!)`
                  : `Drop your hot take on this football story... (Spit facts, no cap!)`
              }
              maxLength={280}
              className="w-full p-3.5 rounded-2xl bg-black border border-white/10 text-white placeholder-gray-500 text-xs sm:text-sm focus:border-stadiumGreen focus:outline-none resize-none font-sans leading-relaxed"
            />
            <span className="absolute bottom-2.5 right-3 text-[10px] text-gray-500 font-mono">
              {commentText.length}/280
            </span>
          </div>

          {/* Submit Row with Virality Triggers */}
          <div className="flex items-center justify-between pt-1">
            <div className="text-[11px] text-gray-400 font-sans hidden sm:flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>Posts are recorded live in the matchday pulse ledger.</span>
            </div>

            <button
              type="submit"
              disabled={!commentText.trim()}
              className={`px-6 py-3 rounded-2xl text-xs font-black flex items-center space-x-2 transition-all shadow-lg active:scale-95 ${
                commentText.trim()
                  ? 'bg-stadiumGreen text-black hover:bg-stadiumGreen/90 shadow-stadiumGreen/20 cursor-pointer'
                  : 'bg-white/10 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{justSubmitted ? 'Hot Take Dropped! 🔥' : 'Drop Hot Take 🔥'}</span>
            </button>
          </div>

        </form>
      ) : (
        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center text-xs text-gray-500 space-x-2">
          <Lock className="w-4 h-4 text-red-400/80" />
          <span>Commenting is disabled because this match has officially concluded (FT).</span>
        </div>
      )}

      {/* 3. FAN FEED: REAL-TIME HOT TAKES & VOTING */}
      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between text-xs text-gray-400 pb-1 border-b border-white/5">
          <span className="font-bold text-white flex items-center space-x-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-stadiumGreen" />
            <span>Fan Reactions &amp; Verified Takes ({comments.length})</span>
          </span>
          <span className="text-[10px] font-mono text-gray-500">Sorted by Live Hype</span>
        </div>

        <div className="space-y-3">
          {comments.map((comment) => {
            const hasFactsVoted = !!votedFacts[comment.id];
            const hasCapVoted = !!votedCap[comment.id];
            const totalVotes = comment.factsCount + comment.capCount;
            const factsRatio = totalVotes > 0 ? Math.round((comment.factsCount / totalVotes) * 100) : 80;

            return (
              <div
                key={comment.id}
                className="p-4 rounded-2xl bg-neutral-950/70 border border-white/10 hover:border-white/20 transition-all space-y-2.5 shadow-md group"
              >
                {/* Comment Header */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-white group-hover:text-gold transition-colors">
                      @{comment.sender}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-[9px] font-black text-gray-300">
                      {comment.flair}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[8px] font-black uppercase">
                      {comment.badge}
                    </span>
                  </div>

                  <span className="text-[10px] text-gray-500 font-mono">
                    {comment.vibe}
                  </span>
                </div>

                {/* Comment Body */}
                <p className="text-xs sm:text-sm text-gray-200 font-sans leading-relaxed">
                  {comment.text}
                </p>

                {/* Facts vs Cap Voting Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                    <span className="text-stadiumGreen font-bold">Spit Facts: {factsRatio}%</span>
                    <span className="text-rose-400 font-bold">Cap: {100 - factsRatio}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden flex">
                    <div className="h-full bg-stadiumGreen transition-all duration-300" style={{ width: `${factsRatio}%` }} />
                    <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${100 - factsRatio}%` }} />
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleVoteFacts(comment.id)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center space-x-1 transition-all ${
                        hasFactsVoted
                          ? 'bg-stadiumGreen text-black font-black'
                          : 'bg-white/5 hover:bg-white/10 text-gray-300'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>Facts ({comment.factsCount})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleVoteCap(comment.id)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center space-x-1 transition-all ${
                        hasCapVoted
                          ? 'bg-rose-500 text-white font-black'
                          : 'bg-white/5 hover:bg-white/10 text-gray-300'
                      }`}
                    >
                      <ThumbsDown className="w-3 h-3" />
                      <span>Cap ({comment.capCount})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleHypeComment(comment.id)}
                      className="px-2.5 py-1 rounded-xl bg-gold/10 hover:bg-gold/20 text-gold text-[10px] font-black flex items-center space-x-1 border border-gold/20"
                    >
                      <Flame className="w-3 h-3 fill-gold" />
                      <span>Hype ({comment.hypesCount})</span>
                    </button>
                  </div>

                  {/* 1-Click Viral Share Take */}
                  <button
                    type="button"
                    onClick={() => handleShareHotTake(comment)}
                    className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-all flex items-center space-x-1 text-[10px]"
                    title="Share this take"
                  >
                    <Share2 className="w-3 h-3" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
