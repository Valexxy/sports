'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Trophy, Star, Search, RefreshCw, 
  ExternalLink, Sparkles, UserCheck, Check, Shield, Globe, Zap 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { stadiumAudio } from '../../lib/sound-synthesizer';
import { PlayerRadarModal } from '../../components/player-radar-modal';

export interface UniversalAthleteCard {
  id: string;
  name: string;
  sport: string;
  team_name: string;
  country: string;
  position: string;
  birth_date: string;
  age: number;
  photo_url: string;
  fallback_initials: string;
  rating: number;
  market_value: string;
  bio: string;
  signature_metric: string;
  isLegend: boolean;
}

const GLOBAL_PLAYERS_ROSTER: UniversalAthleteCard[] = [
  {
    id: 'p-okocha',
    name: 'Jay-Jay Okocha',
    sport: 'SOCCER',
    team_name: 'Nigeria Legends • Bolton Icon',
    country: 'Nigeria',
    position: 'Attacking Midfielder / Playmaker',
    birth_date: '1973-08-14',
    age: 53,
    photo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Jay-Jay_Okocha_2018.jpg/440px-Jay-Jay_Okocha_2018.jpg',
    fallback_initials: 'JO',
    rating: 97,
    market_value: 'Legendary Icon',
    bio: 'Augustine Azuka "Jay-Jay" Okocha is widely regarded as one of the greatest African players in world football history, renowned for his magical dribbling, stepovers, and flair.',
    signature_metric: 'Olympic Gold (1996) • AFCON Winner',
    isLegend: true
  },
  {
    id: 'p-jordan',
    name: 'Michael Jordan',
    sport: 'BASKETBALL',
    team_name: 'Chicago Bulls Legends',
    country: 'United States',
    position: 'Shooting Guard',
    birth_date: '1963-02-17',
    age: 63,
    photo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Michael_Jordan_in_2014.jpg/440px-Michael_Jordan_in_2014.jpg',
    fallback_initials: 'MJ',
    rating: 99,
    market_value: 'GOAT Icon',
    bio: 'Michael Jeffrey Jordan led the Chicago Bulls to six NBA championships and is widely celebrated as the greatest basketball player of all time.',
    signature_metric: '6x NBA Champion • 6x Finals MVP',
    isLegend: true
  },
  {
    id: 'p-osimhen',
    name: 'Victor Osimhen',
    sport: 'SOCCER',
    team_name: 'Galatasaray / Super Eagles',
    country: 'Nigeria',
    position: 'Striker / Poacher',
    birth_date: '1998-12-29',
    age: 27,
    photo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Victor_Osimhen_2023.jpg/440px-Victor_Osimhen_2023.jpg',
    fallback_initials: 'VO',
    rating: 92,
    market_value: '€100,000,000',
    bio: 'African Footballer of the Year and explosive striker who led Napoli to their historic Serie A Scudetto as Capocannoniere top scorer.',
    signature_metric: 'Serie A Top Scorer • African Best',
    isLegend: false
  },
  {
    id: 'p-haaland',
    name: 'Erling Haaland',
    sport: 'SOCCER',
    team_name: 'Manchester City',
    country: 'Norway',
    position: 'Striker / Goal Machine',
    birth_date: '2000-07-21',
    age: 26,
    photo_url: 'https://r2.thesportsdb.com/images/media/player/cutout/un3jr11769182465.png',
    fallback_initials: 'EH',
    rating: 95,
    market_value: '€180,000,000',
    bio: 'Prolific record-breaking goalscorer who shattered the Premier League single-season scoring record in his debut season.',
    signature_metric: 'UCL Winner • 36 Premier League Goals',
    isLegend: false
  },
  {
    id: 'p-hamilton',
    name: 'Lewis Hamilton',
    sport: 'MOTORSPORT',
    team_name: 'Scuderia Ferrari / Mercedes',
    country: 'United Kingdom',
    position: 'Formula 1 Driver',
    birth_date: '1985-01-07',
    age: 41,
    photo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Lewis_Hamilton_2022_F1_Austria.jpg/440px-Lewis_Hamilton_2022_F1_Austria.jpg',
    fallback_initials: 'LH',
    rating: 98,
    market_value: '7x World Champion',
    bio: 'Sir Lewis Hamilton holds the all-time records for most race victories (105+) and pole positions (104+) in Formula One history.',
    signature_metric: '7x F1 World Champion • 105 GP Wins',
    isLegend: true
  },
  {
    id: 'p-mbappe',
    name: 'Kylian Mbappé',
    sport: 'SOCCER',
    team_name: 'Real Madrid',
    country: 'France',
    position: 'Forward / Winger',
    birth_date: '1998-12-20',
    age: 28,
    photo_url: 'https://r2.thesportsdb.com/images/media/player/cutout/i712061759225381.png',
    fallback_initials: 'KM',
    rating: 94,
    market_value: '€180,000,000',
    bio: 'FIFA World Cup Champion and Golden Boot winner renowned for his electric acceleration and world-class finishing.',
    signature_metric: 'World Cup Winner • Golden Boot',
    isLegend: false
  }
];

