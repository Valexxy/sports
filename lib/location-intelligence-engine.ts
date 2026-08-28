'use client';

import { LanguageCode } from './translation-engine';

export interface LocationIntelData {
  city: string;
  principalSubdivision: string; // State/Province
  countryName: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  temperature: number;
  weatherDescription: string;
  weatherCode: number;
  windSpeed: number;
  suggestedLanguage: LanguageCode;
  localGreeting: string;
  deviceName: string;
  userNickname: string;
  isManualOverride?: boolean;
  lastUpdated: string;
}

const NIGERIAN_SW_STATES = ['lagos', 'ogun', 'oyo', 'osun', 'ondo', 'ekiti', 'ibadan'];
const NIGERIAN_SE_STATES = ['enugu', 'anambra', 'imo', 'abia', 'ebonyi', 'onitsha', 'owerri'];
const NIGERIAN_NORTH_STATES = ['kano', 'kaduna', 'abuja', 'federal capital territory', 'fct', 'sokoto', 'katsina', 'borno', 'niger', 'bauchi', 'plateau', 'kebbi', 'zamfara', 'jigawa', 'yobe', 'adamawa', 'taraba', 'gombe', 'nasarawa', 'kwara', 'kogi', 'jos'];
const NIGERIAN_SS_STATES = ['delta', 'edo', 'rivers', 'bayelsa', 'akwa ibom', 'cross river', 'port harcourt', 'warri', 'benin city', 'calabar', 'uyoo'];

const KNOWN_HUBS: Record<string, { lat: number; lon: number; country: string; code: string; state: string }> = {
  'lagos': { lat: 6.5244, lon: 3.3792, country: 'Nigeria', code: 'NG', state: 'Lagos' },
  'abuja': { lat: 9.0765, lon: 7.3986, country: 'Nigeria', code: 'NG', state: 'FCT' },
  'port harcourt': { lat: 4.8156, lon: 7.0498, country: 'Nigeria', code: 'NG', state: 'Rivers' },
  'ibadan': { lat: 7.3775, lon: 3.9470, country: 'Nigeria', code: 'NG', state: 'Oyo' },
  'enugu': { lat: 6.4584, lon: 7.5464, country: 'Nigeria', code: 'NG', state: 'Enugu' },
  'kano': { lat: 12.0022, lon: 8.5920, country: 'Nigeria', code: 'NG', state: 'Kano' },
  'benin city': { lat: 6.3350, lon: 5.6037, country: 'Nigeria', code: 'NG', state: 'Edo' },
  'onitsha': { lat: 6.1667, lon: 6.7833, country: 'Nigeria', code: 'NG', state: 'Anambra' },
  'accra': { lat: 5.6037, lon: -0.1870, country: 'Ghana', code: 'GH', state: 'Greater Accra' },
  'nairobi': { lat: -1.2921, lon: 36.8219, country: 'Kenya', code: 'KE', state: 'Nairobi' },
  'johannesburg': { lat: -26.2041, lon: 28.0473, country: 'South Africa', code: 'ZA', state: 'Gauteng' },
  'london': { lat: 51.5074, lon: -0.1278, country: 'United Kingdom', code: 'GB', state: 'England' },
  'manchester': { lat: 53.4808, lon: -2.2426, country: 'United Kingdom', code: 'GB', state: 'Greater Manchester' },
  'paris': { lat: 48.8566, lon: 2.3522, country: 'France', code: 'FR', state: 'Ile-de-France' },
  'madrid': { lat: 40.4168, lon: -3.7038, country: 'Spain', code: 'ES', state: 'Madrid' },
  'new york': { lat: 40.7128, lon: -74.0060, country: 'United States', code: 'US', state: 'New York' },
};

