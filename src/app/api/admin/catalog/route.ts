import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/admin-auth';
import { audit } from '@/lib/server/admin-data';
import { getManagedCatalog, saveCatalogEntry } from '@/lib/server/catalog-store';
export async function GET() { try { await requireAdmin(); return NextResponse.json({ entries: await getManagedCatalog(true) }); } catch { return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 }); } }
export async function POST(request: Request) { try { const admin = await requireAdmin(); const entry = await saveCatalogEntry(await request.json(), admin.email); await audit({ admin: admin.email, action: 'catalogue.saved', recordType: 'catalogue', recordId: entry.id, next: { name: entry.name, status: entry.status, pricing: entry.pricing } }); return NextResponse.json({ entry }); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to save catalogue entry.' }, { status: error instanceof Error && error.message === 'UNAUTHORIZED' ? 401 : 400 }); } }
