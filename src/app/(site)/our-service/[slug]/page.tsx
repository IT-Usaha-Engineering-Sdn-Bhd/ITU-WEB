import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { getServiceBySlug } from '@/lib/queries'
import { Hero } from '@/components/layout/Hero'
import { Container } from '@/components/ui/Container'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { ContactCta } from '@/components/cards/ContactCta'
import type { ContentBlockData } from '@/blocks/types'

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'services', where: { status: { equals: 'published' } }, limit: 50 })
  return docs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const service = await getServiceBySlug(slug)
  if (!service) return {}
  return {
    title: service.seo?.title ?? service.title,
    description: service.seo?.description ?? service.shortDescription ?? undefined,
  }
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = await getServiceBySlug(slug)
  if (!service) notFound()

  return (
    <>
      <Hero headline={service.title} backgroundImage={service.heroImage} compact />
      {service.shortDescription && (
        <section className="py-12">
          <Container className="max-w-3xl">
            <p className="text-lead text-text/80">{service.shortDescription}</p>
          </Container>
        </section>
      )}
      <BlockRenderer blocks={service.content as ContentBlockData[] | undefined} />
      <ContactCta heading="Have a project in mind? We're here to help you plan, build, and maintain it with confidence" />
    </>
  )
}
