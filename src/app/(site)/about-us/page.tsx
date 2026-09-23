import type { Metadata } from 'next'
import { getAboutUs } from '@/lib/inner-pages'
import { mediaUrl } from '@/lib/media'
import { HeroBanner } from '@/components/inner/HeroBanner'
import { EntryImage } from '@/components/inner/EntryImage'

export async function generateMetadata(): Promise<Metadata> {
  const data = await getAboutUs()
  const image = mediaUrl(data.seo?.ogImage)
  return {
    title: data.seo?.title || 'About Us',
    description: data.seo?.description,
    alternates: { canonical: '/about-us' },
    openGraph: { images: image ? [{ url: image }] : undefined },
  }
}

export default async function AboutPage() {
  const data = await getAboutUs()
  return (
    <main id="main-content" className="inner-page">
      <section className="section-shell inner-hero">
        <p className="eyebrow">About IT Usaha</p>
        <h1 className="section-heading">
          {data.headline.split(data.highlight)[0]}
          <span className="text-accent">{data.highlight}</span>
        </h1>
      </section>
      <HeroBanner image={data.heroImage} label="About Us" />
      <section className="section-shell about-background">
        <h2 className="section-heading">{data.backgroundHeading}</h2>
        <div className="section-body">
          {data.background.split(/\n\s*\n/).map((paragraph, i) => (
            <p key={i}>{paragraph.trim()}</p>
          ))}
        </div>
      </section>
      <section className="about-principles">
        <div className="section-shell about-principles-grid">
          <article>
            <p className="eyebrow">01 / Vision</p>
            <h2>Our Vision</h2>
            <p>{data.vision}</p>
          </article>
          <article>
            <p className="eyebrow">02 / Mission</p>
            <h2>Our Mission</h2>
            <p>{data.mission}</p>
          </article>
        </div>
      </section>
      <section className="section-shell about-section">
        <div className="section-intro centered">
          <p className="eyebrow">People</p>
          <h2 className="section-heading">{data.leadershipHeading}</h2>
          <p className="section-body">{data.leadershipIntro}</p>
        </div>
        <div className="leader-grid">
          {data.leaders?.map((leader, i) => (
            <article className="leader-card" key={leader.name}>
              <span className="eyebrow">{String(i + 1).padStart(2, '0')}</span>
              <EntryImage image={leader.portrait} label={leader.name} kind="portrait" />
              <h3>{leader.name}</h3>
              <p className="leader-role">{leader.role}</p>
              <p className="section-body">{leader.bio}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section-shell about-section">
        <div className="section-intro centered">
          <p className="eyebrow">Our journey</p>
          <h2 className="section-heading">{data.milestonesHeading}</h2>
          <p className="section-body">{data.milestonesIntro}</p>
        </div>
        <ol className="milestone-list">
          {data.milestones?.map((item, i) => (
            <li key={`${item.year}-${i}`}>
              <article className="milestone-card">
                <span className="milestone-year">{item.year}</span>
                <p>{item.body}</p>
                <EntryImage image={item.image} label={item.year} kind="milestone" />
              </article>
            </li>
          ))}
        </ol>
      </section>
    </main>
  )
}
