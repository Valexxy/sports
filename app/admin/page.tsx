'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  RefreshCw,
  Users,
  Activity,
  Crown,
  Send,
  LineChart,
  Zap,
  BarChart3,
  Radio,
  Database,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import {
  ALL_ROLES,
  UserRole,
  ROLE_LEVELS,
  getRoleMeta,
  can,
} from '../../lib/role-engine';

interface AdminData {
  success?: boolean;
  role?: string;
  metrics?: Record<string, number>;
  series?: { labels: string[]; values: number[] };
  pushSubscriptions?: number;
  matches?: { total: number; live: number; scheduled: number; finished: number };
  ledger?: { rows: number; won: number; lost: number; total: number; winRate: number };
  generatedAt?: string;
}

export default function AdminDashboardPage() {
  const [role, setRole] = useState<UserRole>('ADMIN');
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionStatus, setActionStatus] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin', {
        headers: { 'x-aurascore-role': role },
        cache: 'no-store',
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error || 'Access denied for this role');
        setData(null);
      } else {
        setData(json);
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to load admin data');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const runSuperWrite = async (action: string) => {
    setActionStatus('');
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-aurascore-role': role },
        body: JSON.stringify({ action }),
      });
      const json = await res.json();
      if (!res.ok) {
        setActionStatus(`⚠️ ${json?.error || 'Action failed'}`);
      } else {
        setActionStatus(`✅ ${action} succeeded (${json.role})`);
      }
    } catch (e: any) {
      setActionStatus(`⚠️ ${e?.message}`);
    }
  };

  const chartData = (data?.series?.labels || []).map((label, i) => ({
    day: label,
    pageviews: data?.series?.values?.[i] || 0,
  }));

  const meta = getRoleMeta(role);
  const isAdmin = role === 'ADMIN';
  const canAnalytics = can(role, 'VIEW_ANALYTICS');
  const canSuperWrite = can(role, 'SUPER_WRITE');

  return (
    <div className="min-h-screen bg-void text-white font-mono pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-void/90 backdrop-blur-xl border-b border-gold/30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Crown className="w-5 h-5 text-gold" />
            <span className="font-black text-white tracking-wider">AURASCORE ADMIN</span>
            <span className="px-2 py-0.5 rounded bg-gold text-black text-[10px] font-black">COMMAND CENTER</span>
          </div>
          <a href="/" className="text-xs text-stadiumGreen hover:text-white">← Back to site</a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-5">
        {/* Role switcher */}
        <div className="glass-panel-premium rounded-3xl p-4 border border-gold/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-stadiumGreen" />
              <span className="text-xs font-black text-gray-300 uppercase tracking-wider">Active Role</span>
            </div>
            <span className={`text-sm font-black ${meta.color}`}>{meta.emoji} {meta.label}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {ALL_ROLES.map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                  role === r
                    ? 'bg-gold/20 border-gold text-gold scale-105'
                    : 'bg-panel border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                {ROLE_LEVELS[r].emoji} {ROLE_LEVELS[r].label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <Lock className="w-3 h-3" />
            <span>
              {canAnalytics
                ? '✓ analytics view granted'
                : '✗ analytics view denied for this role'}
              {' · '}
              {canSuperWrite
                ? '✓ super-write granted (ADMIN only)'
                : '✗ super-write locked'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-4 py-2 rounded-2xl bg-stadiumGreen text-black font-black text-xs flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
          {error && <span className="text-xs text-crimson font-bold">{error}</span>}
        </div>

        {!canAnalytics ? (
          <div className="glass-panel-premium rounded-3xl p-10 text-center border border-crimson/40">
            <Lock className="w-8 h-8 text-crimson mx-auto mb-2" />
            <h3 className="font-black text-white">Access Restricted</h3>
            <p className="text-xs text-gray-400 mt-1">
              The {meta.label} role cannot view analytics. Switch to Admin, Moderator, Analyst, VIP or Pro.
            </p>
          </div>
        ) : (
          <>
            {/* KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <KpiCard icon={Users} label="Unique Visitors" value={data?.metrics?.unique_visitors ?? 0} color="text-stadiumGreen" sub="today" />
              <KpiCard icon={Activity} label="Pageviews" value={data?.metrics?.pageviews ?? 0} color="text-gold" sub="today" />
              <KpiCard icon={Radio} label="Push Subscribers" value={data?.pushSubscriptions ?? 0} color="text-cyberPurple" sub="devices" />
              <KpiCard icon={Zap} label="Live Matches" value={data?.matches?.live ?? 0} color="text-crimson" sub={`${data?.matches?.total ?? 0} total`} />
            </div>

            {/* Chart */}
            <div className="glass-panel-premium rounded-3xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <LineChart className="w-4 h-4 text-stadiumGreen" />
                  <span className="text-xs font-black text-gray-300 uppercase tracking-wider">14-Day Pageviews</span>
                </div>
                <span className="text-[10px] text-gray-500">privacy-first · no cookies</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="pageviewFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#00ff87" stopOpacity={0.5} />
                        <stop offset="1" stopColor="#00ff87" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ background: '#0e131f', border: '1px solid #00ff8755', borderRadius: 12 }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="pageviews" stroke="#00ff87" strokeWidth={2} fill="url(#pageviewFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Matches breakdown + ledger */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="glass-panel-premium rounded-3xl p-4 border border-white/10 space-y-3">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-gold" />
                  <span className="text-xs font-black text-gray-300 uppercase tracking-wider">Fixture Breakdown</span>
                </div>
                {[
                  { label: 'Live', value: data?.matches?.live ?? 0, color: 'bg-crimson' },
                  { label: 'Scheduled', value: data?.matches?.scheduled ?? 0, color: 'bg-gold' },
                  { label: 'Finished', value: data?.matches?.finished ?? 0, color: 'bg-stadiumGreen' },
                ].map((row) => (
                  <div key={row.label} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">{row.label}</span>
                      <span className="font-black text-white">{row.value}</span>
                    </div>
                    <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                      <div className={`h-full ${row.color}`} style={{ width: `${Math.min(100, row.value / Math.max(1, data?.matches?.total || 1) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="glass-panel-premium rounded-3xl p-4 border border-white/10 space-y-3">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-stadiumGreen" />
                  <span className="text-xs font-black text-gray-300 uppercase tracking-wider">Settlement Ledger</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <MiniStat label="Rows" value={data?.ledger?.rows ?? 0} />
                  <MiniStat label="Win Rate" value={`${data?.ledger?.winRate ?? 0}%`} />
                  <MiniStat label="Won" value={data?.ledger?.won ?? 0} color="text-stadiumGreen" />
                  <MiniStat label="Lost" value={data?.ledger?.lost ?? 0} color="text-crimson" />
                </div>
              </div>
            </div>

            {/* Super write panel */}
            <div className="glass-panel-premium rounded-3xl p-4 border border-gold/30 space-y-3">
              <div className="flex items-center space-x-2">
                <Crown className="w-4 h-4 text-gold" />
                <span className="text-xs font-black text-gray-300 uppercase tracking-wider">Super Write Actions</span>
                {!canSuperWrite && <span className="text-[10px] text-crimson font-bold">(locked)</span>}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => runSuperWrite('ping')}
                  disabled={!canSuperWrite}
                  className="px-4 py-2 rounded-2xl bg-gold/20 border border-gold/40 text-gold font-black text-xs flex items-center space-x-2 disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" /> Ping Gateway
                </button>
                <button
                  onClick={() => runSuperWrite('refresh_caches')}
                  disabled={!canSuperWrite}
                  className="px-4 py-2 rounded-2xl bg-stadiumGreen/20 border border-stadiumGreen/40 text-stadiumGreen font-black text-xs flex items-center space-x-2 disabled:opacity-40"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh Caches
                </button>
              </div>
              {actionStatus && <p className="text-xs font-bold text-gold">{actionStatus}</p>}
              {isAdmin && (
                <p className="text-[10px] text-gray-500 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-stadiumGreen" />
                  <span>Admin has super-write across every system function.</span>
                </p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, color, sub }: {
  icon: any; label: string; value: number; color: string; sub: string;
}) {
  return (
    <div className="glass-panel-premium rounded-3xl p-4 border border-white/10 space-y-1">
      <Icon className={`w-5 h-5 ${color}`} />
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</div>
      <div className="text-[9px] text-gray-500">{sub}</div>
    </div>
  );
}

function MiniStat({ label, value, color = 'text-white' }: { label: string; value: number | string; color?: string }) {
  return (
    <div className="p-2 rounded-2xl bg-black/40 border border-white/10">
      <div className={`text-lg font-black ${color}`}>{value}</div>
      <div className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</div>
    </div>
  );
}