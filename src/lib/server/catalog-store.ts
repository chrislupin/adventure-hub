import 'server-only';

import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { getCatalogEntries } from '@/lib/catalog';
import { getMongoDatabase } from '@/lib/server/mongodb';
import type { CatalogEntry, PublicationStatus } from '@/types/catalog';

type StoredCatalogEntry = CatalogEntry & { _id?: unknown; updatedAt?: Date; updatedBy?: string };
const statusSchema = z.enum(['published', 'draft']);
const kindSchema = z.enum(['experience', 'stay', 'transport', 'package']);
const updateSchema = z.object({
  id: z.string().min(1).max(120).optional(), slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9-]+$/).optional(), name: z.string().trim().min(2).max(160).optional(), shortDescription: z.string().trim().min(2).max(300).optional(), description: z.string().trim().min(2).max(5000).optional(), category: z.string().trim().min(2).max(100).optional(), status: statusSchema.optional(), kind: kindSchema.optional(),
  pricing: z.object({ method: z.enum(['quote', 'fixed', 'from', 'unconfigured']), amount: z.number().nonnegative().finite().optional(), basis: z.string().trim().max(100).optional() }).optional(),
}).strict();

function clean(entry: StoredCatalogEntry): CatalogEntry { const catalog = { ...entry } as Partial<StoredCatalogEntry>; delete catalog._id; delete catalog.updatedAt; delete catalog.updatedBy; return catalog as CatalogEntry; }
async function collection() { const db = await getMongoDatabase(); const catalog = db.collection<StoredCatalogEntry>('catalog_entries'); await Promise.all([catalog.createIndex({ id: 1 }, { unique: true }), catalog.createIndex({ slug: 1 }, { unique: true }), catalog.createIndex({ kind: 1, status: 1 })]); return catalog; }

export async function ensureCatalogSeed() {
  const catalog = await collection();
  if (await catalog.estimatedDocumentCount() > 0) return catalog;
  const seed = getCatalogEntries().map((entry) => ({ ...entry, updatedAt: new Date(), updatedBy: 'system-seed' }));
  if (seed.length) await catalog.insertMany(seed);
  return catalog;
}
export async function getManagedCatalog(includeDrafts = false): Promise<CatalogEntry[]> { const catalog = await ensureCatalogSeed(); return (await catalog.find(includeDrafts ? {} : { status: 'published' }).sort({ kind: 1, name: 1 }).toArray()).map(clean); }
export async function getManagedEntry(kind: CatalogEntry['kind'], slug: string): Promise<CatalogEntry | undefined> { const catalog = await ensureCatalogSeed(); const entry = await catalog.findOne({ kind, slug, status: 'published' }); return entry ? clean(entry) : undefined; }
export async function getManagedRelated(entry: CatalogEntry, limit = 3): Promise<CatalogEntry[]> { const entries = await getManagedCatalog(); return entries.filter((candidate) => candidate.id !== entry.id && candidate.kind === entry.kind).slice(0, limit); }
export async function saveCatalogEntry(input: unknown, admin: string): Promise<CatalogEntry> {
  const parsed = updateSchema.parse(input); const catalog = await ensureCatalogSeed(); const now = new Date();
  if (!parsed.id) {
    if (!parsed.kind || !parsed.slug || !parsed.name || !parsed.shortDescription || !parsed.description || !parsed.category || !parsed.status || !parsed.pricing) throw new Error('New catalogue entries require all required fields.');
    const pricing = parsed.pricing.method === 'quote' || parsed.pricing.method === 'unconfigured' ? { method: parsed.pricing.method } : { method: parsed.pricing.method, amount: parsed.pricing.amount ?? 0, currency: 'KES', verified: true as const, basis: parsed.pricing.basis || 'per person' };
    const entry = { id: `managed-${randomUUID()}`, slug: parsed.slug, name: parsed.name, shortDescription: parsed.shortDescription, description: parsed.description, category: parsed.category, kind: parsed.kind, status: parsed.status, pricing, bookingEligibility: 'inquiry' as const, seo: { title: `${parsed.name} | Adventure Hub`, description: parsed.shortDescription }, ...(parsed.kind === 'package' ? { packageDetails: { mealPlan: 'custom' as const } } : {}), updatedAt: now, updatedBy: admin } as CatalogEntry & { updatedAt: Date; updatedBy: string };
    await catalog.insertOne(entry); return clean(entry);
  }
  const existing = await catalog.findOne({ id: parsed.id }); if (!existing) throw new Error('Catalogue entry not found.');
  const next = { ...parsed }; delete next.id;
  if (next.pricing && (next.pricing.method === 'fixed' || next.pricing.method === 'from') && (next.pricing.amount === undefined || !next.pricing.basis)) throw new Error('A positive price basis and amount are required.');
  const pricing = next.pricing ? (next.pricing.method === 'quote' || next.pricing.method === 'unconfigured' ? { method: next.pricing.method } : { method: next.pricing.method, amount: next.pricing.amount, basis: next.pricing.basis, currency: 'KES', verified: true }) : undefined;
  const changes = { ...next, ...(pricing ? { pricing } : {}), updatedAt: now, updatedBy: admin } as Partial<StoredCatalogEntry>;
  const result = await catalog.findOneAndUpdate({ id: parsed.id }, { $set: changes }, { returnDocument: 'after' }); if (!result) throw new Error('Catalogue entry not found.'); return clean(result);
}
export async function setCatalogStatus(id: string, status: PublicationStatus, admin: string) { return saveCatalogEntry({ id, status }, admin); }
