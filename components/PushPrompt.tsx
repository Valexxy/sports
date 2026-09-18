'use client';
import { useEffect, useState } from 'react';

export default function PushPrompt() {
  const [show, setShow] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js');
      navigator.serviceWorker.ready.then(reg => {
        reg.pushManager.getSubscription().then(sub => {
          if (sub) {
            setSubscribed(true);
          } else {
            setShow(true);
          }
        });
      });
    }
  }, []);

  const subscribe = async () => {
    try {
      const reg = await navigator.serviceWorker.ready;
      const res = await fetch('/api/push/vapid');
      const { publicKey } = await res.json();
      
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicKey
      });
      
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub)
      });
      
      setSubscribed(true);
      setShow(false);
    } catch (e) {
      console.error('Push error:', e);
    }
  };

  if (!show || subscribed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-96 bg-slate-900 border border-emerald-500 p-5 rounded-2xl shadow-2xl z-[9999] animate-bounce">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">??</span>
        <p className="text-white font-extrabold text-lg">Get Live AI Alerts</p>
      </div>
      <p className="text-slate-400 text-sm mb-5 font-medium leading-relaxed">
        Never miss a massive SportyBet code again. Get instant mobile alerts when our AI detects a 90%+ probability banker.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={subscribe} className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-3 rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-500/20">
          ENABLE ALERTS
        </button>
        <button onClick={() => setShow(false)} className="flex-1 bg-slate-800 text-slate-300 px-4 py-3 rounded-xl font-bold hover:bg-slate-700 active:scale-95 transition-all">
          Not Now
        </button>
      </div>
    </div>
  );
}
