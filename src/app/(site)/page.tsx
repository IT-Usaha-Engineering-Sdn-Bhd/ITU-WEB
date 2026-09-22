import type { Metadata } from 'next'
import { getLanding } from '@/lib/site-content'
import { mediaUrl } from '@/lib/media'
import { LoadingStage } from '@/components/landing/LoadingStage'
import { Hero } from '@/components/landing/Hero'
import { SnapContainer } from '@/components/landing/SnapContainer'
import { WhoWeAre } from '@/components/landing/WhoWeAre'
import { Facts } from '@/components/landing/Facts'
import { Services } from '@/components/landing/Services'
import { WhyUs } from '@/components/landing/WhyUs'
import { Certifications } from '@/components/landing/Certifications'
import { Clients } from '@/components/landing/Clients'
import { Projects } from '@/components/landing/Projects'
import { CtaBand } from '@/components/landing/CtaBand'

export async function generateMetadata(): Promise<Metadata> {
  const landing = await getLanding()
  const ogImage = mediaUrl(landing.seo?.ogImage)

  return {
    title: landing.seo?.title || undefined,
    description: landing.seo?.description || undefined,
    alternates: { canonical: '/' },
    openGraph: {
      title: landing.seo?.title || undefined,
      description: landing.seo?.description || undefined,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  }
}

export default async function HomePage() {
  const landing = await getLanding()

  return (
    <main id="main-content" className="relative">
      <LoadingStage />
      <SnapContainer>
        <Hero punchline={landing.hero.punchline} />
        <WhoWeAre data={landing.whoWeAre} />
        <Facts data={landing.facts} />
        <Services data={landing.services} />
        <WhyUs data={landing.whyUs} />
        <Certifications data={landing.certs} />
        <Clients data={landing.clients} />
        <Projects data={landing.projects} />
        <CtaBand data={landing.ctaBand} />
      </SnapContainer>
    </main>
  )
}
