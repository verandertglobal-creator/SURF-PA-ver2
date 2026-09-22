import React from 'react';
import { SurfSpot, MarineCondition, SportDiscipline, Venue } from '../types';
import { getScoreLabel, degreesToCompass, formatWaveHeight } from '../utils/geo';
import { Navigation, Compass, Wind, ArrowUpRight, Sparkles, Waves, Calendar, MessageSquare, Info } from 'lucide-react';

interface BestBreakHeroProps {
  spot: SurfSpot | null;
  condition: MarineCondition | null;
  discipline: SportDiscipline;
  goldSponsor?: Venue;
  goldSurfShop?: Venue;
  onOpenSpot: (spot: SurfSpot) => void;
  onBookVenue: (venue: Venue) => void;
  onOpenReportModal: (spotId: string) => void;
  onOpenSponsorDetail?: (venue: Venue) => void;
  onNavigateToSurfShops?: () => void;
}

export const BestBreakHero: React.FC<BestBreakHeroProps> = ({
  spot,
  condition,
  discipline,
  goldSponsor,
  goldSurfShop,
  onOpenSpot,
  onBookVenue,
  onOpenReportModal,
  onOpenSponsorDetail,
  onNavigateToSurfShops
}) => {
  if (!spot || !condition) {
    return (
      <div className="rounded-2xl p-6 bg-slate-900/60 border border-slate-800 animate-pulse text-center">
        <p className="text-slate-400 text-sm">Analyzing coastal swell radar & marine buoys...</p>
      </div>
    );
  }

  const rating = spot.rating ?? 8.0;
  const ratingMeta = getScoreLabel(rating);
  const windCompass = degreesToCompass(condition.windDir);
  const swellCompass = degreesToCompass(condition.swellDir);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-teal-950/40 border border-teal-500/30 p-5 sm:p-7 shadow-xl shadow-teal-950/30">
      {/* Decorative background watermark */}
      <div className="absolute right-4 -bottom-10 pointer-events-none opacity-5 text-teal-300 font-black text-[180px] select-none leading-none">
        ~
      </div>

      {/* Gold Sponsor Billboard (if active on this break) */}
      {goldSponsor && (
        <div className="mb-4 -mx-1 -mt-1 p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-transparent border border-amber-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md shadow-amber-950/20">
          <div className="flex items-center gap-3">
            {/* Clickable Sponsor Image Thumbnail with zoom icon */}
            <div
              onClick={() => onOpenSponsorDetail && onOpenSponsorDetail(goldSponsor)}
              className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-amber-400/50 cursor-pointer group shadow-sm"
              title="Click to view sponsor details & photo"
            >
              <img
                src={goldSponsor.image}
                alt={goldSponsor.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/10 transition-colors flex items-center justify-center">
                <span className="text-[9px] font-black uppercase text-amber-300 bg-slate-950/80 px-1 py-0.5 rounded shadow opacity-90 group-hover:scale-105 transition-transform">
                  View
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3 h-3" /> Gold Break Sponsor
                </span>
                <span className="text-[10px] text-amber-300/80 uppercase font-bold hidden sm:inline">
                  • {goldSponsor.category.toUpperCase()}
                </span>
              </div>
              <div
                onClick={() => onOpenSponsorDetail && onOpenSponsorDetail(goldSponsor)}
                className="text-sm font-extrabold text-white hover:text-amber-300 transition-colors cursor-pointer mt-0.5 flex items-center gap-1.5"
              >
                <span>{goldSponsor.name}</span>
                <span className="text-xs text-amber-400 font-semibold underline decoration-amber-400/50">Details ↗</span>
              </div>
              <p className="text-xs text-slate-300 line-clamp-1">
                {goldSponsor.sponsorTagline || goldSponsor.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            {goldSponsor.discountCode && (
              <span className="text-[11px] font-mono px-2 py-1 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold">
                {goldSponsor.discountCode} (-{goldSponsor.discountPercentage}%)
              </span>
            )}
            <button
              onClick={() => onBookVenue(goldSponsor)}
              className="text-xs font-black px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5" /> Book Now
            </button>
          </div>
        </div>
      )}

      {/* Closest Gold Surf Shop Billboard in Main Layout */}
      {goldSurfShop && (!goldSponsor || goldSponsor.id !== goldSurfShop.id) && (
        <div className="mb-4 -mx-1 -mt-1 p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent border border-amber-400/35 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md shadow-amber-950/20">
          <div className="flex items-center gap-3">
            <div
              onClick={() => onOpenSponsorDetail && onOpenSponsorDetail(goldSurfShop)}
              className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-amber-400/50 cursor-pointer group shadow-sm"
              title="Click to view surf shop details & photo"
            >
              <img
                src={goldSurfShop.image}
                alt={goldSurfShop.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/10 transition-colors flex items-center justify-center">
                <span className="text-[9px] font-black uppercase text-amber-300 bg-slate-950/80 px-1 py-0.5 rounded shadow opacity-90 group-hover:scale-105 transition-transform">
                  View
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3 h-3" /> Gold Surf Shop Sponsor
                </span>
                <span className="text-[10px] text-amber-300 font-bold">
                  • {goldSurfShop.dist !== undefined ? `${goldSurfShop.dist} km away` : 'Nearest Gold Surf Shop'}
                </span>
              </div>
              <div
                onClick={() => onOpenSponsorDetail && onOpenSponsorDetail(goldSurfShop)}
                className="text-sm font-extrabold text-white hover:text-amber-300 transition-colors cursor-pointer mt-0.5 flex items-center gap-1.5"
              >
                <span>{goldSurfShop.name}</span>
                <span className="text-xs text-amber-400 font-semibold underline decoration-amber-400/50">Details ↗</span>
              </div>
              <p className="text-xs text-slate-300 line-clamp-1">
                {goldSurfShop.sponsorTagline || goldSurfShop.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            {goldSurfShop.discountCode && (
              <span className="text-[11px] font-mono px-2 py-1 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold">
                {goldSurfShop.discountCode} (-{goldSurfShop.discountPercentage}%)
              </span>
            )}
            <button
              onClick={() => onBookVenue(goldSurfShop)}
              className="text-xs font-black px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              Book Gear / Lesson ↗
            </button>
            {onNavigateToSurfShops && (
              <button
                onClick={onNavigateToSurfShops}
                className="text-xs font-bold px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              >
                All Shops ↗
              </button>
            )}
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/20">
              Best Running Nearby Right Now
            </span>
            <span className="text-xs text-slate-400">
              For {discipline === 'surf' ? 'Surfing' : discipline === 'bodyboard' ? 'Bodyboarding' : 'Kiting'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Cabinet_Grotesk']">
            {spot.name}
          </h1>

          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-300">
            <span className="font-semibold text-slate-200">{spot.town}, {spot.region}</span>
            <span>•</span>
            <span className="text-teal-300 font-bold">{spot.dist ?? 0} km from you</span>
            <span>•</span>
            <span className="text-slate-400">{spot.type}</span>
            <span>•</span>
            <span className="text-slate-400">{spot.difficulty}</span>
          </div>
        </div>

        {/* Big Live Rating Badge */}
        <div className="flex items-center gap-3 self-start md:self-auto bg-slate-950/70 p-3 rounded-2xl border border-teal-500/30">
          <div className="text-right">
            <div className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Live Match</div>
            <div className={`text-xs font-bold ${ratingMeta.color}`}>{ratingMeta.label}</div>
          </div>
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-sky-500 flex flex-col items-center justify-center text-slate-950 font-black shadow-lg shadow-teal-500/30">
            <span className="text-2xl leading-none">{rating}</span>
            <span className="text-[9px] uppercase tracking-tighter opacity-80">/ 10</span>
          </div>
        </div>
      </div>

      {/* Marine Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 my-5">
        {/* Swell */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
            <span>Swell Height</span>
            <Waves className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <div className="text-lg font-bold text-white tracking-tight leading-tight">
            {formatWaveHeight(condition.swellHeight).meters}{' '}
            <span className="text-sm font-extrabold text-teal-400">
              ({formatWaveHeight(condition.swellHeight).feet})
            </span>
          </div>
          <div className="text-[11px] text-teal-300/80 font-medium flex items-center justify-between mt-0.5">
            <span>{swellCompass} ({condition.swellDir}°)</span>
            <span className="text-slate-400">@{condition.swellPeriod}s</span>
          </div>
        </div>

        {/* Wind */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
            <span>Wind</span>
            <Wind className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-lg font-bold text-white tracking-tight">
            {condition.windSpeed} <span className="text-xs font-normal text-slate-400">km/h</span>
          </div>
          <div className="text-[11px] text-sky-300/80 font-medium flex items-center gap-1 mt-0.5">
            <span>{windCompass} ({condition.windDir}°)</span>
          </div>
        </div>

        {/* Tide Est */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
            <span>Tide Est.</span>
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-lg font-bold text-white tracking-tight">
            {condition.tide != null ? `${condition.tide.toFixed(1)}m` : '0.8m'}
          </div>
          <div className="text-[11px] text-indigo-300 font-medium mt-0.5">
            {condition.tideTrend} • Best: {spot.bestTide || 'Mid'}
          </div>
        </div>

        {/* Water & Air */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
            <span>Water / Air</span>
            <span className="text-teal-400 text-xs font-bold">ZA</span>
          </div>
          <div className="text-lg font-bold text-white tracking-tight">
            {condition.waterTemp ?? 15}°C <span className="text-xs font-normal text-slate-400">sea</span>
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-0.5">
            Air: {condition.airTemp ?? 20}°C
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenSpot(spot)}
            className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-teal-500/20 cursor-pointer"
          >
            <span>Break Guide & Tides</span>
          </button>

          <a
            href={`https://maps.google.com/?q=${spot.lat},${spot.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5 text-teal-400" />
            <span>GPS Directions</span>
            <ArrowUpRight className="w-3 h-3 opacity-60" />
          </a>
        </div>

        <button
          onClick={() => onOpenReportModal(spot.id)}
          className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1.5 cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Post Live Wave Report from here</span>
        </button>
      </div>
    </div>
  );
};
