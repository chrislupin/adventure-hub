import Link from 'next/link';
export default function AdminPage() {
  return <section className="mx-auto max-w-5xl px-6 py-20"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a7650]">Private area</p><h1 className="mt-3 text-4xl font-semibold">Adventure Hub admin</h1><p className="mt-4 max-w-2xl leading-7 text-[#52635a]">Reserved for the future management dashboard. Before launch, add authentication and role-based access control.</p><div className="mt-8 flex flex-wrap gap-3"><Link className="rounded-full border px-5 py-3" href="/admin/bookings">Bookings</Link><Link className="rounded-full border px-5 py-3" href="/admin/services">Services</Link><Link className="rounded-full border px-5 py-3" href="/admin/packages">Packages</Link></div></section>;
}
