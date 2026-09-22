export type SportDiscipline = 'surf' | 'bodyboard' | 'kite';

export type SpotDifficulty = 'Beginner' | 'Beginner–Intermediate' | 'Intermediate' | 'Advanced' | 'Expert';

export type BreakType = 'Beachbreak' | 'Point break' | 'Point left' | 'Reef' | 'Reef left' | 'Right point' | 'Pier sandbar' | 'Slab wedge' | 'Big-wave reef';

export type RegionKey = 'West Coast' | 'Table Bay' | 'Cape Peninsula' | 'False Bay' | 'Overberg' | 'Garden Route' | 'Eastern Cape' | 'Wild Coast' | 'KwaZulu-Natal';

export interface IdealConditions {
  // [idealWindDirMin, idealWindDirMax, idealSwellHeightM, idealWindSpeedKmh]
  surf: [number, number, number, number];
  bodyboard: [number, number, number, number];
  kite: [number, number, number, number];
}

export interface SurfSpot {
  id: string;
  name: string;
  town: string;
  region: RegionKey;
  lat: number;
  lng: number;
  coastFacing?: number; // Seaward facing angle in degrees (e.g. 250° WSW for Yzerfontein)
  offshoreWindDir?: number; // True pure offshore angle (e.g. 70° ENE)
  minPeriod?: number; // Minimum period (s) required to avoid weak closing out chop
  swellExposure?: number; // Spot wave height transmission ratio (e.g. 0.45 for sheltered Yzerfontein bay, 0.95 for exposed open coast)
  type: BreakType;
  difficulty: SpotDifficulty;
  hazards: string;
  ideal: IdealConditions;
  writeup: string;
  webcamAvailable?: boolean;
  sharkSpotters?: boolean;
  bestTide?: 'Low' | 'Mid' | 'High' | 'All tides';
  dist?: number;
  rating?: number;
}

export interface HourlyForecastItem {
  time: string;
  hour: number;
  label: string;
  waveHeight: number;
  swellHeight: number;
  period: number;
  windSpeed: number;
  windDir: number;
  windCompass: string;
  windState: 'Offshore (Clean)' | 'Glassy' | 'Cross-offshore' | 'Cross-shore' | 'Onshore (Choppy)' | 'Blown Out / Crap';
  score: number;
  tide: number | null;
}

export interface MarineCondition {
  swellHeight: number;
  swellPeriod: number;
  swellDir: number;
  waveHeight?: number;
  windWaveHeight?: number;
  windSpeed: number;
  windDir: number;
  windGusts?: number;
  windState?: 'Offshore (Clean)' | 'Glassy' | 'Cross-offshore' | 'Cross-shore' | 'Onshore (Choppy)' | 'Blown Out / Crap';
  tide: number | null;
  tideTrend: 'Rising' | 'Falling' | 'Stable';
  airTemp?: number;
  waterTemp?: number;
  timestamp?: string;
  hourlyForecast?: HourlyForecastItem[];
}

export type SponsorTier = 'gold' | 'silver' | 'bronze';

export type VenueCategory = 'stay' | 'eat' | 'shop' | 'drinks';

export interface Venue {
  id: string;
  name: string;
  category: VenueCategory;
  town: string;
  region: RegionKey;
  lat: number;
  lng: number;
  address: string;
  phone: string;
  whatsapp?: string;
  website?: string;
  description: string;
  image: string;
  rating: number;
  reviewsCount: number;
  priceRange: 'R' | 'RR' | 'RRR';
  features: string[];
  sponsorTier?: SponsorTier;
  sponsorTagline?: string;
  discountCode?: string;
  discountPercentage?: number;
  bookable: boolean;
  bookingType?: 'room' | 'table' | 'gear' | 'lesson';
  dist?: number;
}

export interface BusinessSponsorPlan {
  tier: SponsorTier;
  title: string;
  priceZarMonthly: number;
  features: string[];
  badgeColor: string;
  isPopular?: boolean;
}

export interface BookingReservation {
  id: string;
  referenceNumber: string;
  venueId: string;
  venueName: string;
  category: VenueCategory;
  bookingType: 'room' | 'table' | 'gear' | 'lesson';
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  date: string;
  timeSlot?: string;
  nights?: number;
  partySize: number;
  totalZar: number;
  depositPaidZar: number;
  paymentMethod: 'card' | 'instant_eft' | 'payfast';
  status: 'confirmed' | 'pending' | 'cancelled';
  specialRequests?: string;
  discountApplied?: string;
  createdAt: string;
}

export interface WaveReport {
  id: string;
  spotId: string;
  spotName: string;
  region: RegionKey;
  authorName: string;
  authorHandle: string;
  authorAvatar?: string;
  timestamp: string;
  timeAgo: string;
  waveSize: string; // e.g. "3–5ft"
  waveQuality: 'Epic' | 'Good' | 'Fair' | 'Messy';
  windNote: string; // e.g. "Light offshore SE"
  crowdLevel: 'Empty (1-2 out)' | 'Mellow (3-8 out)' | 'Busy (10-20 out)' | 'Packed (Crowded)';
  tideStage: 'Low' | 'Mid Rising' | 'High' | 'Mid Dropping';
  boardRecommended: string; // e.g. "Fish / Midlength"
  notes: string;
  photoUrl?: string;
  shakasCount: number;
  hasUserShaka?: boolean;
  comments: WaveReportComment[];
}

export interface WaveReportComment {
  id: string;
  authorName: string;
  timestamp: string;
  text: string;
}

export interface SwellAlertConfig {
  enabled: boolean;
  minWaveHeightM: number;
  minRating: number;
  offshoreOnly: boolean;
  subscribedSpotIds: string[];
  soundEnabled: boolean;
}

export interface SwellAlertItem {
  id: string;
  spotId: string;
  spotName: string;
  region: string;
  headline: string;
  summary: string;
  swellHeight: number;
  swellPeriod: number;
  rating: number;
  timestamp: string;
  isRead: boolean;
}
