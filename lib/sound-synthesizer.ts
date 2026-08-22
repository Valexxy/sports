'use client';

/**
 * STADIUM AUDIO ENGINE — Authentic Nigerian Accent Commentary + Web Audio SFX
 * Voice synthesized with Nigerian English cadence and authentic pidgin commentary.
 * Audio plays on user click / interaction.
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

  /** Play on-click Nigerian Football Commentary */
  public playNigerianAudioCommentary() {
    this.init();
    this.resume();
    this.playCrowdRoar();

    const nigerianPhrases = [
      'Oya! Welcome to AuraScore Stadium! Correct banker don land!',
      'GOLAZO o! The striker take time measure the angle, e tear net!',
      'Referee don blow whistle! Tension high for the pitch! 100 percent pure football!',
      'E choke! This prediction na confirmed pure banker, no cap!',
      'Naija to the world! Watch the speed, see the technique, ball full ground!',
    ];
    const phrase = nigerianPhrases[Math.floor(Math.random() * nigerianPhrases.length)];
    this.speakNigerian(phrase);
  }

  /** Speak in authentic Nigerian cadence with pitch and rhythmic tempo */
  public speakNigerian(text: string) {
    if (this.isMuted) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();

      // Look for en-NG voice or closest matching African/British English
      const ngVoice =
        voices.find((v) => v.lang === 'en-NG' || v.lang === 'en_NG' || v.name.toLowerCase().includes('nigeria')) ||
        voices.find((v) => v.lang === 'en-GB' && v.name.toLowerCase().includes('male')) ||
        voices.find((v) => v.lang === 'en-GB') ||
        voices[0];

      if (ngVoice) utter.voice = ngVoice;
      utter.rate = 1.0;
      utter.pitch = 1.15;
      utter.volume = 1.0;
      window.speechSynthesis.speak(utter);
    } catch {
      /* noop */
    }
  }

  /** GOAL — Stadium cheer + Nigerian voice */
  public playGoalCelebration() {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    [261.63, 329.63, 392, 523.25, 659.25, 783.99].forEach((f, i) => {
      this.tone(f, 'sine', now + i * 0.04, 1.2, 0.18);
    });
    this.speakNigerian('GOLAZO! E don enter! Na goal be this o!');
    if ('vibrate' in navigator) navigator.vibrate([200, 100, 200, 100, 300]);
  }

  /** WHISTLE */
  public playWhistle(type: 'kickoff' | 'halftime' | 'fulltime' = 'kickoff') {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    if (type === 'fulltime') {
      [0, 0.4, 0.8].forEach((offset) => {
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
      this.speakNigerian('Full time! Match don finish! Verified on referee ledger!');
    } else {
      this.tone(2900, 'sine', now, 0.4, 0.28);
      this.speakNigerian('Referee blow whistle! Match don start!');
    }
  }

  public playCrowdRoar() {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((f, i) =>
      this.tone(f, i === 3 ? 'triangle' : 'sine', now + i * 0.08, 0.7, 0.18)
    );
  }

  public playSuccessSound() {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    this.tone(600, 'sine', now, 0.1, 0.1);
    this.tone(900, 'sine', now + 0.12, 0.15, 0.12);
    this.tone(1200, 'sine', now + 0.28, 0.2, 0.1);
  }

  public playYellowCard() {
    this.speakNigerian('Yellow card! Ref don show am card!');
  }

  public playRedCard() {
    this.speakNigerian('Red card! Wahala dey, player don comot!');
  }

  public playClapping() {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    for (let i = 0; i < 6; i++) {
      this.tone(1800 + Math.random() * 400, 'sawtooth', now + i * 0.15, 0.08, 0.07 + Math.random() * 0.04);
    }
  }

  public playSubstitution() {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    this.tone(880, 'sine', now, 0.15, 0.12);
    this.tone(660, 'sine', now + 0.18, 0.15, 0.10);
    this.tone(880, 'sine', now + 0.36, 0.15, 0.08);
  }

  public playCorner() {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    [0, 0.08, 0.16, 0.24].forEach((t) => this.tone(300 + t * 400, 'triangle', now + t, 0.1, 0.08));
  }

  public playNearMiss() {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    this.tone(400, 'sine', now, 0.3, 0.08);
    this.tone(300, 'sine', now + 0.15, 0.25, 0.06);
    this.speakNigerian('Ehh! So close! The ball nearly enter!');
  }

  public playNotificationSound() {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    [1000, 1500, 2000].forEach((f, i) => this.tone(f, 'sine', now + i * 0.07, 0.12, 0.1));
  }

  public playErrorSound() {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    this.tone(300, 'square', now, 0.2, 0.1);
    this.tone(200, 'square', now + 0.22, 0.2, 0.08);
  }

  public playGoalSound() { this.playGoalCelebration(); }
  public playWhistleSound() { this.playWhistle('kickoff'); }
}

export const stadiumAudio = new StadiumAudioEngine();