function mapWeatherCode(code: number): string {
  if (code === 0) return 'Clear Sky ☀️';
  if (code === 1 || code === 2) return 'Partly Cloudy ⛅';
  if (code === 3) return 'Overcast ☁️';
  if (code === 45 || code === 48) return 'Foggy 🌫️';
  if (code >= 51 && code <= 55) return 'Light Drizzle 🌦️';
  if (code >= 61 && code <= 65) return 'Rain Showers 🌧️';
  if (code >= 80 && code <= 82) return 'Heavy Rain ⛈️';
  if (code >= 95) return 'Thunderstorm ⚡';
  return 'Fair Weather 🌤️';
}

function detectDeviceName(): string {
  if (typeof window === 'undefined') return 'Smart Device';
  const ua = navigator.userAgent || '';
  if (/iPhone/i.test(ua)) return 'Mobile Device';
  if (/iPad/i.test(ua)) return 'Tablet Device';
  if (/Android/i.test(ua)) return 'Mobile Device';
  if (/Macintosh/i.test(ua)) return 'Desktop Computer';
  if (/Windows/i.test(ua)) return 'Desktop Computer';
  return 'Personal Device';
}

export class LocationIntelligenceEngine {
  private static cachedData: LocationIntelData | null = null;
  private static listeners: ((data: LocationIntelData) => void)[] = [];

