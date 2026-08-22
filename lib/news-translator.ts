'use client';

import { LanguageCode } from './translation-engine';

// In-memory translation cache for instantaneous retrieval
const MEMORY_CACHE = new Map<string, string>();

const PIDGIN_REPLACEMENTS: Record<string, string> = {
  'wins': 'win well well',
  'defeats': 'flog',
  'scored': 'score correct goal',
  'transfers': 'sign new deal',
  'injury': 'injury wahala',
  'manager': 'head coach',
  'stadium': 'stadium ground',
  'champions': 'champions of the league',
  'breaking': 'fresh gist',
  'reports': 'authentic gist',
  'agrees': 'don agree',
  'deal': 'contract deal',
  'striker': 'goal machine',
  'goalkeeper': 'keeper',
  'official': 'confirmed',
};

function translateToPidgin(text: string): string {
  let res = text;
  Object.entries(PIDGIN_REPLACEMENTS).forEach(([en, pidgin]) => {
    const reg = new RegExp(`\\b${en}\\b`, 'gi');
    res = res.replace(reg, pidgin);
  });
  return res;
}

const LANG_CODE_MAP: Record<LanguageCode, string> = {
  en: 'en',
  pidgin: 'pcm',
  yoruba: 'yo',
  igbo: 'ig',
  hausa: 'ha',
};

/**
 * Translate a string into the target language using neural digital translation + local caching
 */
export async function translateText(text: string, targetLang: LanguageCode): Promise<string> {
  if (!text || targetLang === 'en') return text;

  const cacheKey = `${targetLang}:${text}`;
  if (MEMORY_CACHE.has(cacheKey)) {
    return MEMORY_CACHE.get(cacheKey)!;
  }

  // Check localStorage if available
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`trans_${cacheKey}`);
      if (stored) {
        MEMORY_CACHE.set(cacheKey, stored);
        return stored;
      }
    } catch { /* noop */ }
  }

  // Special Pidgin handling
  if (targetLang === 'pidgin') {
    const pidginResult = translateToPidgin(text);
    MEMORY_CACHE.set(cacheKey, pidginResult);
    return pidginResult;
  }

  const gtxLang = LANG_CODE_MAP[targetLang] || 'en';

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${gtxLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json) && json[0]) {
        const translated = json[0].map((item: any) => item[0]).join('');
        if (translated) {
          MEMORY_CACHE.set(cacheKey, translated);
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem(`trans_${cacheKey}`, translated);
            } catch { /* noop */ }
          }
          return translated;
        }
      }
    }
  } catch (err) {
    console.warn('Digital translation error, using fallback:', err);
  }

  return text;
}

/**
 * Batch translate multiple fields in articles
 */
export async function translateArticle(
  article: { title: string; description: string; categoryBadge?: string },
  targetLang: LanguageCode
): Promise<{ title: string; description: string }> {
  if (targetLang === 'en') {
    return { title: article.title, description: article.description };
  }

  const [tTitle, tDesc] = await Promise.all([
    translateText(article.title, targetLang),
    translateText(article.description, targetLang),
  ]);

  return {
    title: tTitle,
    description: tDesc,
  };
}
