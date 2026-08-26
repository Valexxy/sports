'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageCode =
  | 'pidgin'
  | 'igbo'
  | 'hausa'
  | 'yoruba'
  | 'en'
  | 'fr'
  | 'es'
  | 'ar'
  | 'pt'
  | 'de';

export interface LanguageMeta {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
  greeting: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'pidgin', name: 'Nigerian Pidgin', nativeName: 'Naija Pidgin', flag: '🇳🇬', dir: 'ltr', greeting: 'Welcome to Mivaj! Correct banker don land!' },
  { code: 'igbo',   name: 'Igbo',             nativeName: 'Asụsụ Igbo',   flag: '🇳🇬', dir: 'ltr', greeting: 'Nnọọ na Mivaj Sports! Amụma bọọlụ taa!' },
  { code: 'hausa',  name: 'Hausa',            nativeName: 'Harshen Hausa', flag: '🇳🇬', dir: 'ltr', greeting: 'Barka da zuwa Mivaj Sports! Hasashen yau!' },
  { code: 'yoruba', name: 'Yorùbá',           nativeName: 'Èdè Yorùbá',    flag: '🇳🇬', dir: 'ltr', greeting: 'Káàbọ̀ sí Mivaj Sports! Ìsọtẹ́lẹ̀ tòní!' },
  { code: 'en',     name: 'English',          nativeName: 'English (UK)', flag: '🇬🇧', dir: 'ltr', greeting: 'Welcome to Mivaj Sports Intelligence!' },
  { code: 'fr',     name: 'French',           nativeName: 'Français',     flag: '🇫🇷', dir: 'ltr', greeting: 'Bienvenue sur Mivaj Sports!' },
  { code: 'es',     name: 'Spanish',          nativeName: 'Español',      flag: '🇪🇸', dir: 'ltr', greeting: '¡Bienvenido a Mivaj Sports!' },
  { code: 'ar',     name: 'Arabic',           nativeName: 'العربية',      flag: '🇸🇦', dir: 'rtl', greeting: 'مرحباً بكم في ميفاج سبورتس!' },
  { code: 'pt',     name: 'Portuguese',       nativeName: 'Português',    flag: '🇵🇹', dir: 'ltr', greeting: 'Bem-vindo ao Mivaj Sports!' },
  { code: 'de',     name: 'German',           nativeName: 'Deutsch',      flag: '🇩🇪', dir: 'ltr', greeting: 'Willkommen bei Mivaj Sports!' },
];

const STORAGE_KEY = 'mivaj_active_language';

