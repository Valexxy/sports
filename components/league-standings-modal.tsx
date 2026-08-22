'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, X, RefreshCw, ChevronRight, Shield, Star } from 'lucide-react';
import { useTranslation } from '../lib/translation-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';

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
}

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
}) => {
  const { t } = useTranslation();
  const [selectedLeague, setSelectedLeague] = useState<string>('PREMIER_LEAGUE');
  const [tableData, setTableData] = useState<StandingRow[]>([]);
  const [loading, setLoading] = useState(true);

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

  const loadStandings = async (leagueKey: string) => {
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
      loadStandings(selectedLeague);
      stadiumAudio.playDataSwoosh();
    }
  }, [selectedLeague, isOpen]);

  if (!isOpen) return null;

  const currentLeagueObj = LEAGUES.find((l) => l.key === selectedLeague) || LEAGUES[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-5 animate-fadeIn font-mono text-xs">
      <div className="relative w-full max-w-4xl glass-panel-premium rounded-3xl border-2 border-stadiumGreen/60 p-4 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-2xl bg-gradient-to-tr from-stadiumGreen to-gold text-black font-black">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base">{currentLeagueObj.flag}</span>
                <h2 className="font-black text-sm sm:text-base text-white">
                  {currentLeagueObj.label.toUpperCase()} STANDINGS 🏆
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-stadiumGreen/20 text-stadiumGreen font-black text-[9px] border border-stadiumGreen/30">
                  OFFICIAL TABLE
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-sans mt-0.5">
                Full 20-team match statistics, goal differences, points and 5-game form
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-panel text-gray-400 hover:text-white border border-white/10 hover:border-stadiumGreen transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* League Selector Switcher */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none flex-shrink-0">
          {LEAGUES.map((l) => (
            <button
              key={l.key}
              onClick={() => {
                setSelectedLeague(l.key);
                stadiumAudio.playTabClickSound();
              }}
              className={`px-3 py-1.5 rounded-2xl text-xs font-black transition-all flex items-center space-x-1.5 flex-shrink-0 ${
                selectedLeague === l.key
                  ? 'bg-stadiumGreen text-black shadow-lg shadow-stadiumGreen/20 scale-105'
                  : 'bg-black/50 text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              <span>{l.flag}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>

        {/* Standings Table Body */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-black/60 scrollbar-thin">
          {loading ? (
            <div className="p-12 text-center text-gray-400 flex flex-col items-center space-y-3">
              <RefreshCw className="w-6 h-6 text-stadiumGreen animate-spin" />
              <span className="font-black text-xs text-white">Loading Official {currentLeagueObj.label} Table...</span>
            </div>
          ) : tableData.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No standings data available.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[10px] text-gray-400 font-bold bg-white/5 uppercase">
                  <th className="py-2.5 px-3 text-center w-10">#</th>
                  <th className="py-2.5 px-3">Club</th>
                  <th className="py-2.5 px-2 text-center">PL</th>
                  <th className="py-2.5 px-2 text-center hidden sm:table-cell">W</th>
                  <th className="py-2.5 px-2 text-center hidden sm:table-cell">D</th>
                  <th className="py-2.5 px-2 text-center hidden sm:table-cell">L</th>
                  <th className="py-2.5 px-2 text-center">GD</th>
                  <th className="py-2.5 px-3 text-center font-black text-stadiumGreen">PTS</th>
                  <th className="py-2.5 px-3 text-center hidden md:table-cell">Form</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {tableData.map((row) => (
                  <tr
                    key={row.team}
                    className={`hover:bg-white/5 transition-colors ${
                      row.pos <= 4 ? 'bg-stadiumGreen/5' : row.pos >= 18 ? 'bg-crimson/5' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 text-center font-black">
                      <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-[10px] ${
                        row.pos <= 4 ? 'bg-stadiumGreen text-black' : row.pos >= 18 ? 'bg-crimson text-white' : 'text-gray-400'
                      }`}>
                        {row.pos}
                      </span>
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="flex items-center space-x-2.5">
                        {row.logo ? (
                          <img src={row.logo} alt={row.team} className="w-5 h-5 object-contain flex-shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        ) : (
                          <Shield className="w-4 h-4 text-gray-500" />
                        )}
                        <span className="font-black text-white">{row.team}</span>
                      </div>
                    </td>

                    <td className="py-2.5 px-2 text-center font-mono">{row.played}</td>
                    <td className="py-2.5 px-2 text-center font-mono text-gray-300 hidden sm:table-cell">{row.won}</td>
                    <td className="py-2.5 px-2 text-center font-mono text-gray-400 hidden sm:table-cell">{row.drawn}</td>
                    <td className="py-2.5 px-2 text-center font-mono text-gray-400 hidden sm:table-cell">{row.lost}</td>
                    <td className="py-2.5 px-2 text-center font-mono font-bold text-gold">{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                    <td className="py-2.5 px-3 text-center font-black font-mono text-stadiumGreen text-sm">{row.points}</td>

                    <td className="py-2.5 px-3 text-center hidden md:table-cell">
                      <div className="flex items-center justify-center space-x-1">
                        {row.form?.map((r, i) => (
                          <span
                            key={i}
                            className={`w-4 h-4 rounded text-[9px] font-black inline-flex items-center justify-center ${
                              r === 'W' ? 'bg-stadiumGreen text-black' : r === 'D' ? 'bg-gray-600 text-white' : 'bg-crimson text-white'
                            }`}
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-[10px] text-gray-400 border-t border-white/10 pt-2 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-stadiumGreen inline-block" />
            <span>Top 4: UEFA Champions League Qualification</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stadiumGreen text-black font-black text-xs hover:bg-emerald-400 transition-all"
          >
            Close Table ➔
          </button>
        </div>

      </div>
    </div>
  );
};
