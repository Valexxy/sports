'use client';

import React from 'react';
import { Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-void text-white p-4 sm:p-8 font-mono text-xs space-y-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-cyan-400 text-black font-black text-xl shadow-lg">
              🔒
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-white">PRIVACY POLICY & DATA PROTECTION</h1>
              <p className="text-[10px] text-gray-400 font-sans">NDPR & GDPR Compliant Privacy Standards</p>
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
            <h2 className="font-mono text-white font-black text-sm">1. Information We Collect</h2>
            <p>
              We collect minimal information necessary to deliver sports analytics and fan engagement features, including email addresses, web push notification tokens, and localized visitor preference settings.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-mono text-white font-black text-sm">2. Payment Security & PCI-DSS Compliance</h2>
            <p>
              All payments are processed securely via Paystack's PCI-DSS Level 1 certified gateway. Mivaj does not store credit card numbers, CVVs, or banking PINs on its servers.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-mono text-white font-black text-sm">3. Web Push & Notification Privacy</h2>
            <p>
              Users who subscribe to matchday alerts can easily manage or revoke notification permissions directly through their browser or device settings at any time.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-[11px] text-gray-400">
            Last Updated: August 2026 &bull; Data Protection Officer: https://wa.me/2348072015725
          </div>

        </div>

      </div>
    </div>
  );
}
