import type { Metadata } from 'next';
import { ServiceCatalogPage } from '@/components/services/service-catalog-page';
import { getPublishedExperiences } from '@/lib/catalog';

export const metadata: Metadata = {
	title: 'Outdoor Experiences | Adventure Hub',
	description: 'Explore quad biking, hot-air balloon experiences and nature-focused adventures with Adventure Hub.',
	alternates: { canonical: '/experiences' },
};

export default function ExperiencesPage() {
	return (
		<ServiceCatalogPage
			eyebrow="Outdoor experiences"
			title="Find your kind of adventure."
			description="Explore quad biking, hot-air balloon experiences and nature-focused getaways. Locations, operators, requirements, dates and pricing are confirmed individually by inquiry."
			entries={getPublishedExperiences()}
			detailPath="/experiences"
			searchLabel="Search experiences"
			emptyTitle="No experiences are listed yet"
			emptyDescription="Check back for confirmed activities or ask Adventure Hub about planning an outdoor getaway."
		/>
	);
}
