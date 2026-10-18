import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createSubmissionHandler, type SubmissionHandlerDependencies } from '@/lib/submissions';
import type { PersistedSubmission, SubmissionStore } from '@/types/submissions';

const fixedDate = new Date('2026-10-16T10:30:00.000Z');

function createStore(options: { failInsert?: boolean; allowRequest?: boolean } = {}) {
  const records: PersistedSubmission[] = [];
  const store: SubmissionStore = {
    findByIdempotencyKey: async (kind, key) => records.find((record) => record.kind === kind && record.idempotencyKey === key) ?? null,
    save: async (record) => {
      if (options.failInsert) throw new Error('database unavailable');
      const existing = records.find((candidate) => candidate.kind === record.kind && candidate.idempotencyKey === record.idempotencyKey);
      if (existing) return { record: existing, created: false };
      records.push(record);
      return { record, created: true };
    },
    allowRequest: async () => options.allowRequest ?? true,
  };
  return { store, records };
}

function makeRequest(path: string, body: unknown, idempotencyKey?: string) {
  return new Request(`https://adventure-hub.test${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.10', ...(idempotencyKey ? { 'idempotency-key': idempotencyKey } : {}) },
    body: JSON.stringify(body),
  });
}

function dependencies(store: SubmissionStore, whatsappNumber: string | undefined, createReference?: SubmissionHandlerDependencies['createReference']): SubmissionHandlerDependencies {
  return {
    getStore: async () => store,
    getWhatsAppNumber: () => whatsappNumber,
    now: () => fixedDate,
    createReference,
  };
}

const validInquiry = {
  serviceSlug: 'quad-biking',
  contactName: 'Ada Lovelace',
  contactEmail: 'ada@example.test',
  preferredDate: '2026-12-04',
  partySize: 3,
  requirements: 'Please share the current requirements.',
};

const validQuotation = {
  serviceSlug: 'chauffeur-and-private-transport',
  contactName: 'Grace Hopper',
  contactPhone: '+254700000000',
  pickup: 'Nairobi CBD',
  destination: 'Nanyuki',
};

describe('persisted inquiry and quotation submissions', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('persists an inquiry before returning its unique reference and encoded WhatsApp action', async () => {
    const { store, records } = createStore();
    const handler = createSubmissionHandler('inquiry', dependencies(store, '+254 (711) 851-915'));
    const response = await handler(makeRequest('/api/inquiries', validInquiry));
    const result = await response.json();

    expect(response.status).toBe(201);
    expect(result.reference).toMatch(/^AHI-20261016-[A-F0-9]{8}$/);
    expect(result.whatsappUrl).toContain('https://wa.me/254711851915?text=');
    expect(records).toHaveLength(1);
    expect(records[0].status).toBe('received');
    expect(records[0].service.name).toBe('Quad biking');
    expect(records[0].service.category).toBe('Outdoor adventure');
    const message = new URL(result.whatsappUrl).searchParams.get('text') ?? '';
    expect(message).toContain(`Inquiry reference: ${result.reference}`);
    expect(message).toContain('Preferred date: 2026-12-04');
    expect(message).toContain('Number of people: 3');
    expect(message).not.toContain('undefined');
    expect(records[0].status).toBe('received');
  });

  it('assigns distinct references to separate saved requests', async () => {
    const { store } = createStore();
    const handler = createSubmissionHandler('inquiry', dependencies(store, undefined));
    const responses = await Promise.all([
      handler(makeRequest('/api/inquiries', validInquiry)),
      handler(makeRequest('/api/inquiries', { ...validInquiry, contactName: 'Another Guest' })),
    ]);
    const results = await Promise.all(responses.map((response) => response.json()));
    expect(results[0].reference).not.toBe(results[1].reference);
  });

  it('returns the original saved inquiry for a retry with the same idempotency key', async () => {
    const { store, records } = createStore();
    const handler = createSubmissionHandler('inquiry', dependencies(store, '254711851915'));
    const key = 'retry-safe-inquiry-key';
    const first = await handler(makeRequest('/api/inquiries', validInquiry, key));
    const retry = await handler(makeRequest('/api/inquiries', validInquiry, key));
    const firstResult = await first.json();
    const retryResult = await retry.json();

    expect(first.status).toBe(201);
    expect(retry.status).toBe(200);
    expect(retryResult.reference).toBe(firstResult.reference);
    expect(retryResult.whatsappUrl).toBe(firstResult.whatsappUrl);
    expect(records).toHaveLength(1);
  });

  it('saves a quotation request and omits missing dates and party size from its WhatsApp message', async () => {
    const { store, records } = createStore();
    const handler = createSubmissionHandler('quotation', dependencies(store, '254711851915'));
    const response = await handler(makeRequest('/api/quotations', validQuotation));
    const result = await response.json();
    const message = new URL(result.whatsappUrl).searchParams.get('text') ?? '';

    expect(response.status).toBe(201);
    expect(result.reference).toMatch(/^AHR-20261016-[A-F0-9]{8}$/);
    expect(records[0].kind).toBe('quotation');
    expect(records[0].details.pickup).toBe('Nairobi CBD');
    expect(message).toContain(`Quotation request reference: ${result.reference}`);
    expect(message).toContain('Service/package: Chauffeur and private transport');
    expect(message).not.toContain('Travel dates:');
    expect(message).not.toContain('Number of people:');
    expect(message).not.toContain('undefined');
    expect(message).not.toContain('KES 0');
  });

  it('returns a saved reference without a WhatsApp action when number configuration is invalid', async () => {
    const { store, records } = createStore();
    const handler = createSubmissionHandler('inquiry', dependencies(store, 'not-a-number'));
    const response = await handler(makeRequest('/api/inquiries', validInquiry));
    const result = await response.json();

    expect(response.status).toBe(201);
    expect(result.reference).toBeTruthy();
    expect(result.whatsappUrl).toBeNull();
    expect(records).toHaveLength(1);
  });

  it('never returns success or a WhatsApp link when persistence fails', async () => {
    const { store } = createStore({ failInsert: true });
    const handler = createSubmissionHandler('inquiry', dependencies(store, '254711851915'));
    const response = await handler(makeRequest('/api/inquiries', validInquiry));

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: { message: 'We could not save your request. Please try again later.' } });
  });

  it('does not accept a browser-supplied price or confirmation fields', async () => {
    const { store, records } = createStore();
    const handler = createSubmissionHandler('quotation', dependencies(store, '254711851915'));
    const response = await handler(makeRequest('/api/quotations', { ...validQuotation, price: 0, status: 'confirmed' }));

    expect(response.status).toBe(400);
    expect(records).toHaveLength(0);
  });

  it('rejects invalid contact, unpublished services, honeypot submissions and rate-limited requests', async () => {
    const { store, records } = createStore();
    const handler = createSubmissionHandler('inquiry', dependencies(store, '254711851915'));

    expect((await handler(makeRequest('/api/inquiries', { ...validInquiry, contactEmail: '', contactPhone: '' }))).status).toBe(400);
    expect((await handler(makeRequest('/api/inquiries', { ...validInquiry, serviceSlug: 'unknown-service' }))).status).toBe(404);
    expect((await handler(makeRequest('/api/inquiries', { ...validInquiry, website: 'spam' }))).status).toBe(400);
    expect(records).toHaveLength(0);

    const limitedStore = createStore({ allowRequest: false });
    const limitedHandler = createSubmissionHandler('inquiry', dependencies(limitedStore.store, '254711851915'));
    expect((await limitedHandler(makeRequest('/api/inquiries', validInquiry))).status).toBe(429);
    expect(limitedStore.records).toHaveLength(0);
  });
});
