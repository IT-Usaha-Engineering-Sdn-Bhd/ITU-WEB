import { Placeholder } from '@/components/ui/Placeholder'
import type { Media } from '@/payload-types'

export function LeadershipCard({
  name,
  role,
  bio,
  portrait,
}: {
  name: string
  role?: string | null
  bio?: string | null
  portrait?: Media | number | null
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <Placeholder media={portrait} label={name} ratio="1/1" className="w-40 rounded-full" sizes="160px" />
      <p className="mt-4 text-h5">{name}</p>
      {role && <p className="text-small font-semibold text-accent">{role}</p>}
      {bio && <p className="mt-2 max-w-xs text-small text-text/70">{bio}</p>}
    </div>
  )
}
