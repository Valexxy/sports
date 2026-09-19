import { blogPosts } from '../../../lib/blog-data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts.find(p => p.slug === params.slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: `${post.title} | Mivaj Insider`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${params.slug}` }
  };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = blogPosts.find(p => p.slug === params.slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-12 font-sans">
      <article className="max-w-3xl mx-auto">
        <header className="mb-10 text-center">
          <time className="text-emerald-400 font-bold text-sm">{post.date}</time>
          <h1 className="text-4xl md:text-5xl font-black mt-4 mb-6 leading-tight">{post.title}</h1>
          <p className="text-slate-400">By {post.author}</p>
        </header>
        
        <div className="prose prose-invert prose-emerald max-w-none">
          {/* Mock content injection */}
          <p className="text-xl leading-relaxed text-slate-300 mb-8">{post.excerpt}</p>
          <div className="bg-slate-900 border-l-4 border-emerald-500 p-6 rounded-r-lg my-8">
            <h3 className="text-emerald-400 font-bold mb-2">? VIP Tactical Insight</h3>
            <p>Our algorithms have detected a massive shift in Premier League away-team win probabilities this month. <a href="/" className="text-white underline font-bold">Check today's live predictions.</a></p>
          </div>
          <p className="text-slate-300 leading-relaxed">
            In 2026, relying on gut feeling is mathematically obsolete. The bookmakers are using advanced ML models to set their lines, which means the only way to beat them is with a superior ML model. Enter Mivaj.
          </p>
        </div>
      </article>
      
      {/* JSON-LD for Instant Indexing Validation */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": post.title,
            "datePublished": post.date,
            "author": [{ "@type": "Organization", "name": "Mivaj AI" }]
          })
        }}
      />
    </div>
  );
}
