import Link from 'next/link'
import { ChatCircleDots } from '@phosphor-icons/react/dist/ssr'
import { Reveal } from '@/components/Reveal'
import type { Landing } from '@/payload-types'

export function CtaBand({ data }: { data: Landing['ctaBand'] }) {
  return (
    <section id="cta" data-section="cta" className="cta-section">
      <Reveal className="section-shell cta-grid">
        <h2>{data.header}</h2>
        <Link href={data.ctaHref} className="button button-dark">
          {data.ctaLabel}
          <ChatCircleDots size={24} weight="light" />
        </Link>
      </Reveal>
    </section>
  )
}
