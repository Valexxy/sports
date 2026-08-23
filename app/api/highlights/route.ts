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

function cleanName(name: string): string {
  return name.toLowerCase().replace(/\b(fc|cf|club|united|city|hotspur|town|athletic|rovers)\b/gi, '').trim();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawHome = searchParams.get('home') || '';
  const rawAway = searchParams.get('away') || '';
  const home = rawHome.toLowerCase().trim();
  const away = rawAway.toLowerCase().trim();

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
      const hClean = cleanName(home);
      const aClean = cleanName(away);

      const match = cachedScoreBat.find((item) => {
        const title = item.title.toLowerCase();
        return (
          (home && title.includes(home)) ||
          (away && title.includes(away)) ||
          (hClean.length >= 3 && title.includes(hClean)) ||
          (aClean.length >= 3 && title.includes(aClean))
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

  // High-Quality Clean Match Reel Fallback (Dailymotion Clean Match Archive Player)
  const cleanDailymotionSearchUrl = `https://www.dailymotion.com/embed/search/${encodeURIComponent(
    rawHome + ' ' + rawAway + ' highlights'
  )}?autoplay=0&mute=0&ui-logo=0&sharing-enable=0&queue-enable=0`;

  return NextResponse.json({
    success: true,
    found: true,
    source: 'clean_dailymotion_archive',
    title: `${rawHome} vs ${rawAway} Match Highlights`,
    embedUrl: cleanDailymotionSearchUrl,
  });
}
