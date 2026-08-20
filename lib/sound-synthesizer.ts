'use client';

// Web Audio API Stadium Sound Synthesizer (Zero external audio files needed)
class StadiumAudioEngine {
  private audioCtx: AudioContext | null = null;
  public isMuted: boolean = false;

  private init() {
    if (typeof window !== 'undefined' && !this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  // Play realistic synthesized crowd roar / stadium chime
  public playCrowdRoar() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      
      // Multi-tone Stadium Chime & Crowd Whistle
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C - E - G - High C
      freqs.forEach((freq, idx) => {
        const osc = this.audioCtx!.createOscillator();
        const gain = this.audioCtx!.createGain();

        osc.type = idx === 3 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.01, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.2, now + idx * 0.08 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.6);

        osc.connect(gain);
        gain.connect(this.audioCtx!.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.65);
      });

      // Low frequency crowd rumble
      const noiseGain = this.audioCtx.createGain();
      const oscLow = this.audioCtx.createOscillator();
      oscLow.type = 'sawtooth';
      oscLow.frequency.setValueAtTime(110, now);
      oscLow.frequency.exponentialRampToValueAtTime(220, now + 0.4);

      noiseGain.gain.setValueAtTime(0.05, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      oscLow.connect(noiseGain);
      noiseGain.connect(this.audioCtx.destination);
      oscLow.start(now);
      oscLow.stop(now + 0.5);

    } catch (e) {
      console.warn('Audio playback not allowed yet');
    }
  }

  // Play realistic synthesized referee kickoff / full-time whistle
  public playWhistle() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(2800, now);
      osc.frequency.linearRampToValueAtTime(3200, now + 0.1);
      osc.frequency.linearRampToValueAtTime(2900, now + 0.3);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      console.warn('Audio whistle playback not allowed yet');
    }
  }
}

export const stadiumAudio = new StadiumAudioEngine();
