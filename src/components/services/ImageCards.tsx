import type { Media } from '@/payload-types'
import type { Icon } from '@phosphor-icons/react'
import { ServiceImage } from './ServiceImage'
import { Reveal } from '@/components/Reveal'

// The "Why Choose Us?" image-card pairs on the Data Centre and Facilities Management pages.
export function ImageCards({
  heading,
  items,
  icon,
}: {
  heading: string
  items: { title: string; body: string; image?: number | Media | null }[]
  icon: Icon
}) {
  return (
    <Reveal className="service-cards-section">
      <h2 className="section-heading">{heading}</h2>
      <div className="service-cards">
        {items.map((item) => (
          <article key={item.title} className="service-card">
            <ServiceImage image={item.image} label={item.title} icon={icon} />
            <h3>{item.title}</h3>
            <p className="section-body">{item.body}</p>
          </article>
        ))}
      </div>
    </Reveal>
  )
}
