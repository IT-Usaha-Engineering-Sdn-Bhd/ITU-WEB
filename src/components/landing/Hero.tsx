'use client'
import Image from 'next/image'
import { ArrowDown } from '@phosphor-icons/react'
import { useStage } from '@/three/stage'
import { SoundToggle } from '@/components/SoundToggle'

export function Hero({
  punchline,
  exploreLabel,
  logoUrl,
}: {
  punchline: string
  exploreLabel: string
  logoUrl: string
}) {
  const { sceneFailed, sceneReady, allow3D, enable3D } = useStage()
  const scrollToWhoWeAre = () =>
    document.getElementById('who-we-are')?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    })
  return (
    <section id="hero" data-section="hero" aria-labelledby="hero-heading" className="hero-section">
      <div id="hero-viewport" className="absolute inset-0" aria-hidden="true" />
      {(sceneFailed || !sceneReady) && (
        <div className="logo-poster" aria-hidden="true">
          <Image src={logoUrl} alt="" width={100} height={138} />
        </div>
      )}
      <div className="hero-top">
        <SoundToggle label />
        {(!allow3D || sceneFailed) && (
          <button type="button" className="text-button" onClick={enable3D}>
            {sceneFailed ? 'Retry 3D' : 'Load 3D'}
          </button>
        )}
      </div>
      <div className="punchline-copy">
        <h1 id="hero-heading" tabIndex={-1} className="punchline-heading">
          {punchline}
        </h1>
        <button type="button" className="text-button" onClick={scrollToWhoWeAre}>
          {exploreLabel} <ArrowDown size={20} />
        </button>
      </div>
    </section>
  )
}
