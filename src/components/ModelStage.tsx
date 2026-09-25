'use client'
import Image from 'next/image'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { modelPoster, modelRegistry, type ModelId } from '@/three/model-registry'
import { devicePolicy, type Quality } from '@/three/model-policy'
import { registerViewer, removeViewer, useViewer } from '@/three/viewer-store'

export function ModelStage({
  id,
  title,
  compact = false,
}: {
  id: ModelId
  title: string
  compact?: boolean
}) {
  const model = modelRegistry[id]
  const key = useId()
  const active = useViewer()
  const host = useRef<HTMLDivElement>(null)
  const [state, setState] = useState(model.defaultState)
  const [policy, setPolicy] = useState<Quality>('constrained')
  const [url, setUrl] = useState(model.url)
  const [mode, setMode] = useState<'image' | 'loading' | 'ready' | 'error'>('image')
  const [enabled, setEnabled] = useState(false)
  const [near, setNear] = useState(false)
  const [ratio, setRatio] = useState(0)
  const [rotation, setRotation] = useState(0)
  const [reset, setReset] = useState(0)
  const [drag, setDrag] = useState(false)
  const [touch, setTouch] = useState(true)
  const ready = useCallback(() => setMode('ready'), [])
  const failed = useCallback(() => {
    setMode('error')
    setEnabled(false)
  }, [])
  useEffect(() => {
    const quality = devicePolicy()
    setPolicy(quality)
    // Pick once per mount; orientation changes must not download the other variant.
    setUrl(
      (window.innerWidth < 768 || quality === 'constrained') && model.mobileUrl
        ? model.mobileUrl
        : model.url,
    )
    setTouch(window.matchMedia('(pointer: coarse)').matches)
    if (quality !== 'constrained') {
      setEnabled(true)
      setMode('loading')
    }
  }, [model])
  useEffect(() => {
    if (!host.current) return
    const proximity = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), {
      rootMargin: '300px',
    })
    const visibility = new IntersectionObserver(
      ([entry]) => setRatio(entry.isIntersecting ? entry.intersectionRatio : 0),
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    )
    proximity.observe(host.current)
    visibility.observe(host.current)
    return () => {
      proximity.disconnect()
      visibility.disconnect()
    }
  }, [])
  useEffect(() => {
    if (!host.current) return
    registerViewer({
      key,
      id,
      host: host.current,
      state,
      url,
      near,
      ratio,
      enabled,
      quality: policy,
      rotation,
      reset,
      drag: !touch || drag,
      ready,
      failed,
    })
    return () => removeViewer(key)
  }, [
    key,
    id,
    state,
    url,
    near,
    ratio,
    enabled,
    policy,
    rotation,
    reset,
    drag,
    touch,
    ready,
    failed,
  ])
  const load = () => {
    setMode('loading')
    setEnabled(true)
    setReset((value) => value + 1)
  }
  const selected = model.states.find((item) => item.id === state)
  return (
    <section
      className={`model-stage${compact ? ' model-stage--compact' : ' section-shell'}`}
      data-theme="dark"
      aria-label={`${title} model`}
    >
      <div className="model-stage-visual">
        <div
          ref={host}
          className="model-stage-canvas"
          style={{
            pointerEvents: touch && !drag ? 'none' : 'auto',
            touchAction: touch && !drag ? 'pan-y' : 'none',
          }}
          aria-hidden="true"
        />
        <div
          className="model-stage-poster"
          data-ready={mode === 'ready' && enabled && active?.key === key}
        >
          <Image
            src={modelPoster(id, state)}
            alt={`${title}: ${selected?.label ?? 'overview'}`}
            fill
            sizes="(min-width: 1200px) 900px, 100vw"
            className="object-contain"
            priority={!compact}
          />
        </div>
      </div>
      <div className="model-stage-controls">
        <p className="eyebrow">{title}</p>
        {model.states.length > 0 && (
          <div className="model-state-buttons" role="group" aria-label="Model state">
            {model.states.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={state === item.id}
                onClick={() => setState(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
        <p className="model-description" aria-live="polite">
          {selected?.description ?? 'Campus overview.'}
        </p>
        <div className="model-view-buttons" role="group" aria-label="Model view">
          <button
            type="button"
            disabled={!enabled}
            onClick={() => setRotation((value) => Math.max(-1.1, value - 0.2))}
          >
            Rotate left
          </button>
          <button
            type="button"
            disabled={!enabled}
            onClick={() => setRotation((value) => Math.min(1.1, value + 0.2))}
          >
            Rotate right
          </button>
          <button
            type="button"
            onClick={() => {
              setRotation(0)
              setReset((value) => value + 1)
              setDrag(false)
            }}
          >
            Reset view
          </button>
          {enabled ? (
            <button
              type="button"
              onClick={() => {
                setEnabled(false)
                setMode('image')
                setDrag(false)
              }}
            >
              View image
            </button>
          ) : (
            <button type="button" onClick={load}>
              {mode === 'error' ? 'Retry 3D' : 'Load 3D'}
            </button>
          )}
          {touch && enabled && (
            <button type="button" aria-pressed={drag} onClick={() => setDrag((value) => !value)}>
              {drag ? 'Done rotating' : 'Rotate model'}
            </button>
          )}
        </div>
        <p className="model-status" role="status">
          {mode === 'error'
            ? '3D is unavailable. The selected image is shown.'
            : mode === 'loading' && near
              ? 'Loading 3D. The image remains available.'
              : mode === 'image'
                ? 'Image view'
                : 'Interactive view'}
        </p>
        <p className="model-disclaimer">Illustrative scene.</p>
      </div>
    </section>
  )
}
