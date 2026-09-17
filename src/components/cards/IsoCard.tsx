import { Placeholder } from '@/components/ui/Placeholder'
import type { Media } from '@/payload-types'

export function IsoCard({ code, name, badge }: { code: string; name: string; badge?: Media | number | null }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-surface-alt p-6 text-center">
      <Placeholder media={badge} label={code} ratio="1/1" className="w-20 rounded-full" sizes="80px" />
      <p className="font-semibold text-primary">{code}</p>
      <p className="text-small text-text/70">{name}</p>
    </div>
  )
}
