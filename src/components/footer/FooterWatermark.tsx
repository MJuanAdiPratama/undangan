'use client';

import React from 'react';
import { Heart } from 'lucide-react';

interface FooterWatermarkProps {
  groomNickname: string;
  brideNickname: string;
}

export default function FooterWatermark({
  groomNickname,
  brideNickname,
}: FooterWatermarkProps) {
  return (
    <footer className="bg-earth-charcoal text-earth-beige py-16 px-4 text-center relative overflow-hidden select-none">
      <div className="max-w-md mx-auto space-y-6">
        {/* Nama Mempelai di Footer */}
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-earth-sage-light font-medium">
            Sampai Jumpa di Hari Bahagia
          </p>
          <h4 className="font-serif text-2xl sm:text-3xl text-earth-beige tracking-wide">
            {groomNickname} <span className="font-script text-2xl sm:text-3xl text-earth-gold">&amp;</span> {brideNickname}
          </h4>
        </div>

        {/* Garis Aksen Emas */}
        <div className="flex items-center justify-center gap-3">
          <div className="h-[1px] w-12 bg-earth-gold/40" />
          <Heart className="w-3.5 h-3.5 text-earth-gold fill-earth-gold/30" />
          <div className="h-[1px] w-12 bg-earth-gold/40" />
        </div>

        {/* Ucapan Penutup */}
        <p className="text-xs text-earth-beige/70 max-w-xs mx-auto leading-relaxed">
          Keluarga Besar Kedua Mempelai mengucapkan terima kasih yang tulus atas doa dan kehadiran Bapak/Ibu/Saudara/i.
        </p>

        {/* Watermark Wajib: by skywannn wedding */}
        <div className="pt-6 border-t border-earth-beige/10">
          <p className="text-[11px] tracking-widest uppercase font-serif text-earth-gold-light/90">
            by skywannn wedding
          </p>
          <p className="text-[9px] text-earth-beige/40 mt-1">
            Handcrafted Fine-Art Digital Invitation &bull; All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}

