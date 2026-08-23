'use client';

/**
 * AUTHENTIC NIGERIAN VOICE STREAMING ENGINE
 * Streams real native Nigerian accent audio via /api/tts?lang=en-NG
 * Plays seamlessly across iOS Safari, Android Chrome, Windows, and Mac.
 */

let activeAudio: HTMLAudioElement | null = null;

// Deep Warri / Edo transliterator for authentic Nigerian commentary
export function warriTransliterate(text: string): string {
  return text.trim()
    .replace(/\bWelcome to the live match o!\b/gi, 'Waffi people, welcome to the live match o! Correct banker match!')
    .replace(/\bGoal\b/gi, 'Gooooooal o! Net don scatter!')
    .replace(/\bscored\b/gi, 'don tear net')
    .replace(/\byellow card\b/gi, 'yellow card! Referee say make you behave yourself')
    .replace(/\bred card\b/gi, 'red card straight! Go take your bath')
    .replace(/\bshot\b/gi, 'thunder strike')
    .replace(/\bsaved\b/gi, 'jump like cat parry am')
    .replace(/\bpass\b/gi, 'correct carpet pass')
    .replace(/\btackle\b/gi, 'solid Warri tackle')
    .replace(/\bfoul\b/gi, 'bad tackle')
    .replace(/\breferee\b/gi, 'referee oga')
    .replace(/\bhalf time\b/gi, 'first 45 mins don finish, make players go drink water')
    .replace(/\bfull time\b/gi, 'match don end kpatakpata, record don lock')
    .replace(/\bpossession\b/gi, 'ball control')
    .replace(/\bpenalty\b/gi, 'penalty kick! High tension dey stadium')
    .replace(/\bcorner kick\b/gi, 'corner kick')
    .replace(/\bwhat a\b/gi, 'omo see')
    .replace(/\bgreat\b/gi, 'mad')
    .replace(/\bamazing\b/gi, 'correct')
    .replace(/\bvery\b/gi, 'well well')
    .replace(/\bnow\b/gi, 'now now');
}

export function primeNaijaVoices(): void {
  // Mobile Audio context unlock
  if (typeof window === 'undefined') return;
  try {
    const silentAudio = new Audio();
    silentAudio.play().catch(() => {});
  } catch {}
}

export function stopNaijaAudio(): void {
  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.currentTime = 0;
      activeAudio.onended = null;
      activeAudio.onerror = null;
    } catch {}
    activeAudio = null;
  }
}

export function speakNaija(
  text: string,
  tone: 'normal' | 'hyped' | 'goal' | 'card' = 'hyped',
  opts: { lang?: string; onEnd?: () => void } = {}
): void {
  if (typeof window === 'undefined') return;

  stopNaijaAudio();

  const isPidgin = (opts.lang || 'en-NG') === 'en-NG';
  const targetLang = opts.lang || 'en-NG';
  const speechText = isPidgin ? warriTransliterate(text) : text;

  try {
    const audioUrl = `/api/tts?lang=${targetLang}&text=${encodeURIComponent(speechText)}`;
    const audio = new Audio(audioUrl);
    activeAudio = audio;
    audio.volume = 1.0;

    audio.onended = () => {
      activeAudio = null;
      if (opts.onEnd) {
        opts.onEnd();
      }
    };

    audio.onerror = () => {
      activeAudio = null;
      if (opts.onEnd) {
        setTimeout(opts.onEnd, 1500);
      }
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Audio play prevented (requires user tap):', err);
        if (opts.onEnd) {
          setTimeout(opts.onEnd, 2000);
        }
      });
    }
  } catch (err) {
    console.warn('Audio stream error:', err);
    if (opts.onEnd) {
      setTimeout(opts.onEnd, 1500);
    }
  }
}
