/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { AuthService, LoginCredentials, RegisterCredentials, ForgotPasswordResponse, ResetPasswordResponse } from '../services/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, role: UserRole, name: string) => Promise<void>;
  loginWithCredentials: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  requestResetPassword: (email: string) => Promise<ForgotPasswordResponse>;
  submitResetPassword: (email: string, code: string, password?: string) => Promise<ResetPasswordResponse>;
  logout: () => void;
  toggleBookmark: (businessId: string) => void;
  isBookmarked: (businessId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PRE_CONFIGURED_USERS: Record<string, { name: string; role: UserRole; avatar: string; ownedBusinesses: string[] }> = {
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bep_session');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('bep_token');
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('bep_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('bep_session');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('bep_token', token);
    } else {
      localStorage.removeItem('bep_token');
    }
  }, [token]);

  // Backwards compatibility login
  const login = async (email: string, role: UserRole, name: string) => {
    setIsLoading(true);
    try {
      // Simulate slight server validation
      await new Promise((resolve) => setTimeout(resolve, 500));

      const matched = PRE_CONFIGURED_USERS[email.trim().toLowerCase()];
      const dummyToken = `jwt_bep_token_${btoa(email)}_${Date.now()}`;
      setToken(dummyToken);

      if (matched) {
        setUser({
          id: email === 'karim@foundry.com' ? 'u_karim' : email === 'layla@explorer.com' ? 'u_layla' : 'u_admin',
          name: matched.name,
          email: email,
          role: matched.role,
          avatar: matched.avatar,
          savedBusinesses: email === 'layla@explorer.com' ? ['b2'] : [],
          ownedBusinesses: matched.ownedBusinesses
        });
      } else {
        // Create flexible temporary profile
        setUser({
          id: `u_${Date.now()}`,
          name: name || email.split('@')[0],
          email: email,
          role: role,
          avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(email)}`,
          savedBusinesses: [],
          ownedBusinesses: role === 'owner' ? [`b_${Date.now()}`] : []
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Modern login with credential fields and backend API alignment
  const loginWithCredentials = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await AuthService.login(credentials);
      setUser(response.user);
      setToken(response.token);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    try {
      const response = await AuthService.register(credentials);
      setUser(response.user);
      setToken(response.token);
    } finally {
      setIsLoading(false);
    }
  };

  const requestResetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      return await AuthService.requestResetPassword(email);
    } finally {
      setIsLoading(false);
    }
  };

  const submitResetPassword = async (email: string, code: string, password?: string) => {
    setIsLoading(true);
    try {
      return await AuthService.submitResetPassword(email, code, password);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const toggleBookmark = (businessId: string) => {
    if (!user) return;
    const isSaved = user.savedBusinesses.includes(businessId);
    const updatedSaved = isSaved
      ? user.savedBusinesses.filter((id) => id !== businessId)
      : [...user.savedBusinesses, businessId];

    setUser({
      ...user,
      savedBusinesses: updatedSaved
    });
  };

  const isBookmarked = (businessId: string) => {
    return user ? user.savedBusinesses.includes(businessId) : false;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token,
      isLoading, 
      login, 
      loginWithCredentials, 
      register, 
      requestResetPassword, 
      submitResetPassword, 
      logout, 
      toggleBookmark, 
      isBookmarked 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};
