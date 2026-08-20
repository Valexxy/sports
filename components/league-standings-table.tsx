'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

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

export const LeagueStandingsTable: React.FC = () => {
  const [selectedLeague, setSelectedLeague] = useState<'PREMIER_LEAGUE' | 'LA_LIGA' | 'SERIE_A' | 'BUNDESLIGA'>('PREMIER_LEAGUE');
  const [tableData, setTableData] = useState<StandingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);

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
    loadStandings(selectedLeague);
  }, [selectedLeague]);

  return (
    <div className="glass-panel rounded-3xl p-5 border border-white/10 space-y-4 font-mono text-xs shadow-2xl">
      
      {/* Header with Collapsible Toggle */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3 cursor-pointer select-none"
      >
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-gold/20 text-gold border border-gold/40">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-sm text-white flex items-center space-x-2">
              <span>OFFICIAL LEAGUE STANDINGS</span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/30 font-bold">
                DAILY ACCURATE ✓
              </span>
            </h3>
            <span className="text-[10px] text-gray-400 font-sans">Official daily points, goal differences, and form from credible sports feeds</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-stretch sm:self-auto justify-between sm:justify-end">
          {/* League Switcher Tabs (Only clickable when open) */}
          {isOpen && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="flex items-center space-x-1.5 bg-black/50 p-1 rounded-xl border border-white/10 overflow-x-auto"
            >
              {[
                { key: 'PREMIER_LEAGUE', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 PL' },
                { key: 'LA_LIGA', label: '🇪🇸 La Liga' },
                { key: 'SERIE_A', label: '🇮🇹 Serie A' },
                { key: 'BUNDESLIGA', label: '🇩🇪 Bund.' },
              ].map((l) => (
                <button
                  key={l.key}
                  onClick={() => setSelectedLeague(l.key as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    selectedLeague === l.key
                      ? 'bg-stadiumGreen text-black font-black shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          )}

          {/* Toggle Indicator */}
          <div className="flex items-center space-x-1 text-gray-400 text-xs font-bold pl-2 border-l border-white/10">
            <span className="hidden sm:inline">{isOpen ? 'Collapse' : 'Expand'}</span>
            {isOpen ? <ChevronUp className="w-4 h-4 text-stadiumGreen" /> : <ChevronDown className="w-4 h-4 text-gold" />}
          </div>
        </div>
      </div>

      {/* Standings Table Body */}
      {isOpen && (
        <div className="animate-fadeIn">
          {loading ? (
            <div className="p-8 text-center rounded-2xl glass-panel border border-stadiumGreen/20 flex items-center justify-center space-x-2 text-stadiumGreen">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Syncing official standings...</span>
            </div>
          ) : tableData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-panel/80 text-[10px] text-gray-400 font-bold uppercase">
                    <th className="py-2.5 px-3"># Pos</th>
                    <th className="py-2.5 px-4">Club</th>
                    <th className="py-2.5 px-2 text-center">PL</th>
                    <th className="py-2.5 px-2 text-center">W</th>
                    <th className="py-2.5 px-2 text-center">D</th>
                    <th className="py-2.5 px-2 text-center">L</th>
                    <th className="py-2.5 px-2 text-center">GD</th>
                    <th className="py-2.5 px-3 text-center font-black text-white">PTS</th>
                    <th className="py-2.5 px-3 text-center">Form</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {tableData.slice(0, 10).map((row) => (
                    <tr key={row.pos} className="hover:bg-white/5 transition-all">
                      {/* Pos */}
                      <td className="py-2.5 px-3">
                        <span className={`w-5 h-5 rounded-md flex items-center justify-center font-black text-[10px] ${
                          row.pos <= 4 ? 'bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/30' : 'bg-panel text-gray-400'
                        }`}>
                          {row.pos}
                        </span>
                      </td>

                      {/* Club */}
                      <td className="py-2.5 px-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <img src={row.logo} alt="" className="w-5 h-5 object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                          <span className="font-extrabold text-white text-xs">{row.team}</span>
                        </div>
                      </td>

                      <td className="py-2.5 px-2 text-center text-gray-300 font-bold">{row.played}</td>
                      <td className="py-2.5 px-2 text-center text-stadiumGreen font-bold">{row.won}</td>
                      <td className="py-2.5 px-2 text-center text-gold font-bold">{row.drawn}</td>
                      <td className="py-2.5 px-2 text-center text-crimson font-bold">{row.lost}</td>
                      <td className="py-2.5 px-2 text-center font-bold text-gray-300">{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                      
                      {/* Points */}
                      <td className="py-2.5 px-3 text-center font-black text-sm text-stadiumGreen bg-stadiumGreen/10">
                        {row.points}
                      </td>

                      {/* Form Pills */}
                      <td className="py-2.5 px-3 whitespace-nowrap text-center">
                        <div className="inline-flex items-center space-x-1">
                          {row.form.map((f, idx) => (
                            <span
                              key={idx}
                              className={`w-3.5 h-3.5 rounded text-[9px] font-black flex items-center justify-center ${
                                f === 'W' ? 'bg-stadiumGreen text-black' : f === 'D' ? 'bg-gray-600 text-white' : 'bg-crimson text-white'
                              }`}
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-400">
              Standings updated daily following official match completions.
            </div>
          )}
        </div>
      )}

    </div>
  );
};
