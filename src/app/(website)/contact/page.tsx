import type { Metadata } from 'next';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { Button, Container, FormMessage } from '@/components/ui/primitives';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
	title: 'Contact Adventure Hub',
	description: 'Find configured contact channels and social links for Adventure Hub.',
	alternates: { canonical: '/contact' },
};

export default function ContactPage() {
	const hasDirectContact = Boolean(siteConfig.contact.email || siteConfig.contact.phone || siteConfig.contact.whatsappNumber);

	return (
		<section className="flex min-h-[55vh] items-center py-16 sm:py-24">
			<Container className="max-w-5xl">
				<p className="text-xs font-semibold uppercase tracking-[0.16em] text-forest">We’re here to help</p>
				<h1 className="mt-4 font-display text-5xl leading-[1.02] text-charcoal sm:text-6xl">Contact Adventure Hub.</h1>
				<p className="mt-5 max-w-2xl text-base leading-7 text-[#59645d]">Ask about experiences, cabin stays, transport or a custom getaway. Availability, inclusions and pricing are confirmed directly.</p>
				<div className="mt-8 grid max-w-2xl gap-3">
					{siteConfig.contact.email && <a href={`mailto:${siteConfig.contact.email}`} className="inline-flex min-h-12 items-center gap-3 border-b border-[#dcded4] text-sm font-medium text-charcoal hover:text-forest"><Mail size={18} aria-hidden="true" />{siteConfig.contact.email}</a>}
					{siteConfig.contact.phone && <a href={`tel:${siteConfig.contact.phone}`} className="inline-flex min-h-12 items-center gap-3 border-b border-[#dcded4] text-sm font-medium text-charcoal hover:text-forest"><Phone size={18} aria-hidden="true" />{siteConfig.contact.phone}</a>}
					{siteConfig.contact.whatsappNumber && <a href={`https://wa.me/${siteConfig.contact.whatsappNumber}`} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-3 border-b border-[#dcded4] text-sm font-medium text-charcoal hover:text-forest"><Phone size={18} aria-hidden="true" />WhatsApp <span className="sr-only">(opens in a new tab)</span></a>}
					<p className="inline-flex min-h-12 items-center gap-3 border-b border-[#dcded4] text-sm text-[#59645d]"><MapPin size={18} aria-hidden="true" />{siteConfig.contact.serviceArea}</p>
				</div>
				{!hasDirectContact && (
					<div className="mt-6 max-w-2xl">
						<FormMessage variant="info">Direct email, phone and WhatsApp contact are not configured yet. This website does not receive or store contact form submissions.</FormMessage>
					</div>
				)}
				<div className="mt-8 flex flex-wrap items-center gap-5">
					<Button href="/experiences" variant="secondary">Explore experiences</Button>
					<a href={siteConfig.social.tiktok} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-forest hover:text-evergreen">Adventure Hub on TikTok <ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only">(opens in a new tab)</span></a>
				</div>
			</Container>
		</section>
	);
}
