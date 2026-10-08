export interface UserProfile {
  name: string;
  avatar: string;
  level: number;
  points: number;
  passTier: string;
  location: string;
  walletBalance: number;
  weeklySessionsCount: number;
}

export interface ScheduledGame {
  id: string;
  sport: 'Badminton' | 'Tennis' | 'Pickleball' | 'Futsal';
  venueName: string;
  courtNumber: string;
  address: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  qrCodeUrl?: string;
}

export interface MacroInfo {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface MealItem {
  id: string;
  name: string;
  category: 'high-protein' | 'vegan' | 'low-carb' | 'post-workout';
  tags: string[];
  description: string;
  price: number;
  macros: MacroInfo;
  prepTimeMinutes: number;
  imageUrl: string;
  isPopular?: boolean;
}

export interface VenueItem {
  id: string;
  name: string;
  area: string;
  distanceKm: number;
  sport: 'Badminton' | 'Tennis' | 'Pickleball' | 'Futsal';
  pricePerHour: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  nextAvailableSlot: string;
  availableSlots: string[];
}

export interface Nutritionist {
  id: string;
  name: string;
  credentials: string;
  specialty: string;
  rating: number;
  reviewsCount: number;
  consultationFee: number;
  imageUrl: string;
  nextSlot: string;
}

export interface AutobookingConfig {
  enabled: boolean;
  sport: string;
  venue: string;
  preferredDay: string;
  preferredTime: string;
  courtTier: string;
  successRate: number;
  nextAutoBookedDate: string;
  nextAutoBookedSlot: string;
  paymentMethod: string;
}

export const USER_DATA: UserProfile = {
  name: 'Alex Tan',
  avatar: '/src/assets/images/athlete_alex_avatar_1791442567847.jpg',
  level: 14,
  points: 1240,
  passTier: 'ActivePass Pro',
  location: 'SINGAPORE · CENTRAL',
  walletBalance: 84.50,
  weeklySessionsCount: 4,
};

export const NEXT_GAME: ScheduledGame = {
  id: 'game-101',
  sport: 'Badminton',
  venueName: 'OCBC Arena Kallang',
  courtNumber: 'Court 3 (Pro Vinyl Surface)',
  address: '5 Stadium Drive, Singapore 397631',
  date: 'Tonight, 15 Oct',
  time: '20:00 - 21:00',
  duration: '60 mins',
  price: 24.00,
};

export const TODAY_MACROS = {
  consumedCalories: 1720,
  targetCalories: 2450,
  protein: { current: 146, target: 175, unit: 'g' },
  carbs: { current: 182, target: 240, unit: 'g' },
  fats: { current: 48, target: 65, unit: 'g' },
};

export const MEALS_DATA: MealItem[] = [
  {
    id: 'meal-01',
    name: 'Atlantic Salmon & Tri-Color Quinoa Bowl',
    category: 'high-protein',
    tags: ['HIGH PROTEIN', 'OMEGA-3', 'RECOVERY'],
    description: 'Crispy skin salmon fillet, steamed edamame, Hass avocado, furikake, pickled radish & yuzu ponzu reduction.',
    price: 18.50,
    macros: { calories: 620, protein: 44, carbs: 52, fats: 18 },
    prepTimeMinutes: 12,
    imageUrl: '/src/assets/images/teriyaki_salmon_bowl_1791426968298.jpg',
    isPopular: true,
  },
  {
    id: 'meal-02',
    name: 'Tender Flank Beef & Roasted Sweet Potato Mash',
    category: 'post-workout',
    tags: ['GLYCO RECHARGE', 'HIGH PROTEIN', 'IRON BOOST'],
    description: 'Grass-fed flank steak slices, slow-roasted sweet potato mash, charred broccoli florets and chimichurri jus.',
    price: 21.00,
    macros: { calories: 640, protein: 48, carbs: 54, fats: 14 },
    prepTimeMinutes: 14,
    imageUrl: '/src/assets/images/beef_sweet_potato_1791426982964.jpg',
    isPopular: true,
  },
  {
    id: 'meal-03',
    name: 'Electro-Whey Glyco-Recharge Acai Bowl & Shake',
    category: 'post-workout',
    tags: ['RAPID ABSORPTION', 'ELECTROLYTES', 'BCAA'],
    description: 'Cold-pressed wild acai puree, hydrolyzed whey isolate, hemp seeds, banana coins & Himalayan pink salt electrolyte blend.',
    price: 15.50,
    macros: { calories: 490, protein: 42, carbs: 48, fats: 8 },
    prepTimeMinutes: 8,
    imageUrl: '/src/assets/images/recovery_smoothie_bowl_1791426994991.jpg',
    isPopular: true,
  },
  {
    id: 'meal-04',
    name: 'High-Protein Sesame Teriyaki Bento',
    category: 'high-protein',
    tags: ['LEAN MEAT', 'PROBIOTIC', 'MACRO BALANCED'],
    description: 'Marinated sous-vide chicken breast or baked tofu, tamagoyaki, multigrain rice, sesame greens & house kimchi.',
    price: 16.80,
    macros: { calories: 580, protein: 50, carbs: 58, fats: 12 },
    prepTimeMinutes: 10,
    imageUrl: '/src/assets/images/teriyaki_chicken_bento_1791442504331.jpg',
  },
  {
    id: 'meal-05',
    name: 'Vegan Electrolyte Green Goddess Grain Bowl',
    category: 'vegan',
    tags: ['PLANT BASED', 'GUT HEALTH', 'POTASSIUM'],
    description: 'Golden tempeh cubes, baby spinach, roasted chickpeas, organic farro, crushed pistachios & green tahini dressing.',
    price: 15.00,
    macros: { calories: 510, protein: 30, carbs: 64, fats: 14 },
    prepTimeMinutes: 10,
    imageUrl: '/src/assets/images/green_goddess_bowl_1791442515817.jpg',
  },
  {
    id: 'meal-06',
    name: 'Keto Seared Ribeye & Truffle Cauliflower Mash',
    category: 'low-carb',
    tags: ['LOW CARB', 'KETO FRIENDLY', 'HIGH FAT'],
    description: 'Grain-fed black angus cuts, creamy cauliflower puree with white truffle infusion, sautéed asparagus tips.',
    price: 24.50,
    macros: { calories: 590, protein: 52, carbs: 12, fats: 38 },
    prepTimeMinutes: 15,
    imageUrl: '/src/assets/images/beef_sweet_potato_1791426982964.jpg',
  },
];

export const VENUES_DATA: VenueItem[] = [
  {
    id: 'venue-01',
    name: 'OCBC Arena (Singapore Sports Hub)',
    area: 'Kallang, Central East',
    distanceKm: 2.4,
    sport: 'Badminton',
    pricePerHour: 24,
    rating: 4.95,
    reviewsCount: 382,
    imageUrl: '/src/assets/images/badminton_court_sg_1791426954042.jpg',
    nextAvailableSlot: 'Tonight · 20:00',
    availableSlots: ['19:00', '20:00', '21:00', '22:00'],
  },
  {
    id: 'venue-02',
    name: 'Marina Bay ActiveArena Courts',
    area: 'Downtown Marina, South',
    distanceKm: 1.2,
    sport: 'Pickleball',
    pricePerHour: 34,
    rating: 4.90,
    reviewsCount: 215,
    imageUrl: '/src/assets/images/pickleball_court_sg_1791442475871.jpg',
    nextAvailableSlot: 'Today · 18:30',
    availableSlots: ['18:30', '19:30', '20:30'],
  },
  {
    id: 'venue-03',
    name: 'Bishan Clubhouse & Sports Hall',
    area: 'Bishan, Central North',
    distanceKm: 5.8,
    sport: 'Tennis',
    pricePerHour: 22,
    rating: 4.88,
    reviewsCount: 412,
    imageUrl: '/src/assets/images/tennis_court_sg_1791442460383.jpg',
    nextAvailableSlot: 'Tomorrow · 07:00',
    availableSlots: ['07:00', '08:00', '17:00', '19:00'],
  },
  {
    id: 'venue-04',
    name: 'Jurong West ActiveSG Sports Complex',
    area: 'Jurong West, West Region',
    distanceKm: 12.1,
    sport: 'Badminton',
    pricePerHour: 18,
    rating: 4.82,
    reviewsCount: 520,
    imageUrl: '/src/assets/images/badminton_court_sg_1791426954042.jpg',
    nextAvailableSlot: 'Tonight · 21:00',
    availableSlots: ['20:00', '21:00', '22:00'],
  },
  {
    id: 'venue-05',
    name: 'Heartbeat@Bedok Sports Hub',
    area: 'Bedok, East Region',
    distanceKm: 8.6,
    sport: 'Futsal',
    pricePerHour: 42,
    rating: 4.85,
    reviewsCount: 310,
    imageUrl: '/src/assets/images/futsal_pitch_sg_1791442493164.jpg',
    nextAvailableSlot: 'Tomorrow · 19:00',
    availableSlots: ['18:00', '19:00', '20:00'],
  },
  {
    id: 'venue-06',
    name: 'Our Tampines Hub Indoor Court Zone',
    area: 'Tampines, East Region',
    distanceKm: 13.4,
    sport: 'Pickleball',
    pricePerHour: 20,
    rating: 4.78,
    reviewsCount: 290,
    imageUrl: '/src/assets/images/pickleball_court_sg_1791442475871.jpg',
    nextAvailableSlot: 'Thu · 18:00',
    availableSlots: ['18:00', '19:00', '21:00'],
  },
];

export const NUTRITIONISTS_DATA: Nutritionist[] = [
  {
    id: 'nutri-01',
    name: 'Dr. Clara Lim, PhD, CSCS',
    credentials: 'Ex-Singapore National Team Dietitian · IOC Certified',
    specialty: 'Racket Sports Glycogen & Hydration Periodization',
    rating: 4.98,
    reviewsCount: 164,
    consultationFee: 65,
    imageUrl: '/src/assets/images/nutritionist_dr_clara_1791427010732.jpg',
    nextSlot: 'Tomorrow · 14:00',
  },
  {
    id: 'nutri-02',
    name: 'Marcus Chen, MSc, RD',
    credentials: 'Sports Science Institute · Precision Body Comp Lead',
    specialty: 'High-Impact Recovery & Lean Hypertrophy',
    rating: 4.94,
    reviewsCount: 128,
    consultationFee: 55,
    imageUrl: '/src/assets/images/sports_nutritionist_male_1791442535289.jpg',
    nextSlot: 'Fri · 10:30',
  },
  {
    id: 'nutri-03',
    name: 'Sarah Nadirah, APD',
    credentials: 'Clinical Sports Nutritionist · Anti-Inflammatory Protocol',
    specialty: 'Post-Match Joint Recovery & Plant-Based Performance',
    rating: 4.96,
    reviewsCount: 112,
    consultationFee: 60,
    imageUrl: '/src/assets/images/sports_dietitian_female_1791442554911.jpg',
    nextSlot: 'Sat · 11:00',
  },
];

export const INITIAL_AUTOBOOKING: AutobookingConfig = {
  enabled: true,
  sport: 'Badminton',
  venue: 'OCBC Arena Kallang',
  preferredDay: 'Tuesdays & Thursdays',
  preferredTime: '20:00 - 21:00',
  courtTier: 'Court 1 - 4 (Pro Flooring)',
  successRate: 98.4,
  nextAutoBookedDate: 'Thu, 17 Oct',
  nextAutoBookedSlot: '20:00 - 21:00 · Court 04',
  paymentMethod: 'DBS PayLah! (Default)',
};

export const RECOVERY_SESSION_DATA = {
  sport: 'Badminton (Singles Match)',
  durationMinutes: 65,
  caloriesBurned: 640,
  averageHeartRate: 154,
  peakHeartRate: 182,
  muscleFatigueZones: [
    { zone: 'Quadriceps & Glutes', level: 'Moderate Fatigue', percentage: 72, color: '#FF7A1A' },
    { zone: 'Achilles & Calves', level: 'Low Strain', percentage: 38, color: '#22E07A' },
    { zone: 'Dominant Shoulder & Rotator', level: 'Elevated Strain', percentage: 81, color: '#FF7A1A' },
    { zone: 'Core & Lower Back', level: 'Normal', percentage: 24, color: '#22E07A' },
  ],
  hydrationDeficitMl: 780,
  electrolytesLossMg: 920,
  recommendedRecoveryTimeHours: 18,
};
