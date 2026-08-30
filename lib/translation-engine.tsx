'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageCode =
  | 'pidgin'
  | 'yoruba'
  | 'hausa'
  | 'igbo'
  | 'twi'
  | 'swahili'
  | 'zulu'
  | 'en'
  | 'fr'
  | 'pt';

export interface LanguageMeta {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
  greeting: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  // NIGERIA PRIORITY AT TOP
  { code: 'pidgin',  name: 'Nigerian Pidgin', nativeName: 'Naija Pidgin',       flag: '🇳🇬', dir: 'ltr', greeting: 'Welcome to Mivaj! Correct banker don land!' },
  { code: 'yoruba',  name: 'Yorùbá',          nativeName: 'Èdè Yorùbá',         flag: '🇳🇬', dir: 'ltr', greeting: 'Káàbọ̀ sí Mivaj Sports! Ìsọtẹ́lẹ̀ tòní!' },
  { code: 'hausa',   name: 'Hausa',           nativeName: 'Harshen Hausa',      flag: '🇳🇬', dir: 'ltr', greeting: 'Barka da zuwa Mivaj Sports! Hasashen yau!' },
  { code: 'igbo',    name: 'Igbo',            nativeName: 'Asụsụ Igbo',         flag: '🇳🇬', dir: 'ltr', greeting: 'Nnọọ na Mivaj Sports! Amụma bọọlụ taa!' },
  
  // AFRICAN REGIONS
  { code: 'twi',     name: 'Twi (Ghana)',     nativeName: 'Twi',                flag: '🇬🇭', dir: 'ltr', greeting: 'Akwaaba ba Mivaj Sports! Nnɛ agodie!' },
  { code: 'swahili', name: 'Swahili (East Africa)', nativeName: 'Kiswahili',   flag: '🇰🇪', dir: 'ltr', greeting: 'Karibu Mivaj Sports! Bashiri za leo!' },
  { code: 'zulu',    name: 'isiZulu (South Africa)', nativeName: 'isiZulu',    flag: '🇿🇦', dir: 'ltr', greeting: 'Siyakwamukela ku Mivaj Sports!' },
  
  // GLOBAL & FRANCOPHONE/LUSOPHONE AFRICA
  { code: 'en',      name: 'English (Primary)', nativeName: 'English (UK)',     flag: '🇬🇧', dir: 'ltr', greeting: 'Welcome to Mivaj Sports Intelligence!' },
  { code: 'fr',      name: 'French (Afrique)',  nativeName: 'Français',         flag: '🇫🇷', dir: 'ltr', greeting: 'Bienvenue sur Mivaj Sports!' },
  { code: 'pt',      name: 'Portuguese (PALOP)', nativeName: 'Português',       flag: '🇵🇹', dir: 'ltr', greeting: 'Bem-vindo ao Mivaj Sports!' },
];

const STORAGE_KEY = 'mivaj_active_language';

