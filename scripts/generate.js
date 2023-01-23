// @ts-check
// This script is use to generate various files to be used at runtime:
// * dist/schemas.js - all the validating functions for jsonSchema
// * dist/schemasPrefix.js - a map from doctype to {schemaVersion, dataTypeId}
// * types/schema/index.d.ts - Union type for all the JsonSchemas
// * types/proto/index.js - Exports all protobufs from one file

import fs from 'node:fs'
import path from 'path'
import { URL } from 'url'
import Ajv from 'ajv'
import standaloneCode from 'ajv/dist/standalone/index.js'
import glob from 'glob-promise'

const __dirname = new URL('.', import.meta.url).pathname

/**
 * @param {String} str
 * @returns {String}
 */
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

/**
 * @param {string} path
 * @returns {Object}
 */
const loadJSON = (path) =>
  JSON.parse(fs.readFileSync(new URL(path, import.meta.url)).toString())

// /**
//  * reducer; grab the jsonSchema, get the $id to grab schemaVersion and dataTypeId
//  * @param {Object} acc - accumulator
//  * @param {Object} schema
//  * @returns {{schemaVersion: String, dataTypeId: String}} obj
//  */
// const parseId = (acc, schema) => {
//   const arr = new URL(schema['$id']).pathname.split('/')
//   const schemaVersion = arr.pop()
//   const dataTypeId = arr.pop()
//   acc[schema.title.toLowerCase()] = { schemaVersion, dataTypeId }
//   return acc
// }

/**
 * reducer; grab the schema, get the schemaVersion and dataTypeId
 * @param {Object} acc - accumulator
 * @param {Object} schema
 * @returns {{schemaVersion: String, dataTypeId: String}} obj
 */
// const getVersionAndDataTypeId = (
//   acc,
//   {
//     title,
//     properties: {
//       dataTypeId: { const: dataTypeId },
//       schemaVersion: { const: schemaVersion },
//     },
//   }
// ) => {
//   acc[title] = {
//     dataTypeId,
//     schemaVersion,
//   }
//   return acc
// }

const schemas = glob
  .sync('../schema/*/*.json', { cwd: 'scripts' })
  .map(loadJSON)

const schemaExports = schemas.reduce((acc, schema) => {
  const schemaVersion = schema.properties.schemaVersion.enum
  const key = `${schema.title.toLowerCase()}_${
    schemaVersion ? schemaVersion : 0
  }`
  acc[key] = schema['$id']
  return acc
}, {})

// compile schemas
const ajv = new Ajv({
  schemas: schemas,
  code: { source: true, esm: true },
  formats: { 'date-time': true },
})
ajv.addKeyword('meta:enum')

// generate code
let schemaValidations = standaloneCode(ajv, schemaExports)

// dump all to file
fs.writeFileSync(
  path.join(__dirname, '../dist', 'schemas.js'),
  schemaValidations
)

// // generate object to store schema prefixes
// const schemasPrefix = `const schemasPrefix = ${JSON.stringify(
//   schemas.reduce(parseId, {})
// )}\n
// export default schemasPrefix`

// const schemasPrefix = `const schemasPrefix = ${JSON.stringify(
//   schemas
//     .filter((schema) => schema.properties.dataTypeId.const)
//     .reduce(getVersionAndDataTypeId, {})
// )}\n
// export default schemasPrefix`

// fs.writeFileSync(
//   path.join(__dirname, '../dist/schemasPrefix.js'),
//   schemasPrefix
// )

// generate index.d.ts
const jsonSchemaType = `
${schemas
  .map(
    /** @param {Object} schema */
    (schema) => {
      const version = schema.properties.schemaVersion.enum
      const varName = `${schema.title.toLowerCase()}_${version ? version : 0}`
      return `import { ${capitalize(
        schema.title
      )} as ${varName} } from './${schema.title.toLowerCase()}/v${
        version || 1
      }'`
    }
  )
  .join('\n')}
export type MapeoRecord = ${schemas
  .map(
    /** @param {Object} schema */
    (schema) => {
      const version = schema.properties.schemaVersion.enum
      return `${schema.title.toLowerCase()}_${version ? version : 0}`
    }
  )
  .join(' | ')}`
fs.writeFileSync(
  path.join(__dirname, '../types/schema/index.d.ts'),
  jsonSchemaType
)

// generate index.js for protobuf schemas
const protobufFiles = glob.sync('*.js', { cwd: 'types/proto' })
const lines = []
for (const protobufFilename of protobufFiles) {
  // skip index.js
  if (protobufFilename === 'index.js') continue
  const mod = await import(`../types/proto/${protobufFilename}`)
  const exports = Object.keys(mod)
  const line = `export { ${exports[0]} } from './${protobufFilename}'`
  lines.push(line)
}
fs.writeFileSync(
  path.join(__dirname, '../types/proto/index.js'),
  lines.join('\n')
)
