import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin/admin-shell';
import { requireAdmin } from '@/lib/server/admin-auth';
export async function AdminGate({ children }: { children: React.ReactNode }) { try { const admin = await requireAdmin(); return <AdminShell email={admin.email}>{children}</AdminShell>; } catch { redirect('/admin/login'); } }
