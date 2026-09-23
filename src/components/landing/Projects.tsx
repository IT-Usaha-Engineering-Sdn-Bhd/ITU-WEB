import Link from 'next/link'
import { CaretRight } from '@phosphor-icons/react/dist/ssr'
import { Reveal } from '@/components/Reveal'
import type { Landing } from '@/payload-types'

export function Projects({ data }: { data: Landing['projects'] }) {
  return (
    <section id="projects" data-section="projects" className="landing-section projects-section">
      <div className="projects-image" />
      <div id="projects-viewport" className="absolute inset-0" aria-hidden="true" />
      <div className="projects-shade" />
      <Reveal className="section-shell projects-copy">
        <p className="eyebrow">Precision, put into practice</p>
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
