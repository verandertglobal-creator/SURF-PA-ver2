import { SurfSpot, MarineCondition, SportDiscipline } from '../types';

export const DEFAULT_SOUTH_AFRICA_ORIGIN = {
  lat: -33.3411,
  lng: 18.1611,
  label: 'Yzerfontein, West Coast'
};

export const POPULAR_SA_HUBS = [
  { label: 'Yzerfontein (West Coast)', lat: -33.3411, lng: 18.1611 },
  { label: 'Cape Town (Surfers Corner)', lat: -34.1081, lng: 18.4721 },
  { label: 'Jeffreys Bay (Supertubes)', lat: -34.035, lng: 24.93 },
  { label: 'Garden Route (Vic Bay)', lat: -33.987, lng: 22.548 },
  { label: 'Durban (New Pier)', lat: -29.8521, lng: 31.041 },
  { label: 'Elands Bay (Baboon Point)', lat: -32.315, lng: 18.325 }
];

export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const p = Math.PI / 180;
  const dLat = (lat2 - lat1) * p;
  const dLon = (lon2 - lon1) * p;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * p) * Math.cos(lat2 * p) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

export function metersToFeet(meters: number): number {
  return Number((meters * 3.28084).toFixed(1));
}

export function formatWaveHeight(meters: number): { meters: string; feet: string; combined: string } {
  const m = meters.toFixed(1);
  const ft = (meters * 3.28084).toFixed(1);
  return {
    meters: `${m}m`,
    feet: `${ft}ft`,
    combined: `${m}m (${ft}ft)`
  };
}

