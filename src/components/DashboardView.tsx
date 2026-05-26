/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BusinessesService } from '../services/businesses';
import { 
  Building2, 
  PlusCircle, 
  Inbox, 
  TrendingUp, 
  Sparkles, 
  Check, 
  Eye, 
  Star, 
  Mail, 
  Phone, 
  Globe, 
  Calendar,
  AlertCircle,
  Clock,
  Settings,
  CreditCard,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  User,
  Sliders,
  BellRing,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { Business, Inquiry, BusinessAnalytics, Language, WorkingHours } from '../types';

interface DashboardViewProps {
  lang: Language;
  onSuccess: (msg: string, msgAr: string) => void;
  onSelectBusiness: (business: Business) => void;
}

type DashboardTab = 'analytics' | 'inquiries' | 'add-listing' | 'settings' | 'billing' | 'support';

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  lang, 
  onSuccess,
  onSelectBusiness
}) => {
  const { user } = useAuth();
  
  const [subTab, setSubTab] = useState<DashboardTab>('analytics');
  const [analytics, setAnalytics] = useState<BusinessAnalytics | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  // Listing creation form state
  const [title, setTitle] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [category, setCategory] = useState('tech');
  const [priceLevel, setPriceLevel] = useState<'$' | '$$' | '$$$' | '$$$$'>('$$');
  const [location, setLocation] = useState('Silicon District');
  const [locationAr, setLocationAr] = useState('منطقة السيليكون');
  const [address, setAddress] = useState('');
  const [addressAr, setAddressAr] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [emailMsg, setEmailMsg] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [desc, setDesc] = useState('');
  const [descAr, setDescAr] = useState('');
  
  const [submitting, setSubmitting] = useState(false);

  // Help desk ticketing mockup state
  const [supportCategory, setSupportCategory] = useState('listing_issue');
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [sendingSupport, setSendingSupport] = useState(false);

  // Mock settings toggles
  const [allowInstantInquiries, setAllowInstantInquiries] = useState(true);
  const [smsLeadsAlerts, setSmsLeadsAlerts] = useState(false);
  const [publicMetricShare, setPublicMetricShare] = useState(true);

  const isRTL = lang === 'ar';

  // Load backend statistics
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const ownedId = user.ownedBusinesses && user.ownedBusinesses.length > 0 
          ? user.ownedBusinesses[0] 
          : 'b1';

        const stats = await BusinessesService.fetchAnalytics(ownedId);
        const leads = await BusinessesService.fetchInquiries(ownedId);
        
        setAnalytics(stats);
        setInquiries(leads);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user, subTab]);

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !titleAr || !desc || !descAr) return;

    setSubmitting(true);
    try {
      const finalImage = imageUrl.trim() || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200';
      
      const newListing: Omit<Business, 'id' | 'rating' | 'reviewsCount' | 'isVerified'> = {
        name: title,
        nameAr: titleAr,
        category,
        priceLevel,
        location,
        locationAr,
        address,
        addressAr,
        phone,
        website,
        email: emailMsg,
        image: finalImage,
        gallery: [
          'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=600'
        ],
        description: desc,
        descriptionAr: descAr,
        isFeatured: false,
        isOpenNow: true,
        amenities: ['High-speed Wi-Fi', 'Free Coffee', 'Meeting Rooms'],
        amenitiesAr: ['واي فاي سريع', 'قهوة مجانية', 'غرف اجتماعات'],
        latitude: 25.2048,
        longitude: 55.2708,
        workingHours: {
          monday: '09:00 AM - 06:00 PM',
          tuesday: '09:00 AM - 06:00 PM',
          wednesday: '09:00 AM - 06:00 PM',
          thursday: '09:00 AM - 06:00 PM',
          friday: '09:00 AM - 01:00 PM',
          saturday: 'Closed',
          sunday: 'Closed'
        },
        workingHoursAr: {
          monday: '٠٩:٠٠ ص - ٠٦:٠٠ م',
          tuesday: '٠٩:٠٠ ص - ٠٦:٠٠ م',
          wednesday: '٠٩:٠٠ ص - ٠٦:٠٠ م',
          thursday: '٠٩:٠٠ ص - ٠٦:٠٠ م',
          friday: '٠٩:٠٠ ص - ٠١:٠٠ م',
          saturday: 'مغلق',
          sunday: 'مغلق'
        }
      };

      await BusinessesService.createBusiness(newListing);
      
      setTitle('');
      setTitleAr('');
      setAddress('');
      setAddressAr('');
      setPhone('');
      setWebsite('');
      setEmailMsg('');
      setImageUrl('');
      setDesc('');
      setDescAr('');

      onSuccess(
        'Your listing proposal is registered successfully in local memory!',
        'تم تسجيل مقترح قائمتك بنجاح في الذاكرة المحلية للمنصة!'
      );
      setSubTab('analytics');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSupportTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportSubject || !supportMessage) return;
    setSendingSupport(true);
    setTimeout(() => {
      onSuccess(
        `Support ticket #${Math.floor(Math.random() * 8000) + 1000} opened successfully. Our team will review it within 24 hours.`,
        `تم فتح تذكرة الدعم بنجاح رقم #${Math.floor(Math.random() * 8000) + 1000}. سيقوم فريقنا بالمراجعة خلال ٢٤ ساعة.`
      );
      setSupportSubject('');
      setSupportMessage('');
      setSendingSupport(false);
    }, 1200);
  };

  if (!user) return null;

  const sidebarMenuItems = [
    {
      id: 'analytics',
      labelEn: 'Market Analytics',
      labelAr: 'التحليلات والمؤشرات',
      icon: TrendingUp,
      descEn: 'Track views & convert spikes',
      descAr: 'تتبع المشاهدات والمؤشرات',
      badge: null
    },
    {
      id: 'inquiries',
      labelEn: 'Leads Inbox',
      labelAr: 'رسائل الاستفسار الواردة',
      icon: Inbox,
      descEn: 'Direct client communications',
      descAr: 'استفسارات العملاء المباشرة',
      badge: inquiries.length > 0 ? inquiries.length : null
    },
    {
      id: 'add-listing',
      labelEn: 'Add Corporate Listing',
      labelAr: 'إضافة منشأة جديدة',
      icon: PlusCircle,
      descEn: 'Register new location coordinates',
      descAr: 'إدراج فرع أو منشأة جديدة',
      badge: null
    },
    {
      id: 'settings',
      labelEn: 'Platform Settings',
      labelAr: 'إعدادات المنصة والملف',
      icon: Settings,
      descEn: 'Configure workspace preferences',
      descAr: 'تخصيص الملف والصلاحيات',
      badge: null
    },
    {
      id: 'billing',
      labelEn: 'Subscriptions & Billing',
      labelAr: 'الاشتراكات والفوترة',
      icon: CreditCard,
      descEn: 'Manage development sandbox plan',
      descAr: 'إدارة خطة الحساب وفواتيرك',
      badge: null
    },
    {
      id: 'support',
      labelEn: 'Direct Support Hub',
      labelAr: 'الدعم والمساعدة المباشرة',
      icon: HelpCircle,
      descEn: 'File a localized platform ticket',
      descAr: 'إنشاء تذكرة دعم فني للمراجعة',
      badge: null
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      
      {/* Dashboard Top Banner Header */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-neutral-800 p-6 md:p-8 rounded-3xl text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden border border-zinc-805/10">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-4">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-16 h-16 rounded-2xl border-2 border-white/20 shadow bg-zinc-800 object-cover shrink-0"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded uppercase tracking-wider">
                {user.role === 'admin' ? (isRTL ? 'المدير العام' : 'Administrator Code') : (isRTL ? 'مالك أعمال شريك' : 'Verified Partner')}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span className="text-[10px] text-zinc-400 font-medium">UTC 2026</span>
            </div>
            <h1 className="text-xl md:text-2xl font-display font-bold mt-1 tracking-tight">
              {isRTL ? 'لوحة تحكم الشركاء' : 'Partner Enterprise Workspace'}
            </h1>
            <p className="text-zinc-400 text-xs mt-0.5">
              {isRTL ? `أهلاً بك، م. ${user.name}` : `Welcome back, partner ${user.name}`}
            </p>
          </div>
        </div>

        {/* Quick Help Status badge */}
        <div className="shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/90 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{isRTL ? 'اتصال الخدمة آمن ومستقر' : 'Secure Sandbox Active'}</span>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm">
            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-2.5 mb-3">
              {isRTL ? 'الخريطة الإدارية' : 'Workspace Navigation'}
            </h3>

            {/* Desktop Vertical Menu */}
            <nav className="hidden lg:flex flex-col gap-1">
              {sidebarMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = subTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSubTab(item.id as DashboardTab)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center justify-between group cursor-pointer ${
                      isActive 
                        ? 'bg-zinc-900 text-white shadow-md' 
                        : 'text-zinc-650 hover:text-zinc-950 hover:bg-zinc-50'
                    }`}
                    style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-700'}`} />
                      <div className="text-left min-w-0">
                        <span className="block truncate font-bold">{isRTL ? item.labelAr : item.labelEn}</span>
                        <span className={`text-[9px] block truncate font-medium ${isActive ? 'text-zinc-300' : 'text-zinc-400'}`}>
                          {isRTL ? item.descAr : item.descEn}
                        </span>
                      </div>
                    </div>
                    {item.badge !== null ? (
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${isActive ? 'bg-white text-zinc-950' : 'bg-red-100 text-red-605'}`}>
                        {item.badge}
                      </span>
                    ) : (
                      <ChevronRight className={`w-3.5 h-3.5 opacity-50 transition-transform ${isActive ? 'text-white translate-x-1' : 'text-zinc-400 group-hover:translate-x-1'} ${isRTL ? 'rotate-180' : ''}`} />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Mobile Dropdown Menu selection */}
            <div className="lg:hidden block">
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 px-1">
                {isRTL ? 'اختر الصفحة المطلوبة' : 'Switch Workspace View'}
              </label>
              <select
                value={subTab}
                onChange={(e) => setSubTab(e.target.value as DashboardTab)}
                className="w-full text-xs font-bold p-3 border border-zinc-200 rounded-xl bg-zinc-50/50"
              >
                {sidebarMenuItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {(isRTL ? item.labelAr : item.labelEn) + (item.badge ? ` (${item.badge})` : '')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Stats sidebar block */}
          <div className="bg-zinc-50 border border-zinc-200/85 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-650" />
              <span>{isRTL ? 'تكامل الهوية' : 'Identity Guard'}</span>
            </h4>
            <div className="space-y-2 text-[11px] text-zinc-500 leading-normal">
              <div>
                <span className="block font-medium">{isRTL ? 'ملفك النشط:' : 'Active Credential:'}</span>
                <span className="text-zinc-700 font-bold block truncate">{user.email}</span>
              </div>
              <div>
                <span className="block font-medium">{isRTL ? 'الترخيص والشركة:' : 'Authorized Co:'}</span>
                <span className="text-zinc-700 font-bold block">Explora Enterprise Client</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Content stage */}
        <div className="lg:col-span-3">
          
          {loading ? (
            <div className="bg-white border border-zinc-200 rounded-2xl p-20 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-zinc-200 border-t-zinc-950 rounded-full animate-spin" />
              <p className="text-xs text-zinc-400 font-medium">
                {isRTL ? 'جاري تجميع المؤشرات والرسائل الآمنة...' : 'Summoning metric computations and secured leads...'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* ANALYTICS VIEW */}
              {subTab === 'analytics' && analytics && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Line Chart Widget */}
                  <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                      <div>
                        <h3 className="text-sm font-bold text-zinc-900 leading-tight">
                          {isRTL ? 'نشاط مشاهدات الصفحة والتحويل' : 'Weekly Footprint & Convert Spike'}
                        </h3>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          {isRTL ? 'الزيارات اليومية مقارنة بإنشاء التذاكر و طلبات الدعم المباشر' : 'Tracking views spikes against absolute outbound leads generated'}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-800">
                        <TrendingUp className="w-3.5 h-3.5" />
                        +14.2%
                      </span>
                    </div>

                    <div className="w-full h-64 flex flex-col items-center justify-center relative">
                      <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#18181b" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#18181b" stopOpacity="0.01" />
                          </linearGradient>
                        </defs>

                        <line x1="0" y1="40" x2="500" y2="40" stroke="#f4f4f5" strokeWidth="1" />
                        <line x1="0" y1="80" x2="500" y2="80" stroke="#f4f4f5" strokeWidth="1" />
                        <line x1="0" y1="120" x2="500" y2="120" stroke="#f4f4f5" strokeWidth="1" />
                        <line x1="0" y1="160" x2="500" y2="160" stroke="#f4f4f5" strokeWidth="1" />

                        <path 
                          d="M 10 160 Q 91.6 128, 173.3 146 Q 255 120, 336.7 102 Q 418.3 80, 500 62 L 500 180 L 10 180 Z" 
                          fill="url(#chartGradient)" 
                        />

                        <path 
                          d="M 10 160 Q 91.6 128, 173.3 146 Q 255 120, 336.7 102 Q 418.3 80, 500 62" 
                          fill="none" 
                          stroke="#18181b" 
                          strokeWidth="3.5" 
                          strokeLinecap="round"
                        />

                        <path 
                          d="M 10 182 Q 91.6 168, 173.3 175 Q 255 150, 336.7 138 Q 418.3 115, 500 85" 
                          fill="none" 
                          stroke="#059669" 
                          strokeWidth="2" 
                          strokeDasharray="4 4"
                        />

                        <circle cx="336.7" cy="102" r="5" fill="#18181b" stroke="white" strokeWidth="2" />
                        <circle cx="500" cy="62" r="5" fill="#18181b" stroke="white" strokeWidth="2" />
                      </svg>

                      <div className="w-full border-t border-zinc-100 pt-3 flex justify-between px-2 text-[9px] font-mono text-zinc-400">
                        <span>MON</span>
                        <span>TUE</span>
                        <span>WED</span>
                        <span>THU</span>
                        <span>FRI</span>
                        <span>SAT</span>
                        <span>SUN (UTC)</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 border-t border-zinc-150 pt-4 text-center">
                      <div>
                        <span className="text-xs text-zinc-400 block">{isRTL ? 'إجمالي المشاهدات' : 'Global Views'}</span>
                        <span className="font-display font-bold text-lg text-zinc-950 block">4,610</span>
                      </div>
                      <div>
                        <span className="text-xs text-zinc-400 block">{isRTL ? 'طلبات الاتصال' : 'Outbound Leads'}</span>
                        <span className="font-display font-bold text-lg text-emerald-700 block">172</span>
                      </div>
                      <div>
                        <span className="text-xs text-zinc-400 block">{isRTL ? 'معدل التحويل' : 'Conversion Ratio'}</span>
                        <span className="font-display font-bold text-lg text-indigo-700 block">3.73%</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating split list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
                      <h3 className="text-xs font-bold text-zinc-900 border-b border-zinc-100 pb-3 mb-4 uppercase tracking-wider">
                        {isRTL ? 'توزيع التقييمات' : 'Rating Distribution'}
                      </h3>
                      <div className="space-y-3">
                        {analytics.ratingDistribution.map((item) => {
                          const maxCount = Math.max(...analytics.ratingDistribution.map(d => d.count));
                          const percent = maxCount ? (item.count / maxCount) * 100 : 0;
                          return (
                            <div key={item.rating} className="flex items-center gap-3 text-xs font-semibold">
                              <span className="w-3 flex items-center justify-end text-zinc-700">{item.rating}</span>
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                              <div className="flex-1 bg-zinc-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-zinc-900 h-full rounded-full" style={{ width: `${percent}%` }} />
                              </div>
                              <span className="w-6 text-zinc-400 text-right">{item.count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Operational timelines */}
                    <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-4">
                      <h3 className="text-xs font-bold text-zinc-900 border-b border-zinc-100 pb-3 uppercase tracking-wider">
                        {isRTL ? 'سجل العمليات الأخير' : 'Operations Log'}
                      </h3>
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {analytics.recentActivity.map((act) => (
                          <div key={act.id} className="flex gap-2.5 text-[11px] items-start">
                            <span className="w-1.5 h-1.5 bg-zinc-900 rounded-full mt-1.5 shrink-0" />
                            <div className="flex-1">
                              <p className="font-semibold text-zinc-750 line-clamp-2">
                                {isRTL ? act.messageAr : act.message}
                              </p>
                              <span className="text-[9px] text-zinc-400 font-medium block mt-0.5">{act.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* DIRECT INQUIRIES MAILBOX */}
              {subTab === 'inquiries' && (
                <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden animate-fade-in">
                  <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
                    <h3 className="text-sm font-bold text-zinc-900 mb-0.5">
                      {isRTL ? 'استمارات الاستعلام وطلبات العملاء' : 'Active Customer Leads & Contacts'}
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-medium font-normal">
                      {isRTL ? 'قائمة الطلبات ورسائل البريد المباشرة من المهتمين بقائمتك' : 'Messages routed directly from visitors viewing your business listings on the platform'}
                    </p>
                  </div>

                  {inquiries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-16 text-center text-zinc-400 space-y-2">
                      <Inbox className="w-10 h-10 text-zinc-300" />
                      <p className="text-xs font-medium">
                        {isRTL ? 'لا توجد رسائل واردة حالياً.' : 'No active inquiries received yet.'}
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-zinc-100">
                      {inquiries.map((inq) => (
                        <div key={inq.id} className="p-6 hover:bg-zinc-50/60 transition-colors flex flex-col md:flex-row gap-4 justify-between">
                          <div className="space-y-1 bg-white md:bg-transparent p-4 md:p-0 rounded-xl border border-zinc-100 md:border-transparent flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-zinc-900">{inq.senderName}</span>
                              <span className="w-1 h-1 rounded-full bg-zinc-300" />
                              <span className="text-[10px] font-semibold text-zinc-400">{inq.senderEmail}</span>
                            </div>
                            <div className="text-[10.5px] font-semibold text-indigo-700 flex items-center gap-1">
                              <Building2 className="w-3.5 h-3.5" />
                              <span>{inq.businessName}</span>
                            </div>
                            <p className="text-xs text-zinc-650 font-normal leading-relaxed pt-2">
                              {inq.message}
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <span className="text-[10px] text-zinc-400 font-medium font-mono">{inq.date}</span>
                            <div className="flex gap-1.5">
                              <a 
                                href={`mailto:${inq.senderEmail}?subject=Re: ${inq.businessName} inquiry`}
                                className="bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-[10px] px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                              >
                                <Mail className="w-3 h-3" />
                                {isRTL ? 'الرد بالبريد' : 'Email Reply'}
                              </a>
                              <button 
                                onClick={() => {
                                  onSuccess(
                                    `Lead entry acknowledged for ${inq.senderName}`,
                                    `تم تأكيد وقبول استمارة المتابعة لـ ${inq.senderName}`
                                  );
                                  setInquiries((prev) => prev.filter(i => i.id !== inq.id));
                                }}
                                className="bg-white border border-zinc-200 hover:border-zinc-800 text-zinc-650 hover:text-zinc-900 font-semibold text-[10px] px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                {isRTL ? 'أرشفة' : 'Archive'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* POST LISTING ADMISSION FORM */}
              {subTab === 'add-listing' && (
                <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm max-w-3xl mx-auto space-y-6 animate-fade-in">
                  <div>
                    <h3 className="text-base font-bold text-zinc-900">
                      {isRTL ? 'تفاصيل تقديم المنشأة الجديدة' : 'Register New Business Coordinates'}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5 font-normal">
                      {isRTL ? 'املأ التفاصيل باللغتين العربية والانجليزية لضمان تدوير القوائم الذكية بالمنصة' : 'Fill details in English and Arabic to ensure correct dynamic layout flipping'}
                    </p>
                  </div>

                  <form onSubmit={handleCreateListing} className="space-y-5">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10.5px] font-bold text-zinc-500 block mb-1">
                          {isRTL ? 'الاسم التجاري (إنجليزي)' : 'Commercial Name (EN)'}
                        </label>
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Apex Tech Cowork"
                          className="w-full p-2.5 border border-zinc-200 rounded-xl text-xs bg-zinc-50/50 focus:outline-none focus:border-zinc-850"
                        />
                      </div>

                      <div>
                        <label className="text-[10.5px] font-bold text-zinc-500 block mb-1">
                          {isRTL ? 'الاسم التجاري بالكامل (عربي)' : 'Commercial Name (AR)'}
                        </label>
                        <input
                          type="text"
                          required
                          value={titleAr}
                          onChange={(e) => setTitleAr(e.target.value)}
                          placeholder="إيبكس للعمل المشترك"
                          className="w-full p-2.5 border border-zinc-200 rounded-xl text-xs bg-zinc-50/50 focus:outline-none focus:border-zinc-850 text-right"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10.5px] font-bold text-zinc-500 block mb-1">
                          {isRTL ? 'القطاع والمجال' : 'Industry Segment'}
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full p-2.5 border border-zinc-200 rounded-xl text-xs bg-zinc-50/50 focus:outline-none focus:border-zinc-850 font-semibold"
                        >
                          <option value="tech">{isRTL ? 'التقنية والعمل المشترك' : 'Tech & Cowork'}</option>
                          <option value="restaurants">{isRTL ? 'المطاعم والطهي' : 'Restaurants & Bistro'}</option>
                          <option value="healthcare">{isRTL ? 'الصحة والعافية' : 'Healthcare'}</option>
                          <option value="hotels">{isRTL ? 'الفنادق والأجنحة' : 'Hotels & Suites'}</option>
                          <option value="retail">{isRTL ? 'التصميم والتجزئة' : 'Retail'}</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10.5px] font-bold text-zinc-500 block mb-1">
                          {isRTL ? 'الفئة السعرية' : 'Pricing Tier'}
                        </label>
                        <select
                          value={priceLevel}
                          onChange={(e) => setPriceLevel(e.target.value as '$' | '$$' | '$$$' | '$$$$')}
                          className="w-full p-2.5 border border-zinc-200 rounded-xl text-xs bg-zinc-50/50 focus:outline-none focus:border-zinc-850 font-semibold"
                        >
                          <option value="$">$ - Budget Friendly</option>
                          <option value="$$">$$ - Mid-range</option>
                          <option value="$$$">$$$ - Premium</option>
                          <option value="$$$$">$$$$ - Elite Luxury</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10.5px] font-bold text-zinc-500 block mb-1">
                          {isRTL ? 'المنطقة الحضرية' : 'Target District'}
                        </label>
                        <select
                          value={location}
                          onChange={(e) => {
                            setLocation(e.target.value);
                            const mapAr: Record<string, string> = {
                              'Silicon District': 'منطقة السيليكون',
                              'Old Port District': 'حي الميناء القديم',
                              'Marinaside': 'مرسى دبي',
                              'Waterfront': 'المنطقة المائية'
                            };
                            setLocationAr(mapAr[e.target.value] || e.target.value);
                          }}
                          className="w-full p-2.5 border border-zinc-200 rounded-xl text-xs bg-zinc-50/50 focus:outline-none focus:border-zinc-850 font-semibold"
                        >
                          <option value="Silicon District">Silicon District</option>
                          <option value="Old Port District">Old Port District</option>
                          <option value="Marinaside">Marinaside</option>
                          <option value="Waterfront">Waterfront</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10.5px] font-bold text-zinc-500 block mb-1">
                          {isRTL ? 'العنوان الجغرافي (إنجليزي)' : 'Full Address (EN)'}
                        </label>
                        <input
                          type="text"
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="102 Horizon Boulevard, Tech District"
                          className="w-full p-2.5 border border-zinc-200 rounded-xl text-xs bg-zinc-50/50 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10.5px] font-bold text-zinc-500 block mb-1">
                          {isRTL ? 'العنوان الجغرافي (عربي)' : 'Full Address (AR)'}
                        </label>
                        <input
                          type="text"
                          required
                          value={addressAr}
                          onChange={(e) => setAddressAr(e.target.value)}
                          placeholder="١٠٢ جادة الأفق، حي التقنية"
                          className="w-full p-2.5 border border-zinc-200 rounded-xl text-xs bg-zinc-50/50 focus:outline-none text-right"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10.5px] font-bold text-zinc-500 block mb-1">
                          {isRTL ? 'رقم الهاتف' : 'Contact Phone'}
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+971 4 555 4567"
                          className="w-full p-2.5 border border-zinc-200 rounded-xl text-xs bg-zinc-50/50 focus:outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[10.5px] font-bold text-zinc-500 block mb-1">
                          {isRTL ? 'موقع النطاق الإلكتروني' : 'Website Domain'}
                        </label>
                        <input
                          type="url"
                          required
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="https://company.example.com"
                          className="w-full p-2.5 border border-zinc-200 rounded-xl text-xs bg-zinc-50/50 focus:outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[10.5px] font-bold text-zinc-500 block mb-1">
                          {isRTL ? 'البريد الإلكتروني للإشعارات' : 'Notification Email'}
                        </label>
                        <input
                          type="email"
                          required
                          value={emailMsg}
                          onChange={(e) => setEmailMsg(e.target.value)}
                          placeholder="leads@company.com"
                          className="w-full p-2.5 border border-zinc-200 rounded-xl text-xs bg-zinc-50/50 focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10.5px] font-bold text-zinc-500 block mb-1">
                        {isRTL ? 'عنوان صورة الغلاف (Unsplash URL)' : 'Cover Image Link (Unsplash Pattern)'}
                      </label>
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab..."
                        className="w-full p-2.5 border border-zinc-200 rounded-xl text-xs bg-zinc-50/50 focus:outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-[10.5px] font-bold text-zinc-500 block mb-1">
                          {isRTL ? 'سرود الوصف التجاري (إنجليزي)' : 'Commercial Narrative Description (EN)'}
                        </label>
                        <textarea
                          required
                          value={desc}
                          onChange={(e) => setDesc(e.target.value)}
                          placeholder="Describe architectural parameters, features, products..."
                          className="w-full h-24 p-2.5 border border-zinc-200 rounded-xl text-xs bg-zinc-50/50 focus:outline-none resize-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10.5px] font-bold text-zinc-500 block mb-1">
                          {isRTL ? 'وصف تفصيلي للشركة (عربي)' : 'Commercial Narrative Description (AR)'}
                        </label>
                        <textarea
                          required
                          value={descAr}
                          onChange={(e) => setDescAr(e.target.value)}
                          placeholder="اكتب وصفاً جذاباً للشركة وتجهيزاتها المتكاملة هنا بالتفصيل..."
                          className="w-full h-24 p-2.5 border border-zinc-200 rounded-xl text-xs bg-zinc-50/50 focus:outline-none text-right resize-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-zinc-950/20"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>{submitting ? 'Drafting Listing...' : (isRTL ? 'حفظ ونشر قائمتك المقترحة' : 'Publish Proposal Listing')}</span>
                    </button>
                  </form>
                </div>
              )}

              {/* SETTINGS (Mock Empty State) */}
              {subTab === 'settings' && (
                <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 space-y-6 animate-fade-in text-zinc-805">
                  <div className="border-b border-zinc-100 pb-4">
                    <h3 className="text-base font-bold text-zinc-900">
                      {isRTL ? 'إعدادات المنصة والملف' : 'Platform & Corporate Settings'}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      {isRTL ? 'تهيئة وتفويض حسابك الفردي وتتبع اتصالات الهاتف المحمول والبريد' : 'Modify default lead behaviors, workspace layouts, and simulated alerts.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                      
                      <div className="flex items-start justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-200/60">
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-zinc-800 block">
                            {isRTL ? 'القبول التلقائي للعملاء' : 'Instant Leads Routing'}
                          </span>
                          <span className="text-[10px] text-zinc-400 block leading-normal">
                            {isRTL ? 'توجيه طلبات استفسار العملاء مباشرة إلى صندوق الوارد دون تدقيق مسبق' : 'Route visitor inquiries instantly to your inbox without validation filters.'}
                          </span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setAllowInstantInquiries(!allowInstantInquiries)}
                          className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none shrink-0 cursor-pointer ${allowInstantInquiries ? 'bg-zinc-950' : 'bg-zinc-200'}`}
                        >
                          <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${allowInstantInquiries ? 'translate-x-5' : ''}`} />
                        </button>
                      </div>

                      <div className="flex items-start justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-200/60">
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-zinc-800 block">
                            {isRTL ? 'إشعارات الرسائل القصيرة (SMS)' : 'SMS Lead Notification Alert'}
                          </span>
                          <span className="text-[10px] text-zinc-400 block leading-normal">
                            {isRTL ? 'إرسال محاكاة لرسائل SMS عند استلام العميل بريد تتبع جديد لمقر عملك' : 'Send simulated text messages upon receiving brand-new organic customer profiles.'}
                          </span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setSmsLeadsAlerts(!smsLeadsAlerts)}
                          className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none shrink-0 cursor-pointer ${smsLeadsAlerts ? 'bg-zinc-950' : 'bg-zinc-200'}`}
                        >
                          <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${smsLeadsAlerts ? 'translate-x-5' : ''}`} />
                        </button>
                      </div>

                      <div className="flex items-start justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-200/60">
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-zinc-800 block">
                            {isRTL ? 'مشاركة الإحصاءات علنياً' : 'Public Metric Analytics Sharing'}
                          </span>
                          <span className="text-[10px] text-zinc-400 block leading-normal">
                            {isRTL ? 'السماح للشركاء الآخرين بمطالعة نسبة رضا عملائك لتحسين الترتيب' : 'Allow trusted local competitors to view global metrics to compare segments.'}
                          </span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setPublicMetricShare(!publicMetricShare)}
                          className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none shrink-0 cursor-pointer ${publicMetricShare ? 'bg-zinc-950' : 'bg-zinc-200'}`}
                        >
                          <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${publicMetricShare ? 'translate-x-5' : ''}`} />
                        </button>
                      </div>

                    </div>

                    <div className="space-y-4 bg-zinc-50 p-4 border border-zinc-200 rounded-2xl">
                      <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block border-b border-zinc-200 pb-2 mb-2">
                        {isRTL ? 'الصلاحيات الأمنية' : 'Security Parameters'}
                      </h4>
                      
                      <div className="space-y-2.5">
                        <div>
                          <span className="text-[10px] font-bold text-zinc-650 block mb-1">
                            {isRTL ? 'مفتاح رمز الوصول (API Key)' : 'Simulator Token Key'}
                          </span>
                          <div className="bg-white border border-zinc-200 px-3 py-2 rounded-xl text-[10px] font-mono select-all flex items-center justify-between">
                            <span className="truncate mr-2">exp_sec_9948x8872...</span>
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded shrink-0">active</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onSuccess('API token rotated in memory!', 'تم تدوير رمز الـ API بنجاح في ذاكرة المحاكاة!')}
                          className="w-full py-2 bg-zinc-900 text-white rounded-lg text-[10px] font-bold tracking-wider hover:bg-zinc-800 cursor-pointer"
                        >
                          {isRTL ? 'تحديث كود التوكن' : 'Re-Generate API Token'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-orange-850">
                        {isRTL ? 'طاولة محاكاة التطبيق المحدودة' : 'Simulator Constraint Notice'}
                      </h4>
                      <p className="text-[11px] text-orange-600 leading-normal mt-1 font-normal">
                        {isRTL 
                          ? 'أنت تعمل حالياً داخل بيئة تطوير آمنة ومغلقة (Explora Sandbox). يتم تخزين جميع إعداداتك ومقترحاتك محلياً بشكل مؤقت.' 
                          : 'Corporate configs are processed within pre-provisioned developer scopes. Values persist inside active client container memory.'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 text-right">
                    <button
                      onClick={() => onSuccess('All platform settings saved.', 'تم حفظ الإعدادات بنجاح في الذاكرة المحلية.')}
                      className="px-5 py-2.5 bg-zinc-950 hover:bg-zinc-850 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                    >
                      {isRTL ? 'حفظ التغييرات' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}

              {/* BILLING (Mock Empty State) */}
              {subTab === 'billing' && (
                <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 space-y-6 animate-fade-in text-zinc-800">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                    <div>
                      <h3 className="text-base font-bold text-zinc-900">
                        {isRTL ? 'الاشتراكات وحزم الفوترة' : 'Subscriptions & Account Billing'}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1">
                        {isRTL ? 'تتبع اشتراكك الحالي وتكاليف الحملات الترويجية والتقدير المالي' : 'Evaluate active promotion campaigns, enterprise limits, and invoices.'}
                      </p>
                    </div>
                    <span className="text-xs bg-zinc-100 px-3 py-1 rounded-xl text-zinc-650 font-bold border border-zinc-200">
                      {isRTL ? 'خطة المحاكاة المجانية' : 'SANDBOX DEV FREE'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-5 border border-zinc-200 rounded-2xl bg-zinc-50 space-y-3">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                        {isRTL ? 'حدود البيانات المجانية' : 'Free Workspace Limits'}
                      </span>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>{isRTL ? 'المنشآت النشطة' : 'Corporate Records'}</span>
                          <span>1 / 3</span>
                        </div>
                        <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-zinc-900 h-full w-1/3" />
                        </div>
                        <div className="flex justify-between text-xs font-semibold pt-1">
                          <span>{isRTL ? 'استمارات تواصل العملاء' : 'Leads Limit'}</span>
                          <span>{inquiries.length} / 50</span>
                        </div>
                        <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-zinc-900 h-full" style={{ width: `${(inquiries.length / 50) * 100}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="p-5 border border-zinc-800 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 text-white space-y-3 shadow-md md:col-span-2 relative overflow-hidden">
                      <div className="space-y-1.5 z-10 relative">
                        <span className="text-[9px] font-bold text-amber-405 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded uppercase tracking-wider">
                          {isRTL ? 'ترقية للشركات الكبرى' : 'Enterprise Growth Segment'}
                        </span>
                        <h4 className="font-display font-bold text-sm">
                          {isRTL ? 'باقة إكسبلور بريميوم الشاملة' : 'Explora Premium Business Tier'}
                        </h4>
                        <p className="text-[11px] text-zinc-300 leading-relaxed font-normal">
                          {isRTL 
                            ? 'افتح إمكانات بحث لامتناهية بمدينتك، دمج خرائط جوجل المتقدمة تلقائياً، تتبع المشاهدات بالساعة، وحصل على الدفع الآمن فورا بـ ٤٩ دولار فقط شهرياً.' 
                            : 'Unlock infinite commercial listings, premium Google Maps integrations, hourly analytics charts, and live customer booking tools for $49/mo.'
                          }
                        </p>
                      </div>

                      <button
                        onClick={() => onSuccess('Payment gateway integration will launch in a future update.', 'سيتم دمج بوابة الدفع السحابية في التحديثات القادمة.')}
                        className="py-2.5 px-4 bg-white text-zinc-950 font-bold text-xs rounded-xl hover:bg-zinc-100 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <span>{isRTL ? 'ترقية حسابي الآن' : 'Initiate Upgrade Order'}</span>
                        <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-zinc-900 px-1">
                      {isRTL ? 'سجل عمليات ووصولات الدفع الحالية' : 'Historical Transaction Logs'}
                    </h4>

                    <div className="border border-zinc-200 rounded-2xl overflow-hidden divide-y divide-zinc-100">
                      {[
                        { id: 'tx_001', date: 'May 2026', desc: 'Explora Sandbox Node Setup Token (Simulated)', amount: '$0.00', status: 'PAID' },
                        { id: 'tx_002', date: 'April 2026', desc: 'Explorer Listing Index Authorization (Simulated)', amount: '$0.00', status: 'PAID' }
                      ].map((tx) => (
                        <div key={tx.id} className="p-4 flex items-center justify-between text-xs bg-zinc-50/50">
                          <div>
                            <span className="font-bold text-zinc-800 block">{tx.desc}</span>
                            <span className="text-[10px] text-zinc-400 font-medium block mt-0.5 font-mono">{tx.id} • {tx.date}</span>
                          </div>
                          <div className="text-right flex items-center gap-3">
                            <span className="font-bold text-zinc-900">{tx.amount}</span>
                            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                              {tx.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SUPPORT HUB (Mock Empty State) */}
              {subTab === 'support' && (
                <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 space-y-6 animate-fade-in text-zinc-800">
                  <div className="border-b border-zinc-100 pb-4">
                    <h3 className="text-base font-bold text-zinc-900">
                      {isRTL ? 'مركز المساعدة والدعم المباشر للشركاء' : 'Direct Workspace Support Hub'}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      {isRTL ? 'افتح تذاكر فنية لمراجعة مشكلات الظهور ومزامنة البيانات مع مهندسينا' : 'File high-contrast technical tickets directly to Explora system reviewers.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <form onSubmit={handleSupportTicketSubmit} className="md:col-span-2 space-y-4">
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10.5px] font-bold text-zinc-500 block mb-1">
                            {isRTL ? 'تصنيف نطاق المشكلة' : 'Issue Segment Area'}
                          </label>
                          <select
                            value={supportCategory}
                            onChange={(e) => setSupportCategory(e.target.value)}
                            className="w-full p-2.5 border border-zinc-200 rounded-xl text-xs bg-zinc-50/50 focus:outline-none font-semibold"
                          >
                            <option value="listing_issue">{isRTL ? 'تعديل أو تصحيح منشأة' : 'Listing Corrections'}</option>
                            <option value="review_dispute">{isRTL ? 'نزاع على تقييم عميل' : 'Customer Review Dispute'}</option>
                            <option value="billing_tier">{isRTL ? 'استفسارات مالية و ترقية' : 'Billing or Upgrade limits'}</option>
                            <option value="bugs">{isRTL ? 'خلل واجهة أو خطأ برمجي' : 'Software UI bug report'}</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10.5px] font-bold text-zinc-500 block mb-1">
                            {isRTL ? 'موضوع التذكرة' : 'Ticket Subject Line'}
                          </label>
                          <input
                            type="text"
                            required
                            value={supportSubject}
                            onChange={(e) => setSupportSubject(e.target.value)}
                            placeholder={isRTL ? 'مثال: مشكلة في تعديل خطة العمل' : 'e.g., Working hour synchronization delay'}
                            className="w-full p-2.5 border border-zinc-200 rounded-xl text-xs bg-zinc-50/50 focus:outline-none focus:border-zinc-850"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10.5px] font-bold text-zinc-500 block mb-1">
                          {isRTL ? 'تفاصيل رسالة الدعم' : 'Descriptive Ticket Message'}
                        </label>
                        <textarea
                          required
                          value={supportMessage}
                          onChange={(e) => setSupportMessage(e.target.value)}
                          placeholder={isRTL ? 'اكتب بالتفصيل المشكلة أو الدعم الفني المطلوب مراجعته...' : 'Describe specifically how system engineers may help you address listing updates...'}
                          className="w-full h-28 p-2.5 border border-zinc-200 rounded-xl text-xs bg-zinc-50/50 focus:outline-none resize-none focus:border-zinc-850"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={sendingSupport}
                        className="w-full py-3 bg-zinc-950 hover:bg-zinc-850 disabled:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>{sendingSupport ? (isRTL ? 'جاري الإرسال...' : 'Filing Ticket Log...') : (isRTL ? 'إرسال تذكرة الدعم' : 'Open Ticket Log')}</span>
                      </button>

                    </form>

                    <div className="space-y-4 bg-zinc-50 p-5 border border-zinc-200 rounded-2xl">
                      <h4 className="text-xs font-bold text-zinc-900 border-b border-zinc-200 pb-2">
                        {isRTL ? 'تساؤلات شائعة سريعة' : 'Instant Help Segment'}
                      </h4>

                      <div className="space-y-3.5 text-[11px] leading-relaxed text-zinc-500">
                        <div>
                          <span className="font-bold text-zinc-800 block mb-1">
                            {isRTL ? 'كم يستغرق مراجعة الطلبات؟' : 'How long takes validation?'}
                          </span>
                          <span>
                            {isRTL 
                              ? 'عادة يتم مراجعة المنشآت الجديدة وتحديثاتها المسجلة خلال ٢٤ إلى ٤٨ ساعة عمل كحد أقصى.' 
                              : 'Corporate reviews are executed within 24h by structural platform moderators.'
                            }
                          </span>
                        </div>

                        <div>
                          <span className="font-bold text-zinc-800 block mb-1">
                            {isRTL ? 'هل يمكن تدويل لغات المنشأة؟' : 'How does RTL flipping work?'}
                          </span>
                          <span>
                            {isRTL 
                              ? 'ندعم التوطين الفوري للغات بنسبة ١٠٠٪. فقط ضع نصوصك بالاتجاهين لتدور مع واجهة العميل بسلاسة.' 
                              : 'Your listings flip according to high fidelity CSS directions dynamically. Simply fill variables cleanly.'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
