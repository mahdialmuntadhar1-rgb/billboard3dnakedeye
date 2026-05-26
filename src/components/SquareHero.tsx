/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BusinessesService } from '../services/businesses';
import { Business, Language } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MapPin, Star, ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { SearchBar } from './SearchBar';

interface SquareHeroProps {
  lang: Language;
}

export const SquareHero: React.FC<SquareHeroProps> = ({ lang }) => {
  const { filters, setFilters, isRTL } = useApp();
  const [featured, setFeatured] = useState<Business[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Load a set of premium featured listings for slider carousel
  useEffect(() => {
    let active = true;
    const fetchFeatured = async () => {
      try {
        // Query the state with category = all, but we will filter clientside to pick featured listings
        const res = await BusinessesService.fetchBusinesses({
          searchQuery: '',
          category: 'all',
          location: 'all',
          priceLevels: [],
          minRating: 0,
          isVerified: false,
          isOpenNow: false,
          sortBy: 'highest_rated'
        }, { limit: 10 });
        
        if (active) {
          const featuredOnly = res.data.filter(b => b.isFeatured);
          setFeatured(featuredOnly.length > 0 ? featuredOnly : res.data.slice(0, 3));
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchFeatured();
    return () => {
      active = false;
    };
  }, []);

  // Set up auto-rotate for the carousel slideshow
  useEffect(() => {
    if (featured.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featured.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [featured]);

  const handleNext = () => {
    if (featured.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % featured.length);
  };

  const handlePrev = () => {
    if (featured.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + featured.length) % featured.length);
  };

  const currentSlide = featured[activeIndex];

  const handlePresetCategory = (categoryId: string) => {
    setFilters((prev) => ({ ...prev, category: categoryId }));
    const gridEl = document.getElementById('listings-grid-view');
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const categoryLabels: Record<string, Record<Language, string>> = {
    'restaurants-cafes': { en: 'Restaurants & Cafes', ar: 'المطاعم والمقاهي', ku: 'چێشتخانە و کافێکان' },
    'it-software': { en: 'IT & Software', ar: 'البرمجيات والتقنية', ku: 'تەکنەلۆژیا' },
    'health-medical': { en: 'Health & Medical', ar: 'الخدمات الصحية', ku: 'تەندروستی' },
    'hotels-hospitality': { en: 'Hotels & Hospitality', ar: 'الفنادق والضيافة', ku: 'هۆتێل و میوانداری' },
    'retail-stores': { en: 'Retail Stores', ar: 'محلات التجزئة', ku: 'فرۆشگاکان' }
  };

  return (
    <section id="homepage-square-hero" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-zinc-200 p-6 sm:p-10 rounded-3xl shadow-sm overflow-hidden mb-12">
      
      {/* LEFT COLUMN: Curated Enterprise Search Controls (Span 7) */}
      <div className="lg:col-span-7 space-y-6 text-left">
        
        {/* Soft Ambient Sparkle Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-1050 bg-stone-100 border border-zinc-200/80 rounded-full text-[10px] font-bold text-zinc-900 uppercase tracking-widest leading-none">
          <Sparkles className="w-3.5 h-3.5 text-zinc-900 animate-pulse" />
          <span>
            {lang === 'en' ? 'Verified Enterprise Directory' : (lang === 'ar' ? 'الدليل التجاري المعتمد' : 'ڕێبەری فەرمی کارەکان')}
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-zinc-900 tracking-tight leading-tight">
          {lang === 'en' ? (
            <>
              Discover the <span className="font-extrabold underline decoration-zinc-950 underline-offset-8">Elite Footprint</span> of Local Commerce
            </>
          ) : lang === 'ar' ? (
            <>
              اكتشف <span className="font-extrabold underline decoration-zinc-950 underline-offset-8">البصمة النخبوية</span> للشركات المحلية
            </>
          ) : (
            <>
              باشترین <span className="font-extrabold underline decoration-zinc-950 underline-offset-8">کار و پیشەکانی</span> شار بدۆزەرەوە
            </>
          )}
        </h1>

        <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed max-w-xl">
          {lang === 'en' 
            ? 'An architectural-grade directory mapping boutique hotels, design hubs, customized coworking spots, and premium culinary institutions with deep filtration metrics.' 
            : lang === 'ar'
              ? 'منصة استكشافية متقدمة لربط مساحات العمل الحرفية، معامل التصميم البوتيكية، الفنادق الفاخرة، والصناعات المحلية الرائدة بعناية فائقة.'
              : 'ڕێبەرێکی باوەڕپێکراو بۆ دۆزینەوەی باشترین مەکۆکانی کار، تەکنەلۆژیا، مۆتێل و شوێنی نیشتەجێبوون بە دیزاینی نایاب.'
          }
        </p>

        {/* Dynamic Multi-lingual Integrated Search Input Bar */}
        <div className="max-w-xl">
          <SearchBar
            initialValue={filters.searchQuery}
            onSearch={(val) => setFilters((p) => ({ ...p, searchQuery: val }))}
            lang={lang}
          />
        </div>

        {/* Preset Category Capsules */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block font-mono">
            {lang === 'en' ? 'Premium Sectors' : 'القطاعات المفضلة'}
          </span>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {Object.entries(categoryLabels).map(([id, slug]) => {
              const isActive = filters.category === id;
              return (
                <button
                  key={id}
                  onClick={() => handlePresetCategory(id)}
                  className={`px-3 py-1.5 border rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-zinc-900 border-zinc-900 text-white shadow-xs' 
                      : 'bg-stone-50/50 border-zinc-200 text-zinc-650 hover:border-zinc-800'
                  }`}
                >
                  {lang === 'ar' ? slug.ar : (lang === 'ku' ? slug.ku : slug.en)}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Square Interactive Showcase Carousel (Span 5) */}
      <div className="lg:col-span-5 flex flex-col justify-center">
        {currentSlide ? (
          <div className="relative aspect-square w-full max-w-[360px] mx-auto bg-stone-100 rounded-3xl overflow-hidden border border-zinc-200 shadow-md group">
            
            {/* Display Active Slide Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                <img 
                  src={currentSlide.image} 
                  alt={currentSlide.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Backdrop ambient shader gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/30 to-black/30" />
              </motion.div>
            </AnimatePresence>

            {/* Slider Navigation arrows */}
            <div className="absolute top-4 right-4 flex gap-1.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                onClick={handlePrev}
                className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={handleNext}
                className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors flex items-center justify-center cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Featured Overlay Banner Accent */}
            <div className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-yellow-450 bg-amber-500 text-white text-[9px] uppercase font-nanum font-bold tracking-widest rounded-md shadow-xs animate-pulse flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-white" />
              <span>{lang === 'en' ? 'Highlight' : 'مميزة'}</span>
            </div>

            {/* Carousel Slide Title Footer details card */}
            <div className={`absolute bottom-0 inset-x-0 p-5 sm:p-6 text-white space-y-2 z-10 text-left`}>
              
              <div className="flex items-center justify-between text-[10px] tracking-wide font-semibold text-zinc-300">
                <span className="uppercase text-[9px] tracking-wider px-2 py-0.5 bg-white/15 rounded-md backdrop-blur-xs">
                  {lang === 'ar' ? categoryLabels[currentSlide.category]?.ar : categoryLabels[currentSlide.category]?.en}
                </span>
                
                {/* Rating star feedback */}
                <span className="flex items-center gap-1 text-yellow-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{currentSlide.rating}</span>
                </span>
              </div>

              <h3 className="font-display font-bold text-lg sm:text-xl leading-tight block truncate">
                {lang === 'ar' ? currentSlide.nameAr : currentSlide.name}
              </h3>

              <div className="flex items-center gap-1.5 text-xs text-zinc-200">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  {lang === 'ar' ? currentSlide.locationAr : currentSlide.location} — {lang === 'ar' ? currentSlide.addressAr : currentSlide.address}
                </span>
              </div>

              {/* Progress indicators dots */}
              <div className="flex gap-1 pt-2 items-center">
                {featured.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setActiveIndex(dotIdx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      dotIdx === activeIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
                    }`}
                  />
                ))}
              </div>

            </div>

          </div>
        ) : (
          <div className="aspect-square w-full max-w-[360px] mx-auto bg-stone-50 border border-dashed border-zinc-300 rounded-3xl flex flex-col items-center justify-center p-6 space-y-2">
            <Compass className="w-8 h-8 text-zinc-300 animate-spin" />
            <span className="text-xs text-zinc-400 font-mono">assembling elite showcases...</span>
          </div>
        )}
      </div>

    </section>
  );
};