export function degreesToCompass(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

export function angleDifference(a: number, b: number): number {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
}

export function calculateConditionScore(spot: SurfSpot, condition: MarineCondition, discipline: SportDiscipline): number {
  const [idealWindMin, idealWindMax, idealHeight, idealWindSpeed] = spot.ideal[discipline];

  // Wind direction score: is current wind in the ideal range?
  const windMid = (idealWindMin + idealWindMax) / 2;
  const windAngleDiff = angleDifference(condition.windDir, windMid);
  const windScore = Math.max(0, 1 - windAngleDiff / 140);

  // Swell direction alignment
  const idealSwellDir = (idealWindMin + 90) % 360; // rough ocean alignment
  const swellAngleDiff = angleDifference(condition.swellDir, idealSwellDir);
  const swellDirScore = Math.max(0, 1 - swellAngleDiff / 150);

  // Swell height score
  const heightRatio = Math.max(0, 1 - Math.abs(idealHeight - condition.swellHeight) / 2.2);

  // Wind speed score
  const windSpeedRatio = Math.max(0, 1 - Math.abs(idealWindSpeed - condition.windSpeed) / 25);

  let raw = 0;
  if (discipline === 'kite') {
    // For kite, strong wind is preferred
    raw = windSpeedRatio * 0.45 + windScore * 0.35 + heightRatio * 0.2;
  } else {
    // For surf and bodyboard, offshore / light wind and good swell are king
    raw = windScore * 0.4 + heightRatio * 0.3 + swellDirScore * 0.2 + windSpeedRatio * 0.1;
  }

  const scoreOutOf10 = +(raw * 10).toFixed(1);
  return Math.min(10, Math.max(1.0, scoreOutOf10));
}

export function getScoreLabel(score: number): { label: string; color: string; badge: string } {
  if (score >= 8.2) return { label: 'Firing / Epic', color: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
  if (score >= 6.8) return { label: 'Good Waves', color: 'text-teal-400', badge: 'bg-teal-500/20 text-teal-300 border-teal-500/40' };
  if (score >= 5.0) return { label: 'Fair / Fun', color: 'text-sky-400', badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40' };
  if (score >= 3.5) return { label: 'Choppy', color: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
  return { label: 'Blown Out', color: 'text-rose-400', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
}

// In-memory cache for Open-Meteo responses to prevent rate-limiting
const forecastCache: Record<string, { timestamp: number; data: MarineCondition }> = {};
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 mins

export async function fetchSpotMarineCondition(spot: SurfSpot): Promise<MarineCondition> {
  const cacheKey = `${spot.lat.toFixed(3)},${spot.lng.toFixed(3)}`;
  const now = Date.now();

  if (forecastCache[cacheKey] && now - forecastCache[cacheKey].timestamp < CACHE_TTL_MS) {
    return forecastCache[cacheKey].data;
  }

  // Realistic regional fallback
  const isWestCoast = spot.region === 'West Coast' || spot.region === 'Table Bay';
  const isKzn = spot.region === 'KwaZulu-Natal';
  const regionalDefault: MarineCondition = {
    swellHeight: isWestCoast ? 1.8 : isKzn ? 1.4 : 1.9,
    swellPeriod: 12,
    swellDir: isWestCoast ? 225 : isKzn ? 165 : 210,
    windSpeed: 14,
    windDir: isWestCoast ? 135 : isKzn ? 220 : 270,
    tide: 0.8,
    tideTrend: 'Rising',
    waterTemp: isWestCoast ? 13 : isKzn ? 23 : 17,
    airTemp: 21,
    timestamp: new Date().toISOString()
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${spot.lat}&longitude=${spot.lng}&current=swell_wave_height,swell_wave_direction,swell_wave_period,sea_level_height_msl&hourly=sea_level_height_msl&forecast_days=1`;
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${spot.lat}&longitude=${spot.lng}&current=wind_speed_10m,wind_direction_10m,temperature_2m`;

    const [marineRes, weatherRes] = await Promise.all([
      fetch(marineUrl, { signal: controller.signal }),
      fetch(weatherUrl, { signal: controller.signal })
    ]);

    clearTimeout(timeoutId);

    if (!marineRes.ok || !weatherRes.ok) {
      forecastCache[cacheKey] = { timestamp: now, data: regionalDefault };
      return regionalDefault;
    }

    const marineData = await marineRes.json();
    const weatherData = await weatherRes.json();

    const tideLevel = marineData.current?.sea_level_height_msl ?? null;
    const hourlyTides = (marineData.hourly?.sea_level_height_msl || []).filter((v: number | null) => v != null);
    let trend: 'Rising' | 'Falling' | 'Stable' = 'Stable';

    if (hourlyTides.length >= 2 && tideLevel != null) {
      const idx = hourlyTides.findIndex((v: number) => Math.abs(v - tideLevel) < 0.05);
      const nextIdx = Math.min(idx + 1, hourlyTides.length - 1);
      if (nextIdx > idx) {
        trend = hourlyTides[nextIdx] > tideLevel ? 'Rising' : hourlyTides[nextIdx] < tideLevel ? 'Falling' : 'Stable';
      }
    }

    const condition: MarineCondition = {
      swellHeight: Number((marineData.current?.swell_wave_height ?? regionalDefault.swellHeight).toFixed(1)),
      swellPeriod: Math.round(marineData.current?.swell_wave_period ?? regionalDefault.swellPeriod),
      swellDir: Math.round(marineData.current?.swell_wave_direction ?? regionalDefault.swellDir),
      windSpeed: Math.round(weatherData.current?.wind_speed_10m ?? regionalDefault.windSpeed),
      windDir: Math.round(weatherData.current?.wind_direction_10m ?? regionalDefault.windDir),
      airTemp: Math.round(weatherData.current?.temperature_2m ?? 20),
      waterTemp: regionalDefault.waterTemp,
      tide: tideLevel != null ? Number(tideLevel.toFixed(1)) : null,
      tideTrend: trend,
      timestamp: new Date().toISOString()
    };

    forecastCache[cacheKey] = { timestamp: now, data: condition };
    return condition;
  } catch {
    forecastCache[cacheKey] = { timestamp: now, data: regionalDefault };
    return regionalDefault;
  }
}
