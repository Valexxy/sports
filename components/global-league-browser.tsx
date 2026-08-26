'use client';
import React, { useState } from 'react';
import { 
  Globe, 
  X, 
  Search, 
  Star, 
  Trophy, 
  ChevronRight, 
  Flame,
  Table,
  Zap
} from 'lucide-react';
import { GLOBAL_LEAGUES_CATALOG, LeagueInfo } from '../lib/league-badges';
import { useTranslation } from '../lib/translation-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';
import { phoneHardware } from '../lib/phone-hardware-engine';

interface GlobalLeagueBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLeague: (leagueName: string) => void;
  onOpenStandings?: (leagueName: string) => void;
  followedLeagues: string[];
  onToggleFollowLeague: (leagueId: string) => void;
}

export const GlobalLeagueBrowser: React.FC<GlobalLeagueBrowserProps> = ({
  isOpen,
  onClose,
  onSelectLeague,
  onOpenStandings,
  followedLeagues = [],
  onToggleFollowLeague,
}) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<'ALL' | 'EUROPE' | 'AFRICA' | 'AMERICAS' | 'ASIA_MIDDLE_EAST' | 'GLOBAL'>('ALL');
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const filteredLeagues = GLOBAL_LEAGUES_CATALOG.filter((l) => {
    if (selectedRegion !== 'ALL' && l.region !== selectedRegion) return false;
    return (
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.country.toLowerCase().includes(search.toLowerCase()) ||
      l.shortName.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleFilterMatches = (leagueName: string) => {
    phoneHardware.triggerHaptic('SELECTION');
    stadiumAudio.playTabClickSound();
    onSelectLeague(leagueName);
    onClose();
  };

  const handleViewStandings = (e: React.MouseEvent, leagueName: string) => {
    e.stopPropagation();
    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.playBookmarkSound();
    if (onOpenStandings) {
      onOpenStandings(leagueName);
    } else {
      onSelectLeague(leagueName);
    }
    onClose();
  };

  const handleFollowClick = (e: React.MouseEvent, leagueId: string) => {
    e.stopPropagation();
    phoneHardware.triggerHaptic('SELECTION');
    stadiumAudio.playBookmarkSound();
    onToggleFollowLeague(leagueId);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-6 animate-fadeIn font-mono text-xs">
      <div className="relative w-full max-w-5xl h-[92vh] bg-[#0a0d14] rounded-3xl border-2 border-stadiumGreen/60 p-4 sm:p-6 shadow-2xl flex flex-col space-y-4 text-white">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-stadiumGreen via-gold to-cyberPurple text-black font-black shadow-lg">
              <Globe className="w-6 h-6 text-black" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-black text-base sm:text-xl text-white tracking-wider">
                  GLOBAL LEAGUES &amp; COUNTRIES 🌍
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-stadiumGreen text-black font-black text-[10px]">
                  35+ WORLD LEAGUES
                </span>
              </div>
              <p className="text-xs text-gray-400 font-sans mt-0.5">
                Browse, follow and filter all domestic &amp; international competitions across Europe, Africa, Americas, and Asia
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-panel text-gray-400 hover:text-white border border-white/10 hover:border-stadiumGreen transition-all flex-shrink-0"
            title="Close Browser"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 🔥 HOTTEST LEAGUES ROW */}
        <div className="space-y-1.5 flex-shrink-0">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-1.5">
              <Flame className="w-4 h-4 text-crimson animate-pulse" />
              <span className="text-xs font-black text-white uppercase tracking-wider">HOTTEST LEAGUES TODAY</span>
              <span className="px-1.5 py-0.2 rounded bg-crimson text-white font-black text-[9px]">TRENDING</span>
            </div>
            <span className="text-[10px] text-gray-400 font-sans">Click to Filter or View Table</span>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'premier-league', name: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', logo: 'https://crests.football-data.org/PL.png' },
              { id: 'la-liga', name: 'La Liga', flag: '🇪🇸', logo: 'https://crests.football-data.org/PD.png' },
              { id: 'uefa-cl', name: 'Champions League', flag: '⭐', logo: 'https://crests.football-data.org/CL.png' },
              { id: 'npfl', name: 'Nigeria Premier League', flag: '🇳🇬', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f0/Nigeria_Premier_Football_League_logo.png/220px-Nigeria_Premier_Football_League_logo.png' },
              { id: 'serie-a', name: 'Serie A', flag: '🇮🇹', logo: 'https://crests.football-data.org/SA.png' },
              { id: 'bundesliga', name: 'Bundesliga', flag: '🇩🇪', logo: 'https://crests.football-data.org/BL1.png' },
            ].map((hot) => (
              <button
                key={hot.id}
                onClick={() => handleFilterMatches(hot.name)}
                className="p-2.5 rounded-2xl bg-gradient-to-r from-black/80 via-panel to-black/80 border border-stadiumGreen/40 hover:border-stadiumGreen hover:scale-105 transition-all text-left flex-shrink-0 flex items-center space-x-2.5 shadow-md group"
              >
                <div className="w-6 h-6 rounded-lg bg-black/60 p-0.5 flex items-center justify-center overflow-hidden">
                  <img src={hot.logo} alt={hot.name} className="w-full h-full object-contain" onError={(e) => { (e.target as any).style.display = 'none'; }} />
                </div>
                <div>
                  <span className="font-black text-white text-xs group-hover:text-stadiumGreen transition-colors block whitespace-nowrap">
                    {hot.name}
                  </span>
                  <span className="text-[9px] text-gray-400 font-mono">
                    Filter Matches ➔
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Search & Region Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 flex-shrink-0">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by country (England, Nigeria, Spain, Saudi...) or league..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-black/70 border border-white/10 text-xs text-white placeholder-gray-500 focus:border-stadiumGreen focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { key: 'ALL', label: 'All Continents', flag: '🌐' },
              { key: 'EUROPE', label: 'Europe', flag: '🇪🇺' },
              { key: 'AFRICA', label: 'Africa 🇳🇬', flag: '🌍' },
              { key: 'AMERICAS', label: 'Americas', flag: '🌎' },
              { key: 'ASIA_MIDDLE_EAST', label: 'Asia & Saudi', flag: '🇸🇦' },
            ].map((r) => (
              <button
                key={r.key}
                onClick={() => {
                  setSelectedRegion(r.key as any);
                  stadiumAudio.playTabClickSound();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 flex-shrink-0 ${
                  selectedRegion === r.key
                    ? 'bg-stadiumGreen text-black shadow-md'
                    : 'bg-panel text-gray-400 hover:text-white border border-white/10'
                }`}
              >
                <span>{r.flag}</span>
                <span>{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Global Leagues */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-black/60 p-3 sm:p-4 scrollbar-thin">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredLeagues.map((league) => {
              const isFollowed = followedLeagues.includes(league.id);
              const isImgErr = imgErrors[league.id];

              return (
                <div
                  key={league.id}
                  onClick={() => handleFilterMatches(league.name)}
                  className="glass-panel rounded-2xl p-3.5 border border-white/10 hover:border-stadiumGreen transition-all cursor-pointer group flex flex-col justify-between gap-2.5 hover:scale-[1.01] shadow-lg"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-black/80 border border-white/10 p-1.5 flex items-center justify-center flex-shrink-0 group-hover:border-stadiumGreen shadow-md">
                        {league.logo && !isImgErr ? (
                          <img
                            src={league.logo}
                            alt={league.name}
                            className="w-full h-full object-contain"
                            onError={() => setImgErrors((prev) => ({ ...prev, [league.id]: true }))}
                          />
                        ) : (
                          <span className="text-xl">{league.flag}</span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-sm">{league.flag}</span>
                          <span className="font-black text-white text-xs truncate group-hover:text-stadiumGreen transition-colors">
                            {league.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-sans block mt-0.5">
                          {league.country} &bull; {league.shortName}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleFollowClick(e, league.id)}
                      className={`p-2 rounded-xl border transition-all flex-shrink-0 ${
                        isFollowed
                          ? 'bg-gold text-black border-gold shadow-md font-black'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-gold hover:border-gold/50'
                      }`}
                      title={isFollowed ? 'Following League' : 'Follow League'}
                    >
                      <Star className={`w-3.5 h-3.5 ${isFollowed ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Direct Actions: Filter Matches & View Table */}
                  <div className="flex items-center space-x-2 pt-1 border-t border-white/5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFilterMatches(league.name);
                      }}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-stadiumGreen/15 hover:bg-stadiumGreen text-stadiumGreen hover:text-black font-black text-[10px] border border-stadiumGreen/30 transition-all flex items-center justify-center space-x-1"
                    >
                      <Zap className="w-3 h-3" />
                      <span>Filter Matches</span>
                    </button>
                    
                    <button
                      onClick={(e) => handleViewStandings(e, league.name)}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white font-black text-[10px] border border-white/10 transition-all flex items-center justify-center space-x-1"
                    >
                      <Table className="w-3 h-3 text-gold" />
                      <span>Standings</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-[11px] text-gray-400 border-t border-white/10 pt-2 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-stadiumGreen inline-block animate-ping" />
            <span>Followed leagues appear instantly in your &quot;⭐ Following&quot; match feed</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stadiumGreen text-black font-black text-xs hover:bg-emerald-400 transition-all"
          >
            Done ➔
          </button>
        </div>

      </div>
    </div>
  );
};
