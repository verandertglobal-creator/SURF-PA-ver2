import React from 'react';
import { SurfSpot, MarineCondition, SportDiscipline, Venue } from '../types';
import { getScoreLabel, degreesToCompass, formatWaveHeight } from '../utils/geo';
import { Waves, Wind, Compass, Sparkles, Navigation, ChevronRight, ShieldAlert } from 'lucide-react';

interface SpotCardProps {
  spot: SurfSpot;
  condition: MarineCondition;
  discipline: SportDiscipline;
  goldSponsor?: Venue;
  onSelect: (spot: SurfSpot) => void;
  onBookVenue?: (venue: Venue) => void;
  onOpenSponsorDetail?: (venue: Venue) => void;
}

export const SpotCard: React.FC<SpotCardProps> = ({
  spot,
  condition,
  discipline,
  goldSponsor,
  onSelect,
  onBookVenue,
  onOpenSponsorDetail
}) => {
  const rating = spot.rating ?? 7.0;
  const ratingMeta = getScoreLabel(rating);
  const windCompass = degreesToCompass(condition.windDir);
  const swellCompass = degreesToCompass(condition.swellDir);

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Beginner':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'Beginner–Intermediate':
        return 'bg-teal-500/15 text-teal-300 border-teal-500/30';
      case 'Intermediate':
        return 'bg-sky-500/15 text-sky-300 border-sky-500/30';
      case 'Advanced':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'Expert':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div
      onClick={() => onSelect(spot)}
      className="group relative rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/50 p-4 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-lg hover:shadow-teal-950/20 flex flex-col justify-between"
    >
      {/* Attached Sponsor Bar (if this spot has a Gold sponsor) */}
      {goldSponsor && (
        <div
          onClick={(e) => {
            if (onOpenSponsorDetail) {
              e.stopPropagation();
              onOpenSponsorDetail(goldSponsor);
            }
          }}
          className="mb-2.5 -mx-1 -mt-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/15 to-transparent border border-amber-400/25 flex items-center justify-between text-[11px] hover:border-amber-400/50 transition-colors"
          title="Click to view sponsor details & offers"
        >
          <div className="flex items-center gap-1.5 text-amber-300 font-bold truncate">
            {goldSponsor.image && (
              <img
                src={goldSponsor.image}
                alt={goldSponsor.name}
                className="w-5 h-5 rounded-full object-cover shrink-0 border border-amber-400/40"
              />
            )}
            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate max-w-[140px] sm:max-w-none">{goldSponsor.name}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] text-amber-300/80 hover:text-amber-200 font-semibold underline">
              Details
            </span>
            {onBookVenue && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBookVenue(goldSponsor);
                }}
                className="text-[10px] uppercase font-bold text-amber-400 hover:text-amber-300 px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/30 cursor-pointer"
              >
                Book ↗
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Header */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-base text-white group-hover:text-teal-300 transition-colors font-['Cabinet_Grotesk'] leading-snug">
              {spot.name}
            </h3>
            <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
              <span>{spot.town}</span>
              <span>•</span>
              <span className="text-teal-400 font-semibold">{spot.dist ?? 0} km away</span>
              <span>•</span>
              <span>{spot.type}</span>
            </div>
          </div>

          {/* Rating Pill */}
          <div className="shrink-0 flex flex-col items-end">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800">
              <span className={`text-sm font-black ${ratingMeta.color}`}>{rating}</span>
              <span className="text-[10px] text-slate-500 font-bold">/10</span>
            </div>
            <span className={`text-[10px] font-bold mt-0.5 ${ratingMeta.color}`}>{ratingMeta.label}</span>
          </div>
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getDifficultyBadge(spot.difficulty)}`}>
            {spot.difficulty}
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
            {spot.bestTide ? `Best @ ${spot.bestTide}` : 'Mid tide'}
          </span>
          {spot.sharkSpotters && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              🦈 Shark Spotters
            </span>
          )}
        </div>
      </div>

      {/* Live Marine Conditions Row */}
      <div className="mt-3.5 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-xs">
        <div className="bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
          <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
            <Waves className="w-3 h-3 text-teal-400" /> Swell
          </div>
          <div className="font-bold text-slate-200 mt-0.5 leading-tight">
            {formatWaveHeight(condition.swellHeight).meters} <span className="text-[11px] text-teal-400 font-extrabold">({formatWaveHeight(condition.swellHeight).feet})</span>
          </div>
          <div className="text-[10px] text-slate-400 flex items-center justify-between">
            <span>{condition.swellPeriod}s</span>
            <span>{swellCompass}</span>
          </div>
        </div>

        <div className="bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
          <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
            <Wind className="w-3 h-3 text-sky-400" /> Wind
          </div>
          <div className="font-bold text-slate-200 mt-0.5">
            {condition.windSpeed} <span className="text-[10px] text-slate-400">km/h</span>
          </div>
          <div className="text-[10px] text-slate-400">{windCompass}</div>
        </div>

        <div className="bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
          <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
            <Compass className="w-3 h-3 text-indigo-400" /> Tide
          </div>
          <div className="font-bold text-slate-200 mt-0.5">
            {condition.tide != null ? `${condition.tide.toFixed(1)}m` : '0.8m'}
          </div>
          <div className="text-[10px] text-indigo-300 font-medium truncate">{condition.tideTrend}</div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-1">
        <span className="text-[11px] truncate max-w-[210px] text-slate-500">
          {spot.region} • Ideal {discipline} break
        </span>
        <span className="text-teal-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center">
          Details <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
