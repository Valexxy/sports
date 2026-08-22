/**
 * 100% FREE REAL LIVE MATCH COMMENTARY ENGINE (ESPN PUBLIC API)
 * - Per-minute play-by-play from ESPN summary endpoint
 * - Fetches LINEUP (starting XI + bench) from the same endpoint
 * - Events sorted NEWEST FIRST (descending minute order)
 */

export interface RealCommentaryEvent {
  minute: string;
  text: string;
  kind: 'GOAL' | 'CARD' | 'SUBSTITUTION' | 'KICKOFF' | 'HALFTIME' | 'FULLTIME' | 'INFO';
  team?: string;
  scorer?: string;
  sequence: number;
  isNew?: boolean; // flagged on first appearance for animation
}

export interface MatchLineup {
  home: LineupTeam;
  away: LineupTeam;
  formation: { home: string; away: string };
}

export interface LineupTeam {
  starters: LineupPlayer[];
  bench: LineupPlayer[];
}

export interface LineupPlayer {
  number: string;
  name: string;
  position: string;
  isCaptain: boolean;
  photoUrl?: string;
}

const LEAGUE_TO_ESPN_PATH: Record<string, string> = {
  'Premier League': 'soccer/eng.1',
  'La Liga': 'soccer/esp.1',
  'Primera Division': 'soccer/esp.1',
  'UEFA Champions League': 'soccer/uefa.champions',
  'UEFA Europa League': 'soccer/uefa.europa',
  'UEFA Conference League': 'soccer/uefa.europa.conf',
  'Copa Libertadores': 'soccer/conmebol.libertadores',
  'Serie A': 'soccer/ita.1',
  'Bundesliga': 'soccer/ger.1',
  'Ligue 1': 'soccer/fra.1',
  'MLS': 'soccer/usa.1',
  'Brasileirao': 'soccer/bra.1',
  'Liga MX': 'soccer/mex.1',
  'NPFL Nigeria': 'soccer/nga.1',
  'Saudi Pro League': 'soccer/sau.1',
  'Scottish Premiership': 'soccer/sco.1',
  'Eredivisie': 'soccer/ned.1',
};

function classify(typeText: string, rawText: string): RealCommentaryEvent['kind'] {
  const t = (typeText || '').toLowerCase();
  const r = (rawText || '').toLowerCase();
  if (t.includes('goal') || r.startsWith('goal!')) return 'GOAL';
  if (t.includes('yellow') || t.includes('red') || t.includes('card')) return 'CARD';
  if (t.includes('substitution') || t.includes('replace')) return 'SUBSTITUTION';
  if (t.includes('kickoff') || r.includes('first half begins')) return 'KICKOFF';
  if (t.includes('halftime') || r.includes('first half ends')) return 'HALFTIME';
  if (t.includes('fulltime') || r.startsWith('match ends') || r.startsWith('second half ends')) return 'FULLTIME';
  return 'INFO';
}

function extractTeam(rawText: string, homeTeam: string, awayTeam: string): string | undefined {
  if (!rawText) return undefined;
  if (rawText.toLowerCase().includes(homeTeam.toLowerCase())) return homeTeam;
  if (rawText.toLowerCase().includes(awayTeam.toLowerCase())) return awayTeam;
  return undefined;
}

