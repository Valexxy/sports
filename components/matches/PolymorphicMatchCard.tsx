import { formatMatchKickoff } from '../../lib/timezone-engine';
'use client';

import React from 'react';
import { Clock, Shield, Star, Trophy, Activity, Zap } from 'lucide-react';
import { MatchData } from '../../lib/real-sports-stream';

interface PolymorphicMatchCardProps {
  match: MatchData;
  onSelectClub?: (clubName: string) => void;
  onOpenReceipt?: (match: MatchData) => void;
}

export const PolymorphicMatchCard: React.FC<PolymorphicMatchCardProps> = ({
  match,
  onSelectClub,
  onOpenReceipt,
}) => {
  const isBasketball = match.sport === 'BASKETBALL' || match.league.toLowerCase().includes('nba') || match.league.toLowerCase().includes('wnba');
  const isTennis = match.sport === 'TENNIS' || match.league.toLowerCase().includes('atp') || match.league.toLowerCase().includes('wta');
  const isCombat = match.sport === 'COMBAT' || match.league.toLowerCase().includes('ufc') || match.league.toLowerCase().includes('boxing');
  const isNfl = match.sport === 'AMERICAN_FOOTBALL' || match.league.toLowerCase().includes('nfl');

  return (
    <div className="rounded-2xl bg-[#0d111a] border border-white/[0.08] hover:border-stadiumGreen/40 p-4 space-y-3 font-mono text-xs text-white transition-all shadow-xl">
      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2 text-[10px]">
        <div className="flex items-center space-x-1.5">
          <span>{match.leagueFlag}</span>
          <span className="font-bold text-gray-300">{match.league}</span>
        </div>

        <div className="flex items-center space-x-2">
          {match.status === 'LIVE' ? (
            <span className="px-2 py-0.5 rounded-full bg-crimson text-white font-black animate-pulse">
              ● LIVE
            </span>
          ) : match.status === 'FINISHED' ? (
            <span className="px-2 py-0.5 rounded-full bg-panel text-gray-400 font-bold border border-white/10">
              FT
            </span>
          ) : (
            <span className="text-gray-400 flex items-center space-x-1">
              <Clock className="w-3 h-3 text-stadiumGreen" />
              <span>{formatMatchKickoff(match.utcDate || match.matchTime)}</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Scoreboard Layout */}
      <div className="grid grid-cols-7 items-center gap-2">
        {/* Home Team / Fighter */}
        <div
          onClick={() => onSelectClub && onSelectClub(match.homeTeam)}
          className="col-span-3 flex items-center space-x-2.5 cursor-pointer hover:underline truncate"
        >
          <img
            src={match.homeLogo}
            alt={match.homeTeam}
            className="w-7 h-7 rounded-lg object-contain flex-shrink-0 bg-black/40 p-0.5 border border-white/10"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://crests.football-data.org/PL.png'; }}
          />
          <span className="font-black text-sm text-white truncate">{match.homeTeam}</span>
        </div>

        {/* Center Score / Versus */}
        <div className="col-span-1 text-center font-black text-base font-mono text-stadiumGreen">
          {match.status !== 'SCHEDULED' ? (
            <span>{match.homeScore} - {match.awayScore}</span>
          ) : (
            <span className="text-gray-500 text-xs font-normal">VS</span>
          )}
        </div>

        {/* Away Team / Fighter */}
        <div
          onClick={() => onSelectClub && onSelectClub(match.awayTeam)}
          className="col-span-3 flex items-center justify-end space-x-2.5 cursor-pointer hover:underline truncate"
        >
          <span className="font-black text-sm text-white truncate text-right">{match.awayTeam}</span>
          <img
            src={match.awayLogo}
            alt={match.awayTeam}
            className="w-7 h-7 rounded-lg object-contain flex-shrink-0 bg-black/40 p-0.5 border border-white/10"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://crests.football-data.org/PL.png'; }}
          />
        </div>
      </div>

      {/* Sport-Specific Polymorphic Telemetry */}
      {isBasketball && (
        <div className="p-2 rounded-xl bg-black/50 border border-white/5 grid grid-cols-4 gap-1 text-center text-[9px] text-gray-400">
          <div><span className="block text-gray-500">Q1</span><strong className="text-white">26-24</strong></div>
          <div><span className="block text-gray-500">Q2</span><strong className="text-white">28-30</strong></div>
          <div><span className="block text-gray-500">Q3</span><strong className="text-white">22-25</strong></div>
          <div><span className="block text-gray-500">Q4</span><strong className="text-stadiumGreen">Live</strong></div>
        </div>
      )}

      {/* Banker / Model Top Pick */}
      {match.prediction && (
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
          <div className="flex items-center space-x-1.5">
            <span className="text-gold font-bold">🎯 Model Pick:</span>
            <strong className="text-white font-mono">{match.prediction.topPick.selection}</strong>
            <span className="text-stadiumGreen font-bold">({match.prediction.topPick.odds})</span>
          </div>

          <span className="text-[10px] px-2 py-0.5 rounded-lg bg-stadiumGreen/15 text-stadiumGreen font-bold border border-stadiumGreen/30">
            {match.prediction.topPick.probability}% Confidence
          </span>
        </div>
      )}
    </div>
  );
};
