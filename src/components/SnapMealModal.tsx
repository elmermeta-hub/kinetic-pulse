import React, { useState } from 'react';
import { X, Camera, Upload, Sparkles, CheckCircle, ArrowRight, RefreshCw } from 'lucide-react';

interface SnapMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogMacros: (macros: { calories: number; protein: number; carbs: number; fats: number; mealName: string }) => void;
  onAddMatchedMealToCart: (mealId: string) => void;
}

const SAMPLE_SCANS = [
  {
    id: 'sample-1',
    name: 'Grilled Salmon & Quinoa Bowl',
    image: '/src/assets/images/teriyaki_salmon_bowl_1791426968298.jpg',
    calories: 615,
    protein: 44,
    carbs: 51,
    fats: 17,
    confidence: '98.4%',
    recoveryScore: 'Optimal (Post-Cardio)',
    matchedKitchenId: 'meal-01',
    breakdown: [
      { item: 'Norwegian Salmon Fillet (180g)', p: 36, c: 0, f: 14, cal: 280 },
      { item: 'Steamed Tri-Color Quinoa (140g)', p: 6, c: 38, f: 2, cal: 195 },
      { item: 'Edamame & Avocado Slices (90g)', p: 2, c: 13, f: 1, cal: 140 },
    ],
  },
  {
    id: 'sample-2',
    name: 'Lean Flank Steak & Roasted Sweet Potato',
    image: '/src/assets/images/beef_sweet_potato_1791426982964.jpg',
    calories: 635,
    protein: 48,
    carbs: 53,
    fats: 13,
    confidence: '97.2%',
    recoveryScore: 'High Glycogen Replenishment',
    matchedKitchenId: 'meal-02',
    breakdown: [
      { item: 'Grass-Fed Flank Steak (200g)', p: 42, c: 0, f: 9, cal: 260 },
      { item: 'Roasted Sweet Potato Mash (180g)', p: 4, c: 45, f: 1, cal: 210 },
      { item: 'Charred Broccoli & Chimichurri', p: 2, c: 8, f: 3, cal: 165 },
    ],
  },
  {
    id: 'sample-3',
    name: 'Electro-Whey Berry Acai Smoothie',
    image: '/src/assets/images/recovery_smoothie_bowl_1791426994991.jpg',
    calories: 485,
    protein: 42,
    carbs: 47,
    fats: 7,
    confidence: '99.1%',
    recoveryScore: 'Rapid Cellular Hydration',
    matchedKitchenId: 'meal-03',
    breakdown: [
      { item: 'Wild Acai & Banana Puree (220ml)', p: 2, c: 44, f: 2, cal: 205 },
      { item: 'Hydrolyzed Whey Protein Isolate (35g)', p: 38, c: 1, f: 1, cal: 165 },
      { item: 'Hemp Seeds & Himalayan Salt', p: 2, c: 2, f: 4, cal: 115 },
    ],
  },
];

