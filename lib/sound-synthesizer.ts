'use client';

/**
 * MIVAJ AFRICAN & NIGERIAN STADIUM AUDIO SYNTHESIZER
 * Real Web Audio procedural synthesis of Talking Drums (Gangan), Vuvuzela Fanfares,
 * Afrobeat Kalimba Chimes, Referee Whistles & Naija Stadium Crowd Energy.
 */
class StadiumAudioEngine {
  private audioCtx: AudioContext | null = null;
  public isMuted: boolean = false;
  public hasUserInteracted: boolean = false;

  public enableOnUserClick() {
    this.hasUserInteracted = true;
    this.init();
    this.resume();
  }

  private init() {
    if (typeof window !== 'undefined' && !this.audioCtx) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      if (Ctx) this.audioCtx = new Ctx();
    }
  }

  private resume() {
    if (this.audioCtx?.state === 'suspended') this.audioCtx.resume();
  }

  private tone(freq: number, type: OscillatorType, startAt: number, duration: number, peakGain: number) {
    try {
      if (!this.audioCtx || this.audioCtx.state === 'closed') return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startAt);
      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.linearRampToValueAtTime(peakGain, startAt + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(startAt);
      osc.stop(startAt + duration + 0.05);
    } catch {}
  }

  /** 1. AUTHENTIC AFRICAN TALKING DRUM (Gangan) — Pitch-Modulated Polyrhythm */
  public playTalkingDrumBeat() {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;

    // 3 Poly-rhythmic Talking Drum strikes with pitch tension squeeze
    const beats = [
      { t: 0.0, startF: 110, endF: 165, dur: 0.18, vol: 0.28 },
      { t: 0.12, startF: 140, endF: 210, dur: 0.15, vol: 0.24 },
      { t: 0.26, startF: 95, endF: 140, dur: 0.28, vol: 0.32 },
    ];

    beats.forEach(b => {
      const osc = this.audioCtx!.createOscillator();
      const gain = this.audioCtx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(b.startF, now + b.t);
      osc.frequency.exponentialRampToValueAtTime(b.endF, now + b.t + b.dur * 0.7);
      gain.gain.setValueAtTime(0.001, now + b.t);
      gain.gain.linearRampToValueAtTime(b.vol, now + b.t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + b.t + b.dur);
      osc.connect(gain);
      gain.connect(this.audioCtx!.destination);
      osc.start(now + b.t);
      osc.stop(now + b.t + b.dur + 0.05);
    });
  }

  /** 2. NAIJA VUVUZELA STADIUM FANFARE — Multi-Harmonic Brass Blast */
  public playVuvuzelaHorn() {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;

    const harmonics = [233.08, 466.16, 699.24, 932.32]; // Bb3 horn fundamental
    harmonics.forEach((f, idx) => {
      const osc = this.audioCtx!.createOscillator();
      const gain = this.audioCtx!.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f + (Math.random() * 2 - 1), now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08 / (idx + 1), now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      osc.connect(gain);
      gain.connect(this.audioCtx!.destination);
      osc.start(now);
      osc.stop(now + 0.95);
    });
  }

  /** 3. AFROBEAT KALIMBA VICTORY CHIME — Euphoric Arpeggio on Slips & Wins */
  public playAfrobeatVictory() {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;

    // African pentatonic scale arpeggio (C5, D5, E5, G5, A5, C6)
    const scale = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];
    scale.forEach((freq, idx) => {
      this.tone(freq, 'sine', now + idx * 0.07, 0.45, 0.14);
      this.tone(freq * 2, 'triangle', now + idx * 0.07, 0.25, 0.06);
    });
    this.playTalkingDrumBeat();
  }

  /** 4. PAYSTACK NAIRA CASHOUT JINGLE — Metallic Coin Cascade */
  public playCoinCashout() {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;

    [1318.51, 1567.98, 2093.0, 2637.02, 3135.96].forEach((f, i) => {
      this.tone(f, 'sine', now + i * 0.05, 0.35, 0.12);
    });
  }

  /** 5. GOAL CELEBRATION — Stadium Crowd + Vuvuzela + Talking Drum */
  public playGoalCelebration() {
    if (this.isMuted) return;
    this.playVuvuzelaHorn();
    this.playTalkingDrumBeat();
    this.playCrowdRoar();
  }

  /** 6. CROWD STADIUM ROAR */
  public playCrowdRoar() {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;

    const noiseBuffer = this.audioCtx.createBuffer(1, this.audioCtx.sampleRate * 1.5, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, now);
    filter.Q.setValueAtTime(1.8, now);

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + 1.55);
  }

  public playSuccessSound() { this.playAfrobeatVictory(); }
  public playAddPickSound() { this.playTalkingDrumBeat(); }
  public playTabClickSound() {
    this.init(); this.resume();
    if (this.audioCtx) this.tone(440, 'sine', this.audioCtx.currentTime, 0.08, 0.08);
  }
}

export const stadiumAudio = new StadiumAudioEngine();
