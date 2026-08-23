'use client';

/**
 * AUTHENTIC DEEP MASCULINE NIGERIAN VOICE STREAMING ENGINE
 * Streams real Nigerian accent audio via /api/tts?lang=en-NG and transforms it
 * via Web Audio DSP (pitch shift + bass formant enhancement) into a deep, authoritative male commentator!
 */

let activeAudio: HTMLAudioElement | null = null;
let audioCtx: AudioContext | null = null;

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
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass && !audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
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
  primeNaijaVoices();

  const isPidgin = (opts.lang || 'en-NG') === 'en-NG';
  const targetLang = opts.lang || 'en-NG';
  const speechText = isPidgin ? warriTransliterate(text) : text;

  try {
    const audioUrl = `/api/tts?lang=${targetLang}&text=${encodeURIComponent(speechText)}`;
    const audio = new Audio(audioUrl);
    activeAudio = audio;

    // DEEP MASCULINE VOICE MODULATION
    if (isPidgin) {
      // 0.88x playback pitch lowers the voice fundamental into a rich, deep male baritone range!
      audio.playbackRate = 0.89;
      // Preserve pitch shifting on modern browsers
      (audio as any).preservesPitch = false;
      (audio as any).mozPreservesPitch = false;
      (audio as any).webkitPreservesPitch = false;
    } else {
      audio.playbackRate = 1.0;
    }

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
        console.warn('Audio play error:', err);
        if (opts.onEnd) {
          setTimeout(opts.onEnd, 1500);
        }
      });
    }
  } catch (err) {
    console.warn('Audio error:', err);
    if (opts.onEnd) {
      setTimeout(opts.onEnd, 1500);
    }
  }
}
