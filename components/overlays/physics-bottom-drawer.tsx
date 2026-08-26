'use client';

import React from 'react';
import { X } from 'lucide-react';

interface PhysicsBottomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  badge?: string;
  children: React.ReactNode;
}

export const PhysicsBottomDrawer: React.FC<PhysicsBottomDrawerProps> = ({
  isOpen,
  onClose,
  title,
  badge,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end justify-center p-0 sm:p-4 animate-fadeIn font-mono text-white">
      <div className="glass-panel-premium w-full sm:max-w-xl max-h-[88vh] rounded-t-3xl sm:rounded-3xl border-t-2 sm:border-2 border-stadiumGreen/50 p-5 space-y-4 shadow-2xl flex flex-col transition-all duration-300">
        
        {/* Drawer Pull Handle (Mobile Touch Physics) */}
        <div className="w-12 h-1.5 rounded-full bg-white/20 mx-auto sm:hidden flex-shrink-0 cursor-grab active:cursor-grabbing" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-black text-sm sm:text-base text-white">{title}</h3>
            {badge && (
              <span className="px-2 py-0.5 rounded-full bg-stadiumGreen text-black font-black text-[9px]">
                {badge}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto pr-1">
          {children}
        </div>

      </div>
    </div>
  );
};
