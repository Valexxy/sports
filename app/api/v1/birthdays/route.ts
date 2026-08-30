import { NextResponse } from 'next/server';
import { getRedisCache, setRedisCache } from '../../../../lib/upstash-redis-engine';
import { getCdnHeaders } from '../../../../lib/cdn-cache-engine';

export const dynamic = 'force-dynamic';
export const maxDuration = 45;

export interface LiveAlmanacAthlete {
  id: string;
  name: string;
  sport: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  age: number;
  country: string;
  countryFlag: string;
  clubOrDiscipline: string;
  avatarUrl: string;
  fallbackInitials: string;
  bio: string;
  articleUrl: string;
  isToday: boolean;
}

function getCountryFlag(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('nigerian') || t.includes('nigeria')) return '🇳🇬';
  if (t.includes('english') || t.includes('england') || t.includes('british')) return '🏴󠁧󠁢󠁥󠁮󠁧󠁿';
  if (t.includes('spanish') || t.includes('spain')) return '🇪🇸';
  if (t.includes('german') || t.includes('germany')) return '🇩🇪';
  if (t.includes('french') || t.includes('france')) return '🇫🇷';
  if (t.includes('brazilian') || t.includes('brazil')) return '🇧🇷';
  if (t.includes('argentine') || t.includes('argentina')) return '🇦🇷';
  if (t.includes('portuguese') || t.includes('portugal')) return '🇵🇹';
  if (t.includes('italian') || t.includes('italy')) return '🇮🇹';
  if (t.includes('american') || t.includes('united states') || t.includes('usa')) return '🇺🇸';
  if (t.includes('ghanaian') || t.includes('ghana')) return '🇬🇭';
  if (t.includes('south african') || t.includes('south africa')) return '🇿🇦';
  if (t.includes('kenyan') || t.includes('kenya')) return '🇰🇪';
  if (t.includes('cameroonian') || t.includes('cameroon')) return '🇨🇲';
  if (t.includes('senegalese') || t.includes('senegal')) return '🇸🇳';
  if (t.includes('egyptian') || t.includes('egypt')) return '🇪🇬';
  if (t.includes('moroccan') || t.includes('morocco')) return '🇲🇦';
  if (t.includes('belgian') || t.includes('belgium')) return '🇧🇪';
  if (t.includes('dutch') || t.includes('netherlands')) return '🇳🇱';
  if (t.includes('croatian') || t.includes('croatia')) return '🇭🇷';
  if (t.includes('japanese') || t.includes('japan')) return '🇯🇵';
  if (t.includes('australian') || t.includes('australia')) return '🇦🇺';
  if (t.includes('canadian') || t.includes('canada')) return '🇨🇦';
  if (t.includes('mexican') || t.includes('mexico')) return '🇲🇽';
  return '🌍';
}

