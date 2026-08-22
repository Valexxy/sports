import { NextResponse } from 'next/server';
import { buildDynamicArchive, getLedgerStats } from '../../../lib/prediction-archive-engine';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

/**
 * SETTLEMENT ARCHIVE API
 * Returns the live-computed settlement ledger (real scores only) + stats.
 * Used by client components (History Archive, Ledger Section) so the data
 * is always derived from the real sports stream — zero mocked rows.
 */
export async function GET() {
  try {
    const [archive, stats] = await Promise.all([buildDynamicArchive(), getLedgerStats()]);
    return NextResponse.json({ success: true, archive, stats });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
