/**
 * Authentication Service layer separating application code from raw AJAX requests.
 * Automatically delegates to virtual offline adapters in local mock mode.
 */

import { ApiClient } from './apiClient';
import { 
  AuthService as MockAuthService, 
  LoginCredentials, 
  RegisterCredentials, 
  AuthResponse, 
  ForgotPasswordResponse, 
  ResetPasswordResponse 
} from './authService';

export const AuthService = {
  /**
   * Logs in a user with email and optional password.
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (ApiClient.isMockMode) {
      const response = await MockAuthService.login(credentials);
      // Cache token locally to maintain logged-in state across reloads in simulated sandbox
      localStorage.setItem('jwt_token', response.token);
      return response;
    }

    try {
      const response = await ApiClient.post<AuthResponse>('/api/auth/login', credentials, { skipAuth: true });
      localStorage.setItem('jwt_token', response.token);
      return response;
    } catch (err) {
      throw ApiClient.formatError(err);
    }
  },

  /**
   * Registers a new user with standard credentials.
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    if (ApiClient.isMockMode) {
      const response = await MockAuthService.register(credentials);
      localStorage.setItem('jwt_token', response.token);
      return response;
    }

    try {
      const response = await ApiClient.post<AuthResponse>('/api/auth/register', credentials, { skipAuth: true });
      localStorage.setItem('jwt_token', response.token);
      return response;
    } catch (err) {
      throw ApiClient.formatError(err);
    }
  },

  /**
   * Triggers a password reset email request.
   */
  async requestResetPassword(email: string): Promise<ForgotPasswordResponse> {
    if (ApiClient.isMockMode) {
      return MockAuthService.requestResetPassword(email);
    }

    try {
      return await ApiClient.post<ForgotPasswordResponse>('/api/auth/forgot-password', { email }, { skipAuth: true });
    } catch (err) {
      throw ApiClient.formatError(err);
    }
  },

  /**
   * Sumits confirmation code and new password to reset account.
   */
  async submitResetPassword(email: string, code: string, newPassword?: string): Promise<ResetPasswordResponse> {
    if (ApiClient.isMockMode) {
      return MockAuthService.submitResetPassword(email, code, newPassword);
    }

    try {
      return await ApiClient.post<ResetPasswordResponse>('/api/auth/reset-password', { email, code, newPassword }, { skipAuth: true });
    } catch (err) {
      throw ApiClient.formatError(err);
    }
  },

  /**
   * Standard helper to purge tokens on user logout
   */
  logout(): void {
    localStorage.removeItem('jwt_token');
  }
};
export type { LoginCredentials, RegisterCredentials, AuthResponse, ForgotPasswordResponse, ResetPasswordResponse };
