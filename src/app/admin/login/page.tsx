'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormField, FormMessage } from '@/components/ui/primitives';

export default function AdminLoginPage() {
  const router = useRouter(); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  async function submit(form: FormData) { setLoading(true); setError(''); const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: form.get('email'), password: form.get('password') }) }); if (response.ok) router.replace('/admin'); else { const result = await response.json().catch(() => ({})); setError(result.error ?? 'Unable to sign in.'); setLoading(false); } }
  return <main className="grid min-h-screen place-items-center bg-sand px-5"><form action={submit} className="w-full max-w-md border border-[#deded3] bg-white p-7 shadow-sm"><p className="text-xs font-semibold uppercase tracking-[.18em] text-forest">Private area</p><h1 className="mt-2 font-display text-4xl text-charcoal">Admin sign in</h1><p className="mt-3 text-sm leading-6 text-[#59645d]">Use the administrator credentials configured for Adventure Hub.</p><div className="mt-6 grid gap-4"><FormField id="email" name="email" type="email" label="Email address" autoComplete="username" required /><FormField id="password" name="password" type="password" label="Password" autoComplete="current-password" required />{error && <FormMessage>{error}</FormMessage>}<button disabled={loading} className="min-h-11 bg-forest px-5 text-sm font-semibold text-white disabled:opacity-60">{loading ? 'Signing in…' : 'Sign in'}</button></div></form></main>;
}
