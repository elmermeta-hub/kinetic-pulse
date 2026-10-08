import React from 'react';
import { Calendar, Clock, MapPin, Plus, ArrowRight, Sparkles, Navigation, RefreshCw, Flame, Award, ChevronRight } from 'lucide-react';
import { USER_DATA, NEXT_GAME, MEALS_DATA, VENUES_DATA, ScheduledGame, MealItem, VenueItem } from '../../data/mockData';

interface HomeScreenProps {
  onNavigateTab: (tab: string) => void;
  onOpenDirections: (game: ScheduledGame) => void;
  onOpenReschedule: (game: ScheduledGame) => void;
  onAddToCart: (meal: MealItem) => void;
  onOpenBooking: (venue: VenueItem) => void;
  onClaimPromo: () => void;
  nextGame: ScheduledGame;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateTab,
  onOpenDirections,
  onOpenReschedule,
  onAddToCart,
  onOpenBooking,
  onClaimPromo,
  nextGame,
}) => {
  return (
    <div className="space-y-6 pb-24 md:pb-12 animate-in fade-in duration-200">
      {/* Greeting & Quick Action Hero */}
      <section className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#141C2B] via-[#141C2B] to-[#172338] border border-white/10 shadow-xl relative overflow-hidden">
        {/* Subtle decorative athletic light streak */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-[#22E07A]/10 to-transparent blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold tracking-widest text-[#22E07A] uppercase">
                {USER_DATA.passTier}
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-[11px] font-semibold text-[#9AA4B2]">
                Level {USER_DATA.level} Athlete
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Welcome back, {USER_DATA.name}!
            </h1>
            <p className="text-xs sm:text-sm text-[#9AA4B2] mt-1 max-w-md leading-relaxed">
              Court ready tonight at OCBC Arena. Fuel up with protein-timed meal prep right after match point.
            </p>
          </div>

          {/* Quick-action buttons: "Book Court", "Healthy Meal Prep" */}
          <div className="flex items-center gap-2.5 shrink-0 pt-2 md:pt-0">
            <button
              onClick={() => onNavigateTab('courts')}
              className="flex-1 sm:flex-none py-2.5 px-4 rounded-full bg-[#22E07A] text-[#0B1220] font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#1fcf6f] active:scale-95 transition-all shadow-[0_0_16px_rgba(34,224,122,0.3)]"
            >
              <Calendar className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Book Court</span>
            </button>
            <button
              onClick={() => onNavigateTab('kitchen')}
              className="flex-1 sm:flex-none py-2.5 px-4 rounded-full bg-[#141C2B] hover:bg-slate-800 border border-white/15 text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Flame className="w-3.5 h-3.5 text-[#FF7A1A]" />
              <span>Healthy Meal Prep</span>
            </button>
          </div>
        </div>

        {/* Quick athlete telemetry mini strip */}
        <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-white/8 text-center sm:text-left">
          <div className="p-2 sm:p-2.5 rounded-xl bg-[#0B1220]/60 border border-white/5">
            <div className="text-[10px] text-[#9AA4B2] uppercase font-semibold">Weekly Matches</div>
            <div className="text-base sm:text-lg font-bold font-display text-white mt-0.5 tabular-nums">
              {USER_DATA.weeklySessionsCount} Sessions
            </div>
          </div>
          <div className="p-2 sm:p-2.5 rounded-xl bg-[#0B1220]/60 border border-white/5">
            <div className="text-[10px] text-[#9AA4B2] uppercase font-semibold">Kinetic Fuel Pts</div>
            <div className="text-base sm:text-lg font-bold font-display text-[#22E07A] mt-0.5 tabular-nums">
              {USER_DATA.points} Pts
            </div>
          </div>
          <div className="p-2 sm:p-2.5 rounded-xl bg-[#0B1220]/60 border border-white/5">
            <div className="text-[10px] text-[#9AA4B2] uppercase font-semibold">Credits Stored</div>
            <div className="text-base sm:text-lg font-bold font-display text-white mt-0.5 tabular-nums">
              S${USER_DATA.walletBalance.toFixed(2)}
            </div>
          </div>
        </div>
      </section>

      {/* "Next game" card */}
      <section className="p-5 rounded-3xl bg-[#141C2B] border border-white/10 shadow-xl relative overflow-hidden group">
        <div className="flex items-center justify-between pb-3 border-b border-white/8">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22E07A] animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider text-[#22E07A] uppercase">
              Next Confirmed Match
            </span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            Booking ID: #KP-9840
          </span>
        </div>

        <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#22E07A]/15 text-[#22E07A] text-[10px] font-bold tracking-wide uppercase">
              {nextGame.sport}
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
              {nextGame.courtNumber}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#9AA4B2]">
              <span className="flex items-center gap-1.5 text-slate-200">
                <MapPin className="w-3.5 h-3.5 text-[#22E07A]" />
                {nextGame.venueName}
              </span>
              <span className="flex items-center gap-1.5 text-slate-200">
                <Calendar className="w-3.5 h-3.5 text-[#22E07A]" />
                {nextGame.date}
              </span>
              <span className="flex items-center gap-1.5 text-slate-200">
                <Clock className="w-3.5 h-3.5 text-[#22E07A]" />
                {nextGame.time} ({nextGame.duration})
              </span>
            </div>
          </div>

          {/* Action buttons: Directions & Reschedule */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenDirections(nextGame)}
              className="flex-1 sm:flex-none py-2.5 px-4 rounded-full bg-[#0B1220] hover:bg-slate-800 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-[#22E07A]" />
              <span>Directions</span>
            </button>
            <button
              onClick={() => onOpenReschedule(nextGame)}
              className="flex-1 sm:flex-none py-2.5 px-4 rounded-full bg-[#0B1220] hover:bg-slate-800 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#FF7A1A]" />
              <span>Reschedule</span>
            </button>
          </div>
        </div>

        {/* Access info bar */}
        <div className="p-3 rounded-2xl bg-[#0B1220] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-2">
          <div className="text-[#9AA4B2]">
            Turnstile Gate B · Stadium MRT Sheltered Walk (3 mins)
          </div>
          <div className="text-[11px] font-bold text-[#22E07A] flex items-center gap-1">
            <span>Access QR ready on lockscreen</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </section>

      {/* Orange Promo Banner */}
      <section className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#FF7A1A] via-[#FF6A00] to-[#E55700] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-black tracking-widest uppercase bg-black/20 w-fit px-2.5 py-0.5 rounded-full">
              <Award className="w-3.5 h-3.5" />
              <span>KINETIC LAUNCH SPECIAL</span>
            </div>
            <h3 className="font-display text-lg sm:text-xl font-bold leading-tight">
              25% OFF Post-Game Meals + Free S$24 Court Voucher
            </h3>
            <p className="text-xs text-orange-100 max-w-lg">
              Order your post-court recovery fuel now. Use promo code <span className="font-mono font-bold bg-black/20 px-1.5 py-0.5 rounded text-white">PULSELAUNCH</span> at checkout.
            </p>
          </div>
          <button
            onClick={onClaimPromo}
            className="py-2.5 px-5 rounded-full bg-white text-[#0B1220] font-display font-bold text-xs uppercase tracking-wider shrink-0 hover:bg-slate-100 active:scale-95 transition-all shadow-md"
          >
            Claim Voucher
          </button>
        </div>
      </section>

      {/* Smart recommendation card suggesting a meal timed to user's next game */}
      <section className="p-4 sm:p-5 rounded-3xl bg-[#141C2B] border border-[#22E07A]/25 relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#22E07A]/15 border border-[#22E07A]/30 flex items-center justify-center text-[#22E07A] shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-wider text-[#22E07A] uppercase">
                Smart Match-Timed Nutrition
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                Have the Salmon Quinoa Bowl prepped for 21:05?
              </h3>
              <p className="text-xs text-[#9AA4B2] mt-1 leading-relaxed">
                Matches end at 21:00. Consuming 44g protein + 52g complex carbs within 30 minutes optimizes glycogen resynthesis and suppresses muscle fatigue.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-[#9AA4B2]">
            <span className="text-[#22E07A] font-bold">44g Protein</span>
            <span>·</span>
            <span>Locker #14 Dispatch</span>
            <span>·</span>
            <span className="font-semibold text-white">S$18.50</span>
          </div>
          <button
            onClick={() => onAddToCart(MEALS_DATA[0])}
            className="py-1.5 px-4 rounded-full bg-[#22E07A] text-[#0B1220] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#1fcf6f] transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Pre-Order</span>
          </button>
        </div>
      </section>

      {/* "Fuel & Recovery Kitchen" horizontal carousel of meal cards */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#22E07A] uppercase">
              Central Cloud Kitchen
            </span>
            <h2 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
              Fuel & Recovery Kitchen
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('kitchen')}
            className="text-xs font-semibold text-[#22E07A] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal Carousel */}
        <div className="flex gap-4 overflow-x-auto pb-2 pt-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {MEALS_DATA.slice(0, 4).map((meal) => (
            <div
              key={meal.id}
              className="w-72 sm:w-80 shrink-0 rounded-2xl bg-[#141C2B] border border-white/8 overflow-hidden hover:border-white/15 hover:-translate-y-1 transition-all flex flex-col group"
            >
              {/* Image with price badge */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-800">
                <img
                  src={meal.imageUrl}
                  alt={meal.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141C2B] via-transparent to-transparent opacity-90" />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#0B1220]/85 backdrop-blur-md border border-white/10 text-xs font-bold text-[#22E07A]">
                  S${meal.price.toFixed(2)}
                </div>
                {meal.isPopular && (
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-[#FF7A1A] text-white text-[10px] font-black uppercase tracking-wider">
                    POPULAR
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-display text-sm font-bold text-white line-clamp-1">
                    {meal.name}
                  </h3>
                  <p className="text-xs text-[#9AA4B2] mt-1 line-clamp-2 leading-relaxed">
                    {meal.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/8 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#9AA4B2]">
                    <span className="font-semibold text-white">{meal.macros.protein}g Prot</span>
                    <span>·</span>
                    <span>{meal.macros.calories} kcal</span>
                  </div>

                  <button
                    onClick={() => onAddToCart(meal)}
                    className="py-1.5 px-3.5 rounded-full bg-[#22E07A] text-[#0B1220] font-bold text-xs uppercase tracking-wider flex items-center gap-1 hover:bg-[#1fcf6f] active:scale-95 transition-all shadow-[0_0_10px_rgba(34,224,122,0.25)]"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* "Trending Venues & Slots" list */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#22E07A] uppercase">
              Singapore Sports Venues
            </span>
            <h2 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
              Trending Venues & Next Slots
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('courts')}
            className="text-xs font-semibold text-[#22E07A] hover:underline flex items-center gap-1"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {VENUES_DATA.slice(0, 4).map((venue) => (
            <div
              key={venue.id}
              className="p-3.5 rounded-2xl bg-[#141C2B] border border-white/8 hover:border-white/15 transition-all flex items-center gap-3.5"
            >
              <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-800">
                <img
                  src={venue.imageUrl}
                  alt={venue.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-bold text-[#22E07A]">
                  ★ {venue.rating}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#22E07A]">
                    {venue.sport}
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-[10px] text-[#9AA4B2] truncate">{venue.area}</span>
                </div>
                <h3 className="font-display text-xs sm:text-sm font-bold text-white truncate mt-0.5">
                  {venue.name}
                </h3>
                <div className="flex items-center gap-3 text-xs text-[#9AA4B2] mt-1">
                  <span className="text-white font-semibold">S${venue.pricePerHour}/hr</span>
                  <span>·</span>
                  <span className="text-emerald-400 font-medium">{venue.nextAvailableSlot}</span>
                </div>
              </div>

              <button
                onClick={() => onOpenBooking(venue)}
                className="py-2 px-3.5 rounded-full bg-[#0B1220] hover:bg-[#22E07A] hover:text-[#0B1220] border border-white/10 text-xs font-bold text-white shrink-0 transition-colors"
              >
                Book
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
