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
import { formatSchemaKey, formatSchemaType } from '../utils.js'

const __dirname = new URL('.', import.meta.url).pathname

/**
 * @param {string} p
 * @returns {{type: String, schemaVersion: string, schema:Object}}
 */
const loadJSON = (p) => {
  const parsedPath = path.parse(p)
  return {
    type: formatSchemaType(parsedPath.dir.replace('../schema/', '')),
    schemaVersion: parsedPath.name.replace('v', ''),
    schema: JSON.parse(fs.readFileSync(new URL(p, import.meta.url)).toString()),
  }
}

const schemas = glob
  .sync('../schema/*/*.json', { cwd: 'scripts' })
  .map(loadJSON)

const schemaExports = schemas.reduce((acc, { schema, schemaVersion, type }) => {
  const key = formatSchemaKey(type, parseInt(schemaVersion))
  acc[key] = schema['$id']
  return acc
}, {})

// compile schemas
const ajv = new Ajv({
  schemas: schemas.map(({ schema }) => schema),
  code: { source: true, esm: true },
  formats: { 'date-time': true },
})
ajv.addKeyword('meta:enum')

// generate code
let schemaValidations = standaloneCode(ajv, schemaExports)

const dist = path.join(__dirname, '../dist')
if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist)
}
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
    ({ schemaVersion, type }) => {
      const varName = `${type.toLowerCase()}_${schemaVersion}`
      return `import { ${formatSchemaType(
        type
      )} as ${varName} } from './${type.toLowerCase()}/v${schemaVersion}'`
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
    ({ schemaVersion, type }) => {
      return `${type.toLowerCase()}_${schemaVersion}`
    }
  )
  .join(' | ')}) & base
`
fs.writeFileSync(
  path.join(__dirname, '../types/schema/index.d.ts'),
  jsonSchemaType
)

// generate index.js for protobuf schemas and index.d.ts
const protobufFiles = glob.sync('../types/proto/*/*.ts', { cwd: 'scripts' })
const obj = protobufFiles
  .filter((f) => !f.match(/.d/))
  .map((p) => {
    const arr = p.split('/')
    return {
      type: arr[arr.length - 2],
      version: arr[arr.length - 1].split('.')[0],
    }
  })

const linesjs = []
const linesdts = []
const union = obj
  .map((t) => `${formatSchemaType(t.type)}_${t.version.replace('v', '')}`)
  .join(' & ')

obj.forEach((f) => {
  const linejs = `export { ${formatSchemaType(f.type)}_${f.version.replace(
    'v',
    ''
  )} } from './${f.type}/${f.version}.js'`

  const linedts = `import { ${formatSchemaType(f.type)}_${f.version.replace(
    'v',
    ''
  )} } from './${f.type}/${f.version}'`
  linesdts.push(linedts)
  linesjs.push(linejs)
})

fs.writeFileSync(
  path.join(__dirname, '../types/proto/index.js'),
  linesjs.join('\n')
)
fs.writeFileSync(
  path.join(__dirname, '../types/proto/index.d.ts'),
  `${linesdts.join('\n')}
export type ProtobufSchemas = ${union}`
)
