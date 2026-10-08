import React from 'react';
import { X, Bell, Calendar, Utensils, CheckCircle, Zap } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'n1',
      title: 'Court Gate Access Code Ready',
      desc: 'Your match tonight at OCBC Arena starts at 20:00. Turnstile Gate B QR code has been generated.',
      time: '15m ago',
      icon: Calendar,
      color: 'text-[#22E07A]',
    },
    {
      id: 'n2',
      title: 'Cloud Kitchen Order Synchronized',
      desc: 'Your post-game recovery bento will be placed in Smart Locker #14 at 21:05 sharp.',
      time: '1h ago',
      icon: Utensils,
      color: 'text-[#FF7A1A]',
    },
    {
      id: 'n3',
      title: 'Autobooking Sniper Active',
      desc: 'Tuesday 20:00 slot at OCBC Arena successfully queued for next week dispatch.',
      time: '3h ago',
      icon: Zap,
      color: 'text-sky-400',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0B1220] border border-white/10 rounded-3xl shadow-2xl p-5 text-slate-100 z-10">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#22E07A]" />
            <h3 className="font-display text-base font-bold text-white">Notifications & Alerts</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-2.5 max-h-[60vh] overflow-y-auto">
          {notifications.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-[#141C2B] border border-white/8 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${item.color}`} />
                    <span className="text-xs font-bold text-white">{item.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{item.time}</span>
                </div>
                <p className="text-[11px] text-[#9AA4B2] leading-relaxed pl-6">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
