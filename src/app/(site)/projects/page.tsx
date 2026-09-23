import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProjectsPage } from '@/lib/inner-pages'
import { getSettings } from '@/lib/site-content'
import { getProjects } from '@/lib/listings'
import { pageMetadata } from '@/lib/seo'
import { dateRange, parsePage, parseStatus } from '@/lib/listing-utils'
import { HeroBanner } from '@/components/inner/HeroBanner'
import { CategoryTabs } from '@/components/inner/CategoryTabs'
import { ListingCard } from '@/components/inner/ListingCard'
import { Pagination } from '@/components/inner/Pagination'

export async function generateMetadata(): Promise<Metadata> {
  const [data, settings] = await Promise.all([getProjectsPage(), getSettings()])
  return pageMetadata(data, 'Projects', '/projects', settings.siteName)
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const status = parseStatus(params.status)
  const page = parsePage(params.page)
  const [data, result, settings] = await Promise.all([
    getProjectsPage(),
    getProjects({ status, page }),
    getSettings(),
  ])
  if (page > 1 && page > result.totalPages) notFound()
  const statusTabs = [
    { label: data.completedLabel, value: 'completed' },
    { label: data.ongoingLabel, value: 'ongoing' },
  ]

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
      <section className="section-shell listing-section">
        <CategoryTabs
          items={statusTabs}
          active={status}
          basePath="/projects"
          paramName="status"
          arrows={false}
        />
        <div className="listing-grid">
          {result.docs.length === 0 && (
            <ListingCard preview meta={data.emptyMeta} title={data.emptyTitle} cta="" />
          )}
          {result.docs.map((project) => (
            <ListingCard
              key={project.id}
              href={`/projects/${project.slug}`}
              image={project.cover}
              meta={`${statusTabs.find((s) => s.value === project.status)?.label ?? ''} · ${dateRange(project.status, project.commencementDate, project.completionDate, data.presentLabel)}`}
              title={project.title}
              cta={data.detailsLabel}
            />
          ))}
        </div>
        <Pagination
          page={page}
          totalPages={result.totalPages}
          hrefFor={(n) => `/projects?status=${status}&page=${n}`}
        />
      </section>
    </main>
  )
}
