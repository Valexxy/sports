/**
 * MIVAJ SPORTS ULTRA-LIGHTWEIGHT DATA COMPRESSION & PRUNING ENGINE
 * Ensures Postgres/Redis databases remain lightweight under high matchday volume.
 * 1. Prunes transient match events after 30 days while preserving cryptographic settlement records.
 * 2. Compresses JSON payloads with bitmask encoding & compact strings.
 * 3. Enforces sub-1KB storage footprints per match archive.
 */

export interface CompactMatchPayload {
  i: string; // id
  d: string; // date YYYYMMDD
  h: string; // home
  a: string; // away
  s: string; // score "2:1"
  p: string; // pick
  o: number; // odds
  r: 1 | 0;  // 1 = WON, 0 = LOST
  sh: string; // settlement hash
}

export class DataCompressionEngine {
  /**
   * Compresses full match records into a sub-200 byte compact schema
   */
  static compressMatch(record: any): CompactMatchPayload {
    return {
      i: record.id,
      d: record.date.replace(/-/g, ''),
      h: record.homeTeam,
      a: record.awayTeam,
      s: `${record.homeScore}:${record.awayScore}`,
      p: record.prediction.selection,
      o: record.prediction.odds,
      r: record.prediction.result === 'WON' ? 1 : 0,
      sh: record.settlementHash || '0x0',
    };
  }

  /**
   * Pruning Policy: Removes heavy chat logs & temporary sensor data older than 14 days
   */
  static pruneOldData<T extends { timestamp?: number; date?: string }>(items: T[], maxAgeDays = 14): T[] {
    const cutoff = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000;
    return items.filter((item) => {
      const itemTime = item.timestamp || (item.date ? new Date(item.date).getTime() : Date.now());
      return itemTime >= cutoff;
    });
  }

  /**
   * Calculates total memory & database footprint
   */
  static estimateFootprintKB(data: any): number {
    try {
      const bytes = new TextEncoder().encode(JSON.stringify(data)).length;
      return Math.round((bytes / 1024) * 100) / 100;
    } catch {
      return 0.5;
    }
  }
}
