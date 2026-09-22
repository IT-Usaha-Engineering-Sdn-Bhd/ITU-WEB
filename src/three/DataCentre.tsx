'use client'

import { useEffect, useLayoutEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import type { ThreeElements } from '@react-three/fiber'
import type { ColorRepresentation } from 'three'
import { createDataCentreDisplay, type DataCentreMode } from './dataCentreDisplay'

export type DataCentreProps = Omit<ThreeElements['group'], 'children' | 'dispose'> & {
  mode?: DataCentreMode
  outlineColor?: ColorRepresentation
  url?: string
}

export function DataCentre({
  mode = 'textured',
  outlineColor = '#d6e8e9',
  url = '/models/data-centre/data-centre.glb',
  ...props
}: DataCentreProps) {
  const { scene } = useGLTF(url)
  const invalidate = useThree((state) => state.invalidate)
  const [display, setDisplay] = useState<ReturnType<typeof createDataCentreDisplay> | null>(null)

  // Allocate after commit so suspended/abandoned renders cannot leak GPU resources.
  useEffect(() => {
    const instance = createDataCentreDisplay(scene)
    setDisplay(instance)
    return () => instance.dispose()
  }, [scene])

  useLayoutEffect(() => {
    display?.setMode(mode, outlineColor)
    invalidate()
  }, [display, mode, outlineColor, invalidate])

  return (
    <group {...props} dispose={null}>
      {display && <primitive object={display.root} dispose={null} />}
    </group>
  )
}
