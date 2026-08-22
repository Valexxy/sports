'use client';

import { useState, useEffect } from 'react';

/**
 * PREMIUM OFFLINE-FIRST MANAGER
 * - Tracks connectivity in real time
 * - Caches matches/news in IndexedDB so the app stays usable offline
 * - Registers Background Sync so cached data re-syncs when back online
 */

const DB_NAME = 'aurascore-offline';
const DB_VERSION = 1;
const STORE = 'kv';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('indexedDB unavailable'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function cacheOffline(key: string, value: unknown): Promise<boolean> {
  try {
    const db = await openDb();
    return await new Promise((resolve) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(value, key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

export async function getOfflineCache<T>(key: string): Promise<T | null> {
  try {
    const db = await openDb();
    return await new Promise((resolve) => {
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get(key);
      req.onsuccess = () => resolve((req.result as T) ?? null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function clearOfflineCache(): Promise<boolean> {
  try {
    const db = await openDb();
    return await new Promise((resolve) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).clear();
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

export async function requestBackgroundSync(tag = 'aurascore-resync'): Promise<boolean> {
  try {
    const reg = await navigator.serviceWorker.ready;
    const syncManager = (reg as any).sync;
    if (syncManager) {
      await syncManager.register(tag);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function useOfflineStatus() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOffline(!navigator.onLine);

    const handleOnline = () => {
      setIsOffline(false);
      requestBackgroundSync().then((ok) => {
        if (ok) console.log('🟢 Network back; background sync registered.');
      });
    };

    const handleOffline = () => {
      setIsOffline(true);
      console.log('⚡ Offline: serving cached match data.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOffline;
}