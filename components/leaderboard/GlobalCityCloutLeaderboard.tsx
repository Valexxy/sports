'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Flame, Globe, Heart, Zap, Shield, MapPin, Star, TrendingUp, Users, ChevronUp, Search } from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { stadiumAudio } from '../../lib/sound-synthesizer';

export interface CityCloutEntry {
  rank: number;
  city: string;
  country: string;
  flag: string;
  continent: string;
  cloutPoints: number;
  viewingCenters: number;
  matchdayCheers: number;
  antiJinxShields: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  badge?: string;
}

const SEED_CITIES: Omit<CityCloutEntry, 'rank'>[] = [
  { city: 'Onitsha', country: 'Nigeria', flag: '🇳🇬', continent: 'Africa', cloutPoints: 9840, viewingCenters: 214, matchdayCheers: 4920, antiJinxShields: 312, trend: 'UP', badge: '🦅 Anambra Main Hub' },
  { city: 'Awka', country: 'Nigeria', flag: '🇳🇬', continent: 'Africa', cloutPoints: 9610, viewingCenters: 148, matchdayCheers: 4350, antiJinxShields: 410, trend: 'UP', badge: '🦅 Anambra Capital' },
  { city: 'Lagos', country: 'Nigeria', flag: '🇳🇬', continent: 'Africa', cloutPoints: 9450, viewingCenters: 389, matchdayCheers: 5100, antiJinxShields: 280, trend: 'UP', badge: '🔥 Eko Center' },
  { city: 'London', country: 'United Kingdom', flag: '🇬🇧', continent: 'Europe', cloutPoints: 9320, viewingCenters: 520, matchdayCheers: 4750, antiJinxShields: 190, trend: 'STABLE', badge: '👑 Terrace King' },
  { city: 'Nnewi', country: 'Nigeria', flag: '🇳🇬', continent: 'Africa', cloutPoints: 8890, viewingCenters: 112, matchdayCheers: 3600, antiJinxShields: 340, trend: 'UP', badge: '⚙️ Industrial Hub' },
  { city: 'Nairobi', country: 'Kenya', flag: '🇰🇪', continent: 'Africa', cloutPoints: 8720, viewingCenters: 143, matchdayCheers: 3890, antiJinxShields: 210, trend: 'UP' },
  { city: 'Manchester', country: 'United Kingdom', flag: '🇬🇧', continent: 'Europe', cloutPoints: 8500, viewingCenters: 340, matchdayCheers: 4100, antiJinxShields: 175, trend: 'DOWN' },
  { city: 'São Paulo', country: 'Brazil', flag: '🇧🇷', continent: 'South America', cloutPoints: 8310, viewingCenters: 280, matchdayCheers: 4600, antiJinxShields: 130, trend: 'UP', badge: '🎵 Samba Energy' },
  { city: 'Johannesburg', country: 'South Africa', flag: '🇿🇦', continent: 'Africa', cloutPoints: 8100, viewingCenters: 190, matchdayCheers: 3500, antiJinxShields: 200, trend: 'STABLE' },
  { city: 'Accra', country: 'Ghana', flag: '🇬🇭', continent: 'Africa', cloutPoints: 7890, viewingCenters: 155, matchdayCheers: 3100, antiJinxShields: 180, trend: 'UP' },
  { city: 'Madrid', country: 'Spain', flag: '🇪🇸', continent: 'Europe', cloutPoints: 7650, viewingCenters: 410, matchdayCheers: 3800, antiJinxShields: 145, trend: 'DOWN' },
  { city: 'New York', country: 'United States', flag: '🇺🇸', continent: 'North America', cloutPoints: 7420, viewingCenters: 230, matchdayCheers: 2900, antiJinxShields: 160, trend: 'UP' },
  { city: 'Ekwulobia', country: 'Nigeria', flag: '🇳🇬', continent: 'Africa', cloutPoints: 7120, viewingCenters: 64, matchdayCheers: 2450, antiJinxShields: 220, trend: 'UP', badge: '🦅 Anambra South' },
  { city: 'Ihiala', country: 'Nigeria', flag: '🇳🇬', continent: 'Africa', cloutPoints: 6850, viewingCenters: 52, matchdayCheers: 2100, antiJinxShields: 185, trend: 'UP' },
  { city: 'Barcelona', country: 'Spain', flag: '🇪🇸', continent: 'Europe', cloutPoints: 6520, viewingCenters: 390, matchdayCheers: 3300, antiJinxShields: 120, trend: 'DOWN' },
];

