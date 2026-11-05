'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { weddingData } from '@/lib/weddingData';

const defaultStories = weddingData.stories;

export default function LoveStorySection() {
  return (
    <section className="py-24 px-4 bg-earth-beige-soft relative">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-widest text-earth-sage-dark font-medium">
            Kisah Kasih
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-earth-charcoal">
            Cerita Perjalanan Kami
          </h2>
          <p className="text-earth-sage-dark text-sm max-w-md mx-auto">
            Setiap kisah cinta itu indah, namun bagi kami, kisah ini adalah anugerah terindah yang Tuhan gariskan.
          </p>
        </div>

        {/* Timeline List */}
        <div className="relative border-l-2 border-earth-gold/30 ml-4 md:ml-1/2 space-y-12 pl-6 md:pl-0">
          {defaultStories.map((story, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.1 }}
                className={`relative flex flex-col md:flex-row items-center gap-6 ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Bullet Node */}
                <div className="absolute -left-[31px] md:left-1/2 md:-translate-x-1/2 top-1.5 w-4 h-4 rounded-full bg-earth-gold border-2 border-earth-beige shadow-sm" />

                {/* Konten Teks */}
                <div className={`w-full md:w-1/2 space-y-2 ${isEven ? 'md:text-left md:pl-8' : 'md:text-right md:pr-8'}`}>
                  <span className="text-xs uppercase tracking-widest text-earth-sage-dark font-semibold">
                    {story.date}
                  </span>
                  <h3 className="font-serif text-xl text-earth-charcoal font-semibold">
                    {story.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-earth-charcoal/70 leading-relaxed">
                    {story.description}
                  </p>
                </div>

                {/* Gambar Milestone */}
                <div className={`w-full md:w-1/2 flex ${isEven ? 'md:justify-end md:pr-8' : 'md:justify-start md:pl-8'}`}>
                  <div className="relative w-40 h-28 sm:w-48 sm:h-32 rounded-2xl overflow-hidden shadow-card border border-earth-gold/20">
                    <Image
                      src={story.image}
                      alt={story.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

