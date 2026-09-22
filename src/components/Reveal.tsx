'use client'

import { useEffect, useRef } from 'react'
import { animate } from 'animejs'

// Proof-of-wiring for anime.js — fades and lifts children in on mount.
export function Reveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    animate(ref.current, {
      opacity: [0, 1],
      translateY: [16, 0],
      duration: 800,
      easing: 'easeOutQuad',
    })
  }, [])

  return (
    <div ref={ref} className="relative z-10 px-4">
      {children}
    </div>
  )
}
