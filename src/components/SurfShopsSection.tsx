import React, { useState, useMemo } from 'react';
import { Venue } from '../types';
import {
  Sparkles,
  Phone,
  MessageCircle,
  MapPin,
  Tag,
  Star,
  Compass,
  Eye,
  ShoppingBag,
  Wrench,
  Navigation,
  SlidersHorizontal,
  ExternalLink,
  ShieldCheck,
  Search
} from 'lucide-react';

interface SurfShopsSectionProps {
  shops: Venue[];
  userLat: number;
  userLng: number;
  userLabel: string;
  onBookVenue: (venue: Venue) => void;
  onOpenSponsorDetail?: (venue: Venue) => void;
  onOpenSponsorPortal: () => void;
}

export const SurfShopsSection: React.FC<SurfShopsSectionProps> = ({
  shops,
  userLat,
  userLng,
  userLabel,
  onBookVenue,
  onOpenSponsorDetail,
  onOpenSponsorPortal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [radiusKm, setRadiusKm] = useState<number>(2000); // default nationwide, but can filter down
  const [selectedTierFilter, setSelectedTierFilter] = useState<'all' | 'gold' | 'silver' | 'bronze'>('all');

  // Filter and sort surf shops:
  // 1. Filter by radius and search query
  // 2. Sort: Gold tier first, then Silver, then Bronze, then standard
  // 3. Within each tier, sort by closest distance to user's GPS first
  const sortedShops = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return shops
      .filter((shop) => {
        const matchesQuery =
          q === '' ||
          `${shop.name} ${shop.town} ${shop.region} ${shop.description} ${shop.features.join(' ')}`
            .toLowerCase()
            .includes(q);

        const inRadius = radiusKm >= 2000 || (shop.dist ?? 0) <= radiusKm;

        const matchesTier =
          selectedTierFilter === 'all' || shop.sponsorTier === selectedTierFilter;

        return matchesQuery && inRadius && matchesTier;
      })
      .sort((a, b) => {
        // Priority weight: Gold (3) > Silver (2) > Bronze (1) > Standard (0)
        const tierWeight = (tier?: string) =>
          tier === 'gold' ? 3 : tier === 'silver' ? 2 : tier === 'bronze' ? 1 : 0;

        const weightA = tierWeight(a.sponsorTier);
        const weightB = tierWeight(b.sponsorTier);

        if (weightB !== weightA) {
          return weightB - weightA; // Gold first, then Silver, etc.
        }

        // Within the same tier, sort by closest GPS distance first
        const distA = a.dist ?? 9999;
        const distB = b.dist ?? 9999;
        return distA - distB;
      });
  }, [shops, searchQuery, radiusKm, selectedTierFilter]);

  // Closest Gold Tier Surf Shops
  const goldShops = useMemo(() => {
    return shops
      .filter((s) => s.sponsorTier === 'gold')
      .sort((a, b) => (a.dist ?? 9999) - (b.dist ?? 9999));
  }, [shops]);

  const nearestGoldShop = goldShops[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-extrabold uppercase tracking-wider mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span>Coastal Gear & Ding Repairs</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-['Cabinet_Grotesk']">
            Closest Surf Shops & Gear Hubs
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Live GPS proximity ranking from <span className="text-teal-300 font-semibold">{userLabel}</span>.
            Gold VIP sponsor shops featured first, sorted with the nearest coastal hardware first.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={onOpenSponsorPortal}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-400/40 text-amber-300 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>List Your Surf Shop ↗</span>
          </button>
        </div>
      </div>

      {/* Featured Nearest Gold VIP Surf Shop Billboard */}
      {nearestGoldShop && searchQuery === '' && selectedTierFilter === 'all' && (
        <div className="rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-amber-950/25 border-2 border-amber-400/50 p-4 sm:p-6 shadow-xl relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

          {/* Top Label */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3" /> Gold VIP Break Sponsor
              </span>
              <span className="text-xs text-amber-300 font-bold hidden sm:inline">
                • Closest Gold Surf Shop to Your GPS
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-xl border border-amber-400/40 text-xs font-black text-amber-300">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>{nearestGoldShop.dist ?? 0} km from you</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Image Thumbnail with zoom trigger */}
            <div
              onClick={() => onOpenSponsorDetail && onOpenSponsorDetail(nearestGoldShop)}
              className="md:col-span-4 h-48 md:h-44 rounded-2xl overflow-hidden relative cursor-pointer group/img border border-amber-400/30"
              title="Click to view shop photo gallery & details"
            >
              <img
                src={nearestGoldShop.image}
                alt={nearestGoldShop.name}
                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] font-bold text-white">
                <span className="bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-700">
                  {nearestGoldShop.town}, {nearestGoldShop.region}
                </span>
                <span className="bg-amber-400/90 text-slate-950 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Star className="w-3 h-3 fill-slate-950" /> {nearestGoldShop.rating}
                </span>
              </div>
            </div>

            {/* Content & Details */}
            <div className="md:col-span-8 flex flex-col justify-between h-full">
              <div>
                <h3
                  onClick={() => onOpenSponsorDetail && onOpenSponsorDetail(nearestGoldShop)}
                  className="text-lg sm:text-xl font-extrabold text-white hover:text-amber-300 transition-colors cursor-pointer font-['Cabinet_Grotesk'] leading-tight"
                >
                  {nearestGoldShop.name}
                </h3>
                <p className="text-xs text-amber-200/90 font-medium mt-0.5">
                  {nearestGoldShop.sponsorTagline || nearestGoldShop.description}
                </p>
                <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                  {nearestGoldShop.description}
                </p>

                {/* Features chips */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {nearestGoldShop.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-950/80 text-amber-200 border border-amber-400/30"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action row */}
              <div className="mt-4 pt-3 border-t border-amber-400/30 flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  {nearestGoldShop.discountCode && (
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold">
                      Code: {nearestGoldShop.discountCode} (-{nearestGoldShop.discountPercentage}%)
                    </span>
                  )}
                  <span className="text-xs text-slate-400 hidden sm:inline">
                    {nearestGoldShop.address}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {nearestGoldShop.phone && (
                    <a
                      href={`tel:${nearestGoldShop.phone}`}
                      className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-800"
                      title={`Call ${nearestGoldShop.phone}`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {nearestGoldShop.whatsapp && (
                    <a
                      href={`https://wa.me/${nearestGoldShop.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-400 transition-colors border border-emerald-700/50"
                      title="WhatsApp Gear Inquiry"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <a
                    href={`https://maps.google.com/?q=${nearestGoldShop.lat},${nearestGoldShop.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-teal-400 transition-colors border border-slate-800"
                    title="Get GPS Directions"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => onOpenSponsorDetail && onOpenSponsorDetail(nearestGoldShop)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onBookVenue(nearestGoldShop)}
                    className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-colors cursor-pointer shadow"
                  >
                    Book Gear / Lesson ↗
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Dock */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search boards, 4/3 wetsuits, ding repair, wax, town..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Proximity Radius */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold shrink-0">GPS Radius:</span>
          <select
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-teal-500 cursor-pointer"
          >
            <option value={30}>Within 30 km (Immediate Area)</option>
            <option value={60}>Within 60 km (Local Coast)</option>
            <option value={150}>Within 150 km (Regional)</option>
            <option value={2000}>Nationwide (All SA Surf Shops)</option>
          </select>
        </div>

        {/* Sponsor Tier Filter */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold shrink-0">Tier:</span>
          <select
            value={selectedTierFilter}
            onChange={(e) => setSelectedTierFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-teal-500 cursor-pointer"
          >
            <option value="all">All Sponsorship Tiers</option>
            <option value="gold">Gold VIP Break Sponsors Only</option>
            <option value="silver">Silver Promoted Shops</option>
            <option value="bronze">Bronze Verified Shops</option>
          </select>
        </div>
      </div>

      {/* Directory Grid with Gold tier first, closest GPS first */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base sm:text-lg font-extrabold text-white font-['Cabinet_Grotesk']">
            {searchQuery
              ? `Matching Surf Shops (${sortedShops.length})`
              : `Surf Shops Ranked by Proximity & Sponsorship (${sortedShops.length})`}
          </h3>
          <span className="text-xs text-slate-400">
            Gold tier prioritised • Sorted by closest GPS distance
          </span>
        </div>

        {sortedShops.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400">
            <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">
              No surf shops found within this radius or search query.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setRadiusKm(2000);
                setSelectedTierFilter('all');
              }}
              className="mt-2 text-xs text-teal-400 hover:text-teal-300 underline font-bold cursor-pointer"
            >
              Reset filters to show all South African surf shops
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedShops.map((shop) => {
              const isGold = shop.sponsorTier === 'gold';
              const isSilver = shop.sponsorTier === 'silver';
              const isBronze = shop.sponsorTier === 'bronze';

              return (
                <div
                  key={shop.id}
                  className={`rounded-2xl overflow-hidden flex flex-col justify-between transition-all bg-slate-900 border ${
                    isGold
                      ? 'border-amber-400/70 shadow-lg shadow-amber-950/20'
                      : isSilver
                      ? 'border-slate-300/40 shadow-sm'
                      : isBronze
                      ? 'border-amber-700/40'
                      : 'border-slate-800'
                  }`}
                >
                  {/* Photo & Header Badges */}
                  <div
                    onClick={() => onOpenSponsorDetail && onOpenSponsorDetail(shop)}
                    className="relative h-44 w-full bg-slate-800 overflow-hidden cursor-pointer group/img"
                    title="Click image to reveal details and full gallery"
                  >
                    <img
                      src={shop.image}
                      alt={shop.name}
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                    {/* Reveal hover hint */}
                    <div className="absolute inset-0 bg-slate-950/20 group-hover/img:bg-slate-950/40 transition-colors flex items-center justify-center opacity-0 group-hover/img:opacity-100">
                      <span className="px-3 py-1.5 rounded-xl bg-slate-950/90 text-white font-bold text-xs border border-white/20 shadow-lg flex items-center gap-1.5 transform translate-y-1 group-hover/img:translate-y-0 transition-transform">
                        <Eye className="w-3.5 h-3.5 text-teal-400" /> View Shop Details
                      </span>
                    </div>

                    {/* Top Left Badges: Distance & Category */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-teal-500 text-slate-950 flex items-center gap-1 shadow">
                        <MapPin className="w-2.5 h-2.5" />
                        {shop.dist !== undefined ? `${shop.dist} km away` : 'Near coast'}
                      </span>
                      {shop.sponsorTier && (
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
                          {shop.sponsorTier} Sponsor
                        </span>
                      )}
                    </div>

                    {/* Top Right Rating */}
                    <div className="absolute top-2.5 right-2.5 bg-slate-950/80 backdrop-blur-sm px-2 py-0.5 rounded-md text-xs font-bold text-amber-400 border border-slate-800 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{shop.rating}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({shop.reviewsCount})</span>
                    </div>

                    {/* Bottom title in image */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                      <h4 className="text-base font-extrabold text-white font-['Cabinet_Grotesk'] leading-tight drop-shadow-md group-hover/img:text-teal-300 transition-colors">
                        {shop.name}
                      </h4>
                      <div className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5 drop-shadow-sm">
                        <MapPin className="w-3 h-3 text-teal-400 shrink-0" />
                        <span className="truncate">{shop.town}, {shop.region}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-200">{shop.priceRange}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {shop.description}
                      </p>

                      {/* Feature chips */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {shop.features.slice(0, 3).map((feat, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800/80"
                          >
                            {feat}
                          </span>
                        ))}
                      </div>

                      {/* Promo discount badge */}
                      {shop.discountCode && (
                        <div className="mt-3 p-2 rounded-xl bg-amber-950/20 border border-amber-600/30 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                            <Tag className="w-3.5 h-3.5" />
                            <span>Save {shop.discountPercentage}%:</span>
                          </div>
                          <span className="font-mono font-bold text-amber-200 bg-amber-400/20 px-1.5 py-0.5 rounded">
                            {shop.discountCode}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Row */}
                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {shop.phone && (
                          <a
                            href={`tel:${shop.phone}`}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title={`Call ${shop.phone}`}
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {shop.whatsapp && (
                          <a
                            href={`https://wa.me/${shop.whatsapp.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 text-emerald-400 transition-colors border border-emerald-800/40"
                            title="WhatsApp Shop"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <a
                          href={`https://maps.google.com/?q=${shop.lat},${shop.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Directions on Map"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onOpenSponsorDetail && onOpenSponsorDetail(shop)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => onBookVenue(shop)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-colors cursor-pointer ${
                            isGold
                              ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm'
                              : 'bg-teal-500 hover:bg-teal-400 text-slate-950'
                          }`}
                        >
                          Book Gear ↗
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
