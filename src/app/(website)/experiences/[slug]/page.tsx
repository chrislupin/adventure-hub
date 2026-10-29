import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CatalogDetailView } from '@/components/services/catalog-detail-view';
import { getPublishedExperiences } from '@/lib/catalog';
import { getCatalogMetadata } from '@/lib/catalog-seo';
import { getManagedEntry, getManagedRelated } from '@/lib/server/catalog-store';

type PageProps = { params: Promise<{ slug: string }> };
export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return getPublishedExperiences().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return getCatalogMetadata('experience', slug, '/experiences');
}

export default async function ExperienceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = await getManagedEntry('experience', slug);
  if (!entry || entry.kind !== 'experience') notFound();

  return <CatalogDetailView entry={entry} collectionHref="/experiences" collectionLabel="Experiences" relatedEntries={await getManagedRelated(entry)} />;
}
