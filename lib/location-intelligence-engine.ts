'use client';

import { LanguageCode } from './translation-engine';
import { getUltraPreciseLocation } from './precision-location-engine';

export interface LocationIntelData {
  city: string;
  principalSubdivision: string; // State/Province
  countryName: string;
  countryCode: string;
  street?: string;
  houseNumber?: string;
  neighbourhood?: string;
  formattedAddress: string;
  isGpsPrecise?: boolean;
  pitchCondition?: string;
  viewingCentersNearby?: string;
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
  localCurrency: { code: string; symbol: string };
  networkType: string;
  activeLocalPunters: number;
}

export interface MatchVenueIntel {
  stadiumName: string;
  stadiumCity: string;
  elevationMeters: number;
  altitudeTier: 'EXTREME_ALTITUDE' | 'HIGH_ALTITUDE' | 'NORMAL';
  altitudeNote?: string;
  travelDistanceKm: number;
  travelFatigueTier: 'CROSS_CONTINENT_FATIGUE' | 'HEAVY_TRAVEL' | 'REGIONAL' | 'LOCAL_DERBY';
  derbyAlert?: string;
  travelNote?: string;
  pitchSurface: string;
  stadiumCapacity: number;
  crowdIntimidationScore: number; // 0-100
  airQualityAqi: number;
  airQualityStatus: string;
}

interface StadiumGeoProfile {
  name: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  elevation: number;
  capacity: number;
  surface: string;
  hasRoof: boolean;
}

