'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { MatchData } from '../lib/sports-api';
import { getLeagueInfo } from '../lib/league-badges';
import { getClubCrest } from '../lib/club-crest-engine';
import { PersistentStorage } from '../lib/persistent-storage-engine';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';
import { useTranslation } from '../lib/translation-engine';
import { Bell, BellRing, Star, Shield, Zap, CheckCircle2, Flame, Trophy, Check, Plus, Users, Target, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export interface DailyMatchCardProps {
  match: MatchData;
  onOpenInsights: (match: MatchData) => void;
  onSelectOdds: (match: MatchData, selection: string, odds: number) => void;
  onBookmarkMatch?: (match: MatchData) => void;
  followedMatchIds?: string[];
  onToggleFollow?: (match: MatchData) => void;
  onOpenStandings?: (league: string) => void;
  onOpenTeam?: (teamName: string) => void;
  onSelectClub?: (clubName: string) => void;
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

function checkPredictionWon(match: MatchData): boolean {
  if (match.status !== 'FINISHED') return false;
  const hScore = match.homeScore ?? 0;
  const aScore = match.awayScore ?? 0;
  const sel = (match.prediction?.topPick?.selection || '').toLowerCase();
  const mkt = (match.prediction?.topPick?.market || '').toLowerCase();

  if (sel.includes('over 2.5') || mkt.includes('over 2.5')) return (hScore + aScore) >= 3;
  if (sel.includes('over 1.5') || mkt.includes('over 1.5')) return (hScore + aScore) >= 2;
  if (sel.includes('btts') || sel.includes('both')) return hScore > 0 && aScore > 0;
  if (sel.includes('draw')) return hScore === aScore;
  if (sel.includes('1x') || sel.includes('or draw')) return hScore >= aScore;
  if (sel.includes(match.homeTeam.toLowerCase()) || sel.includes('home')) return hScore > aScore;
  if (sel.includes(match.awayTeam.toLowerCase()) || sel.includes('away')) return aScore > hScore;
  return hScore >= aScore;
}

export const DailyMatchCard: React.FC<DailyMatchCardProps> = ({
  match,
  onOpenInsights,
  onSelectOdds,
  onBookmarkMatch,
  followedMatchIds = [],
  onToggleFollow,
  onOpenStandings,
  onOpenTeam,
  onSelectClub,
}) => {
  const { t } = useTranslation();
  const leagueInfo = getLeagueInfo(match.league);
  const basePins = useMemo(() => calculateRealisticPins(match), [match.id]);
  const baseBettors = useMemo(() => calculateRealisticBettors(match), [match.id]);
  
  const [bookmarked, setBookmarked] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return PersistentStorage.getBookmarks().includes(match.id);
    }
    return false;
  });
  const [pinCount, setPinCount] = useState<number>(basePins);
  const [bettorCount, setBettorCount] = useState<number>(baseBettors);
  const [hasVotedTicket, setHasVotedTicket] = useState<boolean>(false);

  const isLive = match.status === 'LIVE';
  const isFinished = match.status === 'FINISHED';
  const isUpcoming = match.status === 'SCHEDULED';
  const isFollowed = (followedMatchIds || []).includes(match.id);

  const isWon = isFinished && checkPredictionWon(match);

  const p = match.prediction || {
    homeWinProb: 0.52,
    drawProb: 0.24,
    awayWinProb: 0.24,
    expectedHomeGoals: 1.8,
    expectedAwayGoals: 1.1,
    topPick: {
      market: 'Moneyline',
      selection: `${match.homeTeam} Win`,
      probability: 78,
      odds: 1.45,
      confidenceTier: 'BANKER',
      kellyStake: 5,
    },
  };

  const topPick = p.topPick || {
    market: 'Match Pick',
    selection: `${match.homeTeam} Win`,
    probability: 75,
    odds: 1.40,
    confidenceTier: 'BANKER',
    kellyStake: 5,
  };

  const dateLabel = getMatchDateLabel(match.utcDate);

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
    if (onToggleFollow) onToggleFollow(match);
    try { phoneHardware.triggerHaptic('SELECTION'); } catch {}
  };

  const handleAddPick = (e: React.MouseEvent) => {
    e.stopPropagation();
    try { stadiumAudio.playAddPickSound(); } catch {}
    onSelectOdds(match, topPick.selection, topPick.odds || 1.40);
    try { phoneHardware.triggerHaptic('SELECTION'); } catch {}
  };

  const handlePlacedTicket = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasVotedTicket) {
      setHasVotedTicket(true);
      setBettorCount(prev => prev + 1);
      phoneHardware.triggerHaptic('SUCCESS');
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
    }
  };

  const handleTeamClick = (teamName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try { phoneHardware.triggerHaptic('SELECTION'); } catch {}
    if (onOpenTeam) onOpenTeam(teamName);
    if (onSelectClub) onSelectClub(teamName);
  };

  return (
    <div
      onClick={() => onOpenInsights(match)}
      className={`relative rounded-3xl border transition-all duration-200 overflow-hidden cursor-pointer group active:scale-[0.99] p-4 sm:p-5 space-y-3.5 shadow-xl font-mono ${
        isFinished
          ? isWon
            ? 'border-stadiumGreen/60 bg-gradient-to-br from-emerald-950/40 via-panel to-panel shadow-emerald-500/10'
            : 'border-crimson/50 bg-gradient-to-br from-red-950/30 via-panel to-panel'
          : isLive
          ? 'border-stadiumGreen/70 bg-gradient-to-br from-stadiumGreen/15 via-panel to-panel ring-1 ring-stadiumGreen/40'
          : 'border-gold/30 bg-gradient-to-br from-panel/90 to-black hover:border-gold/60'
      }`}
    >
      {/* 1. Top Header: League Info + Live Status + Alert/Pin Icons */}
      <div className="flex items-center justify-between gap-1 border-b border-white/10 pb-2.5">
        <div className="flex items-center space-x-2 min-w-0">
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

          {/* Status Badge */}
          {isLive ? (
            <span className="flex-shrink-0 flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-stadiumGreen/20 border border-stadiumGreen/50 text-stadiumGreen text-[9px] font-black animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-stadiumGreen" />
              <span>LIVE {match.matchTime || "28'"}</span>
            </span>
          ) : isFinished ? (
            <span className={`flex-shrink-0 flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[9px] font-black border ${
              isWon ? 'bg-stadiumGreen/20 border-stadiumGreen/50 text-stadiumGreen' : 'bg-gray-800 border-gray-700 text-gray-300'
            }`}>
              <CheckCircle2 className="w-3 h-3" />
              <span>FULL-TIME • {match.homeScore ?? 0}-{match.awayScore ?? 0}</span>
            </span>
          ) : (
            <span className="flex-shrink-0 flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-400 text-[9px] font-black">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>{dateLabel}</span>
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
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

      {/* 🎯 2. PROMINENT PRO PREDICTION VS OUTCOME BANNER (ON FT) */}
      {isFinished && (
        <div className={`p-2.5 rounded-2xl flex items-center justify-between border text-xs ${
          isWon
            ? 'bg-stadiumGreen/15 border-stadiumGreen/60 text-emerald-300'
            : 'bg-red-950/40 border-crimson/50 text-red-300'
        }`}>
          <div className="flex items-center space-x-2 min-w-0">
            {isWon ? (
              <span className="p-1 rounded-lg bg-stadiumGreen text-black font-black flex-shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            ) : (
              <span className="p-1 rounded-lg bg-crimson text-white font-black flex-shrink-0">
                <XCircle className="w-3.5 h-3.5" />
              </span>
            )}
            <div className="min-w-0 truncate">
              <span className="text-[10px] font-black uppercase tracking-wider block">
                {isWon ? 'PREDICTION WON ✓ VERIFIED' : 'PREDICTION SETTLED'}
              </span>
              <span className="text-white font-black text-xs block truncate">
                Pick: <strong className="text-gold">{topPick.selection}</strong> @ {topPick.odds} (FT: {match.homeScore}-{match.awayScore})
              </span>
            </div>
          </div>

          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase flex-shrink-0 ${
            isWon ? 'bg-stadiumGreen text-black shadow-md' : 'bg-crimson text-white'
          }`}>
            {isWon ? 'WON ✓' : 'LOST'}
          </span>
        </div>
      )}

      {/* 3. Teams Scoreboard Row with Specific Team Click Handler */}
      <div className="flex items-center justify-between gap-2 py-1">
        
        {/* Home Team Button (Opens exact team profile) */}
        <button
          type="button"
          onClick={(e) => handleTeamClick(match.homeTeam, e)}
          className="flex-1 flex items-center space-x-2 min-w-0 text-left group/team hover:opacity-90 transition-all"
          title={`Click to view ${match.homeTeam} Wikipedia & stadium dossier`}
        >
          <div className="w-9 h-9 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center p-1.5 flex-shrink-0 group-hover/team:border-stadiumGreen transition-all">
            {match.homeLogo ? (
              <img
                src={match.homeLogo || getClubCrest(match.homeTeam)}
                alt={match.homeTeam}
                className="w-full h-full object-contain"
                onError={(e) => { (e.target as HTMLImageElement).src = getClubCrest(match.homeTeam); }}
              />
            ) : (
              <Shield className="w-4 h-4 text-gray-400" />
            )}
          </div>
          <div className="min-w-0">
            <span className="font-black text-xs sm:text-sm text-white truncate block group-hover/team:text-stadiumGreen transition-colors">
              {match.homeTeam}
            </span>
            <span className="text-[9px] text-gray-400 font-bold block">Home</span>
          </div>
        </button>

        {/* Center Score / Time */}
        <div className="flex flex-col items-center justify-center px-2 flex-shrink-0 min-w-[75px] text-center">
          {isLive || isFinished ? (
            <div className="font-mono font-black text-base sm:text-lg text-white flex items-center space-x-1.5 bg-black/60 px-3 py-1 rounded-xl border border-white/10">
              <span className={isFinished ? 'text-white' : 'text-stadiumGreen'}>{match.homeScore ?? 0}</span>
              <span className="text-gray-500">-</span>
              <span className={isFinished ? 'text-white' : 'text-stadiumGreen'}>{match.awayScore ?? 0}</span>
            </div>
          ) : (
            <span className="font-mono font-black text-sm text-gold bg-black/60 px-3 py-1 rounded-xl border border-white/10">
              {match.matchTime || '19:00'}
            </span>
          )}
        </div>

        {/* Away Team Button (Opens exact team profile) */}
        <button
          type="button"
          onClick={(e) => handleTeamClick(match.awayTeam, e)}
          className="flex-1 flex items-center justify-end space-x-2 min-w-0 text-right group/team hover:opacity-90 transition-all"
          title={`Click to view ${match.awayTeam} Wikipedia & stadium dossier`}
        >
          <div className="min-w-0">
            <span className="font-black text-xs sm:text-sm text-white truncate block group-hover/team:text-stadiumGreen transition-colors">
              {match.awayTeam}
            </span>
            <span className="text-[9px] text-gray-400 font-bold block">Away</span>
          </div>
          <div className="w-9 h-9 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center p-1.5 flex-shrink-0 group-hover/team:border-stadiumGreen transition-all">
            {match.awayLogo ? (
              <img
                src={match.awayLogo || getClubCrest(match.awayTeam)}
                alt={match.awayTeam}
                className="w-full h-full object-contain"
                onError={(e) => { (e.target as HTMLImageElement).src = getClubCrest(match.awayTeam); }}
              />
            ) : (
              <Shield className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </button>

      </div>

      {/* 4. Live Crowd Ticket Counter (Realistic Punters Placed Count) */}
      <div className="flex items-center justify-between p-2 rounded-xl bg-black/50 border border-white/5 text-[11px]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center space-x-1.5 text-gray-300 min-w-0 truncate">
          <Users className="w-3.5 h-3.5 text-gold flex-shrink-0" />
          <span className="truncate">
            <strong className="text-white font-mono">{bettorCount.toLocaleString()}</strong> <span className="hidden sm:inline">Punters Placed This Slip</span><span className="sm:hidden">Played</span>
          </span>
        </div>

        <button
          type="button"
          onClick={handlePlacedTicket}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all flex items-center space-x-1 ${
            hasVotedTicket
              ? 'bg-stadiumGreen text-black shadow-md'
              : 'bg-white/10 hover:bg-white/20 text-gold border border-gold/30'
          }`}
        >
          {hasVotedTicket ? <Check className="w-3 h-3 stroke-[3]" /> : <Plus className="w-3 h-3" />}
          <span>{hasVotedTicket ? 'I Placed (+1) ✓' : 'I Bet This (+1)'}</span>
        </button>
      </div>

      {/* 5. Top Pick Banker Banner — Show on upcoming matches */}
      {!isFinished && (
        <div className="p-3 rounded-2xl flex items-center justify-between gap-2 shadow-md bg-gradient-to-r from-stadiumGreen/20 via-panel to-gold/15 border border-stadiumGreen/40">
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider block text-stadiumGreen">
              👑 {topPick.confidenceTier} ({topPick.probability}% WIN RATE)
            </span>
            <span className="text-xs font-black text-white truncate block">
              {topPick.market}: <strong className="text-gold">{topPick.selection}</strong> @ {topPick.odds}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddPick}
            className="px-3.5 py-2 rounded-xl bg-stadiumGreen hover:bg-emerald-400 text-black font-black text-xs shadow-md hover:scale-105 transition-all flex items-center space-x-1 flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add @ {topPick.odds}</span>
          </button>
        </div>
      )}

    </div>
  );
};
