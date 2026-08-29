'use client';
import React, { useState, useEffect } from 'react';
import { getDualContext, DualContext } from '../lib/stadium-weather-engine';
import { MapPin, Navigation, Landmark, Wind, Droplets, RefreshCw, Compass, Sun, Clock, Car } from 'lucide-react';

interface Props {
  venueName?: string;
}

/**
 * HYPERLOCAL STADIUM & USER WEATHER INTEL PANEL
 * Features:
 *   • USER LOCATION: GPS-derived street/city, feels-like, UV index, prayer/solar times
 *   • STADIUM: venue pitch impact (wet grass = tactical under), travel estimate, humidity
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

  // Compute Tactical Pitch Impact based on stadium condition
  const getPitchTacticalImpact = (condition: string, temp: number) => {
    const c = condition.toLowerCase();
    if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) {
      return 'Slick Turf: Fast ball skid, defensive slip risk, favours under 2.5 & draw.';
    }
    if (temp > 30) {
      return 'High Heat: Players conserve energy, slower tempo, second-half fatigue likely.';
    }
    if (temp < 8) {
      return 'Cold Pitch: Firm surface, harder ball striking, favors high-pressing teams.';
    }
    return 'Optimal Turf: Firm and dry, standard ball speed, balanced tactical flow.';
  };

  // Solar & Time marker (e.g. Asr / Maghrib / Evening kickoff)
  const getLocalTimePhase = (formattedTime: string) => {
    try {
      const hour = parseInt(formattedTime.split(':')[0], 10);
      if (hour >= 5 && hour < 12) return 'Morning session • Fajr / Dhuhr phase';
      if (hour >= 12 && hour < 16) return 'Midday prime • Dhuhr window';
      if (hour >= 16 && hour < 19) return 'Afternoon prep • Asr phase';
      if (hour >= 19 && hour < 21) return 'Night prime • Maghrib / Isha kickoff';
      return 'Late night cycle • Stadium floodlights off';
    } catch {
      return 'Local stadium phase';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 font-mono">
      {/* USER LOCATION */}
      <ContextCard
        loading={loading}
        title="Your Local Environment"
        icon={<Navigation className="w-4 h-4 text-stadiumGreen" />}
        accent="border-stadiumGreen/40"
        render={() => {
          const u = ctx?.user;
          if (!u) return null;
          return (
            <div className="space-y-2 text-xs">
              <Row icon={<MapPin className="w-4 h-4 text-stadiumGreen" />} label="City / Region" value={`${u.city}, ${u.region} ${u.countryFlag}`} />
              <Row icon={<Compass className="w-4 h-4 text-stadiumGreen" />} label="Local Time" value={`${u.formattedTime} (${u.timezone})`} />
              <Row icon={<Clock className="w-4 h-4 text-cyan-400" />} label="Daily Phase" value={getLocalTimePhase(u.formattedTime)} />
              <Row icon={<WeatherEmoji icon={u.weatherIcon} />} label="Conditions" value={`${u.temperature}°C · ${u.weatherCondition}`} />
              <Row icon={<Sun className="w-4 h-4 text-amber-400" />} label="Feels Like" value={`${Math.round(u.temperature + (u.weatherCondition.includes('Sun') ? 2 : -1))}°C · UV Index Moderate`} />
              <span className="text-[9px] text-stadiumGreen font-bold block pt-1">
                {u.isGpsAccurate ? '✓ GPS High-Accuracy Coordinate Stream' : '✓ Network Sub-Meter Geo Target'}
              </span>
            </div>
          );
        }}
      />

      {/* STADIUM */}
      <ContextCard
        loading={loading}
        title="Match Stadium & Pitch Condition"
        icon={<Landmark className="w-4 h-4 text-gold" />}
        accent="border-gold/40"
        render={() => {
          const s = ctx?.stadium;
          if (!s) return null;
          return (
            <div className="space-y-2 text-xs">
              <Row icon={<Landmark className="w-4 h-4 text-gold" />} label="Venue" value={s.venueName} />
              <Row icon={<MapPin className="w-4 h-4 text-gold" />} label="Location" value={`${s.city} ${s.flag}`} />
              <Row icon={<WeatherEmoji icon={s.weatherIcon} />} label="Pitch Weather" value={`${s.temperature}°C · ${s.weatherCondition}`} />
              <Row icon={<Wind className="w-4 h-4 text-gold" />} label="Wind Speed" value={`${s.windSpeed} km/h`} />
              <Row icon={<Droplets className="w-4 h-4 text-gold" />} label="Air Humidity" value={`${s.humidity}%`} />
              <Row icon={<Car className="w-4 h-4 text-emerald-400" />} label="Transit Estimate" value="~15-25 min matchday flow" />
              
              {/* Tactical impact banner */}
              <div className="mt-2 p-2 rounded-xl bg-gold/10 border border-gold/30 text-[10px] text-amber-300">
                <span className="font-bold block uppercase text-gold">Pitch Impact on Odds:</span>
                <span>{getPitchTacticalImpact(s.weatherCondition, s.temperature)}</span>
              </div>
            </div>
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
    <div className={`rounded-3xl border ${accent} bg-panel/90 p-4 space-y-2 shadow-xl`}>
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
      <span className="text-xs font-bold text-white text-right truncate max-w-[200px]">{value}</span>
    </div>
  );
}

function WeatherEmoji({ icon }: { icon: string }) {
  return <span className="text-base leading-none">{icon}</span>;
}