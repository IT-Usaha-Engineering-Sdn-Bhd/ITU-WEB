import Link from 'next/link'
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import { Reveal } from '@/components/Reveal'
import type { Landing } from '@/payload-types'

export function WhoWeAre({ data }: { data: Landing['whoWeAre'] }) {
  return (
    <section
      id="who-we-are"
      tabIndex={-1}
      data-section="who-we-are"
      className="landing-section who-section"
    >
      <div className="section-shell who-grid">
        <Reveal className="who-copy">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 className="section-heading">{data.header}</h2>
          <div className="section-body who-body">
            {data.body.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          <Link href={data.ctaHref} className="button button-outline">
            {data.ctaLabel}
            <ArrowUpRight size={20} />
          </Link>
        </Reveal>
        <div
          id="building-viewport"
          className="building-viewport"
          aria-label="Data centre architectural model"
        >
          <div className="model-caption">
            <span>{data.modelCaptionTitle}</span>
            <span>{data.modelCaptionSubtitle}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
