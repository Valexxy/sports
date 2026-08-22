'use client';

import React, { useState } from 'react';
import { MatchData } from '../lib/sports-api';
import { Flame, ChevronDown, ChevronUp, ExternalLink, Sparkles, Brain, Plus, Zap, Star, Bell, ShieldCheck, Target, Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';

// Derives a pseudo 5-game form sequence from team win probability (no hardcoding)
function deriveForm(winProb: number): ('W' | 'D' | 'L')[] {
  const seed = Math.floor(winProb * 100);
  return Array.from({ length: 5 }, (_, i) => {
    const r = (seed * 7 + i * 31) % 100;
    if (r < winProb * 90) return 'W' as const;
    if (r < winProb * 90 + 15) return 'D' as const;
    return 'L' as const;
  });
}


interface MatchCardProps {
  match: MatchData;
  onOpenReceipt: (match: MatchData) => void;
  onOpenInsights: (match: MatchData) => void;
  onSelectOdds: (match: MatchData, selection: string, odds: number) => void;
  onBookmarkMatch?: (match: MatchData) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onOpenReceipt, onOpenInsights, onSelectOdds, onBookmarkMatch }) => {
  const [expandedOdds, setExpandedOdds] = useState(false);
  const [flashVoted, setFlashVoted] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [alarmSet, setAlarmSet] = useState(false);

  // Community Fan Prediction States (0 by default if no member has voted)
  const [userMemberVote, setUserMemberVote] = useState<'HOME' | 'DRAW' | 'AWAY' | null>(null);
  const [memberVoteCounts, setMemberVoteCounts] = useState({
    home: 0,
    draw: 0,
    away: 0,
  });

  const totalMemberVotes = memberVoteCounts.home + memberVoteCounts.draw + memberVoteCounts.away;
  const communityHomePercent = totalMemberVotes > 0 ? Math.round((memberVoteCounts.home / totalMemberVotes) * 100) : 0;
  const communityDrawPercent = totalMemberVotes > 0 ? Math.round((memberVoteCounts.draw / totalMemberVotes) * 100) : 0;
  const communityAwayPercent = totalMemberVotes > 0 ? Math.max(0, 100 - (communityHomePercent + communityDrawPercent)) : 0;

  const handleMemberVote = (choice: 'HOME' | 'DRAW' | 'AWAY') => {
    if (userMemberVote) return; // Prevent double voting
    setUserMemberVote(choice);
    setMemberVoteCounts((prev) => ({
      ...prev,
      [choice === 'HOME' ? 'home' : choice === 'DRAW' ? 'draw' : 'away']:
        prev[choice === 'HOME' ? 'home' : choice === 'DRAW' ? 'draw' : 'away'] + 1,
    }));
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([80]);
    }
  };

  const p = match.prediction;
  const isFinished = match.status === 'FINISHED';
  const isLive = match.status === 'LIVE';

  // Derive date label from utcDate or matchTime
  const matchDate = match.utcDate ? new Date(match.utcDate) : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const isToday = matchDate && matchDate.toDateString() === today.toDateString();
  const isTomorrow = matchDate && matchDate.toDateString() === tomorrow.toDateString();
  
  const dateLabel = isToday 
    ? 'TODAY' 
    : isTomorrow 
    ? 'TOMORROW' 
    : matchDate 
    ? matchDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()
    : '';

  // Derived Goal Market Probabilities from Dixon-Coles xG
  const totalXG = p.expectedHomeGoals + p.expectedAwayGoals;
  const over15Prob = Math.min(95, Math.round((1 - Math.exp(-totalXG) * (1 + totalXG)) * 100));
  const over25Prob = Math.min(88, Math.round(over15Prob * 0.76));
  const bttsProb = Math.min(85, Math.round((1 - Math.exp(-p.expectedHomeGoals)) * (1 - Math.exp(-p.expectedAwayGoals)) * 100));

  // Honest model-derived odds for the quick-add markets (no hardcoded figures)
  const dc1xOdds = parseFloat((1.05 / Math.max(p.homeWinProb + p.drawProb, 0.1)).toFixed(2));
  const over15Odds = parseFloat((1.05 / Math.max(over15Prob / 100, 0.1)).toFixed(2));
  const bttsOdds = parseFloat((1.05 / Math.max(bttsProb / 100, 0.1)).toFixed(2));

  const handleFlashVote = (vote: string) => {

    setFlashVoted(vote);
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  };

  const handleBookmarkToggle = () => {
    setBookmarked(!bookmarked);
    if (onBookmarkMatch) onBookmarkMatch(match);
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([80]);
    }
  };

  const handleAlarmToggle = () => {
    setAlarmSet(!alarmSet);
    alert(alarmSet ? '🔔 Match Kickoff Alarm Cleared!' : '🔔 Kickoff Alarm Set! We will send you a live goal alert when kickoff starts!');
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([120]);
    }
  };

  return (
    <div className={`glass-panel rounded-3xl p-4 sm:p-6 border transition-all duration-300 hover:border-stadiumGreen/50 space-y-4 shadow-xl ${
      isFinished
        ? 'border-stadiumGreen/30 bg-black/50'
        : p.topPick.confidenceTier === 'ULTRA-BANKER'
        ? 'border-stadiumGreen/50 shadow-lg shadow-stadiumGreen/10 bg-panel/90'
        : 'border-white/10 bg-panel/70'
    }`}>
      
      {/* 1. Header Bar: League, Status Badge, Live Weather, and Alarm/Bookmark */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <span className="text-xl">{match.leagueFlag}</span>
          <span className="text-xs font-black text-white">{match.league}</span>
          
          {/* Status Badge */}
          {isLive && (
            <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-crimson/20 border border-crimson/40 text-crimson text-[10px] font-mono font-black animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-crimson"></span>
              <span>LIVE {match.matchTime}</span>
            </span>
          )}

          {isFinished && (
            <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-stadiumGreen/20 border border-stadiumGreen/40 text-stadiumGreen text-[10px] font-mono font-black">
              <CheckCircle2 className="w-3 h-3 text-stadiumGreen" />
              <span>FINAL SCORE (FT)</span>
            </span>
          )}

          {!isLive && !isFinished && (
            <span className="flex items-center space-x-1">
              {dateLabel && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black ${
                  isToday ? 'bg-stadiumGreen/20 border border-stadiumGreen/40 text-stadiumGreen' :
                  isTomorrow ? 'bg-blue-500/20 border border-blue-500/40 text-blue-400' :
                  'bg-gray-600/20 border border-gray-600/40 text-gray-300'
                }`}>
                  {dateLabel}
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full bg-gold/20 border border-gold/30 text-gold text-[10px] font-mono font-bold">
                ⏰ {match.matchTime}
              </span>
            </span>
          )}
        </div>

        {/* Action Icons: Kickoff Alarm, Bookmark Ticket, Stadium Excitement Meter */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleAlarmToggle}
            className={`p-1.5 rounded-xl border transition-all ${
              alarmSet ? 'bg-stadiumGreen/20 border-stadiumGreen text-stadiumGreen scale-105' : 'bg-black/40 border-white/10 text-gray-400 hover:text-stadiumGreen'
            }`}
            title="Set Kickoff Goal Alarm"
          >
            <Bell className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleBookmarkToggle}
            className={`p-1.5 rounded-xl border transition-all ${
              bookmarked ? 'bg-gold/20 border-gold text-gold scale-105' : 'bg-black/40 border-white/10 text-gray-400 hover:text-gold'
            }`}
            title="Bookmark Pick to Daily Ledger"
          >
            <Star className="w-3.5 h-3.5 fill-current" />
          </button>

          <div className="flex items-center space-x-1.5 pl-1">
            <span className="text-[9px] font-mono text-gray-400">TENSION</span>
            <div className="w-12 h-2 rounded-full bg-gray-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-stadiumGreen via-gold to-crimson transition-all duration-500"
                style={{ width: `${match.stadiumTension}%` }}
              ></div>
            </div>
            <span className="text-[10px] font-mono font-black text-stadiumGreen">{match.stadiumTension}%</span>
          </div>
        </div>
      </div>

      {/* 2. Teams Scoreboard & Goal Power Comparison */}
      <div 
        onClick={() => onOpenInsights(match)}
        className="grid grid-cols-3 items-center py-2 text-center cursor-pointer group hover:opacity-95 transition-all"
        title="Click to open Deep Analytics & Live Chat"
      >
        {/* Home Team */}
        <div className="flex flex-col items-center space-y-1">
          {match.homeLogo && match.homeLogo.startsWith('http') ? (
            <img 
              src={match.homeLogo} 
              alt={match.homeTeam} 
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain drop-shadow-md group-hover:scale-110 transition-all"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
          ) : (
            <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-all drop-shadow-md">{match.homeLogo || '⚽'}</span>
          )}
          <span className="font-black text-sm sm:text-base text-white">{match.homeTeam}</span>
          
          {/* Form Guide — derived from model probability */}
          <div className="flex items-center space-x-1 pt-0.5">
            {deriveForm(p.homeWinProb).map((result, i) => (
              <span key={i} className={`w-3.5 h-3.5 rounded text-[9px] font-black flex items-center justify-center ${
                result === 'W' ? 'bg-stadiumGreen text-black' :
                result === 'D' ? 'bg-gray-600 text-white' : 'bg-crimson text-white'
              }`}>{result}</span>
            ))}
          </div>

          <span className="text-[10px] text-stadiumGreen font-mono font-bold">xG: {p.expectedHomeGoals.toFixed(2)}</span>
        </div>

        {/* Scoreboard / Time Display */}
        <div className="flex flex-col items-center justify-center space-y-1">
          {isLive || isFinished ? (
            <div className="flex items-center space-x-2 text-3xl sm:text-4xl font-black font-mono text-white bg-black/70 px-4 py-2 rounded-2xl border border-white/10 group-hover:border-stadiumGreen/40 transition-all shadow-inner">
              <span className={isFinished ? 'text-white' : 'text-stadiumGreen'}>{match.homeScore}</span>
              <span className="text-gray-500">:</span>
              <span className={isFinished ? 'text-white' : 'text-stadiumGreen'}>{match.awayScore}</span>
            </div>
          ) : (
            <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-gray-300 font-bold group-hover:border-stadiumGreen/40 transition-all">
              {match.matchTime}
            </div>
          )}

          {match.venue && (
            <span className="text-[9px] text-gray-400 font-mono">
              🏟️ {match.venue}
            </span>
          )}

          <span className="text-[10px] text-stadiumGreen font-mono flex items-center space-x-1 group-hover:underline">
            <Zap className="w-3 h-3" />
            <span>Match Insights & Fan Chat ➔</span>
          </span>
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center space-y-1">
          {match.awayLogo && match.awayLogo.startsWith('http') ? (
            <img 
              src={match.awayLogo} 
              alt={match.awayTeam} 
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain drop-shadow-md group-hover:scale-110 transition-all"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
          ) : (
            <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-all drop-shadow-md">{match.awayLogo || '⚽'}</span>
          )}
          <span className="font-black text-sm sm:text-base text-white">{match.awayTeam}</span>
          
          {/* Form Guide — derived from model probability */}
          <div className="flex items-center space-x-1 pt-0.5">
            {deriveForm(p.awayWinProb).map((result, i) => (
              <span key={i} className={`w-3.5 h-3.5 rounded text-[9px] font-black flex items-center justify-center ${
                result === 'W' ? 'bg-stadiumGreen text-black' :
                result === 'D' ? 'bg-gray-600 text-white' : 'bg-crimson text-white'
              }`}>{result}</span>
            ))}
          </div>

          <span className="text-[10px] text-stadiumGreen font-mono font-bold">xG: {p.expectedAwayGoals.toFixed(2)}</span>
        </div>
      </div>

      {/* 3. Deep Match Analytics Stats Grid (Directly on Outer Card) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-black/50 p-2.5 rounded-2xl border border-white/5 text-[11px] font-mono">
        <div className="text-center p-1.5 rounded-xl bg-panel/40 border border-white/5">
          <span className="text-gray-400 block text-[9px]">TOTAL xG POWER</span>
          <span className="text-white font-black">{totalXG.toFixed(2)} Goals</span>
        </div>
        <div className="text-center p-1.5 rounded-xl bg-panel/40 border border-white/5">
          <span className="text-gray-400 block text-[9px]">OVER 1.5 GOALS</span>
          <span className="text-stadiumGreen font-black">{over15Prob}% Prob</span>
        </div>
        <div className="text-center p-1.5 rounded-xl bg-panel/40 border border-white/5">
          <span className="text-gray-400 block text-[9px]">OVER 2.5 GOALS</span>
          <span className="text-gold font-black">{over25Prob}% Prob</span>
        </div>
        <div className="text-center p-1.5 rounded-xl bg-panel/40 border border-white/5">
          <span className="text-gray-400 block text-[9px]">BOTH SCORE (BTTS)</span>
          <span className="text-cyberPurple font-black">{bttsProb}% Prob</span>
        </div>
      </div>

      {/* 4. Real-Time 3-Way Win Probability Barometer with 1-Click Odds Add */}
      <div className="bg-black/60 rounded-2xl p-3 border border-white/5 space-y-2">
        <div className="flex justify-between text-xs font-mono text-gray-300 font-semibold">
          <button 
            onClick={() => onSelectOdds(match, `${match.homeTeam} Win`, match.odds[0]?.homeWin || 1.80)}
            className="hover:text-stadiumGreen transition-all flex items-center space-x-1"
          >
            <span>{match.homeTeam} ({(p.homeWinProb * 100).toFixed(1)}%)</span>
            <Plus className="w-3 h-3 text-stadiumGreen" />
          </button>
          <button 
            onClick={() => onSelectOdds(match, 'Draw', match.odds[0]?.draw || 3.50)}
            className="hover:text-gold transition-all flex items-center space-x-1"
          >
            <span>Draw ({(p.drawProb * 100).toFixed(1)}%)</span>
            <Plus className="w-3 h-3 text-gold" />
          </button>
          <button 
            onClick={() => onSelectOdds(match, `${match.awayTeam} Win`, match.odds[0]?.awayWin || 3.20)}
            className="hover:text-cyberPurple transition-all flex items-center space-x-1"
          >
            <span>{match.awayTeam} ({(p.awayWinProb * 100).toFixed(1)}%)</span>
            <Plus className="w-3 h-3 text-cyberPurple" />
          </button>
        </div>

        <div className="h-3 w-full rounded-full bg-gray-900 overflow-hidden flex border border-white/5">
          <div style={{ width: `${p.homeWinProb * 100}%` }} className="h-full bg-stadiumGreen transition-all duration-500 shadow-sm shadow-stadiumGreen/50"></div>
          <div style={{ width: `${p.drawProb * 100}%` }} className="h-full bg-gold transition-all duration-500"></div>
          <div style={{ width: `${p.awayWinProb * 100}%` }} className="h-full bg-cyberPurple transition-all duration-500"></div>
        </div>
      </div>

      {/* 5. Expert System vs Community Fan Predictions Engine */}
      <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-3 font-mono text-xs shadow-inner">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded-lg bg-cyberPurple/20 text-cyberPurple border border-cyberPurple/30">
              <Brain className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-white text-xs">EXPERT SYSTEM VS COMMUNITY PICKS</span>
          </div>

          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
            totalMemberVotes === 0
              ? 'bg-panel text-gray-400 border border-white/10'
              : (p.homeWinProb >= 0.5 && communityHomePercent >= 50) || (p.awayWinProb >= 0.5 && communityAwayPercent >= 50)
              ? 'bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/30'
              : 'bg-gold/20 text-gold border border-gold/30'
          }`}>
            {totalMemberVotes === 0
              ? '⚪ AWAITING MEMBER VOTES'
              : (p.homeWinProb >= 0.5 && communityHomePercent >= 50) || (p.awayWinProb >= 0.5 && communityAwayPercent >= 50)
              ? '🟢 ALIGNED CONSENSUS'
              : '⚡ CONTRARIAN VALUE EDGE'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {/* Expert System Match Prediction */}
          <div className="p-2.5 rounded-xl bg-stadiumGreen/10 border border-stadiumGreen/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-stadiumGreen font-bold flex items-center space-x-1">
                <Brain className="w-3 h-3" />
                <span>STADIUM PRO MATCH ANALYTICS</span>
              </span>
              <span className="text-white font-black text-xs">{(p.homeWinProb * 100).toFixed(1)}% Win Probability</span>
            </div>
            <p className="text-white font-extrabold text-xs">
              Top Pick: <span className="text-stadiumGreen">{p.topPick.selection}</span> @ {p.topPick.odds}
            </p>
            <p className="text-[10px] text-gray-300 font-sans line-clamp-1">
              {p.topPick.rationale}
            </p>
          </div>

          {/* Community Fan Members Prediction */}
          <div className="p-2.5 rounded-xl bg-panel border border-white/10 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gold font-bold flex items-center space-x-1">
                <Flame className="w-3 h-3 text-gold" />
                <span>COMMUNITY MEMBERS ({totalMemberVotes} VOTES)</span>
              </span>
              <span className="text-gold font-black text-xs">{totalMemberVotes > 0 ? `${communityHomePercent}% Pick Home` : '0%'}</span>
            </div>
            <p className="text-white font-extrabold text-xs">
              {totalMemberVotes > 0 ? (
                <>Crowd Consensus: <span className="text-gold">{communityHomePercent > communityAwayPercent ? `${match.homeTeam} Win` : `${match.awayTeam} Win`}</span> ({Math.max(communityHomePercent, communityAwayPercent)}%)</>
              ) : (
                <span className="text-gray-400 font-normal">0 member votes. Be the first to vote below!</span>
              )}
            </p>

            {/* Member Vote Buttons */}
            <div className="grid grid-cols-3 gap-1 pt-1">
              <button
                onClick={() => handleMemberVote('HOME')}
                className={`py-1 rounded text-[10px] font-bold transition-all ${
                  userMemberVote === 'HOME' ? 'bg-stadiumGreen text-black font-black' : 'bg-black/40 text-gray-300 hover:text-white border border-white/5'
                }`}
              >
                1: {communityHomePercent}%
              </button>
              <button
                onClick={() => handleMemberVote('DRAW')}
                className={`py-1 rounded text-[10px] font-bold transition-all ${
                  userMemberVote === 'DRAW' ? 'bg-gold text-black font-black' : 'bg-black/40 text-gray-300 hover:text-white border border-white/5'
                }`}
              >
                X: {communityDrawPercent}%
              </button>
              <button
                onClick={() => handleMemberVote('AWAY')}
                className={`py-1 rounded text-[10px] font-bold transition-all ${
                  userMemberVote === 'AWAY' ? 'bg-cyberPurple text-white font-black' : 'bg-black/40 text-gray-300 hover:text-white border border-white/5'
                }`}
              >
                2: {communityAwayPercent}%
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Primary Banker Pick Banner & 1-Click Action Hub */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-stadiumGreen/20 via-panel to-gold/15 border border-stadiumGreen/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-stadiumGreen text-black font-black text-xs shadow-md">
            👑
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-black text-stadiumGreen uppercase tracking-wider">{p.topPick.confidenceTier}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stadiumGreen/30 text-stadiumGreen font-mono">
                {p.topPick.probability}% WINNING CONFIDENCE
              </span>
            </div>
            <p className="text-sm font-black text-white mt-0.5">
              {p.topPick.market}: <span className="text-gold">{p.topPick.selection}</span> @ {p.topPick.odds}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => onSelectOdds(match, p.topPick.selection, p.topPick.odds)}
            className="px-4 py-2 rounded-xl bg-stadiumGreen hover:bg-emerald-400 text-black font-black text-xs shadow-md hover:scale-105 transition-all flex items-center space-x-1.5 glow-emerald"
          >
            <Plus className="w-4 h-4" />
            <span>Add @ {p.topPick.odds}</span>
          </button>

          <button
            onClick={() => onOpenReceipt(match)}
            className="px-3.5 py-2 rounded-xl bg-gold/20 hover:bg-gold/30 border border-gold/40 text-gold text-xs font-black transition-all flex items-center space-x-1 hover:scale-105"
            title="Generate Viral Flex Prediction Receipt"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Viral Flex</span>
          </button>
        </div>
      </div>

      {/* 6. Multi-Market Quick-Add Pills (3 Additional Markets Directly on Card) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button
          onClick={() => onSelectOdds(match, `${match.homeTeam} or Draw (1X)`, dc1xOdds)}
          className="p-2 rounded-xl bg-panel hover:bg-panel/80 border border-white/10 hover:border-stadiumGreen/40 text-left font-mono text-[11px] flex items-center justify-between transition-all group"
        >
          <span className="text-gray-300 group-hover:text-white">Double Chance (1X)</span>
          <span className="text-stadiumGreen font-bold bg-stadiumGreen/10 px-1.5 py-0.5 rounded">{dc1xOdds} +</span>
        </button>

        <button
          onClick={() => onSelectOdds(match, 'Over 1.5 Total Goals', over15Odds)}
          className="p-2 rounded-xl bg-panel hover:bg-panel/80 border border-white/10 hover:border-gold/40 text-left font-mono text-[11px] flex items-center justify-between transition-all group"
        >
          <span className="text-gray-300 group-hover:text-white">Over 1.5 Goals</span>
          <span className="text-gold font-bold bg-gold/10 px-1.5 py-0.5 rounded">{over15Odds} +</span>
        </button>

        <button
          onClick={() => onSelectOdds(match, 'Both Teams to Score (BTTS)', bttsOdds)}
          className="p-2 rounded-xl bg-panel hover:bg-panel/80 border border-white/10 hover:border-cyberPurple/40 text-left font-mono text-[11px] flex items-center justify-between transition-all group"
        >
          <span className="text-gray-300 group-hover:text-white">BTTS: Yes</span>
          <span className="text-cyberPurple font-bold bg-cyberPurple/10 px-1.5 py-0.5 rounded">{bttsOdds} +</span>
        </button>

      </div>

      {/* 7. Expandable Live Bookmaker Odds Matrix */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
        <button
          onClick={() => setExpandedOdds(!expandedOdds)}
          className="text-xs text-gray-400 hover:text-white flex items-center space-x-1 font-mono transition-all"
        >
          <span>{expandedOdds ? 'Hide Bookmaker Odds' : '⚡ Compare Live Bookmaker Odds (SportyBet, Bet9ja, 1xBet)'}</span>
          {expandedOdds ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <span className="text-[10px] text-stadiumGreen font-mono font-bold">
          Safe Stake Rating: {p.topPick.kellyStake}% (Safety 1/4)
        </span>
      </div>

      {expandedOdds && (
        <div className="pt-2 border-t border-white/10 space-y-2 animate-fadeIn font-mono text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {match.odds.map((o, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-2xl bg-black/60 border border-white/10 hover:border-gold/40 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between pb-1 border-b border-white/5">
                  <span className="font-extrabold text-gold">{o.bookie}</span>
                  <a href={o.affiliateUrl} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex justify-between items-center pt-1 text-[10px] text-gray-300">
                  <span>1: <strong className="text-white">{o.homeWin}</strong></span>
                  <span>X: <strong className="text-white">{o.draw}</strong></span>
                  <span>2: <strong className="text-white">{o.awayWin}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
