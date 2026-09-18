import { getRealLiveAndPlayedMatches, normalizeTeamKey } from '../../../../lib/real-sports-stream';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const matches = await getRealLiveAndPlayedMatches();
  const match = matches.find(m => `${normalizeTeamKey(m.homeTeam)}-vs-${normalizeTeamKey(m.awayTeam)}` === params.slug);
  if (!match) return { title: 'Match Not Found' };
  return {
    title: `${match.homeTeam} vs ${match.awayTeam} Predictions & Odds`,
    description: `Get the best predictions for ${match.homeTeam} vs ${match.awayTeam}. Mivaj AI predicts ${match.prediction?.topPick?.selection}.`
  };
}

export default async function MatchPage({ params }: { params: { slug: string } }) {
  const matches = await getRealLiveAndPlayedMatches();
  const match = matches.find(m => `${normalizeTeamKey(m.homeTeam)}-vs-${normalizeTeamKey(m.awayTeam)}` === params.slug);
  if (!match) notFound();
  const pick = match.prediction?.topPick?.selection;
  const odds = match.prediction?.topPick?.odds;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <p className="text-emerald-400 font-semibold">{match.league}</p>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            {match.homeTeam} vs {match.awayTeam}
          </h1>
        </header>
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
              <p className="text-sm text-slate-400">Algorithmic Pick</p>
              <p className="text-2xl font-bold text-white">{pick || 'N/A'}</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
              <p className="text-sm text-slate-400">Market Value</p>
              <p className="text-2xl font-bold text-emerald-400">{odds ? `@ ${odds}` : 'N/A'}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
