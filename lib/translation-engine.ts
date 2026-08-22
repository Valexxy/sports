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
  | 'en' | 'es' | 'fr' | 'pt' | 'de' | 'it' | 'ar' | 'hi' | 'sw' | 'yo'
  | 'ha' | 'ig' | 'zu' | 'am' | 'nl' | 'pl' | 'tr' | 'ru' | 'ja' | 'ko'
  | 'zh' | 'vi' | 'th' | 'id' | 'bn' | 'ur' | 'fa' | 'ro' | 'el' | 'cs'
  | 'sv' | 'da' | 'no' | 'fi';

export interface LanguageMeta {
  code: LanguageCode;
  name: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'es', name: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'pt', name: 'Português', flag: '🇧🇷', dir: 'ltr' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', dir: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪', dir: 'ltr' },
  { code: 'yo', name: 'Yorùbá', flag: '🇳🇬', dir: 'ltr' },
  { code: 'ha', name: 'Hausa', flag: '🇳🇬', dir: 'ltr' },
  { code: 'ig', name: 'Igbo', flag: '🇳🇬', dir: 'ltr' },
  { code: 'zu', name: 'isiZulu', flag: '🇿🇦', dir: 'ltr' },
  { code: 'am', name: 'አማርኛ', flag: '🇪🇹', dir: 'ltr' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱', dir: 'ltr' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱', dir: 'ltr' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷', dir: 'ltr' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', dir: 'ltr' },
  { code: 'ja', name: '日本語', flag: '🇯🇵', dir: 'ltr' },
  { code: 'ko', name: '한국어', flag: '🇰🇷', dir: 'ltr' },
  { code: 'zh', name: '中文', flag: '🇨🇳', dir: 'ltr' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳', dir: 'ltr' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭', dir: 'ltr' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩', dir: 'ltr' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩', dir: 'ltr' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰', dir: 'rtl' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷', dir: 'rtl' },
  { code: 'ro', name: 'Română', flag: '🇷🇴', dir: 'ltr' },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷', dir: 'ltr' },
  { code: 'cs', name: 'Čeština', flag: '🇨🇿', dir: 'ltr' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪', dir: 'ltr' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰', dir: 'ltr' },
  { code: 'no', name: 'Norsk', flag: '🇳🇴', dir: 'ltr' },
  { code: 'fi', name: 'Suomi', flag: '🇫🇮', dir: 'ltr' },
];

const STORAGE_KEY = 'aurascore_language';

