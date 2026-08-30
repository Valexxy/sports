'use client';

import { MatchData } from './sports-api';
import { phoneHardware } from './phone-hardware-engine';
import { stadiumAudio } from './sound-synthesizer';
import { PersistentStorage } from './persistent-storage-engine';
import { PowerSaverEngine } from './power-saver-engine';
import confetti from 'canvas-confetti';

export type LiveFxMode = 'FOLLOWED_ONLY' | 'ALL_LIVE' | 'OFF';

export interface LiveGoalEvent {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  scoringTeam: string;
  matchTime: string;
  league: string;
}

export interface RedCardEvent {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  playerName: string;
  minute: string;
  league: string;
}

export class LiveMatchFxEngine {
  private static knownScores: Map<string, { home: number; away: number }> = new Map();
  private static knownCardEvents: Set<string> = new Set();
  private static fxMode: LiveFxMode = 'FOLLOWED_ONLY';
  private static goalListeners: ((event: LiveGoalEvent) => void)[] = [];
  private static redCardListeners: ((event: RedCardEvent) => void)[] = [];
  private static isInitialized = false;

  public static init(): void {
    if (typeof window === 'undefined' || this.isInitialized) return;
    this.isInitialized = true;

    const saved = localStorage.getItem('mivaj_live_fx_mode') as LiveFxMode | null;
    if (saved) {
      this.fxMode = saved;
    }
  }

  public static getFxMode(): LiveFxMode {
    if (typeof window === 'undefined') return 'FOLLOWED_ONLY';
    return (localStorage.getItem('mivaj_live_fx_mode') as LiveFxMode) || this.fxMode;
  }

  public static setFxMode(mode: LiveFxMode): void {
    this.fxMode = mode;
    if (typeof window !== 'undefined') {
      localStorage.setItem('mivaj_live_fx_mode', mode);
      phoneHardware.triggerHaptic('SELECTION');
    }
  }

  public static subscribeGoalEvents(listener: (event: LiveGoalEvent) => void) {
    this.goalListeners.push(listener);
    return () => {
      this.goalListeners = this.goalListeners.filter((l) => l !== listener);
    };
  }

  public static subscribeRedCardEvents(listener: (event: RedCardEvent) => void) {
    this.redCardListeners.push(listener);
    return () => {
      this.redCardListeners = this.redCardListeners.filter((l) => l !== listener);
    };
  }

  /**
   * Evaluates incoming match stream for live goal events and triggers battery-friendly phone effects
   */
  public static evaluateLiveMatches(matches: MatchData[]): void {
    if (typeof window === 'undefined' || this.fxMode === 'OFF' || !PowerSaverEngine.isVisible()) return;

    const followedIds = PersistentStorage.getFollowedMatches();

    matches.forEach((match) => {
      if (match.status !== 'LIVE') {
        // Reset or store known scores for non-live
        this.knownScores.set(match.id, { home: match.homeScore ?? 0, away: match.awayScore ?? 0 });
        return;
      }

      const prev = this.knownScores.get(match.id);
      const curHome = match.homeScore ?? 0;
      const curAway = match.awayScore ?? 0;

      const isFollowed = followedIds.includes(match.id);
      const shouldTrigger = this.fxMode === 'ALL_LIVE' || (this.fxMode === 'FOLLOWED_ONLY' && isFollowed);

      // Detect Goal (if previous score exists and new score is higher)
      if (prev && (curHome > prev.home || curAway > prev.away)) {
        if (shouldTrigger) {
          const scoringTeam = curHome > prev.home ? match.homeTeam : match.awayTeam;
          const event: LiveGoalEvent = {
            matchId: match.id,
            homeTeam: match.homeTeam,
            awayTeam: match.awayTeam,
            homeScore: curHome,
            awayScore: curAway,
            scoringTeam,
            matchTime: match.matchTime || 'In-Play',
            league: match.league || 'Football',
          };

          this.triggerGoalEffects(event);
        }
      }

      // Detect Red Card events via liveEvents array
      if (shouldTrigger && Array.isArray((match as any).liveEvents)) {
        const liveEvents: any[] = (match as any).liveEvents;
        liveEvents.forEach((liveEvent) => {
          if (liveEvent.kind !== 'CARD') return;
          const description: string = liveEvent.description || liveEvent.type || '';
          if (!description.includes('Red')) return;

          // Build a stable dedup key from event id, sequence, or a fallback composite
          const dedupKey =
            liveEvent.id ??
            liveEvent.sequence ??
            `${match.id}:${liveEvent.minute}:${liveEvent.playerName}`;

          if (this.knownCardEvents.has(String(dedupKey))) return;
          this.knownCardEvents.add(String(dedupKey));

          try {
            phoneHardware.triggerHaptic('RED_CARD');

            const cardEvent: RedCardEvent = {
              matchId: match.id,
              homeTeam: match.homeTeam,
              awayTeam: match.awayTeam,
              playerName: liveEvent.playerName || liveEvent.player || 'Unknown',
              minute: liveEvent.minute || match.matchTime || 'In-Play',
              league: match.league || 'Football',
            };

            this.redCardListeners.forEach((l) => l(cardEvent));
          } catch {}
        });
      }

      // Update known score
      this.knownScores.set(match.id, { home: curHome, away: curAway });
    });
  }

