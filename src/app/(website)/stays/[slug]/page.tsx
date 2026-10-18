import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CatalogDetailView } from '@/components/services/catalog-detail-view';
import { getPublishedEntryBySlug, getPublishedStays, getRelatedEntries } from '@/lib/catalog';
import { getCatalogMetadata } from '@/lib/catalog-seo';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPublishedStays().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return getCatalogMetadata('stay', slug, '/stays');
}

export default async function StayDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = getPublishedEntryBySlug('stay', slug);
  if (!entry || entry.kind !== 'stay') notFound();

  return <CatalogDetailView entry={entry} collectionHref="/stays" collectionLabel="Stays" relatedEntries={getRelatedEntries(entry)} />;
}