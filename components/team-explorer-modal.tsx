'use client';
import React, { useState } from 'react';
import { TEAMS_DATABASE, TeamInfo } from '../lib/teams-database';
import { fetchFreeTeamMetadata } from '../lib/free-open-data';
import { X, Search, Shield, User, Trophy, Activity, Calendar, Zap, RefreshCw } from 'lucide-react';

interface TeamExplorerModalProps {
  onClose: () => void;
}

export const TeamExplorerModal: React.FC<TeamExplorerModalProps> = ({ onClose }) => {
  const [search, setSearch] = useState('');
  const [selectedSport, setSelectedSport] = useState<'ALL' | 'SOCCER' | 'BASKETBALL' | 'TENNIS'>('ALL');
  const [selectedTeam, setSelectedTeam] = useState<TeamInfo>(TEAMS_DATABASE[0]);
  const [loadingOpenData, setLoadingOpenData] = useState(false);
  const [openDataResult, setOpenDataResult] = useState<string | null>(null);

  const filteredTeams = TEAMS_DATABASE.filter((t) => {
    if (selectedSport !== 'ALL' && t.sport !== selectedSport) return false;
    return t.name.toLowerCase().includes(search.toLowerCase()) ||
           t.league.toLowerCase().includes(search.toLowerCase()) ||
           t.starPlayer.toLowerCase().includes(search.toLowerCase());
  });

  const handleFetchOpenData = async (teamName: string) => {
    setLoadingOpenData(true);
    setOpenDataResult(null);
    const data = await fetchFreeTeamMetadata(teamName);
    setLoadingOpenData(false);
    if (data) {
      setOpenDataResult(`Verified Open Data: ${data.stadiumName} (Capacity: ${data.stadiumCapacity}) • Founded: ${data.foundedYear}`);
    } else {
      setOpenDataResult('Local In-Memory Edge Database active.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-panel rounded-3xl border border-stadiumGreen/50 p-6 shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-panel text-gray-400 hover:text-white border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-2 text-xs font-mono text-stadiumGreen font-bold mb-1">
          <Shield className="w-4 h-4" />
          <span>FREE OPEN DATA CLUB EXPLORER (THESPORTSDB & WIKIDATA)</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white mb-4">TEAMS, CLUBS & ATHLETES DIRECTORY</h2>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search club, player, or stadium..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-gray-500 focus:border-stadiumGreen focus:outline-none font-mono"
            />
          </div>

          <div className="flex items-center space-x-1 font-mono text-xs">
            {(['ALL', 'SOCCER', 'BASKETBALL', 'TENNIS'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSport(s)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  selectedSport === s ? 'bg-stadiumGreen text-black' : 'bg-panel text-gray-400 border border-white/10'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Layout: Left List + Right Detailed Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Left Column: Team List */}
          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1 md:col-span-1">
            {filteredTeams.map((t) => (
              <div
                key={t.id}
                onClick={() => {
                  setSelectedTeam(t);
                  handleFetchOpenData(t.name);
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between font-mono text-xs ${
                  selectedTeam.id === t.id
                    ? 'bg-stadiumGreen/20 border-stadiumGreen text-white font-bold'
                    : 'bg-panel border-white/5 text-gray-300 hover:border-white/20'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{t.logo}</span>
                  <div>
                    <span className="block font-bold text-white">{t.name}</span>
                    <span className="text-[10px] text-gray-400">{t.league}</span>
                  </div>
                </div>
                <span className="text-stadiumGreen font-bold text-[11px]">{t.winRatePercent}%</span>
              </div>
            ))}
          </div>

          {/* Right Column: Detailed Selected Team Card */}
          <div className="p-5 rounded-2xl bg-panel/90 border border-white/10 md:col-span-2 space-y-4 font-mono text-xs">
            
            {/* Header Title */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-3">
                <span className="text-4xl">{selectedTeam.logo}</span>
                <div>
                  <span className="text-gray-400 text-[10px] block">{selectedTeam.flag} {selectedTeam.league}</span>
                  <h3 className="text-lg font-black text-white">{selectedTeam.name} ({selectedTeam.shortName})</h3>
                </div>
              </div>
              <button
                onClick={() => handleFetchOpenData(selectedTeam.name)}
                className="px-2.5 py-1 rounded bg-stadiumGreen/20 text-stadiumGreen font-mono text-[10px] font-bold border border-stadiumGreen/40 hover:bg-stadiumGreen/30 transition-all flex items-center space-x-1"
              >
                <RefreshCw className={`w-3 h-3 ${loadingOpenData ? 'animate-spin' : ''}`} />
                <span>Fetch Open Data</span>
              </button>
            </div>

            {/* Open Data Engine Status Banner */}
            {openDataResult && (
              <div className="p-2.5 rounded-xl bg-stadiumGreen/10 border border-stadiumGreen/30 text-stadiumGreen text-[11px] font-sans">
                {openDataResult}
              </div>
            )}

            {/* Stadium & Coach Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-black/50 border border-white/5">
                <span className="text-gray-400 text-[10px] block font-semibold">STADIUM / VENUE</span>
                <span className="font-bold text-white text-xs">{selectedTeam.stadium}</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">Capacity: {selectedTeam.capacity}</span>
              </div>

              <div className="p-3 rounded-xl bg-black/50 border border-white/5">
                <span className="text-gray-400 text-[10px] block font-semibold">STAR PLAYER / COACH</span>
                <span className="font-bold text-gold text-xs">{selectedTeam.starPlayer}</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">Manager: {selectedTeam.manager}</span>
              </div>
            </div>

            {/* Recent Form & Goal Power Metrics */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-bold">RECENT FORM (LAST 5):</span>
                <div className="flex space-x-1">
                  {selectedTeam.recentForm.map((f, i) => (
                    <span
                      key={i}
                      className={`w-6 h-6 rounded flex items-center justify-center font-bold text-[11px] ${
                        f === 'W' ? 'bg-stadiumGreen text-black' : f === 'D' ? 'bg-gold text-black' : 'bg-crimson text-white'
                      }`}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-2.5 rounded-xl bg-stadiumGreen/10 border border-stadiumGreen/30">
                  <span className="text-gray-400 block text-[10px]">GOAL POWER RATING (ATTACK)</span>
                  <span className="text-base font-black text-stadiumGreen">{selectedTeam.attackRating}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-cyberPurple/10 border border-cyberPurple/30">
                  <span className="text-gray-400 block text-[10px]">DEFENSIVE RATING</span>
                  <span className="text-base font-black text-cyberPurple">{selectedTeam.defenseRating}</span>
                </div>
              </div>
            </div>

            {/* Upcoming Match Tag */}
            <div className="p-3 rounded-xl bg-gold/10 border border-gold/30 flex justify-between items-center">
              <div>
                <span className="text-gray-400 block text-[10px]">NEXT UPCOMING FIXTURE</span>
                <strong className="text-white font-bold">{selectedTeam.nextMatch}</strong>
              </div>
              <span className="text-gold font-bold">100% FREE Engine ⚡</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
