import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getEventsPage } from '@/lib/inner-pages'
import { getEvents } from '@/lib/listings'
import { mediaUrl } from '@/lib/media'
import { EVENT_CATEGORIES, formatMonthYear, parseCategory, parsePage } from '@/lib/listing-utils'
import { HeroBanner } from '@/components/inner/HeroBanner'
import { CategoryTabs } from '@/components/inner/CategoryTabs'
import { ListingCard } from '@/components/inner/ListingCard'
import { Pagination } from '@/components/inner/Pagination'

export async function generateMetadata(): Promise<Metadata> {
  const data = await getEventsPage()
  const image = mediaUrl(data.seo?.ogImage)
  return {
    title: data.seo?.title || 'Events',
    description: data.seo?.description,
    alternates: { canonical: '/events' },
    openGraph: { images: image ? [{ url: image }] : undefined },
  }
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const category = parseCategory(params.category)
  const page = parsePage(params.page)
  const [data, result] = await Promise.all([getEventsPage(), getEvents({ category, page })])
  if (page > 1 && page > result.totalPages) notFound()

  return (
    <main id="main-content" className="inner-page">
      <section className="section-shell inner-hero">
        <p className="eyebrow">Events</p>
        <h1 className="section-heading">
          {data.heading.split(data.highlight)[0]}
          <span className="text-accent">{data.highlight}</span>
        </h1>
      </section>
      <HeroBanner image={data.heroImage} label="Events" />
      <section className="section-shell listing-section">
        <CategoryTabs
          items={EVENT_CATEGORIES.map((c) => ({ label: c.label, value: c.value }))}
          active={category}
          basePath="/events"
          paramName="category"
        />
        <div className="listing-grid">
          {result.docs.length === 0 && (
            <ListingCard
              preview
              meta="Coming soon"
              title="More events in this category are on the way"
              cta=""
            />
          )}
          {result.docs.map((event) => (
            <ListingCard
              key={event.id}
              href={`/events/${event.slug}`}
              image={event.cover}
              meta={`${EVENT_CATEGORIES.find((c) => c.value === event.category)?.label ?? ''} · ${formatMonthYear(event.eventDate)}`}
              title={event.title}
              cta="View Event"
            />
          ))}
        </div>
        <Pagination
          page={page}
          totalPages={result.totalPages}
          hrefFor={(n) => `/events?category=${category}&page=${n}`}
        />
      </section>
    </main>
  )
}
