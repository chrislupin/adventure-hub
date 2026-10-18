import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CatalogCard } from '@/components/services/catalog-card';
import { ImageGallery } from '@/components/services/image-gallery';
import { Button, Container } from '@/components/ui/primitives';
import { getCatalogPath } from '@/lib/catalog';
import type { CatalogEntry, MealPlan, PricingInformation } from '@/types/catalog';

function formatMealPlan(mealPlan: MealPlan): string {
  return {
    none: 'No meal plan',
    'half-board': 'Half board',
    'full-board': 'Full board',
    custom: 'Custom meal plan',
  }[mealPlan];
}

function formatPrice(pricing: PricingInformation): string | undefined {
  if (pricing.method === 'quote') return 'Quotation available by inquiry';
  if (pricing.method === 'fixed' && pricing.verified) {
    return `${new Intl.NumberFormat('en-KE', { style: 'currency', currency: pricing.currency, maximumFractionDigits: 0 }).format(pricing.amount)} (${pricing.basis})`;
  }
  if (pricing.method === 'from' && pricing.verified) {
    const amount = new Intl.NumberFormat('en-KE', { style: 'currency', currency: pricing.currency, maximumFractionDigits: 0 }).format(pricing.amount);
    return `From ${amount} (${pricing.basis})`;
  }
  return undefined;
}

function getBookingNote(entry: CatalogEntry): string {
  if (entry.bookingEligibility === 'inquiry') return 'An inquiry is not a confirmed reservation. Availability, inclusions and final pricing are confirmed with you before booking.';
  if (entry.bookingEligibility === 'not-configured') return 'Booking details are not configured yet. Contact Adventure Hub to discuss this offering.';
  return 'This offering is not currently accepting booking inquiries.';
}

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

