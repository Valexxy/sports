export interface PlayerMatchFootprint {
  opponent: string;
  opponentLogo: string;
  date: string;
  minutes: number;
  rating: number;
  goals: number;
  assists: number;
  keyPasses: number;
  tackles: number;
  shotsOnTarget: number;
}

export interface DeepPlayerEntity {
  id: string;
  name: string;
  fullName?: string;
  number: number;
  position: 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';
  specificRole: string;
  nationality: string;
  natFlag: string;
  age: number;
  birthDate: string;
  height: string;
  weight: string;
  preferredFoot: 'Right' | 'Left' | 'Both';
  marketValue: string;
  contractUntil: string;
  currentClub: string;
  pastClubs: { club: string; years: string; apps: number; goals: number }[];
  seasonStats: {
    appearances: number;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
    xG: number;
    xA: number;
    passAccuracy: string;
  };
  matchFootprints: PlayerMatchFootprint[];
}

export const REAL_CLUB_SQUADS: Record<string, DeepPlayerEntity[]> = {
  'Newcastle': [
    {
      id: 'isak-14',
      name: 'Alexander Isak',
      fullName: 'Alexander Isak',
      number: 14,
      position: 'Forward',
      specificRole: 'Center Forward / Striker',
      nationality: 'Sweden',
      natFlag: '🇸🇪',
      age: 26,
      birthDate: '1999-09-21',
      height: '192 cm',
      weight: '77 kg',
      preferredFoot: 'Right',
      marketValue: '€75.00m',
      contractUntil: '2028',
      currentClub: 'Newcastle United',
      pastClubs: [
        { club: 'Real Sociedad', years: '2019 - 2022', apps: 132, goals: 44 },
        { club: 'Willem II (Loan)', years: '2019', apps: 18, goals: 14 },
        { club: 'Borussia Dortmund', years: '2017 - 2019', apps: 13, goals: 1 },
      ],
      seasonStats: { appearances: 30, goals: 21, assists: 2, yellowCards: 2, redCards: 0, xG: 19.4, xA: 3.1, passAccuracy: '78%' },
      matchFootprints: [
        { opponent: 'Southampton', opponentLogo: 'https://crests.football-data.org/340.png', date: '2026-08-17', minutes: 90, rating: 8.4, goals: 1, assists: 1, keyPasses: 3, tackles: 1, shotsOnTarget: 3 },
        { opponent: 'Tottenham', opponentLogo: 'https://crests.football-data.org/73.png', date: '2026-05-19', minutes: 88, rating: 9.1, goals: 2, assists: 0, keyPasses: 2, tackles: 0, shotsOnTarget: 4 },
        { opponent: 'Chelsea', opponentLogo: 'https://crests.football-data.org/61.png', date: '2026-05-11', minutes: 90, rating: 7.6, goals: 1, assists: 0, keyPasses: 1, tackles: 2, shotsOnTarget: 2 },
      ],
    },
    {
      id: 'gordon-10',
      name: 'Anthony Gordon',
      fullName: 'Anthony Michael Gordon',
      number: 10,
      position: 'Forward',
      specificRole: 'Left Winger',
      nationality: 'England',
      natFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      age: 25,
      birthDate: '2001-02-24',
      height: '183 cm',
      weight: '73 kg',
      preferredFoot: 'Right',
      marketValue: '€60.00m',
      contractUntil: '2029',
      currentClub: 'Newcastle United',
      pastClubs: [
        { club: 'Everton', years: '2019 - 2023', apps: 78, goals: 7 },
      ],
      seasonStats: { appearances: 35, goals: 11, assists: 10, yellowCards: 8, redCards: 0, xG: 9.8, xA: 8.5, passAccuracy: '81%' },
      matchFootprints: [
        { opponent: 'Southampton', opponentLogo: 'https://crests.football-data.org/340.png', date: '2026-08-17', minutes: 90, rating: 7.9, goals: 0, assists: 1, keyPasses: 4, tackles: 3, shotsOnTarget: 2 },
      ],
    },
    {
      id: 'bruno-39',
      name: 'Bruno Guimarães',
      fullName: 'Bruno Guimarães Rodriguez Moura',
      number: 39,
      position: 'Midfielder',
      specificRole: 'Central Midfielder / Playmaker',
      nationality: 'Brazil',
      natFlag: '🇧🇷',
      age: 28,
      birthDate: '1997-11-16',
      height: '182 cm',
      weight: '75 kg',
      preferredFoot: 'Right',
      marketValue: '€85.00m',
      contractUntil: '2028',
      currentClub: 'Newcastle United',
      pastClubs: [
        { club: 'Lyon', years: '2020 - 2022', apps: 71, goals: 3 },
      ],
      seasonStats: { appearances: 37, goals: 7, assists: 8, yellowCards: 9, redCards: 0, xG: 5.2, xA: 7.8, passAccuracy: '88%' },
      matchFootprints: [
        { opponent: 'Southampton', opponentLogo: 'https://crests.football-data.org/340.png', date: '2026-08-17', minutes: 90, rating: 8.5, goals: 0, assists: 0, keyPasses: 5, tackles: 5, shotsOnTarget: 1 },
      ],
    },
    {
      id: 'tonali-8',
      name: 'Sandro Tonali',
      fullName: 'Sandro Tonali',
      number: 8,
      position: 'Midfielder',
      specificRole: 'Box-to-Box Midfielder',
      nationality: 'Italy',
      natFlag: '🇮🇹',
      age: 26,
      birthDate: '2000-05-08',
      height: '181 cm',
      weight: '77 kg',
      preferredFoot: 'Right',
      marketValue: '€45.00m',
      contractUntil: '2028',
      currentClub: 'Newcastle United',
      pastClubs: [
        { club: 'AC Milan', years: '2020 - 2023', apps: 130, goals: 7 },
      ],
      seasonStats: { appearances: 24, goals: 3, assists: 4, yellowCards: 4, redCards: 0, xG: 2.5, xA: 3.8, passAccuracy: '86%' },
      matchFootprints: [
        { opponent: 'Southampton', opponentLogo: 'https://crests.football-data.org/340.png', date: '2026-08-17', minutes: 75, rating: 7.7, goals: 0, assists: 0, keyPasses: 3, tackles: 4, shotsOnTarget: 1 },
      ],
    },
    {
      id: 'trippier-2',
      name: 'Kieran Trippier',
      fullName: 'Kieran John Trippier',
      number: 2,
      position: 'Defender',
      specificRole: 'Right Back',
      nationality: 'England',
      natFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      age: 35,
      birthDate: '1990-09-19',
      height: '178 cm',
      weight: '72 kg',
      preferredFoot: 'Right',
      marketValue: '€10.00m',
      contractUntil: '2026',
      currentClub: 'Newcastle United',
      pastClubs: [
        { club: 'Atletico Madrid', years: '2019 - 2022', apps: 86, goals: 0 },
        { club: 'Tottenham Hotspur', years: '2015 - 2019', apps: 114, goals: 2 },
      ],
      seasonStats: { appearances: 32, goals: 1, assists: 10, yellowCards: 5, redCards: 0, xG: 1.1, xA: 9.2, passAccuracy: '84%' },
      matchFootprints: [
        { opponent: 'Southampton', opponentLogo: 'https://crests.football-data.org/340.png', date: '2026-08-17', minutes: 90, rating: 8.1, goals: 0, assists: 1, keyPasses: 4, tackles: 3, shotsOnTarget: 1 },
      ],
    },
    {
      id: 'pope-22',
      name: 'Nick Pope',
      fullName: 'Nicholas David Pope',
      number: 22,
      position: 'Goalkeeper',
      specificRole: 'First Team Goalkeeper',
      nationality: 'England',
      natFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      age: 34,
      birthDate: '1992-04-19',
      height: '198 cm',
      weight: '86 kg',
      preferredFoot: 'Right',
      marketValue: '€15.00m',
      contractUntil: '2027',
      currentClub: 'Newcastle United',
      pastClubs: [
        { club: 'Burnley', years: '2016 - 2022', apps: 155, goals: 0 },
      ],
      seasonStats: { appearances: 29, goals: 0, assists: 0, yellowCards: 1, redCards: 0, xG: 0, xA: 0, passAccuracy: '68%' },
      matchFootprints: [
        { opponent: 'Southampton', opponentLogo: 'https://crests.football-data.org/340.png', date: '2026-08-17', minutes: 90, rating: 8.2, goals: 0, assists: 0, keyPasses: 0, tackles: 1, shotsOnTarget: 0 },
      ],
    },
  ],
};

