'use client';

/**
 * STADIUM BROADCAST AUDIO ENGINE
 * - Continuous Non-Stop Spoken Commentary
 * - Does NOT speak minute numbers ("Minute 14" stripped out)
 * - Seamless 1-Tap Language Switching (Pidgin 🇳🇬 <-> English 🇬🇧)
 * - Clickable Timeline Scrubbing: Jump to any minute and it advances continuously upwards!
 */

import { speakNaija, stopNaijaAudio } from './naija-voice-engine';

class StadiumBroadcastAudioEngine {
  private audioCtx: AudioContext | null = null;
  private crowdGainNode: GainNode | null = null;
  private crowdSourceNode: AudioBufferSourceNode | null = null;
  private isCrowdPlaying: boolean = false;
  private isPaused: boolean = false;
  
  private liveMaxMinute: number = 90;
  private currentPlayheadMinute: number = 1;
  private currentSecond: number = 0;
  private timelineTimer: NodeJS.Timeout | null = null;
  private advanceDelayTimer: NodeJS.Timeout | null = null;
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
    initialMinute: number = 1,
    onTick?: (timeStr: string, isPlaying: boolean, currentMin: number) => void
  ) {
    this.activeChannel = 'ENGLISH';
    this.startBroadcastInternal(homeTeam, awayTeam, initialMinute, onTick);
  }

  public startPidginBroadcast(
    homeTeam: string,
    awayTeam: string,
    initialMinute: number = 1,
    onTick?: (timeStr: string, isPlaying: boolean, currentMin: number) => void
  ) {
    this.activeChannel = 'PIDGIN';
    this.startBroadcastInternal(homeTeam, awayTeam, initialMinute, onTick);
  }

  public switchLanguage(lang: 'ENGLISH' | 'PIDGIN') {
    this.activeChannel = lang;
    if (!this.isPaused) {
      stopNaijaAudio();
      this.speakCurrentAndAutoAdvance();
    }
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
    this.liveMaxMinute = 90;
    this.currentPlayheadMinute = Math.max(1, initialMinute);
    this.currentSecond = 0;
    this.isPaused = false;
    this.onTickCallback = onTick;

    this.startCrowdAmbience();
    this.speakCurrentAndAutoAdvance();

    if (this.timelineTimer) clearInterval(this.timelineTimer);
    this.timelineTimer = setInterval(() => {
      if (!this.isPaused) {
        this.currentSecond++;
        if (this.currentSecond >= 60) {
          this.currentSecond = 0;
        }
        const timeStr = `${this.currentPlayheadMinute}:${this.currentSecond < 10 ? '0' + this.currentSecond : this.currentSecond}`;
        if (this.onTickCallback) this.onTickCallback(timeStr, true, this.currentPlayheadMinute);
      }
    }, 1000);
  }

  public seekToMinute(minute: number, liveMax: number = 90) {
    this.init();
    if (this.advanceDelayTimer) clearTimeout(this.advanceDelayTimer);
    stopNaijaAudio();
    this.liveMaxMinute = Math.max(liveMax, minute);
    this.currentPlayheadMinute = Math.max(1, minute);
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

    // PURE NATURAL SPORTS COMMENTARY (NO "MINUTE 14" CALLS)
    if (isPidgin) {
      if (minute === 1) narrativeText = `Referee don blow whistle for kickoff! ${h} and ${a} enter pitch with heavy fire!`;
      else if (minute === 14) narrativeText = `Omo see thunder strike! ${a} keeper jump like cat parry ball go corner!`;
      else if (minute === 24) narrativeText = `Gooooooal o! ${h} wire ball enter bottom corner! Net don scatter kpatakpata!`;
      else if (minute === 35) narrativeText = `Rough tackle for center pitch! Referee flash yellow card say make player behave himself!`;
      else if (minute === 45) narrativeText = `Referee blow whistle for half time! Players enter tunnel go drink water, two coaches dey talk tactics!`;
      else if (minute === 68) narrativeText = `Mad goal again! Curling strike hit post enter net! Stadium dey roar with thunder!`;
      else if (minute === 78) narrativeText = `Tactical jersey pull to stop fast counter attack, referee bring out yellow card without argument!`;
      else if (minute === 86) narrativeText = `Miracle reflex save on the goal line! Keeper use finger tip punch danger go safety!`;
      else if (minute >= 90) narrativeText = `Referee blow final whistle! Game don settle kpatakpata, record don lock inside ledger!`;
      else {
        const pcmBank = [
          `${h} boys dey control tempo, moving ball forward with accurate carpet passing!`,
          `Heavy solid tackle by ${a} defense, ball clear straight to the touchline!`,
          `Dangerous high cross swung enter penalty box, goalkeeper fly out catch am safely!`,
          `Rapid counter attack on the wing! Winger sprint past defender with electric pace!`,
          `Long range rocket fired from 30 yards! Ball zoom inches over the crossbar!`,
          `Neat one-two combination around the 18-yard box, defense scrambles to clear!`,
          `Intense midfield pressure forces a turnover, quick pass forward to the striker!`,
          `Corner kick delivered with dangerous curve towards the penalty spot!`,
        ];
        narrativeText = pcmBank[minute % pcmBank.length];
      }

      speakNaija(narrativeText, 'hyped', {
        lang: 'en-NG',
        onEnd: () => this.handleAudioEnded(),
      });
    } else {
      if (minute === 1) narrativeText = `Referee blows the whistle for kickoff! ${h} gets this eagerly anticipated fixture underway.`;
      else if (minute === 14) narrativeText = `Spectacular diving reflex save by the ${a} goalkeeper to deny what seemed a certain opener!`;
      else if (minute === 24) narrativeText = `GOAL! Superb low finish slotted into the bottom corner! ${h} takes the lead in style!`;
      else if (minute === 35) narrativeText = `Yellow card shown for a late sliding challenge in the center of the pitch.`;
      else if (minute === 45) narrativeText = `The referee blows for half time after a thrilling, high-tempo first half of football.`;
      else if (minute === 68) narrativeText = `GOAL! What a magnificent strike straight into the top corner! An absolute world-class finish!`;
      else if (minute === 78) narrativeText = `Booking for a tactical foul to break up a dangerous breakaways down the flank.`;
      else if (minute === 86) narrativeText = `Outstanding goal-line stop! Cat-like reflexes from the goalkeeper under immense pressure!`;
      else if (minute >= 90) narrativeText = `The final whistle sounds! Match concluded and official outcome recorded.`;
      else {
        const ukBank = [
          `Patient build-up from ${h}, circulating possession calmly across the defensive third.`,
          `Solid defensive interception by ${a} to halt the forward momentum and reset play.`,
          `Curling cross delivered towards the far post, nodded away by the central defender.`,
          `Rapid counter attack developing down the right wing with options in the box.`,
          `Ambitious long-range drive from 25 yards, swerving narrowly over the crossbar.`,
          `Crisp one-touch passing sequence unlocking space between the opposition lines.`,
          `Aggressive high press wins the ball high up the pitch, creating an immediate opening.`,
          `Dangerous corner swung into the crowded 6-yard box, goalkeeper punches clear.`,
        ];
        narrativeText = ukBank[minute % ukBank.length];
      }

      speakNaija(narrativeText, 'normal', {
        lang: 'en-GB',
        onEnd: () => this.handleAudioEnded(),
      });
    }
  }

  // Continuous Playback: Smoothly advances upward minute-by-minute
  private handleAudioEnded() {
    if (this.isPaused) return;

    if (this.currentPlayheadMinute < 90) {
      this.currentPlayheadMinute++;
      // Small natural 600ms pause between commentary moments
      if (this.advanceDelayTimer) clearTimeout(this.advanceDelayTimer);
      this.advanceDelayTimer = setTimeout(() => {
        this.speakCurrentAndAutoAdvance();
      }, 600);
    } else {
      // Loop back to match highlights if user lets it run continuously
      this.currentPlayheadMinute = 1;
      if (this.advanceDelayTimer) clearTimeout(this.advanceDelayTimer);
      this.advanceDelayTimer = setTimeout(() => {
        this.speakCurrentAndAutoAdvance();
      }, 1000);
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
    if (this.advanceDelayTimer) clearTimeout(this.advanceDelayTimer);
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
    if (this.advanceDelayTimer) clearTimeout(this.advanceDelayTimer);
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
