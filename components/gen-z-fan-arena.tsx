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

function hashSeed(str: string): number {
  let hash = 0;
  const s = (str || 'mivaj-arena').toLowerCase();
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getDynamicInitialVibes(targetId: string, title: string) {
  const h = hashSeed(targetId + title);
  return {
    cooking: 140 + (h % 560),
    dead: 30 + ((h >> 2) % 180),
    cold: 60 + ((h >> 3) % 290),
    goat: 95 + ((h >> 1) % 430),
    fraud: 35 + ((h >> 4) % 190),
    moon: 50 + ((h >> 5) % 240),
    drama: 80 + ((h >> 6) % 360),
    cap: 25 + ((h >> 7) % 140),
    baller: 120 + ((h >> 2) % 480),
  };
}

function getDynamicFanCount(targetId: string, type: 'MATCH' | 'NEWS'): number {
  const h = hashSeed(targetId);
  if (type === 'MATCH') {
    return 2800 + (h % 7600);
  }
  return 1100 + (h % 3200);
}

function generateDynamicInitialComments(
  targetId: string = '', 
  targetTitle: string = '', 
  type: 'MATCH' | 'NEWS' = 'NEWS', 
  homeTeam: string = 'Home', 
  awayTeam: string = 'Away'
): GenZComment[] {
  const h = hashSeed(targetId || 'mivaj');
  const safeTitle = String(targetTitle || 'Football News').trim();
  const safeHome = String(homeTeam || 'Home').trim();
  const safeAway = String(awayTeam || 'Away').trim();

  if (type === 'MATCH') {
    return [
      {
        id: `c-dyn-1-${targetId || Date.now()}`,
        sender: 'TacticsChief',
        flair: `${safeHome} 🔴`,
        badge: 'TACTICIAN 🧠',
        vibe: '🔥 COOKING',
        text: `${safeHome} high press is suffocating right now, but ${safeAway} look deadly on the counter. Pure cinema! 🔥 #Cooked`,
        timestamp: Date.now() - 1000 * 60 * 3,
        factsCount: 38 + (h % 65),
        capCount: 2 + (h % 8),
        hypesCount: 75 + (h % 90),
      },
      {
        id: `c-dyn-2-${targetId || Date.now()}`,
        sender: 'IceColdKeeper',
        flair: 'Neutral ⚖️',
        badge: 'BALL KNOWER ⚡',
        vibe: '🧊 ICE COLD',
        text: `The defensive compactness between ${safeHome} and ${safeAway} is unreal today. Every tackle has stadium energy! 🧊 #Masterclass`,
        timestamp: Date.now() - 1000 * 60 * 9,
        factsCount: 52 + (h % 40),
        capCount: 1 + (h % 5),
        hypesCount: 94 + (h % 70),
      },
      {
        id: `c-dyn-3-${targetId || Date.now()}`,
        sender: 'VAR_Spectator',
        flair: `${safeAway} 🔵`,
        badge: 'VIP 👑',
        vibe: '🍿 PURE DRAMA',
        text: `If this tempo holds into the final 15 minutes, someone is definitely cashing in a stoppage-time winner! 🍿 #TotalFootball`,
        timestamp: Date.now() - 1000 * 60 * 16,
        factsCount: 64 + (h % 50),
        capCount: 4 + (h % 9),
        hypesCount: 112 + (h % 80),
      },
    ];
  }

  // NEWS TYPE — Smart Entity & Context Aware Comment Generator
  const titleLower = safeTitle.toLowerCase();
  
  // Detect relevant club flair from title
  let detectedFlair = 'Neutral ⚖️';
  if (titleLower.includes('arsenal')) detectedFlair = 'Arsenal 🔴';
  else if (titleLower.includes('chelsea')) detectedFlair = 'Chelsea 🔵';
  else if (titleLower.includes('madrid')) detectedFlair = 'Real Madrid ⚪';
  else if (titleLower.includes('barcelona') || titleLower.includes('barca')) detectedFlair = 'Barcelona 🔵🔴';
  else if (titleLower.includes('liverpool')) detectedFlair = 'Liverpool 🔴';
  else if (titleLower.includes('man city') || titleLower.includes('city')) detectedFlair = 'Man City 🩵';
  else if (titleLower.includes('man united') || titleLower.includes('united')) detectedFlair = 'Man United 🔴';
  else if (titleLower.includes('bayern')) detectedFlair = 'Bayern 🔴⚪';
  else if (titleLower.includes('psg') || titleLower.includes('paris')) detectedFlair = 'PSG 🔵🔴';
  else if (titleLower.includes('nigeria') || titleLower.includes('super eagles') || titleLower.includes('osimhen')) detectedFlair = 'Super Eagles 🦅';
  else if (titleLower.includes('galatasaray')) detectedFlair = 'Galatasaray 🟡🔴';

  // Topic-specific take generation
  let take1 = {
    sender: 'AuraTactician',
    badge: 'BALL KNOWER 🧠',
    vibe: '🔥 COOKING',
    text: `Huge development! The squad depth and tactical flexibility this creates will be vital heading into the next matchday fixture. 🔥 #BallKnowledge`,
    factsCount: 45 + (h % 55),
    capCount: 2 + (h % 6),
    hypesCount: 88 + (h % 75),
  };

  let take2 = {
    sender: 'CornerFlagAnalyst',
    badge: 'VIP 👑',
    vibe: '🧊 ICE COLD',
    text: `Look at the underlying numbers and fixture schedule. The manager's tactical rotation strategy here makes complete sense! 📊 #TotalFootball`,
    factsCount: 60 + (h % 45),
    capCount: 3 + (h % 7),
    hypesCount: 104 + (h % 60),
  };

  let take3 = {
    sender: 'StadiumInsider_99',
    badge: 'PRO ANALYST 🎙️',
    vibe: '🍿 PURE DRAMA',
    text: `The debate around this will dominate the headlines all week. Let's see how the dressing room responds on the pitch! 🍿 #AuraSurge`,
    factsCount: 78 + (h % 40),
    capCount: 4 + (h % 8),
    hypesCount: 125 + (h % 90),
  };

  // Specific content variations based on keywords in headline
  if (titleLower.includes('transfer') || titleLower.includes('deal') || titleLower.includes('sign') || titleLower.includes('bid') || titleLower.includes('agree') || titleLower.includes('fee')) {
    take1.text = `If this transfer gets over the line, the financial valuation and wage structure will reset the entire market! 💰 #Masterclass`;
    take2.text = `Smart business if the performance clauses are right. In this tactical system, he will create massive space on the transition! ⚡ #Cooked`;
    take3.text = `Every big transfer brings immense fan expectations. Can he deliver consistent match-winning aura from day one? 🍿 #FraudWatch`;
  } else if (titleLower.includes('injur') || titleLower.includes('out') || titleLower.includes('hamstring') || titleLower.includes('knee') || titleLower.includes('surgery')) {
    take1.text = `Massive setback for the squad rotation at this crucial stage of the campaign. The medical team needs to manage recovery minutes carefully! 🚑 #IceInHisVeins`;
    take2.text = `Time for the academy and bench depth to step up and prove their readiness under intense matchday pressure. 🧠 #TotalFootball`;
    take3.text = `Without him commanding the defensive structure, the opposition will definitely target that flank next match! 🍿 #PureDrama`;
  } else if (titleLower.includes('sack') || titleLower.includes('appoint') || titleLower.includes('manager') || titleLower.includes('coach') || titleLower.includes('boss')) {
    take1.text = `A tactical overhaul takes time. If the board doesn't back the manager with time and suitable profiles, the cycle will repeat. 🧠 #BallKnowledge`;
    take2.text = `The dressing room dynamic has clearly shifted. The new setup needs immediate results or pressure will mount instantly! 🍿 #PureDrama`;
    take3.text = `Look at his previous tactical blueprint — high press and vertical transitions. Fans should be excited for this shift! 🔥 #Cooked`;
  } else if (titleLower.includes('champions league') || titleLower.includes('ucl') || titleLower.includes('europa') || titleLower.includes('europe')) {
    take1.text = `European nights are all about game management under pressure. Tactical discipline in away legs will decide who advances! ⭐ #Masterclass`;
    take2.text = `The intensity levels in Europe are completely different from domestic leagues. Expect fireworks in the knockout rounds! ⚡ #BallKnowledge`;
    take3.text = `This is where world-class pedigree shines. Individual brilliance will break down low defensive blocks! 👑 #IceInHisVeins`;
  } else if (titleLower.includes('win') || titleLower.includes('beat') || titleLower.includes('defeat') || titleLower.includes('victory') || titleLower.includes('goal') || titleLower.includes('hat-trick') || titleLower.includes('brace')) {
    take1.text = `Dominant tactical performance from start to finish! The attacking movement and counter-pressing were unplayable today. 🔥 #Cooked`;
    take2.text = `The xG differential and tempo control tell the whole story. Complete masterclass on every area of the pitch! 📊 #Masterclass`;
    take3.text = `That individual performance was pure class. The confidence boost going into the next fixture is huge! ⚡ #AuraSurge`;
  }

  return [
    {
      id: `c-dyn-1-${targetId}`,
      sender: take1.sender,
      flair: detectedFlair,
      badge: take1.badge,
      vibe: take1.vibe,
      text: take1.text,
      timestamp: Date.now() - 1000 * 60 * 5,
      factsCount: take1.factsCount,
      capCount: take1.capCount,
      hypesCount: take1.hypesCount,
    },
    {
      id: `c-dyn-2-${targetId}`,
      sender: take2.sender,
      flair: 'Neutral ⚖️',
      badge: take2.badge,
      vibe: take2.vibe,
      text: take2.text,
      timestamp: Date.now() - 1000 * 60 * 14,
      factsCount: take2.factsCount,
      capCount: take2.capCount,
      hypesCount: take2.hypesCount,
    },
    {
      id: `c-dyn-3-${targetId}`,
      sender: take3.sender,
      flair: 'Super Eagles 🦅',
      badge: take3.badge,
      vibe: take3.vibe,
      text: take3.text,
      timestamp: Date.now() - 1000 * 60 * 25,
      factsCount: take3.factsCount,
      capCount: take3.capCount,
      hypesCount: take3.hypesCount,
    },
  ];
}

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

  // Dynamic & Persistent Fan Count
  const [fanCount, setFanCount] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`mivaj_fans_count_${targetId}`);
        if (saved) return parseInt(saved, 10);
      } catch {}
    }
    return getDynamicFanCount(targetId, type);
  });

  // Dynamic & Persistent Vibe counter stats
  const [vibeStats, setVibeStats] = useState<Record<string, number>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`mivaj_genz_vibes_${targetId}`);
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return getDynamicInitialVibes(targetId, targetTitle);
  });

  // User input states
  const [userName, setUserName] = useState('');
  const [selectedFlair, setSelectedFlair] = useState(CLUB_FLAIRS[0]);
  const [selectedVibe, setSelectedVibe] = useState<string>(() => {
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

  // Comments list with Dynamic initial seeding per article/match
  const [comments, setComments] = useState<GenZComment[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`mivaj_genz_comments_${targetId}`);
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return generateDynamicInitialComments(targetId, targetTitle, type, homeTeam, awayTeam);
  });

  // Persistent user vote tracks
  const [votedFacts, setVotedFacts] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`mivaj_facts_voted_${targetId}`);
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return {};
  });

  const [votedCap, setVotedCap] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`mivaj_cap_voted_${targetId}`);
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return {};
  });

  // Sync state when targetId changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedVibes = localStorage.getItem(`mivaj_genz_vibes_${targetId}`);
      if (savedVibes) setVibeStats(JSON.parse(savedVibes));
      else setVibeStats(getDynamicInitialVibes(targetId, targetTitle));

      const savedUserVibe = localStorage.getItem(`mivaj_user_vibe_${targetId}`);
      if (savedUserVibe) setSelectedVibe(savedUserVibe);

      const savedFans = localStorage.getItem(`mivaj_fans_count_${targetId}`);
      if (savedFans) setFanCount(parseInt(savedFans, 10));
      else setFanCount(getDynamicFanCount(targetId, type));

      const storedComments = localStorage.getItem(`mivaj_genz_comments_${targetId}`);
      if (storedComments) {
        const parsed = JSON.parse(storedComments);
        if (type === 'NEWS' && parsed.length > 0 && parsed[0].sender === 'AuraStriker_99') {
          const updated = generateDynamicInitialComments(targetId, targetTitle, type, homeTeam, awayTeam);
          setComments(updated);
          localStorage.setItem(`mivaj_genz_comments_${targetId}`, JSON.stringify(updated));
        } else {
          setComments(parsed);
        }
      } else {
        setComments(generateDynamicInitialComments(targetId, targetTitle, type, homeTeam, awayTeam));
      }

      const savedFacts = localStorage.getItem(`mivaj_facts_voted_${targetId}`);
      if (savedFacts) setVotedFacts(JSON.parse(savedFacts));

      const savedCap = localStorage.getItem(`mivaj_cap_voted_${targetId}`);
      if (savedCap) setVotedCap(JSON.parse(savedCap));
    } catch {}
  }, [targetId, targetTitle, type, homeTeam, awayTeam]);

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
      if (prevVibe && prevVibe !== vibeId && updated[prevVibe] && updated[prevVibe] > 0) {
        updated[prevVibe] = updated[prevVibe] - 1;
      }
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

    // Increment Fan Arena counter slightly
    setFanCount(prev => {
      const next = prev + 1;
      try { localStorage.setItem(`mivaj_fans_count_${targetId}`, next.toString()); } catch {}
      return next;
    });
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
    if (isMatchFinished) return; // Closed arena
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
      localStorage.setItem(`mivaj_genz_comments_${targetId}`, JSON.stringify(updated.slice(0, 40)));
      localStorage.setItem('mivaj_fan_nickname', userName);
    } catch {}

    // Increment fan count
    setFanCount(prev => {
      const next = prev + 1;
      try { localStorage.setItem(`mivaj_fans_count_${targetId}`, next.toString()); } catch {}
      return next;
    });

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleVoteFacts = (id: string) => {
    if (votedFacts[id]) return;
    phoneHardware.triggerHaptic('SELECTION');
    const newVoted = { ...votedFacts, [id]: true };
    setVotedFacts(newVoted);
    const updated = comments.map(c => c.id === id ? { ...c, factsCount: c.factsCount + 1 } : c);
    setComments(updated);
    try {
      localStorage.setItem(`mivaj_facts_voted_${targetId}`, JSON.stringify(newVoted));
      localStorage.setItem(`mivaj_genz_comments_${targetId}`, JSON.stringify(updated.slice(0, 40)));
    } catch {}
  };

  const handleVoteCap = (id: string) => {
    if (votedCap[id]) return;
    phoneHardware.triggerHaptic('SELECTION');
    const newVoted = { ...votedCap, [id]: true };
    setVotedCap(newVoted);
    const updated = comments.map(c => c.id === id ? { ...c, capCount: c.capCount + 1 } : c);
    setComments(updated);
    try {
      localStorage.setItem(`mivaj_cap_voted_${targetId}`, JSON.stringify(newVoted));
      localStorage.setItem(`mivaj_genz_comments_${targetId}`, JSON.stringify(updated.slice(0, 40)));
    } catch {}
  };

  const handleHypeComment = (id: string) => {
    phoneHardware.triggerHaptic('SUCCESS');
    try { stadiumAudio.playAddPickSound(); } catch {}
    const updated = comments.map(c => c.id === id ? { ...c, hypesCount: c.hypesCount + 1 } : c);
    setComments(updated);
    try {
      localStorage.setItem(`mivaj_genz_comments_${targetId}`, JSON.stringify(updated.slice(0, 40)));
    } catch {}
    confetti({ particleCount: 25, spread: 45, origin: { y: 0.8 } });
  };

  const handleShareHotTake = (comment: GenZComment) => {
    phoneHardware.triggerHaptic('SUCCESS');
    const shareText = `🔥 Hot take by ${comment.sender} (${comment.flair}):\n"${comment.text}"\n\nJoin the live Gen Z arena on Mivaj Sports: https://mivaj.com/?news=${targetId}`;
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
      <div className="absolute top-0 right-0 w-80 h-80 bg-stadiumGreen/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40 text-[10px] font-black uppercase flex items-center space-x-1">
              <Sparkles className="w-3 h-3 animate-spin" />
              <span>Viral Fan Zone</span>
            </span>
            <span className="text-gray-400 text-xs">
              {type === 'MATCH' ? 'Matchday Pitch War Room' : 'Global Football Newsroom'}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white mt-1">
            Gen Z Hot Take Arena &amp; Live Vibe Meter
          </h3>
        </div>

        {/* Dynamic Live Counter */}
        <div className="flex items-center space-x-3">
          <div className="px-3 py-1.5 rounded-2xl bg-black/60 border border-white/10 flex items-center space-x-1.5 text-xs shadow-inner">
            <span className="w-2 h-2 rounded-full bg-stadiumGreen animate-ping" />
            <span className="text-amber-400 font-mono font-bold flex items-center space-x-1">
              <Flame className="w-3.5 h-3.5" />
              <span>{fanCount.toLocaleString()}+ Fans In Arena</span>
            </span>
          </div>
        </div>
      </div>

      {/* MATCH CLOSE NOTICE BANNER (CLOSES WHEN MATCH ENDS) */}
      {isMatchFinished && (
        <div className="p-4 rounded-2xl bg-crimson/15 border border-crimson/40 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2.5">
            <Lock className="w-4 h-4 text-crimson flex-shrink-0" />
            <div>
              <span className="font-black text-white block">ARENA LOCKED • MATCH CONCLUDED (FT)</span>
              <span className="text-gray-300 text-[11px] font-sans block">
                Official final whistle blown. Takes and vibes have been permanently sealed into the matchday ledger.
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-crimson text-white font-black text-[10px] flex-shrink-0">
            SEALED
          </span>
        </div>
      )}

      {/* 1. INTERACTIVE LIVE VIBE CHIPS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-300 font-bold flex items-center space-x-1">
            <Zap className="w-3.5 h-3.5 text-gold" />
            <span>WHAT&apos;S THE VIBE? (Tap to stamp your reaction)</span>
          </span>
          <span className="text-[10px] text-gray-500 font-mono hidden sm:inline">Live Pulse Ratio</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {GEN_Z_VIBES.map((vibe) => {
            const isSelected = selectedVibe === vibe.id;
            const count = vibeStats[vibe.id] || 0;
            return (
              <button
                key={vibe.id}
                type="button"
                onClick={() => handleVibeReaction(vibe.id)}
                className={`px-3 py-2 rounded-2xl border text-xs font-black transition-all flex items-center space-x-1.5 active:scale-95 shadow-md ${
                  isSelected
                    ? `bg-gradient-to-r ${vibe.color} shadow-lg ring-2 ring-white/20 scale-105`
                    : 'bg-black/50 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                }`}
              >
                <span className="text-base">{vibe.icon}</span>
                <span>{vibe.label}</span>
                <span className="px-1.5 py-0.5 rounded-full bg-black/40 text-[10px] font-mono text-gray-200">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. ADVANCED HOT TAKE COMPOSER */}
      {!isMatchFinished && (
        <form onSubmit={handleSubmitComment} className="space-y-3 p-4 rounded-3xl bg-black/60 border border-white/10 shadow-inner">
          
          {/* USER INFO BAR (Handle + Club Flair + Audio SFX) */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-xs">
                <User className="w-3.5 h-3.5 text-stadiumGreen" />
                <span className="text-white font-bold">{userName}</span>
              </div>
              <button
                type="button"
                onClick={handleRandomizeNick}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                title="Randomize fan nickname"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>

            {/* Club Flair Picker */}
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-gray-400 font-bold uppercase hidden sm:inline">Flair:</span>
              <select
                value={selectedFlair}
                onChange={(e) => setSelectedFlair(e.target.value)}
                className="bg-black border border-white/20 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none focus:border-stadiumGreen font-mono"
              >
                {CLUB_FLAIRS.map(flair => (
                  <option key={flair} value={flair}>{flair}</option>
                ))}
              </select>

              {/* Sound Effect Drop Button */}
              <button
                type="button"
                onClick={handlePlayStadiumAudio}
                className={`px-3 py-1 rounded-xl text-xs font-black flex items-center space-x-1 transition-all ${
                  audioEffectActive 
                    ? 'bg-gold text-black animate-pulse' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                }`}
                title="Trigger Naija Stadium Gbam 🎙️ sound"
              >
                <Mic className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Voice Reaction Drop</span>
              </button>
            </div>
          </div>

          {/* Quick Viral Tags */}
          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-1 text-[10px]">
            <span className="text-gray-500 uppercase font-bold flex-shrink-0">Quick Tags:</span>
            {QUICK_TAGS.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => handleAddTag(tag)}
                className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 font-mono transition-all flex-shrink-0"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Text Input Area */}
          <div className="relative">
            <textarea
              rows={2}
              maxLength={280}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={`Drop your hot take on this ${type === 'MATCH' ? 'match' : 'football story'}... (Spit facts, no cap!)`}
              className="w-full p-3 rounded-2xl bg-[#060a12] border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-stadiumGreen font-sans resize-none"
            />
            <span className="absolute bottom-2.5 right-3 text-[10px] text-gray-500 font-mono">
              {commentText.length}/280
            </span>
          </div>

          {/* Submit Action Bar */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-gray-500 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-gold" />
              <span>Posts are recorded live in the matchday pulse ledger.</span>
            </span>

            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-5 py-2 rounded-2xl bg-gradient-to-r from-stadiumGreen to-emerald-400 hover:from-emerald-400 hover:to-stadiumGreen text-black font-black text-xs shadow-lg shadow-stadiumGreen/20 flex items-center space-x-1.5 disabled:opacity-40 active:scale-95 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{justSubmitted ? 'Take Dropped! 🔥' : 'Drop Hot Take'}</span>
            </button>
          </div>
        </form>
      )}

      {/* 3. FAN REACTIONS & VERIFIED TAKES FEED */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
          <div className="flex items-center space-x-2 text-white font-bold">
            <MessageSquare className="w-3.5 h-3.5 text-stadiumGreen" />
            <span>Fan Reactions &amp; Verified Takes ({comments.length})</span>
          </div>
          <span className="text-[10px] text-gray-500">Sorted by Live Hype</span>
        </div>

        <div className="space-y-3 max-h-[420px] overflow-y-auto scrollbar-thin pr-1">
          {comments.map((comment) => {
            const hasVotedFact = !!votedFacts[comment.id];
            const hasVotedCap = !!votedCap[comment.id];

            return (
              <div
                key={comment.id}
                className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2.5 hover:border-white/20 transition-all text-xs"
              >
                {/* Comment Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 min-w-0">
                    <span className="font-black text-white truncate">@{comment.sender}</span>
                    <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] text-gray-300 flex-shrink-0">
                      {comment.flair}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[8px] font-bold hidden sm:inline flex-shrink-0">
                      {comment.badge}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0 text-[10px]">
                    <span className="text-gold font-bold">{comment.vibe}</span>
                  </div>
                </div>

                {/* Comment Body */}
                <p className="text-gray-200 font-sans text-xs sm:text-sm leading-relaxed">
                  {comment.text}
                </p>

                {/* Community Interaction Row (Facts vs Cap + Hypes + Share) */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5 text-[10px]">
                  
                  {/* Facts vs Cap Voting */}
                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={() => handleVoteFacts(comment.id)}
                      className={`px-2.5 py-1 rounded-xl flex items-center space-x-1 transition-all ${
                        hasVotedFact
                          ? 'bg-stadiumGreen text-black font-black'
                          : 'bg-white/5 text-gray-300 hover:bg-white/15'
                      }`}
                      title="Vote: Spit Facts!"
                    >
                      <span>🔥 Facts</span>
                      <span className="font-mono font-bold">({comment.factsCount})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleVoteCap(comment.id)}
                      className={`px-2.5 py-1 rounded-xl flex items-center space-x-1 transition-all ${
                        hasVotedCap
                          ? 'bg-rose-600 text-white font-black'
                          : 'bg-white/5 text-gray-300 hover:bg-white/15'
                      }`}
                      title="Vote: Pure Cap!"
                    >
                      <span>🧢 Cap</span>
                      <span className="font-mono font-bold">({comment.capCount})</span>
                    </button>
                  </div>

                  {/* Hypes & 1-Click Viral Share */}
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleHypeComment(comment.id)}
                      className="px-2.5 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1 transition-all active:scale-90"
                    >
                      <span>⚡ Hype</span>
                      <span className="font-mono font-bold">({comment.hypesCount})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShareHotTake(comment)}
                      className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-all"
                      title="Share take to WhatsApp / X"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
