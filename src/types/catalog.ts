export type PublicationStatus = 'published' | 'draft';
export type MealPlan = 'none' | 'half-board' | 'full-board' | 'custom';

export type CatalogImage = {
  src: string;
  alt: string;
  illustrative?: boolean;
};

export type PricingInformation =
  | { method: 'unconfigured' }
  | { method: 'quote'; currency?: string }
  | { method: 'fixed'; amount: number; currency: string; verified: true; basis: string }
  | { method: 'from'; amount: number; currency: string; verified: true; basis: string };

export type CatalogBase = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: string;
  coverImage?: CatalogImage;
  gallery?: readonly CatalogImage[];
  location?: string;
  status: PublicationStatus;
  pricing: PricingInformation;
  features?: readonly string[];
  inclusions?: readonly string[];
  duration?: string;
  bookingEligibility: 'inquiry' | 'not-configured' | 'not-eligible';
  seo: {
    title: string;
    description: string;
  };
  relatedIds?: readonly string[];
};

export type ExperienceEntry = CatalogBase & {
  kind: 'experience';
};

export type StayEntry = CatalogBase & {
  kind: 'stay';
  accommodationType?: string;
  capacity?: number;
  amenities?: readonly string[];
  mealPlans?: readonly MealPlan[];
  checkIn?: string;
  checkOut?: string;
};

export type TransportEntry = CatalogBase & {
  kind: 'transport';
  vehicleCategories?: readonly string[];
  serviceArea?: string;
};

export type PackageEntry = CatalogBase & {
  kind: 'package';
  packageDetails: {
    duration?: string;
    accommodation?: string;
    mealPlan: MealPlan;
    includedActivities?: readonly string[];
    exclusions?: readonly string[];
    guestLimits?: { minimum?: number; maximum?: number };
    optionalAddOns?: readonly string[];
    terms?: string;
    cancellationInformation?: string;
  };
};

export type ServiceEntry = ExperienceEntry | StayEntry | TransportEntry;
export type CatalogEntry = ServiceEntry | PackageEntry;