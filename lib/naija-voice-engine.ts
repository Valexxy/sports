'use client';

/**
 * AUTHENTIC LIVE & HISTORICAL MATCH FEMALE NIGERIAN & ENGLISH COMMENTARY ENGINE
 * - Dedicated Female Naija Warri Voice Engine (Ezinne / Blessing / Nigerian Pidgin / High-Pitch Warm Timbre)
 * - English Commentator Voice Engine
 * - Pure natural spoken commentary (No robotic "Minute XX" time callouts)
 */

let isCurrentlySpeaking = false;
let speechFallbackTimer: NodeJS.Timeout | null = null;

export function warriTransliterate(text: string): string {
  // Strip any accidental minute callouts
  const cleaned = text.replace(/minute\s*\d+:\s*/gi, '').replace(/\b\d+[':]\s*/gi, '');
  return cleaned.trim()
    .replace(/\bWelcome to the live match o!\b/gi, 'Waffi people, welcome to the live match o! Correct banker match!')
    .replace(/\bGoal\b/gi, 'Gooooooal o! Net don scatter kpatakpata!')
    .replace(/\bscored\b/gi, 'don tear net')
    .replace(/\byellow card\b/gi, 'yellow card! Referee say make you behave yourself')
    .replace(/\bred card\b/gi, 'red card straight! Go take your bath')
    .replace(/\bshot\b/gi, 'thunder strike')
    .replace(/\bsaved\b/gi, 'jump like cat parry am')
    .replace(/\bpass\b/gi, 'correct carpet pass')
    .replace(/\btackle\b/gi, 'solid Warri tackle')
    .replace(/\bfoul\b/gi, 'bad tackle')
    .replace(/\breferee\b/gi, 'referee oga')
    .replace(/\bhalf time\b/gi, 'first 45 mins don finish, make players go drink pure water')
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
      // 👩 AUTHENTIC FEMALE NAIJA WARRI VOICE TUNING
      utterance.rate = tone === 'goal' ? 1.06 : 1.02; // Lively Warri flow
      utterance.pitch = tone === 'goal' ? 1.25 : 1.20; // Distinct bright warm female pitch
      utterance.volume = 1.0;

      if (voices && voices.length > 0) {
        // Priority 1: Official Nigerian Female Voices (Microsoft Ezinne / Blessing / Google Nigerian)
        const femaleNaijaVoice = voices.find(v => {
          const name = v.name.toLowerCase();
          const lang = (v.lang || '').toLowerCase();
          return (
            name.includes('ezinne') ||
            name.includes('blessing') ||
            name.includes('nigeria') ||
            lang === 'en-ng' ||
            lang === 'pcm' ||
            lang === 'en_ng'
          );
        }) || voices.find(v => {
          // Priority 2: Natural Female voices with African/British inflection
          const name = v.name.toLowerCase();
          const lang = (v.lang || '').toLowerCase();
          return (
            (name.includes('female') || name.includes('zira') || name.includes('samantha') || name.includes('sonia') || name.includes('victoria') || name.includes('karen') || name.includes('moira') || name.includes('natural')) &&
            (lang.includes('en-za') || lang.includes('en-gb') || lang.includes('en-us') || lang.startsWith('en'))
          );
        }) || voices.find(v => v.lang.startsWith('en')) || voices[0];

        if (femaleNaijaVoice) utterance.voice = femaleNaijaVoice;
      }
    } else {
      // 🇬🇧 STANDARD ENGLISH COMMENTATOR VOICE TUNING (Swapped to previous voice)
      utterance.rate = tone === 'goal' ? 1.05 : 0.98;
      utterance.pitch = tone === 'goal' ? 1.10 : 0.96; // Standard commentator pitch
      utterance.volume = 1.0;

      if (voices && voices.length > 0) {
        const englishVoice = voices.find(v => 
          (v.lang.includes('en-GB') || v.lang.includes('en-US')) &&
          (v.name.toLowerCase().includes('george') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('male') || !v.name.toLowerCase().includes('female'))
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

    // Safety fallback timer
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
