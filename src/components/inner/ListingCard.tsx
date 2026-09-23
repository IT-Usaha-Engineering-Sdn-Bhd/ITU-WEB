import Link from 'next/link'
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import type { Media } from '@/payload-types'
import { EntryImage } from './EntryImage'

export function ListingCard({
  href,
  image,
  meta,
  title,
  cta,
  preview,
}: {
  href?: string
  image?: number | Media | null
  meta: string
  title: string
  cta: string
  preview?: boolean
}) {
  const body = (
    <>
      <EntryImage image={image} label={title} kind="card" />
      <div className="listing-card-body">
        <p className="listing-card-meta">{meta}</p>
        <h3>{title}</h3>
        {!preview && (
          <span className="text-button">
            {cta}
            <ArrowUpRight size={16} />
          </span>
        )}
      </div>
    </>
  )

  if (preview || !href)
    return (
      <div className="listing-card is-preview" aria-disabled="true">
        <span className="listing-card-preview-label">Preview</span>
        {body}
      </div>
    )

  return (
    <Link href={href} className="listing-card">
      {body}
    </Link>
  )
}
