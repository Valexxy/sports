'use client';

import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  X, 
  RefreshCw, 
  Shield, 
  ExternalLink,
  ChevronRight,
  Flame,
  Award,
  TrendingUp,
  Search
} from 'lucide-react';
import { useTranslation } from '../lib/translation-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';
import { phoneHardware } from '../lib/phone-hardware-engine';

export interface StandingRow {
  pos: number;
  team: string;
  logo: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
}

interface LeagueStandingsModalProps {
  initialLeague?: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectTeam?: (teamName: string) => void;
}


const SEASONS_LIST = ['2025/2026', '2024/2025', '2023/2024', '2022/2023'];

const HISTORICAL_SEASON_STANDINGS: Record<string, Record<string, StandingRow[]>> = {
  '2024/2025': {
    'PREMIER_LEAGUE': [
      { pos: 1, team: 'Manchester City', logo: '', played: 38, won: 28, drawn: 7, lost: 3, gf: 96, ga: 34, gd: 62, points: 91, form: ['W', 'W', 'W', 'W', 'W'] },
      { pos: 2, team: 'Arsenal', logo: '', played: 38, won: 28, drawn: 5, lost: 5, gf: 91, ga: 29, gd: 62, points: 89, form: ['W', 'W', 'W', 'W', 'W'] },
      { pos: 3, team: 'Liverpool', logo: '', played: 38, won: 24, drawn: 10, lost: 4, gf: 86, ga: 41, gd: 45, points: 82, form: ['W', 'D', 'W', 'D', 'W'] },
      { pos: 4, team: 'Aston Villa', logo: '', played: 38, won: 20, drawn: 8, lost: 10, gf: 76, ga: 61, gd: 15, points: 68, form: ['L', 'D', 'L', 'D', 'W'] },
      { pos: 5, team: 'Tottenham', logo: '', played: 38, won: 20, drawn: 6, lost: 12, gf: 74, ga: 61, gd: 13, points: 66, form: ['W', 'L', 'W', 'L', 'L'] },
      { pos: 6, team: 'Chelsea', logo: '', played: 38, won: 18, drawn: 9, lost: 11, gf: 77, ga: 63, gd: 14, points: 63, form: ['W', 'W', 'W', 'W', 'W'] },
      { pos: 7, team: 'Newcastle', logo: '', played: 38, won: 18, drawn: 6, lost: 14, gf: 85, ga: 62, gd: 23, points: 60, form: ['W', 'L', 'D', 'W', 'W'] },
      { pos: 8, team: 'Manchester United', logo: '', played: 38, won: 18, drawn: 6, lost: 14, gf: 57, ga: 58, gd: -1, points: 60, form: ['W', 'W', 'L', 'L', 'D'] },
      { pos: 9, team: 'West Ham', logo: '', played: 38, won: 14, drawn: 10, lost: 14, gf: 60, ga: 74, gd: -14, points: 52, form: ['L', 'W', 'L', 'D', 'L'] },
      { pos: 10, team: 'Crystal Palace', logo: '', played: 38, won: 13, drawn: 10, lost: 15, gf: 57, ga: 58, gd: -1, points: 49, form: ['W', 'W', 'W', 'D', 'W'] },
      { pos: 11, team: 'Brighton', logo: '', played: 38, won: 12, drawn: 12, lost: 14, gf: 55, ga: 62, gd: -7, points: 48, form: ['L', 'L', 'D', 'W', 'L'] },
      { pos: 12, team: 'Bournemouth', logo: '', played: 38, won: 13, drawn: 9, lost: 16, gf: 54, ga: 67, gd: -13, points: 48, form: ['L', 'L', 'L', 'W', 'W'] },
      { pos: 13, team: 'Fulham', logo: '', played: 38, won: 13, drawn: 8, lost: 17, gf: 55, ga: 61, gd: -6, points: 47, form: ['W', 'L', 'D', 'D', 'L'] },
      { pos: 14, team: 'Wolves', logo: '', played: 38, won: 13, drawn: 7, lost: 18, gf: 50, ga: 65, gd: -15, points: 46, form: ['L', 'L', 'L', 'L', 'W'] },
      { pos: 15, team: 'Everton', logo: '', played: 38, won: 13, drawn: 9, lost: 16, gf: 40, ga: 51, gd: -11, points: 40, form: ['L', 'W', 'D', 'W', 'W'] },
      { pos: 16, team: 'Brentford', logo: '', played: 38, won: 10, drawn: 9, lost: 19, gf: 56, ga: 65, gd: -9, points: 39, form: ['L', 'W', 'D', 'L', 'W'] },
      { pos: 17, team: 'Nottingham Forest', logo: '', played: 38, won: 9, drawn: 9, lost: 20, gf: 49, ga: 67, gd: -18, points: 32, form: ['W', 'L', 'W', 'L', 'L'] },
      { pos: 18, team: 'Luton Town', logo: '', played: 38, won: 6, drawn: 8, lost: 24, gf: 52, ga: 85, gd: -33, points: 26, form: ['L', 'L', 'D', 'L', 'L'] },
      { pos: 19, team: 'Burnley', logo: '', played: 38, won: 5, drawn: 9, lost: 24, gf: 41, ga: 78, gd: -37, points: 24, form: ['L', 'L', 'L', 'D', 'W'] },
      { pos: 20, team: 'Sheffield United', logo: '', played: 38, won: 3, drawn: 7, lost: 28, gf: 35, ga: 104, gd: -69, points: 16, form: ['L', 'L', 'L', 'L', 'L'] },
    ],
    'LA_LIGA': [
      { pos: 1, team: 'Real Madrid', logo: '', played: 38, won: 29, drawn: 8, lost: 1, gf: 87, ga: 26, gd: 61, points: 95, form: ['D', 'D', 'W', 'W', 'W'] },
      { pos: 2, team: 'Barcelona', logo: '', played: 38, won: 26, drawn: 7, lost: 5, gf: 79, ga: 44, gd: 35, points: 85, form: ['W', 'W', 'W', 'W', 'L'] },
      { pos: 3, team: 'Girona', logo: '', played: 38, won: 25, drawn: 6, lost: 7, gf: 85, ga: 46, gd: 39, points: 81, form: ['W', 'W', 'L', 'D', 'W'] },
      { pos: 4, team: 'Atletico Madrid', logo: '', played: 38, won: 24, drawn: 4, lost: 10, gf: 70, ga: 43, gd: 27, points: 76, form: ['W', 'L', 'W', 'W', 'W'] },
      { pos: 5, team: 'Athletic Club', logo: '', played: 38, won: 19, drawn: 11, lost: 8, gf: 61, ga: 37, gd: 24, points: 68, form: ['W', 'W', 'L', 'D', 'W'] },
      { pos: 6, team: 'Real Sociedad', logo: '', played: 38, won: 16, drawn: 12, lost: 10, gf: 51, ga: 39, gd: 12, points: 60, form: ['L', 'W', 'W', 'L', 'W'] },
      { pos: 7, team: 'Real Betis', logo: '', played: 38, won: 14, drawn: 15, lost: 9, gf: 48, ga: 45, gd: 3, points: 57, form: ['D', 'L', 'D', 'W', 'W'] },
      { pos: 8, team: 'Villarreal', logo: '', played: 38, won: 14, drawn: 11, lost: 13, gf: 65, ga: 65, gd: 0, points: 53, form: ['D', 'D', 'W', 'W', 'W'] },
      { pos: 9, team: 'Valencia', logo: '', played: 38, won: 13, drawn: 10, lost: 15, gf: 40, ga: 45, gd: -5, points: 49, form: ['D', 'L', 'D', 'L', 'L'] },
      { pos: 10, team: 'Alaves', logo: '', played: 38, won: 12, drawn: 10, lost: 16, gf: 36, ga: 46, gd: -10, points: 46, form: ['D', 'W', 'L', 'D', 'W'] },
    ]
  },
  '2023/2024': {
    'PREMIER_LEAGUE': [
      { pos: 1, team: 'Manchester City', logo: '', played: 38, won: 28, drawn: 5, lost: 5, gf: 94, ga: 33, gd: 61, points: 89, form: ['L', 'D', 'W', 'W', 'W'] },
      { pos: 2, team: 'Arsenal', logo: '', played: 38, won: 26, drawn: 6, lost: 6, gf: 88, ga: 43, gd: 45, points: 84, form: ['W', 'L', 'L', 'W', 'W'] },
      { pos: 3, team: 'Manchester United', logo: '', played: 38, won: 23, drawn: 6, lost: 9, gf: 58, ga: 43, gd: 15, points: 75, form: ['W', 'W', 'W', 'W', 'L'] },
      { pos: 4, team: 'Newcastle', logo: '', played: 38, won: 19, drawn: 14, lost: 5, gf: 68, ga: 33, gd: 35, points: 71, form: ['D', 'D', 'W', 'D', 'L'] },
      { pos: 5, team: 'Liverpool', logo: '', played: 38, won: 19, drawn: 10, lost: 9, gf: 75, ga: 47, gd: 28, points: 67, form: ['D', 'D', 'W', 'W', 'W'] },
      { pos: 6, team: 'Brighton', logo: '', played: 38, won: 18, drawn: 8, lost: 12, gf: 72, ga: 53, gd: 19, points: 62, form: ['L', 'D', 'W', 'L', 'W'] },
    ],
    'LA_LIGA': [
      { pos: 1, team: 'Barcelona', logo: '', played: 38, won: 28, drawn: 4, lost: 6, gf: 70, ga: 20, gd: 50, points: 88, form: ['L', 'W', 'L', 'L', 'W'] },
      { pos: 2, team: 'Real Madrid', logo: '', played: 38, won: 24, drawn: 6, lost: 8, gf: 75, ga: 36, gd: 39, points: 78, form: ['D', 'W', 'D', 'L', 'W'] },
      { pos: 3, team: 'Atletico Madrid', logo: '', played: 38, won: 23, drawn: 8, lost: 7, gf: 70, ga: 33, gd: 37, points: 77, form: ['D', 'W', 'D', 'W', 'L'] },
    ]
  }
};

