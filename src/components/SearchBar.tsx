import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Language } from '../types';

interface SearchBarProps {
  initialValue: string;
  onSearch: (value: string) => void;
  lang: Language;
}

export const SearchBar: React.FC<SearchBarProps> = ({ initialValue, onSearch, lang }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const isRTL = lang === 'ar' || lang === 'ku';
  
  // Guard ref for initial render
  const isInitial = useRef(true);

  // Sync state if initial value changes externally (e.g., cleared by chip)
  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  // Debounce hook
  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      return;
    }

    setIsDebouncing(true);
    const handler = setTimeout(() => {
      onSearch(searchTerm);
      setIsDebouncing(false);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm, onSearch]);

  const t = {
    en: {
      placeholder: 'Search coworking, bistros, design hubs, locations...',
      clear: 'Clear search'
    },
    ar: {
      placeholder: 'ابحث عن مساحات العمل، المطاعم، المراكز، المواقع...',
      clear: 'مسح البحث'
    },
    ku: {
      placeholder: 'گەڕان بۆ شوێنی کار، چێشتخانە، بنکە، یاخود ناوچەکان...',
      clear: 'پاککردنەوەی گەڕان'
    }
  }[lang] || {
    placeholder: 'Search coworking, bistros, design hubs, locations...',
    clear: 'Clear search'
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div id="shared-search-container" className="relative w-full">
      <div className={`relative flex items-center w-full bg-white border border-zinc-200 focus-within:border-zinc-900 rounded-2xl shadow-sm transition-all duration-200 overflow-hidden px-4 py-1`}>
        {/* Search Icon or Custom Spinning Loader */}
        {isDebouncing ? (
          <Loader2 className={`w-4 h-4 text-zinc-400 animate-spin shrink-0 ${isRTL ? 'ml-2' : 'mr-2'}`} />
        ) : (
          <Search className={`w-4 h-4 text-zinc-400 shrink-0 ${isRTL ? 'ml-2' : 'mr-2'}`} />
        )}

        <input
          id="search-input-field"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t.placeholder}
          className={`w-full py-3 bg-transparent text-xs sm:text-sm font-medium text-zinc-800 focus:outline-none placeholder-zinc-400/85 leading-normal ${isRTL ? 'text-right' : 'text-left'}`}
          dir={isRTL ? 'rtl' : 'ltr'}
        />

        {searchTerm && (
          <button
            id="clear-search-btn"
            type="button"
            onClick={handleClear}
            className="p-1 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors shrink-0 cursor-pointer"
            title={t.clear}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
