import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CatalogDetailView } from '@/components/services/catalog-detail-view';
import { getPublishedTransport } from '@/lib/catalog';
import { getCatalogMetadata } from '@/lib/catalog-seo';
import { getManagedEntry, getManagedRelated } from '@/lib/server/catalog-store';

type PageProps = { params: Promise<{ slug: string }> };
export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return getPublishedTransport().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return getCatalogMetadata('transport', slug, '/transport');
}

export default async function TransportDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = await getManagedEntry('transport', slug);
  if (!entry || entry.kind !== 'transport') notFound();

  return <CatalogDetailView entry={entry} collectionHref="/transport" collectionLabel="Transport" relatedEntries={await getManagedRelated(entry)} />;
}
