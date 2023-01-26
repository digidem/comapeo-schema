// @ts-check
// This script is use to generate various files to be used at runtime:
// * dist/schemas.js - all the validating functions for jsonSchema
// * types/schema/index.d.ts - Union type for all the JsonSchemas
// * types/schema/index.d.ts - Union type for all the ProtobufSchemas
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

// generate types/schema/index.d.ts
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

interface base {
type: string;
schemaVersion: number;
[key:string]: any;
}
export type MapeoRecord = (${schemas
  .map(
    /** @param {Object} schema */
    (schema) => {
      const version = schema.properties.schemaVersion.enum
      return `${schema.title.toLowerCase()}_${version ? version : 0}`
    }
  )
  .join(' | ')}) & base
`
fs.writeFileSync(
  path.join(__dirname, '../types/schema/index.d.ts'),
  jsonSchemaType
)

// generate index.js for protobuf schemas and index.d.ts
const protobufFiles = glob.sync('*.js', { cwd: 'types/proto' })
const linesjs = []
const linesdts = []
const union = protobufFiles
  .filter((f) => f !== 'index.js')
  .map((f) => capitalize(path.parse(f).name))
  .join(' | ')

for (const protobufFilename of protobufFiles) {
  // skip index.js
  if (protobufFilename === 'index.js') continue
  const mod = await import(`../types/proto/${protobufFilename}`)
  const exports = Object.keys(mod)
  const linejs = `export { ${exports[0]} } from './${protobufFilename}'`
  const linedts = `import { ${exports[0]} } from './${
    path.parse(protobufFilename).name
  }'`
  linesdts.push(linedts)
  linesjs.push(linejs)
}
fs.writeFileSync(
  path.join(__dirname, '../types/proto/index.js'),
  linesjs.join('\n')
)
fs.writeFileSync(
  path.join(__dirname, '../types/proto/index.d.ts'),
  `${linesdts.join('\n')}
export type ProtobufSchemas = ${union}`
)