export default function PlayersHubPage() {
  const [players, setPlayers] = useState<UniversalAthleteCard[]>(GLOBAL_PLAYERS_ROSTER);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<string>('ALL');
  const [followedIds, setFollowedIds] = useState<string[]>([]);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [showRadarModal, setShowRadarModal] = useState(false);
  const [initialPlayerId, setInitialPlayerId] = useState<string>('p-okocha');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mivaj_followed_players');
      if (saved) setFollowedIds(JSON.parse(saved));
    } catch {}
  }, []);

  const handleToggleFollow = (id: string) => {
    phoneHardware.triggerHaptic('SUCCESS');
    let updated: string[] = [];
    if (followedIds.includes(id)) {
      updated = followedIds.filter(fId => fId !== id);
    } else {
      updated = [...followedIds, id];
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    }
    setFollowedIds(updated);
    try {
      localStorage.setItem('mivaj_followed_players', JSON.stringify(updated));
    } catch {}
  };

  const handleSearchLive = async (term: string) => {
    setSearchQuery(term);
    if (!term.trim()) {
      setPlayers(GLOBAL_PLAYERS_ROSTER);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/v1/players?query=${encodeURIComponent(term.trim())}`);
      if (res.ok) {
        const json = await res.json();
        const apiData = json.data || [];
        if (apiData.length > 0) {
          const mapped: UniversalAthleteCard[] = apiData.map((p: any) => ({
            id: p.id || `p-${Math.random()}`,
            name: p.name || 'Athlete',
            sport: (p.sport || 'SOCCER').toUpperCase(),
            team_name: p.team_name || 'World Club',
            country: p.country || 'Global',
            position: p.position || 'Professional Athlete',
            birth_date: p.birth_date || '1995-01-01',
            age: p.age || 28,
            photo_url: p.photo_url || '',
            fallback_initials: p.fallback_initials || '★',
            rating: p.rating || 88,
            market_value: p.market_value || '€75,000,000',
            bio: p.bio || 'World-class athlete profile.',
            signature_metric: p.metrics?.tertiary_metric_value || p.market_value || 'Elite Performer',
            isLegend: p.isLegend || false
          }));

          setPlayers(mapped);
        }
      }
    } catch (err) {
      console.warn('Player search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlayers = useMemo(() => {
    return players.filter(player => {
      if (selectedSport !== 'ALL' && !player.sport.includes(selectedSport)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return player.name.toLowerCase().includes(q) ||
               player.team_name.toLowerCase().includes(q) ||
               player.country.toLowerCase().includes(q) ||
               player.position.toLowerCase().includes(q);
      }
      return true;
    });
  }, [players, selectedSport, searchQuery]);

  return (
    <div className="min-h-screen bg-[#05070B] text-white font-mono pb-24">
      
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 bg-black/85 backdrop-blur-xl border-b border-white/10 px-4 py-3 shadow-2xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gold" />
            <span>Back to Stadium</span>
          </Link>
          
          <div className="flex items-center space-x-3 text-xs font-black">
            <Link href="/birthdays" className="text-gray-400 hover:text-white transition-colors">
              🎂 Birthdays
            </Link>
            <span className="text-gold flex items-center space-x-1">
              <Star className="w-3.5 h-3.5 fill-gold text-gold" />
              <span>PLAYERS ENCYCLOPEDIA</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Header Title */}
        <div className="text-center space-y-2 py-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-black uppercase">
            <Trophy className="w-3.5 h-3.5 text-gold" />
            <span>UNIVERSAL ATHLETES ENCYCLOPEDIA</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            GLOBAL PLAYERS &amp; ATHLETES DIRECTORY
          </h1>
          <p className="text-xs text-gray-400 max-w-xl mx-auto font-sans">
            Explore deep biographies, career achievements, and signature trophies for every athlete across world history.
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
              placeholder="Search any player in history (e.g. Okocha, Jordan, Haaland, Kobe, Osimhen)..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-gray-500 focus:border-gold focus:outline-none font-mono"
            />
            {loading && (
              <RefreshCw className="w-4 h-4 text-gold animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
            )}
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto text-xs">
            {(['ALL', 'SOCCER', 'BASKETBALL', 'MOTORSPORT', 'TENNIS', 'COMBAT'] as const).map((s) => (
              <button
                key={s}
                onClick={() => {
                  phoneHardware.triggerHaptic('SELECTION');
                  setSelectedSport(s);
                }}
                className={`px-3 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
                  selectedSport === s
                    ? 'bg-gold text-black font-black shadow-lg shadow-gold/20'
                    : 'bg-neutral-900 text-gray-400 border border-neutral-800 hover:text-white'
                }`}
              >
                {s === 'ALL' ? '● All Sports' : s === 'SOCCER' ? '⚽ Football' : s === 'BASKETBALL' ? '🏀 Basketball' : s === 'MOTORSPORT' ? '🏎️ Motorsport' : s}
              </button>
            ))}
          </div>
        </div>

        {/* 🌟 3-COLUMN LUXURY ATHLETE CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlayers.map((player) => {
            const isFollowed = followedIds.includes(player.id);
            const hasPhoto = player.photo_url && !imgErrors[player.id];

            return (
              <div
                key={player.id}
                className="rounded-3xl bg-[#0e131f]/90 border border-white/10 hover:border-gold/40 p-5 space-y-4 shadow-xl transition-all flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  
                  {/* Top Pill: Sport + Country Badge */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-gold/15 border border-gold/30 text-[10px] font-black text-gold uppercase">
                      {player.sport} • {player.age} YRS
                    </span>
                    <span className="text-xs font-bold text-gray-400">
                      {player.country}
                    </span>
                  </div>

                  {/* Player Photo + Name + Club */}
                  <div className="flex items-center space-x-3.5">
                    {hasPhoto ? (
                      <img
                        src={player.photo_url}
                        alt={player.name}
                        className="w-14 h-14 rounded-2xl object-cover object-top border-2 border-gold/40 bg-neutral-900 flex-shrink-0 shadow-md"
                        onError={() => setImgErrors(prev => ({ ...prev, [player.id]: true }))}
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-neutral-900 border-2 border-gold/40 flex items-center justify-center font-black text-sm text-gold flex-shrink-0 shadow-inner">
                        {player.fallback_initials || '★'}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-1.5">
                        <h3 className="text-base font-black text-white truncate">{player.name}</h3>
                        {player.isLegend && (
                          <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-400 text-[8px] font-black flex-shrink-0">
                            GOAT
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-stadiumGreen font-bold block truncate">{player.team_name}</span>
                      <span className="text-[10px] text-gray-400 block truncate">{player.position}</span>
                    </div>
                  </div>

                  {/* Bio Snippet */}
                  <p className="text-[11px] text-neutral-300 font-sans line-clamp-2 leading-relaxed">
                    {player.bio}
                  </p>

                  {/* Gold Trophy Highlight */}
                  <div className="p-2.5 rounded-2xl bg-black/50 border border-gold/20 flex items-center space-x-2 text-xs">
                    <Trophy className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                    <span className="text-gold font-bold text-[11px] truncate">{player.signature_metric}</span>
                  </div>

                </div>

                {/* Follow Button & Radar Dossier Modal Trigger */}
                <div className="flex items-center space-x-2 pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => handleToggleFollow(player.id)}
                    className={`flex-1 py-3 rounded-2xl text-xs font-black flex items-center justify-center space-x-1.5 transition-all active:scale-95 ${
                      isFollowed
                        ? 'bg-gold text-black shadow-lg shadow-gold/20'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                    }`}
                  >
                    {isFollowed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Star className="w-3.5 h-3.5" />}
                    <span>{isFollowed ? 'Following Profile ✓' : 'Follow Athlete'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setInitialPlayerId(player.id);
                      setShowRadarModal(true);
                    }}
                    className="px-3.5 py-3 rounded-2xl bg-gold/15 hover:bg-gold/25 text-gold border border-gold/40 transition-all flex items-center space-x-1 font-bold text-xs"
                    title="Open Scouting Radar & Bio Dossier"
                  >
                    <Zap className="w-3.5 h-3.5 text-gold fill-gold" />
                    <span className="hidden sm:inline">Radar</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* In-App Native Player Radar & Encyclopedia Modal */}
      <PlayerRadarModal
        isOpen={showRadarModal}
        onClose={() => setShowRadarModal(false)}
        initialPlayerId={initialPlayerId}
      />
    </div>
  );
}
