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
  lastUpdated: string;
}

const NIGERIAN_SW_STATES = ['lagos', 'ogun', 'oyo', 'osun', 'ondo', 'ekiti'];
const NIGERIAN_SE_STATES = ['enugu', 'anambra', 'imo', 'abia', 'ebonyi'];
const NIGERIAN_NORTH_STATES = ['kano', 'kaduna', 'abuja', 'federal capital territory', 'fct', 'sokoto', 'katsina', 'borno', 'niger', 'bauchi', 'plateau', 'kebbi', 'zamfara', 'jigawa', 'yobe', 'adamawa', 'taraba', 'gombe', 'nasarawa', 'kwara', 'kogi'];
const NIGERIAN_SS_STATES = ['delta', 'edo', 'rivers', 'bayelsa', 'akwa ibom', 'cross river'];

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
  if (/iPhone/i.test(ua)) {
    if (/iPhone15/i.test(ua) || window.screen.height >= 852) return 'iPhone 15/16 Pro';
    if (/iPhone14/i.test(ua) || window.screen.height >= 844) return 'iPhone 14/15';
    return 'Apple iPhone';
  }
  if (/iPad/i.test(ua)) return 'Apple iPad';
  if (/Samsung/i.test(ua) || /SM-/i.test(ua)) return 'Samsung Galaxy';
  if (/Pixel/i.test(ua)) return 'Google Pixel';
  if (/Android/i.test(ua)) return 'Android Device';
  if (/Macintosh/i.test(ua)) return 'MacBook / Mac';
  if (/Windows/i.test(ua)) return 'Windows PC';
  return 'Mobile Device';
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

  public static async fetchHyperAccurateLocationIntel(): Promise<LocationIntelData> {
    if (typeof window === 'undefined') {
      return this.getFallbackIntel();
    }

    try {
      // 1. Get GPS coordinates or fallback
      let lat = 6.5244; // Default Lagos
      let lon = 3.3792;

      if ('geolocation' in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
              maximumAge: 60000,
              enableHighAccuracy: true,
            });
          });
          lat = position.coords.latitude;
          lon = position.coords.longitude;
        } catch {
          // Fallback to IP reverse client
        }
      }

      // 2. Fetch Reverse Geocoding from BigDataCloud
      const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
      let geoData: any = {};
      if (geoRes.ok) {
        geoData = await geoRes.json();
      }

      const city = geoData.city || geoData.locality || geoData.principalSubdivision || 'Lagos';
      const state = (geoData.principalSubdivision || '').toLowerCase();
      const countryName = geoData.countryName || 'Nigeria';
      const countryCode = (geoData.countryCode || 'NG').toUpperCase();

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

      if (countryCode === 'NG') {
        if (NIGERIAN_SW_STATES.some(s => state.includes(s) || city.toLowerCase().includes(s))) {
          suggestedLanguage = 'yoruba';
          localGreeting = `Ẹ kú àbọ̀ sí ${city}! Ìsọtẹ́lẹ̀ tòní ti dé! 👑`;
        } else if (NIGERIAN_SE_STATES.some(s => state.includes(s) || city.toLowerCase().includes(s))) {
          suggestedLanguage = 'igbo';
          localGreeting = `Nnọọ na ${city}! Amụma bọọlụ taa eruola! 👑`;
        } else if (NIGERIAN_NORTH_STATES.some(s => state.includes(s) || city.toLowerCase().includes(s))) {
          suggestedLanguage = 'hausa';
          localGreeting = `Barka da zuwa ${city}! Hasashen wasanni na yau! 👑`;
        } else if (NIGERIAN_SS_STATES.some(s => state.includes(s) || city.toLowerCase().includes(s))) {
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
        principalSubdivision: geoData.principalSubdivision || 'State',
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
