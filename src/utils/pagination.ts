/**
 * Pagination Utility Helpers
 */

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
  type: 'page' | 'offset';
}

/**
 * Calculates zero-based offset from page and limit.
 */
export function getPaginationOffset(page: number, limit: number): number {
  return Math.max(0, (page - 1) * limit);
}

/**
 * Calculates one-based page number from offset and limit.
 */
export function getPaginationPage(offset: number, limit: number): number {
  return Math.max(1, Math.floor(offset / limit) + 1);
}

/**
 * Calculates the total number of pages.
 */
export function calculateTotalPages(total: number, limit: number): number {
  return Math.ceil(total / limit) || 1;
}

/**
 * Generates an array of page numbers to display in pagination controls.
 * Supports sliding window/ellipsis if total pages are high.
 */
export function generatePageRange(currentPage: number, totalPages: number, maxVisible: number = 5): (number | 'ellipsis')[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [];
  const half = Math.floor((maxVisible - 2) / 2);
  let start = currentPage - half;
  let end = currentPage + half;

  if (start <= 2) {
    start = 2;
    end = maxVisible - 1;
  } else if (end >= totalPages - 1) {
    end = totalPages - 1;
    start = totalPages - maxVisible + 2;
  }

  pages.push(1);

  if (start > 2) {
    pages.push('ellipsis');
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages - 1) {
    pages.push('ellipsis');
  }

  pages.push(totalPages);

  return pages;
}

/**
 * Syncs pagination parameters to the browser URL without full-page reloads.
 */
export function syncPaginationToURL(params: {
  page?: number;
  limit?: number;
  offset?: number;
  type?: 'page' | 'offset';
}): void {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  
  if (params.page !== undefined) {
    url.searchParams.set('page', params.page.toString());
  }
  if (params.limit !== undefined) {
    url.searchParams.set('limit', params.limit.toString());
  }
  if (params.offset !== undefined) {
    url.searchParams.set('offset', params.offset.toString());
  }
  if (params.type !== undefined) {
    url.searchParams.set('pagType', params.type);
  }

  window.history.pushState({}, '', url.toString());
}

/**
 * Parses pagination parameters from the browser URL search query.
 */
export function parsePaginationFromURL(defaultLimit: number = 6): PaginationParams {
  if (typeof window === 'undefined') {
    return { page: 1, limit: defaultLimit, offset: 0, type: 'page' };
  }

  const searchParams = new URLSearchParams(window.location.search);
  const pageParam = searchParams.get('page');
  const limitParam = searchParams.get('limit');
  const offsetParam = searchParams.get('offset');
  const typeParam = searchParams.get('pagType') as 'page' | 'offset' | null;

  const limit = limitParam ? parseInt(limitParam, 10) : defaultLimit;
  let page = pageParam ? parseInt(pageParam, 10) : 1;
  let offset = offsetParam ? parseInt(offsetParam, 10) : 0;
  const type = typeParam || (offsetParam ? 'offset' : 'page');

  if (type === 'offset') {
    page = getPaginationPage(offset, limit);
  } else {
    offset = getPaginationOffset(page, limit);
  }

  return {
    page: Math.max(1, page),
    limit: Math.max(1, limit),
    offset: Math.max(0, offset),
    type
  };
}
