import { UniversalBetSlip } from '../taxonomy';
import { AFFILIATE_REGISTRY, getAffiliateUrl } from '../../../utils/affiliates';

/**
 * UNIVERSAL CART DEEP-LINK GENERATOR
 * Translates canonical slips into parameterized cart URLs wrapped with tracking tokens.
 */

export interface DeepLinkResult {
  targetBookmaker: string;
  affiliateUrl: string;
  parameterizedCartUrl: string;
  bookingCode: string;
  legsCount: number;
  totalOdds: number;
}

export function generateUniversalCartLink(slip: UniversalBetSlip, targetBookmaker: string): DeepLinkResult {
  const normTarget = (targetBookmaker || 'STAKE').toUpperCase();
  const partner = AFFILIATE_REGISTRY[normTarget] || AFFILIATE_REGISTRY['STAKE'];

  // Generate deterministic cart code
  const hash = Math.abs(slip.slip_canonical_id.split('').reduce((a, b) => a + b.charCodeAt(0), 0));
  const prefixMap: Record<string, string> = {
    'STAKE': 'STAKE-',
    '22BET': '22B-',
    'SPORTYBET': 'SB-',
    'BET9JA': 'B9-',
    '1XBET': '1X-',
  };
  const prefix = prefixMap[normTarget] || 'SLIP-';
  const bookingCode = prefix + (10000 + (hash * 17) % 89999);

  const baseAffiliateUrl = getAffiliateUrl(normTarget, bookingCode);

  // Build parameterized unauthenticated cart payload
  const legParams = slip.legs.map((l, i) => `leg${i + 1}=${encodeURIComponent(l.event.home_entity_name + '_' + l.selection_target)}`).join('&');
  const parameterizedCartUrl = `${baseAffiliateUrl}&${legParams}`;

  return {
    targetBookmaker: normTarget,
    affiliateUrl: baseAffiliateUrl,
    parameterizedCartUrl,
    bookingCode,
    legsCount: slip.legs_count,
    totalOdds: slip.total_cumulative_odds,
  };
}
