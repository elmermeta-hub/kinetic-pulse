import React from 'react';
import { MapPin, Bell, ShoppingBag, Zap } from 'lucide-react';
import { USER_DATA } from '../data/mockData';

interface TopNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  unreadNotificationsCount?: number;
  onOpenNotifications: () => void;
  onOpenMcpConsole: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentTab,
  onTabChange,
  cartCount,
  onOpenCart,
  unreadNotificationsCount = 2,
  onOpenNotifications,
  onOpenMcpConsole,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B1220]/90 backdrop-blur-md border-b border-white/8 transition-colors">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onTabChange('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22E07A] rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#22E07A] to-[#10B981] flex items-center justify-center text-[#0B1220] shadow-[0_0_16px_rgba(34,224,122,0.35)] group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="font-display text-lg font-bold tracking-tight text-white block leading-tight">
                KINETIC<span className="text-[#22E07A]">PULSE</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider text-[#9AA4B2] uppercase">
                Sports & Nutrition SG
              </span>
            </div>
          </button>

          {/* Location Chip */}
          <div className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#141C2B] border border-white/8 text-xs font-medium text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-[#22E07A] shrink-0" />
            <span className="tracking-wide text-[11px] font-semibold uppercase">{USER_DATA.location}</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {[
            { id: 'home', label: 'Explore' },
            { id: 'courts', label: 'Book Courts' },
            { id: 'kitchen', label: 'Cloud Kitchen' },
            { id: 'recovery', label: 'Recovery' },
            { id: 'profile', label: 'Athlete Pass' },
          ].map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#22E07A] text-[#0B1220] shadow-[0_0_14px_rgba(34,224,122,0.3)]'
                    : 'text-[#9AA4B2] hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: MCP, Cart, Bell, Avatar */}
        <div className="flex items-center gap-2">
          {/* MCP Agent Trigger Button */}
          <button
            onClick={onOpenMcpConsole}
            title="MCP Server (elmer-meta)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#141C2B] hover:bg-slate-800 border border-[#22E07A]/40 text-[#22E07A] text-xs font-mono font-bold transition-all shadow-[0_0_10px_rgba(34,224,122,0.15)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#22E07A] animate-pulse" />
            <span className="text-[11px] font-bold">MCP</span>
            <span className="hidden lg:inline text-[10px] text-slate-400 font-sans font-normal">elmer-meta</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            aria-label="View Kitchen Cart"
            className="relative p-2.5 rounded-full bg-[#141C2B] hover:bg-slate-800 border border-white/8 text-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22E07A]"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-[#FF7A1A] text-white text-[11px] font-bold flex items-center justify-center shadow-lg animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className="relative p-2.5 rounded-full bg-[#141C2B] hover:bg-slate-800 border border-white/8 text-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22E07A]"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#22E07A] ring-2 ring-[#0B1220]" />
            )}
          </button>

          {/* User Profile Avatar */}
          <button
            onClick={() => onTabChange('profile')}
            aria-label="View Profile"
            className="flex items-center gap-2 p-1 rounded-full bg-[#141C2B] hover:ring-2 hover:ring-[#22E07A] border border-white/8 transition-all"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-700 relative">
              <img
                src={USER_DATA.avatar}
                alt={USER_DATA.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="hidden xl:inline text-xs font-semibold text-white pr-2">
              Alex
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
