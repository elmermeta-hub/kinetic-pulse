import React from 'react';
import { Compass, CalendarDays, UtensilsCrossed, Activity, User } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  cartCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Explore', icon: Compass },
    { id: 'courts', label: 'Book Courts', icon: CalendarDays },
    { id: 'kitchen', label: 'Nutrition', icon: UtensilsCrossed },
    { id: 'recovery', label: 'Recovery', icon: Activity },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B1220]/95 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 shadow-[0_-8px_24px_rgba(0,0,0,0.5)]"
    >
      <div className="grid grid-cols-5 items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 min-h-[48px] rounded-xl transition-all relative ${
                isActive ? 'text-[#22E07A]' : 'text-[#9AA4B2] hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#22E07A] shadow-[0_0_8px_#22E07A]" />
                )}
              </div>
              <span
                className={`text-[10px] tracking-tight mt-1 truncate max-w-full ${
                  isActive ? 'font-bold text-white' : 'font-medium text-[#9AA4B2]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
