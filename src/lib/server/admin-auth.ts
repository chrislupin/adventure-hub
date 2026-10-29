import 'server-only';

import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { cookies } from 'next/headers';

const scrypt = promisify(scryptCallback);
const COOKIE_NAME = 'adventure_hub_admin';
const SESSION_SECONDS = 60 * 60 * 8;

export type AdminSession = { email: string; expiresAt: number };

function sessionSecret(): string | undefined { return process.env.ADMIN_SESSION_SECRET?.trim(); }
function toUrlSafe(value: Buffer | string): string { return Buffer.from(value).toString('base64url'); }

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const encoded = process.env.ADMIN_PASSWORD_HASH?.trim();
  if (!encoded || password.length > 512) return false;
  const [algorithm, salt, expected] = encoded.split('$');
  if (algorithm !== 'scrypt' || !salt || !expected) return false;
  try {
    const actual = Buffer.from(await scrypt(password, Buffer.from(salt, 'base64url'), 64) as ArrayBuffer);
    const hash = Buffer.from(expected, 'base64url');
    return hash.length === actual.length && timingSafeEqual(hash, actual);
  } catch { return false; }
}

function sign(payload: string): string { return createHmac('sha256', sessionSecret() ?? '').update(payload).digest('base64url'); }

export function createAdminSession(email: string): string | undefined {
  if (!sessionSecret()) return undefined;
  const payload = toUrlSafe(JSON.stringify({ email, expiresAt: Math.floor(Date.now() / 1000) + SESSION_SECONDS }));
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSession(value: string | undefined): AdminSession | null {
  if (!value || !sessionSecret()) return null;
  const [payload, signature] = value.split('.');
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload)); const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as AdminSession;
    return typeof data.email === 'string' && typeof data.expiresAt === 'number' && data.expiresAt > Math.floor(Date.now() / 1000) ? data : null;
  } catch { return null; }
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = verifyAdminSession((await cookies()).get(COOKIE_NAME)?.value);
  if (!session) throw new Error('UNAUTHORIZED');
  return session;
}

export const adminCookie = { name: COOKIE_NAME, maxAge: SESSION_SECONDS, httpOnly: true, sameSite: 'strict' as const, secure: process.env.NODE_ENV === 'production', path: '/' };
export function configuredAdminEmail(): string | undefined { return process.env.ADMIN_EMAIL?.trim().toLowerCase(); }
export function createPasswordHashInput(): string { return `scrypt$${toUrlSafe(randomBytes(16))}$<derived-hash>`; }
