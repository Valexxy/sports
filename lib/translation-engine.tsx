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
  { code: 'pidgin', name: 'Nigerian Pidgin',  flag: '🇳🇬', dir: 'ltr', greeting: 'Welcome to AuraScore! Na here correct banker dey!' },
  { code: 'yoruba', name: 'Yorùbá',           flag: '🇳🇬', dir: 'ltr', greeting: 'Káàbọ̀ sí AuraScore Stadium!' },
  { code: 'igbo',   name: 'Igbo',             flag: '🇳🇬', dir: 'ltr', greeting: 'Nnọọ na AuraScore Stadium!' },
  { code: 'hausa',  name: 'Hausa',            flag: '🇳🇬', dir: 'ltr', greeting: 'Barka da zuwa AuraScore Stadium!' },
];

const STORAGE_KEY = 'aurascore_language';

export const DICTIONARY: Record<string, Record<LanguageCode, string>> = {
  // Navigation & Core
  'Live Matches': { en: 'Live Matches', pidgin: 'Live Matches', yoruba: 'Àwọn Eré Láyé', igbo: 'Egwuregwu Ndụ', hausa: 'Wasannin Raye' },
  'Live Matches ⚡': { en: 'Live Matches ⚡', pidgin: 'Live Matches ⚡', yoruba: 'Àwọn Eré Láyé ⚡', igbo: 'Egwuregwu Ndụ ⚡', hausa: 'Wasannin Raye ⚡' },
  'Stadium Hub': { en: 'Stadium Hub ⚡', pidgin: 'Stadium Hub ⚡', yoruba: 'Ibùdó Pápá ⚡', igbo: 'Ebe Ama Egwuregwu ⚡', hausa: 'Cibiyar Filin Wasa ⚡' },
  'Stadium Hub ⚡': { en: 'Stadium Hub ⚡', pidgin: 'Stadium Hub ⚡', yoruba: 'Ibùdó Pápá ⚡', igbo: 'Ebe Ama Egwuregwu ⚡', hausa: 'Cibiyar Filin Wasa ⚡' },
  'Leaderboard': { en: 'Leaderboard', pidgin: 'Leaderboard 🏆', yoruba: 'Àkójọ Olórí 🏆', igbo: 'Ndị Isi Oche 🏆', hausa: 'Teburin Jagorori 🏆' },
  'Birthdays': { en: 'Birthdays 🎂', pidgin: 'Birthdays 🎂', yoruba: 'Ọjọ́ Ìbí 🎂', igbo: 'Ụbọchị Ọmụmụ 🎂', hausa: 'Ranar Haihuwa 🎂' },
  'Flex Slip': { en: 'Flex Slip 🚀', pidgin: 'Flex Slip 🚀', yoruba: 'Iwe Tiketi 🚀', igbo: 'Tiketi Flex 🚀', hausa: 'Tikitin Wasa 🚀' },
  'Flex Slip 🔥': { en: 'Flex Slip 🔥', pidgin: 'Flex Slip 🔥', yoruba: 'Iwe Tiketi 🔥', igbo: 'Tiketi Flex 🔥', hausa: 'Tikitin Wasa 🔥' },
  'Hub': { en: 'Hub', pidgin: 'Hub', yoruba: 'Ibùdó', igbo: 'Ebe', hausa: 'Cibiya' },

  // Filters & Status
  'Live': { en: 'Live', pidgin: 'Live Now 🔴', yoruba: 'Láyé 🔴', igbo: 'Ndụ Ugbu A 🔴', hausa: 'Raye Yanzu 🔴' },
  'Upcoming': { en: 'Upcoming', pidgin: 'Coming Up 🟡', yoruba: 'Tó Ń Bọ̀ 🟡', igbo: 'Na-abịa 🟡', hausa: 'Mai Zuwa 🟡' },
  'Played': { en: 'Played', pidgin: 'Don Finish ✅', yoruba: 'Ti Ṣeré ✅', igbo: 'Emechara ✅', hausa: 'An Kammala ✅' },
  'All': { en: 'All Matches', pidgin: 'All Match', yoruba: 'Gbogbo Eré', igbo: 'Egwuregwu Niile', hausa: 'Duk Wasanni' },
  'High Guarantees (70%+)': { en: '👑 High Guarantees (70%+)', pidgin: '👑 Sure Sure Banker (70%+)', yoruba: '👑 Ẹ̀rọ Ìdánilójú (70%+)', igbo: '👑 Eziokwu Nwere Nkwa (70%+)', hausa: '👑 Tabbacin Nasara (70%+)' },
  '100% Pure Football Stadium': { en: '⚽ 100% Pure Football Stadium', pidgin: '⚽ 100% Pure Football Ground', yoruba: '⚽ Pápá Bọ́ọ̀lù Ẹsẹ̀ Pípé 100%', igbo: '⚽ Ama Egwuregwu Bọọlụ 100%', hausa: '⚽ Filin Wasan Ƙwallon Ƙafa 100%' },

  // Date Navigator
  'Yesterday': { en: 'Yesterday', pidgin: 'Yesterday', yoruba: 'Àná', igbo: 'Ụnyaahụ', hausa: 'Jiya' },
  'Today': { en: 'Today', pidgin: 'Today', yoruba: 'Òní', igbo: 'Taa', hausa: 'Yau' },
  'Tomorrow': { en: 'Tomorrow', pidgin: 'Tomorrow', yoruba: 'Ọ̀la', igbo: 'Echi', hausa: 'Gobe' },
  'Earlier': { en: 'Earlier', pidgin: 'Earlier', yoruba: 'Tẹ́lẹ̀', igbo: 'Na Mbụ', hausa: 'Da Farko' },
  'Ahead': { en: 'Ahead', pidgin: 'Ahead', yoruba: 'Iwájú', igbo: 'N’ihu', hausa: 'A Gaba' },

  // Match Details & Card Buttons
  "Today's Matches": { en: "Today's Matches", pidgin: "Today Matches", yoruba: "Àwọn Eré Òní", igbo: "Egwuregwu Taa", hausa: "Wasannin Yau" },
  'Search team, league or fixture...': { en: 'Search team, league or fixture...', pidgin: 'Search team, league or match...', yoruba: 'Wá ẹgbẹ́, liigi tàbí eré...', igbo: 'Chọọ otu, egwuregwu...', hausa: 'Nemi ƙungiya ko wasa...' },
  'Add Pick': { en: '+ Add Pick', pidgin: '+ Add Am', yoruba: '+ Fi Kún', igbo: '+ Tinye', hausa: '+ Ƙara' },
  '+ Add Pick': { en: '+ Add Pick', pidgin: '+ Add Am', yoruba: '+ Fi Kún', igbo: '+ Tinye', hausa: '+ Ƙara' },
  'View Full Match Insights': { en: 'View Full Match Insights', pidgin: 'See Full Gist ➔', yoruba: 'Wo Ìmọ̀ Eré Pípé ➔', igbo: 'Lee Nkọwa Niile ➔', hausa: 'Duba Cikakken Bayani ➔' },
  'Prediction Reason:': { en: 'Prediction Reason:', pidgin: 'Why We Pick Am:', yoruba: 'Ìdí Ìsọtẹ́lẹ̀:', igbo: 'Ihe Mere Anyị Ji Họrọ:', hausa: 'Dalilin Hasashe:' },
  'Tap insights': { en: 'Tap insights', pidgin: 'Tap for gist', yoruba: 'Tẹ fún ìmọ̀', igbo: 'Kpatụ maka nkọwa', hausa: 'Danna don bayani' },
  'Played at': { en: 'Played at', pidgin: 'Play for', yoruba: 'Ṣeré ní', igbo: 'Gbara na', hausa: 'An buga a' },
  'Starts in': { en: 'Starts in', pidgin: 'Go start in', yoruba: 'Yóò bẹ̀rẹ̀ ní', igbo: 'Ga-amalite na', hausa: 'Zai fara a' },

  // Broadcast Ticker
  'LIVE WIRE': { en: 'LIVE WIRE', pidgin: 'LIVE WIRE ⚡', yoruba: 'WÁYÀ LÁYÉ ⚡', igbo: 'WAYA NDỤ ⚡', hausa: 'LABARIN RAYE ⚡' },
  'Stadium Tension': { en: 'Stadium Tension', pidgin: 'Stadium Tension 🔥', yoruba: 'Ìfúngbá Pápá 🔥', igbo: 'Nsogbu Ama Egwuregwu 🔥', hausa: 'Halin Filin Wasa 🔥' },

  // News Wire Section
  'LATEST FOOTBALL NEWS & MATCH WIRE 📰': { en: 'LATEST FOOTBALL NEWS & MATCH WIRE 📰', pidgin: 'LATEST FOOTBALL GIST & MATCH WIRE 📰', yoruba: 'ÌRÒYÌN BỌ́Ọ̀LÙ TUNTUN & WÁYÀ ERÉ 📰', igbo: 'OZI ỌHỤRỤ BỌỌLỤ NA AKWỤKWỌ AKWỤKWỌ 📰', hausa: 'LABARAN ƘWALLON ƘAFA NA YANZU 📰' },
  'Read Story': { en: 'Read Story', pidgin: 'Read Full Gist ➔', yoruba: 'Ka Ìròyìn ➔', igbo: 'Gụọ Akụkọ ➔', hausa: 'Karanta Labari ➔' },
  'Share Story': { en: 'Share Story', pidgin: 'Share Gist', yoruba: 'Pín Ìròyìn', igbo: 'Kekọrịta Akụkọ', hausa: 'Raba Labari' },
  'All News': { en: '⚡ All News', pidgin: '⚡ All Gist', yoruba: '⚡ Gbogbo Ìròyìn', igbo: '⚡ Ozi Niile', hausa: '⚡ Duk Labarai' },
  'Transfers': { en: '🔥 Transfers', pidgin: '🔥 Transfers', yoruba: '🔥 Gbígbé Agbábọ́ọ̀lù', igbo: '🔥 Mgbanwe Ndị Egwuregwu', hausa: '🔥 Sayen Yan Wasa' },
  'Match Reports': { en: '🚨 Match Reports', pidgin: '🚨 Match Reports', yoruba: '🚨 Ìròyìn Eré', igbo: '🚨 Akụkọ Egwuregwu', hausa: '🚨 Rahoton Wasa' },
  'Injuries': { en: '🚑 Injuries', pidgin: '🚑 Injury Bulletins', yoruba: '🚑 Ìpalára Agbábọ́ọ̀lù', igbo: '🚑 Mmerụ Ahụ', hausa: '🚑 Raunin Yan Wasa' },
  'Manager & Tactics': { en: '🧠 Manager & Tactics', pidgin: '🧠 Coach & Tactics', yoruba: '🧠 Olùkọ́ & Ètò Eré', igbo: '🧠 Onye Nchịkwa & Usoro', hausa: '🧠 Koci & Dabaru' },
  'Naija & AFCON': { en: '🇳🇬 Naija & AFCON', pidgin: '🇳🇬 Super Eagles & Naija', yoruba: '🇳🇬 Nàìjíríà & AFCON', igbo: '🇳🇬 Naịjirịa & AFCON', hausa: '🇳🇬 Najeriya & AFCON' },
  'UCL & Europe': { en: '⭐ UCL & Europe', pidgin: '⭐ Champions League', yoruba: '⭐ UCL & Yúróòpù', igbo: '⭐ UCL & Yurop', hausa: '⭐ UCL & Turai' },

  // Ledger & Settlement
  'HISTORICAL SETTLEMENT LEDGER & CALENDAR': { en: 'HISTORICAL SETTLEMENT LEDGER & CALENDAR', pidgin: 'OFFICIAL MATCH SETTLEMENT RECORD & CALENDAR', yoruba: 'ÀKỌ́SÍLẸ̀ ÌPÈNÍYÀ ERÉ & KÀLẸ́NDÀ', igbo: 'NDỊ NCHỊKỌTA EGWUREGWU NDỊ KWESỊRỊ EKWE', hausa: 'TEBURIN SAKAMAKON WASANNI DA KALANDA' },
  'All Settled': { en: 'All Settled', pidgin: 'All Settled', yoruba: 'Gbogbo Tó Ti Parí', igbo: 'Niile Emechara', hausa: 'Duk An Daidaita' },
  'Won Picks': { en: 'Won Picks', pidgin: 'Won Banker', yoruba: 'Àwọn Tó Wọlé', igbo: 'Nke Meriri', hausa: 'Wadanda Suka Ci' },
  'Lost Picks': { en: 'Lost Picks', pidgin: 'Lost Banker', yoruba: 'Àwọn Tó Bọ́', igbo: 'Nke Furu Efu', hausa: 'Wadanda Suka Bace' },
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

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<LanguageCode>('en');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as LanguageCode;
      if (stored && ['en', 'pidgin', 'yoruba', 'igbo', 'hausa'].includes(stored)) {
        setLangState(stored);
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
    if (!DICTIONARY[key]) return key;
    return DICTIONARY[key][lang] || DICTIONARY[key]['en'] || key;
  };

  const meta = SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, meta }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);
export const useAppLanguage = () => useContext(LanguageContext).lang;
