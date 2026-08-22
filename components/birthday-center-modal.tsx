'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  X, Cake, Sparkles, Heart, Trophy, Share2, Calendar, Award, ChevronRight,
  Globe, Star, Users, Zap, Instagram, Twitter, Flame, Download, Copy, Check, Send, MessageCircle
} from 'lucide-react';
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
  birthMonth: number;
  birthDay: number;
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
    name: 'Lautaro Martinez',
    sport: 'FOOTBALL',
    club: 'Inter Milan',
    country: 'Argentina',
    countryFlag: '🇦🇷',
    birthYear: 1997, birthMonth: 8, birthDay: 22,
    position: 'Striker / El Toro',
    nationality: 'Argentine',
    height: '1.74m',
    marketValue: '€110M',
    photoUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=85',
    fallbackPhotoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=85',
    trophies: 'World Cup 2022, 2x Copa America, 2x Serie A, Capocannoniere',
    quote: 'El Toro never stops charging. We fight for every inch on the pitch.',
    wishesCount: 5820,
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
    club: 'FC Barcelona',
    country: 'Poland',
    countryFlag: '🇵🇱',
    birthYear: 1988, birthMonth: 8, birthDay: 21,
    position: 'Centre Forward / Goal Machine',
    nationality: 'Polish',
    height: '1.85m',
    marketValue: '€15M',
    photoUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&auto=format&fit=crop&q=85',
    fallbackPhotoUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=85',
    trophies: 'UCL, 10x Bundesliga, La Liga, 2x FIFA The Best',
    quote: 'Hard work beats talent when talent does not work hard.',
    wishesCount: 3140,
    stats: [
      { label: 'Club Goals', value: '600+' },
      { label: 'Intl Goals', value: '84' },
      { label: 'Golden Boots', value: '6' },
      { label: 'Seasons', value: '18' },
    ],
    twitter: 'lewy_official',
  },
  {
    id: 'bday-henry',
    name: 'Thierry Henry',
    sport: 'FOOTBALL',
    club: 'Arsenal Invincibles',
    country: 'France',
    countryFlag: '🇫🇷',
    birthYear: 1977, birthMonth: 8, birthDay: 17,
    position: 'Striker / King of Highbury',
    nationality: 'French',
    height: '1.88m',
    marketValue: 'Legend',
    photoUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&auto=format&fit=crop&q=85',
    fallbackPhotoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=85',
    trophies: 'World Cup 1998, EURO 2000, 2x Premier League, UCL',
    quote: 'Sometimes in football you have to score goals before you think of style.',
    wishesCount: 3950,
    stats: [
      { label: 'Arsenal Goals', value: '228' },
      { label: 'Intl Goals', value: '51' },
      { label: 'PL Golden Boots', value: '4' },
      { label: 'Invincible', value: '2003-04 👑' },
    ],
  },
  {
    id: 'bday-osimhen',
    name: 'Victor Osimhen',
    sport: 'FOOTBALL',
    club: 'Galatasaray',
    country: 'Nigeria',
    countryFlag: '🇳🇬',
    birthYear: 1998, birthMonth: 12, birthDay: 29,
    position: 'Striker / African POTY',
    nationality: 'Nigerian',
    height: '1.85m',
    marketValue: '€80M',
    photoUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&auto=format&fit=crop&q=85',
    trophies: 'Serie A Title 2023, Capocannoniere, CAF POTY 2023',
    quote: 'From the streets of Olusosun Lagos to world glory. Believe in yourself.',
    wishesCount: 6890,
    stats: [
      { label: 'Serie A Goals', value: '26 (22/23)' },
      { label: 'Super Eagles Goals', value: '21' },
      { label: 'CAF POTY', value: '2023 👑' },
      { label: 'Market Value', value: '€80M' },
    ],
    instagram: 'victorosimhen9',
  },
  {
    id: 'bday-saka',
    name: 'Bukayo Saka',
    sport: 'FOOTBALL',
    club: 'Arsenal',
    country: 'England',
    countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    birthYear: 2001, birthMonth: 9, birthDay: 5,
    position: 'Right Winger / Starboy',
    nationality: 'English-Nigerian',
    height: '1.78m',
    marketValue: '€130M',
    photoUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=85',
    trophies: 'FA Cup, 2x Community Shield, 2x England POTY',
    quote: 'God gives me strength, the fans give me wings.',
    wishesCount: 4210,
    stats: [
      { label: 'PL Goals', value: '16' },
      { label: 'Assists', value: '9' },
      { label: 'England Goals', value: '18' },
      { label: 'Dribbles/Game', value: '2.4' },
    ],
    instagram: 'bukayosaka87',
  },
  {
    id: 'bday-haaland',
    name: 'Erling Haaland',
    sport: 'FOOTBALL',
    club: 'Manchester City',
    country: 'Norway',
    countryFlag: '🇳🇴',
    birthYear: 2000, birthMonth: 7, birthDay: 21,
    position: 'Striker / The Cyborg',
    nationality: 'Norwegian',
    height: '1.94m',
    marketValue: '€180M',
    photoUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=85',
    trophies: 'UCL, 2x Premier League, Treble Winner, Golden Boot',
    quote: 'Stay hungry, focus on the net, never stop scoring.',
    wishesCount: 5120,
    stats: [
      { label: 'PL Season Record', value: '36 Goals' },
      { label: 'UCL Goals', value: '44' },
      { label: 'Goals/Game', value: '0.87' },
      { label: 'Hat-tricks', value: '18' },
    ],
  },
  // 🏀 BASKETBALL
  {
    id: 'bday-lebron',
    name: 'LeBron James',
    sport: 'BASKETBALL',
    club: 'LA Lakers',
    country: 'USA',
    countryFlag: '🇺🇸',
    birthYear: 1984, birthMonth: 12, birthDay: 30,
    position: 'Small Forward / King James',
    nationality: 'American',
    height: '2.06m',
    marketValue: 'Legend',
    photoUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=85',
    trophies: '4x NBA Champion, 4x Finals MVP, 4x NBA MVP, All-Time Scorer',
    quote: 'Strive for greatness every single day.',
    wishesCount: 11400,
    stats: [
      { label: 'All-Time Points', value: '40,000+' },
      { label: 'Career PPG', value: '27.1' },
      { label: 'Championships', value: '4 🏆' },
      { label: 'All-Star Games', value: '20' },
    ],
    twitter: 'KingJames',
    instagram: 'kingjames',
  },
  // 🎾 TENNIS
  {
    id: 'bday-djokovic',
    name: 'Novak Djokovic',
    sport: 'TENNIS',
    club: 'Serbia',
    country: 'Serbia',
    countryFlag: '🇷🇸',
    birthYear: 1987, birthMonth: 5, birthDay: 22,
    position: 'World No.1 / Tennis GOAT',
    nationality: 'Serbian',
    height: '1.88m',
    marketValue: 'GOAT',
    photoUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&auto=format&fit=crop&q=85',
    trophies: '24x Grand Slams, Olympic Gold 2024, 7x ATP Finals, 428 Weeks at No.1',
    quote: 'Pressure is a privilege. Believe when nobody else does.',
    wishesCount: 8900,
    stats: [
      { label: 'Grand Slams', value: '24 🏆' },
      { label: 'Weeks at No.1', value: '428+' },
      { label: 'Olympic Gold', value: 'Paris 2024' },
      { label: 'ATP Titles', value: '99' },
    ],
  },
  // 🏃 ATHLETICS
  {
    id: 'bday-bolt',
    name: 'Usain Bolt',
    sport: 'ATHLETICS',
    club: 'Jamaica',
    country: 'Jamaica',
    countryFlag: '🇯🇲',
    birthYear: 1986, birthMonth: 8, birthDay: 21,
    position: '100m & 200m World Record Holder',
    nationality: 'Jamaican',
    height: '1.95m',
    marketValue: 'Legend',
    photoUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=85',
    trophies: '8x Olympic Gold, 11x World Champion, 9.58s World Record',
    quote: 'I trained 4 years to run 9 seconds. Do not tell me you cannot do something.',
    wishesCount: 7120,
    stats: [
      { label: '100m Record', value: '9.58s ⚡' },
      { label: '200m Record', value: '19.19s ⚡' },
      { label: 'Olympic Golds', value: '8 🥇' },
      { label: 'World Titles', value: '11 🥇' },
    ],
    instagram: 'usainbolt',
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

const GENZ_PRESET_TAGS = [
  '👑 GOAT Energy',
  '🔥 Ballon d\'Or Vibes',
  '🇳🇬 Naija Stands With You',
  '⚡ Living Legend',
  '🏆 Champion Forever',
  '🎯 Pitch Maestro',
];

// ─── GEN-Z VIRAL SOCIAL FLEX CARD MODAL ───────────────────────────────────────

interface FlexCardModalProps {
  player: BirthdayPlayer & { age?: number; birthDate?: string };
  userWish: string;
  onClose: () => void;
}

const GenZSocialFlexCardModal: React.FC<FlexCardModalProps> = ({ player, userWish, onClose }) => {
  const [copied, setCopied] = useState(false);
  const meta = SPORT_META[player.sport] || SPORT_META.FOOTBALL;
  const wishText = userWish.trim() ? userWish.trim() : ('Happy Birthday to the legendary ' + player.name + '! 🎂');

  const shareMsg = '🎂 HBD ' + player.name + ' (' + (player.age || '') + ' yrs)!\\n\\n"' + wishText + '"\\n\\n⚡ Tribute by @CyberStriker_99 on AuraScore Stadium\\n' + (typeof window !== 'undefined' ? window.location.origin : 'https://aurascore.app');
  const shareText = encodeURIComponent(shareMsg);

  const handleCopy = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText('🎂 HBD ' + player.name + '! "' + wishText + '" - Wished on AuraScore Stadium ⚡');
      setCopied(true);
      stadiumAudio.playSuccessSound();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-md glass-panel-premium rounded-3xl border-2 border-pink-500/60 p-5 shadow-2xl space-y-4 font-mono text-xs">
        
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full bg-black/60 text-white border border-white/10 hover:bg-black transition-all">
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-pink-400 animate-spin" />
          <span className="font-black text-white text-xs uppercase tracking-wider">GEN-Z VIRAL BIRTHDAY FLEX CARD</span>
        </div>

        {/* The Viral Shareable Card Preview */}
        <div
          className="relative rounded-2xl overflow-hidden border border-pink-500/40 p-4 space-y-3 shadow-xl"
          style={{ background: 'linear-gradient(135deg, #0f0a14 0%, #1a0f24 50%, #0a140f 100%)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <span className="text-base">🎂</span>
              <span className="font-black text-pink-400 text-xs">AURASCORE STADIUM TRIBUTE</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-bold text-[9px] border border-pink-500/30">
              OFFICIAL FAN CARD ✓
            </span>
          </div>

          {/* Player Photo + Name */}
          <div className="flex items-center space-x-3 bg-black/40 p-2.5 rounded-xl border border-white/10">
            <img src={player.photoUrl} alt={player.name} className="w-14 h-14 rounded-xl object-cover border border-pink-500/40 shadow" />
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-white text-sm truncate">{player.name}</h3>
              <p className="text-[10px] text-gray-300">{player.position} • {player.club}</p>
              <span className="text-[9px] text-gold font-bold">{player.age} Years Old Today 🎉</span>
            </div>
          </div>

          {/* User Custom Handwritten Wish */}
          <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/30 space-y-1">
            <span className="text-[9px] text-pink-400 font-bold uppercase tracking-wider block">💬 Fan Wish Shoutout:</span>
            <p className="text-white text-xs font-bold italic leading-relaxed">
              "{wishText}"
            </p>
            <div className="flex items-center justify-between pt-1 text-[9px] text-gray-400">
              <span>Wished by <strong className="text-stadiumGreen">@CyberStriker_99</strong></span>
              <span>🇳🇬 Verified SuperFan</span>
            </div>
          </div>

          {/* Footer watermark */}
          <div className="flex items-center justify-between text-[8px] text-gray-500 pt-1 border-t border-white/5">
            <span>aurascore.app • World-First Live Prediction</span>
            <span>⚡ Gen-Z Verified</span>
          </div>
        </div>

        {/* 1-Tap Social Share Buttons */}
        <div className="space-y-2 pt-1">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">🚀 Share Card on Socials:</span>
          <div className="grid grid-cols-3 gap-2">
            <a
              href={'https://api.whatsapp.com/send?text=' + shareText}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] flex items-center justify-center space-x-1.5 transition-all shadow-md active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
            <a
              href={'https://twitter.com/intent/tweet?text=' + shareText}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-black text-[11px] flex items-center justify-center space-x-1.5 transition-all shadow-md active:scale-95"
            >
              <Twitter className="w-3.5 h-3.5" />
              <span>Twitter / X</span>
            </a>
            <button
              onClick={handleCopy}
              className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-[11px] flex items-center justify-center space-x-1.5 transition-all border border-white/10 active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-stadiumGreen" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// ─── PLAYER PROFILE POPUP WITH CUSTOM WISH BOX ───────────────────────────────

interface ProfilePopupProps {
  player: BirthdayPlayer & { age?: number; birthDate?: string; isToday?: boolean };
  onClose: () => void;
  onWish: (customWish: string) => void;
  wished: boolean;
}

const PlayerProfilePopup: React.FC<ProfilePopupProps> = ({ player, onClose, onWish, wished }) => {
  const [customWish, setCustomWish] = useState('');
  const [showFlexCard, setShowFlexCard] = useState(false);
  const meta = SPORT_META[player.sport] || SPORT_META.FOOTBALL;

  const handleSendWish = () => {
    onWish(customWish);
    setShowFlexCard(true);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <div
          className={'w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden border ' + (meta.border) + ' shadow-2xl max-h-[90vh] overflow-y-auto'}
          onClick={e => e.stopPropagation()}
          style={{ background: 'linear-gradient(135deg, #0a0f0a 0%, #111811 100%)' }}
        >
          {/* Header with REAL player photo */}
          <div className={'relative h-56 sm:h-64 ' + (meta.bg) + ' overflow-hidden flex-shrink-0'}>
            <img
              src={player.photoUrl}
              alt={player.name}
              loading="eager"
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                if (player.fallbackPhotoUrl) {
                  (e.target as HTMLImageElement).src = player.fallbackPhotoUrl;
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white border border-white/10 hover:bg-black/80 transition-all">
              <X className="w-4 h-4" />
            </button>

            <div className={'absolute top-4 left-4 px-2.5 py-1 rounded-xl ' + (meta.bg) + ' ' + (meta.border) + ' border text-xs font-black ' + (meta.color)}>
              {meta.icon} {player.sport}
            </div>

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

            {/* Custom Birthday Wish Write-In & Gen-Z Card Creator */}
            <div className="p-4 rounded-2xl bg-pink-500/10 border border-pink-500/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-pink-400 font-black uppercase tracking-wider flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Write Your Birthday Wish & Auto-Flex Card</span>
                </span>
                <span className="text-[9px] text-gray-400">Gen-Z Viral Card</span>
              </div>

              <textarea
                value={customWish}
                onChange={(e) => setCustomWish(e.target.value)}
                placeholder={'Write your heartfelt wish for ' + player.name + '... (e.g. Bring the title home El Toro! 🔥)'}
                rows={2}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white placeholder-gray-500 font-mono text-xs focus:border-pink-500 focus:outline-none"
              />

              {/* Quick Tags */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {GENZ_PRESET_TAGS.map((tag, i) => (
                  <button
                    key={i}
                    onClick={() => setCustomWish((prev) => (prev ? prev + ' ' + tag : tag))}
                    className="flex-shrink-0 px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300 text-[9px] font-bold transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <button
                onClick={handleSendWish}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-pink-900/30 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-gold animate-bounce" />
                <span>Send Wish & Generate Viral Flex Card 🚀</span>
              </button>
            </div>

            {/* Stats grid */}
            {player.stats && player.stats.length > 0 && (
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide font-bold mb-2">Career Highlights</p>
                <div className="grid grid-cols-2 gap-2">
                  {player.stats.map((s, i) => (
                    <div key={i} className={'p-2.5 rounded-xl ' + (meta.bg) + ' ' + (meta.border) + ' border'}>
                      <span className={'text-base font-black ' + (meta.color) + ' block'}>{s.value}</span>
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

          </div>
        </div>
      </div>

      {/* Social Flex Card Modal */}
      {showFlexCard && (
        <GenZSocialFlexCardModal
          player={player}
          userWish={customWish}
          onClose={() => setShowFlexCard(false)}
        />
      )}
    </>
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
  const meta = SPORT_META[player.sport] || SPORT_META.FOOTBALL;

  return (
    <div
      onClick={onClick}
      className={'relative rounded-3xl border overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl ' + (player.isToday ? 'border-pink-500/80 shadow-pink-900/30 shadow-lg' : meta.border)}
      style={{ background: 'linear-gradient(135deg, #0d130d 0%, #111811 100%)' }}
    >
      {player.isToday && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-gold to-pink-500 animate-pulse z-10" />
      )}

      {/* Photo */}
      <div className={'relative h-44 sm:h-48 overflow-hidden ' + meta.bg}>
        <img
          src={player.photoUrl}
          alt={player.name}
          loading="lazy"
          className="w-full h-full object-cover object-top transition-all duration-500 group-hover:scale-105"
          onError={(e) => {
            if (player.fallbackPhotoUrl) {
              (e.target as HTMLImageElement).src = player.fallbackPhotoUrl;
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* Sport badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5 z-10">
          <span className={'px-2 py-0.5 rounded-xl text-[10px] font-black border backdrop-blur-sm ' + meta.bg + ' ' + meta.border + ' ' + meta.color}>
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
          <span className={'text-xs font-black ' + meta.color}>{meta.icon}</span>
        </div>

        <div className="flex items-center space-x-2" onClick={e => e.stopPropagation()}>
          <button
            onClick={onWish}
            className={'flex-1 py-2 rounded-xl text-xs font-black flex items-center justify-center space-x-1.5 transition-all active:scale-95 ' + (wished ? 'bg-pink-500/20 border border-pink-500/40 text-pink-400' : 'bg-pink-600/90 hover:bg-pink-500 text-white shadow-md shadow-pink-900/30')}>
            <Heart className={'w-3 h-3 ' + (wished ? 'fill-current' : '')} />
            <span>{wished ? 'Wished 🎉' : 'Wish & Flex Card'}</span>
          </button>
          <button
            onClick={onClick}
            className={'p-2 rounded-xl border ' + meta.border + ' ' + meta.bg + ' ' + meta.color + ' text-xs transition-all hover:scale-105'}
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
      let birthDate = monthName + ' ' + p.birthDay;
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

  const sportCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: enrichedPlayers.length };
    enrichedPlayers.forEach(p => { counts[p.sport] = (counts[p.sport] || 0) + 1; });
    return counts;
  }, [enrichedPlayers]);

  const formattedDate = currentDate.toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto font-mono text-xs">
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
                    className={'flex-shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black border transition-all ' + (sportFilter === s ? (meta.bg + ' ' + meta.border + ' ' + meta.color) : 'bg-white/5 border-white/10 text-gray-400 hover:text-white')}>
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
                  className={'flex-1 py-1.5 rounded-xl text-[10px] font-black border transition-all ' + (filter === f ? (f === 'TODAY' ? 'bg-pink-500 text-white font-black shadow-md shadow-pink-500/30 border-pink-400' : 'bg-pink-500/20 border-pink-500/40 text-pink-400') : 'bg-white/5 border-white/10 text-gray-400 hover:text-white')}>
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
                    onWish={() => {
                      handleWish(player);
                      setSelectedPlayer(player);
                    }}
                    onClick={() => setSelectedPlayer(player)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Player Profile Popup with Custom Wish Box & Flex Card */}
      {selectedPlayer && (
        <PlayerProfilePopup
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          onWish={(customWish) => {
            handleWish(selectedPlayer);
          }}
          wished={!!wishedPlayers[selectedPlayer.id]}
        />
      )}
    </>
  );
};
