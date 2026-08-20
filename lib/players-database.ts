export interface PlayerProfile {
  id: string;
  name: string;
  birthdate: string; // e.g. "Sep 5, 2001"
  age: number;
  sport: 'SOCCER' | 'BASKETBALL' | 'TENNIS';
  team: string;
  flag: string;
  photoEmoji: string;
  position: string;
  careerGoals: string;
  isBirthdayToday?: boolean;
}

export const PLAYERS_DATABASE: PlayerProfile[] = [
  {
    id: 'p-saka',
    name: 'Bukayo Saka',
    birthdate: 'September 5, 2001',
    age: 24,
    sport: 'SOCCER',
    team: 'Arsenal FC',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    photoEmoji: '⚽🔴',
    position: 'Right Winger',
    careerGoals: '68 Goals, 58 Assists in 220 Caps',
    isBirthdayToday: true,
  },
  {
    id: 'p-mbappe',
    name: 'Kylian Mbappé',
    birthdate: 'December 20, 1998',
    age: 27,
    sport: 'SOCCER',
    team: 'Real Madrid',
    flag: '🇫🇷',
    photoEmoji: '⚽⚪',
    position: 'Forward',
    careerGoals: '290 Goals, World Cup Champion',
    isBirthdayToday: false,
  },
  {
    id: 'p-tatum',
    name: 'Jayson Tatum',
    birthdate: 'March 3, 1998',
    age: 28,
    sport: 'BASKETBALL',
    team: 'Boston Celtics',
    flag: '🇺🇸',
    photoEmoji: '🏀☘️',
    position: 'Small Forward',
    careerGoals: '26.9 PPG, 8.1 RPG, NBA Champion',
    isBirthdayToday: true,
  },
  {
    id: 'p-alcaraz',
    name: 'Carlos Alcaraz',
    birthdate: 'May 5, 2003',
    age: 23,
    sport: 'TENNIS',
    team: 'ATP Spain',
    flag: '🇪🇸',
    photoEmoji: '🎾🇪🇸',
    position: 'Singles Master',
    careerGoals: '4x Grand Slam Champion',
    isBirthdayToday: false,
  },
  {
    id: 'p-haaland',
    name: 'Erling Haaland',
    birthdate: 'July 21, 2000',
    age: 26,
    sport: 'SOCCER',
    team: 'Manchester City',
    flag: '🇳🇴',
    photoEmoji: '⚽🩵',
    position: 'Striker',
    careerGoals: '240 Goals, Premier League Golden Boot',
    isBirthdayToday: false,
  },
];
