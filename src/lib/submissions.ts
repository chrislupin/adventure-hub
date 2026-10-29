import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { getPublishedEntries } from '@/lib/catalog';
import { inquirySchema, quotationSchema, type InquiryInput, type QuotationInput } from '@/lib/submission-validation';
import { buildWhatsAppUrl, normalizeWhatsAppNumber } from '@/lib/whatsapp';
import type { PersistedSubmission, SubmissionKind, SubmissionStore } from '@/types/submissions';

export type SubmissionHandlerDependencies = {
  getStore: () => Promise<SubmissionStore>;
  getWhatsAppNumber: () => string | undefined;
  now?: () => Date;
  createReference?: (kind: SubmissionKind, date: Date) => string;
};

const requestLimit = 5;
const requestWindowMs = 15 * 60 * 1000;
const maxBodyBytes = 16 * 1024;

async function readJsonBody(request: Request): Promise<{ value?: unknown; errorStatus?: number }> {
  const reader = request.body?.getReader();
  if (!reader) return { errorStatus: 400 };
  const chunks: Uint8Array[] = [];
  let size = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBodyBytes) {
        await reader.cancel();
        return { errorStatus: 413 };
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return { value: JSON.parse(new TextDecoder().decode(bytes)) as unknown };
  } catch {
    return { errorStatus: 400 };
  } finally {
    reader.releaseLock();
  }
}

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

function getHashedClientKey(request: Request, kind: SubmissionKind, date: Date): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const address = forwarded || request.headers.get('x-real-ip')?.trim() || 'unknown';
  const timeBucket = Math.floor(date.getTime() / requestWindowMs);
  return createHash('sha256').update(`${kind}:${timeBucket}:${address}`).digest('hex');
}

function getIdempotencyKey(request: Request): string {
  const supplied = request.headers.get('idempotency-key')?.trim();
  return supplied && /^[A-Za-z0-9_-]{16,128}$/.test(supplied) ? supplied : randomUUID();
}

function newReference(kind: SubmissionKind, date: Date): string {
  const prefix = kind === 'inquiry' ? 'AHI' : 'AHR';
  const day = date.toISOString().slice(0, 10).replaceAll('-', '');
  return `${prefix}-${day}-${randomBytes(4).toString('hex').toUpperCase()}`;
}

async function getService(slug: string | undefined) {
  if (!slug) {
    return {
      id: 'custom-getaway',
      slug: 'custom-getaway',
      name: 'Custom getaway planning',
      category: 'Trip planning',
      kind: 'custom' as const,
    };
  }

  let entry = getPublishedEntries().find((candidate) => candidate.slug === slug);
  try { const { getManagedCatalog } = await import('@/lib/server/catalog-store'); entry = (await getManagedCatalog()).find((candidate) => candidate.slug === slug) ?? entry; } catch { /* Local tests and degraded database reads retain the launch catalogue. */ }
  if (!entry) return undefined;
  return { id: entry.id, slug: entry.slug, name: entry.name, category: entry.category, kind: entry.kind };
}

function buildInquiryMessage(record: PersistedSubmission): string {
  const lines = [
    'Hello Adventure Hub, I have submitted an inquiry.',
    '',
    `Inquiry reference: ${record.reference}`,
    `Service: ${record.service.name}`,
    `Category: ${record.service.category}`,
  ];
  if (typeof record.details.preferredDate === 'string') lines.push(`Preferred date: ${record.details.preferredDate}`);
  if (typeof record.details.partySize === 'number') lines.push(`Number of people: ${record.details.partySize}`);
  if (typeof record.details.requirements === 'string') lines.push(`Requirements: ${record.details.requirements}`);
  lines.push('', 'Please help me with availability and the next steps.');
  return lines.join('\n');
}

function buildQuotationMessage(record: PersistedSubmission): string {
  const lines = [
    'Hello Adventure Hub, I would like a quotation.',
    '',
    `Quotation request reference: ${record.reference}`,
    `Service/package: ${record.service.name}`,
  ];
  const dateFrom = record.details.travelDateFrom;
  const dateTo = record.details.travelDateTo;
  if (typeof dateFrom === 'string' && typeof dateTo === 'string') lines.push(`Travel dates: ${dateFrom} to ${dateTo}`);
  else if (typeof dateFrom === 'string') lines.push(`Travel date: ${dateFrom}`);
  else if (typeof dateTo === 'string') lines.push(`Travel date: ${dateTo}`);
  if (typeof record.details.partySize === 'number') lines.push(`Number of people: ${record.details.partySize}`);
  if (typeof record.details.pickup === 'string') lines.push(`Pickup: ${record.details.pickup}`);
  if (typeof record.details.destination === 'string') lines.push(`Destination: ${record.details.destination}`);
  if (typeof record.details.preferredTime === 'string') lines.push(`Preferred time: ${record.details.preferredTime}`);
  if (typeof record.details.requirements === 'string') lines.push(`Requirements: ${record.details.requirements}`);
  lines.push('', 'Please review my request and share the applicable quotation.');
  return lines.join('\n');
}