const STORAGE_KEY = 'mivaj_city_clout_v2';
const USER_CITY_KEY = 'mivaj_user_city';
const CONTINENTS = ['All', 'Africa', 'Europe', 'South America', 'North America'];

export const GlobalCityCloutLeaderboard: React.FC = () => {
  const [cities, setCities] = useState<CityCloutEntry[]>([]);
  const [userCity, setUserCity] = useState<string>('');
  const [cheeredCities, setCheeredCities] = useState<Set<string>>(new Set());
  const [continent, setContinent] = useState('All');
  const [cheerAnim, setCheerAnim] = useState<string | null>(null);
  const [searchCity, setSearchCity] = useState('');

  useEffect(() => {
    let stored: CityCloutEntry[] | null = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) stored = JSON.parse(raw);
    } catch {}

    const base = stored || SEED_CITIES.map((c, i) => ({ ...c, rank: i + 1 }));
    setCities(base);

    try {
      const uCity = localStorage.getItem(USER_CITY_KEY) || localStorage.getItem('mivaj_current_city') || '';
      setUserCity(uCity);

      const cheered = JSON.parse(localStorage.getItem('mivaj_cheered_cities') || '[]');
      setCheeredCities(new Set(cheered));
    } catch {}
  }, []);

  const save = (updated: CityCloutEntry[]) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
  };

  const handleCheer = useCallback((cityName: string) => {
    if (cheeredCities.has(cityName)) return;
    const newCheered = new Set(cheeredCities);
    newCheered.add(cityName);
    setCheeredCities(newCheered);
    try { localStorage.setItem('mivaj_cheered_cities', JSON.stringify([...newCheered])); } catch {}

    setCities(prev => {
      const updated = prev.map(c => {
        if (c.city.toLowerCase() === cityName.toLowerCase()) {
          return {
            ...c,
            cloutPoints: c.cloutPoints + 15,
            matchdayCheers: c.matchdayCheers + 1,
            trend: 'UP' as const,
          };
        }
        return c;
      });
      const sorted = [...updated].sort((a, b) => b.cloutPoints - a.cloutPoints).map((c, i) => ({ ...c, rank: i + 1 }));
      save(sorted);
      return sorted;
    });

    setCheerAnim(cityName);
    setTimeout(() => setCheerAnim(null), 1500);

    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.playCrowdCheer();
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 }, colors: ['#00e676', '#ffd700', '#ffffff'] });

    // Send to Supabase
    fetch('/api/leaderboard/city-cheer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city: cityName, country: cities.find(c => c.city === cityName)?.country || 'Global' }),
    }).catch(() => {});
  }, [cheeredCities, cities]);

  const filtered = cities
    .filter(c => continent === 'All' || c.continent === continent)
    .filter(c => !searchCity || c.city.toLowerCase().includes(searchCity.toLowerCase()) || c.country.toLowerCase().includes(searchCity.toLowerCase()));

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between bg-black/50 p-3 rounded-2xl border border-white/10">
        <div className="flex items-center space-x-2">
          <Globe className="w-5 h-5 text-stadiumGreen animate-pulse" />
          <div>
            <h2 className="font-extrabold text-sm text-white">Global City Fan Clout Leaderboard</h2>
            <p className="text-[10px] text-gray-400 font-sans">
              Worldwide territory fan pride & matchday viewing energy • Zero tipsters
            </p>
          </div>
        </div>
        <span className="text-[9px] px-2.5 py-1 rounded-full bg-stadiumGreen/20 text-stadiumGreen font-black border border-stadiumGreen/30">
          🌍 {cities.length} Hubs
        </span>
      </div>

      {/* Search & Continent Filters */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-500" />
          <input
            type="text"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            placeholder="Search city (e.g. Awka, Onitsha, London, Nairobi, Madrid)..."
            className="w-full bg-black/60 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-stadiumGreen font-sans"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
          {CONTINENTS.map((cont) => (
            <button
              key={cont}
              onClick={() => setContinent(cont)}
              className={`px-3 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap border transition-all ${
                continent === cont
                  ? 'bg-stadiumGreen/20 border-stadiumGreen text-stadiumGreen shadow-sm'
                  : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {cont}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-0.5">
        {filtered.map((entry) => {
          const isUserCity = Boolean(userCity && entry.city.toLowerCase().includes(userCity.toLowerCase()));
          const alreadyCheered = cheeredCities.has(entry.city);
          const isAnimating = cheerAnim === entry.city;

          return (
            <div
              key={entry.city}
              className={`rounded-2xl p-3 border transition-all ${
                isUserCity
                  ? 'bg-gradient-to-r from-stadiumGreen/15 via-black/80 to-gold/10 border-stadiumGreen/60 shadow-lg'
                  : 'bg-black/40 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Rank Badge */}
                <div className="text-base font-black text-gray-300 w-8 text-center flex-shrink-0">
                  {getRankIcon(entry.rank)}
                </div>

                {/* City & Country */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs sm:text-sm font-extrabold text-white truncate">
                      {entry.flag} {entry.city}
                    </span>
                    {entry.badge && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-gray-200 font-sans">
                        {entry.badge}
                      </span>
                    )}
                    {isUserCity && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-stadiumGreen text-black font-black">
                        📍 Your Hub
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-400 flex-wrap">
                    <span className="font-sans">{entry.country}</span>
                    <span className="flex items-center gap-1 text-gold font-bold">
                      <Flame className="w-3 h-3 text-gold" />
                      {entry.cloutPoints.toLocaleString()} CP
                    </span>
                    <span className="flex items-center gap-1 text-gray-300 font-sans hidden xs:flex">
                      <Users className="w-3 h-3 text-cyan-400" />
                      {entry.viewingCenters} Lounges
                    </span>
                    <span className={`font-bold ${
                      entry.trend === 'UP' ? 'text-stadiumGreen' : entry.trend === 'DOWN' ? 'text-red-400' : 'text-gray-500'
                    }`}>
                      {entry.trend === 'UP' ? '▲ Rising' : entry.trend === 'DOWN' ? '▼ Cooling' : '— Steady'}
                    </span>
                  </div>
                </div>

                {/* 1-Tap Cheer Action */}
                <button
                  type="button"
                  onClick={() => handleCheer(entry.city)}
                  disabled={alreadyCheered}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1 border transition-all active:scale-90 shadow-md ${
                    isAnimating
                      ? 'bg-stadiumGreen text-black border-stadiumGreen scale-105 shadow-stadiumGreen/50'
                      : alreadyCheered
                      ? 'bg-white/5 text-gray-500 border-white/10 cursor-not-allowed'
                      : 'bg-stadiumGreen/20 text-stadiumGreen border-stadiumGreen/50 hover:bg-stadiumGreen hover:text-black'
                  }`}
                  title={alreadyCheered ? 'Already cheered for this city today' : `Send +15 Clout Points to ${entry.city}`}
                >
                  <Zap className="w-3 h-3" />
                  <span>{alreadyCheered ? 'Cheered ✓' : '+15 Clout'}</span>
                </button>
              </div>

              {/* Sub-bar stats */}
              <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] text-gray-500 font-sans">
                <span className="flex items-center gap-1">
                  <Heart className="w-2.5 h-2.5 text-crimson" />
                  {entry.matchdayCheers.toLocaleString()} Matchday Cheers
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5 text-stadiumGreen" />
                  {entry.antiJinxShields} Jinx Shields Active
                </span>
                <span className="text-gray-400">{entry.continent}</span>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-xs font-sans">
            No cities match your search. Try searching &quot;Awka&quot;, &quot;Onitsha&quot;, &quot;London&quot;, or &quot;Nairobi&quot;.
          </div>
        )}
      </div>
    </div>
  );
};
