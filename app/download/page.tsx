'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Smartphone, Apple, ShieldCheck, Zap, Sparkles, CheckCircle2, QrCode, ExternalLink, HelpCircle, AlertCircle } from 'lucide-react';
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
      alert("To install on iPhone/iPad:\n1. Tap the Share icon (square with arrow ⬆️) at the bottom of Safari\n2. Scroll down and select 'Add to Home Screen'\n3. Tap 'Add' at the top right!");
    } else {
      // Direct download APK trigger
      window.location.href = 'https://github.com/Valexxy/sports/releases/latest/download/mivaj-sports.apk';
    }
  };

  return (
    <div className="min-h-screen bg-[#070c18] text-white p-4 sm:p-8 font-sans selection:bg-stadiumGreen selection:text-black">
      <div className="max-w-4xl mx-auto space-y-6">
        
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
            OFFICIAL NATIVE APP &bull; v2.2
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
              Experience sub-second goal heartbeat vibrations, lock-screen live trackers, referee ledger audits, and zero-delay banker notifications directly on your phone.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 max-w-md mx-auto text-center font-mono">
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
              <span className="text-stadiumGreen font-black text-sm sm:text-base block">0.2s</span>
              <span className="text-[10px] text-gray-400">Goal Alert Speed</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
              <span className="text-gold font-black text-sm sm:text-base block">84%+</span>
              <span className="text-[10px] text-gray-400">Banker Win Rate</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
              <span className="text-cyan-400 font-black text-sm sm:text-base block">100%</span>
              <span className="text-[10px] text-gray-400">Free Lifetime</span>
            </div>
          </div>
        </div>

        {/* Download & Install Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Android Card */}
          <div className="p-6 rounded-3xl bg-panel border-2 border-stadiumGreen/40 hover:border-stadiumGreen transition-all space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-stadiumGreen">
                  <Smartphone className="w-6 h-6" />
                  <span className="font-mono font-black text-sm uppercase tracking-wider">Android (.APK)</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-stadiumGreen/20 text-stadiumGreen text-[10px] font-mono font-bold border border-stadiumGreen/40">
                  Recommended
                </span>
              </div>
              <h3 className="text-xl font-black text-white">Direct Android App (.APK)</h3>
              <p className="text-xs text-gray-300 font-sans leading-relaxed">
                Download the official native Android APK directly to your phone. Includes native haptic rumble on goals and instant lock-screen score tracking.
              </p>

              <div className="p-3 rounded-2xl bg-black/50 border border-white/5 space-y-1.5 text-xs font-mono text-gray-400">
                <div className="flex justify-between">
                  <span>File Size:</span>
                  <strong className="text-white">~4.8 MB (Ultra-Light)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Version:</span>
                  <strong className="text-white">v2.2.0 (Official)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Android Version:</span>
                  <strong className="text-white">8.0 (Oreo) and above</strong>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/10">
              <a
                href="https://github.com/Valexxy/sports/releases/latest/download/mivaj-sports.apk"
                download="mivaj-sports.apk"
                onClick={() => confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } })}
                className="w-full py-4 px-4 rounded-2xl bg-stadiumGreen hover:bg-emerald-400 text-black font-black text-xs sm:text-sm font-mono flex items-center justify-center space-x-2 shadow-lg shadow-stadiumGreen/30 active:scale-95 transition-all text-center"
              >
                <Download className="w-5 h-5" />
                <span>DOWNLOAD ANDROID APK ⬇️</span>
              </a>

              <button
                onClick={handlePwaInstall}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-mono text-xs flex items-center justify-center space-x-1.5 border border-white/10 transition-all"
              >
                <span>Or Install directly to Home Screen 📲</span>
              </button>

              <span className="text-[10px] text-gray-500 font-mono block text-center">
                ✓ 100% Free &bull; No Google Play Store account required
              </span>
            </div>
          </div>

          {/* iOS Card */}
          <div className="p-6 rounded-3xl bg-panel border-2 border-cyan-400/40 hover:border-cyan-400 transition-all space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-cyan-400">
                  <Apple className="w-6 h-6" />
                  <span className="font-mono font-black text-sm uppercase tracking-wider">Apple iOS (iPhone)</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-400 text-[10px] font-mono font-bold border border-cyan-400/40">
                  Safari PWA
                </span>
              </div>
              <h3 className="text-xl font-black text-white">iPhone & iPad Native PWA</h3>
              <p className="text-xs text-gray-300 font-sans leading-relaxed">
                Add Mivaj Sports directly to your iPhone Home Screen via Safari. Launches in standalone full-screen mode with zero browser address bars.
              </p>

              <div className="p-3 rounded-2xl bg-black/50 border border-white/5 space-y-1.5 text-xs font-mono text-gray-400">
                <div className="flex justify-between">
                  <span>Format:</span>
                  <strong className="text-white">Apple Standalone App</strong>
                </div>
                <div className="flex justify-between">
                  <span>Compatibility:</span>
                  <strong className="text-white">iOS 14.0 and above</strong>
                </div>
                <div className="flex justify-between">
                  <span>Updates:</span>
                  <strong className="text-stadiumGreen">Instant Over-The-Air</strong>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/10">
              <button
                onClick={handlePwaInstall}
                className="w-full py-4 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-xs sm:text-sm font-mono flex items-center justify-center space-x-2 border border-cyan-400/50 shadow-lg shadow-cyan-400/10 active:scale-95 transition-all text-center"
              >
                <Sparkles className="w-5 h-5 text-gold" />
                <span>ADD TO IPHONE HOME SCREEN 📱</span>
              </button>

              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-gray-400 text-center">
                Safari: Tap Share (⬆️) ➔ Select <strong>&apos;Add to Home Screen&apos;</strong>
              </div>

              <span className="text-[10px] text-gray-500 font-mono block text-center">
                ✓ 100% Free &bull; No Apple ID payment required
              </span>
            </div>
          </div>

        </div>

        {/* Step-by-Step Installation Visual Guide */}
        <div className="p-6 rounded-3xl bg-panel border border-white/10 space-y-4">
          <div className="flex items-center space-x-2 text-gold">
            <HelpCircle className="w-4 h-4" />
            <h2 className="text-sm font-mono font-black uppercase tracking-wider">How to Install in 3 Easy Steps</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Android Instructions */}
            <div className="p-4 rounded-2xl bg-black/40 border border-stadiumGreen/20 space-y-2.5">
              <span className="text-stadiumGreen font-black block uppercase">🤖 Android Installation:</span>
              <ol className="list-decimal list-inside space-y-1.5 text-gray-300">
                <li>Tap <strong>&apos;DOWNLOAD ANDROID APK&apos;</strong> above.</li>
                <li>When prompted, tap <strong>&apos;Download anyway&apos;</strong> or open the downloaded file.</li>
                <li>If your browser asks, enable <strong>&apos;Allow from this source&apos;</strong> and tap <strong>Install</strong>.</li>
              </ol>
            </div>

            {/* iOS Instructions */}
            <div className="p-4 rounded-2xl bg-black/40 border border-cyan-400/20 space-y-2.5">
              <span className="text-cyan-400 font-black block uppercase">🍎 iPhone (iOS) Installation:</span>
              <ol className="list-decimal list-inside space-y-1.5 text-gray-300">
                <li>Open <strong>mivaj.com</strong> in Apple Safari on your iPhone.</li>
                <li>Tap the <strong>Share</strong> button at the bottom of the screen (icon with arrow pointing up ⬆️).</li>
                <li>Scroll down and tap <strong>&apos;Add to Home Screen&apos;</strong>, then tap <strong>&apos;Add&apos;</strong>!</li>
              </ol>
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
