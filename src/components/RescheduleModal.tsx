import React, { useState } from 'react';
import { X, Calendar, Clock, RefreshCw, ArrowRight } from 'lucide-react';
import { ScheduledGame } from '../data/mockData';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: ScheduledGame;
  onConfirmReschedule: (newDate: string, newTime: string, newCourt: string) => void;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
  isOpen,
  onClose,
  game,
  onConfirmReschedule,
}) => {
  const [selectedDay, setSelectedDay] = useState('Tomorrow, 16 Oct');
  const [selectedSlot, setSelectedSlot] = useState('20:00 - 21:00');
  const [selectedCourt, setSelectedCourt] = useState('Court 04');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleReschedule = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirmReschedule(selectedDay, selectedSlot, selectedCourt);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0B1220] border border-white/10 rounded-3xl shadow-2xl p-5 sm:p-6 text-slate-100 z-10">
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#FF7A1A] uppercase">
              Free Rescheduling (ActivePass)
            </span>
            <h3 className="font-display text-lg font-bold text-white mt-0.5">
              Change Game Schedule
            </h3>
            <p className="text-xs text-[#9AA4B2] mt-0.5">
              Currently: {game.venueName} · {game.date} ({game.time})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-[11px] font-bold text-[#9AA4B2] uppercase tracking-wider block mb-2">
              Select New Date
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {['Tomorrow, 16 Oct', 'Thu, 17 Oct', 'Fri, 18 Oct'].map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    selectedDay === d
                      ? 'border-[#22E07A] bg-[#22E07A]/15 text-white font-bold'
                      : 'border-white/5 bg-[#141C2B] text-[#9AA4B2]'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 mx-auto mb-1 opacity-70" />
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#9AA4B2] uppercase tracking-wider block mb-2">
              Select Available Slot
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['19:00 - 20:00', '20:00 - 21:00', '21:00 - 22:00', '22:00 - 23:00'].map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-2 px-3 rounded-xl border text-center transition-all ${
                    selectedSlot === slot
                      ? 'border-[#22E07A] bg-[#22E07A] text-[#0B1220] font-bold'
                      : 'border-white/5 bg-[#141C2B] text-slate-300'
                  }`}
                >
                  <Clock className="w-3 h-3 inline mr-1.5" />
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#9AA4B2] uppercase tracking-wider block mb-2">
              Target Court
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {['Court 02', 'Court 04', 'Court 06'].map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCourt(c)}
                  className={`py-2 rounded-xl border text-center font-medium transition-all ${
                    selectedCourt === c
                      ? 'border-[#22E07A] bg-[#22E07A]/10 text-white font-bold'
                      : 'border-white/5 bg-[#141C2B] text-[#9AA4B2]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#141C2B] border border-white/8 text-xs text-[#9AA4B2]">
            <span className="text-[#22E07A] font-semibold">ActivePass Benefit:</span> No cancellation penalties or rescheduling fee applied. Your courtside meal delivery will automatically synchronize to your new slot!
          </div>

          <button
            onClick={handleReschedule}
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-full bg-[#22E07A] text-[#0B1220] font-display font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#1fcf6f] transition-all shadow-[0_0_16px_rgba(34,224,122,0.3)] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Updating Booking...</span>
              </>
            ) : (
              <>
                <span>Confirm Reschedule</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