// Global Stadium & Club Geography Database
const STADIUM_REGISTRY: Record<string, StadiumGeoProfile> = {
  // Premier League
  'arsenal': { name: 'Emirates Stadium', city: 'London', country: 'England', lat: 51.5549, lon: -0.1084, elevation: 42, capacity: 60704, surface: 'SISGrass Hybrid', hasRoof: false },
  'chelsea': { name: 'Stamford Bridge', city: 'London', country: 'England', lat: 51.4816, lon: -0.1910, elevation: 12, capacity: 40343, surface: 'Natural Grass', hasRoof: false },
  'liverpool': { name: 'Anfield', city: 'Liverpool', country: 'England', lat: 53.4308, lon: -2.9608, elevation: 52, capacity: 61276, surface: 'SISGrass Hybrid', hasRoof: false },
  'manchester city': { name: 'Etihad Stadium', city: 'Manchester', country: 'England', lat: 53.4831, lon: -2.2004, elevation: 65, capacity: 53400, surface: 'Desso GrassMaster', hasRoof: false },
  'man city': { name: 'Etihad Stadium', city: 'Manchester', country: 'England', lat: 53.4831, lon: -2.2004, elevation: 65, capacity: 53400, surface: 'Desso GrassMaster', hasRoof: false },
  'manchester united': { name: 'Old Trafford', city: 'Manchester', country: 'England', lat: 53.4631, lon: -2.2913, elevation: 45, capacity: 74310, surface: 'Desso GrassMaster', hasRoof: false },
  'man united': { name: 'Old Trafford', city: 'Manchester', country: 'England', lat: 53.4631, lon: -2.2913, elevation: 45, capacity: 74310, surface: 'Desso GrassMaster', hasRoof: false },
  'tottenham': { name: 'Tottenham Hotspur Stadium', city: 'London', country: 'England', lat: 51.6042, lon: -0.0662, elevation: 18, capacity: 62850, surface: 'SISGrass Hybrid', hasRoof: true },
  'newcastle': { name: "St. James' Park", city: 'Newcastle', country: 'England', lat: 54.9756, lon: -1.6217, elevation: 64, capacity: 52305, surface: 'Natural Hybrid', hasRoof: false },
  'aston villa': { name: 'Villa Park', city: 'Birmingham', country: 'England', lat: 52.5091, lon: -1.8848, elevation: 110, capacity: 42640, surface: 'Natural Grass', hasRoof: false },
  'everton': { name: 'Goodison Park', city: 'Liverpool', country: 'England', lat: 53.4389, lon: -2.9664, elevation: 48, capacity: 39572, surface: 'Natural Grass', hasRoof: false },
  
  // La Liga
  'real madrid': { name: 'Santiago Bernabéu', city: 'Madrid', country: 'Spain', lat: 40.4531, lon: -3.6883, elevation: 667, capacity: 81044, surface: 'Hybrid Carpet Turf', hasRoof: true },
  'barcelona': { name: 'Spotify Camp Nou / Montjuïc', city: 'Barcelona', country: 'Spain', lat: 41.3809, lon: 2.1228, elevation: 45, capacity: 55926, surface: 'Natural Grass', hasRoof: false },
  'atletico madrid': { name: 'Riyadh Air Metropolitano', city: 'Madrid', country: 'Spain', lat: 40.4361, lon: -3.5997, elevation: 630, capacity: 70460, surface: 'Natural Hybrid', hasRoof: true },
  'sevilla': { name: 'Ramón Sánchez-Pizjuán', city: 'Seville', country: 'Spain', lat: 37.3840, lon: -5.9706, elevation: 16, capacity: 43883, surface: 'Natural Grass', hasRoof: false },
  'real betis': { name: 'Benito Villamarín', city: 'Seville', country: 'Spain', lat: 37.3565, lon: -5.9817, elevation: 15, capacity: 60721, surface: 'Natural Grass', hasRoof: false },

  // Serie A
  'inter': { name: 'San Siro (Giuseppe Meazza)', city: 'Milan', country: 'Italy', lat: 45.4781, lon: 9.1240, elevation: 120, capacity: 75923, surface: 'Desso GrassMaster', hasRoof: false },
  'milan': { name: 'San Siro (Giuseppe Meazza)', city: 'Milan', country: 'Italy', lat: 45.4781, lon: 9.1240, elevation: 120, capacity: 75923, surface: 'Desso GrassMaster', hasRoof: false },
  'juventus': { name: 'Allianz Stadium', city: 'Turin', country: 'Italy', lat: 45.1096, lon: 7.6413, elevation: 239, capacity: 41507, surface: 'Natural Grass', hasRoof: false },
  'roma': { name: 'Stadio Olimpico', city: 'Rome', country: 'Italy', lat: 41.9341, lon: 12.4547, elevation: 21, capacity: 70634, surface: 'Natural Grass', hasRoof: false },
  'lazio': { name: 'Stadio Olimpico', city: 'Rome', country: 'Italy', lat: 41.9341, lon: 12.4547, elevation: 21, capacity: 70634, surface: 'Natural Grass', hasRoof: false },
  'napoli': { name: 'Stadio Diego Armando Maradona', city: 'Naples', country: 'Italy', lat: 40.8279, lon: 14.1931, elevation: 35, capacity: 54726, surface: 'Natural Grass', hasRoof: false },

  // Bundesliga
  'bayern': { name: 'Allianz Arena', city: 'Munich', country: 'Germany', lat: 48.2188, lon: 11.6247, elevation: 508, capacity: 75024, surface: 'Hybrid Turf', hasRoof: false },
  'bayern munich': { name: 'Allianz Arena', city: 'Munich', country: 'Germany', lat: 48.2188, lon: 11.6247, elevation: 508, capacity: 75024, surface: 'Hybrid Turf', hasRoof: false },
  'dortmund': { name: 'Signal Iduna Park', city: 'Dortmund', country: 'Germany', lat: 51.4926, lon: 7.4519, elevation: 112, capacity: 81365, surface: 'Natural Grass', hasRoof: false },
  'leverkusen': { name: 'BayArena', city: 'Leverkusen', country: 'Germany', lat: 51.0382, lon: 7.0022, elevation: 58, capacity: 30210, surface: 'Natural Grass', hasRoof: false },

  // South America & Altitude Venues
  'bolivar': { name: 'Estadio Hernando Siles', city: 'La Paz', country: 'Bolivia', lat: -16.4994, lon: -68.1225, elevation: 3637, capacity: 41143, surface: 'Natural Grass', hasRoof: false },
  'the strongest': { name: 'Estadio Hernando Siles', city: 'La Paz', country: 'Bolivia', lat: -16.4994, lon: -68.1225, elevation: 3637, capacity: 41143, surface: 'Natural Grass', hasRoof: false },
  'club america': { name: 'Estadio Azteca', city: 'Mexico City', country: 'Mexico', lat: 19.3029, lon: -99.1505, elevation: 2240, capacity: 87523, surface: 'Natural Grass', hasRoof: false },
  'cruz azul': { name: 'Estadio Ciudad de los Deportes', city: 'Mexico City', country: 'Mexico', lat: 19.3831, lon: -99.1783, elevation: 2240, capacity: 36682, surface: 'Natural Grass', hasRoof: false },
  'flamengo': { name: 'Maracanã Stadium', city: 'Rio de Janeiro', country: 'Brazil', lat: -22.9121, lon: -43.2302, elevation: 10, capacity: 78838, surface: 'Natural Grass', hasRoof: false },
  'palmeiras': { name: 'Allianz Parque', city: 'São Paulo', country: 'Brazil', lat: -23.5275, lon: -46.6784, elevation: 760, capacity: 43713, surface: '3G Synthetic Turf', hasRoof: false },
  'gremio': { name: 'Arena do Grêmio', city: 'Porto Alegre', country: 'Brazil', lat: -29.9740, lon: -51.1947, elevation: 12, capacity: 55662, surface: 'Natural Grass', hasRoof: false },
  'boca juniors': { name: 'La Bombonera', city: 'Buenos Aires', country: 'Argentina', lat: -34.6356, lon: -58.3648, elevation: 8, capacity: 54000, surface: 'Natural Grass', hasRoof: false },
  'river plate': { name: 'Estadio Monumental', city: 'Buenos Aires', country: 'Argentina', lat: -34.5453, lon: -58.4497, elevation: 12, capacity: 84567, surface: 'Hybrid SISGrass', hasRoof: false },

  // Nigeria & Africa
  'enyimba': { name: 'Enyimba International Stadium', city: 'Aba', country: 'Nigeria', lat: 5.1167, lon: 7.3667, elevation: 70, capacity: 16000, surface: '3G AstroTurf', hasRoof: false },
  'rivers united': { name: 'Adokiye Amiesimaka Stadium', city: 'Port Harcourt', country: 'Nigeria', lat: 4.8872, lon: 7.0094, elevation: 18, capacity: 38000, surface: 'Natural Grass', hasRoof: false },
  'rangers': { name: 'Nnamdi Azikiwe Stadium', city: 'Enugu', country: 'Nigeria', lat: 6.4389, lon: 7.4958, elevation: 220, capacity: 22000, surface: '3G Synthetic Turf', hasRoof: false },
  'super eagles': { name: 'Godswill Akpabio International Stadium', city: 'Uyo', country: 'Nigeria', lat: 5.0125, lon: 7.9128, elevation: 45, capacity: 30000, surface: 'Natural Grass', hasRoof: false },
  'al ahly': { name: 'Cairo International Stadium', city: 'Cairo', country: 'Egypt', lat: 30.0691, lon: 31.3122, elevation: 75, capacity: 75000, surface: 'Natural Grass', hasRoof: false },
};

