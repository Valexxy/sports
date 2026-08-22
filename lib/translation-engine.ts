/**
 * AURASCORE TRANSLATION ENGINE
 * Supports: English, Nigerian Pidgin, Yoruba, Igbo, Hausa
 * All Nigerian languages + English. Built-in dictionary for instant UI translation.
 */

export type LanguageCode = 'en' | 'pidgin' | 'yoruba' | 'igbo' | 'hausa';

export interface LanguageMeta {
  code: LanguageCode;
  name: string;
  flag: string;
  dir: 'ltr' | 'rtl';
  greeting: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'en',     name: 'English',        flag: '🇬🇧', dir: 'ltr', greeting: 'Welcome to AuraScore!' },
  { code: 'pidgin', name: 'Nigerian Pidgin', flag: '🇳🇬', dir: 'ltr', greeting: 'Welcome to AuraScore! Na here the big predictions dey!' },
  { code: 'yoruba', name: 'Yoruba',          flag: '🟢', dir: 'ltr', greeting: 'Kaabo si AuraScore!' },
  { code: 'igbo',   name: 'Igbo',            flag: '🔴', dir: 'ltr', greeting: 'Nnọọ na AuraScore!' },
  { code: 'hausa',  name: 'Hausa',           flag: '🟡', dir: 'ltr', greeting: 'Barka da zuwa AuraScore!' },
];

const STORAGE_KEY = 'aurascore_language';

/**
 * Full phrase dictionary for all Nigerian languages + Pidgin.
 * Keys are English phrases. Values map language code -> translation.
 */
const PHRASES: Record<string, Record<LanguageCode, string>> = {
  'Live': {
    en: 'Live', pidgin: 'Live Now', yoruba: 'Laaye', igbo: 'Ndụ ugbu a', hausa: 'Raye yanzu',
  },
  'Upcoming': {
    en: 'Upcoming', pidgin: 'Coming Up', yoruba: 'Tó Ń Bọ̀', igbo: 'Nke na-abịa', hausa: 'Mai zuwa',
  },
  'Played': {
    en: 'Played', pidgin: 'Don Play', yoruba: 'Ti Ṣeré', igbo: 'Egwuola', hausa: 'An Taka',
  },
  'Add Pick': {
    en: 'Add Pick', pidgin: 'Add Am', yoruba: 'Fi Kun', igbo: 'Tinye', hausa: 'Ƙara',
  },
  'View Full Match Insights': {
    en: 'View Full Match Insights', pidgin: 'See Full Gist', yoruba: 'Wo Ìmọ̀ Ikẹyìn', igbo: 'Lee ihe niile', hausa: 'Duba Cikakken',
  },
  'Football': {
    en: 'Football', pidgin: 'Bóólu', yoruba: 'Bọ́ọ̀lù ẹsẹ̀', igbo: 'Ọkpọkọ ukwu', hausa: 'Ƙwallon ƙafa',
  },
  'Basketball': {
    en: 'Basketball', pidgin: 'Basket', yoruba: 'Bọ́ọ̀lù agbọ̀n', igbo: 'Basketball', hausa: 'Ƙwallon kwando',
  },
  'Tennis': {
    en: 'Tennis', pidgin: 'Tennis', yoruba: 'Tẹ́nísì', igbo: 'Tennis', hausa: 'Tennis',
  },
  "Today's Matches": {
    en: "Today's Matches", pidgin: "Today Match", yoruba: 'Eré Òní', igbo: 'Egwu taa', hausa: 'Wasannin Yau',
  },
  'Search team, league or fixture...': {
    en: 'Search team, league or fixture...', pidgin: 'Search team or match...', yoruba: 'Ẹwá ẹgbẹ́ tàbí eré...', igbo: 'Chọọ otu ma ọ bụ egwu...', hausa: 'Nemi tawaga ko wasa...',
  },
  'Send Birthday Wish': {
    en: 'Send Birthday Wish', pidgin: 'Wish Am Happy Birthday', yoruba: 'Pàdé Ọjọ́ ìbí', igbo: 'Zịta ọchịchọ ụbọchị ọmụmụ', hausa: 'Aika fatan haihuwa',
  },
  'Synced': {
    en: 'Synced', pidgin: 'E Don Update', yoruba: 'Ti Sọ̀kan', igbo: 'Emegharịla', hausa: 'An sabunta',
  },
  'Load More': {
    en: 'Load More', pidgin: 'Show More', yoruba: 'Ṣàfihàn Síi', igbo: 'Gosi ọzọ', hausa: 'Nuna ƙari',
  },
  'Match Insights': {
    en: 'Match Insights', pidgin: 'Match Gist', yoruba: 'Ìmọ̀ Eré', igbo: 'Ihe ọmụma egwu', hausa: 'Bayanan Wasa',
  },
  'Home Win': {
    en: 'Home Win', pidgin: 'Home Team Go Win', yoruba: 'Ẹgbẹ́ Ilé Fani', igbo: 'Otu ụlọ ga-enweta ihe', hausa: 'Nasarar gida',
  },
  'Draw': {
    en: 'Draw', pidgin: 'E Tie', yoruba: 'Dọ́gbọ̀', igbo: 'Nsogbu', hausa: 'Daidai',
  },
  'Away Win': {
    en: 'Away Win', pidgin: 'Away Team Go Win', yoruba: 'Ẹgbẹ́ Àlejò Fani', igbo: 'Otu ọbịa ga-enweta ihe', hausa: 'Nasarar waje',
  },
  'Kick-off': {
    en: 'Kick-off', pidgin: 'Match Start Time', yoruba: 'Àkókò Bẹ̀rẹ̀', igbo: 'Oge mmalite', hausa: 'Lokacin fara',
  },
};

