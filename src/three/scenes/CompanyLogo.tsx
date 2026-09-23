'use client'
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { animate } from 'animejs'
import { Group, Mesh, MeshStandardMaterial } from 'three'
import { CameraRig } from '@/three/CameraRig'

export function CompanyLogo({ reducedMotion }: { reducedMotion: boolean }) {
  const { scene } = useGLTF('/models/logo/company-logo.glb')
  const group = useRef<Group>(null)
  const instance = useMemo(() => {
    const copy = scene.clone(true)
    copy.traverse((object) => {
      if (!(object instanceof Mesh)) return
      object.material = (object.material as MeshStandardMaterial).clone()
      if (object.material.name === 'LogoOrange') {
        object.material.emissive.copy(object.material.color)
        object.material.emissiveIntensity = 0.65
      } else {
        object.material.color.set('#b8b5af')
        object.material.metalness = 0.65
        object.material.roughness = 0.3
      }
    })
    return copy
  }, [scene])
  useEffect(
    () => () => {
      instance.traverse((object) => {
        if (object instanceof Mesh) object.material.dispose()
      })
    },
    [instance],
  )
  // useLayoutEffect + a synchronous starting scale: anime.js only writes the tween's "from"
  // value on its own next RAF tick, so a passive effect here would let at least one frame
  // paint at the group's default scale (1) before snapping down to .7 — a visible pop on
  // every remount (this scene unmounts/remounts each time the hero viewport re-activates).
  useLayoutEffect(() => {
    if (!group.current || reducedMotion) return
    group.current.scale.setScalar(0.7)
    const animation = animate(group.current.scale, {
      x: [0.7, 1],
      y: [0.7, 1],
      z: [0.7, 1],
      duration: 1100,
      ease: 'outCubic',
    })
    return () => {
      animation.revert()
    }
  }, [reducedMotion])
  // Drag rotates the logo directly; releasing springs the drag offset back to zero (same
  // stiffness/damping pattern as the projects backdrop's pointer parallax) and the idle sway
  // resumes riding on top of it.
  const dragging = useRef(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const dragVelocity = useRef({ x: 0, y: 0 })
  const DRAG_STIFFNESS = 30
  const DRAG_DAMPING = 8

  const moveHandler = useRef<((event: PointerEvent) => void) | null>(null)
  const upHandler = useRef<(() => void) | null>(null)
  // Cleanup only, in case the scene unmounts mid-drag (e.g. scrolling away from the hero).
  useEffect(
    () => () => {
      if (moveHandler.current) window.removeEventListener('pointermove', moveHandler.current)
      if (upHandler.current) window.removeEventListener('pointerup', upHandler.current)
    },
    [],
  )

  const onPointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (reducedMotion || dragging.current) return
    event.stopPropagation()
    dragging.current = true
    moveHandler.current = (moveEvent) => {
      dragOffset.current.y = Math.max(
        -1,
        Math.min(1, dragOffset.current.y + moveEvent.movementX * 0.006),
      )
      dragOffset.current.x = Math.max(
        -0.6,
        Math.min(0.6, dragOffset.current.x + moveEvent.movementY * 0.006),
      )
    }
    upHandler.current = () => {
      dragging.current = false
      if (moveHandler.current) window.removeEventListener('pointermove', moveHandler.current)
      if (upHandler.current) window.removeEventListener('pointerup', upHandler.current)
    }
    window.addEventListener('pointermove', moveHandler.current)
    window.addEventListener('pointerup', upHandler.current)
  }

  useFrame(({ clock }, delta) => {
    if (!group.current) return
    if (!dragging.current) {
      const step = Math.min(delta, 1 / 30)
      dragVelocity.current.x += (0 - dragOffset.current.x) * DRAG_STIFFNESS * step
      dragVelocity.current.x *= Math.max(0, 1 - DRAG_DAMPING * step)
      dragOffset.current.x += dragVelocity.current.x * step
      dragVelocity.current.y += (0 - dragOffset.current.y) * DRAG_STIFFNESS * step
      dragVelocity.current.y *= Math.max(0, 1 - DRAG_DAMPING * step)
      dragOffset.current.y += dragVelocity.current.y * step
    }
    const idle = reducedMotion ? 0 : Math.sin(clock.elapsedTime * 0.4) * 0.3
    group.current.rotation.y = idle + dragOffset.current.y
    group.current.rotation.x = dragOffset.current.x
  })
  return (
    <>
      <CameraRig position={[0, 0.2, 8]} target={[0, -0.1, 0]} fov={38} far={20} />
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 4, 5]} intensity={3} />
      <directionalLight position={[-3, 1, 2]} intensity={2} color="#ffffff" />
      <group ref={group} position={[0, 0.75, 0]} onPointerDown={onPointerDown}>
        <primitive object={instance} dispose={null} />
      </group>
    </>
  )
}
