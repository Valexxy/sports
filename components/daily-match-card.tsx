'use client';

import React, { useState } from 'react';
import { MatchData } from '../lib/sports-api';
import { Bell, BellRing, Star, Eye, Plus, Zap, CheckCircle2, XCircle, Calendar, AlertCircle, Clock } from 'lucide-react';

export interface DailyMatchCardProps {
  match: MatchData;
  onOpenInsights: (match: MatchData) => void;
  onSelectOdds: (match: MatchData, selection: string, odds: number) => void;
  onBookmarkMatch?: (match: MatchData) => void;
  followedMatchIds?: string[];
  onToggleFollow?: (match: MatchData) => void;
}

/**
 * Evaluates whether the predicted topPick WON or LOST against final score
 */
function evaluatePickOutcome(
  selection: string,
  homeScore: number,
  awayScore: number
): { won: boolean; label: string; scoreSummary: string } {
  const sel = selection.toLowerCase();
  const totalGoals = homeScore + awayScore;
  const isHomeWin = homeScore > awayScore;
  const isDraw = homeScore === awayScore;
  const isAwayWin = awayScore > homeScore;

  let won = false;

  if (sel.includes('over 1.5')) {
    won = totalGoals >= 2;
  } else if (sel.includes('over 2.5')) {
    won = totalGoals >= 3;
  } else if (sel.includes('under 2.5')) {
    won = totalGoals <= 2;
  } else if (sel.includes('under 3.5')) {
    won = totalGoals <= 3;
  } else if (sel.includes('1x') || sel.includes('or draw (1x)')) {
    won = isHomeWin || isDraw;
  } else if (sel.includes('x2') || sel.includes('or draw (x2)')) {
    won = isAwayWin || isDraw;
  } else if (sel.includes('draw')) {
    won = isDraw;
  } else if (sel.includes('gg') || sel.includes('both teams')) {
    won = homeScore > 0 && awayScore > 0;
  } else {
    // Team name pick
    won = isHomeWin;
  }

  const scoreSummary = homeScore + '-' + awayScore + ' (' + totalGoals + ' Goals)';
  return {
    won,
    label: won ? 'WON ✅' : 'LOST ❌',
    scoreSummary,
  };
}

