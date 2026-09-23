import type { Media } from '@/payload-types'
import type { Icon } from '@phosphor-icons/react'
import { ServiceImage } from './ServiceImage'
import { Reveal } from '@/components/Reveal'

// Alternating image/text row shared by every service page. Callers compose the text column
// themselves (title, body, lists, ...); this just places it beside a `ServiceImage` and flips
// the side on `reverse`.
export function SplitSection({
  image,
  imageLabel,
  icon,
  reverse,
  children,
  priority,
}: {
  image?: number | Media | null
  imageLabel: string
  icon: Icon
  reverse?: boolean
  children: React.ReactNode
  priority?: boolean
}) {
  return (
    <Reveal className={`service-split${reverse ? ' service-split--reverse' : ''}`}>
      <div className="service-split-copy">{children}</div>
      <ServiceImage image={image} label={imageLabel} icon={icon} priority={priority} />
    </Reveal>
  )
}
