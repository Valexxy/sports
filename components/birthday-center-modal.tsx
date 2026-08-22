'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { X, Cake, Sparkles, Heart, Trophy, Share2, Calendar, Award, ChevronRight, Globe, Star, Users, Zap, Instagram, Twitter, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { stadiumAudio } from '../lib/sound-synthesizer';

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface BirthdayPlayer {
  id: string;
  name: string;
  club: string;
  country: string;
  countryFlag: string;
  birthYear: number;
  birthMonth: number; // 1 - 12
  birthDay: number;   // 1 - 31
  birthDate?: string;
  age?: number;
  sport: 'FOOTBALL' | 'BASKETBALL' | 'TENNIS' | 'ATHLETICS' | 'BOXING';
  position: string;
  photoUrl: string;
  fallbackPhotoUrl?: string;
  trophies: string;
  quote: string;
  wishesCount: number;
  stats?: { label: string; value: string }[];
  nationality?: string;
  height?: string;
  marketValue?: string;
  instagram?: string;
  twitter?: string;
}

type SportCategory = 'ALL' | 'FOOTBALL' | 'BASKETBALL' | 'TENNIS' | 'ATHLETICS' | 'BOXING';
type FilterTab = 'TODAY' | 'THIS_WEEK' | 'THIS_MONTH' | 'ALL';

// ─── PLAYER DATABASE ─────────────────────────────────────────────────────────

