import React from 'react';
import { X, MapPin, Navigation, Compass, Train, Car, Copy, Check } from 'lucide-react';
import { ScheduledGame } from '../data/mockData';

interface DirectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: ScheduledGame;
  onCopyAddress: () => void;
  copied: boolean;
}

export const DirectionsModal: React.FC<DirectionsModalProps> = ({
  isOpen,
  onClose,
  game,
  onCopyAddress,
  copied,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0B1220] border border-white/10 rounded-3xl shadow-2xl p-5 sm:p-6 text-slate-100 z-10">
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#22E07A] uppercase">
              Venue Directions & Access
            </span>
            <h3 className="font-display text-lg font-bold text-white mt-0.5">
              {game.venueName}
            </h3>
            <p className="text-xs text-[#9AA4B2] mt-0.5">{game.courtNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {/* Address card */}
          <div className="p-3.5 rounded-2xl bg-[#141C2B] border border-white/8 flex items-center justify-between gap-3">
            <div className="flex items-start gap-2.5 min-w-0">
              <MapPin className="w-5 h-5 text-[#22E07A] shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-white">{game.address}</div>
                <div className="text-[10px] text-[#9AA4B2] mt-0.5">GPS: 1.3039° N, 103.8749° E</div>
              </div>
            </div>
            <button
              onClick={onCopyAddress}
              className="px-2.5 py-1.5 rounded-lg bg-[#0B1220] hover:bg-white/5 border border-white/10 text-xs font-semibold text-white shrink-0 flex items-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#22E07A]" />
                  <span className="text-[#22E07A]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Transit options in SG */}
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-2xl bg-[#141C2B] border border-white/8 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <Train className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-white">MRT Subway Connection</h4>
                <p className="text-[11px] text-[#9AA4B2] mt-0.5 leading-relaxed">
                  Take the Circle Line to <strong className="text-white">Stadium MRT (CC6)</strong>. Take Exit B, walk sheltered 3 minutes straight into OCBC Arena Hall 1–3.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#141C2B] border border-white/8 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                <Car className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Parking & Drop-off</h4>
                <p className="text-[11px] text-[#9AA4B2] mt-0.5 leading-relaxed">
                  Car Park B (Kallang Wave Mall basement) or OCBC Arena surface lot. Kinetic Pulse smart lockers are located opposite Level 1 shower facilities.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#141C2B] border border-white/8 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#22E07A]/10 text-[#22E07A] flex items-center justify-center shrink-0">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Court Access Code</h4>
                <p className="text-[11px] text-[#9AA4B2] mt-0.5 leading-relaxed">
                  Scan your in-app QR code or tap NFC at Turnstile Gate C. Court lighting switches on 5 minutes prior to 20:00.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(game.address)}`, '_blank');
            }}
            className="w-full py-3 rounded-full bg-[#22E07A] text-[#0B1220] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#1fcf6f] transition-all"
          >
            <Navigation className="w-4 h-4" />
            <span>Open in Maps App</span>
          </button>
        </div>
      </div>
    </div>
  );
};
