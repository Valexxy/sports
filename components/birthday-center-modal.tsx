'use client';

import React, { useState, useMemo } from 'react';
import { 
  X, 
  Heart, 
  Trophy, 
  Calendar, 
  Sparkles, 
  Search, 
  Send, 
  MessageCircle, 
  Share2, 
  Bell, 
  BellRing,
  Star,
  Check,
  Shield,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';

export interface EnterpriseBirthdayStar {
  id: string;
  name: string;
  sport: 'SOCCER' | 'BASKETBALL' | 'TENNIS' | 'COMBAT' | 'NFL';
  birthMonth: number;
  birthDay: number;
  birthYear: number;
  clubOrTeam: string;
  league: string;
  country: string;
  countryFlag: string;
  avatarUrl: string;
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
    countryFlag: '🇺🇸',
    avatarUrl: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/3992.png&w=350&h=254',
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
    countryFlag: '🇳🇱',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/pvqhh01759225850.png',
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
    countryFlag: '🇳🇴',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/un3jr11769182465.png',
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
    countryFlag: '🇫🇷',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/h9u9vz1733653583.png',
    biodataRole: 'Forward • World Cup Champion & Golden Boot',
    quote: 'Hala Madrid! Writing European football history on every matchday.',
    trophies: ['FIFA World Cup Winner', 'FIFA World Cup Golden Boot (8 Goals)', '6x Ligue 1 Top Scorer'],
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
    countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/trk5271750271712.png',
    biodataRole: 'Attacking Midfielder • Golden Boy Winner',
    quote: 'Hey Jude echoing through the Santiago Bernabéu.',
    trophies: ['UEFA Champions League Winner', 'La Liga Player of the Season', 'Golden Boy Award Winner'],
    matchFootprint: 'Decisive El Clásico & UCL Winner',
    wishesBase: 29800,
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
    countryFlag: '🇳🇬',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/lw0qcf1769177786.png',
    biodataRole: 'Striker • African Footballer of the Year',
    quote: 'Naija pride! Pushing boundaries on the global football stage.',
    trophies: ['African Footballer of the Year 2023', 'Serie A Capocannoniere (26 Goals)', 'Scudetto Winner'],
    matchFootprint: 'First African Top Scorer in Serie A History',
    wishesBase: 51200,
  },
  {
    id: 's7',
    name: 'Giannis Antetokounmpo',
    sport: 'BASKETBALL',
    birthMonth: 12,
    birthDay: 6,
    birthYear: 1994,
    clubOrTeam: 'Milwaukee Bucks',
    league: 'NBA Basketball',
    country: 'Greece / Nigeria',
    countryFlag: '🇬🇷🇳🇬',
    avatarUrl: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/3992.png&w=350&h=254',
    biodataRole: 'Power Forward • 2x NBA MVP & Finals MVP',
    quote: 'The Greek Freak with deep Nigerian roots and unstoppable championship drive.',
    trophies: ['NBA Champion (2021)', 'NBA Finals MVP', '2x NBA Most Valuable Player'],
    matchFootprint: '50-Point NBA Finals Closeout Game',
    wishesBase: 28400,
  },
  {
    id: 's8',
    name: 'Luka Dončić',
    sport: 'BASKETBALL',
    birthMonth: 2,
    birthDay: 28,
    birthYear: 1999,
    clubOrTeam: 'Dallas Mavericks',
    league: 'NBA Basketball',
    country: 'Slovenia',
    countryFlag: '🇸🇮',
    avatarUrl: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/3945274.png&w=350&h=254',
    biodataRole: 'Point Guard • 5x All-NBA First Team',
    quote: 'Magic on the hardwood with world-class triple-double vision.',
    trophies: ['EuroLeague MVP & Champion', 'NBA Rookie of the Year', 'NBA Scoring Leader'],
    matchFootprint: '73-Point Single Game Performance',
    wishesBase: 31200,
  }
];

interface BirthdayCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenClub?: (clubName: string) => void;
  onOpenLeague?: (leagueName: string) => void;
}

