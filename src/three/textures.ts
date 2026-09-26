import { LinearMipmapLinearFilter, Mesh, Texture, type Object3D, type WebGLRenderer } from 'three'

export function sharpenTextures(object: Object3D, gl: Pick<WebGLRenderer, 'capabilities'>) {
  const seen = new Set<Texture>()
  const anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy())
  object.traverse((node) => {
    if (!(node instanceof Mesh)) return
    const materials = Array.isArray(node.material) ? node.material : [node.material]
    for (const material of materials) {
      for (const value of Object.values(material)) {
        if (!(value instanceof Texture) || seen.has(value)) continue
        seen.add(value)
        const minFilter =
          value.generateMipmaps || value.mipmaps.length > 1
            ? LinearMipmapLinearFilter
            : value.minFilter
        if (value.anisotropy === anisotropy && value.minFilter === minFilter) continue
        value.anisotropy = anisotropy
        value.minFilter = minFilter
        value.needsUpdate = true
      }
    }
  })
}
