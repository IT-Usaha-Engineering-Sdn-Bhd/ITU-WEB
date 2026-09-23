import type { Metadata } from 'next'
import { getCareerPage } from '@/lib/inner-pages'
import { getVacancies } from '@/lib/listings'
import { mediaUrl } from '@/lib/media'
import { HeroBanner } from '@/components/inner/HeroBanner'
import { CareerApplication } from '@/components/inner/CareerApplication'

export async function generateMetadata(): Promise<Metadata> {
  const data = await getCareerPage()
  const image = mediaUrl(data.seo?.ogImage)
  return { title: data.seo?.title || 'Career', description: data.seo?.description,
    alternates: { canonical: '/career' }, openGraph: { images: image ? [{ url: image }] : undefined } }
}

export default async function CareerPage() {
  const [data, vacancies] = await Promise.all([getCareerPage(), getVacancies()])

  return <main id="main-content" className="inner-page">
    <section className="section-shell inner-hero"><p className="eyebrow">Career</p>
      <h1 className="section-heading">{data.heading.split(data.highlight)[0]}<span className="text-accent">{data.highlight}</span></h1>
    </section>
    <HeroBanner image={data.heroImage} label="Career" />
    <section className="section-shell career-section">
      <div className="section-intro"><h2 className="section-heading">Available Positions</h2></div>
      <CareerApplication vacancies={vacancies} applyHeading={data.applyHeading} applyBody={data.applyBody} />
    </section>
  </main>
}
