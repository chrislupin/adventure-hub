import { normalizeWhatsAppNumber } from '@/lib/whatsapp';

export const siteConfig = {
  name: 'Adventure Hub',
  tagline: 'Escape. Explore. Experience.',
  description: 'Your next memorable getaway starts here.',
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'Experiences', href: '/experiences' },
    { label: 'Stays', href: '/stays' },
    { label: 'Transport', href: '/transport' },
    { label: 'Packages', href: '/packages' },
    { label: 'Contact', href: '/contact' },
  ],
  services: [
    { label: 'Outdoor experiences', href: '/experiences' },
    { label: 'Cabin stays', href: '/stays' },
    { label: 'Getaway packages', href: '/packages' },
    { label: 'Chauffeur transport', href: '/transport' },
  ],
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || undefined,
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || undefined,
    whatsappNumber: normalizeWhatsAppNumber(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),
    serviceArea: process.env.NEXT_PUBLIC_SERVICE_AREA?.trim() || 'Kenya',
  },
  social: {
    tiktok: 'https://www.tiktok.com/@adventure.hub42',
  },
} as const;