export function getClubSquad(clubName: string): DeepPlayerEntity[] {
  for (const [key, squad] of Object.entries(REAL_CLUB_SQUADS)) {
    if (clubName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(clubName.toLowerCase())) {
      return squad;
    }
  }

  const hash = Math.abs(clubName.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0));
  const nationalities = [
    { nat: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { nat: 'Spain', flag: '🇪🇸' },
    { nat: 'Brazil', flag: '🇧🇷' },
    { nat: 'France', flag: '🇫🇷' },
    { nat: 'Germany', flag: '🇩🇪' },
    { nat: 'Nigeria', flag: '🇳🇬' },
    { nat: 'Argentina', flag: '🇦🇷' },
    { nat: 'Italy', flag: '🇮🇹' },
  ];

  const positions: ('Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward')[] = [
    'Forward', 'Forward', 'Midfielder', 'Midfielder', 'Defender', 'Defender', 'Goalkeeper'
  ];

  const firstNames = ['Lucas', 'Mateo', 'David', 'Marcus', 'Gabriel', 'Victor', 'Julian', 'Alex', 'Samuel', 'Daniel'];
  const lastNames = ['Silva', 'Santos', 'Martinez', 'Johnson', 'Okafor', 'Mueller', 'Dubois', 'Gomez', 'Fernandez'];

  return positions.map((pos, idx) => {
    const pHash = hash + idx * 37;
    const fName = firstNames[pHash % firstNames.length];
    const lName = lastNames[(pHash + 3) % lastNames.length];
    const nat = nationalities[(pHash + 5) % nationalities.length];
    const num = [9, 10, 7, 8, 4, 2, 1][idx] || (idx + 1);
    const age = 21 + (pHash % 13);
    const birthMonth = 1 + (pHash % 12);
    const birthDay = 1 + (pHash % 28);
    const birthDate = (2026 - age) + '-' + (birthMonth < 10 ? '0' : '') + birthMonth + '-' + (birthDay < 10 ? '0' : '') + birthDay;

    return {
      id: clubName.toLowerCase().replace(/[^a-z]/g, '') + '-' + num,
      name: fName + ' ' + lName,
      fullName: fName + ' ' + lName,
      number: num,
      position: pos,
      specificRole: pos === 'Forward' ? 'Center Forward' : pos === 'Midfielder' ? 'Central Midfielder' : pos === 'Defender' ? 'Center Back' : 'First Team Goalkeeper',
      nationality: nat.nat,
      natFlag: nat.flag,
      age: age,
      birthDate: birthDate,
      height: (175 + (pHash % 20)) + ' cm',
      weight: (70 + (pHash % 18)) + ' kg',
      preferredFoot: pHash % 3 === 0 ? 'Left' : 'Right',
      marketValue: '€' + (10 + (pHash % 50)).toFixed(2) + 'm',
      contractUntil: '2028',
      currentClub: clubName,
      pastClubs: [
        { club: 'Youth Academy', years: '2018 - 2021', apps: 42, goals: 12 },
      ],
      seasonStats: {
        appearances: 22 + (pHash % 15),
        goals: pos === 'Forward' ? 12 + (pHash % 10) : pos === 'Midfielder' ? 4 + (pHash % 5) : 1,
        assists: pos === 'Forward' ? 5 + (pHash % 4) : pos === 'Midfielder' ? 7 + (pHash % 6) : 2,
        yellowCards: pHash % 6,
        redCards: 0,
        xG: 8.5,
        xA: 4.2,
        passAccuracy: (78 + (pHash % 15)) + '%',
      },
      matchFootprints: [
        { opponent: 'Previous Rival', opponentLogo: 'https://crests.football-data.org/PL.png', date: '2026-08-18', minutes: 90, rating: 7.8, goals: pos === 'Forward' ? 1 : 0, assists: 0, keyPasses: 2, tackles: 2, shotsOnTarget: 2 },
      ],
    };
  });
}
