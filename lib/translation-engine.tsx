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
  // Brand, Header & Ticker
  'LIVE WIRE': { en: 'LIVE WIRE', pidgin: 'LIVE WIRE ⚡', yoruba: 'WÁYÀ LÁYÉ ⚡', igbo: 'WAYA NDỤ ⚡', hausa: 'LABARAI MASU ZAFI ⚡' },
  'World-First Live Prediction & Stadium Atmosphere': { en: 'World-First Live Prediction & Stadium Atmosphere', pidgin: 'Number 1 Live Prediction & Stadium Atmosphere for World', yoruba: 'Àkọ́kọ́ Ìsọtẹ́lẹ̀ Láyé & Afẹ́fẹ́ Pápá Eré Ní Àgbáyé', igbo: 'Amụma Ndụ nke Mbụ n’Ụwa & Ọnọdụ Ama Egwuregwu', hausa: 'Hasashen Raye na Farko a Duniya & Yanayin Filin Wasa' },
  'World First Live Prediction & Stadium Atmosphere': { en: 'World First Live Prediction & Stadium Atmosphere', pidgin: 'Number 1 Live Prediction & Stadium Atmosphere for World', yoruba: 'Àkọ́kọ́ Ìsọtẹ́lẹ̀ Láyé & Afẹ́fẹ́ Pápá Eré Ní Àgbáyé', igbo: 'Amụma Ndụ nke Mbụ n’Ụwa & Ọnọdụ Ama Egwuregwu', hausa: 'Hasashen Raye na Farko a Duniya & Yanayin Filin Wasa' },
  'Statistical intelligence engine. 18+ Please play responsibly.': { en: 'Statistical intelligence engine. 18+ Please play responsibly.', pidgin: 'Correct match stats engine. 18+ Bet wisely.', yoruba: 'Injin bọ́ọ̀lù oníṣirò. 18+ Ẹ jọ̀wọ́ tẹtẹ pẹ̀lú ọgbọ́n.', igbo: 'Ngwa amụma bọọlụ. 18+ Biko jiri nlezianya zọọ nzọ.', hausa: 'Injin binciken lissafin kwallon kafa. Shekara 18+ Don Allah a yi caca cikin hankali.' },
  'AES 256 Encrypted': { en: 'AES 256 Encrypted', pidgin: 'AES 256 Encrypted', yoruba: 'Ààbò AES 256 Pípé', igbo: 'Nchedo AES 256 zuru oke', hausa: 'Tsare da Boyayyen Lambar AES 256' },
  'Legal & 18+ Terms': { en: 'Legal & 18+ Terms', pidgin: 'Legal & 18+ Terms', yoruba: 'Òfin & Àwọn Àdéhùn 18+', igbo: 'Iwu & Usoro 18+', hausa: "Dokoki & Ka'idojin Shekara 18+" },
  
  // Weekly Calendar & Date Navigation
  'WEEKLY FIXTURE CALENDAR': { en: 'WEEKLY FIXTURE CALENDAR', pidgin: 'WEEKLY MATCH CALENDAR', yoruba: 'KÀLẸ́NDÀ ERÉ Ọ̀SẸ̀', igbo: 'KALENDA EGWUREGWO IZU', hausa: 'JADAWALIN WASANNIN MAKO' },
  'WEEKLY FIXTURE CALENDAR NG': { en: 'WEEKLY FIXTURE CALENDAR NG', pidgin: 'WEEKLY MATCH CALENDAR 🇳🇬', yoruba: 'KÀLẸ́NDÀ ERÉ Ọ̀SẸ̀ 🇳🇬', igbo: 'KALENDA EGWUREGWO IZU 🇳🇬', hausa: 'JADAWALIN WASANNIN MAKO 🇳🇬' },
  'TODAY': { en: 'TODAY', pidgin: 'TODAY', yoruba: 'ÒNÍ', igbo: 'TAA', hausa: 'YAU' },
  'Today': { en: 'Today', pidgin: 'Today', yoruba: 'Òní', igbo: 'Taa', hausa: 'Yau' },
  'Yesterday': { en: 'Yesterday', pidgin: 'Yesterday', yoruba: 'Àná', igbo: 'Ụnyaahụ', hausa: 'Jiya' },
  'Tomorrow': { en: 'Tomorrow', pidgin: 'Tomorrow', yoruba: 'Ọ̀la', igbo: 'Echi', hausa: 'Gobe' },
  'This Week (Sun - Sat)': { en: 'This Week (Sun - Sat)', pidgin: 'This Week (Sun - Sat)', yoruba: 'Ọ̀sẹ̀ Yìí (Àìkú - Àbámẹ́ta)', igbo: 'Izu A (Ụka - Satọ)', hausa: 'Wannan Makon (Lah - Asa)' },
  'Wannan Makon (Lah - Asa)': { en: 'This Week (Sun - Sat)', pidgin: 'This Week (Sun - Sat)', yoruba: 'Ọ̀sẹ̀ Yìí (Àìkú - Àbámẹ́ta)', igbo: 'Izu A (Ụka - Satọ)', hausa: 'Wannan Makon (Lah - Asa)' },

  // Stadium Hub & Suites
  'STADIUM HUB & NAIJA LIVE SUITES': { en: 'STADIUM HUB & NAIJA LIVE SUITES', pidgin: 'STADIUM HUB & NAIJA LIVE SUITES ⚡🇳🇬', yoruba: 'IBÙDÓ PÁPÁ & ÀWỌN ERÉ NÀÌJÍRÍÀ ⚡🇳🇬', igbo: 'EBE AMA EGWUREGWU & SUITES NAỊJIRỊA ⚡🇳🇬', hausa: 'CIBIYAR FILIN WASA & DANDALIN NAJERIYA ⚡🇳🇬' },
  'STADIUM HUB & NAIJA LIVE SUITES ⚡🇳🇬': { en: 'STADIUM HUB & NAIJA LIVE SUITES ⚡🇳🇬', pidgin: 'STADIUM HUB & NAIJA LIVE SUITES ⚡🇳🇬', yoruba: 'IBÙDÓ PÁPÁ & ÀWỌN ERÉ NÀÌJÍRÍÀ ⚡🇳🇬', igbo: 'EBE AMA EGWUREGWU & SUITES NAỊJIRỊA ⚡🇳🇬', hausa: 'CIBIYAR FILIN WASA & DANDALIN NAJERIYA ⚡🇳🇬' },
  'Everything in the Stadium Hub brought out live. Scouting, AI Roasts, Birthdays, Leaderboard & Bankroll.': { en: 'Everything in the Stadium Hub brought out live. Scouting, AI Roasts, Birthdays, Leaderboard & Bankroll.', pidgin: 'Everything for Stadium Hub live: Wonderkids, Yab lounge, Birthdays, Top punters & Bankroll.', yoruba: 'Gbogbo ohun tó wà nínú Ibùdó Pápá láyé: Àwárí agbábọ́ọ̀lù, Àwàdà AI, Ọjọ́ ìbí, Àkójọ olórí & Ìṣirò owó.', igbo: 'Ihe niile dị na Ama Egwuregwu: Nchọpụta, Njakịrị AI, Ụbọchị ọmụmụ, Ndị isi & Mgbakọ ego.', hausa: 'Dukkan abubuwan da ke cikin Cibiyar Filin Wasa kai tsaye. Gano yan wasa, barkwanci, ranakun haihuwa, jadawali & kula da kudi.' },
  
  // Hub Tiles
  'Naija Grassroots Scouting': { en: 'Naija Grassroots Scouting', pidgin: 'Naija Grassroots Scouting 🇳🇬⚽', yoruba: 'Àwárí Agbábọ́ọ̀lù Nàìjíríà 🇳🇬⚽', igbo: 'Nchọpụta Ndị Na-eto Eto Naịjirịa 🇳🇬⚽', hausa: 'Gano Matasan Yan Wasan Najeriya 🇳🇬⚽' },
  'Discover next Osimhen & Kanu. Watch scouting videos, vote wonderkids, and submit talent.': { en: 'Discover next Osimhen & Kanu. Watch scouting videos, vote wonderkids, and submit talent.', pidgin: 'Find the next Osimhen & Kanu. Watch scouting clips, vote young stars & submit talent.', yoruba: 'Wá Osimhen & Kanu tó ń bọ̀. Wo fídíò àwọn agbábọ́ọ̀lù tuntun, dìbò fún àwọn ọ̀dọ́, kí o sì fi ẹ̀bùn ránṣẹ́.', igbo: 'Chọpụta Osimhen na Kanu na-esote. Lee vidiyo, votu maka ụmụaka nwere nkà ma ziga nkà.', hausa: 'Gano sabbin Osimhen & Kanu. Kalli bidiyon yan wasa, zabi matasa, kuma kawo kwararrun yan wasa.' },
  'Open Scouting Radar ➔': { en: 'Open Scouting Radar ➔', pidgin: 'Open Scouting Radar ➔', yoruba: 'Ṣí Rádà Àwárí ➔', igbo: 'Mepee Rada Nchọpụta ➔', hausa: 'Bude Filin Gano Yan Wasa ➔' },

  'Gen-Z Roast & Banter Lounge': { en: 'Gen-Z Roast & Banter Lounge', pidgin: 'Naija Football Yab & Banter Lounge 🔥', yoruba: 'Yíyán Àwọn Ẹgbẹ́ & Àwàdà Bọ́ọ̀lù 🔥', igbo: 'Ebe Nkata & Njakịrị Bọọlụ 🔥', hausa: 'Dandalin Barkwanci & Zagin Kwallo 🔥' },
  'Dynamic AI Nigerian football slander, spicy locker-room burns, club memes, and viral roasts.': { en: 'Dynamic AI Nigerian football slander, spicy locker-room burns, club memes, and viral roasts.', pidgin: 'Spicy Nigerian football banter, dressing room yabs, memes and viral football banter.', yoruba: 'Àwàdà bọ́ọ̀lù Nàìjíríà gidi, yíyán àwọn ẹgbẹ́ nínú yàrá ìṣeré, àwòrán apanilẹ́rìn-ín, àti yíyán orí ayélujára.', igbo: 'Njakịrị bọọlụ Naịjirịa, mkparịta ụka ime ụlọ egwuregwu, memes na ihe na-atọ ọchị bọọlụ.', hausa: 'Barkwancin kwallon kafa na Najeriya, zafin dakin sauya kaya, hotunan barkwanci, da zagin kungiyoyi.' },
  'Enter Banter Lounge ➔': { en: 'Enter Banter Lounge ➔', pidgin: 'Enter Banter Lounge ➔', yoruba: 'Wọle Sí Ibùdó Àwàdà ➔', igbo: 'Banye n’Ebe Njakịrị ➔', hausa: 'Shiga Dandalin Barkwanci ➔' },

  'Star Birthdays & Fan Wishes': { en: 'Star Birthdays & Fan Wishes', pidgin: 'Star Birthdays & Fan Wishes 🎂', yoruba: 'Ọjọ́ Ìbí Àwọn Gbajúmọ̀ Agbábọ́ọ̀lù 🎂', igbo: 'Ụbọchị Ọmụmụ Ndị Dinta Bọọlụ 🎂', hausa: 'Ranar Haihuwar Manyan Yan Wasa 🎂' },
  'Football star birthdays this week. Send wishes, cheer with crowd audio, and share on WhatsApp.': { en: 'Football star birthdays this week. Send wishes, cheer with crowd audio, and share on WhatsApp.', pidgin: 'Star birthdays for this week. Send wishes, play stadium cheers & share for WhatsApp.', yoruba: 'Ọjọ́ ìbí àwọn gbajúmọ̀ ní ọ̀sẹ̀ yìí. Rán ìkíni, yọ̀ pẹ̀lú ariwo àwọn èrò pápá, kí o sì pín lórí WhatsApp.', igbo: 'Ụbọchị ọmụmụ ndị egwuregwu n’izu a. Zipu ozi ọma, tie mkpu ọṅụ, ma kesaa na WhatsApp.', hausa: 'Ranar haihuwar manyan yan wasan kwallo a wannan makon. Aika gaisuwa, yi murna da sautin taro, kuma raba a WhatsApp.' },
  'Send Wishes 🎉': { en: 'Send Wishes 🎉', pidgin: 'Send Wishes 🎉', yoruba: 'Rán Ìkíni 🎉', igbo: 'Zipu Ozi Ọma 🎉', hausa: 'Aika Gaisuwa 🎉' },

  'Community Golden Boy Leaderboard': { en: 'Community Golden Boy Leaderboard', pidgin: 'Top Punters & Golden Boy Leaderboard 🏆', yoruba: 'Àkójọ Olórí Golden Boy 🏆', igbo: 'Tebụl Ndị Kasị Mma Golden Boy 🏆', hausa: 'Teburin Jagororin Golden Boy na Jama’a 🏆' },
  'Official ranking of top Nigerian punters, highest streaks, and wonderkid voting charts.': { en: 'Official ranking of top Nigerian punters, highest streaks, and wonderkid voting charts.', pidgin: 'Official rank of best Naija punters, win streaks & wonderkid votes.', yoruba: 'Àtòjọ àwọn olùtẹtẹ Nàìjíríà tí ó tayọ jùlọ, àkójọ àṣeyọrí tó ga jù, àti àtẹ ìdìbò àwọn ọ̀dọ́ agbábọ́ọ̀lù.', igbo: 'Ọkwa ndị dinta nzọ kacha elu na Naịjirịa, usoro mmeri kacha elu, na eserese votu ndị ntorobịa.', hausa: 'Matsayin manyan masana caca na Najeriya, jerin nasarori, da teburin zaben matasa.' },

  'Settlement Ledger & Banker Records': { en: 'Settlement Ledger & Banker Records', pidgin: 'Official Match Record & Banker Ledger 📜', yoruba: 'Àkọsílẹ̀ Ìpèníyà Eré Pípé 📜', igbo: 'Akwụkwọ Ndekọ Emechara 📜', hausa: 'Teburin Sakamakon Wasanni & Bayanan Tabbaci 📜' },
  'Full transparent calendar of settled picks, verified match outcomes, and banker audits.': { en: 'Full transparent calendar of settled picks, verified match outcomes, and banker audits.', pidgin: 'Clear calendar of settled picks, true referee match results & banker audits.', yoruba: 'Kàlẹ́ndà tí ó ṣe kedere ti àwọn eré tí a pinnu, àbájáde eré tí a yẹ̀wò, àti àyẹ̀wò ìdánilójú.', igbo: 'Kalennda doro anya nke nhọrọ ndị edoziri, nsonaazụ egwuregwu enyochara, na nyocha banker.', hausa: 'Cikakken jadawalin hasashen da aka kammala, sakamakon wasanni da aka tantance, da binciken tabbaci.' },

  'Kelly Criterion Bankroll Calculator': { en: 'Kelly Criterion Bankroll Calculator', pidgin: 'Money Management & Bankroll Lab 💰', yoruba: 'Ètò Ìṣirò Owó Eré 💰', igbo: 'Mgbakọ Ego Egwuregwu 💰', hausa: 'Kwamfutar Kula Da Kudi ta Kelly Criterion 💰' },
  'Mathematical position-sizing, Poisson probability staking, and risk management lab.': { en: 'Mathematical position-sizing, Poisson probability staking, and risk management lab.', pidgin: 'Kelly math staking formula, Poisson odds analysis & risk control lab.', yoruba: 'Ètò ìṣirò fún iye owó kalokalo, àyẹ̀wò ìmọ̀ Poisson, àti yíyẹra fún ewu.', igbo: 'Usoro mgbakọ nchikota ego, nyocha ohere Poisson, na njikwa ihe egwu.', hausa: 'Lissafin adadin kudin caca, hasashen Poisson, da dakin gwajin kula da hadari.' },

  // World-First Features Grid
  'WORLD-FIRST FEATURES': { en: 'WORLD-FIRST FEATURES', pidgin: 'WORLD-FIRST FEATURES ⚡', yoruba: 'ÀWỌN OHUN ÈLÒ TUNTUN LÁYÉ ⚡', igbo: 'ATỤMATỤ NKE MBỤ N’ỤWA ⚡', hausa: 'KAYAN AIKI NA FARKO A DUNIYA ⚡' },
  '⚡ World-First Features': { en: '⚡ World-First Features', pidgin: '⚡ World-First Features', yoruba: '⚡ Àwọn Ohun Èlò Tuntun Láyé', igbo: '⚡ Atụmatụ Nke Mbụ n’Ụwa', hausa: '⚡ Kayan Aiki na Farko a Duniya' },
  'Open Full Menu': { en: 'Open Full Menu', pidgin: 'Open Full Menu', yoruba: 'Ṣí Àkójọ Pípé', igbo: 'Mepee Nchịkọta Niile', hausa: 'Bude Cikakken Menu' },
  'CROWD VIBE': { en: 'CROWD VIBE', pidgin: 'CROWD VIBE 🔥', yoruba: 'ARIWO ÀWỌN ÈRÒ PÁPÁ 🔥', igbo: 'ỌṄỤ NDỊ AMA EGWUREGWU 🔥', hausa: 'YANAYIN MASOYA 🔥' },
  'GOAL RUSH RADAR': { en: 'GOAL RUSH RADAR', pidgin: 'GOAL RUSH RADAR 🚨', yoruba: 'RÁDÀ GOOLU GBÍGBÓNÁ 🚨', igbo: 'RADA GOOLU DỊ OKPUKPỌ 🚨', hausa: 'FILIN KWALLAYE MASU ZAFI 🚨' },
  '12 in play': { en: '12 in play', pidgin: '12 dey play now', yoruba: '12 ń ṣeré lọ́wọ́', igbo: '12 na-egwu egwu', hausa: '12 a fili yanzu' },
  'Highest-tension live fixture:': { en: 'Highest-tension live fixture:', pidgin: 'Hottest live match:', yoruba: 'Eré tó gbóná jùlọ láyé:', igbo: 'Egwuregwu ndụ kacha ekpo ọkụ:', hausa: 'Wasan da ya fi zafi kai tsaye:' },
  'MATCHDAY FORTUNE': { en: 'MATCHDAY FORTUNE', pidgin: 'MATCHDAY FORTUNE 🎲', yoruba: 'ORÍRE ỌJỌ́ ERÉ 🎲', igbo: 'AKANTALỌ EGWUREGWO 🎲', hausa: 'SA’AR RANAR WASA 🎲' },
  'Ask the pitch for a lucky read.': { en: 'Ask the pitch for a lucky read.', pidgin: 'Ask the pitch for a lucky read.', yoruba: 'Béèrè lọ́wọ́ pápá fún oríire.', igbo: 'Jụọ ama egwuregwu maka amụma ihu ọma.', hausa: 'Nemi hasashen sa’a daga filin wasa.' },
  'Roll Fortune': { en: 'Roll Fortune', pidgin: 'Roll Fortune 🎲', yoruba: 'Yí Oríire 🎲', igbo: 'Tụgharịa Akantalọ 🎲', hausa: 'Juya Sa’a 🎲' },
  'DELUSION CHECK': { en: 'DELUSION CHECK', pidgin: 'DELUSION CHECK 🧠', yoruba: 'ÀYẸ̀WÒ ÒTÍTỌ́ 🧠', igbo: 'NNYOCHA EZIOKWU 🧠', hausa: 'GWAJIN GASKIYA 🧠' },
  'Rational market — low risk appetite': { en: 'Rational market — low risk appetite', pidgin: 'Calm market — low risk', yoruba: 'Ọjà oníṣirò — ewu kékeré', igbo: 'Ahịa kwụsiri ike — obere ihe egwu', hausa: 'Kasuwa mai hankali — karancin hadari' },

  // Settlement Ledger & Calendar
  'HISTORICAL SETTLEMENT LEDGER & CALENDAR': { en: 'HISTORICAL SETTLEMENT LEDGER & CALENDAR', pidgin: 'HISTORICAL SETTLEMENT LEDGER & CALENDAR 📜', yoruba: 'ÀKỌSÍLẸ̀ & KÀLẸ́NDÀ ÌPÈNÍYÀ ERÉ TẸ́LẸ̀ 📜', igbo: 'AKWỤKWỌ NDEKỌ NNYOCHA EGWUREGWU 📜', hausa: 'TEBURIN TANTANCE SAKAMAKON WASANNI & JADAWALI 📜' },
  'Immutable referee score sheets, banker accuracy (100% Win Rate), and verified payouts.': { en: 'Immutable referee score sheets, banker accuracy (100% Win Rate), and verified payouts.', pidgin: 'Official referee scores, 100% banker win rate record & verified bet settlements.', yoruba: 'Àkọsílẹ̀ àwọn adájọ́ tí kò lè yípadà, ìṣedéédé ìdánilójú (100% Win Rate), àti owó tí a yẹ̀wò.', igbo: 'Akwụkwọ nsonaazụ ndị ọkaikpe, izi ezi banker (100% Win Rate), na ịkwụ ụgwọ enyochara.', hausa: 'Sakamakon alkalan wasa na karshe, tabbacin nasara (100% Win Rate), da kudaden da aka biya.' },
  'Full Ledger Page': { en: 'Full Ledger Page', pidgin: 'Full Ledger Page ↗', yoruba: 'Ojúewé Àkọsílẹ̀ Pípé ↗', igbo: 'Ihu Akwụkwọ Ndekọ Niile ↗', hausa: 'Cikakken Shafin Bincike ↗' },
  'All Settled': { en: 'All Settled', pidgin: 'All Settled', yoruba: 'Gbogbo Tó Ti Pari', igbo: 'Ndị Edoziri Niile', hausa: 'Duk da Aka Kammala' },
  'Won Picks': { en: 'Won Picks', pidgin: 'Won Picks', yoruba: 'Àwọn Ìsọtẹ́lẹ̀ Tó Wọlé', igbo: 'Nhọrọ Ndị Meriri', hausa: 'Hasashen da Aka Ci' },
  'Lost Picks': { en: 'Lost Picks', pidgin: 'Lost Picks', yoruba: 'Àwọn Ìsọtẹ́lẹ̀ Tó Bọ́', igbo: 'Nhọrọ Ndị Kọrọ', hausa: 'Hasashen da Aka Rasa' },
  'Pick Date:': { en: 'Pick Date:', pidgin: 'Pick Date:', yoruba: 'Ọjọ́ Ìsọtẹ́lẹ̀:', igbo: 'Ụbọchị Nhọrọ:', hausa: 'Ranar Hasashe:' },
  'DATE & LEAGUE': { en: 'DATE & LEAGUE', pidgin: 'DATE & LEAGUE', yoruba: 'ỌJỌ́ & LIIGI', igbo: 'ỤBỌCHỊ & LIIGI', hausa: 'RANA & GASA' },
  'FIXTURE & FULL-TIME SCORE': { en: 'FIXTURE & FULL-TIME SCORE', pidgin: 'MATCH & FT SCORE', yoruba: 'ERÉ & ÀBÁJÁDE PÍPÉ', igbo: 'EGWUREGWO & NSONAAZỤ', hausa: 'WASA & SAKAMAKON KARSHE' },
  'SYSTEM BANKER PICK': { en: 'SYSTEM BANKER PICK', pidgin: 'SYSTEM BANKER PICK', yoruba: 'ÌSỌTẸ́LẸ̀ ÌDÁNILÓJÚ INJIN', igbo: 'EZIOKWU NHỌRỌ SISTEM', hausa: 'HASASHEN TABBACI NA NA’URA' },
  'ODDS': { en: 'ODDS', pidgin: 'ODDS', yoruba: 'IYE KALOKALO', igbo: 'ODDS', hausa: 'RABO' },
  'OUTCOME': { en: 'OUTCOME', pidgin: 'OUTCOME', yoruba: 'ÀBÁJÁDE', igbo: 'NSONAAZỤ', hausa: 'SAKAMAKO' },
  'AUDIT': { en: 'AUDIT', pidgin: 'AUDIT', yoruba: 'ÀYẸ̀WÒ', igbo: 'NNYOCHA', hausa: 'TANTANCEWA' },
  'Collapse': { en: 'Collapse', pidgin: 'Fold Am', yoruba: 'Ká Pọ̀', igbo: 'Pịaji', hausa: 'Kulle' },

  // News Wire & Load More
  'Load 3 More Articles': { en: 'Load 3 More Articles', pidgin: 'Load 3 More Gist', yoruba: 'Ka Àwọn Ìròyìn 3 Síi', igbo: 'Gụkwuo Akụkọ 3 Ọzọ', hausa: 'Kara Wasu Labarai 3' },
  '⚡ Load 3 More Articles': { en: '⚡ Load 3 More Articles', pidgin: '⚡ Load 3 More Gist', yoruba: '⚡ Ka Àwọn Ìròyìn 3 Síi', igbo: '⚡ Gụkwuo Akụkọ 3 Ọzọ', hausa: '⚡ Kara Wasu Labarai 3' },
  'VERIFIED OFFICIAL REPORT ✓': { en: 'VERIFIED OFFICIAL REPORT ✓', pidgin: 'TRUE OFFICIAL GIST ✓', yoruba: 'ÌRÒYÌN GIDI TÍ A YẸ̀WÒ ✓', igbo: 'EZI AKỤKỌ ENYOCHARA ✓', hausa: 'CIKAKKEN LABARI MAI INGANCI ✓' },

  // Match Cards, Actions & Predictions
  '+ Bet Tips': { en: '+ Bet Tips', pidgin: '+ Bet Tips 🎯', yoruba: '+ Ìmọ̀ràn Kalokalo 🎯', igbo: '+ Ndụmọdụ Nzọ 🎯', hausa: '+ Shawarar Caca 🎯' },
  'Shawarar Caca': { en: 'Bet Tips', pidgin: 'Bet Tips', yoruba: 'Ìmọ̀ràn Kalokalo', igbo: 'Ndụmọdụ Nzọ', hausa: 'Shawarar Caca' },
  'Table ➔': { en: 'Table ➔', pidgin: 'Table ➔', yoruba: 'Tábìlì ➔', igbo: 'Tebụl ➔', hausa: 'Tebur ➔' },
  'win confidence': { en: 'win confidence', pidgin: 'sure confidence', yoruba: 'ìdánilójú ìṣẹ́gun', igbo: 'ntụkwasị obi mmeri', hausa: 'tabbacin nasara' },
  'Home': { en: 'Home', pidgin: 'Home', yoruba: 'Ilé', igbo: 'Ụlọ', hausa: 'Gida' },
  'Draw': { en: 'Draw', pidgin: 'Draw', yoruba: 'Dọ́gba', igbo: 'Jikọọ', hausa: 'Canjaras' },
  'Away': { en: 'Away', pidgin: 'Away', yoruba: 'Àbẹ̀wò', igbo: 'Nleta', hausa: 'Waje' },
  'Gida': { en: 'Home', pidgin: 'Home', yoruba: 'Ilé', igbo: 'Ụlọ', hausa: 'Gida' },
  'Canjaras': { en: 'Draw', pidgin: 'Draw', yoruba: 'Dọ́gba', igbo: 'Jikọọ', hausa: 'Canjaras' },
  'Waje': { en: 'Away', pidgin: 'Away', yoruba: 'Àbẹ̀wò', igbo: 'Nleta', hausa: 'Waje' },
  'CIKAKKEN TABBACI': { en: 'ULTRA-BANKER', pidgin: 'PURE BANKER 🔥', yoruba: 'ÌDÁNILÓJÚ PÍPÉ 🔥', igbo: 'EZIOKWU 100% 🔥', hausa: 'CIKAKKEN TABBACI 🔥' },
  'Sama da ƙwallo 1.5': { en: 'Over 1.5 Goals', pidgin: 'Over 1.5 Goals', yoruba: 'Goolu tó ju 1.5 lọ', igbo: 'Ihe karịrị goolu 1.5', hausa: 'Sama da ƙwallo 1.5' },
  'Sama da ƙwallo 2.5': { en: 'Over 2.5 Goals', pidgin: 'Over 2.5 Goals', yoruba: 'Goolu tó ju 2.5 lọ', igbo: 'Ihe karịrị goolu 2.5', hausa: 'Sama da ƙwallo 2.5' },
  'Ƙasa da ƙwallo 2.5': { en: 'Under 2.5 Goals', pidgin: 'Under 2.5 Goals', yoruba: 'Goolu tí kò ju 2.5 lọ', igbo: 'Goolu na-erughị 2.5', hausa: 'Ƙasa da ƙwallo 2.5' },
  'Dukkan Ƙungiyoyin Za Su Ci Ƙwallo': { en: 'Both Teams to Score (GG)', pidgin: 'Both Teams Go Score (GG)', yoruba: 'Àwọn Ẹgbẹ́ Méjèèjì Yóò Gba Goolu', igbo: 'Otu Abụọ Ga-agba Goolu', hausa: 'Dukkan Ƙungiyoyin Za Su Ci Ƙwallo' },

  // Status Filter Tabs
  'Live': { en: 'Live', pidgin: 'Live Now 🔴', yoruba: 'Láyé 🔴', igbo: 'Ndụ Ugbu A 🔴', hausa: 'Raye Yanzu 🔴' },
  'Upcoming': { en: 'Upcoming', pidgin: 'Coming Up 🟡', yoruba: 'Tó Ń Bọ̀ 🟡', igbo: 'Na-abịa 🟡', hausa: 'Mai Zuwa 🟡' },
  'Played': { en: 'Played', pidgin: 'Don Finish ✅', yoruba: 'Ti Ṣeré ✅', igbo: 'Emechara ✅', hausa: 'An Kammala ✅' },
  'Following': { en: 'Following', pidgin: 'Following ⭐', yoruba: 'Tẹ̀lé ⭐', igbo: 'Na-eso ⭐', hausa: 'Masu Bi ⭐' },
  'All Leagues': { en: 'All Leagues', pidgin: 'All Leagues 🌍', yoruba: 'Gbogbo Liigi 🌍', igbo: 'Liigi Niile 🌍', hausa: 'Duk Gasanni 🌍' },
  'High Guarantees': { en: 'High Guarantees', pidgin: 'Sure Bankers 👑', yoruba: 'Ìdánilójú Gíga 👑', igbo: 'Eziokwu Nwere Nkwa 👑', hausa: 'Tabbaci Mai Yawa 👑' },
  '👑 70%+ Bankers': { en: '👑 70%+ Bankers', pidgin: '👑 70%+ Sure Bankers', yoruba: '👑 Ìdánilójú 70%+', igbo: '👑 Eziokwu 70%+', hausa: '👑 70%+ Masu Tabbaci' },

  // Actions & Buttons
  'Sauke Manhaja': { en: 'Download App', pidgin: 'Download App 📲', yoruba: 'Gba Ohun Èlò 📲', igbo: 'Budata Ngwa 📲', hausa: 'Sauke Manhaja 📲' },
  'Manyan Yan Wasa': { en: 'Star Players', pidgin: 'Star Players ⭐', yoruba: 'Àwọn Gbajúmọ̀ ⭐', igbo: 'Ndị Ama Ama ⭐', hausa: 'Manyan Yan Wasa ⭐' },
  'Wasannin Raye': { en: 'Live Matches', pidgin: 'Live Matches ⚡', yoruba: 'Àwọn Eré Láyé ⚡', igbo: 'Egwuregwu Ndụ ⚡', hausa: 'Wasannin Raye ⚡' },
  'Teburin Jagorori': { en: 'Leaderboard', pidgin: 'Leaderboard 🏆', yoruba: 'Àkójọ Olórí 🏆', igbo: 'Ndị Isi Oche 🏆', hausa: 'Teburin Jagorori 🏆' },
  'Ranar Haihuwa': { en: 'Birthdays', pidgin: 'Birthdays 🎂', yoruba: 'Ọjọ́ Ìbí 🎂', igbo: 'Ụbọchị Ọmụmụ 🎂', hausa: 'Ranar Haihuwa 🎂' },
  'Sauke': { en: 'Download', pidgin: 'Download', yoruba: 'Gba Sílẹ̀', igbo: 'Budata', hausa: 'Sauke' },
  'Karanta Labari': { en: 'Read Story', pidgin: 'Read Full Gist ➔', yoruba: 'Ka Ìròyìn ➔', igbo: 'Gụọ Akụkọ ➔', hausa: 'Karanta Labari ➔' },
  'Karanta Labari ➔': { en: 'Read Story ➔', pidgin: 'Read Full Gist ➔', yoruba: 'Ka Ìròyìn ➔', igbo: 'Gụọ Akụkọ ➔', hausa: 'Karanta Labari ➔' },
  'Raba Labari': { en: 'Share Story', pidgin: 'Share Gist', yoruba: 'Pín Ìròyìn', igbo: 'Kekọrịta Akụkọ', hausa: 'Raba Labari' },
  'Close': { en: 'Close', pidgin: 'Close', yoruba: 'Pa Dé', igbo: 'Mechie', hausa: 'Rufe' },
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

  // REAL-TIME AUTOMATIC DOM RECURSIVE DEEP TRANSLATION OBSERVER
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    if (lang === 'en') return;

    const translateNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE && node.nodeValue) {
        const raw = node.nodeValue.trim();
        if (raw.length > 1 && !/^\d+$/.test(raw)) {
          for (const [enKey, map] of Object.entries(COMPREHENSIVE_DICTIONARY)) {
            if (map[lang] && (raw === enKey || raw.toLowerCase() === enKey.toLowerCase())) {
              node.nodeValue = node.nodeValue.replace(raw, map[lang]);
              break;
            }
          }
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        if (['SCRIPT', 'STYLE', 'IFRAME', 'SVG', 'NOSCRIPT'].includes(el.tagName)) return;
        
        // Translate placeholders
        if (el.getAttribute && el.getAttribute('placeholder')) {
          const ph = el.getAttribute('placeholder')!;
          if (COMPREHENSIVE_DICTIONARY[ph]?.[lang]) {
            el.setAttribute('placeholder', COMPREHENSIVE_DICTIONARY[ph][lang]);
          }
        }

        // Translate child nodes
        node.childNodes.forEach(translateNode);
      }
    };

    // Initial pass
    translateNode(document.body);

    // Dynamic Mutation Observer for lazy/async rendered elements & modals
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((addedNode) => {
          translateNode(addedNode);
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [lang]);

  const meta = SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, meta }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);
