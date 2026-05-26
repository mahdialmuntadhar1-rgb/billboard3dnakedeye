/**
 * Query Builder and Filter Sync Helpers
 */

import { FilterState } from '../types';

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  category: 'all',
  location: 'all',
  priceLevels: [],
  minRating: 0,
  isVerified: false,
  isOpenNow: false,
  sortBy: 'newest'
};

/**
 * Parses all filters from URL and returns a complete FilterState
 */
export function parseFiltersFromURL(): FilterState {
  if (typeof window === 'undefined') return { ...DEFAULT_FILTERS };

  const params = new URLSearchParams(window.location.search);
  const searchQuery = params.get('q') || '';
  const category = params.get('cat') || 'all';
  const location = params.get('loc') || 'all';
  const priceLevelsStr = params.get('prices') || '';
  const priceLevels = priceLevelsStr ? priceLevelsStr.split(',') : [];
  const minRating = parseFloat(params.get('rating') || '0') || 0;
  const isVerified = params.get('verified') === 'true';
  const isOpenNow = params.get('open') === 'true';
  const sortByParam = params.get('sort');
  const sortBy = (sortByParam === 'relevance' || sortByParam === 'highest_rated' || sortByParam === 'newest') 
    ? sortByParam 
    : 'newest';

  return {
    searchQuery,
    category,
    location,
    priceLevels,
    minRating,
    isVerified,
    isOpenNow,
    sortBy
  };
}

/**
 * Synchronizes FilterState values to the browser URL
 */
export function syncFiltersToURL(filters: FilterState): void {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  
  // Set query parameters, or delete if they are defaults to keep URL clean
  if (filters.searchQuery.trim()) {
    url.searchParams.set('q', filters.searchQuery.trim());
  } else {
    url.searchParams.delete('q');
  }

  if (filters.category && filters.category !== 'all') {
    url.searchParams.set('cat', filters.category);
  } else {
    url.searchParams.delete('cat');
  }

  if (filters.location && filters.location !== 'all') {
    url.searchParams.set('loc', filters.location);
  } else {
    url.searchParams.delete('loc');
  }

  if (filters.priceLevels.length > 0) {
    url.searchParams.set('prices', filters.priceLevels.join(','));
  } else {
    url.searchParams.delete('prices');
  }

  if (filters.minRating > 0) {
    url.searchParams.set('rating', filters.minRating.toString());
  } else {
    url.searchParams.delete('rating');
  }

  if (filters.isVerified) {
    url.searchParams.set('verified', 'true');
  } else {
    url.searchParams.delete('verified');
  }

  if (filters.isOpenNow) {
    url.searchParams.set('open', 'true');
  } else {
    url.searchParams.delete('open');
  }

  if (filters.sortBy && filters.sortBy !== 'newest') {
    url.searchParams.set('sort', filters.sortBy);
  } else {
    url.searchParams.delete('sort');
  }

  window.history.pushState({}, '', url.toString());
}

/**
 * Checks if any filters are active compared to the base default state
 * (excluding sort order)
 */
export function hasActiveFilters(filters: FilterState): boolean {
  return (
    filters.searchQuery.trim() !== '' ||
    filters.category !== 'all' ||
    filters.location !== 'all' ||
    filters.priceLevels.length > 0 ||
    filters.minRating > 0 ||
    filters.isVerified ||
    filters.isOpenNow
  );
}

/**
 * Gets a clean default FilterState
 */
export function getDefaultFilters(): FilterState {
  return { ...DEFAULT_FILTERS };
}
