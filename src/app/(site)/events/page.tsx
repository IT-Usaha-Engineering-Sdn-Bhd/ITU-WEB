import { HighlightedHeading } from '@/components/HighlightedHeading'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getEventsPage } from '@/lib/inner-pages'
import { getSettings } from '@/lib/site-content'
import { getEvents } from '@/lib/listings'
import { pageMetadata } from '@/lib/seo'
import { EVENT_CATEGORIES, formatMonthYear, parseCategory, parsePage } from '@/lib/listing-utils'
import { HeroBanner } from '@/components/inner/HeroBanner'
import { CategoryTabs } from '@/components/inner/CategoryTabs'
import { ListingCard } from '@/components/inner/ListingCard'
import { Pagination } from '@/components/inner/Pagination'

export async function generateMetadata(): Promise<Metadata> {
  const [data, settings] = await Promise.all([getEventsPage(), getSettings()])
  return pageMetadata(data, 'Events', '/events', settings.siteName)
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const category = parseCategory(params.category)
  const page = parsePage(params.page)
  const [data, result, settings] = await Promise.all([
    getEventsPage(),
    getEvents({ category, page }),
    getSettings(),
  ])
  if (page > 1 && page > result.totalPages) notFound()

  return (
    <main id="main-content" className="inner-page">
      <section className="section-shell inner-hero">
        <p className="eyebrow">{data.eyebrow}</p>
        <h1 className="section-heading">
          <HighlightedHeading text={data.heading} highlight={data.highlight} />
        </h1>
      </section>
      <HeroBanner
        image={data.heroImage}
        label={data.bannerLabel}
        kicker={settings.heroBannerKicker}
        wordmark={settings.heroBannerWordmark}
      />
      <section className="section-shell listing-section">
        <CategoryTabs
          items={EVENT_CATEGORIES.map((c) => ({ label: c.label, value: c.value }))}
          active={category}
          basePath="/events"
          paramName="category"
        />
        <div className="listing-grid">
          {result.docs.length === 0 && (
            <ListingCard preview meta={data.emptyMeta} title={data.emptyTitle} cta="" />
          )}
          {result.docs.map((event) => (
            <ListingCard
              key={event.id}
              href={`/events/${event.slug}`}
              image={event.cover}
              meta={`${EVENT_CATEGORIES.find((c) => c.value === event.category)?.label ?? ''} · ${formatMonthYear(event.eventDate)}`}
              title={event.title}
              cta={data.viewLabel}
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
