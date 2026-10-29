import { NextResponse } from 'next/server';
import { adminCookie, configuredAdminEmail, createAdminSession, verifyAdminPassword } from '@/lib/server/admin-auth';

export async function POST(request: Request) {
  try {
    const body = await request.json() as { email?: unknown; password?: unknown };
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const configuredEmail = configuredAdminEmail();
    const valid = Boolean(configuredEmail && email === configuredEmail && await verifyAdminPassword(password));
    if (!valid) return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401, headers: { 'cache-control': 'no-store' } });
    const session = createAdminSession(email);
    if (!session) return NextResponse.json({ error: 'Administrator authentication is not configured.' }, { status: 503 });
    const response = NextResponse.json({ ok: true }, { headers: { 'cache-control': 'no-store' } });
    response.cookies.set({ ...adminCookie, value: session });
    return response;
  } catch { return NextResponse.json({ error: 'Invalid login request.' }, { status: 400 }); }
}
