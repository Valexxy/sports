import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const code = params.slug.toUpperCase();
  return {
    title: Convert SportyBet Code  to 1xBet, Bet9ja, BetKing | Mivaj Converter,
    description: Instantly convert betting code  across platforms. Get AI tactical insights and odds value for this specific booking code.,
  };
}

export default function BookingCodePage({ params }: { params: { slug: string } }) {
  const code = params.slug.toUpperCase();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8 text-center">
        <h1 className="text-4xl font-bold text-emerald-400">
          Booking Code: {code}
        </h1>
        <p className="text-slate-400">AI Conversion & Tactical Validation</p>
        
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-8">
          <p className="text-slate-300">To convert this code or check its AI win probability, use the Mivaj Command Center.</p>
          <a href="https://t.me/mivajsport" className="inline-block mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg">
            Convert Code in Telegram
          </a>
        </section>
      </div>
    </div>
  );
}
