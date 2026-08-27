'use client';

import React, { useState, useEffect } from 'react';
import { 
  Star, X, Search, Shield, Zap, Trophy, Flame, 
  Target, Award, Activity, CheckCircle2, TrendingUp, 
  Sparkles, ArrowLeft, Calendar, Share2, Globe, Heart, RefreshCw, UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { useTranslation } from '../lib/translation-engine';

export interface UniversalPlayerRecord {
  id: string;
  name: string;
  sport: string;
  club: string;
  country: string;
  position: string;
  jersey_number?: string;
  birth_date: string;
  age: number;
  photo_url: string;
  rating: number;
  market_value: string;
  bio: string;
  isLegend?: boolean;
}

const DEFAULT_GLOBAL_LEGENDS: UniversalPlayerRecord[] = [
  {
    id: 'p-okocha',
    name: 'Jay-Jay Okocha',
    sport: 'Soccer',
    club: 'Nigeria Legends',
    country: 'Nigeria',
    position: 'Attacking Midfielder',
    jersey_number: '10',
    birth_date: '1973-08-14',
    age: 53,
    photo_url: 'https://www.thesportsdb.com/images/media/player/thumb/g7g49f1612467000.jpg',
    rating: 96,
    market_value: 'Legendary Icon',
    bio: 'Augustine Azuka "Jay-Jay" Okocha is a Nigerian former professional footballer who played as an attacking midfielder. Widely regarded as one of the greatest African players of all time, he is renowned for his extraordinary dribbling, stepovers, and flair.',
    isLegend: true
  },
  {
    id: 'p-osimhen',
    name: 'Victor Osimhen',
    sport: 'Soccer',
    club: 'Galatasaray / Napoli',
    country: 'Nigeria',
    position: 'Striker',
    jersey_number: '9',
    birth_date: '1998-12-29',
    age: 27,
    photo_url: '/players/osimhen.png',
    rating: 92,
    market_value: '€100,000,000',
    bio: 'Victor James Osimhen is a Nigerian professional footballer who plays as a striker for Süper Lig club Galatasaray and the Nigeria national team. Renowned for his explosive pace, aerial dominance, and elite finishing.',
    isLegend: false
  },
  {
    id: 'p-haaland',
    name: 'Erling Haaland',
    sport: 'Soccer',
    club: 'Manchester City',
    country: 'Norway',
    position: 'Striker',
    jersey_number: '9',
    birth_date: '2000-07-21',
    age: 26,
    photo_url: '/players/haaland.png',
    rating: 94,
    market_value: '€180,000,000',
    bio: 'Erling Braut Haaland is a Norwegian professional footballer who plays as a striker for Premier League club Manchester City and the Norway national team. Recognized as one of the most prolific goalscorers in world football.',
    isLegend: false
  },
  {
    id: 'p-jordan',
    name: 'Michael Jordan',
    sport: 'Basketball',
    club: 'Chicago Bulls Legends',
    country: 'United States',
    position: 'Shooting Guard',
    jersey_number: '23',
    birth_date: '1963-02-17',
    age: 63,
    photo_url: 'https://www.thesportsdb.com/images/media/player/thumb/michael-jordan.jpg',
    rating: 99,
    market_value: 'GOAT Icon',
    bio: 'Michael Jeffrey Jordan, also known by his initials MJ, is an American businessman and former professional basketball player. Widely considered the greatest basketball player of all time.',
    isLegend: true
  }
];

function calculateAge(birthDateStr: string): number {
  if (!birthDateStr) return 26;
  try {
    const born = new Date(birthDateStr);
    const now = new Date();
    let age = now.getFullYear() - born.getFullYear();
    const m = now.getMonth() - born.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < born.getDate())) age--;
    return age > 0 ? age : 26;
  } catch {
    return 26;
  }
}

interface PlayerRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenClub?: (clubName: string) => void;
  onOpenLeague?: (leagueName: string) => void;
}

