'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ExternalLink, CalendarPlus } from 'lucide-react';
import { WeddingEvent } from '@/types';
import { createGoogleCalendarUrl, openDeviceCalendar } from '@/lib/calendar';

interface EventDetailsSectionProps {
  event: WeddingEvent;
}

export default function EventDetailsSection({ event }: EventDetailsSectionProps) {
  const handleAddToCalendar = () => {
    const calendarUrl = createGoogleCalendarUrl({
      title: `Pernikahan ${event.groom_nickname} & ${event.bride_nickname}`,
      description: `Undangan Pernikahan ${event.groom_name} & ${event.bride_name}. Bertempat di ${event.akad_venue}.`,
      location: event.akad_address,
      startDate: event.event_date || '2026-12-10T08:00:00+07:00',
      endDate: '2026-12-10T14:00:00+07:00',
    });
    window.open(calendarUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenMobileCalendar = () => {
    openDeviceCalendar({
      title: `Pernikahan ${event.groom_nickname} & ${event.bride_nickname}`,
      description: `Undangan Pernikahan ${event.groom_name} & ${event.bride_name}. Bertempat di ${event.akad_venue}.`,
      location: event.akad_address,
      startDate: event.event_date || '2026-12-10T08:00:00+07:00',
      endDate: '2026-12-10T14:00:00+07:00',
    });
  };

  return (
    <section className="py-24 px-4 bg-earth-beige relative">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-widest text-earth-sage-dark font-medium">
            Rangkaian Acara
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-earth-charcoal">
            Waktu &amp; Tempat
          </h2>
          <p className="text-earth-sage-dark text-sm max-w-md mx-auto">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
          </p>
        </div>

        {/* Cards Akad & Resepsi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card Akad Nikah */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-earth-beige-soft/90 backdrop-blur rounded-3xl p-8 border border-earth-gold/30 shadow-card flex flex-col justify-between text-center relative overflow-hidden"
          >
            <div className="space-y-6">
              <div className="inline-block px-4 py-1.5 rounded-full bg-earth-charcoal text-earth-beige text-xs font-serif tracking-widest uppercase">
                {event.akad_title || 'Akad Nikah'}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-earth-charcoal font-medium text-sm">
                  <Calendar className="w-4 h-4 text-earth-gold" />
                  <span>{event.akad_date}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-earth-charcoal font-medium text-sm">
                  <Clock className="w-4 h-4 text-earth-gold" />
                  <span>{event.akad_time}</span>
                </div>
              </div>

              <div className="h-[1px] w-24 mx-auto bg-earth-gold/30" />

              <div className="space-y-1 text-sm">
                <p className="font-serif font-bold text-earth-charcoal text-base">
                  {event.akad_venue}
                </p>
                <p className="text-earth-sage-dark text-xs leading-relaxed max-w-xs mx-auto">
                  {event.akad_address}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-earth-charcoal/60 italic mt-6">
              *Diharapkan untuk hadir tepat waktu demi kekhidmatan prosesi akad.
            </p>
          </motion.div>

          {/* Card Resepsi */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-earth-beige-soft/90 backdrop-blur rounded-3xl p-8 border border-earth-gold/30 shadow-card flex flex-col justify-between text-center relative overflow-hidden"
          >
            <div className="space-y-6">
              <div className="inline-block px-4 py-1.5 rounded-full bg-earth-charcoal text-earth-beige text-xs font-serif tracking-widest uppercase">
                {event.reception_title || 'Resepsi Pernikahan'}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-earth-charcoal font-medium text-sm">
                  <Calendar className="w-4 h-4 text-earth-gold" />
                  <span>{event.reception_date}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-earth-charcoal font-medium text-sm">
                  <Clock className="w-4 h-4 text-earth-gold" />
                  <span>{event.reception_time}</span>
                </div>
              </div>

              <div className="h-[1px] w-24 mx-auto bg-earth-gold/30" />

              <div className="space-y-1 text-sm">
                <p className="font-serif font-bold text-earth-charcoal text-base">
                  {event.reception_venue}
                </p>
                <p className="text-earth-sage-dark text-xs leading-relaxed max-w-xs mx-auto">
                  {event.reception_address}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-earth-charcoal/60 italic mt-6">
              *Merupakan kehormatan bagi kami atas kehadiran Bapak/Ibu sekalian.
            </p>
          </motion.div>
        </div>

        {/* Action Buttons: Add to Calendar */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handleAddToCalendar}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-earth-charcoal text-earth-beige hover:bg-earth-sage text-xs font-medium tracking-wide shadow-soft transition-colors"
          >
            <CalendarPlus className="w-4 h-4 text-earth-gold" />
            <span>Simpan ke Google Calendar</span>
          </button>
          <button
            onClick={handleOpenMobileCalendar}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-earth-beige border border-earth-charcoal/20 text-earth-charcoal hover:bg-earth-beige-soft text-xs font-medium tracking-wide transition-colors"
          >
            <Calendar className="w-4 h-4 text-earth-gold" />
            <span>Kalender Bawaan Ponsel</span>
          </button>
        </div>

        {/* Peta Lokasi Google Maps Embed */}
        <div className="bg-earth-beige-soft rounded-3xl p-4 sm:p-6 border border-earth-gold/30 shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
            <div>
              <h3 className="font-serif text-lg text-earth-charcoal font-semibold">
                Petunjuk Lokasi Acara
              </h3>
              <p className="text-xs text-earth-sage-dark">
                Puri Suryalaya Wedding House, Lengkong, Kota Bandung
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={event.maps_direct_url || 'https://maps.app.goo.gl/b5ua5CTfg7ke4fLK9'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-earth-charcoal text-earth-beige hover:bg-earth-sage text-xs font-medium transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-earth-gold" />
                <span>Buka Google Maps</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </div>
          </div>

          <div className="w-full h-72 sm:h-80 rounded-2xl overflow-hidden border border-earth-gold/20 relative">
            <iframe
              src={event.maps_embed_url}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Peta Lokasi Pernikahan"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

