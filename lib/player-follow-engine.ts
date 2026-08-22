'use client';

/**
 * PLAYER FOLLOW & LOCK SCREEN MATCH ALERT ENGINE
 * Tracks followed players and dispatches native lock screen notifications
 */

export interface FollowedPlayer {
  id: string;
  name: string;
  club: string;
  country: string;
  position: string;
  rating: number;
  photo?: string;
}

export const FEATURED_PLAYERS_CATALOG: FollowedPlayer[] = [
  { id: 'p-haaland', name: 'Erling Haaland', club: 'Manchester City', country: 'Norway', position: 'ST', rating: 91 },
  { id: 'p-saka', name: 'Bukayo Saka', club: 'Arsenal', country: 'England 🇳🇬', position: 'RW', rating: 88 },
  { id: 'p-salah', name: 'Mohamed Salah', club: 'Liverpool', country: 'Egypt', position: 'RW', rating: 89 },
  { id: 'p-osimhen', name: 'Victor Osimhen', club: 'Galatasaray / Napoli', country: 'Nigeria 🇳🇬', position: 'ST', rating: 88 },
  { id: 'p-vinicius', name: 'Vinicius Jr', club: 'Real Madrid', country: 'Brazil', position: 'LW', rating: 90 },
  { id: 'p-bellingham', name: 'Jude Bellingham', club: 'Real Madrid', country: 'England', position: 'AM', rating: 90 },
  { id: 'p-mbappe', name: 'Kylian Mbappé', club: 'Real Madrid', country: 'France', position: 'ST', rating: 91 },
  { id: 'p-lookman', name: 'Ademola Lookman', club: 'Atalanta', country: 'Nigeria 🇳🇬', position: 'LW', rating: 85 },
  { id: 'p-palmer', name: 'Cole Palmer', club: 'Chelsea', country: 'England', position: 'AM', rating: 86 },
  { id: 'p-boniface', name: 'Victor Boniface', club: 'Bayer Leverkusen', country: 'Nigeria 🇳🇬', position: 'ST', rating: 84 },
  { id: 'p-ronaldo', name: 'Cristiano Ronaldo', club: 'Al Nassr', country: 'Portugal', position: 'ST', rating: 86 },
  { id: 'p-messi', name: 'Lionel Messi', club: 'Inter Miami', country: 'Argentina', position: 'RW', rating: 88 },
];

class PlayerFollowManager {
  private STORAGE_KEY = 'aurascore_followed_players';

  public getFollowedPlayers(): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  public toggleFollowPlayer(playerName: string): boolean {
    if (typeof window === 'undefined') return false;
    const current = this.getFollowedPlayers();
    let updated: string[];
    let isNowFollowed = false;

    if (current.includes(playerName)) {
      updated = current.filter((p) => p !== playerName);
      isNowFollowed = false;
    } else {
      updated = [...current, playerName];
      isNowFollowed = true;
      // Trigger instant lock screen alert sample
      this.sendLockScreenAlert(
        `⭐ Following ${playerName}`,
        `You will receive instant lock-screen notifications whenever ${playerName} starts a match or scores!`
      );
    }

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    } catch {}

    return isNowFollowed;
  }

  public isPlayerFollowed(playerName: string): boolean {
    return this.getFollowedPlayers().includes(playerName);
  }

  public async sendLockScreenAlert(title: string, body: string, matchUrl: string = '/') {
    if (typeof window === 'undefined') return;

    // Check permission
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        try {
          await Notification.requestPermission();
        } catch {}
      }

      if (Notification.permission === 'granted') {
        if ('serviceWorker' in navigator) {
          try {
            const reg = await navigator.serviceWorker.ready;
            reg.showNotification(title, {
              body,
              icon: '/logo.svg',
              badge: '/favicon.svg',
              tag: 'live-player-lockscreen-alert',
              requireInteraction: true, // Stays visible on phone Lock Screen
              vibrate: [300, 100, 300, 100, 500],
              data: { url: matchUrl },
              actions: [
                { action: 'view_match', title: '⚽ View Live Match' },
                { action: 'listen_commentary', title: '🎙️ Listen Audio' },
              ],
            } as any);
            return;
          } catch (e) {
            console.warn('SW showNotification error:', e);
          }
        }

        // Fallback to standard window Notification
        try {
          new Notification(title, { body, icon: '/logo.svg' });
        } catch {}
      }
    }
  }
}

export const playerFollowEngine = new PlayerFollowManager();
