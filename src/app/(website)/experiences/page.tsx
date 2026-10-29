import type { Metadata } from 'next';
import { ServiceCatalogPage } from '@/components/services/service-catalog-page';
import { getManagedCatalog } from '@/lib/server/catalog-store';

export const metadata: Metadata = {
	title: 'Outdoor Experiences | Adventure Hub',
	description: 'Explore quad biking, hot-air balloon experiences and nature-focused adventures with Adventure Hub.',
	alternates: { canonical: '/experiences' },
};
export const dynamic = 'force-dynamic';

export default async function ExperiencesPage() {
  const entries = (await getManagedCatalog()).filter((entry) => entry.kind === 'experience');
	return (
		<ServiceCatalogPage
			eyebrow="Outdoor experiences"
			title="Find your kind of adventure."
			description="Explore quad biking and Adventure Hub Longonot activities including horse riding, bonfires, pool access, sauna sessions, nature walks and cycling. Availability and final arrangements are confirmed by inquiry."
			entries={entries}
			detailPath="/experiences"
			searchLabel="Search experiences"
			emptyTitle="No experiences are listed yet"
			emptyDescription="Check back for confirmed activities or ask Adventure Hub about planning an outdoor getaway."
		/>
	);
}
