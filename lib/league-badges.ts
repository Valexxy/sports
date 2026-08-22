// Comprehensive League Badge & Icon Mapping Engine
export interface LeagueInfo {
  name: string;
  shortName: string;
  flag: string;
  logo: string;
  color: string;
}

const LEAGUE_DATABASE: Record<string, LeagueInfo> = {
  'premier league': {
    name: 'Premier League',
    shortName: 'EPL',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    logo: 'https://crests.football-data.org/PL.png',
    color: '#3d195b',
  },
  'uefa champions league': {
    name: 'UEFA Champions League',
    shortName: 'UCL',
    flag: '⭐',
    logo: 'https://crests.football-data.org/CL.png',
    color: '#0e1e5b',
  },
  'uefa europa league': {
    name: 'UEFA Europa League',
    shortName: 'UEL',
    flag: '🟠',
    logo: 'https://crests.football-data.org/EL.png',
    color: '#f68e1e',
  },
  'la liga': {
    name: 'La Liga',
    shortName: 'LL',
    flag: '🇪🇸',
    logo: 'https://crests.football-data.org/PD.png',
    color: '#ee152d',
  },
  'primera division': {
    name: 'La Liga',
    shortName: 'LL',
    flag: '🇪🇸',
    logo: 'https://crests.football-data.org/PD.png',
    color: '#ee152d',
  },
  'es primera division': {
    name: 'La Liga',
    shortName: 'LL',
    flag: '🇪🇸',
    logo: 'https://crests.football-data.org/PD.png',
    color: '#ee152d',
  },
  'serie a': {
    name: 'Serie A',
    shortName: 'SA',
    flag: '🇮🇹',
    logo: 'https://crests.football-data.org/SA.png',
    color: '#024494',
  },
  'it serie a': {
    name: 'Serie A',
    shortName: 'SA',
    flag: '🇮🇹',
    logo: 'https://crests.football-data.org/SA.png',
    color: '#024494',
  },
  'bundesliga': {
    name: 'Bundesliga',
    shortName: 'BL',
    flag: '🇩🇪',
    logo: 'https://crests.football-data.org/BL1.png',
    color: '#d20515',
  },
  'de bundesliga': {
    name: 'Bundesliga',
    shortName: 'BL',
    flag: '🇩🇪',
    logo: 'https://crests.football-data.org/BL1.png',
    color: '#d20515',
  },
  'ligue 1': {
    name: 'Ligue 1',
    shortName: 'L1',
    flag: '🇫🇷',
    logo: 'https://crests.football-data.org/FL1.png',
    color: '#dae025',
  },
  'fr ligue 1': {
    name: 'Ligue 1',
    shortName: 'L1',
    flag: '🇫🇷',
    logo: 'https://crests.football-data.org/FL1.png',
    color: '#dae025',
  },
  'championship': {
    name: 'EFL Championship',
    shortName: 'EFL',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    logo: 'https://crests.football-data.org/ELC.png',
    color: '#1a2b4c',
  },
  'npfl': {
    name: 'Nigeria Premier Football League',
    shortName: 'NPFL',
    flag: '🇳🇬',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f0/Nigeria_Premier_Football_League_logo.png/220px-Nigeria_Premier_Football_League_logo.png',
    color: '#008751',
  },
  'nigeria premier league': {
    name: 'Nigeria Premier Football League',
    shortName: 'NPFL',
    flag: '🇳🇬',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f0/Nigeria_Premier_Football_League_logo.png/220px-Nigeria_Premier_Football_League_logo.png',
    color: '#008751',
  },
  'copa libertadores': {
    name: 'Copa Libertadores',
    shortName: 'LIB',
    flag: '🏆',
    logo: 'https://crests.football-data.org/CLI.png',
    color: '#c29b38',
  },
  'major league soccer': {
    name: 'MLS',
    shortName: 'MLS',
    flag: '🇺🇸',
    logo: 'https://crests.football-data.org/MLS.png',
    color: '#002f6c',
  },
  'saudi pro league': {
    name: 'Saudi Pro League',
    shortName: 'SPL',
    flag: '🇸🇦',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/22/Saudi_Pro_League_logo.svg/300px-Saudi_Pro_League_logo.svg.png',
    color: '#114b3f',
  },
  'eredivisie': {
    name: 'Eredivisie',
    shortName: 'ERE',
    flag: '🇳🇱',
    logo: 'https://crests.football-data.org/DED.png',
    color: '#001c38',
  },
  'primeira liga': {
    name: 'Primeira Liga',
    shortName: 'POR',
    flag: '🇵🇹',
    logo: 'https://crests.football-data.org/PPL.png',
    color: '#e30613',
  },
};

export function getLeagueInfo(leagueName: string): LeagueInfo {
  const norm = (leagueName || '').toLowerCase().trim();
  for (const [key, info] of Object.entries(LEAGUE_DATABASE)) {
    if (norm.includes(key)) return info;
  }
  return {
    name: leagueName || 'Football League',
    shortName: (leagueName || 'SOC').slice(0, 3).toUpperCase(),
    flag: '⚽',
    logo: '',
    color: '#10b981',
  };
}
