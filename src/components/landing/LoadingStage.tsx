'use client'
import { useEffect, useRef, useState } from 'react'
import { useStage } from '@/three/stage'
import { playSfx } from '@/lib/sfx'

export function LoadingStage({
  welcomeLabel,
  commissionLabel,
}: {
  welcomeLabel: string
  commissionLabel: string
}) {
  const { stage, setStage, sceneReady, sceneFailed } = useStage()
  const [timedOut, setTimedOut] = useState(false)
  const button = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), 8000)
    return () => clearTimeout(timer)
  }, [])
  useEffect(() => {
    if (stage === 'loading') button.current?.focus({ preventScroll: true })
  }, [stage])
  if (stage !== 'loading') return null
  const ready = sceneReady || sceneFailed || timedOut
  return (
    <div className="intro-screen" role="dialog" aria-modal="true" aria-label={welcomeLabel}>
      <button
        ref={button}
        type="button"
        disabled={!ready}
        onClick={() => {
          playSfx('stage-reveal')
          setStage('scroll')
          window.scrollTo({ top: 0, behavior: 'instant' })
        }}
        className="button button-accent-outline"
      >
        {commissionLabel}
      </button>
    </div>
  )
}
