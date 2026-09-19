import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const name = params.slug.replace(/-/g, ' ');
  return {
    title: `${name.toUpperCase()} Birthday, Stats, and Legacy | Mivaj Sports`,
    description: `Celebrate ${name}'s birthday today! View their career stats, iconic moments, and place in football history.`
  };
}

export default function BirthdayPage({ params }: { params: { slug: string } }) {
  return <div>Birthday Page for {params.slug}</div>;
}
