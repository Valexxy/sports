'use client';
import React, { useState, useEffect } from 'react';
import { Newspaper, Send, Check, AlertCircle, Sparkles, BookOpen, PenTool, Flame, ArrowRight, Eye, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../../lib/phone-hardware-engine';

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

interface GhostBloggerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GhostBloggerModal: React.FC<GhostBloggerModalProps> = ({ isOpen, onClose }) => {
  const [authorName, setAuthorName] = useState('SportsAnalyst');
  const [category, setCategory] = useState(LEAGUES[0]);
  const [title, setTitle] = useState('');
  const [leadHook, setLeadHook] = useState('');
  const [tacticalBody, setTacticalBody] = useState('');
  const [keyQuote, setKeyQuote] = useState('');
  const [verdict, setVerdict] = useState('');
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

  const totalWords = [leadHook, tacticalBody, verdict].join(' ').trim().split(/\s+/).filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || totalWords < 40) {
      setStatusMsg({ type: 'error', text: 'Article must have a headline and at least 40 words total across sections.' });
      return;
    }

    setSubmitting(true);
    try {
      phoneHardware.triggerHaptic('SELECTION');
      const fullContent = [
        leadHook.trim(),
        '',
        tacticalBody.trim(),
        keyQuote ? `\n> "${keyQuote.trim()}"` : '',
        '',
        verdict.trim(),
      ].filter(Boolean).join('\n');

      const res = await fetch('/api/news/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          category,
          authorName: authorName.trim(),
          lead: leadHook.trim(),
          body: tacticalBody.trim(),
          quote: keyQuote.trim(),
          verdict: verdict.trim(),
          fullContent,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMsg({
          type: 'success',
          text: '🎉 Article submitted successfully! Sent to owner via Telegram for moderation approval.',
        });
        phoneHardware.triggerHaptic('SUCCESS');
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
        setTimeout(() => {
          onClose();
        }, 3500);
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Submission rejected by moderation engine.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn font-mono text-xs">
      <div className="relative w-full max-w-2xl bg-[#090d16] border-2 border-stadiumGreen/50 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-stadiumGreen/20 text-stadiumGreen">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm sm:text-base text-white">Ghost Blogger Suite</h2>
              <p className="text-[10px] text-gray-400 font-sans">
                Submit structured match recaps & tactical scoops • 100% moderated by owner
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Guided Steps Explanation Banner */}
        <div className="p-3 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between text-[10px] text-gray-300 font-sans">
          <span className="flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gold flex-shrink-0" />
            <span>Format: <strong>Headline ➔ Lead Hook ➔ Tactical Breakdown / xG ➔ Quote ➔ Verdict</strong></span>
          </span>
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="px-2.5 py-1 rounded-lg bg-white/10 text-white font-mono text-[10px] font-bold hover:bg-stadiumGreen hover:text-black transition-all flex items-center space-x-1"
          >
            <Eye className="w-3 h-3" />
            <span>{previewMode ? 'Edit Mode' : 'Live Preview'}</span>
          </button>
        </div>

        {previewMode ? (
          /* Live Article Preview */
          <div className="p-4 rounded-2xl bg-black/80 border border-stadiumGreen/40 space-y-3 font-sans">
            <div className="flex items-center space-x-2">
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-stadiumGreen/20 text-stadiumGreen font-bold font-mono">
                {category}
              </span>
              <span className="text-[10px] text-gray-400">By @{authorName} (Ghost Writer)</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white">{title || 'Headline will appear here'}</h3>
            <p className="text-xs text-gray-300 leading-relaxed font-bold">{leadHook || 'Lead hook opening...'}</p>
            <p className="text-xs text-gray-300 leading-relaxed">{tacticalBody || 'Tactical analysis & xG breakdown...'}</p>
            {keyQuote && (
              <blockquote className="p-2.5 rounded-xl bg-white/5 border-l-2 border-gold text-xs text-gold italic">
                &ldquo;{keyQuote}&rdquo;
              </blockquote>
            )}
            <p className="text-xs text-emerald-400 font-semibold">{verdict || 'Final verdict & upcoming match outlook...'}</p>
          </div>
        ) : (
          /* Guided Submission Form */
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] text-gray-400 font-bold block mb-1">Author Alias (@Username)</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-stadiumGreen"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 font-bold block mb-1">Competition / Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-stadiumGreen"
                >
                  {LEAGUES.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 1. Headline */}
            <div>
              <label className="text-[10px] text-gray-400 font-bold block mb-1">1. Punchy Headline (60-90 chars)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Tactical Masterclass: How Arteta Disarmed City's High Press with Inverted Fullbacks"
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-stadiumGreen"
                required
              />
            </div>

            {/* 2. The Lead Hook */}
            <div>
              <label className="text-[10px] text-gray-400 font-bold block mb-1">2. Opening Lead Hook (What just happened?)</label>
              <textarea
                value={leadHook}
                onChange={(e) => setLeadHook(e.target.value)}
                placeholder="The first paragraph summarizing the result, turning point, or key breakthrough..."
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-stadiumGreen resize-none font-sans"
                rows={2}
                required
              />
            </div>

            {/* 3. Tactical / xG Breakdown */}
            <div>
              <label className="text-[10px] text-gray-400 font-bold block mb-1">3. Tactical Breakdown &amp; Data Analysis</label>
              <textarea
                value={tacticalBody}
                onChange={(e) => setTacticalBody(e.target.value)}
                placeholder="Explain the tactical shifts, defensive duels, xG metrics, or player ratings that decided the outcome..."
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-stadiumGreen resize-none font-sans"
                rows={3}
                required
              />
            </div>

            {/* 4. Key Quote */}
            <div>
              <label className="text-[10px] text-gray-400 font-bold block mb-1">4. Player / Manager Quote (Optional)</label>
              <input
                type="text"
                value={keyQuote}
                onChange={(e) => setKeyQuote(e.target.value)}
                placeholder="e.g. 'We stuck to the high-tempo plan and exploited the half-spaces,' said the coach."
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-stadiumGreen font-sans"
              />
            </div>

            {/* 5. Final Verdict */}
            <div>
              <label className="text-[10px] text-gray-400 font-bold block mb-1">5. Final Verdict &amp; Next Fixture Impact</label>
              <textarea
                value={verdict}
                onChange={(e) => setVerdict(e.target.value)}
                placeholder="How this result changes title/top-4 momentum and what to watch in the next match..."
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-stadiumGreen resize-none font-sans"
                rows={2}
                required
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
              <span>Word Count: <strong className="text-stadiumGreen">{totalWords}</strong> words (Min 40)</span>
              <span>Moderated via Telegram @mivajsport</span>
            </div>

            {statusMsg && (
              <div className={`p-3 rounded-xl text-[11px] font-bold flex items-center space-x-2 ${
                statusMsg.type === 'success' ? 'bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40' : 'bg-crimson/20 text-red-400 border border-crimson/40'
              }`}>
                {statusMsg.type === 'success' ? <Check className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                <span>{statusMsg.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || totalWords < 40 || !title.trim()}
              className="w-full py-3 rounded-xl bg-stadiumGreen hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Verifying & Submitting Article...' : 'Submit Article for Owner Review'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
