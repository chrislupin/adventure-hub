'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const links = [{ href: '/admin', label: 'Overview' }, { href: '/admin/bookings', label: 'Bookings' }, { href: '/admin/customers', label: 'Customers' }, { href: '/admin/services', label: 'Services' }, { href: '/admin/packages', label: 'Packages' }, { href: '/admin/audit', label: 'Audit log' }];
export function AdminShell({ children, email }: { children: React.ReactNode; email: string }) {
  const path = usePathname(); const router = useRouter(); const [open, setOpen] = useState(false);
  async function logout() { await fetch('/api/admin/logout', { method: 'POST' }); router.replace('/admin/login'); router.refresh(); }
  return <div className="min-h-screen bg-[#f5f4ef] text-charcoal"><header className="sticky top-0 z-20 border-b border-[#deded3] bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4"><Link href="/admin" className="font-display text-2xl text-evergreen">Adventure Hub <span className="text-sm font-sans">Admin</span></Link><button className="border px-3 py-2 text-sm md:hidden" aria-expanded={open} onClick={() => setOpen(!open)}>Menu</button><div className="hidden items-center gap-4 md:flex"><span className="text-sm text-[#59645d]">{email}</span><button onClick={logout} className="text-sm font-semibold text-forest">Log out</button></div></div></header><div className="mx-auto grid max-w-7xl md:grid-cols-[13rem_1fr]"><aside className={`${open ? 'block' : 'hidden'} border-b border-[#deded3] bg-white p-4 md:block md:min-h-[calc(100vh-65px)] md:border-b-0 md:border-r`}><nav className="grid gap-1">{links.map((link) => <Link onClick={() => setOpen(false)} key={link.href} href={link.href} className={`rounded-sm px-3 py-2.5 text-sm ${path === link.href ? 'bg-forest text-white' : 'hover:bg-sand'}`}>{link.label}</Link>)}<button onClick={logout} className="mt-2 px-3 py-2 text-left text-sm font-semibold text-forest md:hidden">Log out</button></nav></aside><main className="min-w-0 p-5 sm:p-8">{children}</main></div></div>;
}
