import Link from 'next/link'
import { getHeaderNavigation, getSiteSettings } from '@/lib/queries'
import { Placeholder } from '@/components/ui/Placeholder'
import { MobileNav } from './MobileNav'

export async function SiteHeader() {
  const [nav, settings] = await Promise.all([getHeaderNavigation(), getSiteSettings()])
  const items = nav?.items ?? []

  return (
    <header className="sticky top-0 z-50 border-b border-surface-alt bg-white/95 backdrop-blur">
      <div className="site-container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label={settings?.siteName ?? 'IT Usaha Engineering'}>
          <Placeholder media={settings?.logo} label="Logo" ratio="3/1" className="h-10 w-32" sizes="128px" priority />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {items.map((item) => (
            <div key={item.id ?? item.href} className="group relative">
              <Link href={item.href} className="text-small font-semibold text-primary hover:text-accent">
                {item.label}
              </Link>
              {item.children && item.children.length > 0 && (
                <div className="invisible absolute left-0 top-full min-w-[260px] rounded-md border border-surface-alt bg-white py-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  {item.children.map((child) => (
                    <Link
                      key={child.id ?? child.href}
                      href={child.href}
                      className="block px-4 py-2 text-small text-text hover:bg-surface hover:text-accent"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden lg:block">
          {nav?.ctaHref && (
            <Link
              href={nav.ctaHref}
              className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-2.5 text-small font-semibold text-white hover:bg-accent-dark"
            >
              {nav.ctaLabel}
            </Link>
          )}
        </div>

        <MobileNav items={items} ctaLabel={nav?.ctaLabel} ctaHref={nav?.ctaHref} />
      </div>
    </header>
  )
}
