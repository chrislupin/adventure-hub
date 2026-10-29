import 'server-only';

import { ObjectId } from 'mongodb';
import { getMongoDatabase } from '@/lib/server/mongodb';
import type { BookingStatus, PersistedSubmission } from '@/types/submissions';

export const bookingStatuses: BookingStatus[] = ['received', 'confirmed', 'checked_in', 'completed', 'cancelled'];
export const statusTransitions: Record<BookingStatus, BookingStatus[]> = {
  received: ['confirmed', 'cancelled'], confirmed: ['checked_in', 'cancelled'], checked_in: ['completed', 'cancelled'], completed: [], cancelled: [],
};
export type AuditEvent = { _id?: ObjectId; at: Date; admin: string; action: string; recordType: string; recordId: string; previous?: Record<string, unknown>; next?: Record<string, unknown>; context?: Record<string, unknown> };

export async function ensureAdminIndexes() {
  const db = await getMongoDatabase();
  await Promise.all([
    db.collection<AuditEvent>('admin_audit_log').createIndex({ at: -1 }),
    db.collection<AuditEvent>('admin_audit_log').createIndex({ admin: 1, at: -1 }),
  ]);
  return db;
}

export async function audit(event: Omit<AuditEvent, 'at'>): Promise<void> {
  const db = await ensureAdminIndexes();
  await db.collection<AuditEvent>('admin_audit_log').insertOne({ ...event, at: new Date() });
}

export async function getDashboardMetrics() {
  const db = await ensureAdminIndexes();
  const submissions = db.collection<PersistedSubmission>('customer_submissions');
  const [byStatus, customers, services] = await Promise.all([
    submissions.aggregate<{ _id: BookingStatus; count: number }>([{ $group: { _id: '$status', count: { $sum: 1 } } }]).toArray(),
    submissions.aggregate<{ _id: string; count: number }>([{ $project: { identity: { $ifNull: ['$customer.email', '$customer.phone'] } } }, { $match: { identity: { $type: 'string' } } }, { $group: { _id: '$identity', count: { $sum: 1 } } }]).toArray(),
    submissions.distinct('service.id'),
  ]);
  const counts = Object.fromEntries(byStatus.map((item) => [item._id, item.count])) as Partial<Record<BookingStatus, number>>;
  return { totalBookings: byStatus.reduce((total, item) => total + item.count, 0), received: counts.received ?? 0, confirmed: counts.confirmed ?? 0, completed: counts.completed ?? 0, cancelled: counts.cancelled ?? 0, customers: customers.length, activeServices: services.length };
}

export async function listBookings(query: { search?: string; status?: string; page?: number; limit?: number }) {
  const db = await ensureAdminIndexes(); const collection = db.collection<PersistedSubmission>('customer_submissions');
  const filter: Record<string, unknown> = {};
  if (query.status && bookingStatuses.includes(query.status as BookingStatus)) filter.status = query.status;
  if (query.search?.trim()) { const escaped = query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); const regex = new RegExp(escaped, 'i'); filter.$or = [{ reference: regex }, { 'customer.name': regex }, { 'customer.phone': regex }, { 'service.name': regex }]; }
  const page = Math.max(1, query.page ?? 1); const limit = Math.min(100, Math.max(1, query.limit ?? 20));
  const [records, total] = await Promise.all([collection.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).toArray(), collection.countDocuments(filter)]);
  return { records, total, page, limit };
}

export async function updateBooking(reference: string, update: { status?: BookingStatus; adminNotes?: string; cancellationReason?: string }, admin: string) {
  const db = await ensureAdminIndexes(); const collection = db.collection<PersistedSubmission>('customer_submissions');
  const current = await collection.findOne({ reference }); if (!current) return null;
  if (update.status && !statusTransitions[current.status].includes(update.status)) throw new Error('INVALID_TRANSITION');
  if (update.status === 'cancelled' && !update.cancellationReason?.trim() && !current.cancellationReason) throw new Error('CANCELLATION_REASON_REQUIRED');
  const next = { ...current, ...(update.status ? { status: update.status } : {}), ...(update.adminNotes !== undefined ? { adminNotes: update.adminNotes.trim().slice(0, 4000) } : {}), ...(update.cancellationReason !== undefined ? { cancellationReason: update.cancellationReason.trim().slice(0, 1000) } : {}), updatedAt: new Date() };
  await collection.replaceOne({ _id: current._id }, next);
  await audit({ admin, action: 'booking.updated', recordType: 'booking', recordId: reference, previous: { status: current.status, adminNotes: current.adminNotes, cancellationReason: current.cancellationReason }, next: { status: next.status, adminNotes: next.adminNotes, cancellationReason: next.cancellationReason } });
  return next;
}

export async function listCustomers(search?: string) {
  const db = await ensureAdminIndexes(); const filter = search?.trim() ? { $match: { $or: [{ 'customer.name': { $regex: search.trim(), $options: 'i' } }, { 'customer.email': { $regex: search.trim(), $options: 'i' } }, { 'customer.phone': { $regex: search.trim(), $options: 'i' } }] } } : null;
  return db.collection<PersistedSubmission>('customer_submissions').aggregate<{ name: string; email?: string; phone?: string; bookingCount: number; lastBooking: Date }>([...(filter ? [filter] : []), { $group: { _id: { email: '$customer.email', phone: '$customer.phone', name: '$customer.name' }, bookingCount: { $sum: 1 }, lastBooking: { $max: '$createdAt' } } }, { $project: { _id: 0, name: '$_id.name', email: '$_id.email', phone: '$_id.phone', bookingCount: 1, lastBooking: 1 } }, { $sort: { lastBooking: -1 } }, { $limit: 200 }]).toArray();
}

export async function listAuditEvents() { const db = await ensureAdminIndexes(); return db.collection<AuditEvent>('admin_audit_log').find().sort({ at: -1 }).limit(200).toArray(); }