export function CatalogDetailView({
  entry,
  collectionHref,
  collectionLabel,
  relatedEntries,
}: {
  entry: CatalogEntry;
  collectionHref: string;
  collectionLabel: string;
  relatedEntries: readonly CatalogEntry[];
}) {
  const images = [...(entry.coverImage ? [entry.coverImage] : []), ...(entry.gallery ?? [])];
  const facts: { label: string; value: string }[] = [{ label: 'Category', value: entry.category }];
  const price = formatPrice(entry.pricing);

  if (entry.location) facts.push({ label: 'Location', value: entry.location });
  if (entry.duration) facts.push({ label: 'Duration', value: entry.duration });
  if (entry.kind === 'stay') {
    if (entry.accommodationType) facts.push({ label: 'Accommodation', value: entry.accommodationType });
    if (entry.capacity) facts.push({ label: 'Capacity', value: `${entry.capacity} guests` });
    if (entry.mealPlans?.length) facts.push({ label: 'Meal plans', value: entry.mealPlans.map(formatMealPlan).join(', ') });
    if (entry.checkIn) facts.push({ label: 'Check-in', value: entry.checkIn });
    if (entry.checkOut) facts.push({ label: 'Check-out', value: entry.checkOut });
  }
  if (entry.kind === 'transport') {
    if (entry.vehicleCategories?.length) facts.push({ label: 'Vehicle categories', value: entry.vehicleCategories.join(', ') });
    if (entry.serviceArea) facts.push({ label: 'Service area', value: entry.serviceArea });
  }
  if (entry.kind === 'package') {
    if (entry.packageDetails.duration) facts.push({ label: 'Duration', value: entry.packageDetails.duration });
    if (entry.packageDetails.accommodation) facts.push({ label: 'Accommodation', value: entry.packageDetails.accommodation });
    facts.push({ label: 'Meal plan', value: formatMealPlan(entry.packageDetails.mealPlan) });
    if (entry.packageDetails.guestLimits?.minimum || entry.packageDetails.guestLimits?.maximum) {
      const { minimum, maximum } = entry.packageDetails.guestLimits;
      const guestRange = [minimum && `Min ${minimum}`, maximum && `Max ${maximum}`].filter(Boolean).join(', ');
      facts.push({ label: 'Guests', value: guestRange });
    }
  }

  const configuredFeatures = entry.features ?? [];
  const configuredInclusions = entry.kind === 'package' ? entry.packageDetails.includedActivities ?? [] : entry.inclusions ?? [];
  const exclusions = entry.kind === 'package' ? entry.packageDetails.exclusions ?? [] : [];
  const terms = entry.kind === 'package' ? entry.packageDetails.terms : undefined;
  const cancellationInformation = entry.kind === 'package' ? entry.packageDetails.cancellationInformation : undefined;
  const inquiryHref = `/booking?service=${encodeURIComponent(entry.slug)}`;

  return (
    <>
      <section className="py-8 sm:py-12">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-8 text-xs text-[#59645d]">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="hover:text-forest">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href={collectionHref} className="hover:text-forest">{collectionLabel}</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-semibold text-charcoal">{entry.name}</li>
            </ol>
          </nav>
          <div className="grid items-start gap-9 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
            <ImageGallery images={images} title={entry.name} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-forest">{entry.category}</p>
              <h1 className="mt-3 font-display text-5xl leading-[0.98] text-charcoal sm:text-6xl">{entry.name}</h1>
              <p className="mt-5 text-base leading-7 text-[#59645d]">{entry.shortDescription}</p>
              <p className="mt-4 text-sm leading-7 text-[#59645d]">{entry.description}</p>
              <dl className="mt-7 divide-y divide-[#dcded4] border-y border-[#dcded4]">
                {facts.map((fact) => (
                  <div key={fact.label} className="grid gap-1 py-3 sm:grid-cols-[9rem_1fr] sm:gap-4">
                    <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-[#59645d]">{fact.label}</dt>
                    <dd className="text-sm text-charcoal">{fact.value}</dd>
                  </div>
                ))}
                {price && (
                  <div className="grid gap-1 py-3 sm:grid-cols-[9rem_1fr] sm:gap-4">
                    <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-[#59645d]">Pricing</dt>
                    <dd className="text-sm text-charcoal">{price}</dd>
                  </div>
                )}
              </dl>
              <Button href={inquiryHref} className="mt-7">{entry.kind === 'transport' ? 'Request a quotation' : 'Start an inquiry'} <ArrowRight size={16} aria-hidden="true" /></Button>
              <p className="mt-3 max-w-lg text-xs leading-5 text-[#59645d]">{getBookingNote(entry)}</p>
            </div>
          </div>
        </Container>
      </section>

      {(configuredFeatures.length > 0 || configuredInclusions.length > 0 || exclusions.length > 0 || entry.kind === 'stay' && (entry.amenities?.length || entry.mealPlans?.length)) && (
        <section className="bg-[#f0eee7] py-12 sm:py-16">
          <Container className="grid gap-8 md:grid-cols-2">
            {configuredFeatures.length > 0 && <InfoList title="Features" items={configuredFeatures} />}
            {configuredInclusions.length > 0 && <InfoList title={entry.kind === 'package' ? 'Included activities' : 'Inclusions'} items={configuredInclusions} />}
            {exclusions.length > 0 && <InfoList title="Not included" items={exclusions} />}
            {entry.kind === 'stay' && entry.amenities && entry.amenities.length > 0 && <InfoList title="Amenities" items={entry.amenities} />}
            {entry.kind === 'package' && entry.packageDetails.optionalAddOns && entry.packageDetails.optionalAddOns.length > 0 && <InfoList title="Optional add-ons" items={entry.packageDetails.optionalAddOns} />}
          </Container>
        </section>
      )}

      {entry.priceOptions && entry.priceOptions.length > 0 && (
        <section className="bg-[#f0eee7] py-12 sm:py-16">
          <Container>
            <h2 className="font-display text-4xl text-charcoal">Packages and prices</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#59645d]">Prices are shown for the stated basis. Availability and final arrangements are confirmed after inquiry.</p>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {entry.priceOptions.map((option) => (
                <article key={option.name} className="border border-[#dcded4] bg-white p-5">
                  <h3 className="font-display text-2xl text-charcoal">{option.name}</h3>
                  <p className="mt-2 text-lg font-semibold text-forest">{formatAmount(option.amount, option.currency)}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-[#59645d]">{option.basis}</p>
                  {option.description && <p className="mt-4 text-sm leading-6 text-[#59645d]">{option.description}</p>}
                  {option.inclusions && option.inclusions.length > 0 && (
                    <ul className="mt-4 grid gap-2 text-sm leading-6 text-[#46544b]">
                      {option.inclusions.map((inclusion) => <li key={inclusion}>• {inclusion}</li>)}
                    </ul>
                  )}
                  {option.saving && <p className="mt-4 text-sm font-semibold text-forest">{option.saving}</p>}
                </article>
              ))}
            </div>
          </Container>
        </section>
      )}

      {entry.kind === 'package' && (terms || cancellationInformation) && (
        <section className="py-10">
          <Container className="grid gap-6 md:grid-cols-2">
            {terms && <InfoList title="Terms" items={[terms]} />}
            {cancellationInformation && <InfoList title="Cancellation information" items={[cancellationInformation]} />}
          </Container>
        </section>
      )}

      {relatedEntries.length > 0 && (
        <section className="py-14 sm:py-20">
          <Container>
            <h2 className="mb-8 font-display text-4xl text-charcoal">You may also like</h2>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {relatedEntries.map((relatedEntry) => <CatalogCard key={relatedEntry.id} entry={relatedEntry} href={getCatalogPath(relatedEntry)} />)}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}

function InfoList({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <section>
      <h2 className="font-display text-3xl text-charcoal">{title}</h2>
      <ul className="mt-4 grid gap-2">
        {items.map((item) => <li key={item} className="border-b border-[#dcded4] py-2 text-sm text-[#46544b]">{item}</li>)}
      </ul>
    </section>
  );
}
