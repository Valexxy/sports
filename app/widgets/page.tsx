'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Code, Copy, Check, Sparkles, ExternalLink, ShieldCheck, 
  Smartphone, Monitor, Flame, Eye, Layers, Palette
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../../lib/phone-hardware-engine';

export default function WidgetsCenterPage() {
  const [selectedTheme, setSelectedTheme] = useState<'dark' | 'emerald' | 'midnight'>('dark');
  const [selectedType, setSelectedType] = useState<'banker' | 'livescore'>('banker');
  const [copied, setCopied] = useState(false);

  const embedUrl = `https://mivaj.com/embed/match-intel?theme=${selectedTheme}&type=${selectedType}`;
  
  const iframeSnippet = `<!-- Mivaj Sports Live Match & AI Intelligence Widget -->
<iframe 
  src="${embedUrl}" 
  width="100%" 
  height="260" 
  loading="lazy"
  frameborder="0" 
  scrolling="no"
  style="border-radius: 16px; max-width: 440px; border: none; overflow: hidden;"
  title="Mivaj Sports Live AI Intelligence">
</iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(iframeSnippet);
    setCopied(true);
    try {
      phoneHardware.triggerHaptic('SUCCESS');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {}
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-void text-white font-mono p-4 sm:p-8 max-w-6xl mx-auto space-y-8">
      {/* Hero Header */}
      <header className="space-y-3 text-center sm:text-left border-b border-white/10 pb-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-stadiumGreen/10 border border-stadiumGreen/30 text-stadiumGreen text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FREE FOR WEBMASTERS &amp; SPORTS BLOGGERS</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
          Embeddable Live Match &amp; AI Intelligence Widgets
        </h1>
        <p className="text-gray-400 font-sans text-xs sm:text-sm max-w-3xl leading-relaxed">
          Enhance your sports blog, betting community, or news portal with sub-second live score updates, Dixon-Coles Poisson Banker predictions, and real-time referee settlement tracking. 100% free, responsive, and lightweight.
        </p>
      </header>

      {/* Interactive Configurator & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Configurator Column */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 rounded-3xl bg-neutral-950/80 border border-white/10 space-y-5 shadow-xl">
            <h2 className="text-sm font-black uppercase text-gold tracking-wider flex items-center space-x-2">
              <Palette className="w-4 h-4" />
              <span>1. Customize Your Widget</span>
            </h2>

            {/* Theme Selector */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-bold block">COLOR PALETTE</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTheme('dark')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    selectedTheme === 'dark'
                      ? 'bg-white/15 border-gold text-gold shadow-md'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  Dark Void
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTheme('emerald')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    selectedTheme === 'emerald'
                      ? 'bg-emerald-950/60 border-stadiumGreen text-stadiumGreen shadow-md'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  Emerald
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTheme('midnight')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    selectedTheme === 'midnight'
                      ? 'bg-sky-950/60 border-cyan-400 text-cyan-300 shadow-md'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  Midnight
                </button>
              </div>
            </div>

            {/* Widget Mode */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-bold block">DATA FOCUS</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedType('banker')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    selectedType === 'banker'
                      ? 'bg-white/15 border-gold text-gold shadow-md'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  AI Banker Pick
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedType('livescore')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    selectedType === 'livescore'
                      ? 'bg-white/15 border-stadiumGreen text-stadiumGreen shadow-md'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  Live Scorecard
                </button>
              </div>
            </div>

            {/* Embed Snippet Box */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-400 font-bold flex items-center space-x-1.5">
                  <Code className="w-3.5 h-3.5 text-stadiumGreen" />
                  <span>HTML Embed Code</span>
                </label>
                <span className="text-[10px] text-stadiumGreen font-bold">Responsive 100%</span>
              </div>

              <div className="relative">
                <pre className="p-3 rounded-2xl bg-black/80 border border-white/10 text-[11px] text-gray-300 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed select-all">
                  {iframeSnippet}
                </pre>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-stadiumGreen to-emerald-400 hover:brightness-110 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-lg active:scale-95"
              >
                {copied ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4 text-black" />}
                <span>{copied ? 'Copied to Clipboard! 🎉' : 'Copy Embed Code 📋'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Live Preview Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-neutral-950/80 border border-white/10 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-black uppercase tracking-wider text-white">
                  2. Live Interactive Preview
                </span>
              </div>
              <span className="text-[10px] text-gray-500 font-sans">
                Updates in real-time as you tweak styles
              </span>
            </div>

            {/* Widget Preview Frame */}
            <div className="p-6 rounded-2xl bg-black/60 border border-white/5 flex items-center justify-center min-h-[300px]">
              <iframe
                src={`/embed/match-intel?theme=${selectedTheme}&type=${selectedType}`}
                width="100%"
                height="260"
                frameBorder="0"
                scrolling="no"
                style={{ borderRadius: '16px', maxWidth: '440px', border: 'none', overflow: 'hidden' }}
                title="Mivaj Sports Live Widget Preview"
              />
            </div>
          </div>

          {/* Quick Integration Instructions */}
          <div className="p-5 rounded-3xl bg-neutral-950/50 border border-white/10 space-y-3 text-xs font-sans text-gray-400">
            <h3 className="text-xs font-black uppercase font-mono text-white flex items-center space-x-2">
              <Layers className="w-3.5 h-3.5 text-gold" />
              <span>How to Install on Your Website (Takes 30 Seconds)</span>
            </h3>
            <ul className="space-y-2 list-disc list-inside text-gray-300">
              <li>
                <strong className="text-white">WordPress:</strong> Add a &ldquo;Custom HTML&rdquo; block and paste the embed code.
              </li>
              <li>
                <strong className="text-white">Blogger / Blogspot:</strong> Switch to HTML view and paste where you want the card to appear.
              </li>
              <li>
                <strong className="text-white">Wix / Squarespace:</strong> Add an &ldquo;Embed HTML / Code&rdquo; widget and paste the iframe snippet.
              </li>
              <li>
                <strong className="text-white">Custom HTML / React:</strong> Paste directly into your layout, sidebar, or footer.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
