import { NextResponse } from 'next/server';
import { adminCookie } from '@/lib/server/admin-auth';
export async function POST() { const response = NextResponse.json({ ok: true }); response.cookies.set({ ...adminCookie, value: '', maxAge: 0 }); return response; }
