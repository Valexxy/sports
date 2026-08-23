'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { MatchData } from '../lib/sports-api';
import { sortLeagueGroups, sortMatchesByClosestKickoff } from '../lib/match-sorter';
import { 
  Star, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Trophy, 
  ArrowUpRight, 
  Plus, 
  Filter, 
  Bell, 
  BellRing, 
  CheckCircle2, 
  XCircle,
  ExternalLink
} from 'lucide-react';
import { stadiumAudio } from '../lib/sound-synthesizer';

interface LiveScoreHubProps {
  matches: MatchData[];
  onOpenInsights: (match: MatchData) => void;
  onOpenReceipt: (match: MatchData) => void;
  onSelectOdds: (match: MatchData, selection: string, odds: number) => void;
  onToggleFollow?: (match: MatchData) => void;
  followedMatchIds?: string[];
}

export const LiveScoreStadiumHub: React.FC<LiveScoreHubProps> = ({
  matches,
  onOpenInsights,
  onOpenReceipt,
  onSelectOdds,
  onToggleFollow,
  followedMatchIds = [],
}) => {
  // Sort all incoming matches chronologically by closest to begin
  const sortedMatches = React.useMemo(() => {
    return sortMatchesByClosestKickoff(matches, 'ALL');
  }, [matches]);

  const [selectedMatch, setSelectedMatch] = useState<MatchData | null>(sortedMatches[0] || null);
  const [selectedLeagueFilter, setSelectedLeagueFilter] = useState<string | null>(null);
  const [isTopCompetitionsOpen, setIsTopCompetitionsOpen] = useState(true);
  const [collapsedLeagues, setCollapsedLeagues] = useState<Record<string, boolean>>({});

  // Sync selected match when matches list updates
  React.useEffect(() => {
    if (sortedMatches.length > 0 && (!selectedMatch || !sortedMatches.some((m) => m.id === selectedMatch.id))) {
      setSelectedMatch(sortedMatches[0]);
    }
  }, [sortedMatches]);

  // Group matches by League
  const matchesByLeague = React.useMemo(() => {
    return sortedMatches.reduce((acc, match) => {
      const league = match.league || 'Other Fixtures';
      if (!acc[league]) acc[league] = [];
      acc[league].push(match);
      return acc;
    }, {} as Record<string, MatchData[]>);
  }, [sortedMatches]);

  const toggleLeagueCollapse = (leagueName: string) => {
    setCollapsedLeagues((prev) => ({
      ...prev,
      [leagueName]: !prev[leagueName],
    }));
  };

  // Sort league groups so leagues with LIVE or games starting soonest appear first
  const sortedLeagueEntries = React.useMemo(() => {
    return sortLeagueGroups(matchesByLeague);
  }, [matchesByLeague]);

  const displayedLeagues = selectedLeagueFilter
    ? sortedLeagueEntries.filter(([name]) => name === selectedLeagueFilter)
    : sortedLeagueEntries;

  const activeMatch = selectedMatch && sortedMatches.some((m) => m.id === selectedMatch.id)
    ? selectedMatch
    : sortedMatches[0] || null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 font-mono text-xs">
      
      {/* LEFT COLUMN: Collapsible & Filterable Top Competitions (3 Cols) */}
      <div className="lg:col-span-3 space-y-3 sm:space-y-4">
        
        {/* Mobile Horizontal Quick-Scroll Competitions Bar */}
        <div className="lg:hidden flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar select-none">
          <button
            onClick={() => setSelectedLeagueFilter(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              selectedLeagueFilter === null
                ? 'bg-stadiumGreen text-black font-black shadow-md shadow-stadiumGreen/20'
                : 'bg-panel border border-white/10 text-gray-400'
            }`}
          >
            <span>🌍 All</span>
            <span className="text-[10px] opacity-75">({matches.length})</span>
          </button>

          {[
            { name: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', short: 'PL' },
            { name: 'La Liga', flag: '🇪🇸', short: 'La Liga' },
            { name: 'UEFA Champions League', flag: '🇪🇺', short: 'UCL' },
            { name: 'Serie A', flag: '🇮🇹', short: 'Serie A' },
            { name: 'Bundesliga', flag: '🇩🇪', short: 'Bundesliga' },
            { name: 'NPFL Nigeria', flag: '🇳🇬', short: 'NPFL' },
            { name: 'Brasileirao', flag: '🇧🇷', short: 'Brazil' },
          ].map((comp) => {
            const count = matchesByLeague[comp.name]?.length || 0;
            const isSelected = selectedLeagueFilter === comp.name;

            return (
              <button
                key={comp.name}
                onClick={() => {
                  setSelectedLeagueFilter(isSelected ? null : comp.name);
                  const firstInLeague = matches.find((m) => m.league === comp.name);
                  if (firstInLeague) setSelectedMatch(firstInLeague);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-stadiumGreen text-black font-black shadow-md shadow-stadiumGreen/20'
                    : 'bg-panel border border-white/10 text-gray-300'
                }`}
              >
                <span>{comp.flag}</span>
                <span>{comp.short}</span>
                {count > 0 && <span className="text-[9px] opacity-80">({count})</span>}
              </button>
            );
          })}
        </div>

        {/* Desktop Sidebar Competitions */}
        <div className="hidden lg:block glass-panel rounded-3xl p-4 border border-white/10 space-y-2.5 shadow-xl">
          <div 
            onClick={() => setIsTopCompetitionsOpen(!isTopCompetitionsOpen)}
            className="flex items-center justify-between border-b border-white/10 pb-2.5 cursor-pointer select-none hover:opacity-90 transition-all"
          >
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-gold fill-current" />
              <span className="font-black text-white text-xs">TOP COMPETITIONS</span>
            </div>
            <div className="flex items-center space-x-1.5 text-gray-400">
              <span className="text-[10px]">{isTopCompetitionsOpen ? 'Collapse' : 'Expand'}</span>
              {isTopCompetitionsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>

          {isTopCompetitionsOpen && (
            <div className="space-y-1 pt-1 animate-fadeIn">
              <button
                onClick={() => setSelectedLeagueFilter(null)}
                className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all font-bold ${
                  selectedLeagueFilter === null
                    ? 'bg-stadiumGreen text-black font-black shadow-md'
                    : 'hover:bg-white/5 text-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>🌍</span>
                  <span>All Competitions</span>
                </div>
                <span className="text-[10px] opacity-80">{matches.length} matches</span>
              </button>

              {[
                { name: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
                { name: 'La Liga', flag: '🇪🇸' },
                { name: 'UEFA Champions League', flag: '🇪🇺' },
                { name: 'Copa Libertadores', flag: '🏆🌎' },
                { name: 'Serie A', flag: '🇮🇹' },
                { name: 'Bundesliga', flag: '🇩🇪' },
                { name: 'Ligue 1', flag: '🇫🇷' },
                { name: 'MLS', flag: '🇺🇸' },
                { name: 'Brasileirao', flag: '🇧🇷' },
                { name: 'Liga MX', flag: '🇲🇽' },
                { name: 'NPFL Nigeria', flag: '🇳🇬' },
              ].map((comp) => {
                const count = matchesByLeague[comp.name]?.length || 0;
                const isSelected = selectedLeagueFilter === comp.name;

                return (
                  <button
                    key={comp.name}
                    onClick={() => {
                      setSelectedLeagueFilter(isSelected ? null : comp.name);
                      const firstInLeague = matches.find((m) => m.league === comp.name);
                      if (firstInLeague) setSelectedMatch(firstInLeague);
                    }}
                    className={`w-full p-2 rounded-xl flex items-center justify-between text-left transition-all ${
                      isSelected
                        ? 'bg-stadiumGreen text-black font-black shadow-md'
                        : 'hover:bg-white/5 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span className="text-sm">{comp.flag}</span>
                      <span className="truncate text-[11px] font-bold">{comp.name}</span>
                    </div>
                    {count > 0 && (
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                        isSelected ? 'bg-black text-stadiumGreen' : 'bg-stadiumGreen/20 text-stadiumGreen'
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Live Followed Match Counter */}
        {followedMatchIds.length > 0 && (
          <div className="glass-panel rounded-3xl p-4 border border-gold/40 space-y-1.5 shadow-lg bg-gold/10">
            <span className="text-[10px] text-gold font-black flex items-center space-x-1.5 uppercase">
              <BellRing className="w-3.5 h-3.5 animate-bounce" />
              <span>FOLLOWED MATCHES ({followedMatchIds.length})</span>
            </span>
            <p className="text-white text-xs font-bold leading-tight">
              Audio stadium crowd chime enabled for in-play goals & settlements!
            </p>
          </div>
        )}

      </div>

      {/* CENTER COLUMN: Competition-Grouped Match Rows (6 Cols) */}
      <div className="lg:col-span-6 space-y-4">
        
        {selectedLeagueFilter && (
          <div className="p-3 rounded-2xl bg-stadiumGreen/10 border border-stadiumGreen/30 flex items-center justify-between text-xs">
            <span className="font-black text-stadiumGreen flex items-center space-x-1.5">
              <Filter className="w-3.5 h-3.5" />
              <span>Filtering: {selectedLeagueFilter}</span>
            </span>
            <button
              onClick={() => setSelectedLeagueFilter(null)}
              className="text-gray-400 hover:text-white underline text-[10px]"
            >
              Clear Filter (Show All)
            </button>
          </div>
        )}

        {displayedLeagues.length === 0 ? (
          <div className="glass-panel rounded-3xl p-8 text-center text-gray-400 space-y-2">
            <Trophy className="w-8 h-8 text-gold mx-auto" />
            <p className="text-white font-bold text-xs">No active matches found for this competition.</p>
            <button
              onClick={() => setSelectedLeagueFilter(null)}
              className="px-4 py-2 rounded-xl bg-stadiumGreen text-black font-black text-xs"
            >
              Show All Competitions
            </button>
          </div>
        ) : (
          displayedLeagues.map(([leagueName, leagueMatches]) => {
            const flag = leagueMatches[0]?.leagueFlag || '⚽';
            const isCollapsed = collapsedLeagues[leagueName];

            return (
              <div
                key={leagueName}
                className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-xl"
              >
                {/* League Header */}
                <div
                  onClick={() => toggleLeagueCollapse(leagueName)}
                  className="bg-black/80 px-4 py-3 border-b border-white/10 flex items-center justify-between cursor-pointer hover:bg-black/60 transition-all select-none"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{flag}</span>
                    <span className="font-extrabold text-white text-xs sm:text-sm">{leagueName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-gray-300 font-bold">
                      {leagueMatches.length}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-400 text-[10px]">
                    <span className="hidden sm:inline hover:text-stadiumGreen font-bold">
                      {isCollapsed ? 'Show Matches ▾' : 'Hide Matches ▴'}
                    </span>
                    {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </div>
                </div>

                {/* Match Rows */}
                {!isCollapsed && (
                  <div className="divide-y divide-white/5 animate-fadeIn">
                    {leagueMatches.map((m) => {
                      const isLive = m.status === 'LIVE';
                      const isFinished = m.status === 'FINISHED';
                      const isSelected = activeMatch?.id === m.id;
                      const isFollowed = followedMatchIds.includes(m.id);

                      // Determine Settlement Status
                      const isSettledWon = isFinished && (
                        (m.prediction.topPick.selection.includes('Double Chance') && (m.homeScore >= m.awayScore)) ||
                        (m.prediction.topPick.selection.includes('Draw') && m.homeScore === m.awayScore) ||
                        (m.homeScore > m.awayScore)
                      );

                      return (
                        <div
                          key={m.id}
                          onClick={() => setSelectedMatch(m)}
                          className={`p-3.5 transition-all cursor-pointer flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-stadiumGreen/15 border-l-4 border-stadiumGreen'
                              : 'hover:bg-white/5'
                          }`}
                        >
                          {/* Follow Pin Icon + Time/Status + Teams */}
                          <div className="flex items-center space-x-3 flex-1">
                            
                            {/* Follow Match Bell Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onToggleFollow) onToggleFollow(m);
                              }}
                              className={`p-1.5 rounded-xl border transition-all ${
                                isFollowed
                                  ? 'bg-gold text-black border-gold shadow-md scale-110'
                                  : 'bg-black/50 text-gray-500 hover:text-gold border-white/10'
                              }`}
                              title={isFollowed ? 'Following Match (Click to Unfollow)' : 'Follow Match for Audio Alerts'}
                            >
                              <Bell className={`w-3.5 h-3.5 ${isFollowed ? 'fill-current' : ''}`} />
                            </button>

                            {/* Status Badge */}
                            <div className="w-14 flex-shrink-0 text-center">
                              {isLive ? (
                                <span className="px-1.5 py-0.5 rounded bg-crimson text-white text-[9px] font-black animate-pulse block">
                                  {m.matchTime}
                                </span>
                              ) : isFinished ? (
                                <div className="space-y-0.5">
                                  <span className="text-[9px] font-extrabold text-gray-400 block bg-white/5 py-0.5 rounded">FT</span>
                                  {isSettledWon ? (
                                    <span className="text-[8px] px-1 py-0.2 rounded bg-stadiumGreen/20 text-stadiumGreen font-black border border-stadiumGreen/30 block">
                                      WON ✓
                                    </span>
                                  ) : (
                                    <span className="text-[8px] px-1 py-0.2 rounded bg-crimson/20 text-crimson font-black border border-crimson/30 block">
                                      SETTLED
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-[10px] text-gold font-bold block">{m.matchTime}</span>
                              )}
                            </div>

                            {/* Teams & Scores (Aligned Layout) */}
                            <div className="space-y-1.5 flex-1 pr-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 truncate">
                                  {m.homeLogo && m.homeLogo.startsWith('http') ? (
                                    <img
                                      src={m.homeLogo}
                                      alt=""
                                      className="w-4 h-4 object-contain flex-shrink-0"
                                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                                    />
                                  ) : (
                                    <span className="text-xs">⚽</span>
                                  )}
                                  <span className={`text-xs font-extrabold truncate ${
                                    isFinished && m.homeScore > m.awayScore ? 'text-stadiumGreen font-black' : 'text-white'
                                  }`}>
                                    {m.homeTeam}
                                  </span>
                                </div>
                                {(isLive || isFinished) && (
                                  <span className="w-7 h-5 flex items-center justify-center font-mono font-black text-xs text-white bg-black/80 border border-white/10 rounded-md">
                                    {m.homeScore}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 truncate">
                                  {m.awayLogo && m.awayLogo.startsWith('http') ? (
                                    <img
                                      src={m.awayLogo}
                                      alt=""
                                      className="w-4 h-4 object-contain flex-shrink-0"
                                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                                    />
                                  ) : (
                                    <span className="text-xs">⚽</span>
                                  )}
                                  <span className={`text-xs font-extrabold truncate ${
                                    isFinished && m.awayScore > m.homeScore ? 'text-stadiumGreen font-black' : 'text-white'
                                  }`}>
                                    {m.awayTeam}
                                  </span>
                                </div>
                                {(isLive || isFinished) && (
                                  <span className="w-7 h-5 flex items-center justify-center font-mono font-black text-xs text-white bg-black/80 border border-white/10 rounded-md">
                                    {m.awayScore}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Quick Action Odds & Insights */}
                          <div className="flex items-center space-x-2 justify-end sm:border-l sm:border-white/5 sm:pl-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectOdds(m, m.prediction.topPick.selection, m.prediction.topPick.odds);
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-panel hover:bg-stadiumGreen hover:text-black border border-white/10 hover:border-stadiumGreen text-[10px] font-mono font-bold transition-all flex items-center space-x-1"
                              title="Add to slip"
                            >
                              <span className="text-gold">{m.prediction.topPick.odds}</span>
                              <Plus className="w-3 h-3" />
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenInsights(m);
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-stadiumGreen/20 hover:bg-stadiumGreen/30 text-stadiumGreen border border-stadiumGreen/40 text-[10px] font-bold transition-all flex items-center space-x-1"
                              title="Open Deep Match Radar & Analytics"
                            >
                              <span>Insights</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </button>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* RIGHT COLUMN: Active Match Live Center Hub (3 Cols) */}
      <div className="lg:col-span-3 space-y-4">
        {activeMatch ? (
          <div className="glass-panel-premium rounded-3xl p-4 border border-stadiumGreen/40 space-y-4 shadow-2xl sticky top-20">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-black text-white text-xs">MATCH CENTER 🏟️</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                activeMatch.status === 'LIVE'
                  ? 'bg-crimson/20 text-crimson border-crimson/40 animate-pulse'
                  : activeMatch.status === 'FINISHED'
                  ? 'bg-stadiumGreen/20 text-stadiumGreen border-stadiumGreen/40'
                  : 'bg-gold/20 text-gold border-gold/40'
              }`}>
                {activeMatch.status === 'LIVE' ? 'LIVE NOW' : activeMatch.status === 'FINISHED' ? 'FINISHED' : 'SCHEDULED'}
              </span>
            </div>

            {/* Score Banner (NEVER BREAKING ON 2 LINES) */}
            <div className="text-center space-y-2 py-3 bg-black/60 rounded-2xl border border-white/5 shadow-inner">
              <span className="text-[10px] text-gray-400 block font-bold">{activeMatch.league}</span>
              <div className="flex items-center justify-center space-x-3 px-2">
                <div className="text-center flex-1 truncate">
                  {activeMatch.homeLogo && activeMatch.homeLogo.startsWith('http') ? (
                    <img src={activeMatch.homeLogo} alt="" className="w-8 h-8 mx-auto object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                  ) : (
                    <span className="text-2xl block">⚽</span>
                  )}
                  <span className="font-black text-white text-[11px] block mt-1 truncate">{activeMatch.homeTeam}</span>
                </div>

                {/* Score Box - Unbreakable single line */}
                <div className="min-w-[76px] px-3 py-2 rounded-2xl bg-black border border-white/15 text-lg font-black text-stadiumGreen font-mono whitespace-nowrap shadow-inner flex items-center justify-center">
                  {activeMatch.status === 'LIVE' || activeMatch.status === 'FINISHED'
                    ? `${activeMatch.homeScore} - ${activeMatch.awayScore}`
                    : 'vs'}
                </div>

                <div className="text-center flex-1 truncate">
                  {activeMatch.awayLogo && activeMatch.awayLogo.startsWith('http') ? (
                    <img src={activeMatch.awayLogo} alt="" className="w-8 h-8 mx-auto object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                  ) : (
                    <span className="text-2xl block">⚽</span>
                  )}
                  <span className="font-black text-white text-[11px] block mt-1 truncate">{activeMatch.awayTeam}</span>
                </div>
              </div>

              {activeMatch.venue && (
                <span className="text-[9px] text-gray-400 block pt-1 truncate px-2">🏟️ {activeMatch.venue}</span>
              )}
            </div>

            {/* Expert Banker Pick with Unambiguous Settlement Result */}
            <div 
              onClick={() => onOpenInsights(activeMatch)}
              className="p-3 rounded-2xl bg-gradient-to-r from-stadiumGreen/20 to-gold/10 border border-stadiumGreen/30 space-y-1.5 cursor-pointer hover:border-stadiumGreen transition-all"
              title="Click to view full settlement audit"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-stadiumGreen font-black uppercase tracking-wider">
                  SYSTEM PICK {activeMatch.status === 'FINISHED' ? '(SETTLED)' : ''}
                </span>
                {activeMatch.status === 'FINISHED' && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-stadiumGreen text-black font-black">
                    VERIFIED LEDGER ✓
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white font-extrabold text-xs">{activeMatch.prediction.topPick.selection}</span>
                <span className="text-gold font-black text-xs">@ {activeMatch.prediction.topPick.odds}</span>
              </div>
              <p className="text-[10px] text-gray-300 font-sans">{activeMatch.prediction.topPick.rationale}</p>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => onSelectOdds(activeMatch, activeMatch.prediction.topPick.selection, activeMatch.prediction.topPick.odds)}
                className="w-full py-2.5 rounded-xl bg-stadiumGreen hover:bg-emerald-400 text-black font-black text-xs shadow-md transition-all flex items-center justify-center space-x-1 glow-emerald"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Slip @ {activeMatch.prediction.topPick.odds}</span>
              </button>

              <button
                onClick={() => onOpenInsights(activeMatch)}
                className="w-full py-2 rounded-xl bg-panel hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center justify-center space-x-1"
              >
                <span>Deep Match Analytics & Pitch Radar ➔</span>
              </button>
            </div>

          </div>
        ) : (
          <div className="glass-panel rounded-3xl p-6 text-center text-gray-500 text-xs">
            Select any fixture to inspect live match pitch.
          </div>
        )}
      </div>

    </div>
  );
};
