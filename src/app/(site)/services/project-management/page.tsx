import type { Metadata } from 'next'
import {
  Blueprint,
  ChartLine,
  CurrencyCircleDollar,
  FileText,
  Handshake,
  Ruler,
} from '@phosphor-icons/react/dist/ssr'
import { getServiceProjectManagement } from '@/lib/inner-pages'
import { getSettings } from '@/lib/site-content'
import { pageMetadata } from '@/lib/seo'
import { HeroBanner } from '@/components/inner/HeroBanner'
import { IconList } from '@/components/services/IconList'
import { ImageCards } from '@/components/services/ImageCards'
import { Reveal } from '@/components/Reveal'

const icons = [Blueprint, FileText, CurrencyCircleDollar, Handshake, Ruler, ChartLine]
const path = '/services/project-management'

export async function generateMetadata(): Promise<Metadata> {
  const [data, settings] = await Promise.all([getServiceProjectManagement(), getSettings()])
  return pageMetadata(data, 'Project Management', path, settings.siteName)
}

export default async function ProjectManagementPage() {
  const [data, settings] = await Promise.all([getServiceProjectManagement(), getSettings()])

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

      <section className="section-shell service-content">
        <Reveal className="section-intro centered">
          <h2 className="section-heading">{data.servicesHeading}</h2>
        </Reveal>
        <IconList icons={icons} variant="grid" items={data.services ?? []} />
      </section>
      <ImageCards heading={data.whyHeading} items={data.why ?? []} icon={Ruler} />
    </main>
  )
}
