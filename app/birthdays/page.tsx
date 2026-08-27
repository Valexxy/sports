'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Sparkles, Trophy, Heart, Search, Filter, 
  Calendar, Share2, Check, RefreshCw, Star, Shield, ExternalLink 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { stadiumAudio } from '../../lib/sound-synthesizer';

export interface EnterpriseBirthdayStar {
  id: string;
  name: string;
  sport: 'SOCCER' | 'BASKETBALL' | 'TENNIS' | 'COMBAT' | 'MOTORSPORT' | 'ATHLETICS';
  birthMonth: number;
  birthDay: number;
  birthYear: number;
  clubOrTeam: string;
  league: string;
  country: string;
  countryCode: string;
  countryFlag: string;
  avatarUrl: string;
  fallbackInitials: string;
  biodataRole: string;
  quote: string;
  trophies: string[];
  matchFootprint: string;
  wishesBase: number;
}

const GLOBAL_SPORT_STARS: EnterpriseBirthdayStar[] = [
  {
    id: 's1',
    name: 'James Harden',
    sport: 'BASKETBALL',
    birthMonth: 8,
    birthDay: 26,
    birthYear: 1989,
    clubOrTeam: 'LA Clippers',
    league: 'NBA Basketball',
    country: 'United States',
    countryCode: 'US',
    countryFlag: '🇺🇸',
    avatarUrl: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/3992.png&w=350&h=254',
    fallbackInitials: 'JH',
    biodataRole: 'Point Guard • NBA MVP & 10x All-Star',
    quote: 'Step-back mastery on the court and relentless offensive leadership.',
    trophies: ['NBA Most Valuable Player', '3x NBA Scoring Champion', 'Olympic Gold Medal'],
    matchFootprint: '25,000+ Career Points in NBA',
    wishesBase: 19820,
  },
  {
    id: 's2',
    name: 'Teun Koopmeiners',
    sport: 'SOCCER',
    birthMonth: 8,
    birthDay: 26,
    birthYear: 1998,
    clubOrTeam: 'Juventus',
    league: 'Serie A',
    country: 'Netherlands',
    countryCode: 'NL',
    countryFlag: '🇳🇱',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/pvqhh01759225850.png',
    fallbackInitials: 'TK',
    biodataRole: 'Midfield Playmaker • Serie A Dynamo',
    quote: 'Dominating the midfield engine room in the Bianconeri jersey.',
    trophies: ['UEFA Europa League Winner', 'KNVB Cup Winner', 'Serie A Midfielder of the Season'],
    matchFootprint: 'Over 65 Career Goals from Midfield',
    wishesBase: 12400,
  },
  {
    id: 's3',
    name: 'Erling Haaland',
    sport: 'SOCCER',
    birthMonth: 7,
    birthDay: 21,
    birthYear: 2000,
    clubOrTeam: 'Manchester City',
    league: 'Premier League',
    country: 'Norway',
    countryCode: 'NO',
    countryFlag: '🇳🇴',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/un3jr11769182465.png',
    fallbackInitials: 'EH',
    biodataRole: 'Striker • European Golden Shoe Winner',
    quote: 'Always hungry for more goals in the sky blue shirt.',
    trophies: ['UEFA Champions League Winner', '2x Premier League Golden Boot', 'Premier League Record 36 Goals'],
    matchFootprint: '1.10 Goals per Game in UEFA Champions League',
    wishesBase: 34500,
  },
  {
    id: 's4',
    name: 'Kylian Mbappé',
    sport: 'SOCCER',
    birthMonth: 12,
    birthDay: 20,
    birthYear: 1998,
    clubOrTeam: 'Real Madrid',
    league: 'La Liga',
    country: 'France',
    countryCode: 'FR',
    countryFlag: '🇫🇷',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/i712061759225381.png',
    fallbackInitials: 'KM',
    biodataRole: 'Forward • World Cup Champion & Golden Boot',
    quote: 'Electric pace and clinical finishing on the world stage.',
    trophies: ['FIFA World Cup Winner (2018)', 'World Cup Golden Boot', '6x Ligue 1 Top Scorer'],
    matchFootprint: 'Over 300 Career Professional Goals',
    wishesBase: 42100,
  },
  {
    id: 's5',
    name: 'Jude Bellingham',
    sport: 'SOCCER',
    birthMonth: 6,
    birthDay: 29,
    birthYear: 2003,
    clubOrTeam: 'Real Madrid',
    league: 'La Liga',
    country: 'England',
    countryCode: 'GB',
    countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/nryvhk1759225430.png',
    fallbackInitials: 'JB',
    biodataRole: 'Attacking Midfielder • Golden Boy Winner',
    quote: 'Aura in midfield with clutch goalscoring instinct.',
    trophies: ['UEFA Champions League Winner', 'La Liga Champion', 'Kopa Trophy Winner'],
    matchFootprint: 'Decisive El Clásico & UCL Winner',
    wishesBase: 28900,
  },
  {
    id: 's6',
    name: 'Victor Osimhen',
    sport: 'SOCCER',
    birthMonth: 12,
    birthDay: 29,
    birthYear: 1998,
    clubOrTeam: 'Super Eagles / Galatasaray',
    league: 'Turkish Super Lig',
    country: 'Nigeria',
    countryCode: 'NG',
    countryFlag: '🇳🇬',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/thumb/snhzzq1702566147.jpg',
    fallbackInitials: 'VO',
    biodataRole: 'Striker • African Footballer of the Year',
    quote: 'Relentless fighting spirit leading the line with power and passion.',
    trophies: ['African Footballer of the Year (2023)', 'Serie A Champion (Capocannoniere)', 'FIFA U-17 World Cup Winner'],
    matchFootprint: 'First African Top Scorer in Serie A History',
    wishesBase: 51200,
  },
  {
    id: 's7',
    name: 'Jay-Jay Okocha',
    sport: 'SOCCER',
    birthMonth: 8,
    birthDay: 14,
    birthYear: 1973,
    clubOrTeam: 'Nigeria Legends • Bolton Icon',
    league: 'Premier League Legends',
    country: 'Nigeria',
    countryCode: 'NG',
    countryFlag: '🇳🇬',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Jay-Jay_Okocha_2018.jpg/440px-Jay-Jay_Okocha_2018.jpg',
    fallbackInitials: 'JO',
    biodataRole: 'Playmaker • Olympic Gold & AFCON Champion',
    quote: 'So good they named him twice — magical flair and unmatched dribbling mastery.',
    trophies: ['Olympic Gold Medalist (1996)', 'Africa Cup of Nations Winner (1994)', 'BBC African Footballer of the Year (2x)'],
    matchFootprint: 'All-Time Legendary African Number 10',
    wishesBase: 68400,
  },
  {
    id: 's8',
    name: 'Michael Jordan',
    sport: 'BASKETBALL',
    birthMonth: 2,
    birthDay: 17,
    birthYear: 1963,
    clubOrTeam: 'Chicago Bulls Legends',
    league: 'NBA Legends',
    country: 'United States',
    countryCode: 'US',
    countryFlag: '🇺🇸',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Michael_Jordan_in_2014.jpg/440px-Michael_Jordan_in_2014.jpg',
    fallbackInitials: 'MJ',
    biodataRole: 'Shooting Guard • 6x NBA Champion & Finals MVP',
    quote: 'I can accept failure, everyone fails at something. But I can’t accept not trying.',
    trophies: ['6x NBA Champion', '6x NBA Finals MVP', '5x NBA Season MVP', '10x Scoring Champion'],
    matchFootprint: '30.1 PPG All-Time NBA Scoring Average',
    wishesBase: 89500,
  },
  {
    id: 's9',
    name: 'Lewis Hamilton',
    sport: 'MOTORSPORT',
    birthMonth: 1,
    birthDay: 7,
    birthYear: 1985,
    clubOrTeam: 'Scuderia Ferrari / Mercedes',
    league: 'Formula 1',
    country: 'United Kingdom',
    countryCode: 'GB',
    countryFlag: '🇬🇧',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Lewis_Hamilton_2022_F1_Austria.jpg/440px-Lewis_Hamilton_2022_F1_Austria.jpg',
    fallbackInitials: 'LH',
    biodataRole: 'Formula 1 Driver • 7x World Drivers Champion',
    quote: 'Still we rise. Driven by purpose and relentless perfection on the track.',
    trophies: ['7x FIA Formula One World Champion', '105+ F1 Grand Prix Race Wins', '104+ F1 Pole Positions'],
    matchFootprint: 'Most Race Wins in Formula 1 History',
    wishesBase: 44200,
  }
];

