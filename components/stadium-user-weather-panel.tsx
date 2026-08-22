'use client';

import React, { useState, useEffect } from 'react';
import { getDualContext, DualContext } from '../lib/stadium-weather-engine';
import { MapPin, Navigation, Landmark, Wind, Droplets, RefreshCw, Compass } from 'lucide-react';

interface Props {
  venueName?: string;
}

/**
 * DUAL-CONTEXT WEATHER & LOCATION PANEL
 * Clearly separates:
 *   • YOUR LOCATION  — visitor's city, weather, local time
 *   • STADIUM        — the match's venue city, weather, capacity
 */
export const StadiumUserWeatherPanel: React.FC<Props> = ({ venueName }) => {
  const [ctx, setCtx] = useState<DualContext | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getDualContext(venueName).then((data) => {
      setCtx(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venueName]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {/* USER LOCATION */}
      <ContextCard
        loading={loading}
        title="Your Location"
        icon={<Navigation className="w-4 h-4 text-stadiumGreen" />}
        accent="border-stadiumGreen/30"
        render={() => {
          const u = ctx?.user;
          if (!u) return null;
          return (
            <>
              <Row icon={<MapPin className="w-4 h-4 text-stadiumGreen" />} label="City" value={`${u.city}, ${u.region} ${u.countryFlag}`} />
              <Row icon={<Compass className="w-4 h-4 text-stadiumGreen" />} label="Local Time" value={`${u.formattedTime} (${u.timezone})`} />
              <Row icon={<WeatherEmoji icon={u.weatherIcon} />} label="Weather" value={`${u.temperature}°C · ${u.weatherCondition}`} />
              <span className="text-[9px] text-gray-500">{u.isGpsAccurate ? '✓ GPS precise' : 'IP-based location'}</span>
            </>
          );
        }}
      />

      {/* STADIUM */}
      <ContextCard
        loading={loading}
        title="Match Stadium"
        icon={<Landmark className="w-4 h-4 text-gold" />}
        accent="border-gold/30"
        render={() => {
          const s = ctx?.stadium;
          if (!s) return null;
          return (
            <>
              <Row icon={<Landmark className="w-4 h-4 text-gold" />} label="Venue" value={s.venueName} />
              <Row icon={<MapPin className="w-4 h-4 text-gold" />} label="City" value={`${s.city} ${s.flag}`} />
              <Row icon={<WeatherEmoji icon={s.weatherIcon} />} label="Weather" value={`${s.temperature}°C · ${s.weatherCondition}`} />
              <Row icon={<Wind className="w-4 h-4 text-gold" />} label="Wind" value={`${s.windSpeed} km/h`} />
              <Row icon={<Droplets className="w-4 h-4 text-gold" />} label="Humidity" value={`${s.humidity}%`} />
              {s.capacity && <Row icon={<Landmark className="w-4 h-4 text-gray-400" />} label="Capacity" value={s.capacity} />}
              {!s.isLiveWeather && <span className="text-[9px] text-gray-500">Weather approximated for venue city</span>}
            </>
          );
        }}
      />
    </div>
  );
};

function ContextCard({ title, icon, accent, loading, render }: {
  title: string;
  icon: React.ReactNode;
  accent: string;
  loading: boolean;
  render: () => React.ReactNode;
}) {
  return (
    <div className={`rounded-3xl border ${accent} bg-panel/80 p-4 space-y-2`}>
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center space-x-2">
          {icon}
          <span className="text-xs font-black text-white uppercase tracking-wider">{title}</span>
        </div>
        {loading && <RefreshCw className="w-3.5 h-3.5 text-gray-400 animate-spin" />}
      </div>
      {!loading && render()}
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center space-x-2 shrink-0">
        {icon}
        <span className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</span>
      </div>
      <span className="text-xs font-bold text-white text-right">{value}</span>
    </div>
  );
}

function WeatherEmoji({ icon }: { icon: string }) {
  return <span className="text-base leading-none">{icon}</span>;
}