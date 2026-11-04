'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, MessageSquare, Users, Sparkles, UserCheck, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { RsvpStatus, Wish } from '@/types';
import { supabase, isSupabaseConfigured, defaultWishes } from '@/lib/supabase';

interface RsvpSectionProps {
  initialGuestName?: string;
  guestId?: string;
}

export default function RsvpSection({
  initialGuestName = '',
  guestId,
}: RsvpSectionProps) {
  const [name, setName] = useState(initialGuestName);
  const [status, setStatus] = useState<RsvpStatus>('Hadir');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [wishes, setWishes] = useState<Wish[]>(defaultWishes);

  // Auto-fill nama jika props berubah dari URL
  useEffect(() => {
    if (initialGuestName) {
      setName(initialGuestName);
    }
  }, [initialGuestName]);

  // Load ucapan dari Supabase (dan dengarkan Realtime Subscriptions)
  useEffect(() => {
    const client = supabase;
    if (!isSupabaseConfigured || !client) {
      return;
    }

    const fetchWishes = async () => {
      const { data, error } = await client
        .from('wishes')
        .select('*')
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .limit(50);

      if (data && !error) {
        setWishes(data as Wish[]);
      }
    };

    fetchWishes();

    // Setup Realtime Subscription
    const channel = client
      .channel('public:wishes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'wishes' },
        (payload) => {
          const newWish = payload.new as Wish;
          if (newWish.is_visible) {
            setWishes((prev) => [newWish, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Silakan isi nama Anda.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Panggil API Route untuk rate limiting & sanitasi server-side
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guest_id: guestId,
          name,
          status,
          guest_count: guestCount,
          message,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Gagal mengirim konfirmasi');
      }

      // Selebrasi konfeti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#D4AF37', '#8A9A86', '#2C3E35', '#FDFBF7'],
        });
      } catch (err) {
        // Abaikan jika env test
      }

      setSubmitted(true);

      // Jika ada pesan, update langsung feed ucapan lokal agar instan
      if (message.trim()) {
        const optimisticWish: Wish = {
          id: 'temp-' + Date.now(),
          name,
          relationship: status === 'Hadir' ? 'Hadir' : 'Memberi Doa',
          message,
          is_visible: true,
          created_at: new Date().toISOString(),
        };
        setWishes((prev) => [optimisticWish, ...prev]);
      }

      setMessage('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Terjadi kesalahan. Silakan coba lagi.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="py-24 px-4 bg-earth-beige-soft relative">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-widest text-earth-sage-dark font-medium">
            Reservasi &amp; Ucapan
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-earth-charcoal">
            Konfirmasi Kehadiran
          </h2>
          <p className="text-earth-sage-dark text-sm max-w-md mx-auto">
            Doa restu dan konfirmasi kehadiran Bapak/Ibu/Saudara/i sangat berarti bagi kelancaran hari bahagia kami.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Kolom Kiri: Form RSVP */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 bg-earth-beige rounded-3xl p-6 sm:p-8 border border-earth-gold/30 shadow-card"
          >
            {submitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-earth-sage/20 rounded-full flex items-center justify-center mx-auto text-earth-sage-dark">
                  <CheckCircle2 className="w-8 h-8 text-earth-sage-dark" />
                </div>
                <h3 className="font-serif text-2xl text-earth-charcoal font-semibold">
                  Terima Kasih Banyak!
                </h3>
                <p className="text-xs sm:text-sm text-earth-sage-dark max-w-xs mx-auto leading-relaxed">
                  Konfirmasi kehadiran dan untaian doa Anda telah kami terima dengan penuh rasa syukur.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="inline-flex items-center gap-1.5 text-xs text-earth-charcoal hover:text-earth-sage font-medium underline underline-offset-4 pt-2"
                >
                  Kirim tanggapan / ucapan lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                    {errorMessage}
                  </div>
                )}

                {/* Input Nama */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-earth-charcoal uppercase tracking-wider">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-4 py-2.5 rounded-xl border border-earth-gold/30 bg-earth-beige-soft text-earth-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-earth-gold/50"
                  />
                </div>

                {/* Konfirmasi Kehadiran */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-earth-charcoal uppercase tracking-wider">
                    Konfirmasi Kehadiran
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Hadir', 'Tidak Hadir', 'Masih Ragu'] as RsvpStatus[]).map(
                      (st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setStatus(st)}
                          className={`py-2 px-2 rounded-xl text-xs font-medium border transition-colors ${
                            status === st
                              ? 'bg-earth-charcoal text-earth-beige border-earth-charcoal shadow-sm'
                              : 'bg-earth-beige-soft text-earth-charcoal/80 border-earth-gold/20 hover:bg-earth-beige'
                          }`}
                        >
                          {st}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Jumlah Tamu (Tampil jika hadir) */}
                {status === 'Hadir' && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-earth-charcoal uppercase tracking-wider">
                      Jumlah Kehadiran (Porsi)
                    </label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-earth-gold/30 bg-earth-beige-soft text-earth-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-earth-gold/50"
                    >
                      <option value={1}>1 Orang</option>
                      <option value={2}>2 Orang</option>
                      <option value={3}>3 Orang</option>
                      <option value={4}>4 Orang</option>
                      <option value={5}>5 Orang</option>
                    </select>
                  </div>
                )}

                {/* Pesan / Doa */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-earth-charcoal uppercase tracking-wider">
                    Untaian Doa &amp; Pesan
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tuliskan ucapan selamat atau doa restu untuk kedua mempelai..."
                    className="w-full px-4 py-2.5 rounded-xl border border-earth-gold/30 bg-earth-beige-soft text-earth-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-earth-gold/50 resize-none"
                  />
                </div>

                {/* Tombol Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-earth-charcoal text-earth-beige hover:bg-earth-sage font-medium text-sm tracking-wide shadow-soft transition-colors disabled:opacity-60"
                >
                  <Send className="w-4 h-4 text-earth-gold" />
                  <span>{isSubmitting ? 'Mengirim...' : 'Kirim Konfirmasi & Doa'}</span>
                </button>
              </form>
            )}
          </motion.div>

          {/* Kolom Kanan: Wall Ucapan Realtime */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 bg-earth-beige rounded-3xl p-6 sm:p-8 border border-earth-gold/30 shadow-card flex flex-col h-[520px]"
          >
            <div className="flex items-center justify-between pb-4 border-b border-earth-gold/20 mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-earth-gold" />
                <h3 className="font-serif text-lg text-earth-charcoal font-semibold">
                  Untaian Doa &amp; Harapan
                </h3>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-earth-sage-light text-earth-charcoal font-medium">
                {wishes.length} Pesan
              </span>
            </div>

            {/* Scrollable Wishes Feed */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {wishes.length === 0 ? (
                <p className="text-center text-xs text-earth-charcoal/60 py-16 italic">
                  Belum ada ucapan. Jadilah yang pertama memberikan doa restu!
                </p>
              ) : (
                wishes.map((w) => (
                  <div
                    key={w.id}
                    className="p-3.5 rounded-2xl bg-earth-beige-soft border border-earth-gold/20 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Avatar Inisial */}
                        <div className="w-7 h-7 rounded-full bg-earth-charcoal text-earth-beige text-xs font-semibold flex items-center justify-center font-serif">
                          {w.name ? w.name.charAt(0).toUpperCase() : 'T'}
                        </div>
                        <span className="font-serif text-xs font-bold text-earth-charcoal">
                          {w.name}
                        </span>
                      </div>
                      {w.relationship && (
                        <span className="text-[10px] text-earth-sage-dark font-medium px-2 py-0.5 rounded-full bg-earth-beige">
                          {w.relationship}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-earth-charcoal/80 leading-relaxed pl-9">
                      {w.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
