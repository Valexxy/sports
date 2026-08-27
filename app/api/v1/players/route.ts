import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export interface SportSpecificMetrics {
  primary_metric_label: string;
  primary_metric_value: string;
  secondary_metric_label: string;
  secondary_metric_value: string;
  tertiary_metric_label: string;
  tertiary_metric_value: string;
  career_honors: string[];
}

export interface UniversalAthleteRecord {
  id: string;
  name: string;
  sport: string;
  team_name: string;
  country: string;
  position: string;
  jersey_number?: string;
  birth_date: string;
  age: number;
  photo_url: string;
  fallback_initials: string;
  rating: number;
  market_value: string;
  bio: string;
  metrics: SportSpecificMetrics;
  isLegend: boolean;
}

function deriveSportMetrics(sport: string, player: any, age: number): SportSpecificMetrics {
  const s = (sport || 'SOCCER').toUpperCase();
  const isLegend = age > 38 || (player.strTeam || '').includes('_Retired') || (player.strTeam || '').includes('_Deceased');

  if (s.includes('BASKETBALL') || s.includes('NBA')) {
    return {
      primary_metric_label: 'Height / Frame',
      primary_metric_value: player.strHeight || "6'6\" (1.98m)",
      secondary_metric_label: 'Primary Role',
      secondary_metric_value: player.strPosition || 'Guard / Forward',
      tertiary_metric_label: 'Career Rings / Accolades',
      tertiary_metric_value: isLegend ? 'NBA Champion & Finals MVP' : 'All-Star Performer',
      career_honors: ['NBA Championship Winner', 'All-NBA First Team', 'Olympic Gold Medalist']
    };
  }

  if (s.includes('TENNIS') || s.includes('ATP') || s.includes('WTA')) {
    return {
      primary_metric_label: 'Handedness',
      primary_metric_value: player.strSide || 'Right-Handed',
      secondary_metric_label: 'Surface Specialty',
      secondary_metric_value: 'Hard / Clay / Grass',
      tertiary_metric_label: 'Grand Slam Record',
      tertiary_metric_value: isLegend ? 'Multiple Major Titles' : 'Tour Title Contender',
      career_honors: ['Grand Slam Champion', 'ATP/WTA Masters Winner', 'World No. 1 Ranked']
    };
  }

  if (s.includes('MOTORSPORT') || s.includes('FORMULA') || s.includes('F1')) {
    return {
      primary_metric_label: 'Racing Division',
      primary_metric_value: 'Formula 1 Grand Prix',
      secondary_metric_label: 'Car / Grid Number',
      secondary_metric_value: `#${player.strNumber || '44'}`,
      tertiary_metric_label: 'World Championships',
      tertiary_metric_value: isLegend ? 'World Champion Icon' : 'Podium Contender',
      career_honors: ['FIA World Drivers Champion', 'Grand Prix Race Winner', 'Pole Position Master']
    };
  }

  if (s.includes('COMBAT') || s.includes('BOXING') || s.includes('UFC') || s.includes('MMA')) {
    return {
      primary_metric_label: 'Weight Division',
      primary_metric_value: player.strWeight || 'Heavyweight',
      secondary_metric_label: 'Stance / Style',
      secondary_metric_value: 'Orthodox Striker',
      tertiary_metric_label: 'Championship Belts',
      tertiary_metric_value: isLegend ? 'Undisputed World Champion' : 'Title Challenger',
      career_honors: ['Undisputed World Champion', 'Knockout of the Year', 'Hall of Fame Inductee']
    };
  }

  if (s.includes('ATHLETICS') || s.includes('TRACK')) {
    return {
      primary_metric_label: 'Track Discipline',
      primary_metric_value: '100m / 200m Sprint',
      secondary_metric_label: 'World Record',
      secondary_metric_value: 'World Record Holder',
      tertiary_metric_label: 'Olympic Medals',
      tertiary_metric_value: 'Multiple Olympic Gold',
      career_honors: ['Olympic Gold Medalist', 'World Championship Gold', 'World Record Holder']
    };
  }

  // Default Soccer / Football
  return {
    primary_metric_label: 'Preferred Foot',
    primary_metric_value: player.strSide || 'Right Foot',
    secondary_metric_label: 'Position Role',
    secondary_metric_value: player.strPosition || 'Attacking Playmaker',
    tertiary_metric_label: 'Major Honors',
    tertiary_metric_value: isLegend ? 'Continental & League Legend' : 'League & Cup Contender',
    career_honors: ['League Champion', 'Continental Trophy Winner', 'National Team Cap']
  };
}

