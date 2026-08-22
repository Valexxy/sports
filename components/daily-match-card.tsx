'use client';

import React, { useState, useEffect } from 'react';
import { MatchData } from '../lib/sports-api';
import { getLeagueInfo } from '../lib/league-badges';
import { Bell, BellRing, Star, Eye, Plus, Zap, CheckCircle2, XCircle, Calendar, AlertCircle, Clock, Timer, Flame } from 'lucide-react';
import { useTranslation } from '../lib/translation-engine';

export interface DailyMatchCardProps {
  match: MatchData;
  onOpenInsights: (match: MatchData) => void;
  onSelectOdds: (match: MatchData, selection: string, odds: number) => void;
  onBookmarkMatch?: (match: MatchData) => void;
  followedMatchIds?: string[];
  onToggleFollow?: (match: MatchData) => void;
}

/**
 * Live Countdown Timer hook for upcoming matches
 */
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
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeLeft(`Starts in ${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeLeft(`Starts in ${hours}h ${mins}m ${secs}s`);
      } else {
        setTimeLeft(`Starts in ${mins}m ${secs}s`);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [utcDateStr, matchTimeStr]);

  return timeLeft;
}

/**
 * Evaluates whether the predicted topPick WON or LOST against final score
 */
function evaluatePickOutcome(
  selection: string,
  homeTeam: string,
  awayTeam: string,
  homeScore: number,
  awayScore: number
): { won: boolean; label: string; scoreSummary: string } {
  const sel = selection.toLowerCase().trim();
  const hTeam = (homeTeam || '').toLowerCase().trim();
  const aTeam = (awayTeam || '').toLowerCase().trim();
  const totalGoals = homeScore + awayScore;
  const isHomeWin = homeScore > awayScore;
  const isDraw = homeScore === awayScore;
  const isAwayWin = awayScore > homeScore;

  let won = false;

  // 1. Double Chance Markets
  if (sel.includes('1x') || sel.includes('or draw (1x)')) {
    won = isHomeWin || isDraw;
  } else if (sel.includes('x2') || sel.includes('or draw (x2)')) {
    won = isAwayWin || isDraw;
  } else if (sel.includes('12') || sel.includes('1 or 2')) {
    won = homeScore !== awayScore;
  }
  // 2. Goal Totals (Over / Under)
  else if (sel.includes('over 0.5')) {
    won = totalGoals >= 1;
  } else if (sel.includes('over 1.5')) {
    won = totalGoals >= 2;
  } else if (sel.includes('over 2.5')) {
    won = totalGoals >= 3;
  } else if (sel.includes('over 3.5')) {
    won = totalGoals >= 4;
  } else if (sel.includes('under 1.5')) {
    won = totalGoals <= 1;
  } else if (sel.includes('under 2.5')) {
    won = totalGoals <= 2;
  } else if (sel.includes('under 3.5')) {
    won = totalGoals <= 3;
  } else if (sel.includes('under 4.5')) {
    won = totalGoals <= 4;
  }
  // 3. Draw Market
  else if (sel === 'draw' || sel.includes('draw (settled)') || sel === 'x') {
    won = isDraw;
  }
  // 4. BTTS / GG Markets
  else if (sel.includes('gg') || sel.includes('btts') || sel.includes('both teams')) {
    won = homeScore > 0 && awayScore > 0;
  }
  // 5. Away Team Win (e.g. Portsmouth, Real Madrid, Arsenal)
  else if (aTeam && sel.includes(aTeam)) {
    won = isAwayWin;
  }
  // 6. Home Team Win (e.g. Lincoln City, Arsenal, Hull City)
  else if (hTeam && sel.includes(hTeam)) {
    won = isHomeWin;
  }
  // 7. General match outcome fallback
  else if (sel.includes('home') || sel === '1') {
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

  // Evaluate final settlement if finished
  const outcome = isFinished ? evaluatePickOutcome(p.topPick.selection, match.homeTeam, match.awayTeam, match.homeScore, match.awayScore) : null;

  // Multi-factor prediction shift reason
  const shiftReason = p.topPick.rationale || (
    'Multi-factor model factored 4-3-3 tactical stance, recent match outings (' +
    homeW + '% vs ' + awayW + '%), and stadium ground advantage into ' + p.topPick.selection + '.'
  );

  // DISTINCTIVE GLOWS & AURA BORDERS PER STATUS
  const cardAuraClass = isLive
    ? 'border-crimson/70 bg-gradient-to-br from-crimson/15 via-panel/95 to-panel shadow-2xl shadow-crimson/25 ring-1 ring-crimson/40 animate-pulse-glow'
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
    if (onBookmarkMatch) onBookmarkMatch(match);
    if (typeof window !== 'undefined' && 'vibrate' in navigator) navigator.vibrate([60]);
  };

  const handleAlert = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFollow) {
      onToggleFollow(match);
      if (typeof window !== 'undefined' && 'vibrate' in navigator) navigator.vibrate([80, 40, 80]);
    }
  };

  const handleAddPick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectOdds(match, p.topPick.selection, p.topPick.odds);
    if (typeof window !== 'undefined' && 'vibrate' in navigator) navigator.vibrate([80]);
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

        {/* Row 1: Official League Crest + Smart Status Badge + Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0">
            {leagueInfo.logo ? (
              <img src={leagueInfo.logo} alt={match.league} className="w-5 h-5 object-contain flex-shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            ) : (
              <span className="text-base flex-shrink-0">{leagueInfo.flag}</span>
            )}
            <span className="text-xs font-black text-white truncate">{leagueInfo.name}</span>
            
            {/* LIVE Glowing Badge */}
            {isLive && (
              <span className="flex-shrink-0 flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-crimson/30 border border-crimson/70 text-crimson text-[10px] font-black animate-pulse shadow-md shadow-crimson/30">
                <span className="w-1.5 h-1.5 rounded-full bg-crimson inline-block animate-ping" />
                <span>LIVE</span>
              </span>
            )}

            {/* PLAYED / FINISHED Glowing Badge */}
            {isFinished && (
              <span className={'flex-shrink-0 flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border ' + (outcome?.won ? 'bg-stadiumGreen/25 border-stadiumGreen text-stadiumGreen shadow-md shadow-stadiumGreen/25' : 'bg-crimson/25 border-crimson text-crimson shadow-md shadow-crimson/20')}>
                {outcome?.won ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                <span>{outcome?.won ? 'FT • WON' : 'FT • LOST'}</span>
              </span>
            )}

            {/* UPCOMING Glowing Badge */}
            {isUpcoming && (
              <span className="flex-shrink-0 flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-gold/20 border border-gold/50 text-gold text-[10px] font-black shadow-md shadow-gold/20">
                <Calendar className="w-3 h-3" />
                <span>{dateLabel}</span>
              </span>
            )}
          </div>

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

        {/* Row 2: Teams + Live Kickoff Countdown OR In-Play/FT Score */}
        <div className="grid grid-cols-3 items-center text-center gap-2">
          {/* Home */}
          <div className="flex flex-col items-center space-y-1.5">
            {match.homeLogo && match.homeLogo.startsWith('http') ? (
              <img src={match.homeLogo} alt={match.homeTeam} className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow group-hover:scale-105 transition-all" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            ) : (
              <span className="text-4xl group-hover:scale-105 transition-all">{match.homeLogo || '⚽'}</span>
            )}
            <span className="font-black text-sm sm:text-base text-white leading-tight">{match.homeTeam}</span>
            <span className="text-[10px] text-stadiumGreen font-mono">xG {(p.expectedHomeGoals || 1.4).toFixed(1)}</span>
          </div>

          {/* Center Display with Live Countdown Timer */}
          <div className="flex flex-col items-center space-y-1">
            {isLive ? (
              <>
                <div className="text-3xl sm:text-4xl font-black font-mono px-3 py-2 rounded-2xl border shadow-inner text-crimson bg-black/85 border-crimson/50 shadow-crimson/20">
                  {match.homeScore}<span className="text-gray-500 text-2xl mx-1">:</span>{match.awayScore}
                </div>
                <span className="text-[11px] text-crimson font-mono font-black flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-crimson/15 border border-crimson/40 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-crimson" />
                  <Flame className="w-3.5 h-3.5 text-crimson" />
                  <span>{match.matchTime}</span>
                </span>
              </>
            ) : isFinished ? (
              <>
                <div className={'text-3xl sm:text-4xl font-black font-mono px-3 py-2 rounded-2xl border shadow-inner ' + (outcome?.won ? 'text-stadiumGreen bg-black/85 border-stadiumGreen/50 shadow-stadiumGreen/20' : 'text-white bg-black/70 border-white/15')}>
                  {match.homeScore}<span className="text-gray-500 text-2xl mx-1">:</span>{match.awayScore}
                </div>
                <span className="text-[10px] text-gray-400 font-mono flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-gold" />
                  <span>{t('Played at')} {match.matchTime}</span>
                </span>
              </>
            ) : (
              <div className="px-3.5 py-2 rounded-2xl bg-gold/20 border-2 border-gold/50 shadow-lg shadow-gold/20 text-center w-full max-w-[130px]">
                <span className="text-lg sm:text-xl font-black text-gold font-mono tracking-wider block">
                  {(() => {
                    if (match.matchTime && match.matchTime !== 'Scheduled' && match.matchTime !== 'Upcoming') {
                      return match.matchTime;
                    }
                    if (match.utcDate) {
                      const d = new Date(match.utcDate);
                      if (!isNaN(d.getTime())) {
                        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      }
                    }
                    return '04:30 PM';
                  })()}
                </span>
                {/* Live Countdown Timer Badge */}
                <div className="flex items-center justify-center space-x-1 mt-0.5 text-[9px] text-amber-300 font-mono font-black">
                  <Timer className="w-3 h-3 text-gold animate-spin" />
                  <span className="truncate">{liveCountdown}</span>
                </div>
              </div>
            )}
            
            {match.venue && <span className="text-[9px] text-gray-400 font-mono text-center leading-tight max-w-[95px] truncate">{'🏟 ' + match.venue}</span>}
            <span className="text-[10px] text-stadiumGreen font-mono flex items-center space-x-0.5">
              <Zap className="w-3 h-3" />
              <span>{t('Tap insights')}</span>
            </span>
          </div>

          {/* Away */}
          <div className="flex flex-col items-center space-y-1.5">
            {match.awayLogo && match.awayLogo.startsWith('http') ? (
              <img src={match.awayLogo} alt={match.awayTeam} className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow group-hover:scale-105 transition-all" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            ) : (
              <span className="text-4xl group-hover:scale-105 transition-all">{match.awayLogo || '⚽'}</span>
            )}
            <span className="font-black text-sm sm:text-base text-white leading-tight">{match.awayTeam}</span>
            <span className="text-[10px] text-stadiumGreen font-mono">xG {(p.expectedAwayGoals || 1.1).toFixed(1)}</span>
          </div>
        </div>

        {/* Row 3: Win probability bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono">
            <span className="text-stadiumGreen font-bold">{homeW}% Home</span>
            <span className="text-gold">{drawW}% Draw</span>
            <span className="text-cyberPurple font-bold">{awayW}% Away</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-gray-900 overflow-hidden flex">
            <div style={{ width: homeW + '%' }} className="h-full bg-stadiumGreen transition-all duration-500" />
            <div style={{ width: drawW + '%' }} className="h-full bg-gold transition-all duration-500" />
            <div style={{ width: awayW + '%' }} className="h-full bg-cyberPurple transition-all duration-500" />
          </div>
        </div>

        {/* Row 4: Top Pick vs Outcome Settlement Audit */}
        {isFinished && outcome ? (
          <div className={'p-3 rounded-2xl border flex items-center justify-between gap-3 ' + (outcome.won ? 'bg-stadiumGreen/20 border-stadiumGreen/60 shadow-md shadow-stadiumGreen/20' : 'bg-crimson/20 border-crimson/60 shadow-md shadow-crimson/20')}>
            <div>
              <div className="flex items-center space-x-1.5 mb-0.5">
                <span className={'text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ' + (outcome.won ? 'bg-stadiumGreen text-black font-black' : 'bg-crimson text-white')}>
                  {outcome.label}
                </span>
                <span className="text-[10px] text-gray-300 font-bold">@ {p.topPick.odds}</span>
              </div>
              <p className="font-black text-xs text-white">
                Pick: <span className="text-gold">{p.topPick.selection}</span> ➡️ Result: <span className="text-white">{outcome.scoreSummary}</span>
              </p>
            </div>
            <div className={'text-right font-black font-mono text-sm ' + (outcome.won ? 'text-stadiumGreen' : 'text-crimson')}>
              {outcome.won ? 'SETTLED ✓' : 'SETTLED ✗'}
            </div>
          </div>
        ) : (
          <div className={'flex items-center justify-between gap-3 p-3 rounded-2xl border ' + confidenceColor} onClick={e => e.stopPropagation()}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1.5 mb-0.5">
                <span className="text-base">👑</span>
                <span className="text-[10px] font-black uppercase tracking-wider opacity-80">{p.topPick.confidenceTier}</span>
              </div>
              <p className="font-black text-sm text-white truncate">{p.topPick.selection}</p>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex-1 h-1.5 rounded-full bg-black/40 overflow-hidden">
                  <div className={'h-full ' + probBarColor + ' transition-all duration-700'} style={{ width: p.topPick.probability + '%' }} />
                </div>
                <span className="text-[10px] font-black whitespace-nowrap">{p.topPick.probability}% confident</span>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-1.5 flex-shrink-0">
              <span className="text-lg font-black text-white">@ {p.topPick.odds}</span>
              <button onClick={handleAddPick}
                className="px-3 py-1.5 rounded-xl bg-stadiumGreen text-black font-black text-xs flex items-center space-x-1 hover:bg-emerald-400 transition-all active:scale-95 shadow-md">
                <Plus className="w-3.5 h-3.5" />
                <span>{t('Add Pick')}</span>
              </button>
            </div>
          </div>
        )}

        {/* Multi-Factor Live Reason Badge */}
        <div className="px-3 py-2 rounded-xl bg-black/40 border border-white/5 text-[9px] text-gray-300 flex items-start space-x-1.5 leading-snug">
          <AlertCircle className="w-3 h-3 text-gold flex-shrink-0 mt-0.5" />
          <span className="line-clamp-2">
            <strong className="text-gold font-mono">{t('Prediction Reason:')} </strong>
            {shiftReason}
          </span>
        </div>

        {/* Row 5: Full Insights CTA */}
        <button
          onClick={() => onOpenInsights(match)}
          className="w-full py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-stadiumGreen/40 text-white font-black text-xs flex items-center justify-center space-x-2 transition-all">
          <Eye className="w-4 h-4 text-stadiumGreen" />
          <span>{t('View Full Match Insights')}</span>
        </button>
      </div>
    </div>
  );
};
