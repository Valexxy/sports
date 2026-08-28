// iOS Live Activities & Android Lock Screen Media Session Match Tracker
import { MatchData } from './sports-api';

export class LockScreenMatchTracker {
  /**
   * Pins live match scores, clock & commentary to phone lock screen via MediaSession & Persistent Notifications
   */
  public static async pinMatchToLockScreen(match: MatchData, commentaryText?: string): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    const scoreTitle = `${match.homeTeam} ${match.homeScore ?? 0} - ${match.awayScore ?? 0} ${match.awayTeam}`;
    const clockStatus = match.status === 'LIVE'
      ? `LIVE ${match.matchTime || "In-Play"}`
      : match.status === 'FINISHED'
      ? 'FULL TIME (FT)'
      : `Kickoff at ${match.matchTime || '19:00'}`;

    // 1. iOS / Android Native MediaSession Lock Screen Integration
    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: `${scoreTitle} (${clockStatus})`,
          artist: commentaryText || `Mivaj Live Stadium Commentary 🎙️`,
          album: match.league || 'World Sports Live Arena',
          artwork: [
            { src: match.homeLogo || '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: match.awayLogo || '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
          ],
        });

        // Set action handlers for lockscreen controls
        navigator.mediaSession.setActionHandler('play', () => {});
        navigator.mediaSession.setActionHandler('pause', () => {});
      } catch (e) {
        console.warn('MediaSession lockscreen error:', e);
      }
    }

    // 2. Persistent Notification for Phone Lock Screen
    if ('Notification' in window) {
      try {
        if (Notification.permission !== 'granted') {
          const perm = await Notification.requestPermission();
          if (perm !== 'granted') return true;
        }

        const notificationTitle = `⚽ ${scoreTitle}`;
        const notificationBody = `🔴 ${clockStatus} • ${match.league} • ${commentaryText || 'Live Match Tracking on Mivaj Sports'}`;

        if ('serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.getRegistration();
          if (reg) {
            await reg.showNotification(notificationTitle, {
              body: notificationBody,
              icon: match.homeLogo || '/icon-192x192.png',
              badge: '/icon-192x192.png',
              tag: `mivaj-live-${match.id}`,
              requireInteraction: true,
              renotify: true,
              silent: false,
              data: { matchId: match.id, url: '/' },
            } as any);
            return true;
          }
        }

        new Notification(notificationTitle, {
          body: notificationBody,
          icon: match.homeLogo || '/icon-192x192.png',
          tag: `mivaj-live-${match.id}`,
          requireInteraction: true,
        });
        return true;
      } catch (e) {
        console.warn('Lock screen notification error:', e);
      }
    }

    return true;
  }
}
