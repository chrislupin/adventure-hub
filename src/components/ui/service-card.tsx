import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/primitives';

export function ServiceCard({ title, description, href, icon: Icon }: {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}) {
  return (
    <Link href={href} className="group block h-full rounded-sm focus-visible:outline-offset-4">
      <Card className="flex h-full flex-col transition-colors group-hover:border-forest/40 group-hover:bg-[#fdfcf9]">
        <span className="mb-8 flex size-11 items-center justify-center border border-forest/15 bg-sage/20 text-forest">
          <Icon size={21} aria-hidden="true" />
        </span>
        <h3 className="text-2xl leading-tight text-charcoal">{title}</h3>
        <p className="mt-3 flex-1 text-sm leading-6 text-[#59645d]">{description}</p>
        <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-forest">
          Discover more <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        </span>
      </Card>
    </Link>
  );
}