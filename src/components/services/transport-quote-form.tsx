'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Button, FormField, FormMessage, TextareaField } from '@/components/ui/primitives';
import { attemptWhatsAppOpenOnce, isWhatsAppUrl } from '@/lib/whatsapp';

type QuotationConfirmation = { reference: string; whatsappUrl: string | null };

export function TransportQuoteForm() {
  const [confirmation, setConfirmation] = useState<QuotationConfirmation | null>(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [automaticOpenAttempted, setAutomaticOpenAttempted] = useState(false);
  const [isClientReady, setIsClientReady] = useState(false);
  const isSubmittingRef = useRef(false);
  const attemptedWhatsAppReferences = useRef(new Set<string>());
  const idempotencyKeyRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    setIsClientReady(true);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setMessage('');
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const idempotencyKey = idempotencyKeyRef.current ??= crypto.randomUUID();
    const partySizeValue = String(formData.get('partySize') ?? '');

    try {
      const response = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'idempotency-key': idempotencyKey },
        body: JSON.stringify({
          serviceSlug: 'chauffeur-and-private-transport',
          contactName: formData.get('contactName'),
          contactEmail: formData.get('contactEmail'),
          contactPhone: formData.get('contactPhone'),
          travelDateFrom: formData.get('travelDateFrom'),
          travelDateTo: formData.get('travelDateTo'),
          partySize: partySizeValue ? Number(partySizeValue) : undefined,
          pickup: formData.get('pickup'),
          destination: formData.get('destination'),
          preferredTime: formData.get('preferredTime'),
          requirements: formData.get('requirements'),
          website: formData.get('website'),
        }),
      });
      const result = await response.json() as { reference?: string; whatsappUrl?: string | null; error?: { message?: string } };
      if (!response.ok || !result.reference) {
        setMessage(result.error?.message || 'We could not save your quotation request. Please try again later.');
        return;
      }
      const whatsappUrl = isWhatsAppUrl(result.whatsappUrl) ? result.whatsappUrl : null;
      setConfirmation({ reference: result.reference, whatsappUrl });
      const attempted = attemptWhatsAppOpenOnce(
        result.reference,
        whatsappUrl,
        attemptedWhatsAppReferences.current,
        (url) => { window.open(url, '_blank', 'noopener,noreferrer'); },
      );
      setAutomaticOpenAttempted(attempted);
    } catch {
      setMessage('We could not reach the quotation service. Your request was not confirmed as received. Please try again later.');
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  if (confirmation) {
    return (
      <section aria-labelledby="quotation-confirmation-title" aria-live="polite" className="border border-forest/20 bg-white p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-forest">Quotation request saved</p>
        <h3 id="quotation-confirmation-title" className="mt-2 font-display text-4xl text-charcoal">Your reference is {confirmation.reference}</h3>
        <p className="mt-4 text-sm leading-6 text-[#59645d]">The request is not a quotation or a confirmed booking. The business must review it and provide applicable pricing.</p>
        {confirmation.whatsappUrl ? (
          <div className="mt-6">
            <a href={confirmation.whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 bg-forest px-6 py-3 text-sm font-semibold text-white hover:bg-evergreen focus-visible:outline-offset-4">
              Continue to WhatsApp <ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only">(opens in a new tab)</span>
            </a>
            <p className="mt-3 text-sm leading-6 text-[#59645d]" role="status">{automaticOpenAttempted ? 'We attempted to open WhatsApp. If it was blocked or is not installed, use the button above.' : 'Continue with the button above to open WhatsApp.'} Review the prefilled message and press Send there. Opening WhatsApp does not confirm that a message was sent or delivered.</p>
          </div>
        ) : (
          <div className="mt-5"><FormMessage variant="info">Your request is saved, but WhatsApp is unavailable because its configured number is missing or invalid. Keep your reference and use the contact page for next steps.</FormMessage></div>
        )}
      </section>
    );
  }

  return (
    <div aria-busy={isSubmitting}>
      <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
        {message && <div className="sm:col-span-2"><FormMessage>{message}</FormMessage></div>}
        <FormField id="transport-contact-name" name="contactName" label="Your name" autoComplete="name" required />
        <FormField id="transport-contact-email" name="contactEmail" label="Email address" type="email" autoComplete="email" />
        <FormField id="transport-contact-phone" name="contactPhone" label="Phone number" type="tel" autoComplete="tel" />
        <p className="-mt-3 text-xs leading-5 text-[#59645d] sm:col-span-2">Provide an email address or phone number so the business can follow up.</p>
        <FormField id="transport-pickup" name="pickup" label="Pickup location" autoComplete="street-address" required />
        <FormField id="transport-destination" name="destination" label="Destination" required />
        <FormField id="transport-date-from" name="travelDateFrom" label="Travel date from" type="date" />
        <FormField id="transport-date-to" name="travelDateTo" label="Travel date to" type="date" />
        <FormField id="transport-time" name="preferredTime" label="Preferred pickup time" type="time" />
        <FormField id="transport-passengers" name="partySize" label="Passenger count" type="number" min={1} max={100} step={1} />
        <TextareaField id="transport-requirements" name="requirements" label="Luggage or special requirements" className="sm:col-span-2" rows={3} maxLength={1200} />
        <div className="absolute left-[-10000px] h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor="transport-website">Leave this field empty</label>
          <input id="transport-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={!isClientReady || isSubmitting}>{isSubmitting ? 'Saving request…' : 'Request quotation'}</Button>
          <p className="mt-3 text-xs leading-5 text-[#59645d]">Availability, vehicle category, coverage and fare are confirmed after inquiry. A request does not reserve transport.</p>
        </div>
      </form>
    </div>
  );
}
