/**
 * MIVAJ SPORTS EXACT NEWS ARTICLE EXTRACTOR & CLEANER
 * Fetches real, unedited editorial journalism directly from premier sports publishers.
 * Properly decodes HTML entities and rejects non-football sidebar noise.
 */

const EXTRACTOR_CACHE = new Map<string, { body: string; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60 * 12; // 12 hours

export function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8216;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&pound;/g, '£')
    .replace(/&euro;/g, '€')
    .replace(/&#8212;/g, '—')
    .replace(/&mdash;/g, '—')
    .replace(/&#8211;/g, '–')
    .replace(/&ndash;/g, '–')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#\d+;/g, '');
}

export async function extractExactArticleContent(url: string, fallbackDesc: string = ''): Promise<string> {
  const cleanFallback = decodeHtmlEntities(fallbackDesc).trim();
  if (!url || !url.startsWith('http')) return cleanFallback;

  // 1. Skip scraping video clips or landing pages — they don't contain article body
  const isVideoPage = url.includes('/video/') || url.includes('/clip/') || url.includes('/watch/');
  const isCategoryLandingPage = url.endsWith('/football') || url.endsWith('/soccer');
  if (isVideoPage || isCategoryLandingPage) {
    return cleanFallback;
  }

  // 2. Check in-memory cache
  const cached = EXTRACTOR_CACHE.get(url);
  if (cached && cached.body && cached.body.length > 80 && (Date.now() - cached.timestamp) < CACHE_TTL) {
    return cached.body;
  }

  // 3. Direct ESPN Story API bypass if an ESPN article ID is detected
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
          const pMatches = rawStory.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
          const cleanParas = pMatches
            .map((p: string) => decodeHtmlEntities(p.replace(/<[^>]+>/g, '')).trim())
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

  // 4. Editorial Web HTML Extractor
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
    if (!res.ok) return cleanFallback;

    const html = await res.text();

    // Extract editorial <p> tags
    const pMatches = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
    const validParagraphs: string[] = [];

    for (const rawP of pMatches) {
      const text = decodeHtmlEntities(rawP.replace(/<[^>]+>/g, '')).trim();

      if (text.length >= 45) {
        const lower = text.toLowerCase();
        const isBoilerplate = 
          lower.startsWith('cookie') || 
          lower.startsWith('terms of') || 
          lower.startsWith('privacy policy') || 
          lower.startsWith('all rights reserved') ||
          lower.startsWith('copyright') ||
          lower.startsWith('published') ||
          lower.startsWith('bbc homepage') ||
          lower.startsWith('skip to content') ||
          lower.startsWith('accessibility help') ||
          lower.includes('subscribe to our newsletter') ||
          lower.includes('download the app') ||
          lower.includes('bbchomepage') ||
          lower.includes('close panel you are now following') ||
          lower.includes('updates from your sport topics') ||
          lower.includes('where to watchsearch');

        // Filter out unrelated multi-sport noise (Baseball, NFL, US Open in soccer feed)
        const isUnrelatedSport =
          lower.includes('homers in big win') ||
          lower.includes('dodgers') ||
          lower.includes('sixth inning') ||
          lower.includes('mlb game') ||
          lower.includes('dallas cowboys') ||
          lower.includes('stephen a.') ||
          lower.includes('us open') ||
          lower.includes('five-set thriller');

        if (!isBoilerplate && !isUnrelatedSport) {
          validParagraphs.push(text);
        }
      }
    }

    if (validParagraphs.length >= 2) {
      const fullText = validParagraphs.join('\n\n');
      EXTRACTOR_CACHE.set(url, { body: fullText, timestamp: Date.now() });
      return fullText;
    }
  } catch (err) {
    // Return fallback
  }

  return cleanFallback;
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
