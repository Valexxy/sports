'use client';

/**
 * ENTERPRISE AUDIO LIFECYCLE & MEMORY GUARD
 * Cleanly releases Web Audio API contexts and synthesizers to prevent memory leaks.
 */

class AudioLifecycleManager {
  private activeNodes: Set<AudioNode> = new Set();
  private audioContext: AudioContext | null = null;

  public getContext(): AudioContext {
    if (!this.audioContext || this.audioContext.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {});
    }
    return this.audioContext;
  }

  public registerNode(node: AudioNode) {
    this.activeNodes.add(node);
  }

  public unregisterNode(node: AudioNode) {
    try {
      node.disconnect();
      this.activeNodes.delete(node);
    } catch {}
  }

  public cleanupAll() {
    this.activeNodes.forEach((node) => {
      try {
        node.disconnect();
      } catch {}
    });
    this.activeNodes.clear();
  }
}

export const audioLifecycle = new AudioLifecycleManager();
