/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, ShieldCheck, Briefcase, Eye } from 'lucide-react';
import { Language, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onSuccess: (msg: string, msgAr: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, lang, onSuccess }) => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [isSignUp, setIsSignUp] = useState(false);

  if (!isOpen) return null;

  const isRTL = lang === 'ar';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await login(email, role, name);
      onSuccess(
        `Successfully logged in as ${name || email.split('@')[0]} (${role})`,
        `تم تسجيل الدخول بنجاح كـ ${name || email.split('@')[0]} (${role})`
      );
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickLogin = async (preEmail: string, preName: string, preRole: UserRole) => {
    try {
      await login(preEmail, preRole, preName);
      onSuccess(
        `Logged in with high-tier profile: ${preName} (${preRole})`,
        `تم تسجيل الدخول بالملف الفاخر: ${preName} (${preRole})`
      );
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-zinc-100 overflow-hidden z-10 animate-fade-in">
        
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-zinc-800 to-zinc-950 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} text-zinc-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10`}
          >
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="text-2xl font-display font-medium mb-1">
            {isRTL ? 'مرحباً بك في منصة الاستكشاف' : 'Welcome to the Platform'}
          </h2>
          <p className="text-zinc-400 text-xs">
            {isRTL ? 'بوابتك الحرفية لاستكشاف وادارة الاعمال والشركات الناشئة' : 'Your bespoke gateway to discover and manage premium businesses'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-6">
          
          {/* Quick Demo Credentials Track */}
          <div className="bg-zinc-50 border border-zinc-200/60 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              {isRTL ? 'تسجيل دخول سريع للتجربة والتقييم' : 'Stakeholder Fast-Track Demo Portals'}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('layla@explorer.com', 'Layla Al-Mansoori', 'user')}
                className="flex flex-col items-center justify-center text-center p-2.5 bg-white border border-zinc-200 hover:border-zinc-800 rounded-lg hover:shadow-sm transition-all text-xs"
              >
                <div className="w-7 h-7 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 font-semibold mb-1">L</div>
                <span className="font-semibold text-zinc-800">{isRTL ? 'ليلى (مستكشف)' : 'Layla (User)'}</span>
                <span className="text-[10px] text-zinc-400">{isRTL ? 'مستعرض وتفضيلات' : 'Explorer, bookmarks'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('karim@foundry.com', 'Karim Zayed', 'owner')}
                className="flex flex-col items-center justify-center text-center p-2.5 bg-white border border-zinc-200 hover:border-zinc-800 rounded-lg hover:shadow-sm transition-all text-xs"
              >
                <div className="w-7 h-7 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-semibold mb-1">K</div>
                <span className="font-semibold text-zinc-800">{isRTL ? 'كريم (مالك شركة)' : 'Karim (Owner)'}</span>
                <span className="text-[10px] text-zinc-400">{isRTL ? 'لوحة تحليلات ورسائل' : 'Biz analytics, leads'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin@platform.com', 'Sarah Jenkins', 'admin')}
                className="flex flex-col items-center justify-center text-center p-2.5 bg-white border border-zinc-200 hover:border-zinc-800 rounded-lg hover:shadow-sm transition-all text-xs"
              >
                <div className="w-7 h-7 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 font-semibold mb-1">S</div>
                <span className="font-semibold text-zinc-800">{isRTL ? 'سارة (مشرف)' : 'Sarah (Admin)'}</span>
                <span className="text-[10px] text-zinc-400">{isRTL ? 'إداري عام' : 'Global admin rights'}</span>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-zinc-200"></div>
            <span className="flex-shrink mx-4 text-xs font-semibold text-zinc-400 uppercase tracking-widest">
              {isRTL ? 'أو سجل الدخول يدوياً' : 'Or Manual Sandbox Input'}
            </span>
            <div className="flex-grow border-t border-zinc-200"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isSignUp && (
              <div>
                <label className="block text-xs font-medium text-zinc-600 mb-1.5">{isRTL ? 'الاسم بالكامل' : 'Full Name'}</label>
                <div className="relative">
                  <span className={`absolute inset-y-0 ${isRTL ? 'right-3' : 'left-3'} flex items-center text-zinc-400`}>
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required={isSignUp}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isRTL ? 'ليلى المنصوري' : 'Layla Al-Mansoori'}
                    className={`w-full py-2.5 ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-800 text-sm`}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1.5">{isRTL ? 'البريد الإلكتروني' : 'Email Address'}</label>
              <div className="relative">
                <span className={`absolute inset-y-0 ${isRTL ? 'right-3' : 'left-3'} flex items-center text-zinc-400`}>
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className={`w-full py-2.5 ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-800 text-sm`}
                />
              </div>
            </div>

            {/* Custom Interactive Sandbox Role Pick */}
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1.5">
                {isRTL ? 'الدور الوظيفي للحساب' : 'Target Account Persona'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`py-2 text-xs border rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                    role === 'user'
                      ? 'bg-zinc-900 text-white border-zinc-900 border-2 font-medium'
                      : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  {isRTL ? 'مستكشف' : 'Explorer'}
                </button>
                <button
                  type="button"
                  onClick={() => setRole('owner')}
                  className={`py-2 text-xs border rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                    role === 'owner'
                      ? 'bg-zinc-900 text-white border-zinc-900 border-2 font-medium'
                      : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  {isRTL ? 'مالك أعمال' : 'Biz Owner'}
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`py-2 text-xs border rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                    role === 'admin'
                      ? 'bg-zinc-900 text-white border-zinc-900 border-2 font-medium'
                      : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {isRTL ? 'مدير' : 'Admin'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 bg-zinc-900 hover:bg-zinc-850 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  {isSignUp
                    ? isRTL ? 'إنشاء حساب تجريبي' : 'Initialize Demo Profile'
                    : isRTL ? 'دخول آمن' : 'Secure Vault Entrance'
                  }
                </>
              )}
            </button>
          </form>

          {/* Toggle login sign up triggers */}
          <div className="text-center text-xs text-zinc-500">
            {isSignUp ? (
              <>
                {isRTL ? 'لديك حساب تجريبي بالفعل؟ ' : 'Already have a sandbox account? '}
                <button type="button" onClick={() => setIsSignUp(false)} className="text-zinc-900 font-semibold hover:underline">
                  {isRTL ? 'سجل دخول' : 'Sign In Now'}
                </button>
              </>
            ) : (
              <>
                {isRTL ? 'ليس لديك ملف؟ ' : "Don't have a profile yet? "}
                <button type="button" onClick={() => setIsSignUp(true)} className="text-zinc-900 font-semibold hover:underline">
                  {isRTL ? 'أنشئ ملفاً جديداً' : 'Create Custom Persona'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
