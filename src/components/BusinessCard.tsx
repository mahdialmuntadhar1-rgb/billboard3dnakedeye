/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Star, 
  MapPin, 
  Bookmark, 
  ShieldCheck, 
  Sparkles, 
  ArrowUpRight 
} from 'lucide-react';
import { Business, Language } from '../types';

interface BusinessCardProps {
  business: Business;
  lang: Language;
  onSelect: (business: Business) => void;
  onOpenAuth: () => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ business, lang, onSelect, onOpenAuth }) => {
  const { user, toggleBookmark, isBookmarked } = useAuth();
  
  const isRTL = lang === 'ar' || lang === 'ku';
  const bookmarked = isBookmarked(business.id);

  const displayCategory = (cat: string) => {
    const map: Record<string, { label: string; labelAr: string; labelKu?: string; color: string }> = {
      tech: { label: 'Tech & Coworking', labelAr: 'التقنية والعمل المشترك', labelKu: 'تەکنەلۆژیا و کارکردنی هاوبەش', color: 'bg-blue-50 text-blue-700 border-blue-100' },
      restaurants: { label: 'Restaurants & Bistro', labelAr: 'المطاعم والطهي', labelKu: 'خواردەمەنی و چێشتخانە', color: 'bg-amber-50 text-amber-900 border-amber-100' },
      healthcare: { label: 'Medical & Wellness', labelAr: 'الصحة والعافية', labelKu: 'تەندروستی و دڵنیایی', color: 'bg-emerald-50 text-emerald-750 border-emerald-100' },
      hotels: { label: 'Hotels & Suites', labelAr: 'الفنادق والأجنحة', labelKu: 'هوتێل و سویتی لوکس', color: 'bg-purple-50 text-purple-750 border-purple-100' },
      retail: { label: 'Design & Craft', labelAr: 'التصميم والتجزئة', labelKu: 'ستۆدیۆ و دیزاین', color: 'bg-zinc-100 text-zinc-800 border-zinc-200' },
    };

    const item = map[cat] || { label: cat, labelAr: cat, labelKu: cat, color: 'bg-zinc-100 text-zinc-800 border-zinc-200' };
    const labelToDisplay = lang === 'en' ? item.label : (lang === 'ar' ? item.labelAr : (item.labelKu || item.label));
    
    return (
      <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${item.color}`}>
        {labelToDisplay}
      </span>
    );
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      onOpenAuth();
    } else {
      toggleBookmark(business.id);
    }
  };

  return (
    <article 
      onClick={() => onSelect(business)}
      className="bg-white rounded-2xl border border-zinc-200/90 overflow-hidden shadow-sm hover:shadow-md hover:border-zinc-350 transition-all duration-350 group flex flex-col cursor-pointer focus-within:ring-2 focus-within:ring-zinc-900 focus-within:ring-offset-2"
      id={`business-card-${business.id}`}
    >
      {/* Top Media Cover Overlay */}
      <div className="relative aspect-video w-full bg-zinc-100 overflow-hidden">
        <img 
          src={business.image} 
          alt={lang === 'en' ? business.name : (lang === 'ar' ? business.nameAr : (business.nameKu || business.name))}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Dynamic Badge Overlays */}
        <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} flex flex-col gap-1.5 z-10`}>
          {business.isFeatured && (
            <span className="inline-flex items-center gap-1 bg-zinc-950/85 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg border border-white/10">
              <Sparkles className="w-2.5 h-2.5 text-amber-300" />
              {lang === 'en' ? 'Featured' : (lang === 'ar' ? 'مميز' : 'تایبەت')}
            </span>
          )}
          {business.isVerified && (
            <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-md text-zinc-900 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg border border-zinc-200/40">
              <ShieldCheck className="w-3 h-3 text-zinc-850" />
              {lang === 'en' ? 'Verified' : (lang === 'ar' ? 'موثق' : 'سەلمێنراو')}
            </span>
          )}
        </div>

        {/* Bookmark Trigger */}
        <button
          onClick={handleBookmarkClick}
          className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-zinc-650 hover:text-zinc-950 border border-zinc-250/20 shadow-sm hover:scale-105 transition-all cursor-pointer z-10`}
          title={lang === 'en' ? 'Bookmark' : (lang === 'ar' ? 'حفظ العلامة المرجعية' : 'نیشانەکردن')}
        >
          <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-zinc-900 text-zinc-900' : ''}`} />
        </button>

        {/* Instant Open Status Indicator Badge */}
        <div className={`absolute bottom-3 ${isRTL ? 'left-3' : 'right-3'} z-10`}>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest backdrop-blur-md ${
            business.isOpenNow 
              ? 'bg-emerald-500/90 text-white' 
              : 'bg-zinc-850/90 text-zinc-100'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${business.isOpenNow ? 'bg-white animate-pulse' : 'bg-zinc-400'}`} />
            {business.isOpenNow 
              ? lang === 'en' ? 'Open Now' : (lang === 'ar' ? 'مفتوح الآن' : 'ئێستا کراوەیە')
              : lang === 'en' ? 'Closed Now' : (lang === 'ar' ? 'مغلق حالياً' : 'ئێستا داخراوە')
            }
          </span>
        </div>
      </div>

      {/* Content Space */}
      <div className="p-5 flex-1 flex flex-col" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        
        {/* Category & Price Indicator Row */}
        <div className="flex items-center justify-between mb-2 gap-2">
          {displayCategory(business.category)}
          <span className="text-xs font-bold text-zinc-400 tracking-wider">
            {business.priceLevel}
          </span>
        </div>

        {/* Business Title */}
        <h3 className="text-base font-display font-semibold text-zinc-900 group-hover:text-zinc-650 transition-colors flex items-center justify-between gap-1.5">
          <span className="truncate">{lang === 'en' ? business.name : (lang === 'ar' ? business.nameAr : (business.nameKu || business.name))}</span>
          <ArrowUpRight className="w-4 h-4 text-zinc-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
        </h3>

        {/* Brief description */}
        <p className="text-xs text-zinc-500 line-clamp-2 mt-1.5 mb-4 leading-relaxed font-normal">
          {lang === 'en' ? business.description : (lang === 'ar' ? business.descriptionAr : (business.descriptionKu || business.description))}
        </p>

        {/* Meta Stats Row (Bottom) */}
        <div className="mt-auto border-t border-zinc-100 pt-3 flex items-center justify-between gap-2">
          
          {/* Location details */}
          <div className="flex items-center gap-1 text-zinc-650 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="text-xs font-medium truncate">{lang === 'en' ? business.location : (lang === 'ar' ? business.locationAr : (business.locationKu || business.location))}</span>
          </div>

          {/* Aggregated Reviews details */}
          <div className="flex items-center gap-1 shrink-0 text-zinc-800">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
            <span className="text-xs font-bold">{business.rating}</span>
            <span className="text-[10px] text-zinc-400 font-medium">
              ({business.reviewsCount})
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
