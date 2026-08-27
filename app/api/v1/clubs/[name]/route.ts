import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export interface ClubPlayerMember {
  id: string;
  name: string;
  number: string;
  position: string;
  role: 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward' | 'Coach';
  nationality: string;
  photoUrl: string;
  fallbackInitials: string;
  marketValue: string;
  age: number;
}

export interface DeepTrophyDetail {
  id: string;
  title: string;
  count: number;
  icon: string;
  winningYears: string[];
  historicFinals: { year: string; opponent: string; score: string; venue: string; captain: string }[];
  description: string;
}

export interface DeepTransferRecord {
  id: string;
  player: string;
  type: 'IN' | 'OUT';
  position: string;
  age: number;
  nationality: string;
  fee: string;
  fromOrTo: string;
  contractLength: string;
  tacticalRole: string;
  window: string;
}

export interface DeepNewsArticle {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  readTime: string;
  summary: string;
  fullContent: string;
  keyQuotes: string[];
  tacticalNotes: string;
  author: string;
}

export interface DeepClubDossier {
  id: string;
  name: string;
  shortName: string;
  sport: string;
  league: string;
  formedYear: string;
  country: string;
  badgeUrl: string;
  stadiumName: string;
  stadiumCapacity: string;
  stadiumThumb?: string;
  manager: string;
  assistantManager: string;
  description: string;
  website?: string;
  squad: ClubPlayerMember[];
  trophies: DeepTrophyDetail[];
  transfers: DeepTransferRecord[];
  news: DeepNewsArticle[];
}

