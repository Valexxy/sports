'use client';

import React from 'react';
import { ShieldCheck, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export const FooterComplianceDisclaimer: React.FC = () => {
  return (
    <footer className="mt-8 border-t border-white/10 pt-6 pb-12 font-mono text-[10px] text-gray-500 space-y-4 max-w-7xl mx-auto px-4">
      {/* Brand & Regulatory Identity */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-gray-400">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-stadiumGreen" />
          <span className="font-bold text-white tracking-wider">MIVAJ SPORTS & MEDIA</span>
        </div>
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-gray-300 font-black">
          18+ STRICTLY &bull; PLAY RESPONSIBLY
        </span>
      </div>

      {/* Clean Regulatory Notice */}
      <p className="font-sans leading-relaxed text-gray-400">
        Mivaj Sports (mivaj.com) is an independent sports analytics and digital media platform. Mivaj is <strong>not</strong> a bookmaker, does not accept or hold player deposits, and does not provide financial investment advisory services. All "Aura Points" and "Fan Challenges" are 100% free-to-play gamification features.
      </p>

      {/* Clean Exclusive Links Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
        <div className="flex flex-wrap items-center gap-4 text-[10px] text-gray-300 font-bold">
          <Link href="/disclaimer" className="hover:text-stadiumGreen transition-colors">Disclaimer</Link>
          <Link href="/terms" className="hover:text-stadiumGreen transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-stadiumGreen transition-colors">Privacy Policy</Link>
          <Link href="/responsible-gaming" className="hover:text-stadiumGreen transition-colors">Responsible Gaming (18+)</Link>
          <Link href="/about" className="hover:text-stadiumGreen transition-colors">About Mivaj</Link>
        </div>

        {/* Direct WhatsApp Contact Link */}
        <a
          href="https://wa.me/2348072015725"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-black text-[#25D366] hover:underline flex items-center space-x-1"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-[#25D366] text-black" />
          <span>WhatsApp (+234 807 201 5725)</span>
        </a>
      </div>

      <div className="text-[9px] text-gray-500 border-t border-white/5 pt-2">
        &copy; {new Date().getFullYear()} Mivaj.com &bull; All Rights Reserved.
      </div>
    </footer>
  );
};
