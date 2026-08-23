'use client';

/**
 * AUTHENTIC AFRICAN & NIGERIAN VOICE AUDIO ENGINE
 * Streams real native Nigerian human voice MP3 audio via /api/tts?lang=en-NG
 * with automatic fallback to Web Speech API.
 */

let currentAudio: HTMLAudioElement | null = null;

export function warriTransliterate(text: string): string {
  return text.trim()
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
}

export function primeNaijaVoices(): void {
  if (typeof window === 'undefined') return;
  try {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.resume();
    }
  } catch {}
}

export function stopNaijaAudio(): void {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch {}
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function speakNaija(
  text: string,
  tone: 'normal' | 'hyped' | 'goal' | 'card' = 'hyped',
  opts: { lang?: string; onEnd?: () => void } = {}
): void {
  if (typeof window === 'undefined') return;

  const targetLang = opts.lang || 'en-NG';
  const speechText = targetLang === 'en-NG' ? warriTransliterate(text) : text;

  stopNaijaAudio();

  // TIER 1: Real Native Nigerian Cloud MP3 Audio Stream
  try {
    const audioUrl = `/api/tts?lang=${targetLang}&text=${encodeURIComponent(speechText)}`;
    const audio = new Audio(audioUrl);
    currentAudio = audio;
    audio.volume = 1.0;

    audio.onended = () => {
      currentAudio = null;
      if (opts.onEnd) opts.onEnd();
    };

    audio.onerror = () => {
      // TIER 2: Fallback to Local Web Speech API if network audio fails
      playLocalSpeechFallback(speechText, opts);
    };

    audio.play().catch(() => {
      playLocalSpeechFallback(speechText, opts);
    });
  } catch {
    playLocalSpeechFallback(speechText, opts);
  }
}

function playLocalSpeechFallback(text: string, opts: { onEnd?: () => void } = {}): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    const synth = window.speechSynthesis;
    synth.resume();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.05;
    utter.pitch = 0.94;
    utter.volume = 1.0;
    if (opts.onEnd) utter.onend = opts.onEnd;
    synth.speak(utter);
  } catch {}
}
