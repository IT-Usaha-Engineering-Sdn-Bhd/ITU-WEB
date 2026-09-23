import type { Metadata } from 'next'
import { getCareerPage } from '@/lib/inner-pages'
import { getSettings } from '@/lib/site-content'
import { getVacancies } from '@/lib/listings'
import { pageMetadata } from '@/lib/seo'
import { HeroBanner } from '@/components/inner/HeroBanner'
import { CareerApplication } from '@/components/inner/CareerApplication'

export async function generateMetadata(): Promise<Metadata> {
  const [data, settings] = await Promise.all([getCareerPage(), getSettings()])
  return pageMetadata(data, 'Career', '/career', settings.siteName)
}

export default async function CareerPage() {
  const [data, vacancies, settings] = await Promise.all([
    getCareerPage(),
    getVacancies(),
    getSettings(),
  ])

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
      <section className="section-shell career-section">
        <div className="section-intro">
          <h2 className="section-heading">{data.positionsHeading}</h2>
        </div>
        <CareerApplication
          vacancies={vacancies}
          applyHeading={data.applyHeading}
          applyBody={data.applyBody}
          labels={data.form}
        />
      </section>
    </main>
  )
}
