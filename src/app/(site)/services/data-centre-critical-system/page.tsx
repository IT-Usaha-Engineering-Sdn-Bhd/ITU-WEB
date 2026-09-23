import type { Metadata } from 'next'
import { Buildings, Gauge, ShieldCheck } from '@phosphor-icons/react/dist/ssr'
import { getServiceDataCentre } from '@/lib/inner-pages'
import { getSettings } from '@/lib/site-content'
import { pageMetadata } from '@/lib/seo'
import { HeroBanner } from '@/components/inner/HeroBanner'
import { SplitSection } from '@/components/services/SplitSection'
import { IconList } from '@/components/services/IconList'
import { ImageCards } from '@/components/services/ImageCards'
import { EquipmentGallery } from '@/components/services/EquipmentGallery'

const bulletIcons = [ShieldCheck]
const path = '/services/data-centre-critical-system'

export async function generateMetadata(): Promise<Metadata> {
  const [data, settings] = await Promise.all([getServiceDataCentre(), getSettings()])
  return pageMetadata(data, 'Data Centre & Critical System', path, settings.siteName)
}

export default async function DataCentrePage() {
  const [data, settings] = await Promise.all([getServiceDataCentre(), getSettings()])

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
          image={data.turnkey.image}
          imageLabel={data.turnkey.title}
          icon={Buildings}
          reverse
          priority
        >
          <h2 className="section-heading">{data.turnkey.title}</h2>
          <p className="section-body">{data.turnkey.body}</p>
          <h3 className="service-subtitle">{data.turnkey.subtitle}</h3>
          <p className="section-body">{data.turnkey.subBody}</p>
        </SplitSection>

        <SplitSection
          image={data.critical.image}
          imageLabel={data.critical.title}
          icon={ShieldCheck}
        >
          <h2 className="section-heading">{data.critical.title}</h2>
          <p className="section-body">{data.critical.body}</p>
          <IconList
            icons={bulletIcons}
            items={(data.critical.items ?? []).map((item) => ({
              title: item.text,
              icon: item.icon,
            }))}
          />
        </SplitSection>

        <SplitSection
          image={data.testing.image}
          imageLabel={data.testing.title}
          icon={Gauge}
          reverse
        >
          <h2 className="section-heading">{data.testing.title}</h2>
          <p className="section-body">{data.testing.body}</p>
          <h3 className="service-subtitle">{data.testing.galleryTitle}</h3>
          <div className="service-equipment">
            <EquipmentGallery
              galleryTitle={data.testing.galleryTitle}
              equipment={data.testing.equipment ?? []}
              placeholderCaption={data.equipmentPlaceholderCaption}
            />
          </div>
        </SplitSection>
      </section>

      <ImageCards heading={data.whyHeading} items={data.why ?? []} icon={Buildings} />
    </main>
  )
}
