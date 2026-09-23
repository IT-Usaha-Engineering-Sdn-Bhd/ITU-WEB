'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'

export function CategoryTabs({ items, active, basePath, paramName, arrows = true }: {
  items: { label: string; value: string }[]
  active: string
  basePath: string
  paramName: string
  arrows?: boolean
}) {
  const hrefFor = (value: string) => `${basePath}?${paramName}=${value}`
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scroller.current?.querySelector<HTMLElement>('[aria-current="true"]')?.scrollIntoView({ block: 'nearest', inline: 'center' })
  }, [active])

  const scrollBy = (dir: 1 | -1) => scroller.current?.scrollBy({ left: dir * 240, behavior: 'smooth' })

  return <div className="category-tabs">
    {arrows && <button type="button" className="icon-button tabs-arrow" onClick={() => scrollBy(-1)} aria-label="Scroll categories left"><CaretLeft size={18} /></button>}
    <div className="tabs-scroller" ref={scroller} role="tablist">
      {items.map((item) => <Link key={item.value} href={hrefFor(item.value)} scroll={false} role="tab"
        aria-current={item.value === active} className="tab-pill" data-active={item.value === active}>{item.label}</Link>)}
    </div>
    {arrows && <button type="button" className="icon-button tabs-arrow" onClick={() => scrollBy(1)} aria-label="Scroll categories right"><CaretRight size={18} /></button>}
  </div>
}
