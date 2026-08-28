'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Newspaper, Sparkles } from 'lucide-react';
import { SportsNewsSection } from '../../components/sports-news-section';

export default function NewsHubPage() {
  return (
    <div className="min-h-screen bg-void text-white font-mono p-4 sm:p-8 space-y-6 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link
            href="/"
            className="px-3.5 py-2 rounded-xl bg-panel hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 hover:text-white flex items-center space-x-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Match Center 🏟️</span>
          </Link>

          <div className="flex items-center space-x-2">
            <span className="text-stadiumGreen font-black text-sm">MIVAJ SPORTS</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-black border border-emerald-500/30">
              ENTERPRISE WIRE 📰
            </span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="glass-panel-premium rounded-3xl p-6 sm:p-8 border border-emerald-500/40 space-y-3 shadow-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg">
              <Newspaper className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                ENTERPRISE FOOTBALL WIRE & BLOG 📰
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 font-sans">
                Real-time official transfer breaking wire, match reports, injury lists, manager tactics, and Super Eagles AFCON coverage.
              </p>
            </div>
          </div>
        </div>

        {/* News Section Component */}
        <SportsNewsSection />

      </div>
    </div>
  );
}
