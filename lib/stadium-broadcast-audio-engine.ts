'use client';

/**
 * STADIUM BROADCAST AUDIO ENGINE
 * Generates continuous live stadium crowd ambience, realistic fan murmur,
 * dynamic match cheer surges, and synchronized play-by-play TV commentary
 * with pause/resume timeline tracking.
 */

import { speakNaija } from './naija-voice-engine';

class StadiumBroadcastAudioEngine {
  private audioCtx: AudioContext | null = null;
  private crowdGainNode: GainNode | null = null;
  private crowdSourceNode: AudioBufferSourceNode | null = null;
  private isCrowdPlaying: boolean = false;
  private isPaused: boolean = false;
  private currentMinute: number = 64;
  private currentSecond: number = 24;
  private timelineTimer: NodeJS.Timeout | null = null;
  private commentaryTimer: NodeJS.Timeout | null = null;
  private crowdVolume: number = 0.25;
  private voiceVolume: number = 1.0;

  public init() {
    if (typeof window === 'undefined') return;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  /**
   * Generates an 8-second looping buffer of authentic low-rumble stadium crowd ambience
   */
  private createCrowdNoiseBuffer(): AudioBuffer | null {
    if (!this.audioCtx) return null;
    const sampleRate = this.audioCtx.sampleRate;
    const bufferSize = sampleRate * 8; // 8 seconds buffer
    const buffer = this.audioCtx.createBuffer(2, bufferSize, sampleRate);
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    let lastOutL = 0.0;
    let lastOutR = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const whiteL = Math.random() * 2 - 1;
      const whiteR = Math.random() * 2 - 1;

      // Brownian / Pink low-pass filter for rich stadium murmur
      lastOutL = (lastOutL + (0.02 * whiteL)) / 1.02;
      lastOutR = (lastOutR + (0.02 * whiteR)) / 1.02;

      // Add gentle sinusoidal cheering swell
      const wave = Math.sin((i / sampleRate) * Math.PI * 0.5) * 0.15;

      left[i] = (lastOutL * 2.8 + wave) * 0.35;
      right[i] = (lastOutR * 2.8 + wave) * 0.35;
    }

    return buffer;
  }

  /**
   * Start Live Stadium Broadcast (Crowd Ambience + TV Commentary Stream)
   */
  public startBroadcast(
    homeTeam: string,
    awayTeam: string,
    initialMinute: number = 64,
    onTick?: (timeStr: string, isPlaying: boolean) => void
  ) {
    this.init();
    if (!this.audioCtx) return;

    this.isPaused = false;
    this.currentMinute = initialMinute;
    this.startCrowdAmbience();

    // Start timeline clock
    if (this.timelineTimer) clearInterval(this.timelineTimer);
    this.timelineTimer = setInterval(() => {
      if (!this.isPaused) {
        this.currentSecond++;
        if (this.currentSecond >= 60) {
          this.currentMinute++;
          this.currentSecond = 0;
        }
        const timeStr = `${this.currentMinute}:${this.currentSecond < 10 ? '0' + this.currentSecond : this.currentSecond}`;
        if (onTick) onTick(timeStr, true);
      }
    }, 1000);

    // Initial broadcast commentary line
    this.speakTvCommentary(
      `Live from the stadium. ${homeTeam} vs ${awayTeam}, minute ${this.currentMinute}. The crowd is roaring!`
    );

    // Stream regular commentary every 14 seconds
    if (this.commentaryTimer) clearInterval(this.commentaryTimer);
    this.commentaryTimer = setInterval(() => {
      if (!this.isPaused) {
        this.triggerDynamicTvAction(homeTeam, awayTeam);
      }
    }, 14000);
  }

  /**
   * Trigger continuous crowd ambient noise
   */
  public startCrowdAmbience() {
    this.init();
    if (!this.audioCtx || this.isCrowdPlaying) return;

    const buffer = this.createCrowdNoiseBuffer();
    if (!buffer) return;

    this.crowdSourceNode = this.audioCtx.createBufferSource();
    this.crowdSourceNode.buffer = buffer;
    this.crowdSourceNode.loop = true;

    // Filter to give that authentic outdoor stadium acoustic
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, this.audioCtx.currentTime);

