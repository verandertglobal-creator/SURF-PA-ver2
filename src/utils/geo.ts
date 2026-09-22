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

export interface WaveHeightDetails {
  backMeters: string;
  backFeet: string;
  faceMeters: string;
  faceFeet: string;
  bodyScale: string;
  shoalingFactor: number;
}

/**
 * Calculates breaking wave face height from deepwater swell height (back of wave)
 * based on period shoaling physics.
 * Traditional South African / Hawaiian scale measures the BACK of the wave (~50-65% of face).
 */
export function getWaveHeightDetails(swellMeters: number, period: number = 10): WaveHeightDetails {
  const backM = Math.max(0.1, swellMeters);
  const backFt = backM * 3.28084;

  // Shoaling physics: longer period swells refract and stand up significantly taller on shallow banks/reefs
  let shoalingFactor = 1.25;
  if (period >= 15) shoalingFactor = 1.65;
  else if (period >= 13) shoalingFactor = 1.5;
  else if (period >= 11) shoalingFactor = 1.35;
  else if (period >= 9) shoalingFactor = 1.2;
  else shoalingFactor = 1.1; // Short windchop swells barely stand up

  const faceM = backM * shoalingFactor;
  const faceFt = faceM * 3.28084;

  let bodyScale = 'Waist to Chest';
  if (faceM < 0.6) bodyScale = 'Ankle to Knee';
  else if (faceM < 0.9) bodyScale = 'Knee to Waist';
  else if (faceM < 1.3) bodyScale = 'Waist to Chest';
  else if (faceM < 1.7) bodyScale = 'Chest to Head high';
  else if (faceM < 2.2) bodyScale = 'Head high to Overhead';
  else if (faceM < 2.8) bodyScale = 'Overhead (1–2ft overhead)';
  else if (faceM < 3.6) bodyScale = 'Double Overhead';
  else bodyScale = 'Triple Overhead+';

  return {
    backMeters: `${backM.toFixed(1)}m`,
    backFeet: `${backFt.toFixed(1)}ft`,
    faceMeters: `${faceM.toFixed(1)}m`,
    faceFeet: `${faceFt.toFixed(1)}ft`,
    bodyScale,
    shoalingFactor
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

export function classifyWindState(
  windDir: number,
  windSpeed: number,
  offshoreAngle: number
): 'Offshore (Clean)' | 'Glassy' | 'Cross-offshore' | 'Cross-shore' | 'Onshore (Choppy)' | 'Blown Out / Crap' {
  if (windSpeed <= 7) {
    return 'Glassy';
  }
  const diff = angleDifference(windDir, offshoreAngle);
  if (diff <= 45) {
    return 'Offshore (Clean)';
  }
  if (diff <= 75) {
    return 'Cross-offshore';
  }
  if (diff <= 105) {
    return windSpeed > 20 ? 'Blown Out / Crap' : 'Cross-shore';
  }
  // True Onshore
  return windSpeed > 16 ? 'Blown Out / Crap' : 'Onshore (Choppy)';
}

export function calculateConditionScore(spot: SurfSpot, condition: MarineCondition, discipline: SportDiscipline): number {
  const [idealWindMin, idealWindMax, idealHeight] = spot.ideal[discipline];
  const offshoreAngle = spot.offshoreWindDir ?? ((spot.coastFacing != null ? spot.coastFacing + 180 : 70) % 360);
  const windState = condition.windState || classifyWindState(condition.windDir, condition.windSpeed, offshoreAngle);

  if (discipline === 'kite') {
    // Kite surfing thrives in 18-32 km/h side/cross wind
    const speedRatio = condition.windSpeed >= 18 && condition.windSpeed <= 34 ? 1.0 : condition.windSpeed < 14 ? 0.3 : 0.7;
    const diffFromOffshore = angleDifference(condition.windDir, offshoreAngle);
    // Kiting hates offshore (blown out to sea), loves side-shore / cross-onshore (diff between 70 and 140)
    const kiteWindAngleScore = diffFromOffshore >= 65 && diffFromOffshore <= 145 ? 1.0 : diffFromOffshore < 45 ? 0.2 : 0.6;
    const kiteScore = speedRatio * 0.6 + kiteWindAngleScore * 0.4;
    return Math.min(10, Math.max(1.0, +(kiteScore * 10).toFixed(1)));
  }

  // Surf & Bodyboard:
  let windQuality = 0.5;
  if (windState === 'Glassy') {
    windQuality = 1.0;
  } else if (windState === 'Offshore (Clean)') {
    if (condition.windSpeed <= 20) windQuality = 1.0;
    else if (condition.windSpeed <= 28) windQuality = 0.8;
    else windQuality = 0.5; // howling offshore blows surfers off the back
  } else if (windState === 'Cross-offshore') {
    windQuality = condition.windSpeed <= 15 ? 0.75 : Math.max(0.25, 0.75 - ((condition.windSpeed - 15) / 20));
  } else if (windState === 'Cross-shore') {
    windQuality = condition.windSpeed <= 12 ? 0.5 : Math.max(0.1, 0.45 - ((condition.windSpeed - 12) / 15));
  } else if (windState === 'Onshore (Choppy)') {
    windQuality = condition.windSpeed <= 12 ? 0.35 : 0.2;
  } else {
    // Blown Out / Crap
    windQuality = 0.05;
  }

  // Swell Period Factor:
  const minPeriod = spot.minPeriod ?? 10.5;
  let periodScore = 0.5;
  if (condition.swellPeriod >= 14) periodScore = 1.0;
  else if (condition.swellPeriod >= 12) periodScore = 0.85;
  else if (condition.swellPeriod >= minPeriod) periodScore = 0.70;
  else if (condition.swellPeriod >= 8.5) periodScore = 0.35; // short period wind chop!
  else periodScore = 0.15; // gutless closeouts

  // Swell Height Factor:
  const heightDiff = Math.abs(condition.swellHeight - idealHeight);
  let heightScore = Math.max(0.2, 1 - heightDiff / 1.8);
  if (condition.swellHeight < 0.65) heightScore = 0.2; // ankle biters

  let raw = windQuality * 0.55 + periodScore * 0.25 + heightScore * 0.20;

  // Realism penalties:
  if (windState === 'Blown Out / Crap') {
    raw = Math.min(raw, 0.24); // max 2.4/10
  } else if (windState === 'Onshore (Choppy)' && condition.windSpeed > 14) {
    raw = Math.min(raw, 0.35); // max 3.5/10
  } else if (condition.swellPeriod < 9 && condition.windSpeed > 15) {
    raw = Math.min(raw, 0.30); // gutless onshore slop
  }

  const score = Math.min(10, Math.max(1.0, +(raw * 10).toFixed(1)));
  return score;
}

export function getScoreLabel(score: number): { label: string; color: string; badge: string } {
  if (score >= 8.0) return { label: 'Firing / Epic', color: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
  if (score >= 6.5) return { label: 'Good Waves', color: 'text-teal-400', badge: 'bg-teal-500/20 text-teal-300 border-teal-500/40' };
  if (score >= 4.8) return { label: 'Fair / Fun', color: 'text-sky-400', badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40' };
  if (score >= 3.2) return { label: 'Choppy / Sloppy', color: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
  return { label: 'Blown Out / Crap', color: 'text-rose-400', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
}

// In-memory cache for Open-Meteo responses to prevent rate-limiting
const forecastCache: Record<string, { timestamp: number; data: MarineCondition }> = {};
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 mins

export async function fetchSpotMarineCondition(spot: SurfSpot): Promise<MarineCondition> {
  const cacheKey = `${spot.id}-${spot.lat.toFixed(3)},${spot.lng.toFixed(3)}`;
  const now = Date.now();

  if (forecastCache[cacheKey] && now - forecastCache[cacheKey].timestamp < CACHE_TTL_MS) {
    return forecastCache[cacheKey].data;
  }

  // Realistic regional fallback
  const isWestCoast = spot.region === 'West Coast' || spot.region === 'Table Bay';
  const isKzn = spot.region === 'KwaZulu-Natal';
  const offshoreAngle = spot.offshoreWindDir ?? ((spot.coastFacing != null ? spot.coastFacing + 180 : 70) % 360);
  const fallbackWindDir = isWestCoast ? 70 : isKzn ? 275 : 290;
  const fallbackWindSpeed = 12;
  const spotExposure = spot.swellExposure ?? 0.85;

  const regionalDefault: MarineCondition = {
    swellHeight: Number(((isWestCoast ? 1.6 : isKzn ? 1.4 : 1.8) * spotExposure).toFixed(1)),
    swellPeriod: 11,
    swellDir: isWestCoast ? 225 : isKzn ? 165 : 210,
    waveHeight: Number(((isWestCoast ? 1.7 : 1.5) * spotExposure).toFixed(1)),
    windWaveHeight: 0.3,
    windSpeed: fallbackWindSpeed,
    windDir: fallbackWindDir,
    windState: classifyWindState(fallbackWindDir, fallbackWindSpeed, offshoreAngle),
    tide: 0.8,
    tideTrend: 'Rising',
    waterTemp: isWestCoast ? 13 : isKzn ? 23 : 17,
    airTemp: 21,
    timestamp: new Date().toISOString()
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${spot.lat}&longitude=${spot.lng}&current=wave_height,wave_period,wave_direction,wind_wave_height,swell_wave_height,swell_wave_direction,swell_wave_period,sea_level_height_msl&hourly=wave_height,swell_wave_height,swell_wave_period,wind_wave_height,sea_level_height_msl&forecast_days=2`;
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${spot.lat}&longitude=${spot.lng}&current=wind_speed_10m,wind_direction_10m,wind_gusts_10m,temperature_2m&hourly=wind_speed_10m,wind_direction_10m,wind_gusts_10m&forecast_days=2`;

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

    const currentWindSpeed = Math.round(weatherData.current?.wind_speed_10m ?? regionalDefault.windSpeed);
    const currentWindDir = Math.round(weatherData.current?.wind_direction_10m ?? regionalDefault.windDir);
    const currentWindGusts = Math.round(weatherData.current?.wind_gusts_10m ?? currentWindSpeed);
    // Apply spot-specific swell exposure (sheltering and headland shadow attenuation)
    const rawSwellHeight = Number((marineData.current?.swell_wave_height ?? regionalDefault.swellHeight).toFixed(2));
    const currentSwellHeight = Number(Math.max(0.2, rawSwellHeight * spotExposure).toFixed(1));
    const rawWaveHeight = Number((marineData.current?.wave_height ?? rawSwellHeight).toFixed(2));
    const currentWaveHeight = Number(Math.max(0.2, rawWaveHeight * spotExposure).toFixed(1));
    const currentSwellPeriod = Math.round(marineData.current?.swell_wave_period ?? regionalDefault.swellPeriod);
    const currentSwellDir = Math.round(marineData.current?.swell_wave_direction ?? regionalDefault.swellDir);
    const currentWindWaveHeight = Number((marineData.current?.wind_wave_height ?? 0.2).toFixed(1));

    const currentWindState = classifyWindState(currentWindDir, currentWindSpeed, offshoreAngle);

    // Build 24-hour timeline from hourly data starting around current time
    const hourlyForecast = [];
    const hourlyTimes = marineData.hourly?.time || [];
    const currentHourStr = new Date().toISOString().slice(0, 13); // e.g. 2026-09-22T14
    let startIdx = hourlyTimes.findIndex((t: string) => t.startsWith(currentHourStr));
    if (startIdx === -1) startIdx = 0;

    // Take next 24 hourly points
    const maxPoints = Math.min(startIdx + 24, hourlyTimes.length);
    for (let i = startIdx; i < maxPoints; i++) {
      const timeStr = hourlyTimes[i];
      const hourDate = new Date(timeStr);
      const hourVal = hourDate.getHours();
      const hourLabel = `${hourVal < 10 ? '0' : ''}${hourVal}:00`;

      const rawHWave = Number((marineData.hourly?.wave_height?.[i] ?? rawWaveHeight).toFixed(2));
      const hWaveHeight = Number(Math.max(0.2, rawHWave * spotExposure).toFixed(1));

      const rawHSwell = Number((marineData.hourly?.swell_wave_height?.[i] ?? rawSwellHeight).toFixed(2));
      const hSwellHeight = Number(Math.max(0.2, rawHSwell * spotExposure).toFixed(1));

      const hPeriod = Math.round(marineData.hourly?.swell_wave_period?.[i] ?? currentSwellPeriod);
      const hWindSpeed = Math.round(weatherData.hourly?.wind_speed_10m?.[i] ?? currentWindSpeed);
      const hWindDir = Math.round(weatherData.hourly?.wind_direction_10m?.[i] ?? currentWindDir);
      const hTide = marineData.hourly?.sea_level_height_msl?.[i] != null
        ? Number(marineData.hourly.sea_level_height_msl[i].toFixed(1))
        : null;

      const hWindState = classifyWindState(hWindDir, hWindSpeed, offshoreAngle);
      const hCondition: MarineCondition = {
        swellHeight: hSwellHeight,
        swellPeriod: hPeriod,
        swellDir: currentSwellDir,
        waveHeight: hWaveHeight,
        windSpeed: hWindSpeed,
        windDir: hWindDir,
        windState: hWindState,
        tide: hTide,
        tideTrend: 'Stable'
      };
      const hScore = calculateConditionScore(spot, hCondition, 'surf');

      hourlyForecast.push({
        time: timeStr,
        hour: hourVal,
        label: hourLabel,
        waveHeight: hWaveHeight,
        swellHeight: hSwellHeight,
        period: hPeriod,
        windSpeed: hWindSpeed,
        windDir: hWindDir,
        windCompass: degreesToCompass(hWindDir),
        windState: hWindState,
        score: hScore,
        tide: hTide
      });
    }

    const condition: MarineCondition = {
      swellHeight: currentSwellHeight,
      swellPeriod: currentSwellPeriod,
      swellDir: currentSwellDir,
      waveHeight: currentWaveHeight,
      windWaveHeight: currentWindWaveHeight,
      windSpeed: currentWindSpeed,
      windDir: currentWindDir,
      windGusts: currentWindGusts,
      windState: currentWindState,
      airTemp: Math.round(weatherData.current?.temperature_2m ?? 20),
      waterTemp: regionalDefault.waterTemp,
      tide: tideLevel != null ? Number(tideLevel.toFixed(1)) : null,
      tideTrend: trend,
      timestamp: new Date().toISOString(),
      hourlyForecast
    };

    forecastCache[cacheKey] = { timestamp: now, data: condition };
    return condition;
  } catch {
    forecastCache[cacheKey] = { timestamp: now, data: regionalDefault };
    return regionalDefault;
  }
}