const STAR_BIRTHDAYS: BirthdayPlayer[] = [
  // ⚽ FOOTBALL — TODAY (August 22)
  {
    id: 'bday-lautaro',
    name: 'Lautaro Martínez',
    sport: 'FOOTBALL',
    club: 'Inter Milan 🇮🇹',
    country: 'Argentina',
    countryFlag: '🇦🇷',
    birthYear: 1997, birthMonth: 8, birthDay: 22,
    position: 'Striker / El Toro',
    nationality: 'Argentine',
    height: '1.74m',
    marketValue: '€110M',
    photoUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500&auto=format&fit=crop&q=80',
    fallbackPhotoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&auto=format&fit=crop&q=80',
    trophies: 'World Cup 2022, 2× Copa América, 2× Serie A, Capocannoniere',
    quote: 'El Toro never stops charging. We fight for every inch on the pitch.',
    wishesCount: 5120,
    stats: [
      { label: 'Inter Goals', value: '130+' },
      { label: 'Argentina Goals', value: '30' },
      { label: 'Serie A POTY', value: '2024' },
      { label: 'World Cup', value: 'Champion 🏆' },
    ],
    instagram: 'lautaromartinez',
  },
  // ⚽ FOOTBALL
  {
    id: 'bday-lewandowski',
    name: 'Robert Lewandowski',
    sport: 'FOOTBALL',
    club: 'FC Barcelona 🇪🇸',
    country: 'Poland',
    countryFlag: '🇵🇱',
    birthYear: 1988, birthMonth: 8, birthDay: 21,
    position: 'Centre Forward / Goal Machine',
    nationality: 'Polish',
    height: '1.85m',
    marketValue: '€15M',
    photoUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=500&auto=format&fit=crop&q=80',
    fallbackPhotoUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500&auto=format&fit=crop&q=80',
    trophies: 'UCL, 10× Bundesliga, La Liga, 2× FIFA The Best',
    quote: 'Hard work beats talent when talent doesn\'t work hard.',
    wishesCount: 2840,
    stats: [
      { label: 'Club Goals', value: '600+' },
      { label: 'Int\'l Goals', value: '84' },
      { label: 'Golden Boots', value: '6' },
      { label: 'Seasons', value: '18' },
    ],
    twitter: 'lewy_official',
  },
  {
    id: 'bday-henry',
    name: 'Thierry Henry',
    sport: 'FOOTBALL',
    club: 'Arsenal Invincibles 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    country: 'France',
    countryFlag: '🇫🇷',
    birthYear: 1977, birthMonth: 8, birthDay: 17,
    position: 'Striker / King of Highbury',
    nationality: 'French',
    height: '1.88m',
    marketValue: 'Legend',
    photoUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=500&auto=format&fit=crop&q=80',
    fallbackPhotoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&auto=format&fit=crop&q=80',
    trophies: 'World Cup 1998, EURO 2000, 2× Premier League, UCL',
    quote: 'Sometimes in football you have to score goals before you think of style.',
    wishesCount: 3450,
    stats: [
      { label: 'Arsenal Goals', value: '228' },
      { label: 'Int\'l Goals', value: '51' },
      { label: 'PL Golden Boots', value: '4' },
      { label: 'Invincible', value: '2003-04 👑' },
    ],
  },
  {
    id: 'bday-bernardo',
    name: 'Bernardo Silva',
    sport: 'FOOTBALL',
    club: 'Manchester City 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    country: 'Portugal',
    countryFlag: '🇵🇹',
    birthYear: 1994, birthMonth: 8, birthDay: 10,
    position: 'Playmaker / Tactical Genius',
    nationality: 'Portuguese',
    height: '1.73m',
    marketValue: '€70M',
    photoUrl: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=500&auto=format&fit=crop&q=80',
    trophies: 'UCL, 6× Premier League, UEFA Nations League',
    quote: 'Magician on the ball with relentless tactical pressing.',
    wishesCount: 1980,
    stats: [
      { label: 'PL Titles', value: '6' },
      { label: 'Man City Apps', value: '350+' },
      { label: 'Treble Winner', value: '2023 🏆' },
      { label: 'Pass Accuracy', value: '89%' },
    ],
  },
  {
    id: 'bday-haaland',
    name: 'Erling Haaland',
    sport: 'FOOTBALL',
    club: 'Manchester City 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    country: 'Norway',
    countryFlag: '🇳🇴',
    birthYear: 2000, birthMonth: 7, birthDay: 21,
    position: 'Striker / The Cyborg',
    nationality: 'Norwegian',
    height: '1.94m',
    marketValue: '€180M',
    photoUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&auto=format&fit=crop&q=80',
    trophies: 'UCL, 2× Premier League, Treble Winner, Golden Boot',
    quote: 'Stay hungry, focus on the net, never stop scoring.',
    wishesCount: 4210,
    stats: [
      { label: 'PL Season Record', value: '36 Goals' },
      { label: 'UCL Goals', value: '44' },
      { label: 'Goals/Game', value: '0.87' },
      { label: 'Hat-tricks', value: '18' },
    ],
    instagram: 'erling.haaland',
  },
  {
    id: 'bday-kane',
    name: 'Harry Kane',
    sport: 'FOOTBALL',
    club: 'Bayern Munich 🇩🇪',
    country: 'England',
    countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    birthYear: 1993, birthMonth: 7, birthDay: 28,
    position: 'Striker / Golden Boot',
    nationality: 'English',
    height: '1.88m',
    marketValue: '€80M',
    photoUrl: 'https://images.unsplash.com/photo-1489944445391-11dd35574549?w=500&auto=format&fit=crop&q=80',
    trophies: 'European Golden Shoe, 3× Premier League Golden Boot',
    quote: 'Never let setbacks define your ultimate journey.',
    wishesCount: 1520,
    stats: [
      { label: 'England Goals', value: '69' },
      { label: 'Bundesliga Goals', value: '36' },
      { label: 'PL Goals', value: '213' },
      { label: 'Golden Shoes', value: '2024 👟' },
    ],
  },
  {
    id: 'bday-modric',
    name: 'Luka Modrić',
    sport: 'FOOTBALL',
    club: 'Real Madrid 🇪🇸',
    country: 'Croatia',
    countryFlag: '🇭🇷',
    birthYear: 1985, birthMonth: 9, birthDay: 9,
    position: 'Midfield Maestro',
    nationality: 'Croatian',
    height: '1.72m',
    marketValue: '€4M',
    photoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&auto=format&fit=crop&q=80',
    trophies: '6× UCL, Ballon d\'Or 2018, 4× La Liga',
    quote: 'Age is just a number when passion drives your feet.',
    wishesCount: 3890,
    stats: [
      { label: 'UCL Titles', value: '6 🏆' },
      { label: 'Ballon d\'Or', value: '2018' },
      { label: 'Real Madrid Apps', value: '530+' },
      { label: 'WC Silver/Bronze', value: '2018/2022' },
    ],
  },
  {
    id: 'bday-saka',
    name: 'Bukayo Saka',
    sport: 'FOOTBALL',
    club: 'Arsenal 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    country: 'England',
    countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    birthYear: 2001, birthMonth: 9, birthDay: 5,
    position: 'Right Winger / Starboy',
    nationality: 'English-Nigerian',
    height: '1.78m',
    marketValue: '€130M',
    photoUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500&auto=format&fit=crop&q=80',
    trophies: 'FA Cup, 2× Community Shield, 2× England POTY',
    quote: 'God gives me strength, the fans give me wings.',
    wishesCount: 2610,
    stats: [
      { label: 'PL Goals (23/24)', value: '16' },
      { label: 'Assists', value: '9' },
      { label: 'England Goals', value: '18' },
      { label: 'Dribbles/Game', value: '2.4' },
    ],
    instagram: 'bukayosaka87',
  },
  {
    id: 'bday-osimhen',
    name: 'Victor Osimhen',
    sport: 'FOOTBALL',
    club: 'Galatasaray 🇹🇷 (Loan)',
    country: 'Nigeria',
    countryFlag: '🇳🇬',
    birthYear: 1998, birthMonth: 12, birthDay: 29,
    position: 'Striker / African Footballer of the Year',
    nationality: 'Nigerian',
    height: '1.85m',
    marketValue: '€80M',
    photoUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=500&auto=format&fit=crop&q=80',
    trophies: 'Serie A Title 2023, Capocannoniere, CAF POTY 2023',
    quote: 'From the streets of Olusosun Lagos to world glory. Believe in yourself.',
    wishesCount: 5420,
    stats: [
      { label: 'Serie A Goals', value: '26 (22/23)' },
      { label: 'Super Eagles Goals', value: '21' },
      { label: 'CAF Player of Year', value: '2023 👑' },
      { label: 'Market Value', value: '€80M' },
    ],
    instagram: 'victorosimhen9',
  },
  // 🏀 BASKETBALL
  {
    id: 'bday-lebron',
    name: 'LeBron James',
    sport: 'BASKETBALL',
    club: 'LA Lakers 🇺🇸',
    country: 'USA',
    countryFlag: '🇺🇸',
    birthYear: 1984, birthMonth: 12, birthDay: 30,
    position: 'Small Forward / King James',
    nationality: 'American',
    height: '2.06m',
    marketValue: 'Legend',
    photoUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&auto=format&fit=crop&q=80',
    trophies: '4× NBA Champion, 4× Finals MVP, 4× NBA MVP, All-Time Scorer',
    quote: 'Strive for greatness every single day.',
    wishesCount: 9800,
    stats: [
      { label: 'All-Time Points', value: '40,000+' },
      { label: 'Career PPG', value: '27.1' },
      { label: 'Championships', value: '4 🏆' },
      { label: 'All-Star Games', value: '20' },
    ],
    twitter: 'KingJames',
    instagram: 'kingjames',
  },
  {
    id: 'bday-curry',
    name: 'Stephen Curry',
    sport: 'BASKETBALL',
    club: 'Golden State Warriors 🇺🇸',
    country: 'USA',
    countryFlag: '🇺🇸',
    birthYear: 1988, birthMonth: 3, birthDay: 14,
    position: 'Point Guard / Chef Curry',
    nationality: 'American',
    height: '1.88m',
    marketValue: 'All-Time',
    photoUrl: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=500&auto=format&fit=crop&q=80',
    trophies: '4× NBA Champion, 2× MVP, Finals MVP, 3PT Record',
    quote: 'I can do all things through Christ who strengthens me.',
    wishesCount: 6540,
    stats: [
      { label: '3PT Record', value: '3,747+ 🎯' },
      { label: 'Career PPG', value: '24.8' },
      { label: 'Championships', value: '4 🏆' },
      { label: 'Unanimous MVP', value: '2016' },
    ],
    twitter: 'StephenCurry30',
  },
  // 🎾 TENNIS
  {
    id: 'bday-djokovic',
    name: 'Novak Djokovic',
    sport: 'TENNIS',
    club: 'Serbia 🇷🇸',
    country: 'Serbia',
    countryFlag: '🇷🇸',
    birthYear: 1987, birthMonth: 5, birthDay: 22,
    position: 'World No.1 / Tennis GOAT',
    nationality: 'Serbian',
    height: '1.88m',
    marketValue: 'GOAT',
    photoUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=500&auto=format&fit=crop&q=80',
    trophies: '24× Grand Slams, Olympic Gold 2024, 7× ATP Finals, 428 Weeks at No.1',
    quote: 'Pressure is a privilege. Believe when nobody else does.',
    wishesCount: 7120,
    stats: [
      { label: 'Grand Slams', value: '24 🏆' },
      { label: 'Weeks at No.1', value: '428+' },
      { label: 'Olympic Gold', value: 'Paris 2024' },
      { label: 'ATP Titles', value: '99' },
    ],
    twitter: 'DjokerNole',
  },
  // 🏃 ATHLETICS
  {
    id: 'bday-bolt',
    name: 'Usain Bolt',
    sport: 'ATHLETICS',
    club: 'Jamaica 🇯🇲',
    country: 'Jamaica',
    countryFlag: '🇯🇲',
    birthYear: 1986, birthMonth: 8, birthDay: 21,
    position: '100m & 200m World Record Holder',
    nationality: 'Jamaican',
    height: '1.95m',
    marketValue: 'Legend',
    photoUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format&fit=crop&q=80',
    trophies: '8× Olympic Gold, 11× World Champion, 9.58s World Record',
    quote: 'I trained 4 years to run 9 seconds. Don\'t tell me you can\'t do something.',
    wishesCount: 5670,
    stats: [
      { label: '100m Record', value: '9.58s ⚡' },
      { label: '200m Record', value: '19.19s ⚡' },
      { label: 'Olympic Golds', value: '8 🥇' },
      { label: 'World Titles', value: '11 🥇' },
    ],
    instagram: 'usainbolt',
    twitter: 'usainbolt',
  },
  // 🥊 BOXING
  {
    id: 'bday-fury',
    name: 'Tyson Fury',
    sport: 'BOXING',
    club: 'UK 🇬🇧',
    country: 'UK',
    countryFlag: '🇬🇧',
    birthYear: 1988, birthMonth: 8, birthDay: 12,
    position: 'Gypsy King / Heavyweight Legend',
    nationality: 'British-Irish',
    height: '2.06m',
    marketValue: 'Champion',
    photoUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=500&auto=format&fit=crop&q=80',
    trophies: '2× WBC Heavyweight Champion, Lineal Champion, Ring Magazine',
    quote: 'I\'m a fighting man. Always will be.',
    wishesCount: 2890,
    stats: [
      { label: 'Pro Record', value: '34W-1D' },
      { label: 'KO Rate', value: '73%' },
      { label: 'World Titles', value: '3 🥊' },
      { label: 'Height', value: '6 ft 9 in' },
    ],
    instagram: 'tysonfury',
  },
];

