export interface PlayerRecord {
  id: string;
  external_id: string;
  name: string;
  sport: string;
  position: string;
  jersey_number?: number;
  team_name: string;
  team_logo?: string;
  league: string;
  country: string;
  country_flag: string;
  date_of_birth: string;
  birth_month: number;
  birth_day: number;
  bio: string;
  market_value: string;
  foot: string;
  cutout_url: string;
  trophies: string[];
  career_stats: {
    goals: number;
    assists: number;
    appearances: number;
    rating: number;
  };
}

export const STAR_PLAYERS_CATALOG: PlayerRecord[] = [
  {
    id: "tsdb-osimhen",
    external_id: "tsdb-osimhen",
    name: "Victor Osimhen",
    sport: "SOCCER",
    position: "Striker (CF)",
    jersey_number: 45,
    team_name: "Galatasaray",
    team_logo: "https://r2.thesportsdb.com/images/media/team/badge/7lfxq21546777855.png",
    league: "Turkish Süper Lig",
    country: "Nigeria",
    country_flag: "🇳🇬",
    date_of_birth: "1998-12-29",
    birth_month: 12,
    birth_day: 29,
    bio: "African Player of the Year, Capocannoniere Serie A champion, elite athletic pressing forward leading Galatasaray and the Nigerian Super Eagles.",
    market_value: "€75,000,000",
    foot: "Right",
    cutout_url: "/players/osimhen.png",
    trophies: ["Serie A Champion (Napoli 2023)", "Capocannoniere Top Scorer", "African Footballer of the Year 2023"],
    career_stats: { goals: 26, assists: 5, appearances: 30, rating: 8.6 }
  },
  {
    id: "tsdb-haaland",
    external_id: "tsdb-haaland",
    name: "Erling Haaland",
    sport: "SOCCER",
    position: "Striker (CF)",
    jersey_number: 9,
    team_name: "Manchester City",
    team_logo: "https://r2.thesportsdb.com/images/media/team/badge/vwpvry1467462651.png",
    league: "English Premier League",
    country: "Norway",
    country_flag: "🇳🇴",
    date_of_birth: "2000-07-21",
    birth_month: 7,
    birth_day: 21,
    bio: "Premier League Golden Boot record breaker and UEFA Champions League treble winner with Manchester City.",
    market_value: "€180,000,000",
    foot: "Left",
    cutout_url: "/players/haaland.png",
    trophies: ["UEFA Champions League Winner 2023", "Premier League Record 36 Goals", "European Golden Shoe 2023"],
    career_stats: { goals: 38, assists: 6, appearances: 35, rating: 8.9 }
  },
  {
    id: "tsdb-mbappe",
    external_id: "tsdb-mbappe",
    name: "Kylian Mbappé",
    sport: "SOCCER",
    position: "Forward (LW/ST)",
    jersey_number: 9,
    team_name: "Real Madrid",
    team_logo: "https://r2.thesportsdb.com/images/media/team/badge/8p1v0m1712852230.png",
    league: "Spanish La Liga",
    country: "France",
    country_flag: "🇫🇷",
    date_of_birth: "1998-12-20",
    birth_month: 12,
    birth_day: 20,
    bio: "FIFA World Cup Winner, Golden Boot recipient, and Real Madrid galáctico forward.",
    market_value: "€180,000,000",
    foot: "Right",
    cutout_url: "/players/mbappe.png",
    trophies: ["FIFA World Cup Winner 2018", "World Cup Final Hat-Trick 2022", "6x Ligue 1 Golden Boot"],
    career_stats: { goals: 32, assists: 9, appearances: 34, rating: 8.8 }
  },
  {
    id: "tsdb-bellingham",
    external_id: "tsdb-bellingham",
    name: "Jude Bellingham",
    sport: "SOCCER",
    position: "Attacking Midfielder",
    jersey_number: 5,
    team_name: "Real Madrid",
    team_logo: "https://r2.thesportsdb.com/images/media/team/badge/8p1v0m1712852230.png",
    league: "Spanish La Liga",
    country: "England",
    country_flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    date_of_birth: "2003-06-29",
    birth_month: 6,
    birth_day: 29,
    bio: "Golden Boy winner, UEFA Champions League champion, and centerpiece of Real Madrid midfield.",
    market_value: "€180,000,000",
    foot: "Right",
    cutout_url: "/players/bellingham.png",
    trophies: ["UEFA Champions League Winner 2024", "La Liga Player of the Year 2024", "Kopa Trophy Winner"],
    career_stats: { goals: 23, assists: 13, appearances: 42, rating: 8.7 }
  },
  {
    id: "tsdb-saka",
    external_id: "tsdb-saka",
    name: "Bukayo Saka",
    sport: "SOCCER",
    position: "Right Winger (RW)",
    jersey_number: 7,
    team_name: "Arsenal",
    team_logo: "https://r2.thesportsdb.com/images/media/team/badge/uyhbfe1612467038.png",
    league: "English Premier League",
    country: "England",
    country_flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    date_of_birth: "2001-09-05",
    birth_month: 9,
    birth_day: 5,
    bio: "PFA Young Player of the Year, dynamic dribbler, and attacking engine for Arsenal FC and England.",
    market_value: "€140,000,000",
    foot: "Left",
    cutout_url: "/players/saka.png",
    trophies: ["PFA Young Player of the Year", "England Men Player of the Year (2x)", "FA Community Shield"],
    career_stats: { goals: 18, assists: 14, appearances: 39, rating: 8.5 }
  },
  {
    id: "tsdb-yamal",
    external_id: "tsdb-yamal",
    name: "Lamine Yamal",
    sport: "SOCCER",
    position: "Right Winger (RW)",
    jersey_number: 19,
    team_name: "Barcelona",
    team_logo: "https://r2.thesportsdb.com/images/media/team/badge/e016911546777789.png",
    league: "Spanish La Liga",
    country: "Spain",
    country_flag: "🇪🇸",
    date_of_birth: "2007-07-13",
    birth_month: 7,
    birth_day: 13,
    bio: "UEFA Euro 2024 Champion, Young Player of the Tournament, and generational wonderkid from La Masia.",
    market_value: "€150,000,000",
    foot: "Left",
    cutout_url: "/players/yamal.png",
    trophies: ["UEFA Euro 2024 Champion", "Euro 2024 Young Player of the Tournament", "La Liga Champion 2023"],
    career_stats: { goals: 12, assists: 17, appearances: 44, rating: 8.8 }
  },
  {
    id: "tsdb-lookman",
    external_id: "tsdb-lookman",
    name: "Ademola Lookman",
    sport: "SOCCER",
    position: "Winger / Forward",
    jersey_number: 11,
    team_name: "Atalanta",
    team_logo: "https://r2.thesportsdb.com/images/media/team/badge/5k1k9r1546777901.png",
    league: "Italian Serie A",
    country: "Nigeria",
    country_flag: "🇳🇬",
    date_of_birth: "1997-10-20",
    birth_month: 10,
    birth_day: 20,
    bio: "UEFA Europa League Final hat-trick hero and talismanic forward for Atalanta and Nigeria Super Eagles.",
    market_value: "€40,000,000",
    foot: "Right",
    cutout_url: "/players/lookman.png",
    trophies: ["UEFA Europa League Winner (Final Hat-trick 2024)", "Ballon d Or Top 14 Nominee 2024", "AFCON Silver Medalist"],
    career_stats: { goals: 17, assists: 10, appearances: 36, rating: 8.6 }
  },
  {
    id: "tsdb-messi",
    external_id: "tsdb-messi",
    name: "Lionel Messi",
    sport: "SOCCER",
    position: "Forward / Playmaker",
    jersey_number: 10,
    team_name: "Inter Miami",
    team_logo: "https://r2.thesportsdb.com/images/media/team/badge/035j3f1692120468.png",
    league: "Major League Soccer",
    country: "Argentina",
    country_flag: "🇦🇷",
    date_of_birth: "1987-06-24",
    birth_month: 6,
    birth_day: 24,
    bio: "8-time Ballon d Or winner, FIFA World Cup Champion, and widely considered the greatest footballer of all time.",
    market_value: "€30,000,000",
    foot: "Left",
    cutout_url: "/players/messi.png",
    trophies: ["8x Ballon d Or Winner", "FIFA World Cup Champion 2022", "4x UEFA Champions League Winner"],
    career_stats: { goals: 25, assists: 16, appearances: 28, rating: 9.2 }
  },
  {
    id: "tsdb-ronaldo",
    external_id: "tsdb-ronaldo",
    name: "Cristiano Ronaldo",
    sport: "SOCCER",
    position: "Striker (CF)",
    jersey_number: 7,
    team_name: "Al Nassr",
    team_logo: "https://r2.thesportsdb.com/images/media/team/badge/al_nassr_fc.png",
    league: "Saudi Pro League",
    country: "Portugal",
    country_flag: "🇵🇹",
    date_of_birth: "1985-02-05",
    birth_month: 2,
    birth_day: 5,
    bio: "5-time Ballon d Or winner, all-time leading international goalscorer in football history, and 5x Champions League winner.",
    market_value: "€15,000,000",
    foot: "Right",
    cutout_url: "/players/ronaldo.png",
    trophies: ["5x Ballon d Or Winner", "5x UEFA Champions League Winner", "UEFA Euro 2016 Champion"],
    career_stats: { goals: 44, assists: 12, appearances: 45, rating: 8.7 }
  }
];
