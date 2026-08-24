'use client';
import React from 'react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#07080b] text-white p-4 sm:p-6 space-y-6 animate-pulse font-mono">
      {/* Top Bar Skeleton */}
      <div className="max-w-6xl mx-auto flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10" />
          <div className="space-y-1.5">
            <div className="w-36 h-4 rounded bg-white/10" />
            <div className="w-48 h-2.5 rounded bg-white/5" />
          </div>
        </div>
        <div className="w-28 h-8 rounded-xl bg-white/10" />
      </div>

      {/* Hero Header Skeleton */}
      <div className="max-w-6xl mx-auto p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-3xl bg-white/10" />
            <div className="space-y-2">
              <div className="w-40 h-5 rounded bg-white/10" />
              <div className="w-56 h-3 rounded bg-white/5" />
              <div className="flex gap-2">
                <div className="w-20 h-4 rounded-lg bg-white/10" />
                <div className="w-24 h-4 rounded-lg bg-white/10" />
              </div>
            </div>
          </div>
          <div className="w-48 h-12 rounded-2xl bg-white/10" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="h-32 rounded-3xl bg-white/5 border border-white/10" />
        <div className="h-32 rounded-3xl bg-white/5 border border-white/10" />
        <div className="h-32 rounded-3xl bg-white/5 border border-white/10" />
      </div>
    </div>
  );
};
