import type { Metadata } from 'next';
import { ServiceCatalogPage } from '@/components/services/service-catalog-page';
import { getPublishedStays } from '@/lib/catalog';

export const metadata: Metadata = {
	title: 'Cabin Stays | Adventure Hub',
	description: 'Explore Adventure Hub cabin accommodation and ask about half-board or full-board options.',
	alternates: { canonical: '/stays' },
};

export default function StaysPage() {
	return (
		<ServiceCatalogPage
			eyebrow="Accommodation"
			title="Stay somewhere special."
			description="Explore luxury cabin packages at Adventure Hub Longonot, with half-board and full-board options. Prices are shown for the stated basis; availability and final arrangements are confirmed by inquiry."
			entries={getPublishedStays()}
			detailPath="/stays"
			searchLabel="Search stays"
			emptyTitle="No stays are listed yet"
			emptyDescription="Ask Adventure Hub about current cabin accommodation options and meal plans."
		/>
	);
}
