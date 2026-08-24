'use client';

type HapticStyle = 'SELECTION' | 'SUCCESS' | 'WARNING' | 'GOAL' | 'TALKING_DRUM' | 'AFRO_BEAT';

class PhoneHardwareEngine {
  private isSupported: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.isSupported = 'vibrate' in navigator;
      this.initGyroscope();
    }
  }

  public triggerHaptic(style: HapticStyle = 'SELECTION') {
    if (!this.isSupported || typeof window === 'undefined') return;

    try {
      switch (style) {
        case 'GOAL':
          // Heavy double African drum impact
          navigator.vibrate([250, 80, 350]);
          this.flashScreenPerimeter('#00e676');
          break;
        case 'TALKING_DRUM':
          // Rhythmic Gangan 3-pulse vibration
          navigator.vibrate([70, 40, 90, 40, 140]);
          break;
        case 'AFRO_BEAT':
          // Syncopated victory pulse
          navigator.vibrate([80, 50, 80, 50, 180]);
          this.flashScreenPerimeter('#ffd700');
          break;
        case 'SUCCESS':
          navigator.vibrate([100, 50, 150]);
          break;
        case 'WARNING':
          navigator.vibrate([200, 100, 200]);
          break;
        case 'SELECTION':
        default:
          navigator.vibrate(25);
          break;
      }
    } catch {}
  }

  /** Screen edge perimeter flash for live goals and big wins */
  private flashScreenPerimeter(color: string) {
    if (typeof document === 'undefined') return;
    const flashEl = document.createElement('div');
    flashEl.style.position = 'fixed';
    flashEl.style.inset = '0';
    flashEl.style.pointerEvents = 'none';
    flashEl.style.boxShadow = `inset 0 0 45px ${color}`;
    flashEl.style.zIndex = '99999';
    flashEl.style.transition = 'opacity 0.6s ease-out';
    flashEl.style.opacity = '1';
    document.body.appendChild(flashEl);

    setTimeout(() => {
      flashEl.style.opacity = '0';
      setTimeout(() => flashEl.remove(), 600);
    }, 400);
  }

  /** Subtle 3D Gyroscope Motion Listener for mobile tilt parallax */
  private initGyroscope() {
    if (typeof window === 'undefined' || !window.DeviceOrientationEvent) return;
    window.addEventListener('deviceorientation', (e) => {
      const tiltX = (e.gamma || 0) * 0.1;
      const tiltY = (e.beta || 0) * 0.1;
      document.documentElement.style.setProperty('--tilt-x', `${tiltX}px`);
      document.documentElement.style.setProperty('--tilt-y', `${tiltY}px`);
    }, { passive: true });
  }
}

export const phoneHardware = new PhoneHardwareEngine();
