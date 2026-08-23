'use client';
import React from 'react';
import { MatchData } from '../lib/sports-api';
import { Zap, CheckCircle2, Plus, Brain, Sparkles, Star } from 'lucide-react';

interface MatchesTableViewProps {
  matches: MatchData[];
  onOpenReceipt: (match: MatchData) => void;
  onOpenInsights: (match: MatchData) => void;
  onSelectOdds: (match: MatchData, selection: string, odds: number) => void;
  onBookmarkMatch?: (match: MatchData) => void;
}

export const MatchesTableView: React.FC<MatchesTableViewProps> = ({
  matches,
  onOpenReceipt,
  onOpenInsights,
  onSelectOdds,
  onBookmarkMatch,
}) => {
  if (!matches || matches.length === 0) return null;

  return (
    <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl font-mono text-xs">
      
      {/* Table Header Bar */}
      <div className="bg-black/60 px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-stadiumGreen animate-ping"></div>
          <span className="font-black text-white text-xs uppercase tracking-wider">
            TODAY'S OFFICIAL MATCH CENTER ({matches.length} FIXTURES)
          </span>
        </div>
        <span className="text-[10px] text-stadiumGreen font-bold px-2 py-0.5 rounded bg-stadiumGreen/20 border border-stadiumGreen/30">
          LIVE DATABASE SYNC ✓
        </span>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-panel/80 text-[10px] text-gray-400 font-bold uppercase">
              <th className="py-2.5 px-3">Status / Time</th>
              <th className="py-2.5 px-3">League</th>
              <th className="py-2.5 px-4">Matchup & Score</th>
              <th className="py-2.5 px-3">Expert System Pick</th>
              <th className="py-2.5 px-3 text-center">Live Odds (1 / X / 2)</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {matches.map((m) => {
              const isLive = m.status === 'LIVE';
              const isFinished = m.status === 'FINISHED';
              const p = m.prediction;

              return (
                <tr
                  key={m.id}
                  className="hover:bg-white/5 transition-all group cursor-pointer"
                >
                  {/* Status / Time */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    {isLive ? (
                      <span className="px-2 py-0.5 rounded-full bg-crimson/20 border border-crimson/40 text-crimson font-black text-[10px] animate-pulse flex items-center space-x-1 w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-crimson"></span>
                        <span>LIVE {m.matchTime}</span>
                      </span>
                    ) : isFinished ? (
                      <span className="px-2 py-0.5 rounded-full bg-stadiumGreen/20 border border-stadiumGreen/30 text-stadiumGreen font-bold text-[10px] flex items-center space-x-1 w-fit">
                        <CheckCircle2 className="w-3 h-3 text-stadiumGreen" />
                        <span>FINAL FT</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-lg bg-panel border border-white/10 text-gray-300 font-bold text-[10px]">
                        ⏰ {m.matchTime}
                      </span>
                    )}
                  </td>

                  {/* League */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="flex items-center space-x-1.5">
                      <span className="text-sm">{m.leagueFlag}</span>
                      <span className="text-gray-300 font-bold text-[11px] group-hover:text-white">{m.league}</span>
                    </span>
                  </td>

                  {/* Matchup & Score */}
                  <td 
                    onClick={() => onOpenInsights(m)}
                    className="py-3 px-4 whitespace-nowrap"
                  >
                    <div className="flex items-center space-x-2">
                      {m.homeLogo && m.homeLogo.startsWith('http') ? (
                        <img src={m.homeLogo} alt={m.homeTeam} className="w-5 h-5 object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                      ) : (
                        <span className="text-sm">{m.homeLogo || '⚽'}</span>
                      )}
                      <span className="font-extrabold text-white text-xs">{m.homeTeam}</span>
                      <span className={`px-2 py-0.5 rounded-md font-mono font-black text-xs ${
                        isLive ? 'bg-crimson text-white' : isFinished ? 'bg-gray-800 text-white' : 'bg-panel border border-white/10 text-gray-400'
                      }`}>
                        {isLive || isFinished ? `${m.homeScore} - ${m.awayScore}` : 'vs'}
                      </span>
                      <span className="font-extrabold text-white text-xs">{m.awayTeam}</span>
                      {m.awayLogo && m.awayLogo.startsWith('http') ? (
                        <img src={m.awayLogo} alt={m.awayTeam} className="w-5 h-5 object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                      ) : (
                        <span className="text-sm">{m.awayLogo || '⚽'}</span>
                      )}
                    </div>
                    {m.venue && (
                      <span className="text-[9px] text-gray-400 block pt-0.5">🏟️ {m.venue}</span>
                    )}
                  </td>

                  {/* Expert System Pick */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-stadiumGreen/20 text-stadiumGreen font-black border border-stadiumGreen/30">
                        {p.topPick.probability}% WIN
                      </span>
                      <span className="text-gold font-extrabold text-[11px]">{p.topPick.selection}</span>
                    </div>
                  </td>

                  {/* Live Odds (1 / X / 2) with 1-Click Slip Add */}
                  <td className="py-3 px-3 whitespace-nowrap text-center">
                    <div className="inline-flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectOdds(m, `${m.homeTeam} Win`, m.odds[0]?.homeWin || 1.80);
                        }}
                        className="px-2 py-1 rounded bg-black/40 hover:bg-stadiumGreen hover:text-black border border-white/10 font-bold text-[10px] transition-all"
                        title={`Bet 1: ${m.homeTeam}`}
                      >
                        1: {m.odds[0]?.homeWin || 1.80}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectOdds(m, 'Draw', m.odds[0]?.draw || 3.50);
                        }}
                        className="px-2 py-1 rounded bg-black/40 hover:bg-gold hover:text-black border border-white/10 font-bold text-[10px] transition-all"
                        title="Bet X: Draw"
                      >
                        X: {m.odds[0]?.draw || 3.50}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectOdds(m, `${m.awayTeam} Win`, m.odds[0]?.awayWin || 3.20);
                        }}
                        className="px-2 py-1 rounded bg-black/40 hover:bg-cyberPurple hover:text-white border border-white/10 font-bold text-[10px] transition-all"
                        title={`Bet 2: ${m.awayTeam}`}
                      >
                        2: {m.odds[0]?.awayWin || 3.20}
                      </button>
                    </div>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3 px-3 whitespace-nowrap text-right">
                    <div className="inline-flex items-center space-x-1.5">
                      <button
                        onClick={() => onOpenInsights(m)}
                        className="p-1.5 rounded-lg bg-stadiumGreen/10 hover:bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/30 transition-all"
                        title="Open Match Insights & Live Chat"
                      >
                        <Brain className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onOpenReceipt(m)}
                        className="p-1.5 rounded-lg bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 transition-all"
                        title="Flex Prediction Ticket"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
