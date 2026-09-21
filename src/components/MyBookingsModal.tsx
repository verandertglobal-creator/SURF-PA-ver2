import React from 'react';
import { BookingReservation } from '../types';
import { X, Calendar, MapPin, CheckCircle2, Ticket, ArrowUpRight } from 'lucide-react';

interface MyBookingsModalProps {
  bookings: BookingReservation[];
  onClose: () => void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({ bookings, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-5 sm:p-7 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
              Account Management
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white font-['Cabinet_Grotesk']">
            My Coastal Bookings ({bookings.length})
          </h2>
          <p className="text-xs text-slate-400">
            Active and upcoming surf lodge, lesson, and restaurant reservations
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="py-12 text-center text-slate-400 bg-slate-950/50 rounded-2xl border border-slate-800 p-6">
            <Ticket className="w-12 h-12 text-slate-600 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-300">No active bookings yet</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Find a surf lodge near your favorite break or reserve a post-surf table to view your vouchers here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-2 mb-2">
                  <div>
                    <h3 className="font-extrabold text-sm text-white font-['Cabinet_Grotesk']">
                      {booking.venueName}
                    </h3>
                    <span className="text-[11px] font-mono text-teal-300 font-bold">
                      Ref: {booking.referenceNumber}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase">
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Date & Time</span>
                    <span className="font-semibold text-white">
                      {booking.date} {booking.timeSlot ? `• ${booking.timeSlot}` : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Party Size</span>
                    <span>{booking.partySize} Guest(s)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Deposit Paid</span>
                    <span className="font-bold text-emerald-400">R{booking.depositPaidZar}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Guest Name</span>
                    <span>{booking.guestName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
