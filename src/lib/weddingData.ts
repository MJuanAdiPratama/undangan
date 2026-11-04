/**
 * ==============================================================================
 * PUSAT PENGATURAN KATA-KATA, TANGGAL, LOKASI, REKENING & FOTO UNDANGAN
 * ==============================================================================
 * Anda dapat mengubah semua kata-kata, nama mempelai, tanggal acara, lokasi,
 * nomor rekening, dan foto pernikahan langsung pada file ini!
 */

export interface WeddingData {
  // 1. DATA PENGANTIN
  groom: {
    fullName: string;
    nickName: string;
    fatherName: string;
    motherName: string;
    instagram: string;
    photo: string; // Lokasi file foto pengantin pria di folder public/img/
  };
  bride: {
    fullName: string;
    nickName: string;
    fatherName: string;
    motherName: string;
    instagram: string;
    photo: string; // Lokasi file foto pengantin wanita di folder public/img/
  };

  // 2. KUTIPAN / AYAT SUCI
  quote: {
    text: string;
    source: string;
  };

  // 3. JADWAL HARI-H (Digunakan untuk Countdown Timer)
  eventDateIso: string; // Format: TAHUN-BULAN-HARI Jam:Menit:Detik

  // 4. DETAIL ACARA AKAD NIKAH
  akad: {
    title: string;
    date: string;
    time: string;
    venue: string;
    address: string;
  };

  // 5. DETAIL ACARA RESEPSI
  reception: {
    title: string;
    date: string;
    time: string;
    venue: string;
    address: string;
  };

  // 6. PETA & LOKASI
  maps: {
    embedUrl: string; // URL iframe dari Google Maps
    googleMapsUrl: string; // Link yang membuka aplikasi Google Maps di HP
  };

  // 7. HADIAH DIGITAL & NOMOR REKENING
  gifts: {
    bankAccounts: Array<{
      bankName: string;
      accountNumber: string;
      holderName: string;
    }>;
    qrisImage: string; // Foto QRIS/DANA di folder public/img/
    shippingAddress: string; // Alamat untuk kirim kado fisik
  };

  // 8. MUSIK LATAR
  audio: {
    title: string;
    src: string; // File lagu di folder public/audio/
  };

  // 9. KISAH CINTA (LOVE STORY)
  stories: Array<{
    date: string;
    title: string;
    description: string;
    image: string;
  }>;

  // 10. GALERI FOTO
  gallery: Array<{
    id: string;
    src: string;
    caption: string;
    aspectRatio: 'square' | 'portrait' | 'wide';
  }>;
}

