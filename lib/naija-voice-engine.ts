'use client';

/**
 * AUTHENTIC MALE WARRI & NIGERIAN PIDGIN COMMENTARY AUDIO ENGINE
 * - Pure MALE Nigerian Street Commentator (Masculine, Deep, High-Energy)
 * - High-Tempo Fast Delivery (Rate: 1.22, Pitch: 0.92 - Never Slow)
 * - Genuine Warri Street Pidgin & Naija Football Culture Phrasing
 */

let isCurrentlySpeaking = false;
let speechFallbackTimer: NodeJS.Timeout | null = null;

const FEMALE_VOICE_NAMES = [
  'ezinne', 'blessing', 'female', 'zira', 'samantha', 
  'karen', 'victoria', 'moira', 'sonia', 'aria', 'jenny', 
  'hazel', 'susan', 'catherina', 'linda', 'clara', 'eva'
];

export function warriTransliterate(text: string): string {
  if (!text) return '';
  const cleaned = text.replace(/minute\s*\d+:\s*/gi, '').replace(/\b\d+[':]\s*/gi, '');
  return cleaned.trim()
    .replace(/\bWelcome to the live match o!\b/gi, 'Waffi people I hail una! Welcome to this heavy banker match! Eye dey red for pitch!')
    .replace(/\bGoal\b/gi, 'Gooooooal o! Net don scatter kpatakpata! Odogwu goal!')
    .replace(/\bscored\b/gi, 'fire thunder goal enter net')
    .replace(/\byellow card\b/gi, 'yellow card! Referee say make you calm your body sharp sharp')
    .replace(/\bred card\b/gi, 'red card straight! Pack your boot go house')
    .replace(/\bshot\b/gi, 'heavy bullet strike from 30 yards')
    .replace(/\bsaved\b/gi, 'goalkeeper fly like bird parry am')
    .replace(/\bpass\b/gi, 'sweet carpet pass')
    .replace(/\btackle\b/gi, 'solid Warri tackle')
    .replace(/\bfoul\b/gi, 'wicked foul, wahala dey')
    .replace(/\breferee\b/gi, 'oga referee')
    .replace(/\bhalf time\b/gi, 'first 45 mins don finish, make players go cool body drink pure water')
    .replace(/\bfull time\b/gi, 'match don end kpatakpata, record don lock, congratulations to who carry banker');
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
      // 🇳🇬 PURE MALE HIGH-TEMPO WARRI NIGERIAN VOICE TUNING (FAST & ENERGETIC)
      utterance.rate = tone === 'goal' ? 1.28 : 1.22; // High-tempo, fast, energetic street delivery (never slow)
      utterance.pitch = tone === 'goal' ? 0.96 : 0.90; // Deep masculine resonant African timbre
      utterance.volume = 1.0;

      if (voices && voices.length > 0) {
        // Filter OUT all female voices strictly
        const maleVoices = voices.filter(v => {
          const name = v.name.toLowerCase();
          return !FEMALE_VOICE_NAMES.some(fn => name.includes(fn));
        });

        // Priority 1: Official Male Nigerian / African English / Pidgin Voices
        const maleNaijaVoice = maleVoices.find(v => {
          const name = v.name.toLowerCase();
          const lang = (v.lang || '').toLowerCase();
          return (
            name.includes('chukwuma') ||
            name.includes('abeo') ||
            name.includes('nigeria') ||
            lang === 'en-ng' ||
            lang === 'pcm' ||
            lang === 'pcm-ng' ||
            lang === 'en_ng'
          );
        }) || maleVoices.find(v => {
          // Priority 2: Deep Male British/South African English Commentator
          const name = v.name.toLowerCase();
          const lang = (v.lang || '').toLowerCase();
          return (
            (lang.includes('en-za') || lang.includes('en-gb') || lang.includes('en-us') || lang.startsWith('en')) &&
            (name.includes('male') || name.includes('george') || name.includes('david') || name.includes('daniel') || name.includes('oliver') || name.includes('ryan') || name.includes('guy'))
          );
        }) || maleVoices.find(v => v.lang.startsWith('en')) || voices[0];

        if (maleNaijaVoice) utterance.voice = maleNaijaVoice;
      }
    } else {
      // 🇬🇧 STANDARD MALE ENGLISH COMMENTATOR
      utterance.rate = tone === 'goal' ? 1.15 : 1.05;
      utterance.pitch = tone === 'goal' ? 1.02 : 0.94;
      utterance.volume = 1.0;

      if (voices && voices.length > 0) {
        const maleVoices = voices.filter(v => {
          const name = v.name.toLowerCase();
          return !FEMALE_VOICE_NAMES.some(fn => name.includes(fn));
        });

        const englishVoice = maleVoices.find(v => 
          (v.lang.includes('en-GB') || v.lang.includes('en-US')) &&
          (v.name.toLowerCase().includes('george') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('male'))
        ) || maleVoices.find(v => v.lang.includes('en-GB')) || maleVoices.find(v => v.lang.startsWith('en')) || voices[0];

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

    // High tempo duration estimate (faster word rate)
    const estimatedDurationMs = Math.max(2000, (speechText.split(' ').length / 3.2) * 1000 + 1200);
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
