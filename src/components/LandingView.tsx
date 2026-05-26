import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CategoriesService, Category } from '../services/categories';
import { Language } from '../types';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Compass, 
  MessageSquare, 
  Building2, 
  ShieldCheck,
  Star,
  ArrowUpRight
} from 'lucide-react';

interface LandingViewProps {
  lang: Language;
}

// Visual premium cover photos matching system categories
const CATEGORY_COVERS: Record<string, string> = {
  'restaurants-cafes': 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=400',
  'food-beverage': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400',
  'retail-stores': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=400',
  'clothing-fashion': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=400',
  'electronics-tech': 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=400',
  'automotive-services': 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=400',
  'real-estate': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400',
  'beauty-salons': 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=400',
  'health-medical': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400',
  'fitness-gyms': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400',
  'education-training': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=400',
  'hotels-hospitality': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400',
  'travel-tourism': 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=400',
  'home-services': 'https://images.unsplash.com/photo-1601160458000-2b11f9fa1a0e?auto=format&fit=crop&q=80&w=400',
  'construction-contractors': 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=400',
  'it-software': 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=400',
  'marketing-media': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400',
  'financial-services': 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=400',
  'legal-services': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400',
  'entertainment-events': 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=400',
};

export const LandingView: React.FC<LandingViewProps> = ({ lang }) => {
  const { setFilters, setActiveTab, isRTL } = useApp();
  const [categories, setCategories] = useState<Category[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    const fetchCats = async () => {
      const data = await CategoriesService.fetchCategories();
      if (active) setCategories(data);
    };
    fetchCats();
    return () => {
      active = false;
    };
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = 280;
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const handleCategorySelect = (categoryId: string) => {
    setFilters((prev) => ({ ...prev, category: categoryId }));
    setActiveTab('explore');
  };

  const t = {
    en: {
      tag: 'Integrated Local Commerce ecosystem',
      title: 'The Unified Interactive Gateway of Commerce',
      subtitle: 'Seamlessly transition between our community social exchange stream and verified architectural company directory catalog.',
      browseCats: 'Curated Commercial Sectors',
      catsSubtitle: 'Explore specialized niches featuring vibrant photography and direct filtration triggers',
      pathsTitle: 'Choose Your Platform Path',
      pathsSubtitle: 'Two main ways to engage, network, and grow with local businesses',
      feedLabel: 'Social Feed Channel',
      feedDesc: 'Stay tuned to real-time executive broadcasts, share media stories, interact via likes, comments, and experience community posts.',
      feedBtn: 'Enter Social Feed',
      dirLabel: 'Business Directory Hub',
      dirDesc: 'Browse verified high-fidelity listings, apply deep filters across cafes, workspaces, tech firms, and book premium experiences.',
      dirBtn: 'Browse Corporate Directory',
      verifiedTag: '100% Verified Partners'
    },
    ar: {
      tag: 'منظومة طاقة محلية متكاملة',
      title: 'البوابة التفاعلية الموحدة لمجتمع الأعمال',
      subtitle: 'تنقل بسلاسة بين ساحة التواصل الاجتماعي الحية ومنبر الدليل والمطاعم الموثق الشامل.',
      browseCats: 'القطاعات التجارية الحرفية',
      catsSubtitle: 'استكشف التخصصات النخبوية بصورها وتصنيفاتها المباشرة الفورية',
      pathsTitle: 'اختر مسارك لاستكشاف المنصة',
      pathsSubtitle: 'طريقتان رئيسيتان للتواصل، وبناء شبكتك المعرفية، والتفاعل مع الخدمات',
      feedLabel: 'المعرض الاجتماعي التفاعلي',
      feedDesc: 'تابع التحديثات المباشرة، انشر الملفات الإبداعية، ضع تعليقاتك البناءة وتفاعل مع مجتمع ملاك المنشآت.',
      feedBtn: 'دخول الساحة الاجتماعية',
      dirLabel: 'دليل النخبة للمنشآت',
      dirDesc: 'تصفح سجلات متميزة للمطاعم، الكافيهات، العيادات، واستكشف مميزات التصفية والتصنيف العميقة.',
      dirBtn: 'استعراض دليل المنشآت',
      verifiedTag: 'شركاء عمل موثقون ١٠٠٪'
    },
    ku: {
      tag: 'سیستمی تێکەڵاوی بازرگانی ناوخۆیی',
      title: 'مەکۆی گشتی و ڕێبەری یەکگرتووی کار و پڕۆژەکان',
      subtitle: 'بە ئاسانی لە نێوان گفتوگۆی گشتی کۆمەڵایەتی و ڕێبەری تایبەتی پڕۆژە متمانەپێکراوەکان گوزەر بکە.',
      browseCats: 'کۆمەڵە و بواری فەرمی کارەکان',
      catsSubtitle: 'سێکتەرەکان بە وێنەی سەرنجڕاکێش و کاریگەرەوە جیابکەرەوە',
      pathsTitle: 'ڕێڕەوی کارەکەت دیاریبکە',
      pathsSubtitle: 'دوو ڕێگای سەرەکی بۆ بەشداریکردن، دروستکردنی پەیوەندی و گەشەپێدان',
      feedLabel: 'مەکۆی کۆمەڵایەتی',
      feedDesc: 'بۆ بینینی هەواڵ، پۆستکردنی میدیا، لایک و کۆمێنت و بەشداری لە چالاکی کارەکان.',
      feedBtn: 'بینینی مەکۆ',
      dirLabel: 'ڕێبەری فەرمی پڕۆژەکان',
      dirDesc: 'بگەڕی بەدوای باشترین کافێ، مۆتێل، تەندروستی لەگەڵ فلتەری زۆر ورد.',
      dirBtn: 'ڕێبەری کارەکان بکەرەوە',
      verifiedTag: 'هاوبەشی متمانەپێکراو ١٠٠٪'
    }
  }[lang];

  return (
    <div className="space-y-16" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      
      {/* 1. Immersive Hero Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-stone-950 text-white rounded-3xl p-8 sm:p-14 border border-zinc-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-rose-500/5 blur-3xl" />
        
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest text-amber-400">
            <Sparkles className="w-3.5 h-3.5 fill-amber-400/20" />
            <span>{t.tag}</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-medium leading-none tracking-tight">
            {lang === 'en' ? (
              <>
                The Unified <span className="font-extrabold text-amber-400 underline decoration-amber-400/30 underline-offset-8">Interactive Gateway</span> of Commerce
              </>
            ) : lang === 'ar' ? (
              <>
                البوابة <span className="font-extrabold text-amber-400 underline decoration-amber-400/30 underline-offset-8">التفاعلية الموحدة</span> لمجتمع الأعمال
              </>
            ) : (
              <>
                مەکۆی گشتی و <span className="font-extrabold text-amber-400 underline decoration-amber-400/30 underline-offset-8">ڕێبەری یەکگرتووی</span> کارەکان
              </>
            )}
          </h1>

          <p className="text-stone-300 text-xs sm:text-base leading-relaxed max-w-2xl font-normal pt-2">
            {t.subtitle}
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-stone-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t.verifiedTag}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Categories Carousel Section */}
      <section className="space-y-4">
        <div className="flex items-end justify-between px-1">
          <div>
            <span className="text-amber-600 text-xs font-bold uppercase tracking-widest block font-mono">
              {t.browseCats}
            </span>
            <p className="text-[11px] sm:text-xs text-zinc-400 font-bold">
              {t.catsSubtitle}
            </p>
          </div>
          <div className="flex gap-1.5">
            <button 
              onClick={() => handleScroll('left')}
              className="w-9 h-9 rounded-xl border border-zinc-200 bg-white hover:border-zinc-800 text-zinc-700 transition-colors flex items-center justify-center cursor-pointer shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleScroll('right')}
              className="w-9 h-9 rounded-xl border border-zinc-200 bg-white hover:border-zinc-800 text-zinc-700 transition-colors flex items-center justify-center cursor-pointer shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Outer wrapper */}
        <div 
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent snap-x scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((cat) => {
            const bgImage = CATEGORY_COVERS[cat.id] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400';
            const Icon = CategoriesService.getCategoryIcon(cat.iconName);
            const label = cat.labels[lang] || cat.name;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className="flex-shrink-0 w-44 snap-start aspect-square bg-zinc-950 rounded-2xl overflow-hidden relative border border-zinc-200 shadow-sm group cursor-pointer text-left transition-transform duration-300 hover:scale-[1.03] hover:shadow-md"
              >
                {/* Background image */}
                <div className="absolute inset-0">
                  <img 
                    src={bgImage} 
                    alt={label} 
                    className="w-full h-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-4 flex flex-col justify-between text-white z-15">
                  <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/10">
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-xs uppercase font-mono tracking-widest text-amber-400 block font-semibold leading-none">
                      {lang === 'en' ? 'Explore' : 'استكشف'}
                    </span>
                    <h3 className="font-display font-bold text-xs sm:text-sm leading-tight text-white block truncate">
                      {label}
                    </h3>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Dual Path Glowing Option Blocks */}
      <section className="space-y-6">
        <div className="text-center max-w-lg mx-auto space-y-2">
          <h2 className="text-lg sm:text-2xl font-display font-bold text-zinc-900 tracking-tight">
            {t.pathsTitle}
          </h2>
          <p className="text-[11px] sm:text-xs text-zinc-400 font-bold leading-relaxed">
            {t.pathsSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-3">
          
          {/* Path 1: Social Feed Cards with neon pink glowing borders */}
          <div className="group relative bg-white border border-rose-500/20 rounded-3xl p-6 sm:p-8 hover:border-rose-500 transition-all duration-300 shadow-lg shadow-rose-500/[0.03] hover:shadow-rose-500/[0.12] hover:-translate-y-1 flex flex-col justify-between gap-6 overflow-hidden">
            <div className="absolute -right-16 -top-16 w-36 h-36 rounded-full bg-rose-500/[0.03] group-hover:bg-rose-500/[0.06] transition-colors blur-xl" />
            
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
                <MessageSquare className="w-6 h-6 animate-pulse" />
              </div>

              <div>
                <span className="text-rose-500 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest block">
                  {lang === 'en' ? 'Live Ecosystem Exchange' : 'ساحة البث والتواصل'}
                </span>
                <h3 className="text-lg sm:text-2xl font-display font-semibold text-zinc-900 mt-1 leading-tight">
                  {t.feedLabel}
                </h3>
              </div>
              
              <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed font-normal">
                {t.feedDesc}
              </p>
            </div>

            <button
              onClick={() => setActiveTab('social')}
              className="w-full py-3.5 bg-zinc-950 hover:bg-zinc-850 group-hover:bg-rose-600 hover:scale-[1.01] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-zinc-950/10 hover:shadow-rose-600/20"
            >
              <span>{t.feedBtn}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Path 2: Business Directory with neon gold glowing borders */}
          <div className="group relative bg-white border border-amber-500/20 rounded-3xl p-6 sm:p-8 hover:border-amber-550 hover:border-amber-500 transition-all duration-300 shadow-lg shadow-amber-500/[0.03] hover:shadow-amber-500/[0.12] hover:-translate-y-1 flex flex-col justify-between gap-6 overflow-hidden">
            <div className="absolute -right-16 -top-16 w-36 h-36 rounded-full bg-amber-500/[0.03] group-hover:bg-amber-500/[0.06] transition-colors blur-xl" />

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
                <Building2 className="w-6 h-6" />
              </div>

              <div>
                <span className="text-amber-600 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest block">
                  {lang === 'en' ? 'Deep Exploration Directory' : 'دليل المنشآت الشامل'}
                </span>
                <h3 className="text-lg sm:text-2xl font-display font-semibold text-zinc-900 mt-1 leading-tight">
                  {t.dirLabel}
                </h3>
              </div>

              <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed font-normal">
                {t.dirDesc}
              </p>
            </div>

            <button
              onClick={() => setActiveTab('explore')}
              className="w-full py-3.5 bg-zinc-950 hover:bg-zinc-850 group-hover:bg-amber-500 hover:scale-[1.01] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-zinc-950/10 hover:shadow-amber-600/20"
            >
              <span>{t.dirBtn}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
