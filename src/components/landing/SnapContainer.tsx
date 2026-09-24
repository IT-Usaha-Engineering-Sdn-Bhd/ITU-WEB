'use client'
import { useEffect, useRef } from 'react'
import { useStage } from '@/three/stage'
import { playSfx } from '@/lib/sfx'

export function SnapContainer({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const { stage, setActiveSection } = useStage()
  useEffect(() => {
    const root = ref.current
    if (!root || stage !== 'scroll') return
    const sections = Array.from(root.querySelectorAll<HTMLElement>('[data-section]'))
    let active: string | null = null
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-section')
            if (id !== active) {
              active = id
              setActiveSection(id)
              playSfx('section-snap')
            }
          }
        }
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 },
    )
    sections.forEach((section) => observer.observe(section))
    return () => {
      observer.disconnect()
      setActiveSection(null)
    }
  }, [stage, setActiveSection])
  return (
    <div
      ref={ref}
      inert={stage !== 'scroll'}
      aria-hidden={stage !== 'scroll'}
      className={stage !== 'scroll' ? 'landing-content landing-content--intro' : 'landing-content'}
    >
      {children}
    </div>
  )
}
