'use client';

import React, { useState, useEffect } from 'react';
import { getSmartVisitorDetails, SmartVisitorData } from '../lib/smart-visitor-engine';
import { MapPin, Navigation, RefreshCw, Sparkles, Clock, ChevronDown, ChevronUp } from 'lucide-react';

export const SmartVisitorBanner: React.FC = () => {
  const [visitor, setVisitor] = useState<SmartVisitorData>({
    city: 'ABA',
    region: 'Abia State',
    country: 'Nigeria',
    countryCode: 'NG',
    countryFlag: '🇳🇬',
    latitude: 5.1066,
    longitude: 7.3667,
    temperature: 29,
    weatherCondition: 'Warm & Fair',
    weatherIcon: '🌤️',
    greeting: 'Good afternoon ☀️ — Pitch momentum is heating up!',
    formattedTime: '12:17 PM',
    timezone: 'Africa/Lagos (WAT)',
    isGpsAccurate: true,
  });

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const fetchDetails = () => {
    setLoading(true);
    getSmartVisitorDetails().then((data) => {
      setVisitor(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  return (
    <div className="bg-panel/90 border border-stadiumGreen/40 p-3 sm:p-4 rounded-3xl font-mono text-xs shadow-xl glow-emerald space-y-3">
      
      {/* Top Bar with Collapsible Header */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-black text-white text-xs sm:text-sm flex items-center space-x-1.5">
            <span>{visitor.greeting}</span>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-stadiumGreen/20 text-stadiumGreen font-black text-[10px] border border-stadiumGreen/30 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-stadiumGreen animate-ping"></span>
            <span>MATCHDAY LIVE</span>
          </span>
        </div>

        <div className="flex items-center space-x-2 text-gray-400 text-xs font-bold">
          <span className="hidden sm:inline">{isOpen ? 'Collapse' : 'Expand'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-stadiumGreen" /> : <ChevronDown className="w-4 h-4 text-gold" />}
        </div>
      </div>

      {/* Collapsible Body */}
      {isOpen && (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pt-2 border-t border-white/5 animate-fadeIn">
          
          {/* Location & Time */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-gray-300 text-[11px]">
            <span className="flex items-center space-x-1 text-stadiumGreen font-extrabold">
              <MapPin className="w-3.5 h-3.5 animate-bounce text-stadiumGreen" />
              <span>{visitor.city}, {visitor.region} {visitor.countryFlag}</span>
            </span>
            <span className="text-gray-600">|</span>
            <span className="flex items-center space-x-1 text-gold font-bold">
              <Clock className="w-3 h-3 text-gold" />
              <span>{visitor.formattedTime} ({visitor.timezone})</span>
            </span>
            {visitor.isGpsAccurate && (
              <span className="px-1.5 py-0.2 rounded bg-stadiumGreen text-black text-[9px] font-black">
                GPS PRECISION ✓
              </span>
            )}
          </div>

          {/* Right: Weather & Refresh */}
          <div className="flex items-center space-x-2.5 self-stretch md:self-auto justify-between md:justify-end">
            <div className="p-2 rounded-2xl bg-black/60 border border-white/10 flex items-center space-x-2">
              <span className="text-xl">{visitor.weatherIcon}</span>
              <div className="text-left leading-tight">
                <span className="font-black text-white text-xs block">{visitor.temperature}°C</span>
                <span className="text-[9px] text-gray-400 font-sans block">{visitor.weatherCondition}</span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                fetchDetails();
              }}
              className="px-3 py-2 rounded-2xl bg-stadiumGreen/20 hover:bg-stadiumGreen/30 border border-stadiumGreen/40 text-stadiumGreen font-black text-[11px] flex items-center space-x-1.5 transition-all hover:scale-105"
              title="Update GPS Location & Weather"
            >
              <Navigation className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Update GPS 📍</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
