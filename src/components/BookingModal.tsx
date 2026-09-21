import React, { useState } from 'react';
import { Venue, BookingReservation } from '../types';
import { X, Calendar, Lock, CheckCircle2, ShieldCheck, Tag, CreditCard, Building2, User, Phone, Mail, ArrowRight, Printer } from 'lucide-react';

interface BookingModalProps {
  venue: Venue | null;
  onClose: () => void;
  onConfirmBooking: (booking: BookingReservation) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  venue,
  onClose,
  onConfirmBooking
}) => {
  if (!venue) return null;

  const [step, setStep] = useState<'details' | 'payment' | 'confirmed'>('details');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('10:00 AM');
  const [nights, setNights] = useState(2);
  const [partySize, setPartySize] = useState(2);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('+27 ');
  const [specialRequests, setSpecialRequests] = useState('');
  const [promoInput, setPromoInput] = useState(venue.discountCode || '');
  const [discountApplied, setDiscountApplied] = useState(venue.discountPercentage || 0);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'instant_eft' | 'payfast'>('card');
  const [cardNumber, setCardNumber] = useState('4024 •••• •••• 8912');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('884');
  const [confirmedBooking, setConfirmedBooking] = useState<BookingReservation | null>(null);

  // Compute pricing in ZAR based on venue category
  const baseRate =
    venue.category === 'stay'
      ? 850 // R850 per night
      : venue.category === 'shop'
      ? 350 // R350 per lesson/rental
      : 150; // R150 table deposit

  const rawTotal =
    venue.category === 'stay'
      ? baseRate * nights
      : venue.category === 'shop'
      ? baseRate * partySize
      : baseRate * partySize;

  const discountAmount = Math.round((rawTotal * discountApplied) / 100);
  const finalTotal = Math.max(50, rawTotal - discountAmount);
  const depositDueNow = venue.category === 'stay' ? Math.round(finalTotal * 0.3) : finalTotal;

  const handleApplyPromo = () => {
    if (promoInput.trim().toUpperCase() === (venue.discountCode || 'SURF15')) {
      setDiscountApplied(venue.discountPercentage || 15);
    } else if (promoInput.trim()) {
      setDiscountApplied(10);
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestEmail.trim()) return;
    setStep('payment');
  };

  const handleCompletePayment = () => {
    const bookingRef = `ZA-${Math.floor(100000 + Math.random() * 900000)}`;
    const newReservation: BookingReservation = {
      id: `booking-${Date.now()}`,
      referenceNumber: bookingRef,
      venueId: venue.id,
      venueName: venue.name,
      category: venue.category,
      bookingType: venue.bookingType || 'room',
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim(),
      guestPhone: guestPhone.trim(),
      date,
      timeSlot: venue.category !== 'stay' ? timeSlot : undefined,
      nights: venue.category === 'stay' ? nights : undefined,
      partySize,
      totalZar: finalTotal,
      depositPaidZar: depositDueNow,
      paymentMethod,
      status: 'confirmed',
      specialRequests: specialRequests.trim() || undefined,
      discountApplied: discountApplied > 0 ? `${discountApplied}% off` : undefined,
      createdAt: new Date().toISOString()
    };

    setConfirmedBooking(newReservation);
    onConfirmBooking(newReservation);
    setStep('confirmed');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-5 sm:p-7 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: Details */}
        {step === 'details' && (
          <div>
            <div className="mb-5">
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Secure Booking Integration
              </span>
              <h2 className="text-2xl font-extrabold text-white font-['Cabinet_Grotesk'] mt-1">
                Book with {venue.name}
              </h2>
              <p className="text-xs text-slate-400">
                {venue.town}, {venue.region} • Direct verification with instant booking reference
              </p>
            </div>

            <form onSubmit={handleProceedToPayment} className="space-y-4 text-xs">
              {/* Date & Time / Nights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    {venue.category === 'stay' ? 'Check-in Date *' : 'Reservation Date *'}
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                {venue.category === 'stay' ? (
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Length of Stay</label>
                    <select
                      value={nights}
                      onChange={(e) => setNights(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-teal-500"
                    >
                      <option value="1">1 Night (Surf Weekend)</option>
                      <option value="2">2 Nights (Weekend Swell)</option>
                      <option value="3">3 Nights (Long Weekend)</option>
                      <option value="5">5 Nights (Midweek Trip)</option>
                      <option value="7">7 Nights (Surf Safari Week)</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Time Slot</label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-teal-500"
                    >
                      <option value="07:00 AM">07:00 AM (Early Dawn Patrol)</option>
                      <option value="09:00 AM">09:00 AM (Morning Glass)</option>
                      <option value="11:30 AM">11:30 AM (Midday Session)</option>
                      <option value="02:30 PM">02:30 PM (Afternoon Tide)</option>
                      <option value="05:30 PM">05:30 PM (Sunset / Braai)</option>
                      <option value="07:30 PM">07:30 PM (Dinner & Drinks)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Party size */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  {venue.category === 'stay' ? 'Guests' : venue.category === 'shop' ? 'Participants' : 'Table Seats'}
                </label>
                <div className="flex items-center gap-3">
                  {[1, 2, 4, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPartySize(num)}
                      className={`px-4 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                        partySize === num
                          ? 'bg-teal-500 text-slate-950 font-black'
                          : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      {num} {num === 1 ? 'person' : 'people'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest Details */}
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <h4 className="font-bold text-white text-xs">Primary Guest Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. Johan Naidoo"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="johan@surfmail.co.za"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">South Africa Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="+27 82 000 0000"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Special Requests / Surf Gear Notes</label>
                  <input
                    type="text"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="e.g. Need board rack, lockable garage, late check-in after evening session..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Promo Code & Pricing Summary */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Sponsor Promo Code"
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono uppercase focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors cursor-pointer"
                  >
                    Apply Code
                  </button>
                </div>

                {discountApplied > 0 && (
                  <div className="text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>Sponsor discount active: {discountApplied}% OFF applied!</span>
                  </div>
                )}

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-slate-300">
                  <div className="flex justify-between">
                    <span>Base Amount:</span>
                    <span>R{rawTotal}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Promo Discount:</span>
                      <span>-R{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-white pt-1 border-t border-slate-800">
                    <span>Total (incl. 15% VAT):</span>
                    <span className="text-teal-400 text-sm font-black">R{finalTotal}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
                    <span>Deposit Due Now:</span>
                    <span className="font-bold text-white">R{depositDueNow}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  Bank-grade 256-bit encryption
                </span>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-teal-500/20 cursor-pointer"
                >
                  <span>Continue to Secure Payment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: Secure Payment */}
        {step === 'payment' && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Step 2 of 2
              </span>
              <h2 className="text-2xl font-extrabold text-white font-['Cabinet_Grotesk'] mt-1">
                South African Secure Gateway
              </h2>
              <p className="text-xs text-slate-400">
                Deposit amount: <strong className="text-teal-400 text-sm">R{depositDueNow}</strong> (Balance payable on arrival)
              </p>
            </div>

            {/* Gateway selection */}
            <div className="grid grid-cols-3 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'bg-teal-500/20 border-teal-400 text-teal-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Visa / MC</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('instant_eft')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
                  paymentMethod === 'instant_eft'
                    ? 'bg-teal-500/20 border-teal-400 text-teal-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Ozow EFT</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('payfast')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
                  paymentMethod === 'payfast'
                    ? 'bg-teal-500/20 border-teal-400 text-teal-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>PayFast ZA</span>
              </button>
            </div>

            {paymentMethod === 'card' && (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">CVV Security Code</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'instant_eft' && (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2">
                <p className="font-semibold text-white">Supported SA Banks for Instant Settlement:</p>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <span className="p-2 rounded bg-slate-900 border border-slate-800">FNB / RMB</span>
                  <span className="p-2 rounded bg-slate-900 border border-slate-800">Capitec Bank</span>
                  <span className="p-2 rounded bg-slate-900 border border-slate-800">Standard Bank</span>
                  <span className="p-2 rounded bg-slate-900 border border-slate-800">Nedbank / Absa</span>
                </div>
                <p className="text-[11px] text-slate-400">Zero proof-of-payment waiting; automated clearance via Ozow.</p>
              </div>
            )}

            {paymentMethod === 'payfast' && (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300">
                <p>Redirecting via PayFast 3D-Secure environment for South African debit and credit accounts.</p>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                ← Back to Details
              </button>
              <button
                type="button"
                onClick={handleCompletePayment}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Confirm & Pay Deposit (R{depositDueNow})</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Confirmed Voucher */}
        {step === 'confirmed' && confirmedBooking && (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-3xl">
              ✓
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Reservation Confirmed
              </span>
              <h2 className="text-2xl font-black text-white font-['Cabinet_Grotesk'] mt-1">
                Booking Voucher Ready
              </h2>
              <p className="text-xs text-slate-400">
                A confirmation copy was sent to <strong>{confirmedBooking.guestEmail}</strong>
              </p>
            </div>

            {/* Voucher Card */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-teal-500/40 text-left space-y-3 font-sans">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <div className="text-[10px] uppercase text-slate-400 font-bold">Booking Reference</div>
                  <div className="text-lg font-mono font-black text-teal-300">
                    {confirmedBooking.referenceNumber}
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase">
                    Paid Deposit
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Venue:</span>
                  <span className="font-bold text-white">{venue.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Location:</span>
                  <span className="text-slate-300">{venue.town}, {venue.region}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Date:</span>
                  <span className="font-bold text-white">
                    {confirmedBooking.date} {confirmedBooking.timeSlot ? `• ${confirmedBooking.timeSlot}` : ''}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Guests:</span>
                  <span className="text-slate-300">{confirmedBooking.partySize} Person(s)</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Deposit Paid:</span>
                  <span className="font-bold text-emerald-400">R{confirmedBooking.depositPaidZar}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Remaining Balance:</span>
                  <span className="text-slate-300">
                    R{confirmedBooking.totalZar - confirmedBooking.depositPaidZar} (on arrival)
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                Present this reference at {venue.name} upon arrival. Phone support: {venue.phone}.
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Voucher Receipt</span>
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-colors cursor-pointer"
              >
                Back to Surf App
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
