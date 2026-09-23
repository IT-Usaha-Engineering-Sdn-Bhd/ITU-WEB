import type { Metadata } from 'next'
import {
  Blueprint,
  ClockCountdown,
  Cube,
  PuzzlePiece,
  Stack,
  Truck,
} from '@phosphor-icons/react/dist/ssr'
import { getServiceDfma, serviceMetadata } from '@/lib/inner-pages'
import { mediaUrl } from '@/lib/media'
import { HeroBanner } from '@/components/inner/HeroBanner'
import { SplitSection } from '@/components/services/SplitSection'
import { IconList } from '@/components/services/IconList'
import { ImageCards } from '@/components/services/ImageCards'
import { ServiceImage } from '@/components/services/ServiceImage'
import { ModularDiagram } from '@/components/services/ModularDiagram'
import { Reveal } from '@/components/Reveal'

const capabilityIcons = [Blueprint, Stack, Cube, PuzzlePiece]
const benefitIcons = [ClockCountdown, Stack, Blueprint]
const path = '/services/dfma'

export async function generateMetadata(): Promise<Metadata> {
  const data = await getServiceDfma()
  return serviceMetadata(data, 'DFMA', path)
}

export default async function DfmaPage() {
  const data = await getServiceDfma()
  const visualUrl = mediaUrl(data.visual.image)

  return (
    <main id="main-content" className="inner-page">
      <section className="section-shell inner-hero">
        <p className="eyebrow">Our Services</p>
        <h1 className="section-heading">
          {data.heading.split(data.highlight)[0]}
          <span className="text-accent">{data.highlight}</span>
        </h1>
      </section>
      <HeroBanner image={data.heroImage} label="DFMA" />

      <section className="section-shell service-content">
        <Reveal className="service-facts">
          {(data.facts ?? []).map((fact) => (
            <div key={fact.label} className="service-fact">
              <span className="eyebrow">{fact.label}</span>
              <p className="section-heading">{fact.value}</p>
            </div>
          ))}
        </Reveal>

        <SplitSection
          image={data.capabilities.image}
          imageLabel={data.capabilities.title}
          icon={Cube}
          reverse
          priority
        >
          <h2 className="section-heading">{data.capabilities.title}</h2>
          <IconList
            icons={capabilityIcons}
            variant="grid"
            compact
            items={(data.capabilities.cards ?? []).map((card) => ({
              title: card.title,
              body: card.body,
              icon: card.icon,
            }))}
          />
        </SplitSection>

        <SplitSection image={data.benefits.image} imageLabel={data.benefits.title} icon={Truck}>
          <h2 className="section-heading">{data.benefits.title}</h2>
          <IconList
            icons={benefitIcons}
            items={(data.benefits.items ?? []).map((item) => ({
              title: item.text,
              icon: item.icon,
            }))}
          />
        </SplitSection>

        <Reveal className="service-assembly-visual">
          <h2 className="section-heading">{data.visual.title}</h2>
          {visualUrl ? (
            <ServiceImage image={data.visual.image} label={data.visual.title} icon={Cube} />
          ) : (
            <ModularDiagram title={data.visual.title} />
          )}
        </Reveal>
      </section>
      <ImageCards heading="Why Choose Us?" items={data.why ?? []} icon={Cube} />
    </main>
  )
}
