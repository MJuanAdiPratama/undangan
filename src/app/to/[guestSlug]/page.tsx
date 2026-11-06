import React from 'react';
import { Metadata } from 'next';
import GuestInvitationView from '@/components/guest/GuestInvitationView';
import { defaultWeddingEvent, defaultGuests, supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Guest } from '@/types';

interface PageProps {
  params: Promise<{ guestSlug: string }>;
  searchParams: Promise<{ token?: string }>;
}

// Security Requirement #5: SEO & Privacy: noindex, nofollow untuk halaman tamu personal
export const metadata: Metadata = {
  title: 'Undangan Pernikahan Personal | Arya & Adelia',
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

  return <GuestInvitationView guest={guest} event={event} />;
}

