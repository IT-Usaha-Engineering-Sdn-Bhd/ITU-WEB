'use client'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { useStage } from '@/three/stage'
import { commissionSound } from '@/lib/sfx'

export function LoadingStage({
  welcomeLabel,
  commissionLabel,
}: {
  welcomeLabel: string
  commissionLabel: string
}) {
  const { stage, setStage, sceneReady, sceneFailed, allow3D, enable3D } = useStage()
  const button = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (stage === 'loading') button.current?.focus({ preventScroll: true })
  }, [stage])
  if (stage !== 'loading') return null
  return (
    <div
      className="intro-screen"
      role="dialog"
      aria-modal="true"
      aria-label={welcomeLabel}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return
        const buttons = Array.from(event.currentTarget.querySelectorAll('button'))
        const first = buttons[0],
          last = buttons[buttons.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        }
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }}
    >
      <div id="rack-viewport" className="rack-viewport" aria-hidden="true" />
      {(!sceneReady || sceneFailed || !allow3D) && (
        <Image src="/assets/logo.png" alt="" width={100} height={138} className="rack-fallback" />
      )}
      <button
        ref={button}
        type="button"
        className="button button-accent-outline"
        onClick={() => {
          commissionSound()
          setStage('scroll')
          document.body.classList.remove('scroll-locked')
          window.scrollTo({ top: 0, behavior: 'instant' })
          requestAnimationFrame(() =>
            document.getElementById('hero-heading')?.focus({ preventScroll: true }),
          )
        }}
      >
        {commissionLabel}
      </button>
      {(!allow3D || sceneFailed) && (
        <button type="button" className="button button-outline" onClick={enable3D}>
          {sceneFailed ? 'Retry 3D' : 'Load 3D'}
        </button>
      )}
    </div>
  )
}
