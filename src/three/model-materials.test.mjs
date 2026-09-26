import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Group, Mesh, BoxGeometry, MeshStandardMaterial, Texture } from 'three'
import { ownWireframeMaterials } from './model-materials.ts'

test('campus owns deduplicated wireframe clones and never disposes source resources', () => {
  const source = new Group()
  const texture = new Texture()
  const material = new MeshStandardMaterial({ map: texture })
  source.add(new Mesh(new BoxGeometry(), [material, material]))
  source.add(new Mesh(new BoxGeometry(), material))
  const other = source.clone(true)
  const instance = source.clone(true)
  const dispose = ownWireframeMaterials(instance)
  const clone = instance.children[0].material[0]
  assert.notEqual(clone, material)
  assert.equal(clone.wireframe, true)
  assert.equal(instance.children[0].material[1], clone)
  assert.equal(instance.children[1].material, clone)
  assert.equal(material.wireframe, false)
  let disposed = 0
  clone.addEventListener('dispose', () => disposed++)
  material.addEventListener('dispose', () => assert.fail('source disposed'))
  texture.addEventListener('dispose', () => assert.fail('texture disposed'))
  dispose()
  dispose()
  assert.equal(disposed, 1)
  assert.equal(other.children[1].material, material)
  assert.equal(material.wireframe, false)
})

test('effect replay restores sources and acquires a fresh disposable material set', () => {
  const original = new MeshStandardMaterial()
  const instance = new Mesh(new BoxGeometry(), original)
  const firstCleanup = ownWireframeMaterials(instance)
  const first = instance.material
  firstCleanup()
  assert.equal(instance.material, original)
  const finalCleanup = ownWireframeMaterials(instance)
  const second = instance.material
  assert.notEqual(second, first)
  let disposed = 0
  second.addEventListener('dispose', () => disposed++)
  finalCleanup()
  assert.equal(disposed, 1)
  assert.equal(instance.material, original)
})
