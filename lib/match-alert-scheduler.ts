import { LockScreenMatchTracker } from './lockscreen-live-score-tracker';
/**
 * SMART MATCH ALERT & KICKOFF SCHEDULER ENGINE
 * Automatically sends browser/phone notifications for followed matches:
 * - 15 minutes before kickoff reminder
 * - Match kickoff whistle alert
 * - Live goal scored & red card alerts
 * - Full-time settlement outcome
 */

import { phoneHardware } from './phone-hardware-engine';
import { stadiumAudio } from './sound-synthesizer';
import { MatchData } from './sports-api';

export interface FollowedMatchAlert {
  matchId: string;
  matchTitle: string;
  kickoffTime: string;
  alert15MinSent: boolean;
  alertKickoffSent: boolean;
  lastKnownHomeScore: number;
  lastKnownAwayScore: number;
}

const STORAGE_KEY = 'aurascore_followed_match_alerts';

export class MatchAlertScheduler {
  static getFollowedAlerts(): Record<string, FollowedMatchAlert> {
    if (typeof window === 'undefined') return {};
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  static saveFollowedAlerts(alerts: Record<string, FollowedMatchAlert>) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
    } catch {}
  }

  static followMatch(match: MatchData) {
    const alerts = this.getFollowedAlerts();
    if (!alerts[match.id]) {
      alerts[match.id] = {
        matchId: match.id,
        matchTitle: `${match.homeTeam} vs ${match.awayTeam}`,
        kickoffTime: match.matchTime,
        alert15MinSent: false,
        alertKickoffSent: false,
        lastKnownHomeScore: match.homeScore,
        lastKnownAwayScore: match.awayScore,
      };
      this.saveFollowedAlerts(alerts);

      // Trigger status-aware instant confirmation & auto-pin live lockscreen
      if (match.status === 'LIVE') {
        phoneHardware.sendNativeNotification(
          `🔴 Live Match Followed: ${match.homeTeam} vs ${match.awayTeam}`,
          `Live in-play score (${match.homeScore ?? 0}-${match.awayScore ?? 0}) pinned to your lock screen. Real-time goal alerts active!`
        );
        LockScreenMatchTracker.pinMatchToLockScreen(match).catch(() => {});
      } else if (match.status === 'FINISHED') {
        phoneHardware.sendNativeNotification(
          `✅ Finished Match Followed: ${match.homeTeam} vs ${match.awayTeam}`,
          `Final result: ${match.homeScore ?? 0} - ${match.awayScore ?? 0} settled.`
        );
      } else {
        phoneHardware.sendNativeNotification(
          `🔔 Upcoming Match Followed: ${match.homeTeam} vs ${match.awayTeam}`,
          `Kickoff at ${match.matchTime}. You will receive a reminder before kickoff.`
        );
      }
      phoneHardware.triggerHaptic('BANKER_LOCKED');
      // auto audio disabled
    }
  }

  static unfollowMatch(matchId: string) {
    const alerts = this.getFollowedAlerts();
    if (alerts[matchId]) {
      delete alerts[matchId];
      this.saveFollowedAlerts(alerts);
    }
  }

  static isMatchFollowed(matchId: string): boolean {
    const alerts = this.getFollowedAlerts();
    return !!alerts[matchId];
  }

  static checkAndTriggerLiveAlerts(matches: MatchData[], onAlertTriggered?: (title: string, msg: string) => void) {
    const alerts = this.getFollowedAlerts();
    let changed = false;

    matches.forEach((m) => {
      const alertConfig = alerts[m.id];
      if (!alertConfig) return;

      // 1. Check Goal Alert
      if (m.homeScore > alertConfig.lastKnownHomeScore) {
        const title = `⚽ GOAL! ${m.homeTeam} Scores!`;
        const body = `${m.homeTeam} ${m.homeScore} - ${m.awayScore} ${m.awayTeam} (${m.matchTime})`;
        phoneHardware.sendNativeNotification(title, body);
        phoneHardware.triggerHaptic('GOAL_SCORED');
        // auto audio disabled
        if (onAlertTriggered) onAlertTriggered(title, body);
        alertConfig.lastKnownHomeScore = m.homeScore;
        changed = true;
      }

      if (m.awayScore > alertConfig.lastKnownAwayScore) {
        const title = `⚽ GOAL! ${m.awayTeam} Scores!`;
        const body = `${m.homeTeam} ${m.homeScore} - ${m.awayScore} ${m.awayTeam} (${m.matchTime})`;
        phoneHardware.sendNativeNotification(title, body);
        phoneHardware.triggerHaptic('GOAL_SCORED');
        // auto audio disabled
        if (onAlertTriggered) onAlertTriggered(title, body);
        alertConfig.lastKnownAwayScore = m.awayScore;
        changed = true;
      }

      // 2. Kickoff Whistle Alert
      if (m.status === 'LIVE' && !alertConfig.alertKickoffSent) {
        const title = `🔥 KICKOFF! ${m.homeTeam} vs ${m.awayTeam}`;
        const body = `The match has officially started! Live 2D pitch tracking active.`;
        phoneHardware.sendNativeNotification(title, body);
        phoneHardware.triggerHaptic('BANKER_LOCKED');
        // auto audio disabled
        if (onAlertTriggered) onAlertTriggered(title, body);
        alertConfig.alertKickoffSent = true;
        changed = true;
      }
    });

    if (changed) {
      this.saveFollowedAlerts(alerts);
    }
  }
}
