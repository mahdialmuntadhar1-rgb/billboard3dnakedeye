import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpDown, Check, ChevronDown } from 'lucide-react';
import { Language } from '../types';

interface SortDropdownProps {
  currentSort: 'newest' | 'relevance' | 'highest_rated';
  onChangeSort: (sort: 'newest' | 'relevance' | 'highest_rated') => void;
  lang: Language;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ currentSort, onChangeSort, lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isRTL = lang === 'ar' || lang === 'ku';

  const t = {
    en: {
      label: 'Sort By',
      newest: 'Newest Listings',
      relevance: 'Most Relevant',
      highest_rated: 'Highest Rated'
    },
    ar: {
      label: 'ترتيب حسب',
      newest: 'أحدث المنشآت أولاً',
      relevance: 'الأكثر ملاءمة والصلة',
      highest_rated: 'الأعلى تقييماً بالنجوم'
    },
    ku: {
      label: 'ڕیزکردن بەپێی',
      newest: 'نوێترین شوێنەکان',
      relevance: 'پەیوەندیدارترین',
      highest_rated: 'بەرزترین نرخاندن'
    }
  }[lang] || {
    label: 'Sort By',
    newest: 'Newest Listings',
    relevance: 'Most Relevant',
    highest_rated: 'Highest Rated'
  };

  const options: { id: 'newest' | 'relevance' | 'highest_rated'; label: string }[] = [
    { id: 'newest', label: t.newest },
    { id: 'relevance', label: t.relevance },
    { id: 'highest_rated', label: t.highest_rated },
  ];

  const activeOption = options.find((o) => o.id === currentSort) || options[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div id="sort-dropdown-wrapper" ref={containerRef} className="relative inline-block text-left w-full sm:w-auto">
      <div>
        <button
          id="sort-menu-button"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full sm:w-60 flex items-center justify-between gap-2.5 px-4 py-3 bg-white border border-zinc-200 hover:border-zinc-800 rounded-xl text-xs font-bold text-zinc-800 hover:text-zinc-950 transition-all shadow-sm cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="text-zinc-400 font-medium">{t.label}:</span>
            <span className="truncate">{activeOption.label}</span>
          </span>
          <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div
          id="sort-menu-dropdown-list"
          className={`absolute z-30 mt-1.5 w-full sm:w-60 bg-white border border-zinc-250/70 rounded-2xl shadow-xl overflow-hidden animate-in fade-in duration-100 ${
            isRTL ? 'left-0 sm:right-auto sm:left-0 text-right' : 'right-0 sm:left-auto sm:right-0 text-left'
          }`}
        >
          <div className="py-1">
            {options.map((opt) => {
              const isSelected = opt.id === currentSort;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    onChangeSort(opt.id);
                    setIsOpen(false);
                  }}
                  className={`w-full hover:bg-zinc-50 px-4 py-3 text-xs font-semibold flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    isSelected ? 'bg-zinc-50/70 text-zinc-950 font-bold' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                  style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-zinc-950" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
