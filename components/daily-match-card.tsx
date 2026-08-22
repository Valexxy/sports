'use client';

import React, { useState, useEffect } from 'react';
import { MatchData } from '../lib/sports-api';
import { getLeagueInfo } from '../lib/league-badges';
import { Bell, BellRing, Star, Zap, CheckCircle2, XCircle, Calendar, Clock, Timer, Flame, Trophy, Shield } from 'lucide-react';
import { useTranslation } from '../lib/translation-engine';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';

export interface DailyMatchCardProps {
  match: MatchData;
  onOpenInsights: (match: MatchData) => void;
  onSelectOdds: (match: MatchData, selection: string, odds: number) => void;
  onBookmarkMatch?: (match: MatchData) => void;
  followedMatchIds?: string[];
  onToggleFollow?: (match: MatchData) => void;
  onOpenStandings?: (league: string) => void;
  onOpenTeam?: (teamName: string) => void;
}

function useLiveCountdown(utcDateStr?: string, matchTimeStr: string = '19:00'): string {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      let targetTime: Date;

      if (utcDateStr) {
        targetTime = new Date(utcDateStr);
      } else {
        const [hours, minutes] = (matchTimeStr || '19:00').split(':').map(Number);
        targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours || 19, minutes || 0);
      }

      const diff = targetTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('Starting soon ⚡');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`Starts in ${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeLeft(`Starts in ${hours}h ${mins}m`);
      } else {
        setTimeLeft(`Starts in ${mins}m ⚡`);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 30000);
    return () => clearInterval(interval);
  }, [utcDateStr, matchTimeStr]);

  return timeLeft;
}

function evaluatePickOutcome(
  selection: string,
  homeTeam: string,
  awayTeam: string,
  homeScore?: number,
  awayScore?: number
): { won: boolean; label: string; scoreSummary: string } | null {
  if (homeScore === undefined || awayScore === undefined) return null;

  const totalGoals = homeScore + awayScore;
  const isHomeWin = homeScore > awayScore;
  const isAwayWin = awayScore > homeScore;
  const isDraw = homeScore === awayScore;
  const sel = selection.toLowerCase();

  let won = false;

  if (sel.includes('over 2.5')) {
    won = totalGoals >= 3;
  } else if (sel.includes('under 2.5')) {
    won = totalGoals <= 2;
  } else if (sel.includes('btts') || sel.includes('gg') || sel.includes('both teams')) {
    won = homeScore > 0 && awayScore > 0;
  } else if (sel.includes('1x') || (sel.includes('home') && sel.includes('draw'))) {
    won = isHomeWin || isDraw;
  } else if (sel.includes('x2') || (sel.includes('away') && sel.includes('draw'))) {
    won = isAwayWin || isDraw;
  } else if (sel.includes('draw') || sel === 'x') {
    won = isDraw;
  } else if (sel.includes('home') || sel === '1') {
    won = isHomeWin;
  } else if (sel.includes('away') || sel === '2') {
    won = isAwayWin;
  } else {
    won = isHomeWin;
  }

  const scoreSummary = homeScore + '-' + awayScore + ' (' + totalGoals + ' Goals)';
  return {
    won,
    label: won ? 'WON ✅' : 'LOST ❌',
    scoreSummary,
  };
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

export const DailyMatchCard: React.FC<DailyMatchCardProps> = ({
  match,
  onOpenInsights,
  onSelectOdds,
  onBookmarkMatch,
  followedMatchIds = [],
  onToggleFollow,
  onOpenStandings,
  onOpenTeam,
}) => {
  const { t } = useTranslation();
  const [bookmarked, setBookmarked] = useState(false);
  const isLive = match.status === 'LIVE';
  const isFinished = match.status === 'FINISHED';
  const isUpcoming = match.status === 'SCHEDULED';
  const isFollowed = followedMatchIds.includes(match.id);
  const p = match.prediction;
  const homeW = Math.round(p.homeWinProb * 100);
  const drawW = Math.round(p.drawProb * 100);
  const awayW = Math.round(p.awayWinProb * 100);

  const dateLabel = getMatchDateLabel(match.utcDate);
  const liveCountdown = useLiveCountdown(match.utcDate, match.matchTime);
  const leagueInfo = getLeagueInfo(match.league);

  const outcome = isFinished ? evaluatePickOutcome(p.topPick.selection, match.homeTeam, match.awayTeam, match.homeScore, match.awayScore) : null;

  const cardAuraClass = isLive
    ? 'border-crimson/70 bg-gradient-to-br from-crimson/15 via-panel/95 to-panel shadow-2xl shadow-crimson/25 ring-1 ring-crimson/40'
    : isFinished
    ? (outcome?.won
      ? 'border-stadiumGreen/60 bg-gradient-to-br from-stadiumGreen/10 via-panel/95 to-panel shadow-xl shadow-stadiumGreen/20 ring-1 ring-stadiumGreen/30'
      : 'border-crimson/50 bg-gradient-to-br from-crimson/10 via-panel/95 to-panel shadow-lg shadow-crimson/15 ring-1 ring-crimson/20')
    : 'border-gold/45 bg-gradient-to-br from-gold/10 via-panel/95 to-panel shadow-xl shadow-gold/15 ring-1 ring-gold/25 hover:border-gold/70';

  const confidenceColor = isFinished
    ? (outcome?.won ? 'text-stadiumGreen border-stadiumGreen/50 bg-stadiumGreen/10' : 'text-crimson border-crimson/50 bg-crimson/10')
    : p.topPick.confidenceTier === 'ULTRA-BANKER'
    ? 'text-stadiumGreen border-stadiumGreen/50 bg-stadiumGreen/10'
    : p.topPick.confidenceTier === 'BANKER'
    ? 'text-gold border-gold/40 bg-gold/10'
    : 'text-cyberPurple border-cyberPurple/30 bg-cyberPurple/10';

  const probBarColor = p.topPick.probability >= 80 ? 'bg-stadiumGreen'
    : p.topPick.probability >= 65 ? 'bg-gold' : 'bg-cyberPurple';

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarked(b => !b);
    stadiumAudio.playBookmarkSound();
    if (onBookmarkMatch) onBookmarkMatch(match);
    phoneHardware.triggerHaptic('SELECTION');
  };

  const handleAlert = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFollow) {
      onToggleFollow(match);
      phoneHardware.triggerHaptic('SELECTION');
    }
  };

  const handleAddPick = (e: React.MouseEvent) => {
    e.stopPropagation();
    stadiumAudio.playAddPickSound();
    onSelectOdds(match, p.topPick.selection, p.topPick.odds);
    phoneHardware.triggerHaptic('SELECTION');
  };

  const handleTeamClick = (e: React.MouseEvent, teamName: string) => {
    e.stopPropagation();
    phoneHardware.triggerHaptic('SELECTION');
    stadiumAudio.playTabClickSound();
    if (onOpenTeam) {
      onOpenTeam(teamName);
    }
  };

  const handleTimeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    phoneHardware.triggerHaptic('SELECTION');
    if (isLive) {
      stadiumAudio.playWhistle('kickoff');
    } else {
      stadiumAudio.playTabClickSound();
    }
    onOpenInsights(match);
  };

  return (
    <div
      className={'relative rounded-3xl border transition-all duration-300 overflow-hidden cursor-pointer group active:scale-[0.98] ' + cardAuraClass}
      onClick={() => onOpenInsights(match)}
    >
      {isLive && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-crimson via-gold to-crimson animate-pulse" />}
      {isUpcoming && <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold/50 via-gold to-gold/50" />}
      {isFinished && outcome?.won && <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-stadiumGreen/50 via-stadiumGreen to-stadiumGreen/50" />}

      <div className="p-4 sm:p-5 space-y-3.5">

        {/* Row 1: Official League Crest (Clickable) + Smart Status Badge + Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0">
            
            {/* Clickable League Header */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenStandings) onOpenStandings(match.league);
              }}
              className="flex items-center space-x-1.5 min-w-0 hover:opacity-90 transition-all group/league py-1 px-2 -ml-1.5 rounded-2xl hover:bg-white/10 border border-transparent hover:border-stadiumGreen/40"
              title="Click to view full League Table & Standings 🏆"
            >
              {leagueInfo.logo ? (
                <img src={leagueInfo.logo} alt={match.league} className="w-5 h-5 object-contain flex-shrink-0 group-hover/league:scale-110 transition-transform" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              ) : (
                <span className="text-base flex-shrink-0">{leagueInfo.flag}</span>
              )}
              <span className="text-xs font-black text-white group-hover/league:text-stadiumGreen transition-colors truncate flex items-center space-x-1">
                <span>{leagueInfo.name}</span>
                <span className="text-[9px] text-gold font-bold">📊 Table ➔</span>
              </span>
            </button>
            
            {/* LIVE Badge */}
            {isLive && (
              <span className="flex-shrink-0 flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-crimson/30 border border-crimson/70 text-crimson text-[10px] font-black animate-pulse shadow-md shadow-crimson/30">
                <span className="w-1.5 h-1.5 rounded-full bg-crimson inline-block animate-ping" />
                <span>{t("Live")}</span>
              </span>
            )}

            {/* PLAYED Badge */}
            {isFinished && (
              <span className={'flex-shrink-0 flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border ' + (outcome?.won ? 'bg-stadiumGreen/25 border-stadiumGreen text-stadiumGreen shadow-md shadow-stadiumGreen/25' : 'bg-crimson/25 border-crimson text-crimson shadow-md shadow-crimson/20')}>
                {outcome?.won ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                <span>{outcome?.won ? t('FT • WON') : t('FT • LOST')}</span>
              </span>
            )}

            {/* UPCOMING Badge */}
            {isUpcoming && (
              <span className="flex-shrink-0 flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-gold/20 border border-gold/50 text-gold text-[10px] font-black shadow-md shadow-gold/20">
                <Calendar className="w-3 h-3" />
                <span>{dateLabel}</span>
              </span>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-1.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
            <button onClick={handleAlert}
              className={'p-2 rounded-xl border transition-all ' + (isFollowed ? 'bg-stadiumGreen/20 border-stadiumGreen text-stadiumGreen' : 'bg-black/40 border-white/10 text-gray-400 hover:text-stadiumGreen')}
              title={isFollowed ? 'Remove alert' : 'Set kickoff alert'}>
              {isFollowed ? <BellRing className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
            </button>
            <button onClick={handleBookmark}
              className={'p-2 rounded-xl border transition-all ' + (bookmarked ? 'bg-gold/20 border-gold text-gold' : 'bg-black/40 border-white/10 text-gray-400 hover:text-gold')}
              title={bookmarked ? 'Saved' : 'Save'}>
              <Star className={'w-3.5 h-3.5 ' + (bookmarked ? 'fill-current' : '')} />
            </button>
          </div>
        </div>

        {/* Row 2: Teams (Clickable) + Live/Upcoming Time (Clickable) */}
        <div className="grid grid-cols-7 items-center gap-2 py-1">
          
          {/* Home Team (Clickable) */}
          <button 
            onClick={(e) => handleTeamClick(e, match.homeTeam)}
            className="col-span-3 flex items-center space-x-2 text-left group/team hover:opacity-80 transition-all p-1.5 rounded-2xl hover:bg-white/5"
            title={`Click to view ${match.homeTeam} club profile & stats`}
          >
            <div className="w-8 h-8 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center p-1 flex-shrink-0 group-hover/team:border-stadiumGreen group-hover/team:scale-105 transition-all">
              {match.homeLogo ? (
                <img src={match.homeLogo} alt={match.homeTeam} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              ) : (
                <Shield className="w-4 h-4 text-gray-400" />
              )}
            </div>
            <div className="min-w-0">
              <span className="font-black text-sm text-white group-hover/team:text-stadiumGreen transition-colors truncate block">
                {match.homeTeam}
              </span>
              <span className="text-[9px] text-gray-400 font-bold block">{t('Home')}</span>
            </div>
          </button>

          {/* Center: Match Time / Score (Clickable) */}
          <button
            onClick={handleTimeClick}
            className="col-span-1 text-center flex flex-col items-center justify-center group/time p-1 rounded-xl hover:bg-white/10 transition-all"
            title="Click to view live minute stats & timeline"
          >
            {isLive ? (
              <div>
                <span className="font-mono font-black text-base text-crimson animate-pulse block">
                  {match.homeScore ?? 0} - {match.awayScore ?? 0}
                </span>
                <span className="text-[10px] font-mono text-stadiumGreen font-black group-hover/time:underline">
                  {match.matchTime || "64'"}
                </span>
              </div>
            ) : isFinished ? (
              <div>
                <span className="font-mono font-black text-sm text-white block">
                  {match.homeScore ?? 0} - {match.awayScore ?? 0}
                </span>
                <span className="text-[9px] font-mono text-gray-400 font-bold">FT</span>
              </div>
            ) : (
              <div>
                <span className="font-mono font-black text-xs sm:text-sm text-gold block group-hover/time:text-stadiumGreen">
                  {match.matchTime || '19:00'}
                </span>
                <span className="text-[8px] text-gray-400 font-bold truncate block max-w-[60px]">
                  {liveCountdown || 'Soon'}
                </span>
              </div>
            )}
          </button>

          {/* Away Team (Clickable) */}
          <button 
            onClick={(e) => handleTeamClick(e, match.awayTeam)}
            className="col-span-3 flex items-center justify-end space-x-2 text-right group/team hover:opacity-80 transition-all p-1.5 rounded-2xl hover:bg-white/5"
            title={`Click to view ${match.awayTeam} club profile & stats`}
          >
            <div className="min-w-0">
              <span className="font-black text-sm text-white group-hover/team:text-stadiumGreen transition-colors truncate block">
                {match.awayTeam}
              </span>
              <span className="text-[9px] text-gray-400 font-bold block">{t('Away')}</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center p-1 flex-shrink-0 group-hover/team:border-stadiumGreen group-hover/team:scale-105 transition-all">
              {match.awayLogo ? (
                <img src={match.awayLogo} alt={match.awayTeam} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              ) : (
                <Shield className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </button>

        </div>

        {/* Row 3: Win Probability Distribution Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-bold text-gray-400 font-mono">
            <span className="text-stadiumGreen">{homeW}% {t('Home')}</span>
            <span className="text-gray-300">{drawW}% {t('Draw')}</span>
            <span className="text-crimson">{awayW}% {t('Away')}</span>
          </div>
          <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden flex">
            <div style={{ width: `${homeW}%` }} className="bg-stadiumGreen h-full transition-all duration-500" />
            <div style={{ width: `${drawW}%` }} className="bg-gray-500 h-full transition-all duration-500" />
            <div style={{ width: `${awayW}%` }} className="bg-crimson h-full transition-all duration-500" />
          </div>
        </div>

        {/* Row 4: Top Model Pick Banner + Add Slip CTA */}
        <div className="p-3 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${confidenceColor}`}>
                {t(p.topPick.confidenceTier)}
              </span>
              <span className="text-xs font-black text-white truncate">
                {t(p.topPick.selection)}
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-sans block mt-0.5 truncate">
              {p.topPick.probability}% win confidence @ {p.topPick.odds.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddPick}
            className="px-3 py-1.5 rounded-xl bg-stadiumGreen hover:bg-emerald-400 text-black font-black text-xs flex items-center space-x-1 shadow-md active:scale-95 transition-all flex-shrink-0"
          >
            <span>+</span>
            <span>{t('Add Pick')}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
