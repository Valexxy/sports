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
  // Modals, Popups & Insights Translations
  'STADIUM LIVE MATCH CENTER': { en: 'STADIUM LIVE MATCH CENTER', pidgin: 'STADIUM LIVE MATCH CENTER', yoruba: 'IBÙDÓ ERÉ LÁYÉ', igbo: 'EBE EGWUREGWO NDỤ', hausa: 'CIKIYAR WASAN RAYE' },
  'EXACT CORRECT SCORE PROBABILITIES': { en: 'EXACT CORRECT SCORE PROBABILITIES', pidgin: 'CORRECT SCORE PROBABILITIES', yoruba: 'ÀWỌN ÀṢEYỌRÍ GOOLU TÍ Ń BỌ̀', igbo: 'ATỤLỤ NA EZIOGE GOOLU', hausa: 'HASASHEN CIKAKKEN SAKAMAKO' },
  '5-GAME FORM STREAKS & HEAD-TO-HEAD': { en: '5-GAME FORM STREAKS & HEAD-TO-HEAD', pidgin: 'LAST 5 GAMES FORM & H2H', yoruba: 'ÀṢEYỌRÍ ERÉ 5 TẸ́LẸ̀ & DOJU-KỌ-DOJU', igbo: 'ỤDỊ EGWUREGWO 5 GARA AGA & ISIALA', hausa: 'WASANNI 5 DA SUKA GABATA & GABAR JUNA' },
  'VERIFIED RECENT RUN': { en: 'VERIFIED RECENT RUN', pidgin: 'VERIFIED RECENT RUN', yoruba: 'ÌRÌN ÀÌPẸ́ TÍ A YẸ̀WÒ', igbo: 'EZIOGE NDỊ ỌHỤRỤ', hausa: 'SAKAMAKON KWANAN NAN' },
  'POISSON MODEL': { en: 'POISSON MODEL', pidgin: 'POISSON MATH MODEL', yoruba: 'ÀWỌN ÌṢIRÒ POISSON', igbo: 'ỤDỊ MGBASO POISSON', hausa: 'TSARIN LISSAFI NA POISSON' },
  'HOME FORM': { en: 'HOME FORM', pidgin: 'HOME FORM', yoruba: 'ERÉ ILÉ', igbo: 'ỤDỊ ỤLỌ', hausa: 'YANAYIN GIDA' },
  'AWAY FORM': { en: 'AWAY FORM', pidgin: 'AWAY FORM', yoruba: 'ERÉ ÀBẸ̀WÒ', igbo: 'ỤDỊ NLETA', hausa: 'YANAYIN WAJE' },
  'Pin to Lock Screen (Live Google Style)': { en: 'Pin to Lock Screen (Live Google Style)', pidgin: 'Pin to Phone Lock Screen 📌', yoruba: 'Fi Sí Ojú Ìbòjú Fóònù 📌', igbo: 'Kụba na Ihuenyo Mkpọchi 📌', hausa: 'Manna a Allon Kulle 📌' },
  '2D TACTICAL PITCH': { en: '2D TACTICAL PITCH', pidgin: '2D TACTICAL PITCH ⚽', yoruba: 'PÁPÁ ÈTÒ ERÉ 2D ⚽', igbo: 'AMA EGWUREGWU USORO 2D ⚽', hausa: 'FILIN DABARUN WASA NA 2D ⚽' },
  '⚽ 2D Tactical Pitch': { en: '⚽ 2D Tactical Pitch', pidgin: '⚽ 2D Tactical Pitch', yoruba: '⚽ Pápá Ètò Eré 2D', igbo: '⚽ Ama Usoro 2D', hausa: '⚽ Filin Dabaru 2D' },
  '🎬 Match Highlights': { en: '🎬 Match Highlights', pidgin: '🎬 Match Highlights & Goals', yoruba: '🎬 Àkópọ̀ Eré & Àwọn Goolu', igbo: '🎬 Mmemme Ndị Pụrụ Iche', hausa: '🎬 Takaitaccen Wasa & Ƙwallaye' },
  'VERIFIED TOP MATCH PICK': { en: 'VERIFIED TOP MATCH PICK', pidgin: 'VERIFIED NUMBER 1 PICK 🔥', yoruba: 'ÌSỌTẸ́LẸ̀ ERÉ GÚNGÙN TÍ A YẸ̀WÒ', igbo: 'EZIGBO NHỌRỌ EGWUREGWU', hausa: 'BABBAN HASASHEN WASA MAI INGANCI' },
  'Winning Chance': { en: 'Winning Chance', pidgin: 'Sure Chance', yoruba: 'Ànfààní Ìṣẹ́gun', igbo: 'Ohere Mmeri', hausa: 'Damar Nasara' },
  'Recommended Stake': { en: 'Recommended Stake', pidgin: 'Recommended Stake', yoruba: 'Iye Kalokalo Tó Yẹ', igbo: 'Ego Nzọ Akwadoro', hausa: 'Adadin Caca da Aka Shawarta' },
  'Goal Power': { en: 'Goal Power', pidgin: 'Goal Power (xG)', yoruba: 'Agbára Goolu (xG)', igbo: 'Ike Goolu (xG)', hausa: 'Ƙarfin Ci Ƙwallo (xG)' },
  'Listen Live Audio Commentary': { en: 'Listen Live Audio Commentary', pidgin: 'Listen Naija Live Audio 🔊', yoruba: 'Gbọ́ Ìròyìn Eré Láyé 🔊', igbo: 'Ge Ozi Ọdịyo Ndụ 🔊', hausa: 'Saurari Sharhin Wasa Kai Tsaye 🔊' },
  'HISTORICAL ACCURACY HEATMAP & LEDGER': { en: 'HISTORICAL ACCURACY HEATMAP & LEDGER', pidgin: 'HISTORICAL ACCURACY HEATMAP & LEDGER 📜', yoruba: 'ÀKỌSÍLẸ̀ & ÀWÒRÁN ÌPÈNÍYÀ ERÉ TẸ́LẸ̀ 📜', igbo: 'AKWỤKWỌ NDEKỌ NNYOCHA EGWUREGWU 📜', hausa: 'TEBURIN TANTANCE SAKAMAKON WASANNI 📜' },
  'Audited Win Rate': { en: 'Audited Win Rate', pidgin: 'Audited Win Rate', yoruba: 'Ìwọ̀n Ìṣẹ́gun Tí A Yẹ̀wÒ', igbo: 'Ọnụego Mmeri Enyochara', hausa: 'Yawan Nasarar da Aka Tantance' },
  'Confidence Accuracy': { en: 'Confidence Accuracy', pidgin: 'Sure Accuracy', yoruba: 'Ìṣedéédé Ìdánilójú', igbo: 'Eziokwu Ntụkwasị Obi', hausa: 'Ingancin Tabbaci' },
  'Victory Confetti': { en: 'Victory Confetti', pidgin: 'Celebrate Wins 🎉', yoruba: 'Ayẹyẹ Ìṣẹ́gun 🎉', igbo: 'Mmemme Mmeri 🎉', hausa: 'Bikin Nasara 🎉' },
  'Celebrate Wins 🎉': { en: 'Celebrate Wins 🎉', pidgin: 'Celebrate Wins 🎉', yoruba: 'Ṣe Ayẹyẹ Ìṣẹ́gun 🎉', igbo: 'Mmemme Mmeri 🎉', hausa: 'Gudanar da Biki 🎉' },
  'Close Heatmap ➔': { en: 'Close Heatmap ➔', pidgin: 'Close ➔', yoruba: 'Pa Dé ➔', igbo: 'Mechie ➔', hausa: 'Rufe ➔' },
  'Select Language': { en: 'Select Language', pidgin: 'Select Language / Asụsụ', yoruba: 'Yan Èdè', igbo: 'Họrọ Asụsụ', hausa: 'Zaɓi Harshe' },
  'Audited Ledger': { en: 'Audited Ledger', pidgin: 'Audited Ledger 📜', yoruba: 'Àkọsílẹ̀ Ìyẹ̀wò 📜', igbo: 'Akwụkwọ Ndekọ 📜', hausa: 'Teburin Bincike 📜' },
  'Legal & Compliance': { en: 'Legal & Compliance', pidgin: 'Legal & Terms', yoruba: 'Òfin & Ìbámu', igbo: 'Iwu & Nkwado', hausa: "Doka & Ka'idodi" },
  'All Leagues': { en: 'All Leagues', pidgin: 'All Leagues', yoruba: 'Gbogbo Liigi', igbo: 'Liigi Niile', hausa: 'Duk Gasanni' },
  'High Guarantees': { en: 'High Guarantees', pidgin: 'Sure Bankers', yoruba: 'Ìdánilójú Gíga', igbo: 'Eziokwu Nwere Nkwa', hausa: 'Tabbaci Mai Yawa' },
  'Search team, league or fixture...': { en: 'Search team, league or fixture...', pidgin: 'Search club, league or match...', yoruba: 'Wá ẹgbẹ́, liigi tàbí eré...', igbo: 'Chọọ otu, liigi ma ọ bụ egwuregwu...', hausa: 'Nemi kungiya, gasa ko wasa...' },
  'WON': { en: 'WON ✅', pidgin: 'WON ✅', yoruba: 'WỌLÉ ✅', igbo: 'MERIRI ✅', hausa: 'AN CI ✅' },
  'LOST': { en: 'LOST ❌', pidgin: 'LOST ❌', yoruba: 'BỌ́ ❌', igbo: 'KỌRỌ ❌', hausa: 'AN RASA ❌' },
  'Close': { en: 'Close', pidgin: 'Close', yoruba: 'Pa Dé', igbo: 'Mechie', hausa: 'Rufe' },


  // Bet Tips & Card Elements
  '+ Bet Tips': { en: '+ Bet Tips', pidgin: '+ Bet Tips 🎯', yoruba: '+ Ìmọ̀ràn Kalokalo 🎯', igbo: '+ Ndụmọdụ Nzọ 🎯', hausa: '+ Shawarar Caca 🎯' },
  '+ Add Pick': { en: '+ Bet Tips', pidgin: '+ Bet Tips 🎯', yoruba: '+ Ìmọ̀ràn Kalokalo 🎯', igbo: '+ Ndụmọdụ Nzọ 🎯', hausa: '+ Shawarar Caca 🎯' },
  'Bet Tips': { en: 'Bet Tips', pidgin: 'Bet Tips', yoruba: 'Ìmọ̀ràn Kalokalo', igbo: 'Ndụmọdụ Nzọ', hausa: 'Shawarar Caca' },
  'Table ➔': { en: 'Table ➔', pidgin: 'Table ➔', yoruba: 'Tábìlì ➔', igbo: 'Tebụl ➔', hausa: 'Tebur ➔' },
  'win confidence': { en: 'win confidence', pidgin: 'sure confidence', yoruba: 'ìdánilójú ìṣẹ́gun', igbo: 'ntụkwasị obi mmeri', hausa: 'tabbacin nasara' },
  'Over 1.5 Goals': { en: 'Over 1.5 Goals', pidgin: 'Over 1.5 Goals', yoruba: 'Goolu tó ju 1.5 lọ', igbo: 'Ihe karịrị goolu 1.5', hausa: 'Sama da ƙwallo 1.5' },
  'Over 2.5 Goals': { en: 'Over 2.5 Goals', pidgin: 'Over 2.5 Goals', yoruba: 'Goolu tó ju 2.5 lọ', igbo: 'Ihe karịrị goolu 2.5', hausa: 'Sama da ƙwallo 2.5' },
  'Under 2.5 Goals': { en: 'Under 2.5 Goals', pidgin: 'Under 2.5 Goals', yoruba: 'Goolu tí kò ju 2.5 lọ', igbo: 'Goolu na-erughị 2.5', hausa: 'Ƙasa da ƙwallo 2.5' },
  'Both Teams to Score (GG)': { en: 'Both Teams to Score (GG)', pidgin: 'Both Teams Go Score (GG)', yoruba: 'Àwọn Ẹgbẹ́ Méjèèjì Yóò Gba Goolu', igbo: 'Otu Abụọ Ga-agba Goolu', hausa: 'Dukkan Ƙungiyoyin Za Su Ci Ƙwallo' },
  'Home Win or Draw (1X)': { en: 'Home Win or Draw (1X)', pidgin: 'Home Win or Draw (1X)', yoruba: 'Ìṣẹ́gun Ilé tàbí Dọ́gba (1X)', igbo: 'Mmeri Ụlọ ma ọ bụ Jikọọ (1X)', hausa: 'Nasara a Gida ko Canjaras (1X)' },
  'Away Win or Draw (X2)': { en: 'Away Win or Draw (X2)', pidgin: 'Away Win or Draw (X2)', yoruba: 'Ìṣẹ́gun Àbẹ̀wò tàbí Dọ́gba (X2)', igbo: 'Mmeri Nleta ma ọ bụ Jikọọ (X2)', hausa: 'Nasara a Waje ko Canjaras (X2)' },
  'or Draw': { en: 'or Draw', pidgin: 'or Draw', yoruba: 'tàbí Dọ́gba', igbo: 'ma ọ bụ Jikọọ', hausa: 'ko Canjaras' },
  'or Draw (1X)': { en: 'or Draw (1X)', pidgin: 'or Draw (1X)', yoruba: 'tàbí Dọ́gba (1X)', igbo: 'ma ọ bụ Jikọọ (1X)', hausa: 'ko Canjaras (1X)' },
  
  // Header & Branding
  'Download App': { en: 'Download App', pidgin: 'Download App 📲', yoruba: 'Gba Ohun Èlò 📲', igbo: 'Budata Ngwa 📲', hausa: 'Sauke Manhaja 📲' },
  'Downloading...': { en: 'Downloading...', pidgin: 'De Download...', yoruba: 'Ń Gbà Á...', igbo: 'Na-ebudata...', hausa: 'Ana Saukewa...' },
  'World First Live Prediction & Stadium Atmosphere': { en: 'World First Live Prediction & Stadium Atmosphere', pidgin: 'Number 1 Live Prediction & Stadium Atmosphere for World', yoruba: 'Àkọ́kọ́ Ìsọtẹ́lẹ̀ Láyé & Afẹ́fẹ́ Pápá Eré Ní Àgbáyé', igbo: 'Amụma Ndụ nke Mbụ n’Ụwa & Ọnọdụ Ama Egwuregwu', hausa: 'Hasashen Raye na Farko a Duniya & Yanayin Filin Wasa' },
  'Star Players': { en: 'Star Players', pidgin: 'Star Players ⭐', yoruba: 'Àwọn Gbajúmọ̀ ⭐', igbo: 'Ndị Ama Ama ⭐', hausa: 'Manyan Yan Wasa ⭐' },
  'All Leagues (35+)': { en: 'All Leagues (35+)', pidgin: 'All Leagues (35+) 🌍', yoruba: 'Gbogbo Liigi (35+) 🌍', igbo: 'Liigi Niile (35+) 🌍', hausa: 'Duk Gasanni (35+) 🌍' },
  'Following ⭐': { en: 'Following ⭐', pidgin: 'Following ⭐', yoruba: 'Tẹ̀lé ⭐', igbo: 'Na-eso ⭐', hausa: 'Masu Bi ⭐' },
  'Following': { en: 'Following', pidgin: 'Following', yoruba: 'Tẹ̀lé', igbo: 'Na-eso', hausa: 'Masu Bi' },

  // Live Alerts & Popups
  'LIVE MATCH': { en: 'LIVE MATCH ⚽', pidgin: 'LIVE MATCH ⚽', yoruba: 'ERÉ LÁYÉ ⚽', igbo: 'EGWUREG职务 NDỤ ⚽', hausa: 'WASAN RAYE ⚽' },
  'Hype 🔥': { en: 'Hype 🔥', pidgin: 'Hype 🔥', yoruba: 'Ariwo 🔥', igbo: 'Ọṅụ 🔥', hausa: 'Murna 🔥' },
  'View Audit ↗': { en: 'View Audit ↗', pidgin: 'Check Am ↗', yoruba: 'Wo Àyẹ̀wò ↗', igbo: 'Lee Nnyocha ↗', hausa: 'Duba Sakamako ↗' },
  '1-Click automatic instant download': { en: '1-Click automatic instant download', pidgin: '1-Click fast download', yoruba: 'Ìgbàsílẹ̀ lẹ́ẹ̀kan ṣoṣo', igbo: 'Nbudata ngwa ngwa na otu pịa', hausa: 'Saukarwa ta atomatik da dannawa 1' },
  'Install Stadium App': { en: 'Install Stadium App', pidgin: 'Install Stadium App', yoruba: 'Fi Ohun Èlò Pápá Sí', igbo: 'Wụnye Ngwa Ama Egwuregwu', hausa: 'Sanya Manhajar Filin Wasa' },
  'Download': { en: 'Download', pidgin: 'Download', yoruba: 'Gba Sílẹ̀', igbo: 'Budata', hausa: 'Sauke' },
  '100% Pure Football Stadium': { en: '100% Pure Football Stadium', pidgin: '100% Pure Football Stadium', yoruba: '100% Pápá Bọ́ọ̀lù Pípé', igbo: '100% Ezigbo Ama Egwuregwu', hausa: '100% Filin Wasan Ƙwallo na Gaskiya' },

  // Days of Week (Sunday to Saturday)
  'Sun': { en: 'Sun', pidgin: 'Sun', yoruba: 'Àìkú', igbo: 'Ụka', hausa: 'Lah' },
  'Mon': { en: 'Mon', pidgin: 'Mon', yoruba: 'Ajé', igbo: 'Mọn', hausa: 'Lit' },
  'Tue': { en: 'Tue', pidgin: 'Tue', yoruba: 'Ìṣẹ́gun', igbo: 'Tuu', hausa: 'Tal' },
  'Wed': { en: 'Wed', pidgin: 'Wed', yoruba: 'Rú', igbo: 'Wen', hausa: 'Lar' },
  'Thu': { en: 'Thu', pidgin: 'Thu', yoruba: 'Bọ̀', igbo: 'Tọọ', hausa: 'Alh' },
  'Fri': { en: 'Fri', pidgin: 'Fri', yoruba: 'Ẹtì', igbo: 'Fraị', hausa: 'Jum' },
  'Sat': { en: 'Sat', pidgin: 'Sat', yoruba: 'Àbámẹ́ta', igbo: 'Satọ', hausa: 'Asa' },
  'Sunday': { en: 'Sunday', pidgin: 'Sunday', yoruba: 'Ọjọ́ Àìkú', igbo: 'Ụbọchị Ụka', hausa: 'Lahadi' },
  'Monday': { en: 'Monday', pidgin: 'Monday', yoruba: 'Ọjọ́ Ajé', igbo: 'Mọnde', hausa: 'Litinin' },
  'Tuesday': { en: 'Tuesday', pidgin: 'Tuesday', yoruba: 'Ọjọ́ Ìṣẹ́gun', igbo: 'Tuuzde', hausa: 'Talata' },
  'Wednesday': { en: 'Wednesday', pidgin: 'Wednesday', yoruba: 'Ọjọ́ Rú', igbo: 'Wenezde', hausa: 'Laraba' },
  'Thursday': { en: 'Thursday', pidgin: 'Thursday', yoruba: 'Ọjọ́ Bọ̀', igbo: 'Tọọzde', hausa: 'Alhamis' },
  'Friday': { en: 'Friday', pidgin: 'Friday', yoruba: 'Ọjọ́ Ẹtì', igbo: 'Fraịde', hausa: "Jumma'a" },
  'Saturday': { en: 'Saturday', pidgin: 'Saturday', yoruba: 'Ọjọ́ Àbámẹ́ta', igbo: 'Satọde', hausa: 'Asabar' },
  'This Week (Sun - Sat)': { en: 'This Week (Sun - Sat)', pidgin: 'This Week (Sun - Sat)', yoruba: 'Ọ̀sẹ̀ Yìí (Àìkú - Àbámẹ́ta)', igbo: 'Izu A (Ụka - Satọ)', hausa: 'Wannan Makon (Lah - Asa)' },

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
