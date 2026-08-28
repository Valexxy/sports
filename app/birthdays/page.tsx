'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Sparkles, Trophy, Heart, Search, Share2,
  RefreshCw, Star, Camera, Send, X, Upload, Download,
  Instagram, Twitter, Facebook, MessageCircle, Copy, Check,
  Calendar, ChevronLeft, ChevronRight, Globe, Filter
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
  socialHandles?: { instagram?: string; twitter?: string; facebook?: string; }
}

const GLOBAL_SPORT_STARS: EnterpriseBirthdayStar[] = [
  // SOCCER
  {
    id: 's1', name: 'James Harden', sport: 'BASKETBALL', birthMonth: 8, birthDay: 26, birthYear: 1989,
    clubOrTeam: 'LA Clippers', league: 'NBA Basketball', country: 'United States', countryCode: 'US', countryFlag: '🇺🇸',
    avatarUrl: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/3992.png&w=350&h=254',
    fallbackInitials: 'JH', biodataRole: 'Point Guard • NBA MVP & 10x All-Star',
    quote: 'Step-back mastery and relentless offensive leadership.',
    trophies: ['NBA Most Valuable Player', '3x NBA Scoring Champion', 'Olympic Gold Medal'],
    matchFootprint: '25,000+ Career Points in NBA', wishesBase: 19820,
    socialHandles: { instagram: 'jharden13', twitter: 'JHarden13' }
  },
  {
    id: 's2', name: 'Teun Koopmeiners', sport: 'SOCCER', birthMonth: 8, birthDay: 26, birthYear: 1998,
    clubOrTeam: 'Juventus', league: 'Serie A', country: 'Netherlands', countryCode: 'NL', countryFlag: '🇳🇱',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/pvqhh01759225850.png',
    fallbackInitials: 'TK', biodataRole: 'Midfield Playmaker • Serie A Dynamo',
    quote: 'Dominating the midfield engine room in the Bianconeri jersey.',
    trophies: ['UEFA Europa League Winner', 'KNVB Cup Winner', 'Serie A Midfielder of the Season'],
    matchFootprint: 'Over 65 Career Goals from Midfield', wishesBase: 12400,
    socialHandles: { instagram: 'teunkoopmeiners8', twitter: 'teunkoopmeiners' }
  },
  {
    id: 's3', name: 'Erling Haaland', sport: 'SOCCER', birthMonth: 7, birthDay: 21, birthYear: 2000,
    clubOrTeam: 'Manchester City', league: 'Premier League', country: 'Norway', countryCode: 'NO', countryFlag: '🇳🇴',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/un3jr11769182465.png',
    fallbackInitials: 'EH', biodataRole: 'Striker • European Golden Shoe Winner',
    quote: 'Always hungry for more goals in the sky blue shirt.',
    trophies: ['UEFA Champions League Winner', '2x Premier League Golden Boot', 'Premier League Record 36 Goals'],
    matchFootprint: '1.10 Goals per Game in UEFA Champions League', wishesBase: 34500,
    socialHandles: { instagram: 'erling.haaland', twitter: 'ErlingHaaland' }
  },
  {
    id: 's4', name: 'Kylian Mbappé', sport: 'SOCCER', birthMonth: 12, birthDay: 20, birthYear: 1998,
    clubOrTeam: 'Real Madrid', league: 'La Liga', country: 'France', countryCode: 'FR', countryFlag: '🇫🇷',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/i712061759225381.png',
    fallbackInitials: 'KM', biodataRole: 'Forward • World Cup Champion & Golden Boot',
    quote: 'Electric pace and clinical finishing on the world stage.',
    trophies: ['FIFA World Cup Winner (2018)', 'World Cup Golden Boot', '6x Ligue 1 Top Scorer'],
    matchFootprint: 'Over 300 Career Professional Goals', wishesBase: 42100,
    socialHandles: { instagram: 'k.mbappe', twitter: 'KMbappe' }
  },
  {
    id: 's5', name: 'Jude Bellingham', sport: 'SOCCER', birthMonth: 6, birthDay: 29, birthYear: 2003,
    clubOrTeam: 'Real Madrid', league: 'La Liga', country: 'England', countryCode: 'GB', countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/nryvhk1759225430.png',
    fallbackInitials: 'JB', biodataRole: 'Attacking Midfielder • Golden Boy Winner',
    quote: 'Aura in midfield with clutch goalscoring instinct.',
    trophies: ['UEFA Champions League Winner', 'La Liga Champion', 'Kopa Trophy Winner'],
    matchFootprint: 'Decisive El Clásico & UCL Winner', wishesBase: 28900,
    socialHandles: { instagram: 'judebellingham', twitter: 'BellinghamJude' }
  },
  {
    id: 's6', name: 'Victor Osimhen', sport: 'SOCCER', birthMonth: 12, birthDay: 29, birthYear: 1998,
    clubOrTeam: 'Galatasaray', league: 'Turkish Super Lig', country: 'Nigeria', countryCode: 'NG', countryFlag: '🇳🇬',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/thumb/snhzzq1702566147.jpg',
    fallbackInitials: 'VO', biodataRole: 'Striker • African Footballer of the Year',
    quote: 'Relentless fighting spirit leading the line with power and passion.',
    trophies: ['African Footballer of the Year (2023)', 'Serie A Champion (Capocannoniere)', 'FIFA U-17 World Cup Winner'],
    matchFootprint: 'First African Top Scorer in Serie A History', wishesBase: 51200,
    socialHandles: { instagram: 'victorosimhen9', twitter: 'victorosimhen9' }
  },
  {
    id: 's7', name: 'Jay-Jay Okocha', sport: 'SOCCER', birthMonth: 8, birthDay: 14, birthYear: 1973,
    clubOrTeam: 'Nigeria Legends • Bolton Icon', league: 'Premier League Legends', country: 'Nigeria', countryCode: 'NG', countryFlag: '🇳🇬',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Jay-Jay_Okocha_2018.jpg/440px-Jay-Jay_Okocha_2018.jpg',
    fallbackInitials: 'JO', biodataRole: 'Playmaker • Olympic Gold & AFCON Champion',
    quote: 'So good they named him twice — magical flair and unmatched dribbling mastery.',
    trophies: ['Olympic Gold Medalist (1996)', 'Africa Cup of Nations Winner (1994)', 'BBC African Footballer of the Year (2x)'],
    matchFootprint: 'All-Time Legendary African Number 10', wishesBase: 68400,
    socialHandles: { instagram: 'jayjayokocha10', twitter: 'JayJayOkocha' }
  },
  // BASKETBALL
  {
    id: 's8', name: 'Michael Jordan', sport: 'BASKETBALL', birthMonth: 2, birthDay: 17, birthYear: 1963,
    clubOrTeam: 'Chicago Bulls Legends', league: 'NBA Legends', country: 'United States', countryCode: 'US', countryFlag: '🇺🇸',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Michael_Jordan_in_2014.jpg/440px-Michael_Jordan_in_2014.jpg',
    fallbackInitials: 'MJ', biodataRole: 'Shooting Guard • 6x NBA Champion & Finals MVP',
    quote: "I can accept failure, everyone fails at something. But I can't accept not trying.",
    trophies: ['6x NBA Champion', '6x NBA Finals MVP', '5x NBA Season MVP', '10x Scoring Champion'],
    matchFootprint: '30.1 PPG All-Time NBA Scoring Average', wishesBase: 89500,
    socialHandles: { instagram: 'jumpman23', twitter: 'Jumpman23' }
  },
  {
    id: 's9', name: 'LeBron James', sport: 'BASKETBALL', birthMonth: 12, birthDay: 30, birthYear: 1984,
    clubOrTeam: 'Los Angeles Lakers', league: 'NBA Basketball', country: 'United States', countryCode: 'US', countryFlag: '🇺🇸',
    avatarUrl: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/1966.png&w=350&h=254',
    fallbackInitials: 'LJ', biodataRole: 'Forward • 4x NBA Champion & All-Time Leading Scorer',
    quote: 'First-class work, first-class results. Nothing but excellence.',
    trophies: ['4x NBA Champion', '4x NBA Finals MVP', '4x NBA MVP', 'NBA All-Time Points Record'],
    matchFootprint: '40,000+ Career NBA Points – All-Time Record', wishesBase: 95000,
    socialHandles: { instagram: 'kingjames', twitter: 'KingJames' }
  },
  // MOTORSPORT
  {
    id: 's10', name: 'Lewis Hamilton', sport: 'MOTORSPORT', birthMonth: 1, birthDay: 7, birthYear: 1985,
    clubOrTeam: 'Scuderia Ferrari / Mercedes', league: 'Formula 1', country: 'United Kingdom', countryCode: 'GB', countryFlag: '🇬🇧',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Lewis_Hamilton_2022_F1_Austria.jpg/440px-Lewis_Hamilton_2022_F1_Austria.jpg',
    fallbackInitials: 'LH', biodataRole: 'Formula 1 Driver • 7x World Drivers Champion',
    quote: 'Still we rise. Driven by purpose and relentless perfection on the track.',
    trophies: ['7x FIA Formula One World Champion', '105+ F1 Grand Prix Race Wins', '104+ F1 Pole Positions'],
    matchFootprint: 'Most Race Wins in Formula 1 History', wishesBase: 44200,
    socialHandles: { instagram: 'lewishamilton', twitter: 'LewisHamilton' }
  },
  {
    id: 's11', name: 'Max Verstappen', sport: 'MOTORSPORT', birthMonth: 9, birthDay: 30, birthYear: 1997,
    clubOrTeam: 'Red Bull Racing', league: 'Formula 1', country: 'Netherlands', countryCode: 'NL', countryFlag: '🇳🇱',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/2022_Max_Verstappen_podium.jpg/440px-2022_Max_Verstappen_podium.jpg',
    fallbackInitials: 'MV', biodataRole: 'Formula 1 Driver • 4x Consecutive World Champion',
    quote: 'Never give up — that is the main message for me.',
    trophies: ['4x F1 World Drivers Champion', '22+ Wins in a Single Season (Record)', 'F1 Fastest Lap Records'],
    matchFootprint: 'Most Wins in a Single F1 Season (2023)', wishesBase: 38900,
    socialHandles: { instagram: 'maxverstappen1', twitter: 'Max33Verstappen' }
  },
  // TENNIS
  {
    id: 's12', name: 'Novak Djokovic', sport: 'TENNIS', birthMonth: 5, birthDay: 22, birthYear: 1987,
    clubOrTeam: 'Serbia National', league: 'ATP Tour', country: 'Serbia', countryCode: 'RS', countryFlag: '🇷🇸',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Novak_Djokovic_2022_Wimbledon_%28cropped2%29.jpg/440px-Novak_Djokovic_2022_Wimbledon_%28cropped2%29.jpg',
    fallbackInitials: 'ND', biodataRole: 'Professional Tennis Player • 24x Grand Slam Champion',
    quote: 'Every point matters — that competitive drive is what defines me.',
    trophies: ['24x Grand Slam Champion (Record)', '390+ Weeks World No.1 (Record)', 'Olympic Gold Medal 2024'],
    matchFootprint: 'Most Grand Slam Singles Titles in History', wishesBase: 55000,
    socialHandles: { instagram: 'djokernole', twitter: 'DjokerNole' }
  },
  {
    id: 's13', name: 'Serena Williams', sport: 'TENNIS', birthMonth: 9, birthDay: 26, birthYear: 1981,
    clubOrTeam: 'Retired – GOAT', league: 'WTA Tour Legends', country: 'United States', countryCode: 'US', countryFlag: '🇺🇸',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Serena_Williams_at_the_2013_US_Open.jpg/440px-Serena_Williams_at_the_2013_US_Open.jpg',
    fallbackInitials: 'SW', biodataRole: 'Tennis GOAT • 23x Grand Slam Singles Champion',
    quote: 'I really think a champion is defined not by their wins but by how they can recover when they fall.',
    trophies: ['23x Grand Slam Champion', '4x Olympic Gold Medals', '5x WTA Season Champion'],
    matchFootprint: '319 Career Weeks as World No. 1', wishesBase: 72000,
    socialHandles: { instagram: 'serenawilliams', twitter: 'serenawilliams' }
  },
  // ATHLETICS
  {
    id: 's14', name: 'Usain Bolt', sport: 'ATHLETICS', birthMonth: 8, birthDay: 21, birthYear: 1986,
    clubOrTeam: 'Jamaica / Retired', league: 'World Athletics', country: 'Jamaica', countryCode: 'JM', countryFlag: '🇯🇲',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Usain_Bolt_2012_Olympics_2.jpg/440px-Usain_Bolt_2012_Olympics_2.jpg',
    fallbackInitials: 'UB', biodataRole: 'Sprinter • 8x Olympic Gold Medalist',
    quote: "I know what I can do, so I never doubt myself.",
    trophies: ['8x Olympic Gold Medalist (3 Games)', '11x World Champion', '100m World Record: 9.58s'],
    matchFootprint: 'World Record Holder 100m (9.58s) & 200m (19.19s)', wishesBase: 63000,
    socialHandles: { instagram: 'usainbolt', twitter: 'usainbolt' }
  },
  // COMBAT
  {
    id: 's15', name: 'Conor McGregor', sport: 'COMBAT', birthMonth: 7, birthDay: 14, birthYear: 1988,
    clubOrTeam: 'UFC / Boxing', league: 'UFC Championship', country: 'Ireland', countryCode: 'IE', countryFlag: '🇮🇪',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Conor_McGregor_2019_%28cropped%29.jpg/440px-Conor_McGregor_2019_%28cropped%29.jpg',
    fallbackInitials: 'CM', biodataRole: 'MMA Fighter • Dual UFC World Champion',
    quote: 'I am not talented, I am obsessed.',
    trophies: ['UFC Featherweight World Champion', 'UFC Lightweight World Champion', '2x UFC PPV Record Holder'],
    matchFootprint: 'Best-Selling UFC Pay-Per-View Fighter of All Time', wishesBase: 41000,
    socialHandles: { instagram: 'thenotoriousmma', twitter: 'TheNotoriousMMA' }
  },
  // GOLF
  {
    id: 's16', name: 'Tiger Woods', sport: 'GOLF', birthMonth: 12, birthDay: 30, birthYear: 1975,
    clubOrTeam: 'PGA Tour', league: 'World Golf', country: 'United States', countryCode: 'US', countryFlag: '🇺🇸',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Tiger_Woods_drives_2011.jpg/440px-Tiger_Woods_drives_2011.jpg',
    fallbackInitials: 'TW', biodataRole: 'Professional Golfer • 15x Major Champion',
    quote: 'No matter how good you get, you can always get better.',
    trophies: ['15x Major Champion', '5x Masters Tournament Champion', '683 Weeks as World No. 1'],
    matchFootprint: '82 PGA Tour Wins – Joint Record', wishesBase: 69000,
    socialHandles: { instagram: 'tigerwoods', twitter: 'TigerWoods' }
  },
  // CRICKET
  {
    id: 's17', name: 'Virat Kohli', sport: 'CRICKET', birthMonth: 11, birthDay: 5, birthYear: 1988,
    clubOrTeam: 'India National / RCB', league: 'ICC Cricket / IPL', country: 'India', countryCode: 'IN', countryFlag: '🇮🇳',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Virat_Kohli_batting_in_2018.jpg/440px-Virat_Kohli_batting_in_2018.jpg',
    fallbackInitials: 'VK', biodataRole: 'Batsman • ICC World Rankings No. 1',
    quote: 'Self-belief and hard work will always earn you success.',
    trophies: ['ICC T20 World Cup Winner', 'ICC ODI World Cup (2011)', '50+ International Centuries'],
    matchFootprint: '50+ International Centuries – Closest to Sachin Record', wishesBase: 78000,
    socialHandles: { instagram: 'virat.kohli', twitter: 'imVkohli' }
  },
  // RUGBY
  {
    id: 's18', name: 'Richie McCaw', sport: 'RUGBY', birthMonth: 12, birthDay: 31, birthYear: 1980,
    clubOrTeam: 'All Blacks (Retired)', league: 'World Rugby', country: 'New Zealand', countryCode: 'NZ', countryFlag: '🇳🇿',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Richie_McCaw_2014.jpg/440px-Richie_McCaw_2014.jpg',
    fallbackInitials: 'RM', biodataRole: 'Flanker • 2x World Rugby Player of the Year',
    quote: 'Champions are not born — they are made through persistence.',
    trophies: ['2x Rugby World Cup Winner', '3x World Rugby Player of the Year', 'Most Capped All Black (148 Caps)'],
    matchFootprint: 'Most Rugby World Cup Wins as Captain (2)', wishesBase: 32000,
    socialHandles: { instagram: 'richiemccaw7', twitter: 'Richie_McCaw' }
  },
];

