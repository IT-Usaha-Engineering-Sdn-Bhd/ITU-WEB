import { ModelStage } from '@/components/ModelStage'
import { HighlightedHeading } from '@/components/HighlightedHeading'
import type { Metadata } from 'next'
import { GearSix, Lightning, ShieldCheck, Thermometer } from '@phosphor-icons/react/dist/ssr'
import type { Icon } from '@phosphor-icons/react'
import { getServiceHighTension } from '@/lib/inner-pages'
import { getSettings } from '@/lib/site-content'
import { pageMetadata } from '@/lib/seo'
import { HeroBanner } from '@/components/inner/HeroBanner'
import { SplitSection } from '@/components/services/SplitSection'
import { IconList } from '@/components/services/IconList'
import { Divider } from '@/components/services/Divider'
import { ImageCards } from '@/components/services/ImageCards'

const bulletIcons = [Lightning, GearSix, ShieldCheck]
const powerIcons: Icon[] = [Lightning, GearSix, ShieldCheck]
const backupIcons: Icon[] = [GearSix, Thermometer]
const protectionIcons: Icon[] = [ShieldCheck, Lightning, Lightning]
const path = '/services/high-tension'

export async function generateMetadata(): Promise<Metadata> {
  const [data, settings] = await Promise.all([getServiceHighTension(), getSettings()])
  return pageMetadata(data, 'High Tension & Electrical Services', path, settings.siteName)
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
              items={(section.items ?? []).map((item) => ({ title: item.text, icon: item.icon }))}
            />
          )}
        </SplitSection>
      ))}
    </>
  )
}

export default async function HighTensionPage() {
  const [data, settings] = await Promise.all([getServiceHighTension(), getSettings()])

  return (
    <main id="main-content" className="inner-page service-page">
      <section className="section-shell inner-hero">
        <p className="eyebrow">{data.eyebrow}</p>
        <h1 className="section-heading">
          <HighlightedHeading text={data.heading} highlight={data.highlight} />
        </h1>
        <p className="section-body service-intro">{data.intro}</p>
      </section>
      <ModelStage id="electrical-services" title={data.bannerLabel} />
      <HeroBanner
        priority={false}
        image={data.heroImage}
        label={data.bannerLabel}
        kicker={settings.heroBannerKicker}
        wordmark={settings.heroBannerWordmark}
      />

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

      <ImageCards
        heading={data.feature.eyebrow}
        items={[{ title: data.feature.title, body: data.feature.body, image: data.feature.image }]}
        icon={ShieldCheck}
      />
    </main>
  )
}
