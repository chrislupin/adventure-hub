'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#deded3] bg-ivory">
      <div className="mx-auto flex min-h-[4.5rem] max-w-[var(--content-width)] items-center justify-between gap-5 px-5 sm:px-8 lg:px-12">
        <Link href="/" className="shrink-0 text-xl font-semibold tracking-normal text-forest" onClick={() => setOpen(false)}>
          Adventure <span className="font-display italic">Hub</span>
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-5 lg:flex xl:gap-7">
          {siteConfig.navigation.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-[#46544b] transition-colors hover:text-forest">
              {link.label}
            </Link>
          ))}
          <Link href="/booking" className="inline-flex min-h-11 items-center justify-center bg-forest px-5 text-sm font-semibold text-white transition-colors hover:bg-evergreen">
            Book an experience
          </Link>
        </nav>
        <button
          type="button"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((isOpen) => !isOpen)}
          className="flex size-11 items-center justify-center text-forest hover:bg-sage/20 lg:hidden"
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      <nav
        id="mobile-navigation"
        aria-label="Mobile navigation"
        hidden={!open}
        className="border-t border-[#deded3] bg-ivory px-5 py-3 lg:hidden sm:px-8"
      >
        <div className="mx-auto grid max-w-[var(--content-width)] gap-1">
          {siteConfig.navigation.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="flex min-h-11 items-center px-3 text-sm font-medium text-[#46544b] hover:bg-sage/20 hover:text-forest">
              {link.label}
            </Link>
          ))}
          <Link href="/booking" onClick={() => setOpen(false)} className="mt-2 flex min-h-11 items-center justify-center bg-forest px-5 text-sm font-semibold text-white hover:bg-evergreen">
            Book an experience
          </Link>
        </div>
      </nav>
    </header>
  );
}
