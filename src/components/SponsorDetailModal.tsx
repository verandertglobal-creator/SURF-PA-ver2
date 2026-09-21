import React from 'react';
import { Venue } from '../types';
import { X, Sparkles, Star, MapPin, Phone, MessageCircle, ExternalLink, Calendar, Tag, ShieldCheck } from 'lucide-react';

interface SponsorDetailModalProps {
  venue: Venue | null;
  onClose: () => void;
  onBookVenue: (venue: Venue) => void;
}

export const SponsorDetailModal: React.FC<SponsorDetailModalProps> = ({
  venue,
  onClose,
  onBookVenue
}) => {
  if (!venue) return null;

  const isGold = venue.sponsorTier === 'gold';
  const isSilver = venue.sponsorTier === 'silver';
  const isBronze = venue.sponsorTier === 'bronze';

  const tierBadgeConfig = isGold
    ? {
        name: 'Gold Break Partner',
        bg: 'bg-amber-400 text-slate-950 font-black',
        border: 'border-amber-400',
        gradient: 'from-amber-500/20 via-yellow-500/10 to-slate-900',
        textAccent: 'text-amber-400'
      }
    : isSilver
    ? {
        name: 'Silver Growth Partner',
        bg: 'bg-slate-200 text-slate-950 font-black',
        border: 'border-slate-300',
        gradient: 'from-slate-700/20 via-slate-800/10 to-slate-900',
        textAccent: 'text-slate-200'
      }
    : {
        name: 'Bronze Verified Partner',
        bg: 'bg-amber-800 text-amber-100 font-bold',
        border: 'border-amber-700',
        gradient: 'from-amber-950/20 via-slate-900 to-slate-900',
        textAccent: 'text-amber-300'
      };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl text-slate-100 theme-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white transition-colors cursor-pointer border border-slate-700"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Photo / Presentation Banner */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-800 overflow-hidden rounded-t-3xl">
          <img
            src={venue.image}
            alt={venue.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

          {/* Tier & Verification Ribbon */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
            <span className={`text-xs px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-lg ${tierBadgeConfig.bg}`}>
              <Sparkles className="w-3.5 h-3.5" />
              {tierBadgeConfig.name}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-sm text-white font-bold border border-slate-700 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Verified Local ZA Business
            </span>
          </div>

          {/* Rating Badge */}
          <div className="absolute bottom-4 right-4 bg-slate-950/90 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5 shadow-lg">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-black text-amber-400">{venue.rating}</span>
            <span className="text-xs text-slate-400">({venue.reviewsCount} reviews)</span>
          </div>
        </div>

        {/* Details & Sponsor Story */}
        <div className="p-5 sm:p-7 space-y-5">
          {/* Title & Location */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
              <span>{venue.category.toUpperCase()}</span>
              <span>•</span>
              <span className="text-slate-400">{venue.priceRange} Price Tier</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-['Cabinet_Grotesk']">
              {venue.name}
            </h2>
            <div className="flex items-center gap-1.5 text-sm text-slate-300 mt-1">
              <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
              <span>{venue.address || `${venue.town}, ${venue.region}`}</span>
            </div>
            {venue.sponsorTagline && (
              <p className="mt-2 text-sm italic font-medium text-amber-300/90 border-l-2 border-amber-400 pl-2.5">
                "{venue.sponsorTagline}"
              </p>
            )}
          </div>

          {/* Exclusive Promo Discount Code Card */}
          {venue.discountCode && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent border border-amber-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-black uppercase text-amber-300">
                  <Tag className="w-4 h-4 text-amber-400" />
                  <span>Exclusive Surf South Africa Promo</span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Quote code at checkout or reservation for instant savings:
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-mono font-black text-amber-300 bg-amber-400/20 px-3 py-1 rounded-xl border border-amber-400/40">
                  {venue.discountCode}
                </span>
                <span className="text-xs font-bold text-slate-300">
                  (-{venue.discountPercentage}%)
                </span>
              </div>
            </div>
          )}

          {/* Full Description */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
              About This Venue
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {venue.description}
            </p>
          </div>

          {/* Amenities & Highlights */}
          {venue.features && venue.features.length > 0 && (
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                Surf-Friendly Amenities & Offerings
              </h4>
              <div className="flex flex-wrap gap-2">
                {venue.features.map((feat, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-950 text-slate-200 border border-slate-800 flex items-center gap-1.5"
                  >
                    <span className="text-teal-400">✓</span> {feat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Row: Direct Contact & Instant Booking */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {venue.phone && (
                <a
                  href={`tel:${venue.phone}`}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-teal-400" />
                  <span>Call Direct</span>
                </a>
              )}
              {venue.whatsapp && (
                <a
                  href={`https://wa.me/${venue.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp</span>
                </a>
              )}
              {venue.website && (
                <a
                  href={venue.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                  <span>Website</span>
                </a>
              )}
            </div>

            {venue.bookable && (
              <button
                onClick={() => {
                  onClose();
                  onBookVenue(venue);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-400 hover:to-sky-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-teal-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-slate-950" />
                <span>
                  {venue.bookingType === 'room'
                    ? 'Reserve Room / Stay'
                    : venue.bookingType === 'table'
                    ? 'Book Table'
                    : 'Book Session / Gear'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
