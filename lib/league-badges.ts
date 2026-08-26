// Comprehensive Global League Badges & Country Mapping Engine (35+ World Leagues & Multi-Sports)

export interface LeagueInfo {
  id: string;
  name: string;
  shortName: string;
  country: string;
  region: 'EUROPE' | 'AFRICA' | 'AMERICAS' | 'ASIA_MIDDLE_EAST' | 'GLOBAL';
  flag: string;
  logo: string;
  color: string;
}

export const GLOBAL_LEAGUES_CATALOG: LeagueInfo[] = [
  // 🏀 BASKETBALL
  { id: 'nba', name: 'NBA Basketball', shortName: 'NBA', country: 'USA', region: 'AMERICAS', flag: '🏀', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png', color: '#17408b' },
  { id: 'wnba', name: 'WNBA Basketball', shortName: 'WNBA', country: 'USA', region: 'AMERICAS', flag: '🏀', logo: 'https://a.espncdn.com/i/teamlogos/wnba/500/sea.png', color: '#ff6600' },
  { id: 'euroleague', name: 'EuroLeague Basketball', shortName: 'ELB', country: 'Europe', region: 'EUROPE', flag: '🏀', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png', color: '#0055a5' },

  // 🏈 AMERICAN FOOTBALL
  { id: 'nfl', name: 'NFL Football', shortName: 'NFL', country: 'USA', region: 'AMERICAS', flag: '🏈', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/kc.png', color: '#013369' },
  { id: 'ncaa-football', name: 'NCAA College Football', shortName: 'NCAA', country: 'USA', region: 'AMERICAS', flag: '🏈', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/sf.png', color: '#002244' },

  // 🥊 UFC / COMBAT
  { id: 'ufc', name: 'UFC Championship', shortName: 'UFC', country: 'Global', region: 'GLOBAL', flag: '🥊', logo: 'https://a.espncdn.com/combiner/i?img=/i/headshots/mma/players/full/4351684.png&w=120', color: '#d20a0a' },

  // 🎾 TENNIS
  { id: 'atp-tennis', name: 'ATP Tour Tennis', shortName: 'ATP', country: 'Global', region: 'GLOBAL', flag: '🎾', logo: 'https://a.espncdn.com/combiner/i?img=/i/headshots/tennis/players/full/4075.png', color: '#002b49' },
  { id: 'wta-tennis', name: 'WTA Tour Tennis', shortName: 'WTA', country: 'Global', region: 'GLOBAL', flag: '🎾', logo: 'https://a.espncdn.com/combiner/i?img=/i/headshots/tennis/players/full/4379.png', color: '#5b2c86' },
  { id: 'us-open', name: 'US Open Grand Slam', shortName: 'USO', country: 'USA', region: 'AMERICAS', flag: '🎾', logo: 'https://a.espncdn.com/combiner/i?img=/i/headshots/tennis/players/full/4075.png', color: '#002b49' },

  // 🏴󠁧󠁢󠁥󠁮󠁧󠁿 England
  { id: 'premier-league', name: 'Premier League', shortName: 'EPL', country: 'England', region: 'EUROPE', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', logo: 'https://crests.football-data.org/PL.png', color: '#3d195b' },
  { id: 'championship', name: 'EFL Championship', shortName: 'EFL', country: 'England', region: 'EUROPE', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', logo: 'https://crests.football-data.org/ELC.png', color: '#1a2b4c' },
  { id: 'fa-cup', name: 'FA Cup', shortName: 'FAC', country: 'England', region: 'EUROPE', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', logo: 'https://crests.football-data.org/PL.png', color: '#c8102e' },
  { id: 'carabao-cup', name: 'Carabao Cup', shortName: 'EFL Cup', country: 'England', region: 'EUROPE', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', logo: 'https://crests.football-data.org/ELC.png', color: '#006633' },
  
  // 🇪🇸 Spain
  { id: 'la-liga', name: 'La Liga', shortName: 'LALIGA', country: 'Spain', region: 'EUROPE', flag: '🇪🇸', logo: 'https://crests.football-data.org/PD.png', color: '#ee152d' },
  { id: 'copa-del-rey', name: 'Copa del Rey', shortName: 'CDR', country: 'Spain', region: 'EUROPE', flag: '🇪🇸', logo: 'https://crests.football-data.org/PD.png', color: '#ffd700' },

  // 🇮🇹 Italy
  { id: 'serie-a', name: 'Serie A', shortName: 'SERIEA', country: 'Italy', region: 'EUROPE', flag: '🇮🇹', logo: 'https://crests.football-data.org/SA.png', color: '#024494' },
  { id: 'coppa-italia', name: 'Coppa Italia', shortName: 'CI', country: 'Italy', region: 'EUROPE', flag: '🇮🇹', logo: 'https://crests.football-data.org/SA.png', color: '#008d44' },

  // 🇩🇪 Germany
  { id: 'bundesliga', name: 'Bundesliga', shortName: 'BUNDESLIGA', country: 'Germany', region: 'EUROPE', flag: '🇩🇪', logo: 'https://crests.football-data.org/BL1.png', color: '#d20515' },
  { id: 'dfb-pokal', name: 'DFB Pokal', shortName: 'DFB', country: 'Germany', region: 'EUROPE', flag: '🇩🇪', logo: 'https://crests.football-data.org/BL1.png', color: '#006633' },

  // 🇫🇷 France
  { id: 'ligue-1', name: 'Ligue 1', shortName: 'LIGUE1', country: 'France', region: 'EUROPE', flag: '🇫🇷', logo: 'https://crests.football-data.org/FL1.png', color: '#dae025' },

  // 🇳🇬 Nigeria & Africa
  { id: 'npfl', name: 'NPFL Nigeria', shortName: 'NPFL', country: 'Nigeria', region: 'AFRICA', flag: '🇳🇬', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f0/Nigeria_Premier_Football_League_logo.png/220px-Nigeria_Premier_Football_League_logo.png', color: '#008751' },
  { id: 'caf-cl', name: 'CAF Champions League', shortName: 'CAF', country: 'Africa', region: 'AFRICA', flag: '🌍', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/77/CAF_Champions_League_logo.svg/200px-CAF_Champions_League_logo.svg.png', color: '#00843d' },

  // 🏆 UEFA
  { id: 'uefa-cl', name: 'UEFA Champions League', shortName: 'UCL', country: 'Europe', region: 'EUROPE', flag: '⭐', logo: 'https://crests.football-data.org/CL.png', color: '#0e1e5b' },
  { id: 'uefa-el', name: 'UEFA Europa League', shortName: 'UEL', country: 'Europe', region: 'EUROPE', flag: '🟠', logo: 'https://crests.football-data.org/EL.png', color: '#f68e1e' },
  { id: 'uefa-ecl', name: 'UEFA Conference League', shortName: 'UECL', country: 'Europe', region: 'EUROPE', flag: '🟢', logo: 'https://crests.football-data.org/ECL.png', color: '#00c853' },

  // 🇸🇦 Saudi & Americas
  { id: 'saudi-pro-league', name: 'Saudi Pro League', shortName: 'SPL', country: 'Saudi Arabia', region: 'ASIA_MIDDLE_EAST', flag: '🇸🇦', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/22/Saudi_Pro_League_logo.svg/300px-Saudi_Pro_League_logo.svg.png', color: '#114b3f' },
  { id: 'mls', name: 'MLS', shortName: 'MLS', country: 'USA', region: 'AMERICAS', flag: '🇺🇸', logo: 'https://crests.football-data.org/MLS.png', color: '#002f6c' },
  { id: 'brasileirao', name: 'Brasileirão Série A', shortName: 'BRA', country: 'Brazil', region: 'AMERICAS', flag: '🇧🇷', logo: 'https://crests.football-data.org/BSA.png', color: '#009739' },
];

export function getLeagueInfo(leagueName: string): LeagueInfo {
  if (!leagueName) {
    return {
      id: 'world-sports',
      name: 'World Sports',
      shortName: 'SPT',
      country: 'International',
      region: 'GLOBAL',
      flag: '🌍',
      logo: 'https://crests.football-data.org/CL.png',
      color: '#10b981',
    };
  }

  const norm = leagueName.toLowerCase().trim();

  // Multi-Sport direct mapping
  if (norm.includes('wnba')) return GLOBAL_LEAGUES_CATALOG.find(l => l.id === 'wnba')!;
  if (norm.includes('nba') || norm.includes('basketball') || norm.includes('euroleague')) return GLOBAL_LEAGUES_CATALOG.find(l => l.id === 'nba')!;
  if (norm.includes('nfl') || norm.includes('american football') || norm.includes('college football')) return GLOBAL_LEAGUES_CATALOG.find(l => l.id === 'nfl')!;
  if (norm.includes('ufc') || norm.includes('mma') || norm.includes('boxing')) return GLOBAL_LEAGUES_CATALOG.find(l => l.id === 'ufc')!;
  if (norm.includes('tennis') || norm.includes('atp') || norm.includes('wta') || norm.includes('us open')) return GLOBAL_LEAGUES_CATALOG.find(l => l.id === 'atp-tennis')!;

  // Football leagues
  if (norm.includes('premier league') || norm.includes('epl')) return GLOBAL_LEAGUES_CATALOG.find(l => l.id === 'premier-league')!;
  if (norm.includes('carabao')) return GLOBAL_LEAGUES_CATALOG.find(l => l.id === 'carabao-cup')!;
  if (norm.includes('fa cup')) return GLOBAL_LEAGUES_CATALOG.find(l => l.id === 'fa-cup')!;
  if (norm.includes('championship')) return GLOBAL_LEAGUES_CATALOG.find(l => l.id === 'championship')!;
  if (norm.includes('la liga') || norm.includes('primera')) return GLOBAL_LEAGUES_CATALOG.find(l => l.id === 'la-liga')!;
  if (norm.includes('serie a')) return GLOBAL_LEAGUES_CATALOG.find(l => l.id === 'serie-a')!;
  if (norm.includes('bundesliga')) return GLOBAL_LEAGUES_CATALOG.find(l => l.id === 'bundesliga')!;
  if (norm.includes('ligue 1')) return GLOBAL_LEAGUES_CATALOG.find(l => l.id === 'ligue-1')!;
  if (norm.includes('champions league')) return GLOBAL_LEAGUES_CATALOG.find(l => l.id === 'uefa-cl')!;
  if (norm.includes('europa league')) return GLOBAL_LEAGUES_CATALOG.find(l => l.id === 'uefa-el')!;
  if (norm.includes('conference')) return GLOBAL_LEAGUES_CATALOG.find(l => l.id === 'uefa-ecl')!;
  if (norm.includes('npfl') || norm.includes('nigeria')) return GLOBAL_LEAGUES_CATALOG.find(l => l.id === 'npfl')!;
  if (norm.includes('saudi')) return GLOBAL_LEAGUES_CATALOG.find(l => l.id === 'saudi-pro-league')!;
  if (norm.includes('mls')) return GLOBAL_LEAGUES_CATALOG.find(l => l.id === 'mls')!;
  if (norm.includes('brasil') || norm.includes('brazil')) return GLOBAL_LEAGUES_CATALOG.find(l => l.id === 'brasileirao')!;

  return {
    id: 'league-' + norm.replace(/[^a-z0-9]/g, '-'),
    name: leagueName,
    shortName: leagueName.slice(0, 4).toUpperCase(),
    country: 'International',
    region: 'GLOBAL',
    flag: norm.includes('basket') ? '🏀' : norm.includes('nfl') ? '🏈' : norm.includes('ufc') ? '🥊' : norm.includes('tennis') ? '🎾' : '⚽',
    logo: 'https://crests.football-data.org/CL.png',
    color: '#10b981',
  };
}
