import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { readFileSync } from 'node:fs'
import { Group, Mesh, BoxGeometry, MeshStandardMaterial } from 'three'
import { createModelAdapter } from './model-adapter.ts'

function fixture(id) {
  const manifest = JSON.parse(readFileSync(`public/models/${id}/manifest.json`))
  const buffer = readFileSync(`public/models/${id}/${id}.glb`)
  const json = JSON.parse(buffer.subarray(20, 20 + buffer.readUInt32LE(12)).toString())
  const root = new Group()
  const shared = new MeshStandardMaterial()
  const nodes = json.nodes.map((n) => {
    const node = n.mesh === undefined ? new Group() : new Mesh(new BoxGeometry(), shared)
    node.name = n.name || ''
    if (n.translation) node.position.fromArray(n.translation)
    if (n.rotation) node.quaternion.fromArray(n.rotation)
    if (n.scale) node.scale.fromArray(n.scale)
    return node
  })
  json.nodes.forEach((n, i) => n.children?.forEach((child) => nodes[i].add(nodes[child])))
  json.scenes[json.scene ?? 0].nodes.forEach((i) => root.add(nodes[i]))
  return { root, manifest, shared }
}
test('all required groups exist in desktop and mobile delivery variants', () => {
  for (const id of [
    'data-centre',
    'electrical-services',
    'project-management',
    'facilities-management',
    'dfma',
  ]) {
    const manifest = fixture(id).manifest
    for (const suffix of ['', '-mobile']) {
      const b = readFileSync(`public/models/${id}/${id}${suffix}.glb`)
      const json = JSON.parse(b.subarray(20, 20 + b.readUInt32LE(12)).toString())
      for (const group of manifest.groups)
        assert.ok(
          json.nodes.some((n) => n.name === group),
          `${id}${suffix}: ${group}`,
        )
    }
  }
})
test('data centre isolates a system while keeping architecture visible', () => {
  const { root } = fixture('data-centre')
  const a = createModelAdapter(root, 'data-centre')
  a.apply('cooling')
  assert.equal(root.getObjectByName('Architecture').visible, true)
  assert.equal(root.getObjectByName('Power').visible, false)
  a.apply('all')
  assert.equal(root.getObjectByName('Power').visible, true)
  a.dispose()
})
test('project stages are cumulative and do not move equipment', () => {
  const { root } = fixture('project-management')
  const a = createModelAdapter(root, 'project-management')
  a.apply('equipment')
  assert.equal(root.getObjectByName('Stage_Structure').visible, true)
  assert.equal(root.getObjectByName('Stage_Equipment').visible, true)
  assert.equal(root.getObjectByName('Stage_Coordination').visible, false)
  a.apply('commissioning')
  assert.equal(root.getObjectByName('Stage_Commissioning').visible, true)
  a.dispose()
})
test('facilities restores material references and never recolors shared materials', () => {
  const { root, shared } = fixture('facilities-management')
  const a = createModelAdapter(root, 'facilities-management')
  const mesh = root.getObjectByName('Cooling_FilterAccess_01')
  a.apply('cooling')
  assert.notEqual(mesh.material, shared)
  a.apply('electrical')
  assert.equal(mesh.material, shared)
  a.apply('neutral')
  root.traverse((n) => {
    if (n.isMesh) assert.equal(n.material, shared)
  })
  assert.equal(shared.color.getHex(), 0xffffff)
  a.dispose()
})
test('electrical supply changes only named path materials', () => {
  const { root, shared } = fixture('electrical-services')
  const a = createModelAdapter(root, 'electrical-services')
  a.apply('backup')
  assert.notEqual(root.getObjectByName('Path_BackupToUPS').material, shared)
  assert.equal(shared.color.getHex(), 0xffffff)
  root.traverse((n) => assert.equal(n.visible, true))
  a.apply('normal')
  a.dispose()
})
test('repeated DFMA transitions restore absolute transforms and hide transport geometry', () => {
  const { root, manifest } = fixture('dfma')
  const a = createModelAdapter(root, 'dfma')
  for (let i = 0; i < 5; i++) {
    a.apply('fabrication')
    for (const [name, transform] of Object.entries(manifest.transforms)) {
      assert.deepEqual(root.getObjectByName(name).position.toArray(), transform.exploded.position)
    }
    a.apply('transport')
    assert.equal(root.getObjectByName('Transport_Preparation').visible, true)
    a.apply('installation')
    assert.equal(root.getObjectByName('Transport_Preparation').visible, false)
    for (const [name, transform] of Object.entries(manifest.transforms)) {
      assert.deepEqual(root.getObjectByName(name).position.toArray(), transform.assembled.position)
      assert.deepEqual(
        root.getObjectByName(name).quaternion.toArray(),
        transform.assembled.quaternion,
      )
      assert.deepEqual(root.getObjectByName(name).scale.toArray(), transform.assembled.scale)
    }
  }
  a.dispose()
})
