import { NextResponse } from 'next/server';

interface ScoreBatItem {
  title: string;
  competition: string;
  matchviewUrl: string;
  thumbnail: string;
  date: string;
  videos: { title: string; embed: string }[];
}

let cachedScoreBat: ScoreBatItem[] | null = null;
let lastFetchTime = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const home = (searchParams.get('home') || '').toLowerCase().trim();
  const away = (searchParams.get('away') || '').toLowerCase().trim();

  try {
    const now = Date.now();
    if (!cachedScoreBat || now - lastFetchTime > 60000) {
      const res = await fetch('https://www.scorebat.com/video-api/v3/feed/', {
        next: { revalidate: 60 },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.response && Array.isArray(data.response)) {
          cachedScoreBat = data.response;
          lastFetchTime = now;
        }
      }
    }

    if (cachedScoreBat && (home || away)) {
      const homeToken = home.replace(/(fc|cf|club|united|city)/gi, '').trim();
      const awayToken = away.replace(/(fc|cf|club|united|city)/gi, '').trim();

      const match = cachedScoreBat.find((item) => {
        const title = item.title.toLowerCase();
        return (
          (home && title.includes(home)) ||
          (away && title.includes(away)) ||
          (homeToken.length > 3 && title.includes(homeToken)) ||
          (awayToken.length > 3 && title.includes(awayToken))
        );
      });

      if (match && match.videos && match.videos.length > 0) {
        const embedMatch = match.videos[0].embed.match(/src=['"]([^'"]+)['"]/);
        const embedUrl = embedMatch ? embedMatch[1] : '';

        return NextResponse.json({
          success: true,
          found: true,
          source: 'scorebat_official_clean',
          title: match.title,
          competition: match.competition,
          thumbnail: match.thumbnail,
          embedUrl: embedUrl || '',
        });
      }
    }
  } catch (err) {
    console.warn('ScoreBat highlights fetch error:', err);
  }

  return NextResponse.json({
    success: true,
    found: false,
    source: 'clean_stadium_summary',
  });
}
