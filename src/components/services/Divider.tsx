import { Reveal } from '@/components/Reveal'

// Centered section break used between the High Tension page's service groups.
export function Divider({ heading, body }: { heading: string; body: string }) {
  return (
    <Reveal className="service-divider">
      <h2 className="section-heading">{heading}</h2>
      <p className="section-body">{body}</p>
    </Reveal>
  )
}
