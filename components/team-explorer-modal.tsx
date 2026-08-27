'use client';

import React, { useState, useEffect } from 'react';
import { X, Search, Shield, Trophy, Activity, Calendar, ExternalLink, Globe, RefreshCw, Sparkles, MapPin, Users } from 'lucide-react';
import { phoneHardware } from '../lib/phone-hardware-engine';

export interface LiveTeamData {
  id: string;
  name: string;
  shortName: string;
  sport: string;
  league: string;
  stadium: string;
  stadiumThumb?: string;
  capacity: string;
  manager: string;
  formedYear: string;
  country: string;
  badgeUrl: string;
  bannerUrl?: string;
  website?: string;
  twitter?: string;
  instagram?: string;
  description: string;
}

const DEFAULT_POPULAR_TEAMS: LiveTeamData[] = [
  {
    id: 't-1',
    name: 'Arsenal FC',
    shortName: 'ARS',
    sport: 'Soccer',
    league: 'English Premier League',
    stadium: 'Emirates Stadium',
    capacity: '60,704',
    manager: 'Mikel Arteta',
    formedYear: '1886',
    country: 'England',
    badgeUrl: 'https://www.thesportsdb.com/images/media/team/badge/uyhbfe1612467038.png',
    description: 'Arsenal Football Club is a professional football club based in Islington, London, England. Arsenal plays in the Premier League, the top flight of English football, and has won 13 league titles and a record 14 FA Cups.'
  },
  {
    id: 't-2',
    name: 'Real Madrid CF',
    shortName: 'RMA',
    sport: 'Soccer',
    league: 'Spanish La Liga',
    stadium: 'Santiago Bernabéu',
    capacity: '81,044',
    manager: 'Carlo Ancelotti',
    formedYear: '1902',
    country: 'Spain',
    badgeUrl: 'https://www.thesportsdb.com/images/media/team/badge/8p1k981612467215.png',
    description: 'Real Madrid Club de Fútbol is a Spanish professional football club based in Madrid. Recognized as the greatest club of the 20th century, Real Madrid has won a record 15 UEFA Champions League titles and 36 La Liga championships.'
  },
  {
    id: 't-3',
    name: 'Galatasaray SK',
    shortName: 'GAL',
    sport: 'Soccer',
    league: 'Turkish Süper Lig',
    stadium: 'Rams Park',
    capacity: '52,652',
    manager: 'Okan Buruk',
    formedYear: '1905',
    country: 'Turkey',
    badgeUrl: 'https://www.thesportsdb.com/images/media/team/badge/1f5g8b1612467100.png',
    description: 'Galatasaray Spor Kulübü is a Turkish professional football club based in Istanbul. Galatasaray is the most successful Turkish club, having won 24 Süper Lig titles, 18 Turkish Cups, and the 2000 UEFA Cup.'
  },
  {
    id: 't-4',
    name: 'Los Angeles Lakers',
    shortName: 'LAL',
    sport: 'Basketball',
    league: 'NBA Basketball',
    stadium: 'Crypto.com Arena',
    capacity: '19,079',
    manager: 'JJ Redick',
    formedYear: '1947',
    country: 'United States',
    badgeUrl: 'https://www.thesportsdb.com/images/media/team/badge/tzrqqv1534005394.png',
    description: 'The Los Angeles Lakers are an American professional basketball team based in Los Angeles. The Lakers compete in the NBA and are tied for the most championships in NBA history with 17 titles.'
  }
];

interface TeamExplorerModalProps {
  initialTeamName?: string;
  onClose: () => void;
}

