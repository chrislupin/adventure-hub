import type { CatalogEntry, ExperienceEntry, PackageEntry, ServiceEntry, StayEntry, TransportEntry } from '@/types/catalog';

const experiences = [
  {
    id: 'experience-quad-biking',
    slug: 'quad-biking',
    name: 'Quad biking',
    shortDescription: 'Outdoor quad biking experiences arranged by inquiry.',
    description: 'Adventure Hub offers quad biking as part of its outdoor experiences. Share your preferred dates and interests; location, route, operator, duration, requirements, availability and pricing must be confirmed before a booking is agreed.',
    category: 'Outdoor adventure',
    kind: 'experience',
    status: 'published',
    pricing: { method: 'quote' },
    bookingEligibility: 'inquiry',
    coverImage: {
      src: '/images/quad-biking-illustrative.jpg',
      alt: 'A rider takes an all-terrain vehicle across an open desert landscape',
      illustrative: true,
    },
    gallery: [],
    seo: {
      title: 'Quad Biking Experiences | Adventure Hub',
      description: 'Ask Adventure Hub about quad biking dates, routes and requirements. Details and pricing are confirmed by inquiry.',
    },
  },
  {
    id: 'experience-hot-air-balloon',
    slug: 'hot-air-ballooning',
    name: 'Hot-air balloon experiences',
    shortDescription: 'Ask about hot-air balloon experiences and current arrangements.',
    description: 'Hot-air balloon experiences are part of Adventure Hub’s outdoor offering. Share the dates you have in mind; location, operator, duration, availability, inclusions and pricing are confirmed directly before a booking is agreed.',
    category: 'Outdoor adventure',
    kind: 'experience',
    status: 'published',
    pricing: { method: 'quote' },
    bookingEligibility: 'inquiry',
    coverImage: {
      src: '/images/balloon-safari-illustrative.jpg',
      alt: 'A hot-air balloon floats above an elephant in the Maasai Mara savannah',
      illustrative: true,
    },
    gallery: [
      {
        src: '/images/hero-maasai-mara-balloon.jpg',
        alt: 'A hot-air balloon above a herd of zebras in the Maasai Mara, Kenya',
        illustrative: true,
      },
    ],
    seo: {
      title: 'Hot-Air Balloon Experiences | Adventure Hub',
      description: 'Explore hot-air balloon experiences with Adventure Hub. Confirm dates, location, operator details and pricing by inquiry.',
    },
  },
  {
    id: 'experience-nature-outdoors',
    slug: 'nature-and-outdoor-adventures',
    name: 'Nature and outdoor adventures',
    shortDescription: 'Ask the team about current outdoor and nature experience options.',
    description: 'Adventure Hub can help plan outdoor and nature-focused getaways. Specific activities, locations, operators, requirements and availability are only shared once confirmed for your inquiry.',
    category: 'Nature and outdoors',
    kind: 'experience',
    status: 'published',
    pricing: { method: 'quote' },
    bookingEligibility: 'inquiry',
    coverImage: {
      src: '/images/tsavo-savannah-illustrative.jpg',
      alt: 'An acacia tree at sunset in Tsavo East National Park, Kenya',
      illustrative: true,
    },
    gallery: [],
    seo: {
      title: 'Nature and Outdoor Adventures | Adventure Hub',
      description: 'Ask Adventure Hub about current nature and outdoor getaway options. Details are confirmed for each inquiry.',
    },
  },
] satisfies readonly ExperienceEntry[];

