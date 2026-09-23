import type { Metadata } from 'next'
import { GearSix, Lightning, ShieldCheck, Thermometer } from '@phosphor-icons/react/dist/ssr'
import type { Icon } from '@phosphor-icons/react'
import { getServiceHighTension, serviceMetadata } from '@/lib/inner-pages'
import { HeroBanner } from '@/components/inner/HeroBanner'
import { SplitSection } from '@/components/services/SplitSection'
import { IconList } from '@/components/services/IconList'
import { Divider } from '@/components/services/Divider'
import { Reveal } from '@/components/Reveal'

const bulletIcons = [Lightning, GearSix, ShieldCheck]
const powerIcons: Icon[] = [Lightning, GearSix, ShieldCheck]
const backupIcons: Icon[] = [GearSix, Thermometer]
const protectionIcons: Icon[] = [ShieldCheck, Lightning, Lightning]
const path = '/services/high-tension'

export async function generateMetadata(): Promise<Metadata> {
  const data = await getServiceHighTension()
  return serviceMetadata(data, 'High Tension & Electrical Services', path)
}

function Group({
  sections,
  icons,
}: {
  sections: NonNullable<Awaited<ReturnType<typeof getServiceHighTension>>['power']>
  icons: Icon[]
}) {
  return (
    <>
      {sections.map((section, i) => (
        <SplitSection
          key={section.title}
          image={section.image}
          imageLabel={section.title}
          icon={icons[i % icons.length]}
          reverse={i % 2 === 1}
        >
          <h2 className="section-heading">{section.title}</h2>
          <p className="section-body">{section.body}</p>
          {section.note && <p className="section-body service-note">{section.note}</p>}
          {(section.items?.length ?? 0) > 0 && (
            <IconList
              icons={bulletIcons}
              items={(section.items ?? []).map((item) => ({ title: item.text }))}
            />
          )}
        </SplitSection>
      ))}
    </>
  )
}

export default async function HighTensionPage() {
  const data = await getServiceHighTension()

  return (
    <main id="main-content" className="inner-page">
      <section className="section-shell inner-hero">
        <p className="eyebrow">Our Services</p>
        <h1 className="section-heading">
          {data.heading.split(data.highlight)[0]}
          <span className="text-accent">{data.highlight}</span>
        </h1>
      </section>
      <HeroBanner image={data.heroImage} label="High Tension & Electrical Services" />

      <section className="section-shell service-intro">
        <p className="section-body">{data.intro}</p>
      </section>

      <section className="section-shell">
        <Group sections={data.power ?? []} icons={powerIcons} />
      </section>
      <Divider heading={data.divider1.heading} body={data.divider1.body} />
      <section className="section-shell">
        <Group sections={data.backup ?? []} icons={backupIcons} />
      </section>
      <Divider heading={data.divider2.heading} body={data.divider2.body} />
      <section className="section-shell">
        <Group sections={data.protection ?? []} icons={protectionIcons} />
      </section>

      <section className="section-shell">
        <Reveal className="section-intro centered">
          <p className="eyebrow">{data.feature.eyebrow}</p>
        </Reveal>
        <SplitSection image={data.feature.image} imageLabel={data.feature.title} icon={ShieldCheck}>
          <h2 className="section-heading">{data.feature.title}</h2>
          <p className="section-body">{data.feature.body}</p>
        </SplitSection>
      </section>
    </main>
  )
}
