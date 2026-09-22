import {
  Color, EdgesGeometry, Group, LineBasicMaterial, LineSegments,
  Mesh, MeshBasicMaterial, Object3D,
} from 'three'
import type { ColorRepresentation, Material } from 'three'

export type DataCentreMode = 'textured' | 'outline'

/** Owns only edge buffers and display materials; the loader's assets stay shared. */
export function createDataCentreDisplay(source: Object3D) {
  const root = source.clone(true) as Group
  const edges: LineSegments<EdgesGeometry, LineBasicMaterial>[] = []
  const surfaces: { mesh: Mesh; material: Material | Material[]; visible: boolean }[] = []
  const depth = new MeshBasicMaterial({
    colorWrite: false,
    depthWrite: true,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  })
  const lineMaterial = new LineBasicMaterial({ color: '#d6e8e9', toneMapped: false })

  // Collect first: adding children during traverse can recurse into the new lines.
  root.traverse((object) => {
    if (!(object instanceof Mesh)) return
    surfaces.push({ mesh: object, material: object.material, visible: object.visible })
  })
  for (const { mesh } of surfaces) {
    mesh.castShadow = true
    mesh.receiveShadow = true
    if (mesh.userData.outline === false) continue
    const line = new LineSegments(new EdgesGeometry(mesh.geometry, 25), lineMaterial)
    line.name = `${mesh.name}_outline`
    line.renderOrder = 1
    line.visible = false
    // Local coordinates are inherited from the mesh, including all parent transforms.
    mesh.add(line)
    edges.push(line)
  }

  let disposed = false
  return {
    root,
    edges,
    setMode(mode: DataCentreMode, color: ColorRepresentation = '#d6e8e9') {
      lineMaterial.color.copy(new Color(color))
      const outline = mode === 'outline'
      for (const { mesh, material, visible } of surfaces) {
        mesh.material = outline ? depth : material
        mesh.visible = visible && (!outline || mesh.userData.outline !== false)
        mesh.castShadow = !outline
        mesh.receiveShadow = !outline
      }
      for (const line of edges) line.visible = outline
    },
    dispose() {
      if (disposed) return
      disposed = true
      for (const line of edges) {
        line.removeFromParent()
        line.geometry.dispose()
      }
      depth.dispose()
      lineMaterial.dispose()
    },
  }
}
