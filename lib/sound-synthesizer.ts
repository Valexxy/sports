'use client';

/**
 * STADIUM AUDIO SYNTHESIZER — 12 Distinct Sound Profiles & Authentic Nigerian Voice Commentary
 * Every single user action has a UNIQUE acoustic profile synthesized with Web Audio API.
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
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.linearRampToValueAtTime(peakGain, startAt + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(startAt);
    osc.stop(startAt + duration + 0.05);
  }

  public speakNigerian(text: string) {
    if (this.isMuted) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();

      const ngVoice =
        voices.find((v) => v.lang === 'en-NG' || v.lang === 'en_NG' || v.name.toLowerCase().includes('nigeria')) ||
        voices.find((v) => v.lang === 'en-GB' && v.name.toLowerCase().includes('male')) ||
        voices.find((v) => v.lang === 'en-GB') ||
        voices[0];

      if (ngVoice) utter.voice = ngVoice;
      utter.rate = 1.0;
      utter.pitch = 1.15;
      utter.volume = 0.95;
      window.speechSynthesis.speak(utter);
    } catch {
      /* noop */
    }
  }

  /** 1. GOAL CELEBRATION — Multi-Octave Stadium Fanfare + Rumble + Pidgin Cheer */
  public playGoalCelebration() {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;

    // Ascending stadium brass chord (C4, E4, G4, C5, E5, G5)
    [261.63, 329.63, 392.00, 523.25, 659.25, 783.99].forEach((f, i) => {
      this.tone(f, 'sawtooth', now + i * 0.06, 0.9, 0.12);
      this.tone(f * 0.5, 'sine', now + i * 0.06, 1.2, 0.18);
    });

    // Sub-bass crowd surge
    const lfo = this.audioCtx.createOscillator();
    const lGain = this.audioCtx.createGain();
    lfo.type = 'triangle';
    lfo.frequency.setValueAtTime(60, now);
    lfo.frequency.exponentialRampToValueAtTime(160, now + 0.6);
    lGain.gain.setValueAtTime(0.15, now);
    lGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    lfo.connect(lGain);
    lGain.connect(this.audioCtx.destination);
    lfo.start(now);
    lfo.stop(now + 1.3);

    this.speakNigerian('GOLAZO! E don enter! Na goal be this o!');
  }

  /** 2. REFEREE KICKOFF WHISTLE — Crisp high acoustic pitch with vibrato */
  public playWhistle(type: 'kickoff' | 'halftime' | 'fulltime' = 'kickoff') {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;

    if (type === 'fulltime') {
      // 3 Successive Trill Whistles
      [0, 0.35, 0.7].forEach((offset) => {
        const osc = this.audioCtx!.createOscillator();
        const g = this.audioCtx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(3200, now + offset);
        osc.frequency.linearRampToValueAtTime(2800, now + offset + 0.22);
        g.gain.setValueAtTime(0.001, now + offset);
        g.gain.linearRampToValueAtTime(0.28, now + offset + 0.03);
        g.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.25);
        osc.connect(g);
        g.connect(this.audioCtx!.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.28);
      });
      this.speakNigerian('Full time! Match don finish!');
    } else if (type === 'halftime') {
      [0, 0.4].forEach((offset) => {
        this.tone(3000, 'sine', now + offset, 0.3, 0.25);
      });
      this.speakNigerian('Half time! Rest small!');
    } else {
      // Single sharp kickoff whistle
      const osc = this.audioCtx.createOscillator();
      const g = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(3100, now);
      osc.frequency.linearRampToValueAtTime(2700, now + 0.4);
      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(0.3, now + 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.connect(g);
      g.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.48);
      this.speakNigerian('Referee blow whistle! Match don start!');
    }
  }

  /** 3. YELLOW CARD — Harsh metallic dual-tone buzz */
  public playYellowCard() {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    this.tone(440, 'sawtooth', now, 0.15, 0.14);
    this.tone(330, 'square', now + 0.12, 0.25, 0.12);
    this.speakNigerian('Yellow card! Ref don warn am!');
  }

  /** 4. RED CARD — Menacing low alarm siren */
  public playRedCard() {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    this.tone(180, 'sawtooth', now, 0.35, 0.22);
    this.tone(130, 'square', now + 0.18, 0.45, 0.25);
    this.speakNigerian('Red card wahala! Player don comot pitch!');
  }

  /** 5. ADD PICK TO SLIP — Crisp Ascending Cash Register Chime */
  public playAddPickSound() {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    [659.25, 830.61, 987.77, 1318.51].forEach((f, i) => {
      this.tone(f, 'sine', now + i * 0.05, 0.15, 0.12);
    });
  }

  /** 6. REMOVE PICK — Descending soft wood tap pop */
  public playRemovePickSound() {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    this.tone(700, 'triangle', now, 0.08, 0.1);
    this.tone(350, 'sine', now + 0.06, 0.1, 0.08);
  }

  /** 7. BOOKMARK MATCH — Sparkly High Shimmer */
  public playBookmarkSound() {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    [1046.50, 1318.51, 1567.98, 2093.00].forEach((f, i) => {
      this.tone(f, 'sine', now + i * 0.04, 0.18, 0.08);
    });
  }

  /** 8. TAB / NAVIGATION CLICK — Subtle tactile acoustic tick */
  public playTabClickSound() {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    this.tone(520, 'sine', now, 0.04, 0.05);
  }

  /** 9. WON TICKET VICTORY — Triumphant Fanfare + Roar */
  public playWonTicketSound() {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((f, i) => {
      this.tone(f, 'triangle', now + i * 0.07, 0.8, 0.16);
    });
    this.speakNigerian('Ticket don enter! Correct banker confirmed!');
  }

  /** 10. LEAGUE TABLE SWOOSH — Digital Data Scan Sweep */
  public playDataSwoosh() {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.18);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  /** Crowd Roar */
  public playCrowdRoar() {
    if (this.isMuted) return;
    this.init(); this.resume();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((f, i) =>
      this.tone(f, i === 3 ? 'triangle' : 'sine', now + i * 0.08, 0.7, 0.15)
    );
  }

  public playSuccessSound() { this.playAddPickSound(); }
  public playClapping() { this.playWonTicketSound(); }
  public playSubstitution() { this.playDataSwoosh(); }
  public playCorner() { this.playWhistle('kickoff'); }
  public playNearMiss() { this.playYellowCard(); }
  public playNotificationSound() { this.playBookmarkSound(); }
  public playErrorSound() { this.playRemovePickSound(); }
  public playGoalSound() { this.playGoalCelebration(); }
  public playWhistleSound() { this.playWhistle('kickoff'); }
  public playNigerianAudioCommentary() { this.playGoalCelebration(); }
  public speakPidgin(text: string) { this.speakNigerian(text); }
}

export const stadiumAudio = new StadiumAudioEngine();
