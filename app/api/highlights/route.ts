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
  const home = (searchParams.get('home') || '').toLowerCase();
  const away = (searchParams.get('away') || '').toLowerCase();

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
      const match = cachedScoreBat.find((item) => {
        const title = item.title.toLowerCase();
        return (home && title.includes(home)) || (away && title.includes(away));
      });

      if (match && match.videos && match.videos.length > 0) {
        const embedMatch = match.videos[0].embed.match(/src=['"]([^'"]+)['"]/);
        const embedUrl = embedMatch ? embedMatch[1] : '';

        return NextResponse.json({
          success: true,
          found: true,
          source: 'scorebat_official',
          title: match.title,
          competition: match.competition,
          thumbnail: match.thumbnail,
          embedUrl: embedUrl || '',
          rawEmbed: match.videos[0].embed,
        });
      }
    }
  } catch (err) {
    console.warn('ScoreBat highlights fetch error:', err);
  }

  // If no exact match found, do NOT return unrelated recommendations
  return NextResponse.json({
    success: true,
    found: false,
    message: 'Official match video will be available once uploaded by broadcasters.',
  });
}
