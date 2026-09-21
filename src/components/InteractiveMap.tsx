import React, { useState } from 'react';
import { SurfSpot, Venue } from '../types';
import { getScoreLabel } from '../utils/geo';
import { Navigation, MapPin, Sparkles, Waves, ExternalLink, Compass } from 'lucide-react';

interface InteractiveMapProps {
  spots: SurfSpot[];
  venues: Venue[];
  userLat: number;
  userLng: number;
  userLabel: string;
  onSelectSpot: (spot: SurfSpot) => void;
  onSelectVenue: (venue: Venue) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  spots,
  venues,
  userLat,
  userLng,
  userLabel,
  onSelectSpot,
  onSelectVenue
}) => {
  const [selectedItem, setSelectedItem] = useState<{ type: 'spot'; data: SurfSpot } | { type: 'venue'; data: Venue } | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'spots' | 'stays' | 'eats' | 'sponsors'>('all');

  // South African coastal bounding coordinates for SVG projection:
  // Lat: -28 (Northern KZN) to -35.2 (Cape Agulhas / Peninsula)
  // Lng: 17.5 (West Coast) to 32.5 (Durban / St Lucia)
  const minLat = -35.2;
  const maxLat = -28.0;
  const minLng = 17.0;
  const maxLng = 32.5;

  const projectCoords = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
    return {
      x: Math.max(3, Math.min(97, x)),
      y: Math.max(3, Math.min(97, y))
    };
  };

  const userPos = projectCoords(userLat, userLng);

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4 sm:p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2 font-['Cabinet_Grotesk']">
            <Compass className="w-5 h-5 text-teal-400" />
            <span>South Africa Coastal Surf & Venue Radar</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time GPS proximity, breaks and connected sponsor businesses across 3,000km of coastline
          </p>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              filterType === 'all' ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('spots')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              filterType === 'spots' ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            🌊 Spots
          </button>
          <button
            onClick={() => setFilterType('sponsors')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              filterType === 'sponsors' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            ⭐ Sponsors
          </button>
          <button
            onClick={() => setFilterType('stays')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              filterType === 'stays' ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            🏨 Stays
          </button>
        </div>
      </div>

      {/* Map Projection Stage */}
      <div className="relative w-full h-[380px] sm:h-[460px] rounded-2xl bg-gradient-to-b from-slate-950 via-slate-950 to-teal-950/30 border border-slate-800 overflow-hidden select-none">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

        {/* Coastal contour line SVG overlay simulating South Africa's southern ocean shoreline */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Rough stylized curve of the SA coast from West Coast to KZN */}
          <path
            d="M 12 10 Q 15 50 20 75 Q 24 88 35 88 Q 50 86 65 72 Q 80 50 92 20"
            fill="none"
            stroke="#2dd4bf"
            strokeWidth="1.5"
            strokeDasharray="2 3"
          />
        </svg>

        {/* Region Labels */}
        <div className="absolute top-4 left-4 text-[10px] font-black uppercase tracking-wider text-slate-500 pointer-events-none">
          Atlantic Ocean (Cold Upwelling)
        </div>
        <div className="absolute bottom-4 right-6 text-[10px] font-black uppercase tracking-wider text-slate-500 pointer-events-none">
          Indian Ocean (Agulhas Current)
        </div>
        <div className="absolute top-4 right-4 text-[11px] font-bold text-teal-400/80 bg-slate-900/80 px-2 py-1 rounded-md border border-slate-800 pointer-events-none">
          South Africa Coastal Projection
        </div>

        {/* User GPS Pin & Radar Pulsing Ring */}
        <div
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
          style={{ left: `${userPos.x}%`, top: `${userPos.y}%` }}
        >
          {/* Animated radar ripple */}
          <div className="absolute -inset-4 rounded-full bg-teal-400/20 animate-ping pointer-events-none" />
          <div className="absolute -inset-8 rounded-full border border-teal-400/30 pointer-events-none" />
          <div className="relative w-7 h-7 rounded-full bg-teal-400 text-slate-950 font-bold flex items-center justify-center shadow-lg shadow-teal-400/50 border-2 border-white text-xs">
            ⌖
          </div>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 rounded bg-slate-950 text-teal-300 text-[10px] font-black border border-teal-500/40 whitespace-nowrap shadow-md">
            You ({userLabel.split(',')[0]})
          </div>
        </div>

        {/* Spots Pins */}
        {(filterType === 'all' || filterType === 'spots') &&
          spots.map((spot) => {
            const pos = projectCoords(spot.lat, spot.lng);
            const rating = spot.rating ?? 7.0;
            const ratingMeta = getScoreLabel(rating);
            const isSelected = selectedItem?.type === 'spot' && selectedItem.data.id === spot.id;

            return (
              <button
                key={spot.id}
                onClick={() => setSelectedItem({ type: 'spot', data: spot })}
                className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer ${
                  isSelected ? 'scale-125 z-30' : ''
                }`}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                title={`${spot.name} (${rating}/10)`}
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center shadow-md text-[8px] font-black text-slate-950 border border-slate-900 ${
                    rating >= 8
                      ? 'bg-emerald-400 ring-2 ring-emerald-400/30'
                      : rating >= 6
                      ? 'bg-teal-400'
                      : 'bg-sky-400'
                  }`}
                >
                  🌊
                </div>
              </button>
            );
          })}

        {/* Sponsor & Venue Pins */}
        {(filterType === 'all' || filterType === 'sponsors' || filterType === 'stays' || filterType === 'eats') &&
          venues
            .filter((v) => {
              if (filterType === 'sponsors') return Boolean(v.sponsorTier);
              if (filterType === 'stays') return v.category === 'stay';
              if (filterType === 'eats') return v.category === 'eat';
              return true;
            })
            .map((venue) => {
              const pos = projectCoords(venue.lat, venue.lng);
              const isGold = venue.sponsorTier === 'gold';
              const isSilver = venue.sponsorTier === 'silver';
              const isSelected = selectedItem?.type === 'venue' && selectedItem.data.id === venue.id;

              return (
                <button
                  key={venue.id}
                  onClick={() => setSelectedItem({ type: 'venue', data: venue })}
                  className={`absolute z-15 -translate-x-1/2 -translate-y-1/2 p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer ${
                    isSelected ? 'scale-125 z-30' : ''
                  }`}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  title={`${venue.name} (${venue.sponsorTier ? venue.sponsorTier.toUpperCase() : 'Venue'})`}
                >
                  <div
                    className={`w-4 h-4 rounded-md flex items-center justify-center shadow-md text-[9px] font-black border ${
                      isGold
                        ? 'bg-amber-400 text-slate-950 border-white ring-2 ring-amber-400/40'
                        : isSilver
                        ? 'bg-slate-200 text-slate-950 border-slate-400'
                        : 'bg-amber-700 text-amber-200 border-amber-500'
                    }`}
                  >
                    ★
                  </div>
                </button>
              );
            })}
      </div>

      {/* Selected Marker Detail Card */}
      {selectedItem ? (
        <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-teal-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                {selectedItem.type === 'spot' ? 'Surf Break' : selectedItem.data.category.toUpperCase()}
              </span>
              {selectedItem.type === 'venue' && selectedItem.data.sponsorTier && (
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> {selectedItem.data.sponsorTier} Sponsor
                </span>
              )}
              <span className="text-xs text-slate-400">{selectedItem.data.town}, {selectedItem.data.region}</span>
            </div>

            <h3 className="font-extrabold text-lg text-white font-['Cabinet_Grotesk']">
              {selectedItem.data.name}
            </h3>

            <p className="text-xs text-slate-300 max-w-xl mt-0.5 line-clamp-1">
              {selectedItem.type === 'spot' ? selectedItem.data.writeup : selectedItem.data.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <a
              href={`https://maps.google.com/?q=${selectedItem.data.lat},${selectedItem.data.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1"
            >
              <span>GPS Navigate</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {selectedItem.type === 'spot' ? (
              <button
                onClick={() => onSelectSpot(selectedItem.data)}
                className="px-4 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black transition-colors cursor-pointer"
              >
                View Break Guide
              </button>
            ) : (
              <button
                onClick={() => onSelectVenue(selectedItem.data)}
                className="px-4 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black transition-colors cursor-pointer"
              >
                Connect & Book
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-3 text-center text-xs text-slate-500">
          Click any break pin (🌊) or sponsor listing (★) on the radar to inspect details and get direct GPS navigation.
        </div>
      )}
    </div>
  );
};
