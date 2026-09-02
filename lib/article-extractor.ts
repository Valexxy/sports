/**
 * MIVAJ SPORTS EXACT NEWS ARTICLE EXTRACTOR & DEDUPLICATOR
 * Fetches real unedited editorial journalism directly from sports publishers.
 * Pulls the entire real story without artificial formats or boilerplate.
 */

const EXTRACTOR_CACHE = new Map<string, { body: string; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60 * 12; // 12 hours

export async function extractExactArticleContent(url: string, fallbackDesc: string = ''): Promise<string> {
  if (!url || !url.startsWith('http')) return fallbackDesc;

  // 1. Check in-memory cache
  const cached = EXTRACTOR_CACHE.get(url);
  if (cached && cached.body && cached.body.length > 80 && (Date.now() - cached.timestamp) < CACHE_TTL) {
    return cached.body;
  }

  // 2. Direct ESPN Story API bypass if an ESPN article ID is detected
  const espnIdMatch = url.match(/\/id\/(\d+)/);
  if (espnIdMatch && url.includes('espn')) {
    try {
      const espnId = espnIdMatch[1];
      const apiRes = await fetch(`https://now.core.api.espn.com/v1/sports/news/${espnId}`, {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 3600 }
      });
      if (apiRes.ok) {
        const json = await apiRes.json();
        const rawStory = json.headlines?.[0]?.story || json.articles?.[0]?.story || '';
        if (rawStory && rawStory.length > 100) {
          // Parse HTML paragraphs from story
          const pMatches = rawStory.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
          const cleanParas = pMatches
            .map((p: string) => p.replace(/<[^>]+>/g, '').trim())
            .filter((t: string) => t.length > 30);
          
          if (cleanParas.length > 0) {
            const fullStory = cleanParas.join('\n\n');
            EXTRACTOR_CACHE.set(url, { body: fullStory, timestamp: Date.now() });
            return fullStory;
          }
        }
      }
    } catch (e) {
      // Fall through to HTML scraping
    }
  }

  // 3. Editorial Web HTML Extractor (Using search-indexer bot headers to bypass Akamai bot challenge)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);
    if (!res.ok) return fallbackDesc;

    const html = await res.text();

    // Extract editorial <p> tags
    const pMatches = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
    const validParagraphs: string[] = [];

    for (const rawP of pMatches) {
      const text = rawP
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&pound;/g, '£')
        .replace(/&euro;/g, '€')
        .trim();

      if (text.length >= 40) {
        const lower = text.toLowerCase();
        const isBoilerplate = 
          lower.startsWith('cookie') || 
          lower.startsWith('terms of') || 
          lower.startsWith('privacy policy') || 
          lower.startsWith('all rights reserved') ||
          lower.startsWith('copyright') ||
          lower.includes('subscribe to our newsletter') ||
          lower.includes('download the app') ||
          lower.includes('bbchomepage') ||
          lower.includes('accessibility help') ||
          lower.includes('close panel you are now following');

        if (!isBoilerplate) {
          validParagraphs.push(text);
        }
      }
    }

    if (validParagraphs.length >= 1) {
      const fullText = validParagraphs.join('\n\n');
      EXTRACTOR_CACHE.set(url, { body: fullText, timestamp: Date.now() });
      return fullText;
    }
  } catch (err) {
    // Return fallback
  }

  return fallbackDesc;
}

export function generateStableArticleId(url: string, title: string): string {
  const seed = (url || title).toLowerCase().replace(/[^a-z0-9]/g, '');
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return `art_${Math.abs(hash).toString(36)}`;
}
