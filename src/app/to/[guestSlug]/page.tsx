import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
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
import { defaultWeddingEvent, defaultGuests, supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Guest } from '@/types';

interface PageProps {
  params: Promise<{ guestSlug: string }>;
  searchParams: Promise<{ token?: string }>;
}

// Security Requirement #5: SEO & Privacy: noindex, nofollow untuk halaman tamu personal
export const metadata: Metadata = {
  title: 'Undangan Pernikahan Personal | Juan & Una',
  description: 'Undangan Pernikahan Digital Personal Khusus Tamu Undangan',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function GuestInvitationPage({ params, searchParams }: PageProps) {
  const { guestSlug } = await params;
  const { token } = await searchParams;

  let guest: Guest | null = null;

  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase
      .from('guests')
      .select('*')
      .eq('slug', guestSlug)
      .single();

    if (data) {
      guest = data as Guest;
      // Increment view count secara pasif
      await supabase
        .from('guests')
        .update({
          view_count: (data.view_count || 0) + 1,
          opened_at: new Date().toISOString(),
        })
        .eq('id', data.id);
    }
  }

  // Fallback demo matching
  if (!guest) {
    const found = defaultGuests.find((g) => g.slug === guestSlug);
    if (found) {
      guest = found;
    } else {
      // Jika slug baru atau dinamis, buat nama cantik dari slug (e.g. budi-santoso -> Budi Santoso)
      const formattedName = guestSlug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      guest = {
        id: 'guest-dynamic',
        name: formattedName,
        slug: guestSlug,
        token: token || 'a8f9b2c3',
        view_count: 1,
        created_at: new Date().toISOString(),
      };
    }
  }

  // Validasi token jika token diperlukan untuk proteksi IDOR
  const isTokenValid = !token || !guest.token || token === guest.token;
  if (!isTokenValid) {
    // Jika token tidak cocok, tampilkan nama default
    guest.name = 'Tamu Undangan Terhormat';
  }

  const event = defaultWeddingEvent;

  return (
    <main className="relative min-h-screen bg-earth-beige">
      {/* 1. Landing Cover Overlay dengan Nama Tamu Dinamis */}
      <CoverOverlay
        guestName={guest.name}
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

