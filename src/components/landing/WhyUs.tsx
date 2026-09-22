import Image from 'next/image'
import { Medal, UsersThree, Bank, Handshake, Headset, Package, ShieldCheck, Leaf } from '@phosphor-icons/react/dist/ssr'
import { Reveal } from '@/components/Reveal'
import { mediaAlt, mediaUrl } from '@/lib/media'
import type { Landing } from '@/payload-types'

const icons = [Medal, UsersThree, Bank, Handshake, Headset, Package, ShieldCheck, Leaf]
export function WhyUs({ data }: { data: Landing['whyUs'] }) {
  return <section id="why-us" data-section="why-us" className="landing-section why-section">
    <div className="section-shell"><Reveal className="section-intro centered"><p className="eyebrow">Confidence at every stage</p><h2 className="section-heading">{data.header}</h2></Reveal>
      <div className="why-grid">{(data.cards ?? []).map((card, index) => {
        const url = mediaUrl(card.icon)
        const Icon = icons[index % icons.length]
        return <Reveal key={card.id ?? card.title} className="why-card"><div className="why-icon">{url ? <Image src={url} alt={mediaAlt(card.icon, '')} width={38} height={38} className="object-contain" /> : <Icon size={38} weight="light" aria-hidden="true" />}</div><h3>{card.title}</h3><p>{card.body}</p></Reveal>
      })}</div>
    </div>
  </section>
}
