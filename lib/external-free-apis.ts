/**
 * 100% FREE NON-SPORTS OPEN APIS CONNECTOR
 * Open-Meteo Weather API (No Key) & Frankfurter ECB Currency API (No Key)
 */

export interface LiveStadiumWeather {
  tempCelsius: number;
  weatherDescription: string;
  isRainy: boolean;
}

// 1. Fetch Real Live Weather using 100% Free Open-Meteo API (London Emirates stadium coords: 51.55, -0.10)
export async function fetchLiveStadiumWeather(lat: number = 51.55, lon: number = -0.10): Promise<LiveStadiumWeather> {
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
    const data = await res.json();
    if (data && data.current_weather) {
      const weatherCode = data.current_weather.weathercode;
      const isRainy = weatherCode >= 50 && weatherCode <= 82;
      return {
        tempCelsius: Math.round(data.current_weather.temperature),
        weatherDescription: isRainy ? 'Rain / Slippery Pitch 🌧️' : 'Sunny Clear Pitch ☀️',
        isRainy,
      };
    }
  } catch (err) {
    console.warn('Open-Meteo free weather API fallback triggered.');
  }

  return {
    tempCelsius: 22,
    weatherDescription: 'Sunny Clear Pitch ☀️',
    isRainy: false,
  };
}

// 2. Fetch Live Currency Rates using 100% Free Frankfurter ECB API (No API Key Required)
export async function fetchLiveExchangeRates(): Promise<{ [symbol: string]: number }> {
  try {
    const res = await fetch('https://api.frankfurter.dev/v1/latest?base=USD');
    const data = await res.json();
    if (data && data.rates) {
      return {
        '$': 1.0,
        '€': data.rates.EUR || 0.92,
        '£': data.rates.GBP || 0.79,
        '₦': 1520.0, // Fixed NGN fallback
        'KSh': 130.0,
        'R': 18.5,
      };
    }
  } catch (err) {
    console.warn('Frankfurter ECB currency free API fallback triggered.');
  }

  return {
    '$': 1.0,
    '€': 0.92,
    '£': 0.79,
    '₦': 1520.0,
    'KSh': 130.0,
    'R': 18.5,
  };
}
