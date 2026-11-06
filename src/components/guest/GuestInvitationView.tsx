'use client';

import React, { useState } from 'react';
import CoverOverlay from '@/components/cover/CoverOverlay';
import AudioPlayer from '@/components/audio/AudioPlayer';
import HeroSection from '@/components/hero/HeroSection';
import CoupleSection from '@/components/couple/CoupleSection';
import EventDetailsSection from '@/components/events/EventDetailsSection';
import LoveStorySection from '@/components/story/LoveStorySection';
import GallerySection from '@/components/gallery/GallerySection';
import RsvpSection from '@/components/rsvp/RsvpSection';
import GiftSection from '@/components/gift/GiftSection';
import FooterWatermark from '@/components/footer/FooterWatermark';
import { Guest, WeddingEvent } from '@/types';
import { useMobileBackExitGuard } from '@/hooks/useMobileBackExitGuard';

interface GuestInvitationViewProps {
  guest: Guest;
  event: WeddingEvent;
}

export default function GuestInvitationView({ guest, event }: GuestInvitationViewProps) {
  const [isOpened, setIsOpened] = useState(false);

  // Proteksi tombol back di browser HP agar tidak langsung keluar website
  useMobileBackExitGuard({ isInvitationOpened: isOpened });

  return (
    <main className="relative min-h-screen bg-earth-beige">
      {/* 1. Landing Cover Overlay dengan Nama Tamu Dinamis */}
      <CoverOverlay
        guestName={guest.name}
        groomNickname={event.groom_nickname}
        brideNickname={event.bride_nickname}
        weddingDate="Minggu, 10 Desember 2026"
        onOpen={() => setIsOpened(true)}
      />

      {/* 2. Floating Audio Controller */}
      <AudioPlayer title={event.audio_title} />

      {/* 3. Hero & Mempelai Section */}
      <HeroSection
        groomNickname={event.groom_nickname}
        brideNickname={event.bride_nickname}
        eventDate={event.event_date}
        dateDisplay="10.12.2026"
      />

      {/* 4. Profil Kedua Mempelai */}
      <CoupleSection event={event} />

      {/* 5. Detail Acara & Integrasi Maps */}
      <EventDetailsSection event={event} />

      {/* 6. Kisah Kasih */}
      <LoveStorySection />

      {/* 7. Galeri Foto & Lightbox Popup */}
      <GallerySection />

      {/* 8. Form RSVP & Wall Ucapan Real-time (Auto-fill Nama Tamu) */}
      <RsvpSection initialGuestName={guest.name} guestId={guest.id} />

      {/* 9. Amplop Digital & Kado */}
      <GiftSection event={event} />

      {/* 10. Footer Watermark Wajib: by skywannn wedding */}
      <FooterWatermark
        groomNickname={event.groom_nickname}
        brideNickname={event.bride_nickname}
      />
    </main>
  );
}

