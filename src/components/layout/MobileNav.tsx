'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { HeaderNavigation } from '@/payload-types'

type NavItem = NonNullable<HeaderNavigation['items']>[number]

export function MobileNav({ items, ctaLabel, ctaHref }: { items: NavItem[]; ctaLabel?: string | null; ctaHref?: string | null }) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>('a, button')
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    panelRef.current?.querySelector<HTMLElement>('a, button')?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
      >
        <span className={`block h-0.5 w-6 bg-primary transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
        <span className={`block h-0.5 w-6 bg-primary transition-opacity ${open ? 'opacity-0' : ''}`} />
        <span className={`block h-0.5 w-6 bg-primary transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
      </button>

      {open && (
        <div
          id="mobile-nav-panel"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-x-0 top-[var(--header-h,64px)] bottom-0 z-40 overflow-y-auto bg-white p-6"
        >
          <nav className="flex flex-col gap-4">
            {items.map((item) => (
              <div key={item.id ?? item.href}>
                <Link href={item.href} className="text-h5 font-semibold text-primary" onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
                {item.children && item.children.length > 0 && (
                  <div className="mt-2 flex flex-col gap-2 pl-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.id ?? child.href}
                        href={child.href}
                        className="text-body text-text/80"
                        onClick={() => setOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {ctaHref && (
              <Link
                href={ctaHref}
                onClick={() => setOpen(false)}
                className="mt-4 inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-center text-small font-semibold text-white"
              >
                {ctaLabel}
              </Link>
            )}
          </nav>
        </div>
      )}
    </div>
  )
}
