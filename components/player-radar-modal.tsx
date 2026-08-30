'use client';

import React, { useState, useEffect } from 'react';
import { 
  Star, X, Search, Shield, Zap, Trophy, Flame, 
  Target, Award, Activity, CheckCircle2, TrendingUp, 
  Sparkles, ArrowLeft, Calendar, Share2, Globe, Heart, RefreshCw, UserCheck, Check,
  ExternalLink, BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { generatePlayerExternalLinks } from '../lib/player-intelligence-engine';

export interface SportSpecificMetrics {
  primary_metric_label: string;
  primary_metric_value: string;
  secondary_metric_label: string;
  secondary_metric_value: string;
  tertiary_metric_label: string;
  tertiary_metric_value: string;
  career_honors: string[];
}

export interface UniversalAthleteRecord {
  id: string;
  name: string;
  sport: string;
  team_name: string;
  country: string;
  position: string;
  jersey_number?: string;
  birth_date: string;
  age: number;
  photo_url: string;
  fallback_initials: string;
  rating: number;
  market_value: string;
  bio: string;
  metrics: SportSpecificMetrics;
  isLegend: boolean;
}

const DEFAULT_GLOBAL_LEGENDS: UniversalAthleteRecord[] = [
  {
    id: 'p-okocha',
    name: 'Jay-Jay Okocha',
    sport: 'SOCCER',
    team_name: 'Nigeria Legends • Bolton Icon',
    country: 'Nigeria',
    position: 'Attacking Midfielder / Playmaker',
    jersey_number: '10',
    birth_date: '1973-08-14',
    age: 53,
    photo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Jay-Jay_Okocha_2018.jpg/440px-Jay-Jay_Okocha_2018.jpg',
    fallback_initials: 'JO',
    rating: 97,
    market_value: 'Legendary Icon',
    bio: 'Augustine Azuka "Jay-Jay" Okocha is a Nigerian former professional footballer who played as an attacking midfielder. Widely regarded as one of the greatest African players of all time, he was renowned for his extraordinary dribbling, stepovers, passing technique, and flair.',
    metrics: {
      primary_metric_label: 'Preferred Foot',
      primary_metric_value: 'Right Foot (Elite Dribbler)',
      secondary_metric_label: 'Signature Move',
      secondary_metric_value: 'Stepovers & Rainbow Flick',
      tertiary_metric_label: 'Major Honors',
      tertiary_metric_value: 'Olympic Gold (1996) • AFCON Winner (1994)',
      career_honors: ['Olympic Gold Medalist (1996)', 'Africa Cup of Nations Winner (1994)', 'BBC African Footballer of the Year (2x)', 'FIFA World Cup All-Star Reserve']
    },
    isLegend: true
  },
  {
    id: 'p-jordan',
    name: 'Michael Jordan',
    sport: 'BASKETBALL',
    team_name: 'Chicago Bulls Legends',
    country: 'United States',
    position: 'Shooting Guard',
    jersey_number: '23',
    birth_date: '1963-02-17',
    age: 63,
    photo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Michael_Jordan_in_2014.jpg/440px-Michael_Jordan_in_2014.jpg',
    fallback_initials: 'MJ',
    rating: 99,
    market_value: 'GOAT Icon',
    bio: 'Michael Jeffrey Jordan, also known by his initials MJ, is an American former professional basketball player. He played fifteen seasons in the NBA, winning six NBA championships with the Chicago Bulls, and is widely considered the greatest basketball player of all time.',
    metrics: {
      primary_metric_label: 'Height / Wingspan',
      primary_metric_value: "6'6\" (1.98m) • 6'11\" Reach",
      secondary_metric_label: 'Scoring Average',
      secondary_metric_value: '30.1 PPG (All-Time NBA Record)',
      tertiary_metric_label: 'Championship Rings',
      tertiary_metric_value: '6x NBA Champion (6-0 Finals)',
      career_honors: ['6x NBA Champion', '6x NBA Finals MVP', '5x NBA Regular Season MVP', '10x NBA Scoring Champion', '2x Olympic Gold Medalist']
    },
    isLegend: true
  },
  {
    id: 'p-osimhen',
    name: 'Victor Osimhen',
    sport: 'SOCCER',
    team_name: 'Galatasaray / Napoli',
    country: 'Nigeria',
    position: 'Striker / Poacher',
    jersey_number: '9',
    birth_date: '1998-12-29',
    age: 27,
    photo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Victor_Osimhen_2023.jpg/440px-Victor_Osimhen_2023.jpg',
    fallback_initials: 'VO',
    rating: 92,
    market_value: '€100,000,000',
    bio: 'Victor James Osimhen is a Nigerian professional footballer who plays as a striker for Süper Lig club Galatasaray and the Nigeria national team. Renowned for his explosive pace, aerial prowess, elite pressing, and clinical finishing.',
    metrics: {
      primary_metric_label: 'Preferred Foot',
      primary_metric_value: 'Right Foot (Aerial Dominance)',
      secondary_metric_label: 'Top Sprint Speed',
      secondary_metric_value: '36.6 km/h',
      tertiary_metric_label: 'Major Honors',
      tertiary_metric_value: 'Serie A Champion (Capocannoniere) • CAF Best',
      career_honors: ['African Footballer of the Year (2023)', 'Serie A Champion (2022-23)', 'Serie A Top Scorer (Capocannoniere)', 'FIFA U-17 World Cup Golden Boot']
    },
    isLegend: false
  },
  {
    id: 'p-hamilton',
    name: 'Lewis Hamilton',
    sport: 'MOTORSPORT',
    team_name: 'Scuderia Ferrari / Mercedes',
    country: 'United Kingdom',
    position: 'Formula 1 Driver',
    jersey_number: '44',
    birth_date: '1985-01-07',
    age: 41,
    photo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Lewis_Hamilton_2022_F1_Austria.jpg/440px-Lewis_Hamilton_2022_F1_Austria.jpg',
    fallback_initials: 'LH',
    rating: 98,
    market_value: '7x World Champion',
    bio: 'Sir Lewis Carl Davidson Hamilton is a British racing driver competing in Formula One. Hamilton holds the records for the most race wins (105+), pole positions (104+), and podium finishes (200+), tied for the most World Drivers Championships (7).',
    metrics: {
      primary_metric_label: 'Grid / Car Number',
      primary_metric_value: '#44 (Scuderia Ferrari)',
      secondary_metric_label: 'Grand Prix Race Wins',
      secondary_metric_value: '105 GP Victories (Record)',
      tertiary_metric_label: 'World Championships',
      tertiary_metric_value: '7x F1 World Champion',
      career_honors: ['7x FIA Formula One World Champion', '105+ Formula 1 Grand Prix Wins', '104+ F1 Pole Positions', 'Knight Bachelor (Sir)']
    },
    isLegend: true
  }
];

interface PlayerRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenClub?: (clubName: string) => void;
  onOpenLeague?: (leagueName: string) => void;
}

