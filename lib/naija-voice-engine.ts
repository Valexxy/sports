'use client';

/**
 * AUTHENTIC WARRI & NIGERIAN PIDGIN COMMENTARY AUDIO ENGINE
 * - Authentic Warri Brother / Naija Street Pidgin energetic commentator
 * - Genuine street phrases (Waffi cruise, Gbam!, Net don scatter, Wahala gas)
 * - Pure natural spoken commentary with zero robotic minute callouts
 */

let isCurrentlySpeaking = false;
let speechFallbackTimer: NodeJS.Timeout | null = null;

export function warriTransliterate(text: string): string {
  if (!text) return '';
  const cleaned = text.replace(/minute\s*\d+:\s*/gi, '').replace(/\b\d+[':]\s*/gi, '');
  return cleaned.trim()
    .replace(/\bWelcome to the live match o!\b/gi, 'Waffi people I salute una! Welcome to this heavy banker match!')
    .replace(/\bGoal\b/gi, 'Gooooooal o! Net don scatter kpatakpata! See banger!')
    .replace(/\bscored\b/gi, 'fire thunder goal enter net')
    .replace(/\byellow card\b/gi, 'yellow card! Referee say make you calm your body')
    .replace(/\bred card\b/gi, 'red card straight! Pack your load go house')
    .replace(/\bshot\b/gi, 'heavy bullet strike')
    .replace(/\bsaved\b/gi, 'goalkeeper fly like bird catch am')
    .replace(/\bpass\b/gi, 'sweet carpet pass')
    .replace(/\btackle\b/gi, 'solid Warri tackle')
    .replace(/\bfoul\b/gi, 'bad tackle, wahala dey')
    .replace(/\breferee\b/gi, 'oga referee')
    .replace(/\bhalf time\b/gi, 'first 45 mins don finish, make players go cool body')
    .replace(/\bfull time\b/gi, 'match don end kpatakpata, record don lock');
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
    const speechText = isPidgin ? warriTransliterate(text) : text.replace(/minute\s*\d+:\s*/gi, '').replace(/\b\d+[':]\s*/gi, '').trim();

    if (!speechText) {
      if (opts.onEnd) opts.onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(speechText);
    const voices = window.speechSynthesis.getVoices();

    if (isPidgin) {
      // 🇳🇬 AUTHENTIC ENERGETIC WARRI STREET COMMENTATOR ACCENT
      utterance.rate = tone === 'goal' ? 1.12 : 1.06; // Lively Warri flow
      utterance.pitch = tone === 'goal' ? 1.08 : 1.02; // Warm masculine street timber
      utterance.volume = 1.0;

      if (voices && voices.length > 0) {
        // Priority 1: Official Nigerian English & Pidgin Voices
        const naijaVoice = voices.find(v => {
          const name = v.name.toLowerCase();
          const lang = (v.lang || '').toLowerCase();
          return (
            name.includes('nigeria') ||
            name.includes('ezinne') ||
            name.includes('blessing') ||
            name.includes('abeo') ||
            name.includes('chukwuma') ||
            lang === 'en-ng' ||
            lang === 'pcm' ||
            lang === 'pcm-ng' ||
            lang === 'en_ng'
          );
        }) || voices.find(v => {
          // Priority 2: British/African English Commentator
          const name = v.name.toLowerCase();
          const lang = (v.lang || '').toLowerCase();
          return (
            (lang.includes('en-za') || lang.includes('en-gb') || lang.includes('en-us') || lang.startsWith('en')) &&
            (name.includes('male') || name.includes('george') || name.includes('david') || name.includes('daniel') || name.includes('oliver'))
          );
        }) || voices.find(v => v.lang.startsWith('en')) || voices[0];

        if (naijaVoice) utterance.voice = naijaVoice;
      }
    } else {
      // 🇬🇧 STANDARD ENGLISH COMMENTATOR
      utterance.rate = tone === 'goal' ? 1.05 : 0.98;
      utterance.pitch = tone === 'goal' ? 1.10 : 0.96;
      utterance.volume = 1.0;

      if (voices && voices.length > 0) {
        const englishVoice = voices.find(v => 
          (v.lang.includes('en-GB') || v.lang.includes('en-US')) &&
          (v.name.toLowerCase().includes('george') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('male'))
        ) || voices.find(v => v.lang.includes('en-GB')) || voices.find(v => v.lang.startsWith('en')) || voices[0];

        if (englishVoice) utterance.voice = englishVoice;
      }
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

    const estimatedDurationMs = Math.max(2500, (speechText.split(' ').length / 2.5) * 1000 + 1500);
    speechFallbackTimer = setTimeout(finish, estimatedDurationMs);

    isCurrentlySpeaking = true;
    window.speechSynthesis.speak(utterance);

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  } catch (err) {
    isCurrentlySpeaking = false;
    if (opts.onEnd) opts.onEnd();
  }
}
