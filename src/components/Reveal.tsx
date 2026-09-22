'use client'
import { useEffect, useRef } from 'react'
import { animate } from 'animejs'
import { useReducedMotion } from '@/lib/use-reduced-motion'

export function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    let animation: ReturnType<typeof animate> | undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      animation = animate(el, { opacity: [0, 1], translateY: [24, 0], duration: 750, ease: 'outCubic' })
      observer.disconnect()
    }, { threshold: 0.12 })
    observer.observe(el)
    return () => { observer.disconnect(); animation?.revert() }
  }, [reduced])
  return <div ref={ref} className={className}>{children}</div>
}
