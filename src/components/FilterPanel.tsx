import React, { useEffect, useState } from 'react';
import { 
  Building2, 
  Utensils, 
  Cpu, 
  Star, 
  ShieldCheck, 
  Clock,
  RotateCcw,
  Sliders,
  DollarSign
} from 'lucide-react';
import { FilterState, Language } from '../types';
import { getDefaultFilters } from '../utils/queryBuilder';
import { CategoriesService, Category } from '../services/categories';

interface FilterPanelProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  lang: Language;
}

const LOCATIONS = [
  { id: 'all', label: 'All Governorates', labelAr: 'كل المحافظات', labelKu: 'هەموو پارێزگاکان' },
  { id: 'Baghdad', label: 'Baghdad', labelAr: 'بغداد', labelKu: 'بەغداد' },
  { id: 'Nineveh', label: 'Nineveh', labelAr: 'نينوى', labelKu: 'نەینەوا' },
  { id: 'Basra', label: 'Basra', labelAr: 'البصرة', labelKu: 'بەسرە' },
  { id: 'Sulaymaniyah', label: 'Sulaymaniyah', labelAr: 'السليمانية', labelKu: 'سلێمانی' },
  { id: 'Erbil', label: 'Erbil', labelAr: 'أربيل', labelKu: 'هەولێر' },
  { id: 'Kirkuk', label: 'Kirkuk', labelAr: 'كركوك', labelKu: 'کەرکووک' },
  { id: 'Babil', label: 'Babil', labelAr: 'بابل', labelKu: 'بابل' },
  { id: 'Al-Anbar', label: 'Al-Anbar', labelAr: 'الأنبار', labelKu: 'ئەنبار' },
  { id: 'Najaf', label: 'Najaf', labelAr: 'النجف', labelKu: 'نەجەف' },
  { id: 'Karbala', label: 'Karbala', labelAr: 'كربلاء', labelKu: 'کەربەلا' },
  { id: 'Dhi Qar', label: 'Dhi Qar', labelAr: 'ذي قار', labelKu: 'زی قار' },
  { id: 'Al-Qadisiyyah', label: 'Al-Qadisiyyah', labelAr: 'القادسية', labelKu: 'قادسیە' },
  { id: 'Diyala', label: 'Diyala', labelAr: 'ديالى', labelKu: 'دیالە' },
  { id: 'Wasit', label: 'Wasit', labelAr: 'واسط', labelKu: 'واست' },
  { id: 'Maysan', label: 'Maysan', labelAr: 'ميسان', labelKu: 'میسان' },
  { id: 'Salah al-Din', label: 'Salah al-Din', labelAr: 'صلاح الدين', labelKu: 'سەلاحەدین' },
  { id: 'Dohuk', label: 'Dohuk', labelAr: 'دهوك', labelKu: 'دهۆک' },
  { id: 'Muthanna', label: 'Muthanna', labelAr: 'المثنى', labelKu: 'موتەننا' },
  { id: 'Halabja', label: 'Halabja', labelAr: 'حلبجة', labelKu: 'هەڵەبجە' }
];

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, setFilters, lang }) => {
  const isRTL = lang === 'ar' || lang === 'ku';
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let active = true;
    CategoriesService.fetchCategories().then((res) => {
      if (active) {
        setCategories(res);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const handlePriceToggle = (priceLevel: string) => {
    setFilters((prev) => {
      const active = prev.priceLevels.includes(priceLevel)
        ? prev.priceLevels.filter((p) => p !== priceLevel)
        : [...prev.priceLevels, priceLevel];
      return { ...prev, priceLevels: active };
    });
  };

  const resetFilters = () => {
    setFilters((prev) => ({
      ...getDefaultFilters(),
      sortBy: prev.sortBy // preserve sorting
    }));
  };

  const getCategoryLabel = (cat: any) => {
    return cat.labels?.[lang] || cat.label || cat.name;
  };

  const getLocationLabel = (loc: typeof LOCATIONS[0]) => {
    if (lang === 'ar') return loc.labelAr;
    if (lang === 'ku') return loc.labelKu;
    return loc.label;
  };

  const t = {
    en: {
      refineExplorer: 'Refine Explorer',
      reset: 'Reset',
      segments: 'Industry Segments',
      district: 'Iraq Governorate',
      pricing: 'Pricing Tier',
      minRating: 'Minimum Rating',
      any: 'Any',
      toggles: 'Safety & Status',
      verified: 'Verified Listings Only',
      open: 'Open Right Now'
    },
    ar: {
      refineExplorer: 'تصفية النتائج',
      reset: 'إعادة تعيين',
      segments: 'القطاعات والمجالات',
      district: 'المحافظة العراقية',
      pricing: 'الفئة السعرية المحددة',
      minRating: 'الحد الأدنى للتقييم',
      any: 'الكل',
      toggles: 'حالة النشاط والتوثيق',
      verified: 'المؤسسات الموثقة فقط',
      open: 'مفتوح الآن في الخدمة'
    },
    ku: {
      refineExplorer: 'فلتەرکردنی پیشەکان',
      reset: 'پاککردنەوە',
      segments: 'سێکتەرەکان',
      district: 'پارێزگای عێراق',
      pricing: 'ئاستی نرخ',
      minRating: 'کەمترین نرخاندن',
      any: 'هەموو',
      toggles: 'دۆخ و دڵنیایی',
      verified: 'تەنها کارە موثقەکان',
      open: 'ئێستا کراوەیە'
    }
  }[lang] || {
    refineExplorer: 'Refine Explorer',
    reset: 'Reset',
    segments: 'Industry Segments',
    district: 'Iraq Governorate',
    pricing: 'Pricing Tier',
    minRating: 'Minimum Rating',
    any: 'Any',
    toggles: 'Safety & Status',
    verified: 'Verified Listings Only',
    open: 'Open Right Now'
  };

  return (
    <div id="filter-panel-core" className="space-y-6">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
        <h3 className="text-xs sm:text-sm font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-4 h-4 text-zinc-500" />
          {t.refineExplorer}
        </h3>
        <button
          id="sidebar-reset-filters-btn"
          onClick={resetFilters}
          className="text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-1 cursor-pointer leading-none"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{t.reset}</span>
        </button>
      </div>

      {/* Category List */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
          {t.segments}
        </span>
        <div className="space-y-1">
          {[{ id: 'all', labels: { en: 'All Fields', ar: 'جميع المجالات', ku: 'هەموو بوارەکان' }, iconName: 'Building2' }, ...categories].map((cat) => {
            const Icon = CategoriesService.getCategoryIcon(cat.iconName);
            const isSelected = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setFilters((prev) => ({ ...prev, category: cat.id }))}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-950 text-white shadow-lg shadow-zinc-950/20 scale-102 border-l-4 border-zinc-500'
                    : 'text-zinc-655 hover:bg-zinc-100/70'
                }`}
                style={{ direction: isRTL ? 'rtl' : 'ltr' }}
              >
                <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? 'bg-white/10 text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="flex-1 truncate">{getCategoryLabel(cat)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Localized Districts Selection */}
      <div className="space-y-2 border-t border-zinc-100 pt-5">
        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
          {t.district}
        </label>
        <div className="relative">
          <select
            value={filters.location}
            onChange={(e) => setFilters((p) => ({ ...p, location: e.target.value }))}
            className="w-full text-xs font-bold text-zinc-700 bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-3 focus:outline-none focus:border-zinc-800 focus:bg-white transition-colors cursor-pointer appearance-none"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {getLocationLabel(loc)}
              </option>
            ))}
          </select>
          <div className={`absolute inset-y-0 flex items-center pointer-events-none ${isRTL ? 'left-4' : 'right-4'}`}>
            <span className="text-[10px] text-zinc-400">▼</span>
          </div>
        </div>
      </div>

      {/* Price Class Selection */}
      <div className="space-y-3 border-t border-zinc-100 pt-5">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
          {t.pricing}
        </span>
        <div className="grid grid-cols-4 gap-1.5">
          {['$', '$$', '$$$', '$$$$'].map((level) => {
            const isSelected = filters.priceLevels.includes(level);
            return (
              <button
                key={level}
                type="button"
                onClick={() => handlePriceToggle(level)}
                className={`flex flex-col items-center justify-center py-2.5 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-950 text-white border-zinc-950 shadow-md scale-102'
                    : 'bg-white text-zinc-650 border-zinc-200 hover:border-zinc-400 hover:text-zinc-950'
                }`}
              >
                <div className="flex items-center gap-0.5">
                  <DollarSign className="w-3 h-3 text-zinc-450 shrink-0" />
                  <span className="tracking-tight">{level.length}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Rating Selection */}
      <div className="space-y-3 border-t border-zinc-100 pt-5">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
          {t.minRating}
        </span>
        <div className="grid grid-cols-4 gap-1.5">
          {[0, 3, 4, 4.5].map((stars) => {
            const isSelected = filters.minRating === stars;
            return (
              <button
                key={stars}
                type="button"
                onClick={() => setFilters((p) => ({ ...p, minRating: stars }))}
                className={`py-2 px-1 border rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-950 text-white border-zinc-950 shadow-md'
                    : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
                }`}
              >
                {stars === 0 ? (
                  <span>{t.any}</span>
                ) : (
                  <>
                    <span>{stars}</span>
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toggle Options */}
      <div className="space-y-3.5 border-t border-zinc-100 pt-5">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
          {t.toggles}
        </span>
        
        <div className="space-y-3">
          {/* Verified Toggle */}
          <label className="flex items-center justify-between cursor-pointer group hover:bg-zinc-50/50 p-2 -mx-2 rounded-xl transition-colors" dir={isRTL ? 'rtl' : 'ltr'}>
            <span className="text-xs font-semibold text-zinc-650 group-hover:text-zinc-950 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-zinc-400 shrink-0" />
              <span>{t.verified}</span>
            </span>
            <input
              type="checkbox"
              checked={filters.isVerified}
              onChange={(e) => setFilters((p) => ({ ...p, isVerified: e.target.checked }))}
              className="w-4.5 h-4.5 accent-zinc-950 rounded border-zinc-300 focus:ring-0 cursor-pointer"
            />
          </label>
 
          {/* Open Now Toggle */}
          <label className="flex items-center justify-between cursor-pointer group hover:bg-zinc-50/50 p-2 -mx-2 rounded-xl transition-colors" dir={isRTL ? 'rtl' : 'ltr'}>
            <span className="text-xs font-semibold text-zinc-650 group-hover:text-zinc-950 flex items-center gap-2">
              <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
              <span>{t.open}</span>
            </span>
            <input
              type="checkbox"
              checked={filters.isOpenNow}
              onChange={(e) => setFilters((p) => ({ ...p, isOpenNow: e.target.checked }))}
              className="w-4.5 h-4.5 accent-zinc-950 rounded border-zinc-300 focus:ring-0 cursor-pointer"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
