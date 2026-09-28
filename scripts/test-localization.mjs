import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { parse } from '@babel/parser'
import traversePackage from '@babel/traverse'
import i18next from 'i18next'
import { messages, resources } from '../src/locales/messages.js'
import { englishAssets, localizedAsset } from '../src/locales/assets.js'

const traverse = traversePackage.default || traversePackage
const vietnamese = /[\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F\u1EA0-\u1EF9]/u
const placeholders = (text) => [...text.matchAll(/\{\{([^}]+)\}\}/g)].map(m => m[1]).sort()
const components = ['App', 'AboutPage', 'ArtClownProject', 'EkoProject', 'MascotExperience', 'PosterProject']

for (const [key, [english]] of Object.entries(messages)) {
  assert(english.trim(), `Empty English translation: ${key}`)
  assert(!vietnamese.test(english), `Vietnamese in English copy: ${key}`)
  assert.deepEqual(placeholders(english), placeholders(key), `Interpolation mismatch: ${key}`)
  assert(resources.vi.translation[key], `Missing Vietnamese translation: ${key}`)
}

for (const component of components) {
  const filename = `src/${component}.jsx`
  const source = readFileSync(filename, 'utf8')
  const ast = parse(source, { sourceType: 'module', plugins: ['jsx'] })
  const translated = (path) => path.findParent(p => p.isCallExpression() && p.node.callee.name === 't')
  traverse(ast, {
    StringLiteral(path) {
      if (vietnamese.test(path.node.value)) {
        assert(Object.hasOwn(messages, path.node.value), `Missing source translation in ${filename}:${path.node.loc.start.line}: ${path.node.value}`)
      }
    },
    JSXText(path) {
      const text = path.node.value.trim()
      assert(!vietnamese.test(text) || text === 'Hùng Trương', `Untranslated visible text in ${filename}:${path.node.loc.start.line}: ${text}`)
    },
    JSXAttribute(path) {
      if (path.node.value?.type === 'StringLiteral') {
        assert(!vietnamese.test(path.node.value.value), `Untranslated attribute in ${filename}:${path.node.loc.start.line}`)
      }
    },
    TemplateLiteral(path) {
      if (path.findParent(p => p.isJSXExpressionContainer()) && !translated(path)) {
        assert(!path.node.quasis.some(q => vietnamese.test(q.value.cooked)), `Untranslated template in ${filename}:${path.node.loc.start.line}`)
      }
    },
    CallExpression(path) {
      if (path.node.callee.name === 't' && path.node.arguments[0]?.type === 'StringLiteral') {
        assert(Object.hasOwn(messages, path.node.arguments[0].value), `Unknown translation key in ${filename}: ${path.node.arguments[0].value}`)
      }
    },
  })
}

for (const [source, english] of Object.entries(englishAssets)) {
  assert(existsSync(`public${source}`), `Missing original asset: ${source}`)
  assert(existsSync(`public${english}`), `Missing English asset: ${english}`)
  assert.equal(localizedAsset(source, 'vi'), source)
  assert.equal(localizedAsset(source, 'en'), english)
}
assert.equal(new Set(Object.values(englishAssets)).size, 4, 'Only four English signs are in scope')
assert.equal(localizedAsset('/assets/eko/logo.svg', 'en'), '/assets/eko/logo.svg')

const i18n = i18next.createInstance()
await i18n.init({ resources, lng: 'en', fallbackLng: 'en', keySeparator: false, nsSeparator: false, interpolation: { escapeValue: false } })
assert.equal(i18n.t('Xem poster {{value0}}', { value0: '02' }), 'View poster 02')
assert.equal(i18n.t('Đi đến màn {{index}}', { index: '{{index}}' }), 'Go to section {{index}}')
assert.equal(i18n.t('HELLO'), 'HELLO')
assert.equal(i18n.t('Menu +'), 'Menu +')
await i18n.changeLanguage('vi')
assert.equal(i18n.t('Xem poster {{value0}}', { value0: '02' }), 'Xem poster 02')
assert.equal(i18n.t('Cảm Xúc Thăng Hoa'), 'Cảm Xúc Thăng Hoa')
console.log(`Localization: ${Object.keys(messages).length} bilingual keys, JSX coverage, interpolation, and four sign variants passed.`)
