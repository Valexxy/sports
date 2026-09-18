import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const name = params.slug.replace(/-/g, ' ');
  return {
    title: ${name.toUpperCase()} Birthday, Stats, and Legacy | Mivaj Sports,
    description: Celebrate 's birthday today! View their career stats, iconic moments, and place in football history.,
  };
}

export default function BirthdayPage({ params }: { params: { slug: string } }) {
  const name = params.slug.replace(/-/g, ' ').toUpperCase();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
          ?? Happy Birthday, {name}!
        </h1>
        <p className="text-slate-400">View their legendary career stats and join the celebration.</p>
        
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-8">
          <p className="text-slate-300">Join our Telegram channel for daily World Star Birthdays and exclusive betting predictions.</p>
          <a href="https://t.me/mivajsport" className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg">
            Join Mivaj Telegram
          </a>
        </section>
      </div>
    </div>
  );
}
