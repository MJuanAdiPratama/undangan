'use client';

import React from 'react';
import { useAudio } from './AudioContext';
import { Volume2, VolumeX, Play, Pause, Disc } from 'lucide-react';

interface AudioPlayerProps {
  title?: string;
}

export default function AudioPlayer({ title = 'Tulus - Perahu Kertas' }: AudioPlayerProps) {
  const { isPlaying, isMuted, hasStarted, togglePlay, toggleMute } = useAudio();

  // Hanya tampil setelah tamu membuka undangan
  if (!hasStarted) return null;

  return (
    <aside aria-label="Pemutar Audio Latar" className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
      <div className="flex items-center gap-1.5 bg-earth-beige/90 backdrop-blur-md border border-earth-gold/30 rounded-full px-3 py-1.5 shadow-elevated">
        {/* Tombol Play/Pause dengan icon disc berputar */}
        <button
          onClick={togglePlay}
          className="relative flex items-center justify-center w-9 h-9 rounded-full bg-earth-charcoal text-earth-beige hover:bg-earth-sage transition-colors duration-300 focus:outline-none"
          title={isPlaying ? 'Jeda Musik' : 'Putar Musik'}
          aria-label={isPlaying ? 'Jeda Musik' : 'Putar Musik'}
        >
          <Disc
            className={`w-5 h-5 ${isPlaying ? 'animate-spin-slow text-earth-gold' : 'text-earth-beige/80'}`}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-earth-charcoal/80 rounded-full transition-opacity">
            {isPlaying ? (
              <Pause className="w-4 h-4 text-earth-gold" />
            ) : (
              <Play className="w-4 h-4 text-earth-gold ml-0.5" />
            )}
          </div>
        </button>

        {/* Teks Judul Lagu Ringkas (Tampil di Desktop) */}
        <div className="hidden sm:flex flex-col text-left pr-2 pl-1 max-w-[130px]">
          <span className="text-[10px] uppercase tracking-widest text-earth-sage font-medium">
            {isPlaying ? 'Memutar' : 'Dijeda'}
          </span>
          <span className="text-xs font-serif text-earth-charcoal truncate font-semibold">
            {title}
          </span>
        </div>

        {/* Tombol Mute / Unmute */}
        <button
          onClick={toggleMute}
          className="p-1.5 text-earth-charcoal hover:text-earth-sage transition-colors"
          title={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
          aria-label={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-red-700" />
          ) : (
            <Volume2 className="w-4 h-4 text-earth-charcoal" />
          )}
        </button>
      </div>
    </aside>
  );
}
