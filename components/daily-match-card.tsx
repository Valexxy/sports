'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Check, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Bell, 
  BellRing, 
  Star, 
  Shield, 
  Users,
  Flame,
  Zap,
  TrendingUp,
  Radio,
  Swords,
  ChevronDown,
  ChevronUp,
  Activity,
  MapPin,
  Clock,
  Timer,
  Volume2,
  VolumeX,
  Mic
} from 'lucide-react';
import { MatchData } from '../lib/sports-api';
import { getLeagueInfo } from '../lib/league-badges';
import { getClubCrest } from '../lib/club-crest-engine';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';
import confetti from 'canvas-confetti';
import { PersistentStorage } from '../lib/persistent-storage-engine';
import { UserProfileEngine } from '../lib/user-profile-engine';
import { ProfessionalSettlementEngine } from '../lib/settlement-engine';
import { LiveStadiumCommentaryModal } from './live-stadium-commentary-modal';
import { HeadToHeadArenaModal } from './head-to-head-arena-modal';
import { LocationIntelligenceEngine } from '../lib/location-intelligence-engine';
import { useModalBackHandler } from '../lib/history-back-navigation';
import { GenZFanArena } from './gen-z-fan-arena';

export interface DailyMatchCardProps {
  match: MatchData;
  onSelectOdds: (match: MatchData, pick: string, odds: number) => void;
  onBookmarkMatch?: (match: MatchData) => void;
  onOpenMatchDetail?: (match: MatchData) => void;
  onOpenInsights?: (match: MatchData) => void;
  onSelectClub?: (clubName: string) => void;
  onOpenTeam?: (teamName: string) => void;
  onOpenStandings?: (leagueName: string) => void;
  followedMatchIds?: string[];
  onToggleFollow?: (match: MatchData) => void;
  isPinned?: boolean;
}

