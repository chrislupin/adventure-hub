import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CatalogDetailView } from '@/components/services/catalog-detail-view';
import { getPublishedEntryBySlug, getPublishedPackages, getRelatedEntries } from '@/lib/catalog';
import { getCatalogMetadata } from '@/lib/catalog-seo';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPublishedPackages().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return getCatalogMetadata('package', slug, '/packages');
}

export default async function PackageDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = getPublishedEntryBySlug('package', slug);
  if (!entry || entry.kind !== 'package') notFound();

  return <CatalogDetailView entry={entry} collectionHref="/packages" collectionLabel="Packages" relatedEntries={getRelatedEntries(entry)} />;
}