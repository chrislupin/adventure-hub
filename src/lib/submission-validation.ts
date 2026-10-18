import { z } from 'zod';

const slugSchema = z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const optionalText = (maximum: number) => z.preprocess(
  (value) => typeof value === 'string' && value.trim() === '' ? undefined : value,
  z.string().trim().max(maximum).transform((value) => value.replace(/[\r\n\t]+/g, ' ')).optional(),
);
const emailSchema = z.preprocess(
  (value) => typeof value === 'string' && value.trim() === '' ? undefined : value,
  z.string().trim().email().max(254).optional(),
);
const dateSchema = z.preprocess(
  (value) => value === '' ? undefined : value,
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }, 'Enter a valid date').optional(),
);
const partySizeSchema = z.preprocess(
  (value) => value === '' || value === null ? undefined : typeof value === 'string' ? Number(value) : value,
  z.number().int().min(1).max(100).optional(),
);
const contactPhoneSchema = optionalText(32);
const honeypotSchema = z.string().max(0).optional();

function requireContactMethod(data: { contactEmail?: string; contactPhone?: string }, context: z.RefinementCtx) {
  if (!data.contactEmail && !data.contactPhone) {
    context.addIssue({ code: 'custom', path: ['contactEmail'], message: 'Add an email address or phone number.' });
  }
}

export const inquirySchema = z.object({
  serviceSlug: z.preprocess((value) => value === '' ? undefined : value, slugSchema.optional()),
  contactName: z.string().trim().min(1).max(100).transform((value) => value.replace(/[\r\n\t]+/g, ' ')),
  contactEmail: emailSchema,
  contactPhone: contactPhoneSchema,
  preferredDate: dateSchema,
  partySize: partySizeSchema,
  requirements: optionalText(1200),
  website: honeypotSchema,
}).strict().superRefine(requireContactMethod);

export const quotationSchema = z.object({
  serviceSlug: slugSchema,
  contactName: z.string().trim().min(1).max(100).transform((value) => value.replace(/[\r\n\t]+/g, ' ')),
  contactEmail: emailSchema,
  contactPhone: contactPhoneSchema,
  travelDateFrom: dateSchema,
  travelDateTo: dateSchema,
  partySize: partySizeSchema,
  pickup: z.string().trim().min(2).max(180).transform((value) => value.replace(/[\r\n\t]+/g, ' ')),
  destination: z.string().trim().min(2).max(180).transform((value) => value.replace(/[\r\n\t]+/g, ' ')),
  preferredTime: z.preprocess((value) => value === '' ? undefined : value, z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/).optional()),
  requirements: optionalText(1200),
  website: honeypotSchema,
}).strict().superRefine((data, context) => {
  requireContactMethod(data, context);
  if (data.travelDateFrom && data.travelDateTo && data.travelDateTo < data.travelDateFrom) {
    context.addIssue({ code: 'custom', path: ['travelDateTo'], message: 'End date must be on or after the start date.' });
  }
});

export type InquiryInput = z.infer<typeof inquirySchema>;
export type QuotationInput = z.infer<typeof quotationSchema>;