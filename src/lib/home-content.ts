export type HomePackage = {
  id: string;
  name: string;
  href: string;
  location?: string;
  duration?: string;
  accommodation?: string;
  mealPlan?: 'Half board' | 'Full board';
  includedActivities?: readonly string[];
  startingPrice?: {
    amount: number;
    currency: 'KES';
    verified: true;
  };
};

export const homeContent = {
  hero: {
    eyebrow: 'Your next escape starts here',
    title: 'Escape the Ordinary.',
    description: 'Discover extraordinary stays, outdoor adventures and unforgettable getaways with Adventure Hub.',
    image: {
      src: '/images/hero-maasai-mara-balloon.jpg',
      alt: 'A hot-air balloon above a herd of zebras in the Maasai Mara, Kenya',
    },
  },
  services: [
    {
      title: 'Quad biking',
      category: 'Outdoor adventure',
      description: 'Leave the usual route behind. Ask about available dates, routes and requirements for a quad biking experience.',
      href: '/experiences',
      image: {
        src: '/images/adventure-hub/images/quad%20bike.jpeg',
        alt: 'Guests pause with quad bikes at a scenic viewpoint',
      },
      layout: 'md:col-span-6 xl:col-span-5',
      imageRatio: 'aspect-[1.35/1] xl:aspect-[1.24/1]',
    },
    {
      title: 'Hot-air balloon experiences',
      category: 'Outdoor adventure',
      description: 'Take in the landscape from above. Timing, operator details and pricing are confirmed with your inquiry.',
      href: '/experiences',
      image: {
        src: '/images/balloon-safari-illustrative.jpg',
        alt: 'A hot-air balloon floats above an elephant in the Maasai Mara savannah',
      },
      layout: 'md:col-span-6 xl:col-span-4',
      imageRatio: 'aspect-[1.35/1] xl:aspect-[1.06/1]',
    },
    {
      title: 'Luxury cabin stays',
      category: 'Stay',
      description: 'Make space for a slower stay. Confirm dates, amenities and meal-plan details with the team.',
      href: '/stays',
      image: {
        src: '/images/adventure-hub/images/cabin%201.jpeg',
        alt: 'A-frame cabins set among leafy gardens',
      },
      layout: 'md:col-span-6 xl:col-span-3',
      imageRatio: 'aspect-[1.35/1] xl:aspect-[0.78/1]',
    },
    {
      title: 'Chauffeur services',
      category: 'Private transport',
      description: 'Coordinate private transport around your itinerary. Share your pickup, destination and group size.',
      href: '/transport',
      image: {
        src: '/images/scenic-suv-illustrative.jpg',
        alt: 'A traveler stands beside a white SUV on an open road',
      },
      layout: 'md:col-span-6 xl:col-span-6',
      imageRatio: 'aspect-[1.35/1] xl:aspect-[1.7/1]',
    },
    {
      title: 'Curated getaways',
      category: 'Trip planning',
      description: 'Bring accommodation, activities and the journey together in a getaway shaped around your preferences.',
      href: '/packages',
      image: {
        src: '/images/tsavo-savannah-illustrative.jpg',
        alt: 'A lone acacia tree at sunset in Tsavo East National Park, Kenya',
      },
      layout: 'md:col-span-6 xl:col-span-6',
      imageRatio: 'aspect-[1.35/1] xl:aspect-[1.7/1]',
    },
  ],
  featured: [
    {
      eyebrow: 'Stay',
      title: 'A place to slow the pace.',
      description: 'Explore cabin stays and ask about half-board or full-board options. Confirm amenities, meal details, dates and rates for your chosen stay before you decide.',
      href: '/stays',
      linkLabel: 'Browse stays',
      image: {
        src: '/images/adventure-hub/images/cabin%20living%20room.jpeg',
        alt: 'A warm cabin living room surrounded by garden views',
      },
      highlights: ['Cabin accommodation', 'Half-board or full-board options', 'Details confirmed for your dates'],
    },
    {
      eyebrow: 'Experience',
      title: 'Make a day of the outdoors.',
      description: 'From quad biking to hot-air balloon experiences, tell us what interests you. Timing, availability, operator details and rates are confirmed before you commit.',
      href: '/experiences',
      linkLabel: 'Explore experiences',
      image: {
        src: '/images/balloon-safari-illustrative.jpg',
        alt: 'A hot-air balloon above an elephant in the Maasai Mara',
      },
      highlights: ['Quad biking', 'Hot-air balloon experiences', 'Availability confirmed by inquiry'],
    },
  ],
  packages: {
    eyebrow: 'Curated getaways',
    title: 'A getaway shaped around you.',
    description: 'Bring a stay, an activity and the journey together in one inquiry. There are no preset package prices or inclusions published yet; the team will confirm the details with you before you decide.',
    image: {
      src: '/images/tsavo-savannah-illustrative.jpg',
      alt: 'An acacia tree silhouetted against a Tsavo East sunset',
    },
    mealPlans: [
      { name: 'Half board', description: 'Ask which meal plan is available for your selected stay.' },
      { name: 'Full board', description: 'Confirm the specific meal inclusions before booking.' },
    ],
    publishedPackages: [] as readonly HomePackage[],
  },
  showcase: {
    eyebrow: 'A closer look',
    title: 'Cabin calm, garden light and a little more outside.',
    description: 'A glimpse of the atmosphere waiting behind your next getaway inquiry.',
    items: [
      {
        title: 'Garden cabins',
        description: 'A quiet arrival among the trees.',
        src: '/images/adventure-hub/images/cabin%202.jpeg',
        alt: 'The entrance to an A-frame cabin in a leafy garden',
        layout: 'md:col-span-7 md:row-span-2',
        ratio: 'aspect-[4/3] md:aspect-auto md:h-full',
      },
      {
        title: 'Poolside pause',
        description: 'A cool, private corner of the garden.',
        src: '/images/adventure-hub/images/swimming%20pool.jpeg',
        alt: 'A small swimming pool framed by tropical planting',
        layout: 'md:col-span-5',
        ratio: 'aspect-[4/3]',
      },
      {
        title: 'Inside the stay',
        description: 'Light-filled spaces that open to green.',
        src: '/images/adventure-hub/images/cabin%20interior.jpeg',
        alt: 'A covered sitting area looking out onto a green garden',
        layout: 'md:col-span-5',
        ratio: 'aspect-[4/3]',
      },
    ],
  },
  reasons: [
    {
      title: 'More ways to escape',
      description: 'Explore activities, cabin stays, private transport and trip planning in one place.',
    },
    {
      title: 'Plans shaped around you',
      description: 'Share your preferences and dates; the team can help shape a trip around them.',
    },
    {
      title: 'Clear next steps',
      description: 'An inquiry starts a conversation. Details are confirmed with you before a reservation is final.',
    },
  ],
  steps: [
    { number: '01', title: 'Discover', description: 'Explore an experience, stay or transport option that catches your eye.' },
    { number: '02', title: 'Send an inquiry', description: 'Share your dates, preferences and group details so the team can respond.' },
    { number: '03', title: 'Confirm together', description: 'Review availability, inclusions and pricing with Adventure Hub before confirming.' },
  ],
  social: {
    eyebrow: 'Follow the feeling',
    title: 'A little more outside.',
    description: 'Find Adventure Hub on TikTok for social updates and inspiration. Customer stories will be shared here only when approved.',
  },
} as const;
