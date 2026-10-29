import type { Metadata } from 'next';
import { ServiceCatalogPage } from '@/components/services/service-catalog-page';
import { getManagedCatalog } from '@/lib/server/catalog-store';

export const metadata: Metadata = {
  title: 'Getaway Packages | Adventure Hub',
  description: 'Ask Adventure Hub to shape a getaway around stays, outdoor experiences and private transport.',
  alternates: { canonical: '/packages' },
};
export const dynamic = 'force-dynamic';

export default async function PackagesPage() {
  const entries = (await getManagedCatalog()).filter((entry) => entry.kind === 'package');
  return (
    <ServiceCatalogPage
      eyebrow="Curated getaways"
      title="A getaway shaped around you."
      description="Bring accommodation, experiences and transport together in a custom trip inquiry. Package names, destinations, inclusions, durations and prices will appear here once confirmed."
      entries={entries}
      detailPath="/packages"
      searchLabel="Search packages"
      emptyTitle="No preset packages are published yet"
      emptyDescription="Adventure Hub can discuss a custom getaway. Meal plans, activities, exclusions, dates, terms and prices are confirmed before you decide. An inquiry is not a reservation."
      emptyAction={{ label: 'Ask about a custom getaway', href: '/booking' }}
    />
  );
}
