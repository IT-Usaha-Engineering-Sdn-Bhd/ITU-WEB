import type { Metadata } from 'next'
import {
  ClipboardText,
  ClockCountdown,
  Gauge,
  GearSix,
  Lightning,
  Medal,
  ShieldCheck,
  Thermometer,
  Wrench,
} from '@phosphor-icons/react/dist/ssr'
import { getServiceFacilitiesManagement } from '@/lib/inner-pages'
import { getSettings } from '@/lib/site-content'
import { pageMetadata } from '@/lib/seo'
import { HeroBanner } from '@/components/inner/HeroBanner'
import { SplitSection } from '@/components/services/SplitSection'
import { IconList } from '@/components/services/IconList'
import { ImageCards } from '@/components/services/ImageCards'

const supportIcons = [ClockCountdown, Wrench, Lightning, Gauge, ClipboardText, Wrench]
const maintenanceIcons = [ShieldCheck, Thermometer, ShieldCheck, GearSix, Lightning]
const path = '/services/facilities-management'

export async function generateMetadata(): Promise<Metadata> {
  const [data, settings] = await Promise.all([getServiceFacilitiesManagement(), getSettings()])
  return pageMetadata(data, 'Facilities Management', path, settings.siteName)
}

export default async function FacilitiesManagementPage() {
  const [data, settings] = await Promise.all([getServiceFacilitiesManagement(), getSettings()])

  return (
    <main id="main-content" className="inner-page">
      <section className="section-shell inner-hero">
        <p className="eyebrow">{data.eyebrow}</p>
        <h1 className="section-heading">
          {data.heading.split(data.highlight)[0]}
          <span className="text-accent">{data.highlight}</span>
        </h1>
      </section>
      <HeroBanner
        image={data.heroImage}
        label={data.bannerLabel}
        kicker={settings.heroBannerKicker}
        wordmark={settings.heroBannerWordmark}
      />

      <section className="section-shell service-intro">
        <p className="section-body">{data.intro}</p>
      </section>

      <section className="section-shell">
        <SplitSection
          image={data.support.image}
          imageLabel={data.support.title}
          icon={ClockCountdown}
          reverse
          priority
        >
          <h2 className="section-heading">{data.support.title}</h2>
          <p className="section-body">{data.support.body}</p>
          <IconList
            icons={supportIcons}
            variant="grid"
            compact
            items={(data.support.items ?? []).map((item) => ({
              title: item.text,
              icon: item.icon,
            }))}
          />
        </SplitSection>

        <SplitSection
          image={data.maintenance.image}
          imageLabel={data.maintenance.title}
          icon={ShieldCheck}
        >
          <h2 className="section-heading">{data.maintenance.title}</h2>
          <p className="section-body">{data.maintenance.body}</p>
          <IconList
            icons={maintenanceIcons}
            variant="grid"
            compact
            items={(data.maintenance.items ?? []).map((item) => ({
              title: item.text,
              icon: item.icon,
            }))}
          />
        </SplitSection>
      </section>

      <ImageCards heading={data.whyHeading} items={data.why ?? []} icon={Medal} />
    </main>
  )
}
