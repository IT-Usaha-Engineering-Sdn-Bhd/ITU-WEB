export function SectionHeading({
  eyebrow,
  heading,
  intro,
  align = 'left',
}: {
  eyebrow?: string
  heading: string
  intro?: string
  align?: 'left' | 'center'
}) {
  return (
    <div className={`mb-10 max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      {eyebrow && <p className="mb-2 text-small font-semibold uppercase tracking-wide text-accent">{eyebrow}</p>}
      <h2>{heading}</h2>
      {intro && <p className="mt-4 text-lead text-text/80">{intro}</p>}
    </div>
  )
}
