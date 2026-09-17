import { Placeholder } from '@/components/ui/Placeholder'
import type { Milestone } from '@/payload-types'

export function Timeline({ milestones }: { milestones: Milestone[] }) {
  return (
    <ol className="relative flex flex-col gap-10 border-l border-surface-alt pl-8">
      {milestones.map((m) => (
        <li key={m.id} className="relative">
          <span className="absolute -left-[calc(2rem+5px)] top-1 h-3 w-3 rounded-full bg-accent" aria-hidden />
          <p className="text-small font-semibold uppercase tracking-wide text-accent">{m.year}</p>
          <h3 className="mt-1 text-h5">{m.title}</h3>
          {m.description && <p className="mt-2 max-w-2xl text-small text-text/70">{m.description}</p>}
          {m.image && <Placeholder media={m.image} label={m.title} ratio="16/9" className="mt-4 max-w-md rounded-lg" sizes="400px" />}
        </li>
      ))}
    </ol>
  )
}
