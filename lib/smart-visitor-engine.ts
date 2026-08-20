/**
 * 100% FREE SMART VISITOR LOCATION, REAL WEATHER & TIME-OF-DAY GREETING ENGINE
 * 
 * 1. High-Accuracy HTML5 Browser GPS (exact town/city) with OpenStreetMap Reverse Geocoding
 * 2. Fallback IP Geo Location (ipwho.is - 100% free)
 * 3. Real-Time Live Weather (Open-Meteo API - 100% free, 0 API keys)
 * 4. Contextual Time-of-Day Stadium Greeting
 */

export interface SmartVisitorData {
  city: string;
  region: string;
  country: string;
  countryCode: string;
  countryFlag: string;
  latitude: number;
  longitude: number;
  temperature: number;
  weatherCondition: string;
  weatherIcon: string;
  greeting: string;
  formattedTime: string;
  timezone: string;
  isGpsAccurate: boolean;
}

// WMO Weather Code Interpreter
function interpretWeatherCode(code: number, isDay: number): { condition: string; icon: string } {
  if (code === 0) return { condition: isDay ? 'Sunny & Clear' : 'Clear Night', icon: isDay ? '☀️' : '🌙' };
  if ([1, 2, 3].includes(code)) return { condition: 'Partly Cloudy', icon: '⛅' };
  if ([45, 48].includes(code)) return { condition: 'Misty / Foggy', icon: '🌫️' };
  if ([51, 53, 55, 56, 57].includes(code)) return { condition: 'Light Drizzle', icon: '🌦️' };
  if ([61, 63, 65, 80, 81, 82].includes(code)) return { condition: 'Rain Showers', icon: '🌧️' };
  if ([95, 96, 99].includes(code)) return { condition: 'Thunderstorm', icon: '⛈️' };
  return { condition: 'Fair Weather', icon: '🌤️' };
}

// Time-of-Day Stadium Greeting
function getStadiumGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return 'Good morning 🌅 — Matchday buildup is underway!';
  } else if (hour >= 12 && hour < 17) {
    return 'Good afternoon ☀️ — Pitch momentum is heating up!';
  } else if (hour >= 17 && hour < 22) {
    return 'Good evening 🌙 — Prime time kick-offs & live drama active!';
  } else {
    return 'Good night 🌌 — Overnight tournament results & late fixtures live!';
  }
}

export async function getSmartVisitorDetails(): Promise<SmartVisitorData> {
  let lat = 5.1066;
  let lon = 7.3667;
  let city = 'ABA';
  let region = 'Abia State';
  let country = 'Nigeria';
  let countryFlag = '🇳🇬';
  let isGps = false;

  // 1. Try Browser GPS First if available
  if (typeof window !== 'undefined' && 'geolocation' in navigator) {
    try {
      const gpsPos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000, enableHighAccuracy: true });
      });

      if (gpsPos && gpsPos.coords) {
        lat = gpsPos.coords.latitude;
        lon = gpsPos.coords.longitude;
        isGps = true;

        // Reverse Geocode with OpenStreetMap Nominatim (Free, Open)
        try {
          const revRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
          if (revRes.ok) {
            const revData = await revRes.json();
            if (revData && revData.address) {
              city = revData.address.city || revData.address.town || revData.address.village || revData.address.county || city;
              region = revData.address.state || region;
              country = revData.address.country || country;
            }
          }
        } catch (e) {}
      }
    } catch (e) {
      // GPS not granted or timed out -> use IP Geolocation
    }
  }

  // 2. Fallback to IP Geolocation if GPS was not used
  if (!isGps) {
    try {
      const ipRes = await fetch('https://ipwho.is/');
      if (ipRes.ok) {
        const ipData = await ipRes.json();
        if (ipData && ipData.success) {
          city = ipData.city || city;
          region = ipData.region || region;
          country = ipData.country || country;
          countryFlag = ipData.country_code === 'NG' ? '🇳🇬' : '🌍';
          lat = ipData.latitude || lat;
          lon = ipData.longitude || lon;
        }
      }
    } catch (e) {}
  }

  // 3. Query Open-Meteo Real-Time Weather API (100% Free, 0 Keys)
  let temperature = 28;
  let weatherCondition = 'Sunny & Warm';
  let weatherIcon = '☀️';

  try {
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
    if (weatherRes.ok) {
      const weatherData = await weatherRes.json();
      if (weatherData && weatherData.current_weather) {
        temperature = Math.round(weatherData.current_weather.temperature);
        const inter = interpretWeatherCode(weatherData.current_weather.weathercode, weatherData.current_weather.is_day);
        weatherCondition = inter.condition;
        weatherIcon = inter.icon;
      }
    }
  } catch (e) {}

  const now = new Date();
  const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return {
    city: city.toUpperCase(),
    region,
    country,
    countryCode: country.toLowerCase().includes('nigeria') ? 'NG' : country.toLowerCase().includes('kingdom') ? 'GB' : country.toLowerCase().includes('state') ? 'US' : 'NG',
    countryFlag,
    latitude: lat,
    longitude: lon,
    temperature,
    weatherCondition,
    weatherIcon,
    greeting: getStadiumGreeting(),
    formattedTime,
    timezone: timezone.replace('_', ' '),
    isGpsAccurate: isGps,
  };
}
