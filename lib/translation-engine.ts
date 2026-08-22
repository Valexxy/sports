/**
 * AUTO-TRANSLATION ENGINE (Global Users)
 * Auto-detects the visitor's browser language and translates UI chrome into
 * 30+ languages using a privacy-respecting free translation pipeline:
 *
 *  1. Built-in phrase dictionary (instant, zero-network) for common terms
 *  2. MyMemory free translation API fallback (keyless)
 *
 * Strategy: core UI strings are cached in localStorage after first translation,
 * so repeat visits are instant and work offline.
 */

export type LanguageCode =
  | 'en' | 'pidgin'; // Restricted to English and Pidgin only

export interface LanguageMeta {
  code: LanguageCode;
  name: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'pidgin', name: 'Pidgin', flag: '', dir: 'ltr' },
];

const STORAGE_KEY = 'aurascore_language';

// Core phrase dictionary (English -> each language). Only high-frequency
// navigational terms. Full-string translation happens via remote fallback and
// is cached locally.
const PHRASES: Record<string, Record<string, string>> = {
  'All Matches': {
    pidgin: 'All Matches',
  },
  Live: {
    pidgin: 'Live',
  },
  Upcoming: {
    pidgin: 'Upcoming',
  },
  Played: {
    pidgin: 'Played',
  },
  Bankers: {
    pidgin: 'Bankers',
  },
  'Search team, league or fixture...': {
    pidgin: 'Search team, league or fixture...',
  },
  'View Full Match Insights': {
    pidgin: 'View Full Match Insights',
  },
  'Add Pick': {
    pidgin: 'Add Pick',
  },
  Football: {
    pidgin: 'Football',
  },
  Basketball: {
    pidgin: 'Basketball',
  },
  Tennis: {
    pidgin: 'Tennis',
  },
};

export function detectBrowserLanguage(): LanguageCode {
  if (typeof navigator === 'undefined') return 'en';
  const raw = (navigator.language || 'en').toLowerCase();
  const base = raw.split('-')[0];
  if ((PHRASES['All Matches'] as any)[base]) return base as LanguageCode;
  return 'en';
}

export function getStoredLanguage(): LanguageCode | null {
  if (typeof window === 'undefined') return null;
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v ? (v as LanguageCode) : null;
  } catch {
    return null;
  }
}

export function setStoredLanguage(code: LanguageCode): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {}
}

export function getLanguageMeta(code: LanguageCode): LanguageMeta {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code) || SUPPORTED_LANGUAGES[0];
}

/** Translates a single phrase using the local dictionary first. */
export function translatePhrase(phrase: string, lang: LanguageCode): string {
  if (lang === 'en') return phrase;
  const dict = PHRASES[phrase];
  if (dict && dict[lang]) return dict[lang];
  return phrase;
}

/**
 * Translates arbitrary text via MyMemory (free). Falls back to the original
 * string on any failure. Results are cached in-memory per session.
 */
const remoteCache = new Map<string, string>();

export async function translateDynamicText(
  text: string,
  target: LanguageCode,
  source: string = 'en',
): Promise<string> {
  if (target === 'en') return text;
  const cacheKey = `${source}:${target}:${text}`;
  if (remoteCache.has(cacheKey)) return remoteCache.get(cacheKey)!;

  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`,
    );
    if (res.ok) {
      const data = await res.json();
      const translated = data?.responseData?.translatedText;
      if (translated && translated !== 'MYMEMORY WARNING: YOU USED ALL AVAILABLE FREE TRANSLATIONS FOR TODAY.') {
        remoteCache.set(cacheKey, translated);
        return translated;
      }
    }
  } catch {
    /* ignore */
  }

  remoteCache.set(cacheKey, text);
  return text;
}