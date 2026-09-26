'use client'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useStage } from './stage'
import { modelRegistry, type ModelId } from './model-registry'
import { devicePolicy } from './model-policy'
import { registerViewer, removeViewer, useViewer } from './viewer-store'

const Renderer = dynamic(() => import('./GlobalCanvas').then((module) => module.GlobalCanvas), {
  ssr: false,
})
export function Scene() {
  const pathname = usePathname()
  const { stage, allow3D, sceneFailed, setSceneReady, setSceneFailed } = useStage()
  const active = useViewer()
  useEffect(() => {
    if (pathname !== '/') return
    const targets: [string, ModelId][] =
      stage === 'loading'
        ? [['rack-viewport', 'server-rack']]
        : [
            ['hero-viewport', 'company-logo'],
            ['projects-viewport', 'data-centre'],
          ]
    const cleanups = targets.map(([key, id]) => {
      const host = document.getElementById(key)
      if (!host) return () => {}
      const quality = devicePolicy()
      const model = modelRegistry[id]
      let ratio = stage === 'loading' ? 2 : 0
      let near = stage === 'loading'
      const publish = () =>
        registerViewer({
          key,
          id,
          host,
          state: model.defaultState,
          url:
            (window.innerWidth < 768 || quality === 'constrained') && model.mobileUrl
              ? model.mobileUrl
              : model.url,
          near,
          ratio,
          enabled: allow3D && !sceneFailed,
          quality,
          rotation: 0,
          reset: 0,
          drag: false,
          parallax: key === 'projects-viewport',
          ready: () => setSceneReady(true),
          failed: () => setSceneFailed(true),
        })
      const proximity = new IntersectionObserver(
        ([entry]) => {
          near = entry.isIntersecting
          publish()
        },
        { rootMargin: '300px' },
      )
      const visibility = new IntersectionObserver(
        ([entry]) => {
          ratio = stage === 'loading' ? 2 : entry.intersectionRatio
          publish()
        },
        { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
      )
      proximity.observe(host)
      visibility.observe(host)
      publish()
      return () => {
        proximity.disconnect()
        visibility.disconnect()
        removeViewer(key)
      }
    })
    return () => cleanups.forEach((cleanup) => cleanup())
  }, [pathname, stage, allow3D, sceneFailed, setSceneReady, setSceneFailed])
  const eligible = pathname === '/' || pathname.startsWith('/services/')
  return eligible && active ? <Renderer /> : null
}
