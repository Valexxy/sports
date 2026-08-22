import { LockScreenMatchTracker } from '../lib/lockscreen-live-score-tracker';
'use client';

import React, { useState, useEffect } from 'react';
import { PersistentStorage } from '../lib/persistent-storage-engine';
import { getClubCrest } from '../lib/club-crest-engine';
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
        setTimeLeft('Starts in ' + days + 'd ' + hours + 'h');
      } else if (hours > 0) {
        setTimeLeft('Starts in ' + hours + 'h ' + mins + 'm');
      } else {
        setTimeLeft('Starts in ' + mins + 'm ⚡');
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


function translatePick(selection: string, tFunc: (k: string) => string): string {
  if (!selection) return '';
  if (selection.includes('Over 1.5')) return tFunc('Over 1.5 Goals');
  if (selection.includes('Over 2.5')) return tFunc('Over 2.5 Goals');
  if (selection.includes('Under 2.5')) return tFunc('Under 2.5 Goals');
  if (selection.includes('Both Teams') || selection.includes('BTTS') || selection.includes('GG')) return tFunc('Both Teams to Score (GG)');
  if (selection.includes('or Draw')) {
    const parts = selection.split(' or Draw');
    return parts[0] + ' ' + tFunc('or Draw (1X)');
  }
  return tFunc(selection);
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
  const basePins = Math.round((match.prediction?.topPick?.probability || 75) * 14.2 + (parseInt(match.id.replace(/[^0-9]/g, '') || '42', 10) % 320));
  const [pinCount, setPinCount] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const isPinned = PersistentStorage.getBookmarks().includes(match.id);
      return isPinned ? basePins + 1 : basePins;
    }
    return basePins;
  });
  const [justPinnedEffect, setJustPinnedEffect] = useState(false);

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
    ? 'border-crimson/70 bg-gradient-to-br from-crimson/15 via-panel/95 to-panel shadow-xl shadow-crimson/20 ring-1 ring-crimson/30'
    : isFinished
    ? (outcome?.won
      ? 'border-stadiumGreen/60 bg-gradient-to-br from-stadiumGreen/10 via-panel/95 to-panel shadow-lg shadow-stadiumGreen/15 ring-1 ring-stadiumGreen/20'
      : 'border-crimson/50 bg-gradient-to-br from-crimson/10 via-panel/95 to-panel shadow-md shadow-crimson/10 ring-1 ring-crimson/20')
    : 'border-gold/40 bg-gradient-to-br from-gold/10 via-panel/95 to-panel shadow-lg shadow-gold/10 ring-1 ring-gold/20 hover:border-gold/60';

  const handleBookmark = (e: React.MouseEvent) => {
    stadiumAudio.playBookmarkSound();
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

  return (
    <div
      className={'relative rounded-3xl border transition-all duration-200 overflow-hidden cursor-pointer group active:scale-[0.99] ' + cardAuraClass}
      onClick={() => onOpenInsights(match)}
    >
      {isLive && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-crimson via-gold to-crimson animate-pulse" />}
      {isUpcoming && <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold/50 via-gold to-gold/50" />}
      {isFinished && outcome?.won && <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-stadiumGreen/50 via-stadiumGreen to-stadiumGreen/50" />}

      <div className="p-3.5 sm:p-4 space-y-2.5">

        {/* Row 1: League Header + Status Badge + Action Buttons */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center space-x-1.5 min-w-0">
            {/* Clickable League */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenStandings) onOpenStandings(match.league);
              }}
              className="flex items-center space-x-1.5 min-w-0 hover:opacity-85 transition-all text-left"
              title="Click to view League Table & Standings"
            >
              {leagueInfo.logo ? (
                <img src={leagueInfo.logo} alt={match.league} className="w-4 h-4 object-contain flex-shrink-0" onError={(e) => { (e.target as HTMLImageElement).src = getClubCrest(match.homeTeam); }} />
              ) : (
                <span className="text-sm flex-shrink-0">{leagueInfo.flag}</span>
              )}
              <span className="text-xs font-black text-white hover:text-stadiumGreen transition-colors truncate">
                {leagueInfo.name}
              </span>
            </button>

            {/* Status Badge */}
            {isLive ? (
              <span className="flex-shrink-0 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-crimson/30 border border-crimson/70 text-crimson text-[9px] font-black animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-crimson animate-ping" />
                <span>{t("Live")}</span>
              </span>
            ) : isFinished ? (
              <span className={'flex-shrink-0 flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-black border ' + (outcome?.won ? 'bg-stadiumGreen/25 border-stadiumGreen text-stadiumGreen' : 'bg-crimson/25 border-crimson text-crimson')}>
                {outcome?.won ? <CheckCircle2 className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />}
                <span>{outcome?.won ? t('WON') : t('LOST')}</span>
              </span>
            ) : (
              <span className="flex-shrink-0 px-2 py-0.5 rounded-full bg-gold/20 border border-gold/40 text-gold text-[9px] font-black">
                {dateLabel}
              </span>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
            <button 
              onClick={handleAlert}
              className={'p-1.5 rounded-xl border transition-all ' + (isFollowed ? 'bg-stadiumGreen/20 border-stadiumGreen text-stadiumGreen shadow-md shadow-stadiumGreen/20' : 'bg-black/40 border-white/10 text-gray-400 hover:text-stadiumGreen')}
              title={isFollowed ? "🔔 Match Alerts Active (Tap to unfollow)" : "🔔 Follow for Live In-Play Goal Alerts & Kickoff"}
            >
              {isFollowed ? <BellRing className="w-3.5 h-3.5 text-stadiumGreen" /> : <Bell className="w-3.5 h-3.5" />}
            </button>
            <button 
              onClick={handleBookmark}
              className={'relative px-2 py-1 rounded-xl border transition-all flex items-center space-x-1 ' + (bookmarked ? 'bg-gold/25 border-gold text-gold shadow-md shadow-gold/30 scale-105 ring-1 ring-gold/40' : 'bg-black/40 border-white/10 text-gray-400 hover:text-gold hover:border-gold/30')}
              title={bookmarked ? "⭐ Pinned to Smart Phone Lock Screen Widget (Tap to unpin)" : "⭐ Pin to Smart Phone Lock Screen Widget"}
            >
              <Star className={'w-3.5 h-3.5 ' + (bookmarked ? 'fill-current text-gold animate-pulse' : '')} />
              <span className="text-[10px] font-mono font-black">
                {pinCount >= 1000 ? (pinCount / 1000).toFixed(1) + 'k' : pinCount}
              </span>
              
              {/* Floating +1 Animation Badge */}
              {justPinnedEffect && (
                <span className="absolute -top-3.5 -right-1 px-1.5 py-0.2 rounded-full bg-gradient-to-r from-gold to-amber-400 text-black font-black text-[9px] animate-bounce shadow-lg pointer-events-none">
                  +1
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Row 2: Pristine Compact Teams & Score Display */}
        <div className="flex items-center justify-between gap-2 py-1">
          
          {/* Home Team */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenTeam) onOpenTeam(match.homeTeam);
            }}
            className="flex-1 flex items-center space-x-2 min-w-0 text-left hover:opacity-80 transition-opacity"
            title={'View ' + match.homeTeam + ' club'}
          >
            <div className="w-7 h-7 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center p-1 flex-shrink-0">
              {match.homeLogo ? (
                <img src={match.homeLogo || getClubCrest(match.homeTeam)} alt={match.homeTeam} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).src = getClubCrest(match.awayTeam); }} />
              ) : (
                <Shield className="w-3.5 h-3.5 text-gray-400" />
              )}
            </div>
            <div className="min-w-0">
              <span className="font-black text-xs sm:text-sm text-white truncate block hover:text-stadiumGreen transition-colors">
                {match.homeTeam}
              </span>
              <span className="text-[9px] text-gray-400 font-bold block">{t('Home')}</span>
            </div>
          </button>

          {/* Center: Live Score / Time */}
          <div className="flex flex-col items-center justify-center px-1.5 flex-shrink-0 min-w-[76px] text-center">
            {isLive ? (
              <>
                <div className="font-mono font-black text-sm sm:text-base text-crimson animate-pulse whitespace-nowrap flex items-center space-x-1">
                  <span>{match.homeScore ?? 0}</span>
                  <span className="text-gray-500">-</span>
                  <span>{match.awayScore ?? 0}</span>
                </div>
                <span className="text-[9px] font-mono text-stadiumGreen font-black mt-0.5 whitespace-nowrap">
                  {match.matchTime || "64'"}
                </span>
              </>
            ) : isFinished ? (
              <>
                <div className="font-mono font-black text-xs sm:text-sm text-white whitespace-nowrap flex items-center space-x-1">
                  <span>{match.homeScore ?? 0}</span>
                  <span className="text-gray-500">-</span>
                  <span>{match.awayScore ?? 0}</span>
                </div>
                <span className="text-[8px] font-mono text-gray-400 font-bold mt-0.5">FT</span>
              </>
            ) : (
              <>
                <span className="font-mono font-black text-xs text-gold whitespace-nowrap">
                  {match.matchTime || '19:00'}
                </span>
                <span className="text-[8px] text-gray-400 font-bold truncate mt-0.5">
                  {liveCountdown || 'Soon'}
                </span>
              </>
            )}
          </div>

          {/* Away Team */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenTeam) onOpenTeam(match.awayTeam);
            }}
            className="flex-1 flex items-center justify-end space-x-2 min-w-0 text-right hover:opacity-80 transition-opacity"
            title={'View ' + match.awayTeam + ' club'}
          >
            <div className="min-w-0">
              <span className="font-black text-xs sm:text-sm text-white truncate block hover:text-stadiumGreen transition-colors">
                {match.awayTeam}
              </span>
              <span className="text-[9px] text-gray-400 font-bold block">{t('Away')}</span>
            </div>
            <div className="w-7 h-7 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center p-1 flex-shrink-0">
              {match.awayLogo ? (
                <img src={match.awayLogo || getClubCrest(match.awayTeam)} alt={match.awayTeam} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              ) : (
                <Shield className="w-3.5 h-3.5 text-gray-400" />
              )}
            </div>
          </button>
        </div>

        {/* Row 3: 1X2 Probabilities Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[9px] font-bold text-gray-400">
            <span className="text-stadiumGreen">{homeW}% {t('Home')}</span>
            <span>{drawW}% {t('Draw')}</span>
            <span className="text-crimson">{awayW}% {t('Away')}</span>
          </div>
          <div className="h-1.5 w-full bg-black/70 rounded-full overflow-hidden flex">
            <div style={{ width: homeW + '%' }} className="bg-stadiumGreen h-full" />
            <div style={{ width: drawW + '%' }} className="bg-gray-600 h-full" />
            <div style={{ width: awayW + '%' }} className="bg-crimson h-full" />
          </div>
        </div>

        {/* Row 4: Top Prediction & Add Pick Button */}
        <div className="flex items-center justify-between pt-1 border-t border-white/10 gap-2">
          <div className="min-w-0">
            <div className="flex items-center space-x-1">
              <span className="px-1.5 py-0.2 rounded bg-stadiumGreen/20 text-stadiumGreen font-black text-[8px]">
                {t(p.topPick.confidenceTier)} 🔥
              </span>
              <span className="text-xs font-black text-white truncate">
                {translatePick(p.topPick.selection, t)}
              </span>
            </div>
            <span className="text-[9px] text-gray-400 font-sans block mt-0.5">
              {p.topPick.probability}% {t('win confidence')} @ {p.topPick.odds.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddPick}
            className="px-3 py-1.5 rounded-xl bg-stadiumGreen text-black font-black text-[11px] hover:bg-emerald-400 transition-all flex items-center space-x-1 shadow-md flex-shrink-0 active:scale-95"
          >
            <span>{t('+ Bet Tips')}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
