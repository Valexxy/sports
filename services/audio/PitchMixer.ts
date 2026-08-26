/**
 * NATIVE WEB AUDIO MULTI-TRACK PITCH MIXER
 * Strictly zero third-party audio dependencies.
 * Manages Master, Ambient Stadium Looper, Foreground Commentary, and Audio Ducking.
 */

class PitchMixerService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private commentaryGain: GainNode | null = null;
  private stemGain: GainNode | null = null;
  
  private ambientSource: AudioBufferSourceNode | null = null;
  private isAmbientPlaying = false;
  private isDucked = false;

  private initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Ambient Bus (Background Stadium Roar)
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);

      // Commentary Bus (Foreground Voice)
      this.commentaryGain = this.ctx.createGain();
      this.commentaryGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
      this.commentaryGain.connect(this.masterGain);

      // Event Stem Bus (Gasps, Whistles, Log Drums)
      this.stemGain = this.ctx.createGain();
      this.stemGain.gain.setValueAtTime(0.80, this.ctx.currentTime);
      this.stemGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    return this.ctx;
  }

  public getContext(): AudioContext {
    return this.initContext();
  }

  public getStemBus(): GainNode {
    this.initContext();
    return this.stemGain!;
  }

  public getCommentaryBus(): GainNode {
    this.initContext();
    return this.commentaryGain!;
  }

  /**
   * Starts the continuous background ambient stadium sound loop
   */
  public startAmbientStadiumLoop(): void {
    if (this.isAmbientPlaying || typeof window === 'undefined') return;

    try {
      const ctx = this.initContext();
      
      // Synthesize deep continuous stadium crowd rumble using pink noise buffer
      const bufferSize = ctx.sampleRate * 4; // 4 second loop
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
        b6 = white * 0.115926;
      }

      this.ambientSource = ctx.createBufferSource();
      this.ambientSource.buffer = noiseBuffer;
      this.ambientSource.loop = true;

      // Filter to simulate stadium echo
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(420, ctx.currentTime);

      this.ambientSource.connect(filter);
      filter.connect(this.ambientGain!);

      this.ambientSource.start(0);
      this.isAmbientPlaying = true;
    } catch (e) {
      console.warn('Ambient stadium loop fallback:', e);
    }
  }

  /**
   * Audio Ducking: Reduces ambient stadium volume by 40% during active commentary
   */
  public duckAmbient(): void {
    if (!this.ctx || !this.ambientGain || this.isDucked) return;
    this.isDucked = true;
    const now = this.ctx.currentTime;
    // Smoothly ramp down by 40% (0.35 -> 0.21) over 180ms
    this.ambientGain.gain.cancelScheduledValues(now);
    this.ambientGain.gain.linearRampToValueAtTime(0.21, now + 0.18);
  }

  /**
   * Restores ambient stadium volume back to 100% when commentary ends
   */
  public restoreAmbient(): void {
    if (!this.ctx || !this.ambientGain || !this.isDucked) return;
    this.isDucked = false;
    const now = this.ctx.currentTime;
    // Smoothly ramp back up over 350ms
    this.ambientGain.gain.cancelScheduledValues(now);
    this.ambientGain.gain.linearRampToValueAtTime(0.35, now + 0.35);
  }
}

export const pitchMixer = new PitchMixerService();
