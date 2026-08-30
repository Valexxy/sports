'use client';

import React from 'react';
import { FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-void text-white p-4 sm:p-8 font-mono text-xs space-y-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gold text-black font-black text-xl shadow-lg">
              📜
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-white">TERMS OF SERVICE</h1>
              <p className="text-[10px] text-gray-400 font-sans">User Agreement & Operating Conditions</p>
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
            <h2 className="font-mono text-white font-black text-sm">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Mivaj Sports (mivaj.com), you agree to be bound by these Terms of Service. If you do not agree to these terms, please discontinue using the platform immediately.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-mono text-white font-black text-sm">2. Digital Products & Paystack Access Passes</h2>
            <p>
              All purchases made through Paystack (e.g. ₦200, ₦300, ₦500 micro-passes) grant instant digital access to proprietary statistical research, Poisson match analyses, and curated algorithm slips. All sales of digital content are final once delivered.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-mono text-white font-black text-sm">3. Intellectual Property</h2>
            <p>
              All proprietary algorithms, UI designs, sound synthesizers, branding assets, and match analytics on Mivaj Sports are the exclusive property of Mivaj. Unauthorized reproduction or scraping is prohibited.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-mono text-white font-black text-sm">4. Community Conduct & Banter Rules</h2>
            <p>
              Users engaging in live match chat, AI meme generation, or P2P challenges must adhere to respectful community standards. Hate speech, abusive conduct, or fraudulent activities will result in immediate account termination.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-[11px] text-gray-400 flex items-center justify-between flex-wrap gap-2">
            <span>Last Updated: August 2026 &bull; Mivaj Sports Legal Desk</span>
            <button
              type="button"
              onClick={() => { window.location.href = 'mailto:contact@mivaj.com?subject=Terms%20of%20Service%20Inquiry'; }}
              className="text-stadiumGreen font-black hover:underline cursor-pointer bg-transparent border-0 p-0"
            >
              Contact Legal (contact@mivaj.com) ✉️
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
