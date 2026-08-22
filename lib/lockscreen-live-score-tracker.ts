// Google/Apple Live Activities Style Persistent Lock Screen Match Tracker
import { MatchData } from './sports-api';

export class LockScreenMatchTracker {
  public static async pinMatchToLockScreen(match: MatchData): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    // Check Notification API permission
    if ('Notification' in window) {
      if (Notification.permission !== 'granted') {
        const perm = await Notification.requestPermission();
        if (perm !== 'granted') return false;
      }

      const title = `⚽ ${match.homeTeam} ${match.homeScore ?? 0} - ${match.awayScore ?? 0} ${match.awayTeam}`;
      const body = match.status === 'LIVE'
        ? `🔴 LIVE ${match.matchTime || "In-Play"} • ${match.league} • Pinned to Lock Screen`
        : match.status === 'FINISHED'
        ? `✅ FULL TIME • Final Score: ${match.homeScore ?? 0} - ${match.awayScore ?? 0}`
        : `🟡 UPCOMING • Kickoff at ${match.matchTime} • ${match.league}`;

      // Try Service Worker registration for rich persistent notification
      if ('serviceWorker' in navigator) {
        try {
          const reg = await navigator.serviceWorker.getRegistration();
          if (reg) {
            await reg.showNotification(title, {
              body,
              icon: match.homeLogo || '/icon-192x192.png',
              badge: '/icon-192x192.png',
              tag: `live-lockscreen-${match.id}`,
              requireInteraction: true, // Persists on phone lock screen
              renotify: true,
              silent: false,
              data: { matchId: match.id, url: '/' },
              actions: [
                { action: 'open_match', title: '⚽ View Live Match' },
                { action: 'listen_commentary', title: '🎙️ Listen Commentary' },
              ],
            } as any);
            return true;
          }
        } catch (e) {
          console.warn('Service worker lock screen alert error:', e);
        }
      }

      // Fallback standard notification
      new Notification(title, {
        body,
        icon: match.homeLogo || '/icon-192x192.png',
        tag: `live-lockscreen-${match.id}`,
        requireInteraction: true,
      });
      return true;
    }
    return false;
  }
}
