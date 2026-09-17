import type { Metadata } from 'next'
import { getJobPositions } from '@/lib/queries'
import { Hero } from '@/components/layout/Hero'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ApplicationForm } from '@/components/forms/ApplicationForm'

export const metadata: Metadata = { title: 'Careers' }

export default async function CareerPage() {
  const positions = await getJobPositions()

  return (
    <>
      <Hero headline="Careers at IT Usaha Engineering" compact />

      <section className="py-16">
        <Container>
          <SectionHeading heading="Available Positions" align="center" />
          {positions.length === 0 ? (
            <p className="text-center text-text/60">No open positions right now — check back soon.</p>
          ) : (
            <div className="mx-auto flex max-w-3xl flex-col gap-4">
              {positions.map((p) => (
                <details key={p.id} className="group rounded-lg border border-surface-alt p-6">
                  <summary className="flex cursor-pointer items-center justify-between text-h5">
                    <span>
                      {p.title}
                      {p.location && <span className="ml-2 text-small font-normal text-text/60">{p.location}</span>}
                    </span>
                    <span className="text-accent group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <div className="mt-4 flex flex-col gap-4 text-small text-text/80">
                    {p.department && <p>Department: {p.department}</p>}
                    {p.employmentType && <p className="capitalize">Employment type: {p.employmentType}</p>}
                    {(p.responsibilities?.length ?? 0) > 0 && (
                      <div>
                        <p className="font-semibold text-primary">Responsibilities</p>
                        <ul className="mt-2 list-disc pl-5">
                          {p.responsibilities!.map((r, i) => (
                            <li key={i}>{r.text}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {(p.requirements?.length ?? 0) > 0 && (
                      <div>
                        <p className="font-semibold text-primary">Requirements</p>
                        <ul className="mt-2 list-disc pl-5">
                          {p.requirements!.map((r, i) => (
                            <li key={i}>{r.text}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </details>
              ))}
            </div>
          )}
        </Container>
      </section>

      <section className="bg-surface py-16">
        <Container className="max-w-2xl">
          <SectionHeading heading="Apply Now" align="center" />
          <ApplicationForm positions={positions} />
        </Container>
      </section>
    </>
  )
}
