import Image from 'next/image'
import { ImageSquare, UserCircle } from '@phosphor-icons/react/dist/ssr'
import type { Media } from '@/payload-types'
import { mediaAlt, mediaUrl } from '@/lib/media'

const KIND_LABEL: Record<Kind, string> = {
  portrait: 'Leadership portrait', milestone: 'Milestone image', card: 'Listing image', gallery: 'Gallery image',
}
const KIND_SIZES: Record<Kind, string> = {
  portrait: '(min-width: 350px) 300px, 100vw', milestone: '(min-width: 900px) 35vw, 80vw',
  card: '(min-width: 900px) 30vw, (min-width: 600px) 45vw, 100vw', gallery: '(min-width: 600px) 45vw, 100vw',
}
type Kind = 'portrait' | 'milestone' | 'card' | 'gallery'

export function EntryImage({ image, label, kind, priority }: {
  image?: number | Media | null
  label: string
  kind: Kind
  priority?: boolean
}) {
  const url = mediaUrl(image)
  const title = `${label} ${KIND_LABEL[kind].toLowerCase()}`

  return <div className={`entry-image entry-image--${kind}${url ? ' has-image' : ' is-placeholder'}`}>
    {url ? <Image src={url} alt={mediaAlt(image, title)} fill sizes={KIND_SIZES[kind]} className="object-cover" priority={priority} loading={priority ? undefined : 'lazy'} />
      : <div className="entry-image-placeholder" role="img" aria-label={`${title} placeholder`}>
        {kind === 'portrait' ? <UserCircle size={56} weight="thin" aria-hidden="true" /> : <ImageSquare size={44} weight="thin" aria-hidden="true" />}
        <span aria-hidden="true">{KIND_LABEL[kind]}</span>
      </div>}
  </div>
}
