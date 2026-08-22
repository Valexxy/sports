'use client';

/**
 * STADIUM AUDIO ENGINE — Nigerian Accent + Web Audio API
 * Each match event has a DISTINCT synthesized sound profile.
 * Uses Web Speech API for Pidgin/Nigerian voice; Web Audio for SFX.
 */
class StadiumAudioEngine {
  private audioCtx: AudioContext | null = null;
  public isMuted: boolean = false;

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
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startAt);
    gain.gain.setValueAtTime(0.001, startAt);
    gain.gain.linearRampToValueAtTime(peakGain, startAt + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(startAt);
    osc.stop(startAt + duration + 0.05);
  }

  /** GOAL — Massive crowd roar + rising cheer + Pidgin TTS */
  public playGoalCelebration() {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    // Stadium cheer chord (C-E-G-C)
    [261.63, 329.63, 392, 523.25, 659.25, 783.99].forEach((f, i) => {
      this.tone(f, 'sine', now + i * 0.04, 1.2, 0.18);
    });
    // Crowd rumble sweep
    const lfo = this.audioCtx.createOscillator();
    const lGain = this.audioCtx.createGain();
    lfo.type = 'sawtooth'; lfo.frequency.setValueAtTime(80, now);
    lfo.frequency.exponentialRampToValueAtTime(200, now + 0.8);
    lGain.gain.setValueAtTime(0.08, now); lGain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
    lfo.connect(lGain); lGain.connect(this.audioCtx.destination);
    lfo.start(now); lfo.stop(now + 1.1);
    // Pidgin TTS
    this.speakPidgin('GOLAZO! E don enter! Na goal be this o!');
    if ('vibrate' in navigator) navigator.vibrate([200, 100, 200, 100, 300]);
  }

  /** WHISTLE — Referee: kickoff / halftime / fulltime */
  public playWhistle(type: 'kickoff' | 'halftime' | 'fulltime' = 'kickoff') {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    if (type === 'fulltime') {
      // Triple whistle
      [0, 0.4, 0.8].forEach(offset => {
        const osc = this.audioCtx!.createOscillator();
        const g = this.audioCtx!.createGain();
        osc.type = 'sine'; osc.frequency.setValueAtTime(3000, now + offset);
        osc.frequency.linearRampToValueAtTime(2600, now + offset + 0.25);
        g.gain.setValueAtTime(0.001, now + offset);
        g.gain.linearRampToValueAtTime(0.3, now + offset + 0.03);
        g.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.28);
        osc.connect(g); g.connect(this.audioCtx!.destination);
        osc.start(now + offset); osc.stop(now + offset + 0.3);
      });
      this.speakPidgin('Fiiiiull time! E don finish! Match over!');
    } else if (type === 'halftime') {
      this.tone(2800, 'sine', now, 0.5, 0.25);
      this.tone(2400, 'sine', now + 0.55, 0.5, 0.25);
      this.speakPidgin('Half time! Rest small!');
    } else {
      this.tone(2900, 'sine', now, 0.4, 0.28);
      this.speakPidgin('And we kick off! Match don start!');
    }
    if ('vibrate' in navigator) navigator.vibrate(type === 'fulltime' ? [100, 50, 100, 50, 100] : [80]);
  }

  /** YELLOW CARD — Sharp buzz warning tone */
  public playYellowCard() {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    this.tone(220, 'sawtooth', now, 0.3, 0.15);
    this.tone(180, 'square', now + 0.15, 0.25, 0.1);
    this.speakPidgin('Caution! Yellow card! The referee don show am card!');
  }

  /** RED CARD — Low aggressive buzz */
  public playRedCard() {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    this.tone(150, 'square', now, 0.4, 0.2);
    this.tone(120, 'sawtooth', now + 0.1, 0.5, 0.18);
    this.speakPidgin('Wahala! Red card! E don comot from the match!');
    if ('vibrate' in navigator) navigator.vibrate([300, 100, 300]);
  }

  /** SUBSTITUTION — Short upbeat swap ding */
  public playSubstitution() {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    this.tone(880, 'sine', now, 0.15, 0.12);
    this.tone(660, 'sine', now + 0.18, 0.15, 0.10);
    this.tone(880, 'sine', now + 0.36, 0.15, 0.08);
  }

  /** CORNER — Short drum roll feel */
  public playCorner() {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    [0, 0.08, 0.16, 0.24].forEach(t => this.tone(300 + t * 400, 'triangle', now + t, 0.1, 0.08));
  }

  /** SUCCESS — Pick added, wishes, etc. */
  public playSuccessSound() {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    this.tone(600, 'sine', now, 0.1, 0.1);
    this.tone(900, 'sine', now + 0.12, 0.15, 0.12);
    this.tone(1200, 'sine', now + 0.28, 0.2, 0.1);
  }

  /** ERROR — Failed action */
  public playErrorSound() {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    this.tone(300, 'square', now, 0.2, 0.1);
    this.tone(200, 'square', now + 0.22, 0.2, 0.08);
  }

  /** NOTIFICATION — Generic alert */
  public playNotificationSound() {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    [1000, 1500, 2000].forEach((f, i) => this.tone(f, 'sine', now + i * 0.07, 0.12, 0.1));
  }

  /** CROWD ROAR — Birthday, saves, etc. */
  public playCrowdRoar() {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => this.tone(f, i === 3 ? 'triangle' : 'sine', now + i * 0.08, 0.7, 0.18));
  }

  /** CLAPPING — Hand clap simulation */
  public playClapping() {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    for (let i = 0; i < 6; i++) {
      this.tone(1800 + Math.random() * 400, 'sawtooth', now + i * 0.15, 0.08, 0.07 + Math.random() * 0.04);
    }
  }

  /** MISSED SHOT / NEAR MISS — Gasp sound */
  public playNearMiss() {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    this.tone(400, 'sine', now, 0.3, 0.08);
    this.tone(300, 'sine', now + 0.15, 0.25, 0.06);
    this.speakPidgin('Ehh! So close! The ball nearly enter!');
  }

  /** Nigerian Pidgin TTS with closest available voice */
  public speakPidgin(text: string) {
    if (this.isMuted) return;
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    // Prefer Nigerian-English, British-English as fallback (closest to Nigerian accent)
    const best = voices.find(v => v.lang === 'en-NG') ||
                 voices.find(v => v.lang === 'en-GB') ||
                 voices.find(v => v.lang === 'en-US' && v.name.toLowerCase().includes('male')) ||
                 voices[0];
    if (best) utter.voice = best;
    utter.rate = 1.05;
    utter.pitch = 1.1;
    utter.volume = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }

  // Backwards-compat aliases
  public playGoalSound() { this.playGoalCelebration(); }
  public playWhistleSound() { this.playWhistle('kickoff'); }
}

export const stadiumAudio = new StadiumAudioEngine();