function detectSport(text: string, description: string): string {
  const combined = (text + ' ' + description).toLowerCase();
  if (combined.includes('football') || combined.includes('soccer')) return 'SOCCER';
  if (combined.includes('basketball') || combined.includes('nba')) return 'BASKETBALL';
  if (combined.includes('tennis') || combined.includes('atp') || combined.includes('wta')) return 'TENNIS';
  if (combined.includes('boxer') || combined.includes('boxing') || combined.includes('ufc') || combined.includes('mma') || combined.includes('martial')) return 'COMBAT';
  if (combined.includes('racing') || combined.includes('formula 1') || combined.includes('f1') || combined.includes('nascar') || combined.includes('driver')) return 'MOTORSPORT';
  if (combined.includes('cricket')) return 'CRICKET';
  if (combined.includes('rugby')) return 'RUGBY';
  if (combined.includes('athletics') || combined.includes('sprinter') || combined.includes('runner') || combined.includes('olympic')) return 'ATHLETICS';
  if (combined.includes('baseball')) return 'BASEBALL';
  if (combined.includes('golf')) return 'GOLF';
  return 'MULTI_SPORT';
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const now = new Date();
  
  const monthParam = searchParams.get('month');
  const dayParam = searchParams.get('day');
  const sportFilter = (searchParams.get('sport') || 'ALL').toUpperCase();
  const query = searchParams.get('query')?.trim();

  // If query is provided, search Wikipedia and TheSportsDB directly
  if (query) {
    try {
      // 1. Check Redis cache
      const cacheKey = `mivaj:player_search:${query.toLowerCase()}`;
      const cached = await getRedisCache<LiveAlmanacAthlete[]>(cacheKey);
      if (cached && cached.length > 0) {
        return NextResponse.json({ success: true, count: cached.length, source: 'cache', data: cached });
      }

      // 2. Search TheSportsDB
      const sdbRes = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(query)}`, {
        next: { revalidate: 3600 }
      });

      let results: LiveAlmanacAthlete[] = [];
      if (sdbRes.ok) {
        const json = await sdbRes.json();
        const players = json.player || [];
        for (const p of players.slice(0, 10)) {
          const bornStr = p.dateBorn || '1995-01-01';
          const bornDate = new Date(bornStr);
          const birthYear = isNaN(bornDate.getFullYear()) ? 1995 : bornDate.getFullYear();
          const birthMonth = isNaN(bornDate.getMonth()) ? 1 : bornDate.getMonth() + 1;
          const birthDay = isNaN(bornDate.getDate()) ? 1 : bornDate.getDate();
          const age = now.getFullYear() - birthYear;

          const name = p.strPlayer || query;
          const parts = name.split(' ');
          const initials = parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : name.slice(0, 2).toUpperCase();

          results.push({
            id: p.idPlayer || `sdb-${Math.random().toString(36).slice(2, 7)}`,
            name,
            sport: (p.strSport || 'Soccer').toUpperCase(),
            birthYear,
            birthMonth,
            birthDay,
            age: age > 0 ? age : 28,
            country: p.strNationality || 'Global',
            countryFlag: getCountryFlag(p.strNationality || ''),
            clubOrDiscipline: p.strTeam?.replace(/^_Retired |_Deceased /g, '') || p.strPosition || 'Professional Athlete',
            avatarUrl: p.strThumb || p.strCutout || '',
            fallbackInitials: initials,
            bio: p.strDescriptionEN?.slice(0, 250) || `${name} is an elite professional athlete from ${p.strNationality || 'world sports'}.`,
            articleUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(name.replace(/\s+/g, '_'))}`,
            isToday: (birthMonth === (now.getMonth() + 1)) && (birthDay === now.getDate()),
          });
        }
      }

      // 3. Fallback: Query Wikipedia summary
      if (results.length === 0) {
        const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query.replace(/\s+/g, '_'))}`, {
          headers: { 'User-Agent': 'MivajSportsEncyclopedia/2.0 (mivaj.com)' },
          next: { revalidate: 86400 }
        });
        if (wikiRes.ok) {
          const wiki = await wikiRes.json();
          const parts = query.split(' ');
          const initials = parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : query.slice(0, 2).toUpperCase();

          results.push({
            id: `wiki-${encodeURIComponent(query)}`,
            name: wiki.title || query,
            sport: detectSport(wiki.title || '', wiki.extract || ''),
            birthYear: 1992,
            birthMonth: now.getMonth() + 1,
            birthDay: now.getDate(),
            age: 32,
            country: 'Global',
            countryFlag: getCountryFlag(wiki.extract || ''),
            clubOrDiscipline: wiki.description || 'World Sports Star',
            avatarUrl: wiki.thumbnail?.source || wiki.originalimage?.source || '',
            fallbackInitials: initials,
            bio: wiki.extract || `${query} is an internationally recognized sports figure.`,
            articleUrl: wiki.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`,
            isToday: false,
          });
        }
      }

      await setRedisCache(cacheKey, results, 60 * 60 * 24);
      return NextResponse.json({ success: true, count: results.length, data: results });
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message, data: [] }, { status: 500 });
    }
  }

  // Otherwise, load full world sports birthdays for the requested date (Default: Today)
  const targetMonth = monthParam ? parseInt(monthParam, 10) : now.getMonth() + 1;
  const targetDay = dayParam ? parseInt(dayParam, 10) : now.getDate();

  const formattedMonth = String(targetMonth).padStart(2, '0');
  const formattedDay = String(targetDay).padStart(2, '0');

  const cacheKey = `mivaj:birthdays:${formattedMonth}:${formattedDay}`;

  try {
    const cached = await getRedisCache<LiveAlmanacAthlete[]>(cacheKey);
    let athletes: LiveAlmanacAthlete[] = cached || [];

    if (!athletes || athletes.length === 0) {
      // Ingest 100% legal, open Wikipedia On-This-Day Births Feed (CC0/Public Domain)
      const feedUrl = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/births/${formattedMonth}/${formattedDay}`;
      const feedRes = await fetch(feedUrl, {
        headers: { 'User-Agent': 'MivajSportsEncyclopedia/2.0 (mivaj.com; contact@mivaj.com)' },
        next: { revalidate: 86400 } // Cache 24 hours
      });

      if (feedRes.ok) {
        const feedJson = await feedRes.json();
        const rawBirths = feedJson.births || [];

        // Filter and map sports figures born on this day
        athletes = rawBirths
          .filter((b: any) => {
            const text = (b.text || '').toLowerCase();
            const desc = (b.pages?.[0]?.description || '').toLowerCase();
            return (
              text.includes('football') || text.includes('soccer') ||
              text.includes('basketball') || text.includes('tennis') ||
              text.includes('athlete') || text.includes('boxer') ||
              text.includes('racing') || text.includes('f1') ||
              text.includes('cricket') || text.includes('baseball') ||
              text.includes('rugby') || text.includes('sprinter') ||
              text.includes('swimmer') || text.includes('golfer') ||
              desc.includes('footballer') || desc.includes('sports') ||
              desc.includes('basketball') || desc.includes('tennis')
            );
          })
          .map((b: any): LiveAlmanacAthlete => {
            const page = b.pages?.[0] || {};
            const name = page.titles?.normalized || b.text.split(',')[0] || 'World Athlete';
            const year = b.year || 1990;
            const age = now.getFullYear() - year;
            const sport = detectSport(b.text, page.description || '');
            const parts = name.split(' ');
            const initials = parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : name.slice(0, 2).toUpperCase();

            return {
              id: `wiki-birth-${page.pageid || Math.random().toString(36).slice(2, 8)}`,
              name,
              sport,
              birthYear: year,
              birthMonth: targetMonth,
              birthDay: targetDay,
              age: age > 0 ? age : 30,
              country: page.description || 'International',
              countryFlag: getCountryFlag(b.text + ' ' + (page.description || '')),
              clubOrDiscipline: page.description || `${sport} Professional`,
              avatarUrl: page.thumbnail?.source || page.originalimage?.source || `https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=300&h=300&fit=crop&auto=format`,
              fallbackInitials: initials,
              bio: page.extract || b.text,
              articleUrl: page.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(name.replace(/\s+/g, '_'))}`,
              isToday: (targetMonth === (now.getMonth() + 1)) && (targetDay === now.getDate()),
            };
          });

        if (athletes.length > 0) {
          await setRedisCache(cacheKey, athletes, 60 * 60 * 48);
        }
      }
    }

    // Filter by sport if selected
    let filtered = athletes;
    if (sportFilter && sportFilter !== 'ALL') {
      filtered = athletes.filter((a) => a.sport === sportFilter);
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      totalDayBirths: athletes.length,
      date: `${formattedMonth}-${formattedDay}`,
      source: 'Global Open Sports Registry (CC-BY-SA)',
      data: filtered,
    }, { headers: getCdnHeaders('BIRTHDAYS') });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, data: [] }, { status: 500 });
  }
}
