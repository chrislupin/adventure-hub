import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Music2 } from 'lucide-react';
import { Button, Container, SectionHeading } from '@/components/ui/primitives';
import { HomeServiceCard } from '@/components/home/home-service-card';
import { homeContent } from '@/lib/home-content';
import { siteConfig } from '@/lib/site-config';

function PackageDetails({ packageDetails }: { packageDetails: (typeof homeContent.packages.publishedPackages)[number] }) {
  const price = packageDetails.startingPrice;

  return (
    <article className="border-t border-white/20 py-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-3xl text-white">{packageDetails.name}</h3>
          {(packageDetails.location || packageDetails.duration || packageDetails.accommodation) && (
            <p className="mt-2 text-sm text-white/70">
              {[packageDetails.location, packageDetails.duration, packageDetails.accommodation].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
        {price?.verified && (
          <p className="text-sm font-semibold text-sand">
            From {new Intl.NumberFormat('en-KE', { style: 'currency', currency: price.currency, maximumFractionDigits: 0 }).format(price.amount)}
          </p>
        )}
      </div>
      {(packageDetails.mealPlan || packageDetails.includedActivities?.length) && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {packageDetails.mealPlan && <li className="border border-white/25 px-3 py-1.5 text-xs text-white/85">{packageDetails.mealPlan}</li>}
          {packageDetails.includedActivities?.map((activity) => <li key={activity} className="border border-white/25 px-3 py-1.5 text-xs text-white/85">{activity}</li>)}
        </ul>
      )}
      <Link href={packageDetails.href} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-sand hover:text-white focus-visible:outline-offset-4">
        View package <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
    </article>
  );
}

export default function HomePage() {
  const whatsappNumber = siteConfig.contact.whatsappNumber;
  const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}` : undefined;

  return (
    <>
      <section className="relative isolate flex min-h-[38rem] items-end overflow-hidden bg-evergreen text-white sm:min-h-[42rem] lg:min-h-[min(86svh,54rem)]">
        <Image
          src={homeContent.hero.image.src}
          alt={homeContent.hero.image.alt}
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-[56%_center]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0c201b]/85 via-[#10251f]/58 to-[#10251f]/10" />
        <Container className="flex min-h-[38rem] flex-col items-start justify-center py-16 sm:min-h-[42rem] lg:min-h-[min(86svh,54rem)] lg:py-20">
          <div className="max-w-3xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-sand">{homeContent.hero.eyebrow}</p>
            <h1 className="max-w-3xl font-display text-6xl font-medium leading-[0.9] sm:text-7xl lg:text-8xl">{homeContent.hero.title}</h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/90 sm:text-lg sm:leading-8">{homeContent.hero.description}</p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/75">One place to explore activities, cabin stays, private transport and a getaway planned around you.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/experiences" variant="secondary">Explore Experiences <ArrowUpRight size={17} aria-hidden="true" /></Button>
              <Button href="/booking" variant="outline" className="border-white/55 text-white hover:bg-white/10">Plan Your Getaway</Button>
            </div>
          </div>
          <a href="#experience-menu" className="mt-12 inline-flex min-h-11 items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-white/80 hover:text-white focus-visible:outline-offset-4">
            <span className="flex size-9 items-center justify-center rounded-full border border-white/50"><ArrowDown size={15} aria-hidden="true" /></span>
            Discover your escape
          </a>
        </Container>
      </section>

      <section id="experience-menu" className="scroll-mt-24 py-20 sm:py-24 lg:py-28">
        <Container>
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Choose your escape" title="Out here, there is more than one way to feel alive." />
            <p className="max-w-md text-sm leading-7 text-[#59645d]">Explore the Adventure Hub experiences, then ask the team to confirm details for your dates.</p>
          </div>
          <div className="grid grid-cols-1 gap-x-5 gap-y-2 md:grid-cols-12 md:gap-x-6">
            {homeContent.services.map((service) => <HomeServiceCard key={service.title} service={service} />)}
          </div>
          <p className="mt-6 text-xs leading-5 text-[#68726b]">Editorial photographs are illustrative and do not represent confirmed Adventure Hub properties, vehicles, operators or availability.</p>
        </Container>
      </section>

      <section className="bg-[#f0eee7] py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Featured stays and experiences" title="Make a little room for wonder." className="mb-12" />
          <div className="grid gap-16 lg:gap-20">
            {homeContent.featured.map((feature, index) => (
              <article key={feature.title} className="grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-20">
                <div className={`relative aspect-[1.2/1] overflow-hidden bg-sage/25 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <Image src={feature.image.src} alt={feature.image.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                  <span className="absolute bottom-3 left-3 bg-evergreen/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">Illustrative photo</span>
                </div>
                <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-forest">{feature.eyebrow}</p>
                  <h2 className="mt-3 max-w-xl font-display text-5xl leading-[0.98] text-charcoal sm:text-6xl">{feature.title}</h2>
                  <p className="mt-5 max-w-xl text-base leading-7 text-[#59645d]">{feature.description}</p>
                  <ul className="mt-6 grid gap-3">
                    {feature.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-3 text-sm text-charcoal">
                        <Check size={17} className="mt-0.5 shrink-0 text-forest" aria-hidden="true" />{highlight}
                      </li>
                    ))}
                  </ul>
                  <Button href={feature.href} variant="text" className="mt-6 px-0">{feature.linkLabel} <ArrowRight size={17} aria-hidden="true" /></Button>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-evergreen py-20 text-white sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <div className="relative min-h-[22rem] overflow-hidden sm:min-h-[28rem]">
            <Image src={homeContent.packages.image.src} alt={homeContent.packages.image.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            <span className="absolute bottom-3 left-3 bg-evergreen/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">Illustrative photo</span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sand">{homeContent.packages.eyebrow}</p>
            <h2 className="mt-3 max-w-xl font-display text-5xl leading-[0.98] text-white sm:text-6xl">{homeContent.packages.title}</h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/75 sm:text-base">{homeContent.packages.description}</p>
            <div className="mt-8">
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-sand">Meal-plan options to ask about</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {homeContent.packages.mealPlans.map((mealPlan) => (
                  <div key={mealPlan.name} className="border border-white/25 px-4 py-4">
                    <h4 className="font-display text-2xl text-white">{mealPlan.name}</h4>
                    <p className="mt-2 text-xs leading-5 text-white/70">{mealPlan.description}</p>
                  </div>
                ))}
              </div>
            </div>
            {homeContent.packages.publishedPackages.length > 0 && (
              <div className="mt-8">
                {homeContent.packages.publishedPackages.map((packageDetails) => <PackageDetails key={packageDetails.id} packageDetails={packageDetails} />)}
              </div>
            )}
            <Button href="/booking" variant="secondary" className="mt-8">Enquire about a getaway <ArrowUpRight size={17} aria-hidden="true" /></Button>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Why Adventure Hub" title="Thoughtful planning, with room for the unexpected." description="A personal starting point for bringing outdoor adventures, stays and private transport together." className="mb-11" />
          <div className="grid border-t border-[#dcded4] md:grid-cols-3">
            {homeContent.reasons.map((reason, index) => (
              <article key={reason.title} className="border-b border-[#dcded4] py-6 md:border-b-0 md:px-6 md:py-7 md:first:pl-0 md:last:pr-0 md:[&:not(:last-child)]:border-r">
                <span className="font-display text-3xl text-forest">0{index + 1}</span>
                <h3 className="mt-5 font-display text-3xl text-charcoal">{reason.title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-[#59645d]">{reason.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-sand py-20 sm:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
            <div>
              <SectionHeading eyebrow="How it works" title="A simple way to get started." description="Your inquiry opens the conversation; it does not confirm a reservation." />
              <Button href="/booking" className="mt-7">Make an inquiry <ArrowUpRight size={17} aria-hidden="true" /></Button>
            </div>
            <ol className="divide-y divide-forest/20 border-y border-forest/20">
              {homeContent.steps.map((step) => (
                <li key={step.number} className="grid gap-2 py-5 sm:grid-cols-[4rem_1fr] sm:gap-5 sm:py-6">
                  <span className="font-display text-3xl text-forest">{step.number}</span>
                  <div>
                    <h3 className="font-display text-3xl text-charcoal">{step.title}</h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-[#46544b]">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-8 border-y border-[#dcded4] py-8 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-10 sm:py-10">
            <span className="flex size-14 items-center justify-center bg-forest text-white" aria-hidden="true"><Music2 size={25} /></span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-forest">{homeContent.social.eyebrow}</p>
              <h2 className="mt-2 font-display text-4xl leading-tight text-charcoal">{homeContent.social.title}</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#59645d]">{homeContent.social.description}</p>
            </div>
            <a href={siteConfig.social.tiktok} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 border border-forest/30 px-5 text-sm font-semibold text-forest transition-colors hover:bg-forest/5 focus-visible:outline-offset-4">
              Follow Adventure Hub <ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </Container>
      </section>

      <section className="bg-forest py-16 text-white sm:py-20">
        <Container className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sand">Your next escape starts here</p>
            <h2 className="mt-3 max-w-3xl font-display text-5xl leading-[0.98] text-white sm:text-6xl">Let’s plan something worth looking forward to.</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/75">Tell us what you have in mind. We’ll confirm the details with you before anything is booked.</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:max-w-[32rem] lg:justify-end">
            <Button href="/experiences" variant="secondary">Explore Experiences</Button>
            <Button href="/stays" variant="outline" className="border-white/50 text-white hover:bg-white/10">Browse Stays</Button>
            <Button href="/booking" variant="outline" className="border-white/50 text-white hover:bg-white/10">Make an Inquiry</Button>
            {whatsappHref ? (
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center border border-white/50 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-offset-4">
                WhatsApp <span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : (
              <Button href="/contact" variant="text" className="text-white hover:bg-white/10">Contact Adventure Hub</Button>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
