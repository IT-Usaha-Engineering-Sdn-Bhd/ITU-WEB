import type { Icon } from '@phosphor-icons/react'
import Image from 'next/image'
import type { Media } from '@/payload-types'
import { getServiceIconMedia } from './service-icons'

export type GridItem = { title: string; body?: string | null; icon?: number | Media | null }

// Bullet list ("Icons point forms" in the templates) or a card grid (the PMC/FM/DFMA "grid
// card with icons" sections) — same icon-cycling pattern as the landing page's WhyUs/Services
// sections (icons[index % icons.length]), so items an editor adds still get an icon.
export function IconList({
  items,
  icons,
  variant = 'bullet',
  compact,
}: {
  items: GridItem[]
  icons: Icon[]
  variant?: 'bullet' | 'grid'
  compact?: boolean
}) {
  if (variant === 'grid')
    return (
      <ul className={`service-grid${compact ? ' service-grid--compact' : ''}`}>
        {items.map((item, i) => {
          const IconComponent = icons[i % icons.length]
          const uploadedIcon = getServiceIconMedia(item.icon)
          return (
            <li key={item.title}>
              {uploadedIcon ? (
                <Image
                  className="service-grid-icon"
                  src={uploadedIcon.src}
                  alt={uploadedIcon.alt}
                  width={32}
                  height={32}
                />
              ) : (
                <IconComponent size={32} weight="light" aria-hidden="true" />
              )}
              <h3>{item.title}</h3>
              {item.body && <p>{item.body}</p>}
            </li>
          )
        })}
      </ul>
    )

  return (
    <ul className="service-icon-list">
      {items.map((item, i) => {
        const IconComponent = icons[i % icons.length]
        const uploadedIcon = getServiceIconMedia(item.icon)
        return (
          <li key={item.title}>
            {uploadedIcon ? (
              <Image
                className="service-list-icon"
                src={uploadedIcon.src}
                alt={uploadedIcon.alt}
                width={22}
                height={22}
              />
            ) : (
              <IconComponent size={22} weight="light" aria-hidden="true" />
            )}
            <span>{item.title}</span>
          </li>
        )
      })}
    </ul>
  )
}
