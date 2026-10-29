import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/admin-auth';
import { bookingStatuses, updateBooking } from '@/lib/server/admin-data';
export async function PATCH(request: Request, { params }: { params: Promise<{ reference: string }> }) {
  try {
    const admin = await requireAdmin(); const body = await request.json() as { status?: unknown; adminNotes?: unknown; cancellationReason?: unknown };
    const status = typeof body.status === 'string' && bookingStatuses.includes(body.status as typeof bookingStatuses[number]) ? body.status as typeof bookingStatuses[number] : undefined;
    const adminNotes = typeof body.adminNotes === 'string' ? body.adminNotes : undefined; const cancellationReason = typeof body.cancellationReason === 'string' ? body.cancellationReason : undefined;
    const booking = await updateBooking((await params).reference, { status, adminNotes, cancellationReason }, admin.email);
    if (!booking) return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
    return NextResponse.json({ booking });
  } catch (error) { const message = error instanceof Error && error.message === 'CANCELLATION_REASON_REQUIRED' ? 'A cancellation reason is required.' : error instanceof Error && error.message === 'INVALID_TRANSITION' ? 'That booking status transition is not allowed.' : 'Unauthorized.'; return NextResponse.json({ error: message }, { status: message === 'Unauthorized.' ? 401 : 400 }); }
}
