import { AdminGate } from '@/components/admin/admin-gate';
import { CatalogManager } from '@/components/admin/catalog-manager';
export default function AdminPackagesPage() { return <AdminGate><section><p className="text-xs font-semibold uppercase tracking-[.16em] text-forest">Catalogue</p><h1 className="mt-2 font-display text-5xl">Accommodation & packages</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[#59645d]">Create and manage stays and curated package listings.</p><div className="mt-7"><CatalogManager kind="package" /></div></section></AdminGate>; }