  /**
   * Triggers tactile vibration, perimeter neon flash, audio cheer, and confetti
   */
  public static triggerGoalEffects(event: LiveGoalEvent): void {
    try {
      // 1. Double tactile haptic pulse
      phoneHardware.triggerHaptic('GOAL');

      // 2. Audio cheer burst
      stadiumAudio.playGoalCelebration();

      // 3. Mini celebratory particle burst
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.1 },
        colors: ['#00FF87', '#FFD700', '#FFFFFF'],
      });

      // 4. Update Lock Screen & Dynamic Island Live Activity (iOS & Android)
      phoneHardware.publishLockScreenMatch(
        event.homeTeam,
        event.awayTeam,
        event.homeScore,
        event.awayScore,
        event.matchTime,
        true
      );

      // 5. Notify in-app subscribers (e.g. Dynamic Island toast)
      this.goalListeners.forEach((l) => l(event));
    } catch {}
  }

  /**
   * Fires FULLTIME_WIN haptic + a small confetti burst if the given match has a
   * finished result that matches the user's top-pick prediction.
   */
  public static triggerFullTimeWin(matchId: string): void {
    try {
      const matches: MatchData[] = PersistentStorage.getTrackedMatches?.() ?? [];
      const match = matches.find((m) => m.id === matchId);

      if (!match) return;

      // Only fire when the match is actually finished
      if (match.status !== 'FINISHED' && match.status !== 'FT') return;

      // Check against stored prediction top-pick
      const prediction = PersistentStorage.getPrediction?.(matchId);
      if (!prediction?.topPick) return;

      const { topPick } = prediction;
      const homeScore = match.homeScore ?? 0;
      const awayScore = match.awayScore ?? 0;

      // Resolve whether the top-pick outcome matches the final score
      const homeWin = homeScore > awayScore;
      const awayWin = awayScore > homeScore;
      const draw = homeScore === awayScore;

      const predictionWon =
        (topPick === '1' && homeWin) ||
        (topPick === 'X' && draw) ||
        (topPick === '2' && awayWin) ||
        (topPick === match.homeTeam && homeWin) ||
        (topPick === match.awayTeam && awayWin);

      if (!predictionWon) return;

      // Celebration effects for a winning prediction
      phoneHardware.triggerHaptic('FULLTIME_WIN');

      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.3 },
        colors: ['#FFD700', '#FFFFFF', '#00FF87'],
      });
    } catch {}
  }
}
