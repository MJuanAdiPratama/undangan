'use client';

import { useEffect, useRef } from 'react';
import { useNotification } from '@/components/ui/NotificationContext';

interface UseMobileBackExitGuardProps {
  isInvitationOpened: boolean;
}

export function useMobileBackExitGuard({
  isInvitationOpened,
}: UseMobileBackExitGuardProps) {
  const { showConfirm } = useNotification();
  const isPromptOpenRef = useRef(false);

  useEffect(() => {
    if (!isInvitationOpened) return;

    // Pastikan history state terdaftar untuk halaman undangan
    try {
      if (!window.history.state || window.history.state.page !== 'invitation') {
        window.history.pushState({ page: 'invitation' }, '', window.location.href);
      }
    } catch (e) {
      // Abaikan jika env test
    }

    const handlePopState = (e: PopStateEvent) => {
      // Jika event popstate berasal dari penutupan modal lightbox, jangan tampilkan dialog keluar
      if (e.state && e.state.modal === 'lightbox') {
        return;
      }

      // Cegah popup bertumpuk jika sudah terbuka
      if (isPromptOpenRef.current) {
        return;
      }

      isPromptOpenRef.current = true;

      showConfirm({
        title: 'Keluar dari Undangan?',
        message:
          'Apakah Anda yakin ingin menutup undangan pernikahan Arya & Adelia atau tetap melanjutkan membaca?',
        confirmText: 'Ya, Keluar',
        cancelText: 'Tetap di Undangan',
        type: 'warning',
        onConfirm: () => {
          isPromptOpenRef.current = false;
          // Izinkan browser keluar ke halaman sebelumnya (misal WhatsApp)
          window.history.back();
        },
        onCancel: () => {
          isPromptOpenRef.current = false;
          // Dorong kembali state ke history agar tamu tetap terjaga di dalam undangan
          try {
            window.history.pushState({ page: 'invitation' }, '', window.location.href);
          } catch (err) {
            // Abaikan jika ada error history
          }
        },
      });
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isInvitationOpened, showConfirm]);
}

