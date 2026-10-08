import React, { useState } from 'react';
import { Activity, Droplets, Heart, Flame, Clock, Check, Copy, Star, Video, Zap, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { RECOVERY_SESSION_DATA, MEALS_DATA, NUTRITIONISTS_DATA, MealItem, Nutritionist } from '../../data/mockData';

interface RecoveryScreenProps {
  onAddToCart: (meal: MealItem) => void;
  onOpenConsultModal: (nutritionist: Nutritionist) => void;
  onCopyReferral: () => void;
  referralCopied: boolean;
}

export const RecoveryScreen: React.FC<RecoveryScreenProps> = ({
  onAddToCart,
  onOpenConsultModal,
  onCopyReferral,
  referralCopied,
}) => {
  const recoveryMeal = MEALS_DATA.find((m) => m.id === 'meal-03') || MEALS_DATA[0];
  const [hydrationLogged, setHydrationLogged] = useState(false);

  return (
    <div className="space-y-6 pb-24 md:pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <span className="text-[10px] font-bold tracking-widest text-[#22E07A] uppercase">
          Match Telemetry & Rehabilitation
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Post-Game Recovery Lab
        </h1>
        <p className="text-xs sm:text-sm text-[#9AA4B2] mt-0.5">
          Real-time cardiovascular analysis, muscular stress mapping & targeted replenishment.
        </p>
      </div>

      {/* Recovery status card: Session summary + muscle-strain & hydration indicators */}
      <section className="p-5 sm:p-6 rounded-3xl bg-[#141C2B] border border-white/10 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/8">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22E07A] animate-pulse" />
              <span className="text-[10px] font-bold tracking-widest text-[#22E07A] uppercase">
                Last Session Logged · 45 mins ago
              </span>
            </div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-white mt-0.5">
              {RECOVERY_SESSION_DATA.sport}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#9AA4B2]">
            <span>Optimal recovery window:</span>
            <span className="font-bold text-[#22E07A]">Active Next 90 Mins</span>
          </div>
        </div>

        {/* 3 Telemetry Metrics */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 text-center">
          <div className="p-3 sm:p-4 rounded-2xl bg-[#0B1220] border border-white/5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-[#FF7A1A] flex items-center justify-center mx-auto mb-1.5">
              <Flame className="w-4 h-4" />
            </div>
            <div className="font-display text-xl sm:text-2xl font-bold text-white tabular-nums">
              {RECOVERY_SESSION_DATA.caloriesBurned}
            </div>
            <div className="text-[10px] sm:text-xs text-[#9AA4B2] uppercase font-semibold mt-0.5">
              Calories Burned
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-[#0B1220] border border-white/5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-[#22E07A] flex items-center justify-center mx-auto mb-1.5">
              <Clock className="w-4 h-4" />
            </div>
            <div className="font-display text-xl sm:text-2xl font-bold text-white tabular-nums">
              {RECOVERY_SESSION_DATA.durationMinutes}m
            </div>
            <div className="text-[10px] sm:text-xs text-[#9AA4B2] uppercase font-semibold mt-0.5">
              Court Duration
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-[#0B1220] border border-white/5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-1.5">
              <Heart className="w-4 h-4" />
            </div>
            <div className="font-display text-xl sm:text-2xl font-bold text-white tabular-nums">
              {RECOVERY_SESSION_DATA.averageHeartRate}
            </div>
            <div className="text-[10px] sm:text-xs text-[#9AA4B2] uppercase font-semibold mt-0.5">
              Avg BPM (Peak {RECOVERY_SESSION_DATA.peakHeartRate})
            </div>
          </div>
        </div>

        {/* Muscle-strain and Hydration Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Muscle-Strain Map */}
          <div className="p-4 rounded-2xl bg-[#0B1220] border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#FF7A1A]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Muscle Fatigue & Strain Zones
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">OPTICAL SENSORS</span>
            </div>

            <div className="space-y-2.5">
              {RECOVERY_SESSION_DATA.muscleFatigueZones.map((zone, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{zone.zone}</span>
                    <span className="font-semibold text-slate-200">
                      {zone.level} ({zone.percentage}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${zone.percentage}%`,
                        backgroundColor: zone.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hydration Indicator */}
          <div className="p-4 rounded-2xl bg-[#0B1220] border border-white/5 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-sky-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Hydration & Electrolyte Status
                  </h3>
                </div>
                <span className="text-[10px] text-sky-400 font-bold uppercase">
                  {hydrationLogged ? 'REHYDRATING' : 'DEFICIT'}
                </span>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#9AA4B2]">Estimated Fluid Loss:</span>
                  <span className="font-bold text-white">
                    -{RECOVERY_SESSION_DATA.hydrationDeficitMl} ml
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9AA4B2]">Electrolyte Deficit:</span>
                  <span className="font-bold text-amber-400">
                    -{RECOVERY_SESSION_DATA.electrolytesLossMg} mg Sodium / K+
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-sky-950/40 border border-sky-500/20 text-sky-200 text-[11px] leading-relaxed">
                  Recommended: Ingest 800ml chilled fluid enriched with sodium, potassium, and magnesium within 30 minutes.
                </div>
              </div>
            </div>

            <button
              onClick={() => setHydrationLogged(!hydrationLogged)}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
                hydrationLogged
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  : 'bg-sky-500 text-[#0B1220] hover:bg-sky-400'
              }`}
            >
              {hydrationLogged ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Logged 800ml Electrolyte Water</span>
                </>
              ) : (
                <>
                  <Droplets className="w-3.5 h-3.5" />
                  <span>Log 800ml Rehydration Fluid</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* "Immediate Post-Court Fuel" Feature Card */}
      <section className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#141C2B] via-[#172338] to-[#121c2d] border border-[#22E07A]/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 bg-slate-800">
              <img
                src={recoveryMeal.imageUrl}
                alt={recoveryMeal.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-[#FF7A1A] text-white text-[9px] font-black uppercase">
                URGENT FUEL
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#22E07A] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Immediate Post-Court Fuel (Kitchen Direct)</span>
              </div>

              <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                {recoveryMeal.name}
              </h3>

              <p className="text-xs text-[#9AA4B2] max-w-md leading-relaxed">
                Hydrolyzed whey isolate for micro-tear repair paired with wild acai electrolytes to cease post-match muscle cramps.
              </p>

              <div className="flex items-center gap-3 text-xs text-slate-300 pt-1">
                <span className="font-bold text-[#22E07A]">{recoveryMeal.macros.protein}g Whey Protein</span>
                <span>·</span>
                <span>{recoveryMeal.macros.carbs}g Carbs</span>
                <span>·</span>
                <span className="text-emerald-400">{recoveryMeal.prepTimeMinutes} mins prep</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-end gap-2">
            <div className="text-right">
              <span className="text-[10px] text-[#9AA4B2] uppercase font-bold">Kitchen Price</span>
              <div className="font-display text-xl font-bold text-white">
                S${recoveryMeal.price.toFixed(2)}
              </div>
            </div>

            <button
              onClick={() => onAddToCart(recoveryMeal)}
              className="w-full sm:w-auto py-3 px-6 rounded-full bg-[#22E07A] text-[#0B1220] font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#1fcf6f] active:scale-95 transition-all shadow-[0_0_20px_rgba(34,224,122,0.35)]"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>1-Tap Order to Kitchen</span>
            </button>
          </div>
        </div>
      </section>

      {/* "Board-Certified Nutritionists" List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#22E07A] uppercase">
              Elite Tele-Health Care
            </span>
            <h2 className="font-display text-xl font-bold text-white tracking-tight">
              Board-Certified Sports Nutritionists
            </h2>
          </div>
          <span className="text-xs text-[#9AA4B2]">Singapore Licensed Dietitians</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {NUTRITIONISTS_DATA.map((doc) => (
            <div
              key={doc.id}
              className="p-4 sm:p-5 rounded-2xl bg-[#141C2B] border border-white/8 hover:border-white/15 transition-all flex flex-col justify-between space-y-4 shadow-lg"
            >
              <div>
                <div className="flex items-start gap-3">
                  <img
                    src={doc.imageUrl}
                    alt={doc.name}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0 bg-slate-800 border border-white/10"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-[#22E07A]">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{doc.rating}</span>
                      <span className="text-[#9AA4B2] font-normal">({doc.reviewsCount})</span>
                    </div>
                    <h3 className="font-display text-sm font-bold text-white truncate mt-0.5">
                      {doc.name}
                    </h3>
                    <p className="text-[10px] text-[#9AA4B2] line-clamp-1 mt-0.5">
                      {doc.credentials}
                    </p>
                  </div>
                </div>

                <div className="mt-3 p-2.5 rounded-xl bg-[#0B1220] border border-white/5 space-y-1">
                  <span className="text-[9px] uppercase font-bold text-[#22E07A] tracking-wider block">
                    Specialty & Focus:
                  </span>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    {doc.specialty}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/8 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#9AA4B2]">Consult Fee (30m):</span>
                  <span className="font-bold text-white">S${doc.consultationFee}.00</span>
                </div>

                <button
                  onClick={() => onOpenConsultModal(doc)}
                  className="w-full py-2.5 px-4 rounded-full bg-[#141C2B] hover:bg-[#22E07A] hover:text-[#0B1220] border border-[#22E07A] text-[#22E07A] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Book Tele-Consult</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Referral Banner: "Refer an Athlete Friend" */}
      <section className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#141C2B] via-[#1a2336] to-[#0E1524] border border-[#22E07A]/30 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-lg">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#22E07A]/15 text-[#22E07A] text-[10px] font-black uppercase tracking-wider">
              <span>COMMUNITY REWARDS</span>
            </div>
            <h3 className="font-display text-xl font-bold text-white">
              Refer an Athlete Friend · Both Get S$15
            </h3>
            <p className="text-xs text-[#9AA4B2] leading-relaxed">
              Share Kinetic Pulse with your badminton sparring partners or tennis group. They get S$15 off their first court or bento, and you receive S$15 wallet credits!
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={onCopyReferral}
              className="py-3 px-6 rounded-full bg-[#22E07A] text-[#0B1220] font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#1fcf6f] active:scale-95 transition-all shadow-[0_0_16px_rgba(34,224,122,0.3)]"
            >
              {referralCopied ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Invite Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
