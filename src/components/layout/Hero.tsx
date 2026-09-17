import type { ReactNode } from 'react'
import { Placeholder } from '@/components/ui/Placeholder'
import type { Media } from '@/payload-types'

export function Hero({
  headline,
  backgroundImage,
  children,
  compact = false,
}: {
  headline: string
  backgroundImage?: Media | number | null
  children?: ReactNode
  compact?: boolean
}) {
  return (
    <section className={`relative flex items-end overflow-hidden bg-primary text-white ${compact ? 'min-h-[35vh]' : 'min-h-[70vh]'}`}>

      <div className="absolute inset-0">
        <Placeholder media={backgroundImage} label="Hero background" ratio="16/9" className="h-full w-full" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/20" />
      </div>
      <div className={`site-container relative ${compact ? 'py-10' : 'py-16'}`}>
        <h1 className="max-w-3xl text-white">{headline}</h1>
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  )
}