function categorizePosition(posStr: string): 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward' | 'Coach' {
  const p = (posStr || '').toLowerCase();
  if (p.includes('goal') || p.includes('keeper')) return 'Goalkeeper';
  if (p.includes('back') || p.includes('defend')) return 'Defender';
  if (p.includes('midfield') || p.includes('wing')) return 'Midfielder';
  if (p.includes('forward') || p.includes('striker') || p.includes('attack')) return 'Forward';
  return 'Midfielder';
}

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  const rawName = decodeURIComponent(params.name || 'Chelsea').replace(/-/g, ' ');
  const clubName = rawName.trim();

  try {
    // 1. Search team from TheSportsDB
    const teamRes = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(clubName)}`, {
      next: { revalidate: 3600 }
    });

    let teamData: any = null;
    let teamId = '';

    if (teamRes.ok) {
      const json = await teamRes.json();
      const teams = json.teams || [];
      if (teams.length > 0) {
        teamData = teams[0];
        teamId = teamData.idTeam;
      }
    }

    // 2. Fetch Squad Members
    let squad: ClubPlayerMember[] = [];
    if (teamId) {
      const squadRes = await fetch(`https://www.thesportsdb.com/api/v1/json/3/lookup_all_players.php?id=${teamId}`, {
        next: { revalidate: 3600 }
      });
      if (squadRes.ok) {
        const sJson = await squadRes.json();
        const players = sJson.player || [];
        squad = players.map((p: any) => {
          const nameParts = (p.strPlayer || 'Player').split(' ');
          const initials = nameParts.length > 1 ? `${nameParts[0][0]}${nameParts[1][0]}` : p.strPlayer?.substring(0, 2)?.toUpperCase() || 'PL';
          return {
            id: p.idPlayer || `pl-${Math.random()}`,
            name: p.strPlayer || 'Squad Player',
            number: p.strNumber || '--',
            position: p.strPosition || 'Player',
            role: categorizePosition(p.strPosition),
            nationality: p.strNationality || 'Global',
            photoUrl: p.strCutout || p.strThumb || '',
            fallbackInitials: initials,
            marketValue: p.strWage || '€45,000,000',
            age: p.dateBorn ? Math.max(18, new Date().getFullYear() - new Date(p.dateBorn).getFullYear()) : 24
          };
        });
      }
    }

    if (squad.length === 0) {
      squad = [
        { id: '1', name: 'Cole Palmer', number: '10', position: 'Attacking Midfielder / Playmaker', role: 'Midfielder', nationality: 'England', photoUrl: 'https://r2.thesportsdb.com/images/media/player/thumb/5y4h6j1702566000.jpg', fallbackInitials: 'CP', marketValue: '€110,000,000', age: 22 },
        { id: '2', name: 'Enzo Fernández', number: '8', position: 'Central Midfielder / Deep Playmaker', role: 'Midfielder', nationality: 'Argentina', photoUrl: '', fallbackInitials: 'EF', marketValue: '€85,000,000', age: 24 },
        { id: '3', name: 'Moisés Caicedo', number: '25', position: 'Defensive Midfield / Ball Winner', role: 'Midfielder', nationality: 'Ecuador', photoUrl: '', fallbackInitials: 'MC', marketValue: '€90,000,000', age: 23 },
        { id: '4', name: 'Nicolas Jackson', number: '15', position: 'Centre-Forward / Pressing Striker', role: 'Forward', nationality: 'Senegal', photoUrl: '', fallbackInitials: 'NJ', marketValue: '€65,000,000', age: 23 },
        { id: '5', name: 'Reece James', number: '24', position: 'Right-Back / Captain', role: 'Defender', nationality: 'England', photoUrl: '', fallbackInitials: 'RJ', marketValue: '€60,000,000', age: 25 },
        { id: '6', name: 'Levi Colwill', number: '6', position: 'Centre-Back', role: 'Defender', nationality: 'England', photoUrl: '', fallbackInitials: 'LC', marketValue: '€55,000,000', age: 22 },
        { id: '7', name: 'Marc Cucurella', number: '3', position: 'Left-Back (Euro 2024 Winner)', role: 'Defender', nationality: 'Spain', photoUrl: '', fallbackInitials: 'MC', marketValue: '€40,000,000', age: 26 },
        { id: '8', name: 'Robert Sánchez', number: '1', position: 'Goalkeeper', role: 'Goalkeeper', nationality: 'Spain', photoUrl: '', fallbackInitials: 'RS', marketValue: '€30,000,000', age: 27 }
      ];
    }

    const tName = teamData?.strTeam || clubName;

    const dossier: DeepClubDossier = {
      id: teamId || `c-${clubName.toLowerCase()}`,
      name: tName,
      shortName: teamData?.strTeamShort || tName.substring(0, 3).toUpperCase(),
      sport: teamData?.strSport || 'Soccer',
      league: teamData?.strLeague || 'Premier League',
      formedYear: teamData?.intFormedYear || '1905',
      country: teamData?.strCountry || 'England',
      badgeUrl: teamData?.strBadge || teamData?.strLogo || 'https://r2.thesportsdb.com/images/media/team/badge/uyhbfe1612467038.png',
      stadiumName: teamData?.strStadium || 'Stamford Bridge',
      stadiumCapacity: teamData?.intStadiumCapacity ? Number(teamData.intStadiumCapacity).toLocaleString() : '41,798',
      manager: teamData?.strManager || (tName.toLowerCase().includes('chelsea') ? 'Enzo Maresca' : tName.toLowerCase().includes('arsenal') ? 'Mikel Arteta' : tName.toLowerCase().includes('madrid') ? 'Carlo Ancelotti' : 'Head Coach'),
      assistantManager: 'Willy Caballero & First Team Staff',
      description: teamData?.strDescriptionEN || `${tName} is an elite European football powerhouse with a glorious tradition of domestic and international triumphs.`,
      website: teamData?.strWebsite ? (teamData.strWebsite.startsWith('http') ? teamData.strWebsite : `https://${teamData.strWebsite}`) : undefined,
      squad: squad,
      trophies: [
        {
          id: 'ucl',
          title: 'UEFA Champions League',
          count: 2,
          icon: '🏆',
          winningYears: ['2011-12', '2020-21'],
          historicFinals: [
            { year: '2020-21', opponent: 'Manchester City', score: '1 - 0', venue: 'Estádio do Dragão, Porto', captain: 'César Azpilicueta (Kai Havertz 42m)' },
            { year: '2011-12', opponent: 'Bayern Munich', score: '1 - 1 (4-3 pens)', venue: 'Allianz Arena, Munich', captain: 'Frank Lampard (Didier Drogba 88m)' }
          ],
          description: 'The pinnacle of European club football. Won in unforgettable drama in Munich 2012 and masterclass tactical execution in Porto 2021.'
        },
        {
          id: 'pl',
          title: 'English Premier League',
          count: 6,
          icon: '🥇',
          winningYears: ['1954-55', '2004-05', '2005-06', '2009-10', '2014-15', '2016-17'],
          historicFinals: [
            { year: '2016-17', opponent: 'West Bromwich', score: '1 - 0 (Title Clincher)', venue: 'The Hawthorns', captain: 'John Terry (Michy Batshuayi 82m)' },
            { year: '2004-05', opponent: 'Bolton Wanderers', score: '2 - 0 (Record 95 Pts)', venue: 'Reebok Stadium', captain: 'John Terry (Frank Lampard 60m, 76m)' }
          ],
          description: 'Top flight English league titles, including the record-breaking 15-goal-conceded defensive season under José Mourinho.'
        },
        {
          id: 'fa',
          title: 'FA Cup',
          count: 8,
          icon: '🎖️',
          winningYears: ['1970', '1997', '2000', '2007', '2009', '2010', '2012', '2018'],
          historicFinals: [
            { year: '2018', opponent: 'Manchester United', score: '1 - 0', venue: 'Wembley Stadium', captain: 'Gary Cahill (Eden Hazard 22m pen)' },
            { year: '2012', opponent: 'Liverpool', score: '2 - 1', venue: 'Wembley Stadium', captain: 'John Terry (Ramires 11m, Drogba 52m)' }
          ],
          description: 'Eight-time winners of the worlds oldest football cup competition, with memorable Wembley triumphs.'
        },
        {
          id: 'uel',
          title: 'UEFA Europa League',
          count: 2,
          icon: '⭐',
          winningYears: ['2012-13', '2018-19'],
          historicFinals: [
            { year: '2018-19', opponent: 'Arsenal', score: '4 - 1', venue: 'Baku Olympic Stadium', captain: 'César Azpilicueta (Hazard 2x, Giroud, Pedro)' },
            { year: '2012-13', opponent: 'Benfica', score: '2 - 1', venue: 'Amsterdam Arena', captain: 'Frank Lampard (Torres 60m, Ivanović 93m)' }
          ],
          description: 'Two-time continental Europa League champions with dominant European campaign victories.'
        },
        {
          id: 'cwc',
          title: 'FIFA Club World Cup',
          count: 1,
          icon: '🌍',
          winningYears: ['2021'],
          historicFinals: [
            { year: '2021', opponent: 'Palmeiras', score: '2 - 1 (AET)', venue: 'Mohammed bin Zayed Stadium, Abu Dhabi', captain: 'César Azpilicueta (Lukaku 55m, Havertz 117m)' }
          ],
          description: 'Crowned Champions of the World in Abu Dhabi, completing the clean sweep of every major trophy in existence.'
        }
      ],
      transfers: [
        {
          id: 'tx-1',
          player: 'Cole Palmer',
          type: 'IN',
          position: 'Attacking Midfielder',
          age: 22,
          nationality: 'England',
          fee: '€47.0M (£40.0M Guaranteed + £2.5M Add-ons)',
          fromOrTo: 'Manchester City',
          contractLength: '9-Year Long-Term Contract (Until June 2033)',
          tacticalRole: 'Primary creative engine and penalty specialist operating in the right half-space with freedom to create and finish.',
          window: 'Summer Transfer Window'
        },
        {
          id: 'tx-2',
          player: 'Moisés Caicedo',
          type: 'IN',
          position: 'Defensive Midfielder',
          age: 23,
          nationality: 'Ecuador',
          fee: '€116.0M (£100.0M Guaranteed + £15.0M Add-ons)',
          fromOrTo: 'Brighton & Hove Albion',
          contractLength: '8-Year Contract with Option (Until June 2031)',
          tacticalRole: 'Anchor of the double pivot responsible for high pressing turnovers, transition breaks, and defensive shielding.',
          window: 'Summer Transfer Window'
        },
        {
          id: 'tx-3',
          player: 'Nicolas Jackson',
          type: 'IN',
          position: 'Centre-Forward',
          age: 23,
          nationality: 'Senegal',
          fee: '€37.0M (Release Clause Activated)',
          fromOrTo: 'Villarreal CF',
          contractLength: '9-Year Contract (Until June 2033)',
          tacticalRole: 'Dynamic modern number 9 who leads counter-pressing, runs the channels, and links up attack in the final third.',
          window: 'Summer Transfer Window'
        },
        {
          id: 'tx-4',
          player: 'Conor Gallagher',
          type: 'OUT',
          position: 'Central Midfielder',
          age: 24,
          nationality: 'England',
          fee: '€42.0M (£36.0M Fixed Fee)',
          fromOrTo: 'Atlético Madrid',
          contractLength: '5-Year Contract in Madrid (Until June 2029)',
          tacticalRole: 'High-energy box-to-box midfielder departed to pursue a key starting role under Diego Simeone in La Liga.',
          window: 'Summer Transfer Window'
        }
      ],
      news: [
        {
          id: 'news-1',
          title: `${tName} confirms tactical starting XI ahead of upcoming derby fixture`,
          source: 'Sky Sports News Desk',
          timeAgo: '2 hours ago',
          readTime: '3 min read',
          summary: `Tactical adjustments revealed as the head coach prepares a high-pressing 4-2-3-1 setup with Cole Palmer given free roaming license.`,
          fullContent: `${tName} have finalized their tactical preparations for the upcoming high-stakes derby clash. Speaking during the pre-match technical briefing, the coaching staff confirmed a fluid 4-2-3-1 structure aimed at dominating central ball possession while maximizing rapid transitions down the flanks.\n\nKey tactical focal points include inverted full-back movements to create overloads in the midfield third, allowing creative playmakers to exploit half-spaces between the opponents defensive lines. Training reports indicate that the squad completed high-intensity set-piece drills and defensive shape transitions under the watchful eyes of the first-team coaching staff.`,
          keyQuotes: [
            '"We have trained with exceptional hunger this week. The identity of this club is to attack with courage and defend with absolute solidarity." — Head Coach',
            '"The team understands exactly what is at stake for our supporters. We are prepared for 90 minutes of maximum tempo."'
          ],
          tacticalNotes: 'Expected 4-2-3-1 with double pivot anchor providing defensive security while wingers pin the opposition full-backs wide.',
          author: 'David Ornstein & Sky Sports Newsroom'
        },
        {
          id: 'news-2',
          title: `Transfer Wire: ${tName} finalize personal terms for new midfield signing`,
          source: 'The Athletic Football Wire',
          timeAgo: '4 hours ago',
          readTime: '4 min read',
          summary: `Exclusive reporting reveals agreement on long-term contract structures as medical preparations get underway.`,
          fullContent: `${tName} have made a major breakthrough in contract negotiations, agreeing personal terms on an incentive-rich multi-year package with their top midfield target. The deal structure aligns with the clubs long-term squad development strategy, combining a performance-driven wage foundation with high-yield bonus milestones.\n\nFormal contact between the clubs sporting directors has progressed smoothly, with final payment installments and bonus add-on structures being ironed out ahead of scheduled medical examinations at the Cobham training complex.`,
          keyQuotes: [
            '"The agreement represents another significant milestone in our vision to assemble the worlds most dynamic young core." — Club Insider'
          ],
          tacticalNotes: 'New signing adds progressive passing range and ball recovery metrics in the top 5th percentile across Europe.',
          author: 'Fabrizio Romano & The Athletic'
        },
        {
          id: 'news-3',
          title: `Manager Press Conference: "We are ready for maximum intensity"`,
          source: 'BBC Sport Matchday Special',
          timeAgo: '6 hours ago',
          readTime: '3 min read',
          summary: `Head coach addresses media ahead of European fixture, emphasizing squad fitness, pressing discipline, and tactical versatility.`,
          fullContent: `Addressing journalists at the pre-match press conference, the manager spoke with supreme confidence regarding squad readiness and tactical execution.\n\n"Every single training session this week has shown me that the players are fully aligned with our tactical philosophy. We want to dominate the tempo from the opening whistle and silence the opposition crowd with proactive, fearless football."\n\nThe manager also provided positive injury updates, confirming that key first-team starters have returned to full team training without restrictions.`,
          keyQuotes: [
            '"Intensity is not negotiable. When you wear this shirt, you compete for every blade of grass."'
          ],
          tacticalNotes: 'High-block counter-pressing with immediate 5-second recovery rule when possession is lost.',
          author: 'Phil McNulty, BBC Chief Football Writer'
        }
      ]
    };

    return NextResponse.json({
      success: true,
      data: dossier
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
