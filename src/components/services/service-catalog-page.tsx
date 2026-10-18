import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CatalogBrowser } from '@/components/services/catalog-browser';
import { Container, EmptyState, SectionHeading } from '@/components/ui/primitives';
import type { CatalogEntry } from '@/types/catalog';

export function ServiceCatalogPage({
  eyebrow,
  title,
  description,
  entries,
  detailPath,
  searchLabel,
  emptyTitle,
  emptyDescription,
  emptyAction,
}: {
  eyebrow: string;
  title: string;
  description: string;
  entries: readonly CatalogEntry[];
  detailPath: string;
  searchLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  emptyAction?: { label: string; href: string };
}) {
  return (
    <>
      <section className="bg-sand py-16 sm:py-20">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-8 text-xs text-[#59645d]">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="hover:text-forest">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-semibold text-charcoal">{title}</li>
            </ol>
          </nav>
          <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        </Container>
      </section>
      <section className="py-14 sm:py-20">
        <Container>
          {entries.length > 0 ? (
            <CatalogBrowser entries={entries} detailPath={detailPath} searchLabel={searchLabel} emptyTitle={emptyTitle} emptyDescription={emptyDescription} />
          ) : (
            <div className="mx-auto max-w-3xl">
              <EmptyState title={emptyTitle} description={emptyDescription} />
              {emptyAction && (
                <div className="mt-5 text-center">
                  <Link href={emptyAction.href} className="inline-flex min-h-11 items-center gap-2 px-4 text-sm font-semibold text-forest hover:text-evergreen focus-visible:outline-offset-4">
                    {emptyAction.label} <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}