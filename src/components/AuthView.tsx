/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Lock, 
  Mail, 
  User as UserIcon, 
  ShieldCheck, 
  Briefcase, 
  Eye, 
  EyeOff, 
  Key, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { Language, UserRole } from '../types';

interface AuthViewProps {
  lang: Language;
  onSuccess: (text: string, textAr: string) => void;
  onNavigateHome?: () => void;
  initialMode?: 'login' | 'register' | 'forgot' | 'reset';
  redirectMessage?: { en: string; ar: string } | null;
}

export const AuthView: React.FC<AuthViewProps> = ({ 
  lang, 
  onSuccess, 
  onNavigateHome,
  initialMode = 'login',
  redirectMessage = null
}) => {
  const { loginWithCredentials, register, requestResetPassword, submitResetPassword, isLoading } = useAuth();
  
  // Auth Modes: 'login' | 'register' | 'forgot' | 'reset'
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'reset'>(initialMode);
  
  // Input fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [resetCode, setResetCode] = useState('');
  
  // Interactive triggers
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Handlers for error/success alerts
  const [errorText, setErrorText] = useState<{ en: string; ar: string } | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ en: string; ar: string } | null>(null);

  // Live validator visual states
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [passwordValid, setPasswordValid] = useState<boolean | null>(null);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);

  const isRTL = lang === 'ar';

  // Live validation triggers
  useEffect(() => {
    if (email) {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      setEmailValid(isValid);
    } else {
      setEmailValid(null);
    }
  }, [email]);

  useEffect(() => {
    if (password) {
      setPasswordValid(password.length >= 6);
    } else {
      setPasswordValid(null);
    }
  }, [password]);

  useEffect(() => {
    if (password && confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(null);
    }
  }, [password, confirmPassword]);

  // Handle errors translates
  const parseError = (err: any): { en: string; ar: string } => {
    const msg = err instanceof Error ? err.message : String(err);
    switch (msg) {
      case 'INVALID_EMAIL_FORMAT':
        return {
          en: 'Please provide a legitimate email layout.',
          ar: 'يرجى تقديم نمط قياسي للبريد الإلكتروني.'
        };
      case 'PASSWORD_TOO_SHORT':
        return {
          en: 'Password security code must contain at least 6 characters.',
          ar: 'يجب أن تحتوي كلمة المرور على ٦ أحرف على الأقل.'
        };
      case 'NAME_TOO_SHORT':
        return {
          en: 'Please input your actual complete name (minimum 3 characters).',
          ar: 'يرجى إدخال اسمك الفعلي بالكامل (٣ أحرف على الأقل).'
        };
      case 'WRONG_VERIFICATION_CODE':
        return {
          en: 'The security verification token code provided is incorrect.',
          ar: 'رمز التحقق الأمني غير صحيح أو قد انتهت صلاحيته.'
        };
      default:
        return {
          en: 'A network communication timeout occurred. Please retry.',
          ar: 'حدث خطأ غير متوقع في خوادم التحقق. يرجى المحاولة لاحقاً.'
        };
    }
  };

  const clearMessages = () => {
    setErrorText(null);
    setSuccessInfo(null);
  };

  // Form submission dispatcher
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    // Custom validations beforehand
    if (mode !== 'reset' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorText({
        en: 'Please fill in a valid email address first.',
        ar: 'الرجاء إدخال عنوان بريد إلكتروني صحيح أولاً.'
      });
      return;
    }

    if ((mode === 'login' || mode === 'register') && password.length < 6) {
      setErrorText({
        en: 'Passwords must contain a minimum of 6 characters.',
        ar: 'يجب أن لا تقل كلمة المرور عن ٦ خانات.'
      });
      return;
    }

    try {
      if (mode === 'login') {
        await loginWithCredentials({ email, password });
        onSuccess(
          `Asecure session established. Active Profile: ${email.split('@')[0]}`,
          `تم إنشاء جلسة آمنة بنجاح للملف: ${email.split('@')[0]}`
        );
        if (onNavigateHome) onNavigateHome();
      } 
      
      else if (mode === 'register') {
        if (password !== confirmPassword) {
          setErrorText({
            en: 'Confirmation password does not match original.',
            ar: 'تأكيد كلمة المرور غير مطابق للكلمة الأصلية.'
          });
          return;
        }
        await register({ email, password, name, role });
        onSuccess(
          `Account verified and setup successfully. Welcome ${name}!`,
          `تم إنشاء حسابك وتفعيله بنجاح. مرحباً بك ${name}!`
        );
        if (onNavigateHome) onNavigateHome();
      } 
      
      else if (mode === 'forgot') {
        const res = await requestResetPassword(email);
        setSuccessInfo({ en: res.message, ar: res.messageAr });
        // Auto pass to reset step
        setTimeout(() => {
          setResetCode(res.resetToken || '');
          setMode('reset');
        }, 1500);
      } 
      
      else if (mode === 'reset') {
        if (!resetCode) {
          setErrorText({
            en: 'Please supply the simulated verification pin.',
            ar: 'يرجى إدخال رمز التحقق الأمني المرسل.'
          });
          return;
        }
        const res = await submitResetPassword(email, resetCode, password);
        setSuccessInfo({ en: res.message, ar: res.messageAr });
        // Reset inputs and move to login
        setTimeout(() => {
          setMode('login');
          clearMessages();
        }, 2200);
      }
    } catch (err) {
      setErrorText(parseError(err));
    }
  };

  const handleQuickSandboxLogin = async (preEmail: string, preName: string, preRole: UserRole) => {
    clearMessages();
    try {
      await loginWithCredentials({ email: preEmail, password: 'password123' });
      onSuccess(
        `Stakeholder account retrieved: ${preName} (${preRole})`,
        `تم استيراد ملف الشريك المهني: ${preName} (${preRole})`
      );
      if (onNavigateHome) onNavigateHome();
    } catch (err) {
      setErrorText(parseError(err));
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4 pb-12" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      
      {/* Left decorative brand side */}
      <div className="lg:col-span-5 bg-gradient-to-br from-zinc-900 via-zinc-950 to-stone-900 rounded-3xl p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden shadow-xl border border-zinc-800/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-white/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-zinc-950 shadow-lg">
              <Sparkles className="w-5 h-5 text-zinc-950" />
            </div>
            <div>
              <span className="font-display font-bold text-base tracking-wider block">EXPLORA</span>
              <span className="text-[10px] font-bold text-zinc-500 block tracking-widest">GATEWAY</span>
            </div>
          </div>

          <div className="space-y-3 pt-6">
            <h2 className="text-2xl lg:text-3xl font-display font-semibold tracking-tight leading-snug">
              {isRTL ? 'بوابتك الذكية لاستكشاف المنشآت والأعمال الحرة' : 'Bespoke Business Entrance'}
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              {isRTL 
                ? 'مرحباً بك في لوحة الدخول الموحدة للمستثمرين، شركاء قطاع الأعمال والمستكشفين المحليين.' 
                : 'Welcome to our cryptographic verification gateway. Connect with local establishments, review services, and manage business metrics.'
              }
            </p>
          </div>
        </div>

        {/* Dynamic Sandbox Selector Area on Side for ease of review */}
        <div className="mt-12 space-y-4 bg-zinc-850/60 border border-zinc-800/80 p-5 rounded-2xl">
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-1.5 justify-between">
            <span>{isRTL ? 'ملفات جاهزة للمراجعة السريعة' : 'Developer Sandbox Portals'}</span>
            <span className="bg-zinc-800 px-2 py-0.5 rounded text-[9px] text-zinc-400 capitalize">demo ready</span>
          </h3>
          
          <div className="space-y-2">
            {[
              { email: 'layla@explorer.com', name: 'Layla Al-Mansoori', role: 'user', color: 'bg-amber-500/10 text-amber-400' },
              { email: 'karim@foundry.com', name: 'Karim Zayed', role: 'owner', color: 'bg-blue-500/10 text-blue-400' },
              { email: 'admin@platform.com', name: 'Sarah Jenkins', role: 'admin', color: 'bg-purple-500/10 text-purple-405' }
            ].map((persona) => (
              <button
                key={persona.email}
                type="button"
                onClick={() => handleQuickSandboxLogin(persona.email, persona.name, persona.role as UserRole)}
                className="w-full flex items-center justify-between p-2.5 bg-zinc-900 border border-zinc-800/80 hover:border-zinc-500 rounded-xl transition-all text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${persona.color.split(' ')[0]}`} />
                  <div>
                    <span className="text-xs font-bold text-zinc-200 block group-hover:text-white">{persona.name}</span>
                    <span className="text-[10px] text-zinc-500 block">{persona.email}</span>
                  </div>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${persona.color}`}>
                  {persona.role}
                </span>
              </button>
            ))}
          </div>
          <p className="text-[10px] text-zinc-500 leading-snug">
            {isRTL
              ? 'تسمح لك هذه الروابط بتخطي إدخال كلمة المرور واستكشاف لوحات التحكم بشكل فوري.'
              : 'These direct-keys bypass credential requirements to instantly evaluate profile environments.'
            }
          </p>
        </div>
      </div>

      {/* Right form submission side */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-8 lg:p-12 border border-zinc-200/85 shadow-md flex flex-col justify-between">
        
        <div>
          {/* Form alert if router protection triggered redirect */}
          {redirectMessage && !errorText && !successInfo && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-orange-800">
                  {isRTL ? 'مطلوب تسجيل الدخول للاستمرار' : 'Authentication Required'}
                </h4>
                <p className="text-xs text-orange-600 leading-normal mt-0.5">
                  {isRTL ? redirectMessage.ar : redirectMessage.en}
                </p>
              </div>
            </div>
          )}

          {/* Success Alerts */}
          {successInfo && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-emerald-800">
                  {isRTL ? 'إجراء ناجح' : 'Action Completed Successfully'}
                </h4>
                <p className="text-xs text-emerald-600 leading-normal mt-0.5">
                  {isRTL ? successInfo.ar : successInfo.en}
                </p>
              </div>
            </div>
          )}

          {/* Error Alerts */}
          {errorText && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-800">
                  {isRTL ? 'حدث خطأ في عملية التحقق' : 'Validation Check Failed'}
                </h4>
                <p className="text-xs text-rose-600 leading-normal mt-0.5">
                  {isRTL ? errorText.ar : errorText.en}
                </p>
              </div>
            </div>
          )}

          {/* Form Header */}
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-display font-semibold tracking-tight text-zinc-900">
              {mode === 'login' && (isRTL ? 'تسجيل الدخول للنظام' : 'Secure Vault Sign In')}
              {mode === 'register' && (isRTL ? 'إنشاء حساب جديد' : 'Establish Creator Account')}
              {mode === 'forgot' && (isRTL ? 'استعادة كلمة المرور' : 'Lost Credentials Request')}
              {mode === 'reset' && (isRTL ? 'تعيين كلمة المرور الجديدة' : 'Set Active Password')}
            </h1>
            <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
              {mode === 'login' && (isRTL ? 'الرجاء كتابة تفاصيل بريدك لإدارة الأعمال والمفضلة' : 'Provide sandbox email credentials or trigger stakeholder key access.')}
              {mode === 'register' && (isRTL ? 'ابدأ بتسجيل اسمك وحدد طبيعة حسابك اليوم في ثوانٍ' : 'Configure a verified explorer or business proprietor interface.')}
              {mode === 'forgot' && (isRTL ? 'أدخل البريد المعتمد لإرسال رمز إعادة التعيين التجريبي' : 'Submit active mail. A password modification code will be simulated.')}
              {mode === 'reset' && (isRTL ? 'اكتب الرمز المرسل وعين كلمة مرور قوية لتأمين الحساب' : 'Type simulated reset pin code received and formulate a secure password.')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name (Only for Registration) */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-zinc-650 uppercase tracking-widest mb-1.5">
                  {isRTL ? 'الاسم بالكامل' : 'Your Complete Name'}
                </label>
                <div className="relative">
                  <span className={`absolute inset-y-0 ${isRTL ? 'right-4' : 'left-4'} flex items-center text-zinc-400`}>
                    <UserIcon className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isRTL ? 'ليلى المنصوري' : 'Layla Al-Mansoori'}
                    className={`w-full py-3.5 ${isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'} text-sm border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 placeholder-zinc-455 transition-all`}
                  />
                </div>
              </div>
            )}

            {/* Email Field (for login, register, forgot, but disabled in reset for binding safety) */}
            {mode !== 'reset' && (
              <div>
                <label className="block text-xs font-bold text-zinc-650 uppercase tracking-widest mb-1.5">
                  {isRTL ? 'عنوان البريد الإلكتروني' : 'Secure Email Address'}
                </label>
                <div className="relative">
                  <span className={`absolute inset-y-0 ${isRTL ? 'right-4' : 'left-4'} flex items-center text-zinc-400`}>
                    <Mail className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@enterprise.com"
                    className={`w-full py-3.5 ${isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'} text-sm border rounded-xl focus:outline-none placeholder-zinc-455 transition-all ${
                      emailValid === true ? 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500' :
                      emailValid === false ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500' :
                      'border-zinc-200 focus:border-zinc-950 focus:ring-zinc-950'
                    }`}
                  />
                  {emailValid === true && (
                    <span className={`absolute inset-y-0 ${isRTL ? 'left-3' : 'right-3'} flex items-center text-emerald-600`}>
                      <CheckCircle2 className="w-4.5 h-4.5" />
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Simulated verification Code received (Only for reset password) */}
            {mode === 'reset' && (
              <div>
                <label className="block text-xs font-bold text-zinc-650 uppercase tracking-widest mb-1.5">
                  {isRTL ? 'رمز الاستعادة الأمني (سيمثل الرصيد)' : 'Simulated Reset Security Code'}
                </label>
                <div className="relative">
                  <span className={`absolute inset-y-0 ${isRTL ? 'right-4' : 'left-4'} flex items-center text-zinc-400`}>
                    <Key className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="text"
                    required
                    maxLength={12}
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="e.g. rst_123456"
                    className={`w-full py-3.5 ${isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'} text-center text-lg font-mono tracking-widest border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950`}
                  />
                </div>
              </div>
            )}

            {/* Password input field (all modes except forgot) */}
            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-zinc-650 uppercase tracking-widest">
                    {mode === 'reset' ? (isRTL ? 'كلمة المرور الجديدة' : 'New Security Password') : (isRTL ? 'كلمة المُرور' : 'Vault Secret Password')}
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] font-bold text-zinc-900 hover:underline cursor-pointer"
                    >
                      {isRTL ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className={`absolute inset-y-0 ${isRTL ? 'right-4' : 'left-4'} flex items-center text-zinc-400`}>
                    <Lock className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full py-3.5 ${isRTL ? 'pr-11 pl-12' : 'pl-11 pr-12'} text-sm border rounded-xl focus:outline-none transition-all ${
                      passwordValid === true ? 'border-emerald-300 focus:border-emerald-500' :
                      passwordValid === false ? 'border-rose-300 focus:border-rose-500' :
                      'border-zinc-200 focus:border-zinc-950'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute inset-y-0 ${isRTL ? 'left-3' : 'right-3'} flex items-center text-zinc-400 hover:text-zinc-700`}
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
                {password && password.length < 6 && (
                  <p className="text-[10px] text-rose-500 font-semibold mt-1">
                    {isRTL ? 'ينصح بـ ٦ أحرف أو رموز لتخطي فحص الحماية.' : 'Standard validator expects 6 characters or above.'}
                  </p>
                )}
              </div>
            )}

            {/* Confirm password input (Only for Register / Reset mode) */}
            {(mode === 'register' || mode === 'reset') && (
              <div>
                <label className="block text-xs font-bold text-zinc-650 uppercase tracking-widest mb-1.5">
                  {isRTL ? 'تأكيد كلمة المرور' : 'Confirm Encryption Key'}
                </label>
                <div className="relative">
                  <span className={`absolute inset-y-0 ${isRTL ? 'right-4' : 'left-4'} flex items-center text-zinc-400`}>
                    <Lock className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full py-3.5 ${isRTL ? 'pr-11 pl-12' : 'pl-11 pr-12'} text-sm border rounded-xl focus:outline-none transition-all ${
                      passwordsMatch === true ? 'border-emerald-300' :
                      passwordsMatch === false ? 'border-rose-300' :
                      'border-zinc-200'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute inset-y-0 ${isRTL ? 'left-3' : 'right-3'} flex items-center text-zinc-400 hover:text-zinc-700`}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
                {confirmPassword && passwordsMatch === false && (
                  <p className="text-[10px] text-rose-500 font-semibold mt-1">
                    {isRTL ? 'الكلمتان غير متطابقتين.' : 'Passwords do not match up yet.'}
                  </p>
                )}
                {confirmPassword && passwordsMatch === true && (
                  <p className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {isRTL ? 'كلمات المرور متطابقة تماماً.' : 'Security values perfectly aligned.'}
                  </p>
                )}
              </div>
            )}

            {/* Creator roles pick (Only for register mode) */}
            {mode === 'register' && (
              <div className="pt-2">
                <label className="block text-xs font-bold text-zinc-650 uppercase tracking-widest mb-2">
                  {isRTL ? 'نوع حسابك على المنصة' : 'Select Target Persona'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('user')}
                    className={`p-3 border rounded-xl flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer ${
                      role === 'user' 
                        ? 'bg-zinc-950 border-zinc-950 text-white shadow-md font-bold' 
                        : 'bg-white text-zinc-650 border-zinc-200 hover:border-zinc-450'
                    }`}
                  >
                    <UserIcon className="w-5 h-5" />
                    <span className="text-xs font-semibold">{isRTL ? 'مستكشف باحث' : 'Explorer / User'}</span>
                    <span className="text-[10px] opacity-75">{isRTL ? 'أريد العثور وتفضيل المنشآت' : 'Find & save premium bizes'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('owner')}
                    className={`p-3 border rounded-xl flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer ${
                      role === 'owner' 
                        ? 'bg-zinc-950 border-zinc-950 text-white shadow-md font-bold' 
                        : 'bg-white text-zinc-650 border-zinc-200 hover:border-zinc-450'
                    }`}
                  >
                    <Briefcase className="w-5 h-5" />
                    <span className="text-xs font-semibold">{isRTL ? 'مالك أعمال وشريك' : 'Company Proprietor'}</span>
                    <span className="text-[10px] opacity-75">{isRTL ? 'أريد إدارة لوحة تحليل منشآتي' : 'Register analytics & leads'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Action dispatch button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 py-3.5 bg-zinc-950 hover:bg-zinc-850 disabled:bg-zinc-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4.5 h-4.5" />
                  <span>
                    {mode === 'login' && (isRTL ? 'دخول آمن للملف' : 'Verify Entry Credentials')}
                    {mode === 'register' && (isRTL ? 'إنشاء حسابي وتفعيله' : 'Publish Authorized Identity')}
                    {mode === 'forgot' && (isRTL ? 'إرسال الرمز التجريبي' : 'Initiate Recovery Link')}
                    {mode === 'reset' && (isRTL ? 'تأكيد الكلمة الجديدة' : 'Commit New Encryption')}
                  </span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Auth Mode switcher links */}
        <div className="mt-8 border-t border-zinc-150 pt-5 text-center space-y-3">
          
          <div className="text-xs text-zinc-500 font-medium">
            {mode === 'login' && (
              <>
                {isRTL ? 'ليس لديك حساب على المنصة؟ ' : "Don't have an active footprint yet? "}
                <button 
                  type="button" 
                  onClick={() => { setMode('register'); clearMessages(); }} 
                  className="text-zinc-900 font-bold hover:underline cursor-pointer"
                >
                  {isRTL ? 'سجل حسابك مجاناً' : 'Establish Footprint'}
                </button>
              </>
            )}

            {mode === 'register' && (
              <>
                {isRTL ? 'لديك حساب مسجل بالفعل؟ ' : 'Already have a registered security block? '}
                <button 
                  type="button" 
                  onClick={() => { setMode('login'); clearMessages(); }} 
                  className="text-zinc-900 font-bold hover:underline cursor-pointer"
                >
                  {isRTL ? 'تسجيل الدخول' : 'Sign In Now'}
                </button>
              </>
            )}

            {mode === 'forgot' && (
              <button 
                type="button" 
                onClick={() => { setMode('login'); clearMessages(); }} 
                className="inline-flex items-center gap-1.5 text-xs text-zinc-900 font-bold hover:underline cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isRTL ? 'الرجوع لتسجيل الدخول' : 'Return to Safe Login'}</span>
              </button>
            )}

            {mode === 'reset' && (
              <button 
                type="button" 
                onClick={() => { setMode('forgot'); clearMessages(); }} 
                className="inline-flex items-center gap-1.5 text-xs text-zinc-900 font-bold hover:underline cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isRTL ? 'إعادة طلب كود الاسترداد' : 'Generate another recovery code'}</span>
              </button>
            )}
          </div>

          {onNavigateHome && (
            <div>
              <button
                type="button"
                onClick={onNavigateHome}
                className="text-xs text-zinc-400 hover:text-zinc-800 transition-colors"
              >
                {isRTL ? 'استمرار كضيف ومستكشف مجهول' : 'Continue parsing silently as Guest'}
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
