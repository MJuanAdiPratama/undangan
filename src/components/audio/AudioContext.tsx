'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface AudioContextType {
  isPlaying: boolean;
  isMuted: boolean;
  hasStarted: boolean;
  playAudio: () => Promise<void>;
  pauseAudio: () => void;
  togglePlay: () => void;
  toggleMute: () => void;
}

const AudioContext = createContext<AudioContextType>({
  isPlaying: false,
  isMuted: false,
  hasStarted: false,
  playAudio: async () => {},
  pauseAudio: () => {},
  togglePlay: () => {},
  toggleMute: () => {},
});

export function AudioProvider({
  children,
  audioSrc = '/audio/wedding-song.mp3',
}: {
  children: React.ReactNode;
  audioSrc?: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Inisialisasi Audio Element
    const audio = new Audio(audioSrc);
    audio.loop = true;
    audio.preload = 'auto';
    audioRef.current = audio;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, [audioSrc]);

  const playAudio = async () => {
    if (!audioRef.current) return;
    try {
      await audioRef.current.play();
      setIsPlaying(true);
      setHasStarted(true);
    } catch (err) {
      console.warn('Autoplay prevented by browser:', err);
    }
  };

  const pauseAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMuted = !audioRef.current.muted;
    audioRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        isMuted,
        hasStarted,
        playAudio,
        pauseAudio,
        togglePlay,
        toggleMute,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  return useContext(AudioContext);
}