export default function BirthdaysHubPage() {
  const [stars, setStars] = useState<EnterpriseBirthdayStar[]>(GLOBAL_SPORT_STARS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<string>('ALL');
  const [wishedIds, setWishedIds] = useState<string[]>([]);
  const [wishCounts, setWishCounts] = useState<Record<string, number>>({});
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const currentYear = new Date().getFullYear();

  const handleSendWish = (star: EnterpriseBirthdayStar) => {
    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.playCelebrateSound();
    confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });

    if (!wishedIds.includes(star.id)) {
      setWishedIds(prev => [...prev, star.id]);
      setWishCounts(prev => ({
        ...prev,
        [star.id]: (prev[star.id] || star.wishesBase) + 1
      }));
    }
  };

  const handleShareWhatsApp = (star: EnterpriseBirthdayStar) => {
    phoneHardware.triggerHaptic('SELECTION');
    const age = currentYear - star.birthYear;
    const text = `🎂 Happy Birthday to ${star.name} (${age} Yrs)! 🎉\n${star.biodataRole} (${star.clubOrTeam})\n\nLeave your verified birthday wish on Mivaj Sports: https://mivaj.com/birthdays`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSearchLive = async (term: string) => {
    setSearchQuery(term);
    if (!term.trim()) {
      setStars(GLOBAL_SPORT_STARS);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/v1/players?query=${encodeURIComponent(term.trim())}`);
      if (res.ok) {
        const json = await res.json();
        const apiAthletes = json.data || [];
        if (apiAthletes.length > 0) {
          const mapped: EnterpriseBirthdayStar[] = apiAthletes.map((a: any) => {
            const [bYear, bMonth, bDay] = (a.birth_date || '1995-08-27').split('-').map(Number);
            return {
              id: a.id || `s-${Math.random()}`,
              name: a.name || 'Athlete',
              sport: (a.sport || 'SOCCER').toUpperCase() as any,
              birthMonth: bMonth || 8,
              birthDay: bDay || 26,
              birthYear: bYear || 1995,
              clubOrTeam: a.team_name || 'World Club',
              league: a.sport || 'Professional League',
              country: a.country || 'Global',
              countryCode: a.country?.substring(0, 2)?.toUpperCase() || 'GL',
              countryFlag: '🌍',
              avatarUrl: a.photo_url || '',
              fallbackInitials: a.fallback_initials || '★',
              biodataRole: `${a.position || 'Athlete'} • ${a.market_value || 'Global Star'}`,
              quote: a.bio?.substring(0, 85) + '...' || 'Elite sports icon.',
              trophies: a.metrics?.career_honors || ['Championship Contender'],
              matchFootprint: a.metrics?.tertiary_metric_value || 'World Class Performer',
              wishesBase: Math.floor(Math.random() * 25000) + 12000
            };
          });

          setStars(mapped);
        }
      }
    } catch (err) {
      console.warn('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStars = useMemo(() => {
    return stars.filter(star => {
      if (selectedSport !== 'ALL' && star.sport !== selectedSport) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return star.name.toLowerCase().includes(q) ||
               star.clubOrTeam.toLowerCase().includes(q) ||
               star.country.toLowerCase().includes(q) ||
               star.league.toLowerCase().includes(q);
      }
      return true;
    });
  }, [stars, selectedSport, searchQuery]);

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
            <Link href="/players" className="text-gray-400 hover:text-white transition-colors">
              ★ Players Wiki
            </Link>
            <span className="text-gold flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BIRTHDAYS DIRECTORY</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Header Title */}
        <div className="text-center space-y-2 py-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-black uppercase">
            <span>🎂</span>
            <span>WORLDWIDE SPORTS BIRTHDAY RADAR</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            GLOBAL SPORTS STAR BIRTHDAYS &amp; DOSSIER
          </h1>
          <p className="text-xs text-gray-400 max-w-xl mx-auto font-sans">
            Official athlete biodata, club profiles, career honors, and instant social wishes cards.
          </p>
        </div>

        {/* Search & Sport Filters Bar (Exact Matching Modal Style) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchLive(e.target.value)}
              placeholder="Search athlete, club, or league (e.g. Okocha, Harden, Haaland, Jordan)..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-gray-500 focus:border-stadiumGreen focus:outline-none font-mono"
            />
            {loading && (
              <RefreshCw className="w-4 h-4 text-stadiumGreen animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
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
                    ? 'bg-stadiumGreen text-black font-black shadow-lg shadow-stadiumGreen/20'
                    : 'bg-neutral-900 text-gray-400 border border-neutral-800 hover:text-white'
                }`}
              >
                {s === 'ALL' ? '● All Sports' : s === 'SOCCER' ? '⚽ Football' : s === 'BASKETBALL' ? '🏀 Basketball' : s === 'MOTORSPORT' ? '🏎️ Motorsport' : s}
              </button>
            ))}
          </div>
        </div>

        {/* 🌟 3-COLUMN LUXURY ATHLETE CARDS GRID (EXACT MATCHING MODAL DESIGN) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStars.map((star) => {
            const hasWished = wishedIds.includes(star.id);
            const wishesCount = wishCounts[star.id] || star.wishesBase;
            const age = currentYear - star.birthYear;
            const hasPhoto = star.avatarUrl && !imgErrors[star.id];

            return (
              <div
                key={star.id}
                className="rounded-3xl bg-[#0e131f]/90 border border-white/10 hover:border-white/20 p-5 space-y-4 shadow-xl transition-all flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  
                  {/* Top Pill: Date & Age + Country Code */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold text-gray-300">
                      {star.birthMonth}/{star.birthDay} • {age} YRS
                    </span>
                    <span className="text-xs font-bold text-gray-400 uppercase">
                      {star.countryCode || 'GL'}
                    </span>
                  </div>

                  {/* Player Photo + Name + Club */}
                  <div className="flex items-center space-x-3.5">
                    {hasPhoto ? (
                      <img
                        src={star.avatarUrl}
                        alt={star.name}
                        className="w-14 h-14 rounded-2xl object-cover object-top border border-white/10 bg-neutral-900 flex-shrink-0 shadow-md"
                        onError={() => setImgErrors(prev => ({ ...prev, [star.id]: true }))}
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-gold/40 flex items-center justify-center font-black text-sm text-gold flex-shrink-0 shadow-inner">
                        {star.fallbackInitials || '★'}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-black text-white truncate">{star.name}</h3>
                      <span className="text-xs text-stadiumGreen font-bold block truncate">{star.clubOrTeam}</span>
                      <span className="text-[10px] text-gray-400 block truncate">{star.league}</span>
                    </div>
                  </div>

                  {/* Position Role & Quote */}
                  <div className="space-y-1 text-xs font-sans">
                    <span className="text-gray-300 font-bold block text-[11px]">{star.biodataRole}</span>
                  </div>

                  {/* Gold Trophy Highlight Footprint */}
                  <div className="p-2.5 rounded-2xl bg-black/50 border border-gold/20 flex items-center space-x-2 text-xs">
                    <Trophy className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                    <span className="text-gold font-bold text-[11px] truncate">{star.matchFootprint}</span>
                  </div>

                </div>

                {/* Golden Action Button + Share Icon */}
                <div className="flex items-center space-x-2 pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => handleSendWish(star)}
                    className={`flex-1 py-3 rounded-2xl text-xs font-black flex items-center justify-center space-x-1.5 transition-all active:scale-95 ${
                      hasWished
                        ? 'bg-stadiumGreen text-black shadow-lg shadow-stadiumGreen/20'
                        : 'bg-gradient-to-r from-amber-500 to-gold text-black hover:brightness-110 shadow-lg shadow-gold/20'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${hasWished ? 'fill-black' : 'fill-black'}`} />
                    <span>{hasWished ? `Wish Sent (${wishesCount.toLocaleString()}) ✓` : `Send Birthday Wish (${wishesCount.toLocaleString()})`}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShareWhatsApp(star)}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-all"
                    title="Share Wish on WhatsApp"
                  >
                    <Share2 className="w-4 h-4 text-gold" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
