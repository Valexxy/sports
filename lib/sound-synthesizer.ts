/**
 * High-Fidelity Open-Source Soundscape & Audio Effects Engine
 * Uses royalty-free open-source audio streams with zero-latency Web Audio API synthesizers.
 */

// Open-source royalty-free audio URLs from standard reliable CDNs
const AUDIO_SOURCES = {
  COIN_CASHOUT: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3', // Win Coins
  STADIUM_ROAR: 'https://assets.mixkit.co/active_storage/sfx/2180/2180-preview.mp3', // Crowd Cheer
  WHISTLE: 'https://assets.mixkit.co/active_storage/sfx/2185/2185-preview.mp3', // Referee Whistle
  NOTIFICATION: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3', // UI Ding/Gbam
  LOG_DRUM: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Deep Thump
};

export class SoundSynthesizer {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;
  private audioCache: Record<string, HTMLAudioElement> = {};

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.isMuted = localStorage.getItem('mivaj_sound_muted') === 'true';
        // Pre-cache open-source audio elements for zero-lag instant playback
        Object.entries(AUDIO_SOURCES).forEach(([key, url]) => {
          try {
            const audio = new Audio(url);
            audio.preload = 'auto';
            this.audioCache[key] = audio;
          } catch {}
        });
      } catch {}
    }
  }

  private initAudioCtx(): AudioContext | null {
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

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('mivaj_sound_muted', this.isMuted.toString());
      } catch {}
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  private playCachedOrFallback(key: keyof typeof AUDIO_SOURCES, fallbackFn: () => void): void {
    if (this.isMuted) return;

    try {
      const cached = this.audioCache[key];
      if (cached) {
        cached.currentTime = 0;
        cached.play().catch(() => fallbackFn());
        return;
      }
    } catch {}

    fallbackFn();
  }

  // 1. Coin Cashout (Open-Source Audio + Synth Fallback)
  public playCoinCashout(): void {
    this.playCachedOrFallback('COIN_CASHOUT', () => {
      const ctx = this.initAudioCtx();
      if (!ctx) return;
      const t = ctx.currentTime;
      [987.77, 1318.51, 1567.98, 2093.0].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + i * 0.06);
        gain.gain.setValueAtTime(0.3, t + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.06 + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + i * 0.06);
        osc.stop(t + i * 0.06 + 0.15);
      });
    });
  }

  // 2. Crowd Roar / Goal (Open-Source Audio + Synth Fallback)
  public playCrowdRoar(): void {
    this.playCachedOrFallback('STADIUM_ROAR', () => {
      const ctx = this.initAudioCtx();
      if (!ctx) return;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, t);
      osc.frequency.linearRampToValueAtTime(220, t + 0.4);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.6);
    });
  }

  // 3. Add Pick / UI Click Chime
  public playAddPickSound(): void {
    this.playCachedOrFallback('NOTIFICATION', () => {
      const ctx = this.initAudioCtx();
      if (!ctx) return;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, t);
      osc.frequency.exponentialRampToValueAtTime(880.0, t + 0.08);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.1);
    });
  }
}

export const stadiumAudio = new SoundSynthesizer();
