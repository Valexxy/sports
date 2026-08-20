'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { X, Cake, Sparkles, Heart, Trophy, Share2, Calendar, Award, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { stadiumAudio } from '../lib/sound-synthesizer';

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
  position: string;
  photoUrl: string;
  trophies: string;
  quote: string;
  wishesCount: number;
}

const STAR_BIRTHDAYS: BirthdayPlayer[] = [
  {
    id: 'bday-lewandowski',
    name: 'Robert Lewandowski',
    club: 'FC Barcelona 🇪🇸',
    country: 'Poland',
    countryFlag: '🇵🇱',
    birthYear: 1988,
    birthMonth: 8,
    birthDay: 21,
    position: 'Striker / Goal Machine',
    photoUrl: 'https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/132145.png&w=350&h=254',
    trophies: 'UCL, 10x Bundesliga, 1x La Liga, 2x FIFA The Best',
    quote: 'Hard work beats talent when talent doesn’t work hard.',
    wishesCount: 2840,
  },
  {
    id: 'bday-henry',
    name: 'Thierry Henry',
    club: 'Arsenal Invincibles 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    country: 'France',
    countryFlag: '🇫🇷',
    birthYear: 1977,
    birthMonth: 8,
    birthDay: 17,
    position: 'Striker / King of Highbury',
    photoUrl: 'https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/352.png&w=350&h=254',
    trophies: 'World Cup, Euro, 2x Premier League, UCL',
    quote: 'Sometimes in football you have to score goals before you can think about style.',
    wishesCount: 3450,
  },
  {
    id: 'bday-bernardo',
    name: 'Bernardo Silva',
    club: 'Manchester City 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    country: 'Portugal',
    countryFlag: '🇵🇹',
    birthYear: 1994,
    birthMonth: 8,
    birthDay: 10,
    position: 'Attacking Midfielder',
    photoUrl: 'https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/196602.png&w=350&h=254',
    trophies: 'UCL, 6x Premier League, UEFA Nations League',
    quote: 'Magician on the ball with relentless tactical pressing.',
    wishesCount: 1980,
  },
  {
    id: 'bday-kane',
    name: 'Harry Kane',
    club: 'Bayern Munich 🇩🇪',
    country: 'England',
    countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    birthYear: 1993,
    birthMonth: 7,
    birthDay: 28,
    position: 'Striker / Golden Boot',
    photoUrl: 'https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/156942.png&w=350&h=254',
    trophies: 'European Golden Shoe, 3x Premier League Golden Boot',
    quote: 'Never let setbacks define your ultimate journey.',
    wishesCount: 1520,
  },
  {
    id: 'bday-haaland',
    name: 'Erling Haaland',
    club: 'Manchester City 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    country: 'Norway',
    countryFlag: '🇳🇴',
    birthYear: 2000,
    birthMonth: 7,
    birthDay: 21,
    position: 'Striker / The Cyborg',
    photoUrl: 'https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/251347.png&w=350&h=254',
    trophies: 'UCL, 2x Premier League, Treble Winner, Golden Boot',
    quote: 'Stay hungry, focus on the net, never stop scoring.',
    wishesCount: 4210,
  },
  {
    id: 'bday-modric',
    name: 'Luka Modrić',
    club: 'Real Madrid 🇪🇸',
    country: 'Croatia',
    countryFlag: '🇭🇷',
    birthYear: 1985,
    birthMonth: 9,
    birthDay: 9,
    position: 'Midfield Maestro',
    photoUrl: 'https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/104327.png&w=350&h=254',
    trophies: '6x UCL, Ballon d’Or 2018, 4x La Liga',
    quote: 'Age is just a number when passion drives your feet.',
    wishesCount: 3890,
  },
  {
    id: 'bday-saka',
    name: 'Bukayo Saka',
    club: 'Arsenal 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    country: 'England',
    countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    birthYear: 2001,
    birthMonth: 9,
    birthDay: 5,
    position: 'Right Winger / Starboy',
    photoUrl: 'https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/253907.png&w=350&h=254',
    trophies: 'FA Cup, 2x Community Shield, England Player of Year',
    quote: 'God gives me strength, the fans give me wings.',
    wishesCount: 2610,
  },
  {
    id: 'bday-debruyne',
    name: 'Kevin De Bruyne',
    club: 'Manchester City 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    country: 'Belgium',
    countryFlag: '🇧🇪',
    birthYear: 1991,
    birthMonth: 6,
    birthDay: 28,
    position: 'Playmaker / Assist King',
    photoUrl: 'https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/132149.png&w=350&h=254',
    trophies: 'UCL, 6x Premier League, 2x PFA Player of Year',
    quote: 'Passing is an art of seeing what others cannot.',
    wishesCount: 2750,
  },
];

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface BirthdayCenterProps {
  onClose: () => void;
}

