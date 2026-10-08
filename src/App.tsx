/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TopNav } from './components/TopNav';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/screens/HomeScreen';
import { KitchenScreen } from './components/screens/KitchenScreen';
import { CourtsScreen } from './components/screens/CourtsScreen';
import { RecoveryScreen } from './components/screens/RecoveryScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { SnapMealModal } from './components/SnapMealModal';
import { BookingModal } from './components/BookingModal';
import { DirectionsModal } from './components/DirectionsModal';
import { RescheduleModal } from './components/RescheduleModal';
import { ConsultModal } from './components/ConsultModal';
import { NotificationsModal } from './components/NotificationsModal';
import { AutobookEditModal } from './components/AutobookEditModal';
import { McpConsoleModal } from './components/McpConsoleModal';
import { Toast, ToastMessage } from './components/Toast';

import {
  NEXT_GAME,
  TODAY_MACROS,
  MEALS_DATA,
  INITIAL_AUTOBOOKING,
  ScheduledGame,
  MealItem,
  VenueItem,
  Nutritionist,
  AutobookingConfig,
} from './data/mockData';

export default function App() {
  // Screen routing state
  const [currentTab, setCurrentTab] = useState<'home' | 'courts' | 'kitchen' | 'recovery' | 'profile'>('home');

  // Next game state
  const [nextGame, setNextGame] = useState<ScheduledGame>(NEXT_GAME);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      meal: MEALS_DATA[0], // Pre-loaded with Atlantic Salmon Bowl
      quantity: 1,
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Macros state (dynamically updated when user logs meals or snaps food)
  const [macros, setMacros] = useState(TODAY_MACROS);

  // Subscriptions & Wallet state
  const [isKitchenSubscribed, setIsKitchenSubscribed] = useState(false);
  const [walletBalance, setWalletBalance] = useState(84.50);

  // Autobooking config state
  const [autobooking, setAutobooking] = useState<AutobookingConfig>(INITIAL_AUTOBOOKING);

  // Modal visibility states
  const [isSnapModalOpen, setIsSnapModalOpen] = useState(false);
  const [selectedBookingVenue, setSelectedBookingVenue] = useState<VenueItem | null>(null);
  const [isDirectionsOpen, setIsDirectionsOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [selectedNutritionist, setSelectedNutritionist] = useState<Nutritionist | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAutobookEditOpen, setIsAutobookEditOpen] = useState(false);
  const [isMcpModalOpen, setIsMcpModalOpen] = useState(false);

  // UI interaction states
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [referralCopied, setReferralCopied] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, message?: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart Handlers
  const handleAddToCart = (meal: MealItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.meal.id === meal.id);
      if (existing) {
        return prev.map((i) =>
          i.meal.id === meal.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { meal, quantity: 1 }];
    });
    addToast('Added to Cart', `${meal.name} scheduled for courtside dispatch.`);
  };

  const handleUpdateCartQuantity = (mealId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((i) => (i.meal.id === mealId ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const handleRemoveCartItem = (mealId: string) => {
    setCartItems((prev) => prev.filter((i) => i.meal.id !== mealId));
    addToast('Item Removed', 'Removed item from cloud kitchen cart.', 'info');
  };

  const handleCheckoutSuccess = (orderDetails: { total: number; itemsCount: number; destination: string }) => {
    setCartItems([]);
    addToast(
      'Order Confirmed · S$' + orderDetails.total.toFixed(2),
      `Kitchen preparing ${orderDetails.itemsCount} meal(s). Scheduled delivery to ${orderDetails.destination}.`
    );
  };

  // Booking Handlers
  const handleConfirmCourtBooking = (details: {
    venue: VenueItem;
    date: string;
    slot: string;
    courtNumber: string;
    totalPrice: number;
  }) => {
    setNextGame({
      id: `game-${Date.now()}`,
      sport: details.venue.sport,
      venueName: details.venue.name,
      courtNumber: `${details.courtNumber} (${details.venue.sport})`,
      address: `${details.venue.area}, Singapore`,
      date: details.date,
      time: `${details.slot} - ${parseInt(details.slot) + 1}:00`,
      duration: '60 mins',
      price: details.totalPrice,
    });
    addToast(
      'Court Reserved!',
      `${details.venue.name} · ${details.courtNumber} on ${details.date} (${details.slot}). SMS pass issued.`
    );
  };

  // Reschedule Handlers
  const handleConfirmReschedule = (newDate: string, newTime: string, newCourt: string) => {
    setNextGame((prev) => ({
      ...prev,
      date: newDate,
      time: newTime,
      courtNumber: `${newCourt} (Rescheduled)`,
    }));
    addToast('Match Rescheduled', `Updated to ${newDate} at ${newTime}. Locker meal delivery auto-synced.`);
  };

  // Snap & Macro Logging Handlers
  const handleLogMacrosFromSnap = (item: { calories: number; protein: number; carbs: number; fats: number; mealName: string }) => {
    setMacros((prev) => ({
      ...prev,
      consumedCalories: prev.consumedCalories + item.calories,
      protein: { ...prev.protein, current: prev.protein.current + item.protein },
      carbs: { ...prev.carbs, current: prev.carbs.current + item.carbs },
      fats: { ...prev.fats, current: prev.fats.current + item.fats },
    }));
    addToast(
      'Macros Logged!',
      `Added +${item.protein}g Protein & +${item.calories} kcal from ${item.mealName}.`
    );
  };

  const handleAddMatchedMealFromSnap = (mealId: string) => {
    const meal = MEALS_DATA.find((m) => m.id === mealId) || MEALS_DATA[0];
    handleAddToCart(meal);
    setIsCartOpen(true);
  };

  // Consult Handlers
  const handleConfirmConsult = (booking: {
    nutritionist: Nutritionist;
    date: string;
    time: string;
    focus: string;
  }) => {
    addToast(
      'Consultation Scheduled',
      `30-min tele-health call with ${booking.nutritionist.name} on ${booking.date} (${booking.time}). Link sent via SMS.`
    );
  };

  // Promo & Referral Handlers
  const handleClaimPromo = () => {
    setIsCartOpen(true);
    addToast(
      'Promo Code PULSELAUNCH',
      '25% discount activated on all performance recovery meals!',
      'info'
    );
  };

  const handleCopyReferral = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('https://kineticpulse.sg/join?ref=ALEX88');
    }
    setReferralCopied(true);
    addToast(
      'Referral Link Copied',
      'Share with sparring partners to give S$15 and earn S$15 credit!'
    );
    setTimeout(() => setReferralCopied(false), 3000);
  };

  const handleCopyAddress = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(nextGame.address);
    }
    setCopiedAddress(true);
    addToast('Venue Address Copied', nextGame.address, 'info');
    setTimeout(() => setCopiedAddress(false), 3000);
  };

  const handleToggleAutobooking = () => {
    setAutobooking((prev) => {
      const next = !prev.enabled;
      addToast(
        next ? 'Autobooking Activated' : 'Autobooking Paused',
        next ? 'Pulse Sniper will reserve your Tuesday & Thursday slots automatically.' : 'Weekly automatic booking paused.',
        next ? 'success' : 'warning'
      );
      return { ...prev, enabled: next };
    });
  };

  const handleSubscribePass = () => {
    setIsKitchenSubscribed((prev) => {
      const next = !prev;
      addToast(
        next ? 'Monthly Eating Pass Activated!' : 'Subscription Paused',
        next ? '20 chef performance meals loaded. Courtside locker delivery free.' : 'Pass cancelled. Existing orders remain valid.',
        next ? 'success' : 'info'
      );
      return next;
    });
  };

  const handleTopUpWallet = (amount: number) => {
    setWalletBalance((prev) => prev + amount);
    addToast(`S$${amount} Added to Wallet`, `New stored balance: S$${(walletBalance + amount).toFixed(2)}`);
  };

  const cartTotalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100 flex flex-col font-sans selection:bg-[#22E07A] selection:text-[#0B1220]">
      {/* Fixed/Sticky Top Bar */}
      <TopNav
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab as any)}
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        unreadNotificationsCount={2}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenMcpConsole={() => setIsMcpModalOpen(true)}
      />

      {/* Main Container - Centered column (max ~1200px) */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 pt-5">
        {currentTab === 'home' && (
          <HomeScreen
            onNavigateTab={(tab) => setCurrentTab(tab as any)}
            onOpenDirections={() => setIsDirectionsOpen(true)}
            onOpenReschedule={() => setIsRescheduleOpen(true)}
            onAddToCart={handleAddToCart}
            onOpenBooking={(venue) => setSelectedBookingVenue(venue)}
            onClaimPromo={handleClaimPromo}
            nextGame={nextGame}
          />
        )}

        {currentTab === 'kitchen' && (
          <KitchenScreen
            onOpenSnapModal={() => setIsSnapModalOpen(true)}
            onAddToCart={handleAddToCart}
            macros={macros}
            onSubscribePass={handleSubscribePass}
            isSubscribed={isKitchenSubscribed}
          />
        )}

        {currentTab === 'courts' && (
          <CourtsScreen
            onOpenBooking={(venue, slot) => {
              setSelectedBookingVenue(venue);
            }}
            autobooking={autobooking}
            onToggleAutobooking={handleToggleAutobooking}
            onEditAutobooking={() => setIsAutobookEditOpen(true)}
            onUpgradeActivePass={() => {
              addToast('ActivePass Pro', 'You are currently on the Pro Tier with full privileges!', 'info');
            }}
          />
        )}

        {currentTab === 'recovery' && (
          <RecoveryScreen
            onAddToCart={handleAddToCart}
            onOpenConsultModal={(nutritionist) => setSelectedNutritionist(nutritionist)}
            onCopyReferral={handleCopyReferral}
            referralCopied={referralCopied}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileScreen
            onTopUpWallet={handleTopUpWallet}
            walletBalance={walletBalance}
            isSubscribedKitchen={isKitchenSubscribed}
            onOpenDirections={() => setIsDirectionsOpen(true)}
            onOpenMcpConsole={() => setIsMcpModalOpen(true)}
          />
        )}
      </main>

      {/* Mobile Fixed Bottom Nav */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab as any)}
        cartCount={cartTotalCount}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckoutSuccess={handleCheckoutSuccess}
      />

      {/* Snap Your Meal Camera / Scanner Modal */}
      <SnapMealModal
        isOpen={isSnapModalOpen}
        onClose={() => setIsSnapModalOpen(false)}
        onLogMacros={handleLogMacrosFromSnap}
        onAddMatchedMealToCart={handleAddMatchedMealFromSnap}
      />

      {/* Court Booking Modal */}
      <BookingModal
        isOpen={!!selectedBookingVenue}
        onClose={() => setSelectedBookingVenue(null)}
        venue={selectedBookingVenue}
        onConfirmBooking={handleConfirmCourtBooking}
      />

      {/* Venue Directions Modal */}
      <DirectionsModal
        isOpen={isDirectionsOpen}
        onClose={() => setIsDirectionsOpen(false)}
        game={nextGame}
        onCopyAddress={handleCopyAddress}
        copied={copiedAddress}
      />

      {/* Reschedule Game Modal */}
      <RescheduleModal
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        game={nextGame}
        onConfirmReschedule={handleConfirmReschedule}
      />

      {/* Tele-Consult Booking Modal */}
      <ConsultModal
        isOpen={!!selectedNutritionist}
        onClose={() => setSelectedNutritionist(null)}
        nutritionist={selectedNutritionist}
        onConfirmConsult={handleConfirmConsult}
      />

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* MCP Console Modal (https://mcp.smithery.ai/elmer-meta) */}
      <McpConsoleModal
        isOpen={isMcpModalOpen}
        onClose={() => setIsMcpModalOpen(false)}
        onApplyToolResult={(toolName, data) => {
          if (toolName === 'calculate_nutrition_window') {
            setMacros((prev) => ({
              ...prev,
              consumedCalories: prev.consumedCalories + 200,
              protein: { ...prev.protein, current: prev.protein.current + (data.targetProteinGrams || 35) },
            }));
            addToast('MCP Recovery Targets Ingested', 'Updated post-game macros from MCP calculations.');
          } else if (toolName === 'get_cloud_kitchen_menu') {
            addToast('MCP Menu Inspected', 'Retrieved high-protein menu details from Central Kitchen.');
          } else if (toolName === 'get_court_schedule_and_rates') {
            addToast('MCP Schedule Checked', `Inspected rates for ${data.venue || 'OCBC Arena'}.`);
          } else if (toolName === 'check_court_availability') {
            addToast('MCP Availability Checked', `Retrieved ${data.availableSlots?.length || 3} available slots.`);
          } else {
            addToast('MCP Telemetry Analyzed', `Successfully ingested ${toolName} calculations.`);
          }
        }}
      />

      {/* Autobooking Config Modal */}
      <AutobookEditModal
        isOpen={isAutobookEditOpen}
        onClose={() => setIsAutobookEditOpen(false)}
        currentConfig={autobooking}
        onSaveConfig={(updated) => {
          setAutobooking((prev) => ({ ...prev, ...updated }));
          addToast('Autobooking Preferences Updated', 'Changes saved successfully.');
        }}
      />

      {/* Global Toast System */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
