/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { Language } from '../types';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  text: string;
  textAr: string;
}

interface NotificationToastProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
  lang: Language;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ toasts, removeToast, lang }) => {
  return (
    <div className="fixed bottom-6 right-6 left-6 md:left-auto md:right-6 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const textToDisplay = lang === 'ar' ? toast.textAr : toast.text;
        return (
          <ToastItem
            key={toast.id}
            toast={toast}
            displayText={textToDisplay}
            onClose={() => removeToast(toast.id)}
            lang={lang}
          />
        );
      })}
    </div>
  );
};

const ToastItem: React.FC<{
  toast: ToastMessage;
  displayText: string;
  onClose: () => void;
  lang: Language;
}> = ({ toast, displayText, onClose, lang }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isRTL = lang === 'ar';

  return (
    <div
      id={`toast-${toast.id}`}
      className="glass-morphism shadow-lg rounded-xl p-4 border border-zinc-200/50 flex items-start gap-3 w-full animate-fade-in pointer-events-auto"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      <div className="mt-0.5">
        {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
        {toast.type === 'info' && <Info className="w-5 h-5 text-blue-600" />}
        {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600" />}
      </div>
      <div className="flex-1 text-sm font-medium text-zinc-800">
        {displayText}
      </div>
      <button
        onClick={onClose}
        className="text-zinc-400 hover:text-zinc-600 transition-colors p-0.5"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