export const COMPREHENSIVE_DICTIONARY: Record<string, Partial<Record<LanguageCode, string>>> = {
  // Brand, Navigation & Tabs
  'LIVE WIRE': {
    en: 'LIVE WIRE',
    pidgin: 'LIVE WIRE (AS E DEY HOT 🔥)',
    yoruba: 'WÁYÀ LÁYÉ ⚡',
    hausa: 'LABARAI MASU ZAFI ⚡',
    igbo: 'WAYA NDỤ ⚡',
    twi: 'GYA WIRE ⚡',
    swahili: 'WAYA YA MOJA KWA MOJA ⚡',
    zulu: 'UKUSAKAZA OKUBANDAYO ⚡',
    fr: 'EN DIRECT ⚡',
    pt: 'AO VIVO ⚡',
  },
  'Fixtures': {
    en: 'Fixtures',
    pidgin: 'Ball Wey Dey Play ⚽',
    yoruba: 'Àwọn Ìfẹsẹ̀wọnsẹ̀',
    hausa: 'Wasanni',
    igbo: 'Egwuregwu',
    twi: 'Agodie',
    swahili: 'Mechi',
    zulu: 'Imidlalo',
    fr: 'Matches',
    pt: 'Jogos',
  },
  'Revealer': {
    en: 'Revealer',
    pidgin: 'Unwrap Booking Code 🔍',
    yoruba: 'Àfihàn Kóòdù 🔍',
    hausa: 'Mai Fitar da Code 🔍',
    igbo: 'Ihe Ngosi Koodu 🔍',
    twi: 'Koodu Nkyerɛkyerɛmu 🔍',
    swahili: 'Kifungua Nambari 🔍',
    zulu: 'Umlandi Wekhodi 🔍',
    fr: 'Décodeur 🔍',
    pt: 'Decodificador 🔍',
  },
  'Ledger': {
    en: 'Ledger',
    pidgin: 'Referee Settlement Ledger 📜',
    yoruba: 'Ìwé Ìtàn 📜',
    hausa: 'Littafin Sakamako 📜',
    igbo: 'Akwụkwọ Ndekọ 📜',
    twi: 'Nkyerɛwee 📜',
    swahili: 'Daftari la Matokeo 📜',
    zulu: 'Incwadi Yemiphumela 📜',
    fr: 'Registre 📜',
    pt: 'Histórico 📜',
  },
  'News': {
    en: 'News',
    pidgin: 'Hot Hot Tori & Gist 📰',
    yoruba: 'Ìròyìn Tuntun 📰',
    hausa: 'Labarai 📰',
    igbo: 'Ozi Ọhụrụ 📰',
    twi: 'Amanneɛbɔ 📰',
    swahili: 'Habari 📰',
    zulu: 'Izindaba 📰',
    fr: 'Actualités 📰',
    pt: 'Notícias 📰',
  },
  'Account': {
    en: 'Account',
    pidgin: 'My Vault & Bankroll 👤',
    yoruba: 'Àkọọ́lẹ̀ Mi 👤',
    hausa: 'Asusu Na 👤',
    igbo: 'Akaụntụ M 👤',
    twi: 'Akawnti 👤',
    swahili: 'Akaunti Yangu 👤',
    zulu: 'I-akhawunti 👤',
    fr: 'Mon Compte 👤',
    pt: 'Minha Conta 👤',
  },
  'Live': {
    en: 'Live',
    pidgin: 'As E Dey Hot (Live) 🔥',
    yoruba: 'Láyé',
    hausa: 'Kai Tsaye',
    igbo: 'Ndụ',
    twi: 'Mprempren',
    swahili: 'Moja kwa Moja',
    zulu: 'Bukhoma',
    fr: 'En Direct',
    pt: 'Ao Vivo',
  },
  'Upcoming': {
    en: 'Upcoming',
    pidgin: 'Next Matches (Dey Come) ⏰',
    yoruba: 'Tó ń Bọ̀',
    hausa: 'Masu Zuwa',
    igbo: 'Na-abịa',
    twi: 'Ɛreba',
    swahili: 'Zijazo',
    zulu: 'Okuzayo',
    fr: 'À Venir',
    pt: 'Próximos',
  },
  'Played': {
    en: 'Played',
    pidgin: 'Don Finish (FT) 🏁',
    yoruba: 'Ti Pari',
    hausa: 'An Gama',
    igbo: 'Emechara',
    twi: 'Awie',
    swahili: 'Zilizokamilika',
    zulu: 'Kuphelile',
    fr: 'Terminés',
    pt: 'Encerrados',
  },
  'I Bet This (+1)': {
    en: 'I Bet This (+1)',
    pidgin: 'I Dey Follow Dis One (+1) 🔥',
    yoruba: 'Mo Tẹ́lẹ́ Wọn (+1) 🔥',
    hausa: 'Na Zabi Wannan (+1) 🔥',
    igbo: 'M Tinyere Ego (+1) 🔥',
    twi: 'Metow So (+1) 🔥',
    swahili: 'Nimebashiri Hii (+1) 🔥',
    zulu: 'Ngibheja Lokhu (+1) 🔥',
    fr: 'J\'ai Parié (+1) 🔥',
    pt: 'Apostei Nisso (+1) 🔥',
  },
  'Placed ✓': {
    en: 'Placed ✓',
    pidgin: 'Don Lock Am ✓',
    yoruba: 'Ti Tẹ́lẹ́ ✓',
    hausa: 'An Sanya ✓',
    igbo: 'Tinyere ✓',
    twi: 'Atow ✓',
    swahili: 'Imewekwa ✓',
    zulu: 'Kubhejiwe ✓',
    fr: 'Parié ✓',
    pt: 'Apostado ✓',
  },
};

interface TranslationContextType {
  currentLang: LanguageCode;
  lang: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  setLang: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  isRTL: boolean;
  activeLanguageMeta: LanguageMeta;
  meta: LanguageMeta;
}

const defaultMeta = SUPPORTED_LANGUAGES.find((l) => l.code === 'pidgin') || SUPPORTED_LANGUAGES[0];

const TranslationContext = createContext<TranslationContextType>({
  currentLang: 'pidgin',
  lang: 'pidgin',
  setLanguage: () => {},
  setLang: () => {},
  t: (key: string, fallback?: string) => fallback || key,
  isRTL: false,
  activeLanguageMeta: defaultMeta,
  meta: defaultMeta,
});

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLang, setCurrentLang] = useState<LanguageCode>('pidgin');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        setCurrentLang(saved);
        const meta = SUPPORTED_LANGUAGES.find((l) => l.code === saved);
        document.documentElement.dir = meta?.dir || 'ltr';
        document.documentElement.lang = saved;
      } else {
        // First page load: default to Nigerian Pidgin site-wide
        setCurrentLang('pidgin');
        localStorage.setItem(STORAGE_KEY, 'pidgin');
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = 'pidgin';
      }

      // Detect and persist location once (do not overwrite if already detected)
      if (!localStorage.getItem('mivaj_detected_country')) {
        try {
          fetch('https://ipwho.is/', { signal: AbortSignal.timeout(4000) })
            .then((r) => (r.ok ? r.json() : null))
            .then((geo) => {
              if (geo && geo.country) {
                localStorage.setItem('mivaj_detected_country', geo.country);
                localStorage.setItem('mivaj_detected_city', geo.city || '');
              }
            })
            .catch(() => {});
        } catch {}
      }
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setCurrentLang(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, lang);
      const meta = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
      document.documentElement.dir = meta?.dir || 'ltr';
      document.documentElement.lang = lang;
    }
  };

  const t = (key: string, fallback?: string): string => {
    if (!key) return '';
    const cleanKey = key.trim();
    if (currentLang === 'en') return cleanKey;

    const entry = COMPREHENSIVE_DICTIONARY[cleanKey];
    if (entry && entry[currentLang]) {
      return entry[currentLang]!;
    }
    return fallback || cleanKey;
  };

  const activeLanguageMeta = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || defaultMeta;
  const isRTL = activeLanguageMeta.dir === 'rtl';

  return (
    <TranslationContext.Provider
      value={{
        currentLang,
        lang: currentLang,
        setLanguage,
        setLang: setLanguage,
        t,
        isRTL,
        activeLanguageMeta,
        meta: activeLanguageMeta,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export const LanguageProvider = TranslationProvider;
export const useTranslation = () => useContext(TranslationContext);
export const useLanguage = () => useContext(TranslationContext);
