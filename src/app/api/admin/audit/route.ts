import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/admin-auth'; import { listAuditEvents } from '@/lib/server/admin-data';
export async function GET() { try { await requireAdmin(); return NextResponse.json({ events: await listAuditEvents() }); } catch { return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 }); } }