const stays = [
  {
    id: 'stay-luxury-cabin',
    slug: 'luxury-cabin-stays',
    name: 'Luxury cabin stays',
    shortDescription: 'Cabin accommodation with half-board or full-board options to ask about.',
    description: 'Adventure Hub offers luxury cabin accommodation and half-board and full-board stay options. No individual property listing is published yet; ask the team to confirm the property, location, capacity, amenities, meal details, dates and pricing for your plans.',
    category: 'Cabin accommodation',
    kind: 'stay',
    status: 'published',
    pricing: { method: 'quote' },
    bookingEligibility: 'inquiry',
    mealPlans: ['half-board', 'full-board'],
    coverImage: {
      src: '/images/cabin-exterior-illustrative.jpg',
      alt: 'A wooden cabin beside a pond, surrounded by trees',
      illustrative: true,
    },
    gallery: [
      {
        src: '/images/cabin-interior-illustrative.jpg',
        alt: 'A modern cabin interior opening onto a deck and green forest',
        illustrative: true,
      },
    ],
    seo: {
      title: 'Luxury Cabin Stays | Adventure Hub',
      description: 'Explore Adventure Hub cabin stays and ask about half-board or full-board options. Property details and pricing are confirmed by inquiry.',
    },
  },
] satisfies readonly StayEntry[];

const transport = [
  {
    id: 'transport-chauffeur',
    slug: 'chauffeur-and-private-transport',
    name: 'Chauffeur and private transport',
    shortDescription: 'Plan private transport around your dates, pickup, destination and group.',
    description: 'Adventure Hub offers chauffeur and private transport services. Share your pickup and destination preferences, dates, passenger count and luggage needs; coverage, vehicle category, availability and quotation are confirmed before travel is agreed.',
    category: 'Private transport',
    kind: 'transport',
    status: 'published',
    pricing: { method: 'quote' },
    bookingEligibility: 'inquiry',
    coverImage: {
      src: '/images/scenic-suv-illustrative.jpg',
      alt: 'A traveler stands beside a white SUV on an open road',
      illustrative: true,
    },
    gallery: [],
    seo: {
      title: 'Chauffeur and Private Transport | Adventure Hub',
      description: 'Request a chauffeur and private transport quotation from Adventure Hub. Confirm coverage, vehicle category and availability by inquiry.',
    },
  },
] satisfies readonly TransportEntry[];

const packages: readonly PackageEntry[] = [];

const entries: readonly CatalogEntry[] = [...experiences, ...stays, ...transport, ...packages];

export function getPublishedEntries(kind?: CatalogEntry['kind']): readonly CatalogEntry[] {
  return entries.filter((entry) => entry.status === 'published' && (!kind || entry.kind === kind));
}

export function getPublishedServices(): readonly ServiceEntry[] {
  return getPublishedEntries().filter((entry): entry is ServiceEntry => entry.kind !== 'package');
}

export function getPublishedExperiences(): readonly ExperienceEntry[] {
  return experiences.filter((entry) => entry.status === 'published');
}

export function getPublishedStays(): readonly StayEntry[] {
  return stays.filter((entry) => entry.status === 'published');
}

export function getPublishedTransport(): readonly TransportEntry[] {
  return transport.filter((entry) => entry.status === 'published');
}

export function getPublishedPackages(): readonly PackageEntry[] {
  return packages.filter((entry) => entry.status === 'published');
}

export function getPublishedEntryBySlug(kind: CatalogEntry['kind'], slug: string): CatalogEntry | undefined {
  return entries.find((entry) => entry.kind === kind && entry.slug === slug && entry.status === 'published');
}

export function getCatalogPath(entry: CatalogEntry): string {
  const prefix = {
    experience: '/experiences',
    stay: '/stays',
    transport: '/transport',
    package: '/packages',
  }[entry.kind];
  return `${prefix}/${entry.slug}`;
}

export function getRelatedEntries(entry: CatalogEntry, limit = 3): readonly CatalogEntry[] {
  const relatedIds = new Set(entry.relatedIds ?? []);
  const related = getPublishedEntries().filter((candidate) => {
    if (candidate.id === entry.id) return false;
    if (relatedIds.has(candidate.id) || candidate.kind === 'package') return true;
    if (entry.kind === 'experience') return candidate.kind === 'experience';
    if (entry.kind === 'stay') return candidate.kind === 'experience' || candidate.kind === 'transport';
    if (entry.kind === 'transport') return candidate.kind === 'experience' || candidate.kind === 'stay';
    return false;
  });
  return related.slice(0, limit);
}