'use client'
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Box3, OrthographicCamera, Vector3 } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { createModelAdapter } from './model-adapter'
import { modelRegistry, type ServiceId } from './model-registry'
import type { ViewerRequest } from './viewer-store'

export function ModelScene({ request, high }: { request: ViewerRequest; high: boolean }) {
  const { scene } = useGLTF(request.url, false, true)
  const { set, size, invalidate } = useThree()
  const controls = useRef<OrbitControlsImpl>(null)
  const instance = useMemo(() => scene.clone(true), [scene])
  const adapter = useMemo(
    () =>
      request.id === 'homepage-campus'
        ? null
        : createModelAdapter(instance, request.id as ServiceId),
    [instance, request.id],
  )
  const camera = useMemo(() => new OrthographicCamera(-1, 1, 1, -1, 0.1, 1000), [])
  const preset = modelRegistry[request.id].camera!
  const radius = useMemo(() => {
    const bounds = new Box3().setFromObject(instance)
    // Include exploded and transport geometry before fitting any selected DFMA state.
    if (request.id === 'dfma' && adapter) {
      adapter.apply('fabrication')
      bounds.union(new Box3().setFromObject(instance))
      adapter.apply('transport')
      bounds.union(new Box3().setFromObject(instance))
    }
    return bounds.getSize(new Vector3()).length() / 2
  }, [instance, adapter, request.id])
  useLayoutEffect(() => {
    adapter?.apply(request.state)
    instance.traverse((node) => {
      node.castShadow = high
      node.receiveShadow = high
    })
    invalidate()
  }, [adapter, instance, request.state, high, invalidate])
  useEffect(() => () => adapter?.dispose(), [adapter])
  useLayoutEffect(() => {
    const aspect = size.width / Math.max(1, size.height)
    const padding = Math.max(
      1.12,
      size.width / Math.max(1, size.width - 48),
      size.height / Math.max(1, size.height - 48),
    )
    const span = Math.max(
      size.width < 768 ? preset.mobileSpan : preset.span,
      radius * 2 * padding,
      (radius * 2 * padding) / aspect,
    )
    camera.left = (-span * aspect) / 2
    camera.right = (span * aspect) / 2
    camera.top = span / 2
    camera.bottom = -span / 2
    camera.position.fromArray(preset.position)
    camera.lookAt(...preset.target)
    camera.updateProjectionMatrix()
    set({ camera })
    controls.current?.target.fromArray(preset.target)
    controls.current?.update()
    invalidate()
  }, [camera, preset, radius, size.width, size.height, request.reset, set, invalidate])
  useEffect(() => {
    const target = new Vector3(...preset.target)
    camera.position
      .fromArray(preset.position)
      .sub(target)
      .applyAxisAngle(new Vector3(0, 1, 0), request.rotation)
      .add(target)
    camera.lookAt(target)
    controls.current?.update()
    invalidate()
  }, [camera, preset, request.rotation, request.reset, invalidate])
  const rendered = useRef(false)
  useFrame(() => {
    if (!rendered.current) {
      rendered.current = true
      requestAnimationFrame(request.ready)
    }
  })
  return (
    <>
      <color attach="background" args={['#202629']} />
      <hemisphereLight args={['#ffffff', '#747c80', 2]} />
      <directionalLight
        position={[20, 35, 25]}
        intensity={3}
        castShadow={high}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-radius}
        shadow-camera-right={radius}
        shadow-camera-top={radius}
        shadow-camera-bottom={-radius}
        shadow-camera-far={500}
      />
      <directionalLight position={[-20, 10, -10]} intensity={1} />
      <primitive object={instance} dispose={null} />
      <OrbitControls
        ref={controls}
        camera={camera}
        target={preset.target}
        enabled={request.drag}
        enableZoom={false}
        enablePan={false}
        enableDamping={false}
        minPolarAngle={0.25}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minAzimuthAngle={-Math.PI / 2}
        maxAzimuthAngle={Math.PI / 2}
        onChange={() => invalidate()}
      />
    </>
  )
}
