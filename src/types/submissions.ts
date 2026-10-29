import type { CatalogEntry } from '@/types/catalog';

export type SubmissionKind = 'inquiry' | 'quotation';
export type BookingStatus = 'received' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled';

export type PersistedSubmission = {
  reference: string;
  idempotencyKey: string;
  kind: SubmissionKind;
  status: BookingStatus;
  createdAt: Date;
  updatedAt?: Date;
  adminNotes?: string;
  cancellationReason?: string;
  service: {
    id: string;
    slug: string;
    name: string;
    category: string;
    kind: CatalogEntry['kind'] | 'custom';
  };
  customer: {
    name: string;
    email?: string;
    phone?: string;
  };
  details: Record<string, string | number>;
};

export interface SubmissionStore {
  findByIdempotencyKey(kind: SubmissionKind, key: string): Promise<PersistedSubmission | null>;
  save(record: PersistedSubmission): Promise<{ record: PersistedSubmission; created: boolean }>;
  allowRequest(key: string, now: Date, limit: number, windowMs: number): Promise<boolean>;
}
