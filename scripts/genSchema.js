import fs from 'node:fs'
import path from 'path'
import { URL } from 'url'
import Ajv from 'ajv'
import standaloneCode from 'ajv/dist/standalone/index.js'
import glob from 'glob-promise'

/**
 * @param {string} path
 * @returns {Object}
 */
const loadJSON = (path) =>
  JSON.parse(fs.readFileSync(new URL(path, import.meta.url)).toString())

const schemas = (await glob('../schema/*.json', { cwd: 'scripts' })).map(
  loadJSON
)
const ajv = new Ajv({
  schemas: [schemas],
  code: { source: true, esm: true },
  formats: { 'date-time': true },
})
ajv.addKeyword('meta:enum')

let mod = standaloneCode(ajv, {
  Observation: 'http://mapeo.world/schemas/obse/4',
  Field: 'http://mapeo.world/schemas/field.json',
  Common: 'http://mapeo.world/schemas/common.json',
  Filter: 'http://mapeo.world/schemas/filter.json',
  Preset: 'http://mapeo.world/schemas/preset.json',
})

const __dirname = new URL('.', import.meta.url).pathname
fs.writeFileSync(path.join(__dirname, '../dist', 'schemas.js'), mod)
