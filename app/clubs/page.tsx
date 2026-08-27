'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Shield, Trophy, Search, RefreshCw, 
  MapPin, Users, ChevronRight, Globe, Sparkles 
} from 'lucide-react';
import { phoneHardware } from '../../lib/phone-hardware-engine';

export interface GlobalClubOverview {
  id: string;
  name: string;
  sport: string;
  league: string;
  country: string;
  formedYear: string;
  stadium: string;
  capacity: string;
  manager: string;
  badgeUrl: string;
  primaryHonor: string;
}

const GLOBAL_CLUBS_LIST: GlobalClubOverview[] = [
  {
    id: 'chelsea',
    name: 'Chelsea',
    sport: 'SOCCER',
    league: 'English Premier League',
    country: 'England',
    formedYear: '1905',
    stadium: 'Stamford Bridge',
    capacity: '41,798',
    manager: 'Enzo Maresca',
    badgeUrl: 'https://r2.thesportsdb.com/images/media/team/badge/uyhbfe1612467038.png',
    primaryHonor: '2x UEFA Champions League Winner'
  },
  {
    id: 'arsenal',
    name: 'Arsenal',
    sport: 'SOCCER',
    league: 'English Premier League',
    country: 'England',
    formedYear: '1886',
    stadium: 'Emirates Stadium',
    capacity: '60,338',
    manager: 'Mikel Arteta',
    badgeUrl: 'https://r2.thesportsdb.com/images/media/team/badge/e49l641612467049.png',
    primaryHonor: '13x Premier League / First Division'
  },
  {
    id: 'real-madrid',
    name: 'Real Madrid',
    sport: 'SOCCER',
    league: 'La Liga',
    country: 'Spain',
    formedYear: '1902',
    stadium: 'Santiago Bernabéu',
    capacity: '85,000',
    manager: 'Carlo Ancelotti',
    badgeUrl: 'https://r2.thesportsdb.com/images/media/team/badge/8p91i11612467055.png',
    primaryHonor: '15x UEFA Champions League Winner (Record)'
  },
  {
    id: 'barcelona',
    name: 'Barcelona',
    sport: 'SOCCER',
    league: 'La Liga',
    country: 'Spain',
    formedYear: '1899',
    stadium: 'Spotify Camp Nou',
    capacity: '99,354',
    manager: 'Hansi Flick',
    badgeUrl: 'https://r2.thesportsdb.com/images/media/team/badge/w09k0f1612467065.png',
    primaryHonor: '5x UEFA Champions League Winner'
  },
  {
    id: 'galatasaray',
    name: 'Galatasaray',
    sport: 'SOCCER',
    league: 'Turkish Super Lig',
    country: 'Turkey',
    formedYear: '1905',
    stadium: 'Rams Park',
    capacity: '52,652',
    manager: 'Okan Buruk',
    badgeUrl: 'https://r2.thesportsdb.com/images/media/team/badge/u192p61612467075.png',
    primaryHonor: '24x Turkish Super Lig • UEFA Cup Winner'
  },
  {
    id: 'manchester-city',
    name: 'Manchester City',
    sport: 'SOCCER',
    league: 'English Premier League',
    country: 'England',
    formedYear: '1880',
    stadium: 'Etihad Stadium',
    capacity: '53,400',
    manager: 'Pep Guardiola',
    badgeUrl: 'https://r2.thesportsdb.com/images/media/team/badge/vwpvry1467462651.png',
    primaryHonor: 'UEFA Champions League & Treble Winner'
  },
  {
    id: 'la-clippers',
    name: 'LA Clippers',
    sport: 'BASKETBALL',
    league: 'NBA Basketball',
    country: 'United States',
    formedYear: '1970',
    stadium: 'Intuit Dome',
    capacity: '18,000',
    manager: 'Tyronn Lue',
    badgeUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/lac.png',
    primaryHonor: 'Pacific Division Contender'
  },
  {
    id: 'chicago-bulls',
    name: 'Chicago Bulls',
    sport: 'BASKETBALL',
    league: 'NBA Basketball',
    country: 'United States',
    formedYear: '1966',
    stadium: 'United Center',
    capacity: '20,917',
    manager: 'Billy Donovan',
    badgeUrl: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/chi.png',
    primaryHonor: '6x NBA World Champions'
  },
  {
    id: 'scuderia-ferrari',
    name: 'Scuderia Ferrari',
    sport: 'MOTORSPORT',
    league: 'Formula 1',
    country: 'Italy',
    formedYear: '1929',
    stadium: 'Maranello HQ / Monza',
    capacity: '118,000',
    manager: 'Frédéric Vasseur',
    badgeUrl: 'https://r2.thesportsdb.com/images/media/team/badge/1f5qvx1612467085.png',
    primaryHonor: '16x World Constructors Champions (Record)'
  }
];

