import Link from 'next/link'
import { Placeholder } from '@/components/ui/Placeholder'
import type { Service } from '@/payload-types'

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/our-service/${service.slug}/`}
      className="group flex flex-col overflow-hidden rounded-lg border border-surface-alt transition-shadow hover:shadow-lg"
    >
      <Placeholder media={service.heroImage} label={service.title} ratio="4/3" sizes="(min-width: 1024px) 25vw, 50vw" />
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-h5">{service.title}</h3>
        {service.shortDescription && <p className="mt-2 flex-1 text-small text-text/70">{service.shortDescription}</p>}
        <span className="mt-4 text-small font-semibold text-accent group-hover:text-accent-dark">Learn More →</span>
      </div>
    </Link>
  )
}
