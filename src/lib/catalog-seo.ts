import type { Metadata } from 'next';
import { getPublishedEntryBySlug } from '@/lib/catalog';
import type { CatalogEntry } from '@/types/catalog';

export function getCatalogMetadata(kind: CatalogEntry['kind'], slug: string, collectionPath: string): Metadata {
  const entry = getPublishedEntryBySlug(kind, slug);
  if (!entry) return { title: `Not found | Adventure Hub`, robots: { index: false, follow: true } };

  return {
    title: entry.seo.title,
    description: entry.seo.description,
    alternates: { canonical: `${collectionPath}/${entry.slug}` },
    openGraph: {
      title: entry.seo.title,
      description: entry.seo.description,
      type: 'article',
      images: entry.coverImage ? [{ url: entry.coverImage.src, alt: entry.coverImage.alt }] : undefined,
    },
  };
}