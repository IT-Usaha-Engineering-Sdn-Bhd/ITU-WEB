import type { Metadata } from 'next'
import Link from 'next/link'
import { getProjects } from '@/lib/queries'
import { Hero } from '@/components/layout/Hero'
import { Container } from '@/components/ui/Container'
import { ProjectCard } from '@/components/cards/ProjectCard'

export const metadata: Metadata = { title: 'Projects' }

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <>
      <Hero headline="Our Projects" compact />
      <section className="py-16">
        <Container>
          <div className="mb-10 flex justify-center gap-4">
            <Link href="/project-status/completed-projects/" className="rounded-md border border-primary px-6 py-2.5 text-small font-semibold text-primary hover:bg-primary hover:text-white">
              Completed Projects
            </Link>
            <Link href="/project-status/ongoing-projects/" className="rounded-md border border-primary px-6 py-2.5 text-small font-semibold text-primary hover:bg-primary hover:text-white">
              Ongoing Projects
            </Link>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
