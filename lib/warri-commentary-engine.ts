import { pitchMixer } from '../services/audio/PitchMixer';
import { StemPlayerService, MatchEventType } from '../services/audio/StemPlayer';

// Conversational Time Translation (Never read raw numerical minute numbers)
export function formatConversationalMatchTime(minute: string | number): string {
  const min = typeof minute === 'string' ? parseInt(minute.replace(/[^0-9]/g, ''), 10) || 0 : minute;
  if (min <= 5) return 'Right off the opening whistle';
  if (min <= 20) return 'Early in the first half';
  if (min <= 40) return 'Approaching the halftime break';
  if (min <= 45) return 'Just before the halftime whistle';
  if (min <= 55) return 'Fresh out of the dressing room';
  if (min <= 75) return 'Deep into the second half';
  if (min <= 88) return 'In the dying minutes of regular time';
  return 'Deep in stoppage time at the death';
}

export interface StructuredCommentaryPayload {
  commentary_text: string;
  emotion_intensity: 'LOW' | 'MEDIUM' | 'HIGH' | 'MAX_AURA';
  match_event_type: MatchEventType;
}

/**
 * Pure Warri-Pidgin AI Audio, Commentary & Haptics Engine
 * Delivers ultra-fast, high-tempo street-smart Warri cruise (zero slow grammar),
 * backed by authentic Afro-centric soundscapes (Gbam woodblock + whistle, Amapiano log-drum, talking drum).
 */

export class WarriCommentaryEngine {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.isMuted = localStorage.getItem('mivaj_audio_muted') === 'true';
      } catch {}
    }
  }

  private initCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('mivaj_audio_muted', this.isMuted.toString());
      } catch {}
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // 1. "Gbam!" Woodblock Strike + Street Referee Whistle
  public playGbamChime(): void {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const t = ctx.currentTime;

    // Woodblock Attack (High-Q Bandpass Resonance)
    const blockOsc = ctx.createOscillator();
    const blockGain = ctx.createGain();
    blockOsc.type = 'sine';
    blockOsc.frequency.setValueAtTime(880, t);
    blockOsc.frequency.exponentialRampToValueAtTime(320, t + 0.08);

    blockGain.gain.setValueAtTime(0.7, t);
    blockGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    blockOsc.connect(blockGain);
    blockGain.connect(ctx.destination);
    blockOsc.start(t);
    blockOsc.stop(t + 0.12);

    // Street Referee Whistle Accent
    const whistleOsc = ctx.createOscillator();
    const whistleGain = ctx.createGain();
    whistleOsc.type = 'triangle';
    whistleOsc.frequency.setValueAtTime(2400, t + 0.04);
    whistleOsc.frequency.linearRampToValueAtTime(2800, t + 0.14);

    whistleGain.gain.setValueAtTime(0.4, t + 0.04);
    whistleGain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    whistleOsc.connect(whistleGain);
    whistleGain.connect(ctx.destination);
    whistleOsc.start(t + 0.04);
    whistleOsc.stop(t + 0.22);

    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([80, 40, 80]); // Double win pulse
    }
  }

  // 2. Amapiano / Afrobeat Log-Drum Alert (Deep Sub-Bass Thump)
  public playLogDrum(): void {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.25);

    gain.gain.setValueAtTime(0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.35);

    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  }

  // 3. Talking Drum (Gangan) Downward Pitch Descent (Slip Cut / Loss)
  public playTalkingDrumDown(): void {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.35);

    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.4);

    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([150]);
    }
  }

  // 4. Ultra-Fast High-Tempo Warri Speech Synthesis Trigger
  public speakWarri(text: string): void {
    if (this.isMuted) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // Stop prior audio
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.25; // High tempo, snappy delivery (no slow grammar)
      utterance.pitch = 0.92;
      utterance.lang = 'en-NG'; // Nigerian accent if supported
      pitchMixer.duckAmbient();
      utterance.onend = () => { pitchMixer.restoreAmbient(); };
      utterance.onerror = () => { pitchMixer.restoreAmbient(); };
      window.speechSynthesis.speak(utterance);
    } catch {}
  }

  // Warri Banter Voice Actions
  public voiceWin(): void {
    this.playGbamChime();
    this.speakWarri('E don burst! You think say na play play? Carry your money go enjoy!');
  }

  public voiceLoss(): void {
    this.playTalkingDrumDown();
    this.speakWarri('Omo, wahala gas o! But no shaking, na man you be, enter back to the trenches.');
  }

  public voiceSlipDrop(tipster: string): void {
    this.playLogDrum();
    this.speakWarri(tipster + ' just drop heavy metal! Make you run go copy am before market close.');
  }

  public voiceChallenge(tipster: string): void {
    this.playLogDrum();
    this.speakWarri('Wahala! You wan challenge ' + tipster + '? Match am if your liver reach!');
  }
}

export const warriAudio = new WarriCommentaryEngine();
