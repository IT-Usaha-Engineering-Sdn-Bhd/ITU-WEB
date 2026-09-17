'use client'

import { useState } from 'react'
import { Placeholder } from '@/components/ui/Placeholder'
import type { Media } from '@/payload-types'

export function Gallery({ images }: { images: { image: Media | number; id?: string | null }[] }) {
  const [active, setActive] = useState(0)
  if (images.length === 0) return null

  return (
    <div>
      <Placeholder media={images[active].image} label="Gallery image" ratio="16/9" sizes="(min-width: 1024px) 66vw, 100vw" />
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto" role="tablist" aria-label="Gallery thumbnails">
          {images.map((img, i) => (
            <button
              key={img.id ?? i}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`h-16 w-24 shrink-0 overflow-hidden rounded border-2 ${i === active ? 'border-accent' : 'border-transparent'}`}
            >
              <Placeholder media={img.image} label={`Thumbnail ${i + 1}`} ratio="4/3" sizes="96px" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
