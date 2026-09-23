'use client'
import Image from 'next/image'
import { Cube, Buildings, Lightning, HardHat, GearSix } from '@phosphor-icons/react'
import { Reveal } from '@/components/Reveal'
import { Carousel } from '@/components/Carousel'
import { Backdrop } from '@/components/Backdrop'
import { mediaAlt, mediaUrl } from '@/lib/media'
import type { Landing } from '@/payload-types'

const icons = [GearSix, Buildings, HardHat, Lightning, Cube]
export function Services({ data }: { data: Landing['services'] }) {
  return (
    <section id="services" data-section="services" className="landing-section services-section">
      <Backdrop />
      <div className="section-shell">
        <Reveal className="services-intro">
          <div>
            <p className="eyebrow">Expertise, connected.</p>
            <h2 className="section-heading">{data.header}</h2>
          </div>
          <p className="section-body">{data.body}</p>
        </Reveal>
        <Carousel
          ariaLabel="M&E services"
          items={data.items ?? []}
          renderItem={(item, index) => {
            const url = mediaUrl(item.image)
            const Icon = icons[index % icons.length]
            return (
              <div className="service-slide">
                <div className="service-visual">
                  {url ? (
                    <Image
                      src={url}
                      alt={mediaAlt(item.image, item.title)}
                      fill
                      sizes="(min-width: 1024px) 48vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="service-placeholder">
                      <div className="technical-orbit">
                        <Icon weight="thin" />
                      </div>
                      <span>Service imagery coming soon</span>
                    </div>
                  )}
                </div>
                <div className="service-copy">
                  <span className="service-number" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3>{item.title}</h3>
                  {item.tagline && <p className="service-tagline">{item.tagline}</p>}
                  <p className="section-body">{item.body}</p>
                </div>
              </div>
            )
          }}
        />
      </div>
    </section>
  )
}
