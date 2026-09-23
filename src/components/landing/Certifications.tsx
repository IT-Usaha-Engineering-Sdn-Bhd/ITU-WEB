'use client'
import Image from 'next/image'
import { Certificate } from '@phosphor-icons/react'
import { Reveal } from '@/components/Reveal'
import { Carousel } from '@/components/Carousel'
import { mediaAlt, mediaUrl } from '@/lib/media'
import type { Landing } from '@/payload-types'

export function Certifications({ data }: { data: Landing['certs'] }) {
  return (
    <section id="certs" data-section="certs" className="landing-section certs-section">
      <div className="section-shell">
        <Reveal className="section-intro centered">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 className="section-heading">{data.header}</h2>
        </Reveal>
        <div className="cert-carousel">
          <Carousel
            ariaLabel="Industry certifications"
            items={data.items ?? []}
            renderItem={(item) => {
              const url = mediaUrl(item.certificate)
              return (
                <div className="cert-slide">
                  <div className="certificate-visual">
                    {url ? (
                      <Image
                        src={url}
                        alt={mediaAlt(item.certificate, item.name + ' certificate')}
                        fill
                        sizes="(min-width: 768px) 320px, 80vw"
                        className="object-contain"
                      />
                    ) : (
                      <div className="certificate-placeholder">
                        <Certificate size={72} weight="thin" />
                        <span>{data.placeholderLabel}</span>
                      </div>
                    )}
                  </div>
                  <div className="cert-copy">
                    <p className="eyebrow">{data.slideEyebrow}</p>
                    <h3>{item.name}</h3>
                    <p className="section-body">{item.description}</p>
                  </div>
                </div>
              )
            }}
          />
        </div>
      </div>
    </section>
  )
}
