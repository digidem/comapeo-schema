// @ts-check
// This script is use to generate various files to be used at runtime:
// * dist/schemas.js - all the validating functions for jsonSchema
// * types/schema/index.d.ts - Union type for all the JsonSchemas
// * types/proto/index.d.ts - Union type for all the ProtobufSchemas
// * types/proto/index.js - Exports all protobufs from one file
// * types/index.d.ts - re-exports JSONSchema and ProtobufSchema types for better importing

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
 * @returns {{type: String, schemaVersion: Number, schema:Object}}
 */
const loadSchema = (p) => {
  const { dir, name } = path.parse(p)
  return {
    // we get the type of the schema from the directory
    type: dir.replace('../schema/', ''),
    // we get the version from the filename
    schemaVersion: parseInt(name.replace('v', '')),
    schema: JSON.parse(fs.readFileSync(new URL(p, import.meta.url)).toString()),
  }
}

const schemas = glob
  .sync('../schema/*/*.json', { cwd: 'scripts' })
  .map(loadSchema)

const schemaExports = schemas.reduce((acc, { schema, schemaVersion, type }) => {
  const key = formatSchemaKey(type, schemaVersion)
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

// generate validation code
let schemaValidations = standaloneCode(ajv, schemaExports)

const dist = path.join(__dirname, '../dist')
if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist)
}

// dist/schemas.js
fs.writeFileSync(
  path.join(__dirname, '../dist', 'schemas.js'),
  schemaValidations
)

const latestSchemaVersions = schemas.reduce((acc, { schemaVersion, type }) => {
  if (!acc[type]) {
    acc[type] = schemaVersion
  } else {
    if (acc[type] < schemaVersion) {
      acc[type] = schemaVersion
    }
  }
  return acc
}, {})

// types/schema/index.d.ts
const jsonSchemaType = `
${schemas
  .map(
    /** @param {Object} schema */
    ({ schemaVersion, type }) => {
      const varName = `${formatSchemaType(type)}_${schemaVersion}`
      return `import { ${formatSchemaType(
        type
      )} as ${varName} } from './${type}/v${schemaVersion}'`
    }
  )
  .join('\n')}

interface base {
type?: string;
schemaVersion?: number;
}
export type JSONSchema = (${schemas
  .map(
    /** @param {Object} schema */
    ({ schemaVersion, type }) => `${formatSchemaType(type)}_${schemaVersion}`
  )
  .join(' | ')}) & base
${schemas
  .filter(
    ({ schemaVersion, type }) => latestSchemaVersions[type] === schemaVersion
  )
  .map(
    ({ type }) =>
      `export { ${formatSchemaType(type)} } from './${type}/v${
        latestSchemaVersions[type]
      }'`
  )
  .join('\n')}`
fs.writeFileSync(
  path.join(__dirname, '../types/schema/index.d.ts'),
  jsonSchemaType
)

// types/proto/index.d.ts and types/proto/index.js
const protobufFiles = glob.sync('../types/proto/*/*.ts', { cwd: 'scripts' })
const obj = protobufFiles
  .filter((f) => !f.match(/.d.ts/))
  .map((p) => {
    const { name, dir } = path.parse(p)
    return {
      type: dir.replace('../types/proto/', ''),
      schemaVersion: name,
    }
  })

const linesjs = []
const linesdts = []
const union = obj
  .map(
    ({ type, schemaVersion }) =>
      `${formatSchemaType(type)}_${schemaVersion.replace('v', '')}`
  )
  .join(' | ')

const latestVersionsExport = schemas
  .filter(
    ({ schemaVersion, type }) => latestSchemaVersions[type] === schemaVersion
  )
  .map(
    ({ type, schemaVersion }) =>
      `export { ${formatSchemaType(
        type
      )}_${schemaVersion} as ${formatSchemaType(type)} } from './${type}/v${
        latestSchemaVersions[type]
      }'`
  )
  .join('\n')

obj.forEach(({ type, schemaVersion }) => {
  const linejs = `export { ${formatSchemaType(type)}_${schemaVersion.replace(
    'v',
    ''
  )} } from './${type}/${schemaVersion}.js'`

  const linedts = `import { ${formatSchemaType(type)}_${schemaVersion.replace(
    'v',
    ''
  )} } from './${type}/${schemaVersion}'`
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
export type ProtobufSchema = ${union}
${latestVersionsExport}`
)

// types/index.d.ts
fs.writeFileSync(
  path.join(__dirname, '../types/index.d.ts'),
  `export { ProtobufSchema } from './proto'
export { JSONSchema } from './schema'`
)
