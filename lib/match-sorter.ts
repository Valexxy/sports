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
 * Universal Match Sorter — WAT timezone aware (UTC+1 for Nigeria)
 * Ordering:
 * 1. LIVE matches first
 * 2. UPCOMING — closest to current WAT time, excluding stale 00:xx UTC matches when it is now afternoon
 * 3. FINISHED — most recent first
 */
export function sortMatchesByClosestKickoff(
  matches: MatchData[],
  activeFilter: 'ALL' | 'LIVE' | 'UPCOMING' | 'PLAYED' | 'FOLLOWING' | string = 'ALL'
): MatchData[] {
  const WAT_OFFSET_MS = 60 * 60 * 1000; // WAT = UTC+1
  const nowUTC = Date.now();
  const nowWATMinutes = Math.floor((nowUTC + WAT_OFFSET_MS) / 60000) % 1440; // current minute-of-day in WAT

  return [...matches].sort((a, b) => {
    // Status Priority
    const statusWeight: Record<string, number> = { LIVE: 1, SCHEDULED: 2, FINISHED: 3 };
    const weightA = statusWeight[a.status] || 2;
    const weightB = statusWeight[b.status] || 2;
    if (weightA !== weightB) return weightA - weightB;

    // Both LIVE — highest tension first
    if (a.status === 'LIVE' && b.status === 'LIVE') {
      return (b.stadiumTension || 0) - (a.stadiumTension || 0);
    }

    // Both SCHEDULED — sort by utcDate first, then by kickoff proximity
    if (a.status === 'SCHEDULED' && b.status === 'SCHEDULED') {
      const dateA = a.utcDate ? new Date(a.utcDate).getTime() : 0;
      const dateB = b.utcDate ? new Date(b.utcDate).getTime() : 0;
      if (dateA !== dateB) return dateA - dateB;

      // Parse WAT minutes (add 60 to UTC time for WAT offset)
      const rawA = parseKickoffMinutes(a.matchTime);
      const rawB = parseKickoffMinutes(b.matchTime);
      // Matches at 00:xx UTC are really 01:xx WAT — adjust if raw is < 60 to avoid showing midnight as first
      const watA = rawA < 60 ? rawA + 60 : rawA;
      const watB = rawB < 60 ? rawB + 60 : rawB;
      // Distance from current WAT time (smaller = sooner)
      const distA = watA >= nowWATMinutes ? watA - nowWATMinutes : 1440 - (nowWATMinutes - watA);
      const distB = watB >= nowWATMinutes ? watB - nowWATMinutes : 1440 - (nowWATMinutes - watB);
      return distA - distB;
    }

    // Both FINISHED — most recent first
    if (a.status === 'FINISHED' && b.status === 'FINISHED') {
      const dateA = a.utcDate ? new Date(a.utcDate).getTime() : 0;
      const dateB = b.utcDate ? new Date(b.utcDate).getTime() : 0;
      if (dateA !== dateB) return dateB - dateA;
      return parseKickoffMinutes(b.matchTime) - parseKickoffMinutes(a.matchTime);
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
