import type { Media } from '@/payload-types'
import Image from 'next/image'

type Props = {
  media?: Media | number | null | undefined
  label?: string
  ratio?: string // e.g. "16/9", "4/3", "1/1"
  className?: string
  sizes?: string
  priority?: boolean
}

/**
 * Every image slot in the app renders through this. With no media doc yet
 * (the common case pre-launch) it draws a neutral, correctly-sized box so
 * swapping in a real upload later causes zero layout shift.
 */
export function Placeholder({ media, label, ratio = '16/9', className = '', sizes, priority }: Props) {
  const style = { aspectRatio: ratio }

  if (media && typeof media === 'object' && media.url) {
    return (
      <div className={`relative overflow-hidden ${className}`} style={style}>
        <Image
          src={media.url}
          alt={media.alt || label || ''}
          fill
          sizes={sizes ?? '100vw'}
          priority={priority}
          className="object-cover"
        />
      </div>
    )
  }

  return (
    <div
      className={`flex items-center justify-center bg-surface-alt text-center text-small text-primary/60 ${className}`}
      style={style}
      role="img"
      aria-label={label ?? 'Image placeholder'}
    >
      <span className="px-4">{label ?? 'Image placeholder'}</span>
    </div>
  )
}
