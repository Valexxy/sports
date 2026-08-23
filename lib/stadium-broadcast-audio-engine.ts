'use client';

/**
 * STADIUM BROADCAST AUDIO ENGINE
 * - Authentic Nigerian Voice Streaming
 * - Sequential Catch-up Auto-Advancement:
 *   If match is at 70' and user taps 65', it speaks 65', then automatically advances
 *   to 66', 67', 68', 69', and 70', then stays at 70' until the live clock ticks 71'!
 */

import { speakNaija, stopNaijaAudio } from './naija-voice-engine';

class StadiumBroadcastAudioEngine {
  private audioCtx: AudioContext | null = null;
  private crowdGainNode: GainNode | null = null;
  private crowdSourceNode: AudioBufferSourceNode | null = null;
  private isCrowdPlaying: boolean = false;
  private isPaused: boolean = false;
  
  private liveMaxMinute: number = 70; // Current real-time match minute
  private currentPlayheadMinute: number = 70; // Currently voiced minute
  private currentSecond: number = 0;
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
    this.liveMaxMinute = initialMinute;
    this.currentPlayheadMinute = initialMinute;
    this.currentSecond = 0;
    this.isPaused = false;
    this.onTickCallback = onTick;

    this.startCrowdAmbience();
    this.speakCurrentAndAutoAdvance();

