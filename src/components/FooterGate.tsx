'use client'
import { useStage } from '@/three/stage'
export function FooterGate({ children }: { children: React.ReactNode }) {
  const { stage } = useStage()
  return (
    <div
      inert={stage !== 'scroll'}
      aria-hidden={stage !== 'scroll'}
      className={stage !== 'scroll' ? 'footer-gate intro-hidden' : 'footer-gate'}
    >
      {children}
    </div>
  )
}
