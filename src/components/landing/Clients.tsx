import Image from 'next/image'
import { Buildings } from '@phosphor-icons/react/dist/ssr'
import { Reveal } from '@/components/Reveal'
import { Backdrop } from '@/components/Backdrop'
import { mediaAlt, mediaUrl } from '@/lib/media'
import type { Landing } from '@/payload-types'

export function Clients({ data }: { data: Landing['clients'] }) {
  const logos = (data.logos ?? []).filter((entry) => mediaUrl(entry.logo))
  return (
    <section id="clients" data-section="clients" className="landing-section clients-section">
      <Backdrop />
      <div className="section-shell">
        <Reveal className="section-intro centered">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 className="section-heading">{data.header}</h2>
          <p className="section-body">{data.body}</p>
        </Reveal>
        <div className="clients-grid">
          {logos.length
            ? logos.map((entry) => {
                const logo = (
                  <Image
                    src={mediaUrl(entry.logo)!}
                    alt={mediaAlt(entry.logo, entry.name ?? 'Client logo')}
                    width={180}
                    height={80}
                    className="client-logo"
                  />
                )
                return entry.url ? (
                  <a
                    className="client-tile"
                    key={entry.id ?? entry.name}
                    href={entry.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {logo}
                  </a>
                ) : (
                  <div className="client-tile" key={entry.id ?? entry.name}>
                    {logo}
                  </div>
                )
              })
            : Array.from({ length: 6 }, (_, i) => (
                <div className="client-tile client-placeholder" key={i}>
                  <Buildings size={28} weight="light" />
                  <span>{data.placeholderLabel}</span>
                </div>
              ))}
        </div>
      </div>
    </section>
  )
}
