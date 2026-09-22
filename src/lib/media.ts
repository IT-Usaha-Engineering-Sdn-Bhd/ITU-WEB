import type { Media } from '@/payload-types'

export function mediaUrl(image?: number | Media | null): string | null {
  if (!image || typeof image === 'number') return null
  return image.url ?? null
}

export function mediaAlt(image?: number | Media | null, fallback = ''): string {
  if (!image || typeof image === 'number') return fallback
  return image.alt || fallback
}
