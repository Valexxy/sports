'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Sparkles, Trophy, Heart, Search, Share2,
  RefreshCw, Star, Camera, Send, X, Upload, Download,
  Instagram, Twitter, Facebook, MessageCircle, Copy, Check,
  Calendar, ChevronLeft, ChevronRight, Globe, Filter, UserCheck, Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../../lib/phone-hardware-engine';

export interface EnterpriseBirthdayStar {
  id: string;
  name: string;
  sport: 'SOCCER' | 'BASKETBALL' | 'TENNIS' | 'COMBAT' | 'MOTORSPORT' | 'ATHLETICS' | 'RUGBY' | 'GOLF' | 'CRICKET' | 'BASEBALL' | 'HOCKEY';
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
  marketValue?: string;
  socialHandles?: { instagram?: string; twitter?: string; facebook?: string; };
}

const GLOBAL_SPORT_STARS: EnterpriseBirthdayStar[] = [
  // AUGUST & THIS WEEK CELEBRATIONS
  {
    id: 'b-aug-28-1', name: 'Weston McKennie', sport: 'SOCCER', birthMonth: 8, birthDay: 28, birthYear: 1998,
    clubOrTeam: 'Juventus', league: 'Serie A', country: 'United States', countryCode: 'US', countryFlag: '🇺🇸',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/pvqhh01759225850.png',
    fallbackInitials: 'WM', biodataRole: 'Midfielder • USMNT & Juventus Star',
    quote: 'Energetic box-to-box dominance in the Serie A midfield.',
    trophies: ['2x Coppa Italia Winner', '2x CONCACAF Nations League Winner'],
    matchFootprint: 'Over 50 Caps for United States', wishesBase: 18400, marketValue: '€28,000,000',
    socialHandles: { instagram: 'westonmckennie', twitter: 'WMcKennie' }
  },
  {
    id: 'b-aug-28-2', name: 'César Azpilicueta', sport: 'SOCCER', birthMonth: 8, birthDay: 28, birthYear: 1989,
    clubOrTeam: 'Atlético Madrid', league: 'La Liga', country: 'Spain', countryCode: 'ES', countryFlag: '🇪🇸',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/i712061759225381.png',
    fallbackInitials: 'CA', biodataRole: 'Defender • Chelsea Captain Legend & UCL Winner',
    quote: 'Consistently reliable leadership and defensive resilience.',
    trophies: ['UEFA Champions League Winner', '2x Premier League Winner', 'UEFA Europa League Winner', 'FIFA Club World Cup Winner'],
    matchFootprint: 'Over 500 Appearances for Chelsea', wishesBase: 26300, marketValue: '€3,000,000',
    socialHandles: { instagram: 'cesarazpi', twitter: 'CesarAzpi' }
  },
  {
    id: 'b-aug-29-1', name: 'Vincent Enyeama', sport: 'SOCCER', birthMonth: 8, birthDay: 29, birthYear: 1982,
    clubOrTeam: 'Nigeria Super Eagles Icon', league: 'African Legends', country: 'Nigeria', countryCode: 'NG', countryFlag: '🇳🇬',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/thumb/snhzzq1702566147.jpg',
    fallbackInitials: 'VE', biodataRole: 'Goalkeeper • 2013 AFCON Champion & Lille Legend',
    quote: 'Legendary reflexes on the world stage for Super Eagles and Lille.',
    trophies: ['AFCON Champion (2013)', '2x CAF Champions League Winner', 'Lille UNFP Player of the Month'],
    matchFootprint: '101 Caps for Nigeria Super Eagles', wishesBase: 64200, marketValue: 'Legend',
    socialHandles: { instagram: 'vincentenyeama01', twitter: 'vincentenyeama' }
  },
  {
    id: 'b-aug-29-2', name: 'Celestine Babayaro', sport: 'SOCCER', birthMonth: 8, birthDay: 29, birthYear: 1978,
    clubOrTeam: 'Chelsea & Newcastle Legend', league: 'Premier League Legends', country: 'Nigeria', countryCode: 'NG', countryFlag: '🇳🇬',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/thumb/snhzzq1702566147.jpg',
    fallbackInitials: 'CB', biodataRole: 'Left Back • 1996 Olympic Gold Medalist & Chelsea Icon',
    quote: 'Trailblazing Nigerian defender in European football.',
    trophies: ['Olympic Gold Medalist (Atlanta 1996)', 'FA Cup Winner (Chelsea)', 'UEFA Cup Winners Cup'],
    matchFootprint: 'First African Player to Win FA Cup with Chelsea', wishesBase: 38100, marketValue: 'Legend',
    socialHandles: { instagram: 'celestinebabayaro' }
  },
  {
    id: 'b-aug-30-1', name: 'Pavel Nedvěd', sport: 'SOCCER', birthMonth: 8, birthDay: 30, birthYear: 1972,
    clubOrTeam: 'Juventus & Czech Legend', league: 'Serie A Legends', country: 'Czech Republic', countryCode: 'CZ', countryFlag: '🇨🇿',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/pvqhh01759225850.png',
    fallbackInitials: 'PN', biodataRole: 'Midfield Maestro • Ballon d\'Or Winner (2003)',
    quote: 'The Czech Fury with unstoppable long-range strikes.',
    trophies: ['Ballon d\'Or Winner (2003)', '3x Serie A Champion', 'UEFA Cup Winners Cup'],
    matchFootprint: 'Over 500 Career Appearances & 110 Goals', wishesBase: 49500, marketValue: 'Legend',
    socialHandles: { instagram: 'pavelnedvedofficial' }
  },
  {
    id: 'b-aug-30-2', name: 'Gabigol (Gabriel Barbosa)', sport: 'SOCCER', birthMonth: 8, birthDay: 30, birthYear: 1996,
    clubOrTeam: 'Flamengo', league: 'Brasileirão', country: 'Brazil', countryCode: 'BR', countryFlag: '🇧🇷',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/un3jr11769182465.png',
    fallbackInitials: 'GB', biodataRole: 'Striker • 2x Copa Libertadores Champion',
    quote: 'Clutch goalscorer in South American finals.',
    trophies: ['2x Copa Libertadores Winner', '2x Brasileirão Champion', 'Olympic Gold Medalist'],
    matchFootprint: 'Over 150 Goals for Flamengo', wishesBase: 31200, marketValue: '€14,000,000',
    socialHandles: { instagram: 'gabigol', twitter: 'gabigol' }
  },
  {
    id: 'b-sep-01-1', name: 'Ruud Gullit', sport: 'SOCCER', birthMonth: 9, birthDay: 1, birthYear: 1962,
    clubOrTeam: 'AC Milan & Netherlands Legend', league: 'European Legends', country: 'Netherlands', countryCode: 'NL', countryFlag: '🇳🇱',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/pvqhh01759225850.png',
    fallbackInitials: 'RG', biodataRole: 'Total Football Icon • Ballon d\'Or Winner (1987)',
    quote: 'Unstoppable physical grace and tactical genius.',
    trophies: ['Ballon d\'Or Winner (1987)', 'UEFA European Champion (1988)', '2x European Cup Winner'],
    matchFootprint: 'Captained Netherlands to Euro 1988 Glory', wishesBase: 58200, marketValue: 'Legend',
    socialHandles: { instagram: 'ruudgullit', twitter: 'GullitR' }
  },
  {
    id: 'b-sep-01-2', name: 'Daniel Sturridge', sport: 'SOCCER', birthMonth: 9, birthDay: 1, birthYear: 1989,
    clubOrTeam: 'Liverpool Legend', league: 'Premier League Legends', country: 'England', countryCode: 'GB', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/nryvhk1759225430.png',
    fallbackInitials: 'DS', biodataRole: 'Forward • 2x Champions League Winner',
    quote: 'Slick wriggly dance celebrations and lethal left-foot finishes.',
    trophies: ['2x UEFA Champions League Winner', 'FA Cup Winner', 'Premier League Runner Up (21 Goals)'],
    matchFootprint: '100+ Premier League Goals & SAS Partnership', wishesBase: 29400, marketValue: 'Legend',
    socialHandles: { instagram: 'danielsturridge', twitter: 'DSturridge' }
  },
  {
    id: 'b-sep-02-1', name: 'Emiliano Martínez', sport: 'SOCCER', birthMonth: 9, birthDay: 2, birthYear: 1992,
    clubOrTeam: 'Aston Villa', league: 'Premier League', country: 'Argentina', countryCode: 'AR', countryFlag: '🇦🇷',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/i712061759225381.png',
    fallbackInitials: 'EM', biodataRole: 'Goalkeeper • World Cup Winner & Yashin Trophy Winner',
    quote: 'Clutch penalty saves and fearless presence in high-stakes finals.',
    trophies: ['FIFA World Cup Winner (2022)', 'Golden Glove Winner', '2x Copa América Champion', 'Yashin Trophy Winner'],
    matchFootprint: 'Decisive World Cup Final Penalty Save', wishesBase: 47800, marketValue: '€28,000,000',
    socialHandles: { instagram: 'emi_martinez26', twitter: 'emimartinezz1' }
  },
  {
    id: 'b-sep-02-2', name: 'Alexandre Pato', sport: 'SOCCER', birthMonth: 9, birthDay: 2, birthYear: 1989,
    clubOrTeam: 'AC Milan Icon', league: 'Serie A Legends', country: 'Brazil', countryCode: 'BR', countryFlag: '🇧🇷',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/un3jr11769182465.png',
    fallbackInitials: 'AP', biodataRole: 'Forward • Golden Boy Winner & Serie A Champion',
    quote: 'Blistering speed and iconic 24-second goal vs Barcelona at Camp Nou.',
    trophies: ['Golden Boy Winner (2009)', 'Serie A Champion', 'FIFA Club World Cup Winner'],
    matchFootprint: '63 Goals for AC Milan', wishesBase: 36200, marketValue: 'Legend',
    socialHandles: { instagram: 'pato', twitter: 'pato' }
  },
  {
    id: 'b-sep-05-1', name: 'Bukayo Saka', sport: 'SOCCER', birthMonth: 9, birthDay: 5, birthYear: 2001,
    clubOrTeam: 'Arsenal', league: 'Premier League', country: 'England', countryCode: 'GB', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/nryvhk1759225430.png',
    fallbackInitials: 'BS', biodataRole: 'Winger • Arsenal Star & PFA Young Player of Year',
    quote: 'Starboy leading Arsenal\'s title charges with world-class skill.',
    trophies: ['FA Cup Winner', '2x FA Community Shield Winner', 'England Player of the Year'],
    matchFootprint: 'Over 60 Goals & 50 Assists for Arsenal', wishesBase: 58900, marketValue: '€140,000,000',
    socialHandles: { instagram: 'bukayosaka87', twitter: 'BukayoSaka87' }
  },
  {
    id: 'b-sep-08-1', name: 'Bruno Fernandes', sport: 'SOCCER', birthMonth: 9, birthDay: 8, birthYear: 1994,
    clubOrTeam: 'Manchester United', league: 'Premier League', country: 'Portugal', countryCode: 'PT', countryFlag: '🇵🇹',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/pvqhh01759225850.png',
    fallbackInitials: 'BF', biodataRole: 'Midfielder • Manchester United Captain',
    quote: 'Relentless chance creator and leader of the Red Devils.',
    trophies: ['FA Cup Winner', 'EFL Cup Winner', 'UEFA Nations League Winner'],
    matchFootprint: 'Over 80 Goals & 70 Assists for Man United', wishesBase: 49100, marketValue: '€65,000,000',
    socialHandles: { instagram: 'brunofernandes8', twitter: 'B_Fernandes8' }
  },
  {
    id: 'b-sep-09-1', name: 'Luka Modrić', sport: 'SOCCER', birthMonth: 9, birthDay: 9, birthYear: 1985,
    clubOrTeam: 'Real Madrid', league: 'La Liga', country: 'Croatia', countryCode: 'HR', countryFlag: '🇭🇷',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/nryvhk1759225430.png',
    fallbackInitials: 'LM', biodataRole: 'Midfielder • 6x UCL Winner & Ballon d\'Or (2018)',
    quote: 'Ageless trivela maestro controlling European football.',
    trophies: ['6x UEFA Champions League Winner', 'Ballon d\'Or Winner (2018)', '4x La Liga Champion', 'World Cup Golden Ball'],
    matchFootprint: 'Most Decorated Player in Real Madrid History (27 Trophies)', wishesBase: 61200, marketValue: '€6,000,000',
    socialHandles: { instagram: 'lukamodric10', twitter: 'lukamodric10' }
  },

  // SUPERSTARS & LEGENDS
  {
    id: 's3', name: 'Erling Haaland', sport: 'SOCCER', birthMonth: 7, birthDay: 21, birthYear: 2000,
    clubOrTeam: 'Manchester City', league: 'Premier League', country: 'Norway', countryCode: 'NO', countryFlag: '🇳🇴',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/un3jr11769182465.png',
    fallbackInitials: 'EH', biodataRole: 'Striker • European Golden Shoe Winner',
    quote: 'Always hungry for more goals in the sky blue shirt.',
    trophies: ['UEFA Champions League Winner', '2x Premier League Golden Boot', 'Premier League Record 36 Goals'],
    matchFootprint: '1.10 Goals per Game in UEFA Champions League', wishesBase: 74500, marketValue: '€180,000,000',
    socialHandles: { instagram: 'erling.haaland', twitter: 'ErlingHaaland' }
  },
  {
    id: 's4', name: 'Kylian Mbappé', sport: 'SOCCER', birthMonth: 12, birthDay: 20, birthYear: 1998,
    clubOrTeam: 'Real Madrid', league: 'La Liga', country: 'France', countryCode: 'FR', countryFlag: '🇫🇷',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/i712061759225381.png',
    fallbackInitials: 'KM', biodataRole: 'Forward • World Cup Champion & Golden Boot',
    quote: 'Electric pace and clinical finishing on the world stage.',
    trophies: ['FIFA World Cup Winner (2018)', 'World Cup Golden Boot', '6x Ligue 1 Top Scorer'],
    matchFootprint: 'Over 300 Career Professional Goals', wishesBase: 82100, marketValue: '€180,000,000',
    socialHandles: { instagram: 'k.mbappe', twitter: 'KMbappe' }
  },
  {
    id: 's5', name: 'Jude Bellingham', sport: 'SOCCER', birthMonth: 6, birthDay: 29, birthYear: 2003,
    clubOrTeam: 'Real Madrid', league: 'La Liga', country: 'England', countryCode: 'GB', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/nryvhk1759225430.png',
    fallbackInitials: 'JB', biodataRole: 'Attacking Midfielder • Golden Boy Winner',
    quote: 'Dominant midfield presence with clutch goalscoring instinct.',
    trophies: ['UEFA Champions League Winner', 'La Liga Champion', 'Kopa Trophy Winner'],
    matchFootprint: 'Decisive El Clásico & UCL Winner', wishesBase: 68900, marketValue: '€180,000,000',
    socialHandles: { instagram: 'judebellingham', twitter: 'BellinghamJude' }
  },
  {
    id: 's6', name: 'Victor Osimhen', sport: 'SOCCER', birthMonth: 12, birthDay: 29, birthYear: 1998,
    clubOrTeam: 'Galatasaray', league: 'Turkish Super Lig', country: 'Nigeria', countryCode: 'NG', countryFlag: '🇳🇬',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/thumb/snhzzq1702566147.jpg',
    fallbackInitials: 'VO', biodataRole: 'Striker • African Footballer of the Year',
    quote: 'Relentless fighting spirit leading the line with power and passion.',
    trophies: ['African Footballer of the Year (2023)', 'Serie A Champion (Capocannoniere)', 'FIFA U-17 World Cup Winner'],
    matchFootprint: 'First African Top Scorer in Serie A History', wishesBase: 91200, marketValue: '€75,000,000',
    socialHandles: { instagram: 'victorosimhen9', twitter: 'victorosimhen9' }
  },
  {
    id: 's7', name: 'Jay-Jay Okocha', sport: 'SOCCER', birthMonth: 8, birthDay: 14, birthYear: 1973,
    clubOrTeam: 'Nigeria Legends • Bolton Icon', league: 'Premier League Legends', country: 'Nigeria', countryCode: 'NG', countryFlag: '🇳🇬',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/thumb/snhzzq1702566147.jpg',
    fallbackInitials: 'JJ', biodataRole: 'Midfield Entertainer • Olympic Gold Medalist',
    quote: 'So good they named him twice — pure magic on the ball.',
    trophies: ['Olympic Gold Medalist (1996)', 'AFCON Winner (1994)', '2x BBC African Footballer of Year'],
    matchFootprint: 'Unmatched Dribbling Skill in Premier League & World Cup', wishesBase: 98400, marketValue: 'Legend',
    socialHandles: { instagram: 'official_jj10', twitter: 'IAmOkocha' }
  },
  {
    id: 's8', name: 'Nwankwo Kanu', sport: 'SOCCER', birthMonth: 8, birthDay: 1, birthYear: 1976,
    clubOrTeam: 'Arsenal Invincible Legend', league: 'Premier League Legends', country: 'Nigeria', countryCode: 'NG', countryFlag: '🇳🇬',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/thumb/snhzzq1702566147.jpg',
    fallbackInitials: 'NK', biodataRole: 'Forward • 2x African Footballer of the Year',
    quote: 'Sublime touch, Kanu hat-trick vs Chelsea, and Olympic hero.',
    trophies: ['UEFA Champions League Winner (Ajax)', 'Premier League Invincible (2003-04)', '2x African Footballer of Year'],
    matchFootprint: '15-minute Hat-trick vs Chelsea at Stamford Bridge', wishesBase: 86400, marketValue: 'Legend',
    socialHandles: { instagram: 'kanuheartfnd', twitter: 'papilo_kanu' }
  },
  {
    id: 's9', name: 'Cristiano Ronaldo', sport: 'SOCCER', birthMonth: 2, birthDay: 5, birthYear: 1985,
    clubOrTeam: 'Al Nassr', league: 'Saudi Pro League', country: 'Portugal', countryCode: 'PT', countryFlag: '🇵🇹',
    avatarUrl: 'https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/2273.png&w=350&h=254',
    fallbackInitials: 'CR7', biodataRole: 'Forward • 5x Ballon d\'Or & 5x UCL Winner',
    quote: 'Siuuu! Hard work beats talent every single time.',
    trophies: ['5x Ballon d\'Or Winner', '5x UEFA Champions League Winner', 'UEFA Euro Champion', '900+ Career Goals'],
    matchFootprint: 'All-Time Leading International Scorer in History', wishesBase: 185000, marketValue: '€15,000,000',
    socialHandles: { instagram: 'cristiano', twitter: 'Cristiano' }
  },
  {
    id: 's10', name: 'Lionel Messi', sport: 'SOCCER', birthMonth: 6, birthDay: 24, birthYear: 1987,
    clubOrTeam: 'Inter Miami', league: 'MLS', country: 'Argentina', countryCode: 'AR', countryFlag: '🇦🇷',
    avatarUrl: 'https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/45843.png&w=350&h=254',
    fallbackInitials: 'LM10', biodataRole: 'Forward • World Cup Champion & 8x Ballon d\'Or',
    quote: 'Pure footballing magic from Rosario to the world.',
    trophies: ['FIFA World Cup Winner (2022)', '8x Ballon d\'Or Winner', '4x UEFA Champions League Winner', '2x Copa América Winner'],
    matchFootprint: 'Most Decorated Footballer in History (46 Trophies)', wishesBase: 192000, marketValue: '€30,000,000',
    socialHandles: { instagram: 'leomessi' }
  },
  {
    id: 's11', name: 'LeBron James', sport: 'BASKETBALL', birthMonth: 12, birthDay: 30, birthYear: 1984,
    clubOrTeam: 'LA Lakers', league: 'NBA Basketball', country: 'United States', countryCode: 'US', countryFlag: '🇺🇸',
    avatarUrl: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/1966.png&w=350&h=254',
    fallbackInitials: 'LBJ', biodataRole: 'Forward • NBA All-Time Leading Scorer',
    quote: 'Strive for greatness every single day.',
    trophies: ['4x NBA Champion', '4x NBA Finals MVP', '4x NBA MVP', 'NBA All-Time Scoring Leader'],
    matchFootprint: 'Over 40,000 Career Points in NBA', wishesBase: 142000, marketValue: '$50,000,000',
    socialHandles: { instagram: 'kingjames', twitter: 'KingJames' }
  },
  {
    id: 's12', name: 'Lewis Hamilton', sport: 'MOTORSPORT', birthMonth: 1, birthDay: 7, birthYear: 1985,
    clubOrTeam: 'Ferrari', league: 'Formula 1', country: 'United Kingdom', countryCode: 'GB', countryFlag: '🇬🇧',
    avatarUrl: 'https://a.espncdn.com/combiner/i?img=/i/headshots/f1/players/full/868.png&w=350&h=254',
    fallbackInitials: 'LH', biodataRole: 'Driver • 7x Formula 1 World Champion',
    quote: 'Still I Rise.',
    trophies: ['7x F1 World Champion', '103 Race Wins', '104 Pole Positions'],
    matchFootprint: 'Most F1 Race Wins & Pole Positions in History', wishesBase: 98000, marketValue: '$55,000,000',
    socialHandles: { instagram: 'lewishamilton', twitter: 'LewisHamilton' }
  },
  {
    id: 's13', name: 'Novak Djokovic', sport: 'TENNIS', birthMonth: 5, birthDay: 22, birthYear: 1987,
    clubOrTeam: 'ATP Tour', league: 'Grand Slam Tennis', country: 'Serbia', countryCode: 'RS', countryFlag: '🇷🇸',
    avatarUrl: 'https://a.espncdn.com/combiner/i?img=/i/headshots/tennis/players/full/296.png&w=350&h=254',
    fallbackInitials: 'ND', biodataRole: 'Tennis Icon • 24x Grand Slam Champion',
    quote: 'Mental toughness and relentless pursuit of perfection.',
    trophies: ['24x Grand Slam Singles Champion', 'Olympic Gold Medalist (2024)', '40x ATP Masters 1000'],
    matchFootprint: 'Most Grand Slam Men\'s Singles Titles in History', wishesBase: 84000, marketValue: 'GOAT',
    socialHandles: { instagram: 'djokernole', twitter: 'DjokerNole' }
  },
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function BirthdaysHubPage() {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedSport, setSelectedSport] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'TODAY' | 'THIS_WEEK' | 'MONTH' | 'ALL'>('TODAY');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProfile, setActiveProfile] = useState<EnterpriseBirthdayStar | null>(null);
  const [wikiExtract, setWikiExtract] = useState<string | null>(null);

  // Custom Wish Modal State
  const [showWishModal, setShowWishModal] = useState(false);
  const [wishStar, setWishStar] = useState<EnterpriseBirthdayStar | null>(null);
  const [userWishText, setUserWishText] = useState('');
  const [userNickName, setUserNickName] = useState('');
  const [viewerPhoto, setViewerPhoto] = useState<string | null>(null);
  const [downloadingImage, setDownloadingImage] = useState(false);

  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();

  // Find stars celebrating TODAY (Zero contradiction)
  const todayStars = useMemo(() => {
    return GLOBAL_SPORT_STARS.filter((star) => star.birthMonth === todayMonth && star.birthDay === todayDay);
  }, [todayMonth, todayDay]);

  // Find stars celebrating this week
  const thisWeekStars = useMemo(() => {
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

    return GLOBAL_SPORT_STARS.filter((star) => {
      const starDate = new Date(2026, star.birthMonth - 1, star.birthDay);
      return starDate >= startOfWeek && starDate <= endOfWeek;
    });
  }, []);

  const filteredStars = useMemo(() => {
    return GLOBAL_SPORT_STARS.filter((star) => {
      if (activeTab === 'TODAY') {
        const isToday = star.birthMonth === todayMonth && star.birthDay === todayDay;
        if (!isToday) return false;
      } else if (activeTab === 'THIS_WEEK') {
        const isThisWeek = thisWeekStars.some((s) => s.id === star.id);
        if (!isThisWeek) return false;
      } else if (activeTab === 'MONTH') {
        if (star.birthMonth !== selectedMonth) return false;
      }

      if (selectedSport !== 'ALL' && star.sport !== selectedSport) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          star.name.toLowerCase().includes(q) ||
          star.clubOrTeam.toLowerCase().includes(q) ||
          star.country.toLowerCase().includes(q) ||
          star.league.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [selectedMonth, selectedSport, activeTab, searchQuery, thisWeekStars, todayMonth, todayDay]);

  // Fetch verified Wikipedia dossier on profile opening
  useEffect(() => {
    if (!activeProfile) {
      setWikiExtract(null);
      return;
    }
    const fetchWiki = async () => {
      try {
        const title = activeProfile.name.replace(/ /g, '_');
        const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.extract) {
            setWikiExtract(data.extract);
          }
        }
      } catch {}
    };
    fetchWiki();
  }, [activeProfile]);

  const handleOpenWishCard = (star: EnterpriseBirthdayStar, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try { phoneHardware.triggerHaptic('SELECTION'); } catch {}
    setWishStar(star);
    setUserWishText(`Happy Birthday ${star.name}! Keep shining and making history! 👑🔥`);
    setShowWishModal(true);
  };

  const handleShareWish = (platform: 'whatsapp' | 'telegram' | 'twitter' | 'instagram') => {
    if (!wishStar) return;
    try { phoneHardware.triggerHaptic('AFRO_BEAT'); } catch {}
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });

    const wishMessage = `🎂 BIRTHDAY WISH FOR ${wishStar.name.toUpperCase()}!\n\n"${userWishText}"\n- From ${userNickName || 'Mivaj Sports Fan'}\n\nJoin the celebration on Mivaj Sports: https://mivaj.com/birthdays`;

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(wishMessage)}`, '_blank');
    } else if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent('https://mivaj.com/birthdays')}&text=${encodeURIComponent(wishMessage)}`, '_blank');
    } else if (platform === 'twitter') {
      const handle = wishStar.socialHandles?.twitter ? `@${wishStar.socialHandles.twitter}` : wishStar.name;
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Happy Birthday ${handle}! 🎉 ${userWishText} https://mivaj.com/birthdays`)}`, '_blank');
    } else if (platform === 'instagram') {
      if (wishStar.socialHandles?.instagram) {
        window.open(`https://instagram.com/${wishStar.socialHandles.instagram}`, '_blank');
      } else {
        navigator.clipboard.writeText(wishMessage);
        alert('Wish copied to clipboard! Open Instagram to share.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-void text-white font-mono p-4 sm:p-8 space-y-6 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link
            href="/"
            className="px-3.5 py-2 rounded-xl bg-panel hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 hover:text-white flex items-center space-x-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Match Center 🏟️</span>
          </Link>

          <div className="flex items-center space-x-2">
            <span className="text-stadiumGreen font-black text-sm">MIVAJ SPORTS</span>
            <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-400 text-[9px] font-black border border-pink-500/30">
              WORLD BIRTHDAY HUB 🎂
            </span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="glass-panel-premium rounded-3xl p-6 sm:p-8 border border-pink-500/40 space-y-3 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center space-x-2">
                <span>WORLD SPORTS STAR BIRTHDAYS</span>
                <span>🎂⭐</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 font-sans">
                Complete database of birthdays, trophy dossiers, career statistics, and social wish cards for iconic global athletes across all sports.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/60 border border-pink-500/30 text-center min-w-[200px]">
              <span className="text-[10px] text-gray-400 font-bold block uppercase">THIS WEEK'S CELEBRATIONS</span>
              <span className="text-2xl font-black text-pink-400">{thisWeekStars.length} Athletes</span>
              <span className="text-[10px] text-stadiumGreen font-bold block">Send Wish Card 💌</span>
            </div>
          </div>
        </div>

        {/* CONTROLS & FILTER TABS */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            {/* View Mode Tabs */}
            <div className="flex items-center space-x-2 bg-panel p-1.5 rounded-2xl border border-white/10">
              <button
                onClick={() => setActiveTab('TODAY')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
                  activeTab === 'TODAY' ? 'bg-pink-500 text-black shadow-md shadow-pink-500/30 ring-1 ring-pink-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>🎂 Today ({todayStars.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('THIS_WEEK')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
                  activeTab === 'THIS_WEEK' ? 'bg-stadiumGreen text-black shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Flame className="w-4 h-4 inline" />
                <span>This Week ({thisWeekStars.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('MONTH')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
                  activeTab === 'MONTH' ? 'bg-stadiumGreen text-black shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Calendar className="w-4 h-4 inline" />
                <span>By Month</span>
              </button>
              <button
                onClick={() => setActiveTab('ALL')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
                  activeTab === 'ALL' ? 'bg-gold text-black shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Globe className="w-4 h-4 inline" />
                <span>All Stars ({GLOBAL_SPORT_STARS.length})</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search athlete, club, or country..."
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-panel border border-white/10 text-xs text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Month Selector Carousel (if Month tab active) */}
          {activeTab === 'MONTH' && (
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
              {MONTH_NAMES.map((monthName, idx) => {
                const monthNum = idx + 1;
                const isSelected = selectedMonth === monthNum;
                return (
                  <button
                    key={monthName}
                    onClick={() => setSelectedMonth(monthNum)}
                    className={`px-4 py-2 rounded-2xl text-xs font-black transition-all whitespace-nowrap border ${
                      isSelected
                        ? 'bg-stadiumGreen text-black border-stadiumGreen shadow-lg'
                        : 'bg-black/60 text-gray-400 border-white/10 hover:text-white'
                    }`}
                  >
                    {monthName}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ATHLETES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStars.map((star) => {
            const isToday = star.birthMonth === todayMonth && star.birthDay === todayDay;

            return (
              <div
                key={star.id}
                onClick={() => setActiveProfile(star)}
                className="rounded-3xl bg-panel/80 border border-white/10 overflow-hidden hover:border-pink-500/60 transition-all duration-300 group cursor-pointer flex flex-col justify-between shadow-xl relative"
              >
                {/* Top Banner Accent */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{star.countryFlag}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">{star.country}</span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                      isToday ? 'bg-pink-500 text-black border-pink-400 animate-pulse' : 'bg-black/60 text-gold border-gold/30'
                    }`}>
                      {isToday ? '🎉 TODAY!' : `${MONTH_NAMES[star.birthMonth - 1].slice(0, 3)} ${star.birthDay}`}
                    </span>
                  </div>

                  {/* Photo & Profile Intro */}
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 overflow-hidden p-1 flex-shrink-0 group-hover:border-pink-500 transition-colors shadow-md">
                      <img
                        src={star.avatarUrl}
                        alt={star.name}
                        className="w-full h-full object-cover rounded-xl"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://r2.thesportsdb.com/images/media/player/cutout/pvqhh01759225850.png'; }}
                      />
                    </div>

                    <div className="space-y-1 min-w-0">
                      <h3 className="text-sm font-black text-white group-hover:text-pink-400 transition-colors truncate">
                        {star.name}
                      </h3>
                      <span className="text-[10px] text-stadiumGreen font-bold block truncate">
                        {star.clubOrTeam} &bull; {star.league}
                      </span>
                      <span className="text-[9px] text-gray-400 block font-sans truncate">
                        {star.biodataRole}
                      </span>
                    </div>
                  </div>

                  {/* Quote */}
                  <p className="text-[10px] text-gray-300 font-sans italic bg-black/40 p-2.5 rounded-xl border border-white/5 line-clamp-2">
                    "{star.quote}"
                  </p>
                </div>

                {/* Card Footer */}
                <div className="px-4 py-3 bg-black/60 border-t border-white/5 flex items-center justify-between text-[10px]">
                  <span className="text-gold font-bold flex items-center space-x-1">
                    <Trophy className="w-3.5 h-3.5 inline text-gold" />
                    <span>{star.trophies[0] || 'Top Athlete'}</span>
                  </span>

                  <button
                    onClick={(e) => handleOpenWishCard(star, e)}
                    className="px-3 py-1.5 rounded-xl bg-pink-500/20 border border-pink-500/40 text-pink-400 hover:bg-pink-500 hover:text-black font-black transition-all flex items-center space-x-1"
                  >
                    <span>Send Wish 💌</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* FULL PLAYER PROFILE DOSSIER MODAL */}
        {activeProfile && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md overflow-y-auto animate-fadeIn flex flex-col p-4">
            <div className="max-w-2xl mx-auto w-full glass-panel-premium rounded-3xl p-6 border border-pink-500/40 space-y-5 my-auto shadow-2xl relative">
              <button
                onClick={() => setActiveProfile(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-2xl bg-black border-2 border-pink-500 p-1 flex-shrink-0 shadow-xl">
                  <img src={activeProfile.avatarUrl} alt={activeProfile.name} className="w-full h-full object-cover rounded-xl" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{activeProfile.countryFlag}</span>
                    <h2 className="text-xl font-black text-white">{activeProfile.name}</h2>
                  </div>
                  <span className="text-xs font-bold text-stadiumGreen block">{activeProfile.clubOrTeam} &bull; {activeProfile.league}</span>
                  <span className="text-[11px] text-gray-300 block font-sans">{activeProfile.biodataRole}</span>
                </div>
              </div>

              {/* Bio Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-2xl bg-black/60 border border-white/10">
                  <span className="text-[10px] text-gray-400 block font-bold">DATE OF BIRTH</span>
                  <span className="font-bold text-white">{MONTH_NAMES[activeProfile.birthMonth - 1]} {activeProfile.birthDay}, {activeProfile.birthYear}</span>
                </div>
                <div className="p-3 rounded-2xl bg-black/60 border border-white/10">
                  <span className="text-[10px] text-gray-400 block font-bold">MARKET VALUE</span>
                  <span className="font-bold text-gold">{activeProfile.marketValue || 'Elite'}</span>
                </div>
                <div className="p-3 rounded-2xl bg-black/60 border border-white/10">
                  <span className="text-[10px] text-gray-400 block font-bold">FOOTPRINT</span>
                  <span className="font-bold text-stadiumGreen">{activeProfile.matchFootprint}</span>
                </div>
              </div>

              {/* Trophy Cabinet */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-xs font-black text-gold uppercase block flex items-center space-x-1">
                  <Trophy className="w-4 h-4 text-gold inline" />
                  <span>OFFICIAL TROPHY & HONORS CABINET</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeProfile.trophies.map((t, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl bg-gold/15 text-gold border border-gold/30 text-xs font-bold">
                      🏆 {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Verified Wikipedia Dossier */}
              {wikiExtract && (
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] font-black text-stadiumGreen uppercase tracking-wider block flex items-center space-x-1">
                    <span>🌐 VERIFIED WIKIPEDIA CAREER DOSSIER</span>
                  </span>
                  <p className="text-xs text-gray-300 font-sans leading-relaxed max-h-32 overflow-y-auto">
                    {wikiExtract}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <button
                  onClick={() => {
                    const star = activeProfile;
                    setActiveProfile(null);
                    handleOpenWishCard(star);
                  }}
                  className="w-full py-3 rounded-2xl bg-pink-500 text-black font-black text-xs hover:bg-pink-400 transition-all text-center shadow-lg"
                >
                  Create Custom Birthday Wish Card 💌
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOM WISH CARD GENERATOR MODAL */}
        {showWishModal && wishStar && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md overflow-y-auto animate-fadeIn flex flex-col p-4">
            <div className="max-w-xl mx-auto w-full glass-panel-premium rounded-3xl p-6 border border-pink-500/40 space-y-5 my-auto shadow-2xl relative">
              <button
                onClick={() => {
                  setShowWishModal(false);
                  setViewerPhoto(null);
                }}
                className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-1">
                <span className="text-xs font-black text-pink-400 uppercase tracking-widest block">CELEBRATION WISH CARD</span>
                <h3 className="text-xl font-black text-white">Send Birthday Wish to {wishStar.name}</h3>
              </div>

              {/* Side-by-Side Athlete Star & Viewer Photo Attachment */}
              <div className="flex items-center justify-center space-x-6 p-4 rounded-2xl bg-black/60 border border-white/10">
                {/* Athlete Star Photo */}
                <div className="text-center space-y-1">
                  <div className="w-20 h-20 rounded-full border-2 border-gold p-1 relative mx-auto shadow-lg bg-black">
                    <img src={wishStar.avatarUrl} alt={wishStar.name} className="w-full h-full object-cover rounded-full" />
                    <span className="absolute -bottom-1 -right-1 text-xs">⭐</span>
                  </div>
                  <span className="text-[11px] font-black text-gold block truncate max-w-[100px]">{wishStar.name}</span>
                  <span className="text-[9px] text-gray-400 font-bold block">Birthday Star</span>
                </div>

                <span className="text-2xl text-pink-500 font-black animate-pulse">🤝</span>

                {/* Viewer Attached Photo */}
                <div className="text-center space-y-1">
                  <div className="w-20 h-20 rounded-full border-2 border-stadiumGreen p-1 relative mx-auto shadow-lg bg-black flex items-center justify-center overflow-hidden">
                    {viewerPhoto ? (
                      <img src={viewerPhoto} alt="Viewer" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                        <span className="text-lg">📷</span>
                        <span className="text-[8px] text-stadiumGreen font-bold mt-0.5">Attach</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setViewerPhoto(URL.createObjectURL(file));
                              try { phoneHardware.triggerHaptic('SUCCESS'); } catch {}
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <span className="text-[11px] font-black text-stadiumGreen block truncate max-w-[100px]">
                    {userNickName || 'You (Fan)'}
                  </span>
                  {viewerPhoto && (
                    <button
                      onClick={() => setViewerPhoto(null)}
                      className="text-[9px] text-crimson hover:underline font-bold block mx-auto"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Your Name / Handle:</label>
                  <input
                    type="text"
                    value={userNickName}
                    onChange={(e) => setUserNickName(e.target.value)}
                    placeholder="e.g. CyberStriker_99"
                    className="w-full p-2.5 rounded-xl bg-black border border-white/15 text-xs text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-1">Wish Message:</label>
                  <textarea
                    rows={3}
                    value={userWishText}
                    onChange={(e) => setUserWishText(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-black border border-white/15 text-xs text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              {/* Generate & Download Shareable Card Button */}
              <button
                onClick={async () => {
                  if (!wishStar) return;
                  setDownloadingImage(true);
                  try {
                    const canvas = document.createElement('canvas');
                    canvas.width = 800;
                    canvas.height = 600;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return;

                    // Dark gradient background
                    const grad = ctx.createLinearGradient(0, 0, 800, 600);
                    grad.addColorStop(0, '#07090e');
                    grad.addColorStop(0.5, '#0f172a');
                    grad.addColorStop(1, '#05070a');
                    ctx.fillStyle = grad;
                    ctx.fillRect(0, 0, 800, 600);

                    // Perimeter gold border
                    ctx.strokeStyle = '#f59e0b';
                    ctx.lineWidth = 4;
                    ctx.strokeRect(20, 20, 760, 560);

                    // Header
                    ctx.fillStyle = '#ec4899';
                    ctx.font = 'bold 20px monospace';
                    ctx.textAlign = 'center';
                    ctx.fillText('👑 OFFICIAL ATHLETE BIRTHDAY CELEBRATION 🎂', 400, 70);

                    // Star title
                    ctx.fillStyle = '#ffffff';
                    ctx.font = '900 30px sans-serif';
                    ctx.fillText(wishStar.name, 400, 115);

                    ctx.fillStyle = '#f59e0b';
                    ctx.font = 'bold 16px sans-serif';
                    ctx.fillText(`${wishStar.clubOrTeam} • ${wishStar.country}`, 400, 145);

                    // Draw Star Photo
                    const starImg = new Image();
                    starImg.crossOrigin = 'anonymous';
                    await new Promise((res) => {
                      starImg.onload = res;
                      starImg.onerror = res;
                      starImg.src = wishStar.avatarUrl;
                    });

                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(280, 235, 70, 0, Math.PI * 2);
                    ctx.closePath();
                    ctx.clip();
                    try { ctx.drawImage(starImg, 210, 165, 140, 140); } catch {}
                    ctx.restore();

                    ctx.strokeStyle = '#f59e0b';
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    ctx.arc(280, 235, 70, 0, Math.PI * 2);
                    ctx.stroke();

                    // Draw Viewer Photo (if attached)
                    if (viewerPhoto) {
                      const viewerImg = new Image();
                      viewerImg.crossOrigin = 'anonymous';
                      await new Promise((res) => {
                        viewerImg.onload = res;
                        viewerImg.onerror = res;
                        viewerImg.src = viewerPhoto;
                      });

                      ctx.save();
                      ctx.beginPath();
                      ctx.arc(520, 235, 70, 0, Math.PI * 2);
                      ctx.closePath();
                      ctx.clip();
                      try { ctx.drawImage(viewerImg, 450, 165, 140, 140); } catch {}
                      ctx.restore();

                      ctx.strokeStyle = '#10b981';
                      ctx.lineWidth = 4;
                      ctx.beginPath();
                      ctx.arc(520, 235, 70, 0, Math.PI * 2);
                      ctx.stroke();
                    } else {
                      ctx.fillStyle = '#10b98122';
                      ctx.beginPath();
                      ctx.arc(520, 235, 70, 0, Math.PI * 2);
                      ctx.fill();
                      ctx.strokeStyle = '#10b981';
                      ctx.lineWidth = 3;
                      ctx.stroke();
                      ctx.fillStyle = '#10b981';
                      ctx.font = 'bold 36px sans-serif';
                      ctx.fillText('⚽', 520, 248);
                    }

                    // Photo captions
                    ctx.fillStyle = '#f59e0b';
                    ctx.font = 'bold 14px monospace';
                    ctx.fillText(wishStar.name, 280, 330);

                    ctx.fillStyle = '#10b981';
                    ctx.fillText(userNickName || 'Mivaj Fan', 520, 330);

                    // Wish Message Box
                    ctx.fillStyle = '#ffffff10';
                    ctx.fillRect(70, 360, 660, 130);
                    ctx.strokeStyle = '#ffffff20';
                    ctx.strokeRect(70, 360, 660, 130);

                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'italic 17px sans-serif';
                    const words = userWishText.split(' ');
                    let line = '';
                    let y = 400;
                    for (let n = 0; n < words.length; n++) {
                      const testLine = line + words[n] + ' ';
                      const metrics = ctx.measureText(testLine);
                      if (metrics.width > 620 && n > 0) {
                        ctx.fillText(line, 400, y);
                        line = words[n] + ' ';
                        y += 26;
                      } else {
                        line = testLine;
                      }
                    }
                    ctx.fillText(line, 400, y);

                    // Footer
                    ctx.fillStyle = '#10b981';
                    ctx.font = 'bold 14px monospace';
                    ctx.fillText('mivaj.com • Verified Athlete Birthday Archive', 400, 535);

                    // Trigger browser PNG download
                    const dataUrl = canvas.toDataURL('image/png');
                    const a = document.createElement('a');
                    a.href = dataUrl;
                    a.download = `${wishStar.name.toLowerCase().replace(/ /g, '_')}_birthday_card.png`;
                    a.click();
                    try { phoneHardware.triggerHaptic('AFRO_BEAT'); } catch {}
                    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
                  } catch (err) {
                    console.error(err);
                  } finally {
                    setDownloadingImage(false);
                  }
                }}
                disabled={downloadingImage}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-black font-black text-xs hover:opacity-95 transition-all flex items-center justify-center space-x-2 shadow-xl"
              >
                <span>{downloadingImage ? 'Generating Graphic...' : '📥 Download Shareable Celebration Card (PNG)'}</span>
              </button>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <button
                  onClick={() => handleShareWish('whatsapp')}
                  className="py-2.5 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center space-x-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={() => handleShareWish('telegram')}
                  className="py-2.5 rounded-xl bg-sky-500 text-white font-black text-xs flex items-center justify-center space-x-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Telegram</span>
                </button>
                <button
                  onClick={() => handleShareWish('twitter')}
                  className="py-2.5 rounded-xl bg-blue-400 text-black font-black text-xs flex items-center justify-center space-x-1"
                >
                  <Twitter className="w-3.5 h-3.5" />
                  <span>X / Twitter</span>
                </button>
                <button
                  onClick={() => handleShareWish('instagram')}
                  className="py-2.5 rounded-xl bg-pink-600 text-white font-black text-xs flex items-center justify-center space-x-1"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Instagram</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
