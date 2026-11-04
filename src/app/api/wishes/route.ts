import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured, defaultWishes } from '@/lib/supabase';
import { sanitizeText } from '@/lib/sanitize';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all') === 'true'; // Jika admin meminta semua ucapan

    if (isSupabaseConfigured && supabase) {
      let query = supabase
        .from('wishes')
        .select('*')
        .order('created_at', { ascending: false });

      if (!all) {
        query = query.eq('is_visible', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    // Fallback data
    return NextResponse.json({ success: true, data: defaultWishes });
  } catch (error: unknown) {
    console.error('Wishes GET error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data ucapan' },
      { status: 500 }
    );
  }
}

// Moderasi: Toggle Visibility
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, is_visible } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID ucapan diperlukan' }, { status: 400 });
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('wishes')
        .update({ is_visible })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ success: true, message: 'Status ucapan diperbarui (Mock)' });
  } catch (error: unknown) {
    console.error('Wishes PATCH error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui status ucapan' }, { status: 500 });
  }
}

// Moderasi: Hapus Ucapan Spam
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID ucapan diperlukan' }, { status: 400 });
    }

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('wishes').delete().eq('id', id);
      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Ucapan berhasil dihapus' });
    }

    return NextResponse.json({ success: true, message: 'Ucapan berhasil dihapus (Mock)' });
  } catch (error: unknown) {
    console.error('Wishes DELETE error:', error);
    return NextResponse.json({ error: 'Gagal menghapus ucapan' }, { status: 500 });
  }
}
