import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { CatalogEntry, PricingInformation } from '@/types/catalog';

function getPriceLabel(pricing: PricingInformation): string | undefined {
  if (pricing.method === 'quote') return 'Quotation by inquiry';
  if (pricing.method === 'fixed' && pricing.verified) {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: pricing.currency, maximumFractionDigits: 0 }).format(pricing.amount);
  }
  if (pricing.method === 'from' && pricing.verified) {
    const amount = new Intl.NumberFormat('en-KE', { style: 'currency', currency: pricing.currency, maximumFractionDigits: 0 }).format(pricing.amount);
    return `From ${amount} ${pricing.basis}`;
  }
  return undefined;
}

export function CatalogCard({ entry, href, priority = false }: { entry: CatalogEntry; href: string; priority?: boolean }) {
  const priceLabel = getPriceLabel(entry.pricing);

  return (
    <article className="group h-full">
      <Link href={href} className="flex h-full flex-col rounded-sm focus-visible:outline-offset-4">
        <div className="relative aspect-[1.35/1] overflow-hidden bg-sage/25">
          {entry.coverImage ? (
            <>
              <Image src={entry.coverImage.src} alt={entry.coverImage.alt} fill priority={priority} sizes="(min-width: 1280px) 32vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.035]" />
            </>
          ) : (
            <div role="img" aria-label="Photo not available" className="flex h-full items-center justify-center bg-[#e8ebe3] px-5 text-center text-sm text-[#59645d]">Image to be added</div>
          )}
        </div>
        <div className="flex flex-1 flex-col border-b border-[#dcded4] py-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-forest">{entry.category}</p>
            {priceLabel && <span className="text-right text-xs font-semibold text-[#59645d]">{priceLabel}</span>}
          </div>
          <h2 className="mt-2 font-display text-3xl leading-tight text-charcoal">{entry.name}</h2>
          <p className="mt-3 flex-1 text-sm leading-6 text-[#59645d]">{entry.shortDescription}</p>
          <span className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-forest">
            View details <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  );
}
