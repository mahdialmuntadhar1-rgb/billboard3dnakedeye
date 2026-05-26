/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { FiltersSidebar } from './components/FiltersSidebar';
import { SearchBar } from './components/SearchBar';
import { SortDropdown } from './components/SortDropdown';
import { ActiveFilters } from './components/ActiveFilters';
import { BusinessCard } from './components/BusinessCard';
import { DetailView } from './components/DetailView';
import { DashboardView } from './components/DashboardView';
import { NotificationToast } from './components/NotificationToast';
import { AuthModal } from './components/AuthModal';
import { AuthView } from './components/AuthView';
import { Pagination } from './components/Pagination';
import { SquareHero } from './components/SquareHero';
import { SocialFeedView } from './components/SocialFeedView';
import { CategoryGrid } from './components/CategoryGrid';
import { LandingView } from './components/LandingView';
import { 
  Sparkles, 
  SlidersHorizontal,
  Building2,
  X,
  AlertCircle
} from 'lucide-react';

function MainApp() {
  const { user } = useAuth();
  
  const {
    lang,
    setLang,
    isRTL,
    activeTab,
    setActiveTab,
    authRedirectMsg,
    triggerAuthRedirect,
    authModalOpen,
    setAuthModalOpen,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    toasts,
    addToast,
    removeToast,
    selectedBusiness,
    setSelectedBusiness,
    filters,
    setFilters,
    resetFilters,
    businesses,
    total,
    currentPage,
    setCurrentPage,
    limit,
    setLimit,
    offset,
    setOffset,
    paginationType,
    setPaginationType,
    loading
  } = useApp();

  const handleOpenAuth = (msgEn?: string, msgAr?: string) => {
    triggerAuthRedirect(msgEn, msgAr);
  };

  const handlePresetCategory = (categoryId: string) => {
    setFilters((prev) => ({ ...prev, category: categoryId }));
    const gridEl = document.getElementById('listings-grid-view');
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={`min-h-screen bg-stone-50/55 flex flex-col font-sans selection:bg-zinc-900 selection:text-white pb-16`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      
      {/* Platform Header */}
      <Header 
        lang={lang} 
        setLang={setLang} 
        onOpenAuth={() => handleOpenAuth()}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'dashboard' && !user) {
            handleOpenAuth(
              'To access analytics metrics and your corporate dashboard, please log in or establish a creator credential first.',
              'للوصول إلى مؤشرات التحليلات ولوحة تحكم شركتك، يرجى تسجيل الدخول أو إعداد بيانات الاعتماد أولاً.'
            );
          } else {
            setActiveTab(tab);
          }
        }}
      />

      {/* Main Layout Views */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {activeTab === 'explore' && (
          <div className="space-y-12">
            
            {/* Elegant Square Hero Section featuring interactive Carousel */}
            <SquareHero lang={lang} />

            {/* Beautiful dynamic Category Grid UI (Icons + labels, loaded dynamically) */}
            <CategoryGrid
              activeCategory={filters.category}
              onSelectCategory={(catId) => setFilters(prev => ({ ...prev, category: catId }))}
              lang={lang}
            />

            {/* Split Explorer Layout Workspace */}
            <div id="listings-grid-view" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Desktop Filters Col (Span 3) */}
              <aside className="hidden lg:block lg:col-span-3">
                <FiltersSidebar 
                  filters={filters} 
                  setFilters={setFilters} 
                  lang={lang} 
                />
              </aside>

              {/* Mobile filter sliding action header trigger */}
              <div className="lg:hidden flex items-center justify-between bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="px-4 py-2 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 hover:border-zinc-850 flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>{isRTL ? 'خيارات التصفية المتكاملة' : 'Refine Explorer Filters'}</span>
                </button>
                <div className="text-xs font-bold text-zinc-500">
                  {total} {isRTL ? 'منشأة متوفرة' : 'Businesses Found'}
                </div>
              </div>

              {/* Results Grid Col (Span 9) */}
              <div className="lg:col-span-9 space-y-6">

                {/* Results Header with Sorting and Active Filters */}
                <div id="results-sorting-header" className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-xs sm:text-sm font-bold text-zinc-900 uppercase tracking-widest leading-none">
                        {lang === 'en' ? 'Discovered Venues' : (lang === 'ar' ? 'المنشآت المكتشفة' : 'شوێنە دۆزراوەکان')}
                      </h2>
                      <p className="text-[11px] sm:text-xs text-zinc-400 font-bold mt-1.5 leading-none">
                        {lang === 'en' 
                          ? `Displaying ${businesses.length} of ${total} elite units` 
                          : lang === 'ar'
                            ? `عرض ${businesses.length} من إجمالي ${total} منشأة فاخرة`
                            : `نیشاندانی ${businesses.length} لە کۆی ${total} شوێنی نایاب`
                        }
                      </p>
                    </div>
                    <SortDropdown 
                      currentSort={filters.sortBy} 
                      onChangeSort={(sort) => setFilters(prev => ({ ...prev, sortBy: sort }))} 
                      lang={lang} 
                    />
                  </div>
                  
                  <ActiveFilters filters={filters} setFilters={setFilters} lang={lang} />
                </div>
                
                {/* Loader Overlay indicator */}
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-4 animate-pulse">
                        <div className="aspect-video w-full bg-zinc-150 rounded-xl" />
                        <div className="h-4 bg-zinc-100 rounded w-1/3" />
                        <div className="h-6 bg-zinc-100 rounded w-3/4" />
                        <div className="h-4 bg-zinc-100 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {businesses.length === 0 ? (
                      <div className="bg-white border border-zinc-200 rounded-3xl p-16 text-center space-y-4 shadow-sm max-w-xl mx-auto">
                        <Building2 className="w-12 h-12 text-zinc-300 mx-auto" />
                        <h3 className="font-display font-semibold text-zinc-900 text-lg">
                          {isRTL ? 'لم نعثر على نتائج مطابقة' : 'No Cohesive Coordinates Match'}
                        </h3>
                        <p className="text-xs text-zinc-455 max-w-xs mx-auto">
                          {isRTL 
                            ? 'نوصي بتبسيط معايير التصفية، أو البحث بكلمات عامة مثل (العمل المشترك) أو (حي السيليكون).' 
                            : 'Try expanding standard parameters or reset custom categories to find matching listings.'
                          }
                        </p>
                        <button
                          onClick={resetFilters}
                          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                        >
                          {isRTL ? 'عرض كل المنشآت' : 'Show All Listed Units'}
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {businesses.map((biz) => (
                          <BusinessCard 
                            key={biz.id} 
                            business={biz} 
                            lang={lang} 
                            onSelect={setSelectedBusiness} 
                            onOpenAuth={() => handleOpenAuth(
                              'To bookmark boutique locations or view comprehensive directories, please log in or register.',
                              'لحفظ المنشآت والوصول الكامل إلى الدليل، يرجى تسجيل الدخول أو إنشاء حساب جديد.'
                            )}
                          />
                        ))}
                      </div>
                    )}

                    {/* Highly Polished Paginations */}
                    {total > 0 && (
                      <Pagination
                        total={total}
                        currentPage={currentPage}
                        limit={limit}
                        offset={offset}
                        onPageChange={setCurrentPage}
                        onOffsetChange={setOffset}
                        onLimitChange={setLimit}
                        paginationType={paginationType}
                        onTypeChange={setPaginationType}
                        lang={lang}
                        loading={loading}
                      />
                    )}
                  </>
                )}
              </div>

            </div>

          </div>
        )}

        {activeTab === 'landing' && (
          <div className="py-2">
            <LandingView lang={lang} />
          </div>
        )}

        {activeTab === 'social' && (
          <div className="py-6">
            <SocialFeedView lang={lang} onSuccess={addToast} />
          </div>
        )}

        {activeTab === 'dashboard' && (
          /* Portal dashboard view */
          <div className="py-6">
            {user ? (
              user.role === 'owner' || user.role === 'admin' ? (
                <DashboardView 
                  lang={lang} 
                  onSuccess={addToast} 
                  onSelectBusiness={(biz) => {
                    setSelectedBusiness(biz);
                    setActiveTab('explore');
                  }}
                />
              ) : (
                <div className="bg-white border border-zinc-250 rounded-3xl p-16 text-center space-y-5 shadow-sm max-w-lg mx-auto">
                  <AlertCircle className="w-12 h-12 text-zinc-300 mx-auto" />
                  <h3 className="font-display font-semibold text-zinc-900 text-lg">
                    {isRTL ? 'يتطلب هذا الدور امتيازات شريك مالك الأعمال' : 'Partner Credentials Required'}
                  </h3>
                  <p className="text-xs text-zinc-455 font-normal leading-relaxed">
                    {isRTL 
                      ? 'مستكشفك الحالي لا يستطيع تشغيل لوحات تحليلات إدارة الأعمال. الرجاء تبديل الحساب التجريبي لـ "كريم زايد (مالك شركة)" لرؤية لوحة القياس الفاخرة.' 
                      : 'Your current explorer session is not flagged as a business manager. Please swap sandbox session profiles to "Karim Zayed (Owner)" or "Sarah Jenkins (Admin)" to view this portal instantly.'
                    }
                  </p>
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="px-4 py-2 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    {isRTL ? 'إدخال سريع للملف الحرفي' : 'Deploy Fast-Track Demo Selector'}
                  </button>
                </div>
              )
            ) : (
              <div className="bg-white border border-zinc-250 rounded-3xl p-16 text-center space-y-4 shadow-sm max-w-lg mx-auto">
                <Building2 className="w-12 h-12 text-zinc-300 mx-auto" />
                <h3 className="font-display font-semibold text-zinc-900 text-lg">
                  {isRTL ? 'سجل دخول لعرض بوابة الأعمال' : 'Access Restricted to Partners'}
                </h3>
                <p className="text-xs text-zinc-455">
                  {isRTL 
                    ? 'الرجاء تسجيل الدخول أو استخدام تجاوز الاعتمادات الفوري لتجربة لوحة تحكم المنشآت والتحليلات.' 
                    : 'Please sign in or deploy our fast-track credentials demo selector to view analytics dashboards.'
                  }
                </p>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-4 py-2 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  {isRTL ? 'تبويب تسجيل الدخول' : 'Initialize Session Sign-In'}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'auth' && (
          <div className="py-6">
            <AuthView 
              lang={lang}
              redirectMessage={authRedirectMsg}
              onSuccess={(en, ar) => {
                addToast(en, ar, 'success');
                // Give a tiny buffer for session write to synchronize
                setTimeout(() => {
                  const saved = localStorage.getItem('bep_session');
                  if (saved) {
                    try {
                      const u = JSON.parse(saved);
                      if (u.role === 'owner' || u.role === 'admin') {
                        setActiveTab('dashboard');
                        return;
                      }
                    } catch (e) {
                      console.error(e);
                    }
                  }
                  setActiveTab('explore');
                }, 100);
              }}
              onNavigateHome={() => setActiveTab('explore')}
            />
          </div>
        )}

      </main>

      {/* Slide out slide-in drawer detail view */}
      {selectedBusiness && (
        <DetailView 
          business={selectedBusiness} 
          onClose={() => setSelectedBusiness(null)} 
          lang={lang} 
          onSuccess={addToast}
          onOpenAuth={() => setAuthModalOpen(true)}
        />
      )}

      {/* Floating Notifications toast panel */}
      <NotificationToast 
        toasts={toasts} 
        removeToast={removeToast} 
        lang={lang} 
      />

      {/* Authentications sandbox modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        lang={lang} 
        onSuccess={addToast} 
      />

      {/* Mobile Drawer Slide for Filters */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* backdrop */}
          <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-xs" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative w-80 bg-white h-full shadow-xl flex flex-col p-6 overflow-y-auto space-y-6">
            <div className="flex justify-between items-center border-b border-zinc-150 pb-3 shrink-0">
              <span className="text-sm font-bold text-zinc-900">{isRTL ? 'تصفية وتحديد القوائم' : 'Filter Criteria Options'}</span>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-1 rounded bg-zinc-100 hover:bg-zinc-200">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1">
              <FiltersSidebar filters={filters} setFilters={setFilters} lang={lang} />
            </div>
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full py-3 bg-zinc-950 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              {isRTL ? 'تطبيق التصفية' : 'Apply Filters'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainApp />
      </AppProvider>
    </AuthProvider>
  );
}
