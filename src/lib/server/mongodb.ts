import 'server-only';

import { MongoClient, type Collection, type Db } from 'mongodb';
import type { PersistedSubmission, SubmissionStore } from '@/types/submissions';

type RateLimitRecord = { _id: string; count: number; expiresAt: Date };

class MongoSubmissionStore implements SubmissionStore {
  private readonly submissions: Collection<PersistedSubmission>;
  private readonly rateLimits: Collection<RateLimitRecord>;

  constructor(database: Db) {
    this.submissions = database.collection<PersistedSubmission>('customer_submissions');
    this.rateLimits = database.collection<RateLimitRecord>('submission_rate_limits');
  }

  async ensureIndexes(): Promise<void> {
    await Promise.all([
      this.submissions.createIndex({ reference: 1 }, { unique: true }),
      this.submissions.createIndex(
        { kind: 1, idempotencyKey: 1 },
        { unique: true, partialFilterExpression: { idempotencyKey: { $type: 'string' } } },
      ),
      this.submissions.createIndex({ kind: 1, createdAt: -1 }),
      this.rateLimits.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    ]);
  }

  async findByIdempotencyKey(kind: PersistedSubmission['kind'], key: string): Promise<PersistedSubmission | null> {
    return this.submissions.findOne({ kind, idempotencyKey: key });
  }

  async save(record: PersistedSubmission): Promise<{ record: PersistedSubmission; created: boolean }> {
    try {
      await this.submissions.insertOne(record);
      return { record, created: true };
    } catch (error) {
      if (!(error instanceof Error) || !('code' in error) || error.code !== 11000) throw error;
      const existing = await this.findByIdempotencyKey(record.kind, record.idempotencyKey);
      if (!existing) throw error;
      return { record: existing, created: false };
    }
  }

  async allowRequest(key: string, now: Date, limit: number, windowMs: number): Promise<boolean> {
    const bucket = Math.floor(now.getTime() / windowMs);
    const id = `${key}:${bucket}`;
    const expiresAt = new Date((bucket + 1) * windowMs);
    await this.rateLimits.updateOne({ _id: id }, { $inc: { count: 1 }, $setOnInsert: { expiresAt } }, { upsert: true });
    const record = await this.rateLimits.findOne({ _id: id }, { projection: { count: 1 } });
    return (record?.count ?? 0) <= limit;
  }
}

declare global {
  var adventureHubMongoClientPromise: Promise<MongoClient> | undefined;
  var adventureHubSubmissionStorePromise: Promise<MongoSubmissionStore> | undefined;
}

export async function getMongoSubmissionStore(): Promise<SubmissionStore> {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) throw new Error('MONGODB_URI is not configured');

  globalThis.adventureHubMongoClientPromise ??= new MongoClient(uri, { maxPoolSize: 10 }).connect();
  globalThis.adventureHubSubmissionStorePromise ??= globalThis.adventureHubMongoClientPromise.then(async (client) => {
    const database = client.db(process.env.MONGODB_DB?.trim() || 'adventure_hub');
    const store = new MongoSubmissionStore(database);
    await store.ensureIndexes();
    return store;
  });
  return globalThis.adventureHubSubmissionStorePromise;
}
