import { readFile, writeFile, stat } from 'node:fs/promises'
import path from 'node:path'
import assert from 'node:assert/strict'
import sharp from 'sharp'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { Box3, Vector3, MeshStandardMaterial, Color } from 'three'
const dir = path.resolve('public/models/facilities-management'),
  files = [],
  geometry = []
const { states, anchors } = JSON.parse(
  await readFile(path.join(dir, 'maintenance-states.json'), 'utf8'),
)
const groups = [
  'Architecture',
  'Maintenance_Cooling',
  'Maintenance_Electrical',
  'Maintenance_Monitoring',
  'Maintenance_General',
]
let ids, transforms, bounds
for (const mobile of [false, true]) {
  const file = mobile ? 'facilities-management-mobile.glb' : 'facilities-management.glb',
    bytes = await readFile(path.join(dir, file))
  const doc = JSON.parse(bytes.subarray(20, 20 + bytes.readUInt32LE(12)).toString())
  assert(doc.extensionsUsed.includes('EXT_meshopt_compression'))
  assert(!doc.extensionsUsed.includes('KHR_materials_unlit'))
  assert(bytes.length < (mobile ? 3 : 8) * 1e6)
  const { scene } = await new GLTFLoader()
    .setMeshoptDecoder(MeshoptDecoder)
    .parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '')
  const current = doc.nodes.map((n) => n.name).sort()
  if (mobile) assert.deepEqual(current, ids)
  else ids = current
  const matrices = {}
  scene.updateMatrixWorld(true)
  scene.traverse((o) => {
    if (o.name) matrices[o.name] = o.matrixWorld.toArray()
  })
  if (mobile) assert.deepEqual(matrices, transforms)
  else transforms = matrices
  for (const group of groups) assert(scene.getObjectByName(group))
  for (const [id, a] of Object.entries(anchors))
    assert(
      scene
        .getObjectByName(id)
        .getWorldPosition(new Vector3())
        .distanceTo(new Vector3(...a.position)) < 0.001,
    )
  let triangles = 0,
    meshes = 0
  const originals = new Map()
  scene.traverse((o) => {
    if (o.isMesh) {
      meshes++
      triangles += (o.geometry.index?.count ?? o.geometry.attributes.position.count) / 3
      assert(o.material.isMeshStandardMaterial)
      assert(o.geometry.attributes.normal)
      originals.set(o, o.material)
    }
  })
  const highlight = new MeshStandardMaterial({
    color: new Color(0.85, 0.19, 0.035),
    metalness: 0.25,
    roughness: 0.4,
  })
  for (const state of Object.values(states)) {
    for (const [mesh, mat] of originals) mesh.material = mat
    for (const id of state.highlighted) {
      const object = scene.getObjectByName(id)
      assert(object)
      object.traverse((o) => {
        if (o.isMesh) o.material = highlight
      })
    }
    for (const id of state.highlighted)
      scene.getObjectByName(id).traverse((o) => {
        if (o.isMesh) assert.equal(o.material, highlight)
      })
  }
  for (const [mesh, mat] of originals) {
    mesh.material = mat
    assert.equal(mesh.material, mat)
  }
  highlight.dispose()
  bounds = new Box3().setFromObject(scene)
  geometry.push({ variant: mobile ? 'mobile' : 'desktop', triangles, meshes })
  files.push({ file, bytes: bytes.length, compression: 'EXT_meshopt_compression' })
}
for (const key of Object.keys(states)) {
  const file = 'state-' + key + '.webp'
  await sharp(path.join(dir, 'state-' + key + '.png'))
    .webp({ quality: 82 })
    .toFile(path.join(dir, file))
  const bytes = (await stat(path.join(dir, file))).size
  assert(bytes <= 250000)
  files.push({ file, bytes })
  states[key].poster = file
}
for (const [input, file] of [
  ['state-neutral.png', 'facilities-management-poster.webp'],
  ['facilities-management-mobile-render.png', 'facilities-management-mobile-poster.webp'],
]) {
  await sharp(path.join(dir, input)).webp({ quality: 82 }).toFile(path.join(dir, file))
  const bytes = (await stat(path.join(dir, file))).size
  assert(bytes <= 250000)
  files.push({ file, bytes })
}
for (const file of [
  'facilities-management.blend',
  'maintenance-states.json',
  'facilities-management.README.md',
  ...Object.keys(states).map((k) => 'state-' + k + '.png'),
  'facilities-management-mobile-render.png',
])
  files.push({ file, bytes: (await stat(path.join(dir, file))).size })
await writeFile(
  path.join(dir, 'manifest.json'),
  JSON.stringify(
    {
      id: 'facilities-management',
      description:
        'Illustrative operating plant with selectable inspection areas; no live status, fault, alarm, capacity or certification claim.',
      files,
      geometry,
      groups,
      componentIds: ids,
      states,
      anchors,
      defaultState: 'neutral',
      stateBehavior:
        'Keep all equipment visible and stationary. Save original mesh material references, restore before each selection, then assign a separate orange PBR material to the highlighted objects and child meshes. Clear restores original references.',
      highlightMaterial: {
        linearRGB: [0.85, 0.19, 0.035],
        metalness: 0.25,
        roughness: 0.4,
        emissive: false,
      },
      units: 'metres, illustrative scale',
      origin: 'Fixed footprint centre at floor height; foundation below zero',
      coordinates: { blender: 'Z up, front -Y', gltf: 'Y up, front +Z' },
      bounds: { min: bounds.min.toArray(), max: bounds.max.toArray() },
      cameras: {
        desktop: {
          position: [12, 14, 18],
          target: [0, 1, 0],
          horizontalSpan: 19.5,
          verticalSpan: 14.625,
        },
        inspection: { position: [-9, 9, 12], target: [-1, 1.3, -1], horizontalSpan: 13 },
        mobile: {
          position: [12, 14, 18],
          target: [0, 1, 0],
          verticalSpan: 21,
          horizontalSpan: 19.090909,
        },
      },
      materials: {
        type: 'Opaque metallic-roughness PBR, normal vectors, no unlit shaders or baked illumination',
        textures: 0,
        textureCompression: 'KTX2 not applicable',
        shadows:
          'Enable renderer.shadowMap.enabled, keyLight.castShadow, and mesh.castShadow/receiveShadow. Fit shadow frustum to 13 x 10 m footprint.',
      },
      source: {
        generator: 'Blender 5.2.2 LTS',
        materials: 'Appended from ../data-centre/data-centre.blend',
        geometry:
          'Original procedural geometry in scripts/build-facilities-management.py; no downloaded meshes or textures.',
        mobile: 'Simplified louvres; all IDs, transforms, anchors and state memberships retained.',
        preview:
          'Separate Preview collection with studio ground, cameras and lights, excluded from GLBs.',
      },
      verification: [
        'Reopened Blender source.',
        'Both GLBs loaded using Three.js GLTFLoader and MeshoptDecoder.',
        'Identical names/transforms and anchor locations verified across variants.',
        'All four highlight assignments and neutral material restoration exercised.',
        'Normals, PBR materials, triangle counts and size budgets checked.',
        'Neutral, highlight and mobile renders visually reviewed. Browser GPU performance not benchmarked.',
      ],
    },
    null,
    2,
  ) + '\n',
)
console.log(JSON.stringify({ files: files.slice(0, 9), geometry }, null, 2))
