import Image from 'next/image'
import type { Media } from '@/payload-types'
import { mediaAlt, mediaUrl } from '@/lib/media'

export function HeroBanner({ image, label }: { image?: number | Media | null; label: string }) {
  const url = mediaUrl(image)

  return (
    <div className={`inner-hero-banner${url ? ' has-image' : ' is-placeholder'}`}>
      {url ? (
        <Image
          src={url}
          alt={mediaAlt(image, `${label} banner`)}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      ) : (
        <div
          className="inner-hero-placeholder"
          aria-label={`${label} banner placeholder`}
          role="img"
        >
          <span className="inner-hero-placeholder-mark" aria-hidden="true">
            ITU
          </span>
          <span className="inner-hero-placeholder-caption" aria-hidden="true">
            IT USAHA ENGINEERING <span>/</span> {label}
          </span>
        </div>
      )}
    </div>
  )
}
