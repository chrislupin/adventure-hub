import { DashboardOverview } from '@/components/admin/dashboard-overview';
import { AdminGate } from '@/components/admin/admin-gate';
export default function AdminPage() {
  return <AdminGate><section><p className="text-xs font-semibold uppercase tracking-[.16em] text-forest">Operations</p><h1 className="mt-2 font-display text-5xl">Dashboard overview</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[#59645d]">Live totals calculated from saved customer inquiries. Financial metrics are intentionally unavailable until the booking workflow records payment and confirmed prices.</p><div className="mt-7"><DashboardOverview /></div></section></AdminGate>;
}
