'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { weddingData } from '@/lib/weddingData';

const defaultPhotos = weddingData.gallery;

export default function GallerySection() {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
    try {
      window.history.pushState({ modal: 'lightbox' }, '', window.location.href);
    } catch (e) {
      // Abaikan jika env test
    }
  };

  const closeLightbox = () => {
    setActivePhotoIndex(null);
    try {
      if (window.history.state && window.history.state.modal === 'lightbox') {
        window.history.back();
      }
    } catch (e) {
      // Abaikan jika env test
    }
  };

  // Tangani tombol back di HP saat lightbox sedang terbuka
  useEffect(() => {
    const handlePopState = () => {
      if (activePhotoIndex !== null) {
        setActivePhotoIndex(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [activePhotoIndex]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((prev) =>
        prev === 0 ? defaultPhotos.length - 1 : (prev as number) - 1
      );
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((prev) =>
        prev === defaultPhotos.length - 1 ? 0 : (prev as number) + 1
      );
    }
  };

  return (
    <section className="py-24 px-4 bg-earth-beige relative">
      <div className="max-w-5xl mx-auto space-y-16">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-widest text-earth-sage-dark font-medium">
            Dokumentasi Cinta
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-earth-charcoal">
            Galeri Momen Bahagia
          </h2>
          <p className="text-earth-sage-dark text-sm max-w-md mx-auto">
            Setiap detik yang kami lalui terangkum dalam bingkai kenangan penuh rasa syukur.
          </p>
        </div>

        {/* Asymmetric Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {defaultPhotos.map((photo, idx) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              onClick={() => openLightbox(idx)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-card bg-earth-beige-soft border border-earth-gold/20 break-inside-avoid"
            >
              <div
                className={`relative w-full ${
                  photo.aspectRatio === 'portrait'
                    ? 'h-80'
                    : photo.aspectRatio === 'wide'
                    ? 'h-48'
                    : 'h-64'
                }`}
              >
                <Image
                  src={photo.src}
                  alt={photo.caption}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-earth-charcoal/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-earth-beige/90 backdrop-blur-sm p-3 rounded-full text-earth-charcoal shadow-soft transform scale-75 group-hover:scale-100 transition-transform">
                    <Eye className="w-5 h-5 text-earth-charcoal" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal Popup */}
      <AnimatePresence>
        {activePhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-earth-charcoal/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-2 rounded-full bg-earth-beige/20 hover:bg-earth-beige/30 text-earth-beige transition-colors z-50"
              aria-label="Tutup Galeri"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-earth-beige/20 hover:bg-earth-beige/30 text-earth-beige transition-colors z-50"
              aria-label="Foto Sebelumnya"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-earth-beige/20 hover:bg-earth-beige/30 text-earth-beige transition-colors z-50"
              aria-label="Foto Selanjutnya"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Modal Image Box */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl max-h-[85vh] w-full flex flex-col items-center"
            >
              <div className="relative w-full h-[65vh] rounded-2xl overflow-hidden shadow-elevated border border-earth-gold/40">
                <Image
                  src={defaultPhotos[activePhotoIndex].src}
                  alt={defaultPhotos[activePhotoIndex].caption}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Caption */}
              <p className="mt-4 text-center font-serif text-sm sm:text-base text-earth-beige tracking-wide max-w-lg">
                {defaultPhotos[activePhotoIndex].caption}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