export function detectBrowserLanguage(): LanguageCode {
  if (typeof navigator === 'undefined') return 'en';
  const raw = (navigator.language || 'en').toLowerCase().split('-')[0];
  const valid: LanguageCode[] = ['en', 'pidgin', 'yoruba', 'igbo', 'hausa'];
  return valid.includes(raw as LanguageCode) ? (raw as LanguageCode) : 'en';
}

export function getStoredLanguage(): LanguageCode | null {
  if (typeof window === 'undefined') return null;
  try { const v = localStorage.getItem(STORAGE_KEY); return v ? (v as LanguageCode) : null; } catch { return null; }
}

export function setStoredLanguage(code: LanguageCode): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STORAGE_KEY, code); } catch {}
}

export function getLanguageMeta(code: LanguageCode): LanguageMeta {
  return SUPPORTED_LANGUAGES.find(l => l.code === code) || SUPPORTED_LANGUAGES[0];
}

export function translatePhrase(phrase: string, lang: LanguageCode): string {
  if (lang === 'en') return phrase;
  const dict = PHRASES[phrase];
  if (dict && dict[lang]) return dict[lang];
  return phrase; // fallback to English
}

// In-memory cache for remote translations
const remoteCache = new Map<string, string>();

export async function translateDynamicText(text: string, target: LanguageCode, source = 'en'): Promise<string> {
  if (target === 'en') return text;
  const key = `${source}:${target}:${text}`;
  if (remoteCache.has(key)) return remoteCache.get(key)!;
  // For Nigerian languages, check local dict first
  const local = translatePhrase(text, target);
  if (local !== text) { remoteCache.set(key, local); return local; }
  // Fallback: MyMemory API (supports Yoruba, Hausa)
  const langMap: Record<LanguageCode, string> = { en: 'en', pidgin: 'en', yoruba: 'yo', igbo: 'ig', hausa: 'ha' };
  const targetCode = langMap[target] || 'en';
  if (targetCode === 'en') { remoteCache.set(key, text); return text; }
  try {
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${targetCode}`);
    if (res.ok) {
      const data = await res.json();
      const t = data?.responseData?.translatedText;
      if (t && !t.includes('MYMEMORY WARNING')) { remoteCache.set(key, t); return t; }
    }
  } catch { /* ignore */ }
  remoteCache.set(key, text);
  return text;
}