function calculateAge(birthDateStr: string): number {
  if (!birthDateStr) return 28;
  try {
    const born = new Date(birthDateStr);
    const now = new Date();
    let age = now.getFullYear() - born.getFullYear();
    const m = now.getMonth() - born.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < born.getDate())) age--;
    return age > 0 ? age : 28;
  } catch {
    return 28;
  }
}

async function fetchWikiPhotoAndBio(name: string): Promise<{ photoUrl?: string; bio?: string }> {
  try {
    const formatted = name.trim().replace(/\s+/g, '_');
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(formatted)}`, {
      headers: { 'User-Agent': 'MivajSportsEncyclopedia/2.0 (mivaj.com)' },
      next: { revalidate: 86400 }
    });
    if (res.ok) {
      const data = await res.json();
      return {
        photoUrl: data.thumbnail?.source || data.originalimage?.source,
        bio: data.extract
      };
    }
  } catch {}
  return {};
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query')?.trim();
  const sport = searchParams.get('sport')?.toUpperCase();

  if (!query) {
    return NextResponse.json({ success: true, count: 0, data: [] });
  }

  try {
    // 1. Tier 1: Search TheSportsDB Free API
    const sdbRes = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(query)}`, {
      next: { revalidate: 3600 }
    });

    let athletes: UniversalAthleteRecord[] = [];

    if (sdbRes.ok) {
      const json = await sdbRes.json();
      const sdbPlayers = json.player || [];

      for (const p of sdbPlayers.slice(0, 8)) {
        const name = p.strPlayer || query;
        const sportName = (p.strSport || 'Soccer').toUpperCase();
        const age = calculateAge(p.dateBorn);
        const isLegend = (p.strTeam || '').includes('_Retired') || (p.strTeam || '').includes('_Deceased') || age > 38;

        // If TheSportsDB photo is missing, query Tier 2 (Wikipedia REST API)
        let photo = p.strThumb || p.strCutout;
        let bio = p.strDescriptionEN;

        if (!photo || !bio) {
          const wiki = await fetchWikiPhotoAndBio(name);
          if (!photo && wiki.photoUrl) photo = wiki.photoUrl;
          if (!bio && wiki.bio) bio = wiki.bio;
        }

        const nameParts = name.split(' ');
        const initials = nameParts.length > 1 ? `${nameParts[0][0]}${nameParts[1][0]}` : name.substring(0, 2).toUpperCase();

        athletes.push({
          id: p.idPlayer || `p-${Math.random().toString(36).substring(7)}`,
          name: name,
          sport: sportName,
          team_name: p.strTeam?.replace(/^_Retired |_Deceased /g, '') || 'Global Athlete',
          country: p.strNationality || 'Global',
          position: p.strPosition || 'Athlete',
          jersey_number: p.strNumber || '10',
          birth_date: p.dateBorn || '1995-01-01',
          age: age,
          photo_url: photo || '',
          fallback_initials: initials,
          rating: isLegend ? 96 : 89,
          market_value: p.strWage || (isLegend ? 'Hall of Fame Icon' : '€85,000,000'),
          bio: bio || `${name} is an elite professional athlete from ${p.strNationality || 'world sports'}.`,
          metrics: deriveSportMetrics(sportName, p, age),
          isLegend
        });
      }
    }

    // 2. If TheSportsDB had zero results, fallback directly to Tier 2 Wikipedia REST API
    if (athletes.length === 0) {
      const wiki = await fetchWikiPhotoAndBio(query);
      if (wiki.bio) {
        const initials = query.substring(0, 2).toUpperCase();
        athletes.push({
          id: `wiki-${encodeURIComponent(query)}`,
          name: query,
          sport: sport || 'SOCCER',
          team_name: 'World Sports Icon',
          country: 'Global',
          position: 'Professional Athlete',
          jersey_number: '10',
          birth_date: '1990-01-01',
          age: 34,
          photo_url: wiki.photoUrl || '',
          fallback_initials: initials,
          rating: 94,
          market_value: 'Legendary Icon',
          bio: wiki.bio,
          metrics: deriveSportMetrics(sport || 'SOCCER', {}, 34),
          isLegend: true
        });
      }
    }

    if (sport && sport !== 'ALL') {
      athletes = athletes.filter(a => a.sport.includes(sport));
    }

    return NextResponse.json({
      success: true,
      source: 'Multi-Tier Free Engine (TheSportsDB & Wikipedia REST API)',
      count: athletes.length,
      data: athletes
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, data: [] }, { status: 500 });
  }
}
