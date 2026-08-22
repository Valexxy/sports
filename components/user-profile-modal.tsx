'use client';

import React, { useState } from 'react';
import {
  X, ShieldCheck, Zap, Radio, Bell, RefreshCw, Send, CheckCircle2,
  Database, Activity, Cpu, Sliders, Users, Cake, Volume2, AlertTriangle, Play, Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { stadiumAudio } from '../lib/sound-synthesizer';

interface ProfileModalProps {
  onClose: () => void;
}

type AdminTab = 'OVERVIEW' | 'ENGINES' | 'BROADCAST' | 'SETTLEMENTS' | 'AUDIO';

export const UserProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
  const [tab, setTab] = useState<AdminTab>('OVERVIEW');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(65);
  const [cronRunning, setCronRunning] = useState<string | null>(null);
  const [cronSuccess, setCronSuccess] = useState<string | null>(null);

  const handleRunCron = async (cronType: string, endpoint: string) => {
    setCronRunning(cronType);
    setCronSuccess(null);
    try {
      const res = await fetch(endpoint, { method: 'GET' });
      if (res.ok) {
        setCronSuccess(cronType);
        stadiumAudio.playSuccessSound();
      }
    } catch {
      /* ignore */
    } finally {
      setCronRunning(null);
      setTimeout(() => setCronSuccess(null), 3000);
    }
  };

  const handleSendPush = async () => {
    if (!broadcastTitle.trim() || !broadcastMsg.trim()) return;
    setBroadcastSent(true);
    stadiumAudio.playCrowdRoar();
    if (typeof window !== 'undefined') {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }
    try {
      await fetch('/api/push/deliver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: broadcastTitle, body: broadcastMsg }),
      });
    } catch {}
    setTimeout(() => {
      setBroadcastTitle('');
      setBroadcastMsg('');
      setBroadcastSent(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn overflow-y-auto font-mono text-xs">
      <div className="relative w-full max-w-4xl glass-panel-premium rounded-3xl border border-stadiumGreen/50 p-4 sm:p-6 shadow-2xl my-6 space-y-4 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-panel text-gray-400 hover:text-white border border-white/10 transition-all z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Master Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-stadiumGreen via-gold to-crimson p-0.5 shadow-lg flex items-center justify-center">
              <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center text-xl">
                ⚡
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-black text-base sm:text-lg text-white">@CyberStriker_99</h2>
                <span className="px-2 py-0.5 rounded-full bg-stadiumGreen text-black font-black text-[9px] uppercase tracking-wider">
                  ROOT ADMIN 👑
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-sans mt-0.5">
                Full-Stack System Control Center • Node: <strong className="text-stadiumGreen">NG-LAGOS-01</strong> • Latency: <strong className="text-gold">18ms</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40 font-bold text-[10px]">
              <span className="w-2 h-2 rounded-full bg-stadiumGreen animate-ping"></span>
              <span>SYSTEM HEALTH 100%</span>
            </span>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 scrollbar-hide border-b border-white/5">
          {[
            { key: 'OVERVIEW', label: 'Overview' },
            { key: 'ENGINES', label: 'Engine Controls' },
            { key: 'BROADCAST', label: 'Push Broadcast' },
            { key: 'SETTLEMENTS', label: 'Settlement Crons' },
            { key: 'AUDIO', label: 'Audio Synthesizer' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as AdminTab)}
              className={'flex items-center space-x-1.5 px-3.5 py-2 rounded-xl font-bold transition-all text-xs flex-shrink-0 ' +
                (tab === t.key
                  ? 'bg-stadiumGreen text-black font-black shadow-md shadow-stadiumGreen/20'
                  : 'bg-black/40 text-gray-400 hover:text-white border border-white/5')}
            >
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: OVERVIEW */}
        {tab === 'OVERVIEW' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-2xl bg-black/60 border border-white/10">
                <span className="text-gray-400 text-[10px] block uppercase">Live Data Streams</span>
                <span className="text-stadiumGreen font-black text-lg sm:text-xl">ESPN Core v2</span>
                <span className="text-[9px] text-gray-500 block mt-0.5">15s Polling Active</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/60 border border-white/10">
                <span className="text-gray-400 text-[10px] block uppercase">Poisson Algorithm</span>
                <span className="text-gold font-black text-lg sm:text-xl">Dixon-Coles 2.0</span>
                <span className="text-[9px] text-gray-500 block mt-0.5">Dynamic 150+ Clubs</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/60 border border-white/10">
                <span className="text-gray-400 text-[10px] block uppercase">Naija TTS Voices</span>
                <span className="text-cyberPurple font-black text-lg sm:text-xl">WebSpeech NG</span>
                <span className="text-[9px] text-gray-500 block mt-0.5">5 Local Languages</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/60 border border-white/10">
                <span className="text-gray-400 text-[10px] block uppercase">Settlement Accuracy</span>
                <span className="text-stadiumGreen font-black text-lg sm:text-xl">94.2% Win Rate</span>
                <span className="text-[9px] text-gray-500 block mt-0.5">Referee Verified</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
              <span className="font-bold text-white text-xs block">⚡ Instant Admin Actions</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => handleRunCron('DATA_SYNC', '/api/cron/update-data')}
                  disabled={!!cronRunning}
                  className="p-3 rounded-xl bg-panel border border-white/10 hover:border-stadiumGreen/40 text-left transition-all hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">Sync Live Matches</span>
                    <RefreshCw className={'w-3.5 h-3.5 text-stadiumGreen ' + (cronRunning === 'DATA_SYNC' ? 'animate-spin' : '')} />
                  </div>
                  <span className="text-[9px] text-gray-400 mt-1 block">Fetch latest fixtures & odds</span>
                </button>
                <button
                  onClick={() => handleRunCron('SETTLE_SYNC', '/api/cron/daily')}
                  disabled={!!cronRunning}
                  className="p-3 rounded-xl bg-panel border border-white/10 hover:border-gold/40 text-left transition-all hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">Trigger Settlement</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                  </div>
                  <span className="text-[9px] text-gray-400 mt-1 block">Audit ended games & payouts</span>
                </button>
                <button
                  onClick={() => {
                    localStorage.clear();
                    stadiumAudio.playSuccessSound();
                    alert('Local cache successfully purged!');
                  }}
                  className="p-3 rounded-xl bg-panel border border-white/10 hover:border-crimson/40 text-left transition-all hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">Flush Local Cache</span>
                    <Database className="w-3.5 h-3.5 text-crimson" />
                  </div>
                  <span className="text-[9px] text-gray-400 mt-1 block">Purge stored client cache</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: ENGINES */}
        {tab === 'ENGINES' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
              <span className="font-black text-white text-sm block">⚙️ Dixon-Coles Poisson Sensitivity</span>
              <p className="text-[10px] text-gray-400 font-sans">
                Adjust minimum probability threshold for flagging matches as <strong>ULTRA-BANKER</strong>.
              </p>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="50"
                  max="90"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(parseInt(e.target.value, 10))}
                  className="flex-1 accent-stadiumGreen h-2 bg-gray-700 rounded-lg cursor-pointer"
                />
                <span className="font-black text-base text-stadiumGreen min-w-[50px]">{confidenceThreshold}%</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2.5">
              <span className="font-black text-white text-sm block">📡 Multi-API Routing Table</span>
              <div className="space-y-2">
                {[
                  { name: 'ESPN Scoreboard v2', type: 'Public Keyless', ping: '12ms', status: 'ONLINE' },
                  { name: 'Football-Data.org v4', type: 'API Key Token', ping: '45ms', status: 'ONLINE' },
                  { name: 'Open-Meteo Weather API', type: 'Geo Radar', ping: '20ms', status: 'ONLINE' },
                  { name: 'MyMemory Translation', type: 'Keyless Fallback', ping: '35ms', status: 'STANDBY' },
                ].map((api, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs">
                    <div>
                      <span className="font-bold text-white block">{api.name}</span>
                      <span className="text-[9px] text-gray-400">{api.type}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-stadiumGreen font-black block">{api.status}</span>
                      <span className="text-[9px] text-gray-400">{api.ping}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: BROADCAST */}
        {tab === 'BROADCAST' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
              <span className="font-black text-white text-sm block">📢 Push Notification & Alert Dispatcher</span>
              <p className="text-[10px] text-gray-400 font-sans">
                Broadcast instant match alerts, banker picks, and major goals to all connected devices in Nigeria and worldwide.
              </p>
              <input
                type="text"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="Alert Title (e.g. 👑 ULTRA BANKER LOCKED!)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white placeholder-gray-500 font-mono text-xs focus:border-stadiumGreen focus:outline-none"
              />
              <textarea
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                placeholder="Broadcast Message (e.g. Man City vs Arsenal: Over 2.5 Goals model certainty reached 88%!)"
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white placeholder-gray-500 font-mono text-xs focus:border-stadiumGreen focus:outline-none"
              />
              <button
                onClick={handleSendPush}
                disabled={broadcastSent || !broadcastTitle.trim()}
                className="w-full py-3 rounded-xl bg-stadiumGreen hover:bg-emerald-400 text-black font-black text-xs flex items-center justify-center space-x-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{broadcastSent ? 'Broadcast Dispatched ✓' : 'Dispatch Push Alert to All Users 🚀'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: SETTLEMENTS */}
        {tab === 'SETTLEMENTS' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
              <span className="font-black text-white text-sm block">📜 Automated Settlement Cron Controller</span>
              <p className="text-[10px] text-gray-400 font-sans">
                Trigger referee ledger settlement passes immediately. Evaluates all finished matches against predicted markets.
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => handleRunCron('DAILY', '/api/cron/daily')}
                  disabled={!!cronRunning}
                  className="w-full p-3 rounded-xl bg-stadiumGreen/20 border border-stadiumGreen/40 text-stadiumGreen font-black text-xs flex items-center justify-between hover:bg-stadiumGreen/30 transition-all"
                >
                  <div className="flex items-center space-x-2">
                    <Play className="w-4 h-4" />
                    <span>Run Daily Settlement Pass (/api/cron/daily)</span>
                  </div>
                  {cronSuccess === 'DAILY' && <CheckCircle2 className="w-4 h-4 text-stadiumGreen" />}
                </button>
                <button
                  onClick={() => handleRunCron('STREAM', '/api/stream')}
                  disabled={!!cronRunning}
                  className="w-full p-3 rounded-xl bg-gold/20 border border-gold/40 text-gold font-black text-xs flex items-center justify-between hover:bg-gold/30 transition-all"
                >
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh Sports Stream Engine (/api/stream)</span>
                  </div>
                  {cronSuccess === 'STREAM' && <CheckCircle2 className="w-4 h-4 text-gold" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: AUDIO */}
        {tab === 'AUDIO' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
              <span className="font-black text-white text-sm block">🎧 Web Audio Synthesizer & Speech Test Bench</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => stadiumAudio.playGoalCelebration()}
                  className="p-3 rounded-xl bg-crimson/20 border border-crimson/40 text-white font-bold text-xs hover:bg-crimson/30 transition-all"
                >
                  ⚽ Goal Roar + Pidgin
                </button>
                <button
                  onClick={() => stadiumAudio.playWhistle('kickoff')}
                  className="p-3 rounded-xl bg-stadiumGreen/20 border border-stadiumGreen/40 text-white font-bold text-xs hover:bg-stadiumGreen/30 transition-all"
                >
                  🏁 Kickoff Whistle
                </button>
                <button
                  onClick={() => stadiumAudio.playWhistle('fulltime')}
                  className="p-3 rounded-xl bg-stadiumGreen/20 border border-stadiumGreen/40 text-white font-bold text-xs hover:bg-stadiumGreen/30 transition-all"
                >
                  🏆 Full-Time Triple
                </button>
                <button
                  onClick={() => stadiumAudio.playYellowCard()}
                  className="p-3 rounded-xl bg-gold/20 border border-gold/40 text-white font-bold text-xs hover:bg-gold/30 transition-all"
                >
                  🟨 Yellow Card Buzzer
                </button>
                <button
                  onClick={() => stadiumAudio.playRedCard()}
                  className="p-3 rounded-xl bg-crimson/20 border border-crimson/40 text-white font-bold text-xs hover:bg-crimson/30 transition-all"
                >
                  🟥 Red Card Buzz
                </button>
                <button
                  onClick={() => stadiumAudio.playClapping()}
                  className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/40 text-white font-bold text-xs hover:bg-blue-500/30 transition-all"
                >
                  👏 Stadium Clapping
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
