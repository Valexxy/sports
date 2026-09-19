'use client';
import { useEffect, useState } from 'react';

export default function OmniBrainStatus() {
  const [metrics, setMetrics] = useState({ nodes: 0, predictions: 0 });

  useEffect(() => {
    // Simulate AI system warming up
    const interval = setInterval(() => {
      setMetrics(prev => ({
        nodes: Math.min(prev.nodes + Math.floor(Math.random() * 5), 142),
        predictions: prev.predictions + Math.floor(Math.random() * 100)
      }));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-black border-b border-emerald-500/20 py-2 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-emerald-500/10 animate-pulse"></div>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-[10px] sm:text-xs font-mono tracking-widest text-emerald-400">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-white uppercase shadow-emerald-500/50 drop-shadow-md">
            Mivaj Omni-Brain Active
          </span>
        </div>
        
        <div className="hidden sm:flex items-center gap-6 opacity-80">
          <span>Global Nodes: {metrics.nodes}/142</span>
          <span>Predictions Processed: {metrics.predictions.toLocaleString()}</span>
          <span className="text-cyan-400">Latency: 12ms</span>
        </div>
      </div>
    </div>
  );
}