export const COMPREHENSIVE_DICTIONARY: Record<string, Partial<Record<LanguageCode, string>>> = {
  // Brand, Header & Ticker
  'LIVE WIRE': {
    en: 'LIVE WIRE',
    pidgin: 'LIVE WIRE ⚡',
    yoruba: 'WÁYÀ LÁYÉ ⚡',
    igbo: 'WAYA NDỤ ⚡',
    hausa: 'LABARAI MASU ZAFI ⚡',
    fr: 'EN DIRECT ⚡',
    es: 'EN VIVO ⚡',
    ar: 'البث المباشر ⚡',
    pt: 'AO VIVO ⚡',
    de: 'LIVE-WIRE ⚡',
  },
  'Live': {
    en: 'Live',
    pidgin: 'Live Now',
    yoruba: 'Láyé',
    igbo: 'Ndụ',
    hausa: 'Kai Tsaye',
    fr: 'En Direct',
    es: 'En Vivo',
    ar: 'مباشر',
    pt: 'Ao Vivo',
    de: 'Live',
  },
  'Upcoming': {
    en: 'Upcoming',
    pidgin: 'Dey Come',
    yoruba: 'Tó ń Bọ̀',
    igbo: 'Na-abịa',
    hausa: 'Masu Zuwa',
    fr: 'À Venir',
    es: 'Próximos',
    ar: 'القادمة',
    pt: 'Próximos',
    de: 'Bevorstehend',
  },
  'Played': {
    en: 'Played',
    pidgin: 'Don Finish',
    yoruba: 'Ti Pari',
    igbo: 'Emechara',
    hausa: 'An Gama',
    fr: 'Terminés',
    es: 'Finalizados',
    ar: 'المنتهية',
    pt: 'Encerrados',
    de: 'Beendet',
  },
  'Following': {
    en: 'Following',
    pidgin: 'Following',
    yoruba: 'Àwọn Tí Mò Ń Tẹ̀lé',
    igbo: 'Ndị Ana-eso',
    hausa: 'Wadanda Ake Bi',
    fr: 'Favoris',
    es: 'Siguiendo',
    ar: 'المفضلة',
    pt: 'Seguindo',
    de: 'Favoriten',
  },
  'All Leagues': {
    en: 'All Leagues',
    pidgin: 'All Leagues 🌍',
    yoruba: 'Gbogbo Liigi 🌍',
    igbo: 'Liigi Niile 🌍',
    hausa: 'Duk Gasanni 🌍',
    fr: 'Toutes Ligues 🌍',
    es: 'Todas las Ligas 🌍',
    ar: 'جميع الدوريات 🌍',
    pt: 'Todas as Ligas 🌍',
    de: 'Alle Ligen 🌍',
  },
  "Today's Matches": {
    en: "Today's Matches",
    pidgin: "Today Matches ⚽",
    yoruba: "Àwọn Eré Òní ⚽",
    igbo: "Egwuregwu Taa ⚽",
    hausa: "Wasannin Yau ⚽",
    fr: "Matchs d'Aujourd'hui ⚽",
    es: "Partidos de Hoy ⚽",
    ar: "مباريات اليوم ⚽",
    pt: "Jogos de Hoje ⚽",
    de: "Heutige Spiele ⚽",
  },
  'Search team, league or fixture...': {
    en: 'Search team, league or fixture...',
    pidgin: 'Search team, league or fixture...',
    yoruba: 'Wá ẹgbẹ́, liigi tàbí eré...',
    igbo: 'Chọọ otu, liigi ma ọ bụ egwuregwu...',
    hausa: 'Nemi kungiya, gasa ko wasa...',
    fr: 'Rechercher une équipe, ligue...',
    es: 'Buscar equipo, liga o partido...',
    ar: 'ابحث عن فريق، دوري أو مباراة...',
    pt: 'Pesquisar equipa, liga ou jogo...',
    de: 'Team, Liga oder Spiel suchen...',
  },
  'Accumulator Bet Slip': {
    en: 'Accumulator Bet Slip',
    pidgin: 'Accumulator Bet Slip 🎟️',
    yoruba: 'Àkójọ Ìsọtẹ́lẹ̀ Bet Slip 🎟️',
    igbo: 'Akwụkwọ Nzọ Accumulator 🎟️',
    hausa: 'Takardar Caca ta Accumulator 🎟️',
    fr: 'Coupon de Pari Combiné 🎟️',
    es: 'Boleto de Apuesta Combinada 🎟️',
    ar: 'قسيمة الرهان المجمع 🎟️',
    pt: 'Boletim de Apostas Múltiplas 🎟️',
    de: 'Kombiwette Wettschein 🎟️',
  },
  'Clear All Picks': {
    en: 'Clear All Picks',
    pidgin: 'Clear All Picks',
    yoruba: 'Pa Gbogbo Ìsọtẹ́lẹ̀ Rẹ́',
    igbo: 'Hichapụ Nhọrọ Niile',
    hausa: 'Goge Duk Hasashe',
    fr: 'Effacer Tout',
    es: 'Borrar Todo',
    ar: 'مسح الكل',
    pt: 'Limpar Tudo',
    de: 'Alles Löschen',
  },
  '1-Click Export to Bookmaker:': {
    en: '1-Click Export to Bookmaker:',
    pidgin: '1-Click Load for Bookmaker:',
    yoruba: '1-Tẹ̀ Lọ Sí Ilé Kalokalo:',
    igbo: '1-Pịa Banye na Bookmaker:',
    hausa: 'Loda zuwa Wurin Caca da Danna 1:',
    fr: 'Exporter en 1-Clic vers Bookmaker:',
    es: 'Exportar en 1-Clic a Casa de Apuestas:',
    ar: 'تصدير بنقرة واحدة إلى موقع المراهنات:',
    pt: 'Exportar em 1-Clique para Casa de Apostas:',
    de: '1-Klick Export zum Wettanbieter:',
  },
};

interface TranslationContextType {
  lang: LanguageCode;
  setLang: (code: LanguageCode) => void;
  meta: LanguageMeta;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType>({
  lang: 'pidgin',
  setLang: () => {},
  meta: SUPPORTED_LANGUAGES[0],
  t: (key: string) => key,
});

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<LanguageCode>('pidgin');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
      if (stored && SUPPORTED_LANGUAGES.some((l) => l.code === stored)) {
        setLangState(stored);
      }
    } catch {}
  }, []);

  const setLang = (code: LanguageCode) => {
    setLangState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
      const meta = SUPPORTED_LANGUAGES.find((l) => l.code === code);
      if (meta && typeof document !== 'undefined') {
        document.documentElement.dir = meta.dir;
        document.documentElement.lang = meta.code;
      }
    } catch {}
  };

  const meta = SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];

  const t = (key: string): string => {
    const entry = COMPREHENSIVE_DICTIONARY[key];
    if (entry && entry[lang]) {
      return entry[lang]!;
    }
    if (entry && entry['en']) {
      return entry['en']!;
    }
    return key;
  };

  return (
    <TranslationContext.Provider value={{ lang, setLang, meta, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const LanguageProvider = TranslationProvider;
export const useTranslation = () => useContext(TranslationContext);
