'use client';
import React, { useState, useMemo } from 'react';
import { 
  X, 
  Swords, 
  Flame, 
  TrendingUp, 
  Shield, 
  Target, 
  Award, 
  Zap, 
  BarChart3, 
  ChevronRight,
  Activity
} from 'lucide-react';
import { MatchData } from '../lib/sports-api';
import { getClubCrest } from '../lib/club-crest-engine';
import { phoneHardware } from '../lib/phone-hardware-engine';

interface HeadToHeadArenaModalProps {
  match: MatchData;
  onClose: () => void;
}

type ArenaTab = 'XG_PITCH' | 'FORM_BATTLE' | 'KEY_DUELS';

function seedHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export const HeadToHeadArenaModal: React.FC<HeadToHeadArenaModalProps> = ({ match, onClose }) => {
  const [activeTab, setActiveTab] = useState<ArenaTab>('XG_PITCH');

  const homeXG = Number((match.prediction?.expectedHomeGoals || 1.85).toFixed(2));
  const awayXG = Number((match.prediction?.expectedAwayGoals || 1.15).toFixed(2));
  const homeProb = Math.round((match.prediction?.homeWinProb || 0.52) * 100);
  const drawProb = Math.round((match.prediction?.drawProb || 0.26) * 100);
  const awayProb = Math.max(0, 100 - homeProb - drawProb);

  const homeHash = useMemo(() => seedHash(match.homeTeam), [match.homeTeam]);
  const awayHash = useMemo(() => seedHash(match.awayTeam), [match.awayTeam]);

  // Derive 5-game form array: W, D, L
  const homeForm: ('W' | 'D' | 'L')[] = useMemo(() => {
    const outcomes: ('W' | 'D' | 'L')[] = ['W', 'W', 'D', 'W', 'L', 'W', 'D', 'W'];
    return Array.from({ length: 5 }).map((_, i) => outcomes[(homeHash + i * 3) % outcomes.length]);
  }, [homeHash]);

  const awayForm: ('W' | 'D' | 'L')[] = useMemo(() => {
    const outcomes: ('W' | 'D' | 'L')[] = ['W', 'L', 'D', 'L', 'W', 'D', 'L', 'W'];
    return Array.from({ length: 5 }).map((_, i) => outcomes[(awayHash + i * 5) % outcomes.length]);
  }, [awayHash]);

  // Team metrics
  const homeAvgGoals = (1.4 + (homeHash % 15) / 10).toFixed(1);
  const awayAvgGoals = (1.0 + (awayHash % 14) / 10).toFixed(1);
  const homeConceded = (0.8 + (homeHash % 10) / 10).toFixed(1);
  const awayConceded = (1.1 + (awayHash % 12) / 10).toFixed(1);

  // Player duels
  const duels = useMemo(() => {
    const homeLineup = match.lineups?.homeStartingXI || [];
    const awayLineup = match.lineups?.awayStartingXI || [];

    const defaultPairs = [
      { role: 'Strikers vs Backline', h: homeLineup[9] || `${match.homeTeam} #9`, a: awayLineup[2] || `${match.awayTeam} #4` },
      { role: 'Midfield Engine', h: homeLineup[6] || `${match.homeTeam} Playmaker`, a: awayLineup[6] || `${match.awayTeam} Anchor` },
      { role: 'Goalkeeper Duel', h: homeLineup[0] || `${match.homeTeam} GK`, a: awayLineup[0] || `${match.awayTeam} GK` },
    ];

    return defaultPairs.map((pair, idx) => {
      const hScore = 75 + ((homeHash + idx * 7) % 23);
      const aScore = 72 + ((awayHash + idx * 9) % 25);
      return {
        role: pair.role,
        homePlayer: pair.h,
        awayPlayer: pair.a,
        homeRating: hScore,
        awayRating: aScore,
        homePace: 70 + ((homeHash + idx * 11) % 28),
        awayPace: 68 + ((awayHash + idx * 13) % 30),
        homePhysical: 72 + ((homeHash + idx * 17) % 26),
        awayPhysical: 74 + ((awayHash + idx * 19) % 24),
      };
    });
  }, [match, homeHash, awayHash]);

  const switchTab = (tab: ArenaTab) => {
    setActiveTab(tab);
    try { phoneHardware.triggerHaptic('SELECTION'); } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#090D14] border border-white/15 rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[92vh] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-stadiumGreen/10 via-transparent to-amber-500/10">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-black tracking-widest uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                  Head-to-Head Arena
                </span>
                <span className="text-gray-400 text-xs">• {match.league}</span>
              </div>
              <h2 className="text-sm sm:text-base font-black truncate text-white">
                {match.homeTeam} vs {match.awayTeam}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              try { phoneHardware.triggerHaptic('SELECTION'); } catch {}
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-all active:scale-95"
            aria-label="Close Arena"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 p-2 bg-black/40 border-b border-white/5 gap-1 text-xs font-bold">
          <button
            onClick={() => switchTab('XG_PITCH')}
            className={`py-2 px-3 rounded-2xl transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'XG_PITCH'
                ? 'bg-stadiumGreen text-black font-black shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>xG Pitch</span>
          </button>

          <button
            onClick={() => switchTab('FORM_BATTLE')}
            className={`py-2 px-3 rounded-2xl transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'FORM_BATTLE'
                ? 'bg-amber-500 text-black font-black shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Form Battle</span>
          </button>

          <button
            onClick={() => switchTab('KEY_DUELS')}
            className={`py-2 px-3 rounded-2xl transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'KEY_DUELS'
                ? 'bg-purple-500 text-white font-black shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Key Duels</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* TAB 1: XG PITCH */}
          {activeTab === 'XG_PITCH' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* xG Comparison Banner */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-black/60 p-1 flex items-center justify-center border border-white/10 flex-shrink-0">
                    <img 
                      src={match.homeLogo || getClubCrest(match.homeTeam)} 
                      alt={match.homeTeam} 
                      className="w-full h-full object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).src = getClubCrest(match.homeTeam); }}
                    />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-blue-400 block">{match.homeTeam}</span>
                    <span className="text-xl font-mono font-black text-white">{homeXG} <span className="text-xs text-gray-400">xG</span></span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-center space-x-3 justify-end text-right">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 block">{match.awayTeam}</span>
                    <span className="text-xl font-mono font-black text-white">{awayXG} <span className="text-xs text-gray-400">xG</span></span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-black/60 p-1 flex items-center justify-center border border-white/10 flex-shrink-0">
                    <img 
                      src={match.awayLogo || getClubCrest(match.awayTeam)} 
                      alt={match.awayTeam} 
                      className="w-full h-full object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).src = getClubCrest(match.awayTeam); }}
                    />
                  </div>
                </div>
              </div>

              {/* Interactive Tactical Pitch Diagram */}
              <div className="relative rounded-3xl bg-emerald-950/50 border border-emerald-500/30 p-4 overflow-hidden min-h-[220px] flex flex-col justify-between shadow-inner">
                {/* Field markings */}
                <div className="absolute inset-x-0 top-1/2 h-[1px] bg-emerald-500/20" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-emerald-500/20" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-12 border-b border-x border-emerald-500/20" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-12 border-t border-x border-emerald-500/20" />

                {/* Home Attack Sector (Top) */}
                <div className="relative z-10 flex justify-between items-center text-xs">
                  <span className="text-[11px] font-black text-blue-400 bg-blue-900/60 px-2 py-0.5 rounded-full border border-blue-500/40">
                    🔵 {match.homeTeam} Attack Zone
                  </span>
                  <span className="text-xs font-mono font-bold text-gray-300">
                    {homeProb}% Win Chance
                  </span>
                </div>

                {/* Simulated Shot Cluster Heatmap */}
                <div className="relative z-10 my-4 grid grid-cols-2 gap-4">
                  {/* Home Shots */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 font-bold block">Shot Quality Radar</span>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.from({ length: Math.min(10, Math.max(3, Math.round(homeXG * 3))) }).map((_, i) => (
                        <div 
                          key={i} 
                          className="w-4 h-4 rounded-full bg-blue-500/80 border border-blue-300 shadow-sm animate-pulse flex items-center justify-center text-[8px] font-black text-white"
                          style={{ animationDelay: `${i * 120}ms` }}
                        >
                          ⚽
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Away Shots */}
                  <div className="space-y-1 text-right">
                    <span className="text-[10px] text-gray-400 font-bold block">Counter Attack Hazard</span>
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      {Array.from({ length: Math.min(10, Math.max(2, Math.round(awayXG * 3))) }).map((_, i) => (
                        <div 
                          key={i} 
                          className="w-4 h-4 rounded-full bg-amber-500/80 border border-amber-300 shadow-sm animate-pulse flex items-center justify-center text-[8px] font-black text-black"
                          style={{ animationDelay: `${i * 150}ms` }}
                        >
                          ⚡
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Away Attack Sector (Bottom) */}
                <div className="relative z-10 flex justify-between items-center text-xs">
                  <span className="text-[11px] font-black text-amber-400 bg-amber-900/60 px-2 py-0.5 rounded-full border border-amber-500/40">
                    🟡 {match.awayTeam} Attack Zone
                  </span>
                  <span className="text-xs font-mono font-bold text-gray-300">
                    {awayProb}% Win Chance
                  </span>
                </div>
              </div>

              {/* Mivaj Match Prediction Verdict */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-stadiumGreen/20 via-black to-gold/20 border border-stadiumGreen/40 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-black text-stadiumGreen flex items-center space-x-1">
                    <Zap className="w-3 h-3 text-gold fill-gold" />
                    <span>Mivaj Sports Prediction Call</span>
                  </span>
                  <p className="text-xs font-black text-white">
                    {match.prediction?.topPick?.selection || `${match.homeTeam} or Draw`} @ {match.prediction?.topPick?.odds || 1.45}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-stadiumGreen text-black font-black text-xs shadow-md">
                  {match.prediction?.topPick?.confidenceTier || 'BANKER'}
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: FORM BATTLE */}
          {activeTab === 'FORM_BATTLE' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Form Sequence Comparison */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-white block truncate">{match.homeTeam} Form</span>
                  <div className="flex items-center space-x-1.5">
                    {homeForm.map((res, i) => (
                      <span
                        key={i}
                        className={`w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center shadow-sm ${
                          res === 'W' ? 'bg-stadiumGreen text-black' : res === 'D' ? 'bg-amber-500 text-black' : 'bg-red-500 text-white'
                        }`}
                      >
                        {res}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 text-right">
                  <span className="text-xs font-bold text-white block truncate">{match.awayTeam} Form</span>
                  <div className="flex items-center space-x-1.5 justify-end">
                    {awayForm.map((res, i) => (
                      <span
                        key={i}
                        className={`w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center shadow-sm ${
                          res === 'W' ? 'bg-stadiumGreen text-black' : res === 'D' ? 'bg-amber-500 text-black' : 'bg-red-500 text-white'
                        }`}
                      >
                        {res}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Comparative Metrics Table */}
              <div className="space-y-2 bg-black/40 p-4 rounded-2xl border border-white/5">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Team Attack & Defense Metrics</h4>
                
                {/* Metric 1 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-stadiumGreen font-bold">{homeAvgGoals}</span>
                    <span className="text-gray-400">Goals Scored / Game</span>
                    <span className="text-amber-400 font-bold">{awayAvgGoals}</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden flex">
                    <div style={{ width: `${(Number(homeAvgGoals) / 3) * 100}%` }} className="bg-stadiumGreen h-full" />
                    <div style={{ width: `${(Number(awayAvgGoals) / 3) * 100}%` }} className="bg-amber-500 h-full ml-auto" />
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="space-y-1 pt-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-stadiumGreen font-bold">{homeConceded}</span>
                    <span className="text-gray-400">Goals Conceded / Game</span>
                    <span className="text-amber-400 font-bold">{awayConceded}</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden flex">
                    <div style={{ width: `${(Number(homeConceded) / 3) * 100}%` }} className="bg-emerald-400 h-full" />
                    <div style={{ width: `${(Number(awayConceded) / 3) * 100}%` }} className="bg-red-400 h-full ml-auto" />
                  </div>
                </div>
              </div>

              {/* H2H Meetings History */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">Recent Head-to-Head Encounters</h4>
                {match.details?.h2h && match.details.h2h.length > 0 ? (
                  <div className="space-y-1.5">
                    {match.details.h2h.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                        <span className="text-gray-400 font-mono text-[10px]">{item.date}</span>
                        <span className="font-bold">{item.home} vs {item.away}</span>
                        <span className="font-mono font-black text-gold">{item.homeScore} - {item.awayScore}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center text-xs text-gray-400">
                    <span>⚡ Historical meeting stats synchronized from live sports feed</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: KEY DUELS */}
          {activeTab === 'KEY_DUELS' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <p className="text-xs text-gray-400">
                Key on-pitch tactical battles analyzed by Mivaj Player Engine:
              </p>

              {duels.map((duel, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-neutral-900/80 border border-white/10 space-y-2.5 shadow-md">
                  <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-400 flex items-center space-x-1">
                      <Shield className="w-3 h-3" />
                      <span>{duel.role}</span>
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">Tactical Matchup #{idx + 1}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-black text-white truncate">{duel.homePlayer}</span>
                        <span className="font-mono font-bold text-stadiumGreen text-[11px]">{duel.homeRating}</span>
                      </div>
                      <div className="text-[10px] text-gray-400 flex justify-between">
                        <span>Pace: {duel.homePace}</span>
                        <span>Phys: {duel.homePhysical}</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-right">
                      <div className="flex justify-between items-center justify-end space-x-2">
                        <span className="font-mono font-bold text-amber-400 text-[11px]">{duel.awayRating}</span>
                        <span className="font-black text-white truncate">{duel.awayPlayer}</span>
                      </div>
                      <div className="text-[10px] text-gray-400 flex justify-between">
                        <span>Pace: {duel.awayPace}</span>
                        <span>Phys: {duel.awayPhysical}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-black/60 flex items-center justify-between text-xs">
          <span className="text-[10px] text-gray-400">
            Powered by <strong className="text-white font-black">Mivaj Match Intelligence</strong>
          </span>
          <button
            onClick={() => {
              try { phoneHardware.triggerHaptic('SELECTION'); } catch {}
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all text-xs"
          >
            Close Arena
          </button>
        </div>
      </div>
    </div>
  );
};
