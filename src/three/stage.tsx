'use client'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'

export type Stage = 'loading' | 'scroll'
type StageContextValue = {
  stage: Stage
  activeSection: string | null
  setStage: (stage: Stage) => void
  setActiveSection: (id: string | null) => void
  sceneReady: boolean
  setSceneReady: (ready: boolean) => void
  sceneFailed: boolean
  setSceneFailed: (failed: boolean) => void
}
const StageContext = createContext<StageContextValue | null>(null)
const SEEN_INTRO_KEY = 'itu:seen-intro'

export function StageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [intro, setIntro] = useState<Stage>('loading')
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [sceneReady, setSceneReady] = useState(false)
  const [sceneFailed, setSceneFailed] = useState(false)
  const stage = pathname === '/' ? intro : 'scroll'
  useEffect(() => {
    if (pathname !== '/') return
    try {
      if (window.location.hash || sessionStorage.getItem(SEEN_INTRO_KEY) === '1') setIntro('scroll')
    } catch {
      if (window.location.hash) setIntro('scroll')
    }
  }, [pathname])
  useEffect(() => {
    document.body.classList.toggle('scroll-locked', stage !== 'scroll')
    return () => document.body.classList.remove('scroll-locked')
  }, [stage])
  const setStage = useCallback((next: Stage) => {
    setSceneReady(false)
    setIntro(next)
    if (next === 'scroll') {
      try {
        sessionStorage.setItem(SEEN_INTRO_KEY, '1')
      } catch {
        /* Optional storage. */
      }
    }
  }, [])
  const value = useMemo(
    () => ({
      stage,
      activeSection,
      setStage,
      setActiveSection,
      sceneReady,
      setSceneReady,
      sceneFailed,
      setSceneFailed,
    }),
    [stage, activeSection, setStage, sceneReady, sceneFailed],
  )
  return <StageContext.Provider value={value}>{children}</StageContext.Provider>
}
export function useStage() {
  const context = useContext(StageContext)
  if (!context) throw new Error('useStage must be used within StageProvider')
  return context
}