    // Live clock timer: advances real match minute
    if (this.timelineTimer) clearInterval(this.timelineTimer);
    this.timelineTimer = setInterval(() => {
      if (!this.isPaused) {
        this.currentSecond++;
        if (this.currentSecond >= 60) {
          this.liveMaxMinute++;
          this.currentSecond = 0;

          // If we were caught up, advance playhead together with live clock
          if (this.currentPlayheadMinute >= this.liveMaxMinute - 1) {
            this.currentPlayheadMinute = this.liveMaxMinute;
            this.speakCurrentAndAutoAdvance();
          }
        }
        const timeStr = `${this.currentPlayheadMinute}:${this.currentSecond < 10 ? '0' + this.currentSecond : this.currentSecond}`;
        if (this.onTickCallback) this.onTickCallback(timeStr, true, this.currentPlayheadMinute);
      }
    }, 1000);
  }

  /**
   * Interactive Timeline Scrubbing & Sequential Catch-Up:
   * When user clicks on 65' (with live at 70'), it starts at 65' and auto-advances
   * 66', 67', 68', 69', 70', then stays at 70' until 71'!
   */
  public seekToMinute(minute: number, liveMax: number = this.liveMaxMinute) {
    this.init();
    this.liveMaxMinute = Math.max(liveMax, minute);
    this.currentPlayheadMinute = minute;
    this.currentSecond = 0;
    this.isPaused = false;

    if (this.crowdGainNode && this.audioCtx) {
      this.crowdGainNode.gain.linearRampToValueAtTime(this.crowdVolume, this.audioCtx.currentTime + 0.2);
    } else {
      this.startCrowdAmbience();
    }

    this.speakCurrentAndAutoAdvance();
  }

  private speakCurrentAndAutoAdvance() {
    if (this.isPaused) return;

    const minute = this.currentPlayheadMinute;
    const h = this.homeTeam;
    const a = this.awayTeam;

    const timeStr = `${minute}:00`;
    if (this.onTickCallback) this.onTickCallback(timeStr, true, minute);

    let narrativeText = '';
    const isPidgin = this.activeChannel === 'PIDGIN';

    if (isPidgin) {
      if (minute === 1) narrativeText = `Referee don blow whistle for match start! ${h} and ${a} enter pitch with heavy fire!`;
      else if (minute === 14) narrativeText = `Minute 14: Omo see thunder shot! ${a} keeper jump like cat parry ball go corner!`;
      else if (minute === 24) narrativeText = `Minute 24: Goooooal o! ${h} wire ball enter bottom corner! Net don shake!`;
      else if (minute === 35) narrativeText = `Minute 35: Rough tackle for center! Referee show yellow card say make player behave!`;
      else if (minute === 45) narrativeText = `Minute 45: First half don finish kpatakpata! Make two teams go locker room go strategize!`;
      else if (minute === 68) narrativeText = `Minute 68: Goal again! Mad finish straight enter upper 90! Stadium dey roar!`;
      else if (minute === 78) narrativeText = `Minute 78: Tactical jersey pull to stop counter attack, referee flash yellow card!`;
      else if (minute === 86) narrativeText = `Minute 86: Miracle save on the line! Keeper use finger tip clear danger!`;
      else if (minute >= 90) narrativeText = `Minute 90: Referee blow final whistle! Game don settle kpatakpata!`;
      else {
        const pcmBank = [
          `Minute ${minute}: ${h} boys dey control ball, moving enter 18 box with correct passing!`,
          `Minute ${minute}: Heavy physical tackle by ${a} defender, ball clear go touch line!`,
          `Minute ${minute}: Dangerous cross swung enter penalty area, goalkeeper rush out catch am!`,
          `Minute ${minute}: Rapid counter attack on the left wing! ${h} winger sprint with speed!`,
          `Minute ${minute}: Long range strike fired! Ball fly inches over the bar!`,
        ];
        narrativeText = pcmBank[minute % pcmBank.length];
      }

      speakNaija(narrativeText, 'hyped', {
        lang: 'en-NG',
        onEnd: () => this.handleAudioEnded(),
      });
    } else {
      if (minute === 1) narrativeText = `Referee blows the whistle for kickoff! ${h} gets this match underway.`;
      else if (minute === 14) narrativeText = `Minute 14: Spectacular diving reflex save by the ${a} goalkeeper to deny the opener!`;
      else if (minute === 24) narrativeText = `Minute 24: GOAL! Low curling finish into the bottom corner! ${h} takes the lead!`;
      else if (minute === 35) narrativeText = `Minute 35: Yellow card shown for a late sliding challenge in the center of the pitch.`;
      else if (minute === 45) narrativeText = `Minute 45: Referee blows for half time after an intense opening 45 minutes.`;
      else if (minute === 68) narrativeText = `Minute 68: GOAL! Stunning strike straight into the top corner! Superb technique!`;
      else if (minute === 78) narrativeText = `Minute 78: Booking for a tactical foul stopping a dangerous counter attack.`;
      else if (minute === 86) narrativeText = `Minute 86: Outstanding goal-line reaction stop to keep the score intact!`;
      else if (minute >= 90) narrativeText = `Minute 90: Full time whistle is blown! Match settled.`;
      else {
        const ukBank = [
          `Minute ${minute}: Patient build-up from ${h}, circulating possession across the backline.`,
          `Minute ${minute}: Solid defensive interception by ${a} to halt the forward momentum.`,
          `Minute ${minute}: Curling cross delivered towards the far post, cleared by the central defender.`,
          `Minute ${minute}: Rapid counter attack developing down the right wing with numbers forward.`,
          `Minute ${minute}: Ambitious long-range effort fired towards goal, dipping just over the crossbar.`,
        ];
        narrativeText = ukBank[minute % ukBank.length];
      }

      speakNaija(narrativeText, 'normal', {
        lang: 'en-GB',
        onEnd: () => this.handleAudioEnded(),
      });
    }
  }

  // When a minute's audio finishes, auto-advance to next minute if behind live time!
  private handleAudioEnded() {
    if (this.isPaused) return;

    if (this.currentPlayheadMinute < this.liveMaxMinute) {
      // Auto-advance sequentially (e.g. 65 -> 66 -> 67 -> 68 -> 69 -> 70)
      this.currentPlayheadMinute++;
      this.speakCurrentAndAutoAdvance();
    }
    // If currentPlayheadMinute === liveMaxMinute, we have caught up! Stay at 70' until live clock hits 71'.
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

    this.speakCurrentAndAutoAdvance();
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
