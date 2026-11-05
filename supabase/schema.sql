-- ==============================================================================
-- SKEMA BASIS DATA SUPABASE (POSTGRESQL + RLS + REALTIME)
-- Proyek: Undangan Pernikahan Digital (by skywannn wedding)
-- ==============================================================================
-- Petunjuk:
-- 1. Buka Dashboard Supabase Anda (https://supabase.com/dashboard)
-- 2. Pilih Project Anda -> Buka menu "SQL Editor" di bilah kiri
-- 3. Klik "New Query", paste seluruh kode SQL di bawah ini, lalu klik "RUN"
-- ==============================================================================

-- 1. AKTIFKAN EKSTENSI UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 2. TABEL: events (Detail Profil Mempelai & Agenda Acara)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL DEFAULT 'wedding-event',
    title TEXT NOT NULL DEFAULT 'Pernikahan Juan & Una',
    
    -- Mempelai Pria (Groom)
    groom_name TEXT NOT NULL DEFAULT 'M Juan Adi Pratama',
    groom_nickname TEXT NOT NULL DEFAULT 'Juan',
    groom_father TEXT NOT NULL DEFAULT 'Bapak Lorem',
    groom_mother TEXT NOT NULL DEFAULT 'Ibu Ipsum',
    groom_instagram TEXT DEFAULT 'qxuan.03',
    groom_photo_url TEXT DEFAULT '/img/juan.jpeg',
    
    -- Mempelai Wanita (Bride)
    bride_name TEXT NOT NULL DEFAULT 'Nadya Una',
    bride_nickname TEXT NOT NULL DEFAULT 'Una',
    bride_father TEXT NOT NULL DEFAULT 'Bapak Situmorang',
    bride_mother TEXT NOT NULL DEFAULT 'Ibu Rahayu',
    bride_instagram TEXT DEFAULT 'nadyauna',
    bride_photo_url TEXT DEFAULT '/img/una.jpeg',
    
    -- Kutipan / Ayat
    quote_text TEXT DEFAULT 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
    quote_source TEXT DEFAULT 'QS. Ar-Rum: 21',
    
    -- Tanggal Hari-H untuk Countdown
    event_date TIMESTAMPTZ NOT NULL DEFAULT '2026-12-10 08:00:00+07',
    
    -- Detail Akad Nikah
    akad_title TEXT DEFAULT 'Akad Nikah',
    akad_date TEXT DEFAULT 'Minggu, 10 Desember 2026',
    akad_time TEXT DEFAULT '08:00 - 10:00 WIB',
    akad_venue TEXT DEFAULT 'Puri Suryalaya Wedding House',
    akad_address TEXT DEFAULT 'Jl. Soekarno Hatta No.487, Cijagra, Kec. Lengkong, Kota Bandung',
    
    -- Detail Resepsi
    reception_title TEXT DEFAULT 'Resepsi Pernikahan',
    reception_date TEXT DEFAULT 'Minggu, 10 Desember 2026',
    reception_time TEXT DEFAULT '11:00 WIB - Selesai',
    reception_venue TEXT DEFAULT 'Puri Suryalaya Wedding House',
    reception_address TEXT DEFAULT 'Jl. Soekarno Hatta No.487, Cijagra, Kec. Lengkong, Kota Bandung',
    
    -- Lokasi & Google Maps
    maps_embed_url TEXT DEFAULT 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.627786438096!2d107.63259837587635!3d-6.935003367885758!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e85e33e27241%3A0xdce793b8f2be67cc!2sPuri%20Suryalaya%20Wedding%20House!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
    maps_direct_url TEXT DEFAULT 'https://maps.app.goo.gl/b5ua5CTfg7ke4fLK9',
    
    -- Amplop Digital & Hadiah
    bank_accounts JSONB DEFAULT '[
        {"bank": "BCA", "account_number": "1234567890", "account_holder": "M Juan Adi Pratama"},
        {"bank": "Mandiri", "account_number": "9876543210123", "account_holder": "M Juan Adi Pratama"}
    ]'::jsonb,
    qris_image_url TEXT DEFAULT '/img/dana.jpeg',
    gift_address TEXT DEFAULT 'Jl. Soekarno Hatta No.487, Cijagra, Kec. Lengkong, Kota Bandung 40265 (Penerima: Juan & Una)',
    
    -- Audio Musik
    audio_url TEXT DEFAULT '/audio/wedding-song.mp3',
    audio_title TEXT DEFAULT 'Tulus - Perahu Kertas',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. TABEL: guests (Daftar Tamu & Token Unik Anti-Scraping)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    token TEXT NOT NULL,
    phone_number TEXT,
    notes TEXT,
    view_count INT DEFAULT 0,
    opened_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. TABEL: rsvps (Konfirmasi Kehadiran Tamu)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rsvps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guest_id UUID REFERENCES public.guests(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Hadir', 'Tidak Hadir', 'Masih Ragu')),
    guest_count INT NOT NULL DEFAULT 1 CHECK (guest_count >= 1 AND guest_count <= 5),
    message TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. TABEL: wishes (Untaian Doa & Ucapan Tamu)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.wishes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    relationship TEXT DEFAULT '',
    message TEXT NOT NULL,
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. INDEXES UNTUK KECEPATAN QUERY
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_guests_slug ON public.guests(slug);
CREATE INDEX IF NOT EXISTS idx_guests_token ON public.guests(token);
CREATE INDEX IF NOT EXISTS idx_wishes_created_at ON public.wishes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wishes_visible ON public.wishes(is_visible);
CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON public.rsvps(created_at DESC);

-- ------------------------------------------------------------------------------
-- 7. AKTIFKAN ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------------------------
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 8. RLS POLICIES (ATURAN HAK AKSES AMAN)
-- ------------------------------------------------------------------------------

-- Bersihkan policy lama jika ada agar tidak bentrok
DROP POLICY IF EXISTS "Public can view events" ON public.events;
DROP POLICY IF EXISTS "Public can view guests" ON public.guests;
DROP POLICY IF EXISTS "Allow manage guests" ON public.guests;
DROP POLICY IF EXISTS "Public can submit RSVP" ON public.rsvps;
DROP POLICY IF EXISTS "Public can view RSVPs" ON public.rsvps;
DROP POLICY IF EXISTS "Allow manage RSVPs" ON public.rsvps;
DROP POLICY IF EXISTS "Public can view visible wishes" ON public.wishes;
DROP POLICY IF EXISTS "Public can submit wishes" ON public.wishes;
DROP POLICY IF EXISTS "Allow manage wishes" ON public.wishes;

-- POLICIES: events
CREATE POLICY "Public can view events" 
ON public.events FOR SELECT USING (true);

CREATE POLICY "Allow manage events" 
ON public.events FOR ALL USING (true) WITH CHECK (true);

-- POLICIES: guests
CREATE POLICY "Public can view guests" 
ON public.guests FOR SELECT USING (true);

CREATE POLICY "Allow manage guests" 
ON public.guests FOR ALL USING (true) WITH CHECK (true);

-- POLICIES: rsvps
CREATE POLICY "Public can view RSVPs" 
ON public.rsvps FOR SELECT USING (true);

CREATE POLICY "Public can submit RSVP" 
ON public.rsvps FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow manage RSVPs" 
ON public.rsvps FOR ALL USING (true) WITH CHECK (true);

-- POLICIES: wishes
CREATE POLICY "Public can view visible wishes" 
ON public.wishes FOR SELECT USING (is_visible = true);

CREATE POLICY "Public can submit wishes" 
ON public.wishes FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow manage wishes" 
ON public.wishes FOR ALL USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 9. AKTIFKAN REALTIME SUBSCRIPTIONS
-- ------------------------------------------------------------------------------
-- Mengaktifkan pengiriman data ucapan secara seketika (realtime)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'wishes'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.wishes;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'rsvps'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.rsvps;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- Fallback jika publication belum ada
    NULL;
END $$;

-- ------------------------------------------------------------------------------
-- 10. DATA AWAL (SEED DATA CONTOH)
-- ------------------------------------------------------------------------------
INSERT INTO public.events (slug, title, groom_name, groom_nickname, bride_name, bride_nickname)
VALUES (
    'wedding-event', 
    'Pernikahan Juan & Una',
    'M Juan Adi Pratama',
    'Juan',
    'Nadya Una',
    'Una'
) ON CONFLICT (slug) DO NOTHING;

-- Contoh data awal tamu
INSERT INTO public.guests (name, slug, token, phone_number)
VALUES 
    ('Budi Santoso & Partner', 'budi-santoso', 'a8f9b2c3', '081234567890'),
    ('Siti Nurhaliza', 'siti-nurhaliza', 'd4e5f6a1', '081298765432'),
    ('Rizky Ramadhan', 'rizky-ramadhan', 'b7c8d9e0', '081377889900')
ON CONFLICT (slug) DO NOTHING;

-- Contoh data ucapan awal
INSERT INTO public.wishes (name, message, is_visible)
VALUES 
    ('Budi Santoso', 'Barakallahu lakuma wa baraka alaikuma wa jama''a bainakuma fii khoir. Selamat menempuh hidup baru Juan & Una!', true),
    ('Siti Nurhaliza', 'Selamat untuk Juan dan Una, semoga senantiasa diberikan kebahagiaan, keberkahan, dan cinta hingga akhir hayat.', true),
    ('Rizky Ramadhan', 'Happy Wedding Juan & Una! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Aamiin.', true);
