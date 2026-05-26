/**
 * Businesses Directory Service layer separating presentation views from backend communications.
 * Integrates dynamic queries, filters, listings creator, interactive reviews, leads and analytical models.
 * Automatically switches to fully isolated simulated sandbox during development/testing.
 */

import { ApiClient } from './apiClient';
import { BusinessPortalAPI as MockBusinessesService } from '../api';
import { 
  Business, 
  Review, 
  Inquiry, 
  FilterState, 
  BusinessAnalytics 
} from '../types';

export const BusinessesService = {
  /**
   * Reads businesses by combining filters and page/offset parameters with backend search engines.
   */
  async fetchBusinesses(
    filters: FilterState,
    pageOrParams: number | { page?: number; limit?: number; offset?: number } = 1,
    limitParam: number = 6
  ): Promise<{ 
    data: Business[]; 
    total: number; 
    totalPages: number; 
    page: number; 
    limit: number; 
    offset: number; 
  }> {
    if (ApiClient.isMockMode) {
      return MockBusinessesService.fetchBusinesses(filters, pageOrParams, limitParam);
    }

    try {
      // Build search query parameters for standard backend query string format
      const params = new URLSearchParams();
      
      if (filters.searchQuery) params.set('q', filters.searchQuery);
      if (filters.category && filters.category !== 'all') params.set('category', filters.category);
      if (filters.location && filters.location !== 'all') params.set('location', filters.location);
      if (filters.priceLevels && filters.priceLevels.length > 0) {
        params.set('priceLevels', filters.priceLevels.join(','));
      }
      if (filters.minRating > 0) params.set('minRating', filters.minRating.toString());
      if (filters.isVerified) params.set('isVerified', 'true');
      if (filters.isOpenNow) params.set('isOpenNow', 'true');
      if (filters.sortBy) params.set('sortBy', filters.sortBy);

      // Map paging parameters
      if (typeof pageOrParams === 'object' && pageOrParams !== null) {
        if (pageOrParams.limit !== undefined) params.set('limit', pageOrParams.limit.toString());
        if (pageOrParams.offset !== undefined) params.set('offset', pageOrParams.offset.toString());
        if (pageOrParams.page !== undefined) params.set('page', pageOrParams.page.toString());
      } else if (typeof pageOrParams === 'number') {
        params.set('page', pageOrParams.toString());
        params.set('limit', limitParam.toString());
      }

      return await ApiClient.get(`/api/businesses?${params.toString()}`);
    } catch (err) {
      throw ApiClient.formatError(err);
    }
  },

  /**
   * Fetches full profile details for an individual business listing.
   */
  async fetchBusinessById(id: string): Promise<Business | null> {
    if (ApiClient.isMockMode) {
      return MockBusinessesService.fetchBusinessById(id);
    }

    try {
      return await ApiClient.get<Business | null>(`/api/businesses/${id}`);
    } catch (err) {
      if (err && typeof err === 'object' && 'code' in err && (err as any).code === 'NOT_FOUND') {
        return null;
      }
      throw ApiClient.formatError(err);
    }
  },

  /**
   * Persists a new rating feedback review under a business profile.
   */
  async submitReview(businessId: string, authorName: string, rating: number, comment: string): Promise<Review> {
    if (ApiClient.isMockMode) {
      return MockBusinessesService.submitReview(businessId, authorName, rating, comment);
    }

    try {
      return await ApiClient.post<Review>(`/api/businesses/${businessId}/reviews`, {
        authorName,
        rating,
        comment
      });
    } catch (err) {
      throw ApiClient.formatError(err);
    }
  },

  /**
   * Acquires all verified rating reviews for a business profile.
   */
  async fetchReviews(businessId: string): Promise<Review[]> {
    if (ApiClient.isMockMode) {
      return MockBusinessesService.fetchReviews(businessId);
    }

    try {
      return await ApiClient.get<Review[]>(`/api/businesses/${businessId}/reviews`);
    } catch (err) {
      throw ApiClient.formatError(err);
    }
  },

  /**
   * Sends sales/leasing contact messages directly securely to owners.
   */
  async submitInquiry(businessId: string, senderName: string, senderEmail: string, message: string): Promise<Inquiry> {
    if (ApiClient.isMockMode) {
      return MockBusinessesService.submitInquiry(businessId, senderName, senderEmail, message);
    }

    try {
      return await ApiClient.post<Inquiry>(`/api/businesses/${businessId}/inquiries`, {
        senderName,
        senderEmail,
        message
      });
    } catch (err) {
      throw ApiClient.formatError(err);
    }
  },

  /**
   * Fetches client inquiries linked to a business listing.
   */
  async fetchInquiries(businessId: string): Promise<Inquiry[]> {
    if (ApiClient.isMockMode) {
      return MockBusinessesService.fetchInquiries(businessId);
    }

    try {
      return await ApiClient.get<Inquiry[]>(`/api/businesses/${businessId}/inquiries`);
    } catch (err) {
      throw ApiClient.formatError(err);
    }
  },

  /**
   * Retrieves visual analytic trends and click distribution records.
   */
  async fetchAnalytics(businessId: string): Promise<BusinessAnalytics> {
    if (ApiClient.isMockMode) {
      return MockBusinessesService.fetchAnalytics(businessId);
    }

    try {
      return await ApiClient.get<BusinessAnalytics>(`/api/businesses/${businessId}/analytics`);
    } catch (err) {
      throw ApiClient.formatError(err);
    }
  },

  /**
   * Creates a formal business profile in the registry directory.
   */
  async createBusiness(businessData: Omit<Business, 'id' | 'rating' | 'reviewsCount' | 'isVerified'>): Promise<Business> {
    if (ApiClient.isMockMode) {
      return MockBusinessesService.createBusiness(businessData);
    }

    try {
      return await ApiClient.post<Business>('/api/businesses', businessData);
    } catch (err) {
      throw ApiClient.formatError(err);
    }
  },

  /**
   * Overwrites directory data for a listing owned by the authenticated publisher.
   */
  async updateBusiness(id: string, businessData: Partial<Business>): Promise<Business> {
    if (ApiClient.isMockMode) {
      return MockBusinessesService.updateBusiness(id, businessData);
    }

    try {
      return await ApiClient.put<Business>(`/api/businesses/${id}`, businessData);
    } catch (err) {
      throw ApiClient.formatError(err);
    }
  }
};
