'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Smartphone, Apple, ShieldCheck, Zap, Sparkles, CheckCircle2, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DownloadAppPage() {
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    setIsAndroid(/android/i.test(ua));
    setIsIOS(/iphone|ipad|ipod/i.test(ua));

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    });
  }, []);

  const handlePwaInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
        setInstalled(true);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      alert("To install on iPhone/iPad: Tap the Share button (square with arrow pointing up) at the bottom of Safari, then select 'Add to Home Screen' 📲");
    } else {
      alert("App can be installed directly from your browser menu: Tap (⋮) ➔ 'Install App' or 'Add to Home screen'");
    }
  };

  return (
    <div className="min-h-screen bg-[#070c18] text-white p-4 sm:p-8 font-sans selection:bg-stadiumGreen selection:text-black">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-xs font-mono text-gray-400 hover:text-stadiumGreen transition-colors p-2 rounded-xl bg-panel border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Live Scores</span>
          </Link>
          <span className="text-xs font-mono text-stadiumGreen font-black px-3 py-1 rounded-full bg-stadiumGreen/10 border border-stadiumGreen/30">
            OFFICIAL NATIVE APP
          </span>
        </div>

        {/* Hero Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-panel via-black to-emerald-950/40 border-2 border-stadiumGreen/40 shadow-2xl relative overflow-hidden text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-stadiumGreen/20 border border-stadiumGreen/50 flex items-center justify-center mx-auto shadow-lg shadow-stadiumGreen/20">
            <Smartphone className="w-8 h-8 text-stadiumGreen animate-pulse" />
          </div>

          <div>
            <span className="text-xs font-mono text-gold font-bold uppercase tracking-widest block mb-1">
              Live Real-Time Telemetry & Banker Wire
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Get the <span className="text-stadiumGreen">Mivaj Sports</span> Native App
            </h1>
            <p className="text-gray-300 text-xs sm:text-sm font-sans max-w-lg mx-auto mt-2 leading-relaxed">
              Sub-second goal heartbeat vibrations, lock-screen live trackers, referee ledger audits, and zero-delay banker notifications directly on your phone.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 max-w-md mx-auto text-center font-mono">
            <div className="p-2 rounded-xl bg-black/40 border border-white/5">
              <span className="text-stadiumGreen font-black text-sm block">0.2s</span>
              <span className="text-[10px] text-gray-400">Goal Alert Speed</span>
            </div>
            <div className="p-2 rounded-xl bg-black/40 border border-white/5">
              <span className="text-gold font-black text-sm block">84%+</span>
              <span className="text-[10px] text-gray-400">Banker Win Rate</span>
            </div>
            <div className="p-2 rounded-xl bg-black/40 border border-white/5">
              <span className="text-cyan-400 font-black text-sm block">100%</span>
              <span className="text-[10px] text-gray-400">Free Lifetime</span>
            </div>
          </div>
        </div>

        {/* Download & Install Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Android Card */}
          <div className="p-6 rounded-3xl bg-panel border border-white/10 hover:border-stadiumGreen/40 transition-all space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-stadiumGreen">
                <Smartphone className="w-5 h-5" />
                <span className="font-mono font-black text-sm uppercase tracking-wider">Android APK</span>
              </div>
              <h3 className="text-lg font-black text-white">Direct Android App (.APK)</h3>
              <p className="text-xs text-gray-400 font-sans leading-relaxed">
                Download the official native Android APK directly to your phone. Compatible with Android 8.0 and above.
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/10">
              <button
                onClick={handlePwaInstall}
                className="w-full py-3.5 px-4 rounded-2xl bg-stadiumGreen hover:bg-emerald-400 text-black font-black text-xs font-mono flex items-center justify-center space-x-2 shadow-lg shadow-stadiumGreen/20 active:scale-95 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>INSTALL APP ON PHONE</span>
              </button>
              <span className="text-[10px] text-gray-500 font-mono block text-center">
                ✓ Auto-updates live on every GitHub release
              </span>
            </div>
          </div>

          {/* iOS Card */}
          <div className="p-6 rounded-3xl bg-panel border border-white/10 hover:border-cyan-400/40 transition-all space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-cyan-400">
                <Apple className="w-5 h-5" />
                <span className="font-mono font-black text-sm uppercase tracking-wider">Apple iOS (iPhone)</span>
              </div>
              <h3 className="text-lg font-black text-white">iPhone & iPad Web App</h3>
              <p className="text-xs text-gray-400 font-sans leading-relaxed">
                Add directly to your iPhone Home Screen. Zero App Store downloads needed. Launches in full-screen native mode.
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/10">
              <button
                onClick={handlePwaInstall}
                className="w-full py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-xs font-mono flex items-center justify-center space-x-2 border border-white/20 active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4 text-gold" />
                <span>ADD TO IPHONE HOME SCREEN</span>
              </button>
              <span className="text-[10px] text-gray-500 font-mono block text-center">
                Safari: Tap Share ➔ Add to Home Screen
              </span>
            </div>
          </div>

        </div>

        {/* Feature Highlights */}
        <div className="p-6 rounded-3xl bg-panel border border-white/10 space-y-4 text-xs font-mono">
          <span className="text-xs font-black uppercase text-gold block">Native Phone Capabilities:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-300">
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-stadiumGreen flex-shrink-0 mt-0.5" />
              <span><strong>Hardware Vibration:</strong> Instant physical rumble on goals, red cards, and fulltime wins.</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-stadiumGreen flex-shrink-0 mt-0.5" />
              <span><strong>Lock Screen Pinning:</strong> Keep live match clocks pinned to your phone display.</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-stadiumGreen flex-shrink-0 mt-0.5" />
              <span><strong>Instant OTA Updates:</strong> Whenever code is updated on GitHub, your app updates automatically.</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-stadiumGreen flex-shrink-0 mt-0.5" />
              <span><strong>Data-Saver Mode:</strong> 95% reduced data footprint with offline-first caching.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
