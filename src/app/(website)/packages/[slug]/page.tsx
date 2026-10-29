import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CatalogDetailView } from '@/components/services/catalog-detail-view';
import { getPublishedPackages } from '@/lib/catalog';
import { getCatalogMetadata } from '@/lib/catalog-seo';
import { getManagedEntry, getManagedRelated } from '@/lib/server/catalog-store';

type PageProps = { params: Promise<{ slug: string }> };
export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return getPublishedPackages().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return getCatalogMetadata('package', slug, '/packages');
}

export default async function PackageDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = await getManagedEntry('package', slug);
  if (!entry || entry.kind !== 'package') notFound();

  return <CatalogDetailView entry={entry} collectionHref="/packages" collectionLabel="Packages" relatedEntries={await getManagedRelated(entry)} />;
}
