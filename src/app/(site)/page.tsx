import type { Metadata } from 'next'
import { getHomePage, getServices } from '@/lib/queries'
import { Hero } from '@/components/layout/Hero'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { LinkButton } from '@/components/ui/Button'
import { ServiceCard } from '@/components/cards/ServiceCard'
import { ReasonCard } from '@/components/cards/ReasonCard'
import { IsoCard } from '@/components/cards/IsoCard'
import { ClientLogoStrip } from '@/components/cards/ClientLogoStrip'
import { ContactCta } from '@/components/cards/ContactCta'
import type { Service } from '@/payload-types'

export const metadata: Metadata = { title: 'Home' }

export default async function HomePage() {
  const [home, services] = await Promise.all([getHomePage(), getServices()])

  const meServices = (home.meSolutions?.services ?? [])
    .map((s) => (typeof s.service === 'object' ? (s.service as Service) : null))
    .filter((s): s is Service => Boolean(s))

  return (
    <>
      <Hero headline={home.hero?.headline ?? 'YOUR TRUSTED PARTNER IN DATA CENTRE'} backgroundImage={home.hero?.backgroundImage}>
        <LinkButton href={home.hero?.ctaHref ?? '/about-us/'}>{home.hero?.ctaLabel ?? 'Learn More'}</LinkButton>
      </Hero>

      {home.whoWeAre?.visible !== false && (
        <section className="py-16">
          <Container className="max-w-3xl text-center">
            <h2>{home.whoWeAre?.heading}</h2>
            <p className="mt-4 text-lead text-text/80">{home.whoWeAre?.body}</p>
            <div className="mt-6 flex justify-center">
              <LinkButton href={home.whoWeAre?.ctaHref ?? '/about-us/'} variant="outline">
                {home.whoWeAre?.ctaLabel ?? 'Learn About Us'}
              </LinkButton>
            </div>
          </Container>
        </section>
      )}

      {home.credentialFacts?.visible !== false && (home.credentialFacts?.counters?.length ?? 0) > 0 && (
        <section className="bg-primary py-14 text-white">
          <Container>
            <div className="grid gap-8 sm:grid-cols-3">
              {home.credentialFacts!.counters!.map((c, i) => (
                <div key={i} className="text-center">
                  <p className="text-h2 text-white">
                    {c.value}
                    {c.suffix}
                  </p>
                  <p className="mt-1 text-small text-white/70">{c.label}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {home.meSolutions?.visible !== false && (
        <section className="py-16">
          <Container>
            <SectionHeading heading={home.meSolutions?.heading ?? 'Comprehensive M&E Solutions'} intro={home.meSolutions?.intro ?? undefined} align="center" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {(meServices.length ? meServices : services).slice(0, 4).map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {home.whyChooseUs?.visible !== false && (
        <section className="bg-surface py-16">
          <Container>
            <SectionHeading heading={home.whyChooseUs?.heading ?? 'Why Choose Us'} align="center" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {(home.whyChooseUs?.reasons ?? []).map((r, i) => (
                <ReasonCard key={i} title={r.title} body={r.body} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {home.standards?.visible !== false && (
        <section className="py-16">
          <Container>
            <SectionHeading heading={home.standards?.heading ?? 'Industry Standards'} align="center" />
            <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-5">
              {(home.standards?.items ?? []).map((s, i) => (
                <IsoCard key={i} code={s.code} name={s.name} badge={s.badge} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {home.clients?.visible !== false && (
        <section className="bg-surface py-16">
          <Container>
            <SectionHeading heading={home.clients?.heading ?? 'Our Clients'} align="center" />
            <ClientLogoStrip logos={home.clients?.logos ?? []} />
          </Container>
        </section>
      )}

      {home.projectsIntro?.visible !== false && (
        <section className="py-16">
          <Container className="text-center">
            <SectionHeading heading={home.projectsIntro?.heading ?? 'Our Projects'} intro={home.projectsIntro?.body ?? undefined} align="center" />
            <div className="flex flex-wrap justify-center gap-4">
              <LinkButton href="/project-status/completed-projects/">Completed Projects</LinkButton>
              <LinkButton href="/project-status/ongoing-projects/" variant="outline">
                Ongoing Projects
              </LinkButton>
            </div>
          </Container>
        </section>
      )}

      {home.finalCta?.visible !== false && (
        <ContactCta
          heading={home.finalCta?.heading ?? 'Looking for reliable Data Centre and M&E Solutions? We’re ready to help'}
          buttonLabel={home.finalCta?.buttonLabel}
          buttonHref={home.finalCta?.buttonHref}
        />
      )}
    </>
  )
}
