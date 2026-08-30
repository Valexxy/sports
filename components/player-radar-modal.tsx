'use client';

import React, { useState, useEffect } from 'react';
import { 
  Star, X, Search, Shield, Zap, Trophy, Flame, 
  Target, Award, Activity, CheckCircle2, TrendingUp, 
  Sparkles, ArrowLeft, Calendar, Share2, Globe, Heart, RefreshCw, UserCheck, Check,
  BookOpen, Layers, DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { 
  getCompleteNativePlayerDossier, 
  NativePlayerDossier 
} from '../lib/player-intelligence-engine';

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
    id: 'p-haaland',
    name: 'Erling Haaland',
    sport: 'SOCCER',
    team_name: 'Manchester City',
    country: 'Norway',
    position: 'Striker',
    jersey_number: '9',
    birth_date: '2000-07-21',
    age: 26,
    photo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Erling_Haaland_2023_%28cropped-v2%29.jpg/440px-Erling_Haaland_2023_%28cropped-v2%29.jpg',
    fallback_initials: 'EH',
    rating: 94,
    market_value: '€180,000,000',
    bio: 'Erling Braut Haaland is a Norwegian professional footballer who plays as a striker for Premier League club Manchester City and the Norway national team. Known for his speed, positioning, strength, and clinical finishing inside the penalty box.',
    metrics: {
      primary_metric_label: 'Preferred Foot',
      primary_metric_value: 'Left Foot (Devastating Finisher)',
      secondary_metric_label: 'Goal Ratio',
      secondary_metric_value: '1.05 Goals Per Game (PL Record)',
      tertiary_metric_label: 'Major Honors',
      tertiary_metric_value: 'UEFA Champions League • Premier League Treble',
      career_honors: ['UEFA Champions League Winner (2023)', 'Premier League Golden Boot (2x)', 'UEFA Men\'s Player of the Year', 'Gerd Müller Trophy']
    },
    isLegend: false
  },
  {
    id: 'p-mbappe',
    name: 'Kylian Mbappé',
    sport: 'SOCCER',
    team_name: 'Real Madrid',
    country: 'France',
    position: 'Forward / Winger',
    jersey_number: '9',
    birth_date: '1998-12-20',
    age: 27,
    photo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/2019-07-17_SG_Dynamo_Dresden_vs._Paris_Saint-Germain_by_Sandro_Halank%E2%80%93129_%28cropped%29.jpg/440px-2019-07-17_SG_Dynamo_Dresden_vs._Paris_Saint-Germain_by_Sandro_Halank%E2%80%93129_%28cropped%29.jpg',
    fallback_initials: 'KM',
    rating: 95,
    market_value: '€180,000,000',
    bio: 'Kylian Mbappé Lottin is a French professional footballer who plays as a forward for La Liga club Real Madrid and captains the France national team. Renowned for his world-class speed, elite dribbling, and prolific goalscoring ability on the biggest stages.',
    metrics: {
      primary_metric_label: 'Preferred Foot',
      primary_metric_value: 'Right Foot (Lightning Pace)',
      secondary_metric_label: 'World Cup Record',
      secondary_metric_value: 'World Cup Final Hat-Trick (2022)',
      tertiary_metric_label: 'Major Honors',
      tertiary_metric_value: 'FIFA World Cup Winner (2018) • Golden Boot',
      career_honors: ['FIFA World Cup Champion (2018)', 'FIFA World Cup Golden Boot (2022)', 'UEFA Nations League Winner (2021)', 'Ligue 1 Player of the Year (5x)']
    },
    isLegend: false
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
  const [nativeDossier, setNativeDossier] = useState<NativePlayerDossier | null>(null);
  const [activeTab, setActiveTab] = useState<'RADAR' | 'WIKI_BIO' | 'HONORS' | 'VALUATION'>('RADAR');
  const [followedIds, setFollowedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [dossierLoading, setDossierLoading] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mivaj_followed_players');
      if (saved) setFollowedIds(JSON.parse(saved));
    } catch {}
  }, []);

  // Fetch full rich native dossier whenever selected player changes (100% in-app, zero external redirects)
  useEffect(() => {
    if (!selectedPlayer) return;
    let isCurrent = true;
    setDossierLoading(true);

    getCompleteNativePlayerDossier(selectedPlayer.name, selectedPlayer.sport, selectedPlayer.team_name)
      .then((dossier) => {
        if (isCurrent) {
          setNativeDossier(dossier);
          setDossierLoading(false);
        }
      })
      .catch(() => {
        if (isCurrent) setDossierLoading(false);
      });

    return () => { isCurrent = false; };
  }, [selectedPlayer?.name]);

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
            <span>MIVAJ NATIVE SPORTS INTELLIGENCE HUB • 100% IN-APP ATHLETE DOSSIERS</span>
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

        {/* Main Grid: Left Column Players List + Right Column Deep Native Dossier */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Left Column: Player Cards */}
          <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
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
                      ? 'bg-gold/20 border-gold shadow-lg shadow-gold/15'
                      : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {hasPhoto ? (
                    <img
                      src={player.photo_url}
                      alt={player.name}
                      className="w-12 h-12 rounded-xl object-cover object-top border border-gold/40 flex-shrink-0 bg-neutral-900"
                      onError={() => setImgErrors(prev => ({ ...prev, [player.id]: true }))}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-gold/40 flex items-center justify-center font-bold text-xs text-gold flex-shrink-0">
                      {player.fallback_initials || '★'}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-1.5">
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

          {/* Right Column: 100% Native In-App Player Dossier (Zero External Redirects) */}
          {selectedPlayer ? (
            <div className="md:col-span-2 p-5 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-4 max-h-[440px] overflow-y-auto">
              
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
                    <span className="text-xs text-gray-400 font-sans">{selectedPlayer.team_name} • #{selectedPlayer.jersey_number || '10'}</span>
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

              {/* 🗂️ 4 NATIVE IN-APP DOSSIER TABS (ZERO OUTBOUND REDIRECTS) */}
              <div className="flex items-center space-x-1 border-b border-neutral-800 pb-2 text-[11px] font-mono">
                <button
                  onClick={() => setActiveTab('RADAR')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    activeTab === 'RADAR'
                      ? 'bg-gold text-black font-black shadow-md'
                      : 'bg-neutral-900 text-gray-400 hover:text-white'
                  }`}
                >
                  ⚡ Scouting Radar
                </button>
                <button
                  onClick={() => setActiveTab('WIKI_BIO')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    activeTab === 'WIKI_BIO'
                      ? 'bg-gold text-black font-black shadow-md'
                      : 'bg-neutral-900 text-gray-400 hover:text-white'
                  }`}
                >
                  📖 Full Encyclopedia
                </button>
                <button
                  onClick={() => setActiveTab('HONORS')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    activeTab === 'HONORS'
                      ? 'bg-gold text-black font-black shadow-md'
                      : 'bg-neutral-900 text-gray-400 hover:text-white'
                  }`}
                >
                  🏆 Trophies &amp; Honors
                </button>
                <button
                  onClick={() => setActiveTab('VALUATION')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    activeTab === 'VALUATION'
                      ? 'bg-gold text-black font-black shadow-md'
                      : 'bg-neutral-900 text-gray-400 hover:text-white'
                  }`}
                >
                  💶 Valuation &amp; Clubs
                </button>
              </div>

              {/* TAB 1: SCOUTING RADAR & ATTRIBUTES */}
              {activeTab === 'RADAR' && (
                <div className="space-y-3 animate-fadeIn font-sans">
                  {nativeDossier && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                      <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800">
                        <span className="text-[10px] text-gray-400 block">⚡ Pace / Speed</span>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
                            <div className="h-full bg-stadiumGreen" style={{ width: `${nativeDossier.attributes.pace}%` }} />
                          </div>
                          <span className="text-white font-bold">{nativeDossier.attributes.pace}</span>
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800">
                        <span className="text-[10px] text-gray-400 block">🎯 Shooting</span>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gold" style={{ width: `${nativeDossier.attributes.shooting}%` }} />
                          </div>
                          <span className="text-white font-bold">{nativeDossier.attributes.shooting}</span>
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800">
                        <span className="text-[10px] text-gray-400 block">🪄 Passing &amp; Vision</span>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-400" style={{ width: `${nativeDossier.attributes.passing}%` }} />
                          </div>
                          <span className="text-white font-bold">{nativeDossier.attributes.passing}</span>
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800">
                        <span className="text-[10px] text-gray-400 block">🕺 Dribbling</span>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-400" style={{ width: `${nativeDossier.attributes.dribbling}%` }} />
                          </div>
                          <span className="text-white font-bold">{nativeDossier.attributes.dribbling}</span>
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800">
                        <span className="text-[10px] text-gray-400 block">🛡️ Defending</span>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-400" style={{ width: `${nativeDossier.attributes.defending}%` }} />
                          </div>
                          <span className="text-white font-bold">{nativeDossier.attributes.defending}</span>
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800">
                        <span className="text-[10px] text-gray-400 block">💪 Physicality</span>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500" style={{ width: `${nativeDossier.attributes.physicality}%` }} />
                          </div>
                          <span className="text-white font-bold">{nativeDossier.attributes.physicality}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800 text-xs">
                    <strong className="text-gold font-mono block mb-1">🧠 TACTICAL STYLE &amp; MATCH IMPACT:</strong>
                    <p className="text-gray-300 leading-relaxed font-sans">
                      {nativeDossier?.styleOfPlay || 'High pressing intensity, exceptional off-the-ball movement, and decisive finishing.'}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: FULL WIKIPEDIA ENCYCLOPEDIA BIOGRAPHY (PULLED 100% IN-APP) */}
              {activeTab === 'WIKI_BIO' && (
                <div className="space-y-3 animate-fadeIn text-xs text-neutral-300 leading-relaxed font-sans">
                  <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-gold/30">
                    <strong className="text-gold font-mono block mb-1">📖 ENCYCLOPEDIC CAREER SUMMARY:</strong>
                    <p className="text-white font-bold mb-2">
                      {nativeDossier?.biographySummary || selectedPlayer.bio}
                    </p>
                    <div className="whitespace-pre-line text-gray-300 pt-2 border-t border-white/10 max-h-60 overflow-y-auto pr-1">
                      {nativeDossier?.fullBiography || selectedPlayer.bio}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: TROPHIES & CAREER HONORS */}
              {activeTab === 'HONORS' && (
                <div className="space-y-2.5 animate-fadeIn font-sans">
                  <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
                    <span className="text-xs font-black text-gold font-mono block mb-2">🏆 VERIFIED TROPHY CABINET &amp; PERSONAL AWARDS:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(nativeDossier?.careerHonors || selectedPlayer.metrics.career_honors || []).map((honor, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-neutral-950 border border-gold/30 flex items-center space-x-2 text-xs">
                          <Trophy className="w-4 h-4 text-gold flex-shrink-0" />
                          <span className="text-white font-bold">{honor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: VALUATION & CAREER CLUBS */}
              {activeTab === 'VALUATION' && (
                <div className="space-y-3 animate-fadeIn font-mono text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
                      <span className="text-gray-400 block text-[10px]">💶 Estimated Market Valuation:</span>
                      <strong className="text-stadiumGreen text-sm block">{nativeDossier?.marketValue || selectedPlayer.market_value}</strong>
                    </div>

                    <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
                      <span className="text-gray-400 block text-[10px]">💰 Weekly Wage Package:</span>
                      <strong className="text-gold text-sm block">{nativeDossier?.wageEstimate || '₦45,000,000 / Wk'}</strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                    <strong className="text-white font-mono block">📜 CAREER CLUB TIMELINE:</strong>
                    <div className="space-y-1.5 font-sans text-xs">
                      {(nativeDossier?.careerTimeline || []).map((item, idx) => (
                        <div key={idx} className="p-2 rounded-xl bg-neutral-950 border border-white/5 flex items-center justify-between">
                          <div>
                            <strong className="text-white font-mono block">{item.club}</strong>
                            <span className="text-gray-400 text-[10px] block">{item.achievements}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-gold/15 text-gold text-[10px] font-mono font-bold flex-shrink-0">
                            {item.period}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

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
