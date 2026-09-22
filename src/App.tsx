import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  SurfSpot,
  MarineCondition,
  SportDiscipline,
  Venue,
  BookingReservation,
  WaveReport,
  SwellAlertConfig,
  SwellAlertItem
} from './types';
import { SURF_SPOTS } from './data/surfSpots';
import { CURATED_VENUES } from './data/curatedVenues';
import { INITIAL_WAVE_REPORTS } from './data/mockReports';
import { DEFAULT_ALERT_CONFIG, INITIAL_ALERTS, sendPushNotification } from './utils/notifications';
import {
  calculateDistanceKm,
  calculateConditionScore,
  fetchSpotMarineCondition,
  DEFAULT_SOUTH_AFRICA_ORIGIN,
  POPULAR_SA_HUBS
} from './utils/geo';
import { Header } from './components/Header';
import { BestBreakHero } from './components/BestBreakHero';
import { SpotCard } from './components/SpotCard';
import { SpotDetailModal } from './components/SpotDetailModal';
import { InteractiveMap } from './components/InteractiveMap';
import { VenuesSection } from './components/VenuesSection';
import { SurfShopsSection } from './components/SurfShopsSection';
import { SponsorPortalModal } from './components/SponsorPortalModal';
import { SponsorDetailModal } from './components/SponsorDetailModal';
import { BookingModal } from './components/BookingModal';
import { MyBookingsModal } from './components/MyBookingsModal';
import { SwellAlertsModal } from './components/SwellAlertsModal';
import { CommunityForum } from './components/CommunityForum';
import { Search, SlidersHorizontal, MapPin, Waves, AlertCircle, X, Sparkles, Bell, ShoppingBag } from 'lucide-react';
import { safeStorage } from './utils/storage';

