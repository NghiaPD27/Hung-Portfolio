// Tune glTF PBR values Blender's exporter drops from the supplied materials.
// Keeps the compressed mesh and image data untouched.
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const root = join(process.cwd(), 'public/assets/3d/models')

function tune(name, update) {
  const path = join(root, `${name}.glb`)
  const file = readFileSync(path)
  if (file.toString('ascii', 0, 4) !== 'glTF') throw new Error(`Invalid GLB: ${path}`)
  const jsonLength = file.readUInt32LE(12)
  const data = JSON.parse(file.toString('utf8', 20, 20 + jsonLength))
  update(data)
  const binStart = 20 + jsonLength
  const binChunk = file.subarray(binStart)
  const jsonBytes = Buffer.from(JSON.stringify(data))
  const padding = (4 - jsonBytes.length % 4) % 4
  const paddedJson = Buffer.concat([jsonBytes, Buffer.alloc(padding, 0x20)])
  const header = Buffer.alloc(20)
  header.write('glTF', 0, 'ascii')
  header.writeUInt32LE(2, 4)
  header.writeUInt32LE(20 + paddedJson.length + binChunk.length, 8)
  header.writeUInt32LE(paddedJson.length, 12)
  header.write('JSON', 16, 'ascii')
  writeFileSync(path, Buffer.concat([header, paddedJson, binChunk]))
  console.log(`Tuned ${name}: ${file.length} -> ${20 + paddedJson.length + binChunk.length} bytes`)
}

tune('can', data => {
  for (const material of data.materials || []) {
    if (/Satin aluminum|Polished aluminum/.test(material.name)) {
      material.pbrMetallicRoughness ??= {}
      material.pbrMetallicRoughness.metallicFactor = 0.88
    }
  }
})

tune('bottle', data => {
  for (const material of data.materials || []) {
    if (material.name === 'Material') material.pbrMetallicRoughness.roughnessFactor = 0.085
    if (material.name === 'Material.003') {
      material.pbrMetallicRoughness.roughnessFactor = 0.025
      material.emissiveFactor = [0, 0, 0]
    }
  }
})

tune('house', data => {
  data.extensionsUsed ??= []
  for (const extension of ['KHR_materials_transmission', 'KHR_materials_ior']) {
    if (!data.extensionsUsed.includes(extension)) data.extensionsUsed.push(extension)
  }
  for (const material of data.materials || []) {
    if (!/^(Realistic_Glass_01|Architectural Glass|Glass)$/.test(material.name)) continue
    material.pbrMetallicRoughness = {
      ...material.pbrMetallicRoughness,
      baseColorFactor: [0.86, 0.95, 1, 1],
      metallicFactor: 0,
      roughnessFactor: 0.035,
    }
    material.extensions = {
      ...material.extensions,
      KHR_materials_transmission: { transmissionFactor: 0.82 },
      KHR_materials_ior: { ior: 1.45 },
    }
    material.doubleSided = true
  }
})
