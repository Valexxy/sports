'use client';

/**
 * AUTHENTIC LIVE & HISTORICAL MATCH VOICE ENGINE
 * - Web Speech API with pitch & rate tuning
 * - Deadlock protection with auto-resume
 * - Pure natural spoken commentary (No robotic "Minute XX" time callouts)
 */

let isCurrentlySpeaking = false;
let speechFallbackTimer: NodeJS.Timeout | null = null;

export function warriTransliterate(text: string): string {
  // Strip any accidental minute callouts
  const cleaned = text.replace(/minute\s*\d+:\s*/gi, '').replace(/\d+[':]\s*/gi, '');
  return cleaned.trim()
    .replace(/Welcome to the live match o!/gi, 'Waffi people, welcome to the live match o! Correct banker match!')
    .replace(/Goal/gi, 'Gooooooal o! Net don scatter!')
    .replace(/scored/gi, 'don tear net')
    .replace(/yellow card/gi, 'yellow card! Referee say make you behave yourself')
    .replace(/red card/gi, 'red card straight! Go take your bath')
    .replace(/shot/gi, 'thunder strike')
    .replace(/saved/gi, 'jump like cat parry am')
    .replace(/pass/gi, 'correct carpet pass')
    .replace(/tackle/gi, 'solid Warri tackle')
    .replace(/foul/gi, 'bad tackle')
    .replace(/referee/gi, 'referee oga')
    .replace(/half time/gi, 'first 45 mins don finish, make players go drink water')
    .replace(/full time/gi, 'match don end kpatakpata, record don lock');
}

export function primeNaijaVoices(): void {
  if (typeof window === 'undefined') return;
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.getVoices();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch {}
  }
}

export function stopNaijaAudio(): void {
  if (speechFallbackTimer) clearTimeout(speechFallbackTimer);
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
  isCurrentlySpeaking = false;
}

export function speakNaija(
  text: string,
  tone: 'normal' | 'hyped' | 'goal' | 'card' = 'hyped',
  opts: { lang?: string; onEnd?: () => void } = {}
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (opts.onEnd) setTimeout(opts.onEnd, 2000);
    return;
  }

  try {
    if (speechFallbackTimer) clearTimeout(speechFallbackTimer);
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const isPidgin = (opts.lang || 'en-NG') === 'en-NG';
    const speechText = isPidgin ? warriTransliterate(text) : text.replace(/minute\s*\d+:\s*/gi, '').replace(/\d+[':]\s*/gi, '').trim();

    if (!speechText) {
      if (opts.onEnd) opts.onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(speechText);
    
    // Configure voice parameters for energetic natural broadcast
    utterance.rate = tone === 'goal' ? 1.05 : 0.98;
    utterance.pitch = tone === 'goal' ? 1.15 : 0.96;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const preferredVoice = voices.find(v => 
        (isPidgin && (v.lang.includes('en-NG') || v.lang.includes('en-ZA') || v.lang.includes('en-GB'))) ||
        (!isPidgin && (v.lang.includes('en-GB') || v.lang.includes('en-US')))
      ) || voices.find(v => v.lang.includes('en')) || voices[0];

      if (preferredVoice) utterance.voice = preferredVoice;
    }

    let hasEnded = false;
    const finish = () => {
      if (hasEnded) return;
      hasEnded = true;
      if (speechFallbackTimer) clearTimeout(speechFallbackTimer);
      isCurrentlySpeaking = false;
      if (opts.onEnd) opts.onEnd();
    };

    utterance.onend = finish;
    utterance.onerror = finish;

    // Safety fallback timer so commentary never freezes if browser speech hangs
    const estimatedDurationMs = Math.max(2500, (speechText.split(' ').length / 2.5) * 1000 + 1500);
    speechFallbackTimer = setTimeout(finish, estimatedDurationMs);

    isCurrentlySpeaking = true;
    window.speechSynthesis.speak(utterance);

    // Chrome workaround for speech synthesis pausing in background
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  } catch (err) {
    isCurrentlySpeaking = false;
    if (opts.onEnd) opts.onEnd();
  }
}
