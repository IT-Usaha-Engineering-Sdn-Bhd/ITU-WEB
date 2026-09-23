import type { Icon } from '@phosphor-icons/react'

export type GridItem = { title: string; body?: string | null }

// Bullet list ("Icons point forms" in the templates) or a card grid (the PMC/FM/DFMA "grid
// card with icons" sections) — same icon-cycling pattern as the landing page's WhyUs/Services
// sections (icons[index % icons.length]), so items an editor adds still get an icon.
export function IconList({
  items,
  icons,
  variant = 'bullet',
  compact,
}: {
  items: GridItem[]
  icons: Icon[]
  variant?: 'bullet' | 'grid'
  compact?: boolean
}) {
  if (variant === 'grid')
    return (
      <ul className={`service-grid${compact ? ' service-grid--compact' : ''}`}>
        {items.map((item, i) => {
          const IconComponent = icons[i % icons.length]
          return (
            <li key={item.title}>
              <IconComponent size={32} weight="light" aria-hidden="true" />
              <h3>{item.title}</h3>
              {item.body && <p>{item.body}</p>}
            </li>
          )
        })}
      </ul>
    )

  return (
    <ul className="service-icon-list">
      {items.map((item, i) => {
        const IconComponent = icons[i % icons.length]
        return (
          <li key={item.title}>
            <IconComponent size={22} weight="light" aria-hidden="true" />
            <span>{item.title}</span>
          </li>
        )
      })}
    </ul>
  )
}
