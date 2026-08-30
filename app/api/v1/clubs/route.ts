import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export interface ClubSummary {
  name: string;
  shortName: string;
  league: string;
  country: string;
  stadium: string;
  capacity: number;
  manager: string;
  crest: string;
  dominantColor: string;
  founded: number;
}

const FEATURED_CLUBS: ClubSummary[] = [
  {
    name: 'Chelsea FC',
    shortName: 'Chelsea',
    league: 'Premier League',
    country: 'England',
    stadium: 'Stamford Bridge',
    capacity: 40343,
    manager: 'Enzo Maresca',
    crest: 'https://crests.football-data.org/61.png',
    dominantColor: '#034694',
    founded: 1905,
  },
  {
    name: 'Arsenal FC',
    shortName: 'Arsenal',
    league: 'Premier League',
    country: 'England',
    stadium: 'Emirates Stadium',
    capacity: 60704,
    manager: 'Mikel Arteta',
    crest: 'https://crests.football-data.org/57.png',
    dominantColor: '#EF0107',
    founded: 1886,
  },
  {
    name: 'Manchester City',
    shortName: 'Man City',
    league: 'Premier League',
    country: 'England',
    stadium: 'Etihad Stadium',
    capacity: 53400,
    manager: 'Pep Guardiola',
    crest: 'https://crests.football-data.org/65.png',
    dominantColor: '#6CABDD',
    founded: 1880,
  },
  {
    name: 'Liverpool FC',
    shortName: 'Liverpool',
    league: 'Premier League',
    country: 'England',
    stadium: 'Anfield',
    capacity: 61276,
    manager: 'Arne Slot',
    crest: 'https://crests.football-data.org/64.png',
    dominantColor: '#C8102E',
    founded: 1892,
  },
  {
    name: 'Manchester United',
    shortName: 'Man United',
    league: 'Premier League',
    country: 'England',
    stadium: 'Old Trafford',
    capacity: 74310,
    manager: 'Rúben Amorim',
    crest: 'https://crests.football-data.org/66.png',
    dominantColor: '#DA291C',
    founded: 1878,
  },
  {
    name: 'Real Madrid CF',
    shortName: 'Real Madrid',
    league: 'La Liga',
    country: 'Spain',
    stadium: 'Santiago Bernabéu',
    capacity: 85000,
    manager: 'Carlo Ancelotti',
    crest: 'https://crests.football-data.org/86.png',
    dominantColor: '#FEBE10',
    founded: 1902,
  },
  {
    name: 'FC Barcelona',
    shortName: 'Barcelona',
    league: 'La Liga',
    country: 'Spain',
    stadium: 'Spotify Camp Nou',
    capacity: 99354,
    manager: 'Hansi Flick',
    crest: 'https://crests.football-data.org/81.png',
    dominantColor: '#004D98',
    founded: 1899,
  },
  {
    name: 'FC Bayern München',
    shortName: 'Bayern',
    league: 'Bundesliga',
    country: 'Germany',
    stadium: 'Allianz Arena',
    capacity: 75024,
    manager: 'Vincent Kompany',
    crest: 'https://crests.football-data.org/5.png',
    dominantColor: '#DC052D',
    founded: 1900,
  },
  {
    name: 'Paris Saint-Germain',
    shortName: 'PSG',
    league: 'Ligue 1',
    country: 'France',
    stadium: 'Parc des Princes',
    capacity: 48583,
    manager: 'Luis Enrique',
    crest: 'https://crests.football-data.org/524.png',
    dominantColor: '#004170',
    founded: 1970,
  },
  {
    name: 'FC Internazionale Milano',
    shortName: 'Inter Milan',
    league: 'Serie A',
    country: 'Italy',
    stadium: 'San Siro',
    capacity: 75923,
    manager: 'Simone Inzaghi',
    crest: 'https://crests.football-data.org/108.png',
    dominantColor: '#010E80',
    founded: 1908,
  },
  {
    name: 'Juventus FC',
    shortName: 'Juventus',
    league: 'Serie A',
    country: 'Italy',
    stadium: 'Allianz Stadium',
    capacity: 41507,
    manager: 'Thiago Motta',
    crest: 'https://crests.football-data.org/109.png',
    dominantColor: '#000000',
    founded: 1897,
  },
  {
    name: 'Bayer 04 Leverkusen',
    shortName: 'Leverkusen',
    league: 'Bundesliga',
    country: 'Germany',
    stadium: 'BayArena',
    capacity: 30210,
    manager: 'Xabi Alonso',
    crest: 'https://crests.football-data.org/3.png',
    dominantColor: '#E32221',
    founded: 1904,
  }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    count: FEATURED_CLUBS.length,
    data: FEATURED_CLUBS,
  });
}
