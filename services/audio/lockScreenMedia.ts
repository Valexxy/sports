/**
 * LOCK-SCREEN MEDIA SESSION & BACKGROUND COMMENTARY MANAGER
 * Binds match telemetry to OS-level media session controls (navigator.mediaSession).
 */

import { LiveMatchNotificationPayload } from '../push/liveActivityStreamer';

export class LockScreenMediaService {
  private static isInitialized = false;

  /**
   * Updates the OS lock screen media card with live score and artwork
   */
  static updateMediaSession(payload: LiveMatchNotificationPayload): void {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `[LIVE] ${payload.homeTeam.name} ${payload.homeTeam.score} - ${payload.awayTeam.score} ${payload.awayTeam.name}`,
        artist: 'Mivaj Live Stadium Commentary',
        album: payload.latestCommentary || 'High-Tension Matchday Telemetry',
        artwork: [
          { src: payload.homeTeam.crestUrl || '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: payload.awayTeam.crestUrl || '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      });

      if (!this.isInitialized) {
        this.bindMediaActionHandlers();
        this.isInitialized = true;
      }
    } catch (e) {
      console.warn('MediaSession caught error:', e);
    }
  }

  /**
   * Binds 1-tap lock screen action handlers
   */
  private static bindMediaActionHandlers(): void {
    try {
      navigator.mediaSession.setActionHandler('play', () => {
        console.log('Lock screen Play triggered');
      });

      navigator.mediaSession.setActionHandler('pause', () => {
        console.log('Lock screen Pause triggered');
      });

      navigator.mediaSession.setActionHandler('nexttrack', () => {
        console.log('Next match commentary snippet triggered');
      });
    } catch (e) {}
  }
}
