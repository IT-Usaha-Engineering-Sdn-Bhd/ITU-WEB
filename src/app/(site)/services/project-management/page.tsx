import type { Metadata } from 'next'
import {
  Blueprint,
  ChartLine,
  CurrencyCircleDollar,
  FileText,
  Handshake,
  Ruler,
} from '@phosphor-icons/react/dist/ssr'
import { getServiceProjectManagement, serviceMetadata } from '@/lib/inner-pages'
import { HeroBanner } from '@/components/inner/HeroBanner'
import { IconList } from '@/components/services/IconList'
import { ImageCards } from '@/components/services/ImageCards'
import { Reveal } from '@/components/Reveal'

const icons = [Blueprint, FileText, CurrencyCircleDollar, Handshake, Ruler, ChartLine]
const path = '/services/project-management'

export async function generateMetadata(): Promise<Metadata> {
  const data = await getServiceProjectManagement()
  return serviceMetadata(data, 'Project Management', path)
}

export default async function ProjectManagementPage() {
  const data = await getServiceProjectManagement()

  return (
    <main id="main-content" className="inner-page">
      <section className="section-shell inner-hero">
        <p className="eyebrow">Our Services</p>
        <h1 className="section-heading">
          {data.heading.split(data.highlight)[0]}
          <span className="text-accent">{data.highlight}</span>
        </h1>
      </section>
      <HeroBanner image={data.heroImage} label="Project Management" />

      <section className="section-shell service-content">
        <Reveal className="section-intro centered">
          <h2 className="section-heading">{data.servicesHeading}</h2>
        </Reveal>
        <IconList icons={icons} variant="grid" items={data.services ?? []} />
      </section>
      <ImageCards heading="Why Choose Us?" items={data.why ?? []} icon={Ruler} />
    </main>
  )
}
