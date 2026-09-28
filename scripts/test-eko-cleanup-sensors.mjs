import assert from 'node:assert/strict'
import { PointerActivationConstraints, PointerSensor, KeyboardSensor } from '@dnd-kit/dom'
import { cleanupActivationConstraints, cleanupSensors } from '../src/ekoCleanupSensors.js'

let mobile = true
globalThis.window = { matchMedia: () => ({ matches: mobile }) }
const source = {}
const touch = { pointerType: 'touch', target: null }
const constraints = cleanupActivationConstraints(touch, source)
assert.equal(constraints.length, 1)
assert.ok(constraints[0] instanceof PointerActivationConstraints.Distance)
assert.deepEqual(constraints[0].options, { value: 2 })

for (const pointerType of ['mouse', 'pen']) {
  const event = { pointerType, target: null }
  const actual = cleanupActivationConstraints(event, source)
  const expected = PointerSensor.defaults.activationConstraints(event, source)
  assert.deepEqual(actual.map((entry) => entry.options), expected.map((entry) => entry.options))
  assert.deepEqual(actual.map((entry) => entry.constructor), expected.map((entry) => entry.constructor))
}

mobile = false
const desktopTouch = cleanupActivationConstraints(touch, source)
assert.ok(desktopTouch[0] instanceof PointerActivationConstraints.Delay)
assert.deepEqual(desktopTouch[0].options, { value: 250, tolerance: 5 })
assert.equal(cleanupSensors[1], KeyboardSensor)
delete globalThis.window
console.log('EKO: mobile touch starts at 2px; desktop and keyboard defaults preserved.')