export default function ClubsDirectoryPage() {
  const [clubs, setClubs] = useState<GlobalClubOverview[]>(GLOBAL_CLUBS_LIST);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<string>('ALL');
  const [loading, setLoading] = useState(false);

  const handleSearchLive = async (term: string) => {
    setSearchQuery(term);
    if (!term.trim()) {
      setClubs(GLOBAL_CLUBS_LIST);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(term.trim())}`);
      if (res.ok) {
        const json = await res.json();
        const apiTeams = json.teams || [];
        if (apiTeams.length > 0) {
          const mapped: GlobalClubOverview[] = apiTeams.map((t: any) => ({
            id: t.strTeam.toLowerCase().replace(/\s+/g, '-'),
            name: t.strTeam,
            sport: (t.strSport || 'Soccer').toUpperCase(),
            league: t.strLeague || 'Professional League',
            country: t.strCountry || 'Global',
            formedYear: t.intFormedYear || '1900',
            stadium: t.strStadium || 'Stadium Ground',
            capacity: t.intStadiumCapacity ? Number(t.intStadiumCapacity).toLocaleString() : '40,000',
            manager: t.strManager || 'Head Coach',
            badgeUrl: t.strBadge || t.strLogo || 'https://r2.thesportsdb.com/images/media/team/badge/uyhbfe1612467038.png',
            primaryHonor: `${t.strLeague} Division Member`
          }));
          setClubs(mapped);
        }
      }
    } catch (err) {
      console.warn('Club search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredClubs = useMemo(() => {
    return clubs.filter(c => {
      if (selectedSport !== 'ALL' && !c.sport.includes(selectedSport)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return c.name.toLowerCase().includes(q) ||
               c.league.toLowerCase().includes(q) ||
               c.country.toLowerCase().includes(q) ||
               c.stadium.toLowerCase().includes(q);
      }
      return true;
    });
  }, [clubs, selectedSport, searchQuery]);

  return (
    <div className="min-h-screen bg-[#05070B] text-white font-mono pb-24">
      
      {/* Top Header Navigation */}
      <div className="sticky top-0 z-30 bg-black/85 backdrop-blur-xl border-b border-white/10 px-4 py-3 shadow-2xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-stadiumGreen" />
            <span>Back to Stadium</span>
          </Link>
          
          <div className="flex items-center space-x-3 text-xs font-black">
            <Link href="/players" className="text-gray-400 hover:text-white transition-colors">
              ★ Players
            </Link>
            <Link href="/birthdays" className="text-gray-400 hover:text-white transition-colors">
              🎂 Birthdays
            </Link>
            <span className="text-stadiumGreen flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5" />
              <span>CLUBS DIRECTORY</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Title */}
        <div className="text-center space-y-2 py-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-stadiumGreen/20 border border-stadiumGreen/40 text-stadiumGreen text-xs font-black uppercase">
            <Shield className="w-3.5 h-3.5" />
            <span>WORLDWIDE CLUBS &amp; FRANCHISES ENCYCLOPEDIA</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            TEAMS, CLUBS &amp; LEAGUES DIRECTORY
          </h1>
          <p className="text-xs text-gray-400 max-w-xl mx-auto font-sans">
            Explore full squads with real player cutouts, shirt numbers, coaches, transfers, trophy cabinets, and live club news.
          </p>
        </div>

        {/* Search & Sport Filters Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchLive(e.target.value)}
              placeholder="Search any club in the world (e.g. Chelsea, Arsenal, Real Madrid, Galatasaray, Bulls)..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-gray-500 focus:border-stadiumGreen focus:outline-none font-mono"
            />
            {loading && (
              <RefreshCw className="w-4 h-4 text-stadiumGreen animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
            )}
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto text-xs">
            {(['ALL', 'SOCCER', 'BASKETBALL', 'MOTORSPORT'] as const).map((s) => (
              <button
                key={s}
                onClick={() => {
                  phoneHardware.triggerHaptic('SELECTION');
                  setSelectedSport(s);
                }}
                className={`px-3 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
                  selectedSport === s
                    ? 'bg-stadiumGreen text-black font-black shadow-lg shadow-stadiumGreen/20'
                    : 'bg-neutral-900 text-gray-400 border border-neutral-800 hover:text-white'
                }`}
              >
                {s === 'ALL' ? '● All Sports' : s === 'SOCCER' ? '⚽ Football' : s === 'BASKETBALL' ? '🏀 Basketball' : '🏎️ Motorsport'}
              </button>
            ))}
          </div>
        </div>

        {/* 🌟 3-COLUMN LUXURY CLUBS CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClubs.map((club) => {
            return (
              <Link
                key={club.id}
                href={`/clubs/${encodeURIComponent(club.name)}`}
                className="rounded-3xl bg-[#0e131f]/90 border border-white/10 hover:border-stadiumGreen/60 p-5 space-y-4 shadow-xl transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3.5">
                  
                  {/* Top Pill: Sport + Formed Year */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-stadiumGreen/15 border border-stadiumGreen/30 text-[10px] font-black text-stadiumGreen uppercase">
                      {club.sport} • {club.country}
                    </span>
                    <span className="text-xs font-bold text-gray-400">
                      Est. {club.formedYear}
                    </span>
                  </div>

                  {/* Club Badge + Name + League */}
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={club.badgeUrl}
                      alt={club.name}
                      className="w-14 h-14 object-contain flex-shrink-0 group-hover:scale-105 transition-transform"
                    />

                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-black text-white group-hover:text-stadiumGreen transition-colors truncate">
                        {club.name}
                      </h3>
                      <span className="text-xs text-gray-300 font-bold block truncate">{club.league}</span>
                      <span className="text-[10px] text-gray-400 block truncate">Manager: {club.manager}</span>
                    </div>
                  </div>

                  {/* Stadium & Capacity */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-sans">
                    <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                      <span className="text-[10px] text-gray-400 block">🏟️ Stadium</span>
                      <strong className="text-white text-xs block truncate">{club.stadium}</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                      <span className="text-[10px] text-gray-400 block">👥 Capacity</span>
                      <strong className="text-stadiumGreen text-xs block truncate">{club.capacity}</strong>
                    </div>
                  </div>

                  {/* Primary Trophy Highlight */}
                  <div className="p-2.5 rounded-2xl bg-black/50 border border-gold/20 flex items-center space-x-2 text-xs">
                    <Trophy className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                    <span className="text-gold font-bold text-[11px] truncate">{club.primaryHonor}</span>
                  </div>

                </div>

                {/* View Full Squad & Dossier Button */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-black text-stadiumGreen group-hover:translate-x-1 transition-transform">
                  <span>Open Full Squad &amp; Dossier</span>
                  <ChevronRight className="w-4 h-4" />
                </div>

              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}
