import React, { useState } from 'react';
import { X, Check, Save } from 'lucide-react';
import { AutobookingConfig } from '../data/mockData';

interface AutobookEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: AutobookingConfig;
  onSaveConfig: (updated: Partial<AutobookingConfig>) => void;
}

export const AutobookEditModal: React.FC<AutobookEditModalProps> = ({
  isOpen,
  onClose,
  currentConfig,
  onSaveConfig,
}) => {
  const [preferredDay, setPreferredDay] = useState(currentConfig.preferredDay);
  const [preferredTime, setPreferredTime] = useState(currentConfig.preferredTime);
  const [sport, setSport] = useState(currentConfig.sport);
  const [venue, setVenue] = useState(currentConfig.venue);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveConfig({
      preferredDay,
      preferredTime,
      sport,
      venue,
      nextAutoBookedSlot: `${preferredDay.split('&')[0].trim()} · ${preferredTime.split('-')[0].trim()} Court 04`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0B1220] border border-white/10 rounded-3xl shadow-2xl p-5 text-slate-100 z-10">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#22E07A] uppercase">
              Configure Automation
            </span>
            <h3 className="font-display text-base font-bold text-white mt-0.5">
              Edit Autobooking Rule
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          <div>
            <label className="text-[10px] font-bold text-[#9AA4B2] uppercase block mb-1.5">
              Target Sport
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Badminton', 'Tennis', 'Pickleball', 'Futsal'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSport(s)}
                  className={`py-2 px-3 rounded-xl border text-center transition-colors ${
                    sport === s
                      ? 'border-[#22E07A] bg-[#22E07A]/15 text-white font-bold'
                      : 'border-white/5 bg-[#141C2B] text-[#9AA4B2]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#9AA4B2] uppercase block mb-1.5">
              Preferred Singapore Venue
            </label>
            <select
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#141C2B] border border-white/10 text-white focus:outline-none focus:border-[#22E07A]"
            >
              <option value="OCBC Arena Kallang">OCBC Arena (Singapore Sports Hub)</option>
              <option value="Marina Bay ActiveArena Courts">Marina Bay ActiveArena Courts</option>
              <option value="Bishan Clubhouse & Sports Hall">Bishan Clubhouse & Sports Hall</option>
              <option value="Jurong West ActiveSG Sports Complex">Jurong West ActiveSG Complex</option>
              <option value="Heartbeat@Bedok Sports Hub">Heartbeat@Bedok Sports Hub</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#9AA4B2] uppercase block mb-1.5">
              Weekly Days
            </label>
            <input
              type="text"
              value={preferredDay}
              onChange={(e) => setPreferredDay(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#141C2B] border border-white/10 text-white focus:outline-none focus:border-[#22E07A]"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#9AA4B2] uppercase block mb-1.5">
              Target Time Slot
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['19:00 - 20:00', '20:00 - 21:00', '21:00 - 22:00', '07:00 - 08:00'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setPreferredTime(t)}
                  className={`py-2 px-2.5 rounded-xl border text-center transition-colors ${
                    preferredTime === t
                      ? 'border-[#22E07A] bg-[#22E07A]/15 text-white font-bold'
                      : 'border-white/5 bg-[#141C2B] text-[#9AA4B2]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3 rounded-full bg-[#22E07A] text-[#0B1220] font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#1fcf6f] transition-all shadow-[0_0_14px_rgba(34,224,122,0.3)]"
          >
            <Save className="w-4 h-4" />
            <span>Save Automation Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
