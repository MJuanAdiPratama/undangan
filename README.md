# Undangan Pernikahan Digital
> **by skywannn wedding**

Aplikasi web Undangan Pernikahan Digital dengan konsep desain *Editorial & Handcrafted Fine-Art*. Dilengkapi fitur musik latar otomatis (*gesture trigger*), galeri foto interaktif (*masonry grid & lightbox*), form RSVP & wall ucapan real-time, integrasi Google Calendar, amplop digital, serta Dashboard Admin untuk manajemen tamu dan porsi katering.

---

## 💻 Cara Menjalankan Proyek

1. **Instalasi Dependensi:**
   ```bash
   npm install
   ```

2. **Jalankan Server Lokal:**
   ```bash
   npm run dev
   ```

3. **Buka di Browser:**
   - **Halaman Undangan:** [http://localhost:3000](http://localhost:3000)
   - **Dashboard Admin:** [http://localhost:3000/admin](http://localhost:3000/admin) *(PIN: `123456`)*

---

## ✏️ Panduan Mengubah Data & Foto

Seluruh teks dan media dipusatkan pada lokasi berikut agar mudah disesuaikan:

### 1. Mengubah Teks, Tanggal, Lokasi, dan Nomor Rekening
Semua teks berada di dalam satu file:  
👉 **`src/lib/weddingData.ts`**

Buka file tersebut untuk mengubah:
- **Nama Mempelai & Orang Tua:** Bagian `groom` (pria) dan `bride` (wanita).
- **Kutipan / Doa:** Bagian `quote`.
- **Waktu Hari-H (Countdown):** Bagian `eventDateIso`.
- **Jadwal & Tempat:** Bagian `akad` dan `reception`.
- **Link Google Maps:** Bagian `maps`.
- **Nomor Rekening Bank & QRIS:** Bagian `gifts`.
- **Kisah Cinta (Love Story):** Bagian `stories`.
- **Takarir / Caption Foto:** Bagian `gallery`.

### 2. Mengubah Foto & Lagu
Semua file media berada di dalam folder:  
👉 **`public/img/`** dan **`public/audio/`**

- **Foto Utama (Cover Atas):** Ganti file `public/img/hero.jpg`
- **Foto Mempelai Pria:** Ganti file `public/img/groom.jpg`
- **Foto Mempelai Wanita:** Ganti file `public/img/bride.jpg`
- **Foto Barcode QRIS:** Ganti file `public/img/qris.svg`
- **Foto-Foto Galeri:** Ganti file `public/img/gallery-1.jpg` s/d `gallery-6.jpg`
- **Lagu Latar (Audio):** Ganti file lagu di `public/audio/wedding-song.mp3`

---

## 🔐 Dashboard Admin (`/admin`)

Halaman undangan pernikahan tidak menampilkan tombol login agar tampilan tetap bersih dan sakral bagi tamu undangan.

- **Akses Dashboard:** Buka URL `/admin` pada browser Anda.
- **PIN Keamanan:** `123456`
- **Fitur Utama:**
  1. **Manajemen Tamu (Guest Link Generator):** Masukkan nama tamu dan nomor WhatsApp, sistem akan membuatkan link undangan unik (`/to/[nama-tamu]?token=...`). Tersedia tombol langsung untuk menyalin link, menyalin teks undangan, atau langsung membuka WhatsApp.
  2. **Rekap RSVP & Porsi:** Memantau konfirmasi kehadiran tamu (Hadir, Tidak Hadir) dan akumulasi total porsi katering.
  3. **Moderasi Ucapan:** Meninjau doa restu yang masuk, menyembunyikan pesan, atau menghapus ucapan spam.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS (Palet Earthy Warm Beige, Sage & Champagne Gold)
- **Animasi:** Framer Motion & Canvas Confetti
- **Ikon:** Lucide React
- **Basis Data & Realtime:** Supabase (PostgreSQL) dengan Row Level Security (RLS)
- **Audio API:** HTML5 Audio Context dengan Gesture Unlock
