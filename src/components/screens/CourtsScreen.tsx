import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Star, Zap, Check, ShieldCheck, ChevronRight, Settings, Sparkles, Filter } from 'lucide-react';
import { VENUES_DATA, INITIAL_AUTOBOOKING, VenueItem, AutobookingConfig } from '../../data/mockData';

interface CourtsScreenProps {
  onOpenBooking: (venue: VenueItem, preselectedSlot?: string) => void;
  autobooking: AutobookingConfig;
  onToggleAutobooking: () => void;
  onEditAutobooking: () => void;
  onUpgradeActivePass: () => void;
}

export const CourtsScreen: React.FC<CourtsScreenProps> = ({
  onOpenBooking,
  autobooking,
  onToggleAutobooking,
  onEditAutobooking,
  onUpgradeActivePass,
}) => {
  const [selectedSport, setSelectedSport] = useState<'Badminton' | 'Tennis' | 'Pickleball' | 'Futsal'>('Badminton');
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  // Generate 7-day strip starting from current date
  const dateStrip = [
    { day: 'TODAY', date: '15 Oct', dayName: 'Thu' },
    { day: 'TOMORROW', date: '16 Oct', dayName: 'Fri' },
    { day: 'SAT', date: '17 Oct', dayName: 'Sat' },
    { day: 'SUN', date: '18 Oct', dayName: 'Sun' },
    { day: 'MON', date: '19 Oct', dayName: 'Mon' },
    { day: 'TUE', date: '20 Oct', dayName: 'Tue' },
    { day: 'WED', date: '21 Oct', dayName: 'Wed' },
  ];

  const sportsList: Array<'Badminton' | 'Tennis' | 'Pickleball' | 'Futsal'> = [
    'Badminton',
    'Tennis',
    'Pickleball',
    'Futsal',
  ];

  const filteredVenues = VENUES_DATA.filter((v) => v.sport === selectedSport);

  return (
    <div className="space-y-6 pb-24 md:pb-12 animate-in fade-in duration-200">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-[#22E07A] uppercase">
            Singapore Premier Venues
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Book & Autobook Courts
          </h1>
        </div>
        <div className="text-xs text-[#9AA4B2] flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#22E07A]" />
          <span>Real-time ActiveSG & Club integrations</span>
        </div>
      </div>

      {/* Sport tabs: Badminton / Tennis / Pickleball / Futsal */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {sportsList.map((sport) => {
          const isActive = selectedSport === sport;
          return (
            <button
              key={sport}
              onClick={() => setSelectedSport(sport)}
              className={`px-4 py-2 rounded-full font-display text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#22E07A] text-[#0B1220] shadow-[0_0_14px_rgba(34,224,122,0.35)]'
                  : 'bg-[#141C2B] hover:bg-slate-800 text-[#9AA4B2] hover:text-white border border-white/8'
              }`}
            >
              {sport}
            </button>
          );
        })}
      </div>

      {/* Horizontal date strip (7 days) */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-[#9AA4B2] uppercase tracking-wider">
            Select Play Date
          </span>
          <span className="text-xs text-slate-400">
            {dateStrip[selectedDateIndex].dayName}, {dateStrip[selectedDateIndex].date}
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {dateStrip.map((item, idx) => {
            const isSelected = selectedDateIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedDateIndex(idx)}
                className={`py-2.5 px-1 rounded-2xl flex flex-col items-center justify-center transition-all border ${
                  isSelected
                    ? 'bg-[#22E07A] border-[#22E07A] text-[#0B1220] shadow-[0_0_16px_rgba(34,224,122,0.35)]'
                    : 'bg-[#141C2B] border-white/8 text-[#9AA4B2] hover:border-white/15 hover:text-white'
                }`}
              >
                <span className={`text-[9px] font-bold uppercase tracking-tight ${isSelected ? 'text-[#0B1220]' : 'text-[#9AA4B2]'}`}>
                  {item.dayName}
                </span>
                <span className={`font-display text-xs sm:text-sm font-bold mt-0.5 ${isSelected ? 'text-[#0B1220]' : 'text-white'}`}>
                  {item.date.split(' ')[0]}
                </span>
                <span className={`text-[8px] font-medium hidden sm:block ${isSelected ? 'text-[#0B1220]' : 'text-slate-500'}`}>
                  {item.date.split(' ')[1]}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* "Autobooking" Card with Toggle */}
      <section className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#141C2B] via-[#162235] to-[#121b2b] border border-[#22E07A]/30 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-widest text-[#22E07A] uppercase">
                Pulse AI Slot Sniper
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#22E07A]/15 text-[#22E07A] text-[10px] font-bold">
                {autobooking.successRate}% Success Rate
              </span>
            </div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
              Weekly Auto-Court Dispatch
            </h2>
            <p className="text-xs text-[#9AA4B2] max-w-md leading-relaxed">
              Never miss court release windows at 07:00 AM. Pulse bot secures your preferred time slot automatically.
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center gap-3 self-end sm:self-center">
            <span className="text-xs font-semibold text-white">
              {autobooking.enabled ? 'ACTIVE' : 'PAUSED'}
            </span>
            <button
              onClick={onToggleAutobooking}
              aria-label="Toggle Autobooking"
              className={`w-14 h-8 rounded-full p-1 transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22E07A] ${
                autobooking.enabled ? 'bg-[#22E07A]' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-[#0B1220] shadow-md transform transition-transform ${
                  autobooking.enabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Autobooking Dispatch Summary */}
        <div className="mt-4 pt-4 border-t border-white/8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-[#0B1220] border border-white/5">
            <span className="text-[10px] text-[#9AA4B2] uppercase font-bold">Target Venue & Sport</span>
            <div className="font-semibold text-white mt-0.5 truncate">
              {autobooking.venue} ({autobooking.sport})
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#0B1220] border border-white/5">
            <span className="text-[10px] text-[#9AA4B2] uppercase font-bold">Preferred Schedule</span>
            <div className="font-semibold text-white mt-0.5 truncate">
              {autobooking.preferredDay} · {autobooking.preferredTime}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#0B1220] border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#9AA4B2] uppercase font-bold">Next Slot Sniper</span>
              <div className="font-semibold text-[#22E07A] mt-0.5">
                {autobooking.nextAutoBookedSlot}
              </div>
            </div>
            <button
              onClick={onEditAutobooking}
              className="text-xs font-bold text-[#FF7A1A] hover:underline"
            >
              Edit
            </button>
          </div>
        </div>
      </section>

      {/* "Featured Venues & Slots" */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#22E07A] uppercase">
              Instant Reservations
            </span>
            <h2 className="font-display text-xl font-bold text-white tracking-tight">
              Featured Venues & Available Slots
            </h2>
          </div>
          <span className="text-xs text-[#9AA4B2]">
            {filteredVenues.length} locations available
          </span>
        </div>

        {/* Venue Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredVenues.map((venue) => (
            <div
              key={venue.id}
              className="p-4 sm:p-5 rounded-2xl bg-[#141C2B] border border-white/8 hover:border-white/15 transition-all space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3.5">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-slate-800">
                    <img
                      src={venue.imageUrl}
                      alt={venue.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-sm text-[10px] font-bold text-[#22E07A]">
                      ★ {venue.rating}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#22E07A]">
                        {venue.sport}
                      </span>
                      <span className="text-slate-500">·</span>
                      <span className="text-[11px] text-[#9AA4B2]">{venue.distanceKm} km away</span>
                    </div>

                    <h3 className="font-display text-base font-bold text-white truncate mt-1">
                      {venue.name}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-[#9AA4B2] mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#22E07A] shrink-0" />
                      <span className="truncate">{venue.area}</span>
                    </div>

                    <div className="mt-2 text-sm font-bold text-white">
                      S${venue.pricePerHour}.00 <span className="text-xs text-[#9AA4B2] font-normal">/ hour</span>
                    </div>
                  </div>
                </div>

                {/* Selectable time-slot chips */}
                <div className="mt-4 space-y-1.5">
                  <span className="text-[10px] font-bold text-[#9AA4B2] uppercase tracking-wider block">
                    Available Time Slots:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {venue.availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => onOpenBooking(venue, slot)}
                        className="py-1 px-2.5 rounded-lg bg-[#0B1220] hover:bg-[#22E07A] hover:text-[#0B1220] border border-white/10 text-xs font-semibold text-slate-300 transition-colors"
                      >
                        <Clock className="w-3 h-3 inline mr-1" />
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Book CTA */}
              <div className="pt-3 border-t border-white/8 flex items-center justify-between">
                <span className="text-[11px] text-[#9AA4B2]">
                  Locker drop-off eligible
                </span>
                <button
                  onClick={() => onOpenBooking(venue)}
                  className="py-2 px-5 rounded-full bg-[#22E07A] text-[#0B1220] font-display font-bold text-xs uppercase tracking-wider hover:bg-[#1fcf6f] active:scale-95 transition-all shadow-[0_0_12px_rgba(34,224,122,0.25)]"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* "All-Access ActivePass" Upsell Card */}
      <section className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#141C2B] via-[#1a2336] to-[#0E1524] border border-[#FF7A1A]/30 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-lg">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF7A1A]/15 text-[#FF7A1A] text-[10px] font-black uppercase tracking-wider">
              <Zap className="w-3 h-3" />
              <span>UNLIMITED COURT PLAY</span>
            </div>
            <h3 className="font-display text-xl font-bold text-white">
              Kinetic All-Access ActivePass
            </h3>
            <p className="text-xs text-[#9AA4B2] leading-relaxed">
              Play off-peak across 28+ Singapore sports halls for S$0. Plus 30% discount on peak evening slots and complimentary smart locker meal deliveries.
            </p>
          </div>

          <button
            onClick={onUpgradeActivePass}
            className="py-3 px-6 rounded-full bg-[#FF7A1A] text-white font-display font-bold text-xs uppercase tracking-wider shrink-0 hover:bg-[#e0660f] active:scale-95 transition-all shadow-[0_0_16px_rgba(255,122,26,0.3)]"
          >
            Upgrade to Pro · S$49/mo
          </button>
        </div>
      </section>
    </div>
  );
};
