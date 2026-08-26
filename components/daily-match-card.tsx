'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { MatchData } from '../lib/sports-api';
import { getLeagueInfo } from '../lib/league-badges';
import { getClubCrest } from '../lib/club-crest-engine';
import { PersistentStorage } from '../lib/persistent-storage-engine';
import { screenPinEngine } from '../lib/screen-pin-engine';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';
import { useTranslation } from '../lib/translation-engine';
import { Bell, BellRing, Star, Pin, Shield, Zap, CheckCircle2, Flame, Trophy } from 'lucide-react';

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
  const [bookmarked, setBookmarked] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return PersistentStorage.getBookmarks().includes(match.id);
    }
    return false;
  });
  const [pinCount, setPinCount] = useState<number>(basePins);

  const isLive = match.status === 'LIVE';
  const isFinished = match.status === 'FINISHED';
  const isUpcoming = match.status === 'SCHEDULED';
  const isFollowed = (followedMatchIds || []).includes(match.id);

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

  // Sport type normalizer
  const l = (match.league || '').toLowerCase();
  const isBball = match.sport === 'BASKETBALL' || l.includes('nba') || l.includes('wnba') || l.includes('basketball');
  const isNFL = match.sport === 'AMERICAN_FOOTBALL' || l.includes('nfl') || l.includes('college football');
  const isCombat = match.sport === 'COMBAT' || l.includes('ufc') || l.includes('mma') || l.includes('boxing');
  const isTennis = match.sport === 'TENNIS' || l.includes('tennis') || l.includes('atp') || l.includes('wta') || l.includes('us open');
  const isSoccer = !isBball && !isNFL && !isCombat && !isTennis;

  // Two-way normalized probability for non-draw sports
  const rawTotal = (p.homeWinProb || 0.5) + (p.awayWinProb || 0.5);
  const normHomeProb = Math.round(((p.homeWinProb || 0.5) / (rawTotal || 1)) * 100);
  const normAwayProb = 100 - normHomeProb;

  // 3-way for soccer
  const soccerHome = Math.round((p.homeWinProb || 0.45) * 100);
  const soccerDraw = Math.round((p.drawProb || 0.25) * 100);
  const soccerAway = Math.max(0, 100 - (soccerHome + soccerDraw));

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

  const handleTeamClick = (teamName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try { phoneHardware.triggerHaptic('SELECTION'); } catch {}
    if (onOpenTeam) onOpenTeam(teamName);
    if (onSelectClub) onSelectClub(teamName);
  };

  return (
    <div
      onClick={() => onOpenInsights(match)}
      className={`relative rounded-3xl border transition-all duration-200 overflow-hidden cursor-pointer group active:scale-[0.99] p-3.5 sm:p-4 space-y-2.5 shadow-lg ${
        isLive
          ? 'border-stadiumGreen/60 bg-gradient-to-br from-stadiumGreen/10 via-panel to-panel ring-1 ring-stadiumGreen/30'
          : isFinished
          ? 'border-cyan-500/40 bg-gradient-to-br from-cyan-500/10 via-panel to-panel'
          : 'border-gold/30 bg-gradient-to-br from-panel/90 to-black hover:border-gold/60'
      }`}
    >
      {/* 1. Header Bar: League Badge & Flag + Match Status + Lock Screen Pin */}
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center space-x-1.5 min-w-0">
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
              <span>LIVE {isBball ? 'Q4' : isNFL ? '4th' : isCombat ? 'R3' : isTennis ? 'Set 2' : (match.matchTime || "28'")}</span>
            </span>
          ) : isFinished ? (
            <span className="flex-shrink-0 flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 text-[9px] font-black">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>FINAL • {match.homeScore ?? 0}-{match.awayScore ?? 0}</span>
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
            title="Follow for goal/point alerts"
          >
            {isFollowed ? <BellRing className="w-3.5 h-3.5 text-stadiumGreen" /> : <Bell className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleBookmark}
            className={`px-2 py-1 rounded-xl border transition-all flex items-center space-x-1 ${
              bookmarked ? 'bg-gold/25 border-gold text-gold ring-1 ring-gold/40' : 'bg-black/40 border-white/10 text-gray-400 hover:text-gold'
            }`}
            title="Pin to lock-screen widget"
          >
            <Star className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current text-gold' : ''}`} />
            <span className="text-[10px] font-mono font-black">{pinCount.toLocaleString()}</span>
          </button>
        </div>
      </div>

      {/* 2. Teams / Fighters Scoreboard Row */}
      <div className="flex items-center justify-between gap-2 py-1">
        {/* Home / Red Corner */}
        <button
          onClick={(e) => handleTeamClick(match.homeTeam, e)}
          className="flex-1 flex items-center space-x-2 min-w-0 text-left hover:opacity-85 transition-opacity"
          title={`View ${match.homeTeam} profile`}
        >
          <div className="w-8 h-8 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center p-1 flex-shrink-0">
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
            <span className="font-black text-xs sm:text-sm text-white truncate block hover:text-stadiumGreen transition-colors">
              {match.homeTeam}
            </span>
            <span className="text-[9px] text-gray-400 font-bold block">
              {isCombat ? '🔴 Red Corner' : 'Home'}
            </span>
          </div>
        </button>

        {/* Center Score / Kickoff Display */}
        <div className="flex flex-col items-center justify-center px-1.5 flex-shrink-0 min-w-[80px] text-center">
          {isLive || isFinished ? (
            <div className="font-mono font-black text-sm sm:text-base text-white flex items-center space-x-1">
              <span className={isFinished ? 'text-white' : 'text-stadiumGreen'}>{match.homeScore ?? 0}</span>
              <span className="text-gray-500">-</span>
              <span className={isFinished ? 'text-white' : 'text-stadiumGreen'}>{match.awayScore ?? 0}</span>
            </div>
          ) : (
            <span className="font-mono font-black text-xs text-gold">
              {match.matchTime || '19:00'}
            </span>
          )}
          <span className="text-[8px] text-gray-400 font-mono font-bold mt-0.5">
            {isLive ? 'IN PLAY' : isFinished ? 'SETTLED' : dateLabel}
          </span>
        </div>

        {/* Away / Blue Corner */}
        <button
          onClick={(e) => handleTeamClick(match.awayTeam, e)}
          className="flex-1 flex items-center justify-end space-x-2 min-w-0 text-right hover:opacity-85 transition-opacity"
          title={`View ${match.awayTeam} profile`}
        >
          <div className="min-w-0">
            <span className="font-black text-xs sm:text-sm text-white truncate block hover:text-stadiumGreen transition-colors">
              {match.awayTeam}
            </span>
            <span className="text-[9px] text-gray-400 font-bold block">
              {isCombat ? '🔵 Blue Corner' : 'Away'}
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center p-1 flex-shrink-0">
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

      {/* 3. Sport-Specific Win Probability Barometer */}
      {isSoccer ? (
        // Soccer: 3-Way 1X2 Barometer
        <div className="space-y-1">
          <div className="flex justify-between text-[9px] font-bold text-gray-400 font-mono">
            <span className="text-stadiumGreen">{soccerHome}% 1 (Home)</span>
            <span>{soccerDraw}% X (Draw)</span>
            <span className="text-cyan-400">{soccerAway}% 2 (Away)</span>
          </div>
          <div className="h-1.5 w-full bg-black/70 rounded-full overflow-hidden flex">
            <div style={{ width: `${soccerHome}%` }} className="bg-stadiumGreen h-full" />
            <div style={{ width: `${soccerDraw}%` }} className="bg-gray-600 h-full" />
            <div style={{ width: `${soccerAway}%` }} className="bg-cyan-400 h-full" />
          </div>
        </div>
      ) : (
        // Basketball / NFL / Combat / Tennis: 2-Way Head-to-Head Barometer
        <div className="space-y-1">
          <div className="flex justify-between text-[9px] font-bold text-gray-400 font-mono">
            <span className="text-stadiumGreen font-black">{normHomeProb}% {match.homeTeam.split(' ')[0]}</span>
            <span className="text-cyan-400 font-black">{normAwayProb}% {match.awayTeam.split(' ')[0]}</span>
          </div>
          <div className="h-1.5 w-full bg-black/70 rounded-full overflow-hidden flex">
            <div style={{ width: `${normHomeProb}%` }} className="bg-stadiumGreen h-full" />
            <div style={{ width: `${normAwayProb}%` }} className="bg-cyan-400 h-full" />
          </div>
        </div>
      )}

      {/* 4. Tailored Prediction Market & 1-Click Action Hub */}
      <div className="flex items-center justify-between pt-1 border-t border-white/10 gap-2">
        <div className="min-w-0">
          <div className="flex items-center space-x-1.5">
            <span className={`px-1.5 py-0.5 rounded font-black text-[8px] uppercase ${
              isFinished ? 'bg-stadiumGreen text-black' : 'bg-gold/20 text-gold border border-gold/30'
            }`}>
              {isFinished ? 'SETTLED ✓' : topPick.confidenceTier || 'BANKER'}
            </span>
            <span className="text-xs font-black text-white truncate">
              {topPick.selection}
            </span>
          </div>
          <span className="text-[9px] text-gray-400 font-mono block mt-0.5">
            {isBball && '🏀 Over/Under Points & Moneyline'}
            {isNFL && '🏈 Point Spread & Game Total'}
            {isCombat && '🥊 Method of Victory & Rounds'}
            {isTennis && '🎾 Match Winner & Sets'}
            {isSoccer && (isFinished ? `Final Score ${match.homeScore}-${match.awayScore}` : `${topPick.probability}% Confidence @ ${(topPick.odds || 1.40).toFixed(2)}`)}
          </span>
        </div>

        <button
          onClick={handleAddPick}
          className="px-3 py-1.5 rounded-xl bg-stadiumGreen hover:bg-emerald-400 text-black font-black text-[10px] flex items-center space-x-1 transition-all flex-shrink-0 shadow-md active:scale-95"
        >
          <Zap className="w-3 h-3 fill-current" />
          <span>+ Add Tip</span>
        </button>
      </div>

    </div>
  );
};
