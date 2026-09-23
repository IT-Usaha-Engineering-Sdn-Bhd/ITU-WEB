'use client'
import { useEffect, useRef } from 'react'
import { animate } from 'animejs'
import { useReducedMotion } from '@/lib/use-reduced-motion'

export function Counter({
  value,
  suffix = '',
  className,
}: {
  value: number
  suffix?: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    let animation: ReturnType<typeof animate> | undefined
    const final = value.toLocaleString('en-MY')
    const progress = { n: 0 }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        animation = animate(progress, {
          n: 1,
          duration: 1250,
          ease: 'outQuad',
          onUpdate: () => {
            const resolved = Math.floor(progress.n * final.length)
            el.textContent = final
              .split('')
              .map((char, i) =>
                i < resolved || !/\d/.test(char) ? char : String(Math.floor(Math.random() * 10)),
              )
              .join('')
          },
          onComplete: () => {
            el.textContent = final
          },
        })
        observer.disconnect()
      },
      { threshold: 0.7 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      animation?.pause()
      el.textContent = final
    }
  }, [value, reduced])
  return (
    <span className={className}>
      <span className="sr-only">
        {value.toLocaleString('en-MY')}
        {suffix}
      </span>
      <span aria-hidden="true">
        <span ref={ref}>{value.toLocaleString('en-MY')}</span>
        {suffix}
      </span>
    </span>
  )
}
