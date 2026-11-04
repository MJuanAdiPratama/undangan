import { createClient } from '@supabase/supabase-js';
import { WeddingEvent, Guest, Rsvp, Wish } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  supabaseAnonKey.length > 20
);

// Inisialisasi Supabase client jika konfigurasi tersedia
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

// ==============================================================================
// DATA DEFAULT (SEED) UNTUK EVENT DAN DEMO FALLBACK
// ==============================================================================
export const defaultWeddingEvent: WeddingEvent = {
  id: '00000000-0000-0000-0000-000000000001',
  slug: 'wedding-event',
  title: 'Pernikahan Juan & Una',
  
  // Mempelai Pria
  groom_name: 'M Juan Adi Pratama',
  groom_nickname: 'Juan',
  groom_father: 'Bpk. Lorem',
  groom_mother: 'Ibu Ipsum',
  groom_instagram: 'qxuan.03',
  groom_photo_url: '/img/juan.jpeg',
  
  // Mempelai Wanita
  bride_name: 'Nadya Una',
  bride_nickname: 'Una',
  bride_father: 'Bpk. Situmorang',
  bride_mother: 'Ibu Rahayu',
  bride_instagram: 'nadyauna',
  bride_photo_url: '/img/una.jpeg',
  
  // Kutipan
  quote_text:
    'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
  quote_source: 'QS. Ar-Rum: 21',
  
  // Waktu Acara Utama (10 Desember 2026 08:00 WIB)
  event_date: '2026-12-10T08:00:00+07:00',
  
  // Akad Nikah
  akad_title: 'Akad Nikah',
  akad_date: 'Minggu, 10 Desember 2026',
  akad_time: '08:00 - 10:00 WIB',
  akad_venue: 'Puri Suryalaya Wedding House',
  akad_address: 'Jl. Soekarno Hatta No.487, Cijagra, Kec. Lengkong, Kota Bandung',
  
  // Resepsi
  reception_title: 'Resepsi Pernikahan',
  reception_date: 'Minggu, 10 Desember 2026',
  reception_time: '11:00 WIB - Selesai',
  reception_venue: 'Puri Suryalaya Wedding House',
  reception_address: 'Jl. Soekarno Hatta No.487, Cijagra, Kec. Lengkong, Kota Bandung',
  
  // Peta
  maps_embed_url:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.627786438096!2d107.63259837587635!3d-6.935003367885758!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e85e33e27241%3A0xdce793b8f2be67cc!2sPuri%20Suryalaya%20Wedding%20House!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
  maps_direct_url: 'https://maps.app.goo.gl/b5ua5CTfg7ke4fLK9',
  
  // Amplop & Kado
  bank_accounts: [
    {
      bank: 'BCA',
      account_number: '1234567890',
      account_holder: 'M Juan Adi Pratama',
    },
    {
      bank: 'Mandiri',
      account_number: '9876543210123',
      account_holder: 'M Juan Adi Pratama',
    },
  ],
  qris_image_url: '/img/dana.jpeg',
  gift_address:
    'Jl. Soekarno Hatta No.487, Cijagra, Kec. Lengkong, Kota Bandung 40265 (Penerima: Juan & Una / 081293066707)',
  
  audio_url: '/audio/wedding-song.mp3',
  audio_title: 'Tulus - Perahu Kertas',
};

export const defaultGuests: Guest[] = [
  {
    id: 'g-1',
    name: 'Budi Santoso & Partner',
    slug: 'budi-santoso',
    token: 'a8f9b2c3',
    phone_number: '081234567890',
    notes: 'Meja VIP 1',
    view_count: 3,
    opened_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'g-2',
    name: 'Siti Nurhaliza',
    slug: 'siti-nurhaliza',
    token: 'd4e5f6a1',
    phone_number: '081298765432',
    notes: 'Keluarga Jakarta',
    view_count: 1,
    opened_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'g-3',
    name: 'Rizky Ramadhan',
    slug: 'rizky-ramadhan',
    token: 'b7c8d9e0',
    phone_number: '081377889900',
    notes: 'Teman Kuliah',
    view_count: 2,
    opened_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
];

export const defaultWishes: Wish[] = [
  {
    id: 'w-1',
    name: 'Budi Santoso',
    relationship: 'Sahabat Pengantin',
    message:
      'Barakallahu lakuma wa baraka alaikuma wa jama\'a bainakuma fii khoir. Selamat menempuh hidup baru Juan & Una, bahagia selalu sampai surga-Nya!',
    is_visible: true,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'w-2',
    name: 'Siti Nurhaliza',
    relationship: 'Keluarga',
    message:
      'Selamat untuk Juan dan Una, semoga senantiasa diberikan keberkahan, sakinah mawaddah warahmah, serta dikaruniai keturunan yang sholeh dan sholehah.',
    is_visible: true,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'w-3',
    name: 'Rizky Ramadhan',
    relationship: 'Rekan Kerja',
    message:
      'Happy Wedding Juan & Una! Semoga langgeng dan saling melengkapi dalam mengarungi bahtera rumah tangga. Aamiin.',
    is_visible: true,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
];

export const defaultRsvps: Rsvp[] = [
  {
    id: 'r-1',
    name: 'Budi Santoso & Partner',
    status: 'Hadir',
    guest_count: 2,
    message: 'InsyaAllah kami berdua hadir tepat waktu!',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'r-2',
    name: 'Siti Nurhaliza',
    status: 'Hadir',
    guest_count: 1,
    message: 'Hadir bersama rombongan keluarga.',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'r-3',
    name: 'Rizky Ramadhan',
    status: 'Masih Ragu',
    guest_count: 1,
    message: 'Semoga tidak ada jadwal dinas luar kota.',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
];

