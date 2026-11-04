# Undangan Pernikahan Digital Handcrafted Fine-Art
> **by skywannn wedding**

Aplikasi web Undangan Pernikahan Digital modern, elegan, aman, dan berkinerja tinggi yang dibangun dengan konsep desain *Editorial & Handcrafted Fine-Art* (anti "AI-generated look"). Dilengkapi dengan backend Supabase (PostgreSQL), audio looping dengan gesture unlock, form RSVP interaktif, wall ucapan real-time, serta Dashboard Admin pengantin lengkap dengan generator tautan WhatsApp unik.

---

## 🌟 Fitur Utama

### 1. Halaman Tamu Undangan (Public Page)
- **Landing Cover Overlay & Audio Trigger:**
  - Sapaan nama tamu dinamis sesuai URL (`/to/[guestSlug]?token=[token]`).
  - Tombol *"Buka Undangan"* yang bertindak sebagai gesture trigger untuk mematuhi kebijakan Autoplay browser.
  - Musik latar looping otomatis berputar begitu cover dibuka.
  - Floating Audio Controller di pojok layar dengan animasi piringan hitam (*vinyl disc*), tombol play/pause, dan mute/unmute.
- **Hero & Profil Mempelai:**
  - Desain editorial elegan dengan lengkungan *arch frame*, foto mempelai, kutipan suci (QS. Ar-Rum: 21), dan *countdown timer* ke hari-H.
  - Profil mempelai pria dan wanita beserta nama orang tua dan tautan Instagram.
- **Detail Rangkaian Acara & Integrasi Peta:**
  - Jadwal lengkap Akad Nikah dan Resepsi Pernikahan.
  - Peta interaktif Google Maps embed serta direct link ke Google Maps.
  - Tombol simpan agenda ke Google Calendar dan unduh file `.ics` (iCalendar).
- **Galeri Foto & Video:**
  - Tata letak *Asymmetric Masonry Grid*.
  - Lightbox popup modal interaktif lengkap dengan navigasi prev, next, close, dan takarir foto.
- **Form RSVP & Wall Ucapan Real-Time:**
  - Nama terisi otomatis (*auto-fill*) dari parameter URL tamu.
  - Opsi konfirmasi: Hadir, Tidak Hadir, atau Masih Ragu beserta jumlah kehadiran (1-5 orang).
  - Pesan doa restu langsung muncul secara real-time di wall ucapan dengan animasi selebrasi konfeti.
- **Amplop Digital & Kado:**
  - Nomor rekening Bank BCA, Mandiri, QRIS/DANA, dan alamat pengiriman kado dengan fitur *Copy to Clipboard* disertai notifikasi toast visual yang mulus.
- **Footer Watermark:**
  - Branding `by skywannn wedding` minimalis, bersih, dan berkelas.

---

### 2. Dashboard Admin Pengantin (`/admin`)
- **Proteksi PIN Keamanan:** Akses dashboard dilindungi oleh PIN keamanan (Default: `123456`).
- **Guest Link Generator (CRUD):**
  - Tambah, edit, dan hapus tamu undangan.
  - Menghasilkan slug dan token acak unik per tamu (`/to/budi-santoso?token=a8f9b2c3`) untuk mencegah scraping dan IDOR.
  - **Generator Pesan WhatsApp Otomatis:** Tombol "Salin Teks WA" dan tombol "Kirim WA" langsung ke aplikasi WhatsApp dengan format pesan undangan yang siap kirim.
  - Ekspor seluruh daftar tamu ke format `.csv`.
- **RSVP & Porsi Analytics Summary:**
  - Rekap total undangan, jumlah konfirmasi hadir, tidak hadir, masih ragu, serta akumulasi total porsi katering.
- **Moderasi Ucapan:**
  - Filter dan tinjau semua ucapan tamu.
  - Sembunyikan pesan atau hapus pesan yang tidak layak / spam secara permanen.

---

### 3. Keamanan & Performa (Security Standards)
- **Anti-Scraping / IDOR:** Setiap tamu memiliki token acak hex unik (`token=...`), bukan ID numerik berurutan.
- **Sanitasi Input & Pencegahan XSS:** Seluruh data teks input disanitasi dari tag HTML dan karakter berpotensi injeksi sebelum disimpan dan dieksekusi.
- **Rate Limiting:** API Route dibatasi maksimal 5 pengiriman form per alamat IP dalam rentang 1 menit.
- **SEO & Privasi:** Meta tag `noindex, nofollow` dan `robots.ts` aktif pada tautan personal `/to/` dan `/admin/` agar data tamu dan host tidak terindeks oleh mesin pencari Google.
- **Database Row Level Security (RLS):** Skema PostgreSQL Supabase dengan aturan akses ketat (`SELECT` publik untuk data terbit, `INSERT` untuk RSVP/ucapan, `UPDATE`/`DELETE` khusus admin).

---

## 🛠️ Tech Stack
- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS (Custom Earthy & Warm Beige Palette, Cormorant Garamond, Plus Jakarta Sans)
- **Animasi:** Framer Motion & Canvas Confetti
- **Ikon:** Lucide React
- **Database & Realtime:** Supabase (Managed PostgreSQL) dengan RLS
- **Audio API:** HTML5 Audio API & Custom React Context

---

## 🚀 Panduan Memulai Cepat

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka browser dan akses [http://localhost:3000](http://localhost:3000).

- **Halaman Utama (Pratinjau):** [http://localhost:3000](http://localhost:3000)
- **Contoh Undangan Tamu Personal:** [http://localhost:3000/to/budi-santoso?token=a8f9b2c3](http://localhost:3000/to/budi-santoso?token=a8f9b2c3)
- **Dashboard Admin:** [http://localhost:3000/admin](http://localhost:3000/admin) *(PIN: `123456`)*

### 3. Konfigurasi Supabase (Opsional tapi Direkomendasikan)
1. Buat project baru di [Supabase](https://supabase.com).
2. Salin isi skrip SQL dari file `supabase/schema.sql` lalu jalankan di **SQL Editor** pada dashboard Supabase Anda.
3. Buat file `.env.local` di root proyek dan masukkan kredensial Supabase Anda:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. Selesai! Aplikasi akan langsung tersambung ke database PostgreSQL dan Realtime Subscriptions Supabase.
*(Catatan: Tanpa Supabase pun, aplikasi memiliki mode demo lokal interaktif bawaan sehingga dapat langsung dicoba tanpa hambatan).*

---

## 📦 Deployment ke Vercel
1. Dorong (*push*) repositori ini ke akun GitHub Anda.
2. Buka [Vercel](https://vercel.com) dan impor repositori ini.
3. Masukkan Environment Variables (`NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. Klik **Deploy**.

---
*Dibuat dengan dedikasi tinggi untuk momen sakral terbaik &bull; **skywannn wedding**.*
