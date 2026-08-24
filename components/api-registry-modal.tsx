'use client';
import React from 'react';
import { TWENTY_FREE_EngineS_REGISTRY } from '../lib/twenty-free-apis';
import { X, ExternalLink, ShieldCheck, Database, Cpu, Globe } from 'lucide-react';

interface EngineRegistryModalProps {
  onClose: () => void;
}

export const EngineRegistryModal: React.FC<EngineRegistryModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-panel rounded-3xl border border-stadiumGreen/50 p-6 shadow-2xl my-8 font-mono text-xs">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-panel text-gray-400 hover:text-white border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-4 border-b border-white/10 pb-3">
          <div className="p-2.5 rounded-xl bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40">
            <Database className="w-6 h-6 text-stadiumGreen" />
          </div>
          <div>
            <h2 className="font-extrabold text-xl text-white">22+ FREE OPEN-SOURCE EngineS & ENGINES DIRECTORY</h2>
            <p className="text-xs text-gray-400">100% Free Engines, Zero Billing, and Open Data Pipelines</p>
          </div>
        </div>

        {/* Engine Registry Table */}
        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
          {TWENTY_FREE_EngineS_REGISTRY.map((api) => (
            <div key={api.id} className="p-3.5 rounded-2xl bg-panel/90 border border-white/10 hover:border-stadiumGreen/40 transition-all flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-black text-white text-xs">{api.id}. {api.name}</span>
                  <span className="px-1.5 py-0.2 rounded bg-stadiumGreen/20 text-stadiumGreen font-bold text-[10px] border border-stadiumGreen/30">
                    {api.category}
                  </span>
                </div>
                <p className="text-gray-300 font-sans text-xs">{api.description}</p>
                <span className="text-[10px] text-gray-500 block truncate max-w-md">{api.endpointUrl}</span>
              </div>

              <a
                href={api.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-stadiumGreen/10 hover:bg-stadiumGreen/20 border border-stadiumGreen/30 text-stadiumGreen font-extrabold text-[11px] flex items-center space-x-1 flex-shrink-0 transition-all hover:scale-105"
              >
                <span>Visit Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
