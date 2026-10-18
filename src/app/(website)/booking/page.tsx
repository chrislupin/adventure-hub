import type { Metadata } from 'next';
import { InquiryForm } from '@/components/booking/inquiry-form';
import { Container } from '@/components/ui/primitives';
import { getPublishedEntries } from '@/lib/catalog';

export const metadata: Metadata = {
	title: 'Plan a Getaway | Adventure Hub',
	description: 'Start a conversation with Adventure Hub about an experience, stay or custom getaway.',
	alternates: { canonical: '/booking' },
};

type BookingPageProps = { searchParams: Promise<{ service?: string }> };

export default async function BookingPage({ searchParams }: BookingPageProps) {
	const { service: serviceSlug } = await searchParams;
	const options = getPublishedEntries().map(({ slug, name, category }) => ({ slug, name, category }));
	const initialServiceSlug = options.some((option) => option.slug === serviceSlug) ? serviceSlug : '';

	return (
		<section className="flex min-h-[55vh] items-center py-16 sm:py-24">
			<Container className="max-w-5xl">
				<p className="text-xs font-semibold uppercase tracking-[0.16em] text-forest">Plan your escape</p>
				<h1 className="mt-4 max-w-4xl font-display text-5xl leading-[1.02] text-charcoal sm:text-6xl">Start a conversation.</h1>
				<p className="mt-5 max-w-2xl text-base leading-7 text-[#59645d]">Tell us what you are interested in and how to reach you. Availability, details and pricing are confirmed directly; an inquiry is not a reservation.</p>
				<div className="mt-8 max-w-3xl"><InquiryForm options={options} initialServiceSlug={initialServiceSlug} /></div>
			</Container>
		</section>
	);
}
