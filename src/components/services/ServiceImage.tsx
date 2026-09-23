import Image from 'next/image'
import type { Media } from '@/payload-types'
import { mediaAlt, mediaUrl } from '@/lib/media'
import type { Icon } from '@phosphor-icons/react'

// Same visual language as the landing page's `.service-placeholder` / `.technical-orbit`
// (src/components/landing/Services.tsx), reused here at a fixed 4:3 ratio so an upload never
// shifts the surrounding layout. Respects the upload's focal point when it has one.
export function ServiceImage({
  image,
  label,
  icon: IconComponent,
  priority,
}: {
  image?: number | Media | null
  label: string
  icon: Icon
  priority?: boolean
}) {
  const url = mediaUrl(image)
  const focal = typeof image === 'object' && image ? { x: image.focalX, y: image.focalY } : null
  const objectPosition =
    focal?.x != null && focal?.y != null ? `${focal.x}% ${focal.y}%` : undefined

  return (
    <div className={`service-image${url ? ' has-image' : ' is-placeholder'}`}>
      {url ? (
        <Image
          src={url}
          alt={mediaAlt(image, label)}
          fill
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover"
          style={objectPosition ? { objectPosition } : undefined}
          priority={priority}
          loading={priority ? undefined : 'lazy'}
        />
      ) : (
        <div className="service-placeholder" role="img" aria-label={`${label} placeholder`}>
          <div className="technical-orbit">
            <IconComponent weight="thin" aria-hidden="true" />
          </div>
        </div>
      )}
    </div>
  )
}
