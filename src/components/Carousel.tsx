'use client'
import { useEffect, useId, useState } from 'react'
import { CaretLeft, CaretRight, Pause, Play } from '@phosphor-icons/react'
import { useReducedMotion } from '@/lib/use-reduced-motion'

export function Carousel<T>({ items, renderItem, ariaLabel }: {
  items: T[]; renderItem: (item: T, index: number) => React.ReactNode; ariaLabel: string
}) {
  const [index, setIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [stopped, setStopped] = useState(false)
  const reduced = useReducedMotion()
  const id = useId()
  const current = items.length ? index % items.length : 0
  const paused = hovered || focused || stopped || reduced
  useEffect(() => {
    if (items.length < 2 || paused) return
    const timer = setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % items.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [items.length, paused])
  const go = (delta: number) => {
    setIndex((current + delta + items.length) % items.length)
  }
  if (!items.length) return <p className="empty-note">Content will be added soon.</p>
  return (
    <div role="region" aria-roledescription="carousel" aria-label={ariaLabel} className="carousel"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}>
      <div id={id} className="carousel-slides" aria-live={paused ? 'polite' : 'off'}>
        {items.map((item, i) => (
          <div key={i} hidden={i !== current} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${items.length}`} className="carousel-slide">
            {renderItem(item, i)}
          </div>
        ))}
      </div>
      {items.length > 1 && <div className="carousel-controls">
        <span className="carousel-position"><span>{String(current + 1).padStart(2, '0')}</span> / {String(items.length).padStart(2, '0')}</span>
        <div className="carousel-track" aria-hidden="true">{items.map((_, i) => <span key={i} className={i === current ? 'is-active' : ''} />)}</div>
        <div className="flex gap-2">
          <button type="button" className="icon-button" onClick={() => setStopped(!stopped)} aria-label={stopped || reduced ? 'Start automatic slides' : 'Pause automatic slides'} disabled={reduced}>{stopped || reduced ? <Play size={17} /> : <Pause size={17} />}</button>
          <button type="button" className="icon-button" onClick={() => go(-1)} aria-label={`Previous ${ariaLabel.toLowerCase()} slide`} aria-controls={id}><CaretLeft size={20} /></button>
          <button type="button" className="icon-button" onClick={() => go(1)} aria-label={`Next ${ariaLabel.toLowerCase()} slide`} aria-controls={id}><CaretRight size={20} /></button>
        </div>
      </div>}
    </div>
  )
}
