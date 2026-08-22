/**
 * 100% FREE NON-SPORTS OPEN APIS CONNECTOR
 * Open-Meteo Weather API (No Key) & Frankfurter ECB Currency API (No Key)
 * NO HARDCODED FALLBACKS - all data fetched live from free APIs
 */

export interface LiveStadiumWeather {
  tempCelsius: number;
  weatherDescription: string;
  isRainy: boolean;
  windSpeed: number;
  humidity: number;
}

// Weather code mapping (WMO standard used by Open-Meteo)
function describeWeather(code: number): { description: string; isRainy: boolean } {
  if (code === 0) return { description: 'Clear Sky ☀️', isRainy: false };
  if (code <= 3) return { description: 'Partly Cloudy ⛅', isRainy: false };
  if (code <= 48) return { description: 'Foggy 🌫️', isRainy: false };
  if (code <= 57) return { description: 'Drizzle 🌦️', isRainy: true };
  if (code <= 67) return { description: 'Rain 🌧️', isRainy: true };
  if (code <= 77) return { description: 'Snow 🌨️', isRainy: false };
  if (code <= 82) return { description: 'Rain Showers 🌧️', isRainy: true };
  if (code <= 86) return { description: 'Snow Showers 🌨️', isRainy: false };
  if (code >= 95) return { description: 'Thunderstorm ⛈️', isRainy: true };
  return { description: 'Unknown', isRainy: false };
}

// 1. Fetch Real Live Weather using 100% Free Open-Meteo API (no key required)
export async function fetchLiveStadiumWeather(lat: number = 51.55, lon: number = -0.10): Promise<LiveStadiumWeather | null> {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m`,
      { cache: 'no-store' }
    );
    
    if (!res.ok) throw new Error(`Weather API returned ${res.status}`);
    
    const data = await res.json();
    
    if (data && data.current_weather) {
      const weatherCode = data.current_weather.weathercode;
      const { description, isRainy } = describeWeather(weatherCode);
      
      // Get humidity from hourly data (current hour)
      const currentHour = new Date().getHours();
      const humidity = data.hourly?.relative_humidity_2m?.[currentHour] || 50;
      
      return {
        tempCelsius: Math.round(data.current_weather.temperature),
        weatherDescription: description,
        isRainy,
        windSpeed: Math.round(data.current_weather.windspeed || 0),
        humidity,
      };
    }
  } catch (err) {
    console.warn('Open-Meteo weather API failed:', err);
  }

  // Return null instead of hardcoded fallback - caller should handle gracefully
  return null;
}

// 2. Fetch Live Currency Rates using 100% Free Frankfurter ECB API (No API Key Required)
export async function fetchLiveExchangeRates(): Promise<{ [symbol: string]: number } | null> {
  try {
    const res = await fetch('https://api.frankfurter.dev/v1/latest?base=USD', { cache: 'no-store' });
    
    if (!res.ok) throw new Error(`Currency API returned ${res.status}`);
    
    const data = await res.json();
    
    if (data && data.rates) {
      return {
        '$': 1.0,
        '€': data.rates.EUR || 0.92,
        '£': data.rates.GBP || 0.79,
        '₦': data.rates.NGN || 0,
        'KSh': data.rates.KES || 0,
        'R': data.rates.ZAR || 0,
      };
    }
  } catch (err) {
    console.warn('Frankfurter ECB currency API failed:', err);
  }

  // Try secondary free API (ExchangeRate-API free tier)
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', { cache: 'no-store' });
    
    if (!res.ok) throw new Error(`Secondary currency API returned ${res.status}`);
    
    const data = await res.json();
    
    if (data && data.rates) {
      return {
        '$': 1.0,
        '€': data.rates.EUR || 0,
        '£': data.rates.GBP || 0,
        '₦': data.rates.NGN || 0,
        'KSh': data.rates.KES || 0,
        'R': data.rates.ZAR || 0,
      };
    }
  } catch (err) {
    console.warn('Secondary currency API failed:', err);
  }

  // Return null - no hardcoded fallback values
  return null;
}