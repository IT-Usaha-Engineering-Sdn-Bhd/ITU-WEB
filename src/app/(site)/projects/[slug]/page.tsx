import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChatCircleDots } from '@phosphor-icons/react/dist/ssr'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getProject } from '@/lib/listings'
import { getProjectsPage } from '@/lib/inner-pages'
import { getSettings } from '@/lib/site-content'
import { pageMetadata } from '@/lib/seo'
import { formatMonthYear } from '@/lib/listing-utils'
import { EntryImage } from '@/components/inner/EntryImage'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const [project, settings] = await Promise.all([getProject(slug), getSettings()])
  if (!project) return {}
  return pageMetadata(project, project.title, `/projects/${slug}`, settings.siteName)
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [project, page] = await Promise.all([getProject(slug), getProjectsPage()])
  if (!project) notFound()
  const consultants = project.consultants ?? []

  return (
    <main id="main-content" className="inner-page">
      <section className="section-shell project-info-grid">
        <EntryImage image={project.cover} label={project.title} kind="card" priority />
        <div className="project-info">
          <p className="eyebrow">
            {project.status === 'completed' ? page.completedLabel : page.ongoingLabel}
          </p>
          <h1 className="section-heading">{project.title}</h1>
          <dl>
            {project.client && (
              <div>
                <dt>{page.clientLabel}</dt>
                <dd>{project.client}</dd>
              </div>
            )}
            {consultants.length > 0 && (
              <div>
                <dt>{consultants.length > 1 ? page.consultantsLabel : page.consultantLabel}</dt>
                <dd>
                  {consultants.map((c) => (
                    <span key={c.id}>{c.name}</span>
                  ))}
                </dd>
              </div>
            )}
            {project.scope && (
              <div>
                <dt>{page.scopeLabel}</dt>
                <dd>{project.scope}</dd>
              </div>
            )}
            <div>
              <dt>{page.commencementLabel}</dt>
              <dd>{formatMonthYear(project.commencementDate)}</dd>
            </div>
            <div>
              <dt>{page.completionLabel}</dt>
              <dd>
                {project.completionDate
                  ? formatMonthYear(project.completionDate)
                  : page.presentLabel}
              </dd>
            </div>
          </dl>
        </div>
      </section>
      {project.body && (
        <section className="section-shell project-body">
          <RichText data={project.body} />
        </section>
      )}
      <section className="cta-section">
        <div className="section-shell cta-grid">
          <h2>{page.detailCta.heading}</h2>
          <Link href={page.detailCta.ctaHref} className="button button-dark">
            {page.detailCta.ctaLabel}
            <ChatCircleDots size={24} weight="light" />
          </Link>
        </div>
      </section>
    </main>
  )
}