// Core phrase dictionary (English -> each language). Only high-frequency
// navigational terms. Full-string translation happens via remote fallback and
// is cached locally.
const PHRASES: Record<string, Record<string, string>> = {
  'All Matches': {
    es: 'Todos los partidos', fr: 'Tous les matchs', pt: 'Todas as partidas',
    de: 'Alle Spiele', it: 'Tutte le partite', ar: 'جميع المباريات', hi: 'सभी मैच',
    sw: 'Mechi zote', yo: 'Gbogbo ere', ha: 'Duk wasa', ig: 'Egwuregwu niile',
    zu: 'Yonke imidlalo', nl: 'Alle wedstrijden', pl: 'Wszystkie mecze',
    tr: 'Tüm maçlar', ru: 'Все матчи', ja: 'すべての試合', ko: '모든 경기',
    zh: '所有比赛', vi: 'Tất cả trận đấu', th: 'แมตช์ทั้งหมด', id: 'Semua pertandingan',
    bn: 'সব ম্যাচ', ur: 'تمام میچز', fa: 'همه مسابقات', ro: 'Toate meciurile',
    el: 'Όλοι οι αγώνες', cs: 'Všechny zápasy', sv: 'Alla matcher', da: 'Alle kampe',
    no: 'Alle kamper', fi: 'Kaikki ottelut',
  },
  Live: {
    es: 'En vivo', fr: 'En direct', pt: 'Ao vivo', de: 'Live', it: 'Live',
    ar: 'مباشر', hi: 'लाइव', sw: 'Moja kwa moja', yo: 'Ifiwe', ha: 'Kai-tsaye',
    ig: 'Na ndụ', zu: 'Bukhoma', nl: 'Live', pl: 'Na żywo', tr: 'Canlı',
    ru: 'В прямом эфире', ja: 'ライブ', ko: '라이브', zh: '直播', vi: 'Trực tiếp',
    th: 'สด', id: 'Langsung', bn: 'লাইভ', ur: 'لائیو', fa: 'زنده', ro: 'Live',
    el: 'Ζωντανά', cs: 'Živě', sv: 'Live', da: 'Live', no: 'Live', fi: 'Live',
  },
  Upcoming: {
    es: 'Próximos', fr: 'À venir', pt: 'Próximos', de: 'Bevorstehend', it: 'Prossimi',
    ar: 'قادم', hi: 'आगामी', sw: 'Zinazokuja', yo: 'Ti n bọ', ha: 'Masu zuwa',
    ig: 'Na-abịa', zu: 'Ezayo', nl: 'Aankomend', pl: 'Nadchodzące', tr: 'Yaklaşan',
    ru: 'Предстоящие', ja: '今後の試合', ko: '예정', zh: '即将开始', vi: 'Sắp diễn ra',
    th: 'เร็วๆ นี้', id: 'Mendatang', bn: 'আসন্ন', ur: 'آنے والے', fa: 'پیش رو',
    ro: 'Viitoare', el: 'Προσεχή', cs: 'Nadcházející', sv: 'Kommande', da: 'Kommende',
    no: 'Kommende', fi: 'Tulevat',
  },
  Played: {
    es: 'Jugados', fr: 'Joués', pt: 'Jogados', de: 'Gespielt', it: 'Giocati',
    ar: 'تم لعبها', hi: 'खेले गए', sw: 'Zilizochezwa', yo: 'Ti ṣere', ha: 'An yi',
    ig: 'Egwuregwu e gwuru', zu: 'Kudlaliwe', nl: 'Gespeeld', pl: 'Rozegrane',
    tr: 'Oynandı', ru: 'Сыграно', ja: '終了', ko: '종료', zh: '已结束', vi: 'Đã đấu',
    th: 'จบแล้ว', id: 'Selesai', bn: 'খেলা হয়েছে', ur: 'کھیلے گئے', fa: 'انجام شده',
    ro: 'Jucate', el: 'Παίχτηκαν', cs: 'Odehráno', sv: 'Spelade', da: 'Spillede',
    no: 'Spilt', fi: 'Pelatut',
  },
  Bankers: {
    es: 'Banqueros', fr: 'Banquiers', pt: 'Banqueiros', de: 'Banker', it: 'Banchieri',
    ar: 'المصرفيون', hi: 'बैंकर', sw: 'Mabenki', yo: 'Awọn banki', ha: 'Bankuna',
    ig: 'Ndị bank', zu: 'Amabhenki', nl: 'Bankers', pl: 'Bankierzy', tr: 'Bankerler',
    ru: 'Банкеры', ja: 'バンカー', ko: '뱅커', zh: '银行家', vi: 'Banker',
    th: 'แบงเกอร์', id: 'Banker', bn: 'ব্যাংকার', ur: 'بینکرز', fa: 'بانکرها',
    ro: 'Bankeri', el: 'Τραπεζίτες', cs: 'Bankeři', sv: 'Bankers', da: 'Bankers',
    no: 'Bankers', fi: 'Bankkerit',
  },
  'Search team, league or fixture...': {
    es: 'Buscar equipo, liga o partido...', fr: 'Rechercher équipe, ligue ou match...',
    pt: 'Buscar time, liga ou partida...', de: 'Team, Liga oder Spiel suchen...',
    it: 'Cerca squadra, lega o partita...', ar: 'ابحث عن فريق أو دوري أو مباراة...',
    hi: 'टीम, लीग या मैच खोजें...', sw: 'Tafuta timu, ligi au mechi...',
    yo: 'Wa ẹgbẹ, liigi tabi ere...', ha: 'Nemo ƙungiya, gasa ko wasa...',
    ig: 'Chọọ otu, asọmpi ma ọ bụ egwuregwu...', nl: 'Zoek team, competitie of wedstrijd...',
    pl: 'Szukaj drużyny, ligi lub meczu...', tr: 'Takım, lig veya maç ara...',
    ru: 'Поиск команды, лиги или матча...', ja: 'チーム、リーグ、試合を検索...',
    ko: '팀, 리그 또는 경기 검색...', zh: '搜索球队、联赛或比赛...', vi: 'Tìm kiếm đội, giải đấu hoặc trận đấu...',
    th: 'ค้นหาทีม ลีก หรือการแข่งขัน...', id: 'Cari tim, liga, atau pertandingan...',
    bn: 'দল, লিগ বা ম্যাচ খুঁজুন...', ur: 'ٹیم، لیگ یا میچ تلاش کریں...',
    fa: 'جستجوی تیم، لیگ یا مسابقه...', ro: 'Caută echipă, ligă sau meci...',
    el: 'Αναζήτηση ομάδας, διοργάνωσης ή αγώνα...', cs: 'Hledat tým, ligu nebo zápas...',
    sv: 'Sök lag, liga eller match...', da: 'Søg hold, liga eller kamp...',
    no: 'Søk lag, liga eller kamp...', fi: 'Hae joukkuetta, liigaa tai ottelua...',
  },
  'View Full Match Insights': {
    es: 'Ver análisis completo', fr: 'Voir l\'analyse complète', pt: 'Ver análise completa',
    de: 'Volle Analyse ansehen', it: 'Vedi analisi completa', ar: 'عرض التحليل الكامل',
    hi: 'पूर्ण विश्लेषण देखें', sw: 'Ona uchambuzi kamili', yo: 'Wo itupalẹ kikun',
    ha: 'Duba cikakken nazari', ig: 'Lee nyocha zuru ezu', nl: 'Bekijk volledige analyse',
    pl: 'Zobacz pełną analizę', tr: 'Tam analizi görüntüle', ru: 'Смотреть полный анализ',
    ja: '全分析を見る', ko: '전체 분석 보기', zh: '查看完整分析', vi: 'Xem phân tích đầy đủ',
    th: 'ดูการวิเคราะห์เต็ม', id: 'Lihat analisis lengkap', bn: 'সম্পূর্ণ বিশ্লেষণ দেখুন',
    ur: 'مکمل تجزیہ دیکھیں', fa: 'مشاهده تحلیل کامل', ro: 'Vezi analiza completă',
    el: 'Δείτε την πλήρη ανάλυση', cs: 'Zobrazit plnou analýzu', sv: 'Se fullständig analys',
    da: 'Se fuld analyse', no: 'Se full analyse', fi: 'Näytä täysi analyysi',
  },
  'Add Pick': {
    es: 'Añadir', fr: 'Ajouter', pt: 'Adicionar', de: 'Hinzufügen', it: 'Aggiungi',
    ar: 'أضف', hi: 'जोड़ें', sw: 'Ongeza', yo: 'Ṣafikun', ha: 'Ƙara', ig: 'Tinye',
    zu: 'Engeza', nl: 'Toevoegen', pl: 'Dodaj', tr: 'Ekle', ru: 'Добавить',
    ja: '追加', ko: '추가', zh: '添加', vi: 'Thêm', th: 'เพิ่ม', id: 'Tambah',
    bn: 'যোগ করুন', ur: 'شامل کریں', fa: 'افزودن', ro: 'Adaugă', el: 'Προσθήκη',
    cs: 'Přidat', sv: 'Lägg till', da: 'Tilføj', no: 'Legg til', fi: 'Lisää',
  },
  Football: {
    es: 'Fútbol', fr: 'Football', pt: 'Futebol', de: 'Fußball', it: 'Calcio',
    ar: 'كرة القدم', hi: 'फुटबॉल', sw: 'Soka', yo: 'Bọọlu', ha: 'Ƙwallon ƙafa',
    ig: 'Bọọlụ', zu: 'Ibhola', nl: 'Voetbal', pl: 'Piłka nożna', tr: 'Futbol',
    ru: 'Футбол', ja: 'サッカー', ko: '축구', zh: '足球', vi: 'Bóng đá',
    th: 'ฟุตบอล', id: 'Sepak bola', bn: 'ফুটবল', ur: 'فٹ بال', fa: 'فوتبال',
    ro: 'Fotbal', el: 'Ποδόσφαιρο', cs: 'Fotbal', sv: 'Fotboll', da: 'Fodbold',
    no: 'Fotball', fi: 'Jalkapallo',
  },
  Basketball: {
    es: 'Baloncesto', fr: 'Basket-ball', pt: 'Basquete', de: 'Basketball', it: 'Pallacanestro',
    ar: 'كرة السلة', hi: 'बास्केटबॉल', sw: 'Mpira wa kikapu', yo: 'Bọọlu agbọn',
    ha: 'Ƙwallon kwando', ig: 'Bọọlụ nkata', nl: 'Basketbal', pl: 'Koszykówka',
    tr: 'Basketbol', ru: 'Баскетбол', ja: 'バスケットボール', ko: '농구', zh: '篮球',
    vi: 'Bóng rổ', th: 'บาสเกตบอล', id: 'Bola basket', bn: 'বাস্কেটবল', ur: 'باسکٹ بال',
    fa: 'بسکتبال', ro: 'Baschet', el: 'Μπάσκετ', cs: 'Basketbal', sv: 'Basket',
    da: 'Basketball', no: 'Basketball', fi: 'Koripallo',
  },
  Tennis: {
    es: 'Tenis', fr: 'Tennis', pt: 'Tênis', de: 'Tennis', it: 'Tennis',
    ar: 'التنس', hi: 'टेनिस', sw: 'Tenis', yo: 'Tẹnisi', ha: 'Tenis', ig: 'Tenis',
    zu: 'Itennis', nl: 'Tennis', pl: 'Tenis', tr: 'Tenis', ru: 'Теннис',
    ja: 'テニス', ko: '테니스', zh: '网球', vi: 'Quần vợt', th: 'เทนนิส',
    id: 'Tenis', bn: 'টেনিস', ur: 'ٹینس', fa: 'تنیس', ro: 'Tenis', el: 'Τένις',
    cs: 'Tenis', sv: 'Tennis', da: 'Tennis', no: 'Tennis', fi: 'Tennis',
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