    this.crowdGainNode = this.audioCtx.createGain();
    this.crowdGainNode.gain.setValueAtTime(this.crowdVolume, this.audioCtx.currentTime);

    this.crowdSourceNode.connect(filter);
    filter.connect(this.crowdGainNode);
    this.crowdGainNode.connect(this.audioCtx.destination);

    this.crowdSourceNode.start();
    this.isCrowdPlaying = true;
  }

  /**
   * Pause the match broadcast exactly where it is
   */
  public pauseBroadcast() {
    this.isPaused = true;
    if (this.crowdGainNode && this.audioCtx) {
      this.crowdGainNode.gain.linearRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.3);
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  }

  /**
   * Resume match broadcast from the exact minute/second
   */
  public resumeBroadcast(homeTeam: string, awayTeam: string) {
    this.init();
    this.isPaused = false;
    if (this.crowdGainNode && this.audioCtx) {
      this.crowdGainNode.gain.linearRampToValueAtTime(this.crowdVolume, this.audioCtx.currentTime + 0.3);
    } else {
      this.startCrowdAmbience();
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else {
        this.speakTvCommentary(
          `Resuming match broadcast at ${this.currentMinute} minutes. Possession contested between ${homeTeam} and ${awayTeam}.`
        );
      }
    }
  }

  /**
   * Stop broadcast completely
   */
  public stopBroadcast() {
    this.isPaused = false;
    if (this.timelineTimer) clearInterval(this.timelineTimer);
    if (this.commentaryTimer) clearInterval(this.commentaryTimer);
    if (this.crowdSourceNode) {
      try { this.crowdSourceNode.stop(); } catch { /* noop */ }
      this.crowdSourceNode = null;
    }
    this.isCrowdPlaying = false;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * Surge the crowd roar (e.g. on shot on target or near goal)
   */
  public surgeCrowdRoar(intensity: 'high' | 'goal' = 'high') {
    if (!this.crowdGainNode || !this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const targetGain = intensity === 'goal' ? 0.7 : 0.45;
    this.crowdGainNode.gain.cancelScheduledValues(now);
    this.crowdGainNode.gain.linearRampToValueAtTime(targetGain, now + 0.2);
    this.crowdGainNode.gain.exponentialRampToValueAtTime(this.crowdVolume, now + 3.0);
  }

  /**
   * Speaks TV commentary
   */
  public speakTvCommentary(text: string) {
    if (typeof window === 'undefined' || this.isPaused) return;
    this.surgeCrowdRoar('high');
    speakNaija(text, 'hyped', {
      rate: 1.02,
      pitch: 1.12,
      volume: this.voiceVolume,
    });
  }

  /**
   * Generates dynamic in-play television commentary moments
   */
  private triggerDynamicTvAction(home: string, away: string) {
    const actions = [
      `${home} pushing forward into the final third. Beautiful passing exchange!`,
      `Crucial tackle by ${away} defense to stop the counter attack!`,
      `Dangerous cross delivered into the penalty box! Goalkeeper comes out to punch!`,
      `${home} maintaining high press, looking for an opening in the penalty area.`,
      `Shot from distance! Just wide of the top right corner! Crowd is up on their feet!`,
    ];
    const phrase = actions[Math.floor(Math.random() * actions.length)];
    this.speakTvCommentary(`Minute ${this.currentMinute}: ${phrase}`);
  }

  public getTimeString(): string {
    return `${this.currentMinute}:${this.currentSecond < 10 ? '0' + this.currentSecond : this.currentSecond}`;
  }

  public getIsPaused(): boolean {
    return this.isPaused;
  }

  public getIsPlaying(): boolean {
    return this.isCrowdPlaying && !this.isPaused;
  }
}

export const stadiumBroadcastAudio = new StadiumBroadcastAudioEngine();
