import { BookingManager } from '@/components/admin/booking-manager';
import { AdminGate } from '@/components/admin/admin-gate';
export default function AdminBookingsPage() { return <AdminGate><section><p className="text-xs font-semibold uppercase tracking-[.16em] text-forest">Operations</p><h1 className="mt-2 font-display text-5xl">Bookings</h1><p className="mt-3 text-sm leading-6 text-[#59645d]">Review submitted inquiries, update valid booking stages, and keep internal notes.</p><div className="mt-7"><BookingManager /></div></section></AdminGate>; }
