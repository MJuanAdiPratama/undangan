'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CreditCard, Copy, Check, Gift, QrCode, MapPin } from 'lucide-react';
import { WeddingEvent } from '@/types';
import { useNotification } from '@/components/ui/NotificationContext';

interface GiftSectionProps {
  event: WeddingEvent;
}

export default function GiftSection({ event }: GiftSectionProps) {
  const { showToast } = useNotification();
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleCopyAccount = (bankName: string, accountNumber: string) => {
    navigator.clipboard.writeText(accountNumber);
    setCopiedAccount(accountNumber);
    showToast(`Nomor rekening ${bankName} (${accountNumber}) berhasil disalin!`, 'success', 'Tersalin');
    setTimeout(() => setCopiedAccount(null), 3000);
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(true);
    showToast('Alamat penerima kado berhasil disalin ke clipboard!', 'success', 'Tersalin');
    setTimeout(() => setCopiedAddress(false), 3000);
  };

  return (
    <section className="py-24 px-4 bg-earth-beige relative">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-widest text-earth-sage-dark font-medium">
            Tanda Kasih
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-earth-charcoal">
            Amplop Digital &amp; Kado
          </h2>
          <p className="text-earth-sage-dark text-sm max-w-md mx-auto">
            Doa restu Anda merupakan karunia terindah bagi kami. Namun jika Anda ingin memberikan tanda kasih, kami menyediakan amplop digital di bawah ini:
          </p>
        </div>

        {/* Bank & QRIS Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Rekening Bank */}
          <div className="space-y-4">
            {event.bank_accounts.map((acc, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-earth-beige-soft rounded-3xl p-6 border border-earth-gold/30 shadow-card flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-earth-gold" />
                    <span className="font-serif font-bold text-earth-charcoal text-base tracking-wider uppercase">
                      Bank {acc.bank}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-earth-sage-dark font-semibold">
                    Transfer
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-earth-sage-dark">Nomor Rekening:</p>
                  <p className="font-mono text-xl sm:text-2xl font-bold text-earth-charcoal tracking-wider">
                    {acc.account_number}
                  </p>
                  <p className="text-xs text-earth-charcoal/80 font-medium">
                    a.n. {acc.account_holder}
                  </p>
                </div>

                <button
                  onClick={() => handleCopyAccount(acc.bank, acc.account_number)}
                  className="inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-earth-charcoal text-earth-beige hover:bg-earth-sage text-xs font-medium transition-colors"
                >
                  {copiedAccount === acc.account_number ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-earth-gold" />
                      <span>Nomor Rekening Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-earth-gold" />
                      <span>Salin Nomor Rekening</span>
                    </>
                  )}
                </button>
              </motion.div>
            ))}
          </div>

          {/* QRIS / DANA & Alamat Pengiriman */}
          <div className="space-y-4">
            {/* QRIS Card */}
            {event.qris_image_url && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-earth-beige-soft rounded-3xl p-6 border border-earth-gold/30 shadow-card text-center space-y-4"
              >
                <div className="flex items-center justify-center gap-2">
                  <QrCode className="w-5 h-5 text-earth-gold" />
                  <span className="font-serif font-bold text-earth-charcoal text-base">
                    QRIS / Dompet Digital
                  </span>
                </div>
                <div className="relative w-44 h-44 mx-auto bg-white p-2 rounded-2xl shadow-inner border border-earth-gold/20 flex items-center justify-center">
                  <Image
                    src={event.qris_image_url}
                    alt="QRIS Digital Gift"
                    width={160}
                    height={160}
                    className="object-contain"
                  />
                </div>
                <p className="text-[11px] text-earth-sage-dark">
                  Dapat dipindai melalui BCA, Mandiri, GoPay, OVO, ShopeePay, DANA, dan semua aplikasi perbankan berstandar QRIS.
                </p>
              </motion.div>
            )}

            {/* Kirim Kado Fisik */}
            {event.gift_address && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-earth-beige-soft rounded-3xl p-6 border border-earth-gold/30 shadow-card space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-earth-gold" />
                  <span className="font-serif font-bold text-earth-charcoal text-sm">
                    Kirim Kado Fisik ke Alamat
                  </span>
                </div>
                <p className="text-xs text-earth-charcoal/80 leading-relaxed">
                  {event.gift_address}
                </p>
                <button
                  onClick={() => handleCopyAddress(event.gift_address)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-earth-beige border border-earth-charcoal/20 text-earth-charcoal hover:bg-earth-beige-dark text-xs font-medium transition-colors"
                >
                  {copiedAddress ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-earth-gold" />
                      <span>Alamat Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-earth-gold" />
                      <span>Salin Alamat Penerima</span>
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

