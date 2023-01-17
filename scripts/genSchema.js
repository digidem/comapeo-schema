// @ts-check
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

/**
 * reducer; grab the jsonSchema, get the $id to grab schemaVersion and dataTypeId
 * @param {Object} acc - accumulator
 * @param {Object} schema
 * @returns {Object} obj
 * @returns {String} obj.schemaVersion
 * @returns {String} obj.dataTypeId
 */
const parseId = (acc, schema) => {
  const arr = new URL(schema['$id']).pathname.split('/')
  const schemaVersion = arr.pop()
  const dataTypeId = arr.pop()
  acc[schema.title] = { schemaVersion, dataTypeId }
  return acc
}

const schemas = glob.sync('../schema/*.json', { cwd: 'scripts' }).map(loadJSON)

// compile schemas
const ajv = new Ajv({
  schemas: schemas,
  code: { source: true, esm: true },
  formats: { 'date-time': true },
})
ajv.addKeyword('meta:enum')

// generate code
let schemaValidations = standaloneCode(
  ajv,
  schemas.reduce((obj, schema) => {
    obj[schema['title']] = schema['$id']
    return obj
  }, {})
)

// generate object to store schema prefixes
const schemasPrefix = `export const schemasPrefix = ${JSON.stringify(
  schemas.reduce(parseId, {})
)}`

// dump all to file
const __dirname = new URL('.', import.meta.url).pathname
fs.writeFileSync(
  path.join(__dirname, '../dist', 'schemas.js'),
  schemaValidations + schemasPrefix
)

// generate index.js for protobuf schemas
const protobufFiles = glob.sync('*.js', { cwd: 'types/proto' })
const lines = []
for (const protobufFilename of protobufFiles) {
  // skip index.js
  if (protobufFilename === 'index.js') continue
  const mod = await import(`../types/proto/${protobufFilename}`)
  const exports = Object.keys(mod)
  const line = `export { ${exports.join(', ')} } from './${protobufFilename}'`
  lines.push(line)
}
fs.writeFileSync(
  path.join(__dirname, '../types/proto/index.js'),
  lines.join('\n')
)