export default function App() {
  // Origin GPS state
  const [origin, setOrigin] = useState(() => {
    try {
      const saved = safeStorage.getItem('surf_sa_origin');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return DEFAULT_SOUTH_AFRICA_ORIGIN;
  });

  const [isLocating, setIsLocating] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // App discipline & tab
  const [discipline, setDiscipline] = useState<SportDiscipline>('surf');
  const [activeTab, setActiveTab] = useState<'spots' | 'venues' | 'surf-shops' | 'map' | 'community'>('spots');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [searchRadiusKm, setSearchRadiusKm] = useState<number>(60);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // Conditions storage for all spots
  const [conditions, setConditions] = useState<Record<string, MarineCondition>>({});

  // Modals state
  const [selectedSpotForDetail, setSelectedSpotForDetail] = useState<SurfSpot | null>(null);
  const [selectedVenueForBooking, setSelectedVenueForBooking] = useState<Venue | null>(null);
  const [selectedVenueForDetail, setSelectedVenueForDetail] = useState<Venue | null>(null);
  const [isSponsorPortalOpen, setIsSponsorPortalOpen] = useState(false);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [preselectedReportSpotId, setPreselectedReportSpotId] = useState<string | null>(null);

  // Persistent user state
  const [venues, setVenues] = useState<Venue[]>(() => {
    try {
      const saved = safeStorage.getItem('surf_sa_venues');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return CURATED_VENUES;
  });

  const [bookings, setBookings] = useState<BookingReservation[]>(() => {
    try {
      const saved = safeStorage.getItem('surf_sa_bookings');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return [];
  });

  const [waveReports, setWaveReports] = useState<WaveReport[]>(() => {
    try {
      const saved = safeStorage.getItem('surf_sa_reports');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return INITIAL_WAVE_REPORTS;
  });

  const [alertConfig, setAlertConfig] = useState<SwellAlertConfig>(() => {
    try {
      const saved = safeStorage.getItem('surf_sa_alert_config');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return DEFAULT_ALERT_CONFIG;
  });

  const [alerts, setAlerts] = useState<SwellAlertItem[]>(INITIAL_ALERTS);

  // In-app Swell Alert Toast Banner
  const [toastAlert, setToastAlert] = useState<{ headline: string; message: string; spotId?: string } | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    safeStorage.setItem('surf_sa_origin', JSON.stringify(origin));
  }, [origin]);

  useEffect(() => {
    safeStorage.setItem('surf_sa_venues', JSON.stringify(venues));
  }, [venues]);

  useEffect(() => {
    safeStorage.setItem('surf_sa_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    safeStorage.setItem('surf_sa_reports', JSON.stringify(waveReports));
  }, [waveReports]);

  useEffect(() => {
    safeStorage.setItem('surf_sa_alert_config', JSON.stringify(alertConfig));
  }, [alertConfig]);

  // Request high-accuracy GPS
  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setOrigin({
          lat: latitude,
          lng: longitude,
          label: `GPS Position (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)`
        });
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        const msg =
          error.code === 1
            ? 'GPS location permission denied. Using selected coastal hub.'
            : error.code === 2
            ? 'GPS position unavailable. Please check location settings.'
            : 'GPS request timed out. Using default coastal hub.';
        setGpsError(msg);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }, []);

  // Fetch marine condition for spots
  useEffect(() => {
    let isMounted = true;

    async function loadConditions() {
      // Prioritize nearby or famous spots first
      const initialBatch = SURF_SPOTS.slice(0, 10);
      const results: Record<string, MarineCondition> = {};

      for (const spot of initialBatch) {
        if (!isMounted) return;
        const cond = await fetchSpotMarineCondition(spot);
        results[spot.id] = cond;
      }

      if (isMounted) {
        setConditions((prev) => ({ ...prev, ...results }));
      }

      // Fetch remaining spots in background
      const remaining = SURF_SPOTS.slice(10);
      for (const spot of remaining) {
        if (!isMounted) return;
        const cond = await fetchSpotMarineCondition(spot);
        if (isMounted) {
          setConditions((prev) => ({ ...prev, [spot.id]: cond }));
        }
      }
    }

    loadConditions();

    return () => {
      isMounted = false;
    };
  }, []);

  // Compute spots with distances and dynamic condition ratings
  const spotsWithData = useMemo(() => {
    return SURF_SPOTS.map((spot) => {
      const dist = calculateDistanceKm(origin.lat, origin.lng, spot.lat, spot.lng);
      const condition =
        conditions[spot.id] || {
          swellHeight: 1.8,
          swellPeriod: 12,
          swellDir: 225,
          windSpeed: 14,
          windDir: 135,
          tide: 0.8,
          tideTrend: 'Stable',
          waterTemp: 15,
          airTemp: 21
        };
      const rating = calculateConditionScore(spot, condition, discipline);

      return {
        ...spot,
        dist,
        rating
      };
    });
  }, [origin.lat, origin.lng, conditions, discipline]);

  // Compute best running break nearby
  const bestBreak = useMemo(() => {
    if (spotsWithData.length === 0) return null;

    // Filter within search radius or pick best rated closest
    const inRadius = spotsWithData.filter((s) => (s.dist ?? 0) <= searchRadiusKm);
    const pool = inRadius.length > 0 ? inRadius : spotsWithData;

    // Sort by rating descending, then distance ascending
    const sorted = [...pool].sort((a, b) => {
      const ratingDiff = (b.rating ?? 0) - (a.rating ?? 0);
      if (Math.abs(ratingDiff) > 0.5) return ratingDiff;
      return (a.dist ?? 0) - (b.dist ?? 0);
    });

    return sorted[0] || null;
  }, [spotsWithData, searchRadiusKm]);

  // Filtered spots list
  const filteredSpots = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return spotsWithData
      .filter((spot) => {
        const matchesQuery =
          q === '' ||
          `${spot.name} ${spot.town} ${spot.region} ${spot.type}`.toLowerCase().includes(q);

        const inRadius = searchRadiusKm >= 500 || (spot.dist ?? 0) <= searchRadiusKm;

        const matchesDiff =
          selectedDifficulty === 'all' || spot.difficulty.toLowerCase().includes(selectedDifficulty.toLowerCase());

        return matchesQuery && inRadius && matchesDiff;
      })
      .sort((a, b) => {
        if (searchQuery.trim()) {
          // If searching, show highest score first
          return (b.rating ?? 0) - (a.rating ?? 0);
        }
        // Otherwise closest first
        return (a.dist ?? 0) - (b.dist ?? 0);
      });
  }, [spotsWithData, searchQuery, searchRadiusKm, selectedDifficulty]);

  // Venues with calculated GPS distance from user's current origin
  const venuesWithDistance = useMemo(() => {
    return venues.map((venue) => ({
      ...venue,
      dist: calculateDistanceKm(origin.lat, origin.lng, venue.lat, venue.lng)
    }));
  }, [venues, origin.lat, origin.lng]);

  // Nearest Gold Surf Shop according to GPS (Gold tier first, closest distance first)
  const closestGoldSurfShop = useMemo(() => {
    const goldShops = venuesWithDistance.filter(
      (v) => v.category === 'shop' && v.sponsorTier === 'gold'
    );
    return [...goldShops].sort((a, b) => (a.dist ?? 9999) - (b.dist ?? 9999))[0] || null;
  }, [venuesWithDistance]);

  // Nearest Gold Stay / Lodge according to GPS
  const closestGoldStay = useMemo(() => {
    const goldStays = venuesWithDistance.filter(
      (v) => v.category === 'stay' && v.sponsorTier === 'gold'
    );
    return [...goldStays].sort((a, b) => (a.dist ?? 9999) - (b.dist ?? 9999))[0] || null;
  }, [venuesWithDistance]);

  // Gold sponsor mapping for spots (stay or break sponsor)
  const getGoldSponsorForSpot = useCallback(
    (spotId: string) => {
      const spot = SURF_SPOTS.find((s) => s.id === spotId);
      if (!spot) return undefined;
      return venuesWithDistance.find(
        (v) =>
          v.sponsorTier === 'gold' &&
          (v.town.toLowerCase() === spot.town.toLowerCase() || v.region === spot.region)
      );
    },
    [venuesWithDistance]
  );

  // Gold surf shop sponsor mapping for spots (local break gold surf shop or closest gold surf shop)
  const getGoldShopForSpot = useCallback(
    (spotId: string) => {
      const spot = SURF_SPOTS.find((s) => s.id === spotId);
      if (!spot) return closestGoldSurfShop;
      const localShop = venuesWithDistance.find(
        (v) =>
          v.category === 'shop' &&
          v.sponsorTier === 'gold' &&
          (v.town.toLowerCase() === spot.town.toLowerCase() || v.region === spot.region)
      );
      return localShop || closestGoldSurfShop;
    },
    [venuesWithDistance, closestGoldSurfShop]
  );

  // Trigger test swell push notification
  const handleTriggerTestPush = (spotName: string) => {
    const headline = `🌊 SWELL ALERT: ${spotName} Firing!`;
    const message = `Pumping 2.4m @ 14s SW groundswell with clean light offshore winds. Live score 9.3/10!`;

    // Attempt browser native notification
    sendPushNotification(headline, { body: message });

    // Show in-app banner toast
    setToastAlert({ headline, message, spotId: 'super' });

    // Add to alert list
    const newAlert: SwellAlertItem = {
      id: `alert-${Date.now()}`,
      spotId: 'super',
      spotName,
      region: 'South Africa Coast',
      headline,
      summary: message,
      swellHeight: 2.4,
      swellPeriod: 14,
      rating: 9.3,
      timestamp: 'Just now',
      isRead: false
    };

    setAlerts((prev) => [newAlert, ...prev]);
  };

  // Add new sponsored venue
  const handleAddSponsoredVenue = (newVenue: Venue) => {
    setVenues((prev) => [newVenue, ...prev]);
  };

  // Confirm booking
  const handleConfirmBooking = (newBooking: BookingReservation) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  // Community report handlers
  const handleAddWaveReport = (newReport: WaveReport) => {
    setWaveReports((prev) => [newReport, ...prev]);
  };

  const handleToggleShaka = (reportId: string) => {
    setWaveReports((prev) =>
      prev.map((rep) => {
        if (rep.id === reportId) {
          const hasShaka = !rep.hasUserShaka;
          return {
            ...rep,
            hasUserShaka: hasShaka,
            shakasCount: hasShaka ? rep.shakasCount + 1 : Math.max(0, rep.shakasCount - 1)
          };
        }
        return rep;
      })
    );
  };

  const handleAddComment = (reportId: string, authorName: string, text: string) => {
    setWaveReports((prev) =>
      prev.map((rep) => {
        if (rep.id === reportId) {
          return {
            ...rep,
            comments: [
              ...rep.comments,
              {
                id: `c-${Date.now()}`,
                authorName,
                timestamp: 'Just now',
                text
              }
            ]
          };
        }
        return rep;
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Alert Banner */}
      {toastAlert && (
        <div className="sticky top-0 z-50 bg-gradient-to-r from-teal-500 to-sky-500 text-slate-950 px-4 py-2.5 shadow-lg flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="p-1 rounded bg-slate-950 text-teal-300">
              <Bell className="w-3.5 h-3.5 animate-bounce" />
            </span>
            <span>{toastAlert.headline}</span>
            <span className="hidden md:inline font-normal opacity-90">— {toastAlert.message}</span>
          </div>
          <button
            onClick={() => setToastAlert(null)}
            className="p-1 rounded-lg hover:bg-black/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Header */}
      <Header
        discipline={discipline}
        setDiscipline={setDiscipline}
        gpsLabel={origin.label}
        isLocating={isLocating}
        onLocateMe={handleLocateMe}
        unreadAlertsCount={alerts.filter((a) => !a.isRead).length}
        onOpenAlerts={() => setIsAlertsModalOpen(true)}
        onOpenSponsors={() => setIsSponsorPortalOpen(true)}
        onOpenBookings={() => setIsBookingsModalOpen(true)}
        activeBookingsCount={bookings.length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* GPS Error Advisory */}
      {gpsError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3">
          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{gpsError}</span>
            </div>
            <button
              onClick={() => setGpsError(null)}
              className="text-amber-400 hover:text-white font-bold ml-2 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Coastal Hub Quick Switcher Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3.5 pb-1">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          <span className="text-slate-400 font-semibold shrink-0 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            <span>Coastal Hubs:</span>
          </span>
          {POPULAR_SA_HUBS.map((hub) => {
            const isSelected =
              Math.abs(origin.lat - hub.lat) < 0.05 && Math.abs(origin.lng - hub.lng) < 0.05;
            return (
              <button
                key={hub.label}
                onClick={() =>
                  setOrigin({
                    lat: hub.lat,
                    lng: hub.lng,
                    label: hub.label
                  })
                }
                className={`px-2.5 py-1 rounded-lg shrink-0 transition-colors cursor-pointer font-medium ${
                  isSelected
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {hub.label.split('(')[0].trim()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-6 w-full">
        {/* TAB 1: Surf Spots & Forecast */}
        {activeTab === 'spots' && (
          <div className="space-y-6">
            {/* Best Running Break Hero */}
            <BestBreakHero
              spot={bestBreak}
              condition={bestBreak ? conditions[bestBreak.id] || null : null}
              discipline={discipline}
              goldSponsor={bestBreak ? getGoldSponsorForSpot(bestBreak.id) : undefined}
              goldSurfShop={bestBreak ? getGoldShopForSpot(bestBreak.id) : closestGoldSurfShop}
              onOpenSpot={(s) => setSelectedSpotForDetail(s)}
              onBookVenue={(v) => setSelectedVenueForBooking(v)}
              onOpenReportModal={(spotId) => {
                setPreselectedReportSpotId(spotId);
                setActiveTab('community');
              }}
              onOpenSponsorDetail={(v) => setSelectedVenueForDetail(v)}
              onNavigateToSurfShops={() => setActiveTab('surf-shops')}
            />

            {/* Featured Gold Sponsors in Main Layout: Stay/Lodge & Closest Surf Shop */}
            {(closestGoldStay || closestGoldSurfShop) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {closestGoldStay && (
                  <div className="rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-400/40 p-3.5 flex items-center justify-between gap-3 shadow-md shadow-amber-950/10">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        onClick={() => setSelectedVenueForDetail(closestGoldStay)}
                        className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-amber-400/50 cursor-pointer group shadow-sm"
                        title="View lodge photo & details"
                      >
                        <img
                          src={closestGoldStay.image}
                          alt={closestGoldStay.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/0 transition-colors" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-amber-400">
                          <Sparkles className="w-3 h-3" />
                          <span>Featured Gold Stay</span>
                          <span className="text-slate-400 font-semibold">• {closestGoldStay.dist ?? 0} km</span>
                        </div>
                        <h4
                          onClick={() => setSelectedVenueForDetail(closestGoldStay)}
                          className="text-xs sm:text-sm font-extrabold text-white truncate hover:text-amber-300 transition-colors cursor-pointer mt-0.5"
                        >
                          {closestGoldStay.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate">
                          {closestGoldStay.town} • {closestGoldStay.discountCode ? `Code ${closestGoldStay.discountCode} (-${closestGoldStay.discountPercentage}%)` : 'Oceanfront View'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setSelectedVenueForBooking(closestGoldStay)}
                        className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-colors cursor-pointer shadow-sm"
                      >
                        Book Room ↗
                      </button>
                    </div>
                  </div>
                )}

                {closestGoldSurfShop && (
                  <div className="rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-400/40 p-3.5 flex items-center justify-between gap-3 shadow-md shadow-amber-950/10">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        onClick={() => setSelectedVenueForDetail(closestGoldSurfShop)}
                        className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-amber-400/50 cursor-pointer group shadow-sm"
                        title="View surf shop photo & details"
                      >
                        <img
                          src={closestGoldSurfShop.image}
                          alt={closestGoldSurfShop.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/0 transition-colors" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-amber-400">
                          <Sparkles className="w-3 h-3" />
                          <span>Closest Gold Surf Shop</span>
                          <span className="text-teal-300 font-semibold">• {closestGoldSurfShop.dist ?? 0} km away</span>
                        </div>
                        <h4
                          onClick={() => setSelectedVenueForDetail(closestGoldSurfShop)}
                          className="text-xs sm:text-sm font-extrabold text-white truncate hover:text-amber-300 transition-colors cursor-pointer mt-0.5"
                        >
                          {closestGoldSurfShop.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate">
                          {closestGoldSurfShop.town} • {closestGoldSurfShop.discountCode ? `Code ${closestGoldSurfShop.discountCode} (-${closestGoldSurfShop.discountPercentage}%)` : 'Board Hire & Ding Repairs'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setSelectedVenueForBooking(closestGoldSurfShop)}
                        className="px-2.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-colors cursor-pointer shadow-sm"
                      >
                        Book Gear ↗
                      </button>
                      <button
                        onClick={() => setActiveTab('surf-shops')}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs transition-colors cursor-pointer"
                        title="View full closest surf shop directory"
                      >
                        All Shops
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Filter Dock */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search all South African spots, towns, regions..."
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Radius Filter */}
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-semibold shrink-0">Radius:</span>
                <select
                  value={searchRadiusKm}
                  onChange={(e) => setSearchRadiusKm(Number(e.target.value))}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option value={30}>30 km (Immediate Area)</option>
                  <option value={60}>60 km (Local Coast)</option>
                  <option value={120}>120 km (Regional)</option>
                  <option value={300}>300 km (Road Trip)</option>
                  <option value={2000}>Nationwide (All SA Breaks)</option>
                </select>
              </div>

              {/* Difficulty Filter */}
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-semibold shrink-0">Skill:</span>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option value="all">All Difficulties</option>
                  <option value="Beginner">Beginner / Learner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced / Slab</option>
                  <option value="Expert">Expert / Big Wave</option>
                </select>
              </div>
            </div>

            {/* Spots Directory Grid */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base sm:text-lg font-extrabold text-white font-['Cabinet_Grotesk']">
                  {searchQuery ? `Matching Breaks (${filteredSpots.length})` : `Breaks Nearby (${filteredSpots.length})`}
                </h2>
                <span className="text-xs text-slate-400">
                  Live marine forecast & score for {discipline}
                </span>
              </div>

              {filteredSpots.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400">
                  <Waves className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-300">No surf breaks found within this radius.</p>
                  <button
                    onClick={() => setSearchRadiusKm(2000)}
                    className="mt-2 text-xs text-teal-400 hover:text-teal-300 underline font-bold cursor-pointer"
                  >
                    Expand search to Nationwide (All South Africa)
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSpots.map((spot) => (
                    <SpotCard
                      key={spot.id}
                      spot={spot}
                      condition={
                        conditions[spot.id] || {
                          swellHeight: 1.8,
                          swellPeriod: 12,
                          swellDir: 225,
                          windSpeed: 14,
                          windDir: 135,
                          tide: 0.8,
                          tideTrend: 'Stable'
                        }
                      }
                      discipline={discipline}
                      goldSponsor={getGoldSponsorForSpot(spot.id)}
                      goldShop={getGoldShopForSpot(spot.id)}
                      onSelect={(s) => setSelectedSpotForDetail(s)}
                      onBookVenue={(v) => setSelectedVenueForBooking(v)}
                      onOpenSponsorDetail={(v) => setSelectedVenueForDetail(v)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Stays, Eats & Lodges */}
        {activeTab === 'venues' && (
          <VenuesSection
            venues={venuesWithDistance}
            onBookVenue={(v) => setSelectedVenueForBooking(v)}
            onOpenSponsorPortal={() => setIsSponsorPortalOpen(true)}
            onOpenSponsorDetail={(v) => setSelectedVenueForDetail(v)}
            userLat={origin.lat}
            userLng={origin.lng}
          />
        )}

        {/* TAB 3: Closest Surf Shops (GPS Proximity & Gold Tier Sponsorship) */}
        {activeTab === 'surf-shops' && (
          <SurfShopsSection
            shops={venuesWithDistance.filter((v) => v.category === 'shop')}
            userLat={origin.lat}
            userLng={origin.lng}
            userLabel={origin.label}
            onBookVenue={(v) => setSelectedVenueForBooking(v)}
            onOpenSponsorDetail={(v) => setSelectedVenueForDetail(v)}
            onOpenSponsorPortal={() => setIsSponsorPortalOpen(true)}
          />
        )}

        {/* TAB 4: Interactive Coastal Radar Map */}
        {activeTab === 'map' && (
          <InteractiveMap
            spots={spotsWithData}
            venues={venuesWithDistance}
            userLat={origin.lat}
            userLng={origin.lng}
            userLabel={origin.label}
            onSelectSpot={(s) => setSelectedSpotForDetail(s)}
            onSelectVenue={(v) => setSelectedVenueForBooking(v)}
          />
        )}

        {/* TAB 5: Community Forum & Live Wave Reports */}
        {activeTab === 'community' && (
          <CommunityForum
            reports={waveReports}
            spots={SURF_SPOTS}
            onAddReport={handleAddWaveReport}
            onToggleShaka={handleToggleShaka}
            onAddComment={handleAddComment}
            preselectedSpotId={preselectedReportSpotId}
          />
        )}
      </main>

      {/* Global Modals */}

      {/* Spot Detail Modal */}
      {selectedSpotForDetail && (
        <SpotDetailModal
          spot={selectedSpotForDetail}
          condition={
            conditions[selectedSpotForDetail.id] || {
              swellHeight: 1.8,
              swellPeriod: 12,
              swellDir: 225,
              windSpeed: 14,
              windDir: 135,
              tide: 0.8,
              tideTrend: 'Stable'
            }
          }
          discipline={discipline}
          goldSponsor={getGoldSponsorForSpot(selectedSpotForDetail.id)}
          goldSurfShop={getGoldShopForSpot(selectedSpotForDetail.id)}
          nearbyVenues={venuesWithDistance.filter(
            (v) =>
              v.town.toLowerCase() === selectedSpotForDetail.town.toLowerCase() ||
              v.region === selectedSpotForDetail.region
          )}
          onClose={() => setSelectedSpotForDetail(null)}
          onBookVenue={(venue) => setSelectedVenueForBooking(venue)}
          onOpenReportModal={(spotId) => {
            setPreselectedReportSpotId(spotId);
            setActiveTab('community');
          }}
          onSubscribeSpot={(spotId) => {
            const isSub = alertConfig.subscribedSpotIds.includes(spotId);
            const updated = isSub
              ? alertConfig.subscribedSpotIds.filter((id) => id !== spotId)
              : [...alertConfig.subscribedSpotIds, spotId];
            setAlertConfig({ ...alertConfig, subscribedSpotIds: updated });
          }}
          isSubscribedToAlerts={alertConfig.subscribedSpotIds.includes(selectedSpotForDetail.id)}
          onOpenSponsorDetail={(v) => setSelectedVenueForDetail(v)}
        />
      )}

      {/* Sponsor Detail Reveal Modal (Click to popup with photo & details) */}
      {selectedVenueForDetail && (
        <SponsorDetailModal
          venue={selectedVenueForDetail}
          onClose={() => setSelectedVenueForDetail(null)}
          onBookVenue={(venue) => setSelectedVenueForBooking(venue)}
        />
      )}

      {/* Booking Modal */}
      {selectedVenueForBooking && (
        <BookingModal
          venue={selectedVenueForBooking}
          onClose={() => setSelectedVenueForBooking(null)}
          onConfirmBooking={handleConfirmBooking}
        />
      )}

      {/* Sponsor Portal Modal */}
      {isSponsorPortalOpen && (
        <SponsorPortalModal
          onClose={() => setIsSponsorPortalOpen(false)}
          onAddSponsoredBusiness={handleAddSponsoredVenue}
        />
      )}

      {/* My Bookings Modal */}
      {isBookingsModalOpen && (
        <MyBookingsModal
          bookings={bookings}
          onClose={() => setIsBookingsModalOpen(false)}
        />
      )}

      {/* Swell Alerts Push Notification Modal */}
      {isAlertsModalOpen && (
        <SwellAlertsModal
          config={alertConfig}
          onUpdateConfig={setAlertConfig}
          alerts={alerts}
          spots={SURF_SPOTS}
          onClose={() => setIsAlertsModalOpen(false)}
          onTriggerTestAlert={handleTriggerTestPush}
        />
      )}

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-300">SURF SOUTH AFRICA</span>
            <span>•</span>
            <span>The Coastal Water Guide</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsSponsorPortalOpen(true)}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              ⭐ 3-Tier Sponsor Portal
            </button>
            <button
              onClick={() => setIsAlertsModalOpen(true)}
              className="hover:text-teal-300 transition-colors cursor-pointer"
            >
              🔔 Swell Alerts
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              🤙 Community Wave Reports
            </button>
          </div>

          <div className="text-[11px] text-slate-600">
            Marine Forecasts: Open-Meteo • Coordinates: Coastal Hydrography ZA
          </div>
        </div>
      </footer>
    </div>
  );
}
