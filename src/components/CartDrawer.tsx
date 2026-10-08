import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShieldCheck, ArrowRight, Check, Tag } from 'lucide-react';
import { MealItem, NEXT_GAME } from '../data/mockData';

export interface CartItem {
  meal: MealItem;
  quantity: number;
  deliveryTimeSlot?: string;
  notes?: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (mealId: string, delta: number) => void;
  onRemoveItem: (mealId: string) => void;
  onCheckoutSuccess: (orderDetails: {
    total: number;
    itemsCount: number;
    destination: string;
  }) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckoutSuccess,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [deliveryType, setDeliveryType] = useState<'court-locker' | 'home'>('court-locker');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.meal.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const deliveryFee = deliveryType === 'court-locker' ? 0 : 3.50; // Free courtside delivery for ActivePass
  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    const code = promoCode.trim().toUpperCase();

    if (code === 'PULSELAUNCH' || code === 'FIRST25' || code === 'KINETIC') {
      setDiscountPercent(25);
      setPromoSuccess('Promo applied: 25% OFF performance meals!');
    } else {
      setPromoError('Invalid code. Try PULSELAUNCH for 25% off');
    }
  };

  const handleCheckout = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onCheckoutSuccess({
        total: finalTotal,
        itemsCount: items.reduce((sum, item) => sum + item.quantity, 0),
        destination: deliveryType === 'court-locker' 
          ? `${NEXT_GAME.venueName} · Smart Locker #14`
          : 'Central Singapore Delivery Address',
      });
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#0B1220] border-l border-white/10 h-full flex flex-col shadow-2xl z-10 overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#141C2B]/60">
          <div>
            <h2 className="font-display text-lg font-bold text-white tracking-tight">
              Cloud Kitchen Cart
            </h2>
            <p className="text-xs text-[#9AA4B2] mt-0.5">
              Freshly prepped & timed to your court session
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {items.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#141C2B] border border-white/10 flex items-center justify-center mx-auto mb-4 text-[#9AA4B2]">
                <Tag className="w-8 h-8 opacity-40" />
              </div>
              <h3 className="text-base font-semibold text-white">Your cart is empty</h3>
              <p className="text-xs text-[#9AA4B2] max-w-xs mx-auto mt-1 mb-6">
                Add athlete-tested high-protein bowls, electrolyte smoothies, or recovery meals.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-full bg-[#22E07A] text-[#0B1220] font-bold text-xs uppercase tracking-wider hover:bg-[#1fcf6f] transition-all"
              >
                Browse Kitchen Menu
              </button>
            </div>
          ) : (
            <>
              {/* Delivery Destination Selector */}
              <div className="p-3.5 rounded-2xl bg-[#141C2B] border border-white/8 space-y-3">
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#22E07A]">
                  Smart Delivery Timing
                </span>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('court-locker')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      deliveryType === 'court-locker'
                        ? 'border-[#22E07A] bg-[#22E07A]/10 text-white'
                        : 'border-white/5 bg-[#0B1220] text-[#9AA4B2] hover:border-white/10'
                    }`}
                  >
                    <div className="font-semibold text-white flex items-center justify-between">
                      <span>Courtside Locker</span>
                      {deliveryType === 'court-locker' && <Check className="w-3.5 h-3.5 text-[#22E07A]" />}
                    </div>
                    <span className="text-[10px] text-[#22E07A] font-bold block mt-1">
                      FREE (ActivePass)
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Ready at 21:05 (OCBC Arena)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('home')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      deliveryType === 'home'
                        ? 'border-[#22E07A] bg-[#22E07A]/10 text-white'
                        : 'border-white/5 bg-[#0B1220] text-[#9AA4B2] hover:border-white/10'
                    }`}
                  >
                    <div className="font-semibold text-white flex items-center justify-between">
                      <span>Express Courier</span>
                      {deliveryType === 'home' && <Check className="w-3.5 h-3.5 text-[#22E07A]" />}
                    </div>
                    <span className="text-[10px] text-slate-300 block mt-1">+S$3.50</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Within 35 mins</span>
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#9AA4B2]">
                  Selected Meals ({items.reduce((s, i) => s + i.quantity, 0)})
                </span>

                <div className="space-y-2.5">
                  {items.map(({ meal, quantity }) => (
                    <div
                      key={meal.id}
                      className="p-3 rounded-2xl bg-[#141C2B] border border-white/8 flex items-center gap-3"
                    >
                      <img
                        src={meal.imageUrl}
                        alt={meal.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-800"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-white truncate">{meal.name}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-[#9AA4B2] mt-0.5">
                          <span>{meal.macros.protein}g Protein</span>
                          <span>·</span>
                          <span>{meal.macros.calories} kcal</span>
                        </div>
                        <div className="text-xs font-bold text-[#22E07A] mt-1">
                          S${(meal.price * quantity).toFixed(2)}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 bg-[#0B1220] px-2 py-1 rounded-xl border border-white/5">
                        <button
                          onClick={() => {
                            if (quantity === 1) {
                              onRemoveItem(meal.id);
                            } else {
                              onUpdateQuantity(meal.id, -1);
                            }
                          }}
                          className="p-1 hover:text-white text-slate-400 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          {quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-rose-400" /> : <Minus className="w-3.5 h-3.5" />}
                        </button>
                        <span className="text-xs font-bold text-white w-4 text-center tabular-nums">
                          {quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(meal.id, 1)}
                          className="p-1 hover:text-white text-slate-400 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="space-y-1.5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo code (e.g. PULSELAUNCH)"
                    className="flex-1 px-3 py-2 rounded-xl bg-[#141C2B] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#22E07A]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#141C2B] hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoSuccess && (
                  <p className="text-[11px] text-[#22E07A] font-semibold">{promoSuccess}</p>
                )}
                {promoError && (
                  <p className="text-[11px] text-[#FF7A1A] font-semibold">{promoError}</p>
                )}
              </form>

              {/* Order Summary Breakdown */}
              <div className="p-3.5 rounded-2xl bg-[#141C2B] border border-white/8 space-y-2 text-xs">
                <div className="flex justify-between text-[#9AA4B2]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">S${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#22E07A]">
                    <span>Promo Discount ({discountPercent}%)</span>
                    <span>-S${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#9AA4B2]">
                  <span>Delivery ({deliveryType === 'court-locker' ? 'Locker Dispatch' : 'Doorstep'})</span>
                  <span className="font-semibold text-white">
                    {deliveryFee === 0 ? 'FREE' : `S$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-[#9AA4B2]">
                  <span>GST (9% inclusive)</span>
                  <span className="font-semibold text-white">S${((finalTotal * 0.09) / 1.09).toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                  <span className="font-display text-sm font-bold text-white">Total Amount</span>
                  <span className="font-display text-base font-bold text-[#22E07A]">
                    S${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Checkout CTA */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-white/10 bg-[#141C2B]/95 space-y-2">
            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-full bg-[#22E07A] text-[#0B1220] font-display font-bold text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-[#1fcf6f] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(34,224,122,0.3)] disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#0B1220] border-t-transparent rounded-full animate-spin" />
                  Dispatching to Kitchen...
                </span>
              ) : (
                <>
                  <span>Place Order · S${finalTotal.toFixed(2)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#9AA4B2]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#22E07A]" />
              <span>Prepared 15 mins before court exit for peak warmth</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
