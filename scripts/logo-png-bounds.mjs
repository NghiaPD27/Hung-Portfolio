// Read-only PNG bounds inspection. Artwork files are never rewritten.
import { readFileSync, readdirSync } from 'node:fs'
import { inflateSync } from 'node:zlib'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

export function pngBounds(path) {
  const data = readFileSync(path)
  const width = data.readUInt32BE(16), height = data.readUInt32BE(20)
  if (data[24] !== 8 || data[25] !== 6 || data[28] !== 0) throw new Error(`Expected non-interlaced RGBA PNG: ${path}`)
  const chunks = []
  for (let offset = 8; offset < data.length;) {
    const size = data.readUInt32BE(offset)
    if (data.toString('ascii', offset + 4, offset + 8) === 'IDAT') chunks.push(data.subarray(offset + 8, offset + 8 + size))
    offset += size + 12
  }
  const raw = inflateSync(Buffer.concat(chunks)), stride = width * 4
  let previous = new Uint8Array(stride), left = width, top = height, right = -1, bottom = -1
  const paeth = (a, b, c) => {
    const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c)
    return pa <= pb && pa <= pc ? a : pb <= pc ? b : c
  }
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)], row = new Uint8Array(stride)
    for (let i = 0; i < stride; i++) {
      const a = i >= 4 ? row[i - 4] : 0, b = previous[i], c = i >= 4 ? previous[i - 4] : 0
      const predictors = [0, a, b, Math.floor((a + b) / 2), paeth(a, b, c)]
      if (filter > 4) throw new Error('Invalid PNG filter')
      row[i] = raw[y * (stride + 1) + 1 + i] + predictors[filter]
      if (i % 4 === 3 && row[i] > 0) {
        const x = (i - 3) / 4
        left = Math.min(left, x); right = Math.max(right, x)
        top = Math.min(top, y); bottom = Math.max(bottom, y)
      }
    }
    previous = row
  }
  return [width, height, left, top, right - left + 1, bottom - top + 1]
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const directory = process.argv[2]
  for (const file of readdirSync(directory).filter(file => file.endsWith('.png'))) {
    console.log(file, JSON.stringify(pngBounds(join(directory, file))))
  }
}
