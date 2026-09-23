'use client'
import { useEffect, useRef } from 'react'
import { useStage } from '@/three/stage'
import { playSfx } from '@/lib/sfx'
import { sectionDestination } from '@/lib/section-scroll'

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
    const hardLockUntil = performance.now() + 650
    let snappedAt = 0
    let lastWheel = 0
    const onWheel = (event: WheelEvent) => {
      if (
        !window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches ||
        event.ctrlKey ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
      )
        return
      if (document.querySelector('[data-menu-open="true"]')) return
      if (
        (event.target as Element).closest(
          'input, textarea, select, [role="dialog"], [data-native-scroll]',
        )
      )
        return
      const now = performance.now()
      const momentum = now - lastWheel < 180
      lastWheel = now
      // A settling window after each snap, not an open-ended lock — otherwise a sustained
      // (non-flicked) scroll keeps re-arming momentum forever and one direction goes dead.
      if (now < hardLockUntil || (snappedAt && now - snappedAt < 1200 && momentum)) {
        event.preventDefault()
        return
      }
      if (Math.abs(event.deltaY) < 4) return
      const inset = document.querySelector('header')?.getBoundingClientRect().height ?? 80
      const destination = sectionDestination(
        sections.map((section) => section.getBoundingClientRect()),
        event.deltaY,
        window.innerHeight,
        inset,
      )
      if (destination === null) return
      event.preventDefault()
      snappedAt = now
      window.scrollBy({
        top: destination,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
      })
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      observer.disconnect()
      window.removeEventListener('wheel', onWheel)
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
