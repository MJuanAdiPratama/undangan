export interface WeddingEvent {
  id?: string;
  slug: string;
  title: string;
  groom_name: string;
  groom_nickname: string;
  groom_father: string;
  groom_mother: string;
  groom_instagram?: string;
  groom_photo_url: string;
  
  bride_name: string;
  bride_nickname: string;
  bride_father: string;
  bride_mother: string;
  bride_instagram?: string;
  bride_photo_url: string;
  
  quote_text: string;
  quote_source: string;
  event_date: string; // ISO string / '2026-12-10T08:00:00+07:00'
  
  akad_title: string;
  akad_date: string;
  akad_time: string;
  akad_venue: string;
  akad_address: string;
  
  reception_title: string;
  reception_date: string;
  reception_time: string;
  reception_venue: string;
  reception_address: string;
  
  maps_embed_url: string;
  maps_direct_url: string;
  
  bank_accounts: Array<{
    bank: string;
    account_number: string;
    account_holder: string;
  }>;
  qris_image_url?: string;
  gift_address: string;
  
  audio_url: string;
  audio_title: string;
}

export interface Guest {
  id: string;
  name: string;
  slug: string;
  token: string;
  phone_number?: string;
  notes?: string;
  view_count: number;
  opened_at?: string | null;
  created_at: string;
}

export type RsvpStatus = 'Hadir' | 'Tidak Hadir' | 'Masih Ragu';

export interface Rsvp {
  id: string;
  guest_id?: string;
  name: string;
  status: RsvpStatus;
  guest_count: number;
  message?: string;
  created_at: string;
}

export interface Wish {
  id: string;
  name: string;
  relationship?: string;
  message: string;
  is_visible: boolean;
  created_at: string;
}

export interface StoryMilestone {
  date: string;
  title: string;
  description: string;
  image: string;
}

export interface GalleryPhoto {
  id: string;
  src: string;
  thumbnail: string;
  caption: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'wide';
}

