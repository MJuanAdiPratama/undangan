'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MailOpen, Heart, Sparkles } from 'lucide-react';
import { useAudio } from '../audio/AudioContext';

interface CoverOverlayProps {
  guestName?: string;
  groomNickname: string;
  brideNickname: string;
  weddingDate: string;
  onOpen?: () => void;
}

export default function CoverOverlay({
  guestName = 'Tamu Undangan Terhormat',
  groomNickname,
  brideNickname,
  weddingDate,
  onOpen,
}: CoverOverlayProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { playAudio } = useAudio();

  const handleOpenInvitation = async () => {
    // Trigger audio autoplay via user interaction gesture
    await playAudio();
    setIsOpen(true);
    if (onOpen) onOpen();
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          exit={{
            opacity: 0,
            y: '-100%',
            transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-earth-beige overflow-hidden select-none"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(247, 243, 235, 0.8) 0%, rgba(235, 227, 218, 0.9) 100%), url('/img/bg.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Subtle Golden Border / Frame */}
          <div className="absolute inset-4 sm:inset-8 border border-earth-gold/40 pointer-events-none rounded-lg" />
          <div className="absolute inset-6 sm:inset-10 border border-earth-sage/30 pointer-events-none rounded-sm" />

          {/* Konten Utama */}
          <div className="relative z-10 max-w-lg mx-auto px-6 py-10 text-center flex flex-col items-center justify-between min-h-[80vh]">
            {/* Header Sapaan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="space-y-2"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-earth-gold/40 bg-earth-beige/80 text-earth-charcoal text-xs tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5 text-earth-gold" />
                <span>The Wedding of</span>
                <Sparkles className="w-3.5 h-3.5 text-earth-gold" />
              </div>
            </motion.div>

            {/* Nama Mempelai */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="my-auto py-6 space-y-3"
            >
              <h1 className="font-serif text-4xl sm:text-6xl text-earth-charcoal tracking-wide leading-tight">
                {groomNickname} <span className="font-script text-3xl sm:text-5xl text-earth-gold mx-1">&</span> {brideNickname}
              </h1>

              {/* Garis Aksen Halus */}
              <div className="flex items-center justify-center gap-3 py-1">
                <div className="h-[1px] w-12 bg-earth-gold/50" />
                <Heart className="w-3.5 h-3.5 text-earth-gold fill-earth-gold/20" />
                <div className="h-[1px] w-12 bg-earth-gold/50" />
              </div>

              <p className="text-sm font-sans tracking-widest uppercase text-earth-sage-dark font-medium">
                {weddingDate}
              </p>
            </motion.div>

            {/* Kotak Tamu & Tombol Buka Undangan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="w-full space-y-5"
            >
              <div className="bg-earth-beige/90 backdrop-blur-sm border border-earth-gold/30 rounded-2xl p-5 shadow-soft">
                <p className="text-xs uppercase tracking-wider text-earth-sage-dark font-medium mb-1">
                  Kepada Yth. Bapak/Ibu/Saudara/i:
                </p>
                <h2 className="font-serif text-xl sm:text-2xl text-earth-charcoal font-semibold tracking-wide">
                  {guestName}
                </h2>
                <p className="text-[11px] text-earth-charcoal/60 mt-1 italic">
                  *Mohon maaf bila ada kesalahan dalam penulisan nama/gelar
                </p>
              </div>

              {/* Tombol Buka Undangan */}
              <button
                onClick={handleOpenInvitation}
                className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-earth-charcoal text-earth-beige hover:bg-earth-sage text-sm font-medium tracking-wide shadow-elevated transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <MailOpen className="w-4 h-4 text-earth-gold group-hover:rotate-12 transition-transform duration-300" />
                <span>Buka Undangan</span>
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