export const SnapMealModal: React.FC<SnapMealModalProps> = ({
  isOpen,
  onClose,
  onLogMacros,
  onAddMatchedMealToCart,
}) => {
  const [selectedScan, setSelectedScan] = useState(SAMPLE_SCANS[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartScan = (scanItem = selectedScan) => {
    setIsScanning(true);
    setHasScanned(false);
    setTimeout(() => {
      setIsScanning(false);
      setHasScanned(true);
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedPreview(url);
      setSelectedScan({
        ...SAMPLE_SCANS[0],
        name: 'Uploaded Athletic Meal (Custom)',
        image: url,
      });
      handleStartScan({
        ...SAMPLE_SCANS[0],
        name: 'Uploaded Athletic Meal (Custom)',
        image: url,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#0B1220] border border-white/10 rounded-3xl shadow-2xl p-5 sm:p-6 text-slate-100 z-10">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#22E07A]/15 border border-[#22E07A]/30 flex items-center justify-center text-[#22E07A]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white tracking-tight">
                Snap Your Meal · Vision Macro AI
              </h3>
              <p className="text-xs text-[#9AA4B2]">
                Instant caloric & athletic macro analysis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scan / Camera Viewfinder Area */}
        <div className="mt-5 space-y-4">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-[#141C2B] border border-white/10">
            <img
              src={uploadedPreview || selectedScan.image}
              alt={selectedScan.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Viewfinder Target Graphic */}
            <div className="absolute inset-4 sm:inset-6 border-2 border-dashed border-[#22E07A]/50 rounded-xl pointer-events-none flex flex-col justify-between p-3">
              <div className="flex justify-between text-[10px] font-mono text-[#22E07A] font-bold tracking-widest uppercase">
                <span>[SCAN ZONE]</span>
                <span>SPECTRAL SENSOR 4K</span>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-[#22E07A] font-bold tracking-widest uppercase">
                <span>MODEL: KINETIC-MACRO</span>
                <span>CONFIDENCE: {selectedScan.confidence}</span>
              </div>
            </div>

            {/* Scanning Line Animation */}
            {isScanning && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#22E07A] to-transparent shadow-[0_0_12px_#22E07A] animate-pulse top-1/2 -translate-y-1/2" />
            )}
          </div>

          {/* Quick Preset Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#9AA4B2] uppercase tracking-wider">
                Select Photo or Upload Own
              </span>
              <label className="cursor-pointer text-xs font-semibold text-[#22E07A] hover:underline flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {SAMPLE_SCANS.map((scan) => {
                const isSelected = selectedScan.id === scan.id && !uploadedPreview;
                return (
                  <button
                    key={scan.id}
                    onClick={() => {
                      setUploadedPreview(null);
                      setSelectedScan(scan);
                      setHasScanned(false);
                    }}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#22E07A] bg-[#22E07A]/10 text-white ring-1 ring-[#22E07A]'
                        : 'border-white/5 bg-[#141C2B] text-[#9AA4B2] hover:border-white/10'
                    }`}
                  >
                    <img
                      src={scan.image}
                      alt={scan.name}
                      className="w-full h-12 rounded-lg object-cover mb-1.5"
                    />
                    <div className="text-[11px] font-bold text-white truncate leading-tight">
                      {scan.name}
                    </div>
                    <div className="text-[10px] text-[#22E07A] font-semibold mt-0.5">
                      {scan.calories} kcal
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Trigger */}
          {!hasScanned && (
            <button
              onClick={() => handleStartScan()}
              disabled={isScanning}
              className="w-full py-3.5 rounded-full bg-[#22E07A] text-[#0B1220] font-display font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#1fcf6f] transition-all shadow-[0_0_16px_rgba(34,224,122,0.35)]"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Food Biomarkers...</span>
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  <span>Analyze Meal Macros Now</span>
                </>
              )}
            </button>
          )}

          {/* Scan Results View */}
          {hasScanned && (
            <div className="space-y-4 pt-2 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-[#141C2B] border border-[#22E07A]/30 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-[#22E07A] uppercase">
                      Analysis Complete · {selectedScan.confidence} Precision
                    </span>
                    <h4 className="font-display text-base font-bold text-white mt-0.5">
                      {selectedScan.name}
                    </h4>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold font-display text-white">
                      {selectedScan.calories}
                    </div>
                    <div className="text-[10px] text-[#9AA4B2] uppercase font-semibold">Total Kcal</div>
                  </div>
                </div>

                {/* Macro Badges */}
                <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-white/10">
                  <div className="p-2.5 rounded-xl bg-[#0B1220] border border-white/5">
                    <div className="text-sm font-bold text-[#22E07A]">{selectedScan.protein}g</div>
                    <div className="text-[10px] text-[#9AA4B2] uppercase font-semibold">Protein</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0B1220] border border-white/5">
                    <div className="text-sm font-bold text-sky-400">{selectedScan.carbs}g</div>
                    <div className="text-[10px] text-[#9AA4B2] uppercase font-semibold">Carbs</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0B1220] border border-white/5">
                    <div className="text-sm font-bold text-[#FF7A1A]">{selectedScan.fats}g</div>
                    <div className="text-[10px] text-[#9AA4B2] uppercase font-semibold">Fats</div>
                  </div>
                </div>

                {/* Ingredient Breakdown List */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-[#9AA4B2] uppercase tracking-wider">
                    Detected Ingredients:
                  </span>
                  {selectedScan.breakdown.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-0 text-slate-300"
                    >
                      <span>{item.item}</span>
                      <span className="text-[#9AA4B2] font-mono text-[11px]">
                        {item.p}g P / {item.c}g C / {item.cal} cal
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#22E07A]/10 text-[#22E07A] text-xs font-semibold">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Recommendation: {selectedScan.recoveryScore}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    onLogMacros({
                      calories: selectedScan.calories,
                      protein: selectedScan.protein,
                      carbs: selectedScan.carbs,
                      fats: selectedScan.fats,
                      mealName: selectedScan.name,
                    });
                    onClose();
                  }}
                  className="py-3 px-4 rounded-full bg-[#141C2B] hover:bg-slate-800 border border-[#22E07A] text-[#22E07A] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Log To Today's Macros</span>
                </button>

                <button
                  onClick={() => {
                    onAddMatchedMealToCart(selectedScan.matchedKitchenId);
                    onClose();
                  }}
                  className="py-3 px-4 rounded-full bg-[#22E07A] text-[#0B1220] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#1fcf6f] transition-all shadow-[0_0_12px_rgba(34,224,122,0.3)]"
                >
                  <span>Order Matched Bento</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
