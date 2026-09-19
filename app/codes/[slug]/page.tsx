import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const code = params.slug.toUpperCase();
  return {
    title: `Convert SportyBet Code ${code} to 1xBet, Bet9ja, BetKing | Mivaj Converter`,
    description: `Instantly convert betting code ${code} across platforms. Get AI tactical insights and odds value for this specific booking code.`,
    alternates: { canonical: `/codes/${params.slug}` }
  };
}

export default function CodesPage({ params }: { params: { slug: string } }) {
  return <div>Codes Page for {params.slug}</div>;
}
