'use client';
import React, { useState, useEffect } from 'react';
import { 
  Newspaper, Send, Check, AlertCircle, Sparkles, 
  BookOpen, PenTool, Flame, ArrowRight, Eye, X, 
  Image as ImageIcon, Quote, BarChart2, Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { generateStableArticleId } from '../../lib/article-extractor';

const LEAGUES = [
  'Premier League 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'UEFA Champions League 🇪🇺',
  'La Liga 🇪🇸',
  'Serie A 🇮🇹',
  'Bundesliga 🇩🇪',
  'Ligue 1 🇫🇷',
  'NPFL Nigeria 🦅',
  'Transfer Rumors 🔄',
  'Tactical Breakdown 📊',
];

const PRESET_IMAGES = [
  { label: 'Stadium Floodlights 🏟️', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80' },
  { label: 'Tactical Pitch Board 🧠', url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80' },
  { label: 'Goal Celebration ⚽', url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80' },
  { label: 'Transfer Megaphone 🔄', url: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=800&q=80' },
];

interface GhostBloggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onArticlePublished?: (newArticle: any) => void;
}

export const GhostBloggerModal: React.FC<GhostBloggerModalProps> = ({ isOpen, onClose, onArticlePublished }) => {
  const [authorName, setAuthorName] = useState('SportsAnalyst');
  const [category, setCategory] = useState(LEAGUES[0]);
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('mivaj_user_nickname');
      if (stored) setAuthorName(stored);
    } catch {}
  }, []);

  if (!isOpen) return null;

  const totalWords = [summary, content].join(' ').trim().split(/\s+/).filter(Boolean).length;

  const handleInsertHelper = (snippet: string) => {
    phoneHardware.triggerHaptic('SELECTION');
    setContent((prev) => (prev ? `${prev}\n\n${snippet}` : snippet));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || totalWords < 25) {
      setStatusMsg({ type: 'error', text: 'Article must have a headline and at least 25 words in the editorial story.' });
      return;
    }

    setSubmitting(true);
    try {
      phoneHardware.triggerHaptic('SELECTION');

      const fullContent = [
        summary.trim(),
        '',
        content.trim(),
      ].filter(Boolean).join('\n\n');

      const newArticle = {
        id: generateStableArticleId(`ghost_${Date.now()}`, title.trim()),
        title: title.trim(),
        description: summary.trim() || content.slice(0, 160),
        link: `https://mivaj.com/?news=${generateStableArticleId(`ghost_${Date.now()}`, title.trim())}`,
        pubDate: 'Just now',
        source: `Ghost Desk • @${authorName.trim()}`,
        category: category.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim(),
        categoryBadge: '✍️ GHOST BLOG',
        imageUrl: imageUrl || PRESET_IMAGES[0].url,
        fullContent,
      };

      // 1. Permanently store in localStorage
      try {
        const stored = localStorage.getItem('mivaj_custom_ghost_articles');
        const list = stored ? JSON.parse(stored) : [];
        localStorage.setItem('mivaj_custom_ghost_articles', JSON.stringify([newArticle, ...list]));
        localStorage.setItem('mivaj_user_nickname', authorName.trim());
      } catch {}

      if (onArticlePublished) {
        onArticlePublished(newArticle);
      }

      // 2. Submit to API / Telegram channel
      const res = await fetch('/api/news/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          category,
          authorName: authorName.trim(),
          summary: summary.trim(),
          content: content.trim(),
          imageUrl: imageUrl || PRESET_IMAGES[0].url,
          fullContent,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMsg({
          type: 'success',
          text: '🎉 Article published live! Added to your news desk and sent to owner moderation.',
        });
        phoneHardware.triggerHaptic('SUCCESS');
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
        setTimeout(() => {
          onClose();
        }, 2500);
      } else {
        // Even if server moderation returns pending, article was saved locally for user
        setStatusMsg({ type: 'success', text: 'Article saved to your personal news feed!' });
        setTimeout(() => onClose(), 2000);
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Network error, but article saved locally in your browser.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md font-mono">
      <div className="relative w-full max-w-2xl bg-[#090d16] border border-white/10 rounded-3xl p-4 sm:p-6 max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-stadiumGreen/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-2xl bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40">
              <PenTool className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white flex items-center space-x-1.5">
                <span>Ghost Blogger Suite</span>
                <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold text-[9px] font-bold">NEW STYLE</span>
              </h2>
              <p className="text-[10px] text-gray-400 font-sans">
                Publish authentic football stories, breaking news &amp; tactical longforms
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all ${
                previewMode
                  ? 'bg-stadiumGreen text-black font-black'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{previewMode ? 'Edit Mode' : 'Live Preview'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Message */}
        {statusMsg && (
          <div
            className={`my-2 p-3 rounded-2xl text-xs font-sans flex items-center space-x-2 ${
              statusMsg.type === 'success'
                ? 'bg-stadiumGreen/20 border border-stadiumGreen/40 text-stadiumGreen'
                : 'bg-crimson/20 border border-crimson/40 text-red-300'
            }`}
          >
            {statusMsg.type === 'success' ? <Check className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto scrollbar-thin py-3 pr-1">
          {previewMode ? (
            /* Modern Full-Story Preview Tab */
            <div className="space-y-4 p-4 rounded-2xl bg-black/60 border border-white/10">
              {imageUrl && (
                <div className="w-full h-44 rounded-2xl overflow-hidden relative">
                  <img src={imageUrl} alt="Cover" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-stadiumGreen text-black text-[10px] font-black uppercase tracking-wider">
                    {category}
                  </span>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-[10px] text-gray-400">
                  <span>By @{authorName} (Independent Reporter)</span>
                  <span>&bull;</span>
                  <span>Just now</span>
                </div>
                <h1 className="text-base sm:text-xl font-black text-white leading-tight font-sans">
                  {title || 'Headline will appear here'}
                </h1>
                {summary && (
                  <p className="text-xs sm:text-sm text-gray-300 font-sans font-bold leading-relaxed border-l-2 border-stadiumGreen pl-3 italic">
                    {summary}
                  </p>
                )}
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-gray-200 font-sans leading-relaxed pt-2 border-t border-white/10">
                {content ? (
                  content.split(/\n\s*\n/).map((para, idx) => {
                    if (para.startsWith('>')) {
                      return (
                        <blockquote key={idx} className="p-3 rounded-xl bg-white/5 border-l-2 border-gold text-xs text-gold italic">
                          {para.replace(/^>\s*/, '')}
                        </blockquote>
                      );
                    }
                    return <p key={idx}>{para}</p>;
                  })
                ) : (
                  <p className="text-gray-500 italic">Full story content will appear here as you type...</p>
                )}
              </div>
            </div>
          ) : (
            /* Modern Editorial Form (The New Style for Blogs/News) */
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Row 1: Author Alias & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] text-gray-400 font-bold block mb-1">Author Alias (@Username)</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Your Name / Pen Name"
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-stadiumGreen"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 font-bold block mb-1">Competition / Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-stadiumGreen font-mono"
                  >
                    {LEAGUES.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Headline */}
              <div>
                <label className="text-[10px] text-gray-400 font-bold block mb-1">Article Headline / Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Tactical Masterclass: How Arteta Disarmed City's High Press"
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-stadiumGreen font-sans font-bold"
                  required
                />
              </div>

              {/* Row 3: Cover Image Presets */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] text-gray-400 font-bold block">Cover Image (Pick Preset or Enter URL)</label>
                  <span className="text-[10px] text-stadiumGreen flex items-center space-x-1">
                    <ImageIcon className="w-3 h-3" />
                    <span>HD Ready</span>
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-2">
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className={`px-2 py-1.5 rounded-xl border text-[10px] truncate text-left transition-all ${
                        imageUrl === preset.url
                          ? 'bg-stadiumGreen/20 border-stadiumGreen text-stadiumGreen font-bold'
                          : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-stadiumGreen font-mono text-[11px]"
                />
              </div>

              {/* Row 4: Executive Summary / Lead Hook */}
              <div>
                <label className="text-[10px] text-gray-400 font-bold block mb-1">Lead Hook / Quick Summary (1-2 sentences)</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="The opening hook summarizing the key turning point, tactical shift, or breaking development..."
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-stadiumGreen resize-none font-sans"
                  rows={2}
                />
              </div>

              {/* Row 5: Full Editorial Story (The New Style for Blogs/News) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] text-gray-400 font-bold block">Full Editorial Story (The Entire Narrative)</label>
                  <div className="flex items-center space-x-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => handleInsertHelper('> "We stuck to the high-tempo plan and exploited the half-spaces," noted the manager.')}
                      className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-gold border border-gold/30 flex items-center space-x-1"
                    >
                      <Quote className="w-2.5 h-2.5" />
                      <span>Quote</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertHelper('Tactical Breakdown: The defensive shape held a 4-4-2 low block, neutralizing transition threats.')}
                      className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 border border-cyan-400/30 flex items-center space-x-1"
                    >
                      <BarChart2 className="w-2.5 h-2.5" />
                      <span>Tactics</span>
                    </button>
                  </div>
                </div>

                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write the complete story here. Multi-paragraph formatting is fully supported. No rigid box dividers — your words flow naturally just like top sports publications..."
                  className="w-full bg-black/60 border border-white/10 rounded-2xl p-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-stadiumGreen font-sans resize-y min-h-[160px] leading-relaxed"
                  rows={6}
                  required
                />
                <div className="flex items-center justify-between pt-1 text-[10px] text-gray-500 font-mono">
                  <span>{totalWords} words total (min. 25)</span>
                  <span className={totalWords >= 25 ? 'text-stadiumGreen font-bold' : 'text-amber-400'}>
                    {totalWords >= 25 ? '✓ Ready to publish' : 'Add more details'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setPreviewMode(true)}
                  className="px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition-all flex items-center space-x-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview Article</span>
                </button>

                <button
                  type="submit"
                  disabled={submitting || totalWords < 25 || !title.trim()}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-stadiumGreen to-emerald-400 hover:from-emerald-400 hover:to-stadiumGreen text-black font-black text-xs shadow-lg shadow-stadiumGreen/20 flex items-center space-x-1.5 disabled:opacity-40 active:scale-95 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Publishing...' : 'Publish Article Live'}</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
