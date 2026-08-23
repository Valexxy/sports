'use client';

import { stadiumAudio } from './sound-synthesizer';
import { stadiumBroadcastAudio } from './stadium-broadcast-audio-engine';

class BackgroundGoalChimesEngine {
  private lastKnownScores: Map<string, number> = new Map();

  public monitorMatches(matches: Array<{ id: string; homeTeam: string; awayTeam: string; homeScore?: number; awayScore?: number }>, followedIds: string[]) {
    if (typeof window === 'undefined') return;

    matches.forEach((m) => {
      if (followedIds.includes(m.id)) {
        const totalGoals = (m.homeScore ?? 0) + (m.awayScore ?? 0);
        const prev = this.lastKnownScores.get(m.id);

        if (prev !== undefined && totalGoals > prev) {
          // Goal detected in followed match!
          stadiumAudio.playWhistle('kickoff');
          stadiumAudio.playGoalCelebration();
          stadiumBroadcastAudio.surgeCrowdRoar('goal');
        }

        this.lastKnownScores.set(m.id, totalGoals);
      }
    });
  }
}

export const backgroundGoalChimes = new BackgroundGoalChimesEngine();
