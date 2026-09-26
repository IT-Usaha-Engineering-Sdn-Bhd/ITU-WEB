'use client'
import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import { useReducedMotion } from '@/lib/use-reduced-motion'
import { useViewer } from './viewer-store'
import { ModelScene } from './ModelScene'
import { ServerRackLine } from './scenes/ServerRackLine'
import { CompanyLogo } from './scenes/CompanyLogo'
import { renderPolicy } from './render-policy'

class SceneBoundary extends Component<
  { children: ReactNode; failed: () => void; resetKey: string },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    this.props.failed()
  }
  componentDidUpdate(
    previous: Readonly<{ children: ReactNode; failed: () => void; resetKey: string }>,
  ) {
    if (this.state.failed && previous.resetKey !== this.props.resetKey)
      this.setState({ failed: false })
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}
function Health({
  ready,
  failed,
  downgrade,
}: {
  ready: () => void
  failed: () => void
  downgrade: () => void
}) {
  const gl = useThree((state) => state.gl)
  const drawn = useRef(false)
  const slow = useRef(0)
  useEffect(() => {
    const canvas = gl.domElement
    const lost = (event: Event) => {
      event.preventDefault()
      failed()
    }
    canvas.addEventListener('webglcontextlost', lost)
    return () => canvas.removeEventListener('webglcontextlost', lost)
  }, [gl, failed])
  useFrame((_, delta) => {
    if (!drawn.current) {
      drawn.current = true
      requestAnimationFrame(ready)
    }
    // Long idle gaps are not interaction frames.
    slow.current = delta > 1 / 30 && delta < 0.25 ? slow.current + delta : 0
    if (slow.current >= 3) {
      downgrade()
      slow.current = 0
    }
  })
  return null
}
export function GlobalCanvas() {
  const request = useViewer()
  const currentRequest = useRef(request)
  useLayoutEffect(() => {
    currentRequest.current = request
  }, [request])
  const reduced = useReducedMotion()
  const [container] = useState(() => document.createElement('div'))
  const [visible, setVisible] = useState(!document.hidden)
  const [downgraded, setDowngraded] = useState(false)
  const [loaded, setLoaded] = useState('')
  const token = request ? `${request.key}:${request.url}:${request.reset}` : ''
  const ready = useCallback(() => {
    setLoaded(token)
    request?.ready()
  }, [token, request])
  const failed = useCallback(() => {
    const request = currentRequest.current
    if (!request) return
    // Evict rejected loader promises so an explicit Retry can fetch again.
    // Clearing the loader entry does not dispose shared geometry or materials.
    useGLTF.clear(request.url)
    request.failed()
  }, [])
  const downgrade = useCallback(() => setDowngraded(true), [])
  useEffect(() => {
    const change = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', change)
    return () => document.removeEventListener('visibilitychange', change)
  }, [])
  useLayoutEffect(() => {
    if (!request) return
    container.className = 'shared-model-canvas'
    request.host.appendChild(container)
  }, [request, container])
  useEffect(() => () => container.remove(), [container])
  useEffect(() => {
    if (!token || loaded === token || !visible || !request?.ratio) return
    const timeout = setTimeout(failed, 12000)
    return () => clearTimeout(timeout)
  }, [token, loaded, failed, visible, request?.ratio])
  if (!request) return null
  const logo = request.id === 'company-logo'
  const rack = request.id === 'server-rack'
  const { high, dpr, frameloop } = renderPolicy(
    request.quality,
    downgraded,
    visible,
    request.ratio,
    reduced,
  )
  return createPortal(
    <SceneBoundary failed={failed} resetKey={token}>
      <Canvas
        dpr={dpr}
        frameloop={frameloop}
        shadows={high}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true,
          localClippingEnabled: true,
        }}
        fallback={<span className="sr-only">3D unavailable</span>}
      >
        <Suspense fallback={null}>
          {rack ? (
            <ServerRackLine reducedMotion={reduced} />
          ) : logo ? (
            <CompanyLogo reducedMotion={reduced} />
          ) : (
            <ModelScene key={request.key} request={request} high={high} reducedMotion={reduced} />
          )}
          <Health key={token} ready={ready} failed={failed} downgrade={downgrade} />
        </Suspense>
        {logo && high && (
          <EffectComposer multisampling={4}>
            <Bloom mipmapBlur intensity={0.22} luminanceThreshold={0.8} luminanceSmoothing={0.3} />
            <Vignette eskil={false} offset={0.2} darkness={0.2} />
          </EffectComposer>
        )}
      </Canvas>
    </SceneBoundary>,
    container,
  )
}
