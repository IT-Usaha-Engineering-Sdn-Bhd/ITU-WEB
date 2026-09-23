import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChatCircleDots } from '@phosphor-icons/react/dist/ssr'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getProject } from '@/lib/listings'
import { mediaUrl } from '@/lib/media'
import { consultantLabel, formatMonthYear } from '@/lib/listing-utils'
import { EntryImage } from '@/components/inner/EntryImage'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return {}
  const image = mediaUrl(project.seo?.ogImage) ?? mediaUrl(project.cover)
  return {
    title: project.seo?.title || project.title,
    description: project.seo?.description,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: { images: image ? [{ url: image }] : undefined },
  }
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) notFound()
  const consultants = project.consultants ?? []

  return (
    <main id="main-content" className="inner-page">
      <section className="section-shell project-info-grid">
        <EntryImage image={project.cover} label={project.title} kind="card" priority />
        <div className="project-info">
          <p className="eyebrow">{project.status === 'completed' ? 'Completed' : 'Ongoing'}</p>
          <h1 className="section-heading">{project.title}</h1>
          <dl>
            {project.client && (
              <div>
                <dt>Client</dt>
                <dd>{project.client}</dd>
              </div>
            )}
            {consultants.length > 0 && (
              <div>
                <dt>{consultantLabel(consultants.length)}</dt>
                <dd>
                  {consultants.map((c) => (
                    <span key={c.id}>{c.name}</span>
                  ))}
                </dd>
              </div>
            )}
            {project.scope && (
              <div>
                <dt>Scope of Works</dt>
                <dd>{project.scope}</dd>
              </div>
            )}
            <div>
              <dt>Commencement Date</dt>
              <dd>{formatMonthYear(project.commencementDate)}</dd>
            </div>
            <div>
              <dt>Completion Date</dt>
              <dd>
                {project.completionDate ? formatMonthYear(project.completionDate) : 'Present'}
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
          <h2>
            Have a project in mind? We&rsquo;re here to help you plan, build, and maintain it with
            confidence
          </h2>
          <Link href="/contact-us" className="button button-dark">
            Contact Us
            <ChatCircleDots size={24} weight="light" />
          </Link>
        </div>
      </section>
    </main>
  )
}
