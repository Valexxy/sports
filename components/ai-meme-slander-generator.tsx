'use client';

import React, { useState, useRef } from 'react';
import { Sparkles, Download, Share2, Copy, Check, RefreshCw, Flame, Ghost, Crown, Skull, CreditCard } from 'lucide-react';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';
import confetti from 'canvas-confetti';

interface MemeTemplate {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  defaultPlayer: string;
  defaultRoast: string;
  icon: string;
  bgGradient: string;
}

const TEMPLATES: MemeTemplate[] = [
  {
    id: 'ghost',
    title: 'Ghost of the Match 👻',
    badge: '0 AURA DETECTED',
    badgeColor: 'bg-gray-700 text-gray-200',
    defaultPlayer: 'Mudryk',
    defaultRoast: '0 Goals • 0 Assists • 90 Mins of Pure Cardio 🏃💨',
    icon: '👻',
    bgGradient: 'from-gray-900 via-black to-slate-950',
  },
  {
    id: 'baller',
    title: 'Certified Baller 👑',
    badge: 'GENERATIONAL AURA',
    badgeColor: 'bg-gold text-black font-black',
    defaultPlayer: 'Lamine Yamal',
    defaultRoast: 'Cooked the entire defense, ate, and left no crumbs 🧑‍🍳🔥',
    icon: '👑',
    bgGradient: 'from-emerald-950 via-black to-gold/20',
  },
  {
    id: 'ref',
    title: 'Ref Don Collect Alert 💳',
    badge: 'VAR CORRUPTION',
    badgeColor: 'bg-crimson text-white font-black',
    defaultPlayer: 'Premier League Ref',
    defaultRoast: 'Bank balance just credited! Clear penalty ignored 💀💰',
    icon: '💳',
    bgGradient: 'from-red-950 via-black to-rose-950',
  },
  {
    id: 'vanished',
    title: 'Where Dem Dey Hide? 🔎',
    badge: 'VANISHED IN BIG GAME',
    badgeColor: 'bg-amber-500 text-black font-bold',
    defaultPlayer: 'Haaland (in Finals)',
    defaultRoast: 'Touch count: 4 • Expected Goals: 0.00 • Vanished into thin air 💨',
    icon: '🔎',
    bgGradient: 'from-amber-950 via-black to-yellow-950',
  },
];

export const AIMemeSlanderGenerator: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate>(TEMPLATES[0]);
  const [playerName, setPlayerName] = useState(TEMPLATES[0].defaultPlayer);
  const [customRoast, setCustomRoast] = useState(TEMPLATES[0].defaultRoast);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleSelectTemplate = (tmpl: MemeTemplate) => {
    setSelectedTemplate(tmpl);
    setPlayerName(tmpl.defaultPlayer);
    setCustomRoast(tmpl.defaultRoast);
    phoneHardware.triggerHaptic('SELECTION');
  };

  const handleShareWhatsApp = () => {
    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.playSuccessSound();
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    const text = `🔥 *[${selectedTemplate.title.toUpperCase()}]* 🔥\n\n👤 *Player:* ${playerName}\n💬 "${customRoast}"\n\n👉 Generate your own roast card: https://mivaj.com`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleShareTwitter = () => {
    phoneHardware.triggerHaptic('SUCCESS');
    const text = `[${selectedTemplate.title}] ${playerName}: "${customRoast}" 🔥 Created on Mivaj Sports https://mivaj.com`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <section className="glass-panel-premium rounded-3xl border-2 border-gold/50 p-4 sm:p-6 space-y-4 font-mono text-xs text-white shadow-2xl glow-emerald">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-gold via-amber-400 to-crimson text-black font-black text-xl shadow-lg">
            🎨
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-black text-sm sm:text-base text-white">
                INSTANT AI SLANDER & MEME CARD CREATOR 🎭
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-gold text-black font-black text-[9px]">
                VIRAL MEME ENGINE
              </span>
            </div>
            <p className="text-[10px] text-gray-300 font-sans mt-0.5">
              Generate 1-click banter & roast cards watermarked for WhatsApp Status, TikTok & Twitter/X.
            </p>
          </div>
        </div>
      </div>

      {/* Template Selector Pills */}
      <div className="flex flex-wrap gap-2">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => handleSelectTemplate(t)}
            className={`px-3 py-1.5 rounded-xl font-black text-[11px] transition-all flex items-center space-x-1.5 ${
              selectedTemplate.id === t.id
                ? 'bg-gold text-black shadow-lg scale-105'
                : 'bg-black/60 text-gray-300 hover:text-white border border-white/10'
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.title}</span>
          </button>
        ))}
      </div>

      {/* Editor & Preview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        
        {/* Left: Input Controls */}
        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
          <div>
            <label className="text-[10px] text-gray-400 block mb-1 font-bold">TARGET PLAYER / TEAM</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter player or team name..."
              className="w-full p-2.5 rounded-xl bg-black border border-white/20 text-white font-mono focus:border-gold focus:outline-none text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] text-gray-400 block mb-1 font-bold">CUSTOM SPICY ROAST CAPTION</label>
            <textarea
              rows={3}
              value={customRoast}
              onChange={(e) => setCustomRoast(e.target.value)}
              placeholder="Type your funny roast..."
              className="w-full p-2.5 rounded-xl bg-black border border-white/20 text-white font-mono focus:border-gold focus:outline-none text-xs"
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
            <button
              onClick={handleShareWhatsApp}
              className="flex-1 py-2.5 rounded-xl bg-[#25D366] text-black font-black text-xs flex items-center justify-center space-x-1.5 hover:scale-105 transition-all shadow-md"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share to WhatsApp Status ➔</span>
            </button>
            <button
              onClick={handleShareTwitter}
              className="px-4 py-2.5 rounded-xl bg-[#1DA1F2] text-white font-black text-xs flex items-center justify-center space-x-1.5 hover:scale-105 transition-all shadow-md"
            >
              <span>Post to X</span>
            </button>
          </div>
        </div>

        {/* Right: Live Graphic Card Preview */}
        <div
          ref={cardRef}
          className={`p-6 rounded-3xl bg-gradient-to-br ${selectedTemplate.bgGradient} border-2 border-gold/60 shadow-2xl text-center space-y-4 relative overflow-hidden`}
        >
          <div className="absolute top-3 right-3 text-2xl opacity-60">
            {selectedTemplate.icon}
          </div>

          <span className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${selectedTemplate.badgeColor}`}>
            {selectedTemplate.badge}
          </span>

          <div className="space-y-1">
            <span className="text-3xl block">⚽</span>
            <h3 className="text-xl font-black text-white">{playerName}</h3>
            <p className="text-xs text-gold font-bold italic px-2">"{customRoast}"</p>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[9px] text-gray-400 font-mono">
            <span>🔥 MIVAJ SPORTS ROAST</span>
            <span className="text-stadiumGreen font-black">HTTPS://MIVAJ.COM</span>
          </div>
        </div>

      </div>

    </section>
  );
};
