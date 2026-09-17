import Link from 'next/link'
import { Placeholder } from '@/components/ui/Placeholder'
import type { Event, EventCategory } from '@/payload-types'

export function EventCard({ event }: { event: Event }) {
  const category = typeof event.category === 'object' ? (event.category as EventCategory) : null
  return (
    <Link
      href={`/event/${event.slug}/`}
      className="group flex flex-col overflow-hidden rounded-lg border border-surface-alt transition-shadow hover:shadow-lg"
    >
      <Placeholder media={event.coverImage} label={event.title} ratio="16/9" sizes="(min-width: 1024px) 33vw, 100vw" />
      <div className="flex flex-1 flex-col p-5">
        {category && <p className="text-small font-semibold uppercase tracking-wide text-accent">{category.name}</p>}
        <h3 className="mt-1 text-h5">{event.title}</h3>
        {event.eventDate && (
          <p className="mt-2 text-small text-text/60">
            {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        )}
      </div>
    </Link>
  )
}
