import { AdminGate } from '@/components/admin/admin-gate';
import { CatalogManager } from '@/components/admin/catalog-manager';
export default function AdminServicesPage() { return <AdminGate><section><p className="text-xs font-semibold uppercase tracking-[.16em] text-forest">Catalogue</p><h1 className="mt-2 font-display text-5xl">Services</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[#59645d]">Create and update public services, prices, availability and publication status.</p><div className="mt-7"><CatalogManager /></div></section></AdminGate>; }
