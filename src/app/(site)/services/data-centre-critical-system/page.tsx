import type { Metadata } from 'next'
import { Buildings, Gauge, ShieldCheck } from '@phosphor-icons/react/dist/ssr'
import { getServiceDataCentre, serviceMetadata } from '@/lib/inner-pages'
import { HeroBanner } from '@/components/inner/HeroBanner'
import { SplitSection } from '@/components/services/SplitSection'
import { IconList } from '@/components/services/IconList'
import { ImageCards } from '@/components/services/ImageCards'
import { EquipmentGallery } from '@/components/services/EquipmentGallery'

const bulletIcons = [ShieldCheck]
const path = '/services/data-centre-critical-system'

export async function generateMetadata(): Promise<Metadata> {
  const data = await getServiceDataCentre()
  return serviceMetadata(data, 'Data Centre & Critical System', path)
}

export default async function DataCentrePage() {
  const data = await getServiceDataCentre()

  return (
    <main id="main-content" className="inner-page">
      <section className="section-shell inner-hero">
        <p className="eyebrow">Our Services</p>
        <h1 className="section-heading">
          {data.heading.split(data.highlight)[0]}
          <span className="text-accent">{data.highlight}</span>
        </h1>
      </section>
      <HeroBanner image={data.heroImage} label="Data Centre & Critical System" />

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
            />
          </div>
        </SplitSection>
      </section>

      <ImageCards heading="Why Choose Us?" items={data.why ?? []} icon={Buildings} />
    </main>
  )
}
