import React, { useState } from 'react';
import { User, Wallet, Award, CreditCard, Bell, ChevronRight, Check, ShieldCheck, Flame, Utensils, Calendar } from 'lucide-react';
import { USER_DATA, NEXT_GAME, ScheduledGame } from '../../data/mockData';

interface ProfileScreenProps {
  onTopUpWallet: (amount: number) => void;
  walletBalance: number;
  isSubscribedKitchen: boolean;
  onOpenDirections: (game: ScheduledGame) => void;
  onOpenMcpConsole?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onTopUpWallet,
  walletBalance,
  isSubscribedKitchen,
  onOpenDirections,
  onOpenMcpConsole,
}) => {
  const [activeAllergens, setActiveAllergens] = useState<string[]>(['No Peanuts', 'Low Sodium']);
  const [topUpSuccess, setTopUpSuccess] = useState(false);

  const toggleAllergen = (item: string) => {
    setActiveAllergens((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const handleQuickTopUp = (amt: number) => {
    onTopUpWallet(amt);
    setTopUpSuccess(true);
    setTimeout(() => setTopUpSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12 animate-in fade-in duration-200">
      {/* Profile Header */}
      <section className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#141C2B] via-[#141C2B] to-[#1a2538] border border-white/10 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-[#22E07A] bg-slate-800 shrink-0">
              <img
                src={USER_DATA.avatar}
                alt={USER_DATA.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-[#22E07A] ring-2 ring-[#0B1220]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#22E07A]/15 text-[#22E07A] text-[10px] font-bold uppercase tracking-wider">
                  {USER_DATA.passTier}
                </span>
                <span className="text-xs text-[#9AA4B2]">Level {USER_DATA.level}</span>
              </div>

              <h1 className="font-display text-2xl font-bold text-white mt-1">
                {USER_DATA.name}
              </h1>

              <p className="text-xs text-[#9AA4B2] mt-0.5">
                {USER_DATA.location} · Member since 2024
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-3 rounded-2xl bg-[#0B1220] border border-white/5 text-center flex-1 sm:flex-none sm:min-w-[110px]">
              <span className="text-[10px] text-[#9AA4B2] uppercase font-bold block">Reward Pts</span>
              <span className="font-display text-lg font-bold text-[#22E07A]">{USER_DATA.points}</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#0B1220] border border-white/5 text-center flex-1 sm:flex-none sm:min-w-[110px]">
              <span className="text-[10px] text-[#9AA4B2] uppercase font-bold block">This Month</span>
              <span className="font-display text-lg font-bold text-white">16 Games</span>
            </div>
          </div>
        </div>
      </section>

      {/* Kinetic Wallet & Pass Tiers */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Wallet Balance Card */}
        <div className="p-5 rounded-3xl bg-[#141C2B] border border-white/10 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/8">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#22E07A]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Kinetic Sports Wallet
                </h3>
              </div>
              <span className="text-[10px] text-[#22E07A] font-bold">DBS PayLah! Linked</span>
            </div>

            <div className="mt-4">
              <span className="text-[11px] text-[#9AA4B2] uppercase font-bold">Stored Balance</span>
              <div className="font-display text-3xl font-extrabold text-white mt-0.5 tabular-nums">
                S${walletBalance.toFixed(2)}
              </div>
            </div>

            {topUpSuccess && (
              <div className="mt-2 text-xs font-semibold text-[#22E07A] flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Top-up successful! Stored funds ready for court & meals.</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <span className="text-[10px] text-[#9AA4B2] uppercase font-bold block">
              Quick Top-Up
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[20, 50, 100].map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleQuickTopUp(amt)}
                  className="py-2 rounded-xl bg-[#0B1220] hover:bg-[#22E07A] hover:text-[#0B1220] border border-white/10 font-bold text-white transition-colors"
                >
                  +S${amt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Memberships Card */}
        <div className="p-5 rounded-3xl bg-[#141C2B] border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/8">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#FF7A1A]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Active Passes & Privileges
              </h3>
            </div>
            <span className="text-[10px] text-[#22E07A] font-bold">2 ACTIVE</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-[#0B1220] border border-white/5 flex items-center justify-between">
              <div>
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span>ActivePass Pro Unlimited</span>
                  <Check className="w-3.5 h-3.5 text-[#22E07A]" />
                </div>
                <div className="text-[11px] text-[#9AA4B2] mt-0.5">
                  Off-peak free play · Next renews 01 Nov 2026
                </div>
              </div>
              <span className="text-xs font-bold text-[#22E07A]">Active</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#0B1220] border border-white/5 flex items-center justify-between">
              <div>
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span>Cloud Kitchen Eating Pass</span>
                  {isSubscribedKitchen ? (
                    <Check className="w-3.5 h-3.5 text-[#22E07A]" />
                  ) : (
                    <span className="text-[10px] text-amber-400 font-normal">Inactive</span>
                  )}
                </div>
                <div className="text-[11px] text-[#9AA4B2] mt-0.5">
                  {isSubscribedKitchen ? '20 meals/month with court drop-off' : 'Subscribe for S$89/mo'}
                </div>
              </div>
              <span className={`text-xs font-bold ${isSubscribedKitchen ? 'text-[#22E07A]' : 'text-slate-500'}`}>
                {isSubscribedKitchen ? 'Active' : 'Get Pass'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Model Context Protocol (MCP) Integration Card */}
      <section className="p-5 rounded-3xl bg-[#141C2B] border border-[#22E07A]/30 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22E07A] animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#22E07A]">
                AI Agent & Tool Protocol (MCP)
              </span>
            </div>
            <h3 className="font-display text-base font-bold text-white mt-0.5">
              Smithery MCP: elmer-meta
            </h3>
            <p className="text-xs text-[#9AA4B2] mt-0.5">
              Connected to <code className="text-[#22E07A] font-mono text-[11px]">https://mcp.smithery.ai/elmer-meta</code>
            </p>
          </div>

          {onOpenMcpConsole && (
            <button
              onClick={onOpenMcpConsole}
              className="py-2.5 px-4 rounded-full bg-[#22E07A] text-[#0B1220] font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#1fcf6f] transition-all shadow-[0_0_12px_rgba(34,224,122,0.25)] shrink-0"
            >
              <span>Open MCP Console</span>
            </button>
          )}
        </div>
        <div className="text-[11px] text-[#9AA4B2] pt-2 border-t border-white/5 flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>Court Sniper Bot</span>
          <span>·</span>
          <span>Metabolic Recovery Window</span>
          <span>·</span>
          <span>Cloud Kitchen Dispatch</span>
        </div>
      </section>

      {/* Dietary & Allergen Profile */}
      <section className="p-5 rounded-3xl bg-[#141C2B] border border-white/10 shadow-xl space-y-4">
        <div>
          <h3 className="font-display text-base font-bold text-white">
            Athletic Kitchen Dietary Protocols
          </h3>
          <p className="text-xs text-[#9AA4B2] mt-0.5">
            Cloud kitchen chefs automatically adjust marinades and seasoning for your court orders.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            'High Protein Only',
            'No Peanuts',
            'Low Sodium',
            'Gluten Sensitive',
            'Dairy Conscious',
            'Halal Certified Only',
          ].map((item) => {
            const isChecked = activeAllergens.includes(item);
            return (
              <button
                key={item}
                onClick={() => toggleAllergen(item)}
                className={`py-2 px-3.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isChecked
                    ? 'bg-[#22E07A] text-[#0B1220] shadow-[0_0_12px_rgba(34,224,122,0.3)]'
                    : 'bg-[#0B1220] text-[#9AA4B2] border border-white/10 hover:text-white'
                }`}
              >
                {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                <span>{item}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Next Game Quick Card in Profile */}
      <section className="p-5 rounded-3xl bg-[#141C2B] border border-white/10 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#22E07A]">
            Current In-App Court Ticket
          </span>
          <h4 className="font-display text-base font-bold text-white mt-0.5">
            {NEXT_GAME.courtNumber} · {NEXT_GAME.venueName}
          </h4>
          <p className="text-xs text-[#9AA4B2] mt-0.5">
            {NEXT_GAME.date} · {NEXT_GAME.time}
          </p>
        </div>
        <button
          onClick={() => onOpenDirections(NEXT_GAME)}
          className="py-2 px-4 rounded-full bg-[#0B1220] hover:bg-slate-800 border border-white/10 text-xs font-bold text-white transition-colors"
        >
          View Ticket
        </button>
      </section>
    </div>
  );
};
