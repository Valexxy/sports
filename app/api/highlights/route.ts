import { NextResponse } from 'next/server';

interface ScoreBatVideo {
  title: string;
  embed: string;
}

interface ScoreBatItem {
  title: string;
  competition: { name: string; id: number };
  matchviewUrl: string;
  thumbnail: string;
  date: string;
  videos: ScoreBatVideo[];
}

let cachedScoreBat: ScoreBatItem[] | null = null;
let lastFetchTime = 0;

function cleanName(name: string): string {
  return name.toLowerCase().replace(/\b(fc|cf|club|united|city|hotspur|town|athletic|rovers|cp)\b/gi, '').trim();
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
      const res = await fetch('https://www.scorebat.com/video-api/v1/', {
        next: { revalidate: 60 },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          cachedScoreBat = data;
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
        // Extract embed URL and ensure it's a clean stream
        const videoList = match.videos.map((v) => {
          const matchSrc = v.embed.match(/src=['"]([^'"]+)['"]/);
          return {
            title: v.title,
            embedUrl: matchSrc ? matchSrc[1] : '',
          };
        }).filter((v) => v.embedUrl);

        if (videoList.length > 0) {
          return NextResponse.json({
            success: true,
            found: true,
            source: 'scorebat_official',
            title: match.title,
            competition: match.competition?.name || '',
            thumbnail: match.thumbnail,
            embedUrl: videoList[0].embedUrl,
            videos: videoList,
          });
        }
      }
    }
  } catch (err) {
    console.warn('ScoreBat highlights fetch error:', err);
  }

  // If no embed found, return found: false
  return NextResponse.json({
    success: true,
    found: false,
    title: `${rawHome} vs ${rawAway} Match Highlights`,
  });
}
