import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';
import { sanitizeText } from '@/lib/sanitize';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    // 1. Ekstrak IP Pengguna untuk Rate Limiting
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    // 2. Evaluasi Rate Limiter (maksimal 5 request per 1 menit per IP)
    const rateCheck = checkRateLimit(ip, 5, 60_000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Terlalu banyak permintaan. Silakan tunggu ${rateCheck.retryAfterSeconds} detik sebelum mengirim lagi.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const rawName = body.name;
    const rawStatus = body.status;
    const rawCount = body.guest_count;
    const rawMessage = body.message;
    const guestId = body.guest_id || null;

    // 3. Sanitasi Input (Security Requirement #2)
    const name = sanitizeText(rawName);
    const message = sanitizeText(rawMessage);
    const status = ['Hadir', 'Tidak Hadir', 'Masih Ragu'].includes(rawStatus)
      ? rawStatus
      : 'Hadir';
    const guestCount = Math.min(Math.max(Number(rawCount) || 1, 1), 5);

    if (!name) {
      return NextResponse.json(
        { error: 'Nama tamu tidak boleh kosong.' },
        { status: 400 }
      );
    }

    // 4. Simpan ke Supabase jika configured
    let createdWish = null;
    if (isSupabaseConfigured && supabase) {
      // Simpan ke tabel rsvps
      const { error: rsvpError } = await supabase.from('rsvps').insert([
        {
          guest_id: guestId,
          name,
          status,
          guest_count: guestCount,
          message: message || null,
          ip_address: ip,
        },
      ]);

      if (rsvpError) {
        console.error('Supabase RSVP insert error:', rsvpError);
      }

      // Jika ada pesan, simpan juga ke tabel wishes
      if (message) {
        const { data: wishData, error: wishError } = await supabase
          .from('wishes')
          .insert([
            {
              name,
              relationship: status === 'Hadir' ? 'Hadir' : 'Memberi Doa',
              message,
              is_visible: true,
              ip_address: ip,
            },
          ])
          .select()
          .single();

        if (wishError) {
          console.error('Supabase Wish insert error:', wishError);
        } else {
          createdWish = wishData;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Konfirmasi kehadiran dan ucapan berhasil dikirim.',
      data: {
        name,
        status,
        guest_count: guestCount,
        message,
        wish: createdWish,
      },
    });
  } catch (error: unknown) {
    console.error('RSVP API Route error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server saat memproses RSVP.' },
      { status: 500 }
    );
  }
}

