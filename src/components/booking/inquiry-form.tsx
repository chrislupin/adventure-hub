'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Button, FormField, FormMessage, SelectField, TextareaField } from '@/components/ui/primitives';
import { attemptWhatsAppOpenOnce, isWhatsAppUrl } from '@/lib/whatsapp';

type InquiryOption = { slug: string; name: string; category: string };
type InquiryConfirmation = { reference: string; whatsappUrl: string | null };

export function InquiryForm({ options, initialServiceSlug = '' }: { options: readonly InquiryOption[]; initialServiceSlug?: string }) {
  const [serviceSlug, setServiceSlug] = useState(initialServiceSlug);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState<InquiryConfirmation | null>(null);
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
    setIsSubmitting(true);
    setError('');
    const formData = new FormData(event.currentTarget);
    const idempotencyKey = idempotencyKeyRef.current ??= crypto.randomUUID();
    const partySizeValue = String(formData.get('partySize') ?? '');
    const payload = {
      serviceSlug,
      contactName: formData.get('contactName'),
      contactEmail: formData.get('contactEmail'),
      contactPhone: formData.get('contactPhone'),
      preferredDate: formData.get('preferredDate'),
      partySize: partySizeValue ? Number(partySizeValue) : undefined,
      requirements: formData.get('requirements'),
      website: formData.get('website'),
    };

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'idempotency-key': idempotencyKey },
        body: JSON.stringify(payload),
      });
      const result = await response.json() as { reference?: string; whatsappUrl?: string | null; error?: { message?: string } };
      if (!response.ok || !result.reference) {
        setError(result.error?.message || 'We could not save your inquiry. Please try again later.');
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
      setError('We could not reach the inquiry service. Your inquiry was not confirmed as received. Please try again later.');
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  if (confirmation) {
    return (
      <section aria-labelledby="inquiry-confirmation-title" aria-live="polite" className="max-w-3xl border border-forest/20 bg-white p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-forest">Inquiry saved</p>
        <h2 id="inquiry-confirmation-title" className="mt-2 font-display text-4xl text-charcoal">Thank you for getting in touch.</h2>
        <p className="mt-4 text-sm leading-6 text-[#59645d]">Your reference is <strong className="text-charcoal">{confirmation.reference}</strong>. This is an inquiry, not a confirmed reservation.</p>
        {confirmation.whatsappUrl ? (
          <div className="mt-6">
            <a href={confirmation.whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 bg-forest px-6 py-3 text-sm font-semibold text-white hover:bg-evergreen focus-visible:outline-offset-4">
              Continue to WhatsApp <ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only">(opens in a new tab)</span>
            </a>
            <p className="mt-3 text-sm leading-6 text-[#59645d]" role="status">{automaticOpenAttempted ? 'We attempted to open WhatsApp. If it was blocked or is not installed, use the button above.' : 'Continue with the button above to open WhatsApp.'} Review the prefilled message and press Send there. Opening WhatsApp does not confirm that a message was sent or delivered.</p>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            <FormMessage variant="info">Your inquiry was saved, but WhatsApp is unavailable because the business number is not configured correctly. Keep your reference and use the contact page for next steps.</FormMessage>
            <Link href="/contact" className="inline-flex min-h-11 items-center text-sm font-semibold text-forest hover:text-evergreen">View contact options</Link>
          </div>
        )}
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2" aria-busy={isSubmitting}>
      {error && <div className="sm:col-span-2"><FormMessage>{error}</FormMessage></div>}
      <SelectField id="inquiry-service" label="What are you interested in?" value={serviceSlug} onChange={(event) => setServiceSlug(event.currentTarget.value)}>
        <option value="">Custom getaway planning</option>
        {options.map((option) => <option key={option.slug} value={option.slug}>{option.name} · {option.category}</option>)}
      </SelectField>
      <FormField id="inquiry-name" name="contactName" label="Your name" autoComplete="name" required />
      <FormField id="inquiry-email" name="contactEmail" label="Email address" type="email" autoComplete="email" />
      <FormField id="inquiry-phone" name="contactPhone" label="Phone number" type="tel" autoComplete="tel" />
      <p className="-mt-3 text-xs leading-5 text-[#59645d] sm:col-span-2">Provide an email address or phone number so the business can follow up.</p>
      <FormField id="inquiry-date" name="preferredDate" label="Preferred date" type="date" />
      <FormField id="inquiry-party-size" name="partySize" label="Number of people" type="number" min={1} max={100} step={1} />
      <TextareaField id="inquiry-requirements" name="requirements" label="What would you like us to know?" className="sm:col-span-2" rows={4} maxLength={1200} />
      <div className="absolute left-[-10000px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="inquiry-website">Leave this field empty</label>
        <input id="inquiry-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" disabled={!isClientReady || isSubmitting}>{isSubmitting ? 'Saving inquiry…' : 'Submit inquiry'}</Button>
        <p className="mt-3 text-xs leading-5 text-[#59645d]">Your inquiry is saved before any WhatsApp action appears. It does not confirm a reservation.</p>
      </div>
    </form>
  );
}
