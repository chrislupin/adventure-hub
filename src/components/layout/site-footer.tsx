import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';
import { Container } from '@/components/ui/primitives';

export function SiteFooter() {
  return (
    <footer className="bg-evergreen text-white">
      <Container className="py-12 sm:py-14">
        <div className="grid gap-10 border-b border-white/15 pb-10 md:grid-cols-[1.4fr_1fr_1fr] md:gap-12">
          <div>
            <Link href="/" className="text-2xl font-semibold">{siteConfig.name}</Link>
            <p className="mt-3 max-w-sm font-display text-2xl leading-tight text-sand">{siteConfig.tagline}</p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">{siteConfig.description}</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-sand">Explore</h2>
            <ul className="mt-4 grid gap-3 text-sm text-white/75">
              {siteConfig.navigation.slice(1).map((link) => (
                <li key={link.href}><Link href={link.href} className="hover:text-white">{link.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-sand">Our services</h2>
            <ul className="mt-4 grid gap-3 text-sm text-white/75">
              {siteConfig.services.map((service) => (
                <li key={service.href}><Link href={service.href} className="hover:text-white">{service.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-6 pt-7 sm:flex-row sm:items-end sm:justify-between">
          <div className="grid gap-3 text-sm text-white/75 sm:grid-cols-2">
            {siteConfig.contact.email && (
              <a className="inline-flex items-center gap-2 hover:text-white" href={`mailto:${siteConfig.contact.email}`}>
                <Mail size={16} aria-hidden="true" />{siteConfig.contact.email}
              </a>
            )}
            {siteConfig.contact.phone && (
              <a className="inline-flex items-center gap-2 hover:text-white" href={`tel:${siteConfig.contact.phone}`}>
                <Phone size={16} aria-hidden="true" />{siteConfig.contact.phone}
              </a>
            )}
            <span className="inline-flex items-center gap-2"><MapPin size={16} aria-hidden="true" />{siteConfig.contact.serviceArea}</span>
          </div>
          <div className="flex flex-wrap items-center gap-5 text-sm text-white/75">
            <a href={siteConfig.social.tiktok} target="_blank" rel="noreferrer" className="hover:text-white">TikTok <span className="sr-only">(opens in a new tab)</span></a>
            <span className="text-xs text-white/55">© {new Date().getFullYear()} {siteConfig.name}</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
