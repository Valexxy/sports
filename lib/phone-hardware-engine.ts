'use client';

export type HapticStyle = 
  | 'SELECTION' 
  | 'SUCCESS' 
  | 'WARNING' 
  | 'GOAL' 
  | 'TALKING_DRUM' 
  | 'AFRO_BEAT' 
  | 'RED_CARD' 
  | 'FULLTIME_WIN';

class PhoneHardwareEngine {
  private hasVibration: boolean = false;
  private isIOSDevice: boolean = false;
  private audioCtx: AudioContext | null = null;
  private wakeLockSentinel: any = null;
  private originalThemeColor: string = '#05070B';

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.hasVibration = 'vibrate' in navigator;
        this.isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
          (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      } catch {}
    }
  }

  private ensureInitialized() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    try {
      this.initGyroscope();
      this.initIOSTapticElement();
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) {
        this.originalThemeColor = meta.getAttribute('content') || '#05070B';
      }
    } catch {}
  }

  /**
   * Universal Haptic Trigger (Works seamlessly on iOS and Android)
   */
  public triggerHaptic(style: HapticStyle = 'SELECTION') {
    if (typeof window === 'undefined') return;
    this.ensureInitialized();

    // 1. Android / Supported Devices: Native Vibration Motor
    if (this.hasVibration) {
      try {
        switch (style) {
          case 'GOAL':
            navigator.vibrate([250, 80, 350]);
            break;
          case 'TALKING_DRUM':
            navigator.vibrate([70, 40, 90, 40, 140]);
            break;
          case 'AFRO_BEAT':
            navigator.vibrate([80, 50, 80, 50, 180]);
            break;
          case 'SUCCESS':
            navigator.vibrate([100, 50, 150]);
            break;
          case 'WARNING':
            navigator.vibrate([200, 100, 200]);
            break;
          case 'RED_CARD':
            navigator.vibrate([400, 60, 400]);
            break;
          case 'FULLTIME_WIN':
            navigator.vibrate([150, 60, 150, 60, 150, 60, 500]);
            break;
          case 'SELECTION':
          default:
            navigator.vibrate(25);
            break;
        }
      } catch {}
    }

    // 2. iOS Devices: Dual-Vector Simulation (Taptic Engine Switch + Sub-Bass Transducer)
    if (this.isIOSDevice) {
      this.triggerIOSTapticClick();
      if (['GOAL', 'RED_CARD', 'FULLTIME_WIN', 'SUCCESS'].includes(style)) {
        this.playAcousticHapticThump(style);
      }
    }

    // 3. Universal Visual Strobe Flash & Dynamic Status Bar Tint
    switch (style) {
      case 'GOAL':
        this.flashScreenPerimeter('#00e676');
        this.tintStatusBar('#00e676', 700);
        break;
      case 'RED_CARD':
        this.flashScreenPerimeter('#FF2D2D');
        this.tintStatusBar('#FF2D2D', 800);
        break;
      case 'FULLTIME_WIN':
      case 'AFRO_BEAT':
        this.flashScreenPerimeter('#FFD700');
        this.tintStatusBar('#FFD700', 700);
        break;
      default:
        break;
    }
  }

  /**
   * iOS Taptic Engine Switch Trigger
   * Simulates physical micro-clicks via iOS WebKit switch input behaviors
   */
  private initIOSTapticElement() {
    if (typeof document === 'undefined' || !this.isIOSDevice) return;
    if (document.getElementById('ios-taptic-switch')) return;

    try {
      const input = document.createElement('input');
      input.type = 'checkbox';
      (input as any).setAttribute('switch', 'true');
      input.id = 'ios-taptic-switch';
      input.style.position = 'absolute';
      input.style.opacity = '0';
      input.style.pointerEvents = 'none';
      input.style.width = '1px';
      input.style.height = '1px';
      input.style.left = '-9999px';
      if (document.body) {
        document.body.appendChild(input);
      }
    } catch {}
  }

  private triggerIOSTapticClick() {
    if (typeof document === 'undefined' || !this.isIOSDevice) return;
    try {
      const switchEl = document.getElementById('ios-taptic-switch') as HTMLInputElement;
      if (switchEl) {
        switchEl.checked = !switchEl.checked;
      }
    } catch {}
  }

  /**
   * Acoustic Sub-Bass Haptic Transducer
   * Generates a 38Hz - 45Hz sub-bass sine wave burst that causes the iPhone
   * speaker enclosure to physically vibrate in the user's hand.
   */
  private playAcousticHapticThump(style: HapticStyle) {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioCtx) this.audioCtx = new AudioCtx();
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      const freq = style === 'RED_CARD' ? 32 : style === 'GOAL' ? 44 : 40;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.7, this.audioCtx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.14);
    } catch {}
  }

  /**
   * Screen Edge Perimeter Strobe Flash (Hardware Accelerated)
   */
  public flashScreenPerimeter(color: string) {
    if (typeof document === 'undefined') return;
    const flashEl = document.createElement('div');
    flashEl.style.position = 'fixed';
    flashEl.style.inset = '0';
    flashEl.style.pointerEvents = 'none';
    flashEl.style.boxShadow = `inset 0 0 50px ${color}`;
    flashEl.style.zIndex = '99999';
    flashEl.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    flashEl.style.opacity = '1';
    flashEl.style.willChange = 'opacity';
    document.body.appendChild(flashEl);

    setTimeout(() => {
      flashEl.style.opacity = '0';
      setTimeout(() => flashEl.remove(), 600);
    }, 400);
  }

  /**
   * Dynamic System Status Bar Tinting
   * Syncs the mobile browser status bar / notch / island color with match events
   */
  public tintStatusBar(color: string, durationMs: number = 600) {
    if (typeof document === 'undefined') return;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;

    meta.setAttribute('content', color);
    setTimeout(() => {
      meta.setAttribute('content', this.originalThemeColor);
    }, durationMs);
  }

  /**
   * Screen Wake Lock API (Keeps mobile display awake during 90-minute live matches)
   */
  public async requestWakeLock(): Promise<boolean> {
    if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) return false;
    try {
      this.wakeLockSentinel = await (navigator as any).wakeLock.request('screen');
      this.wakeLockSentinel.addEventListener('release', () => {
        this.wakeLockSentinel = null;
      });
      return true;
    } catch {
      return false;
    }
  }

  public releaseWakeLock() {
    if (this.wakeLockSentinel) {
      try {
        this.wakeLockSentinel.release();
        this.wakeLockSentinel = null;
      } catch {}
    }
  }

  /**
   * Lock Screen & Dynamic Island Live Activity Feed (MediaSession API)
   * Broadcasts live scores, team crests, and match status to:
   * - iOS Lock Screen & Dynamic Island
   * - Android Notification Drawer & Always-On Display
   */
  public publishLockScreenMatch(
    homeTeam: string,
    awayTeam: string,
    homeScore: number,
    awayScore: number,
    minute: string,
    isLive: boolean
  ) {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;

    try {
      const title = isLive
        ? `⚽ ${homeTeam} ${homeScore} - ${awayScore} ${awayTeam} (${minute || 'LIVE'})`
        : `⚡ ${homeTeam} vs ${awayTeam} — Match Intelligence`;

      navigator.mediaSession.metadata = new MediaMetadata({
        title,
        artist: 'Mivaj Sports Live Match Center',
        album: 'Dixon-Coles Poisson Referee Settlement Wire',
        artwork: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      });
    } catch {}
  }

  /**
   * Hardware Gyroscope & Accelerometer 3D Tilt Parallax
   */
  private initGyroscope() {
    if (typeof window === 'undefined' || !window.DeviceOrientationEvent) return;

    window.addEventListener('deviceorientation', (e) => {
      const tiltX = (e.gamma || 0) * 0.12;
      const tiltY = (e.beta || 0) * 0.12;
      document.documentElement.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}px`);
      document.documentElement.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}px`);
    }, { passive: true });
  }
}

export const phoneHardware = new PhoneHardwareEngine();
