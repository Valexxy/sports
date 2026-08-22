/**
 * DUAL-CONTEXT WEATHER & VENUE ENGINE
 * Clearly separates two distinct data layers so users always see the truth:
 *
 *  1. USER CONTEXT  — the visitor's current location, local weather & time
 *  2. STADIUM CONTEXT — the match venue's name, city, weather & kickoff
 *
 * Stadium weather is derived from the venue city via Open-Meteo geocoding +
 * forecast (free, keyless). When a live feed only provides a stadium name we
 * approximate its city from a bundled venue->city mapping for major arenas.
 */

import { getSmartVisitorDetails, SmartVisitorData } from './smart-visitor-engine';

export interface StadiumContext {
  venueName: string;
  city: string;
  country: string;
  flag: string;
  temperature: number;
  weatherCondition: string;
  weatherIcon: string;
  windSpeed: number;
  humidity: number;
  isLiveWeather: boolean;
  capacity?: string;
}

// Venue -> city resolution for common stadiums (guarantees a correct city even
// when the free sports feed only returns a venue name).
const VENUE_CITY_MAP: Record<string, { city: string; country: string; flag: string; capacity?: string }> = {
  'Wembley Stadium': { city: 'London', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', capacity: '90,000' },
  'Old Trafford': { city: 'Manchester', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', capacity: '74,310' },
  'Etihad Stadium': { city: 'Manchester', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', capacity: '53,400' },
  'Anfield': { city: 'Liverpool', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', capacity: '61,276' },
  'Stamford Bridge': { city: 'London', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', capacity: '40,341' },
  'Emirates Stadium': { city: 'London', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', capacity: '60,704' },
  'Santiago Bernabéu': { city: 'Madrid', country: 'Spain', flag: '🇪🇸', capacity: '81,044' },
  'Camp Nou': { city: 'Barcelona', country: 'Spain', flag: '🇪🇸', capacity: '99,354' },
  'Metropolitano': { city: 'Madrid', country: 'Spain', flag: '🇪🇸', capacity: '70,460' },
  'San Siro': { city: 'Milan', country: 'Italy', flag: '🇮🇹', capacity: '75,817' },
  'Allianz Arena': { city: 'Munich', country: 'Germany', flag: '🇩🇪', capacity: '75,024' },
  'Parc des Princes': { city: 'Paris', country: 'France', flag: '🇫🇷', capacity: '47,929' },
  'Volksparkstadion': { city: 'Hamburg', country: 'Germany', flag: '🇩🇪' },
  'Signal Iduna Park': { city: 'Dortmund', country: 'Germany', flag: '🇩🇪', capacity: '81,365' },
  'San Siro (Stadio Giuseppe Meazza)': { city: 'Milan', country: 'Italy', flag: '🇮🇹', capacity: '75,817' },
};

function resolveVenueCity(venueName: string): { city: string; country: string; flag: string; capacity?: string } {
  const key = venueName.trim();
  if (VENUE_CITY_MAP[key]) return VENUE_CITY_MAP[key];

  const lower = key.toLowerCase();
  for (const [name, meta] of Object.entries(VENUE_CITY_MAP)) {
    if (lower.includes(name.toLowerCase())) return meta;
  }

  return { city: key, country: '', flag: '🏟️' };
}

interface WmoResult {
  condition: string;
  icon: string;
}

function interpretWmo(code: number, isDay: number): WmoResult {
  if (code === 0) return { condition: isDay ? 'Sunny & Clear' : 'Clear Night', icon: isDay ? '☀️' : '🌙' };
  if ([1, 2, 3].includes(code)) return { condition: 'Partly Cloudy', icon: '⛅' };
  if ([45, 48].includes(code)) return { condition: 'Foggy', icon: '🌫️' };
  if ([51, 53, 55, 56, 57, 80, 81, 82].includes(code)) return { condition: 'Rain Showers', icon: '🌧️' };
  if ([61, 63, 65].includes(code)) return { condition: 'Rainy', icon: '🌧️' };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { condition: 'Snow', icon: '❄️' };
  if ([95, 96, 99].includes(code)) return { condition: 'Thunderstorm', icon: '⛈️' };
  return { condition: 'Fair Weather', icon: '🌤️' };
}

async function geocodeCity(city: string): Promise<{ lat: number; lon: number; name: string; country: string; flag: string } | null> {
  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
    if (!res.ok) return null;
    const data = await res.json();
    const r = data?.results?.[0];
    if (r) {
      return {
        lat: r.latitude,
        lon: r.longitude,
        name: r.name || city,
        country: r.country || '',
        flag: countryFlag(r.country_code || ''),
      };
    }
  } catch {}
  return null;
}

function countryFlag(code: string): string {
  const map: Record<string, string> = {
    GB: '🇬🇧', ES: '🇪🇸', IT: '🇮🇹', DE: '🇩🇪', FR: '🇫🇷',
    US: '🇺🇸', BR: '🇧🇷', MX: '🇲🇽', NG: '🇳🇬', ZA: '🇿🇦',
    SA: '🇸🇦', NL: '🇳🇱', PT: '🇵🇹', AR: '🇦🇷', TR: '🇹🇷',
  };
  return map[code] || '🌍';
}

async function fetchWeatherFor(lat: number, lon: number): Promise<{ temperature: number; weatherCondition: string; weatherIcon: string; windSpeed: number; humidity: number }> {
  const defaults = { temperature: 21, weatherCondition: 'Fair Weather', weatherIcon: '🌤️', windSpeed: 0, humidity: 0 };
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m&timezone=auto&forecast_days=1`);
    if (!res.ok) return defaults;
    const data = await res.json();
    const current = data?.current_weather;
    if (!current) return defaults;

    const inter = interpretWmo(current.weathercode, current.is_day);
    const humid = data?.hourly?.relativehumidity_2m?.[0] ?? 0;

    return {
      temperature: Math.round(current.temperature),
      weatherCondition: inter.condition,
      weatherIcon: inter.icon,
      windSpeed: Math.round(current.windspeed ?? 0),
      humidity: Math.round(humid),
    };
  } catch {
    return defaults;
  }
}

/** Fully resolves the stadium context for a given venue name. */
export async function getStadiumContext(venueName?: string): Promise<StadiumContext> {
  const raw = venueName?.trim() || 'Wembley Stadium';
  const meta = resolveVenueCity(raw);

  // Try to geocode the resolved city for real coordinates.
  const geocoded = await geocodeCity(meta.city);

  if (!geocoded) {
    return {
      venueName: raw,
      city: meta.city,
      country: meta.country,
      flag: meta.flag,
      temperature: 21,
      weatherCondition: 'Fair Weather',
      weatherIcon: '🌤️',
      windSpeed: 0,
      humidity: 0,
      isLiveWeather: false,
      capacity: meta.capacity,
    };
  }

  const weather = await fetchWeatherFor(geocoded.lat, geocoded.lon);
  return {
    venueName: raw,
    city: geocoded.name,
    country: geocoded.country || meta.country,
    flag: geocoded.flag || meta.flag,
    ...weather,
    isLiveWeather: true,
    capacity: meta.capacity,
  };
}

export type { SmartVisitorData };

export async function getUserContext(): Promise<SmartVisitorData> {
  return getSmartVisitorDetails();
}

export interface DualContext {
  user: SmartVisitorData;
  stadium: StadiumContext;
}

/** Resolves both layers in parallel. */
export async function getDualContext(venueName?: string): Promise<DualContext> {
  const [user, stadium] = await Promise.all([
    getUserContext(),
    getStadiumContext(venueName),
  ]);
  return { user, stadium };
}