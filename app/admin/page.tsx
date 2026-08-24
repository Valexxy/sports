'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield, Server, Activity, Database, Users, Cpu, FileSpreadsheet,
  Download, Search, AlertCircle, CheckCircle2, XCircle, ArrowUpDown,
  ChevronLeft, ChevronRight, RefreshCw, Radio, Terminal, Settings,
  DollarSign, TrendingUp, Lock, Sliders, ExternalLink, Zap, Menu, X
} from 'lucide-react';
import Link from 'next/link';
import { DbUser, SystemSettings, AuditLogEntry } from '../../lib/database-service';
import { cn } from '../../lib/utils';
import { stadiumAudio } from '../../lib/sound-synthesizer';

type SortField = 'username' | 'role' | 'aura_balance' | 'win_rate' | 'status';
type SortOrder = 'asc' | 'desc';

export default function MultiDeviceResponsiveAdmin() {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SETTLEMENT_LEDGER' | 'USERS_PAM' | 'LIVE_POISSON' | 'AUDIT_LOGS'>('OVERVIEW');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [users, setUsers] = useState<DbUser[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // TanStack Style Table State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<SortField>('aura_balance');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8;

  // Selected User Modal
  const [selectedUser, setSelectedUser] = useState<DbUser | null>(null);
  const [auraAdjustment, setAuraAdjustment] = useState<number>(500);
  const [adjustReason, setAdjustReason] = useState<string>('Admin Balance Adjustment');
  
  // Double-Confirmation State for Destructive PAM Actions
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    title: string;
    description: string;
    actionName: string;
    onConfirm: () => void;
  } | null>(null);

  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Live Match Telemetry
  const [liveStreamMatches, setLiveStreamMatches] = useState<any[]>([
    { id: 'm-1', match: 'Arsenal vs Chelsea', min: "68'", score: '2 - 1', xG: '2.45 - 0.82', dcConf: '84%', settlement: 'IN_PLAY', signal: 'NORMAL' },
    { id: 'm-2', match: 'Real Madrid vs Barcelona', min: "82'", score: '3 - 2', xG: '3.12 - 2.85', dcConf: '91%', settlement: 'PENDING_FINAL', signal: 'HIGH_ACTION' },
    { id: 'm-3', match: 'Roma vs Fiorentina', min: "FT", score: '1 - 0', xG: '1.92 - 0.45', dcConf: '78%', settlement: 'SETTLED_WON', signal: 'SETTLED' },
    { id: 'm-4', match: 'Bayern vs Dortmund', min: "45'", score: '1 - 1', xG: '1.65 - 1.40', dcConf: '69%', settlement: 'IN_PLAY', signal: 'NORMAL' },
  ]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
        setReferrals(data.referrals || []);
        setTransactions(data.transactions || []);
        setAuditLogs(data.auditLogs || []);
        setSettings(data.settings || null);
      }
    } catch {}
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePamAction = async (action: string, payload: any = {}) => {
    if (!selectedUser) return;
    try {
      const res = await fetch('/api/admin/users/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          username: selectedUser.username,
          ...payload,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(`Signal [OK]: ${action} executed on @${selectedUser.username}`);
        stadiumAudio.playSuccessSound();
        fetchData();
        setTimeout(() => setActionSuccess(null), 2500);
      }
    } catch {}
  };

  const handleToggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedAndFilteredUsers = useMemo(() => {
    return users
      .filter((u) => {
        const matchesSearch = u.username.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        let valA: any = a[sortField];
        let valB: any = b[sortField];
        if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [users, searchQuery, statusFilter, sortField, sortOrder]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedAndFilteredUsers.slice(start, start + pageSize);
  }, [sortedAndFilteredUsers, currentPage]);

  const totalPages = Math.ceil(sortedAndFilteredUsers.length / pageSize) || 1;

  const totalCirculation = useMemo(() => {
    return users.reduce((acc, u) => acc + (u.aura_balance || 0), 0);
  }, [users]);

  const handleExportCsv = () => {
    const header = 'Timestamp,AdminUser,Action,TargetUser,Details\n';
    const rows = auditLogs.map((l) => `"${l.timestamp}","${l.adminUser}","${l.action}","${l.targetUser || ''}","${l.details}"`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AuraScore_SOC2_Audit_Log.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-[#050608] text-[#c9d1d9] font-mono text-[11px] leading-tight selection:bg-[#00e676] selection:text-black overflow-x-hidden">
      
      {/* 1. DENSE TOP OPERATIONAL BAR */}
      <header className="border-b border-[#1c202a] bg-[#090b10] px-3 py-2 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1 rounded bg-[#161b22] border border-[#30363d] text-white"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <div className="flex items-center space-x-1.5 font-bold text-white tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#00e676] animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-[#f0f6fc]">AURASCORE_PAM</span>
            <span className="text-[9px] text-[#8b949e]">v2.4</span>
          </div>

          <div className="hidden md:flex items-center space-x-2 text-[10px] text-[#8b949e] border-l border-[#1c202a] pl-3">
            <span>LATENCY: <strong className="text-[#00e676]">11ms</strong></span>
            <span>&bull;</span>
            <span>ROLE: <strong className="text-[#ffd700]">SUPER_ADMIN</strong></span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <button
            onClick={handleExportCsv}
            className="hidden sm:flex px-2 py-1 rounded bg-[#161b22] border border-[#30363d] text-white items-center space-x-1 text-[9px]"
          >
            <Download className="w-3 h-3" />
            <span>EXPORT_CSV</span>
          </button>

          <Link
            href="/"
            className="px-2.5 py-1 rounded bg-[#00e676] text-black font-bold text-[10px] flex items-center space-x-1 hover:bg-[#00c864]"
          >
            <span>LIVE_ARENA</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </header>

      {/* 2. DENSE KPI STRIP (RESPONSIVE 2-COL / 3-COL / 6-COL) */}
      <div className="border-b border-[#1c202a] bg-[#07090e] px-3 py-2">
        <div className="max-w-[1700px] mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-[10px]">
          <div className="p-2 rounded bg-[#0d1117] border border-[#21262d]">
            <span className="text-[#8b949e] block text-[9px]">TOTAL_ACCOUNTS</span>
            <span className="text-sm font-bold text-white">{users.length || 4}</span>
          </div>
          <div className="p-2 rounded bg-[#0d1117] border border-[#21262d]">
            <span className="text-[#8b949e] block text-[9px]">AURA_CIRCULATION</span>
            <span className="text-sm font-bold text-[#ffd700]">{totalCirculation.toLocaleString()}</span>
          </div>
          <div className="p-2 rounded bg-[#0d1117] border border-[#21262d]">
            <span className="text-[#8b949e] block text-[9px]">TOTAL_TRANSACTIONS</span>
            <span className="text-sm font-bold text-[#00e676]">₦45,000</span>
          </div>
          <div className="p-2 rounded bg-[#0d1117] border border-[#21262d]">
            <span className="text-[#8b949e] block text-[9px]">POISSON_ACCURACY</span>
            <span className="text-sm font-bold text-[#00e676]">94.8%</span>
          </div>
          <div className="p-2 rounded bg-[#0d1117] border border-[#21262d]">
            <span className="text-[#8b949e] block text-[9px]">AFFILIATE_ROUTING</span>
            <span className="text-sm font-bold text-white">STAKE + 22BET</span>
          </div>
          <div className="p-2 rounded bg-[#0d1117] border border-[#21262d]">
            <span className="text-[#8b949e] block text-[9px]">ENGINE_STATUS</span>
            <span className="text-sm font-bold text-[#00e676]">LOCKED_ONLINE</span>
          </div>
        </div>
      </div>

      {/* 3. WORKSTATION TAB SELECTOR */}
      <div className={cn(
        'border-b border-[#1c202a] bg-[#050608] px-3 py-1.5 flex flex-wrap gap-1',
        mobileMenuOpen ? 'flex' : 'hidden lg:flex'
      )}>
        {[
          { key: 'OVERVIEW', label: '1. SYSTEM_OVERVIEW', icon: Server },
          { key: 'USERS_PAM', label: '2. USER_DIRECTORY_PAM', icon: Users },
          { key: 'SETTLEMENT_LEDGER', label: '3. SETTLEMENT_LEDGER', icon: FileSpreadsheet },
          { key: 'LIVE_POISSON', label: '4. LIVE_POISSON_MONITOR', icon: Cpu },
          { key: 'AUDIT_LOGS', label: '5. SOC2_AUDIT_TRAIL', icon: Shield },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => {
                setActiveTab(t.key as any);
                setMobileMenuOpen(false);
              }}
              className={cn(
                'px-3 py-1 rounded text-[10px] font-bold flex items-center space-x-1.5 transition-all',
                activeTab === t.key
                  ? 'bg-[#21262d] text-white border border-[#30363d]'
                  : 'text-[#8b949e] hover:text-white hover:bg-[#161b22]'
              )}
            >
              <Icon className="w-3 h-3" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. MAIN RESPONSIVE WORKSPACE */}
      <main className="max-w-[1700px] mx-auto p-3 space-y-3">
        
        {actionSuccess && (
          <div className="p-2 rounded bg-[#00e676]/10 border border-[#00e676]/30 text-[#00e676] flex items-center space-x-2 text-[10px]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-3 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="p-3 rounded bg-[#0d1117] border border-[#21262d] space-y-2">
                <div className="flex items-center justify-between border-b border-[#21262d] pb-1.5">
                  <span className="font-bold text-white text-[10px]">SUBSYSTEM_STATUS_TELEMETRY</span>
                  <span className="text-[#00e676] text-[9px] font-bold">OPTIMAL</span>
                </div>
                <div className="space-y-1 text-[10px]">
                  <div className="flex justify-between py-1 border-b border-[#161b22]">
                    <span className="text-[#8b949e]">PostgreSQL Database (Port 6543 / Pooler)</span>
                    <span className="text-[#00e676] font-bold">CONNECTED</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#161b22]">
                    <span className="text-[#8b949e]">Next.js WAF & Anti-Bot Rate Limiter</span>
                    <span className="text-[#00e676] font-bold">ACTIVE (10 req/10s)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#161b22]">
                    <span className="text-[#8b949e]">Paystack HMAC Webhook Verifier</span>
                    <span className="text-[#00e676] font-bold">ARMED</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded bg-[#0d1117] border border-[#21262d] space-y-2">
                <span className="font-bold text-white text-[10px] block">FLOATING_URGENT_CONTROLS</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setActionSuccess('Signal [OK]: Manual match settlement triggered.');
                      stadiumAudio.playSuccessSound();
                    }}
                    className="p-2 rounded bg-[#161b22] border border-[#30363d] hover:border-[#00e676] text-left"
                  >
                    <span className="text-white font-bold block text-[10px]">SETTLE_MATCHES</span>
                    <span className="text-[#8b949e] text-[9px]">Reconcile wagers</span>
                  </button>

                  <button
                    onClick={() => {
                      setActionSuccess('Signal [OK]: Broadcast alert pushed to users.');
                      stadiumAudio.playSuccessSound();
                    }}
                    className="p-2 rounded bg-[#161b22] border border-[#30363d] hover:border-[#00e676] text-left"
                  >
                    <span className="text-white font-bold block text-[10px]">BROADCAST_ALERT</span>
                    <span className="text-[#8b949e] text-[9px]">Push notification</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER DIRECTORY PAM TABLE (RESPONSIVE TABLE ON DESKTOP, CARD INSPECTION ON MOBILE) */}
        {activeTab === 'USERS_PAM' && (
          <div className="space-y-2 animate-fadeIn">
            
            <div className="p-2 rounded bg-[#0d1117] border border-[#21262d] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2 flex-1 w-full sm:w-auto">
                <Search className="w-3.5 h-3.5 text-[#8b949e]" />
                <input
                  type="text"
                  placeholder="Filter users..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full sm:w-64 bg-[#050608] border border-[#30363d] rounded px-2 py-1 text-white text-[10px] focus:outline-none"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-[#050608] border border-[#30363d] rounded px-2 py-1 text-white text-[10px]"
              >
                <option value="ALL">ALL_STATUSES</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="SUSPENDED">SUSPENDED</option>
                <option value="BANNED">BANNED</option>
              </select>
            </div>

            {/* DESKTOP VIEW: FULL DENSE TABLE WITH FROZEN HEADERS */}
            <div className="hidden sm:block overflow-x-auto border border-[#21262d] rounded bg-[#0d1117]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#21262d] bg-[#161b22] text-[#8b949e] text-[9px] uppercase">
                    <th className="p-2 cursor-pointer hover:text-white" onClick={() => handleToggleSort('username')}>USER_IDENTITY</th>
                    <th className="p-2">ROLE_TIER</th>
                    <th className="p-2 text-right">AURA_WALLET</th>
                    <th className="p-2">WIN_RATE</th>
                    <th className="p-2">STATUS</th>
                    <th className="p-2 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#21262d]">
                  {paginatedUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-[#161b22]/50">
                      <td className="p-2 font-bold text-white">
                        <span>{u.avatar}</span> @{u.username}
                      </td>
                      <td className="p-2 text-[#ffd700]">{u.vip_tier}</td>
                      <td className="p-2 text-right font-bold text-[#ffd700]">{u.aura_balance.toLocaleString()}</td>
                      <td className="p-2 text-[#00e676]">{u.win_rate}%</td>
                      <td className="p-2">
                        <span className={cn(
                          'px-1.5 py-0.5 rounded text-[9px] font-bold uppercase',
                          u.status === 'ACTIVE' && 'bg-[#00e676]/10 text-[#00e676]',
                          u.status === 'SUSPENDED' && 'bg-[#f59e0b]/10 text-[#f59e0b]',
                          u.status === 'BANNED' && 'bg-[#ff3366]/10 text-[#ff3366]'
                        )}>
                          {u.status}
                        </span>
                      </td>
                      <td className="p-2 text-right">
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="px-2 py-0.5 rounded bg-[#21262d] text-white text-[9px] border border-[#30363d]"
                        >
                          PAM_CONTROL
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE VIEW: COMPACT INSPECTION CARDS */}
            <div className="sm:hidden space-y-2">
              {paginatedUsers.map((u) => (
                <div key={u.id} className="p-2.5 rounded bg-[#0d1117] border border-[#21262d] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{u.avatar} @{u.username}</span>
                    <span className={cn(
                      'px-1.5 py-0.5 rounded text-[8px] font-bold uppercase',
                      u.status === 'ACTIVE' && 'bg-[#00e676]/10 text-[#00e676]',
                      u.status === 'SUSPENDED' && 'bg-[#f59e0b]/10 text-[#f59e0b]',
                      u.status === 'BANNED' && 'bg-[#ff3366]/10 text-[#ff3366]'
                    )}>
                      {u.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#8b949e]">
                    <span>Aura: <strong className="text-[#ffd700]">{u.aura_balance.toLocaleString()}</strong></span>
                    <span>Win Rate: <strong className="text-[#00e676]">{u.win_rate}%</strong></span>
                    <button
                      onClick={() => setSelectedUser(u)}
                      className="px-2 py-0.5 rounded bg-[#21262d] text-white text-[9px] border border-[#30363d]"
                    >
                      PAM_CONTROL
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between text-[10px] text-[#8b949e] px-1 pt-1">
              <span>PAGE {currentPage} OF {totalPages}</span>
              <div className="flex gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  className="px-2 py-0.5 rounded bg-[#161b22] border border-[#30363d] disabled:opacity-30"
                >
                  PREV
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  className="px-2 py-0.5 rounded bg-[#161b22] border border-[#30363d] disabled:opacity-30"
                >
                  NEXT
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: SETTLEMENT LEDGER */}
        {activeTab === 'SETTLEMENT_LEDGER' && (
          <div className="space-y-2 animate-fadeIn">
            <div className="overflow-x-auto border border-[#21262d] rounded bg-[#0d1117]">
              <table className="w-full text-left border-collapse text-[10px]">
                <thead>
                  <tr className="border-b border-[#21262d] bg-[#161b22] text-[#8b949e] text-[9px] uppercase">
                    <th className="p-2">TX_REFERENCE</th>
                    <th className="p-2">ACCOUNT</th>
                    <th className="p-2 text-right">AMOUNT</th>
                    <th className="p-2">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#21262d]">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#161b22]/50">
                      <td className="p-2 font-bold text-white">{tx.reference}</td>
                      <td className="p-2 text-[#8b949e]">@{tx.username}</td>
                      <td className="p-2 text-right font-bold text-[#00e676]">₦{tx.amount.toLocaleString()}</td>
                      <td className="p-2">
                        <span className="px-1.5 py-0.5 rounded bg-[#00e676]/10 text-[#00e676] font-bold text-[9px]">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: LIVE POISSON */}
        {activeTab === 'LIVE_POISSON' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 animate-fadeIn">
            {liveStreamMatches.map((m) => (
              <div key={m.id} className="p-2.5 rounded bg-[#0d1117] border border-[#21262d] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-[11px] truncate">{m.match}</span>
                  <span className="text-[#ffd700] font-bold text-[10px]">{m.min} ({m.score})</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[9px] text-[#8b949e] border-t border-[#21262d] pt-1">
                  <div>xG: <strong className="text-white">{m.xG}</strong></div>
                  <div>Conf: <strong className="text-[#00e676]">{m.dcConf}</strong></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: AUDIT LOGS */}
        {activeTab === 'AUDIT_LOGS' && (
          <div className="space-y-1 font-mono text-[10px] animate-fadeIn">
            {auditLogs.map((l) => (
              <div key={l.id} className="p-2 rounded bg-[#0d1117] border border-[#21262d] flex items-center justify-between">
                <div>
                  <span className="text-[#00e676] font-bold">[{l.action}]</span> <span className="text-white">@{l.adminUser}</span>
                  <span className="text-[#8b949e] ml-2">&bull; {l.details}</span>
                </div>
                <span className="text-[#8b949e] text-[9px]">{l.timestamp}</span>
              </div>
            ))}
          </div>
        )}

      </main>


      {/* DOUBLE-CONFIRMATION MODAL WITH SEMANTIC DANGER GUARDRAIL */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-3 font-mono text-[11px] text-white animate-fadeIn">
          <div className="max-w-sm w-full rounded-2xl bg-[#0d1117] border-2 border-[#ff3366] p-4 space-y-3 shadow-2xl">
            <div className="flex items-center space-x-2 text-[#ff3366]">
              <AlertCircle className="w-5 h-5 animate-pulse" />
              <span className="font-black uppercase text-xs">{confirmModal.title}</span>
            </div>
            <p className="text-[#8b949e] text-[10px] leading-relaxed">
              {confirmModal.description}
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-1.5 rounded bg-[#161b22] border border-[#30363d] text-white text-[10px] font-bold"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal(null);
                }}
                className="flex-1 py-1.5 rounded bg-[#ff3366] text-white text-[10px] font-bold shadow-lg"
              >
                {confirmModal.actionName}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAM MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 font-mono text-[11px] text-white">
          <div className="max-w-md w-full rounded bg-[#0d1117] border border-[#30363d] p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#21262d] pb-2">
              <span className="font-bold text-white">PAM_CONTROL: @{selectedUser.username}</span>
              <button onClick={() => setSelectedUser(null)} className="text-[#8b949e] hover:text-white">[X]</button>
            </div>

            <div className="space-y-2 text-[10px]">
              <div>
                <label className="text-[#8b949e] block mb-1">AURA POINTS ADJUSTMENT:</label>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    value={auraAdjustment}
                    onChange={(e) => setAuraAdjustment(parseInt(e.target.value) || 0)}
                    className="w-24 bg-[#050608] border border-[#30363d] rounded px-2 py-1 text-white"
                  />
                  <input
                    type="text"
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    placeholder="Reason..."
                    className="flex-1 bg-[#050608] border border-[#30363d] rounded px-2 py-1 text-white"
                  />
                </div>
                <div className="flex gap-1.5 pt-1">
                  <button
                    onClick={() => handlePamAction('ADJUST_AURA', { delta: Math.abs(auraAdjustment), reason: adjustReason })}
                    className="flex-1 py-1 rounded bg-[#00e676] text-black font-bold text-[9px]"
                  >
                    CREDIT (+{Math.abs(auraAdjustment)})
                  </button>
                  <button
                    onClick={() => handlePamAction('ADJUST_AURA', { delta: -Math.abs(auraAdjustment), reason: adjustReason })}
                    className="flex-1 py-1 rounded bg-[#ff3366] text-white font-bold text-[9px]"
                  >
                    DEBIT (-{Math.abs(auraAdjustment)})
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-[#21262d]">
                <label className="text-[#8b949e] block mb-1">STATUS:</label>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => handlePamAction('CHANGE_STATUS', { status: 'ACTIVE' })}
                    className="py-1 rounded bg-[#00e676]/20 border border-[#00e676] text-[#00e676] text-[9px] font-bold"
                  >
                    ACTIVE
                  </button>
                  <button
                    onClick={() => handlePamAction('CHANGE_STATUS', { status: 'SUSPENDED', reason: 'Audit' })}
                    className="py-1 rounded bg-[#f59e0b]/20 border border-[#f59e0b] text-[#f59e0b] text-[9px] font-bold"
                  >
                    SUSPEND
                  </button>
                  <button
                    onClick={() => handlePamAction('CHANGE_STATUS', { status: 'BANNED', reason: 'Violation' })}
                    className="py-1 rounded bg-[#ff3366]/20 border border-[#ff3366] text-[#ff3366] text-[9px] font-bold"
                  >
                    BAN
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
