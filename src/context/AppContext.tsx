/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Business, FilterState, Language } from '../types';
import { parseFiltersFromURL, syncFiltersToURL, getDefaultFilters } from '../utils/queryBuilder';
import { parsePaginationFromURL, syncPaginationToURL } from '../utils/pagination';
import { BusinessesService } from '../services/businesses';

// Toast Notification type
export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  text: string;
  textAr: string;
}

export type ActiveTab = 'landing' | 'explore' | 'social' | 'dashboard' | 'auth';

interface AppContextType {
  // Locale / Lang State
  lang: Language;
  setLang: (lang: Language) => void;
  isRTL: boolean;

  // View / Tab Navigation State
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  authRedirectMsg: { en: string; ar: string } | null;
  triggerAuthRedirect: (msgEn?: string, msgAr?: string) => void;

  // UI Modals & Drawers Flags
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: (open: boolean) => void;

  // Notification Toast manager
  toasts: ToastMessage[];
  addToast: (text: string, textAr: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;

  // Business Detail Selection State
  selectedBusiness: Business | null;
  setSelectedBusiness: (business: Business | null) => void;

  // Search, Filter State
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;

  // Pagination & Loader States
  businesses: Business[];
  total: number;
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  limit: number;
  setLimit: (limit: number | ((prev: number) => number)) => void;
  offset: number;
  setOffset: (offset: number | ((prev: number) => number)) => void;
  paginationType: 'page' | 'offset';
  setPaginationType: (type: 'page' | 'offset') => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;

  // Data Reload trigger function
  reloadData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Locale State
  const [lang, setLang] = useState<Language>('en');
  const isRTL = lang === 'ar' || lang === 'ku';

  // 2. Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [authRedirectMsg, setAuthRedirectMsg] = useState<{ en: string; ar: string } | null>(null);

  // 3. UI Status State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // 4. Toast notifications list
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // 5. Selected Business for Dialog modals
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  // 6. Complete search parameters
  const [filters, setFilters] = useState<FilterState>(() => parseFiltersFromURL());

  // 7. Paginated business records loaded lists
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(() => parsePaginationFromURL(6).page);
  const [limit, setLimit] = useState(() => parsePaginationFromURL(6).limit);
  const [offset, setOffset] = useState(() => parsePaginationFromURL(6).offset);
  const [paginationType, setPaginationType] = useState<'page' | 'offset'>(() => parsePaginationFromURL(6).type);
  const [loading, setLoading] = useState(true);

  // Sync index direction & HTML attributes on locale change
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRTL]);

  // Synchronize filter state changes to URL
  useEffect(() => {
    syncFiltersToURL(filters);
  }, [filters]);

  // Synchronize pagination values to URL
  useEffect(() => {
    syncPaginationToURL({ page: currentPage, limit, offset, type: paginationType });
  }, [currentPage, limit, offset, paginationType]);

  // Reset page pagination back to start when any filters modify
  useEffect(() => {
    setCurrentPage(1);
    setOffset(0);
  }, [
    filters.searchQuery,
    filters.category,
    filters.location,
    filters.priceLevels,
    filters.minRating,
    filters.isVerified,
    filters.isOpenNow
  ]);

  // Trigger feedback toasts
  const addToast = (text: string, textAr: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast_${Date.now()}`;
    setToasts((prev) => [...prev, { id, type, text, textAr }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Navigates toward Authentication Form displaying specified redirect trigger message
  const triggerAuthRedirect = (msgEn?: string, msgAr?: string) => {
    if (msgEn && msgAr) {
      setAuthRedirectMsg({ en: msgEn, ar: msgAr });
    } else {
      setAuthRedirectMsg(null);
    }
    setActiveTab('auth');
  };

  // Clears active query parameters back to default values
  const resetFilters = () => {
    setFilters((prev) => ({
      ...getDefaultFilters(),
      sortBy: prev.sortBy // preserve sorting
    }));
  };

  // Assembles registry fetch queries
  const loadBusinesses = async () => {
    setLoading(true);
    try {
      const result = await BusinessesService.fetchBusinesses(
        filters,
        paginationType === 'offset' ? { offset, limit } : { page: currentPage, limit }
      );
      setBusinesses(result.data);
      setTotal(result.total);
      setTotalPages(result.totalPages);

      // Guard against out of bounds pagination state issues from API
      if (result.page !== currentPage) {
        setCurrentPage(result.page);
      }
      if (result.offset !== offset) {
        setOffset(result.offset);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to load businesses.', 'فشل تحميل سجلات المنشآت.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Main reload executor triggered after review posts or business registrations
  const reloadData = async () => {
    await loadBusinesses();
  };

  // Effect to load businesses when queries/paging index updates
  useEffect(() => {
    const timeout = setTimeout(() => {
      loadBusinesses();
    }, 150); // slight input de-bounce

    return () => clearTimeout(timeout);
  }, [filters, currentPage, offset, limit, paginationType]);

  // Synchronise selected business values on updates to the listing grid
  useEffect(() => {
    if (selectedBusiness) {
      const reloadDetail = async () => {
        const fresh = await BusinessesService.fetchBusinessById(selectedBusiness.id);
        if (fresh) setSelectedBusiness(fresh);
      };
      reloadDetail();
    }
  }, [businesses]);

  return (
    <AppContext.Provider
      value={{
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
        totalPages,
        currentPage,
        setCurrentPage,
        limit,
        setLimit,
        offset,
        setOffset,
        paginationType,
        setPaginationType,
        loading,
        setLoading,
        reloadData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return context;
};
