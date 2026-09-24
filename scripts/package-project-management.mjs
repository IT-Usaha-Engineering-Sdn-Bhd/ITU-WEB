import { readFile, writeFile, stat } from 'node:fs/promises'
import path from 'node:path'
import assert from 'node:assert/strict'
import sharp from 'sharp'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { Box3, Vector3 } from 'three'
const dir = path.resolve('public/models/project-management'),
  files = [],
  geometry = []
const { states, anchors } = JSON.parse(await readFile(path.join(dir, 'stage-states.json'), 'utf8'))
const groups = ['Stage_Structure', 'Stage_Equipment', 'Stage_Coordination', 'Stage_Commissioning']
let ids, transforms, bounds
for (const mobile of [false, true]) {
  const file = mobile ? 'project-management-mobile.glb' : 'project-management.glb',
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
  for (const [id, anchor] of Object.entries(anchors)) {
    const o = scene.getObjectByName(id)
    assert(o)
    assert(o.getWorldPosition(new Vector3()).distanceTo(new Vector3(...anchor.position)) < 0.001)
  }
  let triangles = 0,
    meshes = 0
  scene.traverse((o) => {
    if (o.isMesh) {
      meshes++
      triangles += (o.geometry.index?.count ?? o.geometry.attributes.position.count) / 3
      assert(o.material.isMeshStandardMaterial)
      assert(o.geometry.attributes.normal)
    }
  })
  for (const state of Object.values(states))
    for (const group of groups) {
      const o = scene.getObjectByName(group)
      o.visible = state.visibleGroups.includes(group)
      assert.equal(o.visible, state.visibleGroups.includes(group))
    }
  bounds = new Box3().setFromObject(scene)
  geometry.push({ variant: mobile ? 'mobile' : 'desktop', triangles, meshes })
  files.push({ file, bytes: bytes.length, compression: 'EXT_meshopt_compression' })
}
for (const key of Object.keys(states)) {
  const file = 'stage-' + key + '.webp'
  await sharp(path.join(dir, 'stage-' + key + '.png'))
    .webp({ quality: 82 })
    .toFile(path.join(dir, file))
  const bytes = (await stat(path.join(dir, file))).size
  assert(bytes <= 250000)
  files.push({ file, bytes })
  states[key].poster = file
}
for (const [input, file] of [
  ['stage-commissioning.png', 'project-management-poster.webp'],
  ['project-management-mobile-render.png', 'project-management-mobile-poster.webp'],
]) {
  await sharp(path.join(dir, input)).webp({ quality: 82 }).toFile(path.join(dir, file))
  const bytes = (await stat(path.join(dir, file))).size
  assert(bytes <= 250000)
  files.push({ file, bytes })
}
for (const file of [
  'project-management.blend',
  'stage-states.json',
  'project-management.README.md',
  ...Object.keys(states).map((k) => 'stage-' + k + '.png'),
  'project-management-mobile-render.png',
])
  files.push({ file, bytes: (await stat(path.join(dir, file))).size })
await writeFile(
  path.join(dir, 'manifest.json'),
  JSON.stringify(
    {
      id: 'project-management',
      description:
        'Illustrative construction progression; not an actual client site, schedule, certification or performance claim.',
      files,
      geometry,
      groups,
      componentIds: ids,
      states,
      anchors,
      defaultState: 'commissioning',
      stateBehavior:
        'Cumulative group visibility only. All components retain fixed transforms. Responsibility labels are HTML content at empty-node anchors.',
      units: 'metres, illustrative scale',
      origin: 'Fixed footprint centre at floor height; foundation below zero',
      coordinates: { blender: 'Z up, front -Y', gltf: 'Y up, front +Z' },
      bounds: { min: bounds.min.toArray(), max: bounds.max.toArray() },
      cameras: {
        desktop: {
          position: [13, 15, 19],
          target: [0, 1.2, 0],
          horizontalSpan: 22,
          verticalSpan: 16.133333,
        },
        mobile: {
          position: [13, 15, 19],
          target: [0, 1.2, 0],
          verticalSpan: 23,
          horizontalSpan: 20.90909,
        },
      },
      materials: {
        type: 'Opaque metallic-roughness PBR, normal vectors, no unlit shaders or baked illumination',
        textures: 0,
        textureCompression: 'KTX2 not applicable',
        shadows:
          'Enable renderer.shadowMap.enabled, keyLight.castShadow, and mesh.castShadow/receiveShadow. Fit shadow frustum to the 15 x 11 m footprint.',
      },
      source: {
        generator: 'Blender 5.2.2 LTS',
        materials: 'Appended from ../data-centre/data-centre.blend',
        geometry:
          'Original procedural geometry in scripts/build-project-management.py; no downloaded meshes or textures.',
        mobile: 'Simplifies rack grille meshes while preserving every node ID and transform.',
        preview:
          'Separate Preview collection with studio ground, camera and lights; excluded from GLBs.',
      },
      verification: [
        'Reopened saved Blender source.',
        'Both GLBs loaded through Three.js GLTFLoader and MeshoptDecoder.',
        'Identical node IDs and world transforms verified across variants.',
        'Four group visibility states and label anchor positions verified.',
        'Lit materials, normals, sizes and stage/mobile renders checked. Browser GPU performance not benchmarked.',
      ],
    },
    null,
    2,
  ) + '\n',
)
console.log(JSON.stringify({ files: files.slice(0, 8), geometry }, null, 2))
