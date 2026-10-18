import type { Metadata } from 'next';
import { TransportQuoteForm } from '@/components/services/transport-quote-form';
import { ServiceCatalogPage } from '@/components/services/service-catalog-page';
import { Container, SectionHeading } from '@/components/ui/primitives';
import { getPublishedTransport } from '@/lib/catalog';

export const metadata: Metadata = {
	title: 'Chauffeur and Private Transport | Adventure Hub',
	description: 'Request a chauffeur and private transport quotation. Share pickup, destination, date, time, passenger count and luggage needs.',
	alternates: { canonical: '/transport' },
};

export default function TransportPage() {
	return (
		<>
			<ServiceCatalogPage
				eyebrow="Private transport"
				title="The journey is part of the getaway."
				description="Ask about chauffeur and private transport for your plans. Vehicle categories, service coverage, availability and fares are confirmed by quotation; none are assumed here."
				entries={getPublishedTransport()}
				detailPath="/transport"
				searchLabel="Search transport services"
				emptyTitle="No transport services are listed yet"
				emptyDescription="Contact Adventure Hub to ask about current chauffeur and private transport options."
			/>
			<section id="request-quote" className="scroll-mt-24 bg-[#f0eee7] py-14 sm:py-20">
				<Container className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
					<div>
						<SectionHeading eyebrow="Request a quotation" title="Tell us about your journey." description="Share your preferred pickup, destination, timing and passenger count. This request draft does not reserve a vehicle." />
						<p className="mt-5 text-sm leading-6 text-[#59645d]">No vehicle category, fare or service coverage is shown until confirmed for your route.</p>
					</div>
					<TransportQuoteForm />
				</Container>
			</section>
		</>
	);
}
