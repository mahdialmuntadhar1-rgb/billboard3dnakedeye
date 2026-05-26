/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BusinessesService } from '../services/businesses';
import { 
  X, 
  MapPin, 
  Phone, 
  Globe, 
  Mail, 
  Star, 
  ShieldCheck, 
  Check, 
  Send, 
  Calendar, 
  Sparkles,
  ChevronRight,
  Eye,
  Info
} from 'lucide-react';
import { Business, Review, Language, WorkingHours } from '../types';

interface DetailViewProps {
  business: Business;
  onClose: () => void;
  lang: Language;
  onSuccess: (msg: string, msgAr: string) => void;
  onOpenAuth: () => void;
}

export const DetailView: React.FC<DetailViewProps> = ({ 
  business, 
  onClose, 
  lang, 
  onSuccess,
  onOpenAuth
}) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeImage, setActiveImage] = useState(business.image);
  
  // Review submission state
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Inquiry submission state
  const [inqName, setInqName] = useState(user ? user.name : '');
  const [inqEmail, setInqEmail] = useState(user ? user.email : '');
  const [inqMessage, setInqMessage] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  const isRTL = lang === 'ar' || lang === 'ku';

  useEffect(() => {
    // Sync active image with business changes
    setActiveImage(business.image);
    // Load reviews
    const loadReviews = async () => {
      const data = await BusinessesService.fetchReviews(business.id);
      setReviews(data);
    };
    loadReviews();
  }, [business]);

  // Sync user information when login state updates
  useEffect(() => {
    if (user) {
      setInqName(user.name);
      setInqEmail(user.email);
    }
  }, [user]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }
    if (!revComment.trim()) return;

    setSubmittingReview(true);
    try {
      const created = await BusinessesService.submitReview(business.id, user.name, revRating, revComment);
      setReviews((prev) => [created, ...prev]);
      setRevComment('');
      onSuccess(
        'Review logged! Rating score recalculated.',
        'تم تسجيل تقييمك بنجاح! جاري تحديث معدلات القياس.'
      );
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inqEmail || !inqMessage) return;

    setSubmittingInquiry(true);
    try {
      await BusinessesService.submitInquiry(business.id, inqName, inqEmail, inqMessage);
      setInqMessage('');
      onSuccess(
        'Your inquiries have been pushed directly to the dashboard!',
        'تم إرسال استفسارك مباشرةً لمالك المنشأة!'
      );
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingInquiry(false);
    }
  };

  const getDayLabel = (day: keyof WorkingHours) => {
    const map: Record<string, { en: string; ar: string; ku: string }> = {
      monday: { en: 'Monday', ar: 'الأثنين', ku: 'دووشەممە' },
      tuesday: { en: 'Tuesday', ar: 'الثلاثاء', ku: 'سێشەممە' },
      wednesday: { en: 'Wednesday', ar: 'الأربعاء', ku: 'چوارشەممە' },
      thursday: { en: 'Thursday', ar: 'الخميس', ku: 'پێنجشەممە' },
      friday: { en: 'Friday', ar: 'الجمعة', ku: 'هەینی' },
      saturday: { en: 'Saturday', ar: 'السبت', ku: 'شەممە' },
      sunday: { en: 'Sunday', ar: 'الأحد', ku: 'یەکشەممە' }
    };
    return lang === 'en' ? map[day].en : (lang === 'ar' ? map[day].ar : map[day].ku);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Background overlay */}
      <div className="absolute inset-0 bg-zinc-950/65 backdrop-blur-sm" onClick={onClose} />

      {/* Slide-out Panel */}
      <div className="relative w-full max-w-4xl bg-stone-50 h-full flex flex-col shadow-2xl z-10 animate-fade-in overflow-hidden">
        
        {/* Panel Header */}
        <div className="sticky top-0 bg-white border-b border-zinc-200/60 px-6 py-4 flex items-center justify-between z-20 shadow-sm shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-400 tracking-wider">
              {lang === 'en' ? 'PLATFORM INSIGHTS' : (lang === 'ar' ? 'تفاصيل المنشأة' : 'زانیارییەکانی کارەکە')}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
            <span className="text-xs font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded uppercase tracking-widest">
              {business.priceLevel}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-3 border border-zinc-200 hover:border-zinc-800 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-zinc-50 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>{lang === 'en' ? 'Close' : (lang === 'ar' ? 'إغلاق' : 'داخستن')}</span>
          </button>
        </div>

        {/* Scrolling Workspace Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          
          {/* Main Visual Carousel Box */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Extended view */}
            <div className="lg:col-span-3 aspect-video relative rounded-2xl overflow-hidden border border-zinc-200/65 bg-zinc-100">
              <img 
                src={activeImage} 
                alt={lang === 'en' ? business.name : (lang === 'ar' ? business.nameAr : (business.nameKu || business.name))}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-zinc-950/70 text-white backdrop-blur-md px-4 py-3 rounded-xl flex items-center justify-between z-15">
                <div>
                  <h2 className="text-lg font-display font-medium tracking-tight">
                    {lang === 'en' ? business.name : (lang === 'ar' ? business.nameAr : (business.nameKu || business.name))}
                  </h2>
                  <p className="text-[11px] text-zinc-350">{lang === 'en' ? business.location : (lang === 'ar' ? business.locationAr : (business.locationKu || business.location))}</p>
                </div>
                {business.isVerified && (
                  <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 text-xs font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'en' ? 'Verified' : (lang === 'ar' ? 'موثق' : 'سەلمێنراو')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Gallery selections */}
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-2 lg:h-full">
              {[business.image, ...business.gallery].slice(0, 3).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`relative rounded-xl overflow-hidden border transition-all cursor-pointer h-20 lg:h-24 ${
                    activeImage === img ? 'ring-2 ring-zinc-950 border-transparent' : 'border-zinc-200 hover:border-zinc-400'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`Preview ${i}`} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Grid Splitting: Details vs Inquiry */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Col (Detailed Info): SPAN 7 */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Main Description */}
              <div className="space-y-3">
                <h3 className="font-display font-bold text-zinc-900 border-b border-zinc-200/50 pb-2">
                  {lang === 'en' ? 'About the Business' : (lang === 'ar' ? 'عن المنشأة' : 'دەربارەی کارەکە')}
                </h3>
                <p className="text-sm text-zinc-650 leading-relaxed font-normal">
                  {lang === 'en' ? business.description : (lang === 'ar' ? business.descriptionAr : (business.descriptionKu || business.description))}
                </p>
              </div>

              {/* Attributes amenities */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">
                  {lang === 'en' ? 'Available Amenities' : (lang === 'ar' ? 'التجهيزات المتاحة' : 'ئاسانکارییە بەردەستەکان')}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {(lang === 'en' ? business.amenities : (lang === 'ar' ? business.amenitiesAr : (business.amenitiesKu || business.amenities))).map((amenity, i) => (
                    <span 
                      key={i}
                      className="inline-flex items-center gap-1.5 bg-white border border-zinc-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-700"
                    >
                      <Check className="w-3.5 h-3.5 text-zinc-500" />
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reviews Stack */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                  <h3 className="font-display font-bold text-zinc-900">
                    {lang === 'en' ? 'Explorer Reviews' : (lang === 'ar' ? 'مراجعات المجتمع' : 'ڕاوبۆچوونی بەکارهێنەران')}
                  </h3>
                  <div className="flex items-center gap-1.5 bg-zinc-900 text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-305" />
                    <span>{business.rating}</span>
                    <span className="text-zinc-400 text-[10px] font-normal">({reviews.length})</span>
                  </div>
                </div>

                {/* Submit New Review Form */}
                <form onSubmit={handleReviewSubmit} className="bg-white border border-zinc-200 rounded-2xl p-4 space-y-4 shadow-sm">
                  <span className="text-xs font-bold text-zinc-600 block">
                    {isRTL ? 'كتابة مراجعة جديدة' : 'Add Your Experience'}
                  </span>
                  
                  {/* Score selection */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((stars) => (
                      <button
                        type="button"
                        key={stars}
                        onClick={() => setRevRating(stars)}
                        className="p-1 cursor-pointer transition-transform hover:scale-110"
                      >
                        <Star className={`w-6 h-6 ${stars <= revRating ? 'fill-amber-400 text-amber-405' : 'text-zinc-200'}`} />
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <textarea
                      required
                      value={revComment}
                      onChange={(e) => setRevComment(e.target.value)}
                      placeholder={
                        user 
                          ? (isRTL ? 'اكتب تعليقك الحقيقي هنا...' : 'Leave a detailed explorer comment...') 
                          : (isRTL ? 'الرجاء تسجيل الدخول لكتابة تعليق' : 'Sign in to add a review')
                      }
                      disabled={!user}
                      className="w-full h-24 p-3 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-800 text-xs bg-zinc-50/50 resize-none disabled:bg-zinc-100 disabled:text-zinc-400"
                    />
                    
                    <button
                      type="submit"
                      disabled={submittingReview || !user}
                      className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Send className="w-3 h-3" />
                      {submittingReview ? '...' : (isRTL ? 'إرسال المراجعة' : 'Push Review')}
                    </button>
                  </div>
                </form>

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <p className="text-xs text-zinc-400 italic text-center py-4">
                      {isRTL ? 'لا توجد مراجعات لهذه المنشأة حتى الآن.' : 'No reviews logged yet. Be the first!'}
                    </p>
                  ) : (
                    reviews.map((rev) => (
                      <div key={rev.id} className="bg-white border border-zinc-150 rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <img src={rev.userAvatar} alt={rev.userName} className="w-7 h-7 rounded-full bg-zinc-100 object-cover" referrerPolicy="no-referrer" />
                            <div>
                              <span className="text-xs font-semibold text-zinc-800 block">{rev.userName}</span>
                              <span className="text-[10px] text-zinc-400 font-medium block">{rev.date}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-0.5 bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded-lg">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-bold text-zinc-700">{rev.rating}</span>
                          </div>
                        </div>
                        <p className="text-xs text-zinc-650 leading-relaxed font-normal">
                          {lang === 'en' ? rev.comment : (lang === 'ar' && rev.commentAr ? rev.commentAr : (rev.commentKu || rev.commentAr || rev.comment))}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Col (Inquiry & Hours): SPAN 5 */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Working Hours Sheet */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-4 shadow-sm">
                <h4 className="font-display font-medium text-sm text-zinc-900 flex items-center gap-2 border-b border-zinc-100 pb-3">
                  <Calendar className="w-4 h-4 text-zinc-500" />
                  {lang === 'en' ? 'Operational Hours' : (lang === 'ar' ? 'ساعات العمل' : 'کاتەکانی کارکردن')}
                </h4>
                
                <div className="space-y-2">
                  {Object.keys(business.workingHours).map((day) => {
                    const hoursVal = lang === 'en' 
                      ? business.workingHours[day as keyof WorkingHours] 
                      : (lang === 'ar' ? business.workingHoursAr[day as keyof WorkingHours] : (business.workingHoursKu?.[day as keyof WorkingHours] || business.workingHoursAr[day as keyof WorkingHours] || business.workingHours[day as keyof WorkingHours]));
                    return (
                      <div key={day} className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 font-medium">{getDayLabel(day as keyof WorkingHours)}</span>
                        <span className="text-zinc-950 font-semibold">{hoursVal}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Lead Inquiry Direct Contact Form */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-4 shadow-sm">
                <h4 className="font-display font-medium text-sm text-zinc-900 flex items-center gap-2 border-b border-zinc-100 pb-3">
                  <Mail className="w-4 h-4 text-zinc-500" />
                  {lang === 'en' ? 'Immediate Lead Inquiry' : (lang === 'ar' ? 'إستفسار أو حجز مباشر' : 'ناردنی داواکاری ڕاستەوخۆ')}
                </h4>
                
                <form onSubmit={handleInquirySubmit} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 block mb-1">
                      {lang === 'en' ? 'Your Name' : (lang === 'ar' ? 'الاسم بالكامل' : 'ناوی تەواو')}
                    </label>
                    <input
                      type="text"
                      required
                      value={inqName}
                      onChange={(e) => setInqName(e.target.value)}
                      placeholder={lang === 'en' ? 'Karim Al-Obeid' : (lang === 'ar' ? 'كريم العبيد' : 'کاروان ئەحمەد')}
                      className="w-full p-2.5 border border-zinc-200 rounded-xl text-xs bg-zinc-50/50 focus:outline-none focus:border-zinc-800"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 block mb-1">
                      {lang === 'en' ? 'Destination Response Email' : (lang === 'ar' ? 'البريد الإلكتروني للرد' : 'ئیمەیڵی پەیوەندی')}
                    </label>
                    <input
                      type="email"
                      required
                      value={inqEmail}
                      onChange={(e) => setInqEmail(e.target.value)}
                      placeholder="reply@domain.com"
                      className="w-full p-2.5 border border-zinc-200 rounded-xl text-xs bg-zinc-50/50 focus:outline-none focus:border-zinc-800"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 block mb-1">
                      {lang === 'en' ? 'What are you inquiring?' : (lang === 'ar' ? 'تفاصيل طلبك' : 'چی دەپرسی؟')}
                    </label>
                    <textarea
                      required
                      value={inqMessage}
                      onChange={(e) => setInqMessage(e.target.value)}
                      placeholder={lang === 'en' ? 'Describe package options, dates, custom volume queries...' : (lang === 'ar' ? 'اكتب تفاصيل حجزك، أو استفسارك هنا...' : 'وردەکاری داواکاری یاخود پرسیارەکەت بنووسە...')}
                      className="w-full h-24 p-2.5 border border-zinc-200 rounded-xl text-xs bg-zinc-50/50 focus:outline-none focus:border-zinc-800 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingInquiry}
                    className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold transition-all shadow shadow-zinc-900/10 flex items-center justify-center gap-1.5 cursor-pointer leading-none"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingInquiry ? '...' : (lang === 'en' ? 'Transact Direct Lead' : (lang === 'ar' ? 'إرسال الاستعلام للمالك' : 'ناردنی داواکاری بۆ خاوەن کار'))}</span>
                  </button>
                </form>
              </div>

              {/* Custom Offline Interactive Vectors Map */}
              <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-5 py-3 border-b border-zinc-100 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-zinc-400" />
                  <span className="text-xs font-bold text-zinc-700">{lang === 'en' ? 'Spatial Coordinate Map' : (lang === 'ar' ? 'الموقع الفني للمنشأة' : 'نەخشەی شوێن')}</span>
                </div>
                
                {/* Visual SVG Map */}
                <div className="w-full h-44 bg-blue-50/30 relative flex items-center justify-center overflow-hidden">
                  
                  {/* Drawing coordinate grid maps with SVG matching district pattern */}
                  <svg className="absolute inset-0 w-full h-full opacity-60 text-zinc-300" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    {/* Simulated road routes */}
                    <path d="M-10 40 L350 40 M200 0 L200 200 M60 120 L280 120" stroke="#e4e4e7" strokeWidth="6" strokeLinecap="round" />
                    <path d="M-10 40 L350 40 M200 0 L200 200 M60 120 L280 120" stroke="white" strokeWidth="4" strokeLinecap="round" />
                  </svg>

                  {/* Dynamic interactive pin bouncing */}
                  <div className="absolute flex flex-col items-center animate-bounce z-10">
                    <div className="px-2.5 py-1 bg-zinc-950 text-white font-mono text-[9px] rounded-lg shadow-md whitespace-nowrap mb-1">
                      {lang === 'en' ? business.location : (lang === 'ar' ? business.locationAr : (business.locationKu || business.location))}
                    </div>
                    <div className="w-6 h-6 rounded-full bg-zinc-950 flex items-center justify-center text-white border-2 border-white shadow">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div className="w-2 h-2 rounded-full bg-zinc-950/40 blur-[1px] -mt-0.5" />
                  </div>

                  <div className="absolute top-2 left-2 bg-white/80 backdrop-blur px-2 py-0.5 rounded border border-zinc-100 text-[9px] font-mono font-medium text-zinc-500">
                    LAT: {business.latitude}°N | LNG: {business.longitude}°E
                  </div>
                </div>

                <div className="p-4 bg-zinc-50 space-y-2 border-t border-zinc-150">
                  <div className="flex gap-2 text-[10px] text-zinc-500">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                    <span className="font-medium text-zinc-700">{lang === 'en' ? business.address : (lang === 'ar' ? business.addressAr : (business.addressKu || business.address))}</span>
                  </div>
                  <div className="flex gap-2 text-[10px] text-zinc-500">
                    <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                    <span className="font-semibold text-zinc-950">{business.phone}</span>
                  </div>
                  <div className="flex gap-2 text-[10px] text-zinc-550">
                    <Globe className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                    <a href={business.website} target="_blank" rel="noopener noreferrer" className="font-semibold text-zinc-950 hover:underline">
                      {business.website.replace('https://', '')}
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
