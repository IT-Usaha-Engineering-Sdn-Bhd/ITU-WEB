'use client'
import { Component, Suspense, useEffect, useLayoutEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { Canvas, useThree } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import { usePathname } from 'next/navigation'
import { useStage } from './stage'
import { useReducedMotion } from '@/lib/use-reduced-motion'
import { ServerRackLine } from './scenes/ServerRackLine'
import { CompanyLogo } from './scenes/CompanyLogo'
import { DataCentreScene } from './scenes/DataCentreScene'
import { ProjectsBackdrop } from './scenes/ProjectsBackdrop'

type Viewport = 'hero' | 'building' | 'projects'
const VIEWPORT_IDS: Record<Viewport, string> = {
  hero: 'hero-viewport',
  building: 'building-viewport',
  projects: 'projects-viewport',
}

class SceneBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    this.props.onFailure()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}
function Ready({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    onReady()
  }, [onReady])
  return null
}
function ContextHealth({ onFailure }: { onFailure: () => void }) {
  const gl = useThree((state) => state.gl)
  useEffect(() => {
    const canvas = gl.domElement
    canvas.addEventListener('webglcontextlost', onFailure)
    return () => canvas.removeEventListener('webglcontextlost', onFailure)
  }, [gl, onFailure])
  return null
}
export function GlobalCanvas() {
  const { stage, sceneFailed, setSceneFailed, setSceneReady } = useStage()
  const pathname = usePathname()
  const reduced = useReducedMotion()
  // One DOM node for the whole component's lifetime — it's relocated (intro overlay vs. the
  // active viewport div) with plain DOM calls below, never unmounted and recreated, so the
  // <Canvas> portaled into it keeps the same WebGL context across every section change.
  const [container] = useState(() => {
    const el = document.createElement('div')
    el.setAttribute('aria-hidden', 'true')
    return el
  })
  const [host, setHost] = useState<HTMLElement | null>(null)
  const [active, setActive] = useState<Viewport | null>(null)
  const [hadHost, setHadHost] = useState(false)
  const [visible, setVisible] = useState(true)
  const [lowQuality, setLowQuality] = useState(false)
  useEffect(() => {
    setLowQuality(window.innerWidth < 768 || navigator.hardwareConcurrency <= 4)
    const visibility = () => setVisible(!document.hidden)
    visibility()
    document.addEventListener('visibilitychange', visibility)
    return () => document.removeEventListener('visibilitychange', visibility)
  }, [])
  // The hero (3D logo) and Who We Are (data centre) sections share one Canvas, portaled into
  // whichever of their viewport divs is currently more visible — this swaps only the
  // Suspense child (CompanyLogo <-> DataCentreScene), it does not remount the Canvas.
  useEffect(() => {
    if (stage !== 'scroll' || pathname !== '/') return
    const elements = (Object.keys(VIEWPORT_IDS) as Viewport[])
      .map((key) => [key, document.getElementById(VIEWPORT_IDS[key])] as const)
      .filter((entry): entry is [Viewport, HTMLElement] => !!entry[1])
    if (!elements.length) return
    const byElement = new Map<Element, Viewport>(elements.map(([key, element]) => [element, key]))
    const ratios: Partial<Record<Viewport, number>> = {}
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const key = byElement.get(entry.target)
          if (key) ratios[key] = entry.isIntersecting ? entry.intersectionRatio : 0
        }
        let best: Viewport | null = null
        for (const key of Object.keys(ratios) as Viewport[]) {
          if ((ratios[key] ?? 0) > 0 && (!best || (ratios[key] ?? 0) > (ratios[best] ?? 0)))
            best = key
        }
        setActive(best)
        setHost(best ? elements.find(([key]) => key === best)![1] : null)
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    )
    elements.forEach(([, element]) => observer.observe(element))
    return () => {
      observer.disconnect()
      setActive(null)
      setHost(null)
    }
  }, [stage, pathname])
  const intro = stage === 'loading'
  useEffect(() => {
    if (host) setHadHost(true)
  }, [host])
  // Relocate the persistent container: the intro overlay lives directly on <body>; once
  // scrolling starts it moves into whichever viewport div is currently active. When no
  // viewport is active (briefly, between sections, or on a non-3D section) it's left parked
  // in its last host rather than removed — removing it is what used to force a remount.
  useLayoutEffect(() => {
    if (pathname !== '/') return
    if (intro) {
      container.className = 'global-canvas is-intro'
      if (container.parentElement !== document.body) document.body.appendChild(container)
    } else if (host && container.parentElement !== host) {
      container.className = 'absolute inset-0'
      host.appendChild(container)
    }
  }, [intro, host, pathname, container])
  useEffect(() => () => container.remove(), [container])
  const trackingKey = intro ? 'loading' : active
  // Monotonic: a viewport that has ever loaded stays loaded, since useGLTF caches the parsed
  // model — a remount (e.g. scrolling away from the hero and back) never truly re-suspends, so
  // its fallback poster shouldn't reappear each time the way a single "last loaded key" would.
  const [everReady, setEveryReady] = useState<Set<string>>(() => new Set())
  useEffect(() => {
    if (!trackingKey || everReady.has(trackingKey) || sceneFailed) return
    const timer = setTimeout(() => setSceneFailed(true), 15000)
    return () => clearTimeout(timer)
  }, [trackingKey, everReady, sceneFailed, setSceneFailed])
  if (pathname !== '/') return null
  // Nothing to show yet: no intro overlay, and no viewport has ever activated (so the
  // container has nowhere to live).
  if (!intro && !hadHost) return null
  const fallback =
    active === 'hero' ? (
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/assets/logo.png"
          alt=""
          fill
          sizes="(min-width: 768px) 30vw, 60vw"
          className="object-contain opacity-70"
        />
      </div>
    ) : active === 'building' ? (
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/models/data-centre/data-centre-preview.png"
          alt=""
          fill
          sizes="(min-width: 768px) 45vw, 90vw"
          className="object-contain opacity-80"
        />
      </div>
    ) : null
  const scene = sceneFailed ? (
    fallback
  ) : (
    <SceneBoundary onFailure={() => setSceneFailed(true)}>
      <Canvas
        dpr={lowQuality ? 1 : [1, 2]}
        frameloop={
          !visible || (!intro && !active)
            ? 'never'
            : active === 'hero' && !reduced
              ? 'always'
              : 'demand'
        }
        gl={{ antialias: !lowQuality, alpha: true, localClippingEnabled: true }}
        shadows={!lowQuality}
        fallback={fallback}
      >
        <ContextHealth onFailure={() => setSceneFailed(true)} />
        <Suspense fallback={null}>
          {stage === 'loading' && <ServerRackLine reducedMotion={reduced} />}
          {active === 'hero' && <CompanyLogo reducedMotion={reduced} />}
          {active === 'building' && <DataCentreScene reducedMotion={reduced} />}
          {active === 'projects' && <ProjectsBackdrop reducedMotion={reduced} />}
          <Ready
            onReady={() => {
              if (trackingKey)
                setEveryReady((prev) =>
                  prev.has(trackingKey) ? prev : new Set(prev).add(trackingKey),
                )
              setSceneReady(true)
            }}
          />
        </Suspense>
        {/* multisampling: 0 here would silently cancel gl.antialias — the composer renders to
          a non-multisampled target once mounted, regardless of the context's own setting. */}
        {!lowQuality && (
          <EffectComposer multisampling={4}>
            <Bloom mipmapBlur intensity={0.22} luminanceThreshold={0.8} luminanceSmoothing={0.3} />
            <Vignette eskil={false} offset={0.2} darkness={intro ? 0.65 : 0.2} />
          </EffectComposer>
        )}
        <PerformanceMonitor onDecline={() => setLowQuality(true)} />
      </Canvas>
    </SceneBoundary>
  )
  const showFallback = !sceneFailed && trackingKey !== null && !everReady.has(trackingKey)
  return createPortal(
    <>
      {scene}
      {showFallback && fallback}
    </>,
    container,
  )
}
