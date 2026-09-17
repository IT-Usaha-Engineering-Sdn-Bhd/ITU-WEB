import Link from 'next/link'
import { Placeholder } from '@/components/ui/Placeholder'
import type { Project } from '@/payload-types'

function formatRange(start?: string | null, end?: string | null) {
  const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  if (start && end) return `${fmt(start)} – ${fmt(end)}`
  if (start) return fmt(start)
  return null
}

export function ProjectCard({ project }: { project: Project }) {
  const range = formatRange(project.commencementDate, project.completionDate)
  return (
    <Link
      href={`/project/${project.slug}/`}
      className="group flex flex-col overflow-hidden rounded-lg border border-surface-alt transition-shadow hover:shadow-lg"
    >
      <div className="relative">
        <Placeholder media={project.coverImage} label={project.title} ratio="4/3" sizes="(min-width: 1024px) 33vw, 100vw" />
        <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-small font-semibold capitalize text-primary shadow">
          {project.projectStatus}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-h5">{project.title}</h3>
        {project.location && <p className="mt-1 text-small text-text/70">{project.location}</p>}
        {range && <p className="mt-1 text-small text-text/50">{range}</p>}
        <span className="mt-4 text-small font-semibold text-accent group-hover:text-accent-dark">Project Details →</span>
      </div>
    </Link>
  )
}
