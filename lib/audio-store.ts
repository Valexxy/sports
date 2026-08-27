'use client';

import { useSyncExternalStore } from 'react';

export interface MatchAudioTrack {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  matchTime?: string;
  league?: string;
  homeLogo?: string;
  awayLogo?: string;
}

interface AudioStoreState {
  isPlaying: boolean;
  activeLanguage: 'WARRI' | 'ENGLISH';
  currentTrack: MatchAudioTrack | null;
  currentTimeStr: string;
  isExpanded: boolean;
  volume: number;
}

let state: AudioStoreState = {
  isPlaying: false,
  activeLanguage: 'WARRI',
  currentTrack: null,
  currentTimeStr: "16:00",
  isExpanded: false,
  volume: 1.0,
};

const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export const audioStore = {
  getState: () => state,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  playTrack: (track: MatchAudioTrack, language: 'WARRI' | 'ENGLISH' = 'WARRI') => {
    state = { ...state, currentTrack: track, isPlaying: true, activeLanguage: language };
    emitChange();
  },
  pauseTrack: () => {
    state = { ...state, isPlaying: false };
    emitChange();
  },
  togglePlay: () => {
    state = { ...state, isPlaying: !state.isPlaying };
    emitChange();
  },
  switchLanguage: (lang: 'WARRI' | 'ENGLISH') => {
    state = { ...state, activeLanguage: lang };
    emitChange();
  },
  setExpanded: (expanded: boolean) => {
    state = { ...state, isExpanded: expanded };
    emitChange();
  },
  updateTime: (timeStr: string) => {
    state = { ...state, currentTimeStr: timeStr };
    emitChange();
  }
};

export function useAudioStore() {
  const currentState = useSyncExternalStore(
    audioStore.subscribe,
    audioStore.getState,
    audioStore.getState
  );

  return {
    ...currentState,
    playTrack: audioStore.playTrack,
    pauseTrack: audioStore.pauseTrack,
    togglePlay: audioStore.togglePlay,
    switchLanguage: audioStore.switchLanguage,
    setExpanded: audioStore.setExpanded,
    updateTime: audioStore.updateTime,
  };
}
