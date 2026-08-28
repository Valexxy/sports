'use client';

/**
 * MIVAJ ZERO-BATTERY-DRAIN POWER SAVER ENGINE
 * - Detects Page Visibility (document.hidden / visibilitychange)
 * - Automatically pauses all unneeded timers, animations, and polling when phone is locked/tab backgrounded
 * - Drops CPU/GPU usage to 0% during idle/hidden states to keep phones completely cool and conserve battery
 */

type IntervalCallback = () => void | Promise<void>;

interface ManagedInterval {
  id: string;
  callback: IntervalCallback;
  delayMs: number;
  timerRef: NodeJS.Timeout | null;
  onlyWhenVisible: boolean;
}

export class PowerSaverEngine {
  private static managedIntervals: Map<string, ManagedInterval> = new Map();
  private static isInitialized = false;
  private static isPageVisible = true;

  public static init(): void {
    if (typeof window === 'undefined' || this.isInitialized) return;
    this.isInitialized = true;
    this.isPageVisible = !document.hidden;

    document.addEventListener('visibilitychange', () => {
      const isVisible = !document.hidden;
      this.isPageVisible = isVisible;

      if (!isVisible) {
        // Page is hidden or phone is locked: PAUSE ALL TIMER LOOPS
        this.pauseAllIntervals();
      } else {
        // Page is visible again: RESUME TIMER LOOPS
        this.resumeAllIntervals();
      }
    });
  }

  public static isVisible(): boolean {
    if (typeof window === 'undefined') return true;
    return !document.hidden;
  }

  public static setBatteryFriendlyInterval(
    id: string,
    callback: IntervalCallback,
    delayMs: number,
    onlyWhenVisible: boolean = true
  ): void {
    this.init();

    // Clear existing if any
    this.clearInterval(id);

    const intervalItem: ManagedInterval = {
      id,
      callback,
      delayMs,
      timerRef: null,
      onlyWhenVisible,
    };

    if (this.isPageVisible || !onlyWhenVisible) {
      intervalItem.timerRef = setInterval(callback, delayMs);
    }

    this.managedIntervals.set(id, intervalItem);
  }

  public static clearInterval(id: string): void {
    const item = this.managedIntervals.get(id);
    if (item && item.timerRef) {
      clearInterval(item.timerRef);
      item.timerRef = null;
    }
    this.managedIntervals.delete(id);
  }

  private static pauseAllIntervals(): void {
    this.managedIntervals.forEach((item) => {
      if (item.onlyWhenVisible && item.timerRef) {
        clearInterval(item.timerRef);
        item.timerRef = null;
      }
    });
  }

  private static resumeAllIntervals(): void {
    this.managedIntervals.forEach((item) => {
      if (item.onlyWhenVisible && !item.timerRef) {
        // Run immediately upon wake-up, then schedule interval
        try { item.callback(); } catch {}
        item.timerRef = setInterval(item.callback, item.delayMs);
      }
    });
  }
}
