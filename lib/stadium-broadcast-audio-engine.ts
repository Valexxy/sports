'use client';

/**
 * STADIUM BROADCAST AUDIO ENGINE
 * - Non-repeating per-minute TV commentary
 * - Interactive timeline seek / scrubber (e.g., tap 69' -> plays 69', 70', 71' without duplicate voice triggers)
 * - UK voice for English channel & Authentic Warri Street Swagger for Nigerian Pidgin
 */

import { speakNaija, stopNaijaAudio } from './naija-voice-engine';

class StadiumBroadcastAudioEngine {
  private audioCtx: AudioContext | null = null;
  private crowdGainNode: GainNode | null = null;
  private crowdSourceNode: AudioBufferSourceNode | null = null;
  private isCrowdPlaying: boolean = false;
  private isPaused: boolean = false;
  private currentMinute: number = 28;
  private currentSecond: number = 0;
  private lastSpokenMinute: number = -1;
  private timelineTimer: NodeJS.Timeout | null = null;
  private crowdVolume: number = 0.35;
  private homeTeam: string = 'Home';
  private awayTeam: string = 'Away';
  private onTickCallback?: (timeStr: string, isPlaying: boolean, currentMin: number) => void;
  public activeChannel: 'ENGLISH' | 'PIDGIN' = 'PIDGIN';

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
    initialMinute: number = 28,
    onTick?: (timeStr: string, isPlaying: boolean, currentMin: number) => void
  ) {
    this.activeChannel = 'ENGLISH';
    this.startBroadcastInternal(homeTeam, awayTeam, initialMinute, onTick);
  }

  public startPidginBroadcast(
    homeTeam: string,
    awayTeam: string,
    initialMinute: number = 28,
    onTick?: (timeStr: string, isPlaying: boolean, currentMin: number) => void
  ) {
    this.activeChannel = 'PIDGIN';
    this.startBroadcastInternal(homeTeam, awayTeam, initialMinute, onTick);
  }

  private startBroadcastInternal(
    homeTeam: string,
    awayTeam: string,
    initialMinute: number,
    onTick?: (timeStr: string, isPlaying: boolean, currentMin: number) => void
  ) {
    this.init();
    this.homeTeam = homeTeam;
    this.awayTeam = awayTeam;
    this.currentMinute = initialMinute;
    this.currentSecond = 0;
    this.lastSpokenMinute = -1;
    this.isPaused = false;
    this.onTickCallback = onTick;

    this.startCrowdAmbience();
    this.speakMinuteEvent(this.currentMinute);

    if (this.timelineTimer) clearInterval(this.timelineTimer);
    this.timelineTimer = setInterval(() => {
      if (!this.isPaused) {
        this.currentSecond++;
        if (this.currentSecond >= 60) {
          this.currentMinute++;
          this.currentSecond = 0;
          // Trigger commentary EXACTLY ONCE per new minute
          this.speakMinuteEvent(this.currentMinute);
        }
        const timeStr = `${this.currentMinute}:${this.currentSecond < 10 ? '0' + this.currentSecond : this.currentSecond}`;
        if (this.onTickCallback) this.onTickCallback(timeStr, true, this.currentMinute);
      }
    }, 1000);
  }

  /**
   * Interactive Timeline Scrubbing:
   * Seek directly to any minute (e.g. 69') and play forward with no repetition!
   */
  public seekToMinute(minute: number) {
    this.init();
    this.currentMinute = minute;
    this.currentSecond = 0;
    this.isPaused = false;
    this.lastSpokenMinute = -1; // Reset to allow speaking the newly selected minute

    if (this.crowdGainNode && this.audioCtx) {
      this.crowdGainNode.gain.linearRampToValueAtTime(this.crowdVolume, this.audioCtx.currentTime + 0.2);
    } else {
      this.startCrowdAmbience();
    }

    this.speakMinuteEvent(minute);

    const timeStr = `${this.currentMinute}:00`;
    if (this.onTickCallback) this.onTickCallback(timeStr, true, this.currentMinute);
  }

  private speakMinuteEvent(minute: number) {
    if (this.lastSpokenMinute === minute || this.isPaused) return;
    this.lastSpokenMinute = minute;

    const h = this.homeTeam;
    const a = this.awayTeam;

    if (this.activeChannel === 'PIDGIN') {
      // Serious street vibe Warri/Edo narration
      let text = `Minute ${minute}: ${h} and ${a} dey fight for pitch!`;
      if (minute === 1) text = `Referee don blow whistle for match start! ${h} and ${a} boys enter pitch with serious Warri fire!`;
      else if (minute === 14) text = `Minute 14: Omo see thunder shot! ${a} keeper jump like cat parry ball go corner!`;
      else if (minute === 24) text = `Minute 24: Goooooal o! ${h} boy wire ball enter bottom corner! Net don shake!`;
      else if (minute === 35) text = `Minute 35: Rough tackle for center! Referee show yellow card say make player calm down!`;
      else if (minute === 45) text = `Minute 45: First half don finish kpatakpata! Make two teams go locker room go strategize!`;
      else if (minute === 68) text = `Minute 68: Goal again! Mad finish straight enter upper 90! Stadium dey roar!`;
      else if (minute === 78) text = `Minute 78: Tactical jersey pull to stop counter, referee flash yellow card!`;
      else if (minute === 86) text = `Minute 86: Miracle save on the line! Keeper use finger tip clear danger!`;
      else if (minute >= 90) text = `Minute 90: Referee blow final whistle! Game don settle kpatakpata!`;
      else {
        const pcmBank = [
          `Minute ${minute}: ${h} boys dey control ball, moving enter 18 box with correct passing!`,
          `Minute ${minute}: Heavy physical tackle by ${a} defender, ball clear go touch line!`,
          `Minute ${minute}: Dangerous cross swung enter penalty area, goalkeeper rush out catch am!`,
          `Minute ${minute}: Rapid counter attack on the left wing! ${h} winger sprint with speed!`,
          `Minute ${minute}: Long range strike fired! Ball fly inches over the bar!`,
        ];
        text = pcmBank[minute % pcmBank.length];
      }

      speakNaija(text, 'hyped', { lang: 'en-NG' });
    } else {
      // Standard UK English Football Broadcast
      let text = `Minute ${minute}: ${h} and ${a} contesting possession in the final third.`;
      if (minute === 1) text = `Referee blows the whistle for kickoff! ${h} gets this exciting match underway.`;
      else if (minute === 14) text = `Minute 14: Spectacular diving reflex save by the ${a} goalkeeper to deny the opener!`;
      else if (minute === 24) text = `Minute 24: GOAL! Low curling finish into the bottom corner! ${h} takes the lead!`;
      else if (minute === 35) text = `Minute 35: Yellow card shown for a late sliding challenge in the center of the pitch.`;
      else if (minute === 45) text = `Minute 45: Referee blows for half time after an intense opening 45 minutes.`;
      else if (minute === 68) text = `Minute 68: GOAL! Stunning strike straight into the top corner! Superb technique!`;
      else if (minute === 78) text = `Minute 78: Booking for a tactical foul stopping a dangerous counter attack.`;
      else if (minute === 86) text = `Minute 86: Outstanding goal-line reaction stop to keep the score intact!`;
      else if (minute >= 90) text = `Minute 90: Full time whistle is blown! Match settled.`;
      else {
        const ukBank = [
          `Minute ${minute}: Patient build-up from ${h}, circulating possession across the backline.`,
          `Minute ${minute}: Solid defensive interception by ${a} to halt the forward momentum.`,
          `Minute ${minute}: Curling cross delivered towards the far post, cleared by the central defender.`,
          `Minute ${minute}: Rapid counter attack developing down the right wing with numbers forward.`,
          `Minute ${minute}: Ambitious long-range effort fired towards goal, dipping just over the crossbar.`,
        ];
        text = ukBank[minute % ukBank.length];
      }

      speakNaija(text, 'normal', { lang: 'en-GB' });
    }
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
    stopNaijaAudio();
  }

  public resumeBroadcast(homeTeam: string, awayTeam: string) {
    this.init();
    this.isPaused = false;
    this.homeTeam = homeTeam;
    this.awayTeam = awayTeam;

    if (this.crowdGainNode && this.audioCtx) {
      this.crowdGainNode.gain.linearRampToValueAtTime(this.crowdVolume, this.audioCtx.currentTime + 0.3);
    } else {
      this.startCrowdAmbience();
    }

    this.speakMinuteEvent(this.currentMinute);
  }

  public stopBroadcast() {
    this.isPaused = false;
    if (this.timelineTimer) clearInterval(this.timelineTimer);
    if (this.crowdSourceNode) {
      try { this.crowdSourceNode.stop(); } catch {}
      this.crowdSourceNode = null;
    }
    this.isCrowdPlaying = false;
    stopNaijaAudio();
  }
}

export const stadiumBroadcastAudio = new StadiumBroadcastAudioEngine();
