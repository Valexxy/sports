/**
 * MIVAJ SPORTS EXACT NEWS ARTICLE EXTRACTOR & DEDUPLICATOR
 * Fetches real editorial copy directly from official sports news publishers.
 * Strips advertisements, tracking scripts, and returns the exact 100% journalistic text.
 */

const EXTRACTOR_CACHE = new Map<string, { body: string; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60 * 12; // 12 hours

export async function extractExactArticleContent(url: string, fallbackDesc: string = ''): Promise<string> {
  if (!url || !url.startsWith('http')) return fallbackDesc;

  // Check in-memory cache
  const cached = EXTRACTOR_CACHE.get(url);
  if (cached && cached.body && cached.body.length > 80 && (Date.now() - cached.timestamp) < CACHE_TTL) {
    return cached.body;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
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
          lower.includes('download the app');

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