const SPORT_META: Record<string, { icon: string; color: string; bg: string; border: string }> = {
  FOOTBALL: { icon: '⚽', color: 'text-stadiumGreen', bg: 'bg-stadiumGreen/15', border: 'border-stadiumGreen/40' },
  BASKETBALL: { icon: '🏀', color: 'text-orange-400', bg: 'bg-orange-400/15', border: 'border-orange-400/40' },
  TENNIS: { icon: '🎾', color: 'text-yellow-400', bg: 'bg-yellow-400/15', border: 'border-yellow-400/40' },
  ATHLETICS: { icon: '🏃', color: 'text-blue-400', bg: 'bg-blue-400/15', border: 'border-blue-400/40' },
  BOXING: { icon: '🥊', color: 'text-crimson', bg: 'bg-crimson/15', border: 'border-crimson/40' },
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ─── PLAYER PROFILE POPUP ────────────────────────────────────────────────────

interface ProfilePopupProps {
  player: BirthdayPlayer & { age?: number; birthDate?: string; isToday?: boolean };
  onClose: () => void;
  onWish: () => void;
  wished: boolean;
  generateShareUrl: (p: BirthdayPlayer, platform: 'WHATSAPP' | 'TWITTER' | 'TELEGRAM') => string;
}

const PlayerProfilePopup: React.FC<ProfilePopupProps> = ({ player, onClose, onWish, wished, generateShareUrl }) => {
  const [imgUrl, setImgUrl] = useState(player.photoUrl);
  const [imgError, setImgError] = useState(false);
  const meta = SPORT_META[player.sport] || SPORT_META.FOOTBALL;
  const initials = player.name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();

  const handleImageError = () => {
    if (player.fallbackPhotoUrl && imgUrl !== player.fallbackPhotoUrl) {
      setImgUrl(player.fallbackPhotoUrl);
    } else {
      setImgError(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className={`w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden border ${meta.border} shadow-2xl max-h-[90vh] overflow-y-auto`}
        onClick={e => e.stopPropagation()}
        style={{ background: 'linear-gradient(135deg, #0a0f0a 0%, #111811 100%)' }}
      >
        {/* Header with player photo */}
        <div className={`relative h-56 sm:h-64 ${meta.bg} overflow-hidden flex-shrink-0`}>
          {!imgError ? (
            <img
              src={imgUrl}
              alt={player.name}
              loading="eager"
              className="w-full h-full object-cover object-top"
              onError={handleImageError}
            />
          ) : (
            <div className={`w-full h-full flex flex-col items-center justify-center ${meta.bg}`}>
              <span className="text-6xl sm:text-7xl font-black text-white/30 select-none mb-1">{initials}</span>
              <span className="text-xs text-white/50 font-mono font-bold">{player.club}</span>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          {/* Close */}
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white border border-white/10 hover:bg-black/80 transition-all">
            <X className="w-4 h-4" />
          </button>

          {/* Sport badge */}
          <div className={`absolute top-4 left-4 px-2.5 py-1 rounded-xl ${meta.bg} ${meta.border} border text-xs font-black ${meta.color}`}>
            {meta.icon} {player.sport}
          </div>

          {/* Name & Birthday overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">{player.name}</h2>
                <p className="text-sm text-gray-300 mt-0.5">{player.position} • {player.countryFlag} {player.country}</p>
              </div>
              {player.isToday && (
                <div className="flex-shrink-0 px-3 py-1.5 rounded-2xl bg-pink-500 text-white text-xs font-black animate-pulse shadow-lg shadow-pink-500/40">
                  🎂 TODAY!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Details body */}
        <div className="p-5 space-y-4">
          {/* Age + Date */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-white font-black text-lg block">{player.age}</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wide">Years Old</span>
            </div>
            <div className="text-center p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-white font-black text-lg block">{MONTH_NAMES[player.birthMonth - 1]} {player.birthDay}</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wide">Birthday</span>
            </div>
            <div className="text-center p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-white font-black text-lg block">{player.height || 'N/A'}</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wide">Height</span>
            </div>
          </div>

          {/* Club & Value */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Current Club / Team</p>
              <p className="text-white font-black text-sm">{player.club}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Market Value</p>
              <p className={`font-black text-sm ${meta.color}`}>{player.marketValue || 'N/A'}</p>
            </div>
          </div>

          {/* Stats grid */}
          {player.stats && player.stats.length > 0 && (
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide font-bold mb-2">Career Highlights</p>
              <div className="grid grid-cols-2 gap-2">
                {player.stats.map((s, i) => (
                  <div key={i} className={`p-2.5 rounded-xl ${meta.bg} ${meta.border} border`}>
                    <span className={`text-base font-black ${meta.color} block`}>{s.value}</span>
                    <span className="text-[10px] text-gray-400">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trophies */}
          <div className="p-3 rounded-2xl bg-gold/10 border border-gold/30">
            <div className="flex items-center space-x-2 mb-1">
              <Trophy className="w-4 h-4 text-gold flex-shrink-0" />
              <p className="text-[10px] text-gold uppercase tracking-wide font-bold">Honours & Trophies</p>
            </div>
            <p className="text-white text-sm font-semibold leading-relaxed">{player.trophies}</p>
          </div>

          {/* Quote */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-gray-300 italic text-sm leading-relaxed">"{player.quote}"</p>
          </div>

          {/* Social links */}
          {(player.instagram || player.twitter) && (
            <div className="flex items-center space-x-2">
              {player.instagram && (
                <a href={`https://instagram.com/${player.instagram}`} target="_blank" rel="noreferrer"
                  className="flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-xl bg-pink-500/15 border border-pink-500/30 text-pink-400 text-xs font-bold hover:bg-pink-500/25 transition-all">
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Instagram</span>
                </a>
              )}
              {player.twitter && (
                <a href={`https://twitter.com/${player.twitter}`} target="_blank" rel="noreferrer"
                  className="flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-bold hover:bg-blue-500/25 transition-all">
                  <Twitter className="w-3.5 h-3.5" />
                  <span>Twitter / X</span>
                </a>
              )}
            </div>
          )}

          {/* Wish + Share */}
          <div className="flex items-center space-x-2 pt-1">
            <button onClick={onWish}
              className={`flex-1 py-3 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 transition-all active:scale-95 ${wished ? 'bg-pink-500/20 border border-pink-500/40 text-pink-400' : 'bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-900/30'}`}>
              <Heart className={`w-4 h-4 ${wished ? 'fill-current' : ''}`} />
              <span>{wished ? 'Wish Sent! 🎉' : '🎂 Send Birthday Wish'}</span>
            </button>
            <div className="flex space-x-1.5">
              <a href={generateShareUrl(player, 'WHATSAPP')} target="_blank" rel="noreferrer"
                className="p-3 rounded-2xl bg-green-600/20 border border-green-600/30 text-green-400 hover:bg-green-600/30 transition-all" title="Share on WhatsApp">
                <Share2 className="w-4 h-4" />
              </a>
              <a href={generateShareUrl(player, 'TWITTER')} target="_blank" rel="noreferrer"
                className="p-3 rounded-2xl bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-all" title="Share on X">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── BIRTHDAY CARD ───────────────────────────────────────────────────────────

interface BirthdayCardProps {
  player: BirthdayPlayer & { age?: number; birthDate?: string; isToday?: boolean };
  wished: boolean;
  onWish: () => void;
  onClick: () => void;
}

const BirthdayCard: React.FC<BirthdayCardProps> = React.memo(({ player, wished, onWish, onClick }) => {
  const [imgUrl, setImgUrl] = useState(player.photoUrl);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const meta = SPORT_META[player.sport] || SPORT_META.FOOTBALL;
  const initials = player.name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();

  const handleImageError = () => {
    if (player.fallbackPhotoUrl && imgUrl !== player.fallbackPhotoUrl) {
      setImgUrl(player.fallbackPhotoUrl);
    } else {
      setImgError(true);
      setImgLoaded(true);
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative rounded-3xl border overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl ${player.isToday ? 'border-pink-500/80 shadow-pink-900/30 shadow-lg' : `${meta.border}`}`}
      style={{ background: 'linear-gradient(135deg, #0d130d 0%, #111811 100%)' }}
    >
      {player.isToday && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-gold to-pink-500 animate-pulse z-10" />
      )}

      {/* Photo */}
      <div className={`relative h-44 sm:h-48 overflow-hidden ${meta.bg}`}>
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/5 animate-pulse">
            <span className="text-4xl font-black text-white/20">{initials}</span>
          </div>
        )}
        {!imgError ? (
          <img
            src={imgUrl}
            alt={player.name}
            loading="lazy"
            className={`w-full h-full object-cover object-top transition-all duration-500 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImgLoaded(true)}
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-3">
            <span className="text-5xl font-black text-white/20 select-none mb-1">{initials}</span>
            <span className="text-[10px] text-gray-400 font-mono text-center truncate w-full">{player.club}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* Sport badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5 z-10">
          <span className={`px-2 py-0.5 rounded-xl text-[10px] font-black border backdrop-blur-sm ${meta.bg} ${meta.border} ${meta.color}`}>
            {meta.icon} {player.sport}
          </span>
        </div>

        {player.isToday && (
          <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-xl bg-pink-500 text-white text-[10px] font-black shadow-md shadow-pink-500/40 animate-bounce z-10">
            🎂 TODAY!
          </div>
        )}

        {/* Name overlay */}
        <div className="absolute bottom-2.5 left-3 right-3 z-10">
          <p className="text-white font-black text-sm leading-tight truncate">{player.name}</p>
          <p className="text-gray-300 text-[10px] mt-0.5">{player.countryFlag} {player.position}</p>
        </div>
      </div>

      {/* Card body */}
      <div className="p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gold font-black text-xs">{player.club}</p>
            <p className="text-gray-400 text-[10px]">{player.birthDate} • Age {player.age}</p>
          </div>
          <span className={`text-xs font-black ${meta.color}`}>{meta.icon}</span>
        </div>

        <div className="flex items-center space-x-2" onClick={e => e.stopPropagation()}>
          <button
            onClick={onWish}
            className={`flex-1 py-2 rounded-xl text-xs font-black flex items-center justify-center space-x-1.5 transition-all active:scale-95 ${wished ? 'bg-pink-500/20 border border-pink-500/40 text-pink-400' : 'bg-pink-600/90 hover:bg-pink-500 text-white shadow-md shadow-pink-900/30'}`}>
            <Heart className={`w-3 h-3 ${wished ? 'fill-current' : ''}`} />
            <span>{wished ? 'Wished 🎉' : 'Wish'}</span>
          </button>
          <button
            onClick={onClick}
            className={`p-2 rounded-xl border ${meta.border} ${meta.bg} ${meta.color} text-xs transition-all hover:scale-105`}
            title="View Full Profile">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
});
BirthdayCard.displayName = 'BirthdayCard';

// ─── MAIN MODAL ───────────────────────────────────────────────────────────────

interface BirthdayCenterProps {
  onClose: () => void;
}

export const BirthdayCenterModal: React.FC<BirthdayCenterProps> = ({ onClose }) => {
  const [players] = useState<BirthdayPlayer[]>(STAR_BIRTHDAYS);
  const [wishedPlayers, setWishedPlayers] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<FilterTab>('TODAY');
  const [sportFilter, setSportFilter] = useState<SportCategory>('ALL');
  const [selectedPlayer, setSelectedPlayer] = useState<(BirthdayPlayer & { age?: number; birthDate?: string; isToday?: boolean }) | null>(null);
  const [currentDate] = useState<Date>(() => new Date());

  const enrichedPlayers = useMemo(() => {
    const now = currentDate;
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();
    const todayStart = new Date(currentYear, now.getMonth(), currentDay);

    return players.map(p => {
      const age = currentYear - p.birthYear;
      const bdayThisYear = new Date(currentYear, p.birthMonth - 1, p.birthDay);
      const diffDays = Math.round((bdayThisYear.getTime() - todayStart.getTime()) / 86400000);
      const monthName = MONTH_NAMES[p.birthMonth - 1];
      let birthDate = `${monthName} ${p.birthDay}`;
      const isToday = diffDays === 0;
      const isTomorrow = diffDays === 1;

      if (isToday) birthDate = '🎂 Today!';
      else if (isTomorrow) birthDate = 'Tomorrow 🎂';
      else if (diffDays === -1) birthDate = 'Yesterday 🌟';

      return {
        ...p,
        age,
        birthDate,
        diffDays,
        isToday,
        isTomorrow,
        isThisWeek: Math.abs(diffDays) <= 7,
        isThisMonth: p.birthMonth === currentMonth,
      };
    }).sort((a, b) => {
      if (a.isToday && !b.isToday) return -1;
      if (!a.isToday && b.isToday) return 1;
      return Math.abs(a.diffDays) - Math.abs(b.diffDays);
    });
  }, [players, currentDate]);

  const filteredPlayers = useMemo(() => {
    let list = enrichedPlayers;
    if (sportFilter !== 'ALL') list = list.filter(p => p.sport === sportFilter);

    if (filter === 'TODAY') {
      const todayList = list.filter(p => p.isToday);
      return todayList.length > 0 ? todayList : list.filter(p => p.isThisWeek).slice(0, 3);
    }
    if (filter === 'THIS_WEEK') {
      const weekList = list.filter(p => p.isThisWeek);
      return weekList.length > 0 ? weekList : list.slice(0, 4);
    }
    if (filter === 'THIS_MONTH') {
      const monthList = list.filter(p => p.isThisMonth);
      return monthList.length > 0 ? monthList : list;
    }
    return list;
  }, [enrichedPlayers, filter, sportFilter]);

  const totalWishes = useMemo(() => players.reduce((a, p) => a + (p.wishesCount || 0), 0), [players]);

  const handleWish = useCallback((player: BirthdayPlayer) => {
    if (wishedPlayers[player.id]) return;
    setWishedPlayers(prev => ({ ...prev, [player.id]: true }));
    stadiumAudio.playCrowdRoar();
    if (typeof window !== 'undefined') {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 }, colors: ['#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'] });
      if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);
    }
  }, [wishedPlayers]);

  const generateShareUrl = useCallback((player: BirthdayPlayer, platform: 'WHATSAPP' | 'TWITTER' | 'TELEGRAM') => {
    const ageText = player.age ? `${player.age} yrs` : '';
    const text = encodeURIComponent(`🎂 Happy Birthday ${player.name} (${ageText})! ${player.sport} legend. Celebrated on AuraScore Stadium ⚡`);
    const url = encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : 'https://aurascore.app');
    if (platform === 'WHATSAPP') return `https://api.whatsapp.com/send?text=${text}%20${url}`;
    if (platform === 'TWITTER') return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    return `https://t.me/share/url?url=${url}&text=${text}`;
  }, []);

  const sportCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: enrichedPlayers.length };
    enrichedPlayers.forEach(p => { counts[p.sport] = (counts[p.sport] || 0) + 1; });
    return counts;
  }, [enrichedPlayers]);

  const formattedDate = currentDate.toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
        <div className="relative w-full sm:max-w-3xl rounded-t-3xl sm:rounded-3xl overflow-hidden border border-pink-500/30 shadow-2xl max-h-[95vh] flex flex-col"
          style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #0d100d 100%)' }}>

          {/* Sticky Header */}
          <div className="flex-shrink-0 p-5 border-b border-white/10 bg-black/40">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-pink-500/20 border border-pink-500/40">
                  <Cake className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <h2 className="font-black text-white text-base flex items-center space-x-2">
                    <span>🎂 Birthday Stars</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30">{filteredPlayers.length} players</span>
                  </h2>
                  <p className="text-[10px] text-gray-400">{formattedDate} • {totalWishes.toLocaleString()} wishes sent globally</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sport Category Tabs */}
            <div className="flex items-center space-x-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
              {(['ALL', 'FOOTBALL', 'BASKETBALL', 'TENNIS', 'ATHLETICS', 'BOXING'] as SportCategory[]).map(s => {
                const meta = SPORT_META[s] || { icon: '🌟', color: 'text-white', bg: 'bg-white/10', border: 'border-white/20' };
                const icon = s === 'ALL' ? '🌟' : meta.icon;
                const count = sportCounts[s] || 0;
                return (
                  <button key={s} onClick={() => setSportFilter(s)}
                    className={`flex-shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black border transition-all ${sportFilter === s ? `${meta.bg} ${meta.border} ${meta.color}` : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}>
                    <span>{icon}</span>
                    <span>{s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}</span>
                    {count > 0 && <span className="text-[9px] opacity-70">({count})</span>}
                  </button>
                );
              })}
            </div>

            {/* Time Filter Tabs: TODAY, THIS_WEEK, THIS_MONTH, ALL */}
            <div className="flex items-center space-x-2 mt-2.5">
              {(['TODAY', 'THIS_WEEK', 'THIS_MONTH', 'ALL'] as FilterTab[]).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`flex-1 py-1.5 rounded-xl text-[10px] font-black border transition-all ${
                    filter === f
                      ? f === 'TODAY'
                        ? 'bg-pink-500 text-white font-black shadow-md shadow-pink-500/30 border-pink-400'
                        : 'bg-pink-500/20 border-pink-500/40 text-pink-400'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}>
                  {f === 'TODAY' ? '🎂 Today' : f === 'THIS_WEEK' ? '📅 This Week' : f === 'THIS_MONTH' ? '🗓 This Month' : '🌍 All Stars'}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Card Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            {filteredPlayers.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-5xl">🎂</span>
                <p className="text-gray-400 mt-3 font-bold">No birthdays found in this category</p>
                <button onClick={() => { setFilter('ALL'); setSportFilter('ALL'); }} className="mt-3 px-4 py-2 rounded-xl bg-pink-500/20 border border-pink-500/30 text-pink-400 text-xs font-black">
                  View All Stars
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredPlayers.map(player => (
                  <BirthdayCard
                    key={player.id}
                    player={player}
                    wished={!!wishedPlayers[player.id]}
                    onWish={() => handleWish(player)}
                    onClick={() => setSelectedPlayer(player)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Player Profile Popup */}
      {selectedPlayer && (
        <PlayerProfilePopup
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          onWish={() => { handleWish(selectedPlayer); }}
          wished={!!wishedPlayers[selectedPlayer.id]}
          generateShareUrl={generateShareUrl}
        />
      )}
    </>
  );
};
