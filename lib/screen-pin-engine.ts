'use client';

import { MatchData } from './sports-api';
import { stadiumAudio } from './sound-synthesizer';
import { stadiumBroadcastAudio } from './stadium-broadcast-audio-engine';
import { phoneHardware } from './phone-hardware-engine';

export interface PinnedMatchState {
  match: MatchData;
  activeLanguage: string;
  isPlayingAudio: boolean;
  currentMinute: number;
  timeStr: string;
}

class ScreenPinEngine {
  private pinnedMatch: MatchData | null = null;
  private listeners: Set<(state: PinnedMatchState | null) => void> = new Set();
  private activeLang: string = 'pidgin';
  private isAudioPlaying: boolean = false;
  private currentMin: number = 28;
  private timeStr: string = "28:00";
  private liveClockInterval: any = null;

  public subscribe(cb: (state: PinnedMatchState | null) => void): () => void {
    this.listeners.add(cb);
    cb(this.getState());
    return () => this.listeners.delete(cb);
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((cb) => cb(state));
  }

  public getState(): PinnedMatchState | null {
    if (!this.pinnedMatch) return null;
    return {
      match: this.pinnedMatch,
      activeLanguage: this.activeLang,
      isPlayingAudio: this.isAudioPlaying,
      currentMinute: this.currentMin,
      timeStr: this.timeStr,
    };
  }

  public pinMatch(match: MatchData) {
    this.pinnedMatch = match;
    this.currentMin = this.parseMinute(match.matchTime);
    this.timeStr = `${this.currentMin}:00`;
    this.isAudioPlaying = false;

    try {
      stadiumAudio.enableOnUserClick();
      stadiumAudio.playAddPickSound();
      phoneHardware.triggerHaptic('SUCCESS');
    } catch {}

    // Live clock ticker
    if (this.liveClockInterval) clearInterval(this.liveClockInterval);
    let seconds = 0;
    this.liveClockInterval = setInterval(() => {
      if (this.pinnedMatch && this.pinnedMatch.status === 'LIVE') {
        seconds++;
        if (seconds >= 60) {
          this.currentMin = Math.min(90, this.currentMin + 1);
          seconds = 0;
        }
        this.timeStr = `${this.currentMin}:${seconds < 10 ? '0' + seconds : seconds}`;
        this.notify();
      }
    }, 1000);

    this.notify();
  }

  public unpin() {
    this.pinnedMatch = null;
    this.isAudioPlaying = false;
    if (this.liveClockInterval) clearInterval(this.liveClockInterval);
    stadiumBroadcastAudio.pauseBroadcast();
    this.notify();
  }

  public toggleAudio() {
    if (!this.pinnedMatch) return;
    try {
      stadiumAudio.enableOnUserClick();
      phoneHardware.triggerHaptic('SELECTION');
    } catch {}

    if (this.isAudioPlaying) {
      this.isAudioPlaying = false;
      stadiumBroadcastAudio.pauseBroadcast();
    } else {
      this.isAudioPlaying = true;
      const onTick = (time: string, _playing: boolean, min: number) => {
        this.timeStr = time;
        this.currentMin = min;
        this.notify();
      };

      if (this.activeLang === 'en') {
        stadiumBroadcastAudio.startEnglishBroadcast(
          this.pinnedMatch.homeTeam,
          this.pinnedMatch.awayTeam,
          this.currentMin,
          onTick
        );
      } else {
        stadiumBroadcastAudio.startPidginBroadcast(
          this.pinnedMatch.homeTeam,
          this.pinnedMatch.awayTeam,
          this.currentMin,
          onTick
        );
      }
    }
    this.notify();
  }

  public setLanguage(lang: string) {
    this.activeLang = lang;
    if (this.isAudioPlaying && this.pinnedMatch) {
      stadiumBroadcastAudio.pauseBroadcast();
      const onTick = (time: string, _playing: boolean, min: number) => {
        this.timeStr = time;
        this.currentMin = min;
        this.notify();
      };

      if (lang === 'en') {
        stadiumBroadcastAudio.startEnglishBroadcast(
          this.pinnedMatch.homeTeam,
          this.pinnedMatch.awayTeam,
          this.currentMin,
          onTick
        );
      } else {
        stadiumBroadcastAudio.startPidginBroadcast(
          this.pinnedMatch.homeTeam,
          this.pinnedMatch.awayTeam,
          this.currentMin,
          onTick
        );
      }
    }
    this.notify();
  }

  private parseMinute(timeStr?: string): number {
    if (!timeStr) return 28;
    const clean = timeStr.replace(/[^0-9]/g, '');
    const num = parseInt(clean, 10);
    return isNaN(num) || num <= 0 ? 28 : Math.min(90, num);
  }
}

export const screenPinEngine = new ScreenPinEngine();
