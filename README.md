# Undangan Pernikahan Digital
> **by skywannn wedding**

Aplikasi web Undangan Pernikahan Digital dengan konsep desain *Editorial & Handcrafted Fine-Art*. Dilengkapi musik latar otomatis (*gesture trigger*), galeri foto interaktif, form RSVP & wall ucapan real-time, pengingat Google Calendar & kalender ponsel, serta Dashboard Pengantin.

---

## 📌 Panduan: Di File Mana Mengubah Kata, Kalimat & Foto?

Untuk memudahkan Anda mengubah seluruh isi undangan, seluruh data telah dipusatkan pada file berikut:

### 1. Mengubah Kata-Kata, Nama Mempelai, Tanggal, Lokasi & Rekening
👉 **File: `src/lib/weddingData.ts`** *(atau `src/lib/supabase.ts`)*
Buka file tersebut, Anda dapat langsung mengganti:
- **Nama Pengantin Pria & Wanita:** Bagian `groom` dan `bride` (nama lengkap, panggilan, nama ayah & ibu, akun Instagram).
- **Kutipan / Doa:** Bagian `quote` (teks ayat suci dan sumbernya).
- **Tanggal Hari-H & Hitung Mundur:** Bagian `eventDateIso`.
- **Jadwal Akad & Resepsi:** Bagian `akad` dan `reception` (hari, tanggal, jam, nama gedung, dan alamat lengkap).
- **Tautan Google Maps:** Bagian `maps` (link Google Maps).
- **Nomor Rekening & Hadiah Digital:** Bagian `gifts` (nama bank, nomor rekening, nama pemilik, dan alamat pengiriman kado).
- **Kisah Cinta (Love Story):** Bagian `stories` (tanggal momen, judul, dan cerita pertemuan).
- **Takarir Galeri Foto:** Bagian `gallery` (caption foto).

### 2. Mengubah Foto & Musik
Semua file media tersimpan di dalam folder **`public/`**:
- **Foto Utama Mempelai (Hero):** Ganti file `public/img/images.jpg`
- **Foto Pengantin Pria:** Ganti file `public/img/juan.jpeg`
- **Foto Pengantin Wanita:** Ganti file `public/img/una.jpeg`
- **Foto Gambar QRIS / DANA:** Ganti file `public/img/dana.jpeg`
- **Foto-Foto Galeri:** Simpan di dalam folder `public/img/gallery/`
- **Musik Latar Undangan:** Ganti file lagu MP3 di `public/audio/wedding-song.mp3`

*(Tips: Jika Anda mengganti foto dengan file foto Anda sendiri, pastikan nama filenya disamakan atau perbarui nama jalurnya di file `src/lib/weddingData.ts`).*

---

## 🚀 Alur Kerja & Penyebaran Undangan (Anti-Ribet)

Anda memiliki **2 cara praktis** untuk menyebarkan undangan ke tamu:

### Cara 1: Satu Link Utama untuk Ribuan Tamu (Sangat Direkomendasikan)
Cukup bagikan link utama website Anda ke grup WhatsApp keluarga, rekan kerja, alumni, dll:
```text
https://domain-anda.com/
```
- **Sapaan di Cover:** Menampilkan sapaan sopan: *"Kepada Yth. Bapak/Ibu/Saudara/i Tamu Undangan"*.
- **RSVP Otomatis:** Tamu mengetik nama mereka sendiri saat mengisi konfirmasi kehadiran dan ucapan.
- **Hasil:** Konfirmasi kehadiran dan ucapan mereka langsung otomatis masuk ke tabel RSVP dan rekap porsi katering di Dashboard Pengantin. Anda **tidak perlu menginput nama tamu satu per satu**!

### Cara 2: Link Personal Otomatis Tanpa Input Database
Jika ingin nama tamu tertentu langsung tertulis di cover pembuka saat mereka membuka link:
Cukup tambahkan `?to=Nama+Tamu` di ujung link:
```text
https://domain-anda.com/?to=Bapak+Joko+Santoso
```
Cover otomatis tertulis *"Kepada Yth. Bapak/Ibu/Saudara/i Bapak Joko Santoso"* dan kolom nama di form RSVP langsung terisi secara instan!

---

## 🔐 Cara Mengakses Dashboard Pengantin

Untuk menjaga keindahan visual undangan, **tidak ada tombol login admin di halaman publik**. 
Halaman undangan tetap bersih dan murni untuk para tamu.

- **Cara Masuk ke Dashboard:**  
  Buka langsung alamat URL berikut di browser Anda:
  ```text
  https://domain-anda.com/admin
  ```
- **PIN Keamanan Default:** `123456`
- **Fitur Dashboard:**
  1. **Salin Teks WhatsApp:** Teks broadcast siap sebar dalam 1 klik.
  2. **Rekap RSVP & Porsi:** Memantau jumlah tamu hadir dan total porsi katering yang dibutuhkan.
  3. **Moderasi Ucapan:** Menampilkan, menyembunyikan, atau menghapus ucapan spam.

---

## 💻 Menjalankan di Komputer Lokal

1. **Jalankan Aplikasi:**
   ```bash
   npm run dev
   ```
2. Buka browser pada alamat:
   - Undangan Tamu: `http://localhost:3000`
   - Dashboard Pengantin: `http://localhost:3000/admin`
