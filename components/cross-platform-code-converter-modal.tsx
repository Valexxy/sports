'use client';

import React from 'react';
import { X } from 'lucide-react';
import { EnterpriseConverterHUD } from './converter/EnterpriseConverterHUD';

interface CrossPlatformConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CrossPlatformConverterModal: React.FC<CrossPlatformConverterModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] bg-black/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 animate-fadeIn font-mono text-xs overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#07090e] rounded-3xl border-2 border-stadiumGreen/60 shadow-2xl p-4 sm:p-6 space-y-4 my-6 max-h-[92vh] overflow-y-auto text-white glow-emerald">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-all hover:rotate-90 z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <EnterpriseConverterHUD />
      </div>
    </div>
  );
};
