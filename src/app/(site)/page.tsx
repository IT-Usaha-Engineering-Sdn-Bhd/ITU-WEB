import type { Metadata } from 'next'
import { getLanding, getSettings } from '@/lib/site-content'
import { mediaUrl } from '@/lib/media'
import { pageMetadata } from '@/lib/seo'
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
  const [landing, settings] = await Promise.all([getLanding(), getSettings()])
  return pageMetadata(landing, settings.seoTitle, '/', settings.siteName)
}

export default async function HomePage() {
  const [landing, settings] = await Promise.all([getLanding(), getSettings()])
  const logoUrl = mediaUrl(settings.logo) ?? '/assets/logo.png'

  return (
    <main id="main-content" className="relative">
      <LoadingStage
        welcomeLabel={landing.hero.welcomeLabel}
        commissionLabel={landing.hero.commissionLabel}
      />
      <SnapContainer>
        <Hero
          punchline={landing.hero.punchline}
          exploreLabel={landing.hero.learnMoreLabel}
          logoUrl={logoUrl}
        />
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
