'use client';

import React from 'react';
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

export default function HomePage() {
  const event = defaultWeddingEvent;

  return (
    <main className="relative min-h-screen bg-earth-beige">
      {/* 1. Landing Cover Overlay & Audio Trigger */}
      <CoverOverlay
        guestName="Tamu Undangan Terhormat"
        groomNickname={event.groom_nickname}
        brideNickname={event.bride_nickname}
        weddingDate="Minggu, 10 Desember 2026"
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
      <RsvpSection initialGuestName="" />

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
