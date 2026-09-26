import { Material, Mesh, type Object3D } from 'three'

/** Acquire per mount; cleanup restores references so React effect replay can reacquire safely. */
export function ownWireframeMaterials(instance: Object3D) {
  const owned = new Map<Material, Material>()
  const originals = new Map<Mesh, Material | Material[]>()
  const clone = (material: Material) => {
    let copy = owned.get(material)
    if (!copy) {
      copy = material.clone()
      if ('wireframe' in copy) copy.wireframe = true
      owned.set(material, copy)
    }
    return copy
  }
  instance.traverse((object) => {
    if (!(object instanceof Mesh)) return
    originals.set(object, object.material)
    object.material = Array.isArray(object.material)
      ? object.material.map(clone)
      : clone(object.material)
  })
  return () => {
    originals.forEach((material, mesh) => {
      mesh.material = material
    })
    originals.clear()
    owned.forEach((material) => material.dispose())
    owned.clear()
  }
}
