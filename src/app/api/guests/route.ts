import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured, defaultGuests, defaultRsvps } from '@/lib/supabase';
import { sanitizeSlug, sanitizeText, generateRandomToken } from '@/lib/sanitize';
import { Guest } from '@/types';

// In-memory fallback untuk demo jika Supabase belum terhubung
let inMemoryGuests: Guest[] = [...defaultGuests];

export async function GET(req: NextRequest) {
  try {
    if (isSupabaseConfigured && supabase) {
      // Ambil tamu
      const { data: guests, error: guestsError } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });

      if (guestsError) throw guestsError;

      // Ambil RSVPs untuk ringkasan analitik
      const { data: rsvps, error: rsvpsError } = await supabase
        .from('rsvps')
        .select('status, guest_count');

      if (rsvpsError) throw rsvpsError;

      const totalGuests = guests?.length || 0;
      let totalHadir = 0;
      let totalTidakHadir = 0;
      let totalRagu = 0;
      let totalPorsi = 0;

      rsvps?.forEach((r) => {
        if (r.status === 'Hadir') {
          totalHadir += 1;
          totalPorsi += Number(r.guest_count) || 1;
        } else if (r.status === 'Tidak Hadir') {
          totalTidakHadir += 1;
        } else {
          totalRagu += 1;
        }
      });

      return NextResponse.json({
        success: true,
        data: guests,
        analytics: {
          totalGuests,
          totalHadir,
          totalTidakHadir,
          totalRagu,
          totalPorsi,
        },
      });
    }

    // Fallback Mock Analytics
    let totalPorsiMock = 0;
    defaultRsvps.forEach((r) => {
      if (r.status === 'Hadir') totalPorsiMock += r.guest_count;
    });

    return NextResponse.json({
      success: true,
      data: inMemoryGuests,
      analytics: {
        totalGuests: inMemoryGuests.length,
        totalHadir: 2,
        totalTidakHadir: 0,
        totalRagu: 1,
        totalPorsi: totalPorsiMock,
      },
    });
  } catch (error: unknown) {
    console.error('Guests GET error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data tamu' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawName = body.name;
    const phone_number = sanitizeText(body.phone_number || '');
    const category = sanitizeText(body.category || 'Sahabat');
    const notes = sanitizeText(body.notes || '');

    if (!rawName || typeof rawName !== 'string' || !rawName.trim()) {
      return NextResponse.json({ error: 'Nama tamu wajib diisi' }, { status: 400 });
    }

    const name = sanitizeText(rawName);
    // Buat slug otomatis dari nama
    const baseSlug = sanitizeSlug(name) || 'tamu';
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const slug = `${baseSlug}-${randomSuffix}`;
    // Token unik acak untuk Anti-Scraping / IDOR (Security Req #1)
    const token = generateRandomToken(8);

    const newGuest: Guest = {
      id: 'g-' + Date.now(),
      name,
      slug,
      token,
      phone_number,
      category,
      notes,
      view_count: 0,
      opened_at: null,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('guests')
        .insert([
          {
            name,
            slug,
            token,
            phone_number: phone_number || null,
            category: category || null,
            notes: notes || null,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    // Mock store
    inMemoryGuests.unshift(newGuest);
    return NextResponse.json({ success: true, data: newGuest });
  } catch (error: unknown) {
    console.error('Guests POST error:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan tamu baru' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID tamu diperlukan' }, { status: 400 });
    }

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('guests').delete().eq('id', id);
      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Tamu berhasil dihapus' });
    }

    inMemoryGuests = inMemoryGuests.filter((g) => g.id !== id);
    return NextResponse.json({ success: true, message: 'Tamu berhasil dihapus (Mock)' });
  } catch (error: unknown) {
    console.error('Guests DELETE error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus tamu' },
      { status: 500 }
    );
  }
}