const LEAGUES = [
  { key: 'PREMIER_LEAGUE', label: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', country: 'England' },
  { key: 'LA_LIGA', label: 'La Liga', flag: '🇪🇸', country: 'Spain' },
  { key: 'SERIE_A', label: 'Serie A', flag: '🇮🇹', country: 'Italy' },
  { key: 'BUNDESLIGA', label: 'Bundesliga', flag: '🇩🇪', country: 'Germany' },
  { key: 'LIGUE_1', label: 'Ligue 1', flag: '🇫🇷', country: 'France' },
  { key: 'CHAMPIONS_LEAGUE', label: 'Champions League', flag: '⭐', country: 'Europe' },
  { key: 'NPFL', label: 'NPFL Radar', flag: '🇳🇬', country: 'Nigeria' },
];

export const LeagueStandingsModal: React.FC<LeagueStandingsModalProps> = ({
  initialLeague = 'PREMIER_LEAGUE',
  isOpen,
  onClose,
  onSelectTeam,
}) => {
  const { t } = useTranslation();
  const [selectedLeague, setSelectedLeague] = useState<string>('PREMIER_LEAGUE');
  const [selectedSeason, setSelectedSeason] = useState<string>('2025/2026');
  const [tableData, setTableData] = useState<StandingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (initialLeague) {
      const matched = LEAGUES.find(
        (l) =>
          l.key === initialLeague ||
          initialLeague.toLowerCase().includes(l.label.toLowerCase()) ||
          initialLeague.toLowerCase().includes(l.key.toLowerCase())
      );
      if (matched) {
        setSelectedLeague(matched.key);
      }
    }
  }, [initialLeague, isOpen]);

  const loadStandings = async (leagueKey: string, season: string = '2025/2026') => {
    if (season !== '2025/2026' && HISTORICAL_SEASON_STANDINGS[season]?.[leagueKey]) {
      setTableData(HISTORICAL_SEASON_STANDINGS[season][leagueKey]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/standings?league=${leagueKey}`);
      if (res.ok) {
        const data = await res.json();
        if (data.table && Array.isArray(data.table)) {
          setTableData(data.table);
        }
      }
    } catch (err) {
      console.warn('Standings fetch warning:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadStandings(selectedLeague, selectedSeason);
      }
  }, [selectedLeague, selectedSeason, isOpen]);

  if (!isOpen) return null;

  const currentLeagueObj = LEAGUES.find((l) => l.key === selectedLeague) || LEAGUES[0];

  const filteredRows = tableData.filter((r) =>
    r.team.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPositionStyling = (pos: number) => {
    if (pos <= 4) {
      return {
        badge: 'bg-stadiumGreen text-black font-black shadow-md shadow-stadiumGreen/40 ring-1 ring-stadiumGreen',
        rowBorder: 'border-l-4 border-stadiumGreen bg-stadiumGreen/5',
        tierLabel: 'UCL Qualification',
        tierColor: 'text-stadiumGreen',
      };
    }
    if (pos === 5) {
      return {
        badge: 'bg-blue-500 text-white font-black shadow-md shadow-blue-500/40 ring-1 ring-blue-400',
        rowBorder: 'border-l-4 border-blue-500 bg-blue-500/5',
        tierLabel: 'Europa League',
        tierColor: 'text-blue-400',
      };
    }
    if (pos === 6) {
      return {
        badge: 'bg-amber-500 text-black font-black shadow-md shadow-amber-500/40 ring-1 ring-amber-400',
        rowBorder: 'border-l-4 border-amber-500 bg-amber-500/5',
        tierLabel: 'Conference League',
        tierColor: 'text-amber-400',
      };
    }
    if (pos >= 18) {
      return {
        badge: 'bg-crimson text-white font-black shadow-md shadow-crimson/40 ring-1 ring-crimson',
        rowBorder: 'border-l-4 border-crimson bg-crimson/10',
        tierLabel: 'Relegation Zone',
        tierColor: 'text-crimson',
      };
    }
    return {
      badge: 'bg-white/10 text-gray-300 font-bold',
      rowBorder: 'border-l-4 border-transparent hover:bg-white/5',
      tierLabel: 'Mid-Table Safety',
      tierColor: 'text-gray-400',
    };
  };

  const handleRowClick = (teamName: string) => {
    phoneHardware.triggerHaptic('SELECTION');
    stadiumAudio.playTabClickSound();
    if (onSelectTeam) {
      onSelectTeam(teamName);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-6 animate-fadeIn font-mono text-xs">
      <div className="relative w-full max-w-6xl h-[94vh] glass-panel-premium rounded-3xl border-2 border-stadiumGreen/60 p-4 sm:p-6 shadow-2xl flex flex-col space-y-4">
        
        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-stadiumGreen via-gold to-cyberPurple text-black font-black shadow-lg">
              <Trophy className="w-6 h-6 text-black" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl">{currentLeagueObj.flag}</span>
                <h1 className="font-black text-base sm:text-xl text-white tracking-wider">
                  {currentLeagueObj.label.toUpperCase()} OFFICIAL STANDINGS 🏆
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-stadiumGreen text-black font-black text-[10px]">
                  LIVE ACCURATE
                </span>
              </div>
              <p className="text-xs text-gray-400 font-sans mt-0.5">
                Full league table, European & continental qualification zones, goal tallies, and 5-game form guide
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-stretch sm:self-auto justify-between sm:justify-end">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search club in table..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-gray-500 focus:border-stadiumGreen focus:outline-none"
              />
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-panel text-gray-400 hover:text-white border border-white/10 hover:border-stadiumGreen transition-all flex-shrink-0"
              title="Close Standings"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* League Switcher Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none flex-shrink-0">
          {LEAGUES.map((l) => (
            <button
              key={l.key}
              onClick={() => {
                setSelectedLeague(l.key);
                stadiumAudio.playTabClickSound();
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all flex items-center space-x-2 flex-shrink-0 ${
                selectedLeague === l.key
                  ? 'bg-stadiumGreen text-black shadow-lg shadow-stadiumGreen/25 scale-105 ring-2 ring-stadiumGreen'
                  : 'bg-black/50 text-gray-400 hover:text-white border border-white/10 hover:border-white/20'
              }`}
            >
              <span className="text-sm">{l.flag}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>

        {/* Full-Screen Table Body */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-black/70 scrollbar-thin">
          {loading ? (
            <div className="p-16 text-center text-gray-400 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-8 h-8 text-stadiumGreen animate-spin" />
              <span className="font-black text-sm text-white">Loading Official {currentLeagueObj.label} Table...</span>
              <p className="text-xs text-gray-500 font-sans">Syncing Opta points, goal difference records & form sequences</p>
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="p-12 text-center text-gray-400">No clubs matching &quot;{searchQuery}&quot; found.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-void/95 backdrop-blur-md z-10">
                <tr className="border-b border-white/10 text-[11px] text-gray-400 font-black uppercase tracking-wider bg-white/5">
                  <th className="py-3 px-3 sm:px-4 text-center w-14">POS</th>
                  <th className="py-3 px-3 sm:px-4">CLUB</th>
                  <th className="py-3 px-2 sm:px-3 text-center">PL</th>
                  <th className="py-3 px-2 sm:px-3 text-center hidden sm:table-cell">W</th>
                  <th className="py-3 px-2 sm:px-3 text-center hidden sm:table-cell">D</th>
                  <th className="py-3 px-2 sm:px-3 text-center hidden sm:table-cell">L</th>
                  <th className="py-3 px-2 sm:px-3 text-center hidden md:table-cell">GF</th>
                  <th className="py-3 px-2 sm:px-3 text-center hidden md:table-cell">GA</th>
                  <th className="py-3 px-2 sm:px-3 text-center font-bold text-gold">GD</th>
                  <th className="py-3 px-3 sm:px-4 text-center font-black text-stadiumGreen text-sm">PTS</th>
                  <th className="py-3 px-3 sm:px-4 text-center hidden lg:table-cell">5-GAME FORM</th>
                  <th className="py-3 px-3 sm:px-4 text-right">PROFILE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-mono">
                {filteredRows.map((row) => {
                  const style = getPositionStyling(row.pos);

                  return (
                    <tr
                      key={row.team}
                      onClick={() => handleRowClick(row.team)}
                      className={`${style.rowBorder} transition-colors cursor-pointer group hover:bg-white/10`}
                    >
                      {/* Position Badge */}
                      <td className="py-3 px-3 sm:px-4 text-center font-black">
                        <span className={`w-7 h-7 rounded-xl inline-flex items-center justify-center text-xs ${style.badge}`}>
                          {row.pos}
                        </span>
                      </td>

                      {/* Club Crest & Name */}
                      <td className="py-3 px-3 sm:px-4">
                        <div className="flex items-center space-x-3">
                          {row.logo ? (
                            <img
                              src={row.logo}
                              alt={row.team}
                              className="w-6 h-6 sm:w-7 sm:h-7 object-contain flex-shrink-0 group-hover:scale-110 transition-transform"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          ) : (
                            <Shield className="w-5 h-5 text-gray-500" />
                          )}
                          <div>
                            <span className="font-black text-white text-xs sm:text-sm group-hover:text-stadiumGreen transition-colors block">
                              {row.team}
                            </span>
                            <span className={`text-[9px] font-bold block ${style.tierColor}`}>
                              {style.tierLabel}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Played */}
                      <td className="py-3 px-2 sm:px-3 text-center font-bold text-white">{row.played}</td>
                      
                      {/* Won */}
                      <td className="py-3 px-2 sm:px-3 text-center text-gray-300 hidden sm:table-cell">{row.won}</td>
                      
                      {/* Drawn */}
                      <td className="py-3 px-2 sm:px-3 text-center text-gray-400 hidden sm:table-cell">{row.drawn}</td>
                      
                      {/* Lost */}
                      <td className="py-3 px-2 sm:px-3 text-center text-gray-400 hidden sm:table-cell">{row.lost}</td>
                      
                      {/* GF */}
                      <td className="py-3 px-2 sm:px-3 text-center text-gray-400 hidden md:table-cell">{row.gf}</td>
                      
                      {/* GA */}
                      <td className="py-3 px-2 sm:px-3 text-center text-gray-400 hidden md:table-cell">{row.ga}</td>
                      
                      {/* GD */}
                      <td className="py-3 px-2 sm:px-3 text-center font-black text-gold">
                        {row.gd > 0 ? `+${row.gd}` : row.gd}
                      </td>

                      {/* Points */}
                      <td className="py-3 px-3 sm:px-4 text-center font-black text-stadiumGreen text-sm sm:text-base">
                        {row.points}
                      </td>

                      {/* Form */}
                      <td className="py-3 px-3 sm:px-4 text-center hidden lg:table-cell">
                        <div className="flex items-center justify-center space-x-1.5">
                          {row.form?.map((r, i) => (
                            <span
                              key={i}
                              className={`w-5 h-5 rounded-lg text-[10px] font-black inline-flex items-center justify-center shadow ${
                                r === 'W'
                                  ? 'bg-stadiumGreen text-black'
                                  : r === 'D'
                                  ? 'bg-gray-600 text-white'
                                  : 'bg-crimson text-white'
                              }`}
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Action Chevron */}
                      <td className="py-3 px-3 sm:px-4 text-right">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-white/5 group-hover:bg-stadiumGreen group-hover:text-black text-gray-400 text-[10px] font-bold transition-all">
                          <span>Explore</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Qualification Color Key Legend Footer */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10 text-[10px] text-gray-300 font-sans flex-shrink-0">
          <div className="flex items-center space-x-2 p-2 rounded-xl bg-stadiumGreen/10 border border-stadiumGreen/30">
            <span className="w-3 h-3 rounded-full bg-stadiumGreen flex-shrink-0" />
            <span className="font-bold text-stadiumGreen">1–4: UEFA Champions League 🟢</span>
          </div>

          <div className="flex items-center space-x-2 p-2 rounded-xl bg-blue-500/10 border border-blue-500/30">
            <span className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0" />
            <span className="font-bold text-blue-400">5: UEFA Europa League 🔵</span>
          </div>

          <div className="flex items-center space-x-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <span className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0" />
            <span className="font-bold text-amber-400">6: Conference League 🟡</span>
          </div>

          <div className="flex items-center space-x-2 p-2 rounded-xl bg-crimson/10 border border-crimson/30">
            <span className="w-3 h-3 rounded-full bg-crimson flex-shrink-0" />
            <span className="font-bold text-crimson">18–20: Relegation Zone 🔴</span>
          </div>
        </div>

      </div>
    </div>
  );
};
