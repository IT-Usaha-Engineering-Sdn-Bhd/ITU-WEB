'use client'
import { useEffect, useId, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CaretDown, ChatCircleDots, List, X } from '@phosphor-icons/react'
import { useStage } from '@/three/stage'
import { SoundToggle } from './SoundToggle'
import { services } from '@/lib/navigation'

function Dropdown({ label, items }: { label: string; items: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const ref = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    const outside = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [open])
  return (
    <div
      ref={ref}
      className="nav-dropdown"
      data-menu-open={open}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          setOpen(false)
          trigger.current?.focus()
        }
      }}
    >
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={id}
      >
        {label}
        <CaretDown size={13} className={open ? 'rotate-180' : ''} />
      </button>
      <div className="dropdown-panel" id={id} hidden={!open}>
        <ul>
          {items.map((item) => (
            <li key={item.href}>
              <Link href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
export function TopNav() {
  const { stage, activeSection } = useStage()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const header = useRef<HTMLElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])
  useEffect(() => {
    if (!mobileOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const query = window.matchMedia('(min-width: 1200px)')
    const resize = () => {
      if (query.matches) setMobileOpen(false)
    }
    query.addEventListener('change', resize)
    return () => {
      document.body.style.overflow = previous
      query.removeEventListener('change', resize)
    }
  }, [mobileOpen])
  // Kept mounted (never returns null) so SnapContainer's `document.querySelector('header')`
  // inset never flaps between the real nav height and its fallback — just faded/inert while
  // on the loading screen or the hero section.
  const hidden =
    pathname === '/' && (stage !== 'scroll' || activeSection === null || activeSection === 'hero')
  return (
    <header
      ref={header}
      className="site-header"
      data-hidden={hidden}
      inert={hidden}
      data-menu-open={mobileOpen}
      onKeyDown={(event) => {
        if (!mobileOpen) return
        if (event.key === 'Escape') {
          setMobileOpen(false)
          toggle.current?.focus()
        }
        if (event.key === 'Tab') {
          const focusable = Array.from(
            header.current?.querySelectorAll<HTMLElement>('a, button') ?? [],
          ).filter((element) => element.getClientRects().length)
          const first = focusable[0],
            last = focusable[focusable.length - 1]
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last.focus()
          }
          if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first.focus()
          }
        }
      }}
    >
      <nav className="nav-shell" aria-label="Main navigation">
        <Link href="/" className="brand" aria-label="IT Usaha Engineering home">
          <span className="brand-mark">
            <Image src="/assets/logo.png" alt="" width={30} height={41} priority />
          </span>
          <span className="brand-name">
            IT USAHA<span>ENGINEERING</span>
          </span>
        </Link>
        <div className="desktop-navigation">
          <Link href="/about-us">About Us</Link>
          <Dropdown label="Our Services" items={services} />
          <Link href="/projects">Projects</Link>
          <Link href="/events">Events</Link>
          <Link href="/career">Career</Link>
        </div>
        <div className="nav-actions">
          <SoundToggle />
          <Link href="/contact-us" className="button button-accent nav-contact">
            Contact Us
            <ChatCircleDots size={18} />
          </Link>
          <button
            ref={toggle}
            type="button"
            className="icon-button menu-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          >
            {mobileOpen ? <X size={23} /> : <List size={23} />}
          </button>
        </div>
      </nav>
      {mobileOpen && (
        <nav
          id="mobile-navigation"
          className="mobile-navigation"
          aria-label="Mobile navigation"
          data-native-scroll
        >
          <Link href="/about-us" onClick={() => setMobileOpen(false)}>
            About Us
          </Link>
          <details>
            <summary>
              Our Services
              <CaretDown size={18} />
            </summary>
            <div>
              {services.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
                  {item.label}
                </Link>
              ))}
            </div>
          </details>
          <Link href="/projects" onClick={() => setMobileOpen(false)}>
            Projects
          </Link>
          <Link href="/events" onClick={() => setMobileOpen(false)}>
            Events
          </Link>
          <Link href="/career" onClick={() => setMobileOpen(false)}>
            Career
          </Link>
          <Link
            href="/contact-us"
            onClick={() => setMobileOpen(false)}
            className="button button-accent"
          >
            Contact Us
            <ChatCircleDots size={20} />
          </Link>
        </nav>
      )}
    </header>
  )
}
