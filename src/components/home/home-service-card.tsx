import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { homeContent } from '@/lib/home-content';

type HomeService = (typeof homeContent.services)[number];

export function HomeServiceCard({ service }: { service: HomeService }) {
  return (
    <article className={`group ${service.layout}`}>
      <Link href={service.href} className="block h-full rounded-sm focus-visible:outline-offset-4">
        <div className={`relative overflow-hidden bg-sage/30 ${service.imageRatio}`}>
          <Image
            src={service.image.src}
            alt={service.image.alt}
            fill
            sizes="(min-width: 1280px) 40vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.035]"
          />
          <span className="absolute bottom-3 left-3 bg-evergreen/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
            Illustrative photo
          </span>
        </div>
        <div className="border-b border-[#dcded4] py-5 sm:py-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-forest">{service.category}</p>
          <div className="mt-2 flex items-start justify-between gap-4">
            <h3 className="font-display text-3xl leading-tight text-charcoal sm:text-4xl">{service.title}</h3>
            <ArrowUpRight size={20} className="mt-1 shrink-0 text-forest transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
          </div>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#59645d]">{service.description}</p>
        </div>
      </Link>
    </article>
  );
}