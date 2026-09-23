import Image from 'next/image'
import { ImageSquare, UserCircle } from '@phosphor-icons/react/dist/ssr'
import type { Media } from '@/payload-types'
import { mediaAlt, mediaUrl } from '@/lib/media'

export function EntryImage({ image, label, kind }: {
  image?: number | Media | null
  label: string
  kind: 'portrait' | 'milestone'
}) {
  const url = mediaUrl(image)
  const title = kind === 'portrait' ? `${label} portrait` : `${label} milestone image`

  return <div className={`entry-image entry-image--${kind}${url ? ' has-image' : ' is-placeholder'}`}>
    {url ? <Image src={url} alt={mediaAlt(image, title)} fill sizes={kind === 'portrait' ? '(min-width: 350px) 300px, 100vw' : '(min-width: 900px) 35vw, 80vw'} className="object-cover" />
      : <div className="entry-image-placeholder" role="img" aria-label={`${title} placeholder`}>
        {kind === 'portrait' ? <UserCircle size={56} weight="thin" aria-hidden="true" /> : <ImageSquare size={44} weight="thin" aria-hidden="true" />}
        <span aria-hidden="true">{kind === 'portrait' ? 'Leadership portrait' : 'Milestone image'}</span>
      </div>}
  </div>
}
