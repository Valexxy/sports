'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageCode = 'en' | 'pidgin' | 'yoruba' | 'igbo' | 'hausa';

export interface LanguageMeta {
  code: LanguageCode;
  name: string;
  flag: string;
  dir: 'ltr' | 'rtl';
  greeting: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'en',     name: 'English',          flag: '🇬🇧', dir: 'ltr', greeting: 'Welcome to AuraScore Stadium!' },
  { code: 'pidgin', name: 'Nigerian Pidgin',  flag: '🇳🇬', dir: 'ltr', greeting: 'Welcome to AuraScore! Correct banker don land!' },
  { code: 'yoruba', name: 'Yorùbá',           flag: '🇳🇬', dir: 'ltr', greeting: 'Káàbọ̀ sí AuraScore Stadium!' },
  { code: 'igbo',   name: 'Igbo',             flag: '🇳🇬', dir: 'ltr', greeting: 'Nnọọ na AuraScore Stadium!' },
  { code: 'hausa',  name: 'Hausa',            flag: '🇳🇬', dir: 'ltr', greeting: 'Barka da zuwa AuraScore Stadium!' },
];

const STORAGE_KEY = 'aurascore_language';

export const COMPREHENSIVE_DICTIONARY: Record<string, Record<LanguageCode, string>> = {
  // Navigation & Header
  'Live Matches': { en: 'Live Matches', pidgin: 'Live Matches', yoruba: 'Àwọn Eré Láyé', igbo: 'Egwuregwu Ndụ', hausa: 'Wasannin Raye' },
  'Live Matches ⚡': { en: 'Live Matches ⚡', pidgin: 'Live Matches ⚡', yoruba: 'Àwọn Eré Láyé ⚡', igbo: 'Egwuregwu Ndụ ⚡', hausa: 'Wasannin Raye ⚡' },
  'Stadium Hub': { en: 'Stadium Hub ⚡', pidgin: 'Stadium Hub ⚡', yoruba: 'Ibùdó Pápá ⚡', igbo: 'Ebe Ama Egwuregwu ⚡', hausa: 'Cibiyar Filin Wasa ⚡' },
  'Stadium Hub ⚡': { en: 'Stadium Hub ⚡', pidgin: 'Stadium Hub ⚡', yoruba: 'Ibùdó Pápá ⚡', igbo: 'Ebe Ama Egwuregwu ⚡', hausa: 'Cibiyar Filin Wasa ⚡' },
  'Leaderboard': { en: 'Leaderboard', pidgin: 'Leaderboard 🏆', yoruba: 'Àkójọ Olórí 🏆', igbo: 'Ndị Isi Oche 🏆', hausa: 'Teburin Jagorori 🏆' },
  'Birthdays': { en: 'Birthdays 🎂', pidgin: 'Birthdays 🎂', yoruba: 'Ọjọ́ Ìbí 🎂', igbo: 'Ụbọchị Ọmụmụ 🎂', hausa: 'Ranar Haihuwa 🎂' },
  'Flex Slip': { en: 'Flex Slip 🔥', pidgin: 'Flex Slip 🔥', yoruba: 'Iwe Tiketi 🔥', igbo: 'Tiketi Flex 🔥', hausa: 'Tikitin Wasa 🔥' },
  'Flex Slip 🔥': { en: 'Flex Slip 🔥', pidgin: 'Flex Slip 🔥', yoruba: 'Iwe Tiketi 🔥', igbo: 'Tiketi Flex 🔥', hausa: 'Tikitin Wasa 🔥' },
  'Hub': { en: 'Hub', pidgin: 'Hub', yoruba: 'Ibùdó', igbo: 'Ebe', hausa: 'Cibiya' },
  'Profile': { en: 'Profile', pidgin: 'My Profile', yoruba: 'Àkọọ́lẹ̀ Mi', igbo: 'Profaịlụ M', hausa: 'Bayanina' },
  'Matches': { en: 'Matches', pidgin: 'All Matches', yoruba: 'Àwọn Eré', igbo: 'Egwuregwu', hausa: 'Wasanni' },

  // Filters & Tabs
  'Live': { en: 'Live', pidgin: 'Live Now 🔴', yoruba: 'Láyé 🔴', igbo: 'Ndụ Ugbu A 🔴', hausa: 'Raye Yanzu 🔴' },
  'Upcoming': { en: 'Upcoming', pidgin: 'Coming Up 🟡', yoruba: 'Tó Ń Bọ̀ 🟡', igbo: 'Na-abịa 🟡', hausa: 'Mai Zuwa 🟡' },
  'Played': { en: 'Played', pidgin: 'Don Finish ✅', yoruba: 'Ti Ṣeré ✅', igbo: 'Emechara ✅', hausa: 'An Kammala ✅' },
  'All': { en: 'All Matches', pidgin: 'All Matches', yoruba: 'Gbogbo Eré', igbo: 'Egwuregwu Niile', hausa: 'Duk Wasanni' },
  'High Guarantees (70%+)': { en: '👑 High Guarantees (70%+)', pidgin: '👑 Sure Banker (70%+)', yoruba: '👑 Ìdánilójú Gíga (70%+)', igbo: '👑 Eziokwu Nwere Nkwa (70%+)', hausa: '👑 Tabbaci Mai Yawa (70%+)' },

  // Date Navigator
  'Yesterday': { en: 'Yesterday', pidgin: 'Yesterday', yoruba: 'Àná', igbo: 'Ụnyaahụ', hausa: 'Jiya' },
  'Today': { en: 'Today', pidgin: 'Today', yoruba: 'Òní', igbo: 'Taa', hausa: 'Yau' },
  'Tomorrow': { en: 'Tomorrow', pidgin: 'Tomorrow', yoruba: 'Ọ̀la', igbo: 'Echi', hausa: 'Gobe' },
  'Earlier': { en: 'Earlier', pidgin: 'Earlier', yoruba: 'Tẹ́lẹ̀', igbo: 'Na Mbụ', hausa: 'Da Farko' },
  'Ahead': { en: 'Ahead', pidgin: 'Ahead', yoruba: 'Iwájú', igbo: 'N’ihu', hausa: 'A Gaba' },
  "Today's Matches": { en: "Today's Matches", pidgin: "Today Matches", yoruba: "Àwọn Eré Òní", igbo: "Egwuregwu Taa", hausa: "Wasannin Yau" },

  // Match Cards & Actions
  '+ Add Pick': { en: '+ Add Pick', pidgin: '+ Add Am', yoruba: '+ Fi Kún', igbo: '+ Tinye', hausa: '+ Ƙara' },
  'Added ✓': { en: 'Added ✓', pidgin: 'Don Add ✓', yoruba: 'Ti Kún ✓', igbo: 'Etinyela ✓', hausa: 'An Ƙara ✓' },
  'Tap insights': { en: 'Tap insights', pidgin: 'Tap for gist', yoruba: 'Tẹ fún ìmọ̀', igbo: 'Kpatụ maka nkọwa', hausa: 'Danna don bayani' },
  'View Full Match Insights': { en: 'View Full Match Insights', pidgin: 'See Full Match Gist ➔', yoruba: 'Wo Ìmọ̀ Eré Pípé ➔', igbo: 'Lee Nkọwa Niile ➔', hausa: 'Duba Cikakken Bayani ➔' },
  'Prediction Reason:': { en: 'Prediction Reason:', pidgin: 'Why We Pick Am:', yoruba: 'Ìdí Ìsọtẹ́lẹ̀:', igbo: 'Ihe Mere Anyị Ji Họrọ:', hausa: 'Dalilin Hasashe:' },
  'Played at': { en: 'Played at', pidgin: 'Play for', yoruba: 'Ṣeré ní', igbo: 'Gbara na', hausa: 'An buga a' },
  'Starts in': { en: 'Starts in', pidgin: 'Go start in', yoruba: 'Yóò bẹ̀rẹ̀ ní', igbo: 'Ga-amalite na', hausa: 'Zai fara a' },
  'Home': { en: 'Home', pidgin: 'Home', yoruba: 'Ilé', igbo: 'Ụlọ', hausa: 'Gida' },
  'Draw': { en: 'Draw', pidgin: 'Draw / Stalemate', yoruba: 'Dọ́gba', igbo: 'Jikọọ', hausa: 'Canjaras' },
  'Away': { en: 'Away', pidgin: 'Away', yoruba: 'Àbẹ̀wò', igbo: 'Nleta', hausa: 'Waje' },
  'ULTRA-BANKER': { en: 'ULTRA-BANKER', pidgin: 'PURE BANKER 🔥', yoruba: 'ÌDÁNILÓJÚ PÍPÉ 🔥', igbo: 'EZIOKWU 100% 🔥', hausa: 'CIKAKKEN TABBACI 🔥' },
  'BANKER': { en: 'BANKER', pidgin: 'SURE PICK', yoruba: 'ÌDÁNILÓJÚ', igbo: 'EZIOKWU', hausa: 'TABBACI' },
  'HIGH VALUE': { en: 'HIGH VALUE', pidgin: 'HIGH VALUE ODD', yoruba: 'IYE GÍGA', igbo: 'URÙ DỊ ELU', hausa: 'DARAJA MAI YAWA' },
  'FT • WON': { en: 'FT • WON', pidgin: 'FT • WON ✓', yoruba: 'FT • WỌLÉ ✓', igbo: 'FT • MERIRI ✓', hausa: 'FT • AN CI ✓' },
  'FT • LOST': { en: 'FT • LOST', pidgin: 'FT • LOST', yoruba: 'FT • BỌ́', igbo: 'FT • KỌRỌ', hausa: 'FT • AN RASA' },

  // News Wire
  'LATEST FOOTBALL NEWS & MATCH WIRE 📰': { en: 'LATEST FOOTBALL NEWS & MATCH WIRE 📰', pidgin: 'LATEST FOOTBALL GIST & MATCH WIRE 📰', yoruba: 'ÌRÒYÌN BỌ́Ọ̀LÙ TUNTUN & WÁYÀ ERÉ 📰', igbo: 'OZI ỌHỤRỤ BỌỌLỤ NA AKWỤKWỌ 📰', hausa: 'LABARAN ƘWALLON ƘAFA NA YANZU 📰' },
  'Read Story': { en: 'Read Story', pidgin: 'Read Full Gist ➔', yoruba: 'Ka Ìròyìn ➔', igbo: 'Gụọ Akụkọ ➔', hausa: 'Karanta Labari ➔' },
  'Share Story': { en: 'Share Story', pidgin: 'Share Gist', yoruba: 'Pín Ìròyìn', igbo: 'Kekọrịta Akụkọ', hausa: 'Raba Labari' },
  '⚡ All News': { en: '⚡ All News', pidgin: '⚡ All Gist', yoruba: '⚡ Gbogbo Ìròyìn', igbo: '⚡ Ozi Niile', hausa: '⚡ Duk Labarai' },
  '🔥 Transfers': { en: '🔥 Transfers', pidgin: '🔥 Transfers Gist', yoruba: '🔥 Gbígbé Agbábọ́ọ̀lù', igbo: '🔥 Mgbanwe Ndị Egwuregwu', hausa: '🔥 Sayen Yan Wasa' },
  '🚨 Match Reports': { en: '🚨 Match Reports', pidgin: '🚨 Match Gist', yoruba: '🚨 Ìròyìn Eré', igbo: '🚨 Akụkọ Egwuregwu', hausa: '🚨 Rahoton Wasa' },
  '🚑 Injuries': { en: '🚑 Injuries', pidgin: '🚑 Injury Bulletins', yoruba: '🚑 Ìpalára Agbábọ́ọ̀lù', igbo: '🚑 Mmerụ Ahụ', hausa: '🚑 Raunin Yan Wasa' },
  '🧠 Manager & Tactics': { en: '🧠 Manager & Tactics', pidgin: '🧠 Coach & Tactics', yoruba: '🧠 Olùkọ́ & Ètò Eré', igbo: '🧠 Onye Nchịkwa & Usoro', hausa: '🧠 Koci & Dabaru' },
  '🇳🇬 Naija & AFCON': { en: '🇳🇬 Naija & AFCON', pidgin: '🇳🇬 Super Eagles & Naija', yoruba: '🇳🇬 Nàìjíríà & AFCON', igbo: '🇳🇬 Naịjirịa & AFCON', hausa: '🇳🇬 Najeriya & AFCON' },
  '⭐ UCL & Europe': { en: '⭐ UCL & Europe', pidgin: '⭐ Champions League', yoruba: '⭐ UCL & Yúróòpù', igbo: '⭐ UCL & Yurop', hausa: '⭐ UCL & Turai' },

  // Hub Features
  'STADIUM HUB & NAIJA LIVE SUITES ⚡🇳🇬': { en: 'STADIUM HUB & NAIJA LIVE SUITES ⚡🇳🇬', pidgin: 'STADIUM HUB & NAIJA LIVE SUITES ⚡🇳🇬', yoruba: 'IBÙDÓ PÁPÁ & ÀWỌN ERÉ NÀÌJÍRÍÀ ⚡🇳🇬', igbo: 'EBE AMA EGWUREGWU & SUITES NAỊJIRỊA ⚡🇳🇬', hausa: 'CIBIYAR FILIN WASA & DANDALIN NAJERIYA ⚡🇳🇬' },
  'Naija Grassroots Scouting 🇳🇬⚽': { en: 'Naija Grassroots Scouting 🇳🇬⚽', pidgin: 'Naija Grassroots Scouting 🇳🇬⚽', yoruba: 'Àwárí Agbábọ́ọ̀lù Nàìjíríà 🇳🇬⚽', igbo: 'Nchọpụta Ndị Na-eto Eto Naịjirịa 🇳🇬⚽', hausa: 'Gano Matasan Yan Wasa Na Najeriya 🇳🇬⚽' },
  'Gen-Z Roast & Banter Lounge 🔥': { en: 'Gen-Z Roast & Banter Lounge 🔥', pidgin: 'Naija Football Yab & Banter Lounge 🔥', yoruba: 'Yíyán Àwọn Ẹgbẹ́ & Àwàdà Bọ́ọ̀lù 🔥', igbo: 'Ebe Nkata & Njakịrị Bọọlụ 🔥', hausa: 'Dandalin Barkwanci & Zagin Ƙwallo 🔥' },
  'Star Birthdays & Fan Wishes 🎂': { en: 'Star Birthdays & Fan Wishes 🎂', pidgin: 'Star Birthdays & Fan Wishes 🎂', yoruba: 'Ọjọ́ Ìbí Àwọn Gbajúmọ̀ Agbábọ́ọ̀lù 🎂', igbo: 'Ụbọchị Ọmụmụ Ndị Dinta Bọọlụ 🎂', hausa: 'Ranar Haihuwar Manyan Yan Wasa 🎂' },
  'Community Golden Boy Leaderboard 🏆': { en: 'Community Golden Boy Leaderboard 🏆', pidgin: 'Top Punters & Golden Boy Leaderboard 🏆', yoruba: 'Àkójọ Olórí Golden Boy 🏆', igbo: 'Tebụl Ndị Kasị Mma Golden Boy 🏆', hausa: 'Teburin Jagororin Golden Boy 🏆' },
  'Settlement Ledger & Banker Records 📜': { en: 'Settlement Ledger & Banker Records 📜', pidgin: 'Official Match Record & Banker Ledger 📜', yoruba: 'Àkọsílẹ̀ Ìpèníyà Eré Pípé 📜', igbo: 'Akwụkwọ Ndekọ Emechara 📜', hausa: 'Teburin Sakamakon Wasanni 📜' },
  'Kelly Criterion Bankroll Calculator 💰': { en: 'Kelly Criterion Bankroll Calculator 💰', pidgin: 'Money Management & Bankroll Lab 💰', yoruba: 'Ètò Ìṣirò Owó Eré 💰', igbo: 'Mgbakọ Ego Egwuregwu 💰', hausa: 'Kwamfutar Kula Da Kudi 💰' },
};

