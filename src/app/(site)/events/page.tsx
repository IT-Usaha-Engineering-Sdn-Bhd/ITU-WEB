import type { Metadata } from 'next'
import Link from 'next/link'
import { getEventCategories, getEvents } from '@/lib/queries'
import { Hero } from '@/components/layout/Hero'
import { Container } from '@/components/ui/Container'
import { EventCard } from '@/components/cards/EventCard'

export const metadata: Metadata = { title: 'Events' }

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams
  const [categories, events] = await Promise.all([getEventCategories(), getEvents(category)])

  return (
    <>
      <Hero headline="What's Happening at IT Usaha" compact />
      <section className="py-16">
        <Container>
          <div className="mb-10 flex flex-wrap justify-center gap-3" role="tablist" aria-label="Event categories">
            <Link
              href="/events/"
              role="tab"
              aria-selected={!category}
              className={`rounded-full px-4 py-2 text-small font-semibold ${!category ? 'bg-accent text-white' : 'border border-surface-alt text-primary'}`}
            >
              All
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/events/?category=${c.slug}`}
                role="tab"
                aria-selected={category === c.slug}
                className={`rounded-full px-4 py-2 text-small font-semibold ${category === c.slug ? 'bg-accent text-white' : 'border border-surface-alt text-primary'}`}
              >
                {c.name}
              </Link>
            ))}
          </div>

          {events.length === 0 ? (
            <p className="text-center text-text/60">No events to show yet.</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
