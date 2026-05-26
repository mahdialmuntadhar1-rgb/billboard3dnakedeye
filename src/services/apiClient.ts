/**
 * Centralized API Client with environment-based configuration, 
 * authentication headers, retry policies, typed error contracts, 
 * and dynamic mock fallback adapters.
 */

import { Language } from '../types';

export type ApiErrorCode = 
  | 'UNAUTHORIZED' 
  | 'FORBIDDEN' 
  | 'NOT_FOUND' 
  | 'SERVER_ERROR' 
  | 'NETWORK_ERROR' 
  | 'VALIDATION_FAILED' 
  | 'RATE_LIMIT_EXCEEDED' 
  | 'UNKNOWN_ERROR';

export interface AppApiError {
  code: ApiErrorCode;
  message: string;
  messageAr?: string;
  messageKu?: string;
  originalError?: any;
}

export interface RequestOptions extends RequestInit {
  retries?: number;
  backoffMs?: number;
  skipAuth?: boolean;
}

const DEFAULT_RETRIES = 3;
const DEFAULT_BACKOFF = 300; // ms

// Helper to identify empty/default placeholder URLs
const isPlaceholderUrl = (url: string): boolean => {
  const lowercase = url.toLowerCase().trim();
  return (
    !lowercase ||
    lowercase.includes('your-account') ||
    lowercase.includes('your-domain') ||
    lowercase.includes('example.com') ||
    lowercase.includes('placeholder')
  );
};

// Base URL configuration for backend APIs
const rawApiUrl = (import.meta as any).env?.VITE_API_URL || '';
const BASE_URL = isPlaceholderUrl(rawApiUrl) ? '' : rawApiUrl;
const USE_MOCK_API = (import.meta as any).env?.VITE_USE_MOCK_API === 'true' || !BASE_URL;

class ApiClientClass {
  public isMockMode = USE_MOCK_API;

  constructor() {
    if (this.isMockMode) {
      console.log('🌐 API Client initialized in Mock Mode (using simulated local sandbox)');
    } else {
      console.log(`🌐 API Client initialized toward secure endpoint: ${BASE_URL}`);
    }
  }

  /**
   * Helper to retrieve active authorization token from local storage
   */
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('jwt_token');
  }

  /**
   * Format standard API response errors to a typed AppApiError contract
   */
  public formatError(error: any, fallbackCode: ApiErrorCode = 'UNKNOWN_ERROR'): AppApiError {
    if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
      return error as AppApiError;
    }

    const message = error instanceof Error ? error.message : String(error);
    
    // Auto-detect common network/http exceptions
    if (message.includes('Failed to fetch') || message.includes('network') || message.includes('timeout')) {
      return {
        code: 'NETWORK_ERROR',
        message: 'A network connectivity problem was detected. Please verify your connection.',
        messageAr: 'تم اكتشاف مشكلة في الاتصال بالشبكة. يرجى التحقق من اتصالك بالإنترنت.',
        messageKu: 'کێشەی بەستنەوەی تۆڕەکە دەستنیشانکرا. تکایە هێڵەکەت بپشکنە.',
        originalError: error
      };
    }

    return {
      code: fallbackCode,
      message,
      originalError: error
    };
  }

  /**
   * Safe fetch utility equipped with exponential backoff retry cycles
   */
  private async safeFetch(url: string, options: RequestInit, retries: number, backoffMs: number): Promise<Response> {
    try {
      const response = await fetch(url, options);
      
      // If server responds with rate limits or network hiccups, trigger retries for specific 5xx errors
      if (!response.ok && [429, 502, 503, 504].includes(response.status) && retries > 0) {
        console.warn(`⚠️ Request failed with status ${response.status}. Retrying in ${backoffMs}ms... (${retries} attempts left)`);
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
        return this.safeFetch(url, options, retries - 1, backoffMs * 2);
      }
      
      return response;
    } catch (err) {
      if (retries > 0) {
        console.warn(`🌍 Connection error: ${err instanceof Error ? err.message : String(err)}. Retrying in ${backoffMs}ms...`);
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
        return this.safeFetch(url, options, retries - 1, backoffMs * 2);
      }
      throw err;
    }
  }

  /**
   * Primary HTTP Request dispatcher
   */
  public async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const rawUrl = endpoint.startsWith('http') ? endpoint : `${BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
    const retries = options.retries ?? DEFAULT_RETRIES;
    const backoffMs = options.backoffMs ?? DEFAULT_BACKOFF;

    // Headers assembly
    const headers = new Headers(options.headers || {});
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    // Integrate Auth bearer headers
    if (!options.skipAuth) {
      const token = this.getToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    const fetchConfig: RequestInit = {
      ...options,
      headers
    };

    try {
      const res = await this.safeFetch(rawUrl, fetchConfig, retries, backoffMs);

      if (res.status === 401) {
        throw {
          code: 'UNAUTHORIZED',
          message: 'Your active session has expired. Please log in again.',
          messageAr: 'انتهت صلاحية جلستك النشطة. يرجى تسجيل الدخول مرة أخرى.',
          messageKu: 'ماوەی چوونەژوورەوەی چالاکەکەت بەسەرچوو. تکایە دووبارە بچۆ ژوورەوە.'
        } as AppApiError;
      }

      if (res.status === 403) {
        throw {
          code: 'FORBIDDEN',
          message: 'Access denied. You do not possess the required credentials or permissions.',
          messageAr: 'تم رفض الوصول. لا تملك الصلاحيات الكافية لهذه العملية.',
          messageKu: 'گەیشتن ڕەتکرایەوە. دەسەڵاتی پێویستت نییە بۆ ئەم کارە.'
        } as AppApiError;
      }

      if (res.status === 404) {
        throw {
          code: 'NOT_FOUND',
          message: 'The requested resource was not located on the server.',
          messageAr: 'لم يتم العثور على المورد المطلوب على الخادم.',
          messageKu: 'سەرچاوەی داواکراو نەدۆزرایەوە.'
        } as AppApiError;
      }

      if (!res.ok) {
        let errorBody: any = {};
        try {
          errorBody = await res.json();
        } catch {
          // Response is not structured JSON
        }
        
        throw {
          code: errorBody.code || 'SERVER_ERROR',
          message: errorBody.message || `API error occurred with response status: ${res.status}`,
          messageAr: errorBody.messageAr,
          messageKu: errorBody.messageKu,
          originalError: errorBody
        } as AppApiError;
      }

      // If status is 204 No Content, return empty object/response safely
      if (res.status === 204) {
        return {} as T;
      }

      return await res.json() as T;
    } catch (err) {
      const formatted = this.formatError(err);
      if (formatted.code === 'NETWORK_ERROR') {
        console.warn('⚠️ Network or connection failure detected. Dynamically fallback to secure high-fidelity Mock sandbox.');
        this.isMockMode = true;
      }
      throw formatted;
    }
  }

  // HTTP Method Shorcuts
  public async get<T = any>(endpoint: string, options: Omit<RequestOptions, 'method'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public async post<T = any>(endpoint: string, body?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body)
    });
  }

  public async put<T = any>(endpoint: string, body?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body)
    });
  }

  public async delete<T = any>(endpoint: string, options: Omit<RequestOptions, 'method'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const ApiClient = new ApiClientClass();
