/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, UserRole } from '../types';

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterCredentials {
  email: string;
  password?: string;
  name: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  messageAr: string;
  resetToken?: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  messageAr: string;
}

const PRE_CONFIGURED_USERS_RECORDS: Record<string, { name: string; role: UserRole; avatar: string; ownedBusinesses: string[] }> = {
  'karim@foundry.com': {
    name: 'Karim Zayed',
    role: 'owner',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    ownedBusinesses: ['b1']
  },
  'layla@explorer.com': {
    name: 'Layla Al-Mansoori',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    ownedBusinesses: []
  },
  'admin@platform.com': {
    name: 'Sarah Jenkins',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    ownedBusinesses: []
  }
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const AuthService = {
  /**
   * Log in user using credentials.
   * Emulates a token-aware JWT secure header structure.
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(600);
    const emailLower = credentials.email.trim().toLowerCase();

    // Check basic email validation pattern
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLower)) {
      throw new Error('INVALID_EMAIL_FORMAT');
    }

    if (credentials.password && credentials.password.length < 6) {
      throw new Error('PASSWORD_TOO_SHORT');
    }

    const matched = PRE_CONFIGURED_USERS_RECORDS[emailLower];
    const dummyToken = `jwt_bep_token_${btoa(emailLower)}_${Date.now()}`;

    if (matched) {
      const user: User = {
        id: emailLower === 'karim@foundry.com' ? 'u_karim' : emailLower === 'layla@explorer.com' ? 'u_layla' : 'u_admin',
        name: matched.name,
        email: emailLower,
        role: matched.role,
        avatar: matched.avatar,
        savedBusinesses: emailLower === 'layla@explorer.com' ? ['b2'] : [],
        ownedBusinesses: matched.ownedBusinesses
      };
      
      return { user, token: dummyToken };
    }

    // Dynamic fallback for custom interactive users
    const user: User = {
      id: `u_${Date.now()}`,
      name: emailLower.split('@')[0],
      email: emailLower,
      role: 'user',
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(emailLower)}`,
      savedBusinesses: []
    };

    return { user, token: dummyToken };
  },

  /**
   * Register a new user with standard credentials.
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    await delay(800);
    const emailLower = credentials.email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLower)) {
      throw new Error('INVALID_EMAIL_FORMAT');
    }

    if (!credentials.name || credentials.name.trim().length < 3) {
      throw new Error('NAME_TOO_SHORT');
    }

    const dummyToken = `jwt_bep_token_${btoa(emailLower)}_${Date.now()}`;
    const user: User = {
      id: `u_${Date.now()}`,
      name: credentials.name,
      email: emailLower,
      role: credentials.role,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(emailLower)}`,
      savedBusinesses: [],
      ownedBusinesses: credentials.role === 'owner' ? [`b_${Date.now()}`] : []
    };

    return { user, token: dummyToken };
  },

  /**
   * Request reset password token.
   */
  async requestResetPassword(email: string): Promise<ForgotPasswordResponse> {
    await delay(500);
    const emailLower = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLower)) {
      throw new Error('INVALID_EMAIL_FORMAT');
    }

    // Create custom simulated reset token
    const verificationToken = `rst_${Math.floor(100000 + Math.random() * 900000)}`;
    localStorage.setItem(`rst_token_${emailLower}`, verificationToken);

    return {
      success: true,
      message: `A password reset code has been successfully dispatched to ${emailLower}.`,
      messageAr: `تم إرسال رمز إعادة تعيين كلمة المرور بنجاح إلى ${emailLower}.`,
      resetToken: verificationToken
    };
  },

  /**
   * Verify token and commit reset.
   */
  async submitResetPassword(email: string, code: string, newPassword?: string): Promise<ResetPasswordResponse> {
    await delay(600);
    const emailLower = email.trim().toLowerCase();
    
    const savedToken = localStorage.getItem(`rst_token_${emailLower}`);
    if (!savedToken || savedToken !== code.trim()) {
      throw new Error('WRONG_VERIFICATION_CODE');
    }

    if (newPassword && newPassword.length < 6) {
      throw new Error('PASSWORD_TOO_SHORT');
    }

    // Clear verification codes on success
    localStorage.removeItem(`rst_token_${emailLower}`);

    return {
      success: true,
      message: 'Your credentials password has been successfully renewed. Please log in with your new password.',
      messageAr: 'تم تجديد كلمة المرور الخاصة بك بنجاح. لا تتردد في تسجيل الدخول بكلمتك الجديدة.'
    };
  }
};
