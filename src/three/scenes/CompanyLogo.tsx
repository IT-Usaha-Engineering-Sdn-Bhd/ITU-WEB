'use client'
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
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
        object.material.emissiveIntensity = .65
      } else {
        object.material.color.set('#b8b5af')
        object.material.metalness = .65
        object.material.roughness = .3
      }
    })
    return copy
  }, [scene])
  useEffect(() => () => { instance.traverse((object) => { if (object instanceof Mesh) object.material.dispose() }) }, [instance])
  // useLayoutEffect + a synchronous starting scale: anime.js only writes the tween's "from"
  // value on its own next RAF tick, so a passive effect here would let at least one frame
  // paint at the group's default scale (1) before snapping down to .7 — a visible pop on
  // every remount (this scene unmounts/remounts each time the hero viewport re-activates).
  useLayoutEffect(() => {
    if (!group.current || reducedMotion) return
    group.current.scale.setScalar(.7)
    const animation = animate(group.current.scale, { x: [.7, 1], y: [.7, 1], z: [.7, 1], duration: 1100, ease: 'outCubic' })
    return () => { animation.revert() }
  }, [reducedMotion])
  useFrame(({ clock }) => {
    if (group.current && !reducedMotion) group.current.rotation.y = Math.sin(clock.elapsedTime * .4) * .3
  })
  return <>
    <CameraRig position={[0, 0.2, 8]} target={[0, -.1, 0]} fov={38} far={20} />
    <ambientLight intensity={1.1} /><directionalLight position={[3, 4, 5]} intensity={3} /><directionalLight position={[-3, 1, 2]} intensity={2} color="#eb8c24" />
    <group ref={group} position={[0, .75, 0]}><primitive object={instance} dispose={null} /></group>
  </>
}
