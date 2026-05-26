import React, { useEffect, useState } from 'react';
import { CategoriesService, Category } from '../services/categories';
import { Language, FilterState } from '../types';

interface CategoryGridProps {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  lang: Language;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  activeCategory,
  onSelectCategory,
  lang,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const isRTL = lang === 'ar' || lang === 'ku';

  useEffect(() => {
    let active = true;
    const load = async () => {
      const fetched = await CategoriesService.fetchCategories();
      if (active) {
        setCategories(fetched);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const t = {
    en: {
      all: 'All Categories',
      choose: 'Explore Luxury Sectors',
      subtitle: 'Premium curations certified by elite commerce associations',
    },
    ar: {
      all: 'جميع الفئات',
      choose: 'استكشف قطاعات النخبة',
      subtitle: 'مجموعات متميزة معتمدة من جمعيات التجارة الراقية',
    },
    ku: {
      all: 'هەموو بوارەکان',
      choose: 'سێکتەرە نایابەکان بەسەربکەرەوە',
      subtitle: 'کۆکراوەی سەرنجڕاکێشی پەسەندکراو',
    },
  }[lang] || {
    all: 'All Categories',
    choose: 'Explore Luxury Sectors',
    subtitle: 'Premium curations certified by elite commerce associations',
  };

  return (
    <div className="space-y-4" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <div>
        <h3 className="text-xs font-bold text-amber-600/95 uppercase tracking-widest">
          {t.choose}
        </h3>
        <p className="text-[11px] sm:text-xs text-zinc-400 font-medium">
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
        {/* 'All' category capsule card */}
        <button
          onClick={() => onSelectCategory('all')}
          className={`group flex items-center gap-3 p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
            activeCategory === 'all'
              ? 'bg-zinc-950 border-amber-500/80 text-white shadow-md shadow-zinc-950/20 scale-[1.02]'
              : 'bg-white border-zinc-200/90 text-zinc-900 hover:border-zinc-800 hover:shadow-sm'
          }`}
        >
          <div
            className={`p-2 rounded-lg shrink-0 transition-colors ${
              activeCategory === 'all'
                ? 'bg-amber-500 text-zinc-950'
                : 'bg-zinc-100 text-zinc-650 group-hover:bg-zinc-200 group-hover:text-zinc-950'
            }`}
          >
            <span className="w-4 h-4 text-xs font-extrabold flex items-center justify-center leading-none">
              ★
            </span>
          </div>
          <div className="flex-1 truncate">
            <div className="text-[11px] font-bold uppercase tracking-wider leading-tight">
              {t.all}
            </div>
            <div className="text-[9px] text-zinc-400 font-bold group-hover:text-zinc-500 transition-colors">
              {categories.length} {lang === 'en' ? 'Sectors' : 'قطاعات'}
            </div>
          </div>
        </button>

        {/* Dynamic categories list */}
        {categories.map((cat) => {
          const IconComponent = CategoriesService.getCategoryIcon(cat.iconName);
          const isSelected = activeCategory === cat.id;
          const label = cat.labels[lang] || cat.name;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`group flex items-center gap-3 p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                isSelected
                  ? 'bg-zinc-950 border-amber-500/80 text-white shadow-md shadow-zinc-950/20 scale-[1.02]'
                  : 'bg-white border-zinc-200/90 text-zinc-900 hover:border-zinc-800 hover:shadow-sm'
              }`}
            >
              <div
                className={`p-2 rounded-lg shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-amber-500 text-zinc-950'
                    : 'bg-zinc-100 text-zinc-650 group-hover:bg-zinc-200 group-hover:text-zinc-950'
                }`}
              >
                <IconComponent className="w-4 h-4" />
              </div>
              <div className="flex-1 truncate">
                <div className="text-[11px] font-bold uppercase tracking-wider leading-tight">
                  {label}
                </div>
                <div className="text-[9px] text-zinc-400 font-bold group-hover:text-zinc-500 transition-colors">
                  {lang === 'en' ? 'Bespoke' : 'متميز'}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
