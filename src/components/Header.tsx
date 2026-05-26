/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, 
  Briefcase, 
  Globe, 
  LogIn, 
  LogOut, 
  Sparkles, 
  LayoutDashboard,
  Menu,
  X,
  Search,
  CheckCircle2,
  Home
} from 'lucide-react';
import { Language } from '../types';
import { NotificationsDropdown } from './NotificationsDropdown';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  onOpenAuth: () => void;
  activeTab: 'landing' | 'explore' | 'social' | 'dashboard' | 'auth';
  setActiveTab: (tab: 'landing' | 'explore' | 'social' | 'dashboard' | 'auth') => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  lang, 
  setLang, 
  onOpenAuth, 
  activeTab, 
  setActiveTab,
  searchQuery = '',
  onSearchChange
}) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isRTL = lang === 'ar' || lang === 'ku';

  const handleToggleLang = () => {
    if (lang === 'en') {
      setLang('ar');
    } else if (lang === 'ar') {
      setLang('ku');
    } else {
      setLang('en');
    }
  };

  const getRoleLabel = (role: string) => {
    if (lang === 'ar') {
      if (role === 'admin') return 'مدير عام';
      if (role === 'owner') return 'مالك أعمال';
      return 'مستكشف';
    }
    if (lang === 'ku') {
      if (role === 'admin') return 'بەڕێوەبەری گشتی';
      if (role === 'owner') return 'خاوەن کار';
      return 'گەڕۆک';
    }
    if (role === 'admin') return 'Platform Admin';
    if (role === 'owner') return 'Business Owner';
    return 'Explorer';
  };

  const menuItems = [
    {
      id: 'landing',
      label: lang === 'en' ? 'Home' : (lang === 'ar' ? 'الرئيسية' : 'سەرەکی'),
      icon: Home,
      visible: true
    },
    {
      id: 'explore',
      label: lang === 'en' ? 'Business Directory' : (lang === 'ar' ? 'دليل المنشآت' : 'ڕێبەری کارەکان'),
      icon: Compass,
      visible: true
    },
    {
      id: 'social',
      label: lang === 'en' ? 'Social Feed' : (lang === 'ar' ? 'المعرض الاجتماعي' : 'مەکۆی گشتی'),
      icon: Sparkles,
      visible: true
    },
    {
      id: 'dashboard',
      label: lang === 'en' ? 'Business Portal' : (lang === 'ar' ? 'بوابة الأعمال' : 'پۆرتاڵی کارەکان'),
      icon: LayoutDashboard,
      visible: user && (user.role === 'owner' || user.role === 'admin')
    }
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-morphism border-b border-zinc-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left Section: Logo & Brand */}
        <div className="flex items-center gap-6 shrink-0">
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('landing');
            }}
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity animate-fade-in"
          >
            <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center text-white shadow-md shadow-zinc-950/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-display font-bold text-base tracking-tight text-zinc-900 block leading-tight">
                {lang === 'en' ? 'EXPLORA' : (lang === 'ar' ? 'إِكْسِبْلُورَ' : 'ئێکسپلۆرا')}
              </span>
              <span className="text-[10px] font-medium text-zinc-400 block tracking-widest leading-none">
                {lang === 'en' ? 'BUSINESS DISCOVERY' : (lang === 'ar' ? 'منصة استكشاف الشركات' : 'دۆزینەوەی کارەکان')}
              </span>
            </div>
          </a>

          {/* Nav Links for Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {menuItems.filter(item => item.visible).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as 'landing' | 'explore' | 'social' | 'dashboard' | 'auth')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-2 cursor-pointer ${
                    isActive 
                      ? 'bg-zinc-900 text-white shadow-sm' 
                      : 'text-zinc-550 hover:text-zinc-900 hover:bg-zinc-100/70'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Global Search Bar (Center layout, displayed in explore state) */}
        {activeTab === 'explore' && onSearchChange && (
          <div className="hidden sm:block flex-1 max-w-md mx-6 transition-all duration-300">
            <div className="relative">
              <span className={`absolute inset-y-0 ${isRTL ? 'right-3.5' : 'left-3.5'} flex items-center text-zinc-400`}>
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={isRTL ? 'ابحث عن الكافيهات، الرعاية، الهندسة...' : 'Search cafe, healthcare, design studios...'}
                className={`w-full py-2 ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-xs bg-zinc-100/80 hover:bg-zinc-100/90 focus:bg-white border border-transparent focus:border-zinc-300 rounded-xl focus:outline-none transition-all`}
              />
              {searchQuery && (
                <button 
                  onClick={() => onSearchChange('')}
                  className={`absolute inset-y-0 ${isRTL ? 'left-3' : 'right-3'} flex items-center text-xs font-bold text-zinc-400 hover:text-zinc-700`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Right Section: Actions, Language Selection, Profiler */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Language Switcher */}
          <button
            onClick={handleToggleLang}
            className="px-2.5 py-2 border border-zinc-200 hover:border-zinc-800 rounded-xl text-xs font-bold flex items-center gap-1.5 text-zinc-650 hover:text-zinc-950 hover:bg-zinc-50 transition-all cursor-pointer shadow-sm"
          >
            <Globe className="w-4 h-4 text-zinc-400" />
            <span>
              {lang === 'en' ? '🇬🇧 English' : (lang === 'ar' ? '🇮🇶 العربية' : '☀️ کوردی')}
            </span>
          </button>

          {/* Interactive Simulated Activity NotificationsDropdown */}
          <NotificationsDropdown lang={lang} onNavigateToTab={setActiveTab} />

          {/* User Options */}
          {user ? (
            <div className="relative">
              <div className="flex items-center gap-2">
                
                {/* Profile Avatar Pill */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200/80 rounded-full transition-all text-left cursor-pointer shadow-sm"
                  style={{ direction: 'ltr' }}
                >
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-8 h-8 rounded-full border border-white bg-zinc-200 shadow-inner object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="hidden lg:block">
                    <span className="text-xs font-bold text-zinc-800 block leading-tight">{user.name}</span>
                    <span className="text-[9px] font-semibold text-zinc-500 uppercase tracking-wider block">
                      {getRoleLabel(user.role)}
                    </span>
                  </div>
                </button>
              </div>

              {/* Profile Dropdown Menu */}
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-56 bg-white rounded-xl shadow-xl border border-zinc-150 p-2 z-50 animate-fade-in`}>
                    <div className="px-3.5 py-2.5 border-b border-zinc-150">
                      <p className="text-xs font-bold text-zinc-8 block leading-tight">{user.name}</p>
                      <p className="text-[10px] text-zinc-400 font-medium block truncate mt-0.5">{user.email}</p>
                    </div>

                    <div className="p-1">
                      {menuItems.filter(item => item.visible).map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveTab(item.id as 'explore' | 'social' | 'dashboard' | 'auth');
                              setDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-all flex items-center gap-2.5"
                            style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                          >
                            <Icon className="w-4 h-4 text-zinc-500" />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}

                      <button
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                          setActiveTab('explore');
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50/75 transition-all flex items-center gap-2.5"
                        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{isRTL ? 'تسجيل الخروج' : 'Sign Out'}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-zinc-950/10"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{isRTL ? 'الدخول' : 'Sign In'}</span>
            </button>
          )}

          {/* Mobile Menu Icon */}
          <button 
            type="button"
            className="md:hidden p-2 rounded-xl border border-zinc-200 text-zinc-500 hover:text-zinc-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white p-4 space-y-3 z-30 animate-fade-in" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
          
          {/* Mobile Search input */}
          {activeTab === 'explore' && onSearchChange && (
            <div className="relative mb-3">
              <span className={`absolute inset-y-0 ${isRTL ? 'right-3' : 'left-3'} flex items-center text-zinc-400`}>
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={isRTL ? 'ابحث هنا...' : 'Search corporate profiles...'}
                className={`w-full py-2.5 ${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'} text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none`}
              />
            </div>
          )}

          {menuItems.filter(item => item.visible).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as 'landing' | 'explore' | 'social' | 'dashboard' | 'auth');
                  setMobileMenuOpen(false);
                }}
                className={`w-full p-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2.5 ${
                  isActive 
                    ? 'bg-zinc-900 text-white' 
                    : 'text-zinc-650 hover:bg-zinc-50'
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
