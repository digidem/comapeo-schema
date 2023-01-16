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
 * @param {Object} schemas
 * @param {Object} schemas.jsonSchema
 * @returns {Object} obj
 * @returns {String} obj.schemaVersion
 * @returns {String} obj.dataTypeId
 */
const parseId = (acc, { jsonSchema }) => {
  const arr = new URL(jsonSchema['$id']).pathname.split('/')
  const schemaVersion = arr.pop()
  const dataTypeId = arr.pop()
  acc[jsonSchema.title] = { schemaVersion, dataTypeId }
  return acc
}
/**
 * load protobuf and jsonSchemas into object
 * @returns {Object} schemas
 * @returns {Object} schemas.jsonSchemas
 * @returns {Object} schemas.protobufSchemas
 */
const loadSchemas = async () => {
  return await Promise.all(
    (
      await glob('../schema/*.json', { cwd: 'scripts' })
    ).map(async (path) => {
      let protobufSchema = null
      const jsonSchema = loadJSON(path)
      const type = jsonSchema.title
      try {
        protobufSchema = (
          await import(`../types/proto/${type.toLowerCase()}.js`)
        )[type]
      } catch (e) {
        console.log('ERROR', 'protobuf schema not found', type)
      }
      return { jsonSchema, protobufSchema }
    })
  )
}

const schemas = await loadSchemas()
// compile schemas
const ajv = new Ajv({
  schemas: schemas.map(({ jsonSchema }) => jsonSchema),
  code: { source: true, esm: true },
  formats: { 'date-time': true },
})
ajv.addKeyword('meta:enum')

// generate code
let schemaValidations = standaloneCode(
  ajv,
  schemas.reduce((obj, { jsonSchema }) => {
    obj[jsonSchema['title']] = jsonSchema['$id']
    return obj
  }, {})
)

// serialize protobuf schemas to file?
console.log(
  schemas
    .filter(({ protobufSchema }) => protobufSchema !== null)
    .map(({ protobufSchema }) => protobufSchema.encode.toString())
)

// generate object to store schema prefixes
const schemasPrefix = `export const schemasPrefix = ${JSON.stringify(
  schemas.reduce(parseId, {})
)}`

const __dirname = new URL('.', import.meta.url).pathname
fs.writeFileSync(
  path.join(__dirname, '../dist', 'schemas.js'),
  schemaValidations + schemasPrefix
)