export const PlayerRadarModal: React.FC<PlayerRadarModalProps> = ({ 
  isOpen, 
  onClose,
  onOpenClub,
  onOpenLeague 
}) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [selectedSport, setSelectedSport] = useState<string>('ALL');
  const [playersList, setPlayersList] = useState<UniversalPlayerRecord[]>(DEFAULT_GLOBAL_LEGENDS);
  const [selectedPlayer, setSelectedPlayer] = useState<UniversalPlayerRecord | null>(null);
  const [followedIds, setFollowedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

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

  const handleSearchLive = async (queryTerm: string) => {
    if (!queryTerm.trim()) {
      setPlayersList(DEFAULT_GLOBAL_LEGENDS);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(queryTerm.trim())}`);
      if (res.ok) {
        const json = await res.json();
        const apiPlayers = json.player || [];
        if (apiPlayers.length > 0) {
          const mapped: UniversalPlayerRecord[] = apiPlayers.map((p: any) => {
            const age = calculateAge(p.dateBorn);
            const isLegend = (p.strTeam || '').includes('_Retired') || (p.strTeam || '').includes('_Deceased') || age > 40;
            return {
              id: p.idPlayer || `p-${Math.random().toString(36).substring(7)}`,
              name: p.strPlayer || 'Athlete',
              sport: p.strSport || 'Soccer',
              club: p.strTeam?.replace(/^_Retired |_Deceased /g, '') || 'Global Athlete',
              country: p.strNationality || 'Global',
              position: p.strPosition || 'Forward',
              jersey_number: p.strNumber || '10',
              birth_date: p.dateBorn || '1990-01-01',
              age: age,
              photo_url: p.strThumb || p.strCutout || '/players/haaland.png',
              rating: isLegend ? 95 : 88,
              market_value: p.strWage || (isLegend ? 'Hall of Fame Icon' : '€75,000,000'),
              bio: p.strDescriptionEN || `${p.strPlayer} is a world-renowned athlete from ${p.strNationality}.`,
              isLegend
            };
          });

          setPlayersList(mapped);
          setSelectedPlayer(mapped[0]);
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
    if (selectedSport !== 'ALL' && !p.sport.toUpperCase().includes(selectedSport)) return false;
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
            <span>UNIVERSAL SPORTS ENCYCLOPEDIA • ALL ATHLETES IN HISTORY</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            GLOBAL PLAYERS &amp; ATHLETES DIRECTORY
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
              placeholder="Search any player in history (e.g. Okocha, Pelé, Jordan, Kobe, Osimhen, Haaland)..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-neutral-950 border border-neutral-700 text-xs text-white placeholder-gray-500 focus:border-gold focus:outline-none font-mono"
            />
            {loading && (
              <RefreshCw className="w-4 h-4 text-gold animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
            )}
          </div>

          <div className="flex items-center space-x-1 overflow-x-auto text-[11px]">
            {(['ALL', 'SOCCER', 'BASKETBALL', 'TENNIS', 'MOTORSPORT', 'ATHLETICS'] as const).map((s) => (
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

        {/* Main Grid: Left Column Players List + Right Column Dossier */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Left Column: Player Cards */}
          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {filteredPlayers.map((player) => {
              const isSelected = selectedPlayer?.id === player.id;
              const isFollowed = followedIds.includes(player.id);
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
                  <img
                    src={player.photo_url}
                    alt={player.name}
                    className="w-10 h-10 rounded-full object-cover border border-white/10 flex-shrink-0 bg-neutral-900"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/players/haaland.png'; }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-1">
                      <span className="font-bold text-xs text-white block truncate">{player.name}</span>
                      {player.isLegend && (
                        <span className="px-1 py-0.2 rounded bg-gold/20 text-gold text-[8px] font-black flex-shrink-0">GOAT</span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400 block truncate">{player.club} • {player.country}</span>
                  </div>

                  {isFollowed && <Star className="w-3.5 h-3.5 fill-gold text-gold flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Right Column: Full Player Dossier & Wikipedia Status */}
          {selectedPlayer ? (
            <div className="md:col-span-2 p-5 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-4 max-h-[380px] overflow-y-auto">
              
              {/* Header with Photo & Follow CTA */}
              <div className="flex items-start justify-between gap-3 border-b border-neutral-800 pb-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedPlayer.photo_url}
                    alt={selectedPlayer.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-gold/40 bg-neutral-900"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/players/haaland.png'; }}
                  />
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30 font-bold uppercase">
                        {selectedPlayer.sport} • {selectedPlayer.country}
                      </span>
                      {selectedPlayer.isLegend && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-400 font-bold">
                          HALL OF FAME
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-white">{selectedPlayer.name}</h3>
                    <span className="text-xs text-gray-400 font-sans">{selectedPlayer.club} • #{selectedPlayer.jersey_number}</span>
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

              {/* Bio Stats Grid */}
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
                  <span className="text-[10px] text-gray-400 block">Status / Value</span>
                  <strong className="text-stadiumGreen text-xs block truncate">{selectedPlayer.market_value}</strong>
                </div>
              </div>

              {/* Wikipedia Bio */}
              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-black text-white flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5 text-gold" />
                  <span>CAREER OVERVIEW &amp; BIOGRAPHY</span>
                </span>
                <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                  {selectedPlayer.bio}
                </p>
              </div>

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
