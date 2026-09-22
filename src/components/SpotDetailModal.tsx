import React from 'react';
import { SurfSpot, MarineCondition, SportDiscipline, Venue } from '../types';
import { getScoreLabel, degreesToCompass, formatWaveHeight } from '../utils/geo';
import { X, Navigation, Waves, Wind, Compass, ShieldAlert, Sparkles, Calendar, MessageSquare, Bell, ArrowUpRight, Info } from 'lucide-react';

interface SpotDetailModalProps {
  spot: SurfSpot | null;
  condition: MarineCondition | null;
  discipline: SportDiscipline;
  goldSponsor?: Venue;
  goldSurfShop?: Venue;
  nearbyVenues: Venue[];
  onClose: () => void;
  onBookVenue: (venue: Venue) => void;
  onOpenReportModal: (spotId: string) => void;
  onSubscribeSpot: (spotId: string) => void;
  isSubscribedToAlerts: boolean;
  onOpenSponsorDetail?: (venue: Venue) => void;
}

export const SpotDetailModal: React.FC<SpotDetailModalProps> = ({
  spot,
  condition,
  discipline,
  goldSponsor,
  goldSurfShop,
  nearbyVenues,
  onClose,
  onBookVenue,
  onOpenReportModal,
  onSubscribeSpot,
  isSubscribedToAlerts,
  onOpenSponsorDetail
}) => {
  if (!spot || !condition) return null;

  const rating = spot.rating ?? 7.5;
  const ratingMeta = getScoreLabel(rating);
  const windCompass = degreesToCompass(condition.windDir);
  const swellCompass = degreesToCompass(condition.swellDir);
  const [idealWindMin, idealWindMax, idealHeight, idealWindSpeed] = spot.ideal[discipline];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-5 sm:p-6 text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Region & Type */}
        <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
          <span className="font-extrabold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
            {spot.region}
          </span>
          <span className="text-slate-400">{spot.town}</span>
          <span>•</span>
          <span className="text-slate-300 font-semibold">{spot.type}</span>
          <span>•</span>
          <span className="text-teal-300 font-bold">{spot.dist ?? 0} km from your GPS</span>
        </div>

        {/* Spot Title & Live Rating */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Cabinet_Grotesk']">
              {spot.name}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-xs">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-bold">
                {spot.difficulty}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Best Tide: {spot.bestTide || 'All tides'}
              </span>
              {spot.sharkSpotters && (
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                  🦈 Shark Spotters Active
                </span>
              )}
            </div>
          </div>

          <div className="shrink-0 text-center bg-slate-950 p-2.5 rounded-2xl border border-slate-800 min-w-16">
            <span className={`text-2xl font-black block leading-none ${ratingMeta.color}`}>{rating}</span>
            <span className="text-[10px] text-slate-400 uppercase font-bold mt-1 block">Live Score</span>
          </div>
        </div>

        {/* Gold Sponsor Hero Feature */}
        {goldSponsor && (
          <div className="my-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-slate-900 border border-amber-400/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md shadow-amber-950/20">
            <div className="flex items-center gap-3">
              <div
                onClick={() => {
                  if (onOpenSponsorDetail) {
                    onClose();
                    onOpenSponsorDetail(goldSponsor);
                  }
                }}
                className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-amber-400/50 cursor-pointer group shadow"
                title="Click to view full photo and details"
              >
                <img
                  src={goldSponsor.image}
                  alt={goldSponsor.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/10 transition-colors flex items-center justify-center">
                  <span className="text-[9px] font-black uppercase text-amber-300 bg-slate-950/80 px-1 py-0.5 rounded shadow">
                    View
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-amber-300 text-xs font-black uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Official Gold Break Sponsor</span>
                </div>
                <h4
                  onClick={() => {
                    if (onOpenSponsorDetail) {
                      onClose();
                      onOpenSponsorDetail(goldSponsor);
                    }
                  }}
                  className="text-sm font-extrabold text-white hover:text-amber-300 transition-colors cursor-pointer mt-0.5"
                >
                  {goldSponsor.name} <span className="text-xs text-amber-400 font-normal">↗</span>
                </h4>
                <p className="text-xs text-amber-200/90 line-clamp-1">{goldSponsor.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
              {goldSponsor.discountCode && (
                <span className="text-[11px] font-mono px-2 py-1 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold">
                  {goldSponsor.discountCode} (-{goldSponsor.discountPercentage}%)
                </span>
              )}
              <button
                onClick={() => {
                  onClose();
                  onBookVenue(goldSponsor);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-colors flex items-center gap-1 cursor-pointer shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5" /> Book Direct
              </button>
            </div>
          </div>
        )}

        {/* Featured Gold Surf Shop Sponsor (if present and distinct) */}
        {goldSurfShop && (!goldSponsor || goldSponsor.id !== goldSurfShop.id) && (
          <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-transparent border border-amber-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md shadow-amber-950/20">
            <div className="flex items-center gap-3">
              <div
                onClick={() => {
                  if (onOpenSponsorDetail) {
                    onClose();
                    onOpenSponsorDetail(goldSurfShop);
                  }
                }}
                className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-amber-400/50 cursor-pointer group shadow-sm"
                title="Click to view surf shop details"
              >
                <img
                  src={goldSurfShop.image}
                  alt={goldSurfShop.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/10 transition-colors flex items-center justify-center">
                  <span className="text-[9px] font-black uppercase text-amber-300 bg-slate-950/80 px-1 py-0.5 rounded shadow opacity-90">
                    View
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Official Gold Surf Shop Sponsor</span>
                  {goldSurfShop.dist !== undefined && (
                    <span className="text-[11px] text-amber-400/90 font-semibold">• {goldSurfShop.dist} km away</span>
                  )}
                </div>
                <h4
                  onClick={() => {
                    if (onOpenSponsorDetail) {
                      onClose();
                      onOpenSponsorDetail(goldSurfShop);
                    }
                  }}
                  className="text-sm font-extrabold text-white hover:text-amber-300 transition-colors cursor-pointer mt-0.5"
                >
                  {goldSurfShop.name} <span className="text-xs text-amber-400 font-normal">↗</span>
                </h4>
                <p className="text-xs text-amber-200/90 line-clamp-1">{goldSurfShop.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
              {goldSurfShop.discountCode && (
                <span className="text-[11px] font-mono px-2 py-1 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold">
                  {goldSurfShop.discountCode} (-{goldSurfShop.discountPercentage}%)
                </span>
              )}
              <button
                onClick={() => {
                  onClose();
                  onBookVenue(goldSurfShop);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-colors flex items-center gap-1 cursor-pointer shadow-sm"
              >
                Book Gear / Lesson ↗
              </button>
            </div>
          </div>
        )}

        {/* Live Marine Grid */}
        <div className="my-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-semibold flex items-center justify-between">
              <span>Current Swell</span>
              <Waves className="w-3.5 h-3.5 text-teal-400" />
            </div>
            <div className="text-lg font-bold text-white mt-1 leading-tight">
              {formatWaveHeight(condition.swellHeight).meters}{' '}
              <span className="text-xs font-black text-teal-400">
                ({formatWaveHeight(condition.swellHeight).feet})
              </span>
            </div>
            <div className="text-xs text-teal-300/80 mt-0.5">
              {swellCompass} ({condition.swellDir}°) • {condition.swellPeriod}s
            </div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-semibold flex items-center justify-between">
              <span>Current Wind</span>
              <Wind className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="text-lg font-bold text-white mt-1">
              {condition.windSpeed} km/h
            </div>
            <div className="text-xs text-sky-300/80">{windCompass} ({condition.windDir}°)</div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-semibold flex items-center justify-between">
              <span>Tide Est.</span>
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-lg font-bold text-white mt-1">
              {condition.tide != null ? `${condition.tide.toFixed(1)}m` : '0.8m'}
            </div>
            <div className="text-xs text-indigo-300">{condition.tideTrend}</div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-semibold flex items-center justify-between">
              <span>Water Temp</span>
              <span className="text-teal-400 text-xs font-bold">ZA</span>
            </div>
            <div className="text-lg font-bold text-white mt-1">
              {condition.waterTemp ?? 15}°C
            </div>
            <div className="text-xs text-slate-400">Air: {condition.airTemp ?? 20}°C</div>
          </div>
        </div>

        {/* Spot Writeup */}
        <div className="my-4">
          <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-1">
            Local Lineup Overview
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80">
            {spot.writeup}
          </p>
        </div>

        {/* Hazards & Safety Alert */}
        <div className="my-4 p-3.5 rounded-xl bg-amber-950/20 border border-amber-600/30 flex items-start gap-2.5">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <strong className="text-amber-300 block mb-0.5">Hazards & Local Advisory:</strong>
            <span className="text-amber-200/80">{spot.hazards}</span>
          </div>
        </div>

        {/* Ideal Conditions Table */}
        <div className="my-4 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
          <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-2">
            Optimal Spot Parameters ({discipline.toUpperCase()})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div>
              <span className="text-slate-500 block">Ideal Wind:</span>
              <span className="font-bold text-slate-200">{idealWindMin}° – {idealWindMax}°</span>
            </div>
            <div>
              <span className="text-slate-500 block">Ideal Swell:</span>
              <span className="font-bold text-slate-200">~{idealHeight}m</span>
            </div>
            <div>
              <span className="text-slate-500 block">Ideal Wind Speed:</span>
              <span className="font-bold text-slate-200">&lt; {idealWindSpeed} km/h</span>
            </div>
            <div>
              <span className="text-slate-500 block">Best Tide:</span>
              <span className="font-bold text-slate-200">{spot.bestTide || 'All tides'}</span>
            </div>
          </div>
        </div>

        {/* Connected Nearby Venues & Services */}
        {nearbyVenues.length > 0 && (
          <div className="my-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                Connected Stays, Surf Shops & Eats Nearby
              </h4>
              <span className="text-[11px] text-teal-400 font-semibold">Instant Connect</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {nearbyVenues.slice(0, 4).map((venue) => (
                <div
                  key={venue.id}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-white truncate">{venue.name}</span>
                      {venue.sponsorTier && (
                        <span
                          className={`text-[9px] uppercase font-black px-1.5 py-0.2 rounded border ${
                            venue.sponsorTier === 'gold'
                              ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                              : venue.sponsorTier === 'silver'
                              ? 'bg-slate-300/20 text-slate-200 border-slate-400/40'
                              : 'bg-amber-900/30 text-amber-400 border-amber-800'
                          }`}
                        >
                          {venue.sponsorTier}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 block truncate">
                      {venue.category.toUpperCase()} • {venue.phone}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onBookVenue(venue);
                    }}
                    className="shrink-0 px-2.5 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <a
              href={`https://maps.google.com/?q=${spot.lat},${spot.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-teal-500/20 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Drive with GPS</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>

            <button
              onClick={() => onSubscribeSpot(spot.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 border cursor-pointer ${
                isSubscribedToAlerts
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <Bell className="w-3.5 h-3.5 text-teal-400" />
              <span>{isSubscribedToAlerts ? 'Alerts Active' : 'Get Swell Alerts'}</span>
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenReportModal(spot.id);
            }}
            className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1.5 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Post Live Wave Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
