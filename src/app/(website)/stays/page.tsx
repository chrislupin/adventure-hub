import type { Metadata } from 'next';
import { ServiceCatalogPage } from '@/components/services/service-catalog-page';
import { getManagedCatalog } from '@/lib/server/catalog-store';

export const metadata: Metadata = {
	title: 'Cabin Stays | Adventure Hub',
	description: 'Explore Adventure Hub cabin accommodation and ask about half-board or full-board options.',
	alternates: { canonical: '/stays' },
};
export const dynamic = 'force-dynamic';

export default async function StaysPage() {
  const entries = (await getManagedCatalog()).filter((entry) => entry.kind === 'stay');
	return (
		<ServiceCatalogPage
			eyebrow="Accommodation"
			title="Stay somewhere special."
			description="Explore luxury cabin packages at Adventure Hub Longonot, with half-board and full-board options. Prices are shown for the stated basis; availability and final arrangements are confirmed by inquiry."
			entries={entries}
			detailPath="/stays"
			searchLabel="Search stays"
			emptyTitle="No stays are listed yet"
			emptyDescription="Ask Adventure Hub about current cabin accommodation options and meal plans."
		/>
	);
}
