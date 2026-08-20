'use client';

import React, { useState } from 'react';
import { Globe, Trophy, Users, MapPin, Activity, Flame, Shield, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

export interface WorldClub {
  id: string;
  name: string;
  shortName: string;
  league: string;
  country: string;
  countryFlag: string;
  logo: string;
  stadium: string;
  capacity: string;
  manager: string;
  squadValue: string;
  trophies: string;
  goalPowerXG: number;
  form: ('W' | 'D' | 'L')[];
}

const GLOBAL_CLUBS_DIRECTORY: Record<string, WorldClub[]> = {
  ALL: [],
  ENGLAND: [
    {
      id: 'mci',
      name: 'Manchester City FC',
      shortName: 'Man City',
      league: 'Premier League',
      country: 'England',
      countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      logo: 'https://crests.football-data.org/65.png',
      stadium: 'Etihad Stadium',
      capacity: '53,400',
      manager: 'Pep Guardiola',
      squadValue: '€1.26 Billion',
      trophies: '1x UCL, 10x Premier League, 7x FA Cup',
      goalPowerXG: 2.45,
      form: ['W', 'W', 'D', 'W', 'W'],
    },
    {
      id: 'ars',
      name: 'Arsenal FC',
      shortName: 'Arsenal',
      league: 'Premier League',
      country: 'England',
      countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      logo: 'https://crests.football-data.org/57.png',
      stadium: 'Emirates Stadium',
      capacity: '60,704',
      manager: 'Mikel Arteta',
      squadValue: '€1.15 Billion',
      trophies: '13x Premier League (Invincible), 14x FA Cup',
      goalPowerXG: 2.28,
      form: ['W', 'W', 'W', 'W', 'D'],
    },
    {
      id: 'liv',
      name: 'Liverpool FC',
      shortName: 'Liverpool',
      league: 'Premier League',
      country: 'England',
      countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      logo: 'https://crests.football-data.org/64.png',
      stadium: 'Anfield',
      capacity: '61,276',
      manager: 'Arne Slot',
      squadValue: '€980 Million',
      trophies: '6x UCL, 19x Premier League, 8x FA Cup',
      goalPowerXG: 2.35,
      form: ['W', 'W', 'W', 'D', 'W'],
    },
    {
      id: 'che',
      name: 'Chelsea FC',
      shortName: 'Chelsea',
      league: 'Premier League',
      country: 'England',
      countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      logo: 'https://crests.football-data.org/61.png',
      stadium: 'Stamford Bridge',
      capacity: '40,341',
      manager: 'Enzo Maresca',
      squadValue: '€950 Million',
      trophies: '2x UCL, 6x Premier League, 2x Europa League',
      goalPowerXG: 1.95,
      form: ['W', 'D', 'W', 'L', 'W'],
    },
  ],
  SPAIN: [
    {
      id: 'rma',
      name: 'Real Madrid CF',
      shortName: 'Real Madrid',
      league: 'La Liga',
      country: 'Spain',
      countryFlag: '🇪🇸',
      logo: 'https://crests.football-data.org/86.png',
      stadium: 'Santiago Bernabéu',
      capacity: '85,000',
      manager: 'Carlo Ancelotti',
      squadValue: '€1.34 Billion',
      trophies: '15x UCL (Record), 36x La Liga, 20x Copa del Rey',
      goalPowerXG: 2.60,
      form: ['W', 'W', 'W', 'W', 'W'],
    },
    {
      id: 'fcb',
      name: 'FC Barcelona',
      shortName: 'Barcelona',
      league: 'La Liga',
      country: 'Spain',
      countryFlag: '🇪🇸',
      logo: 'https://crests.football-data.org/81.png',
      stadium: 'Spotify Camp Nou',
      capacity: '99,354',
      manager: 'Hansi Flick',
      squadValue: '€1.02 Billion',
      trophies: '5x UCL, 27x La Liga, 31x Copa del Rey',
      goalPowerXG: 2.40,
      form: ['W', 'W', 'D', 'W', 'W'],
    },
    {
      id: 'atm',
      name: 'Atlético de Madrid',
      shortName: 'Atlético Madrid',
      league: 'La Liga',
      country: 'Spain',
      countryFlag: '🇪🇸',
      logo: 'https://crests.football-data.org/78.png',
      stadium: 'Cívitas Metropolitano',
      capacity: '70,460',
      manager: 'Diego Simeone',
      squadValue: '€620 Million',
      trophies: '11x La Liga, 3x Europa League, 10x Copa del Rey',
      goalPowerXG: 1.90,
      form: ['W', 'D', 'W', 'L', 'W'],
    },
  ],
  ITALY: [
    {
      id: 'int',
      name: 'FC Internazionale Milano',
      shortName: 'Inter Milan',
      league: 'Serie A',
      country: 'Italy',
      countryFlag: '🇮🇹',
      logo: 'https://crests.football-data.org/108.png',
      stadium: 'San Siro (Giuseppe Meazza)',
      capacity: '75,923',
      manager: 'Simone Inzaghi',
      squadValue: '€680 Million',
      trophies: '3x UCL, 20x Serie A (Second Star), 9x Coppa Italia',
      goalPowerXG: 2.30,
      form: ['W', 'W', 'W', 'D', 'W'],
    },
    {
      id: 'juv',
      name: 'Juventus FC',
      shortName: 'Juventus',
      league: 'Serie A',
      country: 'Italy',
      countryFlag: '🇮🇹',
      logo: 'https://crests.football-data.org/109.png',
      stadium: 'Allianz Stadium Turin',
      capacity: '41,507',
      manager: 'Thiago Motta',
      squadValue: '€590 Million',
      trophies: '2x UCL, 36x Serie A (Record), 15x Coppa Italia',
      goalPowerXG: 2.05,
      form: ['W', 'D', 'W', 'W', 'D'],
    },
  ],
  GERMANY: [
    {
      id: 'bay',
      name: 'FC Bayern München',
      shortName: 'Bayern Munich',
      league: 'Bundesliga',
      country: 'Germany',
      countryFlag: '🇩🇪',
      logo: 'https://crests.football-data.org/5.png',
      stadium: 'Allianz Arena Munich',
      capacity: '75,024',
      manager: 'Vincent Kompany',
      squadValue: '€940 Million',
      trophies: '6x UCL, 33x Bundesliga (Record), 20x DFB-Pokal',
      goalPowerXG: 2.70,
      form: ['W', 'W', 'W', 'W', 'D'],
    },
    {
      id: 'b04',
      name: 'Bayer 04 Leverkusen',
      shortName: 'Bayer Leverkusen',
      league: 'Bundesliga',
      country: 'Germany',
      countryFlag: '🇩🇪',
      logo: 'https://crests.football-data.org/3.png',
      stadium: 'BayArena',
      capacity: '30,210',
      manager: 'Xabi Alonso',
      squadValue: '€630 Million',
      trophies: '1x Bundesliga (Invincible 2024), 2x DFB-Pokal, 1x UEFA Cup',
      goalPowerXG: 2.25,
      form: ['W', 'D', 'W', 'W', 'W'],
    },
  ],
  NIGERIA: [
    {
      id: 'eny',
      name: 'Enyimba International FC',
      shortName: 'Enyimba',
      league: 'Nigeria Premier Football League (NPFL)',
      country: 'Nigeria',
      countryFlag: '🇳🇬',
      logo: 'https://crests.football-data.org/1765.png',
      stadium: 'Enyimba International Stadium, Aba',
      capacity: '16,000',
      manager: 'Finidi George / Technical Desk',
      squadValue: '₦4.5 Billion',
      trophies: '2x CAF Champions League (2003, 2004), 9x NPFL Titles (Record), 4x FA Cup',
      goalPowerXG: 2.10,
      form: ['W', 'W', 'D', 'W', 'W'],
    },
    {
      id: 'remo',
      name: 'Remo Stars FC',
      shortName: 'Remo Stars',
      league: 'Nigeria Premier Football League (NPFL)',
      country: 'Nigeria',
      countryFlag: '🇳🇬',
      logo: 'https://crests.football-data.org/1770.png',
      stadium: 'Remo Stars Stadium, Ikenne',
      capacity: '20,000',
      manager: 'Daniel Ogunmodede',
      squadValue: '₦3.8 Billion',
      trophies: 'NPFL Champions Runner-Up, CAF Champions League Group Stage',
      goalPowerXG: 1.95,
      form: ['W', 'W', 'L', 'W', 'D'],
    },
    {
      id: 'riv',
      name: 'Rivers United FC',
      shortName: 'Rivers United',
      league: 'Nigeria Premier Football League (NPFL)',
      country: 'Nigeria',
      countryFlag: '🇳🇬',
      logo: 'https://crests.football-data.org/1769.png',
      stadium: 'Adokiye Amiesimaka Stadium, Port Harcourt',
      capacity: '38,000',
      manager: 'Stanley Eguma / Technical Desk',
      squadValue: '₦3.2 Billion',
      trophies: '1x NPFL Champions, CAF Confederation Cup Quarter-Finals',
      goalPowerXG: 1.88,
      form: ['D', 'W', 'W', 'L', 'W'],
    },
  ],
  BRAZIL: [
    {
      id: 'fla',
      name: 'CR Flamengo',
      shortName: 'Flamengo',
      league: 'Brasileirão & Copa Libertadores',
      country: 'Brazil',
      countryFlag: '🇧🇷',
      logo: 'https://crests.football-data.org/1765.png',
      stadium: 'Maracanã, Rio de Janeiro',
      capacity: '78,838',
      manager: 'Tite',
      squadValue: '€210 Million',
      trophies: '3x Copa Libertadores, 8x Brasileirão, 4x Copa do Brasil',
      goalPowerXG: 2.15,
      form: ['W', 'W', 'W', 'D', 'W'],
    },
    {
      id: 'pal',
      name: 'SE Palmeiras',
      shortName: 'Palmeiras',
      league: 'Brasileirão & Copa Libertadores',
      country: 'Brazil',
      countryFlag: '🇧🇷',
      logo: 'https://crests.football-data.org/1766.png',
      stadium: 'Allianz Parque, São Paulo',
      capacity: '43,713',
      manager: 'Abel Ferreira',
      squadValue: '€220 Million',
      trophies: '3x Copa Libertadores, 12x Brasileirão (Record), 4x Copa do Brasil',
      goalPowerXG: 2.20,
      form: ['W', 'W', 'D', 'W', 'W'],
    },
  ],
};

// Flatten for ALL
GLOBAL_CLUBS_DIRECTORY.ALL = [
  ...GLOBAL_CLUBS_DIRECTORY.ENGLAND,
  ...GLOBAL_CLUBS_DIRECTORY.SPAIN,
  ...GLOBAL_CLUBS_DIRECTORY.ITALY,
  ...GLOBAL_CLUBS_DIRECTORY.GERMANY,
  ...GLOBAL_CLUBS_DIRECTORY.NIGERIA,
  ...GLOBAL_CLUBS_DIRECTORY.BRAZIL,
];

export const GlobalClubExplorer: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [selectedClub, setSelectedClub] = useState<WorldClub | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  const clubs = GLOBAL_CLUBS_DIRECTORY[selectedCountry] || GLOBAL_CLUBS_DIRECTORY.ALL;

  return (
    <div className="glass-panel rounded-3xl p-5 border border-white/10 space-y-4 font-mono text-xs shadow-2xl">
      
      {/* Header with Collapsible Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2.5 cursor-pointer select-none"
        >
          <div className="p-2 rounded-xl bg-stadiumGreen text-black font-black">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-sm text-white flex items-center space-x-2">
              <span>GLOBAL CLUB EXPLORER & STADIUM RADAR 🌐</span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/30 font-bold">
                12+ LEAGUES
              </span>
            </h3>
            <span className="text-[10px] text-gray-400 font-sans">
              Live tactical xG indexes, trophy cabinets, stadium capacity, and verified managers worldwide.
            </span>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-2 self-stretch sm:self-auto justify-between sm:justify-end">
          {/* Country Filter Selector */}
          <div className="flex items-center space-x-1.5 bg-black/50 p-1 rounded-xl border border-white/10 overflow-x-auto">
            {[
              { key: 'ALL', label: '🌍 All' },
              { key: 'ENGLAND', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 England' },
              { key: 'SPAIN', label: '🇪🇸 Spain' },
              { key: 'ITALY', label: '🇮🇹 Italy' },
              { key: 'GERMANY', label: '🇩🇪 Germany' },
              { key: 'NIGERIA', label: '🇳🇬 NPFL' },
              { key: 'BRAZIL', label: '🇧🇷 Brazil' },
            ].map((c) => (
              <button
                key={c.key}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCountry(c.key);
                }}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap ${
                  selectedCountry === c.key
                    ? 'bg-stadiumGreen text-black font-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-1 text-gray-400 hover:text-white text-xs font-bold px-2 py-1 rounded-lg bg-panel border border-white/10"
          >
            <span className="hidden sm:inline">{isOpen ? 'Collapse' : 'Expand'}</span>
            {isOpen ? <ChevronUp className="w-4 h-4 text-stadiumGreen" /> : <ChevronDown className="w-4 h-4 text-gold" />}
          </button>
        </div>
      </div>

      {/* Clubs Grid (Collapsible) */}
      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 animate-fadeIn">
          {clubs.map((club) => (
            <div
              key={club.id}
              onClick={() => setSelectedClub(club)}
              className="p-4 rounded-2xl bg-panel/90 hover:bg-panel border border-white/10 hover:border-stadiumGreen/40 transition-all cursor-pointer flex flex-col justify-between space-y-3 group shadow-lg"
            >
              {/* Club Top Row */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-black/60 border border-white/10 p-1 flex items-center justify-center flex-shrink-0">
                  <img
                    src={club.logo}
                    alt={club.name}
                    className="w-full h-full object-contain"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <h4 className="font-extrabold text-xs text-white group-hover:text-stadiumGreen transition-all truncate">
                      {club.name}
                    </h4>
                    <span className="text-xs">{club.countryFlag}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-sans block truncate">{club.league}</span>
                </div>
              </div>

              {/* Stadium & Manager Capsule */}
              <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 space-y-1 text-[10px]">
                <div className="flex justify-between text-gray-300">
                  <span className="text-gray-500">Stadium:</span>
                  <span className="font-bold text-white truncate max-w-[160px]">{club.stadium} ({club.capacity})</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span className="text-gray-500">Manager:</span>
                  <span className="font-bold text-gold">{club.manager}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span className="text-gray-500">Squad Value:</span>
                  <span className="font-black text-stadiumGreen">{club.squadValue}</span>
                </div>
              </div>

              {/* Goal Power & Form */}
              <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px]">
                <div className="flex items-center space-x-1 font-bold">
                  <Activity className="w-3 h-3 text-stadiumGreen" />
                  <span className="text-stadiumGreen">Goal Power: {club.goalPowerXG.toFixed(2)} xG</span>
                </div>
                <div className="flex items-center space-x-1">
                  {club.form.map((f, idx) => (
                    <span
                      key={idx}
                      className={`w-3 h-3 rounded text-[8px] font-black flex items-center justify-center ${
                        f === 'W' ? 'bg-stadiumGreen text-black' : f === 'D' ? 'bg-gray-600 text-white' : 'bg-crimson text-white'
                      }`}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Detailed Club Modal */}
      {selectedClub && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-md glass-panel-premium rounded-3xl border border-stadiumGreen/50 p-6 shadow-2xl space-y-4 text-xs font-mono">
            
            <button
              onClick={() => setSelectedClub(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-panel text-gray-400 hover:text-white"
            >
              ✕
            </button>

            <div className="flex items-center space-x-3 border-b border-white/10 pb-3">
              <img src={selectedClub.logo} alt="" className="w-12 h-12 object-contain" />
              <div>
                <h3 className="text-base font-black text-white flex items-center space-x-1.5">
                  <span>{selectedClub.name}</span>
                  <span>{selectedClub.countryFlag}</span>
                </h3>
                <span className="text-[11px] text-stadiumGreen font-bold">{selectedClub.league}</span>
              </div>
            </div>

            <div className="space-y-2 text-gray-300 text-xs">
              <div className="p-3 rounded-2xl bg-black/60 border border-white/10 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-400">Home Ground:</span>
                  <span className="font-bold text-white">{selectedClub.stadium}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Seating Capacity:</span>
                  <span className="font-bold text-gold">{selectedClub.capacity} fans</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Head Coach:</span>
                  <span className="font-bold text-white">{selectedClub.manager}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Squad Valuation:</span>
                  <span className="font-black text-stadiumGreen">{selectedClub.squadValue}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-stadiumGreen/10 border border-stadiumGreen/30 space-y-1">
                <span className="text-gold font-bold flex items-center space-x-1">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>TROPHY CABINET & HONOURS</span>
                </span>
                <p className="text-[11px] text-gray-200 font-sans leading-relaxed">{selectedClub.trophies}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedClub(null)}
              className="w-full py-2.5 rounded-xl bg-stadiumGreen text-black font-black text-xs hover:bg-emerald-400 transition-all"
            >
              Close Club Dossier
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
