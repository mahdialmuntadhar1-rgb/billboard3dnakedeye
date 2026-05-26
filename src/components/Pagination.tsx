import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Settings2
} from 'lucide-react';
import { Language } from '../types';
import { generatePageRange, calculateTotalPages } from '../utils/pagination';

interface PaginationProps {
  total: number;
  currentPage: number;
  limit: number;
  offset: number;
  onPageChange: (page: number) => void;
  onOffsetChange: (offset: number) => void;
  onLimitChange?: (limit: number) => void;
  paginationType: 'page' | 'offset';
  onTypeChange?: (type: 'page' | 'offset') => void;
  lang: Language;
  loading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  total,
  currentPage,
  limit,
  offset,
  onPageChange,
  onOffsetChange,
  onLimitChange,
  paginationType,
  onTypeChange,
  lang,
  loading = false,
}) => {
  const isRTL = lang === 'ar' || lang === 'ku';
  const totalPages = calculateTotalPages(total, limit);

  // Translations Map
  const t = {
    en: {
      showing: 'Showing',
      to: 'to',
      of: 'of',
      results: 'results',
      previous: 'Previous',
      next: 'Next',
      page: 'Page',
      limit: 'Page Size',
      type: 'Mode',
      pageBased: 'Page-Based',
      offsetBased: 'Offset-Based',
      offsetLabel: 'Offset'
    },
    ar: {
      showing: 'عرض',
      to: 'إلى',
      of: 'من أصل',
      results: 'نتائج',
      previous: 'السابق',
      next: 'التالي',
      page: 'صفحة',
      limit: 'حجم الصفحة',
      type: 'النمط',
      pageBased: 'حسب الصفحة',
      offsetBased: 'حسب الإزاحة',
      offsetLabel: 'الإزاحة'
    },
    ku: {
      showing: 'پیشاندانی',
      to: 'بۆ',
      of: 'لە',
      results: 'ئەنجامەکان',
      previous: 'پێشوو',
      next: 'دواتر',
      page: 'لاپەڕە',
      limit: 'قەبارەی لاپەڕە',
      type: 'شێواز',
      pageBased: 'لاپەڕەیی',
      offsetBased: 'ئۆفسێتی',
      offsetLabel: 'ئۆفسێت'
    }
  }[lang] || {
    showing: 'Showing',
    to: 'to',
    of: 'of',
    results: 'results',
    previous: 'Previous',
    next: 'Next',
    page: 'Page',
    limit: 'Page Size',
    type: 'Mode',
    pageBased: 'Page-Based',
    offsetBased: 'Offset-Based',
    offsetLabel: 'Offset'
  };

  const startRange = total === 0 ? 0 : offset + 1;
  const endRange = Math.min(offset + limit, total);

  const handlePrev = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      onPageChange(prevPage);
      onOffsetChange((prevPage - 1) * limit);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      onPageChange(nextPage);
      onOffsetChange((nextPage - 1) * limit);
    }
  };

  const handlePageClick = (pageNum: number) => {
    onPageChange(pageNum);
    onOffsetChange((pageNum - 1) * limit);
  };

  const pageRange = generatePageRange(currentPage, totalPages, 5);

  return (
    <div id="shared-pagination-controls" className={`w-full bg-white border border-zinc-200 rounded-2xl p-4 md:p-5 shadow-sm space-y-4 ${loading ? 'opacity-70 pointer-events-none' : ''}`}>
      {/* Top section: indicator & controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
        {/* Results Indicator Text */}
        <div className={`text-xs md:text-sm text-zinc-500 font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
          {t.showing}{' '}
          <span className="font-bold text-zinc-900">{startRange}</span>{' '}
          {t.to}{' '}
          <span className="font-bold text-zinc-900">{endRange}</span>{' '}
          {t.of}{' '}
          <span className="font-bold text-zinc-900">{total}</span>{' '}
          {t.results}
          {paginationType === 'offset' && (
            <span className="text-[10px] text-zinc-400 block sm:inline sm:ml-2 font-mono">
              ({t.offsetLabel}: {offset}, limit: {limit})
            </span>
          )}
        </div>

        {/* Dynamic Controls Buttons */}
        <div className="flex items-center justify-center gap-1.5" style={{ direction: 'ltr' }}>
          
          {/* First Page button */}
          {totalPages > 3 && (
            <button
              id="first-page-btn"
              onClick={() => handlePageClick(1)}
              disabled={currentPage === 1}
              className="p-2 border border-zinc-200 rounded-xl bg-white hover:bg-zinc-50 text-zinc-650 hover:text-zinc-950 disabled:opacity-35 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
              title="First Page"
            >
              {isRTL ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
            </button>
          )}

          {/* Previous Button */}
          <button
            id="prev-page-btn"
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-zinc-200 rounded-xl bg-white hover:bg-zinc-50 text-zinc-650 hover:text-zinc-950 font-bold disabled:opacity-35 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm text-xs flex items-center gap-1"
          >
            {isRTL ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            <span>{t.previous}</span>
          </button>

          {/* Page Numbers Block (Sliding layout) */}
          <div className="hidden md:flex items-center gap-1">
            {pageRange.map((p, idx) => {
              if (p === 'ellipsis') {
                return (
                  <span key={`ell-${idx}`} className="px-2 text-zinc-400 font-bold select-none">
                    ...
                  </span>
                );
              }

              const isCurrent = p === currentPage;
              return (
                <button
                  key={`page-${p}`}
                  onClick={() => handlePageClick(p)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-zinc-950 text-white border border-zinc-950 shadow-md scale-105'
                      : 'border border-zinc-200 hover:border-zinc-800 text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          {/* Mobile simple page indicator */}
          <div className="md:hidden px-3 text-xs font-bold text-zinc-900 border border-zinc-150 py-2 rounded-xl bg-zinc-50">
            {currentPage} / {totalPages}
          </div>

          {/* Next Button */}
          <button
            id="next-page-btn"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-zinc-200 rounded-xl bg-white hover:bg-zinc-50 text-zinc-650 hover:text-zinc-950 font-bold disabled:opacity-35 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm text-xs flex items-center gap-1"
          >
            <span>{t.next}</span>
            {isRTL ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {/* Last Page button */}
          {totalPages > 3 && (
            <button
              id="last-page-btn"
              onClick={() => handlePageClick(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 border border-zinc-200 rounded-xl bg-white hover:bg-zinc-50 text-zinc-650 hover:text-zinc-950 disabled:opacity-35 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
              title="Last Page"
            >
              {isRTL ? <ChevronsLeft className="w-4 h-4" /> : <ChevronsRight className="w-4 h-4" />}
            </button>
          )}

        </div>
      </div>

      {/* Advanced Row: Page Limit Settings and Switchable Modes (Page-Based vs Offset-Based) */}
      <div className="border-t border-zinc-100 pt-3 flex flex-wrap items-center justify-between gap-3">
        {/* Switcher */}
        {onTypeChange && (
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
              <Settings2 className="w-3 h-3 text-zinc-400" />
              {t.type}:
            </span>
            <div className="inline-flex bg-zinc-100 p-0.5 rounded-xl border border-zinc-200/50">
              <button
                type="button"
                onClick={() => onTypeChange('page')}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                  paginationType === 'page'
                    ? 'bg-white text-zinc-900 shadow-sm opacity-100'
                    : 'text-zinc-550 hover:text-zinc-900'
                }`}
              >
                {t.pageBased}
              </button>
              <button
                type="button"
                onClick={() => onTypeChange('offset')}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                  paginationType === 'offset'
                    ? 'bg-white text-zinc-900 shadow-sm opacity-100'
                    : 'text-zinc-550 hover:text-zinc-900'
                }`}
              >
                {t.offsetBased}
              </button>
            </div>
          </div>
        )}

        {/* Limit changer selection */}
        {onLimitChange && (
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              {t.limit}:
            </span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(parseInt(e.target.value, 10))}
              className="bg-white border border-zinc-200 text-xs font-semibold px-2.5 py-1 rounded-xl focus:outline-none focus:border-zinc-800 transition-colors shadow-sm cursor-pointer"
            >
              {[3, 6, 9, 12, 18, 24].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
