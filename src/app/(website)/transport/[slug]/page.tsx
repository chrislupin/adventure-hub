import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CatalogDetailView } from '@/components/services/catalog-detail-view';
import { getPublishedEntryBySlug, getPublishedTransport, getRelatedEntries } from '@/lib/catalog';
import { getCatalogMetadata } from '@/lib/catalog-seo';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPublishedTransport().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return getCatalogMetadata('transport', slug, '/transport');
}

export default async function TransportDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = getPublishedEntryBySlug('transport', slug);
  if (!entry || entry.kind !== 'transport') notFound();

  return <CatalogDetailView entry={entry} collectionHref="/transport" collectionLabel="Transport" relatedEntries={getRelatedEntries(entry)} />;
}