import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Check, ShieldCheck, ArrowRight } from 'lucide-react';
import { VenueItem } from '../data/mockData';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  venue: VenueItem | null;
  onConfirmBooking: (details: {
    venue: VenueItem;
    date: string;
    slot: string;
    courtNumber: string;
    totalPrice: number;
  }) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  venue,
  onConfirmBooking,
}) => {
  const [selectedDate, setSelectedDate] = useState('Tomorrow, 16 Oct');
  const [selectedSlot, setSelectedSlot] = useState(venue?.availableSlots[0] || '20:00');
  const [selectedCourt, setSelectedCourt] = useState('Court 02');
  const [addShuttlecocks, setAddShuttlecocks] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !venue) return null;

  const basePrice = venue.pricePerHour;
  const equipmentFee = addShuttlecocks ? 8.00 : 0;
  const totalPrice = basePrice + equipmentFee;

  const handleBook = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirmBooking({
        venue,
        date: selectedDate,
        slot: selectedSlot,
        courtNumber: selectedCourt,
        totalPrice,
      });
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />

      {/* Dialog */}
      <div className="relative w-full max-w-lg bg-[#0B1220] border border-white/10 rounded-3xl shadow-2xl p-5 sm:p-6 text-slate-100 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#22E07A] uppercase">
              {venue.sport} Court Booking
            </span>
            <h3 className="font-display text-lg font-bold text-white mt-0.5">
              {venue.name}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-[#9AA4B2] mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#22E07A]" />
              <span>{venue.area} · {venue.distanceKm} km away</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {/* Select Date */}
          <div>
            <label className="text-[11px] font-bold text-[#9AA4B2] uppercase tracking-wider block mb-2">
              Select Booking Date
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {['Tonight, 15 Oct', 'Tomorrow, 16 Oct', 'Thu, 17 Oct'].map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDate(d)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    selectedDate === d
                      ? 'border-[#22E07A] bg-[#22E07A]/15 text-white font-bold'
                      : 'border-white/5 bg-[#141C2B] text-[#9AA4B2] hover:border-white/10'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 mx-auto mb-1 opacity-70" />
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Select Slot */}
          <div>
            <label className="text-[11px] font-bold text-[#9AA4B2] uppercase tracking-wider block mb-2">
              Select Time Slot (1 Hour)
            </label>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {venue.availableSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-2 px-1 rounded-xl border text-center font-medium transition-all ${
                    selectedSlot === slot
                      ? 'border-[#22E07A] bg-[#22E07A] text-[#0B1220] font-bold'
                      : 'border-white/5 bg-[#141C2B] text-slate-300 hover:border-white/10'
                  }`}
                >
                  <Clock className="w-3 h-3 inline mr-1" />
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Select Court Number */}
          <div>
            <label className="text-[11px] font-bold text-[#9AA4B2] uppercase tracking-wider block mb-2">
              Available Courts
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {['Court 01 (Air-con)', 'Court 02 (Pro Matte)', 'Court 03 (Central)'].map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCourt(c)}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    selectedCourt === c
                      ? 'border-[#22E07A] bg-[#22E07A]/10 text-white font-bold'
                      : 'border-white/5 bg-[#141C2B] text-[#9AA4B2]'
                  }`}
                >
                  <div className="font-semibold text-white">{c.split(' ')[0]} {c.split(' ')[1]}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{c.split('(')[1]?.replace(')', '')}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Add-ons */}
          <div
            onClick={() => setAddShuttlecocks(!addShuttlecocks)}
            className="p-3 rounded-2xl bg-[#141C2B] border border-white/8 flex items-center justify-between cursor-pointer hover:border-white/15 transition-colors"
          >
            <div>
              <div className="text-xs font-semibold text-white">Add Tournament Shuttlecocks / Balls</div>
              <div className="text-[10px] text-[#9AA4B2] mt-0.5">Yonex AS-30 Feather Tube (3 pcs) · Ready at venue locker</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#22E07A]">+S$8.00</span>
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                  addShuttlecocks ? 'bg-[#22E07A] border-[#22E07A] text-[#0B1220]' : 'border-white/20'
                }`}
              >
                {addShuttlecocks && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>
          </div>

          {/* Pricing summary */}
          <div className="p-3.5 rounded-2xl bg-[#141C2B] border border-white/8 space-y-1.5 text-xs">
            <div className="flex justify-between text-[#9AA4B2]">
              <span>Court Rental (1 hr)</span>
              <span className="text-white font-semibold">S${basePrice.toFixed(2)}</span>
            </div>
            {addShuttlecocks && (
              <div className="flex justify-between text-[#9AA4B2]">
                <span>Tournament Shuttlecocks Tube</span>
                <span className="text-white font-semibold">S$8.00</span>
              </div>
            )}
            <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
              <span className="font-display text-sm font-bold text-white">Total Booking Fee</span>
              <span className="font-display text-lg font-bold text-[#22E07A]">
                S${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleBook}
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-full bg-[#22E07A] text-[#0B1220] font-display font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#1fcf6f] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(34,224,122,0.3)] disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-[#0B1220] border-t-transparent rounded-full animate-spin" />
                Reserving Court...
              </span>
            ) : (
              <>
                <span>Confirm Booking · S${totalPrice.toFixed(2)}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#9AA4B2]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#22E07A]" />
            <span>Instant confirmation via SMS & in-app pass. 100% refund up to 12h prior.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
