'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  groomNickname: string;
  brideNickname: string;
  eventDate: string; // ISO string
  dateDisplay: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function HeroSection({
  groomNickname,
  brideNickname,
  eventDate,
  dateDisplay,
}: HeroSectionProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date(eventDate).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [eventDate]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-20 bg-earth-beige overflow-hidden">
      {/* Background Floral/Texture Overlay */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `url('/img/bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto space-y-8">
        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 text-earth-sage-dark tracking-widest text-xs uppercase font-medium"
        >
          <Sparkles className="w-3.5 h-3.5 text-earth-gold" />
          <span>Walimatul Ursy</span>
          <Sparkles className="w-3.5 h-3.5 text-earth-gold" />
        </motion.div>

        {/* Hero Photo Arch Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto w-48 h-64 sm:w-56 sm:h-72 rounded-t-[120px] rounded-b-2xl overflow-hidden shadow-elevated border-4 border-earth-beige-soft ring-1 ring-earth-gold/40"
        >
          <Image
            src="/img/hero.jpg"
            alt={`${groomNickname} & ${brideNickname}`}
            fill
            className="object-cover object-top"
            priority
          />
        </motion.div>

        {/* Title Mempelai */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="space-y-2"
        >
          <h1 className="font-serif text-4xl sm:text-6xl text-earth-charcoal tracking-wide">
            {groomNickname} <span className="font-script text-4xl sm:text-6xl text-earth-gold">&</span> {brideNickname}
          </h1>
          <p className="text-earth-sage-dark text-sm sm:text-base font-sans tracking-wide">
            {dateDisplay} • Bandung, Jawa Barat
          </p>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto pt-4"
        >
          {[
            { label: 'Hari', value: timeLeft.days },
            { label: 'Jam', value: timeLeft.hours },
            { label: 'Menit', value: timeLeft.minutes },
            { label: 'Detik', value: timeLeft.seconds },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-earth-beige-soft/80 backdrop-blur border border-earth-gold/30 rounded-2xl p-3 sm:p-4 shadow-soft flex flex-col items-center"
            >
              <span className="font-serif text-2xl sm:text-3xl font-bold text-earth-charcoal">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs text-earth-sage-dark uppercase tracking-wider font-medium mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

