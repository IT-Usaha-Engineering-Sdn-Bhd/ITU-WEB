import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getEvent } from '@/lib/listings'
import { getSettings } from '@/lib/site-content'
import { pageMetadata } from '@/lib/seo'
import { EVENT_CATEGORIES, formatMonthYear, youtubeEmbedUrl } from '@/lib/listing-utils'
import { EntryImage } from '@/components/inner/EntryImage'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const [event, settings] = await Promise.all([getEvent(slug), getSettings()])
  if (!event) return {}
  return pageMetadata(event, event.title, `/events/${slug}`, settings.siteName)
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await getEvent(slug)
  if (!event) notFound()
  const category = EVENT_CATEGORIES.find((c) => c.value === event.category)?.label ?? ''
  const embed = youtubeEmbedUrl(event.youtubeUrl)
  const gallery = event.gallery ?? []

  return (
    <main id="main-content" className="inner-page">
      <section className="section-shell inner-hero">
        <p className="eyebrow">
          {category} · {formatMonthYear(event.eventDate, 'long')}
        </p>
        <h1 className="section-heading">{event.title}</h1>
      </section>
      <section className="section-shell">
        {gallery.length > 0 ? (
          <div className="event-gallery">
            {gallery.map((item, i) => (
              <EntryImage
                key={item.id ?? i}
                image={item.image}
                label={`${event.title} ${i + 1}`}
                kind="gallery"
                priority={i === 0}
              />
            ))}
          </div>
        ) : (
          <div className="event-gallery">
            <EntryImage image={undefined} label={event.title} kind="gallery" />
          </div>
        )}
        {embed && (
          <div className="event-video">
            <iframe
              src={embed}
              title={`${event.title} video`}
              loading="lazy"
              allow="encrypted-media"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        )}
      </section>
    </main>
  )
}