function extractScorer(rawText: string): string | undefined {
  if (!rawText) return undefined;
  const m = rawText.match(/Goal!\s+[\w\s-]+?\s+\d+,\s+[\w\s-]+?\s+\d+\.\s+([^(]+?)\s*\(/);
  return m ? m[1].trim() : undefined;
}

function parseMinute(minute: string): number {
  const m = minute.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

/** Fetch per-minute play-by-play — returns NEWEST FIRST */
export async function fetchRealLiveCommentary(
  espnEventId: string,
  league: string,
  homeTeam?: string,
  awayTeam?: string
): Promise<RealCommentaryEvent[]> {
  const path = LEAGUE_TO_ESPN_PATH[league] || 'soccer/eng.1';
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/${path}/summary?event=${encodeURIComponent(espnEventId)}`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data) return [];

    const events: RealCommentaryEvent[] = [];
    const seen = new Set<string>();

    // PRIMARY: commentary object
    const commentaryData = data.commentary;
    if (commentaryData && typeof commentaryData === 'object') {
      Object.keys(commentaryData).forEach((key) => {
        const arr = commentaryData[key];
        if (!Array.isArray(arr)) return;
        arr.forEach((entry: any) => {
          if (!entry?.text) return;
          const text = String(entry.text).trim();
          if (!text || seen.has(text)) return;
          seen.add(text);
          const playType = entry.play?.type?.text || '';
          events.push({
            minute: entry.time?.displayValue ? `${entry.time.displayValue}'` : '—',
            text,
            kind: classify(playType, text),
            team: entry.play?.team?.displayName || (homeTeam && awayTeam ? extractTeam(text, homeTeam, awayTeam) : undefined),
            scorer: classify(playType, text) === 'GOAL' ? extractScorer(text) : undefined,
            sequence: typeof entry.sequence === 'number' ? entry.sequence : events.length,
          });
        });
      });
    }

    // SECONDARY: keyEvents
    if (events.length === 0 && Array.isArray(data.keyEvents)) {
      data.keyEvents.forEach((k: any) => {
        if (!k?.text) return;
        const text = String(k.text).trim();
        if (seen.has(text)) return;
        seen.add(text);
        events.push({
          minute: k.clock?.displayValue ? `${k.clock.displayValue}'` : '—',
          text,
          kind: classify(k.type?.text || '', text),
          team: k.team?.displayName || (homeTeam && awayTeam ? extractTeam(text, homeTeam, awayTeam) : undefined),
          scorer: classify(k.type?.text || '', text) === 'GOAL' ? extractScorer(text) : undefined,
          sequence: events.length,
        });
      });
    }

    // TERTIARY: header details
    if (events.length === 0) {
      const details = data.header?.competitions?.[0]?.details || [];
      details.forEach((d: any) => {
        if (!d?.type?.text) return;
        const players = (d.athletesInvolved || []).map((a: any) => a.displayName).join(', ');
        const text = players ? `${d.type.text}: ${players}` : d.type.text;
        if (seen.has(text)) return;
        seen.add(text);
        events.push({
          minute: d.clock?.displayValue ? `${d.clock.displayValue}'` : '—',
          text,
          kind: classify(d.type.text, text),
          team: d.teamsInvolved?.[0]?.displayName,
          scorer: classify(d.type.text, text) === 'GOAL' ? players || undefined : undefined,
          sequence: events.length,
        });
      });
    }

    // Sort NEWEST FIRST (descending sequence / minute)
    events.sort((a, b) => {
      if (a.sequence !== b.sequence) return b.sequence - a.sequence; // newest first
      return parseMinute(b.minute) - parseMinute(a.minute);
    });

    return events.slice(0, 80);
  } catch (err) {
    console.warn('Real live commentary fetch error:', err);
    return [];
  }
}

/** Fetch starting lineups + bench from ESPN summary endpoint */
export async function fetchMatchLineup(
  espnEventId: string,
  league: string
): Promise<MatchLineup | null> {
  const path = LEAGUE_TO_ESPN_PATH[league] || 'soccer/eng.1';
  try {
    const res = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/${path}/summary?event=${encodeURIComponent(espnEventId)}`,
      { next: { revalidate: 60 } } as any
    );
    if (!res.ok) return null;
    const data = await res.json();

    const rosters = data.rosters;
    if (!Array.isArray(rosters) || rosters.length < 2) return null;

    const parseTeam = (roster: any): LineupTeam => {
      const starters: LineupPlayer[] = [];
      const bench: LineupPlayer[] = [];
      const entries = roster.roster || [];
      entries.forEach((entry: any) => {
        const athlete = entry.athlete || {};
        const p: LineupPlayer = {
          number: entry.jersey || '?',
          name: athlete.displayName || athlete.shortName || 'Unknown',
          position: entry.position?.displayName || entry.position?.abbreviation || '?',
          isCaptain: entry.captain === true,
          photoUrl: athlete.headshot?.href || undefined,
        };
        if (entry.starter) starters.push(p); else bench.push(p);
      });
      return { starters, bench };
    };

    const homeFormation = rosters[0]?.formation || '4-4-2';
    const awayFormation = rosters[1]?.formation || '4-4-2';

    return {
      home: parseTeam(rosters[0]),
      away: parseTeam(rosters[1]),
      formation: { home: homeFormation, away: awayFormation },
    };
  } catch {
    return null;
  }
}

/** Extract numeric ESPN event id from match.id ('espn-123456' -> '123456') */
export function extractEspnEventId(matchId: string): string | null {
  const m = matchId.match(/^espn-(\d+)$/);
  return m ? m[1] : null;
}
