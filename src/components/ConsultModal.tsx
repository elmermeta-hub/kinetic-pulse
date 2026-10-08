import React, { useState } from 'react';
import { X, Calendar, Clock, Video, ShieldCheck, ArrowRight } from 'lucide-react';
import { Nutritionist } from '../data/mockData';

interface ConsultModalProps {
  isOpen: boolean;
  onClose: () => void;
  nutritionist: Nutritionist | null;
  onConfirmConsult: (booking: {
    nutritionist: Nutritionist;
    date: string;
    time: string;
    focus: string;
  }) => void;
}

export const ConsultModal: React.FC<ConsultModalProps> = ({
  isOpen,
  onClose,
  nutritionist,
  onConfirmConsult,
}) => {
  const [selectedDate, setSelectedDate] = useState('Tomorrow, 16 Oct');
  const [selectedTime, setSelectedTime] = useState('14:00 - 14:30');
  const [focusArea, setFocusArea] = useState('Pre/Post-Match Fueling & Hydration');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !nutritionist) return null;

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirmConsult({
        nutritionist,
        date: selectedDate,
        time: selectedTime,
        focus: focusArea,
      });
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0B1220] border border-white/10 rounded-3xl shadow-2xl p-5 sm:p-6 text-slate-100 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img
              src={nutritionist.imageUrl}
              alt={nutritionist.name}
              className="w-12 h-12 rounded-2xl object-cover border border-white/10"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#22E07A] uppercase">
                Tele-Health Sports Consultation
              </span>
              <h3 className="font-display text-base font-bold text-white mt-0.5">
                {nutritionist.name}
              </h3>
              <p className="text-xs text-[#9AA4B2]">{nutritionist.credentials}</p>
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
          <div>
            <label className="text-[11px] font-bold text-[#9AA4B2] uppercase tracking-wider block mb-2">
              Select Consult Date
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {['Tomorrow, 16 Oct', 'Fri, 17 Oct', 'Sat, 18 Oct'].map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDate(d)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    selectedDate === d
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
              Select 30-Min Tele-Slot
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {['11:00 - 11:30', '14:00 - 14:30', '16:30 - 17:00'].map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    selectedTime === time
                      ? 'border-[#22E07A] bg-[#22E07A] text-[#0B1220] font-bold'
                      : 'border-white/5 bg-[#141C2B] text-slate-300'
                  }`}
                >
                  <Clock className="w-3 h-3 inline mr-1" />
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#9AA4B2] uppercase tracking-wider block mb-2">
              Consultation Goal & Focus
            </label>
            <div className="space-y-1.5 text-xs">
              {[
                'Pre/Post-Match Fueling & Hydration',
                'Accelerated Muscle Glycogen Recovery',
                'Body Composition & High-Protein Meal Planning',
                'Gut Health & Cramp Prevention on Court',
              ].map((goal) => (
                <button
                  key={goal}
                  onClick={() => setFocusArea(goal)}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                    focusArea === goal
                      ? 'border-[#22E07A] bg-[#22E07A]/10 text-white font-semibold'
                      : 'border-white/5 bg-[#141C2B] text-[#9AA4B2]'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#141C2B] border border-white/8 space-y-1 text-xs">
            <div className="flex justify-between text-[#9AA4B2]">
              <span>Consultation Fee (30 mins HD Video)</span>
              <span className="font-semibold text-white">S${nutritionist.consultationFee}.00</span>
            </div>
            <div className="flex justify-between text-[#22E07A]">
              <span>ActivePass Athlete Subsidized</span>
              <span className="font-semibold">-S$10.00</span>
            </div>
            <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
              <span className="font-display text-sm font-bold text-white">Payable Amount</span>
              <span className="font-display text-lg font-bold text-[#22E07A]">
                S${(nutritionist.consultationFee - 10).toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-full bg-[#22E07A] text-[#0B1220] font-display font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#1fcf6f] transition-all shadow-[0_0_16px_rgba(34,224,122,0.3)] disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Scheduling Tele-Consult...</span>
            ) : (
              <>
                <Video className="w-4 h-4" />
                <span>Book Tele-Consult (S${(nutritionist.consultationFee - 10).toFixed(2)})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#9AA4B2]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#22E07A]" />
            <span>Singapore Allied Health registered · Encrypted telehealth link sent via SMS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
