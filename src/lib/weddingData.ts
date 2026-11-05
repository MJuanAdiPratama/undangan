/**
 * ==============================================================================
 * PUSAT PENGATURAN KATA-KATA, TANGGAL, LOKASI, REKENING & FOTO UNDANGAN
 * ==============================================================================
 */

export interface WeddingData {
  groom: {
    fullName: string;
    nickName: string;
    fatherName: string;
    motherName: string;
    instagram: string;
    photo: string;
  };
  bride: {
    fullName: string;
    nickName: string;
    fatherName: string;
    motherName: string;
    instagram: string;
    photo: string;
  };
  quote: {
    text: string;
    source: string;
  };
  eventDateIso: string;
  akad: {
    title: string;
    date: string;
    time: string;
    venue: string;
    address: string;
  };
  reception: {
    title: string;
    date: string;
    time: string;
    venue: string;
    address: string;
  };
  maps: {
    embedUrl: string;
    googleMapsUrl: string;
  };
  gifts: {
    bankAccounts: Array<{
      bankName: string;
      accountNumber: string;
      holderName: string;
    }>;
    qrisImage: string;
    shippingAddress: string;
  };
  audio: {
    title: string;
    src: string;
  };
  stories: Array<{
    date: string;
    title: string;
    description: string;
    image: string;
  }>;
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
    fullName: 'Arya Pratama, S.T.',
    nickName: 'Arya',
    fatherName: 'Bapak Hendra Kusuma',
    motherName: 'Ibu Dewi Anggraeni',
    instagram: 'aryapratama',
    photo: '/img/groom.jpg',
  },
  bride: {
    fullName: 'Adelia Larasati, S.Ds.',
    nickName: 'Adelia',
    fatherName: 'Bapak Bambang Sutedjo',
    motherName: 'Ibu Sri Wahyuni',
    instagram: 'adelialarasati',
    photo: '/img/bride.jpg',
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
        accountNumber: '8690123456',
        holderName: 'Arya Pratama',
      },
      {
        bankName: 'Mandiri',
        accountNumber: '1370012345678',
        holderName: 'Arya Pratama',
      },
    ],
    qrisImage: '/img/qris.svg',
    shippingAddress:
      'Jalan Dago Asri No. 28, Dago, Kec. Coblong, Kota Bandung 40135 (Penerima: Arya & Adelia / 081234567890)',
  },

  // 8. AUDIO LATAR
  audio: {
    title: 'Tulus - Perahu Kertas',
    src: '/audio/wedding-song.mp3',
  },

  // 9. KISAH CINTA (TIMELINE)
  stories: [
    {
      date: '24 September 2020',
      title: 'Awal Pertemuan',
      description:
        'Pertemuan sederhana di sudut kedai kopi Bandung saat senja menyapa. Percakapan hangat yang tak disengaja perlahan menumbuhkan rasa saling mengagumi.',
      image: '/img/story-1.jpg',
    },
    {
      date: '15 Juli 2022',
      title: 'Menjalin Komitmen',
      description:
        'Setelah melewati proses kedewasaan dan saling memahami visi kehidupan, kami memantapkan niat tulus untuk saling menjaga dan melangkah bersama.',
      image: '/img/story-2.jpg',
    },
    {
      date: '18 Agustus 2025',
      title: 'Hari Pertunangan',
      description:
        'Dengan doa restu dan kehangatan kedua keluarga besar, kami mengikat janji suci pertunangan untuk menyatukan dua keluarga dalam silaturahmi abadi.',
      image: '/img/story-3.jpg',
    },
    {
      date: '10 Desember 2026',
      title: 'Menuju Babak Baru',
      description:
        'InsyaAllah ikrar suci pernikahan akan kami ucapkan, memulai perjalanan ibadah terpanjang untuk membangun keluarga yang sakinah, mawaddah, dan warahmah.',
      image: '/img/story-4.jpg',
    },
  ],

  // 10. GALERI FOTO (UNSPLASH FINE-ART)
  gallery: [
    {
      id: 'p-1',
      src: '/img/gallery-1.jpg',
      caption: 'Jalinan Kasih dalam Kehangatan Nuansa Alam',
      aspectRatio: 'portrait',
    },
    {
      id: 'p-2',
      src: '/img/gallery-2.jpg',
      caption: 'Langkah Beriringan Menatap Masa Depan Bersama',
      aspectRatio: 'square',
    },
    {
      id: 'p-3',
      src: '/img/gallery-3.jpg',
      caption: 'Senyuman Penuh Syukur Menyambut Hari Bahagia',
      aspectRatio: 'portrait',
    },
    {
      id: 'p-4',
      src: '/img/gallery-4.jpg',
      caption: 'Keindahan Momen Romantis di Bawah Langit Senja',
      aspectRatio: 'wide',
    },
    {
      id: 'p-5',
      src: '/img/gallery-5.jpg',
      caption: 'Harmoni Jiwa dalam Kesederhanaan Cinta yang Tulus',
      aspectRatio: 'square',
    },
    {
      id: 'p-6',
      src: '/img/gallery-6.jpg',
      caption: 'Ikatan Janji Abadi Menuju Mahligai Rumah Tangga',
      aspectRatio: 'square',
    },
  ],
};
