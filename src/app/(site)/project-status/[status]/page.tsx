import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProjects } from '@/lib/queries'
import { Hero } from '@/components/layout/Hero'
import { Container } from '@/components/ui/Container'
import { ProjectCard } from '@/components/cards/ProjectCard'

const STATUS_MAP = {
  'completed-projects': { key: 'completed', label: 'Completed Projects', intro: 'A track record of successfully delivered Data Centre and M&E projects nationwide.' },
  'ongoing-projects': { key: 'ongoing', label: 'Ongoing Projects', intro: 'Projects currently underway across our Data Centre and M&E portfolio.' },
} as const

type StatusSlug = keyof typeof STATUS_MAP

export function generateStaticParams() {
  return Object.keys(STATUS_MAP).map((status) => ({ status }))
}

export async function generateMetadata({ params }: { params: Promise<{ status: string }> }): Promise<Metadata> {
  const { status } = await params
  const entry = STATUS_MAP[status as StatusSlug]
  return { title: entry?.label ?? 'Projects' }
}

export default async function ProjectStatusPage({ params }: { params: Promise<{ status: string }> }) {
  const { status } = await params
  const entry = STATUS_MAP[status as StatusSlug]
  if (!entry) notFound()

  const projects = await getProjects(entry.key)

  return (
    <>
      <Hero headline={entry.label} compact />
      <section className="py-16">
        <Container>
          <p className="mx-auto mb-10 max-w-2xl text-center text-lead text-text/70">{entry.intro}</p>
          {projects.length === 0 ? (
            <p className="text-center text-text/60">No projects to show yet.</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
