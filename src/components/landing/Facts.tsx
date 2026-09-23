import { Reveal } from '@/components/Reveal'
import { Counter } from '@/components/Counter'
import { Backdrop } from '@/components/Backdrop'
import type { Landing } from '@/payload-types'

export function Facts({ data }: { data: Landing['facts'] }) {
  return (
    <section id="facts" data-section="facts" className="landing-section facts-section">
      <Backdrop />
      <div className="section-shell">
        <Reveal className="section-intro centered">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 className="section-heading">{data.header}</h2>
          <p className="section-body">{data.body}</p>
        </Reveal>
        <div className="facts-grid">
          {(data.stats ?? []).map((stat) => (
            <div className="fact" key={stat.id ?? stat.label}>
              <Counter value={stat.value} suffix={stat.suffix ?? ''} className="fact-number" />
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
