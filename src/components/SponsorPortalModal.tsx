import React, { useState } from 'react';
import { BusinessSponsorPlan, SponsorTier, Venue, VenueCategory, RegionKey } from '../types';
import { SPONSOR_PLANS } from '../data/curatedVenues';
import { SURF_SPOTS } from '../data/surfSpots';
import { X, Sparkles, CheckCircle2, Building, Tag, ArrowRight, ShieldCheck } from 'lucide-react';

interface SponsorPortalModalProps {
  onClose: () => void;
  onAddSponsoredBusiness: (newVenue: Venue) => void;
}

export const SponsorPortalModal: React.FC<SponsorPortalModalProps> = ({
  onClose,
  onAddSponsoredBusiness
}) => {
  const [selectedTier, setSelectedTier] = useState<SponsorTier>('silver');
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState<VenueCategory>('shop');
  const [targetSpotId, setTargetSpotId] = useState(SURF_SPOTS[0].id);
  const [phone, setPhone] = useState('+27 ');
  const [whatsapp, setWhatsapp] = useState('+27 ');
  const [address, setAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState('10');
  const [isSuccess, setIsSuccess] = useState(false);

  const targetSpot = SURF_SPOTS.find((s) => s.id === targetSpotId) || SURF_SPOTS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;

    const defaultImage =
      category === 'stay'
        ? 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'
        : category === 'eat'
        ? 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
        : category === 'shop'
        ? 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80';

    const newVenue: Venue = {
      id: `sponsor-${Date.now()}`,
      name: businessName.trim(),
      category,
      town: targetSpot.town,
      region: targetSpot.region,
      lat: targetSpot.lat + (Math.random() - 0.5) * 0.015,
      lng: targetSpot.lng + (Math.random() - 0.5) * 0.015,
      address: address.trim() || `${targetSpot.town} Coastal Road`,
      phone: phone.trim() || '+27 21 000 0000',
      whatsapp: whatsapp.trim() || undefined,
      website: website.trim() || undefined,
      description:
        description.trim() ||
        `Verified ${category} proudly supporting local surfers at ${targetSpot.name}. Specialising in authentic South African coastal service.`,
      image: customImageUrl.trim() || defaultImage,
      rating: 5.0,
      reviewsCount: 1,
      priceRange: 'RR',
      features: ['Local Surf Discount', 'Verified Business', 'Proximity Connect'],
      sponsorTier: selectedTier,
      sponsorTagline: `Official ${selectedTier.toUpperCase()} Partner of ${targetSpot.name}`,
      discountCode: promoCode.trim() ? promoCode.toUpperCase() : undefined,
      discountPercentage: promoCode.trim() ? Number(discountPercent) : undefined,
      bookable: true,
      bookingType: category === 'stay' ? 'room' : category === 'eat' || category === 'drinks' ? 'table' : 'gear'
    };

    onAddSponsoredBusiness(newVenue);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-5 sm:p-7 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-3xl">
              ✓
            </div>
            <h3 className="text-2xl font-extrabold text-white font-['Cabinet_Grotesk']">
              Sponsor Slot Activated!
            </h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              <strong>{businessName}</strong> is now live as an official{' '}
              <span className="uppercase text-amber-300 font-bold">{selectedTier} Sponsor</span> targeted for{' '}
              <strong>{targetSpot.name}</strong>. Surfers browsing this break and surrounding area will see your business listing and promo badge immediately.
            </p>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-colors cursor-pointer"
              >
                View Live Directory
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> South Africa Coastal Ads
                </span>
                <span className="text-xs text-slate-400">Targeted Local Visibility Model</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Cabinet_Grotesk']">
                3-Tier Business Sponsor Slots
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Advertise your surf shop, coastal lodge, or beachfront eatery to local surfers and tourists visiting South Africa's top breaks. Zero booking commissions.
              </p>
            </div>

            {/* 3-Tier Pricing Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              {SPONSOR_PLANS.map((plan) => {
                const isSelected = selectedTier === plan.tier;
                return (
                  <div
                    key={plan.tier}
                    onClick={() => setSelectedTier(plan.tier)}
                    className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? `${plan.badgeColor} ring-2 ring-amber-400/50 shadow-lg`
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {plan.isPopular && (
                      <span className="absolute -top-2.5 right-4 text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-teal-400 text-slate-950 shadow-sm">
                        Most Popular
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm uppercase tracking-wider">{plan.title}</span>
                        <input
                          type="radio"
                          name="tier"
                          checked={isSelected}
                          onChange={() => setSelectedTier(plan.tier)}
                          className="accent-amber-400 cursor-pointer"
                        />
                      </div>

                      <div className="my-2.5">
                        <span className="text-2xl font-black text-white">R{plan.priceZarMonthly}</span>
                        <span className="text-xs text-slate-400"> / month</span>
                      </div>

                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {plan.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                            <span className="text-[11px] leading-tight">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 pt-2 border-t border-slate-800/80 text-center">
                      <span className="text-[11px] font-bold text-slate-300">
                        {isSelected ? '✓ Selected Plan' : 'Click to Select'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Application & Registration Form */}
            <form onSubmit={handleSubmit} className="bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-teal-400" />
                  <span>Register & Activate Your Business Slot</span>
                </h3>
                <span className="text-xs text-amber-300 font-bold uppercase">
                  Tier: {selectedTier.toUpperCase()} (R
                  {SPONSOR_PLANS.find((p) => p.tier === selectedTier)?.priceZarMonthly}/mo)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Business Name */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Business Name *</label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. J-Bay Surf Co. / Cape Waves Lodge"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* Business Category */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Business Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as VenueCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="shop">🏄 Surf Shop, Board Rental & Coaching</option>
                    <option value="stay">🛏️ Coastal Accommodation & Surf Lodge</option>
                    <option value="eat">🍽️ Restaurant, Surf Cafe & Bakery</option>
                    <option value="drinks">🍹 Beach Bar, Taproom & Sunset Lounge</option>
                  </select>
                </div>

                {/* Target Coastal Break */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Target Coastal Surf Break *</label>
                  <select
                    value={targetSpotId}
                    onChange={(e) => setTargetSpotId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-teal-500"
                  >
                    {SURF_SPOTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.town}, {s.region})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Physical Address */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Physical Street Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 12 Beach Road, Yzerfontein"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Phone Number (South Africa) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+27 21 000 0000"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">WhatsApp Connect</label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+27 82 000 0000"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* Promo Deal Code */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Surf Perk Promo Code (Optional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="e.g. SURFZA15"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 uppercase font-mono"
                    />
                    <select
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(e.target.value)}
                      className="w-24 px-2 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none"
                    >
                      <option value="5">5% off</option>
                      <option value="10">10% off</option>
                      <option value="15">15% off</option>
                      <option value="20">20% off</option>
                    </select>
                  </div>
                </div>

                {/* Website */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Website URL</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* Custom Photo URL */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 font-semibold mb-1">
                    Showcase Photo Image URL (Optional - click-to-reveal on sponsor cards)
                  </label>
                  <input
                    type="url"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or your website image URL (defaults to high-res coastal photo)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="text-xs">
                <label className="block text-slate-400 font-semibold mb-1">
                  Short Business Description / Pitch for Surfers
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell visiting surfers what makes your venue special (e.g., ocean views, hot showers, board racks, fresh seafood, fast ding repairs)..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Direct lead routing • Cancel or upgrade tier at any time</span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Activate {selectedTier.toUpperCase()} Listing (R{SPONSOR_PLANS.find((p) => p.tier === selectedTier)?.priceZarMonthly}/mo)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
