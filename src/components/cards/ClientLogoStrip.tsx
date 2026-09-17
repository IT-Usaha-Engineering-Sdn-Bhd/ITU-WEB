import { Placeholder } from '@/components/ui/Placeholder'
import type { Media } from '@/payload-types'

export function ClientLogoStrip({ logos }: { logos: { name: string; logo?: Media | number | null; id?: string | null }[] }) {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-8">
      {logos.map((l) => (
        <Placeholder key={l.id ?? l.name} media={l.logo} label={l.name} ratio="2/1" sizes="120px" className="grayscale transition-all hover:grayscale-0" />
      ))}
    </div>
  )
}
