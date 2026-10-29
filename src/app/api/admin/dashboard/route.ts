import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/admin-auth';
import { getDashboardMetrics } from '@/lib/server/admin-data';
export async function GET() { try { await requireAdmin(); return NextResponse.json(await getDashboardMetrics(), { headers: { 'cache-control': 'no-store' } }); } catch { return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 }); } }
