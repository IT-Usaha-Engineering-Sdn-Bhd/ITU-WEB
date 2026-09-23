'use client'
import { Gauge } from '@phosphor-icons/react'
import type { Media } from '@/payload-types'
import { Carousel } from '@/components/Carousel'
import { ServiceImage } from './ServiceImage'

// Carousel's renderItem is a callback the carousel itself invokes on the client, so this
// wrapper (unlike the rest of the page) has to be a Client Component — a Server Component
// can't hand a plain function across the RSC boundary. Zero equipment shows one neutral
// placeholder slide; the carousel's own controls only appear once there are 2+.
export function EquipmentGallery({
  galleryTitle,
  equipment,
  placeholderCaption,
}: {
  galleryTitle: string
  equipment: { image?: number | Media | null; caption?: string | null }[]
  placeholderCaption: string
}) {
  const items = equipment.length ? equipment : [{ image: null, caption: placeholderCaption }]
  return (
    <Carousel
      ariaLabel={galleryTitle}
      items={items}
      renderItem={(item) => (
        <figure className="service-equipment-slide">
          <ServiceImage image={item.image} label={item.caption ?? galleryTitle} icon={Gauge} />
          {item.caption && <figcaption>{item.caption}</figcaption>}
        </figure>
      )}
    />
  )
}