export const TeamExplorerModal: React.FC<TeamExplorerModalProps> = ({ initialTeamName, onClose }) => {
  const [search, setSearch] = useState(initialTeamName || '');
  const [selectedSport, setSelectedSport] = useState<'ALL' | 'SOCCER' | 'BASKETBALL' | 'TENNIS' | 'MOTORSPORT'>('ALL');
  const [selectedTeam, setSelectedTeam] = useState<LiveTeamData>(DEFAULT_POPULAR_TEAMS[0]);
  const [teamsList, setTeamsList] = useState<LiveTeamData[]>(DEFAULT_POPULAR_TEAMS);
  const [loading, setLoading] = useState(false);

  // Search live from TheSportsDB free API
  const handleSearchLive = async (term: string) => {
    if (!term.trim()) {
      setTeamsList(DEFAULT_POPULAR_TEAMS);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(term.trim())}`);
      if (res.ok) {
        const json = await res.json();
        const apiTeams = json.teams || [];
        if (apiTeams.length > 0) {
          const mapped: LiveTeamData[] = apiTeams.map((t: any) => ({
            id: t.idTeam || `t-${Math.random().toString(36).substring(7)}`,
            name: t.strTeam || 'Team',
            shortName: t.strTeamShort || t.strTeam?.substring(0, 3)?.toUpperCase() || 'TM',
            sport: t.strSport || 'Soccer',
            league: t.strLeague || 'League',
            stadium: t.strStadium || 'Stadium',
            stadiumThumb: t.strStadiumThumb,
            capacity: t.intStadiumCapacity ? Number(t.intStadiumCapacity).toLocaleString() : '50,000',
            manager: t.strManager || 'Head Coach',
            formedYear: t.intFormedYear || '1900',
            country: t.strCountry || 'Global',
            badgeUrl: t.strBadge || t.strLogo || '/players/haaland.png',
            bannerUrl: t.strBanner,
            website: t.strWebsite ? (t.strWebsite.startsWith('http') ? t.strWebsite : `https://${t.strWebsite}`) : undefined,
            twitter: t.strTwitter ? (t.strTwitter.startsWith('http') ? t.strTwitter : `https://${t.strTwitter}`) : undefined,
            instagram: t.strInstagram ? (t.strInstagram.startsWith('http') ? t.strInstagram : `https://${t.strInstagram}`) : undefined,
            description: t.strDescriptionEN || `${t.strTeam} is a professional ${t.strSport} club competing in ${t.strLeague}.`
          }));

          setTeamsList(mapped);
          setSelectedTeam(mapped[0]);
        }
      }
    } catch (err) {
      console.warn('TheSportsDB team search error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialTeamName) {
      handleSearchLive(initialTeamName);
    }
  }, [initialTeamName]);

  const filteredTeams = teamsList.filter(t => {
    if (selectedSport !== 'ALL' && !t.sport.toUpperCase().includes(selectedSport)) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn overflow-y-auto font-mono">
      <div className="relative w-full max-w-4xl glass-panel-premium rounded-3xl border-2 border-stadiumGreen/60 p-5 sm:p-7 shadow-2xl my-auto text-white space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-bold text-stadiumGreen">
            <Shield className="w-4 h-4" />
            <span>GLOBAL SPORTS ENCYCLOPEDIA • LIVE API DATABASE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            TEAMS, CLUBS &amp; LEAGUES WIKIPEDIA DIRECTORY
          </h2>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                handleSearchLive(e.target.value);
              }}
              placeholder="Search any club in the world (e.g. Arsenal, Real Madrid, Galatasaray, Lakers)..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-neutral-950 border border-neutral-700 text-xs text-white placeholder-gray-500 focus:border-stadiumGreen focus:outline-none font-mono"
            />
            {loading && (
              <RefreshCw className="w-4 h-4 text-stadiumGreen animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
            )}
          </div>

          <div className="flex items-center space-x-1 overflow-x-auto text-[11px]">
            {(['ALL', 'SOCCER', 'BASKETBALL', 'TENNIS', 'MOTORSPORT'] as const).map((s) => (
              <button
                key={s}
                onClick={() => {
                  phoneHardware.triggerHaptic('SELECTION');
                  setSelectedSport(s);
                }}
                className={`px-3 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
                  selectedSport === s ? 'bg-stadiumGreen text-black font-black' : 'bg-neutral-900 text-gray-400 border border-neutral-800'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid: Left Side Directory + Right Side Full Wikipedia View */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Left Column: Teams List */}
          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {filteredTeams.map((team) => {
              const isSelected = selectedTeam.id === team.id;
              return (
                <button
                  type="button"
                  key={team.id}
                  onClick={() => {
                    phoneHardware.triggerHaptic('SELECTION');
                    setSelectedTeam(team);
                  }}
                  className={`w-full p-3 rounded-2xl text-left transition-all border flex items-center space-x-3 ${
                    isSelected
                      ? 'bg-neutral-800 border-stadiumGreen shadow-lg shadow-stadiumGreen/20 ring-1 ring-stadiumGreen'
                      : 'bg-neutral-950/80 hover:bg-neutral-900 border-neutral-800'
                  }`}
                >
                  <img
                    src={team.badgeUrl}
                    alt={team.name}
                    className="w-9 h-9 object-contain flex-shrink-0"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-xs text-white block truncate">{team.name}</span>
                    <span className="text-[10px] text-gray-400 block truncate">{team.league} • {team.sport}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Full Wikipedia Dossier & Current Status */}
          <div className="md:col-span-2 p-5 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-4 max-h-[380px] overflow-y-auto">
            
            {/* Header with Badge and Formed Year */}
            <div className="flex items-start justify-between gap-3 border-b border-neutral-800 pb-3">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedTeam.badgeUrl}
                  alt={selectedTeam.name}
                  className="w-14 h-14 object-contain"
                />
                <div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/30 font-bold uppercase">
                    {selectedTeam.sport} • {selectedTeam.country}
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-white">{selectedTeam.name}</h3>
                  <span className="text-xs text-gray-400 font-sans">{selectedTeam.league} (Formed: {selectedTeam.formedYear})</span>
                </div>
              </div>
            </div>

            {/* Stadium, Manager, Capacity Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-sans">
              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                <span className="text-[10px] text-gray-400 block flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-stadiumGreen" /> Stadium / Arena
                </span>
                <strong className="text-white text-xs block truncate">{selectedTeam.stadium}</strong>
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                <span className="text-[10px] text-gray-400 block flex items-center gap-1">
                  <Users className="w-3 h-3 text-stadiumGreen" /> Capacity
                </span>
                <strong className="text-white text-xs block">{selectedTeam.capacity}</strong>
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-gray-400 block">Manager / Coach</span>
                <strong className="text-stadiumGreen text-xs block truncate">{selectedTeam.manager}</strong>
              </div>
            </div>

            {/* Wikipedia Overview / History Bio */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-black text-white flex items-center space-x-1.5">
                <Globe className="w-3.5 h-3.5 text-stadiumGreen" />
                <span>WIKIPEDIA OVERVIEW &amp; STATUS</span>
              </span>
              <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                {selectedTeam.description}
              </p>
            </div>

            {/* Social & Official Links */}
            {(selectedTeam.website || selectedTeam.twitter || selectedTeam.instagram) && (
              <div className="flex items-center space-x-2 pt-2 border-t border-neutral-800 text-xs">
                <span className="text-gray-400 font-sans text-[11px]">Official Links:</span>
                {selectedTeam.website && (
                  <a href={selectedTeam.website} target="_blank" rel="noopener noreferrer" className="px-2 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-stadiumGreen text-[10px] font-bold">
                    Website ➔
                  </a>
                )}
                {selectedTeam.twitter && (
                  <a href={selectedTeam.twitter} target="_blank" rel="noopener noreferrer" className="px-2 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-cyan-400 text-[10px] font-bold">
                    Twitter/X ➔
                  </a>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
