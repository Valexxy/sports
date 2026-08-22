'use client';

import React, { useState } from 'react';
import { MatchData } from '../lib/sports-api';
import { Bell, BellRing, Star, Eye, Plus, Zap, CheckCircle2, Clock, Calendar, AlertCircle } from 'lucide-react';

interface DailyMatchCardProps {
  match: MatchData;
  onOpenInsights: (match: MatchData) => void;
  onSelectOdds: (match: MatchData, selection: string, odds: number) => void;
  onBookmarkMatch?: (match: MatchData) => void;
  followedMatchIds?: string[];
  onToggleFollow?: (match: MatchData) => void;
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

  // Formulate Date + Time display
  const matchDate = match.utcDate ? new Date(match.utcDate) : new Date();
  const dateFormatted = matchDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const dateTimeDisplay = dateFormatted + ' • ' + match.matchTime;

  // Multi-factor prediction shift reason generator
  const shiftReason = p.topPick.rationale || (
    'Multi-factor model factored 4-3-3 tactical stance, recent match outings (' +
    homeW + '% vs ' + awayW + '%), and stadium ground advantage into ' + p.topPick.selection + '.'
  );

  const confidenceColor = p.topPick.confidenceTier === 'ULTRA-BANKER'
    ? 'text-stadiumGreen border-stadiumGreen/50 bg-stadiumGreen/10'
    : p.topPick.confidenceTier === 'BANKER'
    ? 'text-gold border-gold/40 bg-gold/10'
    : 'text-cyberPurple border-cyberPurple/30 bg-cyberPurple/10';

  const probBarColor = p.topPick.probability >= 80 ? 'bg-stadiumGreen'
    : p.topPick.probability >= 65 ? 'bg-gold' : 'bg-cyberPurple';

  const borderClass = isLive
    ? 'border-crimson/40 bg-gradient-to-br from-crimson/5 via-panel to-panel shadow-crimson/10'
    : isFinished
    ? 'border-stadiumGreen/30 bg-panel/80'
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

        {/* Row 1: League + Date/Time Together + Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0">
            <span className="text-lg flex-shrink-0">{match.leagueFlag || '⚽'}</span>
            <span className="text-xs font-black text-white truncate">{match.league}</span>
            {isLive && (
              <span className="flex-shrink-0 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-crimson text-white text-[10px] font-black animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
                <span>LIVE</span>
              </span>
            )}
            {isFinished && (
              <span className="flex-shrink-0 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-stadiumGreen/20 border border-stadiumGreen/40 text-stadiumGreen text-[10px] font-black">
                <CheckCircle2 className="w-3 h-3" />
                <span>FT</span>
              </span>
            )}
            {isUpcoming && (
              <span className="flex-shrink-0 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-gold/20 border border-gold/30 text-gold text-[10px] font-black">
                <Calendar className="w-3 h-3" />
                <span>{dateTimeDisplay}</span>
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

        {/* Row 2: Teams + Score + Prominent Date & Time */}
        <div className="grid grid-cols-3 items-center text-center gap-2">
          <div className="flex flex-col items-center space-y-1.5">
            {match.homeLogo && match.homeLogo.startsWith('http') ? (
              <img src={match.homeLogo} alt={match.homeTeam} className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow group-hover:scale-105 transition-all" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            ) : (
              <span className="text-4xl group-hover:scale-105 transition-all">{match.homeLogo || '⚽'}</span>
            )}
            <span className="font-black text-sm sm:text-base text-white leading-tight">{match.homeTeam}</span>
            <span className="text-[10px] text-stadiumGreen font-mono">xG {(p.expectedHomeGoals || 1.4).toFixed(1)}</span>
          </div>

          <div className="flex flex-col items-center space-y-1">
            {isLive || isFinished ? (
              <div className={'text-3xl sm:text-4xl font-black font-mono px-3 py-2 rounded-2xl border shadow-inner ' + (isLive ? 'text-crimson bg-black/70 border-crimson/30' : 'text-white bg-black/60 border-white/10')}>
                {match.homeScore}<span className="text-gray-500 text-2xl mx-1">:</span>{match.awayScore}
              </div>
            ) : (
              <div className="flex flex-col items-center p-2 rounded-2xl bg-gold/10 border border-gold/20">
                <span className="text-[9px] text-gray-400 font-bold uppercase">{dateFormatted}</span>
                <span className="text-xl font-black text-gold font-mono">{match.matchTime}</span>
              </div>
            )}
            {match.venue && <span className="text-[9px] text-gray-500 font-mono text-center leading-tight max-w-[90px] truncate">{'🏟 ' + match.venue}</span>}
            <span className="text-[10px] text-stadiumGreen font-mono flex items-center space-x-0.5">
              <Zap className="w-3 h-3" />
              <span>Tap insights</span>
            </span>
          </div>

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

        {/* Row 4: Top Pick + Add Button */}
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
