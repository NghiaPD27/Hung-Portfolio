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
  data.extensionsUsed ??= []
  for (const extension of ['KHR_materials_transmission', 'KHR_materials_ior', 'KHR_materials_volume']) {
    if (!data.extensionsUsed.includes(extension)) data.extensionsUsed.push(extension)
  }
  for (const material of data.materials || []) {
    if (!['Material', 'Material.003'].includes(material.name)) continue
    const isBottle = material.name === 'Material'
    // Web glTF glass must remain OPAQUE at the alpha layer; physical transmission
    // and volume tint reproduce the source Blender shader's thick glass surface.
    material.alphaMode = 'OPAQUE'
    material.doubleSided = false
    material.pbrMetallicRoughness ??= {}
    material.pbrMetallicRoughness.baseColorFactor = isBottle
      ? [0.24, 0.55, 0.19, 1]
      : [0.86, 0.90, 0.94, 1]
    material.pbrMetallicRoughness.roughnessFactor = isBottle ? 0.13 : 0.025
    material.pbrMetallicRoughness.metallicFactor = 0
    material.emissiveFactor = [0, 0, 0]
    material.extensions = {
      ...material.extensions,
      KHR_materials_transmission: { transmissionFactor: isBottle ? 0.72 : 0.96 },
      KHR_materials_ior: { ior: isBottle ? 1.4 : 1.5 },
      KHR_materials_volume: isBottle
        ? { thicknessFactor: 1.2, attenuationDistance: 10, attenuationColor: [0.22, 0.56, 0.16] }
        : { thicknessFactor: 0.45, attenuationDistance: 20, attenuationColor: [0.94, 0.97, 1] },
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
