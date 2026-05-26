/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bell, CheckCircle2, ShieldCheck, Tag, Heart, Info, ArrowRight } from 'lucide-react';
import { Language } from '../types';

interface NotificationItem {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  timestampEn: string;
  timestampAr: string;
  category: 'system' | 'business' | 'verification' | 'bookmark';
  read: boolean;
}

interface NotificationsDropdownProps {
  lang: Language;
  onNavigateToTab?: (tab: 'explore' | 'dashboard' | 'auth') => void;
}

const SIMULATED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    titleEn: 'Identity Verified Successfully',
    titleAr: 'تم التحقق من الهوية بنجاح',
    descriptionEn: 'Your credentials have been successfully synced through our Explora verification gateway.',
    descriptionAr: 'تمت مزامنة بيانات الاعتماد الخاصة بك بنجاح من خلال بوابة التحقق الآمنة للشركاء.',
    timestampEn: 'Just now',
    timestampAr: 'الآن',
    category: 'verification',
    read: false
  },
  {
    id: 'notif_2',
    titleEn: 'Trending Business Highlighted',
    titleAr: 'منشأة مميزة على المنصة',
    descriptionEn: 'The Foundry Cafe added the official digital catalog. Request custom corporate tours today.',
    descriptionAr: 'قام "ذا فوندري كافيه" بإضافة الدليل الرقمي الرسمي المعتمد. اطلب جولتك الخاصة اليوم.',
    timestampEn: '2 hours ago',
    timestampAr: 'منذ ساعتين',
    category: 'business',
    read: false
  },
  {
    id: 'notif_3',
    titleEn: 'System Optimization Completed',
    titleAr: 'تحديث منصة إكسبلور',
    descriptionEn: 'Explora platform speed upgraded. Enjoy faster queries, location validations, and RTL layouts.',
    descriptionAr: 'تم تحديث سرعة استجابة منصتنا. تمتع الآن ببحث أسرع وتجربة تخطيطية مرنة.',
    timestampEn: '1 day ago',
    timestampAr: 'منذ يوم واحد',
    category: 'system',
    read: true
  }
];

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ lang, onNavigateToTab }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(SIMULATED_NOTIFICATIONS);
  const [isOpen, setIsOpen] = useState(false);

  const isRTL = lang === 'ar';
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleToggleRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'verification':
        return <ShieldCheck className="w-4 h-4 text-emerald-650" />;
      case 'bookmark':
        return <Heart className="w-4 h-4 text-rose-500" />;
      case 'business':
        return <Tag className="w-4 h-4 text-amber-500" />;
      default:
        return <Info className="w-4 h-4 text-zinc-500" />;
    }
  };

  return (
    <div className="relative">
      {/* Drawer Bell Indicator Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl border border-zinc-200/80 bg-white hover:border-zinc-800 text-zinc-650 hover:text-zinc-950 transition-colors cursor-pointer shadow-sm"
        title="Simulated Alerts"
      >
        <Bell className="w-4.5 h-4.5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-zinc-950 rounded-full ring-2 ring-white animate-pulse" />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div 
            className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-80 sm:w-96 bg-white border border-zinc-250/70 rounded-2xl shadow-xl p-4 z-50 animate-fade-in`}
            style={{ direction: isRTL ? 'rtl' : 'ltr' }}
          >
            {/* Dropdown Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-zinc-150 mb-3">
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                  {isRTL ? 'تنبيهات المنصة' : 'Activity Feeds'}
                </h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] bg-zinc-900 text-white font-bold px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllRead}
                  className="text-[10px] font-bold text-zinc-900 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isRTL ? 'تحديد كالمقروء' : 'Mark all as read'}</span>
                </button>
              )}
            </div>

            {/* Notifications Scroller */}
            <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1 divide-y divide-zinc-100/50">
              {notifications.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <Bell className="w-8 h-8 text-zinc-300 mx-auto" />
                  <p className="text-xs text-zinc-400">
                    {isRTL ? 'لا توجد تنبيهات جديدة حالياً.' : 'Your notification tray is currently empty.'}
                  </p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className={`pt-2.5 first:pt-0 pb-1.5 flex gap-3 transition-colors ${notif.read ? 'opacity-70' : ''}`}
                  >
                    <div className="mt-0.5 w-8 h-8 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0">
                      {getIcon(notif.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-xs font-bold truncate ${notif.read ? 'text-zinc-650' : 'text-zinc-900'}`}>
                          {isRTL ? notif.titleAr : notif.titleEn}
                        </span>
                        <span className="text-[9px] text-zinc-400 shrink-0 font-medium">
                          {isRTL ? notif.timestampAr : notif.timestampEn}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                        {isRTL ? notif.descriptionAr : notif.descriptionEn}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <button
                          onClick={() => handleToggleRead(notif.id)}
                          className="text-[9px] font-bold hover:underline text-zinc-650"
                        >
                          {notif.read ? (isRTL ? 'وضع كغير مقروء' : 'Mark unread') : (isRTL ? 'مقروء' : 'Mark read')}
                        </button>
                        {notif.category === 'business' && onNavigateToTab && (
                          <button
                            onClick={() => {
                              onNavigateToTab('explore');
                              setIsOpen(false);
                            }}
                            className="text-[9px] font-bold text-zinc-950 hover:underline inline-flex items-center gap-0.5"
                          >
                            <span>{isRTL ? 'عرض التفاصيل' : 'Evaluate'}</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    {!notif.read && (
                      <span className="w-1.5 h-1.5 bg-zinc-950 rounded-full shrink-0 align-middle self-center mt-2" />
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Platform footer update banner */}
            <div className="mt-3 pt-3 border-t border-zinc-150 text-center">
              <span className="text-[10px] text-zinc-400 font-medium">
                {isRTL 
                  ? 'يتم تحديث التنبيهات عبر خوادم المحاكاة الزمنية' 
                  : 'Updates processed in sandbox real-time'
                }
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
