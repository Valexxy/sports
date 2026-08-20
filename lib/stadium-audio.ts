/**
 * WEB AUDIO API STADIUM SOUND SYNTHESIZER
 * Synthesizes real stadium crowd cheer roars on the fly using Web Audio oscillators.
 * Zero MP3 downloads required ($0 bandwidth cost).
 */

export function playSynthesizedStadiumRoar() {
  if (typeof window === 'undefined') return;

  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();

    // Create White Noise Buffer for Crowd Cheer
    const bufferSize = ctx.sampleRate * 2.5; // 2.5 seconds cheer
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    // Filter to sound like stadium crowd roar (Bandpass filter)
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, ctx.currentTime);
    filter.Q.setValueAtTime(1.5, ctx.currentTime);

    // Gain Envelope for Crowd Surge
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + 0.4); // Surge up
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.4); // Fade out

    // Connect Nodes: Noise -> Filter -> Gain -> Speakers
    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    whiteNoise.start();
    whiteNoise.stop(ctx.currentTime + 2.5);
  } catch (e) {
    console.warn('Web Audio Stadium Synth not initialized (requires user interaction).');
  }
}
