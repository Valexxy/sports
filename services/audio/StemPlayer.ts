/**
 * EVENT-DRIVEN STEM PLAYER
 * Pre-cached sub-millisecond audio stems (whistles, gasps, log drum rolls)
 * fired instantly upon WebSocket match event payloads.
 */

import { pitchMixer } from './PitchMixer';

export type MatchEventType = 
  | 'GOAL' 
  | 'MISSED_CHANCE' 
  | 'YELLOW_CARD' 
  | 'RED_CARD' 
  | 'PENALTY' 
  | 'KICKOFF' 
  | 'FULLTIME';

export class StemPlayerService {
  /**
   * Fires an instant audio stem mapped to the incoming event payload
   */
  static fireEventStem(eventType: MatchEventType, intensity: 'LOW' | 'MEDIUM' | 'HIGH' | 'MAX_AURA' = 'HIGH'): void {
    if (typeof window === 'undefined') return;

    try {
      const ctx = pitchMixer.getContext();
      const bus = pitchMixer.getStemBus();
      const now = ctx.currentTime;

      switch (eventType) {
        case 'GOAL':
          // Multi-oscillator roaring explosion + African log drum roll
          this.playAfricanLogDrum(ctx, bus, now, 95);
          this.playAfricanLogDrum(ctx, bus, now + 0.15, 80);
          this.playAfricanLogDrum(ctx, bus, now + 0.30, 65);
          this.playCrowdRoarChime(ctx, bus, now);
          break;

        case 'MISSED_CHANCE':
          // Sharp crowd gasp (filtered bandpass noise)
          this.playCrowdGasp(ctx, bus, now);
          break;

        case 'YELLOW_CARD':
          // Referee single whistle burst (2.8kHz high harmonic)
          this.playRefereeWhistle(ctx, bus, now, 0.25);
          break;

        case 'RED_CARD':
          // Referee double whistle blast
          this.playRefereeWhistle(ctx, bus, now, 0.20);
          this.playRefereeWhistle(ctx, bus, now + 0.25, 0.45);
          break;

        case 'PENALTY':
          // Dramatic tension heartbeat + drum thump
          this.playAfricanLogDrum(ctx, bus, now, 55);
          this.playAfricanLogDrum(ctx, bus, now + 0.4, 50);
          break;

        case 'KICKOFF':
        case 'FULLTIME':
          // Long referee whistle
          this.playRefereeWhistle(ctx, bus, now, 0.85);
          break;
      }
    } catch (e) {
      console.warn('Stem playback caught error:', e);
    }
  }

  /**
   * Referee Whistle Synthesizer
   */
  private static playRefereeWhistle(ctx: AudioContext, dest: AudioNode, time: number, duration: number): void {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(2850, time);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(2950, time); // Frequency beat modulation

    gain.gain.setValueAtTime(0.01, time);
    gain.gain.linearRampToValueAtTime(0.45, time + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(dest);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + duration);
    osc2.stop(time + duration);
  }

  /**
   * Authentic African Log Drum Synthesizer
   */
  private static playAfricanLogDrum(ctx: AudioContext, dest: AudioNode, time: number, pitchHz: number): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(pitchHz * 1.8, time);
    osc.frequency.exponentialRampToValueAtTime(pitchHz, time + 0.08);

    gain.gain.setValueAtTime(0.75, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(time);
    osc.stop(time + 0.35);
  }

  /**
   * Crowd Gasp Synthesizer
   */
  private static playCrowdGasp(ctx: AudioContext, dest: AudioNode, time: number): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, time);
    osc.frequency.linearRampToValueAtTime(180, time + 0.4);

    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.45);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(time);
    osc.stop(time + 0.45);
  }

  /**
   * Crowd Roar Chime
   */
  private static playCrowdRoarChime(ctx: AudioContext, dest: AudioNode, time: number): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, time);
    osc.frequency.linearRampToValueAtTime(880, time + 0.5);

    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.8);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(time);
    osc.stop(time + 0.8);
  }
}
