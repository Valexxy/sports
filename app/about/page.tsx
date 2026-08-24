'use client';

import React from 'react';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-void text-white p-4 sm:p-8 font-mono text-xs space-y-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-stadiumGreen via-gold to-cyan-400 text-black font-black text-xl shadow-lg">
              ⚡
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-white">ABOUT MIVAJ SPORTS</h1>
              <p className="text-[10px] text-gray-400 font-sans">Next-Gen AI Sports Intelligence & Fan Culture</p>
            </div>
          </div>
          <Link href="/" className="px-3.5 py-1.5 rounded-xl bg-panel border border-white/10 text-stadiumGreen font-black text-xs hover:bg-stadiumGreen/20 transition-all flex items-center space-x-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>

        {/* Content Box */}
        <div className="glass-panel-premium rounded-3xl border border-white/15 p-5 sm:p-8 space-y-5 text-gray-300 font-sans text-xs leading-relaxed">
          
          <div className="space-y-2">
            <h2 className="font-mono text-white font-black text-sm">Our Mission</h2>
            <p>
              Mivaj Sports is Africa's premier hyper-engaging sports intelligence ecosystem. We combine advanced mathematical models (Poisson & Dixon-Coles distributions) with real-time match tracking, authentic African audio commentary, and gamified social fan engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-black/60 border border-stadiumGreen/40 space-y-1">
              <span className="font-mono font-black text-stadiumGreen text-xs block">AI Intelligence</span>
              <p className="text-[10px] text-gray-400">Deep neural match simulations calculating real win probabilities and xG power.</p>
            </div>
            <div className="p-4 rounded-2xl bg-black/60 border border-gold/40 space-y-1">
              <span className="font-mono font-black text-gold text-xs block">African Culture</span>
              <p className="text-[10px] text-gray-400">Procedural talking drums, authentic Pidgin commentary, and high-energy fan banter.</p>
            </div>
            <div className="p-4 rounded-2xl bg-black/60 border border-cyan-400/40 space-y-1">
              <span className="font-mono font-black text-cyan-400 text-xs block">Talent Scouting</span>
              <p className="text-[10px] text-gray-400">Grassroots wonderkid index tracking the next generation of African superstars.</p>
            </div>
          </div>

          {/* WhatsApp Direct Communication Desk */}
          <div className="p-4 rounded-2xl bg-panel border border-stadiumGreen/40 space-y-3">
            <span className="font-mono font-black text-white text-xs block">Official Communication Desk:</span>
            <p className="text-[11px] text-gray-300 font-sans">
              For corporate sponsorships, brand partnerships, grassroots scouting inquiries, or general communication, reach our official team directly on WhatsApp:
            </p>
            <a
              href="https://wa.me/2348072015725"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#25D366] text-black font-black text-xs inline-flex items-center space-x-2 shadow-lg hover:scale-105 transition-all"
            >
              <MessageCircle className="w-4 h-4 text-black fill-black" />
              <span>Chat Directly on WhatsApp (+234 807 201 5725) ➔</span>
            </a>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-[11px] text-gray-400 font-mono">
            &copy; {new Date().getFullYear()} Mivaj.com &bull; Lagos, Nigeria &bull; Worldwide Broadcast
          </div>

        </div>

      </div>
    </div>
  );
}
