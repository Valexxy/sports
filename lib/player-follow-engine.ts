export interface FollowedPlayer {
  id: string;
  name: string;
  club: string;
  league: string;
  country: string;
  countryFlag: string;
  position: string;
  jerseyNumber: number;
  jerseyPhoto: string;
  rating: number;
  goals: number;
  assists: number;
  cleanSheets?: number;
  nextMatch: string;
  inPlayPick: string;
  marketValue: string;
  foot: 'Right' | 'Left' | 'Both';
  age: number;
  trophies: string[];
  matchFootprint: string;
}

export const FEATURED_PLAYERS_CATALOG: FollowedPlayer[] = [
  {
    id: 'p1',
    name: 'Victor Osimhen',
    club: 'Galatasaray',
    league: 'Trendyol Süper Lig',
    country: 'Nigeria',
    countryFlag: '🇳🇬',
    position: 'Striker (ST)',
    jerseyNumber: 45,
    jerseyPhoto: 'https://r2.thesportsdb.com/images/media/player/cutout/lw0qcf1769177786.png',
    rating: 89,
    goals: 28,
    assists: 6,
    marketValue: '€75.00m',
    foot: 'Right',
    age: 26,
    nextMatch: 'Galatasaray vs Besiktas (Sunday 19:00)',
    inPlayPick: 'Osimhen to Score Anytime @ 1.85',
    trophies: ['African Footballer of the Year 2023', 'Serie A Capocannoniere (26 Goals)', 'Scudetto Champion'],
    matchFootprint: 'First African Top Scorer in Serie A History',
  },
  {
    id: 'p2',
    name: 'Erling Haaland',
    club: 'Manchester City',
    league: 'Premier League',
    country: 'Norway',
    countryFlag: '🇳🇴',
    position: 'Striker (ST)',
    jerseyNumber: 9,
    jerseyPhoto: 'https://r2.thesportsdb.com/images/media/player/cutout/un3jr11769182465.png',
    rating: 93,
    goals: 34,
    assists: 7,
    marketValue: '€180.00m',
    foot: 'Left',
    age: 25,
    nextMatch: 'Man City vs Arsenal (Saturday 17:30)',
    inPlayPick: 'Haaland Over 1.5 Shots on Target @ 1.40',
    trophies: ['UEFA Champions League Winner', '2x Premier League Golden Boot', 'Premier League Record 36 Goals'],
    matchFootprint: '1.10 Goals per Game in UEFA Champions League',
  },
  {
    id: 'p3',
    name: 'Kylian Mbappé',
    club: 'Real Madrid',
    league: 'La Liga',
    country: 'France',
    countryFlag: '🇫🇷',
    position: 'Forward (LW / ST)',
    jerseyNumber: 9,
    jerseyPhoto: 'https://r2.thesportsdb.com/images/media/player/cutout/h9u9vz1733653583.png',
    rating: 92,
    goals: 31,
    assists: 9,
    marketValue: '€180.00m',
    foot: 'Right',
    age: 26,
    nextMatch: 'Real Madrid vs Atletico Madrid (Sunday 20:00)',
    inPlayPick: 'Mbappé to Score or Assist @ 1.48',
    trophies: ['FIFA World Cup Winner', 'FIFA World Cup Golden Boot (8 Goals)', '6x Ligue 1 Top Scorer'],
    matchFootprint: 'Over 300 Career Professional Goals',
  },
  {
    id: 'p4',
    name: 'Bukayo Saka',
    club: 'Arsenal',
    league: 'Premier League',
    country: 'England',
    countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    position: 'Right Winger (RW)',
    jerseyNumber: 7,
    jerseyPhoto: 'https://r2.thesportsdb.com/images/media/player/cutout/xfwok41769331816.png',
    rating: 88,
    goals: 18,
    assists: 15,
    marketValue: '€140.00m',
    foot: 'Left',
    age: 23,
    nextMatch: 'Arsenal vs Chelsea (Sunday 16:30)',
    inPlayPick: 'Saka Over 0.5 Assists / Crosses @ 1.95',
    trophies: ['England Men Player of the Year', 'PFA Young Player of the Year', 'FA Cup Winner'],
    matchFootprint: 'Arsenal Top Scorer & Assist Leader',
  },
  {
    id: 'p5',
    name: 'Jude Bellingham',
    club: 'Real Madrid',
    league: 'La Liga',
    country: 'England',
    countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    position: 'Attacking Midfield (CAM)',
    jerseyNumber: 5,
    jerseyPhoto: 'https://r2.thesportsdb.com/images/media/player/cutout/trk5271750271712.png',
    rating: 90,
    goals: 23,
    assists: 12,
    marketValue: '€180.00m',
    foot: 'Right',
    age: 22,
    nextMatch: 'Real Madrid vs Barcelona (El Clásico)',
    inPlayPick: 'Bellingham Over 2.5 Tackles & Shots @ 1.62',
    trophies: ['UEFA Champions League Winner', 'La Liga Player of the Season', 'Golden Boy Award Winner'],
    matchFootprint: 'Decisive El Clásico & UCL Winner',
  },
  {
    id: 'p6',
    name: 'Lamine Yamal',
    club: 'Barcelona',
    league: 'La Liga',
    country: 'Spain',
    countryFlag: '🇪🇸',
    position: 'Right Winger (RW)',
    jerseyNumber: 19,
    jerseyPhoto: 'https://r2.thesportsdb.com/images/media/player/cutout/y64q861750271676.png',
    rating: 87,
    goals: 14,
    assists: 18,
    marketValue: '€150.00m',
    foot: 'Left',
    age: 18,
    nextMatch: 'Barcelona vs Sevilla (Saturday 20:00)',
    inPlayPick: 'Yamal Over 1.5 Successful Dribbles @ 1.35',
    trophies: ['UEFA Euro 2024 Champion', 'UEFA Euro 2024 Best Young Player', 'Kopa Trophy Winner'],
    matchFootprint: 'Youngest Goalscorer in Euro History',
  },
  {
    id: 'p7',
    name: 'Ademola Lookman',
    club: 'Atalanta',
    league: 'Serie A',
    country: 'Nigeria',
    countryFlag: '🇳🇬',
    position: 'Forward (LW / SS)',
    jerseyNumber: 11,
    jerseyPhoto: 'https://r2.thesportsdb.com/images/media/player/cutout/p33mgl1769177815.png',
    rating: 86,
    goals: 21,
    assists: 10,
    marketValue: '€40.00m',
    foot: 'Right',
    age: 27,
    nextMatch: 'Atalanta vs Juventus (Sunday 17:00)',
    inPlayPick: 'Lookman to Score Anytime @ 2.20',
    trophies: ['UEFA Europa League Winner (Hat-trick in Final)', 'CAF Team of the Tournament', 'Atalanta Player of the Season'],
    matchFootprint: 'Historic Europa League Final Hat-trick',
  },
  {
    id: 'p8',
    name: 'Vinícius Júnior',
    club: 'Real Madrid',
    league: 'La Liga',
    country: 'Brazil',
    countryFlag: '🇧🇷',
    position: 'Left Winger (LW)',
    jerseyNumber: 7,
    jerseyPhoto: 'https://r2.thesportsdb.com/images/media/player/cutout/ejuxsh1750271859.png',
    rating: 91,
    goals: 26,
    assists: 14,
    marketValue: '€200.00m',
    foot: 'Right',
    age: 25,
    nextMatch: 'Real Madrid vs Atletico Madrid',
    inPlayPick: 'Vinícius to Score or Draw Penalty @ 1.60',
    trophies: ['2x UEFA Champions League Winner', 'UCL Player of the Season', '3x La Liga Champion'],
    matchFootprint: 'Goals in Two Separate UCL Finals',
  },
  {
    id: 'p9',
    name: 'Mohamed Salah',
    club: 'Liverpool',
    league: 'Premier League',
    country: 'Egypt',
    countryFlag: '🇪🇬',
    position: 'Right Winger (RW)',
    jerseyNumber: 11,
    jerseyPhoto: 'https://r2.thesportsdb.com/images/media/player/cutout/3blc581757088735.png',
    rating: 89,
    goals: 25,
    assists: 14,
    marketValue: '€55.00m',
    foot: 'Left',
    age: 33,
    nextMatch: 'Liverpool vs Everton (Merseyside Derby)',
    inPlayPick: 'Salah Over 2.5 Shots & Goal Contribution @ 1.55',
    trophies: ['UEFA Champions League Winner', 'Premier League Champion', '3x Premier League Golden Boot'],
    matchFootprint: 'All-Time African Top Scorer in Premier League',
  },
  {
    id: 'p10',
    name: 'Kevin De Bruyne',
    club: 'Manchester City',
    league: 'Premier League',
    country: 'Belgium',
    countryFlag: '🇧🇪',
    position: 'Midfield Maestro (CM)',
    jerseyNumber: 17,
    jerseyPhoto: 'https://r2.thesportsdb.com/images/media/player/cutout/o4flia1764089447.png',
    rating: 91,
    goals: 12,
    assists: 22,
    marketValue: '€45.00m',
    foot: 'Right',
    age: 34,
    nextMatch: 'Man City vs Arsenal (Saturday 17:30)',
    inPlayPick: 'De Bruyne Over 0.5 Assists @ 1.80',
    trophies: ['UEFA Champions League Winner', '6x Premier League Champion', '2x PFA Players Player of the Year'],
    matchFootprint: 'Over 100 Premier League Assists',
  },
  {
    id: 'p11',
    name: 'Cristiano Ronaldo',
    club: 'Al Nassr',
    league: 'Saudi Pro League',
    country: 'Portugal',
    countryFlag: '🇵🇹',
    position: 'Striker (ST)',
    jerseyNumber: 7,
    jerseyPhoto: 'https://r2.thesportsdb.com/images/media/player/cutout/a19jje1761592498.png',
    rating: 88,
    goals: 38,
    assists: 8,
    marketValue: '€15.00m',
    foot: 'Right',
    age: 40,
    nextMatch: 'Al Nassr vs Al Hilal (Friday 18:00)',
    inPlayPick: 'Ronaldo to Score Anytime @ 1.50',
    trophies: ['5x Ballon dOr Winner', '5x UEFA Champions League Winner', 'UEFA Euro 2016 Champion'],
    matchFootprint: 'All-Time Highest Goalscorer in Football History (900+ Goals)',
  },
  {
    id: 'p12',
    name: 'Lionel Messi',
    club: 'Inter Miami',
    league: 'Major League Soccer',
    country: 'Argentina',
    countryFlag: '🇦🇷',
    position: 'Forward (RW / CAM)',
    jerseyNumber: 10,
    jerseyPhoto: 'https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/45843.png&w=350&h=254',
    rating: 90,
    goals: 25,
    assists: 19,
    marketValue: '€25.00m',
    foot: 'Left',
    age: 38,
    nextMatch: 'Inter Miami vs LA Galaxy (Saturday 23:30)',
    inPlayPick: 'Messi to Score or Assist @ 1.30',
    trophies: ['8x Ballon dOr Winner', 'FIFA World Cup Champion (2022)', '4x UEFA Champions League Winner'],
    matchFootprint: 'Most Decorated Player in Football History (46 Trophies)',
  },
];

class PlayerFollowEngine {
  private storageKey = 'aurascore_followed_players';

  getFollowedPlayers(): string[] {
    if (typeof window === 'undefined') return ['Victor Osimhen', 'Erling Haaland'];
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : ['Victor Osimhen', 'Erling Haaland'];
    } catch {
      return ['Victor Osimhen', 'Erling Haaland'];
    }
  }

  toggleFollowPlayer(playerName: string): boolean {
    if (typeof window === 'undefined') return false;
    const current = this.getFollowedPlayers();
    let updated: string[];
    let isNowFollowing = false;

    if (current.includes(playerName)) {
      updated = current.filter((p) => p !== playerName);
    } else {
      updated = [...current, playerName];
      isNowFollowing = true;
    }

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(updated));
    } catch {}

    return isNowFollowing;
  }

  async sendLockScreenAlert(title: string, body: string): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
          body,
          icon: '/logo.svg',
          badge: '/logo.svg',
        });
        return true;
      }
    } catch {}
    return false;
  }
}

export const playerFollowEngine = new PlayerFollowEngine();