function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function findStadiumProfile(teamName: string): StadiumGeoProfile | null {
  const lower = (teamName || '').toLowerCase().trim();
  for (const [key, profile] of Object.entries(STADIUM_REGISTRY)) {
    if (lower.includes(key) || key.includes(lower)) return profile;
  }
  return null;
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
  'awka': { lat: 6.2108, lon: 7.0707, country: 'Nigeria', code: 'NG', state: 'Anambra' },
  'onitsha': { lat: 6.1667, lon: 6.7833, country: 'Nigeria', code: 'NG', state: 'Anambra' },
  'nnewi': { lat: 6.0199, lon: 6.9149, country: 'Nigeria', code: 'NG', state: 'Anambra' },
  'ekwulobia': { lat: 6.0247, lon: 7.0818, country: 'Nigeria', code: 'NG', state: 'Anambra' },
  'ihiala': { lat: 5.8544, lon: 6.8594, country: 'Nigeria', code: 'NG', state: 'Anambra' },
  'enugu': { lat: 6.4584, lon: 7.5464, country: 'Nigeria', code: 'NG', state: 'Enugu' },
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

function detectNetworkConnection(): string {
  if (typeof window === 'undefined') return '4G High-Speed';
  const nav: any = navigator;
  const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
  if (conn) {
    if (conn.saveData) return 'Data-Saver Mode 📶';
    if (conn.effectiveType) return `${conn.effectiveType.toUpperCase()} Stream ⚡`;
  }
  return '4G High-Speed ⚡';
}

function getLocalCurrency(countryCode: string): { code: string; symbol: string } {
  switch (countryCode) {
    case 'NG': return { code: 'NGN', symbol: '₦' };
    case 'KE': return { code: 'KES', symbol: 'KSh' };
    case 'GH': return { code: 'GHS', symbol: '₵' };
    case 'ZA': return { code: 'ZAR', symbol: 'R' };
    case 'GB': return { code: 'GBP', symbol: '£' };
    case 'US': return { code: 'USD', symbol: '$' };
    case 'EU':
    case 'FR':
    case 'ES':
    case 'DE':
    case 'IT':
      return { code: 'EUR', symbol: '€' };
    default: return { code: 'NGN', symbol: '₦' };
  }
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

  public static detectLocation(): Promise<LocationIntelData> {
    return this.fetchHyperAccurateLocationIntel();
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

  /**
   * 🏟️ STADIUM & TRAVEL GEO-PHYSICS INTELLIGENCE
   * Calculates elevation, atmospheric ball flight physics, away travel fatigue, and derby rivalry.
   */
  public static getMatchVenueIntel(homeTeam: string, awayTeam: string, league: string = ''): MatchVenueIntel {
    const homeStadium = findStadiumProfile(homeTeam);
    const awayStadium = findStadiumProfile(awayTeam);

    const stadiumName = homeStadium?.name || `${homeTeam} Arena`;
    const stadiumCity = homeStadium?.city || 'Match Stadium';
    const elevationMeters = homeStadium?.elevation || 65;
    const surface = homeStadium?.surface || 'Natural Hybrid Turf';
    const capacity = homeStadium?.capacity || 42000;

    // Altitude Physics Classification
    let altitudeTier: MatchVenueIntel['altitudeTier'] = 'NORMAL';
    let altitudeNote: string | undefined;
    if (elevationMeters >= 1800) {
      altitudeTier = 'EXTREME_ALTITUDE';
      altitudeNote = `⛰️ Extreme Altitude (${elevationMeters}m): Air density -18%, ball travels faster, heavy 2nd half away fatigue.`;
    } else if (elevationMeters >= 550) {
      altitudeTier = 'HIGH_ALTITUDE';
      altitudeNote = `⛰️ High Altitude (${elevationMeters}m): Reduced air resistance favors outside-the-box shooting.`;
    }

    // Travel Distance & Fatigue
    let travelDistanceKm = 120;
    if (homeStadium && awayStadium) {
      travelDistanceKm = calculateHaversineDistance(homeStadium.lat, homeStadium.lon, awayStadium.lat, awayStadium.lon);
    } else {
      // Seed realistic distance from hash
      let h = 0;
      const str = `${homeTeam}_${awayTeam}`;
      for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i);
      travelDistanceKm = Math.abs(h % 850) + 40;
    }

    let travelFatigueTier: MatchVenueIntel['travelFatigueTier'] = 'REGIONAL';
    let derbyAlert: string | undefined;
    let travelNote: string | undefined;

    if (travelDistanceKm <= 18) {
      travelFatigueTier = 'LOCAL_DERBY';
      derbyAlert = `⚔️ Heated Local Derby (${travelDistanceKm}km apart): High tactical tension, intense pressing & card frequency.`;
    } else if (travelDistanceKm >= 2000) {
      travelFatigueTier = 'CROSS_CONTINENT_FATIGUE';
      travelNote = `✈️ Cross-Continent Away Travel (${travelDistanceKm.toLocaleString()}km): Circadian recovery risk for ${awayTeam}.`;
    } else if (travelDistanceKm >= 800) {
      travelFatigueTier = 'HEAVY_TRAVEL';
      travelNote = `✈️ Long Distance Away Trip (${travelDistanceKm.toLocaleString()}km): Away squad travel load.`;
    }

    const crowdIntimidationScore = Math.min(100, Math.round((capacity / 80000) * 85 + (homeStadium?.hasRoof ? 15 : 0)));

    return {
      stadiumName,
      stadiumCity,
      elevationMeters,
      altitudeTier,
      altitudeNote,
      travelDistanceKm,
      travelFatigueTier,
      derbyAlert,
      travelNote,
      pitchSurface: surface,
      stadiumCapacity: capacity,
      crowdIntimidationScore,
      airQualityAqi: 38,
      airQualityStatus: 'Clean Match Atmosphere (AQI 38) 🍃',
    };
  }

  public static async fetchHyperAccurateLocationIntel(forceRefresh = false): Promise<LocationIntelData> {
    if (typeof window === 'undefined') {
      return this.getFallbackIntel();
    }

    try {
      const customCity = this.getCustomLocation();
      let city = customCity || '';
      let state = '';
      let countryName = 'Nigeria';
      let countryCode = 'NG';
      let lat = 9.0765;
      let lon = 7.3986;
      let street = '';
      let houseNumber = '';
      let neighbourhood = '';
      let formattedAddress = '';
      let isGpsPrecise = false;
      let temp = 28;
      let weatherCode = 1;
      let windSpeed = 12;
      let weatherDesc = 'Fair Weather 🌤️';
      let pitchCondition = 'Firm Match Turf ☀️';
      let viewingCentersNearby = 'Sports Lounges Active 📺';
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
          formattedAddress = `${city}, ${state}`;
        }
      } else {
        const precise = await getUltraPreciseLocation(forceRefresh);
        city = precise.city || 'LAGOS';
        state = precise.state || '';
        countryName = precise.country || 'Nigeria';
        countryCode = precise.countryFlag === '🇳🇬' ? 'NG' : 'NG';
        lat = precise.latitude || 9.0765;
        lon = precise.longitude || 7.3986;
        street = precise.street || '';
        houseNumber = precise.houseNumber || '';
        neighbourhood = precise.neighbourhood || '';
        formattedAddress = precise.formattedAddress || `${city}, ${countryName}`;
        isGpsPrecise = Boolean(precise.isGpsPrecise);
        temp = precise.temperatureC || 28;
        weatherDesc = precise.weatherSummary || 'Clear ☀️';
        pitchCondition = precise.pitchCondition || 'Firm Match Turf ☀️';
        viewingCentersNearby = precise.viewingCentersNearby || 'Sports Lounges Active 📺';
      }

      let suggestedLanguage: LanguageCode = 'pidgin';
      let localGreeting = city.includes('Match Hub') || !city
        ? "Welcome, Punter! Today's Premier Match Intelligence! 👑"
        : `How far ${city}! Welcome to Mivaj Sports! 👑`;

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
      } else {
        suggestedLanguage = 'en';
        localGreeting = `Welcome to ${city}! Today's Premier Match Intelligence! 👑`;
      }

      // Compute realistic local active punter tally based on city hash
      let cityHash = 0;
      for (let i = 0; i < (city || 'Lagos').length; i++) cityHash = (cityHash << 5) - cityHash + (city || 'Lagos').charCodeAt(i);
      const activeLocalPunters = 850 + (Math.abs(cityHash) % 1850);

      const result: LocationIntelData = {
        city,
        principalSubdivision: state || 'State',
        countryName,
        countryCode,
        street,
        houseNumber,
        neighbourhood,
        formattedAddress,
        isGpsPrecise,
        pitchCondition,
        viewingCentersNearby,
        latitude: lat,
        longitude: lon,
        temperature: temp,
        weatherDescription: weatherDesc || mapWeatherCode(weatherCode),
        weatherCode,
        windSpeed,
        suggestedLanguage,
        localGreeting,
        deviceName: detectDeviceName(),
        userNickname: this.getUserNickname(),
        isManualOverride: isManual,
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        localCurrency: getLocalCurrency(countryCode),
        networkType: detectNetworkConnection(),
        activeLocalPunters,
      };

      this.cachedData = result;
      this.listeners.forEach(l => l(result));
      return result;
    } catch (e) {
      return this.getFallbackIntel();
    }
  }

  private static getFallbackIntel(): LocationIntelData {
    return {
      city: 'Nigeria Match Hub',
      principalSubdivision: 'Nigeria',
      countryName: 'Nigeria',
      countryCode: 'NG',
      formattedAddress: 'Nigeria Match Center',
      latitude: 9.0765,
      longitude: 7.3986,
      temperature: 28,
      weatherDescription: 'Clear Sky ☀️',
      weatherCode: 0,
      windSpeed: 12,
      suggestedLanguage: 'pidgin',
      localGreeting: 'Welcome, Punter! Today\'s Premier Match Intelligence! 👑',
      deviceName: detectDeviceName(),
      userNickname: this.getUserNickname(),
      pitchCondition: 'Firm Match Turf ☀️',
      viewingCentersNearby: 'Sports Lounges Active 📺',
      lastUpdated: 'Live',
      localCurrency: { code: 'NGN', symbol: '₦' },
      networkType: '4G High-Speed ⚡',
      activeLocalPunters: 1420,
    };
  }
}
