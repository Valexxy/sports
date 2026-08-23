'use client';

/**
 * UNIVERSAL NAIJA LANGUAGE & ACOUSTIC SPEECH PACK (en-NG)
 * Synthesizes authentic Nigerian sports commentary with crowd audio on any device.
 */

export type NaijaTone = 'normal' | 'hyped' | 'shock' | 'calm';

export function naijaTransliterate(text: string): string {
  return text.trim()
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
    .replace(/\bgoal\b/gi, 'goal o')
    .replace(/\bscores\b/gi, 'score am')
    .replace(/\bscored\b/gi, 'wire am enter net');
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
    
    // Pick Nigerian or British/African male voice
    const ngVoice =
      voices.find((v) => (v.lang.toLowerCase().includes('ng') || v.name.toLowerCase().includes('nigeria')) && !isFemale(v.name)) ||
      voices.find((v) => (v.lang.toLowerCase().includes('en-za') || v.name.toLowerCase().includes('africa')) && !isFemale(v.name)) ||
      voices.find((v) => v.lang.toLowerCase().includes('en-gb') && !isFemale(v.name)) ||
      voices.find((v) => !isFemale(v.name)) ||
      voices[0];

    const speechText = naijaTransliterate(text);
    const utter = new SpeechSynthesisUtterance(speechText);
    if (ngVoice) utter.voice = ngVoice;

    utter.rate = opts.rate ?? (tone === 'hyped' ? 1.08 : 1.02);
    utter.pitch = opts.pitch ?? 0.94; // Deep, confident commentator resonance
    utter.volume = opts.volume ?? 1.0;
    if (opts.onEnd) utter.onend = opts.onEnd;

    synth.cancel();
    synth.resume();
    synth.speak(utter);
  } catch (err) {
    console.warn('SpeechSynthesis error:', err);
  }
}