export const weddingData: WeddingData = {
  // 1. DATA PENGANTIN
  groom: {
    fullName: 'M Juan Adi Pratama',
    nickName: 'Juan',
    fatherName: 'Bapak Lorem',
    motherName: 'Ibu Ipsum',
    instagram: 'qxuan.03',
    photo: '/img/juan.jpeg',
  },
  bride: {
    fullName: 'Nadya Una',
    nickName: 'Una',
    fatherName: 'Bapak Situmorang',
    motherName: 'Ibu Rahayu',
    instagram: 'nadyauna',
    photo: '/img/una.jpeg',
  },

  // 2. KUTIPAN / AYAT SUCI
  quote: {
    text: 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
    source: 'QS. Ar-Rum: 21',
  },

  // 3. JADWAL HARI-H (UNTUK COUNTDOWN)
  eventDateIso: '2026-12-10T08:00:00+07:00',

  // 4. DETAIL AKAD NIKAH
  akad: {
    title: 'Akad Nikah',
    date: 'Minggu, 10 Desember 2026',
    time: '08:00 - 10:00 WIB',
    venue: 'Puri Suryalaya Wedding House',
    address: 'Jl. Soekarno Hatta No.487, Cijagra, Kec. Lengkong, Kota Bandung',
  },

  // 5. DETAIL RESEPSI
  reception: {
    title: 'Resepsi Pernikahan',
    date: 'Minggu, 10 Desember 2026',
    time: '11:00 WIB - Selesai',
    venue: 'Puri Suryalaya Wedding House',
    address: 'Jl. Soekarno Hatta No.487, Cijagra, Kec. Lengkong, Kota Bandung',
  },

  // 6. PETA & LOKASI
  maps: {
    embedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.627786438096!2d107.63259837587635!3d-6.935003367885758!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e85e33e27241%3A0xdce793b8f2be67cc!2sPuri%20Suryalaya%20Wedding%20House!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
    googleMapsUrl: 'https://maps.app.goo.gl/b5ua5CTfg7ke4fLK9',
  },

  // 7. REKENING & HADIAH DIGITAL
  gifts: {
    bankAccounts: [
      {
        bankName: 'BCA',
        accountNumber: '1234567890',
        holderName: 'M Juan Adi Pratama',
      },
      {
        bankName: 'Mandiri',
        accountNumber: '9876543210123',
        holderName: 'M Juan Adi Pratama',
      },
    ],
    qrisImage: '/img/dana.jpeg',
    shippingAddress:
      'Jl. Soekarno Hatta No.487, Cijagra, Kec. Lengkong, Kota Bandung 40265 (Penerima: Juan & Una / 081293066707)',
  },

  // 8. AUDIO LATAR
  audio: {
    title: 'Tulus - Perahu Kertas',
    src: '/audio/wedding-song.mp3',
  },

  // 9. KISAH CINTA (TIMELINE)
  stories: [
    {
      date: '20 September 2019',
      title: 'Pertemuan Pertama',
      description:
        'Dipertemukan dalam sebuah kegiatan kampus yang tak terduga. Sapaan singkat yang menjadi awal perjalanan panjang penuh rasa dan asa.',
      image: '/img/gunung2.jpg',
    },
    {
      date: '20 Juni 2020',
      title: 'Memulai Komitmen',
      description:
        'Setelah banyak diskusi dan saling memahami visi hidup, kami memutuskan untuk saling menjaga hati dan melangkah bersama dengan niat yang tulus.',
      image: '/img/gallery/una.jpg',
    },
    {
      date: '20 Agustus 2022',
      title: 'Hari Pertunangan',
      description:
        'Di hadapan kedua keluarga besar, kami mengikat janji suci pertunangan untuk menyatukan dua keluarga dalam jalinan silaturahmi yang abadi.',
      image: '/img/gallery/vonzy.jpg',
    },
    {
      date: '10 Desember 2026',
      title: 'Menuju Babak Baru',
      description:
        'InsyaAllah ikrar suci pernikahan akan mengantarkan kami menuju gerbang ibadah terpanjang, sakinah, mawaddah, dan warahmah.',
      image: '/img/images.jpg',
    },
  ],

  // 10. GALERI FOTO
  gallery: [
    {
      id: 'p-1',
      src: '/img/images.jpg',
      caption: 'Momen Hangat Bersama di Alam Terbuka',
      aspectRatio: 'portrait',
    },
    {
      id: 'p-2',
      src: '/img/gallery/una.jpg',
      caption: 'Senyuman Tulus Menatap Masa Depan',
      aspectRatio: 'square',
    },
    {
      id: 'p-3',
      src: '/img/gallery/vonzy.jpg',
      caption: 'Langkah Awal Menuju Janji Abadi',
      aspectRatio: 'portrait',
    },
    {
      id: 'p-4',
      src: '/img/gunung2.jpg',
      caption: 'Kedamaian di Antara Bukit Hijau',
      aspectRatio: 'wide',
    },
    {
      id: 'p-5',
      src: '/img/juan.jpeg',
      caption: 'Potret Sang Mempelai Pria',
      aspectRatio: 'square',
    },
    {
      id: 'p-6',
      src: '/img/una.jpeg',
      caption: 'Pesona Anggun Sang Mempelai Wanita',
      aspectRatio: 'square',
    },
  ],
};
