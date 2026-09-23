import Image from 'next/image'
import Link from 'next/link'
import { CaretRight } from '@phosphor-icons/react/dist/ssr'
import { Reveal } from '@/components/Reveal'
import { mediaAlt, mediaUrl } from '@/lib/media'
import type { Landing } from '@/payload-types'

export function Projects({ data }: { data: Landing['projects'] }) {
  const backgroundUrl = mediaUrl(data.backgroundImage)
  return (
    <section id="projects" data-section="projects" className="landing-section projects-section">
      <div className="projects-image">
        {backgroundUrl && (
          <Image
            src={backgroundUrl}
            alt={mediaAlt(data.backgroundImage, '')}
            fill
            sizes="100vw"
            className="object-cover"
          />
        )}
      </div>
      <div id="projects-viewport" className="absolute inset-0" aria-hidden="true" />
      <div className="projects-shade" />
      <Reveal className="section-shell projects-copy">
        <p className="eyebrow">{data.eyebrow}</p>
        <h2 className="section-heading">{data.header}</h2>
        <p className="section-body">{data.body}</p>
        <Link href={data.ctaHref} className="button button-accent">
          {data.ctaLabel}
          <CaretRight size={20} />
        </Link>
      </Reveal>
    </section>
  )
}
