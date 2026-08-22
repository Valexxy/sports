/**
 * HIGH PROBABILITY MATCH FILTER
 * Filters matches to show only high-probability picks and removes past matches
 */

import { MatchData } from './sports-api';

/**
 * Filters matches to show only high-probability picks
 * - Removes matches with low confidence
 * - Removes past matches (already played)
 * - Prioritizes bankers and high-value picks
 */
export function filterHighProbabilityMatches(
  matches: MatchData[],
  minProbability: number = 60
): MatchData[] {
  const now = new Date();

  return matches.filter(match => {
    // Remove finished matches that are too old
    if (match.status === 'FINISHED') {
      const matchDate = match.utcDate ? new Date(match.utcDate) : null;
      if (matchDate && (now.getTime() - matchDate.getTime()) > 24 * 60 * 60 * 1000) {
        return false; // Older than 24 hours
      }
    }

    // For scheduled matches, remove those that are in the past
    if (match.status === 'SCHEDULED') {
      const matchDate = match.utcDate ? new Date(match.utcDate) : null;
      if (matchDate && matchDate.getTime() < now.getTime()) {
        return false; // Match time has passed
      }
    }

    // Filter by minimum probability for high-quality picks
    const topPickProb = match.prediction?.topPick?.probability || 0;
    if (topPickProb < minProbability) {
      return false;
    }

    return true;
  });
}

/**
 * Filters matches to show only today's matches
 * Removes matches from previous days
 */
export function filterTodaysMatches(matches: MatchData[]): MatchData[] {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);

  return matches.filter(match => {
    if (!match.utcDate) return true; // Keep matches without date (live matches)

    const matchDate = new Date(match.utcDate);

    // Keep matches from today and future
    return matchDate >= todayStart;
  });
}

/**
 * Filters matches by status and quality
 */
export function filterMatchesByStatus(
  matches: MatchData[],
  status: 'LIVE' | 'UPCOMING' | 'PLAYED' | 'BANKERS'
): MatchData[] {
  const now = new Date();

  return matches.filter(match => {
    // Filter by status
    if (status === 'BANKERS') {
      const isBanker = match.prediction?.topPick?.confidenceTier === 'ULTRA-BANKER' ||
                      match.prediction?.topPick?.confidenceTier === 'BANKER';
      return isBanker && (match.prediction?.topPick?.probability || 0) >= 70;
    }

    if (status === 'LIVE') {
      return match.status === 'LIVE';
    }

    if (status === 'UPCOMING') {
      return match.status === 'SCHEDULED' &&
             (!match.utcDate || new Date(match.utcDate) > now);
    }

    if (status === 'PLAYED') {
      return match.status === 'FINISHED';
    }

    return true;
  });
}

/**
 * Combines all filters for optimal match display
 */
export function filterAndSortMatches(
  matches: MatchData[],
  activeFilter: 'ALL' | 'LIVE' | 'UPCOMING' | 'PLAYED' | 'BANKERS' = 'ALL'
): MatchData[] {
  // Step 1: Remove old matches and past scheduled matches
  let filtered = filterTodaysMatches(matches);

  // Step 2: Apply status filter
  if (activeFilter !== 'ALL') {
    filtered = filterMatchesByStatus(filtered, activeFilter as any);
  }

  // Step 3: For ALL view, still show only high probability matches
  if (activeFilter === 'ALL') {
    filtered = filterHighProbabilityMatches(filtered, 50); // Lower threshold for ALL view
  }

  return filtered;
}