'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { CatalogImage } from '@/types/catalog';

export function ImageGallery({ images, title }: { images: readonly CatalogImage[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];

  if (!activeImage) {
    return <div role="img" aria-label={`${title}: photo not available`} className="flex aspect-[1.25/1] items-center justify-center bg-[#e8ebe3] text-sm text-[#59645d]">Photo to be added</div>;
  }

  return (
    <div>
      <div className="relative aspect-[1.25/1] overflow-hidden bg-sage/25">
        <Image src={activeImage.src} alt={activeImage.alt} fill priority sizes="(min-width: 1024px) 52vw, 100vw" className="object-cover" />
        {activeImage.illustrative && <span className="absolute bottom-3 left-3 bg-evergreen/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">Illustrative photo</span>}
      </div>
      {images.length > 1 && (
        <div role="group" aria-label={`${title} photo gallery`} className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
          {images.map((image, index) => (
            <button
              key={`${image.src}-${index}`}
              type="button"
              aria-label={`Show photo ${index + 1} of ${images.length}`}
              aria-pressed={activeIndex === index}
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-[4/3] overflow-hidden bg-sage/25 ${activeIndex === index ? 'outline outline-2 outline-forest outline-offset-2' : 'opacity-75 hover:opacity-100'}`}
            >
              <Image src={image.src} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}