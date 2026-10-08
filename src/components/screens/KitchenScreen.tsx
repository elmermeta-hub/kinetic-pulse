import React, { useState } from 'react';
import { Camera, Sparkles, Plus, Check, Search, ShieldCheck, Flame, ArrowRight, Zap } from 'lucide-react';
import { MEALS_DATA, TODAY_MACROS, MealItem } from '../../data/mockData';

interface KitchenScreenProps {
  onOpenSnapModal: () => void;
  onAddToCart: (meal: MealItem) => void;
  macros: typeof TODAY_MACROS;
  onSubscribePass: () => void;
  isSubscribed: boolean;
}

export const KitchenScreen: React.FC<KitchenScreenProps> = ({
  onOpenSnapModal,
  onAddToCart,
  macros,
  onSubscribePass,
  isSubscribed,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'high-protein' | 'vegan' | 'low-carb' | 'post-workout'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filterTabs = [
    { id: 'all', label: 'All Meals' },
    { id: 'high-protein', label: 'High Protein' },
    { id: 'post-workout', label: 'Post-Workout' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'low-carb', label: 'Low Carb' },
  ];

  const filteredMeals = MEALS_DATA.filter((meal) => {
    const matchesFilter = selectedFilter === 'all' || meal.category === selectedFilter;
    const matchesSearch =
      meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Calculate percentages for the circular progress rings
  const proteinPercent = Math.min(100, Math.round((macros.protein.current / macros.protein.target) * 100));
  const carbsPercent = Math.min(100, Math.round((macros.carbs.current / macros.carbs.target) * 100));
  const fatsPercent = Math.min(100, Math.round((macros.fats.current / macros.fats.target) * 100));
  const caloriePercent = Math.min(100, Math.round((macros.consumedCalories / macros.targetCalories) * 100));

  return (
    <div className="space-y-6 pb-24 md:pb-12 animate-in fade-in duration-200">
      {/* Hero Card: "Snap Your Meal" */}
      <section className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#141C2B] via-[#141C2B] to-[#1a2838] border border-white/10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22E07A] animate-pulse" />
              <span className="text-[11px] font-bold tracking-widest text-[#22E07A] uppercase">
                Instant Bio-Macro Recognition
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Snap Your Meal
            </h1>
            <p className="text-xs sm:text-sm text-[#9AA4B2] max-w-md leading-relaxed">
              Upload or snap any dish to estimate protein, carbs, calories, and post-match recovery timing in seconds.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={onOpenSnapModal}
              className="w-full sm:w-auto py-3 px-6 rounded-full bg-[#22E07A] text-[#0B1220] font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#1fcf6f] active:scale-95 transition-all shadow-[0_0_20px_rgba(34,224,122,0.35)]"
            >
              <Camera className="w-4 h-4 stroke-[2.5]" />
              <span>Snap / Upload Photo</span>
            </button>
          </div>
        </div>

        {/* Live scanner quick preview badge */}
        <div className="mt-4 pt-3 border-t border-white/8 flex items-center justify-between text-xs text-[#9AA4B2]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#22E07A]" />
            <span>Trained on 45,000+ Asian and athletic high-protein dishes</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400">98.4% Accuracy</span>
        </div>
      </section>

      {/* Today's Macros: Calorie total plus 3 circular progress rings */}
      <section className="p-5 rounded-3xl bg-[#141C2B] border border-white/10 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/8">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#22E07A] uppercase">
              Athletic Fuel Telemetry
            </span>
            <h2 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
              Today's Daily Target Macros
            </h2>
          </div>
          <div className="text-xs text-[#9AA4B2]">
            <span className="font-bold text-white">{macros.consumedCalories}</span> / {macros.targetCalories} kcal ({caloriePercent}%)
          </div>
        </div>

        {/* 3 Circular Rings + Calorie Gauge */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 items-center">
          {/* Calorie bar */}
          <div className="sm:col-span-1 p-3 rounded-2xl bg-[#0B1220] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] uppercase font-bold text-[#9AA4B2]">Remaining</span>
              <span className="font-bold text-[#22E07A]">{macros.targetCalories - macros.consumedCalories} kcal</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#22E07A] to-[#10B981] rounded-full transition-all duration-500"
                style={{ width: `${caloriePercent}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-400">
              Optimal window for post-match refueling
            </div>
          </div>

          {/* 3 Circular Progress Rings */}
          <div className="sm:col-span-3 grid grid-cols-3 gap-3">
            {/* Protein Ring */}
            <div className="p-3 rounded-2xl bg-[#0B1220] border border-white/5 flex flex-col items-center text-center">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.2"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#22E07A]"
                    strokeDasharray={`${proteinPercent}, 100`}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute font-display font-bold text-xs text-white">
                  {proteinPercent}%
                </div>
              </div>
              <div className="text-xs font-bold text-white mt-1.5">{macros.protein.current}g</div>
              <div className="text-[10px] text-[#22E07A] font-bold uppercase tracking-wider">
                Protein ({macros.protein.target}g)
              </div>
            </div>

            {/* Carbs Ring */}
            <div className="p-3 rounded-2xl bg-[#0B1220] border border-white/5 flex flex-col items-center text-center">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.2"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-sky-400"
                    strokeDasharray={`${carbsPercent}, 100`}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute font-display font-bold text-xs text-white">
                  {carbsPercent}%
                </div>
              </div>
              <div className="text-xs font-bold text-white mt-1.5">{macros.carbs.current}g</div>
              <div className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">
                Carbs ({macros.carbs.target}g)
              </div>
            </div>

            {/* Fats Ring */}
            <div className="p-3 rounded-2xl bg-[#0B1220] border border-white/5 flex flex-col items-center text-center">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.2"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#FF7A1A]"
                    strokeDasharray={`${fatsPercent}, 100`}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute font-display font-bold text-xs text-white">
                  {fatsPercent}%
                </div>
              </div>
              <div className="text-xs font-bold text-white mt-1.5">{macros.fats.current}g</div>
              <div className="text-[10px] text-[#FF7A1A] font-bold uppercase tracking-wider">
                Fats ({macros.fats.target}g)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cloud Kitchen Menu & Filters */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#22E07A] uppercase">
              Chef-Prepared · Performance Fuel
            </span>
            <h2 className="font-display text-xl font-bold text-white tracking-tight">
              Central Cloud Kitchen Menu
            </h2>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, macros..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#141C2B] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#22E07A]"
            />
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {filterTabs.map((tab) => {
            const isActive = selectedFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#22E07A] text-[#0B1220] shadow-[0_0_12px_rgba(34,224,122,0.3)]'
                    : 'bg-[#141C2B] hover:bg-slate-800 border border-white/8 text-[#9AA4B2] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Meal cards grid (2-3 columns on tablet/desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMeals.map((meal) => (
            <div
              key={meal.id}
              className="rounded-2xl bg-[#141C2B] border border-white/8 overflow-hidden hover:border-white/15 hover:-translate-y-1 transition-all flex flex-col group shadow-lg"
            >
              {/* Full-bleed food photo with dark gradient overlay & price badge */}
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

              {/* Meal card content */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap gap-1.5">
                    {meal.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-bold text-[#22E07A] bg-[#22E07A]/10 px-2 py-0.5 rounded-md uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="font-display text-base font-bold text-white group-hover:text-[#22E07A] transition-colors leading-snug">
                    {meal.name}
                  </h3>
                  <p className="text-xs text-[#9AA4B2] leading-relaxed line-clamp-2">
                    {meal.description}
                  </p>
                </div>

                {/* Macro breakdown pills & Add button */}
                <div className="space-y-3 pt-2 border-t border-white/8">
                  <div className="grid grid-cols-3 gap-1.5 text-center text-[11px]">
                    <div className="p-1.5 rounded-lg bg-[#0B1220]">
                      <span className="font-bold text-white">{meal.macros.protein}g</span>
                      <span className="text-[9px] text-[#9AA4B2] block uppercase">Protein</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#0B1220]">
                      <span className="font-bold text-white">{meal.macros.carbs}g</span>
                      <span className="text-[9px] text-[#9AA4B2] block uppercase">Carbs</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#0B1220]">
                      <span className="font-bold text-white">{meal.macros.calories}</span>
                      <span className="text-[9px] text-[#9AA4B2] block uppercase">Kcal</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onAddToCart(meal)}
                    className="w-full py-2.5 px-4 rounded-full bg-[#22E07A] text-[#0B1220] font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#1fcf6f] active:scale-95 transition-all shadow-[0_0_12px_rgba(34,224,122,0.25)]"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Add to Order · S${meal.price.toFixed(2)}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Subscription Card: "Monthly Healthy Eating Pass" */}
      <section className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#141C2B] via-[#162133] to-[#121a29] border border-[#22E07A]/30 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22E07A]/15 text-[#22E07A] text-[11px] font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              <span>Nutrition Membership</span>
            </div>

            <h3 className="font-display text-2xl font-bold text-white tracking-tight">
              Monthly Healthy Eating Pass
            </h3>

            <p className="text-xs sm:text-sm text-[#9AA4B2] leading-relaxed">
              Automate your sports nutrition in Singapore. Fresh meals cooked daily in our Central Cloud Kitchen and delivered warm straight to your court locker or home.
            </p>

            {/* Benefits list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200 pt-1">
              {[
                '20 Chef Performance Bowls / month',
                'Guaranteed 20% savings vs single orders',
                'Complimentary Courtside Smart Locker dispatch',
                'Free Electrolyte Hydro-Infusions with every meal',
                'Direct Tele-Chat with board dietitians',
                'Flexible pause or skip anytime in-app',
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#22E07A] shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & Subscribe CTA */}
          <div className="shrink-0 p-5 rounded-2xl bg-[#0B1220] border border-white/10 text-center sm:text-right space-y-3">
            <div>
              <span className="text-[10px] text-[#9AA4B2] uppercase font-bold tracking-wider block">
                Subscription Price
              </span>
              <div className="flex items-baseline justify-center sm:justify-end gap-1 mt-0.5">
                <span className="font-display text-3xl font-black text-white">S$89</span>
                <span className="text-xs text-[#9AA4B2]">/ month</span>
              </div>
              <span className="text-[11px] text-[#22E07A] font-semibold block">
                ~S$4.45 per meal subsidy
              </span>
            </div>

            <button
              onClick={onSubscribePass}
              className={`w-full py-3 px-6 rounded-full font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_16px_rgba(34,224,122,0.3)] ${
                isSubscribed
                  ? 'bg-[#141C2B] border border-[#22E07A] text-[#22E07A]'
                  : 'bg-[#22E07A] text-[#0B1220] hover:bg-[#1fcf6f] active:scale-95'
              }`}
            >
              {isSubscribed ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Subscribed (Active)</span>
                </>
              ) : (
                <>
                  <span>Subscribe to Pass</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <div className="text-[10px] text-slate-400 text-center">
              Renews automatically. Cancel anytime.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
