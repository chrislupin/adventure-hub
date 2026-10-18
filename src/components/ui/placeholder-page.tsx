import { Button, Container } from '@/components/ui/primitives';

export function PlaceholderPage({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="flex min-h-[55vh] items-center py-20 sm:py-28">
      <Container>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-forest">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-5xl leading-[1.04] text-charcoal sm:text-6xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-[#59645d] sm:text-lg sm:leading-8">{description}</p>
        <Button href="/booking" className="mt-8">Enquire now</Button>
      </Container>
    </section>
  );
}
