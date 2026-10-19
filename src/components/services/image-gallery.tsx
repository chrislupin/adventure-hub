'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { CatalogImage } from '@/types/catalog';

export function ImageGallery({ images, title }: { images: readonly CatalogImage[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(images.length > 1);
  const [outgoingImage, setOutgoingImage] = useState<CatalogImage | null>(null);
  const activeImage = images[activeIndex];

  useEffect(() => {
    if (!isPlaying || images.length < 2) return;

    const intervalId = window.setInterval(() => {
      setOutgoingImage(activeImage);
      setActiveIndex((currentIndex) => (currentIndex + 1) % images.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [activeImage, images.length, isPlaying]);

  useEffect(() => {
    if (!outgoingImage) return;

    const timeoutId = window.setTimeout(() => setOutgoingImage(null), 700);
    return () => window.clearTimeout(timeoutId);
  }, [outgoingImage]);

  if (!activeImage) {
    return <div role="img" aria-label={`${title}: photo not available`} className="flex aspect-[1.25/1] items-center justify-center bg-[#e8ebe3] text-sm text-[#59645d]">Photo to be added</div>;
  }

  return (
    <div role="region" aria-roledescription="carousel" aria-label={`${title} photo slideshow`}>
      <div className="relative aspect-[1.25/1] overflow-hidden bg-sage/25">
        {outgoingImage && <Image src={outgoingImage.src} alt="" fill sizes="(min-width: 1024px) 52vw, 100vw" className="object-cover" />}
        <Image key={activeImage.src} src={activeImage.src} alt={activeImage.alt} fill priority sizes="(min-width: 1024px) 52vw, 100vw" className="object-cover gallery-slide-enter" />
        {images.length > 1 && (
          <>
            <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-3">
              <span className="bg-evergreen/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">{activeIndex + 1} / {images.length}</span>
              <button
                type="button"
                onClick={() => setIsPlaying((playing) => !playing)}
                className="inline-flex size-9 items-center justify-center bg-evergreen/80 text-white transition-colors hover:bg-evergreen focus-visible:outline-offset-2"
                aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
              >
                {isPlaying ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
              </button>
            </div>
            <div className="absolute inset-x-3 bottom-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setOutgoingImage(activeImage);
                  setActiveIndex((currentIndex) => (currentIndex - 1 + images.length) % images.length);
                }}
                className="inline-flex size-10 items-center justify-center bg-evergreen/80 text-white transition-colors hover:bg-evergreen focus-visible:outline-offset-2"
                aria-label="Show previous photo"
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setOutgoingImage(activeImage);
                  setActiveIndex((currentIndex) => (currentIndex + 1) % images.length);
                }}
                className="inline-flex size-10 items-center justify-center bg-evergreen/80 text-white transition-colors hover:bg-evergreen focus-visible:outline-offset-2"
                aria-label="Show next photo"
              >
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </div>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div role="group" aria-label={`${title} photo gallery`} className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
          {images.map((image, index) => (
            <button
              key={`${image.src}-${index}`}
              type="button"
              aria-label={`Show photo ${index + 1} of ${images.length}`}
              aria-pressed={activeIndex === index}
              onClick={() => {
                setOutgoingImage(activeImage);
                setActiveIndex(index);
                setIsPlaying(false);
              }}
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