function getInquiryDetails(input: InquiryInput): Record<string, string | number> {
  return Object.fromEntries(Object.entries({
    preferredDate: input.preferredDate,
    partySize: input.partySize,
    requirements: input.requirements,
  }).filter((entry): entry is [string, string | number] => entry[1] !== undefined));
}

function getQuotationDetails(input: QuotationInput): Record<string, string | number> {
  return Object.fromEntries(Object.entries({
    travelDateFrom: input.travelDateFrom,
    travelDateTo: input.travelDateTo,
    partySize: input.partySize,
    pickup: input.pickup,
    destination: input.destination,
    preferredTime: input.preferredTime,
    requirements: input.requirements,
  }).filter((entry): entry is [string, string | number] => entry[1] !== undefined));
}

function getCustomer(input: InquiryInput | QuotationInput): PersistedSubmission['customer'] {
  return {
    name: input.contactName,
    ...(input.contactEmail ? { email: input.contactEmail } : {}),
    ...(input.contactPhone ? { phone: input.contactPhone } : {}),
  };
}

function successfulSubmissionResponse(kind: SubmissionKind, record: PersistedSubmission, whatsappNumber: string | undefined, status: number): Response {
  const message = kind === 'inquiry' ? buildInquiryMessage(record) : buildQuotationMessage(record);
  const whatsappUrl = buildWhatsAppUrl(normalizeWhatsAppNumber(whatsappNumber), message);
  return jsonResponse({ reference: record.reference, whatsappUrl: whatsappUrl ?? null }, status);
}

export function createSubmissionHandler(kind: SubmissionKind, dependencies: SubmissionHandlerDependencies) {
  return async function handleSubmission(request: Request): Promise<Response> {
    if (request.method !== 'POST') return jsonResponse({ error: { message: 'Method not allowed.' } }, 405);

    const contentLength = Number(request.headers.get('content-length') || 0);
    if (Number.isFinite(contentLength) && contentLength > maxBodyBytes) return jsonResponse({ error: { message: 'Request is too large.' } }, 413);
    const parsedBody = await readJsonBody(request);
    if (parsedBody.errorStatus === 413) return jsonResponse({ error: { message: 'Request is too large.' } }, 413);
    if (parsedBody.errorStatus || parsedBody.value === undefined) return jsonResponse({ error: { message: 'Request must contain valid JSON.' } }, 400);

    try {
      const parsed = kind === 'inquiry' ? inquirySchema.safeParse(parsedBody.value) : quotationSchema.safeParse(parsedBody.value);
      if (!parsed.success) {
        return jsonResponse({ error: { message: 'Please check the highlighted details and try again.' } }, 400);
      }
      const input = parsed.data;
      if ('website' in input && input.website) return jsonResponse({ error: { message: 'Request could not be accepted.' } }, 400);

      const service = await getService(input.serviceSlug);
      if (!service) return jsonResponse({ error: { message: 'This service is no longer available for inquiry.' } }, 404);

      const now = dependencies.now?.() ?? new Date();
      const idempotencyKey = getIdempotencyKey(request);
      const store = await dependencies.getStore();
      const existing = await store.findByIdempotencyKey(kind, idempotencyKey);
      if (existing) return successfulSubmissionResponse(kind, existing, dependencies.getWhatsAppNumber(), 200);

      const allowed = await store.allowRequest(getHashedClientKey(request, kind, now), now, requestLimit, requestWindowMs);
      if (!allowed) return jsonResponse({ error: { message: 'Too many requests. Please try again later.' } }, 429);

      const reference = (dependencies.createReference ?? newReference)(kind, now);
      const record: PersistedSubmission = {
        reference,
        idempotencyKey,
        kind,
        status: 'received',
        createdAt: now,
        service,
        customer: getCustomer(input),
        details: kind === 'inquiry' ? getInquiryDetails(input as InquiryInput) : getQuotationDetails(input as QuotationInput),
      };

      const saved = await store.save(record);
      return successfulSubmissionResponse(kind, saved.record, dependencies.getWhatsAppNumber(), saved.created ? 201 : 200);
    } catch {
      return jsonResponse({ error: { message: 'We could not save your request. Please try again later.' } }, 503);
    }
  };
}
