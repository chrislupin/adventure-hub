import type { CatalogEntry, ExperienceEntry, PackageEntry, ServiceEntry, StayEntry, TransportEntry } from '@/types/catalog';

const experiences = [
  {
    id: 'experience-quad-biking',
    slug: 'quad-biking',
    name: 'Quad biking',
    shortDescription: 'Beginner quad biking rides from KSh 1,600 per person.',
    description: 'Enjoy a short introductory quad biking ride at Adventure Hub Longonot. A safety briefing, basic instruction, helmet and safety equipment are included. Availability and final arrangements are confirmed by inquiry.',
    category: 'Outdoor adventure',
    kind: 'experience',
    status: 'published',
    pricing: { method: 'fixed', amount: 1600, currency: 'KES', verified: true, basis: 'per person' },
    priceOptions: [{ name: 'Beginner ride', amount: 1600, currency: 'KES', basis: 'per person', inclusions: ['Safety briefing and basic instruction', 'Helmet and safety equipment', 'Short introductory ride'] }],
    bookingEligibility: 'inquiry',
    coverImage: {
      src: '/images/adventure-hub/images/quad%20bike.jpeg',
      alt: 'Guests pause with quad bikes at a scenic viewpoint',
    },
    gallery: [
      {
        src: '/images/adventure-hub/images/quad%20bike.jpeg',
        alt: 'Guests wearing helmets beside quad bikes on an outdoor ride',
      },
    ],
    seo: {
      title: 'Quad Biking Experiences | Adventure Hub',
      description: 'Book a beginner quad biking ride at Adventure Hub Longonot from KSh 1,600 per person, subject to availability.',
    },
  },
  {
    id: 'experience-longonot-activities',
    slug: 'longonot-activities-and-experiences',
    name: 'Longonot activities and experiences',
    shortDescription: 'Add farm, bonfire, pool, sauna, nature, cycling and celebration experiences from KSh 500.',
    description: 'At Adventure Hub Longonot, every experience is an opportunity to explore, relax and create unforgettable memories. Choose your preferred experiences when you inquire; availability and final arrangements are confirmed before booking.',
    category: 'Activities and experiences',
    kind: 'experience',
    status: 'published',
    pricing: { method: 'from', amount: 500, currency: 'KES', verified: true, basis: 'per person' },
    priceOptions: [
      { name: 'Horse riding', amount: 1400, currency: 'KES', basis: 'per person', inclusions: ['Short introductory ride'] },
      { name: 'Farm and animal experience', amount: 500, currency: 'KES', basis: 'per person', inclusions: ['Explore the farm and see available animals'] },
      { name: 'Standard bonfire', amount: 800, currency: 'KES', basis: 'per person', description: 'Shared bonfire experience.' },
      { name: 'Bonfire and refreshments', amount: 1500, currency: 'KES', basis: 'per person', description: 'Bonfire with selected refreshments.' },
      { name: 'Group bonfire', amount: 3000, currency: 'KES', basis: 'per group', description: 'Private group booking, subject to group size.' },
      { name: 'Classic private bonfire setup', amount: 2500, currency: 'KES', basis: 'per group', inclusions: ['Fire pit and seating'] },
      { name: 'Romantic private bonfire setup', amount: 4500, currency: 'KES', basis: 'per couple', inclusions: ['Decorated seating', 'Lanterns and romantic ambience'] },
      { name: 'Celebration private bonfire setup', amount: 10000, currency: 'KES', basis: 'from per group', description: 'Birthday or special-occasion theme.' },
      { name: 'Pool access', amount: 700, currency: 'KES', basis: 'per person', description: 'Standard day access.' },
      { name: 'Pool and refreshment', amount: 1200, currency: 'KES', basis: 'per person', inclusions: ['Pool access', 'Selected refreshment'] },
      { name: 'Family pool package', amount: 3000, currency: 'KES', basis: 'per family', description: 'Confirm family size and child rates when inquiring.' },
      { name: 'Classic sauna', amount: 1200, currency: 'KES', basis: 'per person', description: 'One session.' },
      { name: 'Extended sauna', amount: 1800, currency: 'KES', basis: 'per person', description: 'Longer session, subject to facility rules.' },
      { name: 'Couples sauna', amount: 2000, currency: 'KES', basis: 'from per couple', description: 'Coordinated session.' },
      { name: 'Guided nature walk', amount: 900, currency: 'KES', basis: 'per person', description: 'Short guided walk.' },
      { name: 'Private guided walk', amount: 3000, currency: 'KES', basis: 'from per group', description: 'Private guide booking.' },
      { name: 'Classic cycling', amount: 600, currency: 'KES', basis: 'per person', description: 'Short cycling experience.' },
      { name: 'Group cycling', amount: 1500, currency: 'KES', basis: 'per person', description: 'Guided group outing.' },
      { name: 'Birthday celebration package', amount: 8000, currency: 'KES', basis: 'per group', inclusions: ['Enhanced theme decoration', 'Balloons or flowers', 'Candlelight or decorative lighting', 'Photo-friendly setup'] },
      { name: 'Luxury picnic experience', amount: 4000, currency: 'KES', basis: 'per couple', inclusions: ['Decorated picnic setup', 'Premium snack platter and drinks', 'Flowers and photo opportunities', 'Two-hour experience'] },
    ],
    bookingEligibility: 'inquiry',
    coverImage: {
      src: '/images/adventure-hub/images/swimming%20pool.jpeg',
      alt: 'A garden swimming pool at Adventure Hub Longonot',
    },
    gallery: [
      {
        src: '/images/adventure-hub/images/hikers%20viewing.jpeg',
        alt: 'A group enjoying a guided nature outing',
      },
      {
        src: '/images/adventure-hub/images/hikers%20viewing%202.jpeg',
        alt: 'Hikers taking in the outdoor surroundings',
      },
      {
        src: '/images/adventure-hub/images/farm%20activity%201.jpeg',
        alt: 'Guests enjoying a farm activity at Adventure Hub Longonot',
      },
      {
        src: '/images/adventure-hub/images/farm%20activity%202.jpeg',
        alt: 'Visitors taking part in a farm experience at Adventure Hub Longonot',
      },
    ],
    seo: {
      title: 'Activities and Experiences | Adventure Hub Longonot',
      description: 'Explore farm, bonfire, pool, sauna, nature, cycling and celebration experiences at Adventure Hub Longonot.',
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
      src: '/images/adventure-hub/images/Hikers.jpeg',
      alt: 'A hiker pauses on a green hillside outdoors',
    },
    gallery: [
      {
        src: '/images/adventure-hub/images/hikers%20viewing.jpeg',
        alt: 'A group enjoying a guided nature outing',
      },
      {
        src: '/images/adventure-hub/images/hikers%20viewing%202.jpeg',
        alt: 'A hiker looking out over a green outdoor landscape',
      },
    ],
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
    shortDescription: 'Luxury cabin packages from KSh 18,500 per couple, per night.',
    description: 'Stay at Adventure Hub Longonot with half-board or full-board dining options. Select your preferred package and dates; availability and final arrangements are confirmed by inquiry.',
    category: 'Cabin accommodation',
    kind: 'stay',
    status: 'published',
    pricing: { method: 'fixed', amount: 18500, currency: 'KES', verified: true, basis: 'per couple, per night' },
    priceOptions: [
      { name: 'Half board', amount: 18500, currency: 'KES', basis: 'per couple, per night', description: 'A peaceful escape for couples seeking comfortable cabin accommodation and beautiful natural surroundings.', inclusions: ['Luxury cabin accommodation', 'Breakfast', 'Dinner'] },
      { name: 'Full board', amount: 21500, currency: 'KES', basis: 'per couple, per night', description: 'A convenient all-day dining experience with time to relax and enjoy the surroundings.', inclusions: ['Luxury cabin accommodation', 'Breakfast', 'Lunch', 'Dinner'] },
      { name: 'Three-night full board', amount: 56000, currency: 'KES', basis: 'per couple, for three nights', inclusions: ['Three nights of cabin accommodation', 'Breakfast, lunch and dinner throughout your stay', 'More time to relax and explore', 'Opportunity to enjoy bonfire evenings and outdoor experiences'], saving: 'Save KSh 8,500 compared with three standard full-board nights.' },
      { name: 'Four-night full board', amount: 64800, currency: 'KES', basis: 'per couple, for four nights', inclusions: ['Four nights of cabin accommodation', 'Breakfast, lunch and dinner throughout your stay', 'Extra time to unwind and enjoy the outdoors'], saving: 'Save KSh 21,200 compared with four standard full-board nights.' },
    ],
    location: 'Adventure Hub Longonot',
    bookingEligibility: 'inquiry',
    mealPlans: ['half-board', 'full-board'],
    coverImage: {
      src: '/images/adventure-hub/images/cabin%201.jpeg',
      alt: 'A-frame cabins set among leafy gardens',
    },
    gallery: [
      {
        src: '/images/adventure-hub/images/cabin%201.jpeg',
        alt: 'A-frame cabins set among leafy gardens',
      },
      {
        src: '/images/adventure-hub/images/cabin%202.jpeg',
        alt: 'The entrance to an A-frame cabin in a leafy garden',
      },
      {
        src: '/images/adventure-hub/images/cabin%20living%20room.jpeg',
        alt: 'A warm cabin living room surrounded by garden views',
      },
      {
        src: '/images/adventure-hub/images/cabin%20interior.jpeg',
        alt: 'A covered sitting area looking out onto a garden',
      },
      {
        src: '/images/adventure-hub/images/cabin%20exterior%20scenic%20view.jpeg',
        alt: 'A peaceful garden seating area outside the cabin',
      },
    ],
    seo: {
      title: 'Luxury Cabin Stays | Adventure Hub',
      description: 'Explore luxury cabin packages at Adventure Hub Longonot, from KSh 18,500 per couple per night, subject to availability.',
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

/** Source-controlled launch catalogue, used only to seed MongoDB and as a safe read fallback. */
export function getCatalogEntries(): readonly CatalogEntry[] { return entries; }

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