interface LanguageContextType {
  lang: LanguageCode;
  setLang: (code: LanguageCode) => void;
  t: (key: string) => string;
  meta: LanguageMeta;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (k) => k,
  meta: SUPPORTED_LANGUAGES[0],
});

// Cache for neural translation
const DYNAMIC_CACHE = new Map<string, string>();

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<LanguageCode>('en');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as LanguageCode;
      if (stored && ['en', 'pidgin', 'yoruba', 'igbo', 'hausa'].includes(stored)) {
        setLangState(stored);
        document.documentElement.lang = stored;
      }
    } catch { /* noop */ }
  }, []);

  const setLang = (code: LanguageCode) => {
    setLangState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = code;
      }
    } catch { /* noop */ }
  };

  const t = (key: string): string => {
    if (!key || lang === 'en') return key;
    const trimmed = key.trim();
    if (COMPREHENSIVE_DICTIONARY[trimmed]?.[lang]) {
      return COMPREHENSIVE_DICTIONARY[trimmed][lang];
    }
    // Check partial key matches
    for (const [k, translations] of Object.entries(COMPREHENSIVE_DICTIONARY)) {
      if (trimmed.toLowerCase() === k.toLowerCase() && translations[lang]) {
        return translations[lang];
      }
    }
    return key;
  };

  const meta = SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, meta }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);
