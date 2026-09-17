import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { getEventBySlug } from '@/lib/queries'
import { Container } from '@/components/ui/Container'
import { RichText } from '@/components/ui/RichText'
import { Placeholder } from '@/components/ui/Placeholder'
import { Gallery } from '@/components/cards/Gallery'
import type { EventCategory, Media } from '@/payload-types'

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'events', where: { status: { equals: 'published' } }, limit: 100 })
  return docs.map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) return {}
  return { title: event.seo?.title ?? event.title, description: event.seo?.description ?? event.excerpt ?? undefined }
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) notFound()

  const category = typeof event.category === 'object' ? (event.category as EventCategory) : null
  const gallery = (event.gallery ?? []).filter((g) => g.image) as { image: Media | number; id?: string | null }[]

  return (
    <section className="py-12">
      <Container className="max-w-3xl">
        <Link href="/events/" className="text-small font-semibold text-accent">
          ← Back to Events
        </Link>
        {category && <p className="mt-4 text-small font-semibold uppercase tracking-wide text-accent">{category.name}</p>}
        <h1 className="mt-2">{event.title}</h1>
        {event.eventDate && (
          <p className="mt-2 text-text/60">
            {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        )}
        <div className="mt-8">
          <Placeholder media={event.coverImage} label={event.title} ratio="16/9" sizes="(min-width: 1024px) 768px, 100vw" priority />
        </div>
        {event.excerpt && <p className="mt-8 text-lead text-text/80">{event.excerpt}</p>}
        <div className="mt-6">
          <RichText data={event.content} />
        </div>
        {gallery.length > 0 && (
          <div className="mt-10">
            <h3>Gallery</h3>
            <div className="mt-4">
              <Gallery images={gallery} />
            </div>
          </div>
        )}
        {event.videoUrl && (
          <div className="mt-8">
            <a href={event.videoUrl} target="_blank" rel="noreferrer" className="text-small font-semibold text-accent">
              Watch video →
            </a>
          </div>
        )}
      </Container>
    </section>
  )
}
