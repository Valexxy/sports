'use client';
import React from 'react';

export const AdminSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#08090c] text-white p-4 sm:p-6 space-y-6 animate-pulse font-mono">
      {/* Top Header Skeleton */}
      <div className="max-w-7xl mx-auto flex items-center justify-between border-b border-white/10 pb-5">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10" />
          <div className="space-y-1.5">
            <div className="w-48 h-5 rounded bg-white/10" />
            <div className="w-64 h-3 rounded bg-white/5" />
          </div>
        </div>
        <div className="w-32 h-9 rounded-xl bg-white/10" />
      </div>

      {/* KPI Grid Skeleton */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="h-28 rounded-3xl bg-white/5 border border-white/10" />
        <div className="h-28 rounded-3xl bg-white/5 border border-white/10" />
        <div className="h-28 rounded-3xl bg-white/5 border border-white/10" />
        <div className="h-28 rounded-3xl bg-white/5 border border-white/10" />
      </div>

      {/* Table Skeleton */}
      <div className="max-w-7xl mx-auto h-72 rounded-3xl bg-white/5 border border-white/10" />
    </div>
  );
};
