// Comprehensive Global League Badges & Country Mapping Engine (35+ World Leagues)

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
  // 🏴󠁧󠁢󠁥󠁮󠁧󠁿 England
  { id: 'premier-league', name: 'Premier League', shortName: 'EPL', country: 'England', region: 'EUROPE', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', logo: 'https://crests.football-data.org/PL.png', color: '#3d195b' },
  { id: 'championship', name: 'EFL Championship', shortName: 'EFL', country: 'England', region: 'EUROPE', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', logo: 'https://crests.football-data.org/ELC.png', color: '#1a2b4c' },
  { id: 'fa-cup', name: 'FA Cup', shortName: 'FAC', country: 'England', region: 'EUROPE', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', logo: 'https://crests.football-data.org/FAC.png', color: '#c8102e' },
  
  // 🇪🇸 Spain
  { id: 'la-liga', name: 'La Liga', shortName: 'LL', country: 'Spain', region: 'EUROPE', flag: '🇪🇸', logo: 'https://crests.football-data.org/PD.png', color: '#ee152d' },
  { id: 'copa-del-rey', name: 'Copa del Rey', shortName: 'CDR', country: 'Spain', region: 'EUROPE', flag: '🇪🇸', logo: 'https://crests.football-data.org/CDR.png', color: '#ffd700' },

  // 🇮🇹 Italy
  { id: 'serie-a', name: 'Serie A', shortName: 'SA', country: 'Italy', region: 'EUROPE', flag: '🇮🇹', logo: 'https://crests.football-data.org/SA.png', color: '#024494' },
  { id: 'coppa-italia', name: 'Coppa Italia', shortName: 'CI', country: 'Italy', region: 'EUROPE', flag: '🇮🇹', logo: 'https://crests.football-data.org/CI.png', color: '#008d44' },

  // 🇩🇪 Germany
  { id: 'bundesliga', name: 'Bundesliga', shortName: 'BL', country: 'Germany', region: 'EUROPE', flag: '🇩🇪', logo: 'https://crests.football-data.org/BL1.png', color: '#d20515' },
  { id: 'dfb-pokal', name: 'DFB Pokal', shortName: 'DFB', country: 'Germany', region: 'EUROPE', flag: '🇩🇪', logo: 'https://crests.football-data.org/DFB.png', color: '#006633' },

  // 🇫🇷 France
  { id: 'ligue-1', name: 'Ligue 1', shortName: 'L1', country: 'France', region: 'EUROPE', flag: '🇫🇷', logo: 'https://crests.football-data.org/FL1.png', color: '#dae025' },

  // 🇳🇬 Nigeria & Africa
  { id: 'npfl', name: 'Nigeria Premier Football League', shortName: 'NPFL', country: 'Nigeria', region: 'AFRICA', flag: '🇳🇬', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f0/Nigeria_Premier_Football_League_logo.png/220px-Nigeria_Premier_Football_League_logo.png', color: '#008751' },
  { id: 'caf-cl', name: 'CAF Champions League', shortName: 'CAF', country: 'Africa', region: 'AFRICA', flag: '🌍', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/77/CAF_Champions_League_logo.svg/200px-CAF_Champions_League_logo.svg.png', color: '#00843d' },
  { id: 'afcon', name: 'Africa Cup of Nations', shortName: 'AFCON', country: 'Africa', region: 'AFRICA', flag: '🌍', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/91/Africa_Cup_of_Nations_logo.svg/200px-Africa_Cup_of_Nations_logo.svg.png', color: '#fcd116' },
  { id: 'psl-south-africa', name: 'Betway Premiership', shortName: 'PSL', country: 'South Africa', region: 'AFRICA', flag: '🇿🇦', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7b/Premier_Soccer_League_logo.svg/200px-Premier_Soccer_League_logo.svg.png', color: '#e03a3e' },
  { id: 'egyptian-pl', name: 'Egyptian Premier League', shortName: 'EGY', country: 'Egypt', region: 'AFRICA', flag: '🇪🇬', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/74/Egyptian_Premier_League_logo.png/200px-Egyptian_Premier_League_logo.png', color: '#c09300' },
  { id: 'ghana-pl', name: 'Ghana Premier League', shortName: 'GPL', country: 'Ghana', region: 'AFRICA', flag: '🇬🇭', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/52/Ghana_Premier_League_logo.png/200px-Ghana_Premier_League_logo.png', color: '#006b3f' },

  // 🏆 UEFA / Continental Europe
  { id: 'uefa-cl', name: 'UEFA Champions League', shortName: 'UCL', country: 'Europe', region: 'EUROPE', flag: '⭐', logo: 'https://crests.football-data.org/CL.png', color: '#0e1e5b' },
  { id: 'uefa-el', name: 'UEFA Europa League', shortName: 'UEL', country: 'Europe', region: 'EUROPE', flag: '🟠', logo: 'https://crests.football-data.org/EL.png', color: '#f68e1e' },
  { id: 'uefa-ecl', name: 'UEFA Conference League', shortName: 'UECL', country: 'Europe', region: 'EUROPE', flag: '🟢', logo: 'https://crests.football-data.org/ECL.png', color: '#00c853' },

  // 🇸🇦 Middle East & Asia
  { id: 'saudi-pro-league', name: 'Saudi Pro League', shortName: 'SPL', country: 'Saudi Arabia', region: 'ASIA_MIDDLE_EAST', flag: '🇸🇦', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/22/Saudi_Pro_League_logo.svg/300px-Saudi_Pro_League_logo.svg.png', color: '#114b3f' },
  { id: 'j1-league', name: 'J1 League', shortName: 'J1', country: 'Japan', region: 'ASIA_MIDDLE_EAST', flag: '🇯🇵', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/J._League_logo.svg/200px-J._League_logo.svg.png', color: '#e60012' },
  { id: 'csl-china', name: 'Chinese Super League', shortName: 'CSL', country: 'China', region: 'ASIA_MIDDLE_EAST', flag: '🇨🇳', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e9/Chinese_Super_League_logo.svg/200px-Chinese_Super_League_logo.svg.png', color: '#de2910' },

  // 🇺🇸 & 🇲🇽 Americas
  { id: 'mls', name: 'MLS (Major League Soccer)', shortName: 'MLS', country: 'USA', region: 'AMERICAS', flag: '🇺🇸', logo: 'https://crests.football-data.org/MLS.png', color: '#002f6c' },
  { id: 'liga-mx', name: 'Liga MX', shortName: 'MX', country: 'Mexico', region: 'AMERICAS', flag: '🇲🇽', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e2/Liga_MX_logo.svg/200px-Liga_MX_logo.svg.png', color: '#006847' },
  { id: 'brasileirao', name: 'Brasileirão Série A', shortName: 'BRA', country: 'Brazil', region: 'AMERICAS', flag: '🇧🇷', logo: 'https://crests.football-data.org/BSA.png', color: '#009739' },
  { id: 'argentina-primera', name: 'Liga Profesional Argentina', shortName: 'ARG', country: 'Argentina', region: 'AMERICAS', flag: '🇦🇷', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b3/Liga_Profesional_de_F%C3%BAtbol_logo.svg/200px-Liga_Profesional_de_F%C3%BAtbol_logo.svg.png', color: '#74acdf' },
  { id: 'copa-libertadores', name: 'Copa Libertadores', shortName: 'LIB', country: 'South America', region: 'AMERICAS', flag: '🏆', logo: 'https://crests.football-data.org/CLI.png', color: '#c29b38' },

  // 🇳🇱, 🇵🇹, 🇹🇷, 🏴󠁧󠁢󠁳󠁣󠁴󠁿 Other European Top Leagues
  { id: 'eredivisie', name: 'Eredivisie', shortName: 'ERE', country: 'Netherlands', region: 'EUROPE', flag: '🇳🇱', logo: 'https://crests.football-data.org/DED.png', color: '#001c38' },
  { id: 'primeira-liga', name: 'Primeira Liga', shortName: 'POR', country: 'Portugal', region: 'EUROPE', flag: '🇵🇹', logo: 'https://crests.football-data.org/PPL.png', color: '#e30613' },
  { id: 'super-lig', name: 'Trendyol Süper Lig', shortName: 'TUR', country: 'Turkey', region: 'EUROPE', flag: '🇹🇷', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/S%C3%BCper_Lig_logo.svg/200px-S%C3%BCper_Lig_logo.svg.png', color: '#e30a17' },
  { id: 'scottish-prem', name: 'Scottish Premiership', shortName: 'SCO', country: 'Scotland', region: 'EUROPE', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/Scottish_Premiership_logo.svg/200px-Scottish_Premiership_logo.svg.png', color: '#002d62' },
  { id: 'belgian-pro', name: 'Belgian Pro League', shortName: 'BEL', country: 'Belgium', region: 'EUROPE', flag: '🇧🇪', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Belgian_Pro_League_logo.svg/200px-Belgian_Pro_League_logo.svg.png', color: '#ffd100' },

  // 🌍 Global / International
  { id: 'world-cup-qualifiers', name: 'FIFA World Cup Qualifiers', shortName: 'WCQ', country: 'International', region: 'GLOBAL', flag: '🌍', logo: 'https://crests.football-data.org/WC.png', color: '#003399' },
  { id: 'club-world-cup', name: 'FIFA Club World Cup', shortName: 'CWC', country: 'International', region: 'GLOBAL', flag: '🌐', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2f/FIFA_Club_World_Cup_logo.svg/200px-FIFA_Club_World_Cup_logo.svg.png', color: '#d4af37' },
];

export function getLeagueInfo(leagueName: string): LeagueInfo {
  const norm = (leagueName || '').toLowerCase().trim();
  for (const item of GLOBAL_LEAGUES_CATALOG) {
    if (
      norm.includes(item.id) ||
      norm.includes(item.name.toLowerCase()) ||
      norm.includes(item.shortName.toLowerCase()) ||
      norm.includes(item.country.toLowerCase())
    ) {
      return item;
    }
  }
  return {
    id: 'soccer-league',
    name: leagueName || 'World Soccer League',
    shortName: (leagueName || 'SOC').slice(0, 3).toUpperCase(),
    country: 'International',
    region: 'GLOBAL',
    flag: '⚽',
    logo: '',
    color: '#10b981',
  };
}
