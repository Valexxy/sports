'use client';

/**
 * HIGH-FIDELITY AFRICAN & NIGERIAN ACOUSTIC SOUND ENGINE
 * Authentic Soundscape:
 * - Amapiano Deep Bass Log Drum (Pitched sine kick with sub-bass saturation)
 * - Nigerian Talking Drum / Gangan (Pitch-bending membrane mallet)
 * - Afro Shekere Gourd Shaker (High-frequency beaded percussion)
 * - Stadium Vuvuzela Horn (Harmonic brass roar)
 * - Dual Agogo Chime Bell (Traditional West African metallic bell)
 * - Nigerian Referee Trill Whistle (Double frequency stadium blast)
 */

export class SoundSynthesizer {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.isMuted = localStorage.getItem('aurascore_sound_muted') === 'true';
      } catch {}
    }
  }

  public initAudioCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public enableOnUserClick(): void {
    this.initAudioCtx();
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('aurascore_sound_muted', this.isMuted.toString());
      } catch {}
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // 1. 🥁 Amapiano / Afro Deep Log Drum (Punchy Sub-Bass)
  public playAfroLogDrum(): void {
    if (this.isMuted) return;
    const ctx = this.initAudioCtx();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Pitch sweep from 120Hz down to 42Hz for that authentic Amapiano bass knock
      osc.type = 'sine';
      osc.frequency.setValueAtTime(125, t);
      osc.frequency.exponentialRampToValueAtTime(42, t + 0.18);

      gain.gain.setValueAtTime(0.45, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.3);
    } catch {}
  }

  // 2. 🪘 Nigerian Talking Drum (Gangan Pitch-Bending Resonator)
  public playTalkingDrum(): void {
    if (this.isMuted) return;
    const ctx = this.initAudioCtx();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Realistic talking drum pitch squeeze: 240Hz -> 380Hz -> 210Hz
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, t);
      osc.frequency.linearRampToValueAtTime(390, t + 0.08);
      osc.frequency.exponentialRampToValueAtTime(200, t + 0.25);

      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.3);
    } catch {}
  }

  // 3. 🎺 Stadium Vuvuzela / Horn of Africa (Goal & Live Match Horn)
  public playVuvuzela(): void {
    if (this.isMuted) return;
    const ctx = this.initAudioCtx();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      // Multi-harmonic horn synthesis (Bb3 ~233Hz + harmonics)
      const freqs = [233.08, 466.16, 699.24, 932.32];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx === 0 ? 'sawtooth' : 'sine';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.linearRampToValueAtTime(freq * 1.03, t + 0.15);
        osc.frequency.linearRampToValueAtTime(freq, t + 0.45);

        const vol = (0.28 / (idx + 1));
        gain.gain.setValueAtTime(vol, t);
        gain.gain.linearRampToValueAtTime(vol * 1.2, t + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.6);
      });
    } catch {}
  }

  // 4. 🪇 Afro Shekere Shaker Roll (Tab & Navigation Click)
  public playShekere(): void {
    if (this.isMuted) return;
    const ctx = this.initAudioCtx();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      // Filtered high noise burst for crisp beaded gourd sound
      const bufferSize = ctx.sampleRate * 0.08;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(4200, t);
      filter.Q.setValueAtTime(3.0, t);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start(t);
    } catch {}
  }

  // 5. 🔔 Naija Gbam Alert Tone (Instant Notification)
  public playNaijaGbam(): void {
    if (this.isMuted) return;
    const ctx = this.initAudioCtx();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(784.0, t); // G5
      osc.frequency.exponentialRampToValueAtTime(523.25, t + 0.12); // C5

      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.25);
    } catch {}
  }

  // 6. 🏆 Agogo Bell Double Strike (Ticket Cashout / Won)
  public playCoinCashout(): void {
    if (this.isMuted) return;
    const ctx = this.initAudioCtx();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      // Traditional Low & High Agogo Bells (580Hz & 870Hz)
      [587.33, 880.0, 1174.66].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + idx * 0.08);

        gain.gain.setValueAtTime(0.3, t + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t + idx * 0.08);
        osc.stop(t + idx * 0.08 + 0.22);
      });
    } catch {}
  }

  // 7. ⚽ Crowd Roar / Goal Blast
  public playCrowdRoar(): void {
    this.playVuvuzela();
    this.playAfroLogDrum();
  }

  // Aliases for unified UI interactions
  public playTabClickSound(): void {
    this.playShekere();
  }

  public playBookmarkSound(): void {
    this.playTalkingDrum();
  }

  public playAddPickSound(): void {
    this.playAfroLogDrum();
  }
}

export const stadiumAudio = new SoundSynthesizer();