export const BirthdayCenterModal: React.FC<BirthdayCenterModalProps> = ({
  isOpen,
  onClose,
  onOpenClub,
  onOpenLeague,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<string>('ALL');
  const [wishedStars, setWishedStars] = useState<Record<string, boolean>>({});
  const [wishCounts, setWishCounts] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    GLOBAL_SPORT_STARS.forEach(s => { map[s.id] = s.wishesBase; });
    return map;
  });
  const [selectedStarForDossier, setSelectedStarForDossier] = useState<EnterpriseBirthdayStar | null>(null);

  const today = new Date();
  const currentMonth = today.getMonth() + 1; // 1-12
  const currentDay = today.getDate(); // 1-31

  const filteredStars = useMemo(() => {
    return GLOBAL_SPORT_STARS.filter(star => {
      if (selectedSport !== 'ALL' && star.sport !== selectedSport) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          star.name.toLowerCase().includes(q) ||
          star.clubOrTeam.toLowerCase().includes(q) ||
          star.league.toLowerCase().includes(q) ||
          star.country.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [searchQuery, selectedSport]);

  const handleSendWish = (star: EnterpriseBirthdayStar, e: React.MouseEvent) => {
    e.stopPropagation();
    if (wishedStars[star.id]) return;

    setWishedStars(prev => ({ ...prev, [star.id]: true }));
    setWishCounts(prev => ({ ...prev, [star.id]: (prev[star.id] || star.wishesBase) + 1 }));

    try { stadiumAudio.playNaijaGbam(); } catch {}
    try { phoneHardware.triggerHaptic('SUCCESS'); } catch {}

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleShareStar = (star: EnterpriseBirthdayStar, e: React.MouseEvent) => {
    e.stopPropagation();
    const age = today.getFullYear() - star.birthYear;
    const shareText = `🎂 Happy Birthday to ${star.name} (${star.countryFlag} ${star.clubOrTeam}) turning ${age} today! Send your social wishes on Mivaj Sports: https://mivaj.com/?modal=birthdays`;
    if (navigator.share) {
      navigator.share({ title: `Happy Birthday ${star.name}!`, text: shareText, url: 'https://mivaj.com' }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Birthday greeting copied to clipboard!');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full sm:max-w-5xl max-h-[92vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-panel border border-white/10 shadow-2xl overflow-hidden font-sans">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold text-lg">
              🎂
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center space-x-2">
                <span>Global Sports Star Birthdays & Dossier</span>
                <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold text-[10px] font-mono">100% VERIFIED</span>
              </h2>
              <p className="text-xs text-gray-400">
                Official athlete biodata, club profiles, career honors, and instant social wishes.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters & Search */}
        <div className="p-3 sm:p-4 border-b border-white/10 bg-black/20 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search athlete, club, or league..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-stadiumGreen font-mono"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {['ALL', 'SOCCER', 'BASKETBALL'].map((sport) => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  selectedSport === sport
                    ? 'bg-stadiumGreen text-black shadow-md shadow-stadiumGreen/20'
                    : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                }`}
              >
                {sport === 'ALL' ? '🌍 All Sports' : sport === 'SOCCER' ? '⚽ Football' : '🏀 Basketball'}
              </button>
            ))}
          </div>
        </div>

        {/* Athletes Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStars.map((star) => {
            const isBirthdayToday = star.birthMonth === currentMonth && star.birthDay === currentDay;
            const age = today.getFullYear() - star.birthYear;
            const isWished = !!wishedStars[star.id];

            return (
              <div
                key={star.id}
                onClick={() => setSelectedStarForDossier(star)}
                className={`relative rounded-3xl p-4 border transition-all cursor-pointer group hover:scale-[1.01] flex flex-col justify-between space-y-3 ${
                  isBirthdayToday
                    ? 'bg-gradient-to-br from-gold/15 via-panel to-panel border-gold/50 shadow-lg shadow-gold/10 ring-1 ring-gold/30'
                    : 'bg-black/40 border-white/10 hover:border-white/20'
                }`}
              >
                {/* Top Badge Row */}
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase flex items-center space-x-1 ${
                    isBirthdayToday
                      ? 'bg-gold text-black animate-pulse'
                      : 'bg-white/10 text-gray-300 font-mono'
                  }`}>
                    <span>{isBirthdayToday ? '🎂 CELEBRATING TODAY' : `${star.birthMonth}/${star.birthDay}`}</span>
                    <span>• {age} Yrs</span>
                  </span>

                  <span className="text-sm">{star.countryFlag}</span>
                </div>

                {/* Athlete Avatar & Info */}
                <div className="flex items-center space-x-3.5 pt-1">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-black/80 border border-white/15 overflow-hidden flex-shrink-0 relative flex items-center justify-center p-1 shadow-inner">
                    <img
                      src={star.avatarUrl}
                      alt={star.name}
                      className="w-full h-full object-contain group-hover:scale-115 transition-transform duration-300 drop-shadow-md"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-black text-white truncate group-hover:text-gold transition-colors">
                      {star.name}
                    </h3>
                    <p className="text-[11px] text-stadiumGreen font-black truncate">
                      {star.clubOrTeam}
                    </p>
                    <p className="text-[10px] text-gray-400 font-mono truncate">
                      {star.league}
                    </p>
                  </div>
                </div>

                {/* Role & Quote */}
                <div className="p-2.5 rounded-2xl bg-black/50 border border-white/5 text-[11px] text-gray-300 space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold block">{star.biodataRole}</span>
                  <span className="text-[10px] text-gold font-bold flex items-center space-x-1">
                    <Trophy className="w-3 h-3 flex-shrink-0 text-gold" />
                    <span className="truncate">{star.matchFootprint}</span>
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10 gap-2">
                  <button
                    onClick={(e) => handleSendWish(star, e)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center space-x-1.5 transition-all shadow ${
                      isWished
                        ? 'bg-stadiumGreen text-black'
                        : 'bg-gold/20 hover:bg-gold text-gold hover:text-black border border-gold/40'
                    }`}
                  >
                    {isWished ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Wish Sent!</span>
                      </>
                    ) : (
                      <>
                        <Heart className="w-3.5 h-3.5 fill-current" />
                        <span>Send Birthday Wish ({wishCounts[star.id]?.toLocaleString()})</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={(e) => handleShareStar(star, e)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all"
                    title="Share birthday card"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Individual Athlete Dossier Slide-Over Modal */}
        {selectedStarForDossier && (
          <div className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
            <div className="w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl bg-panel border border-gold/40 p-6 space-y-5 shadow-2xl">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{selectedStarForDossier.countryFlag}</span>
                  <div>
                    <h2 className="text-lg font-black text-white">{selectedStarForDossier.name}</h2>
                    <span className="text-xs text-gold font-mono">{selectedStarForDossier.country} • {selectedStarForDossier.sport}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedStarForDossier(null)}
                  className="p-2 rounded-2xl bg-white/10 text-gray-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Linked Club & League Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div 
                  onClick={() => {
                    if (onOpenClub) onOpenClub(selectedStarForDossier.clubOrTeam);
                    setSelectedStarForDossier(null);
                    onClose();
                  }}
                  className="p-3.5 rounded-2xl bg-black/60 border border-white/10 hover:border-stadiumGreen transition-all cursor-pointer group"
                >
                  <span className="text-[10px] text-gray-400 font-bold block">CLUB DOSSIER</span>
                  <span className="text-xs font-black text-white group-hover:text-stadiumGreen flex items-center justify-between mt-1">
                    <span>{selectedStarForDossier.clubOrTeam}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div 
                  onClick={() => {
                    if (onOpenLeague) onOpenLeague(selectedStarForDossier.league);
                    setSelectedStarForDossier(null);
                    onClose();
                  }}
                  className="p-3.5 rounded-2xl bg-black/60 border border-white/10 hover:border-cyan-400 transition-all cursor-pointer group"
                >
                  <span className="text-[10px] text-gray-400 font-bold block">LEAGUE STANDINGS</span>
                  <span className="text-xs font-black text-white group-hover:text-cyan-400 flex items-center justify-between mt-1">
                    <span>{selectedStarForDossier.league}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Career Trophies & Honors */}
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                <span className="text-xs font-black text-gold flex items-center space-x-1.5">
                  <Trophy className="w-4 h-4 text-gold" />
                  <span>Career Honors & Trophies</span>
                </span>
                <ul className="space-y-1.5 text-xs text-gray-200">
                  {selectedStarForDossier.trophies.map((tr, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <span className="text-gold">★</span>
                      <span>{tr}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quote */}
              <blockquote className="p-3 rounded-xl bg-white/5 border-l-4 border-gold text-xs italic text-gray-300">
                "{selectedStarForDossier.quote}"
              </blockquote>

              <button
                onClick={() => setSelectedStarForDossier(null)}
                className="w-full py-3 rounded-2xl bg-stadiumGreen text-black font-black text-xs transition-all shadow-md"
              >
                Back to Birthday Calendar
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
