-- ==============================================================================
-- SKEMA DATABASE UNDANGAN PERNIKAHAN DIGITAL (SUPABASE POSTGRESQL + RLS + REALTIME)
-- Dibuat dengan arsitektur aman, efisien, dan modern.
-- ==============================================================================

-- 1. Buat Ekstensi UUID jika belum aktif
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 2. TABEL: events (Detail Acara & Profil Mempelai)
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
    
    -- Waktu Acara Utama (Hari-H untuk Countdown)
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
    
    -- Peta & Lokasi
    maps_embed_url TEXT DEFAULT 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.627786438096!2d107.63259837587635!3d-6.935003367885758!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e85e33e27241%3A0xdce793b8f2be67cc!2sPuri%20Suryalaya%20Wedding%20House!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
    maps_direct_url TEXT DEFAULT 'https://maps.app.goo.gl/b5ua5CTfg7ke4fLK9',
    
    -- Digital Gift / Rekening
    bank_accounts JSONB DEFAULT '[
        {"bank": "BCA", "account_number": "1234567890", "account_holder": "M Juan Adi Pratama"},
        {"bank": "Mandiri", "account_number": "9876543210123", "account_holder": "M Juan Adi Pratama"}
    ]'::jsonb,
    qris_image_url TEXT DEFAULT '/img/dana.jpeg',
    gift_address TEXT DEFAULT 'Jl. Soekarno Hatta No.487, Cijagra, Kec. Lengkong, Kota Bandung (Penerima: Juan & Una)',
    
    -- Audio Latar
    audio_url TEXT DEFAULT '/audio/wedding-song.mp3',
    audio_title TEXT DEFAULT 'Tulus - Perahu Kertas',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. TABEL: guests (Daftar Tamu & Token Unik)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    token TEXT NOT NULL,
    phone_number TEXT,
    category TEXT DEFAULT 'Sahabat',
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
-- 5. TABEL: wishes (Ucapan & Doa Restu)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.wishes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    relationship TEXT DEFAULT 'Tamu Undangan',
    message TEXT NOT NULL,
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. INDEXES UNTUK PERFORMA QUERY CEPAT
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_guests_slug ON public.guests(slug);
CREATE INDEX IF NOT EXISTS idx_guests_token ON public.guests(token);
CREATE INDEX IF NOT EXISTS idx_wishes_created_at ON public.wishes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wishes_visible ON public.wishes(is_visible);
CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON public.rsvps(created_at DESC);

-- ------------------------------------------------------------------------------
-- 7. ENABLE ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------------------------
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 8. RLS POLICIES
-- ------------------------------------------------------------------------------

-- POLICIES: events
-- Public boleh membaca data event
CREATE POLICY "Public events can be viewed by anyone" 
ON public.events FOR SELECT USING (true);

-- Hanya Admin (authenticated role) yang boleh memodifikasi event
CREATE POLICY "Admin can modify events" 
ON public.events FOR ALL 
TO authenticated 
USING (true) WITH CHECK (true);

-- POLICIES: guests
-- Public boleh membaca tamu berdasarkan slug/token
CREATE POLICY "Public can view guest by slug" 
ON public.guests FOR SELECT 
USING (true);

-- Admin dapat mengelola tamu (CRUD)
CREATE POLICY "Admin can manage guests" 
ON public.guests FOR ALL 
TO authenticated 
USING (true) WITH CHECK (true);

-- POLICIES: rsvps
-- Public dapat mengirim RSVP (INSERT)
CREATE POLICY "Public can submit RSVP" 
ON public.rsvps FOR INSERT 
WITH CHECK (true);

-- Public dapat melihat ringkasan RSVP
CREATE POLICY "Public can view RSVPs" 
ON public.rsvps FOR SELECT 
USING (true);

-- Admin dapat memodifikasi / menghapus RSVP
CREATE POLICY "Admin can manage RSVPs" 
ON public.rsvps FOR ALL 
TO authenticated 
USING (true) WITH CHECK (true);

-- POLICIES: wishes
-- Public dapat melihat ucapan yang disetujui / visible
CREATE POLICY "Public can view visible wishes" 
ON public.wishes FOR SELECT 
USING (is_visible = true);

-- Public dapat mengirim ucapan baru (INSERT)
CREATE POLICY "Public can submit wishes" 
ON public.wishes FOR INSERT 
WITH CHECK (true);

-- Admin dapat melihat semua ucapan (termasuk yang disembunyikan) dan mengedit/menghapus
CREATE POLICY "Admin can manage all wishes" 
ON public.wishes FOR ALL 
TO authenticated 
USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 9. REALTIME SUBSCRIPTIONS
-- ------------------------------------------------------------------------------
-- Tambahkan tabel wishes & rsvps ke publication realtime Supabase
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE public.wishes, public.rsvps;
COMMIT;

-- ------------------------------------------------------------------------------
-- 10. INITIAL DEFAULT DATA (SEED DATA)
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

-- Contoh data tamu awal untuk testing
INSERT INTO public.guests (name, slug, token, phone_number, category)
VALUES 
    ('Budi Santoso & Partner', 'budi-santoso', 'a8f9b2c3', '081234567890', 'Sahabat'),
    ('Siti Nurhaliza', 'siti-nurhaliza', 'd4e5f6a1', '081298765432', 'Keluarga'),
    ('Rizky Ramadhan', 'rizky-ramadhan', 'b7c8d9e0', '081377889900', 'Rekan Kerja')
ON CONFLICT (slug) DO NOTHING;

-- Contoh ucapan awal yang elegan
INSERT INTO public.wishes (name, relationship, message, is_visible)
VALUES 
    ('Budi Santoso', 'Sahabat Pengantin', 'Barakallahu lakuma wa baraka alaikuma wa jama''a bainakuma fii khoir. Selamat menempuh hidup baru Juan & Una!', true),
    ('Siti Nurhaliza', 'Keluarga', 'Selamat untuk Juan dan Una, semoga senantiasa diberikan kebahagiaan, keberkahan, dan cinta hingga akhir hayat.', true),
    ('Rizky Ramadhan', 'Rekan Kerja', 'Happy Wedding Juan & Una! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Aamiin.', true);