function getSportIcon(sport: string) {
  const icons: Record<string, string> = {
    SOCCER: '⚽', BASKETBALL: '🏀', MOTORSPORT: '🏎️', TENNIS: '🎾',
    ATHLETICS: '🏃', COMBAT: '🥊', GOLF: '⛳', CRICKET: '🏏',
    RUGBY: '🏉', BASEBALL: '⚾', HOCKEY: '🏒',
  };
  return icons[sport] || '🏅';
}

export default function BirthdaysHubPage() {
  const [stars, setStars] = useState<EnterpriseBirthdayStar[]>(GLOBAL_SPORT_STARS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<string>('ALL');
  const [wishedIds, setWishedIds] = useState<string[]>([]);
  const [wishCounts, setWishCounts] = useState<Record<string, number>>({});
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [selectedStar, setSelectedStar] = useState<EnterpriseBirthdayStar | null>(null);
  const [showWishModal, setShowWishModal] = useState(false);
  const [wishText, setWishText] = useState('');
  const [userNickname, setUserNickname] = useState('');
  const [userImageUrl, setUserImageUrl] = useState('');
  const [wishSent, setWishSent] = useState(false);
  const [copiedWish, setCopiedWish] = useState(false);
  const [calendarView, setCalendarView] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth() + 1);

  const currentYear = new Date().getFullYear();
  const today = new Date();

  const handleOpenWishModal = (star: EnterpriseBirthdayStar) => {
    try { phoneHardware.triggerHaptic('SELECTION'); } catch {}
    setSelectedStar(star);
    const age = currentYear - star.birthYear;
    setWishText(`🎂 Happy ${age}th Birthday, ${star.name}! May this year bring you more goals, glory and greatness. The world of sport salutes you! 🏆✨`);
    setWishSent(false);
    setCopiedWish(false);
    setShowWishModal(true);
  };

  const handleSendWish = () => {
    if (!selectedStar) return;
    try { phoneHardware.triggerHaptic('SUCCESS'); } catch {}
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    if (!wishedIds.includes(selectedStar.id)) {
      setWishedIds(prev => [...prev, selectedStar.id]);
      setWishCounts(prev => ({
        ...prev,
        [selectedStar.id]: (prev[selectedStar.id] || selectedStar.wishesBase) + 1
      }));
    }
    setWishSent(true);
  };

  const handleCopyWish = () => {
    if (!wishText) return;
    const fullText = userNickname
      ? `${wishText}\n\n— ${userNickname} via Mivaj Sports 🏟️ (mivaj.com/birthdays)`
      : `${wishText}\n\nvia Mivaj Sports 🏟️ (mivaj.com/birthdays)`;
    navigator.clipboard.writeText(fullText).catch(() => {});
    setCopiedWish(true);
    setTimeout(() => setCopiedWish(false), 2500);
  };

  const buildShareText = () => {
    const age = selectedStar ? currentYear - selectedStar.birthYear : '';
    const base = userNickname ? `${wishText}\n— ${userNickname}` : wishText;
    return `${base}\n\n🏟️ Join the global birthday wall at mivaj.com/birthdays`;
  };

  const handleShareTelegram = () => {
    if (!selectedStar) return;
    window.open(`https://t.me/share/url?url=${encodeURIComponent('https://mivaj.com/birthdays')}&text=${encodeURIComponent(buildShareText())}`, '_blank');
  };

  const handleShareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(buildShareText())}`, '_blank');
  };

  const handleShareX = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(buildShareText())}`, '_blank');
  };

  const handleSharePlayerInstagram = () => {
    if (!selectedStar?.socialHandles?.instagram) {
      window.open('https://www.instagram.com/', '_blank');
      return;
    }
    window.open(`https://www.instagram.com/${selectedStar.socialHandles.instagram}/`, '_blank');
  };

  const handleSharePlayerTwitter = () => {
    if (!selectedStar?.socialHandles?.twitter) {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(buildShareText())}`, '_blank');
      return;
    }
    const mention = `@${selectedStar.socialHandles.twitter}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(mention + ' ' + buildShareText())}`, '_blank');
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
              quote: (a.bio?.substring(0, 85) || 'Elite sports icon.') + '...',
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
    let base = stars;
    if (calendarView) {
      base = base.filter(s => s.birthMonth === calendarMonth);
    }
    return base.filter(star => {
      if (selectedSport !== 'ALL' && star.sport !== selectedSport) return false;
      if (searchQuery && !calendarView) {
        const q = searchQuery.toLowerCase();
        return star.name.toLowerCase().includes(q) ||
               star.clubOrTeam.toLowerCase().includes(q) ||
               star.country.toLowerCase().includes(q) ||
               star.league.toLowerCase().includes(q);
      }
      return true;
    });
  }, [stars, selectedSport, searchQuery, calendarView, calendarMonth]);

  const todayStars = useMemo(() => {
    return GLOBAL_SPORT_STARS.filter(s => s.birthMonth === (today.getMonth() + 1) && s.birthDay === today.getDate());
  }, []);

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-28">

      {/* iOS Navigation Bar */}
      <div className="sticky top-0 z-30 bg-[#09090B]/92 backdrop-blur-2xl border-b border-white/[0.08] px-4 py-3 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 text-iosBlue" />
            <span className="font-medium text-iosBlue">Stadium</span>
          </Link>
          <h1 className="text-sm font-bold text-white tracking-tight">Birthday Hub</h1>
          <button
            onClick={() => setCalendarView(!calendarView)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              calendarView ? 'bg-iosBlue text-white' : 'bg-white/10 text-gray-400'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{calendarView ? 'Calendar' : 'Calendar'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5 space-y-6">

        {/* Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-br from-pink-900/40 via-purple-900/30 to-amber-900/30 border border-pink-500/20 p-6 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #ec4899 0%, transparent 60%), radial-gradient(circle at 70% 50%, #f59e0b 0%, transparent 60%)' }} />
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-bold">
              <span>🎂</span>
              <span>GLOBAL SPORTS BIRTHDAY RADAR • ALL SPORTS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">World Sports Star Birthdays</h1>
            <p className="text-sm text-gray-300 max-w-lg mx-auto">
              Football, Basketball, Tennis, F1, UFC, Golf, Cricket, Rugby & Athletics. Send personalised wishes, share on the player's social media.
            </p>
          </div>
        </div>

        {/* Today's Birthday Alert */}
        {todayStars.length > 0 && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-gold/20 to-amber-500/10 border border-gold/40">
            <p className="text-xs font-black text-gold uppercase tracking-wider mb-2">🎂 Celebrating Today!</p>
            <div className="flex flex-wrap gap-2">
              {todayStars.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleOpenWishModal(s)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gold/20 border border-gold/40 hover:bg-gold/30 transition-all"
                >
                  <span className="text-sm">{getSportIcon(s.sport)}</span>
                  <span className="text-xs font-bold text-white">{s.name}</span>
                  <span className="text-[10px] text-gold">({currentYear - s.birthYear})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Calendar Month Selector */}
        {calendarView && (
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <button onClick={() => setCalendarMonth(m => m === 1 ? 12 : m - 1)} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="text-center">
                <p className="text-sm font-bold text-white">{MONTHS[calendarMonth - 1]} Birthdays</p>
                <p className="text-xs text-gray-400">{filteredStars.length} athletes born this month</p>
              </div>
              <button onClick={() => setCalendarMonth(m => m === 12 ? 1 : m + 1)} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex overflow-x-auto gap-1.5 pb-1">
              {MONTHS.map((m, i) => (
                <button
                  key={m}
                  onClick={() => setCalendarMonth(i + 1)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all ${
                    calendarMonth === i + 1 ? 'bg-pink-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/15'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search & Sport Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchLive(e.target.value)}
              placeholder="Search athlete, club, country (e.g. Haaland, Nigeria, NBA)..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
            />
            {loading && <RefreshCw className="w-4 h-4 text-pink-400 animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {([
              { key: 'ALL', label: 'All Sports', icon: '🌍' },
              { key: 'SOCCER', label: 'Football', icon: '⚽' },
              { key: 'BASKETBALL', label: 'Basketball', icon: '🏀' },
              { key: 'MOTORSPORT', label: 'Motorsport', icon: '🏎️' },
              { key: 'TENNIS', label: 'Tennis', icon: '🎾' },
              { key: 'ATHLETICS', label: 'Athletics', icon: '🏃' },
              { key: 'COMBAT', label: 'UFC/MMA', icon: '🥊' },
              { key: 'GOLF', label: 'Golf', icon: '⛳' },
              { key: 'CRICKET', label: 'Cricket', icon: '🏏' },
              { key: 'RUGBY', label: 'Rugby', icon: '🏉' },
            ] as const).map((s) => (
              <button
                key={s.key}
                onClick={() => {
                  try { phoneHardware.triggerHaptic('SELECTION'); } catch {}
                  setSelectedSport(s.key);
                }}
                className={`flex-shrink-0 flex items-center space-x-1.5 px-3 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedSport === s.key
                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20'
                    : 'bg-white/[0.05] text-gray-400 border border-white/[0.08] hover:text-white'
                }`}
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Athletes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStars.map((star) => {
            const hasWished = wishedIds.includes(star.id);
            const wishesCount = wishCounts[star.id] || star.wishesBase;
            const age = currentYear - star.birthYear;
            const hasPhoto = star.avatarUrl && !imgErrors[star.id];
            const isTodayBday = star.birthMonth === (today.getMonth() + 1) && star.birthDay === today.getDate();

            return (
              <div
                key={star.id}
                className={`rounded-3xl border transition-all duration-200 flex flex-col p-4 shadow-xl ${
                  isTodayBday
                    ? 'border-gold/60 bg-gradient-to-br from-amber-950/40 via-[#1C1C1E] to-[#1C1C1E] ring-1 ring-gold/30'
                    : 'border-white/[0.08] bg-[#1C1C1E] hover:border-white/20'
                }`}
              >
                {/* Today badge */}
                {isTodayBday && (
                  <div className="flex justify-end mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-gold text-black text-[10px] font-black uppercase animate-pulse">🎂 Today!</span>
                  </div>
                )}

                {/* Date + Sport badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] text-gray-400 font-mono">
                    {MONTHS[star.birthMonth - 1]} {star.birthDay} • {age} yrs
                  </span>
                  <span className="text-xs">{getSportIcon(star.sport)} {star.countryFlag}</span>
                </div>

                {/* Player Photo + Name */}
                <div className="flex items-center space-x-3 mb-3">
                  {hasPhoto ? (
                    <img
                      src={star.avatarUrl}
                      alt={star.name}
                      className="w-14 h-14 rounded-2xl object-cover object-top border border-white/10 bg-black flex-shrink-0"
                      onError={() => setImgErrors(prev => ({ ...prev, [star.id]: true }))}
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-black/60 border border-gold/40 flex items-center justify-center font-black text-sm text-gold flex-shrink-0">
                      {star.fallbackInitials || '★'}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-extrabold text-white truncate">{star.name}</h3>
                    <p className="text-xs text-stadiumGreen font-semibold truncate">{star.clubOrTeam}</p>
                    <p className="text-[10px] text-gray-400 truncate">{star.biodataRole}</p>
                  </div>
                </div>

                {/* Trophy highlight */}
                <div className="p-2.5 rounded-xl bg-black/40 border border-gold/15 flex items-start space-x-2 mb-3 flex-1">
                  <Trophy className="w-3.5 h-3.5 text-gold flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-gold font-bold text-[10px] truncate">{star.matchFootprint}</p>
                    <p className="text-[10px] text-gray-400 line-clamp-2">{star.trophies[0]}</p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center space-x-2 mt-auto pt-2 border-t border-white/[0.06]">
                  <button
                    onClick={() => handleOpenWishModal(star)}
                    className={`flex-1 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all active:scale-95 ${
                      hasWished
                        ? 'bg-stadiumGreen text-black'
                        : 'bg-gradient-to-r from-pink-500 to-amber-500 text-white hover:brightness-110'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${hasWished ? 'fill-black' : 'fill-white'}`} />
                    <span>{hasWished ? `Wished ✓ (${wishesCount.toLocaleString()})` : `Send Wish (${wishesCount.toLocaleString()})`}</span>
                  </button>
                </div>
              </div>
            );
          })}

          {filteredStars.length === 0 && (
            <div className="col-span-full text-center py-16 text-gray-500">
              <p className="text-2xl mb-2">🔍</p>
              <p className="text-sm font-medium">No athletes found for this filter.</p>
              <p className="text-xs mt-1">Try searching a different sport or name.</p>
            </div>
          )}
        </div>
      </div>

      {/* WISH CARD MODAL */}
      {showWishModal && selectedStar && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#1C1C1E] rounded-3xl border border-white/10 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/[0.08]">
              <div>
                <p className="text-xs text-pink-400 font-bold uppercase">Birthday Wish Card</p>
                <p className="text-sm font-bold text-white">{selectedStar.name}</p>
              </div>
              <button onClick={() => setShowWishModal(false)} className="p-2 rounded-xl bg-white/10 text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-4 space-y-4">
              {/* Wish Preview Card */}
              <div className="relative rounded-2xl bg-gradient-to-br from-pink-900/40 via-purple-900/30 to-amber-900/20 border border-pink-500/20 p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedStar.avatarUrl || ''}
                    alt={selectedStar.name}
                    className="w-12 h-12 rounded-xl object-cover border border-white/20"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div>
                    <p className="text-xs font-black text-gold">🎂 Birthday Wish</p>
                    <p className="text-sm font-bold text-white">{selectedStar.name} {currentYear - selectedStar.birthYear}th Birthday</p>
                    <p className="text-[10px] text-gray-400">{selectedStar.biodataRole}</p>
                  </div>
                </div>
                {userImageUrl && (
                  <div className="flex items-center space-x-2">
                    <img src={userImageUrl} alt="You" className="w-8 h-8 rounded-full object-cover border border-gold/40" onError={() => setUserImageUrl('')} />
                    <span className="text-xs text-gray-300 font-semibold">{userNickname || 'You'}</span>
                  </div>
                )}
                <p className="text-sm text-white leading-relaxed">{wishText}</p>
                {userNickname && <p className="text-xs text-gray-400">— {userNickname} via Mivaj Sports</p>}
              </div>

              {/* Editable Wish Text */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Your Wish Message</label>
                <textarea
                  value={wishText}
                  onChange={(e) => setWishText(e.target.value)}
                  rows={4}
                  className="w-full p-3 rounded-2xl bg-black/50 border border-white/10 text-sm text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none resize-none"
                  placeholder="Type your personalised birthday wish..."
                />
              </div>

              {/* Your Name + Avatar */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Your Name / Nickname</label>
                  <input
                    value={userNickname}
                    onChange={(e) => setUserNickname(e.target.value)}
                    placeholder="e.g. Big Victor 🇳🇬"
                    className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-sm text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Your Image URL (Optional)</label>
                  <input
                    value={userImageUrl}
                    onChange={(e) => setUserImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-sm text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Send Button */}
              {!wishSent ? (
                <button
                  onClick={handleSendWish}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-amber-500 text-white font-extrabold text-sm flex items-center justify-center space-x-2 shadow-lg hover:brightness-110 active:scale-95 transition-all"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Send Birthday Wish to {selectedStar.name}! 🎂</span>
                </button>
              ) : (
                <div className="p-3 rounded-2xl bg-stadiumGreen/20 border border-stadiumGreen/40 text-center">
                  <p className="text-stadiumGreen font-bold text-sm">🎉 Wish Sent Successfully!</p>
                  <p className="text-xs text-gray-400 mt-0.5">Now share it on social media below</p>
                </div>
              )}

              {/* Social Share Buttons */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">Share On</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleShareTelegram}
                    className="flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-[#0088cc]/20 border border-[#0088cc]/40 text-[#0088cc] text-xs font-bold hover:bg-[#0088cc]/30 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Telegram</span>
                  </button>
                  <button
                    onClick={handleShareWhatsApp}
                    className="flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-xs font-bold hover:bg-[#25D366]/30 transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={handleSharePlayerTwitter}
                    className="flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-black border border-white/20 text-white text-xs font-bold hover:bg-white/10 transition-all"
                  >
                    <Twitter className="w-3.5 h-3.5" />
                    <span>X / Twitter{selectedStar.socialHandles?.twitter ? ` (@${selectedStar.socialHandles.twitter})` : ''}</span>
                  </button>
                  <button
                    onClick={handleSharePlayerInstagram}
                    className="flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-bold hover:from-purple-600/30 hover:to-pink-500/30 transition-all"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>Instagram{selectedStar.socialHandles?.instagram ? ` (@${selectedStar.socialHandles.instagram})` : ''}</span>
                  </button>
                </div>
                <button
                  onClick={handleCopyWish}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-gray-300 text-xs font-bold hover:bg-white/10 transition-all"
                >
                  {copiedWish ? <Check className="w-3.5 h-3.5 text-stadiumGreen" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedWish ? 'Copied to Clipboard!' : 'Copy Wish Text to Clipboard'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
