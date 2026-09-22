import { mkdir, writeFile, readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import sharp from 'sharp'
import * as THREE from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

// GLTFExporter uses this browser API even for texture-free binary exports.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then(result => {
      this.result = result
      this.onloadend?.()
    })
  }
}

const root = new URL('../', import.meta.url)
const source = new URL('company_logo_no_text.jpeg', root)
const { data, info } = await sharp(await readFile(source)).removeAlpha().raw().toBuffer({ resolveWithObject: true })
function sample(x, y) {
  const offset = (y * info.width + x) * info.channels
  return new THREE.Color(`rgb(${data[offset]},${data[offset + 1]},${data[offset + 2]})`)
}
const scale = 2 / info.height
const shape = () => new THREE.Shape()
const xy = (x, y) => [(x - info.width / 2) * scale, (info.height / 2 - y) * scale]
function rectangle(x, y, width, height) {
  const s = shape()
  s.moveTo(...xy(x, y))
  s.lineTo(...xy(x + width, y))
  s.lineTo(...xy(x + width, y + height))
  s.lineTo(...xy(x, y + height))
  s.closePath()
  return s
}

// Trace in source-image pixel coordinates; white is negative space.
const orange = shape()
orange.moveTo(...xy(0, 404))
orange.lineTo(...xy(583, 404))
orange.lineTo(...xy(583, 710))
orange.lineTo(...xy(179, 710))
orange.lineTo(...xy(307, 778))
orange.lineTo(...xy(307, 1141))
orange.bezierCurveTo(...xy(307, 1225), ...xy(375, 1293), ...xy(459, 1293))
orange.lineTo(...xy(859, 1293))
orange.lineTo(...xy(859, 404))
orange.lineTo(...xy(1166, 404))
orange.lineTo(...xy(1166, 1599))
orange.lineTo(...xy(371, 1599))
orange.bezierCurveTo(...xy(166, 1599), ...xy(0, 1433), ...xy(0, 1228))
orange.closePath()

const group = new THREE.Group()
group.name = 'CompanyLogo'
for (const [name, outlines, color] of [
  ['LogoBlack', [rectangle(0, 0, 307, 307), rectangle(400, 0, 766, 307)], sample(100, 100)],
  ['LogoOrange', [orange], sample(100, 500)],
]) {
  const raw = new THREE.ExtrudeGeometry(outlines, {
    depth: 0.104, steps: 1, bevelEnabled: true,
    bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2, curveSegments: 16,
  })
  raw.translate(0, 0, -0.052)
  raw.deleteAttribute('uv')
  raw.clearGroups()
  const geometry = mergeVertices(raw)
  raw.dispose()
  const material = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0 })
  material.name = name
  const mesh = new THREE.Mesh(geometry, material)
  mesh.name = name === 'LogoBlack' ? 'BlackBars' : 'OrangeMark'
  group.add(mesh)
}
// Normalize the complete beveled bounds to exactly two units tall.
const bounds = new THREE.Box3().setFromObject(group)
const center = bounds.getCenter(new THREE.Vector3())
const normalization = 2 / bounds.getSize(new THREE.Vector3()).y
for (const mesh of group.children) {
  mesh.geometry.translate(-center.x, -center.y, -center.z)
  mesh.geometry.scale(normalization, normalization, normalization)
}
const result = await new GLTFExporter().parseAsync(group, { binary: true })
const target = new URL('public/models/company-logo.glb', root)
await mkdir(new URL('public/models/', root), { recursive: true })
await writeFile(target, Buffer.from(result))

// Reload the actual output, rather than checking only the generation inputs.
const bytes = await readFile(target)
const loaded = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '')
let triangles = 0
const materials = []
loaded.scene.traverse(mesh => {
  if (!mesh.isMesh) return
  const { position, normal } = mesh.geometry.attributes
  assert(position && normal)
  for (const value of position.array) assert(Number.isFinite(value))
  for (let i = 0; i < normal.count; i++) {
    assert(Math.abs(new THREE.Vector3().fromBufferAttribute(normal, i).length() - 1) < 0.001)
  }
  triangles += (mesh.geometry.index?.count ?? position.count) / 3
  assert(mesh.material.isMeshStandardMaterial)
  assert.equal(mesh.material.metalness, 0)
  assert.equal(mesh.material.roughness, 0.4)
  materials.push({ name: mesh.material.name, color: `#${mesh.material.color.getHexString()}` })
})
const size = new THREE.Box3().setFromObject(loaded.scene).getSize(new THREE.Vector3())
assert(Math.abs(size.y - 2) < 0.00001)
assert(triangles < 5000)
assert(bytes.length < 250000)
assert.deepEqual(materials.map(m => m.name).sort(), ['LogoBlack', 'LogoOrange'])
console.log(JSON.stringify({ file: target.pathname, bytes: bytes.length, triangles, size: size.toArray(), materials }, null, 2))
