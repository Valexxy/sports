import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const refCode = searchParams.get('id') || searchParams.get('ref') || 'vip';

  // Return referral info, reward tiers, and commission metrics
  return NextResponse.json({
    success: true,
    refCode,
    benefits: {
      freeVipPass: 'Refer 3 active punters to unlock daily 50x Mega Banker Slip free',
      cashbackCommission: 'Earn 20% commission on all tipster and partner deposit referrals',
      instantBonus: '₦250,000 partner sportsbook welcome bonus package',
    },
    shareLinks: {
      telegram: `https://t.me/share/url?url=${encodeURIComponent(`https://mivaj.com/?ref=${refCode}`)}&text=${encodeURIComponent('🔥 Join Mivaj Sports for free daily banker slips and live stadium voice commentary!')}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`🔥 Get free 10x Daily Banker Slips & live scores on Mivaj: https://mivaj.com/?ref=${refCode}`)}`,
    },
  });
}
