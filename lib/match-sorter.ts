import { MatchData } from './sports-api';

/**
 * Parses time string like "03:00 PM", "7:30 PM", "19:00", "45'", "HT", "FT", "8/20 - 3:00 PM"
 * Returns minutes from 00:00 (0 to 1440) or estimated epoch time for accurate chronological ordering.
 */
export function parseKickoffMinutes(timeStr: string): number {
  if (!timeStr) return 1200; // default 20:00

  const str = timeStr.trim().toUpperCase();

  // If match has 12-hour AM/PM format (e.g. "03:00 PM", "7:30 AM", "8/20 - 7:00 PM")
  const ampmMatch = str.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1], 10);
    const minutes = parseInt(ampmMatch[2], 10);
    const meridiem = ampmMatch[3];

    if (meridiem === 'PM' && hours < 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes;
  }

  // If match has 24-hour format (e.g. "19:00", "20:30")
  const hourMatch = str.match(/(\d{1,2}):(\d{2})/);
  if (hourMatch) {
    const hours = parseInt(hourMatch[1], 10);
    const minutes = parseInt(hourMatch[2], 10);
    return hours * 60 + minutes;
  }

  return 1200;
}

/**
 * Universal Match Sorter
 * Orders matches based on status and chronological start time:
 * 1. LIVE matches first (In-play)
 * 2. SCHEDULED matches ordered strictly by closest to kickoff (Earliest start time first)
 * 3. FINISHED matches last (Most recently finished first)
 */
export function sortMatchesByClosestKickoff(
  matches: MatchData[],
  activeFilter: 'ALL' | 'LIVE' | 'UPCOMING' | 'PLAYED' | 'BANKERS' = 'ALL'
): MatchData[] {
  return [...matches].sort((a, b) => {
    // 1. If filtering for Bankers, prioritize highest win probability & banker tier first
    if (activeFilter === 'BANKERS') {
      const probA = a.prediction?.topPick?.probability || 0;
      const probB = b.prediction?.topPick?.probability || 0;
      if (probB !== probA) {
        return probB - probA; // Higher probability first
      }
    }

    // 2. Status Priority Order
    const statusWeight: Record<string, number> = {
      LIVE: 1,
      SCHEDULED: 2,
      FINISHED: 3,
    };

    const weightA = statusWeight[a.status] || 2;
    const weightB = statusWeight[b.status] || 2;

    if (weightA !== weightB) {
      return weightA - weightB;
    }

    // 3. If both are LIVE, sort by highest stadium tension / minute
    if (a.status === 'LIVE' && b.status === 'LIVE') {
      return (b.stadiumTension || 0) - (a.stadiumTension || 0);
    }

    // 4. If both are SCHEDULED, sort by date first, then by kickoff time
    if (a.status === 'SCHEDULED' && b.status === 'SCHEDULED') {
      const dateA = a.utcDate ? new Date(a.utcDate).getTime() : 0;
      const dateB = b.utcDate ? new Date(b.utcDate).getTime() : 0;
      
      if (dateA !== dateB) {
        return dateA - dateB;
      }
      
      const timeA = parseKickoffMinutes(a.matchTime);
      const timeB = parseKickoffMinutes(b.matchTime);
      return timeA - timeB;
    }

    // 5. If both are FINISHED, keep recently played
    if (a.status === 'FINISHED' && b.status === 'FINISHED') {
      const timeA = parseKickoffMinutes(a.matchTime);
      const timeB = parseKickoffMinutes(b.matchTime);
      return timeB - timeA; // later finished matches first
    }

    return 0;
  });
}

/**
 * Sorts League groups so leagues with LIVE games or games starting earliest appear first.
 */
export function sortLeagueGroups(
  matchesByLeague: Record<string, MatchData[]>
): [string, MatchData[]][] {
  const entries = Object.entries(matchesByLeague);

  return entries
    .map(([name, list]): [string, MatchData[]] => [
      name,
      sortMatchesByClosestKickoff(list, 'ALL'),
    ])
    .sort(([nameA, listA], [nameB, listB]) => {
      const hasLiveA = listA.some((m) => m.status === 'LIVE') ? 1 : 0;
      const hasLiveB = listB.some((m) => m.status === 'LIVE') ? 1 : 0;

      if (hasLiveB !== hasLiveA) {
        return hasLiveB - hasLiveA; // Leagues with live matches appear first
      }

      // Find earliest scheduled match in league A
      const schedA = listA.filter((m) => m.status === 'SCHEDULED');
      const schedB = listB.filter((m) => m.status === 'SCHEDULED');

      if (schedA.length > 0 && schedB.length > 0) {
        const minA = Math.min(...schedA.map((m) => parseKickoffMinutes(m.matchTime)));
        const minB = Math.min(...schedB.map((m) => parseKickoffMinutes(m.matchTime)));
        return minA - minB; // League with earliest kickoff appears first
      }

      if (schedA.length > 0) return -1;
      if (schedB.length > 0) return 1;

      return 0;
    });
}