type FilterTab = 'THIS_WEEK' | 'THIS_MONTH' | 'ALL';

export const BirthdayCenterModal: React.FC<BirthdayCenterProps> = ({ onClose }) => {
  const [players, setPlayers] = useState<BirthdayPlayer[]>(STAR_BIRTHDAYS);
  const [wishedPlayers, setWishedPlayers] = useState<Record<string, boolean>>({});
  const [photoErrors, setPhotoErrors] = useState<Record<string, boolean>>({});
  const [activeSharePlayer, setActiveSharePlayer] = useState<BirthdayPlayer | null>(null);
  const [filter, setFilter] = useState<FilterTab>('THIS_WEEK');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // A) Fetch real birthdays from API endpoint with fallback & compute dynamic date on load
  const fetchTodaysBirthdays = async () => {
    try {
      const res = await fetch('/api/birthdays');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setPlayers(data);
        }
      }
    } catch (err) {
      console.debug('Fallback to built-in Star Birthdays dataset:', err);
    }
  };

  useEffect(() => {
    setCurrentDate(new Date());
    fetchTodaysBirthdays();
  }, []);

  // Compute player details dynamically (age, dynamic date tag, diff days)
  const enrichedPlayers = useMemo(() => {
    const now = currentDate;
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-12
    const currentDay = now.getDate();

    const todayStart = new Date(currentYear, now.getMonth(), currentDay);

    return players.map((p) => {
      const calculatedAge = currentYear - p.birthYear;
      const bdayThisYear = new Date(currentYear, p.birthMonth - 1, p.birthDay);
      const diffTime = bdayThisYear.getTime() - todayStart.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      const monthName = MONTH_NAMES[p.birthMonth - 1] || 'Aug';
      let dateLabel = `${monthName} ${p.birthDay}`;
      let isToday = false;
      let isTomorrow = false;

      if (diffDays === 0) {
        dateLabel = '🎂 Today!';
        isToday = true;
      } else if (diffDays === 1) {
        dateLabel = 'Tomorrow 🎂';
        isTomorrow = true;
      } else if (diffDays === -1) {
        dateLabel = 'Yesterday 🌟';
      }

      // Check week proximity: within 7 days
      const isThisWeek = Math.abs(diffDays) <= 7;
      const isThisMonth = p.birthMonth === currentMonth;

      return {
        ...p,
        age: calculatedAge,
        birthDate: dateLabel,
        diffDays,
        isToday,
        isTomorrow,
        isThisWeek,
        isThisMonth,
      };
    });
  }, [players, currentDate]);

  // Filter players according to active toggle
  const filteredPlayers = useMemo(() => {
    if (filter === 'THIS_WEEK') {
      const weekList = enrichedPlayers.filter((p) => p.isThisWeek);
      return weekList.length > 0 ? weekList : enrichedPlayers.slice(0, 4);
    }
    if (filter === 'THIS_MONTH') {
      const monthList = enrichedPlayers.filter((p) => p.isThisMonth);
      return monthList.length > 0 ? monthList : enrichedPlayers;
    }
    return enrichedPlayers;
  }, [enrichedPlayers, filter]);

  // Total wishes aggregate calculation
  const totalWishes = useMemo(() => {
    return enrichedPlayers.reduce((acc, p) => acc + (p.wishesCount || 0), 0);
  }, [enrichedPlayers]);

  const handleWish = (player: BirthdayPlayer & { age?: number }) => {
    if (wishedPlayers[player.id]) return;

    setWishedPlayers((prev) => ({ ...prev, [player.id]: true }));
    setPlayers((prev) =>
      prev.map((p) => (p.id === player.id ? { ...p, wishesCount: p.wishesCount + 1 } : p))
    );

    // Audio & Confetti Celebration
    stadiumAudio.playCrowdRoar();
    if (typeof window !== 'undefined') {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'],
      });
      if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);
    }
  };

  const getPlayerInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const generateShareUrl = (player: BirthdayPlayer, platform: 'WHATSAPP' | 'TWITTER' | 'TELEGRAM') => {
    const ageText = player.age ? `${player.age} yrs` : '';
    const text = encodeURIComponent(
      `🎂 Happy Birthday to football superstar ${player.name} (${ageText})! Wishing the champion many more trophies! 🌟 Celebrated on AuraScore Stadium ⚡`
    );
    const url = encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : 'https://aurascore.app');

    if (platform === 'WHATSAPP') return `https://api.whatsapp.com/send?text=${text}%20${url}`;
    if (platform === 'TWITTER') return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    return `https://t.me/share/url?url=${url}&text=${text}`;
  };

  const formattedTodayDate = useMemo(() => {
    return currentDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, [currentDate]);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-5xl glass-panel rounded-3xl border border-pink-500/40 p-4 sm:p-6 shadow-2xl font-mono text-xs max-h-[92vh] overflow-y-auto space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-panel text-gray-400 hover:text-white border border-white/10 transition-all hover:scale-110 z-10"
          aria-label="Close Birthday Lounge"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Section Header Upgrade */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4 pr-10">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-500/30 to-purple-600/30 text-pink-400 border border-pink-500/40 shadow-lg flex-shrink-0">
              <Cake className="w-7 h-7 animate-bounce" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-black text-lg sm:text-xl text-white tracking-wide">
                  🎂 Star Birthdays This Week
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-bold border border-pink-500/30">
                  {formattedTodayDate}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-sans mt-0.5">
                Send live fan wishes, unlock birthday confetti, and flex tribute cards across social media!
              </p>
            </div>
          </div>

          {/* Aggregate Wishes Counter */}
          <div className="flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-pink-950/40 border border-pink-500/30 text-pink-300 font-bold self-start md:self-auto">
            <Heart className="w-4 h-4 text-pink-400 fill-pink-500 animate-pulse" />
            <span className="text-xs tracking-wider">
              {totalWishes.toLocaleString()} wishes sent
            </span>
          </div>
        </div>

        {/* Filter Tabs Toggle */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
          <div className="flex items-center bg-black/60 p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => setFilter('THIS_WEEK')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === 'THIS_WEEK'
                  ? 'bg-pink-500 text-black shadow-lg glow-pink'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🎂 This Week
            </button>
            <button
              onClick={() => setFilter('THIS_MONTH')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === 'THIS_MONTH'
                  ? 'bg-pink-500 text-black shadow-lg glow-pink'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📅 This Month
            </button>
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === 'ALL'
                  ? 'bg-pink-500 text-black shadow-lg glow-pink'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              ⭐ All Stars
            </button>
          </div>

          <span className="text-[11px] text-gray-400 font-sans hidden sm:inline">
            Showing {filteredPlayers.length} star {filteredPlayers.length === 1 ? 'player' : 'players'}
          </span>
        </div>

        {/* Player Cards (Horizontally scrollable on mobile, Grid on desktop) */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-3 -mx-1 px-1 scrollbar-thin scrollbar-thumb-pink-500/30">
          {filteredPlayers.map((p) => {
            const hasWished = wishedPlayers[p.id];
            const hasPhotoError = photoErrors[p.id];
            const initials = getPlayerInitials(p.name);

            return (
              <div
                key={p.id}
                className="min-w-[280px] sm:min-w-[310px] md:min-w-0 flex-shrink-0 snap-center glass-panel-premium rounded-3xl p-4 sm:p-5 border border-white/10 hover:border-pink-500/50 transition-all flex flex-col justify-between space-y-4 shadow-xl hover:shadow-pink-500/10 group"
              >
                {/* Top Section: Photo, Name, Age Badge */}
                <div className="space-y-3">
                  {/* Large Center Photo with Fallback Initials */}
                  <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-pink-500/40 bg-black/60 shadow-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    {!hasPhotoError && p.photoUrl ? (
                      <img
                        src={p.photoUrl}
                        alt={p.name}
                        className="w-full h-full object-cover"
                        onError={() => {
                          setPhotoErrors((prev) => ({ ...prev, [p.id]: true }));
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-600 via-purple-700 to-indigo-800 text-white font-black">
                        <span className="text-2xl sm:text-3xl tracking-widest">{initials}</span>
                        <span className="text-[9px] opacity-75 font-sans mt-0.5">LEGEND</span>
                      </div>
                    )}
                    
                    {/* Position pill overlay */}
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-[9px] text-pink-300 font-bold border border-white/10">
                      {p.countryFlag}
                    </div>
                  </div>

                  {/* Name and Age Badge */}
                  <div className="text-center space-y-1.5">
                    <h3 className="font-black text-base sm:text-lg text-white group-hover:text-pink-300 transition-colors line-clamp-1">
                      {p.name}
                    </h3>
                    
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 text-[11px] font-bold">
                        🎂 Turns {p.age}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/10 text-[10px] font-sans">
                        {p.birthDate}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-400 font-sans">
                      {p.club} • <span className="text-gray-300">{p.position}</span>
                    </p>
                  </div>

                  {/* Trophies Row */}
                  <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 space-y-1 text-[11px]">
                    <div className="flex items-start space-x-1.5 text-stadiumGreen font-bold">
                      <Trophy className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2 text-gold/90">{p.trophies}</span>
                    </div>
                  </div>

                  {/* Quote in italic */}
                  <div className="px-1">
                    <p className="text-gray-300 italic font-sans text-[11px] leading-relaxed line-clamp-2">
                      "{p.quote}"
                    </p>
                  </div>
                </div>

                {/* Bottom Section: Wish Counter, Wish Button, Share Buttons */}
                <div className="space-y-2.5 pt-2 border-t border-white/5">
                  {/* Wishes count with animated heart */}
                  <div className="flex items-center justify-between text-xs px-1">
                    <span className="text-gray-400 font-sans text-[11px] flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-pink-400" />
                      Fan Love
                    </span>
                    <span className="font-black text-gold flex items-center gap-1">
                      <Heart className={`w-3.5 h-3.5 text-pink-500 ${hasWished ? 'fill-pink-500 animate-ping' : 'fill-pink-500/40'}`} />
                      {p.wishesCount.toLocaleString()} wishes
                    </span>
                  </div>

                  {/* Send Birthday Wish Button */}
                  <button
                    onClick={() => handleWish(p)}
                    className={`w-full py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center space-x-2 shadow-md ${
                      hasWished
                        ? 'bg-pink-600/30 text-pink-300 border border-pink-500/50 cursor-default'
                        : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-black font-extrabold hover:scale-[1.02] active:scale-95 shadow-pink-500/20'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${hasWished ? 'fill-current text-pink-400' : 'text-black fill-black'}`} />
                    <span>{hasWished ? 'Wished! Happy Birthday 💖' : 'Send Birthday Wish 🎉'}</span>
                  </button>

                  {/* 3 Share Buttons: WhatsApp 🟢, Twitter/X 🐦, Telegram ✈️ */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-[10px] text-gray-400 font-sans">Share:</span>
                    <div className="flex items-center gap-1.5">
                      {/* WhatsApp */}
                      <a
                        href={generateShareUrl(p, 'WHATSAPP')}
                        target="_blank"
                        rel="noreferrer"
                        className="w-8 h-8 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white flex items-center justify-center transition-all hover:scale-110 shadow-md"
                        title="Share on WhatsApp"
                        aria-label="Share on WhatsApp"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.764.814 2.796.815 3.181 0 5.767-2.587 5.768-5.766.001-3.181-2.586-5.768-5.768-5.801zm3.376 8.212c-.144.405-.837.774-1.17.824-.312.045-.705.074-2.136-.518-1.584-.657-2.61-2.26-2.69-2.366-.08-.106-.639-.851-.639-1.624 0-.773.405-1.153.549-1.311.144-.158.314-.198.42-.198.106 0 .211.001.304.006.098.005.23-.037.36.275.136.326.465 1.134.506 1.217.041.083.068.18.013.29-.055.11-.083.18-.163.275-.08.095-.169.213-.241.286-.08.081-.163.169-.07.33.093.161.412.68.884 1.1 1.1.607.47.785.642.92.836.136.193.136.106.314-.106.178-.212.766-.893.971-1.2.205-.307.41-.256.685-.154.275.102 1.745.823 2.045.973.3.15.5.225.575.352.075.127.075.736-.069 1.141z" />
                        </svg>
                      </a>

                      {/* Twitter / X */}
                      <a
                        href={generateShareUrl(p, 'TWITTER')}
                        target="_blank"
                        rel="noreferrer"
                        className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10 flex items-center justify-center transition-all hover:scale-110 shadow-md"
                        title="Share on Twitter/X"
                        aria-label="Share on Twitter/X"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </a>

                      {/* Telegram */}
                      <a
                        href={generateShareUrl(p, 'TELEGRAM')}
                        target="_blank"
                        rel="noreferrer"
                        className="w-8 h-8 rounded-full bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center transition-all hover:scale-110 shadow-md"
                        title="Share on Telegram"
                        aria-label="Share on Telegram"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.535-.194 1.006.128.832.943z" />
                        </svg>
                      </a>

                      {/* Card Preview Modal Button */}
                      <button
                        onClick={() => setActiveSharePlayer(p)}
                        className="w-8 h-8 rounded-full bg-panel hover:bg-white/10 text-gold border border-white/10 flex items-center justify-center transition-all hover:scale-110 shadow-md"
                        title="Generate Birthday Flex Card"
                        aria-label="Generate Birthday Flex Card"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Gen-Z Birthday Flex Card Modal */}
        {activeSharePlayer && (
          <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4">
            <div className="relative w-full max-w-sm glass-panel-premium rounded-3xl border border-pink-500/60 p-5 space-y-4 shadow-2xl text-center font-mono">
              
              <button
                onClick={() => setActiveSharePlayer(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-panel text-gray-400 hover:text-white"
                aria-label="Close Preview"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Card Canvas */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-pink-950/70 via-black to-emerald-950/70 border border-pink-500/40 space-y-3 shadow-inner">
                <span className="text-[10px] text-gold font-black uppercase tracking-widest block">
                  🌟 OFFICIAL STADIUM BIRTHDAY TRIBUTE 🌟
                </span>

                <div className="w-20 h-20 mx-auto rounded-full bg-void border-2 border-pink-400 p-1 shadow-lg flex items-center justify-center overflow-hidden">
                  {!photoErrors[activeSharePlayer.id] && activeSharePlayer.photoUrl ? (
                    <img
                      src={activeSharePlayer.photoUrl}
                      alt={activeSharePlayer.name}
                      className="w-full h-full object-cover rounded-full"
                      onError={() => {
                        setPhotoErrors((prev) => ({ ...prev, [activeSharePlayer.id]: true }));
                      }}
                    />
                  ) : (
                    <div className="w-full h-full rounded-full flex items-center justify-center bg-gradient-to-br from-pink-600 to-purple-800 text-white font-black text-xl">
                      {getPlayerInitials(activeSharePlayer.name)}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-black text-white">{activeSharePlayer.name}</h3>
                  <span className="text-xs text-pink-400 font-bold block">{activeSharePlayer.club}</span>
                  <span className="text-[11px] text-gray-300 font-sans block mt-1">
                    Celebrating {activeSharePlayer.age} Years of Greatness! 🎂
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 text-[10px] text-gray-300 space-y-1">
                  <span className="text-stadiumGreen font-bold block">Celebrated by AuraScore Stadium Fanclub</span>
                  <span className="text-gold block">🏆 {activeSharePlayer.trophies}</span>
                </div>
              </div>

              {/* 1-Click Social Sharing Links */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] text-gray-400 font-bold block">SHARE TRIBUTE WITH FRIENDS:</span>
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={generateShareUrl(activeSharePlayer, 'WHATSAPP')}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] transition-all flex items-center justify-center gap-1"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={generateShareUrl(activeSharePlayer, 'TWITTER')}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-black text-[11px] transition-all flex items-center justify-center gap-1 border border-white/10"
                  >
                    X / Twitter
                  </a>
                  <a
                    href={generateShareUrl(activeSharePlayer, 'TELEGRAM')}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-black text-[11px] transition-all flex items-center justify-center gap-1"
                  >
                    Telegram
                  </a>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
