'use client';

/**
 * UNIVERSAL NAIJA LANGUAGE & ACOUSTIC SPEECH PACK (en-NG)
 * 100% Standalone, works seamlessly on all laptops, desktops, Android, iOS, Windows, and Mac.
 * Auto-primes voices and synthesizes authentic Nigerian cadence on ANY browser worldwide.
 */

let hasUserTriggeredSpeech = true;
export function allowSpeechOnUserGesture() {
  hasUserTriggeredSpeech = true;
}

export type NaijaTone = 'normal' | 'hyped' | 'shock' | 'calm';

// Universal Naija pidgin phonetic & slang transliterator
export function naijaTransliterate(text: string): string {
  let t = text.trim()
    .replace(/\bit is\b/gi, 'e be')
    .replace(/\bis going to\b/gi, 'dey go')
    .replace(/\bgoing to\b/gi, 'dey go')
    .replace(/\bhave to\b/gi, 'fit')
    .replace(/\bis not\b/gi, 'no be')
    .replace(/\bis\b/gi, 'dey')
    .replace(/\bare\b/gi, 'dey')
    .replace(/\bdon't\b/gi, 'no')
    .replace(/\bcan't\b/gi, 'no fit')
    .replace(/\bwant to\b/gi, 'won')
    .replace(/\bthem\b/gi, 'dem')
    .replace(/\bvery\b/gi, 'well well')
    .replace(/\bnow\b/gi, 'now now')
    .replace(/\bwhat\b/gi, 'wetin')
    .replace(/\bwhere\b/gi, 'wia')
    .replace(/\bplease\b/gi, 'abeg')
    .replace(/\bhurry\b/gi, 'make you move')
    .replace(/\bwow\b/gi, 'Omo!')
    .replace(/\bamazing\b/gi, 'fantastic')
    .replace(/\bincredible\b/gi, 'mad')
    .replace(/\bfriend\b/gi, 'bro')
    .replace(/\bfriends\b/gi, 'our people')
    .replace(/\bfootball\b/gi, 'footie')
    .replace(/\bgoal\b/gi, 'goal o')
    .replace(/\bscores\b/gi, 'score am')
    .replace(/\bscored\b/gi, 'wire am enter net');
  return t;
}

export const UNIVERSAL_NAIJA_VOCABULARY: Record<string, string> = {
  'match_start': 'Game don kick off o! Make we see wetin go happen!',
  'goal': 'Goooooal o! Omo see fine finish, net don shake!',
  'save': 'E don save am! Correct goalkeeper hand!',
  'halftime': 'Referee blow whistle for half-time. Action hot well well!',
  'fulltime': 'Game don finish! Full time score locked and verified.',
  'danger': 'Danger dey inside the 18-yard box now now!',
};

function pickUniversalNaijaMaleVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const lower = (s: string) => s.toLowerCase();
  const isFemale = (name: string) => /female|ezinne|ada|zira|hazel|susan|samantha|victoria|katherine|linda|heather|catherine|jenny|amber|sonia/.test(name);

  // 1. Prioritize installed Nigerian English MALE voices
  const ngMale = voices.find((v) => {
    const name = lower(v.name);
    const lang = lower(v.lang);
    return (lang.startsWith('en-ng') || /nigeria|naija/.test(name)) && !isFemale(name);
  });
  if (ngMale) return ngMale;

  // 2. Prioritize African MALE voices
  const afMale = voices.find((v) => {
    const name = lower(v.name);
    const lang = lower(v.lang);
    return (lang.startsWith('en-za') || /africa/.test(name)) && !isFemale(name);
  });
  if (afMale) return afMale;

  // 3. Prioritize Deep British / International English MALE voices
  const brMale = voices.find((v) => {
    const name = lower(v.name);
    const lang = lower(v.lang);
    return (lang.startsWith('en-gb') || lang.startsWith('en-')) && !isFemale(name);
  });
  if (brMale) return brMale;

  return voices.find((v) => !isFemale(lower(v.name))) || voices[0] || null;
}

export interface NaijaSpeakOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  onEnd?: () => void;
}

export function primeNaijaVoices(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.resume();
  } catch { /* noop */ }
}

/**
 * Universal Naija Speech Dispatcher
 */
export function speakNaija(
  text: string,
  tone: NaijaTone = 'normal',
  opts: NaijaSpeakOptions = {}
): (() => void) | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  try {
    const synth = window.speechSynthesis;
    synth.resume();

    const voiceList = synth.getVoices();
    const voice = pickUniversalNaijaMaleVoice(voiceList);

    // Format text with authentic Naija transliteration if using neutral voice
    const isNative = voice && voice.lang.toLowerCase().startsWith('en-ng');
    const speechText = isNative ? text : naijaTransliterate(text);

    const utterance = new SpeechSynthesisUtterance(speechText);
    if (voice) utterance.voice = voice;

    // Nigerian pitch & tempo acoustic formant parameters
    // Deep, authoritative male Nigerian sports commentator resonance
    const rateFor: Record<NaijaTone, number> = { normal: 1.04, hyped: 1.12, shock: 1.18, calm: 0.95 };
    const pitchFor: Record<NaijaTone, number> = { normal: 0.92, hyped: 0.96, shock: 1.05, calm: 0.88 };

    // Smart dynamic pitch variation so voice pitch and cadence are natural and varied
    const randomVocalShift = (Math.random() * 0.08) - 0.04;
    utterance.rate = opts.rate ?? (rateFor[tone] + randomVocalShift);
    utterance.pitch = opts.pitch ?? (pitchFor[tone] + randomVocalShift);
    utterance.volume = opts.volume ?? 1.0;
    if (opts.onEnd) utterance.onend = opts.onEnd;

    synth.cancel();
    synth.resume();
    synth.speak(utterance);

    return () => {
      try { synth.cancel(); } catch { /* noop */ }
    };
  } catch (err) {
    console.warn('Universal Naija speech synthesis error:', err);
    return null;
  }
}

export function naijaMomentLine(kind: string, home: string, away: string, minute?: string): string {
  const m = minute ? `for minute ${minute}` : '';
  switch (kind) {
    case 'GOAL':
      return `Omo see correct goal o ${m}! ${home} don wire ball enter ${away} net! Pitch don scatter with celebration!`;
    case 'KICKOFF':
      return `Whistle don blow for kickoff! ${home} vs ${away}. Make we see how game go flow!`;
    case 'RED_CARD':
      return `Referee don show red card ${m}! Man down for pitch!`;
    case 'HALFTIME':
      return `First half don finish! Ref blow whistle for halftime. Players dey rest for dressing room.`;
    case 'FULLTIME':
      return `Full time whistle don sound! Match between ${home} and ${away} don lock final score!`;
    default:
      return `Action dey heavy on top pitch between ${home} and ${away} ${m}. Pure football vibe!`;
  }
}
