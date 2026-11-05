'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Link as LinkIcon,
  Copy,
  Check,
  Share2,
  Trash2,
  Eye,
  EyeOff,
  Download,
  Search,
  MessageSquare,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Sparkles,
  Lock,
  Send,
} from 'lucide-react';
import { Guest, Wish } from '@/types';
import { defaultWeddingEvent } from '@/lib/supabase';

export default function AdminDashboardPage() {
  // Autentikasi Passkey Sederhana untuk Keamanan Admin
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Tab State
  const [activeTab, setActiveTab] = useState<'guests' | 'analytics' | 'wishes'>('guests');

  // Data State
  const [guests, setGuests] = useState<Guest[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [analytics, setAnalytics] = useState({
    totalGuests: 0,
    totalHadir: 0,
    totalTidakHadir: 0,
    totalRagu: 0,
    totalPorsi: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Form Tambah Tamu State (Hanya Nama dan No WhatsApp, Tanpa Kategori)
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [isAddingGuest, setIsAddingGuest] = useState(false);

  // Copy Feedback State
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [copiedWaText, setCopiedWaText] = useState<string | null>(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  // Handle Passkey Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '123456' || pinInput === 'admin') {
      setIsAuthenticated(true);
      setAuthError('');
      fetchData();
    } else {
      setAuthError('PIN Keamanan Salah. Gunakan PIN: 123456');
    }
  };

  const fetchData = async () => {
    try {
      // Ambil data tamu & analytics
      const resGuests = await fetch('/api/guests');
      const dataGuests = await resGuests.json();
      if (dataGuests.success) {
        setGuests(dataGuests.data || []);
        if (dataGuests.analytics) {
          setAnalytics(dataGuests.analytics);
        }
      }

      // Ambil ucapan untuk moderasi
      const resWishes = await fetch('/api/wishes?all=true');
      const dataWishes = await resWishes.json();
      if (dataWishes.success) {
        setWishes(dataWishes.data || []);
      }
    } catch (err) {
      console.error('Fetch admin data error:', err);
    }
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setIsAddingGuest(true);
    try {
      const res = await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          phone_number: newPhone,
        }),
      });

      const result = await res.json();
      if (result.success && result.data) {
        setGuests((prev) => [result.data, ...prev]);
        setAnalytics((prev) => ({ ...prev, totalGuests: prev.totalGuests + 1 }));
        setNewName('');
        setNewPhone('');
      }
    } catch (err) {
      console.error('Add guest error:', err);
    } finally {
      setIsAddingGuest(false);
    }
  };

  const handleDeleteGuest = async (id: string) => {
    if (!confirm('Hapus data tamu ini?')) return;
    try {
      const res = await fetch(`/api/guests?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setGuests((prev) => prev.filter((g) => g.id !== id));
        setAnalytics((prev) => ({
          ...prev,
          totalGuests: Math.max(0, prev.totalGuests - 1),
        }));
      }
    } catch (err) {
      console.error('Delete guest error:', err);
    }
  };

  const handleToggleWishVisibility = async (wish: Wish) => {
    try {
      const updatedVisibility = !wish.is_visible;
      const res = await fetch('/api/wishes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: wish.id, is_visible: updatedVisibility }),
      });
      if (res.ok) {
        setWishes((prev) =>
          prev.map((w) =>
            w.id === wish.id ? { ...w, is_visible: updatedVisibility } : w
          )
        );
      }
    } catch (err) {
      console.error('Toggle wish error:', err);
    }
  };

  const handleDeleteWish = async (id: string) => {
    if (!confirm('Hapus ucapan ini secara permanen?')) return;
    try {
      const res = await fetch(`/api/wishes?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setWishes((prev) => prev.filter((w) => w.id !== id));
      }
    } catch (err) {
      console.error('Delete wish error:', err);
    }
  };

  // URL Unik Per Tamu
  const generateGuestUrl = (guest: Guest) => {
    return `${baseUrl}/to/${guest.slug}?token=${guest.token}`;
  };

  // Pesan WhatsApp Personal per Tamu
  const generateWaText = (guest: Guest) => {
    const url = generateGuestUrl(guest);
    return `Assalamu’alaikum Warahmatullahi Wabarakatuh,
Kepada Yth. Bapak/Ibu/Saudara/i *${guest.name}*,

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri syukuran pernikahan kami:

*${defaultWeddingEvent.groom_nickname} & ${defaultWeddingEvent.bride_nickname}*
📅 Minggu, 10 Desember 2026
📍 Puri Suryalaya Wedding House, Bandung

Informasi lengkap mengenai jadwal acara, lokasi, dan konfirmasi kehadiran (RSVP) dapat diakses melalui link undangan personal berikut:
${url}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Terima kasih.
Wassalamu’alaikum Warahmatullahi Wabarakatuh.
Salam hangat,
*${defaultWeddingEvent.groom_nickname} & ${defaultWeddingEvent.bride_nickname}*
(by skywannn wedding)`;
  };

  const copyGuestLink = (guest: Guest) => {
    const url = generateGuestUrl(guest);
    navigator.clipboard.writeText(url);
    setCopiedLink(guest.id);
    setTimeout(() => setCopiedLink(null), 3000);
  };

  const copyWaText = (guest: Guest) => {
    const text = generateWaText(guest);
    navigator.clipboard.writeText(text);
    setCopiedWaText(guest.id);
    setTimeout(() => setCopiedWaText(null), 3000);
  };

  const sendWhatsApp = (guest: Guest) => {
    const text = encodeURIComponent(generateWaText(guest));
    let phone = guest.phone_number?.replace(/[^0-9]/g, '') || '';
    if (phone.startsWith('0')) {
      phone = '62' + phone.slice(1);
    }
    const waUrl = phone
      ? `https://wa.me/${phone}?text=${text}`
      : `https://wa.me/?text=${text}`;
    window.open(waUrl, '_blank');
  };

  const exportCsv = () => {
    const headers = ['Nama Tamu', 'No WhatsApp', 'Link Undangan'];
    const rows = guests.map((g) => [
      `"${g.name.replace(/"/g, '""')}"`,
      `"${g.phone_number || ''}"`,
      `"${generateGuestUrl(g)}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'daftar-tamu-undangan.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredGuests = guests.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Jika belum login PIN
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-earth-beige px-4">
        <div className="max-w-md w-full bg-earth-beige-soft rounded-3xl p-8 border border-earth-gold/40 shadow-elevated text-center space-y-6">
          <div className="w-14 h-14 bg-earth-charcoal rounded-2xl flex items-center justify-center mx-auto text-earth-gold shadow-card">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h1 className="font-serif text-2xl font-bold text-earth-charcoal">
              Portal Admin Pengantin
            </h1>
            <p className="text-xs text-earth-sage-dark">
              by skywannn wedding • Masukkan PIN Keamanan
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Masukkan PIN (Default: 123456)"
              className="w-full text-center tracking-widest text-lg py-3 px-4 rounded-xl border border-earth-gold/40 bg-earth-beige text-earth-charcoal focus:outline-none focus:ring-2 focus:ring-earth-gold/60"
              autoFocus
            />
            {authError && <p className="text-xs text-red-600 font-medium">{authError}</p>}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-earth-charcoal text-earth-beige hover:bg-earth-sage font-medium text-sm transition-colors shadow-soft"
            >
              Buka Dashboard
            </button>
          </form>
          <p className="text-[11px] text-earth-charcoal/50">
            *PIN default: <span className="font-mono font-bold text-earth-charcoal">123456</span>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-earth-beige text-earth-charcoal">
      {/* Top Header Bar */}
      <header className="bg-earth-charcoal text-earth-beige px-6 py-4 shadow-soft sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-earth-gold/20 flex items-center justify-center text-earth-gold font-serif font-bold text-sm">
              S
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold tracking-wide">
                Dashboard Undangan &bull; Arya &amp; Adelia
              </h1>
              <p className="text-[10px] text-earth-gold-light uppercase tracking-widest">
                skywannn wedding system
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-xs text-earth-beige/80 hover:text-earth-gold transition-colors py-1 px-3 rounded-lg border border-earth-beige/20"
          >
            Keluar
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-earth-gold/30 pb-3">
          <button
            onClick={() => setActiveTab('guests')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'guests'
                ? 'bg-earth-charcoal text-earth-beige shadow-sm'
                : 'text-earth-charcoal/80 hover:bg-earth-beige-soft'
            }`}
          >
            <Users className="w-4 h-4 text-earth-gold" />
            <span>Manajemen Tamu ({guests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'bg-earth-charcoal text-earth-beige shadow-sm'
                : 'text-earth-charcoal/80 hover:bg-earth-beige-soft'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-earth-gold" />
            <span>RSVP &amp; Porsi ({analytics.totalPorsi} Pax)</span>
          </button>

          <button
            onClick={() => setActiveTab('wishes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'wishes'
                ? 'bg-earth-charcoal text-earth-beige shadow-sm'
                : 'text-earth-charcoal/80 hover:bg-earth-beige-soft'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-earth-gold" />
            <span>Moderasi Ucapan ({wishes.length})</span>
          </button>
        </div>

        {/* TAB 1: GUEST LINK GENERATOR (SATU PER SATU PER TAMU) */}
        {activeTab === 'guests' && (
          <div className="space-y-8">
            {/* Form Buat Link Tamu Baru */}
            <div className="bg-earth-beige-soft rounded-3xl p-6 sm:p-8 border border-earth-gold/30 shadow-card space-y-4">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-earth-gold" />
                <h3 className="font-serif text-lg font-bold text-earth-charcoal">
                  Buat Link Undangan Tamu Baru
                </h3>
              </div>
              <p className="text-xs text-earth-sage-dark">
                Masukkan nama tamu untuk membuat link personal unik. Nama ini akan otomatis tampil di cover pembuka undangan.
              </p>

              <form onSubmit={handleAddGuest} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-6 space-y-1">
                  <label className="text-xs font-medium text-earth-charcoal">
                    Nama Tamu Undangan *
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Contoh: Budi Santoso & Partner"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-earth-gold/30 bg-earth-beige text-xs sm:text-sm text-earth-charcoal focus:outline-none focus:ring-2 focus:ring-earth-gold/50"
                  />
                </div>

                <div className="sm:col-span-3 space-y-1">
                  <label className="text-xs font-medium text-earth-charcoal">
                    Nomor WhatsApp (Opsional)
                  </label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="08123456789"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-earth-gold/30 bg-earth-beige text-xs sm:text-sm text-earth-charcoal focus:outline-none focus:ring-2 focus:ring-earth-gold/50"
                  />
                </div>

                <div className="sm:col-span-3">
                  <button
                    type="submit"
                    disabled={isAddingGuest}
                    className="w-full py-2.5 px-4 rounded-xl bg-earth-charcoal text-earth-beige hover:bg-earth-sage font-medium text-xs sm:text-sm transition-colors shadow-soft flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-earth-gold" />
                    <span>{isAddingGuest ? 'Menyimpan...' : 'Generate Link'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Toolbar: Search & Ekspor CSV */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-earth-charcoal/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama tamu..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-earth-gold/30 bg-earth-beige text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-earth-gold/50"
                />
              </div>

              <button
                onClick={exportCsv}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-earth-beige-soft border border-earth-charcoal/20 hover:bg-earth-beige text-xs font-medium text-earth-charcoal transition-colors"
              >
                <Download className="w-4 h-4 text-earth-gold" />
                <span>Ekspor CSV</span>
              </button>
            </div>

            {/* Daftar Tamu Undangan */}
            <div className="space-y-3">
              {filteredGuests.length === 0 ? (
                <div className="text-center py-12 bg-earth-beige-soft rounded-2xl border border-earth-gold/20">
                  <p className="text-xs text-earth-charcoal/60 italic">
                    Belum ada tamu yang terdaftar. Tambahkan tamu melalui formulir di atas.
                  </p>
                </div>
              ) : (
                filteredGuests.map((guest) => (
                  <div
                    key={guest.id}
                    className="bg-earth-beige-soft rounded-2xl p-4 sm:p-5 border border-earth-gold/25 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <span className="font-serif font-bold text-earth-charcoal text-base">
                        {guest.name}
                      </span>
                      <p className="text-xs text-earth-sage-dark font-mono truncate max-w-md">
                        {generateGuestUrl(guest)}
                      </p>
                    </div>

                    {/* Action Buttons: Salin Link, Salin Teks WA, Kirim WA, Hapus */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => copyGuestLink(guest)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-earth-beige border border-earth-gold/30 hover:bg-earth-beige-dark text-xs font-medium text-earth-charcoal transition-colors"
                        title="Salin Link Undangan"
                      >
                        {copiedLink === guest.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-earth-gold" />
                            <span className="text-earth-sage-dark font-bold">Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <LinkIcon className="w-3.5 h-3.5 text-earth-gold" />
                            <span>Salin Link</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => copyWaText(guest)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-earth-beige border border-earth-gold/30 hover:bg-earth-beige-dark text-xs font-medium text-earth-charcoal transition-colors"
                        title="Salin Teks WhatsApp Lengkap"
                      >
                        {copiedWaText === guest.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-earth-gold" />
                            <span className="text-earth-sage-dark font-bold">Teks WA Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-earth-gold" />
                            <span>Salin Teks WA</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => sendWhatsApp(guest)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-700 text-white hover:bg-green-800 text-xs font-medium transition-colors"
                        title="Buka WhatsApp Langsung"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Kirim WA</span>
                      </button>

                      <button
                        onClick={() => handleDeleteGuest(guest.id)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        title="Hapus Tamu"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: RSVP ANALYTICS SUMMARY */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-earth-beige-soft p-5 rounded-2xl border border-earth-gold/30 shadow-soft">
                <span className="text-xs uppercase tracking-wider text-earth-sage-dark font-semibold">
                  Tamu Terdaftar
                </span>
                <p className="font-serif text-3xl font-bold text-earth-charcoal mt-1">
                  {analytics.totalGuests}
                </p>
              </div>

              <div className="bg-earth-beige-soft p-5 rounded-2xl border border-earth-gold/30 shadow-soft">
                <span className="text-xs uppercase tracking-wider text-green-700 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Konfirmasi Hadir
                </span>
                <p className="font-serif text-3xl font-bold text-earth-charcoal mt-1">
                  {analytics.totalHadir}
                </p>
              </div>

              <div className="bg-earth-beige-soft p-5 rounded-2xl border border-earth-gold/30 shadow-soft">
                <span className="text-xs uppercase tracking-wider text-red-700 font-semibold flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Tidak Hadir
                </span>
                <p className="font-serif text-3xl font-bold text-earth-charcoal mt-1">
                  {analytics.totalTidakHadir}
                </p>
              </div>

              <div className="bg-earth-beige-soft p-5 rounded-2xl border border-earth-gold/30 shadow-soft">
                <span className="text-xs uppercase tracking-wider text-earth-gold-dark font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Estimasi Porsi Katering
                </span>
                <p className="font-serif text-3xl font-bold text-earth-gold-dark mt-1">
                  {analytics.totalPorsi} <span className="text-xs text-earth-charcoal font-sans">pax</span>
                </p>
              </div>
            </div>

            <div className="bg-earth-beige-soft p-6 rounded-3xl border border-earth-gold/30 shadow-card space-y-3">
              <h3 className="font-serif text-lg font-bold text-earth-charcoal">
                Petunjuk Koordinasi Katering
              </h3>
              <p className="text-xs sm:text-sm text-earth-charcoal/80 leading-relaxed">
                Estimasi porsi di atas dihitung otomatis setiap kali ada tamu yang mengisi konfirmasi <strong>Hadir</strong> beserta jumlah orang yang mereka bawa (1 sampai 5 orang). Anda dapat menggunakan angka akumulasi ini untuk koordinasi porsi makanan dengan vendor katering.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: MODERASI UCAPAN */}
        {activeTab === 'wishes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-earth-charcoal">
                Daftar Pesan &amp; Doa Tamu
              </h3>
              <span className="text-xs text-earth-sage-dark font-medium">
                {wishes.length} Pesan Masuk
              </span>
            </div>

            <div className="space-y-3">
              {wishes.map((w) => (
                <div
                  key={w.id}
                  className={`p-4 rounded-2xl border transition-colors ${
                    w.is_visible
                      ? 'bg-earth-beige-soft border-earth-gold/30'
                      : 'bg-red-50/50 border-red-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-sm text-earth-charcoal">
                        {w.name}
                      </span>
                      {!w.is_visible && (
                        <span className="text-[9px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">
                          Disembunyikan
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleWishVisibility(w)}
                        className="p-1.5 rounded-lg text-earth-charcoal hover:bg-earth-beige transition-colors"
                        title={w.is_visible ? 'Sembunyikan Pesan' : 'Tampilkan Pesan'}
                      >
                        {w.is_visible ? (
                          <Eye className="w-4 h-4 text-earth-sage-dark" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-red-600" />
                        )}
                      </button>

                      <button
                        onClick={() => handleDeleteWish(w.id)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-100 transition-colors"
                        title="Hapus Permanen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-earth-charcoal/80 leading-relaxed">
                    {w.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
