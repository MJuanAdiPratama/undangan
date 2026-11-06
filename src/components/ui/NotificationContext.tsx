'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  title?: string;
  type: NotificationType;
}

export interface ConfirmModalState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel?: () => void;
}

interface NotificationContextValue {
  showToast: (message: string, type?: NotificationType, title?: string, duration?: number) => void;
  showConfirm: (options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
    onCancel?: () => void;
  }) => void;
  closeConfirm: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Konfirmasi',
    cancelText: 'Batal',
    type: 'info',
    onConfirm: () => {},
  });

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: NotificationType = 'info', title?: string, duration = 3500) => {
      const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
      setToasts((prev) => [...prev, { id, message, title, type }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const showConfirm = useCallback(
    (options: {
      title: string;
      message: string;
      confirmText?: string;
      cancelText?: string;
      type?: 'danger' | 'warning' | 'info';
      onConfirm: () => void;
      onCancel?: () => void;
    }) => {
      setConfirmModal({
        isOpen: true,
        title: options.title,
        message: options.message,
        confirmText: options.confirmText || 'Konfirmasi',
        cancelText: options.cancelText || 'Batal',
        type: options.type || 'info',
        onConfirm: () => {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          options.onConfirm();
        },
        onCancel: () => {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          if (options.onCancel) options.onCancel();
        },
      });
    },
    []
  );

  const closeConfirm = useCallback(() => {
    setConfirmModal((prev) => {
      if (prev.onCancel) prev.onCancel();
      return { ...prev, isOpen: false };
    });
  }, []);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-earth-gold shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-earth-sage-dark shrink-0" />;
    }
  };

  return (
    <NotificationContext.Provider value={{ showToast, showConfirm, closeConfirm }}>
      {children}

      {/* 1. Floating Toast Popups Container */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2.5 pointer-events-none w-full max-w-sm px-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="pointer-events-auto w-full bg-earth-beige/95 backdrop-blur-md border border-earth-gold/40 shadow-xl rounded-2xl p-4 flex items-start gap-3 select-none text-left"
            >
              {getIcon(toast.type)}
              <div className="flex-1 min-w-0 pr-1">
                {toast.title && (
                  <h4 className="font-serif font-bold text-sm text-earth-charcoal leading-snug">
                    {toast.title}
                  </h4>
                )}
                <p className="text-xs text-earth-charcoal/90 font-medium leading-relaxed">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-earth-sage-dark/60 hover:text-earth-charcoal transition-colors p-1 -mr-1 -mt-1 rounded-lg"
                aria-label="Tutup notifikasi"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 2. Interactive Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeConfirm}
              className="absolute inset-0 bg-earth-charcoal/60 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full max-w-sm bg-earth-beige rounded-3xl p-6 sm:p-7 border border-earth-gold/40 shadow-2xl text-center space-y-4 overflow-hidden"
            >
              {/* Decorative Accent Ring */}
              <div className="mx-auto w-12 h-12 rounded-full bg-earth-beige-soft border border-earth-gold/50 flex items-center justify-center shadow-inner">
                {confirmModal.type === 'danger' ? (
                  <AlertCircle className="w-6 h-6 text-red-500" />
                ) : confirmModal.type === 'warning' ? (
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                ) : (
                  <Info className="w-6 h-6 text-earth-gold" />
                )}
              </div>

              <div className="space-y-1.5">
                <h3 className="font-serif text-2xl text-earth-charcoal font-semibold tracking-wide">
                  {confirmModal.title}
                </h3>
                <p className="text-xs sm:text-sm text-earth-sage-dark leading-relaxed">
                  {confirmModal.message}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={confirmModal.onCancel}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-earth-sage/30 text-earth-charcoal text-xs font-semibold hover:bg-earth-beige-soft transition-colors"
                >
                  {confirmModal.cancelText}
                </button>
                <button
                  type="button"
                  onClick={confirmModal.onConfirm}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all shadow-md ${
                    confirmModal.type === 'danger'
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-earth-charcoal hover:bg-earth-sage-dark text-earth-beige'
                  }`}
                >
                  {confirmModal.confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

