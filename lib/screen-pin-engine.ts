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
}

class ScreenPinEngine {
  private pinnedMatch: MatchData | null = null;
  private pipWindow: any = null;
  private listeners: Set<(state: PinnedMatchState | null) => void> = new Set();
  private timerInterval: any = null;
  private activeLang: string = 'pidgin';
  private isAudioPlaying: boolean = false;
  private currentMin: number = 15;

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
    };
  }

  public pinMatch(match: MatchData) {
    this.pinnedMatch = match;
    this.currentMin = this.parseMinute(match.matchTime);
    this.isAudioPlaying = false;

    // Trigger confirmation sound & vibration
    try {
      stadiumAudio.enableOnUserClick();
      stadiumAudio.playAddPickSound();
      phoneHardware.triggerHaptic('SUCCESS');
    } catch {}

    // Start in-match progression timer
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.pinnedMatch && this.pinnedMatch.status === 'LIVE') {
        this.currentMin = Math.min(90, this.currentMin + 1);
        this.notify();
      }
    }, 45000);

    this.notify();

    // Check for native Document Picture-in-Picture support (Chrome/Edge/Desktop)
    if (typeof window !== 'undefined' && 'documentPictureInPicture' in window) {
      this.openDocumentPiP();
    }
  }

  public unpin() {
    this.pinnedMatch = null;
    this.isAudioPlaying = false;
    if (this.timerInterval) clearInterval(this.timerInterval);
    stadiumBroadcastAudio.pauseBroadcast();
    if (this.pipWindow && !this.pipWindow.closed) {
      this.pipWindow.close();
      this.pipWindow = null;
    }
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
      if (this.activeLang === 'en') {
        stadiumBroadcastAudio.startEnglishBroadcast(
          this.pinnedMatch.homeTeam,
          this.pinnedMatch.awayTeam,
          this.currentMin,
          () => {}
        );
      } else {
        stadiumBroadcastAudio.startPidginBroadcast(
          this.pinnedMatch.homeTeam,
          this.pinnedMatch.awayTeam,
          this.currentMin,
          () => {},
          this.activeLang
        );
      }
    }
    this.notify();
  }

  public setLanguage(lang: string) {
    this.activeLang = lang;
    if (this.isAudioPlaying && this.pinnedMatch) {
      stadiumBroadcastAudio.pauseBroadcast();
      if (lang === 'en') {
        stadiumBroadcastAudio.startEnglishBroadcast(
          this.pinnedMatch.homeTeam,
          this.pinnedMatch.awayTeam,
          this.currentMin,
          () => {}
        );
      } else {
        stadiumBroadcastAudio.startPidginBroadcast(
          this.pinnedMatch.homeTeam,
          this.pinnedMatch.awayTeam,
          this.currentMin,
          () => {},
          lang
        );
      }
    }
    this.notify();
  }

  public triggerGoalEffect(team: string) {
    try {
      stadiumAudio.playGoalCelebration();
      phoneHardware.triggerHaptic('GOAL');
    } catch {}
  }

  private parseMinute(timeStr?: string): number {
    if (!timeStr) return 15;
    const m = timeStr.match(/(\d+)/);
    return m ? parseInt(m[1], 10) : 15;
  }

  private async openDocumentPiP() {
    try {
      const pip = await (window as any).documentPictureInPicture.requestWindow({
        width: 360,
        height: 220,
      });
      this.pipWindow = pip;

      // Copy stylesheets to PiP window
      [...document.styleSheets].forEach((styleSheet) => {
        try {
          const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join('');
          const style = pip.document.createElement('style');
          style.textContent = cssRules;
          pip.document.head.appendChild(style);
        } catch {
          const link = pip.document.createElement('link');
          link.rel = 'stylesheet';
          link.href = (styleSheet as any).href;
          pip.document.head.appendChild(link);
        }
      });

      this.renderPiPContent(pip);

      pip.addEventListener('pagehide', () => {
        this.pipWindow = null;
      });
    } catch (e) {
      console.log('Document PiP fallback to on-screen floating island');
    }
  }

  private renderPiPContent(pip: any) {
    if (!this.pinnedMatch) return;
    const m = this.pinnedMatch;
    pip.document.body.className = 'bg-black text-white font-mono p-3 m-0 overflow-hidden select-none';
    pip.document.body.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:8px; border:2px solid #10B981; border-radius:16px; padding:12px; background:rgba(0,0,0,0.95); height:100%; box-sizing:border-box;">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:6px;">
          <span style="color:#10B981; font-weight:900; font-size:11px;">🔴 PINNED LIVE • ${this.currentMin}'</span>
          <span style="color:#F59E0B; font-size:10px;">${m.league || 'AuraScore'}</span>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:14px; font-weight:900;">
          <span>${m.homeTeam}</span>
          <span style="background:#111; border:1px solid rgba(255,255,255,0.2); padding:2px 8px; border-radius:8px; color:#10B981;">${m.homeScore ?? 0} - ${m.awayScore ?? 0}</span>
          <span>${m.awayTeam}</span>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto; padding-top:6px; border-top:1px solid rgba(255,255,255,0.1);">
          <span style="font-size:10px; color:#aaa;">🎙️ Live Stadium Voice</span>
          <button id="pip-audio-btn" style="background:#10B981; color:#000; border:none; padding:4px 10px; border-radius:8px; font-weight:900; font-size:10px; cursor:pointer;">
            ${this.isAudioPlaying ? '⏸️ Pause' : '▶️ Play Audio'}
          </button>
        </div>
      </div>
    `;

    const btn = pip.document.getElementById('pip-audio-btn');
    if (btn) {
      btn.onclick = () => {
        this.toggleAudio();
        btn.textContent = this.isAudioPlaying ? '⏸️ Pause' : '▶️ Play Audio';
      };
    }
  }
}

export const screenPinEngine = new ScreenPinEngine();