export const PlayerRadarModal: React.FC<PlayerRadarModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const [search, setSearch] = useState('');
  const [selectedSport, setSelectedSport] = useState<string>('ALL');
  const [playersList, setPlayersList] = useState<UniversalAthleteRecord[]>(DEFAULT_GLOBAL_LEGENDS);
  const [selectedPlayer, setSelectedPlayer] = useState<UniversalAthleteRecord>(DEFAULT_GLOBAL_LEGENDS[0]);
  const [followedIds, setFollowedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mivaj_followed_players');
      if (saved) setFollowedIds(JSON.parse(saved));
    } catch {}
  }, []);

  const handleToggleFollow = (playerId: string) => {
    phoneHardware.triggerHaptic('SUCCESS');
    let updated: string[] = [];
    if (followedIds.includes(playerId)) {
      updated = followedIds.filter(id => id !== playerId);
    } else {
      updated = [...followedIds, playerId];
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
    setFollowedIds(updated);
    try {
      localStorage.setItem('mivaj_followed_players', JSON.stringify(updated));
    } catch {}
  };

  const handleSearchLive = async (term: string) => {
    if (!term.trim()) {
      setPlayersList(DEFAULT_GLOBAL_LEGENDS);
      setSelectedPlayer(DEFAULT_GLOBAL_LEGENDS[0]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/v1/players?query=${encodeURIComponent(term.trim())}`);
      if (res.ok) {
        const json = await res.json();
        const apiData = json.data || [];
        if (apiData.length > 0) {
          setPlayersList(apiData);
          setSelectedPlayer(apiData[0]);
        }
      }
    } catch (err) {
      console.warn('Player search error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredPlayers = playersList.filter(p => {
    if (selectedSport !== 'ALL' && !p.sport.includes(selectedSport)) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn overflow-y-auto font-mono">
      <div className="relative w-full max-w-4xl glass-panel-premium rounded-3xl border-2 border-gold/60 p-5 sm:p-7 shadow-2xl my-auto text-white space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-bold text-gold">
            <Trophy className="w-4 h-4" />
            <span>MULTI-TIER OPEN SPORTS ENCYCLOPEDIA • WIKIPEDIA &amp; THESPORTSDB</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            GLOBAL PLAYERS &amp; ATHLETES DIRECTORY
          </h2>
        </div>

        {/* Search & Sport Filter Bar */}
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
              placeholder="Search any player in world history (e.g. Okocha, Pelé, Jordan, Kobe, Hamilton, Osimhen)..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-neutral-950 border border-neutral-700 text-xs text-white placeholder-gray-500 focus:border-gold focus:outline-none font-mono"
            />
            {loading && (
              <RefreshCw className="w-4 h-4 text-gold animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
            )}
          </div>

          <div className="flex items-center space-x-1 overflow-x-auto text-[11px]">
            {(['ALL', 'SOCCER', 'BASKETBALL', 'TENNIS', 'MOTORSPORT', 'COMBAT', 'ATHLETICS'] as const).map((s) => (
              <button
                key={s}
                onClick={() => {
                  phoneHardware.triggerHaptic('SELECTION');
                  setSelectedSport(s);
                }}
                className={`px-3 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
                  selectedSport === s ? 'bg-gold text-black font-black' : 'bg-neutral-900 text-gray-400 border border-neutral-800'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid: Left Column Players List + Right Column Deep Sport Dossier */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Left Column: Player Cards */}
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {filteredPlayers.map((player) => {
              const isSelected = selectedPlayer?.id === player.id;
              const isFollowed = followedIds.includes(player.id);
              const hasPhoto = player.photo_url && !imgErrors[player.id];

              return (
                <button
                  type="button"
                  key={player.id}
                  onClick={() => {
                    phoneHardware.triggerHaptic('SELECTION');
                    setSelectedPlayer(player);
                  }}
                  className={`w-full p-3 rounded-2xl text-left transition-all border flex items-center space-x-3 ${
                    isSelected
                      ? 'bg-neutral-800 border-gold shadow-lg shadow-gold/20 ring-1 ring-gold'
                      : 'bg-neutral-950/80 hover:bg-neutral-900 border-neutral-800'
                  }`}
                >
                  {hasPhoto ? (
                    <img
                      src={player.photo_url}
                      alt={player.name}
                      className="w-11 h-11 rounded-2xl object-cover object-top border border-white/10 flex-shrink-0 bg-neutral-900 shadow-md"
                      onError={() => setImgErrors(prev => ({ ...prev, [player.id]: true }))}
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-2xl bg-neutral-900 border border-gold/40 flex items-center justify-center font-black text-xs text-gold flex-shrink-0 shadow-inner">
                      {player.fallback_initials || '★'}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-1">
                      <span className="font-bold text-xs text-white block truncate">{player.name}</span>
                      {player.isLegend && (
                        <span className="px-1.5 py-0.2 rounded bg-gold/20 text-gold text-[8px] font-black flex-shrink-0">GOAT</span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400 block truncate">{player.team_name}</span>
                    <span className="text-[9px] text-stadiumGreen font-bold block truncate">{player.sport} • {player.country}</span>
                  </div>

                  {isFollowed && <Star className="w-3.5 h-3.5 fill-gold text-gold flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Right Column: Full Sport-Specific Dossier & Wikipedia Status */}
          {selectedPlayer ? (
            <div className="md:col-span-2 p-5 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-4 max-h-[420px] overflow-y-auto">
              
              {/* Header with Authentic Portrait & Follow CTA */}
              <div className="flex items-start justify-between gap-3 border-b border-neutral-800 pb-3">
                <div className="flex items-center space-x-3.5">
                  {selectedPlayer.photo_url && !imgErrors[selectedPlayer.id] ? (
                    <img
                      src={selectedPlayer.photo_url}
                      alt={selectedPlayer.name}
                      className="w-16 h-16 rounded-2xl object-cover object-top border-2 border-gold/60 bg-neutral-900 shadow-xl"
                      onError={() => setImgErrors(prev => ({ ...prev, [selectedPlayer.id]: true }))}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-neutral-900 border-2 border-gold/60 flex items-center justify-center font-black text-base text-gold shadow-xl">
                      {selectedPlayer.fallback_initials || '★'}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30 font-bold uppercase">
                        {selectedPlayer.sport} • {selectedPlayer.country}
                      </span>
                      {selectedPlayer.isLegend && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-bold">
                          HALL OF FAME
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-white">{selectedPlayer.name}</h3>
                    <span className="text-xs text-gray-400 font-sans">{selectedPlayer.team_name} • #{selectedPlayer.jersey_number}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleFollow(selectedPlayer.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center space-x-1.5 transition-all ${
                    followedIds.includes(selectedPlayer.id)
                      ? 'bg-gold text-black shadow-lg shadow-gold/25'
                      : 'bg-neutral-900 text-gray-300 border border-neutral-700 hover:border-gold'
                  }`}
                >
                  {followedIds.includes(selectedPlayer.id) ? <UserCheck className="w-3.5 h-3.5" /> : <Star className="w-3.5 h-3.5" />}
                  <span>{followedIds.includes(selectedPlayer.id) ? 'Following' : 'Follow'}</span>
                </button>
              </div>

              {/* General Bio Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-sans">
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="text-[10px] text-gray-400 block">🎂 Birth Date</span>
                  <strong className="text-white text-xs block truncate">{selectedPlayer.birth_date}</strong>
                </div>

                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="text-[10px] text-gray-400 block">Age</span>
                  <strong className="text-gold text-xs block">{selectedPlayer.age} Years</strong>
                </div>

                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="text-[10px] text-gray-400 block">Position</span>
                  <strong className="text-white text-xs block truncate">{selectedPlayer.position}</strong>
                </div>

                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="text-[10px] text-gray-400 block">Status / Tier</span>
                  <strong className="text-stadiumGreen text-xs block truncate">{selectedPlayer.market_value}</strong>
                </div>
              </div>

              {/* 🌟 SPORT-SPECIFIC DEEP METRICS & HONORS (UNIQUE TO EACH SPORT) */}
              {selectedPlayer.metrics && (
                <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-gold/30 space-y-2.5 font-sans">
                  <span className="text-[11px] font-black text-gold flex items-center space-x-1.5 font-mono">
                    <Zap className="w-3.5 h-3.5 text-gold" />
                    <span>SPORT-SPECIFIC ATTRIBUTES ({selectedPlayer.sport})</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-800">
                      <span className="text-[10px] text-gray-400 block">{selectedPlayer.metrics.primary_metric_label}</span>
                      <strong className="text-white text-xs block truncate">{selectedPlayer.metrics.primary_metric_value}</strong>
                    </div>

                    <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-800">
                      <span className="text-[10px] text-gray-400 block">{selectedPlayer.metrics.secondary_metric_label}</span>
                      <strong className="text-white text-xs block truncate">{selectedPlayer.metrics.secondary_metric_value}</strong>
                    </div>

                    <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-800">
                      <span className="text-[10px] text-gray-400 block">{selectedPlayer.metrics.tertiary_metric_label}</span>
                      <strong className="text-gold text-xs block truncate">{selectedPlayer.metrics.tertiary_metric_value}</strong>
                    </div>
                  </div>

                  {selectedPlayer.metrics.career_honors && selectedPlayer.metrics.career_honors.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {selectedPlayer.metrics.career_honors.map((honor, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-gold/15 text-gold text-[10px] font-bold border border-gold/30 flex items-center space-x-1">
                          <Check className="w-3 h-3 text-gold" />
                          <span>{honor}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Wikipedia Career Overview */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white flex items-center space-x-1.5 font-mono">
                    <Globe className="w-3.5 h-3.5 text-gold" />
                    <span>WIKIPEDIA DOSSIER &amp; CAREER OVERVIEW</span>
                  </span>
                  <a
                    href={`https://en.wikipedia.org/wiki/${encodeURIComponent(selectedPlayer.name.replace(/\s+/g, '_'))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-gold hover:underline flex items-center space-x-1 font-mono font-bold"
                  >
                    <span>Read on Wikipedia</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                  {selectedPlayer.bio}
                </p>
              </div>

              {/* 🌐 FEDERATED MULTI-SOURCE EXTERNAL RECORDS & SCOUTING INTEL */}
              {(() => {
                const links = generatePlayerExternalLinks(selectedPlayer.name);
                return (
                  <div className="pt-3 border-t border-neutral-800 space-y-2">
                    <span className="text-[11px] font-black text-gray-300 flex items-center space-x-1.5 font-mono">
                      <BookOpen className="w-3.5 h-3.5 text-stadiumGreen" />
                      <span>FEDERATED EXTERNAL SPORTS INTELLIGENCE SOURCES:</span>
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                      <a
                        href={links.wikipediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 text-white flex items-center justify-between group transition-all"
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <span className="text-sm">📖</span>
                          <span className="truncate font-bold text-[11px]">Wikipedia</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-gold transition-colors flex-shrink-0" />
                      </a>

                      <a
                        href={links.transfermarktUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 text-white flex items-center justify-between group transition-all"
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <span className="text-sm">💶</span>
                          <span className="truncate font-bold text-[11px]">Transfermarkt</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-gold transition-colors flex-shrink-0" />
                      </a>

                      <a
                        href={links.fbrefUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 text-white flex items-center justify-between group transition-all"
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <span className="text-sm">📊</span>
                          <span className="truncate font-bold text-[11px]">FBref Scouting</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-gold transition-colors flex-shrink-0" />
                      </a>

                      <a
                        href={links.sofascoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 text-white flex items-center justify-between group transition-all"
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <span className="text-sm">🏆</span>
                          <span className="truncate font-bold text-[11px]">Sofascore Live</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-gold transition-colors flex-shrink-0" />
                      </a>
                    </div>
                  </div>
                );
              })()}

            </div>
          ) : (
            <div className="md:col-span-2 p-8 rounded-3xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-center text-gray-500 text-xs">
              Select any player on the left or search above to view full career profile.
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
