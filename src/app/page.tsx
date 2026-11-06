'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
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
import { defaultWeddingEvent } from '@/lib/supabase';
import { useMobileBackExitGuard } from '@/hooks/useMobileBackExitGuard';

function InvitationContent() {
  const [isOpened, setIsOpened] = useState(false);
  const searchParams = useSearchParams();
  // Ambil parameter nama tamu dari query URL ?to= atau ?u=
  const guestQuery = searchParams.get('to') || searchParams.get('u') || '';
  const guestName = guestQuery ? guestQuery.trim() : 'Tamu Undangan';

  const event = defaultWeddingEvent;

  // Proteksi tombol back di browser HP agar tidak langsung keluar website
  useMobileBackExitGuard({ isInvitationOpened: isOpened });

  return (
    <main className="relative min-h-screen bg-earth-beige">
      {/* 1. Landing Cover Overlay & Audio Trigger */}
      <CoverOverlay
        guestName={guestName}
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

      {/* 6. Kisah Perjalanan Cinta */}
      <LoveStorySection />

      {/* 7. Galeri Foto & Lightbox Popup */}
      <GallerySection />

      {/* 8. Form RSVP & Wall Ucapan Real-time */}
      <RsvpSection initialGuestName={guestQuery ? guestQuery.trim() : ''} />

      {/* 9. Amplop Digital & Kado */}
      <GiftSection event={event} />

      {/* 10. Footer Watermark: by skywannn wedding */}
      <FooterWatermark
        groomNickname={event.groom_nickname}
        brideNickname={event.bride_nickname}
      />
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-earth-beige" />}>
      <InvitationContent />
    </Suspense>
  );
}
