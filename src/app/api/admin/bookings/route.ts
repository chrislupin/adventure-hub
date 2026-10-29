import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/admin-auth';
import { listBookings } from '@/lib/server/admin-data';
export async function GET(request: Request) {
  try { await requireAdmin(); const url = new URL(request.url); return NextResponse.json(await listBookings({ search: url.searchParams.get('search') ?? undefined, status: url.searchParams.get('status') ?? undefined, page: Number(url.searchParams.get('page')) || 1 })); }
  catch { return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 }); }
}
