import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getMilestones, getPageBySlug } from '@/lib/queries'
import { Hero } from '@/components/layout/Hero'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { RichText } from '@/components/ui/RichText'
import { LeadershipCard } from '@/components/cards/LeadershipCard'
import { Timeline } from '@/components/cards/Timeline'
import { ContactCta } from '@/components/cards/ContactCta'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import type { ContentBlockData } from '@/blocks/types'

export const metadata: Metadata = { title: 'About Us' }

export default async function AboutUsPage() {
  const [page, milestones] = await Promise.all([getPageBySlug('about-us'), getMilestones()])
  if (!page) notFound()

  return (
    <>
      <Hero headline={page.heroTitle ?? page.title} compact />

      {page.intro && (
        <section className="py-16">
          <Container className="max-w-3xl">
            <RichText data={page.intro} />
          </Container>
        </section>
      )}

      {(page.leadership?.length ?? 0) > 0 && (
        <section className="bg-surface py-16">
          <Container>
            <SectionHeading heading="Leadership" align="center" />
            <div className="grid gap-10 sm:grid-cols-3">
              {page.leadership!.map((l, i) => (
                <LeadershipCard key={i} name={l.name} role={l.role} bio={l.bio} portrait={l.portrait} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {milestones.length > 0 && (
        <section className="py-16">
          <Container className="max-w-3xl">
            <SectionHeading heading="Company Milestones" align="center" />
            <Timeline milestones={milestones} />
          </Container>
        </section>
      )}

      <BlockRenderer blocks={page.content as ContentBlockData[] | undefined} />

      <ContactCta heading="Have a project in mind? Let's talk." />
    </>
  )
}
