import { NextResponse } from 'next/server';
import { getRedisCache, setRedisCache } from '../../../../lib/upstash-redis-engine';
import { getCdnHeaders } from '../../../../lib/cdn-cache-engine';

export const dynamic = 'force-dynamic';
export const maxDuration = 45;

export interface TransferDeal {
  id: string;
  playerName: string;
  avatarUrl?: string;
  position: string;
  age: number;
  fromClub: string;
  toClub: string;
  fee: string;
  marketValue: string;
  dealType: 'CONFIRMED' | 'LOAN' | 'RUMOR';
  league: string;
  date: string;
  verifiedBadge: boolean;
  impactAnalysis: string;
}

const SEED_TRANSFERS: TransferDeal[] = [
  {
    id: 'tr-001',
    playerName: 'Kylian Mbappé',
    position: 'Forward / Winger',
    age: 26,
    fromClub: 'Paris Saint-Germain',
    toClub: 'Real Madrid',
    fee: 'Free Transfer (₦180B Signing Package)',
    marketValue: '€180.00m',
    dealType: 'CONFIRMED',
    league: 'La Liga 🇪🇸',
    date: 'Summer 2026',
    verifiedBadge: true,
    impactAnalysis: 'Supercharges Real Madrid attack. Dixon-Coles goal expectancy up from 2.1 to 2.8 per match.',
  },
  {
    id: 'tr-002',
    playerName: 'Victor Osimhen',
    position: 'Center Forward',
    age: 27,
    fromClub: 'Napoli',
    toClub: 'Galatasaray',
    fee: '€75.00m (Loan / Buy Clause)',
    marketValue: '€100.00m',
    dealType: 'CONFIRMED',
    league: 'Super Lig 🇹🇷',
    date: 'Aug 2026',
    verifiedBadge: true,
    impactAnalysis: 'Dominant aerial target. Locks Galatasaray as heavy bankers in domestic home fixtures.',
  },
  {
    id: 'tr-003',
    playerName: 'Julián Álvarez',
    position: 'Center Forward',
    age: 25,
    fromClub: 'Manchester City',
    toClub: 'Atlético Madrid',
    fee: '€75.00m + €20m addons',
    marketValue: '€90.00m',
    dealType: 'CONFIRMED',
    league: 'La Liga 🇪🇸',
    date: 'Aug 2026',
    verifiedBadge: true,
    impactAnalysis: 'Increases Atletico transition speed. Elevates Over 1.5 Goals hit rate to 82%.',
  },
  {
    id: 'tr-004',
    playerName: 'Riccardo Calafiori',
    position: 'Center Back / Left Back',
    age: 23,
    fromClub: 'Bologna',
    toClub: 'Arsenal',
    fee: '€45.00m',
    marketValue: '€45.00m',
    dealType: 'CONFIRMED',
    league: 'Premier League 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    date: 'Aug 2026',
    verifiedBadge: true,
    impactAnalysis: 'Fortifies Arsenal clean sheet probability. High value for Under 2.5 in tough away derbies.',
  },
  {
    id: 'tr-005',
    playerName: 'Pedro Neto',
    position: 'Right Winger',
    age: 25,
    fromClub: 'Wolves',
    toClub: 'Chelsea',
    fee: '€60.00m + €3m',
    marketValue: '€55.00m',
    dealType: 'CONFIRMED',
    league: 'Premier League 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    date: 'Aug 2026',
    verifiedBadge: true,
    impactAnalysis: 'Explosive winger depth. Sharp increases in second-half goals for Chelsea fixtures.',
  },
  {
    id: 'tr-006',
    playerName: 'Dani Olmo',
    position: 'Attacking Midfield',
    age: 27,
    fromClub: 'RB Leipzig',
    toClub: 'Barcelona',
    fee: '€55.00m + €7m',
    marketValue: '€60.00m',
    dealType: 'CONFIRMED',
    league: 'La Liga 🇪🇸',
    date: 'Aug 2026',
    verifiedBadge: true,
    impactAnalysis: 'Clinical link between midfield and Lewy. High confidence on Both Teams To Score (BTTS).',
  },
  {
    id: 'tr-007',
    playerName: 'Ademola Lookman',
    position: 'Forward / Winger',
    age: 27,
    fromClub: 'Atalanta',
    toClub: 'Paris Saint-Germain',
    fee: '€50.00m (Advanced Negotiations)',
    marketValue: '€40.00m',
    dealType: 'RUMOR',
    league: 'Ligue 1 🇫🇷',
    date: 'Aug 2026',
    verifiedBadge: false,
    impactAnalysis: 'Ballon d\'Or nominated Nigerian speedster. Immediate starting role projected.',
  },
  {
    id: 'tr-008',
    playerName: 'Mikel Merino',
    position: 'Central Midfielder',
    age: 28,
    fromClub: 'Real Sociedad',
    toClub: 'Arsenal',
    fee: '€32.50m + €5m',
    marketValue: '€50.00m',
    dealType: 'CONFIRMED',
    league: 'Premier League 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    date: 'Aug 2026',
    verifiedBadge: true,
    impactAnalysis: 'Duel winning machine in European football. Stabilizes midfield control for 1X double chances.',
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const typeParam = searchParams.get('type')?.toUpperCase();
  const cacheKey = 'mivaj:transfers:radar';

  try {
    let deals = SEED_TRANSFERS;

    if (typeParam && (typeParam === 'CONFIRMED' || typeParam === 'LOAN' || typeParam === 'RUMOR')) {
      deals = deals.filter(d => d.dealType === typeParam);
    }

    return NextResponse.json({
      success: true,
      count: deals.length,
      source: 'Mivaj Global Transfer & Market Value Wire',
      data: deals,
    }, { headers: getCdnHeaders('TRANSFERS') });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, data: [] }, { status: 500 });
  }
}
