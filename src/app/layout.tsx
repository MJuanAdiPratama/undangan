import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans, Alex_Brush } from 'next/font/google';
import './globals.css';
import { AudioProvider } from '@/components/audio/AudioContext';
import { NotificationProvider } from '@/components/ui/NotificationContext';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

const alex = Alex_Brush({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-alex',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://skywannn-wedding.vercel.app'),
  title: 'The Wedding of Arya & Adelia | skywannn wedding',
  description:
    'Undangan Pernikahan Digital Handcrafted Fine-Art Arya & Adelia. Diselenggarakan pada Minggu, 10 Desember 2026 di Bandung, Jawa Barat.',
  icons: {
    icon: [
      { url: '/icon.png?v=3', sizes: '32x32', type: 'image/png' },
      { url: '/icon.svg?v=3', type: 'image/svg+xml' },
      { url: '/favicon.ico?v=3', sizes: 'any' },
    ],
    shortcut: '/icon.png?v=3',
    apple: [
      { url: '/apple-icon.png?v=3', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'The Wedding of Arya & Adelia',
    description: 'Undangan Pernikahan Digital Arya & Adelia',
    images: ['/img/hero.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${cormorant.variable} ${jakarta.variable} ${alex.variable}`}>
      <body className="antialiased min-h-screen bg-earth-beige text-earth-charcoal selection:bg-earth-gold/20 selection:text-earth-charcoal">
        <AudioProvider audioSrc="/audio/wedding-song.mp3">
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </AudioProvider>
      </body>
    </html>
  );
}
