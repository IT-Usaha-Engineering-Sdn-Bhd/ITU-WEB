import type { ContentBlockData } from '@/blocks/types'
import { Container } from '@/components/ui/Container'
import { RichText } from '@/components/ui/RichText'
import { Placeholder } from '@/components/ui/Placeholder'
import { LinkButton } from '@/components/ui/Button'
import { SectionHeading } from '@/components/ui/SectionHeading'

const columnsClass: Record<string, string> = {
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
  '4': 'sm:grid-cols-2 lg:grid-cols-4',
}

export function BlockRenderer({ blocks }: { blocks?: ContentBlockData[] | null }) {
  if (!blocks || blocks.length === 0) return null

  return (
    <>
      {blocks.map((block) => {
        switch (block.blockType) {
          case 'richText':
            return (
              <section key={block.id} className="py-16">
                <Container className="max-w-3xl">
                  <RichText data={block.content} />
                </Container>
              </section>
            )

          case 'featureCards':
            return (
              <section key={block.id} className="py-16">
                <Container>
                  {block.heading && <SectionHeading heading={block.heading} intro={block.intro ?? undefined} align="center" />}
                  <div className={`grid gap-6 ${columnsClass[block.columns ?? '3']}`}>
                    {(block.cards ?? []).map((c, i) => (
                      <div key={c.id ?? i} className="rounded-lg border border-surface-alt p-6">
                        {c.icon && <div className="mb-3 h-10 w-10 rounded-full bg-accent/10" aria-hidden />}
                        <h3 className="text-h5">{c.title}</h3>
                        {c.body && <p className="mt-2 text-small text-text/70">{c.body}</p>}
                        {c.link && (
                          <a href={c.link} className="mt-3 inline-block text-small font-semibold text-accent">
                            Learn more →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </Container>
              </section>
            )

          case 'stats':
            return (
              <section key={block.id} className="bg-primary py-14 text-white">
                <Container>
                  <div className="grid gap-8 sm:grid-cols-3 lg:grid-cols-4">
                    {(block.stats ?? []).map((s, i) => (
                      <div key={s.id ?? i} className="text-center">
                        <p className="text-h2 text-white">
                          {s.value}
                          {s.suffix}
                        </p>
                        <p className="mt-1 text-small text-white/70">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </Container>
              </section>
            )

          case 'imageText':
            return (
              <section key={block.id} className="py-16">
                <Container>
                  <div className={`grid items-center gap-10 lg:grid-cols-2 ${block.imagePosition === 'right' ? '' : ''}`}>
                    <div className={block.imagePosition === 'right' ? 'lg:order-2' : ''}>
                      <Placeholder media={block.image} label={block.heading ?? 'Image'} ratio="4/3" sizes="(min-width: 1024px) 50vw, 100vw" />
                    </div>
                    <div>
                      {block.heading && <h2>{block.heading}</h2>}
                      <div className="mt-4">
                        <RichText data={block.content} />
                      </div>
                    </div>
                  </div>
                </Container>
              </section>
            )

          case 'bulletList':
            return (
              <section key={block.id} className="py-16">
                <Container className="max-w-3xl">
                  {block.heading && <h2 className="mb-6">{block.heading}</h2>}
                  <ul className="flex flex-col gap-3">
                    {(block.items ?? []).map((item, i) => (
                      <li key={item.id ?? i} className="flex gap-3 text-body">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </Container>
              </section>
            )

          case 'equipmentGrid':
            return (
              <section key={block.id} className="bg-surface py-16">
                <Container>
                  {block.heading && <SectionHeading heading={block.heading} intro={block.intro ?? undefined} align="center" />}
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {(block.equipment ?? []).map((e, i) => (
                      <div key={e.id ?? i} className="overflow-hidden rounded-lg border border-surface-alt bg-white">
                        <Placeholder media={e.image} label={e.name} ratio="4/3" sizes="(min-width: 1024px) 33vw, 100vw" />
                        <div className="p-4">
                          <p className="font-semibold text-primary">{e.name}</p>
                          {typeof e.unitCount === 'number' && <p className="text-small text-text/60">{e.unitCount} units</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </Container>
              </section>
            )

          case 'whyChooseUs':
            return (
              <section key={block.id} className="py-16">
                <Container>
                  <SectionHeading heading={block.heading ?? 'Why Choose Us'} align="center" />
                  <div className="grid gap-6 sm:grid-cols-2">
                    {(block.reasons ?? []).map((r, i) => (
                      <div key={r.id ?? i} className="rounded-lg border border-surface-alt p-6">
                        <h3 className="text-h5">{r.title}</h3>
                        {r.body && <p className="mt-2 text-small text-text/70">{r.body}</p>}
                      </div>
                    ))}
                  </div>
                </Container>
              </section>
            )

          case 'cta':
            return (
              <section key={block.id} className="bg-primary py-16 text-white">
                <Container className="flex flex-col items-center gap-6 text-center">
                  <h2 className="max-w-2xl text-white">{block.heading}</h2>
                  {block.body && <p className="max-w-xl text-lead text-white/80">{block.body}</p>}
                  <LinkButton href={block.buttonHref ?? '/contact-us/'}>{block.buttonLabel ?? 'Contact Us'}</LinkButton>
                </Container>
              </section>
            )

          default:
            return null
        }
      })}
    </>
  )
}
