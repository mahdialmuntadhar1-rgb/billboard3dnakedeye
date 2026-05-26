import React from 'react';
import { X, Sliders, Trash2 } from 'lucide-react';
import { FilterState, Language } from '../types';
import { hasActiveFilters, getDefaultFilters } from '../utils/queryBuilder';

interface ActiveFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  lang: Language;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({ filters, setFilters, lang }) => {
  const isRTL = lang === 'ar' || lang === 'ku';

  if (!hasActiveFilters(filters)) {
    return null;
  }

  // Label Maps
  const categoryLabels: Record<Language, Record<string, string>> = {
    en: {
      'restaurants-cafes': 'Restaurants & Cafes',
      'food-beverage': 'Food & Beverage',
      'retail-stores': 'Retail Stores',
      'clothing-fashion': 'Clothing & Fashion',
      'electronics-tech': 'Electronics & Tech Shops',
      'automotive-services': 'Automotive Services',
      'real-estate': 'Real Estate',
      'beauty-salons': 'Beauty & Salons',
      'health-medical': 'Health & Medical Services',
      'fitness-gyms': 'Fitness & Gyms',
      'education-training': 'Education & Training Centers',
      'hotels-hospitality': 'Hotels & Hospitality',
      'travel-tourism': 'Travel & Tourism Services',
      'home-services': 'Home Services',
      'construction-contractors': 'Construction & Contractors',
      'it-software': 'IT & Software Services',
      'marketing-media': 'Marketing & Media Agencies',
      'financial-services': 'Financial Services',
      'legal-services': 'Legal Services',
      'entertainment-events': 'Entertainment & Events'
    },
    ar: {
      'restaurants-cafes': 'المطاعم والمقاهي',
      'food-beverage': 'الأغذية والمشروبات',
      'retail-stores': 'محلات التجزئة',
      'clothing-fashion': 'الملابس والأزياء',
      'electronics-tech': 'الإلكترونيات ومحلات التقنية',
      'automotive-services': 'خدمات السيارات',
      'real-estate': 'العقارات والبيع',
      'beauty-salons': 'الصالونات والتجميل',
      'health-medical': 'الخدمات الصحية والطبية',
      'fitness-gyms': 'اللياقة البدنية والنوادي',
      'education-training': 'التدريب والتعليم',
      'hotels-hospitality': 'الفنادق والضيافة',
      'travel-tourism': 'السفر والسياحة',
      'home-services': 'الخدمات المنزلية',
      'construction-contractors': 'المقاولات والبناء',
      'it-software': 'تكنولوجيا المعلومات والبرمجيات',
      'marketing-media': 'التسويق والوسائل الإعلامية',
      'financial-services': 'الخدمات المالية',
      'legal-services': 'الخدمات القانونية',
      'entertainment-events': 'الترفيه والفعاليات'
    },
    ku: {
      'restaurants-cafes': 'چێشتخانە و کافێکان',
      'food-beverage': 'خۆراک و خواردنەوە',
      'retail-stores': 'فرۆشگاکانی فرۆشتنی ورد',
      'clothing-fashion': 'جلوبەرگ و مۆدە',
      'electronics-tech': 'کۆمپیوتەر و ئەلیکترۆنیات',
      'automotive-services': 'خزمەتگوزارییەکانی ئۆتۆمبێل',
      'real-estate': 'خانووبەرە',
      'beauty-salons': 'جوانکاری و ساڵۆنەکان',
      'health-medical': 'خزمەتگوزارییە تەندروستییەکان',
      'fitness-gyms': 'لەشجوانی و هۆڵە وەرزشییەکان',
      'education-training': 'سەنتەرەکانی پەروەردە و ڕاهێنان',
      'hotels-hospitality': 'هۆتێل و میوانداری',
      'travel-tourism': 'گەشتوگوزار و گەشتەکان',
      'home-services': 'خزمەتگوزارییەکانی ماڵەوە',
      'construction-contractors': 'بەڵیندەران و بیناسازی',
      'it-software': 'تەکنەلۆژیای زانیاری و نەرمەکاڵا',
      'marketing-media': 'مارکێتینگ و میدیا',
      'financial-services': 'خزمەتگوزارییە داراییەکان',
      'legal-services': 'خزمەتگوزارییە یاساییەکان',
      'entertainment-events': 'کات بەسەربردن و بۆنەکان'
    }
  };

  const locationLabels: Record<Language, Record<string, string>> = {
    en: {
      'Silicon District': 'Silicon District',
      'Old Port District': 'Old Port District',
      Marinaside: 'Marinaside',
      Waterfront: 'Waterfront'
    },
    ar: {
      'Silicon District': 'منطقة السيليكون',
      'Old Port District': 'حي الميناء القديم',
      Marinaside: 'مرسى دبي',
      Waterfront: 'المنطقة المائية'
    },
    ku: {
      'Silicon District': 'ناوچەی سیلیكۆن',
      'Old Port District': 'گەڕەکی بەندەری کۆن',
      Marinaside: 'کەناری مارینا',
      Waterfront: 'کەناری ئاو'
    }
  };

