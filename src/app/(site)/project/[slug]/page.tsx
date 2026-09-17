import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { getProjectBySlug } from '@/lib/queries'
import { Container } from '@/components/ui/Container'
import { RichText } from '@/components/ui/RichText'
import { Gallery } from '@/components/cards/Gallery'
import { ContactCta } from '@/components/cards/ContactCta'
import type { Media } from '@/payload-types'

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'projects', where: { status: { equals: 'published' } }, limit: 100 })
  return docs.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return {}
  return { title: project.seo?.title ?? project.title, description: project.seo?.description ?? project.summary ?? undefined }
}

function formatDate(d?: string | null) {
  if (!d) return null
  return new Date(d).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) notFound()

  const consultants = (project.consultants ?? []).map((c) => c.name).filter(Boolean)
  const metaRows: { label: string; value: string }[] = []
  if (project.location) metaRows.push({ label: 'Location', value: project.location })
  if (project.client) metaRows.push({ label: 'Client', value: project.client })
  if (consultants.length) metaRows.push({ label: consultants.length > 1 ? 'Consultants' : 'Consultant', value: consultants.join(', ') })
  const commencement = formatDate(project.commencementDate)
  const completion = formatDate(project.completionDate)
  if (commencement) metaRows.push({ label: 'Commencement', value: commencement })
  if (completion) metaRows.push({ label: 'Completion', value: completion })
  metaRows.push({ label: 'Status', value: project.projectStatus === 'ongoing' ? 'Ongoing' : 'Completed' })

  const gallery = (project.gallery ?? []).filter((g) => g.image) as { image: Media | number; id?: string | null }[]

  return (
    <>
      <section className="py-12">
        <Container>
          <Link href="/projects/" className="text-small font-semibold text-accent">
            ← Back to Projects
          </Link>
          <h1 className="mt-4">{project.title}</h1>
          {project.location && <p className="mt-2 text-lead text-text/70">{project.location}</p>}

          <div className="mt-10 grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2 lg:order-1 order-2 flex flex-col gap-8">
              {project.summary && <p className="text-lead text-text/80">{project.summary}</p>}
              <RichText data={project.scopeOfWorks} />
              {(project.metrics?.length ?? 0) > 0 && (
                <div>
                  <h3>Capacity & Delivery</h3>
                  <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {project.metrics!.map((m, i) => (
                      <div key={i}>
                        <dt className="text-small text-text/60">{m.label}</dt>
                        <dd className="text-h5">{m.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
              {gallery.length > 0 && (
                <div>
                  <h3>Gallery</h3>
                  <div className="mt-4">
                    <Gallery images={gallery} />
                  </div>
                </div>
              )}
            </div>

            <aside className="lg:col-span-1 lg:order-2 order-1">
              <dl className="rounded-lg border border-surface-alt p-6">
                {metaRows.map((row) => (
                  <div key={row.label} className="flex justify-between gap-4 border-b border-surface-alt py-3 last:border-0">
                    <dt className="text-small text-text/60">{row.label}</dt>
                    <dd className="text-right text-small font-semibold text-primary">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </Container>
      </section>

      <ContactCta heading="Have a similar project in mind? Let's discuss it." />
    </>
  )
}
