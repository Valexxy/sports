'use client';
import React, { useState, useEffect } from 'react';
import { Trophy, Activity, ArrowRightLeft, ShieldAlert, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface MatchIntelligenceDrawerProps {
  homeTeam: string;
  awayTeam: string;
  league: string;
}

interface SidelinedPlayer {
  id: string;
  playerName: string;
  team: string;
  position: string;
  status: 'RULED_OUT' | 'DOUBTFUL' | 'SUSPENDED';
  injuryType: string;
  expectedReturn: string;
}

interface TransferItem {
  id: string;
  playerName: string;
  fromTeam: string;
  toTeam: string;
  fee: string;
  position: string;
}

export const MatchIntelligenceDrawer: React.FC<MatchIntelligenceDrawerProps> = ({
  homeTeam,
  awayTeam,
  league,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'STANDINGS' | 'INJURIES' | 'TRANSFERS'>('STANDINGS');
  const [injuries, setInjuries] = useState<SidelinedPlayer[]>([]);
  const [transfers, setTransfers] = useState<TransferItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);

    Promise.allSettled([
      fetch('/api/v1/injuries').then((r) => (r.ok ? r.json() : null)),
      fetch('/api/v1/transfers').then((r) => (r.ok ? r.json() : null)),
    ]).then(([injRes, transRes]) => {
      if (!isMounted) return;

      const homeLower = homeTeam.toLowerCase();
      const awayLower = awayTeam.toLowerCase();

      // Filter injuries for both clubs
      if (injRes.status === 'fulfilled' && injRes.value?.data) {
        const allInjuries: SidelinedPlayer[] = injRes.value.data;
        const matchInjuries = allInjuries.filter(
          (p) =>
            p.team.toLowerCase().includes(homeLower) ||
            homeLower.includes(p.team.toLowerCase()) ||
            p.team.toLowerCase().includes(awayLower) ||
            awayLower.includes(p.team.toLowerCase())
        );
        setInjuries(matchInjuries);
      }

      // Filter transfers for both clubs
      if (transRes.status === 'fulfilled' && transRes.value?.data) {
        const allTransfers: TransferItem[] = transRes.value.data;
        const matchTransfers = allTransfers.filter(
          (t) =>
            t.fromTeam.toLowerCase().includes(homeLower) ||
            t.toTeam.toLowerCase().includes(homeLower) ||
            t.fromTeam.toLowerCase().includes(awayLower) ||
            t.toTeam.toLowerCase().includes(awayLower)
        );
        setTransfers(matchTransfers);
      }

      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, homeTeam, awayTeam]);

  // Pseudo-rank estimation based on team name hash for realistic table preview
  const getTeamRank = (name: string): { rank: number; pts: number; gd: number; form: string[] } => {
    const lower = name.toLowerCase();
    if (lower.includes('manchester city') || lower.includes('real madrid')) return { rank: 1, pts: 6, gd: +5, form: ['W', 'W', 'W', 'W', 'W'] };
    if (lower.includes('arsenal') || lower.includes('barcelona')) return { rank: 2, pts: 6, gd: +4, form: ['W', 'W', 'W', 'D', 'W'] };
    if (lower.includes('liverpool') || lower.includes('bayern')) return { rank: 3, pts: 6, gd: +4, form: ['W', 'W', 'W', 'W', 'D'] };
    if (lower.includes('chelsea') || lower.includes('juventus')) return { rank: 7, pts: 3, gd: +2, form: ['W', 'L', 'W', 'W', 'D'] };
    if (lower.includes('manchester united') || lower.includes('milan')) return { rank: 9, pts: 3, gd: 0, form: ['L', 'W', 'W', 'L', 'W'] };
    if (lower.includes('tottenham') || lower.includes('dortmund')) return { rank: 5, pts: 4, gd: +3, form: ['W', 'D', 'W', 'L', 'W'] };

    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) % 1000;
    const rank = (hash % 14) + 4;
    return { rank, pts: Math.max(1, 10 - Math.floor(rank / 2)), gd: Math.floor((10 - rank) / 2), form: ['W', 'D', 'L', 'W', 'D'] };
  };

  const homeData = getTeamRank(homeTeam);
  const awayData = getTeamRank(awayTeam);

  return (
    <div className="mt-2 border-t border-white/10 pt-2 font-mono" onClick={(e) => e.stopPropagation()}>
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-bold transition-all text-gray-300 hover:text-white"
      >
        <div className="flex items-center space-x-2">
          <span className="text-amber-400">📊</span>
          <span className="text-[11px] font-black uppercase tracking-wider text-gray-200">
            MATCH INTEL &bull; STANDINGS &bull; INJURIES &bull; TRANSFERS
          </span>
        </div>
        <div className="flex items-center space-x-1 text-stadiumGreen text-[10px]">
          <span>{isOpen ? 'Close' : 'View'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {/* Expanded Accordion Panel */}
      {isOpen && (
        <div className="mt-2 p-3 rounded-2xl bg-black/80 border border-white/15 space-y-3 animate-fadeIn">
          {/* Segmented Tab Headers */}
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-panel border border-white/10 text-[10px] font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('STANDINGS')}
              className={`py-1 rounded-lg flex items-center justify-center space-x-1 transition-all ${
                activeTab === 'STANDINGS'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Trophy className="w-3 h-3 text-amber-400" />
              <span>Standings</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('INJURIES')}
              className={`py-1 rounded-lg flex items-center justify-center space-x-1 transition-all ${
                activeTab === 'INJURIES'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Activity className="w-3 h-3 text-red-400" />
              <span>Injuries ({injuries.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('TRANSFERS')}
              className={`py-1 rounded-lg flex items-center justify-center space-x-1 transition-all ${
                activeTab === 'TRANSFERS'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <ArrowRightLeft className="w-3 h-3 text-emerald-400" />
              <span>Transfers ({transfers.length})</span>
            </button>
          </div>

          {/* TAB 1: STANDINGS COMPARISON */}
          {activeTab === 'STANDINGS' && (
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-[10px] text-gray-400 border-b border-white/10 pb-1">
                <span>CLUB COMPARISON</span>
                <Link href="/standings" className="text-amber-400 hover:underline flex items-center space-x-1">
                  <span>Full Table</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Home Club */}
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white truncate text-[11px]">{homeTeam}</span>
                    <span className="text-amber-400 font-mono font-black text-xs">#{homeData.rank}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>Points: <strong className="text-white">{homeData.pts} pts</strong></span>
                    <span>GD: <strong className="text-white">{homeData.gd > 0 ? `+${homeData.gd}` : homeData.gd}</strong></span>
                  </div>
                  <div className="flex items-center space-x-1 pt-1">
                    <span className="text-[9px] text-gray-500 mr-1">Form:</span>
                    {homeData.form.map((res, i) => (
                      <span
                        key={i}
                        className={`w-3.5 h-3.5 rounded text-[8px] font-black flex items-center justify-center ${
                          res === 'W' ? 'bg-stadiumGreen text-black' : res === 'D' ? 'bg-gray-600 text-white' : 'bg-red-500 text-white'
                        }`}
                      >
                        {res}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Away Club */}
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white truncate text-[11px]">{awayTeam}</span>
                    <span className="text-amber-400 font-mono font-black text-xs">#{awayData.rank}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>Points: <strong className="text-white">{awayData.pts} pts</strong></span>
                    <span>GD: <strong className="text-white">{awayData.gd > 0 ? `+${awayData.gd}` : awayData.gd}</strong></span>
                  </div>
                  <div className="flex items-center space-x-1 pt-1">
                    <span className="text-[9px] text-gray-500 mr-1">Form:</span>
                    {awayData.form.map((res, i) => (
                      <span
                        key={i}
                        className={`w-3.5 h-3.5 rounded text-[8px] font-black flex items-center justify-center ${
                          res === 'W' ? 'bg-stadiumGreen text-black' : res === 'D' ? 'bg-gray-600 text-white' : 'bg-red-500 text-white'
                        }`}
                      >
                        {res}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INJURIES & SIDELINED */}
          {activeTab === 'INJURIES' && (
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-[10px] text-gray-400 border-b border-white/10 pb-1">
                <span>SIDELINED &amp; DOUBTFUL SQUAD MEMBERS</span>
                <Link href="/injuries" className="text-red-400 hover:underline flex items-center space-x-1">
                  <span>Hospital Wire</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </Link>
              </div>

              {injuries.length === 0 ? (
                <div className="py-3 text-center text-[11px] text-gray-400">
                  <span>🟢 Both squads report full fitness with zero major absences.</span>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {injuries.map((inj) => (
                    <div
                      key={inj.id}
                      className="p-2 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-[11px]"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-white truncate">{inj.playerName}</span>
                          <span className="text-[9px] text-gray-400">({inj.team})</span>
                        </div>
                        <span className="text-[10px] text-red-300 font-sans block">{inj.injuryType}</span>
                      </div>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                          inj.status === 'RULED_OUT'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {inj.status === 'RULED_OUT' ? 'Out' : 'Doubtful'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SQUAD TRANSFERS */}
          {activeTab === 'TRANSFERS' && (
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-[10px] text-gray-400 border-b border-white/10 pb-1">
                <span>RECENT HIGH-PROFILE TRANSFERS</span>
                <Link href="/transfers" className="text-emerald-400 hover:underline flex items-center space-x-1">
                  <span>Transfer Radar</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </Link>
              </div>

              {transfers.length === 0 ? (
                <div className="py-3 text-center text-[11px] text-gray-400">
                  <span>💰 No major blockbuster departures recorded in current window for this fixture.</span>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {transfers.map((tr) => (
                    <div
                      key={tr.id}
                      className="p-2 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-[11px]"
                    >
                      <div className="min-w-0">
                        <span className="font-bold text-white truncate block">{tr.playerName}</span>
                        <span className="text-[10px] text-gray-400 font-sans block">
                          {tr.fromTeam} ➔ <strong className="text-emerald-400">{tr.toTeam}</strong>
                        </span>
                      </div>
                      <span className="text-emerald-400 font-mono font-bold text-xs">{tr.fee}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