  const t = {
    en: {
      activeFilters: 'Active Filters',
      clearAll: 'Clear All Filters',
      search: 'Search',
      category: 'Category',
      location: 'District',
      rating: 'Rating',
      price: 'Price',
      verified: 'Verified Only',
      open: 'Open Now'
    },
    ar: {
      activeFilters: 'الفلاتر النشطة',
      clearAll: 'مسح جميع الفلاتر',
      search: 'بحث',
      category: 'القطاع',
      location: 'المنطقة',
      rating: 'التقييم',
      price: 'السعر',
      verified: 'موثق فقط',
      open: 'مفتوح الآن'
    },
    ku: {
      activeFilters: 'فلتەرە چالاکەکان',
      clearAll: 'سڕینەوەی هەموو فلتەرەکان',
      search: 'گەڕان',
      category: 'پۆلێن',
      location: 'ناوچە',
      rating: 'نرخاندن',
      price: 'نرخ',
      verified: 'موثق تەنها',
      open: 'مفتوح ئێستا'
    }
  }[lang] || {
    activeFilters: 'Active Filters',
    clearAll: 'Clear All Filters',
    search: 'Search',
    category: 'Category',
    location: 'District',
    rating: 'Rating',
    price: 'Price',
    verified: 'Verified Only',
    open: 'Open Now'
  };

  const handleRemoveSearch = () => {
    setFilters((prev) => ({ ...prev, searchQuery: '' }));
  };

  const handleRemoveCategory = () => {
    setFilters((prev) => ({ ...prev, category: 'all' }));
  };

  const handleRemoveLocation = () => {
    setFilters((prev) => ({ ...prev, location: 'all' }));
  };

  const handleRemovePrice = (price: string) => {
    setFilters((prev) => ({
      ...prev,
      priceLevels: prev.priceLevels.filter((p) => p !== price)
    }));
  };

  const handleRemoveRating = () => {
    setFilters((prev) => ({ ...prev, minRating: 0 }));
  };

  const handleRemoveVerified = () => {
    setFilters((prev) => ({ ...prev, isVerified: false }));
  };

  const handleRemoveOpenNow = () => {
    setFilters((prev) => ({ ...prev, isOpenNow: false }));
  };

  const handleClearAll = () => {
    setFilters((prev) => ({
      ...getDefaultFilters(),
      sortBy: prev.sortBy // Preserve active sort option
    }));
  };

  // Build chips list
  const chips: { id: string; label: string; onRemove: () => void }[] = [];

  // Search Query Chip
  if (filters.searchQuery.trim()) {
    chips.push({
      id: 'search',
      label: `${t.search}: "${filters.searchQuery}"`,
      onRemove: handleRemoveSearch
    });
  }

  // Category Chip
  if (filters.category && filters.category !== 'all') {
    const label = categoryLabels[lang]?.[filters.category] || filters.category;
    chips.push({
      id: 'cat',
      label: `${t.category}: ${label}`,
      onRemove: handleRemoveCategory
    });
  }

  // Location Chip
  if (filters.location && filters.location !== 'all') {
    const label = locationLabels[lang]?.[filters.location] || filters.location;
    chips.push({
      id: 'loc',
      label: `${t.location}: ${label}`,
      onRemove: handleRemoveLocation
    });
  }

  // Price Level Chips
  filters.priceLevels.forEach((price) => {
    chips.push({
      id: `price-${price}`,
      label: `${t.price}: ${price}`,
      onRemove: () => handleRemovePrice(price)
    });
  });

  // Min Rating Chip
  if (filters.minRating > 0) {
    chips.push({
      id: 'rating',
      label: `${t.rating} ≥ ${filters.minRating} ★`,
      onRemove: handleRemoveRating
    });
  }

  // Verified Only Chip
  if (filters.isVerified) {
    chips.push({
      id: 'verified',
      label: t.verified,
      onRemove: handleRemoveVerified
    });
  }

  // Open Now Chip
  if (filters.isOpenNow) {
    chips.push({
      id: 'open',
      label: t.open,
      onRemove: handleRemoveOpenNow
    });
  }

  return (
    <div id="active-filters-row" className="flex flex-wrap items-center gap-2 pt-1 pb-2">
      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
        <Sliders className="w-3 h-3 text-zinc-400" />
        {t.activeFilters}:
      </span>

      <div className="flex flex-wrap items-center gap-1.5 flex-1">
        {chips.map((chip) => (
          <div
            key={chip.id}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 border border-zinc-200 hover:border-zinc-400 rounded-full text-[11px] font-bold text-zinc-750 transition-colors"
          >
            <span>{chip.label}</span>
            <button
              onClick={chip.onRemove}
              className="p-0.5 rounded-full hover:bg-zinc-250 text-zinc-400 hover:text-zinc-750 transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        <button
          onClick={handleClearAll}
          className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-extrabold text-red-650 hover:text-red-800 transition-colors uppercase tracking-wider cursor-pointer ml-1 sm:ml-2"
        >
          <Trash2 className="w-3 h-3" />
          <span>{t.clearAll}</span>
        </button>
      </div>
    </div>
  );
};
