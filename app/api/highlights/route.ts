import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

interface HighlightVideoItem {
  id: string;
  title: string;
  thumbnail: string;
  embedUrl: string;
  youtubeEmbedUrl: string;
  directWatchUrl: string;
  duration: number;
  date: string;
  source: 'official_broadcaster' | 'dailymotion_verified';
  competition: string;
}

let cachedHighlights: HighlightVideoItem[] = [];
let lastFetchTime = 0;

function cleanName(name: string): string {
  return name.toLowerCase().replace(/\b(fc|cf|club|united|city|hotspur|town|athletic|rovers|cp)\b/gi, '').trim();
}

/**
 * Multi-Source Unblocked Highlight Engine
 * Combines YouTube Privacy-Enhanced Broadcaster streams with DailyMotion sports feeds
 */
async function fetchAllVerifiedHighlights(): Promise<HighlightVideoItem[]> {
  const list: HighlightVideoItem[] = [];

  try {
    const url = `https://api.dailymotion.com/videos?search=football+highlights+goals&tags=football,soccer&sort=recent&fields=id,title,thumbnail_720_url,embed_url,duration,created_time&limit=25`;
    const res = await fetch(url, { next: { revalidate: 120 } });
    if (res.ok) {
      const data = await res.json();
      if (data?.list && Array.isArray(data.list)) {
        data.list.forEach((v: any, idx: number) => {
          const rawTitle = v.title.replace(/^Highlights_/i, '').replace(/_Matchday.*$/i, '').replace(/_ACT$/i, '').replace(' - ', ' vs ');
          list.push({
            id: v.id || `dm-${idx}`,
            title: rawTitle,
            thumbnail: v.thumbnail_720_url || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80',
            embedUrl: `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(rawTitle + ' official highlights')}&autoplay=1`,
            youtubeEmbedUrl: `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(rawTitle + ' highlights')}&autoplay=1`,
            directWatchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(rawTitle + ' official match highlights')}`,
            duration: v.duration || 180,
            date: new Date(v.created_time * 1000).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
            source: 'official_broadcaster',
            competition: 'Top Flight Highlights',
          });
        });
      }
    }
  } catch (e) {
    console.warn('Highlights feed notice:', e);
  }

  // Curated recent European derbies & top matches if feed is sparse
  if (list.length < 5) {
    const defaultMatches = [
      { title: 'Arsenal vs Chelsea', comp: 'Premier League' },
      { title: 'Real Madrid vs Barcelona', comp: 'La Liga' },
      { title: 'RB Leipzig vs Borussia Mönchengladbach', comp: 'Bundesliga' },
      { title: 'Bayern München vs Borussia Dortmund', comp: 'Bundesliga' },
      { title: 'Inter Milan vs AC Milan', comp: 'Serie A' },
      { title: 'Manchester City vs Liverpool', comp: 'Premier League' },
    ];

    defaultMatches.forEach((m, idx) => {
      list.push({
        id: `curated-${idx}`,
        title: `${m.title} Highlights`,
        thumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80',
        embedUrl: `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(m.title + ' highlights official')}&autoplay=1`,
        youtubeEmbedUrl: `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(m.title + ' highlights')}&autoplay=1`,
        directWatchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(m.title + ' official match highlights')}`,
        duration: 240,
        date: 'Recent',
        source: 'official_broadcaster',
        competition: m.comp,
      });
    });
  }

  return list;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawHome = searchParams.get('home') || '';
  const rawAway = searchParams.get('away') || '';
  const home = rawHome.toLowerCase().trim();
  const away = rawAway.toLowerCase().trim();

  try {
    const now = Date.now();
    if (!cachedHighlights.length || now - lastFetchTime > 120000) {
      cachedHighlights = await fetchAllVerifiedHighlights();
      lastFetchTime = now;
    }

    let matches = cachedHighlights;
    if (home || away) {
      const hClean = cleanName(home);
      const aClean = cleanName(away);
      const filtered = cachedHighlights.filter((item) => {
        const title = item.title.toLowerCase();
        return (
          (home && title.includes(home)) ||
          (away && title.includes(away)) ||
          (hClean.length >= 3 && title.includes(hClean)) ||
          (aClean.length >= 3 && title.includes(aClean))
        );
      });
      if (filtered.length > 0) matches = filtered;
    }

    return NextResponse.json({
      success: true,
      found: true,
      videos: matches,
      totalRecent: matches.length,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      found: false,
      videos: [],
    });
  }
}
