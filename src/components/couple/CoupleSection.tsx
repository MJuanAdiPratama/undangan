'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Instagram, Heart } from 'lucide-react';
import { WeddingEvent } from '@/types';

interface CoupleSectionProps {
  event: WeddingEvent;
}

export default function CoupleSection({ event }: CoupleSectionProps) {
  return (
    <section className="py-24 px-4 bg-earth-beige-soft relative">
      <div className="max-w-4xl mx-auto text-center space-y-16">
        {/* Kutipan Suci */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto space-y-4 px-4"
        >
          <div className="flex justify-center items-center gap-3">
            <div className="h-[1px] w-12 bg-earth-gold/40" />
            <Heart className="w-4 h-4 text-earth-gold fill-earth-gold/20" />
            <div className="h-[1px] w-12 bg-earth-gold/40" />
          </div>
          <p className="font-serif italic text-earth-charcoal text-base sm:text-lg leading-relaxed">
            &ldquo;{event.quote_text}&rdquo;
          </p>
          <p className="text-xs uppercase tracking-widest text-earth-sage-dark font-semibold">
            — {event.quote_source}
          </p>
        </motion.div>

        {/* Header Mempelai */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="space-y-2"
        >
          <h2 className="font-serif text-3xl sm:text-4xl text-earth-charcoal">
            Pasangan Mempelai
          </h2>
          <p className="text-earth-sage-dark text-sm max-w-lg mx-auto">
            Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta&apos;ala, kami bermaksud menyelenggarakan syukuran pernikahan putra-putri kami:
          </p>
        </motion.div>

        {/* Profil Kedua Mempelai (Grid 2 Kolom) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 items-center">
          {/* Mempelai Pria */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center space-y-4"
          >
            <div className="relative w-44 h-56 rounded-t-full rounded-b-xl overflow-hidden shadow-card border-2 border-earth-gold/40">
              <Image
                src={event.groom_photo_url || '/img/juan.jpeg'}
                alt={event.groom_name}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-2xl text-earth-charcoal font-semibold">
                {event.groom_name}
              </h3>
              <p className="text-sm text-earth-sage-dark font-medium">
                Putra dari {event.groom_father} &amp; {event.groom_mother}
              </p>
            </div>
            {event.groom_instagram && (
              <a
                href={`https://instagram.com/${event.groom_instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-earth-charcoal hover:text-earth-sage font-medium bg-earth-beige px-3.5 py-1.5 rounded-full border border-earth-gold/30 transition-colors"
              >
                <Instagram className="w-3.5 h-3.5 text-earth-gold" />
                <span>@{event.groom_instagram}</span>
              </a>
            )}
          </motion.div>

          {/* Mempelai Wanita */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center space-y-4"
          >
            <div className="relative w-44 h-56 rounded-t-full rounded-b-xl overflow-hidden shadow-card border-2 border-earth-gold/40">
              <Image
                src={event.bride_photo_url || '/img/una.jpeg'}
                alt={event.bride_name}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-2xl text-earth-charcoal font-semibold">
                {event.bride_name}
              </h3>
              <p className="text-sm text-earth-sage-dark font-medium">
                Putri dari {event.bride_father} &amp; {event.bride_mother}
              </p>
            </div>
            {event.bride_instagram && (
              <a
                href={`https://instagram.com/${event.bride_instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-earth-charcoal hover:text-earth-sage font-medium bg-earth-beige px-3.5 py-1.5 rounded-full border border-earth-gold/30 transition-colors"
              >
                <Instagram className="w-3.5 h-3.5 text-earth-gold" />
                <span>@{event.bride_instagram}</span>
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