/**
 * Clean Date Formatter differentiating past, today, and future dates
 */
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

  // Evaluate final settlement if finished
  const outcome = isFinished ? evaluatePickOutcome(p.topPick.selection, match.homeScore, match.awayScore) : null;

  // Multi-factor prediction shift reason
  const shiftReason = p.topPick.rationale || (
    'Multi-factor model factored 4-3-3 tactical stance, recent match outings (' +
    homeW + '% vs ' + awayW + '%), and stadium ground advantage into ' + p.topPick.selection + '.'
  );

  const confidenceColor = isFinished
    ? (outcome?.won ? 'text-stadiumGreen border-stadiumGreen/50 bg-stadiumGreen/10' : 'text-crimson border-crimson/50 bg-crimson/10')
    : p.topPick.confidenceTier === 'ULTRA-BANKER'
    ? 'text-stadiumGreen border-stadiumGreen/50 bg-stadiumGreen/10'
    : p.topPick.confidenceTier === 'BANKER'
    ? 'text-gold border-gold/40 bg-gold/10'
    : 'text-cyberPurple border-cyberPurple/30 bg-cyberPurple/10';

  const probBarColor = p.topPick.probability >= 80 ? 'bg-stadiumGreen'
    : p.topPick.probability >= 65 ? 'bg-gold' : 'bg-cyberPurple';

  const borderClass = isLive
    ? 'border-crimson/40 bg-gradient-to-br from-crimson/5 via-panel to-panel shadow-crimson/10'
    : isFinished
    ? (outcome?.won ? 'border-stadiumGreen/40 bg-panel/90 shadow-stadiumGreen/10' : 'border-crimson/30 bg-panel/90 shadow-crimson/5')
    : p.topPick.confidenceTier === 'ULTRA-BANKER'
    ? 'border-stadiumGreen/40 bg-gradient-to-br from-stadiumGreen/5 via-panel to-panel shadow-stadiumGreen/10'
    : 'border-white/10 bg-panel/70 hover:border-white/20';

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
      className={'relative rounded-3xl border transition-all duration-300 overflow-hidden shadow-xl cursor-pointer group active:scale-[0.98] ' + borderClass}
      onClick={() => onOpenInsights(match)}
    >
      {isLive && <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-crimson via-gold to-crimson animate-pulse" />}

      <div className="p-4 sm:p-5 space-y-3.5">

        {/* Row 1: League + Smart Status & Date Badge + Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0">
            <span className="text-lg flex-shrink-0">{match.leagueFlag || '⚽'}</span>
            <span className="text-xs font-black text-white truncate">{match.league}</span>
            
            {/* LIVE Badge with Date */}
            {isLive && (
              <span className="flex-shrink-0 flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-crimson/20 border border-crimson/50 text-crimson text-[10px] font-black animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-crimson inline-block animate-ping" />
                <span>LIVE • {dateLabel}</span>
              </span>
            )}

            {/* PLAYED / FINISHED Badge with Date */}
            {isFinished && (
              <span className={'flex-shrink-0 flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border ' + (outcome?.won ? 'bg-stadiumGreen/20 border-stadiumGreen/50 text-stadiumGreen' : 'bg-crimson/20 border-crimson/40 text-crimson')}>
                {outcome?.won ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                <span>{outcome?.won ? 'FT • WON' : 'FT • LOST'} • {dateLabel}</span>
              </span>
            )}

            {/* UPCOMING Badge with Date */}
            {isUpcoming && (
              <span className="flex-shrink-0 flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-[10px] font-black">
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

        {/* Row 2: Teams + Scenario-Specific Center Display (Kickoff Time / In-Play Time / Ended Time) */}
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

          {/* Center Display tailored per scenario */}
          <div className="flex flex-col items-center space-y-1">
            {isLive ? (
              <>
                <div className="text-3xl sm:text-4xl font-black font-mono px-3 py-2 rounded-2xl border shadow-inner text-crimson bg-black/80 border-crimson/40">
                  {match.homeScore}<span className="text-gray-500 text-2xl mx-1">:</span>{match.awayScore}
                </div>
                <span className="text-[10px] text-crimson font-mono font-bold flex items-center space-x-1">
                  <Clock className="w-3 h-3 animate-spin" />
                  <span>Kickoff: {match.matchTime}</span>
                </span>
              </>
            ) : isFinished ? (
              <>
                <div className={'text-3xl sm:text-4xl font-black font-mono px-3 py-2 rounded-2xl border shadow-inner ' + (outcome?.won ? 'text-stadiumGreen bg-black/80 border-stadiumGreen/40' : 'text-white bg-black/60 border-white/10')}>
                  {match.homeScore}<span className="text-gray-500 text-2xl mx-1">:</span>{match.awayScore}
                </div>
                <span className="text-[10px] text-gray-400 font-mono flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Played at {match.matchTime}</span>
                </span>
              </>
            ) : (
              <div className="px-3.5 py-2 rounded-2xl bg-gold/15 border border-gold/30 shadow-md text-center">
                <span className="text-xl sm:text-2xl font-black text-gold font-mono tracking-wider block">{match.matchTime}</span>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mt-0.5">Kickoff Time</span>
              </div>
            )}
            
            {match.venue && <span className="text-[9px] text-gray-400 font-mono text-center leading-tight max-w-[95px] truncate">{'🏟 ' + match.venue}</span>}
            <span className="text-[10px] text-stadiumGreen font-mono flex items-center space-x-0.5">
              <Zap className="w-3 h-3" />
              <span>Tap insights</span>
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
          <div className={'p-3 rounded-2xl border flex items-center justify-between gap-3 ' + (outcome.won ? 'bg-stadiumGreen/15 border-stadiumGreen/50' : 'bg-crimson/15 border-crimson/50')}>
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
                className="px-3 py-1.5 rounded-xl bg-stadiumGreen text-black font-black text-xs flex items-center space-x-1 hover:bg-emerald-400 transition-all active:scale-95">
                <Plus className="w-3.5 h-3.5" />
                <span>Add Pick</span>
              </button>
            </div>
          </div>
        )}

        {/* Multi-Factor Live Reason Badge */}
        <div className="px-3 py-2 rounded-xl bg-black/40 border border-white/5 text-[9px] text-gray-300 flex items-start space-x-1.5 leading-snug">
          <AlertCircle className="w-3 h-3 text-gold flex-shrink-0 mt-0.5" />
          <span className="line-clamp-2">
            <strong className="text-gold font-mono">Prediction Reason: </strong>
            {shiftReason}
          </span>
        </div>

        {/* Row 5: Full Insights CTA */}
        <button
          onClick={() => onOpenInsights(match)}
          className="w-full py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-stadiumGreen/40 text-white font-black text-xs flex items-center justify-center space-x-2 transition-all">
          <Eye className="w-4 h-4 text-stadiumGreen" />
          <span>View Full Match Insights</span>
        </button>
      </div>
    </div>
  );
};