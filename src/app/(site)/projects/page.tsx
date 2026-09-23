import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProjectsPage } from '@/lib/inner-pages'
import { getProjects } from '@/lib/listings'
import { mediaUrl } from '@/lib/media'
import { dateRange, parsePage, parseStatus } from '@/lib/listing-utils'
import { HeroBanner } from '@/components/inner/HeroBanner'
import { CategoryTabs } from '@/components/inner/CategoryTabs'
import { ListingCard } from '@/components/inner/ListingCard'
import { Pagination } from '@/components/inner/Pagination'

const STATUS_TABS = [
  { label: 'Completed', value: 'completed' },
  { label: 'Ongoing', value: 'ongoing' },
]

export async function generateMetadata(): Promise<Metadata> {
  const data = await getProjectsPage()
  const image = mediaUrl(data.seo?.ogImage)
  return {
    title: data.seo?.title || 'Projects',
    description: data.seo?.description,
    alternates: { canonical: '/projects' },
    openGraph: { images: image ? [{ url: image }] : undefined },
  }
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const status = parseStatus(params.status)
  const page = parsePage(params.page)
  const [data, result] = await Promise.all([getProjectsPage(), getProjects({ status, page })])
  if (page > 1 && page > result.totalPages) notFound()

  return (
    <main id="main-content" className="inner-page">
      <section className="section-shell inner-hero">
        <p className="eyebrow">Projects</p>
        <h1 className="section-heading">
          {data.heading.split(data.highlight)[0]}
          <span className="text-accent">{data.highlight}</span>
        </h1>
      </section>
      <HeroBanner image={data.heroImage} label="Projects" />
      <section className="section-shell listing-section">
        <CategoryTabs
          items={STATUS_TABS}
          active={status}
          basePath="/projects"
          paramName="status"
          arrows={false}
        />
        <div className="listing-grid">
          {result.docs.length === 0 && (
            <ListingCard
              preview
              meta="Coming soon"
              title="More projects in this status are on the way"
              cta=""
            />
          )}
          {result.docs.map((project) => (
            <ListingCard
              key={project.id}
              href={`/projects/${project.slug}`}
              image={project.cover}
              meta={`${STATUS_TABS.find((s) => s.value === project.status)?.label ?? ''} · ${dateRange(project.status, project.commencementDate, project.completionDate)}`}
              title={project.title}
              cta="Project Details"
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
