let hasUserTriggeredSpeech = false;
export function allowSpeechOnUserGesture() { hasUserTriggeredSpeech = true; }
/**
 * NAIJA VIBE — NIGERIAN ACCENT VOICE ENGINE (en-NG)
 * Signature commentator voice. 100% free, works offline via browser SpeechSynthesis.
 *
 * Strategy:
 *  1. Prefer any installed Nigerian English voice (en-NG prefix, or name contains
 *     "Nigeria", "Nigerian", "Naija", "Chinedu", "Ezinne", "Onyeka").
 *  2. Fallback: en-US/en-GB voice + accent transliteration (dey, e don, abeg, oya)
 *     so lines read authentically Naija without a native voice pack.
 */
export type NaijaTone = "normal" | "hyped" | "shock" | "calm";

export function naijaTransliterate(text: string): string {
  let t = text.trim()
    .replace(/\bit is\b/gi, "e be")
    .replace(/\bis going to\b/gi, "dey go")
    .replace(/\bgoing to\b/gi, "dey go")
    .replace(/\bhave to\b/gi, "fit")
    .replace(/\bis not\b/gi, "no be")
    .replace(/\bis\b/gi, "dey")
    .replace(/\bare\b/gi, "dey")
    .replace(/\bdon't\b/gi, "no")
    .replace(/\bcan't\b/gi, "no fit")
    .replace(/\bwant to\b/gi, "won")
    .replace(/\bthem\b/gi, "dem")
    .replace(/\bvery\b/gi, "well well")
    .replace(/\bnow\b/gi, "now now")
    .replace(/\bwhat\b/gi, "wetin")
    .replace(/\bwhere\b/gi, "wia")
    .replace(/\bplease\b/gi, "abeg")
    .replace(/\bhurry\b/gi, "make you move")
    .replace(/\bwow\b/gi, "Omo!")
    .replace(/\bamazing\b/gi, "fantastic")
    .replace(/\bincredible\b/gi, "mad")
    .replace(/\bfriend\b/gi, "bro")
    .replace(/\bfriends\b/gi, "our people")
    .replace(/\bfootball\b/gi, "footie");
  return t;
}

function pickNaijaVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const lower = (s: string) => s.toLowerCase();
  const isNaija = (v: SpeechSynthesisVoice) =>
    lower(v.lang).startsWith("en-ng") ||
    /nigeria|nigerian|naija|chinedu|ezinne|onyeka|tunde|ada/.test(lower(v.name));
  return voices.find(isNaija) ?? null;
}

function pickNeutralVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const lower = (s: string) => s.toLowerCase();
  const isEn = (v: SpeechSynthesisVoice) => lower(v.lang).startsWith("en-");
  // Prefer non-US/non-UK English first (closer to Nigerian accent), else any English.
  return (
    voices.find((v) => isEn(v) && !lower(v.lang).startsWith("en-us") && !lower(v.lang).startsWith("en-gb")) ??
    voices.find(isEn) ??
    null
  );
}

export interface NaijaSpeakOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  onEnd?: () => void;
}

/**
 * Speaks the given line in the Naija Vibe voice.
 * @returns a function to cancel this utterance, or null if speech is unavailable.
 */
export function speakNaija(
  text: string,
  tone: NaijaTone = "normal",
  opts: NaijaSpeakOptions = {}
): (() => void) | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;

  const synth = window.speechSynthesis;
  const voiceList = synth.getVoices();
  const native = pickNaijaVoice(voiceList);
  const fallback = pickNeutralVoice(voiceList);

  const line = native ? text : naijaTransliterate(text);
  const utterance = new SpeechSynthesisUtterance(line);
  utterance.voice = native ?? fallback ?? null;

  const rateFor: Record<NaijaTone, number> = { normal: 0.98, hyped: 1.18, shock: 1.3, calm: 0.85 };
  const pitchFor: Record<NaijaTone, number> = { normal: 1.0, hyped: 1.15, shock: 1.25, calm: 0.9 };

  utterance.rate = opts.rate ?? rateFor[tone];
  utterance.pitch = opts.pitch ?? pitchFor[tone];
  utterance.volume = opts.volume ?? 0.95;
  if (opts.onEnd) utterance.onend = opts.onEnd;

  // Chrome needs this kick to reliably start speaking after an async voice load.
  synth.cancel();
  if (hasUserTriggeredSpeech) { synth.speak(utterance); }

  return () => {
    try {
      synth.cancel();
    } catch {
      /* noop */
    }
  };
}

/** Warm-up: trigger voice list load so speakNaija has voices ready on first tap. */
export function primeNaijaVoices(): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  try {
    synth.getVoices();
    const onChanged = () => {
      synth.getVoices();
      synth.removeEventListener?.("voiceschanged", onChanged);
    };
    synth.addEventListener?.("voiceschanged", onChanged);
  } catch {
    /* noop */
  }
}

export function naijaSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** Pick a hype line + tone for a given match moment. */
export function naijaMomentLine(
  moment: "goal" | "kickoff" | "redcard" | "yellowcard" | "sub" | "fulltime" | "halftime",
  home: string,
  away: string,
  scorer?: string
): { line: string; tone: NaijaTone } {
  const lines: Record<string, { line: string; tone: NaijaTone }> = {
    goal: {
      line: `${scorer ?? "Goal"}! GOAL for ${home}! Omo! ${home} don score ${away}! Wetin a goal so!`,
      tone: "hyped",
    },
    kickoff: { line: `${home} vs ${away}! Oya, we dey go! Kickoff!`, tone: "calm" },
    redcard: { line: `Omo! Red card! ${home} dey play with 10 men now!`, tone: "shock" },
    yellowcard: { line: `Yellow card for ${away}, referee don book am!`, tone: "normal" },
    sub: { line: `Substitution for ${home}! Fresh legs dey enter now!`, tone: "normal" },
    fulltime: { line: `Full time! ${home} vs ${away}! Na God o! Match don finish!`, tone: "calm" },
    halftime: { line: `Half time for ${home} vs ${away}. Abeg rest well well, more action dey come!`, tone: "calm" },
  };
  return lines[moment] ?? { line: `${home} vs ${away} wey dey crack!`, tone: "normal" };
}

export default speakNaija;
