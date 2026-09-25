import { Color, Mesh, MeshStandardMaterial, type Material, type Object3D } from 'three'
import dc from '../../public/models/data-centre/manifest.json'
import electrical from '../../public/models/electrical-services/manifest.json'
import project from '../../public/models/project-management/manifest.json'
import facilities from '../../public/models/facilities-management/manifest.json'
import dfma from '../../public/models/dfma/manifest.json'
import type { ServiceId } from './model-registry'

type State = {
  visibleGroups?: string[]
  highlighted?: string[]
  subdued?: string[]
  hiddenComponents?: string[]
  view?: string
}
const manifests = {
  'data-centre': dc,
  'electrical-services': electrical,
  'project-management': project,
  'facilities-management': facilities,
  dfma,
}

/** Owns only the two override materials. Object trees are clones; cached geometry/materials remain loader-owned. */
export function createModelAdapter(root: Object3D, id: ServiceId) {
  const manifest = manifests[id]
  for (const name of manifest.groups)
    if (!root.getObjectByName(name)) throw new Error(`Missing model group: ${id}/${name}`)
  const originals = new Map<
    Object3D,
    {
      visible: boolean
      material?: Material | Material[]
      position: number[]
      quaternion: number[]
      scale: number[]
    }
  >()
  root.traverse((node) =>
    originals.set(node, {
      visible: node.visible,
      material: node instanceof Mesh ? node.material : undefined,
      position: node.position.toArray(),
      quaternion: node.quaternion.toArray(),
      scale: node.scale.toArray(),
    }),
  )
  const orange = new MeshStandardMaterial({
    color: new Color().setRGB(0.85, 0.19, 0.035),
    metalness: 0.25,
    roughness: 0.4,
  })
  const subdued = new MeshStandardMaterial({ color: '#343c40', metalness: 0.25, roughness: 0.6 })
  function restore() {
    originals.forEach((original, node) => {
      node.visible = original.visible
      node.position.fromArray(original.position)
      node.quaternion.fromArray(original.quaternion)
      node.scale.fromArray(original.scale)
      if (node instanceof Mesh && original.material) node.material = original.material
    })
  }
  function paint(names: string[], material: Material) {
    for (const name of names)
      root.getObjectByName(name)?.traverse((node) => {
        if (node instanceof Mesh) node.material = material
      })
  }
  return {
    apply(state: string) {
      restore()
      if (id === 'data-centre') {
        const group = state[0]?.toUpperCase() + state.slice(1)
        for (const name of manifest.groups)
          root.getObjectByName(name)!.visible =
            state === 'all' || name === 'Architecture' || name === group
        return
      }
      const states = manifest.states as Record<string, State>
      const selection = states[state]
      if (!selection) throw new Error(`Unknown model state: ${id}/${state}`)
      if (selection.visibleGroups)
        for (const name of manifest.groups)
          root.getObjectByName(name)!.visible = selection.visibleGroups.includes(name)
      for (const name of selection.hiddenComponents ?? []) {
        const node = root.getObjectByName(name)
        if (node) node.visible = false
      }
      paint(selection.highlighted ?? [], orange)
      paint(selection.subdued ?? [], subdued)
      if (id === 'dfma') {
        const view = selection.view === 'exploded' ? 'exploded' : 'assembled'
        for (const [name, transforms] of Object.entries(dfma.transforms)) {
          const node = root.getObjectByName(name)
          if (!node) continue
          node.position.fromArray(transforms[view].position)
          node.quaternion.fromArray(transforms[view].quaternion)
          node.scale.fromArray(transforms[view].scale)
        }
      }
    },
    dispose() {
      restore()
      orange.dispose()
      subdued.dispose()
    },
  }
}
