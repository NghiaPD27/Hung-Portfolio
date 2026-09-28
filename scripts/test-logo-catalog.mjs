import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { logoCatalog, logoCategories } from '../src/logoCatalog.js'
import { pngBounds } from './logo-png-bounds.mjs'

assert.equal(new Set(logoCatalog.map(logo => logo.id)).size, logoCatalog.length)
const files = readdirSync('public/assets/logo').filter(file => file.endsWith('.png'))
assert.equal(files.length, logoCatalog.length, 'Every supplied PNG must appear in the catalog')
for (const logo of logoCatalog) {
  assert.ok(logoCategories.includes(logo.category))
  const asset = join('public', logo.src)
  assert.deepEqual(pngBounds(asset), [1920, 1080, ...logo.bounds], `Full visible artwork bounds: ${logo.name}`)
  if (process.argv[2]) {
    const hash = path => createHash('sha256').update(readFileSync(path)).digest('hex')
    assert.equal(hash(asset), hash(join(process.argv[2], logo.sourceFile)), `Original artwork preserved: ${logo.name}`)
  }
}
console.log(`PASS: ${logoCatalog.length} unique logos; full artwork bounds verified; ${process.argv[2] ? 'all originals byte-for-byte preserved' : 'all assets present'}.`)
