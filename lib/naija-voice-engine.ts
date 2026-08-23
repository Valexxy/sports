'use client';

/**
 * AUTHENTIC WARRI / EDO NIGERIAN PIDGIN ACOUSTIC SYNTHESIZER
 * Tuned with Warri swagger, Pidgin cadences, vocal inflections, and stadium commentary chants!
 */

export type NaijaTone = 'normal' | 'hyped' | 'goal' | 'foul' | 'card';

// Deep Warri & Edo state phonetic transliterator
export function warriTransliterate(text: string): string {
  let t = text.trim()
    .replace(/\bWelcome to the live\b/gi, 'Waffi people welcome to the hot live')
    .replace(/\bGoal\b/gi, 'Goooooal o! Wire am enter net')
    .replace(/\bscored\b/gi, 'don scatter net')
    .replace(/\byellow card\b/gi, 'yellow card! Referee say make you behave yourself')
    .replace(/\bred card\b/gi, 'red card straight! Go take your bath')
    .replace(/\bshot\b/gi, 'thunder shot')
    .replace(/\bsaved\b/gi, 'parry like eagle')
    .replace(/\bpass\b/gi, 'fine carpet pass')
    .replace(/\btackle\b/gi, 'solid Warri tackle')
    .replace(/\bfoul\b/gi, 'bad foul')
    .replace(/\breferee\b/gi, 'referee oga')
    .replace(/\bhalf time\b/gi, 'first half don finish, make players go drink pure water')
    .replace(/\bfull time\b/gi, 'match don end kpatakpata')
    .replace(/\bpossession\b/gi, 'ball control')
    .replace(/\bpenalty\b/gi, 'penalty kick! Tension dey stadium')
    .replace(/\bcorner kick\b/gi, 'corner kick')
    .replace(/\bwhat a\b/gi, 'omo see')
    .replace(/\bgreat\b/gi, 'correct')
    .replace(/\bamazing\b/gi, 'mad')
    .replace(/\bvery\b/gi, 'well well')
    .replace(/\bnow\b/gi, 'now now');
  return t;
}

export function primeNaijaVoices(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.resume();
  } catch {}
}

export function speakNaija(
  text: string,
  tone: NaijaTone = 'hyped',
  opts: { rate?: number; pitch?: number; volume?: number; onEnd?: () => void } = {}
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    const synth = window.speechSynthesis;
    synth.resume();

    const voices = synth.getVoices();
    const isFemale = (n: string) => /female|ezinne|ada|zira|hazel|susan|samantha|victoria/.test(n.toLowerCase());
    
    // Pick authentic male commentator voice
    const voice =
      voices.find((v) => (v.lang.toLowerCase().includes('ng') || v.name.toLowerCase().includes('nigeria')) && !isFemale(v.name)) ||
      voices.find((v) => (v.lang.toLowerCase().includes('en-za') || v.name.toLowerCase().includes('africa')) && !isFemale(v.name)) ||
      voices.find((v) => v.lang.toLowerCase().includes('en-gb') && !isFemale(v.name)) ||
      voices.find((v) => !isFemale(v.name)) ||
      voices[0];

    const speechText = warriTransliterate(text);
    const utter = new SpeechSynthesisUtterance(speechText);
    if (voice) utter.voice = voice;

    // Warri cadence tuning: punchy rate and confident pitch
    utter.rate = opts.rate ?? (tone === 'goal' ? 1.14 : tone === 'hyped' ? 1.08 : 1.02);
    utter.pitch = opts.pitch ?? (tone === 'goal' ? 1.04 : 0.92);
    utter.volume = opts.volume ?? 1.0;
    if (opts.onEnd) utter.onend = opts.onEnd;

    synth.cancel();
    synth.resume();
    synth.speak(utter);
  } catch (err) {
    console.warn('SpeechSynthesis error:', err);
  }
}