  public static subscribe(listener: (data: LocationIntelData) => void) {
    this.listeners.push(listener);
    if (this.cachedData) listener(this.cachedData);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public static getUserNickname(): string {
    if (typeof window === 'undefined') return 'Sports Fan';
    return localStorage.getItem('mivaj_user_nickname') || 'Champion';
  }

  public static setUserNickname(name: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('mivaj_user_nickname', name);
    if (this.cachedData) {
      this.cachedData.userNickname = name;
      this.listeners.forEach(l => l(this.cachedData!));
    }
  }

  public static getCustomLocation(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('mivaj_custom_city');
  }

  public static setCustomLocation(city: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('mivaj_custom_city', city);
  }

  public static clearCustomLocation(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('mivaj_custom_city');
  }

  public static async fetchHyperAccurateLocationIntel(): Promise<LocationIntelData> {
    if (typeof window === 'undefined') {
      return this.getFallbackIntel();
    }

    try {
      const customCity = this.getCustomLocation();
      let city = customCity || 'Lagos';
      let state = 'Lagos State';
      let countryName = 'Nigeria';
      let countryCode = 'NG';
      let lat = 6.5244;
      let lon = 3.3792;
      let isManual = Boolean(customCity);

      if (customCity) {
        const hub = KNOWN_HUBS[customCity.toLowerCase().trim()];
        if (hub) {
          lat = hub.lat;
          lon = hub.lon;
          countryName = hub.country;
          countryCode = hub.code;
          state = hub.state;
          city = customCity.charAt(0).toUpperCase() + customCity.slice(1);
        }
      } else {
        // 1. Try GPS coordinates
        if ('geolocation' in navigator) {
          try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 4000,
                maximumAge: 60000,
                enableHighAccuracy: true,
              });
            });
            lat = position.coords.latitude;
            lon = position.coords.longitude;
          } catch {}
        }

        // 2. Fetch Reverse Geocoding from BigDataCloud
        try {
          const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            city = geoData.city || geoData.locality || geoData.principalSubdivision || 'Lagos';
            state = (geoData.principalSubdivision || '').toLowerCase();
            countryName = geoData.countryName || 'Nigeria';
            countryCode = (geoData.countryCode || 'NG').toUpperCase();
          }
        } catch {}
      }

      // 3. Fetch Live Weather from Open-Meteo
      let temp = 28;
      let weatherCode = 1;
      let windSpeed = 12;

      try {
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m`);
        if (weatherRes.ok) {
          const wData = await weatherRes.json();
          if (wData.current) {
            temp = Math.round(wData.current.temperature_2m);
            weatherCode = wData.current.weather_code;
            windSpeed = Math.round(wData.current.wind_speed_10m);
          }
        }
      } catch {}

      // 4. Determine Regional Language & Local Dialect Greeting
      let suggestedLanguage: LanguageCode = 'pidgin';
      let localGreeting = `How far ${city}! Welcome to Mivaj Sports! 👑`;

      const normCity = city.toLowerCase();
      const normState = state.toLowerCase();

      if (countryCode === 'NG') {
        if (NIGERIAN_SW_STATES.some(s => normState.includes(s) || normCity.includes(s))) {
          suggestedLanguage = 'yoruba';
          localGreeting = `Ẹ kú àbọ̀ sí ${city}! Ìsọtẹ́lẹ̀ tòní ti dé! 👑`;
        } else if (NIGERIAN_SE_STATES.some(s => normState.includes(s) || normCity.includes(s))) {
          suggestedLanguage = 'igbo';
          localGreeting = `Nnọọ na ${city}! Amụma bọọlụ taa eruola! 👑`;
        } else if (NIGERIAN_NORTH_STATES.some(s => normState.includes(s) || normCity.includes(s))) {
          suggestedLanguage = 'hausa';
          localGreeting = `Barka da zuwa ${city}! Hasashen wasanni na yau! 👑`;
        } else if (NIGERIAN_SS_STATES.some(s => normState.includes(s) || normCity.includes(s))) {
          suggestedLanguage = 'pidgin';
          localGreeting = `Waffi & ${city} people how far! Correct banker don land! 👑`;
        }
      } else if (countryCode === 'GH') {
        suggestedLanguage = 'twi';
        localGreeting = `Akwaaba ba ${city}! Nnɛ agodie nkonimdie! 👑`;
      } else if (countryCode === 'KE' || countryCode === 'TZ') {
        suggestedLanguage = 'swahili';
        localGreeting = `Karibu ${city}! Bashiri za uhakika za leo! 👑`;
      } else if (countryCode === 'ZA') {
        suggestedLanguage = 'zulu';
        localGreeting = `Siyakwamukela e-${city}! Imiphumela yanamuhla! 👑`;
      } else if (countryCode === 'FR' || countryCode === 'CI' || countryCode === 'SN' || countryCode === 'CM') {
        suggestedLanguage = 'fr';
        localGreeting = `Bienvenue à ${city}! Pronostics et scores en direct! 👑`;
      } else if (countryCode === 'AO' || countryCode === 'MZ' || countryCode === 'PT' || countryCode === 'BR') {
        suggestedLanguage = 'pt';
        localGreeting = `Bem-vindo a ${city}! Melhores análises de jogos! 👑`;
      } else {
        suggestedLanguage = 'en';
        localGreeting = `Welcome to ${city}! Today's Premier Match Intelligence! 👑`;
      }

      const result: LocationIntelData = {
        city,
        principalSubdivision: state || 'State',
        countryName,
        countryCode,
        latitude: lat,
        longitude: lon,
        temperature: temp,
        weatherDescription: mapWeatherCode(weatherCode),
        weatherCode,
        windSpeed,
        suggestedLanguage,
        localGreeting,
        deviceName: detectDeviceName(),
        userNickname: this.getUserNickname(),
        isManualOverride: isManual,
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      this.cachedData = result;
      this.listeners.forEach(l => l(result));
      return result;
    } catch (e) {
      console.warn('Location intelligence error:', e);
      return this.getFallbackIntel();
    }
  }

  private static getFallbackIntel(): LocationIntelData {
    return {
      city: 'Lagos',
      principalSubdivision: 'Lagos State',
      countryName: 'Nigeria',
      countryCode: 'NG',
      latitude: 6.5244,
      longitude: 3.3792,
      temperature: 29,
      weatherDescription: 'Partly Cloudy ⛅',
      weatherCode: 1,
      windSpeed: 14,
      suggestedLanguage: 'pidgin',
      localGreeting: 'How far Lagos! Welcome to Mivaj Sports! 👑',
      deviceName: detectDeviceName(),
      userNickname: this.getUserNickname(),
      lastUpdated: 'Live',
    };
  }
}
