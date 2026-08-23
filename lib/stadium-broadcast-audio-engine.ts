'use client';

/**
 * STADIUM BROADCAST AUDIO ENGINE
 * Continuous stadium crowd ambience + synchronized Nigerian play-by-play TV voice commentary
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
  private crowdVolume: number = 0.35;
  private voiceVolume: number = 1.0;
  private activeChannel: 'ENGLISH' | 'PIDGIN' = 'PIDGIN';

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

  private createCrowdNoiseBuffer(): AudioBuffer | null {
    if (!this.audioCtx) return null;
    const sampleRate = this.audioCtx.sampleRate;
    const bufferSize = sampleRate * 8;
    const buffer = this.audioCtx.createBuffer(2, bufferSize, sampleRate);
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    let lastOutL = 0.0;
    let lastOutR = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const whiteL = Math.random() * 2 - 1;
      const whiteR = Math.random() * 2 - 1;
      lastOutL = (lastOutL + (0.02 * whiteL)) / 1.02;
      lastOutR = (lastOutR + (0.02 * whiteR)) / 1.02;
      const wave = Math.sin((i / sampleRate) * Math.PI * 0.5) * 0.15;
      left[i] = (lastOutL * 2.8 + wave) * 0.35;
      right[i] = (lastOutR * 2.8 + wave) * 0.35;
    }

    return buffer;
  }

  public startEnglishBroadcast(
    homeTeam: string,
    awayTeam: string,
    initialMinute: number = 15,
    onTick?: (timeStr: string, isPlaying: boolean) => void
  ) {
    this.activeChannel = 'ENGLISH';
    this.startBroadcastInternal(homeTeam, awayTeam, initialMinute, onTick);
    this.speakTvCommentary(`Welcome to the live stadium broadcast. ${homeTeam} vs ${awayTeam} at minute ${this.currentMinute}. The stadium is rocking!`);
  }

  public startPidginBroadcast(
    homeTeam: string,
    awayTeam: string,
    initialMinute: number = 15,
    onTick?: (timeStr: string, isPlaying: boolean) => void,
    localLang: string = 'pidgin'
  ) {
    this.activeChannel = 'PIDGIN';
    this.startBroadcastInternal(homeTeam, awayTeam, initialMinute, onTick);
    this.speakTvCommentary(`Oya welcome to the live match o! ${homeTeam} and ${awayTeam} dey tear pitch for minute ${this.currentMinute}! Stadium don bubble!`);
  }

  private startBroadcastInternal(
    homeTeam: string,
    awayTeam: string,
    initialMinute: number,
    onTick?: (timeStr: string, isPlaying: boolean) => void
  ) {
    this.init();
    this.isPaused = false;
    this.currentMinute = initialMinute;
    this.startCrowdAmbience();

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

    if (this.commentaryTimer) clearInterval(this.commentaryTimer);
    this.commentaryTimer = setInterval(() => {
      if (!this.isPaused) {
        this.triggerDynamicTvAction(homeTeam, awayTeam);
      }
    }, 12000);
  }

  public startCrowdAmbience() {
    this.init();
    if (!this.audioCtx || this.isCrowdPlaying) return;

    const buffer = this.createCrowdNoiseBuffer();
    if (!buffer) return;

    this.crowdSourceNode = this.audioCtx.createBufferSource();
    this.crowdSourceNode.buffer = buffer;
    this.crowdSourceNode.loop = true;

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

  public pauseBroadcast() {
    this.isPaused = true;
    if (this.crowdGainNode && this.audioCtx) {
      this.crowdGainNode.gain.linearRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.3);
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public resumeBroadcast(homeTeam: string, awayTeam: string) {
    this.init();
    this.isPaused = false;
    if (this.crowdGainNode && this.audioCtx) {
      this.crowdGainNode.gain.linearRampToValueAtTime(this.crowdVolume, this.audioCtx.currentTime + 0.3);
    } else {
      this.startCrowdAmbience();
    }
    this.speakTvCommentary(
      this.activeChannel === 'PIDGIN'
        ? `Match dey resume for minute ${this.currentMinute}! ${homeTeam} and ${awayTeam} dey contest ball!`
        : `Resuming live match at ${this.currentMinute} minutes. ${homeTeam} in possession.`
    );
  }

  public stopBroadcast() {
    this.isPaused = false;
    if (this.timelineTimer) clearInterval(this.timelineTimer);
    if (this.commentaryTimer) clearInterval(this.commentaryTimer);
    if (this.crowdSourceNode) {
      try { this.crowdSourceNode.stop(); } catch {}
      this.crowdSourceNode = null;
    }
    this.isCrowdPlaying = false;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public surgeCrowdRoar(intensity: 'high' | 'goal' | 'shot' = 'high') {
    if (!this.crowdGainNode || !this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const targetGain = intensity === 'goal' ? 0.75 : intensity === 'shot' ? 0.55 : 0.45;
    this.crowdGainNode.gain.cancelScheduledValues(now);
    this.crowdGainNode.gain.linearRampToValueAtTime(targetGain, now + 0.18);
    this.crowdGainNode.gain.exponentialRampToValueAtTime(this.crowdVolume, now + (intensity === 'goal' ? 4.5 : 2.5));
  }

  public speakTvCommentary(text: string) {
    if (typeof window === 'undefined' || this.isPaused) return;
    this.surgeCrowdRoar('high');
    speakNaija(text, 'hyped', {
      rate: 1.05,
      pitch: 0.94,
      volume: this.voiceVolume,
    });
  }

  private triggerDynamicTvAction(home: string, away: string) {
    const pidginActions = [
      `${home} boys dey push enter final third! Correct passing exchange!`,
      `Crucial tackle by ${away} defender, e clear ball go corner!`,
      `Dangerous cross enter 18 yard box! Goalkeeper fly catch am!`,
      `${home} dey press high, dem wan score by all means!`,
      `Omo see thunder strike from outside box! E shave the goal post bar!`,
    ];
    const englishActions = [
      `${home} advancing smoothly down the left wing with precision passes.`,
      `Superb defensive interception by ${away} to stop the danger.`,
      `Curling cross whipped into the penalty box! Goalkeeper punches clear!`,
      `${home} dominating territory control with high pressing.`,
      `Long range shot fired on target! Ball flies inches over the crossbar!`,
    ];
    const pool = this.activeChannel === 'PIDGIN' ? pidginActions : englishActions;
    const phrase = pool[Math.floor(Math.random() * pool.length)];
    this.speakTvCommentary(`Minute ${this.currentMinute}: ${phrase}`);
  }
}

export const stadiumBroadcastAudio = new StadiumBroadcastAudioEngine();
