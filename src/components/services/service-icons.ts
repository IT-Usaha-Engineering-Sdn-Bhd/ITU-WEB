import type { Media } from '@/payload-types'

export function getServiceIconMedia(image?: number | Media | null) {
  const src = typeof image === 'object' && image ? image.url : null

  return src ? { src, alt: '' } : null
}
