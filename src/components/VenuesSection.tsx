import React, { useState } from 'react';
import { Venue, VenueCategory } from '../types';
import { Sparkles, Phone, MessageCircle, ExternalLink, Calendar, MapPin, Tag, Star, Compass, Eye, Info } from 'lucide-react';

interface VenuesSectionProps {
  venues: Venue[];
  onBookVenue: (venue: Venue) => void;
  onOpenSponsorPortal: () => void;
  userLat: number;
  userLng: number;
  onOpenSponsorDetail?: (venue: Venue) => void;
}

export const VenuesSection: React.FC<VenuesSectionProps> = ({
  venues,
  onBookVenue,
  onOpenSponsorPortal,
  onOpenSponsorDetail
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | VenueCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVenues = venues.filter((venue) => {
    const matchesCategory = selectedCategory === 'all' || venue.category === selectedCategory;
    const matchesQuery =
      searchQuery === '' ||
      `${venue.name} ${venue.town} ${venue.region} ${venue.description} ${venue.features.join(' ')}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  // Sort venues by sponsor priority: Gold -> Silver -> Bronze -> standard, then by rating
  const sortedVenues = [...filteredVenues].sort((a, b) => {
    const tierWeight = (tier?: string) => (tier === 'gold' ? 3 : tier === 'silver' ? 2 : tier === 'bronze' ? 1 : 0);
    const weightDiff = tierWeight(b.sponsorTier) - tierWeight(a.sponsorTier);
    if (weightDiff !== 0) return weightDiff;
    return b.rating - a.rating;
  });

  const goldSponsors = venues.filter((v) => v.sponsorTier === 'gold');

  return (
    <div className="space-y-6">
      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs font-bold">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-teal-500 text-slate-950 font-black shadow-md shadow-teal-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Venues
          </button>
          <button
            onClick={() => setSelectedCategory('stay')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              selectedCategory === 'stay'
                ? 'bg-teal-500 text-slate-950 font-black shadow-md shadow-teal-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            🛏️ Stays & Lodges
          </button>
          <button
            onClick={() => setSelectedCategory('eat')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              selectedCategory === 'eat'
                ? 'bg-teal-500 text-slate-950 font-black shadow-md shadow-teal-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            🍽️ Surf Eats
          </button>
          <button
            onClick={() => setSelectedCategory('shop')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              selectedCategory === 'shop'
                ? 'bg-teal-500 text-slate-950 font-black shadow-md shadow-teal-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            🏄 Surf Shops & Lessons
          </button>
          <button
            onClick={() => setSelectedCategory('drinks')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              selectedCategory === 'drinks'
                ? 'bg-teal-500 text-slate-950 font-black shadow-md shadow-teal-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            🍹 Beach Bars & Brews
          </button>
        </div>

        {/* Search Input */}
        <div className="relative sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search venue name, town, amenity..."
            className="w-full px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Gold Break Sponsors Showcase Header */}
      {selectedCategory === 'all' && searchQuery === '' && goldSponsors.length > 0 && (
        <div className="rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/30 border border-amber-400/40 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs">
                ★
              </span>
              <div>
                <h3 className="text-sm font-extrabold text-amber-300 uppercase tracking-wider">
                  Featured Gold Break Sponsors
                </h3>
                <p className="text-xs text-slate-400">
                  Targeted local visibility supporting South Africa's premier breaks
                </p>
              </div>
            </div>

            <button
              onClick={onOpenSponsorPortal}
              className="text-xs font-bold text-amber-300 hover:text-amber-200 underline cursor-pointer"
            >
              Advertise Your Business ↗
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {goldSponsors.slice(0, 3).map((sponsor) => (
              <div
                key={sponsor.id}
                className="rounded-2xl bg-slate-950/80 border border-amber-400/40 p-3.5 flex flex-col justify-between hover:border-amber-400 transition-all shadow-md group"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-amber-400 font-extrabold uppercase mb-2">
                    <span>{sponsor.town}</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Gold Slot
                    </span>
                  </div>

                  {/* Thumbnail Image with click to reveal */}
                  <div
                    onClick={() => onOpenSponsorDetail && onOpenSponsorDetail(sponsor)}
                    className="relative h-28 w-full rounded-xl overflow-hidden mb-2.5 cursor-pointer group/img border border-amber-400/20"
                    title="Click to view sponsor details & gallery"
                  >
                    <img
                      src={sponsor.image}
                      alt={sponsor.name}
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-950/30 group-hover/img:bg-slate-950/10 transition-colors flex items-center justify-center">
                      <span className="text-[10px] font-black uppercase text-amber-300 bg-slate-950/80 px-2 py-1 rounded-lg border border-amber-400/40 shadow flex items-center gap-1">
                        <Eye className="w-3 h-3" /> View Details
                      </span>
                    </div>
                  </div>

                  <h4
                    onClick={() => onOpenSponsorDetail && onOpenSponsorDetail(sponsor)}
                    className="font-bold text-sm text-white hover:text-amber-300 cursor-pointer transition-colors"
                  >
                    {sponsor.name}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">{sponsor.description}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-amber-300 font-bold">
                    Code: {sponsor.discountCode || 'SURF15'} (-{sponsor.discountPercentage || 15}%)
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenSponsorDetail && onOpenSponsorDetail(sponsor)}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold transition-colors cursor-pointer"
                      title="Reveal sponsor details"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => onBookVenue(sponsor)}
                      className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-colors cursor-pointer"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedVenues.map((venue) => {
          const isGold = venue.sponsorTier === 'gold';
          const isSilver = venue.sponsorTier === 'silver';
          const isBronze = venue.sponsorTier === 'bronze';

          return (
            <div
              key={venue.id}
              className={`rounded-2xl overflow-hidden flex flex-col justify-between transition-all bg-slate-900 border ${
                isGold
                  ? 'border-amber-400/60 shadow-md shadow-amber-950/20'
                  : isSilver
                  ? 'border-slate-300/40'
                  : isBronze
                  ? 'border-amber-700/40'
                  : 'border-slate-800'
              }`}
            >
              {/* Photo & Badges - Click to popup and reveal full detail */}
              <div
                onClick={() => onOpenSponsorDetail && onOpenSponsorDetail(venue)}
                className="relative h-44 w-full bg-slate-800 overflow-hidden cursor-pointer group/img"
                title="Click image to reveal details and full gallery"
              >
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                {/* Hover reveal hint badge */}
                <div className="absolute inset-0 bg-slate-950/20 group-hover/img:bg-slate-950/40 transition-colors flex items-center justify-center opacity-0 group-hover/img:opacity-100">
                  <span className="px-3 py-1.5 rounded-xl bg-slate-950/90 text-white font-bold text-xs border border-white/20 shadow-lg flex items-center gap-1.5 transform translate-y-1 group-hover/img:translate-y-0 transition-transform">
                    <Eye className="w-3.5 h-3.5 text-teal-400" /> View Photos & Details
                  </span>
                </div>

                {/* Top Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-sm text-white border border-slate-700">
                    {venue.category.toUpperCase()}
                  </span>
                  {venue.sponsorTier && (
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md ${
                        isGold
                          ? 'bg-amber-400 text-slate-950 border border-white'
                          : isSilver
                          ? 'bg-slate-200 text-slate-950 border border-slate-300'
                          : 'bg-amber-800 text-amber-200 border border-amber-600'
                      }`}
                    >
                      <Sparkles className="w-2.5 h-2.5" />
                      {venue.sponsorTier} Sponsor
                    </span>
                  )}
                </div>

                <div className="absolute top-2.5 right-2.5 bg-slate-950/80 backdrop-blur-sm px-2 py-0.5 rounded-md text-xs font-bold text-amber-400 border border-slate-800 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{venue.rating}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({venue.reviewsCount})</span>
                </div>

                {/* Bottom title inside image */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <h3 className="text-base font-extrabold text-white font-['Cabinet_Grotesk'] leading-tight drop-shadow-md group-hover/img:text-teal-300 transition-colors">
                    {venue.name}
                  </h3>
                  <div className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5 drop-shadow-sm">
                    <MapPin className="w-3 h-3 text-teal-400" />
                    <span>{venue.town}, {venue.region}</span>
                    <span>•</span>
                    <span className="font-semibold text-slate-200">{venue.priceRange}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {venue.description}
                  </p>

                  {/* Amenity features chips */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {venue.features.slice(0, 3).map((feat, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800/80"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>

                  {/* Promo code badge if exists */}
                  {venue.discountCode && (
                    <div className="mt-3 p-2 rounded-xl bg-amber-950/20 border border-amber-600/30 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                        <Tag className="w-3.5 h-3.5" />
                        <span>Save {venue.discountPercentage}%:</span>
                      </div>
                      <span className="font-mono font-bold text-amber-200 bg-amber-400/20 px-1.5 py-0.5 rounded">
                        {venue.discountCode}
                      </span>
                    </div>
                  )}
                </div>

                {/* Direct Connect & Booking Footer */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {venue.phone && (
                      <a
                        href={`tel:${venue.phone}`}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title={`Call ${venue.phone}`}
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {venue.whatsapp && (
                      <a
                        href={`https://wa.me/${venue.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 text-emerald-400 transition-colors border border-emerald-800/40"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <a
                      href={`https://maps.google.com/?q=${venue.lat},${venue.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Directions"
                    >
                      <Compass className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenSponsorDetail && onOpenSponsorDetail(venue)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Details
                    </button>
                    {venue.bookable ? (
                      <button
                        onClick={() => onBookVenue(venue)}
                        className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-teal-500/20 cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Book</span>
                      </button>
                    ) : (
                      venue.website && (
                        <a
                          href={venue.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors flex items-center gap-1"
                        >
                          <span>Website</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Advertise Callout for local surf shops, stays & restaurants */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-6 text-center">
        <h3 className="text-lg font-bold text-white font-['Cabinet_Grotesk']">
          Own a Surf Shop, Coastal Stay, or Beachfront Restaurant?
        </h3>
        <p className="text-xs text-slate-400 max-w-xl mx-auto mt-1 mb-4">
          Connect directly with thousands of surfers actively looking for gear, lodging, and meals when swells hit your area. Gold, Silver and Bronze sponsor slots with zero booking commissions.
        </p>
        <button
          onClick={onOpenSponsorPortal}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
        >
          View 3-Tier Sponsor Plans & Advertise
        </button>
      </div>
    </div>
  );
};
