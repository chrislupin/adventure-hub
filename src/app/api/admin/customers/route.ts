import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/admin-auth'; import { listCustomers } from '@/lib/server/admin-data';
export async function GET(request: Request) { try { await requireAdmin(); return NextResponse.json({ customers: await listCustomers(new URL(request.url).searchParams.get('search') ?? undefined) }); } catch { return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 }); } }