function getMatchDateLabel(utcDateStr?: string): string {
  const now = new Date();
  const matchDate = utcDateStr ? new Date(utcDateStr) : now;
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const matchDayStart = new Date(matchDate.getFullYear(), matchDate.getMonth(), matchDate.getDate());
  const diffDays = Math.round((matchDayStart.getTime() - todayStart.getTime()) / 86400000);

  if (diffDays === 0) return 'Today, ' + matchDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  if (diffDays === 1) return 'Tomorrow, ' + matchDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  if (diffDays === -1) return 'Yesterday, ' + matchDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  return matchDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

function getMatchCountdown(utcDateStr?: string, status?: string): { text: string; status: 'URGENT' | 'SOON' | 'UPCOMING' | 'LIVE' | 'FINISHED' } {
  if (status === 'FINISHED') return { text: 'FT • Final', status: 'FINISHED' };
  if (!utcDateStr) return { text: 'Scheduled', status: 'UPCOMING' };

  const now = Date.now();
  const target = new Date(utcDateStr).getTime();
  const diff = target - now;

  // Match started in the past
  if (diff < 0) {
    const elapsedMins = Math.floor(-diff / 60000);
    if (elapsedMins > 125) {
      return { text: 'Full Time', status: 'FINISHED' };
    }
    const minStr = elapsedMins <= 45 ? `${elapsedMins}'` : elapsedMins <= 60 ? 'HT' : `${Math.min(90, elapsedMins - 15)}'`;
    return { text: `Live ${minStr}`, status: 'LIVE' };
  }

  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;

  if (mins <= 5) return { text: 'Kickoff Now ⚡', status: 'URGENT' };
  if (mins < 30) return { text: `⏳ ${mins}m to Kickoff`, status: 'URGENT' };
  if (hours < 3) return { text: `⏳ ${hours}h ${remainingMins}m`, status: 'SOON' };
  if (hours < 24) return { text: `Today ${new Date(utcDateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, status: 'UPCOMING' };
  const days = Math.floor(hours / 24);
  return { text: `📅 ${days}d to go`, status: 'UPCOMING' };
}

function calculateRealisticPins(match: MatchData): number {
  const str = match.homeTeam + match.awayTeam + (match.league || '');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % 3900) + 380;
}

function calculateRealisticBettors(match: MatchData): number {
  const prob = match.prediction?.topPick?.probability || 75;
  const str = match.homeTeam + match.awayTeam;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const base = Math.floor((prob / 100) * 12500) + (Math.abs(hash) % 4800) + 2100;
  return base;
}

async function trackMatchEngagement(matchId: string, event: string) {
  try {
    const { supabase } = await import('../lib/supabase-client');
    await supabase.from('match_engagements').upsert({
      match_id: matchId,
      event_type: event,
      occurred_at: new Date().toISOString(),
    }, { ignoreDuplicates: false });
  } catch {}
}



export const DailyMatchCard: React.FC<DailyMatchCardProps> = ({
  match,
  onSelectOdds,
  onBookmarkMatch,
  onOpenMatchDetail,
  onOpenInsights,
  onSelectClub,
  onOpenTeam,
  onOpenStandings,
  followedMatchIds = [],
  onToggleFollow,
  isPinned = false,
}) => {
  const leagueInfo = getLeagueInfo(match.league);
  const basePins = useMemo(() => calculateRealisticPins(match), [match.id]);
  const baseBettors = useMemo(() => calculateRealisticBettors(match), [match.id]);

  const [bookmarked, setBookmarked] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return PersistentStorage.getBookmarks().includes(match.id);
    }
    return isPinned;
  });
  
  const [pinCount, setPinCount] = useState<number>(basePins);
  const [bettorCount, setBettorCount] = useState<number>(baseBettors);
  const [hasVotedTicket, setHasVotedTicket] = useState<boolean>(false);
  const [isAddedToSlip, setIsAddedToSlip] = useState<boolean>(false);
  const [showCommentaryModal, setShowCommentaryModal] = useState<boolean>(false);
  const [showH2HModal, setShowH2HModal] = useState<boolean>(false);
  const [showFanArenaModal, setShowFanArenaModal] = useState<boolean>(false);
  const [showVenueIntel, setShowVenueIntel] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const venueIntel = useMemo(() => {
    return LocationIntelligenceEngine.getMatchVenueIntel(match.homeTeam, match.awayTeam, match.league);
  }, [match.homeTeam, match.awayTeam, match.league]);

  // Hook to handle phone back button when modals are open
  useModalBackHandler(showCommentaryModal, () => setShowCommentaryModal(false));
  useModalBackHandler(showH2HModal, () => setShowH2HModal(false));
  useModalBackHandler(showFanArenaModal, () => setShowFanArenaModal(false));

  // Gen Z Emoji Reactions State (Persisted across sessions)
  const [reactions, setReactions] = useState<{ [key: string]: number }>(() => {
    return PersistentStorage.getMatchEmojiReactions(match.id).counts;
  });
  const [userReacted, setUserReacted] = useState<{ [key: string]: boolean }>(() => {
    return PersistentStorage.getMatchEmojiReactions(match.id).userReacted;
  });

  useEffect(() => {
    const data = PersistentStorage.getMatchEmojiReactions(match.id);
    setReactions(data.counts);
    setUserReacted(data.userReacted);
    if (PersistentStorage.isTicketPlaced(match.id)) {
      setHasVotedTicket(true);
    }
  }, [match.id]);

  const p = match.prediction || {
    homeWinProb: 0.52,
    drawProb: 0.24,
    awayWinProb: 0.24,
    expectedHomeGoals: 1.8,
    expectedAwayGoals: 1.1,
    topPick: {
      market: 'Double Chance',
      selection: `1X (${match.homeTeam})`,
      probability: 78,
      odds: 1.35,
      confidenceTier: 'BANKER',
      kellyStake: 5,
    },
  };

  const topPick = p.topPick || {
    market: 'Double Chance',
    selection: `1X (${match.homeTeam})`,
    probability: 75,
    odds: 1.35,
    confidenceTier: 'BANKER',
    kellyStake: 5,
  };

  // Concise direct terms (e.g. 1X, 2X, Over 1.5, 1, 2) without verbose long phrasing
  const cleanPickSelection = useMemo(() => {
    const raw = topPick.selection || '1X';
    const m1X = raw.match(/(.+) or Draw \(1X\)/i);
    if (m1X) return `1X (${m1X[1].trim()})`;
    const mX2 = raw.match(/Draw or (.+) \(X2\)/i) || raw.match(/(.+) or Draw \(X2\)/i);
    if (mX2) return `2X (${mX2[1].trim()})`;
    return raw;
  }, [topPick.selection]);

  // Professional tipster settlement evaluation
  const settlement = useMemo(() => {
    return ProfessionalSettlementEngine.settleMatch(match, cleanPickSelection);
  }, [match, cleanPickSelection]);

  // Accurate real-time status calculation strictly aligned with ProfessionalSettlementEngine
  const isFinished = ProfessionalSettlementEngine.isMatchFinished(match);
  const isLive = !isFinished && ProfessionalSettlementEngine.isMatchLive(match);
  const isUpcoming = !isFinished && !isLive;
  const isWon = isFinished && settlement.isWon;
  const isVoid = settlement.isVoid;
  const resolvedHomeScore = settlement.homeScore;
  const resolvedAwayScore = settlement.awayScore;

  // Local followed state: clicking registers immediately and syncs with PersistentStorage
  const [localFollowed, setLocalFollowed] = useState<boolean>(() => {
    return PersistentStorage.isMatchFollowed(match.id) || (followedMatchIds || []).includes(match.id);
  });
  const isFollowed = localFollowed;

  // Truthful Pre-Match Verified Fair Odds (strictly preserved, zero simulated drift)
  const truthfulOdds = topPick.odds || 1.35;
  const liveOdds = truthfulOdds;

  // Live Ticking Match Clock with Seconds (e.g. 78:24 -> 78:25)
  const initialElapsedSeconds = useMemo(() => {
    const rawTime = match.matchTime || '';
    const minMatch = rawTime.match(/(\d+)/);
    if (minMatch) {
      const mins = parseInt(minMatch[1], 10);
      return mins * 60 + Math.floor(Math.random() * 50);
    }
    if (match.utcDate) {
      const elapsed = Math.floor((Date.now() - new Date(match.utcDate).getTime()) / 1000);
      if (elapsed > 0 && elapsed < 7200) return elapsed;
    }
    return 34 * 60 + 12;
  }, [match.matchTime, match.utcDate]);

  const [liveSeconds, setLiveSeconds] = useState<number>(initialElapsedSeconds);

  // Second-by-second stopwatch ticker (battery-friendly: pauses when backgrounded)
  useEffect(() => {
    if (!isLive) return;
    const timer = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      setLiveSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isLive]);

  const formattedLiveClock = useMemo(() => {
    const mins = Math.floor(liveSeconds / 60);
    const secs = liveSeconds % 60;
    if (mins > 90) {
      const added = mins - 90;
      return `90+${added}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [liveSeconds]);

  // Live in-card play-by-play commentary ticker
  const [commentaryIndex, setCommentaryIndex] = useState(0);
  const [isAudioListening, setIsAudioListening] = useState(false);

  const liveCommentaryFeed = useMemo(() => {
    if (match.liveEvents && match.liveEvents.length > 1) {
      return match.liveEvents.map((ev) => ({
        minute: ev.minute || `${Math.floor(liveSeconds / 60)}'`,
        text: ev.text,
        type: ev.kind || 'INFO',
      }));
    }
    const currentMin = Math.floor(liveSeconds / 60);
    return [
      { minute: `${currentMin}'`, text: `⚡ ${match.homeTeam} launches a rapid counter-attack down the right flank! Dangerous cross whipped into the box.`, type: 'ATTACK' },
      { minute: `${Math.max(1, currentMin - 1)}'`, text: `🧤 High-stakes reflex save by the ${match.awayTeam} goalkeeper! Pitch tension is at 94%.`, type: 'SAVE' },
      { minute: `${Math.max(1, currentMin - 2)}'`, text: `🚩 Corner kick awarded to ${match.homeTeam}. Inswinger delivered toward the near post.`, type: 'CORNER' },
      { minute: `${Math.max(1, currentMin - 3)}'`, text: `🟨 Tactical foul committed near midfield. Referee issues a firm warning to the defender.`, type: 'FOUL' },
      { minute: `${Math.max(1, currentMin - 4)}'`, text: `🔥 Ferocious long-range strike from 25 yards out rattles the crossbar! Stadium crowd erupts.`, type: 'SHOT' },
    ];
  }, [match.liveEvents, match.homeTeam, match.awayTeam, Math.floor(liveSeconds / 60)]);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      setCommentaryIndex((prev) => (prev + 1) % liveCommentaryFeed.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isLive, liveCommentaryFeed.length]);

  const dateLabel = getMatchDateLabel(match.utcDate);
  const countdown = getMatchCountdown(match.utcDate, match.status);

  const handleCardClick = () => {
    try { phoneHardware.triggerHaptic('SELECTION'); } catch {}
    setIsExpanded(prev => !prev);
    if (onOpenMatchDetail) onOpenMatchDetail(match);
    if (onOpenInsights) onOpenInsights(match);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !bookmarked;
    setBookmarked(next);
    setPinCount(prev => (next ? prev + 1 : Math.max(0, prev - 1)));
    PersistentStorage.toggleBookmark(match.id);
    try { stadiumAudio.playBookmarkSound(); } catch {}
    if (onBookmarkMatch) onBookmarkMatch(match);
    try { phoneHardware.triggerHaptic('SELECTION'); } catch {}
  };

  const handleAlert = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !localFollowed;
    setLocalFollowed(next);
    PersistentStorage.toggleFollowMatch(match.id);
    if (onToggleFollow) onToggleFollow(match);
    try { phoneHardware.triggerHaptic('SUCCESS'); } catch {}
  };

  const handleAddPick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isAddedToSlip;
    setIsAddedToSlip(next);
    try { stadiumAudio.playAddPickSound(); } catch {}
    onSelectOdds(match, cleanPickSelection, liveOdds || topPick.odds || 1.35);
    try { phoneHardware.triggerHaptic('SUCCESS'); } catch {}
    if (next) {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
    }
  };

  const handlePlacedTicket = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasVotedTicket) {
      setHasVotedTicket(true);
      setBettorCount(prev => prev + 1);
      PersistentStorage.savePlacedTicket(match.id, match, topPick);
      try { phoneHardware.triggerHaptic('SUCCESS'); } catch {}
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
    }
  };

  const handleTeamClick = (teamName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try { phoneHardware.triggerHaptic('SELECTION'); } catch {}
    if (onOpenTeam) onOpenTeam(teamName);
    if (onSelectClub) onSelectClub(teamName);
  };

  const handleEmojiReaction = (emoji: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try { phoneHardware.triggerHaptic('SELECTION'); } catch {}
    const updated = PersistentStorage.saveMatchEmojiReaction(match.id, emoji);
    setReactions(updated.counts);
    setUserReacted(updated.userReacted);
    UserProfileEngine.toggleReaction(match.id, emoji);
  };

  const homePct = Math.round((p.homeWinProb || 0.5) * 100);
  const drawPct = Math.round((p.drawProb || 0.25) * 100);
  const awayPct = Math.max(0, 100 - homePct - drawPct);

  return (
    <>
      <div
        onClick={handleCardClick}
        className="glass-panel-premium rounded-[24px] p-4 sm:p-5 space-y-3 border border-white/10 hover:border-stadiumGreen/60 transition-all duration-300 shadow-xl cursor-pointer active:scale-[0.985] group relative overflow-hidden"
      >
        {/* Top Highlight Accent Line */}
        <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* 1. Header Bar: League Info + Countdown / Status + Bookmark & Follow */}
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenStandings) onOpenStandings(match.league);
              }}
              className="flex items-center space-x-1.5 min-w-0 hover:opacity-85 transition-all text-left"
              title="View Standings / Bracket"
            >
              {leagueInfo.logo ? (
                <img
                  src={leagueInfo.logo}
                  alt={match.league}
                  className="w-4 h-4 object-contain flex-shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).src = getClubCrest(match.homeTeam); }}
                />
              ) : (
                <span className="text-sm flex-shrink-0">{leagueInfo.flag}</span>
              )}
              <span className="text-xs font-black text-white hover:text-stadiumGreen transition-colors truncate">
                {leagueInfo.name}
              </span>
            </button>
          </div>

          {/* Quick Header Actions: Fan Arena, H2H Arena, Audio Commentary, Follow & Bookmark */}
          <div className="flex items-center space-x-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => {
                phoneHardware.triggerHaptic('SELECTION');
                setShowFanArenaModal(true);
              }}
              className={`px-2 py-1 rounded-xl text-[10px] font-black flex items-center space-x-1 transition-all border ${
                isFinished
                  ? 'bg-neutral-900/60 border-neutral-700 text-gray-400'
                  : 'bg-purple-950/40 hover:bg-purple-900/50 border-purple-500/40 text-purple-300'
              }`}
              title={isFinished ? 'Fan Arena Closed (FT)' : 'Open Gen Z Fan Arena'}
            >
              <span>{isFinished ? '🔒' : '💬'}</span>
              <span className="hidden sm:inline">{isFinished ? 'Arena Closed' : 'Fan Arena'}</span>
            </button>

            <button
              onClick={() => setShowH2HModal(true)}
              className="px-2 py-1 rounded-xl bg-amber-900/30 hover:bg-amber-700/40 border border-amber-600/40 text-amber-400 text-[10px] font-black flex items-center space-x-1 transition-all"
              title="Open Head-to-Head Arena & Pitch Battle"
            >
              <span>🥊</span>
              <span className="hidden sm:inline">H2H</span>
            </button>

            <button
              onClick={() => setShowCommentaryModal(true)}
              className="px-2 py-1 rounded-xl bg-cyan-900/30 hover:bg-cyan-700/40 border border-cyan-500/40 text-cyan-300 text-[10px] font-black flex items-center space-x-1 transition-all"
              title="Live Stadium Audio & Commentary"
            >
              <span>🔊</span>
              <span className="hidden sm:inline">Audio</span>
            </button>

            <button
              onClick={handleAlert}
              className={`p-1.5 rounded-xl border transition-all ${
                isFollowed ? 'bg-stadiumGreen/20 border-stadiumGreen text-stadiumGreen' : 'bg-black/40 border-white/10 text-gray-400 hover:text-stadiumGreen'
              }`}
              title="Follow for live alerts"
            >
              {isFollowed ? <BellRing className="w-3.5 h-3.5 text-stadiumGreen" /> : <Bell className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleBookmark}
              className={`px-2 py-1 rounded-xl border transition-all flex items-center space-x-1 ${
                bookmarked ? 'bg-gold/25 border-gold text-gold ring-1 ring-gold/40' : 'bg-black/40 border-white/10 text-gray-400 hover:text-gold'
              }`}
              title="Bookmark match"
            >
              <Star className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current text-gold' : ''}`} />
              <span className="text-[10px] font-mono font-black">{pinCount.toLocaleString()}</span>
            </button>
          </div>
        </div>

        {/* 2. PROMINENT PRO PREDICTION BANNER (ON FT OR VOID) */}
        {isFinished && (
          <div className={`p-2.5 rounded-2xl flex items-center justify-between border text-xs gap-2 ${
            isVoid
              ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300'
              : isWon
              ? 'bg-stadiumGreen/15 border-stadiumGreen/60 text-emerald-300'
              : 'bg-red-950/40 border-crimson/50 text-red-300'
          }`}>
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              {isVoid ? (
                <span className="p-1 rounded-lg bg-cyan-500 text-black font-black flex-shrink-0">
                  <Shield className="w-3.5 h-3.5" />
                </span>
              ) : isWon ? (
                <span className="p-1 rounded-lg bg-stadiumGreen text-black font-black flex-shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </span>
              ) : (
                <span className="p-1 rounded-lg bg-crimson text-white font-black flex-shrink-0">
                  <XCircle className="w-3.5 h-3.5" />
                </span>
              )}
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase tracking-wider block">
                  {isVoid
                    ? `MATCH ${settlement.voidReason || 'POSTPONED'} • SELECTION VOID`
                    : isWon
                    ? 'PRE-MATCH CALL VERIFIED ✓ WON'
                    : 'PRE-MATCH CALL SETTLED • LOST'}
                </span>
                <span className="text-white font-black text-xs block">
                  {isVoid ? (
                    <>Pre-Match Pick: <strong className="text-cyan-300">{cleanPickSelection}</strong> • Stake Refunded (1.00x)</>
                  ) : (
                    <>Pre-Match Pick: <strong className="text-gold">{cleanPickSelection}</strong> @ {truthfulOdds} &bull; FT: {resolvedHomeScore}-{resolvedAwayScore}</>
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={handleAddPick}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-black transition-all flex items-center space-x-1 ${
                  isAddedToSlip
                    ? 'bg-gold text-black shadow'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
                title="Add settled match to slip"
              >
                {isAddedToSlip ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                <span>{isAddedToSlip ? 'In Slip' : '+ Slip'}</span>
              </button>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                isVoid
                  ? 'bg-cyan-400 text-black shadow-md font-mono'
                  : isWon
                  ? 'bg-stadiumGreen text-black shadow-md'
                  : 'bg-crimson text-white'
              }`}>
                {isVoid ? 'VOID (1.00x)' : isWon ? 'WON ✓' : 'LOST'}
              </span>
            </div>
          </div>
        )}

        {/* 3. Teams Scoreboard Row */}
        <div className="flex items-center justify-between gap-2 py-1">
          {/* Home Team */}
          <button
            type="button"
            onClick={(e) => handleTeamClick(match.homeTeam, e)}
            className="flex-1 flex items-center space-x-2 min-w-0 text-left group/team hover:opacity-90 transition-all"
            title={`Click to view ${match.homeTeam} dossier`}
          >
            <div className="w-10 h-10 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center p-1.5 flex-shrink-0 group-hover/team:border-stadiumGreen transition-all shadow-md">
              {match.homeLogo ? (
                <img
                  src={match.homeLogo || getClubCrest(match.homeTeam)}
                  alt={match.homeTeam}
                  className="w-full h-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).src = getClubCrest(match.homeTeam); }}
                />
              ) : (
                <Shield className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-black text-xs sm:text-sm text-white break-words leading-tight block group-hover/team:text-stadiumGreen transition-colors line-clamp-2">
                {match.homeTeam}
              </span>
              <span className="text-[9px] text-gray-400 font-bold block">Home</span>
            </div>
          </button>

          {/* Center Score / Time */}
          <div className="flex flex-col items-center justify-center px-2 flex-shrink-0 min-w-[84px] text-center">
            {isLive ? (
              <div className="flex flex-col items-center">
                <div className="font-mono font-black text-base sm:text-lg text-white flex items-center space-x-1.5 bg-black/80 px-3.5 py-1 rounded-2xl border border-stadiumGreen/50 shadow-[0_0_15px_rgba(0,230,118,0.25)]">
                  <span className="text-stadiumGreen tabular-nums">{resolvedHomeScore}</span>
                  <span className="text-gray-500">-</span>
                  <span className="text-stadiumGreen tabular-nums">{resolvedAwayScore}</span>
                </div>
                <div className="flex items-center space-x-1 mt-1 px-2 py-0.5 rounded-full bg-crimson/20 border border-crimson/50 text-[10px] font-mono font-black text-crimson animate-pulse">
                  <Timer className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} />
                  <span className="tabular-nums">{formattedLiveClock}</span>
                </div>
              </div>
            ) : isFinished ? (
              <div className="font-mono font-black text-base sm:text-lg text-white flex items-center space-x-1.5 bg-black/70 px-3.5 py-1 rounded-2xl border border-white/10 shadow-inner">
                <span className="text-white">{resolvedHomeScore}</span>
                <span className="text-gray-500">-</span>
                <span className="text-white">{resolvedAwayScore}</span>
              </div>
            ) : (
              <span className="font-mono font-black text-sm text-gold bg-black/70 px-3.5 py-1 rounded-2xl border border-white/10 shadow-inner">
                {match.matchTime || '19:00'}
              </span>
            )}
          </div>

          {/* Away Team */}
          <button
            type="button"
            onClick={(e) => handleTeamClick(match.awayTeam, e)}
            className="flex-1 flex items-center justify-end space-x-2 min-w-0 text-right group/team hover:opacity-90 transition-all"
            title={`Click to view ${match.awayTeam} dossier`}
          >
            <div className="min-w-0 flex-1">
              <span className="font-black text-xs sm:text-sm text-white break-words leading-tight block group-hover/team:text-stadiumGreen transition-colors line-clamp-2">
                {match.awayTeam}
              </span>
              <span className="text-[9px] text-gray-400 font-bold block">Away</span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center p-1.5 flex-shrink-0 group-hover/team:border-stadiumGreen transition-all shadow-md">
              {match.awayLogo ? (
                <img
                  src={match.awayLogo || getClubCrest(match.awayTeam)}
                  alt={match.awayTeam}
                  className="w-full h-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).src = getClubCrest(match.awayTeam); }}
                />
              ) : (
                <Shield className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </button>
        </div>




        {/* 6. Venue & Geo-Physics Intelligence Bar */}
        <div 
          onClick={(e) => { e.stopPropagation(); setShowVenueIntel(!showVenueIntel); }}
          className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 cursor-pointer transition-all text-[10px] font-mono text-gray-300 shadow-sm"
        >
          <div className="flex items-center space-x-1.5 truncate">
            <span className="text-stadiumGreen font-black">🏟️ {venueIntel.stadiumName}</span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-400">{venueIntel.elevationMeters}m Alt</span>
            <span className="text-gray-600">•</span>
            <span className={venueIntel.travelFatigueTier === 'LOCAL_DERBY' ? 'text-amber-400 font-bold' : 'text-gray-400'}>
              {venueIntel.travelFatigueTier === 'LOCAL_DERBY' ? '⚔️ Derby' : `✈️ ${venueIntel.travelDistanceKm}km`}
            </span>
          </div>
          <span className="text-gray-400 text-[9px] font-bold hover:text-stadiumGreen transition-colors flex-shrink-0">
            {showVenueIntel ? '▲ Hide Dossier' : '▼ Geo Physics'}
          </span>
        </div>

        {/* Collapsible Venue Geo-Physics Dossier */}
        {showVenueIntel && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="p-3 rounded-2xl bg-[#090f1d] border border-stadiumGreen/40 space-y-2 text-xs font-sans text-gray-200 animate-fadeIn shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-[11px]">
              <strong className="text-white font-mono flex items-center space-x-1.5">
                <span>📍</span>
                <span>{venueIntel.stadiumName} ({venueIntel.stadiumCity})</span>
              </strong>
              <span className="px-2 py-0.5 rounded-full bg-stadiumGreen/20 text-stadiumGreen font-mono font-bold text-[9px]">
                {venueIntel.pitchSurface}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="p-2 rounded-xl bg-black/50 border border-white/10 space-y-0.5">
                <span className="text-gray-400 block">⛰️ Elevation / Ball Drag:</span>
                <span className="text-white font-bold block">{venueIntel.elevationMeters}m ({venueIntel.altitudeTier})</span>
                {venueIntel.altitudeNote && (
                  <span className="text-amber-400 text-[9px] block leading-tight font-sans">{venueIntel.altitudeNote}</span>
                )}
              </div>

              <div className="p-2 rounded-xl bg-black/50 border border-white/10 space-y-0.5">
                <span className="text-gray-400 block">✈️ Away Travel Burden:</span>
                <span className="text-white font-bold block">{venueIntel.travelDistanceKm} km ({venueIntel.travelFatigueTier.replace(/_/g, ' ')})</span>
                {venueIntel.derbyAlert ? (
                  <span className="text-crimson text-[9px] block leading-tight font-sans">{venueIntel.derbyAlert}</span>
                ) : venueIntel.travelNote ? (
                  <span className="text-gray-300 text-[9px] block leading-tight font-sans">{venueIntel.travelNote}</span>
                ) : null}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-[9px] font-mono text-gray-400 border-t border-white/5">
              <span>🏟️ Capacity: {venueIntel.stadiumCapacity.toLocaleString()} (Intimidation: {venueIntel.crowdIntimidationScore}/100)</span>
              <span className="text-stadiumGreen font-bold">{venueIntel.airQualityStatus}</span>
            </div>
          </div>
        )}

        {/* 7. Gen Z Emoji Quick Reactions Bar */}
        <div className="flex items-center justify-between gap-1 pt-1 border-t border-white/5" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none py-0.5">
            {Object.entries(reactions).map(([emoji, count]) => {
              const active = userReacted[emoji];
              return (
                <button
                  key={emoji}
                  type="button"
                  onClick={(e) => handleEmojiReaction(emoji, e)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold flex items-center space-x-1 transition-all active:scale-90 ${
                    active
                      ? 'bg-stadiumGreen/25 text-stadiumGreen border border-stadiumGreen/50'
                      : 'bg-black/40 text-gray-400 hover:text-white border border-white/10'
                  }`}
                >
                  <span>{emoji}</span>
                  <span>{count}</span>
                </button>
              );
            })}
          </div>

          {/* Ticket Placement Button */}
          <button
            type="button"
            onClick={handlePlacedTicket}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-black transition-all flex items-center space-x-1 flex-shrink-0 ${
              hasVotedTicket
                ? 'bg-stadiumGreen text-black shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-gold border border-gold/40'
            }`}
          >
            {hasVotedTicket ? <Check className="w-3 h-3 stroke-[3]" /> : <Plus className="w-3 h-3" />}
            <span>{hasVotedTicket ? 'Backed ✓' : 'Fan Pick (+1)'}</span>
          </button>
        </div>

        {/* 8. Top Pick Banker Banner — Show on upcoming matches */}
        {!isFinished && match.prediction?.hasPrediction === false ? (
          /* Watch-Only League — no prediction shown */
          <div className="p-3 rounded-2xl flex items-center space-x-2.5 bg-white/5 border border-white/10 text-xs">
            <span className="text-2xl flex-shrink-0">📊</span>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase text-amber-400 block tracking-wider">Watch-Only Match</span>
              <span className="text-gray-400 font-sans text-[10px] leading-snug block">
                {match.prediction?.noDataNote || 'Insufficient data for a reliable prediction. View scores only.'}
              </span>
              {match.prediction?.leagueAccuracy !== undefined && (
                <span className="text-[9px] text-gray-600 font-mono">
                  Hist. accuracy: {match.prediction.leagueAccuracy}% — model coverage insufficient
                </span>
              )}
            </div>
          </div>
        ) : !isFinished ? (
          /* Standard Banker Banner — confident pick */
          <div className="p-3 rounded-2xl flex items-center justify-between gap-2 shadow-md bg-gradient-to-r from-stadiumGreen/20 via-panel to-gold/15 border border-stadiumGreen/40">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-black uppercase tracking-wider block text-stadiumGreen">
                👑 {topPick.confidenceTier} ({topPick.probability}% WIN RATE)
              </span>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="text-sm font-black text-gold">
                  {cleanPickSelection}
                </span>
                <span className="text-xs font-mono font-black text-white">
                  @{liveOdds.toFixed(2)}
                </span>
                {oddsDirection && (
                  <span className={`text-[11px] font-black animate-pulse ${
                    oddsDirection === 'UP' ? 'text-stadiumGreen' : 'text-crimson'
                  }`}>
                    {oddsDirection === 'UP' ? '▲' : '▼'}
                  </span>
                )}
              </div>
            </div>

            {/* Added State with Dynamic Color Feedback */}
            <button
              type="button"
              onClick={handleAddPick}
              className={`px-3.5 py-2 rounded-xl font-black text-xs shadow-md transition-all flex items-center space-x-1.5 flex-shrink-0 active:scale-95 ${
                isAddedToSlip
                  ? 'bg-gradient-to-r from-gold to-amber-400 text-black shadow-lg shadow-gold/30 ring-2 ring-gold'
                  : 'bg-stadiumGreen hover:bg-emerald-400 text-black hover:scale-105'
              }`}
            >
              {isAddedToSlip ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{isAddedToSlip ? 'Added ✓' : `+ Add @ ${liveOdds.toFixed(2)}`}</span>
            </button>
          </div>
        ) : null}
      </div>

      {/* Live Stadium Commentary Modal */}
      {showCommentaryModal && (
        <LiveStadiumCommentaryModal
          match={match}
          onClose={() => setShowCommentaryModal(false)}
        />
      )}

      {/* Head-to-Head Arena Modal */}
      {showH2HModal && (
        <HeadToHeadArenaModal
          match={match}
          onClose={() => setShowH2HModal(false)}
        />
      )}

      {/* Gen Z Fan Arena Modal (Closes when match ends) */}
      {showFanArenaModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn"
          onClick={() => setShowFanArenaModal(false)}
        >
          <div 
            className="w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-1"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end p-2 sm:hidden">
              <button
                onClick={() => setShowFanArenaModal(false)}
                className="px-3 py-1 rounded-xl bg-white/10 text-white text-xs font-bold"
              >
                Close ✕
              </button>
            </div>
            <GenZFanArena
              targetId={match.id}
              targetTitle={`${match.homeTeam} vs ${match.awayTeam}`}
              type="MATCH"
              matchStatus={match.status}
              matchMinute={match.matchTime || 'Live'}
              homeTeam={match.homeTeam}
              awayTeam={match.awayTeam}
              homeScore={match.homeScore ?? 0}
              awayScore={match.awayScore ?? 0}
            />
          </div>
        </div>
      )}
    </>
  );
};
