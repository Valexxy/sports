'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trophy, Search, Flame, Shield, Globe, ExternalLink, RefreshCw, ChevronRight } from 'lucide-react';
import { StandingsTeamEntry } from '../api/v1/standings/route';
import { GlobalLanguageSwitcher } from '../../components/global-language-switcher';

const LEAGUES = [
  { code: 'eng.1', name: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'esp.1', name: 'La Liga', flag: '🇪🇸' },
  { code: 'ita.1', name: 'Serie A', flag: '🇮🇹' },
  { code: 'ger.1', name: 'Bundesliga', flag: '🇩🇪' },
  { code: 'fra.1', name: 'Ligue 1', flag: '🇫🇷' },
  { code: 'uefa.champions', name: 'Champions League', flag: '🌍' },
  { code: 'sau.1', name: 'Saudi Pro League', flag: '🇸🇦' },
  { code: 'usa.1', name: 'MLS', flag: '🇺🇸' },
];

export default function StandingsPage() {
  const [selectedLeague, setSelectedLeague] = useState<string>('eng.1');
  const [standings, setStandings] = useState<StandingsTeamEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchStandings = async (code: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/standings?league=${code}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setStandings(json.data);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchStandings(selectedLeague);
  }, [selectedLeague]);

  const activeLeagueObj = LEAGUES.find(l => l.code === selectedLeague) || LEAGUES[0];

  const filtered = standings.filter(team => {
    if (!searchQuery.trim()) return true;
    return team.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
  });

  return (
    <main className="min-h-screen bg-void text-white font-mono p-3 sm:p-8 space-y-6 pb-24">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link
            href="/"
            className="px-3.5 py-2 rounded-xl bg-panel hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 hover:text-white flex items-center space-x-2 transition-all shadow-md active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Match Center 🏟️</span>
          </Link>

          <div className="flex items-center space-x-2">
            <GlobalLanguageSwitcher />
            <span className="text-stadiumGreen font-black text-sm hidden sm:inline">MIVAJ SPORTS</span>
            <span className="px-2.5 py-0.5 rounded bg-stadiumGreen/20 text-stadiumGreen text-[10px] font-black border border-stadiumGreen/30">
              LIVE TABLES &amp; FORM 🏆
            </span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="glass-panel-premium rounded-3xl p-5 sm:p-8 border border-stadiumGreen/40 space-y-3 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center space-x-2">
                <span>LIVE LEAGUE STANDINGS &amp; FORM RADAR</span>
                <span>🏆</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 font-sans">
                Real-time official standings, qualification zones, 5-match form matrix &amp; direct banker connections
              </p>
            </div>

            <button
              onClick={() => fetchStandings(selectedLeague)}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-stadiumGreen text-black font-black text-xs flex items-center space-x-1.5 shadow-lg active:scale-95 transition-all self-start md:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Standings</span>
            </button>
          </div>
        </div>

        {/* League Selector Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {LEAGUES.map((league) => (
            <button
              key={league.code}
              onClick={() => setSelectedLeague(league.code)}
              className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center space-x-1.5 border ${
                selectedLeague === league.code
                  ? 'bg-stadiumGreen text-black border-stadiumGreen shadow-lg shadow-stadiumGreen/30 scale-105'
                  : 'bg-panel/80 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{league.flag}</span>
              <span>{league.name}</span>
            </button>
          ))}
        </div>

        {/* Search Bar & Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-panel p-3.5 rounded-2xl border border-white/10 text-xs">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeLeagueObj.name} club...`}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black border border-white/10 text-xs text-white placeholder-gray-500 focus:border-stadiumGreen focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-400 font-sans">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
              <span>UCL Zone (1-4)</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              <span>Europa League</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
              <span>Relegation</span>
            </span>
          </div>
        </div>

        {/* Standings Table */}
        <div className="rounded-3xl border border-white/10 overflow-hidden bg-panel/80 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/15 bg-black/60 text-gray-400 text-[10px] font-mono uppercase tracking-wider">
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">CLUB</th>
                  <th className="py-3 px-2 text-center">PL</th>
                  <th className="py-3 px-2 text-center">W</th>
                  <th className="py-3 px-2 text-center">D</th>
                  <th className="py-3 px-2 text-center">L</th>
                  <th className="py-3 px-2 text-center hidden md:table-cell">GF</th>
                  <th className="py-3 px-2 text-center hidden md:table-cell">GA</th>
                  <th className="py-3 px-2 text-center">GD</th>
                  <th className="py-3 px-3 text-center">PTS</th>
                  <th className="py-3 px-3 text-center">FORM</th>
                  <th className="py-3 px-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {loading ? (
                  <tr>
                    <td colSpan={12} className="py-12 text-center text-gray-400 text-xs font-sans">
                      Loading official {activeLeagueObj.name} standings live...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-8 text-center text-gray-400 text-xs font-sans">
                      No club found matching "{searchQuery}".
                    </td>
                  </tr>
                ) : (
                  filtered.map((t) => (
                    <tr
                      key={t.teamId}
                      className={`hover:bg-white/5 transition-colors ${
                        t.zone === 'CHAMPIONS_LEAGUE' ? 'border-l-4 border-l-cyan-400' :
                        t.zone === 'EUROPA_LEAGUE' ? 'border-l-4 border-l-emerald-400' :
                        t.zone === 'RELEGATION' ? 'border-l-4 border-l-red-500' : ''
                      }`}
                    >
                      <td className="py-3 px-3 font-bold text-gray-400">{t.rank}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-2.5">
                          {t.logo ? (
                            <img src={t.logo} alt={t.name} className="w-5 h-5 object-contain flex-shrink-0" />
                          ) : (
                            <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">⚽</span>
                          )}
                          <span className="font-bold text-white text-xs">{t.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center text-gray-300">{t.played}</td>
                      <td className="py-3 px-2 text-center text-stadiumGreen font-bold">{t.wins}</td>
                      <td className="py-3 px-2 text-center text-gray-400">{t.draws}</td>
                      <td className="py-3 px-2 text-center text-red-400">{t.losses}</td>
                      <td className="py-3 px-2 text-center text-gray-400 hidden md:table-cell">{t.goalsFor}</td>
                      <td className="py-3 px-2 text-center text-gray-400 hidden md:table-cell">{t.goalsAgainst}</td>
                      <td className="py-3 px-2 text-center font-bold text-gray-300">
                        {t.goalDifference > 0 ? `+${t.goalDifference}` : t.goalDifference}
                      </td>
                      <td className="py-3 px-3 text-center text-gold font-black text-sm">{t.points}</td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          {(t.form || ['W', 'D', 'W', 'W', 'L']).map((res, i) => (
                            <span
                              key={i}
                              className={`w-3.5 h-3.5 rounded text-[8px] font-black flex items-center justify-center ${
                                res === 'W' ? 'bg-stadiumGreen text-black' :
                                res === 'D' ? 'bg-gray-600 text-white' :
                                'bg-crimson text-white'
                              }`}
                            >
                              {res}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          href={`/?club=${encodeURIComponent(t.name)}`}
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white text-[10px] font-bold inline-flex items-center space-x-1"
                        >
                          <span>Bankers</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
